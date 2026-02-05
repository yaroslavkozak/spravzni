import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { getDonationByOrderId, getDonationByGatewayInvoiceId, updateDonationStatus } from '@/src/lib/database/donations'
import { verifyWayForPayCallback, type WayForPayCallback } from '@/src/lib/payments/wayforpay'

export const Route = createFileRoute('/api/donations/callback/wayforpay')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        try {
          // WayForPay sends callback as JSON
          const callback = await request.json() as WayForPayCallback & { merchantSignature?: string }
          
          const env = context.env as Env
          
          if (!env.WAYFORPAY_SECRET_KEY) {
            console.error('WayForPay secret key not configured')
            return new Response('Server configuration error', { status: 500 })
          }
          
          // Verify signature
          const isValid = verifyWayForPayCallback(callback, env.WAYFORPAY_SECRET_KEY)
          if (!isValid) {
            console.error('Invalid WayForPay callback signature', { orderReference: callback.orderReference })
            return new Response('Invalid signature', { status: 400 })
          }
          
          const orderId = callback.orderReference
          
          if (!orderId) {
            console.error('WayForPay callback missing orderReference')
            return new Response('Missing orderReference', { status: 400 })
          }
          
          // Get donation from database
          let donation = await getDonationByOrderId(env.DB, orderId)
          
          if (!donation) {
            // Try by gateway invoice ID if available
            const invoiceId = (callback as any).invoiceId || callback.orderReference
            donation = await getDonationByGatewayInvoiceId(env.DB, 'wayforpay', invoiceId)
          }
          
          if (!donation) {
            console.error(`Donation not found for orderId: ${orderId}`)
            // Return 200 to prevent WayForPay from retrying if donation doesn't exist
            return new Response('OK', { status: 200 })
          }
          
          // Map WayForPay status to our status
          // WayForPay statuses: Approved, Declined, InProcessing, Refunded, RefundInProcessing, Expired
          const statusMap: Record<string, 'success' | 'failure' | 'processing' | 'expired'> = {
            Approved: 'success',
            Declined: 'failure',
            InProcessing: 'processing',
            Refunded: 'failure',
            RefundInProcessing: 'processing',
            Expired: 'expired',
          }
          
          const newStatus = statusMap[callback.transactionStatus] || 'failure'
          
          // Update donation status
          await updateDonationStatus(
            env.DB,
            donation.order_id,
            newStatus,
            callback,
            callback.orderReference
          )
          
          // Always return 200 OK to WayForPay
          return new Response('OK', { status: 200 })
        } catch (error) {
          console.error('Error processing WayForPay callback:', error)
          // Return 200 to prevent WayForPay from retrying
          return new Response('OK', { status: 200 })
        }
      },
    },
  },
})
