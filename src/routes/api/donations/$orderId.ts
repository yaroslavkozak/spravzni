import { createFileRoute } from '@tanstack/react-router'
import type { Env } from '@/types/cloudflare'
import { getDonationByOrderId } from '@/src/lib/database/donations'

export const Route = createFileRoute('/api/donations/$orderId')({
  server: {
    handlers: {
      GET: async ({ context, params }) => {
        try {
          const orderId = params.orderId
          
          if (!orderId) {
            return new Response(
              JSON.stringify({ success: false, error: 'Order ID is required' }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }
          
          const env = context.env as Env
          const donation = await getDonationByOrderId(env.DB, orderId)
          
          if (!donation) {
            return new Response(
              JSON.stringify({ success: false, error: 'Donation not found' }),
              {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          }
          
          // Parse JSON fields if they exist
          const responseDonation = {
            ...donation,
            gateway_data: donation.gateway_data ? JSON.parse(donation.gateway_data) : null,
            metadata: donation.metadata ? JSON.parse(donation.metadata) : null,
          }
          
          return new Response(
            JSON.stringify({
              success: true,
              donation: responseDonation,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        } catch (error) {
          console.error('Error fetching donation:', error)
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Failed to fetch donation',
              details: error instanceof Error ? error.message : 'Unknown error',
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
