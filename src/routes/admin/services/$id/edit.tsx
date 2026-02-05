import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/admin/services/$id/edit')({
  component: EditService,
})

function EditService() {
  const navigate = useNavigate()
  const params = useParams({ from: '/admin/services/$id/edit' })
  const serviceId = params.id

  useEffect(() => {
    navigate({
      to: '/admin/services/edit',
      search: { serviceId } as any,
      replace: true,
    })
  }, [navigate, serviceId])

  return null
}
