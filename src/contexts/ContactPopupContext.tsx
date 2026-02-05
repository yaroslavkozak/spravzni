'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import ContactPopup from '@/src/components/ContactPopup'

interface ContactPopupContextType {
  isOpen: boolean
  openPopup: (preselectPriceList?: boolean, preselectedServiceId?: number) => void
  closePopup: () => void
}

const ContactPopupContext = createContext<ContactPopupContextType | undefined>(undefined)

export function ContactPopupProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [preselectPriceList, setPreselectPriceList] = useState(false)
  const [preselectedServiceId, setPreselectedServiceId] = useState<number | undefined>(undefined)

  const openPopup = (preselectPriceList = false, preselectedServiceId?: number) => {
    setPreselectPriceList(preselectPriceList)
    setPreselectedServiceId(preselectedServiceId)
    setIsOpen(true)
  }
  const closePopup = () => {
    setIsOpen(false)
    setPreselectPriceList(false)
    setPreselectedServiceId(undefined)
  }

  return (
    <ContactPopupContext.Provider value={{ isOpen, openPopup, closePopup }}>
      {children}
      <ContactPopup isOpen={isOpen} onClose={closePopup} preselectPriceList={preselectPriceList} preselectedServiceId={preselectedServiceId} />
    </ContactPopupContext.Provider>
  )
}

export function useContactPopup() {
  const context = useContext(ContactPopupContext)
  if (context === undefined) {
    throw new Error('useContactPopup must be used within a ContactPopupProvider')
  }
  return context
}



