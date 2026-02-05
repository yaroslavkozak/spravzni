import { createFileRoute, useNavigate } from '@tanstack/react-router'
import ServiceForm from './_service-form'

export const Route = createFileRoute('/admin/services/edit')({
  component: EditService,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      serviceId: typeof search.serviceId === 'string' ? search.serviceId : undefined,
    }
  },
})

function EditService() {
  const navigate = useNavigate()
  const { serviceId } = Route.useSearch()
  const parsedServiceId = serviceId ? parseInt(serviceId, 10) : NaN

  if (!serviceId || Number.isNaN(parsedServiceId)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-gray-700 mb-4">Некоректний ідентифікатор послуги.</p>
          <button
            onClick={() => navigate({ to: '/admin/services' })}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Назад до списку
          </button>
        </div>
      </div>
    )
  }

  return <ServiceForm serviceId={parsedServiceId} />
}
