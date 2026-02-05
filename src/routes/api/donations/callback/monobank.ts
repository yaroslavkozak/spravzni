import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { getDonationByOrderId, getDonationByGatewayInvoiceId, updateDonationStatus } from '@/src/lib/database/donations'

interface MonobankWebhook {
  invoiceId: string
  status: 'success' | 'failure' | 'processing' | 'expired'
  amount: number
  ccy: number
  createdDate: number
  modifiedDate: number
  reference?: string
  maskedPan?: string
  approvalCode?: string
  [key: string]: any // Allow other fields
}

export const Route = createFileRoute('/api/donations/callback/monobank')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        try {
          const webhook = await request.json() as MonobankWebhook
          
          // Extract order ID from reference or invoice ID
          // Monobank sends reference field which should contain our order_id
          const orderId = webhook.reference || webhook.invoiceId
          
          if (!orderId) {
            console.error('Monobank webhook missing order reference')
            return new Response('Missing order reference', { status: 400 })
          }
          
          if (!webhook.invoiceId) {
            console.error('Monobank webhook missing invoiceId')
            return new Response('Missing invoiceId', { status: 400 })
          }
          
          const env = context.env as Env
          
          // Get donation from database
          // Try by order_id first, then by invoice_id
          let donation = await getDonationByOrderId(env.DB, orderId)
          
          if (!donation) {
            // If not found by order_id, try by invoice_id
            donation = await getDonationByGatewayInvoiceId(env.DB, 'monobank', webhook.invoiceId)
          }
          
          if (!donation) {
            console.error(`Donation not found for orderId: ${orderId}, invoiceId: ${webhook.invoiceId}`)
            // Return 200 to prevent Monobank from retrying if donation doesn't exist
            // This could happen if webhook arrives before database update or order_id mismatch
            return new Response('OK', { status: 200 })
          }
          
          // Map Monobank status to our status
          const statusMap: Record<string, 'success' | 'failure' | 'processing' | 'expired'> = {
            success: 'success',
            failure: 'failure',
            processing: 'processing',
            expired: 'expired',
          }
          
          const newStatus = statusMap[webhook.status] || 'failure'
          
          // Update donation status
          await updateDonationStatus(
            env.DB,
            donation.order_id,
            newStatus,
            webhook,
            webhook.invoiceId
          )
          
          return new Response('OK', { status: 200 })
        } catch (error) {
          console.error('Error processing Monobank webhook:', error)
          // Return 200 to prevent Monobank from retrying
          // Log error for investigation
          return new Response('OK', { status: 200 })
        }
      },
    },
  },
})
