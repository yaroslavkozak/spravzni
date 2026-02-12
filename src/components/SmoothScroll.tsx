'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for smooth feel
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      syncTouch: false, // Disable on touch devices for better performance
      touchMultiplier: 2,
      infinite: false,
    })

    // Animation frame function
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    const scrollToTargetId = (id: string) => {
      if (!id) return false
      const target = document.getElementById(id)
      if (!target) return false
      const header = document.querySelector('header')
      const headerHeight = header ? header.getBoundingClientRect().height : 0
      const extraOffset = -150
      lenis.scrollTo(target, { offset: -headerHeight - extraOffset, duration: 1 })
      return true
    }

    const getTargetId = () => {
      const params = new URLSearchParams(window.location.search)
      const sectionParam = params.get('section')
      if (sectionParam) return sectionParam
      const hash = window.location.hash
      if (hash && hash.startsWith('#')) return hash.slice(1)
      return ''
    }

    let attempts = 0
    const maxAttempts = 40
    const attemptScroll = () => {
      const targetId = getTargetId()
      if (scrollToTargetId(targetId) || attempts >= maxAttempts) return
      attempts += 1
      setTimeout(attemptScroll, 1300)
    }

    const initialTargetId = getTargetId()
    let ignoreNextHashChange = Boolean(initialTargetId)

    if (initialTargetId) {
      setTimeout(attemptScroll, 1300)
    }

    const handleHashChange = () => {
      if (ignoreNextHashChange && getTargetId() === initialTargetId) {
        ignoreNextHashChange = false
        return
      }
      attempts = 0
      setTimeout(attemptScroll, 2000)
    }

    window.addEventListener('hashchange', handleHashChange)

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
