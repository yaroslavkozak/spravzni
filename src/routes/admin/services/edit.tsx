import { createFileRoute, useNavigate } from '@tanstack/react-router'

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
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center max-w-xl">
        <p className="text-gray-700 mb-4">
          Редагування текстів послуг перенесено до розділу Переклади.
        </p>
        <button
          onClick={() => navigate({ to: '/admin/translations' })}
          className="px-4 py-2 text-sm font-medium text-white bg-[#28694D] rounded-lg hover:bg-[#1f5a3f]"
        >
          Відкрити Переклади
        </button>
      </div>
    </div>
  )
}
