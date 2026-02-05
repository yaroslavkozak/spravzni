import { createFileRoute } from '@tanstack/react-router'
import ServiceForm from './_service-form'

export const Route = createFileRoute('/admin/services/new')({
  component: NewService,
})

function NewService() {
  return <ServiceForm serviceId={null} />
}
