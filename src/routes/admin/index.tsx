import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  beforeLoad: () => {
    // Redirect to login page
    throw redirect({ to: '/admin/login' })
  },
})
