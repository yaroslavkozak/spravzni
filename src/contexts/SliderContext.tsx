'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'

interface SliderContextType {
  currentSlide: number
  navigateToSlide: (slideIndex: number) => void
}

const SliderContext = createContext<SliderContextType | undefined>(undefined)

export function SliderProvider({ children }: { children: ReactNode }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const navigateToSlide = useCallback((slideIndex: number) => {
    setCurrentSlide(slideIndex)
  }, [])

  return (
    <SliderContext.Provider value={{ currentSlide, navigateToSlide }}>
      {children}
    </SliderContext.Provider>
  )
}

export function useSlider() {
  const context = useContext(SliderContext)
  if (context === undefined) {
    throw new Error('useSlider must be used within a SliderProvider')
  }
  return context
}

