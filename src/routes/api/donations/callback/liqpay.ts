import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { verifyLiqPayCallback, decodeLiqPayData } from '@/src/lib/payments/liqpay'
import { getDonationByOrderId, updateDonationStatus } from '@/src/lib/database/donations'

export const Route = createFileRoute('/api/donations/callback/liqpay')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        try {
          // LiqPay sends callback as form data (application/x-www-form-urlencoded)
          // Try form data first, fallback to JSON if needed
          let data: string, signature: string
          
          const contentType = request.headers.get('content-type') || ''
          if (contentType.includes('application/x-www-form-urlencoded')) {
            const formData = await request.formData()
            data = formData.get('data') as string
            signature = formData.get('signature') as string
          } else {
            // Fallback to JSON (though LiqPay typically uses form data)
            const body = await request.json()
            data = body.data
            signature = body.signature
          }
          
          if (!data || !signature) {
            console.error('LiqPay callback missing data or signature')
            return new Response('Missing data or signature', { status: 400 })
          }
          
          const env = context.env as Env
          
          if (!env.LIQPAY_PRIVATE_KEY) {
            console.error('LiqPay private key not configured')
            return new Response('Server configuration error', { status: 500 })
          }
          
          // Verify signature
          const isValid = await verifyLiqPayCallback(data, signature, env.LIQPAY_PRIVATE_KEY)
          if (!isValid) {
            console.error('Invalid LiqPay callback signature', { data: data.substring(0, 50) })
            return new Response('Invalid signature', { status: 400 })
          }
          
          // Decode payment data
          const paymentData = decodeLiqPayData(data)
          const orderId = paymentData.order_id
          const status = paymentData.status
          
          if (!orderId) {
            console.error('LiqPay callback missing order_id')
            return new Response('Missing order_id', { status: 400 })
          }
          
          // Get donation from database
          const donation = await getDonationByOrderId(env.DB, orderId)
          
          if (!donation) {
            console.error(`Donation not found: ${orderId}`)
            return new Response('Donation not found', { status: 404 })
          }
          
          // Map LiqPay status to our status
          // LiqPay statuses: success, failure, sandbox, wait_accept, processing, error
          const statusMap: Record<string, 'success' | 'failure' | 'processing' | 'expired'> = {
            success: 'success',
            failure: 'failure',
            sandbox: 'success', // Test mode success
            wait_accept: 'processing',
            processing: 'processing',
            error: 'failure',
          }
          
          const newStatus = statusMap[status] || 'failure'
          
          // Update donation status
          await updateDonationStatus(env.DB, orderId, newStatus, paymentData, paymentData.transaction_id || paymentData.liqpay_order_id)
          
          // Always return 200 OK to LiqPay even if there's an issue (to avoid retries)
          return new Response('OK', { status: 200 })
        } catch (error) {
          console.error('Error processing LiqPay callback:', error)
          // Return 200 to prevent LiqPay from retrying
          // Log error for investigation
          return new Response('OK', { status: 200 })
        }
      },
    },
  },
})
