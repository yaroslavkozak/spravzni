import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { createDonation } from '@/src/lib/database/donations'
import { generateLiqPaySignature } from '@/src/lib/payments/liqpay'
import { createMonobankInvoice, createMonobankSubscription, convertToKopecks, getCurrencyCode } from '@/src/lib/payments/monobank'
import { createWayForPayInvoice } from '@/src/lib/payments/wayforpay'

interface DonationRequest {
  gateway: 'liqpay' | 'monobank' | 'wayforpay'
  amount: number
  currency?: 'UAH' | 'USD' | 'EUR'
  description?: string
  donor_name?: string
  donor_email?: string
  donor_phone?: string
  return_url?: string
  is_recurring?: boolean  // Flag for recurring payments
  recurring_interval?: string  // Payment frequency: "1d", "2w", "1m", "1y"
  recurring_count?: number  // Number of payments (optional)
}

export const Route = createFileRoute('/api/donations/create')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        try {
          const body = await request.json() as DonationRequest
          
          // Validate request
          if (!body.gateway || !['liqpay', 'monobank', 'wayforpay'].includes(body.gateway)) {
            return new Response(
              JSON.stringify({ success: false, error: 'Invalid gateway. Must be "liqpay", "monobank", or "wayforpay"' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
          }
          
          if (!body.amount || body.amount <= 0) {
            return new Response(
              JSON.stringify({ success: false, error: 'Invalid amount. Must be greater than 0' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
          }
          
          const env = context.env as Env
          // Always use production URL for donations, even in localhost
          const productionUrl = 'https://spravzhni.com.ua'
          const currency = body.currency || 'UAH'
          const orderId = `donation-${Date.now()}-${crypto.randomUUID()}`
          
          let paymentUrl: string
          let gatewayInvoiceId: string | null = null
          
          // Create donation record in database
          const db = env.DB
          
          // Convert amount for database storage (always in kopecks for consistency)
          // Note: WayForPay CREATE_INVOICE API uses main currency unit, but we store in kopecks
          const amountInSmallestUnit = convertToKopecks(body.amount, currency)
          
          const donation = await createDonation(db, {
            order_id: orderId,
            gateway: body.gateway,
            amount: amountInSmallestUnit,
            currency,
            description: body.description || 'Донат на підтримку проекту',
            donor_name: body.donor_name || null,
            donor_email: body.donor_email || null,
            donor_phone: body.donor_phone || null,
            status: 'pending',
          })
          
          if (body.gateway === 'liqpay') {
            // LiqPay flow
            if (!env.LIQPAY_PUBLIC_KEY || !env.LIQPAY_PRIVATE_KEY) {
              return new Response(
                JSON.stringify({ success: false, error: 'LiqPay is not configured' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
              )
            }
            
            const liqPayData = {
              version: '3',
              public_key: env.LIQPAY_PUBLIC_KEY,
              action: 'pay',
              amount: body.amount,
              currency,
              description: body.description || 'Донат на підтримку проекту',
              order_id: orderId,
              result_url: body.return_url || `${productionUrl}/donation/success?orderId=${orderId}`,
              server_url: `${productionUrl}/api/donations/callback/liqpay`,
              language: 'uk' as const,
            }
            
            const { data, signature } = await generateLiqPaySignature(liqPayData, env.LIQPAY_PRIVATE_KEY)
            paymentUrl = `https://www.liqpay.ua/api/3/checkout?data=${encodeURIComponent(data)}&signature=${encodeURIComponent(signature)}`
            
          } else if (body.gateway === 'monobank') {
            // Monobank flow
            if (!env.MONOBANK_API_TOKEN) {
              return new Response(
                JSON.stringify({ success: false, error: 'Monobank is not configured' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
              )
            }
            
            // Check if this is a recurring payment
            if (body.is_recurring) {
              // Use Monobank Subscription API for recurring payments
              // Documentation: https://monobank.ua/api-docs/acquiring/methods/subscription/post--api--merchant--subscription--create
              // Validate recurring interval is provided
              if (!body.recurring_interval) {
                return new Response(
                  JSON.stringify({ success: false, error: 'Payment frequency is required for recurring payments' }),
                  { status: 400, headers: { 'Content-Type': 'application/json' } }
                )
              }
              
              // Create subscription request for recurring payments
              // Documentation: https://monobank.ua/api-docs/acquiring/methods/subscription/post--api--merchant--subscription--create
              // Interval format: "1d" (daily), "2w" (every 2 weeks), "1m" (monthly), "1y" (yearly)
              // Note: Subscriptions require h2h (host-to-host) to be enabled in the merchant account
              const subscriptionRequest = {
                amount: convertToKopecks(body.amount, currency),
                ccy: getCurrencyCode(currency),
                redirectUrl: body.return_url || `${productionUrl}/donation/success?orderId=${orderId}`,
                webHookUrl: `${productionUrl}/api/donations/callback/monobank`, // Webhook for subscription notifications
                interval: body.recurring_interval, // Top-level field: "1d", "2w", "1m", "1y"
                validity: 86400, // 24 hours - time to complete the initial subscription setup
              }
              
              console.log('Creating Monobank subscription:', {
                amount: subscriptionRequest.amount,
                interval: subscriptionRequest.interval,
                orderReference: orderId,
              })
              
              const subscriptionResponse = await createMonobankSubscription(subscriptionRequest, env.MONOBANK_API_TOKEN)
              // Monobank subscription API may return 'pageUrl' or 'url'
              const subscriptionPaymentUrl = subscriptionResponse.pageUrl || subscriptionResponse.url
              
              if (!subscriptionPaymentUrl) {
                throw new Error('Monobank subscription API did not return payment URL')
              }
              
              paymentUrl = subscriptionPaymentUrl
              gatewayInvoiceId = subscriptionResponse.subscriptionId || orderId
              
              // Update donation with subscription ID
              await db
                .prepare('UPDATE donations SET gateway_invoice_id = ? WHERE order_id = ?')
                .bind(gatewayInvoiceId, orderId)
                .run()
            } else {
              // Regular one-time payment
              const invoiceRequest = {
                amount: convertToKopecks(body.amount, currency),
                ccy: getCurrencyCode(currency),
                merchantPaymInfo: {
                  reference: orderId,
                  destination: body.description || 'Донат на підтримку проекту',
                },
                redirectUrl: body.return_url || `${productionUrl}/donation/success?orderId=${orderId}`,
                successUrl: `${productionUrl}/donation/success?orderId=${orderId}`,
                failUrl: `${productionUrl}/donation/failed?orderId=${orderId}`,
                webHookUrl: `${productionUrl}/api/donations/callback/monobank`,
                validity: 86400, // 24 hours
              }
              
              const invoiceResponse = await createMonobankInvoice(invoiceRequest, env.MONOBANK_API_TOKEN)
              paymentUrl = invoiceResponse.pageUrl
              gatewayInvoiceId = invoiceResponse.invoiceId
              
              // Update donation with invoice ID
              await db
                .prepare('UPDATE donations SET gateway_invoice_id = ? WHERE order_id = ?')
                .bind(gatewayInvoiceId, orderId)
                .run()
            }
          } else if (body.gateway === 'wayforpay') {
            // WayForPay flow
            if (!env.WAYFORPAY_MERCHANT_ACCOUNT || !env.WAYFORPAY_SECRET_KEY) {
              console.error('WayForPay configuration missing:', {
                hasMerchantAccount: !!env.WAYFORPAY_MERCHANT_ACCOUNT,
                hasSecretKey: !!env.WAYFORPAY_SECRET_KEY,
              })
              return new Response(
                JSON.stringify({ success: false, error: 'WayForPay is not configured' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
              )
            }
            
            // Always use production domain for WayForPay
            const domain = 'spravzhni.com.ua'
            
            // Trim merchant account to remove any whitespace
            const merchantAccount = (env.WAYFORPAY_MERCHANT_ACCOUNT || '').trim()
            
            // Create dynamic product name based on amount if description not provided
            const productName = body.description || `Донат ${body.amount} грн`
            
            // Build CREATE_INVOICE request according to WayForPay CREATE_INVOICE documentation
            // Documentation: https://wiki.wayforpay.com/view/608996852
            // Note: Amount uses main currency unit with decimals - see example: amount: 1547.36
            const amountFormatted = parseFloat(body.amount.toFixed(2))
            
            const invoiceRequest: any = {
              transactionType: 'CREATE_INVOICE',
              apiVersion: 1,
              merchantAccount: merchantAccount,
              merchantDomainName: domain,
              orderReference: orderId,
              orderDate: Math.floor(Date.now() / 1000),
              amount: amountFormatted, // Main currency unit with 2 decimals (e.g., 300.00)
              currency,
              productName: [productName],
              productCount: [1],
              productPrice: [amountFormatted], // Main currency unit with 2 decimals
              serviceUrl: `${productionUrl}/api/donations/callback/wayforpay`,
              returnUrl: body.return_url || `${productionUrl}/donation/success?orderId=${orderId}`,
              language: 'UA',
              merchantAuthType: 'SimpleSignature',
            }
            
            // Only add optional client fields if they have values
            if (body.donor_email) {
              invoiceRequest.clientEmail = body.donor_email
            }
            if (body.donor_phone) {
              invoiceRequest.clientPhone = body.donor_phone
            }
            if (body.donor_name) {
              const nameParts = body.donor_name.split(' ')
              if (nameParts[0]) {
                invoiceRequest.clientFirstName = nameParts[0]
              }
              if (nameParts.slice(1).join(' ')) {
                invoiceRequest.clientLastName = nameParts.slice(1).join(' ')
              }
            }
            
            console.log('Creating WayForPay CREATE_INVOICE:', {
              merchantAccount: invoiceRequest.merchantAccount,
              merchantDomainName: invoiceRequest.merchantDomainName,
              transactionType: invoiceRequest.transactionType,
              orderReference: invoiceRequest.orderReference,
              amount: invoiceRequest.amount,
              domain: invoiceRequest.merchantDomainName,
              hasSecretKey: !!env.WAYFORPAY_SECRET_KEY,
              requestFields: Object.keys(invoiceRequest).sort(),
            })
            
            const invoiceResponse = await createWayForPayInvoice(invoiceRequest, env.WAYFORPAY_SECRET_KEY)
            
            console.log('WayForPay CREATE_INVOICE response:', {
              reasonCode: invoiceResponse.reasonCode,
              reason: invoiceResponse.reason,
              hasInvoiceUrl: !!invoiceResponse.invoiceUrl,
              fullResponse: invoiceResponse,
            })
            
            // Check if reasonCode is "Ok" (string) or 1100 (number) or 0 (number) - documentation shows "Ok" as string
            const isSuccess = invoiceResponse.reasonCode === 'Ok' || 
                            invoiceResponse.reasonCode === 1100 || 
                            invoiceResponse.reasonCode === 0 ||
                            invoiceResponse.reason === 'Ok'
            
            if (!isSuccess || !invoiceResponse.invoiceUrl) {
              const errorDetails = {
                reasonCode: invoiceResponse.reasonCode,
                reason: invoiceResponse.reason,
                hasInvoiceUrl: !!invoiceResponse.invoiceUrl,
                fullResponse: invoiceResponse,
              }
              console.error('WayForPay CREATE_INVOICE creation failed:', errorDetails)
              throw new Error(`WayForPay error: ${invoiceResponse.reason || 'Failed to create invoice'} (code: ${invoiceResponse.reasonCode || 'unknown'})`)
            }
            
            paymentUrl = invoiceResponse.invoiceUrl
            gatewayInvoiceId = invoiceResponse.orderReference || orderId
            
            // Update donation with invoice ID
            await db
              .prepare('UPDATE donations SET gateway_invoice_id = ? WHERE order_id = ?')
              .bind(gatewayInvoiceId, orderId)
              .run()
          } else {
            // This should never happen due to validation above, but TypeScript needs this
            throw new Error(`Unsupported gateway: ${body.gateway}`)
          }
          
          // Ensure paymentUrl is set (TypeScript check)
          if (!paymentUrl) {
            throw new Error('Payment URL was not generated')
          }
          
          return new Response(
            JSON.stringify({
              success: true,
              donation: {
                id: donation.id,
                order_id: orderId,
                gateway: body.gateway,
                amount: body.amount,
                currency,
                status: 'pending',
                payment_url: paymentUrl,
              },
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error creating donation:', error)
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          const errorStack = error instanceof Error ? error.stack : undefined
          
          // Log full error details for debugging
          console.error('Full error details:', {
            message: errorMessage,
            stack: errorStack,
            error: error,
          })
          
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to create donation',
              details: errorMessage,
              // Include stack trace in development/debug mode only
              ...(process.env.NODE_ENV === 'development' && { stack: errorStack }),
            }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }
      },
    },
  },
})
