'use client'

import { useVacationOptionsPopup } from '@/src/contexts/VacationOptionsPopupContext'
import VacationOptionsPopup from './VacationOptionsPopup'

export default function VacationOptionsPopupWrapper() {
  const { isOpen, closePopup, selectedServiceId } = useVacationOptionsPopup()

  return (
    <VacationOptionsPopup
      isOpen={isOpen}
      onClose={closePopup}
      serviceId={selectedServiceId}
    />
  )
}



