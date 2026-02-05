'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface PreloadContextType {
  isPreloadComplete: boolean
  setPreloadComplete: (value: boolean) => void
}

const PreloadContext = createContext<PreloadContextType | undefined>(undefined)

export function PreloadProvider({ children }: { children: ReactNode }) {
  const [isPreloadComplete, setPreloadComplete] = useState(false)

  return (
    <PreloadContext.Provider value={{ isPreloadComplete, setPreloadComplete }}>
      {children}
    </PreloadContext.Provider>
  )
}

export function usePreload() {
  const context = useContext(PreloadContext)
  if (context === undefined) {
    throw new Error('usePreload must be used within a PreloadProvider')
  }
  return context
}
