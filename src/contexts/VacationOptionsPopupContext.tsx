'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface VacationOptionsPopupContextType {
  isOpen: boolean
  selectedServiceId: number | null
  openPopup: (serviceId?: number) => void
  closePopup: () => void
}

const VacationOptionsPopupContext = createContext<VacationOptionsPopupContextType | undefined>(undefined)

export function VacationOptionsPopupProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)

  const openPopup = (serviceId?: number) => {
    setSelectedServiceId(serviceId ?? null)
    setIsOpen(true)
  }
  const closePopup = () => {
    setIsOpen(false)
    setSelectedServiceId(null)
  }

  return (
    <VacationOptionsPopupContext.Provider
      value={{ isOpen, selectedServiceId, openPopup, closePopup }}
    >
      {children}
    </VacationOptionsPopupContext.Provider>
  )
}

export function useVacationOptionsPopup() {
  const context = useContext(VacationOptionsPopupContext)
  if (context === undefined) {
    throw new Error('useVacationOptionsPopup must be used within a VacationOptionsPopupProvider')
  }
  return context
}



