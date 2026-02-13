'use client'

import { createPortal } from 'react-dom'
import { useEffect, useRef, ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  description?: string
  className?: string
  overlayClassName?: string
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  renderScreenReaderTitle?: boolean
  style?: React.CSSProperties
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  className = '',
  overlayClassName = '',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  renderScreenReaderTitle = true,
  style,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Handle Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, closeOnEscape])

  // Focus management and body scroll lock
  useEffect(() => {
    if (isOpen) {
      // Store previous focus
      previousFocusRef.current = document.activeElement as HTMLElement

      // Lock body scroll (prevent background scrolling)
      // Store original values for restoration
      const originalBodyOverflow = document.body.style.overflow
      const originalBodyPosition = document.body.style.position
      const originalBodyTop = document.body.style.top
      const originalBodyWidth = document.body.style.width
      const originalBodyTouchAction = document.body.style.touchAction
      const originalHtmlOverflow = document.documentElement.style.overflow
      const originalHtmlPosition = document.documentElement.style.position
      const originalHtmlTop = document.documentElement.style.top
      const originalHtmlWidth = document.documentElement.style.width
      const scrollY = window.scrollY
      
      // Lock both body and html for better cross-browser support (especially Safari)
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
      document.documentElement.style.overflow = 'hidden'
      
      // On mobile, prevent body scroll while allowing modal content to scroll
      if (window.innerWidth < 640) {
        document.body.style.position = 'fixed'
        document.body.style.top = `-${scrollY}px`
        document.body.style.width = '100%'
        // Also lock html element for Safari
        document.documentElement.style.position = 'fixed'
        document.documentElement.style.top = `-${scrollY}px`
        document.documentElement.style.width = '100%'
      }

      // Focus first form control (input/textarea) if present, otherwise first focusable element (skip close buttons for cleaner open)
      const timer = setTimeout(() => {
        const modal = modalRef.current
        if (!modal) return
        const firstFormControl = modal.querySelector(
          'input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'
        ) as HTMLElement
        const firstFocusable = modal.querySelector(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement
        ;(firstFormControl || firstFocusable)?.focus()
      }, 100)

      return () => {
        clearTimeout(timer)
        // Restore body styles
        document.body.style.overflow = originalBodyOverflow
        document.body.style.position = originalBodyPosition
        document.body.style.top = originalBodyTop
        document.body.style.width = originalBodyWidth
        document.body.style.touchAction = originalBodyTouchAction
        // Restore html styles
        document.documentElement.style.overflow = originalHtmlOverflow
        document.documentElement.style.position = originalHtmlPosition
        document.documentElement.style.top = originalHtmlTop
        document.documentElement.style.width = originalHtmlWidth
        // Restore scroll position on mobile
        if (window.innerWidth < 640 && scrollY) {
          window.scrollTo(0, scrollY)
        }
        // Return focus to previous element
        previousFocusRef.current?.focus()
      }
    }
  }, [isOpen])

  // Prevent background scrolling on touch devices
  useEffect(() => {
    if (!isOpen) return

    const overlay = overlayRef.current
    const modal = modalRef.current
    if (!overlay || !modal) return

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      
      // If touch is directly on overlay background, prevent scrolling
      if (target === overlay) {
        e.preventDefault()
        return
      }
      
      // Check if target or any parent up to modal is scrollable
      let currentElement: HTMLElement | null = target
      let isScrollable = false
      
      while (currentElement && currentElement !== overlay) {
        // FIX: We removed the check (currentElement === modal) so the modal itself is checked
        if (!modal.contains(currentElement) && currentElement !== modal) {
          break
        }
        
        const style = window.getComputedStyle(currentElement)
        const overflowY = style.overflowY
        
        // Check if element is scrollable
        if (
          (overflowY === 'auto' || overflowY === 'scroll') &&
          currentElement.scrollHeight > currentElement.clientHeight
        ) {
          isScrollable = true
          break
        }
        
        currentElement = currentElement.parentElement
      }

      // Only prevent default if we're not on a scrollable element
      if (!isScrollable) {
        e.preventDefault()
      }
    }

    overlay.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      overlay.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isOpen])

  // Focus trap
  useEffect(() => {
    if (!isOpen) return

    const modal = modalRef.current
    if (!modal) return

    const getFocusableElements = () => {
      return Array.from(
        modal.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ) as HTMLElement[]
    }

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    modal.addEventListener('keydown', handleTab)
    return () => modal.removeEventListener('keydown', handleTab)
  }, [isOpen])

  // Set aria-hidden on background content
  useEffect(() => {
    if (!isOpen) return

    // Find the root app container (usually body's first child or a specific root element)
    const rootElement = document.querySelector('body > *:first-child') as HTMLElement
    const portalContainer = modalRef.current?.parentElement

    // Set aria-hidden on root element if it exists and is not the portal container
    if (rootElement && rootElement !== portalContainer) {
      rootElement.setAttribute('aria-hidden', 'true')
    }

    // Also set on all body children except the portal container
    const siblings = Array.from(document.body.children).filter(
      (child) => child !== portalContainer
    )

    siblings.forEach((sibling) => {
      if (sibling instanceof HTMLElement && sibling !== rootElement) {
        sibling.setAttribute('aria-hidden', 'true')
      }
    })

    return () => {
      if (rootElement && rootElement !== portalContainer) {
        rootElement.removeAttribute('aria-hidden')
      }
      siblings.forEach((sibling) => {
        if (sibling instanceof HTMLElement && sibling !== rootElement) {
          sibling.removeAttribute('aria-hidden')
        }
      })
    }
  }, [isOpen])

  if (!isOpen) return null

  const titleId = title ? 'modal-title' : undefined
  const descriptionId = description ? 'modal-description' : undefined

  const modalContent = (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[100] flex ${overlayClassName}`}
      onClick={(e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
          onClose()
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div
        ref={modalRef}
        className={className}
        style={style}
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        onTouchMove={(e) => {
          // Allow touch scrolling within modal content
          e.stopPropagation()
        }}
      >
        {title && renderScreenReaderTitle && (
          <h2 id={titleId} className="sr-only">
            {title}
          </h2>
        )}
        {description && renderScreenReaderTitle && (
          <p id={descriptionId} className="sr-only">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  )

  // Use portal to render outside DOM hierarchy
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return null
}
