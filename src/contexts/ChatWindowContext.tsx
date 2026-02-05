'use client'

import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react'
import ChatWindow from '@/src/components/ChatWindow'

// Types
export interface ChatMessage {
  id: string
  text: string
  senderType: 'user' | 'manager'
  timestamp: string
}

interface ChatWindowContextType {
  isOpen: boolean
  openChat: () => void
  closeChat: () => void
  messages: ChatMessage[]
  sendMessage: (text: string) => Promise<void>
  isConnected: boolean
  isLoading: boolean
  isConnecting: boolean
  sessionId: string | null
  showQuestionnaire: boolean
  queuePosition: number | null
  submitQuestionnaire: (data: { name: string; email: string; phone: string }) => Promise<void>
}

const ChatWindowContext = createContext<ChatWindowContextType | undefined>(undefined)

// Get or create user identifier (stored in localStorage)
function getUserIdentifier(): string {
  if (typeof window === 'undefined') return crypto.randomUUID()
  
  const stored = localStorage.getItem('chat_user_identifier')
  if (stored) return stored
  
  const newId = crypto.randomUUID()
  localStorage.setItem('chat_user_identifier', newId)
  return newId
}

// Get or create session ID (stored in sessionStorage)
function getSessionId(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem('chat_session_id')
}

function setSessionId(sessionId: string): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem('chat_session_id', sessionId)
}

export function ChatWindowProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [sessionId, setSessionIdState] = useState<string | null>(null)
  // Initialize questionnaire state - will be set when chat opens
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  const [queuePosition, setQueuePosition] = useState<number | null>(null)
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const userIdentifier = useRef(getUserIdentifier())

  // Define initializeSession and checkSessionStatus first (using useCallback to avoid dependency issues)
  const initializeSession = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // Check for existing session
      const existingSessionId = getSessionId()
      if (existingSessionId) {
        // Verify session exists
        try {
          const response = await fetch(`/api/chat/sessions?sessionId=${existingSessionId}`)
          if (response.ok) {
            const data = await response.json()
            if (data.success && data.session) {
              setSessionIdState(existingSessionId)
              setSessionId(existingSessionId)
              setIsLoading(false)
              return
            }
          }
        } catch (error) {
          console.error('Error verifying existing session:', error)
        }
      }

      // Create new session
      const response = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIdentifier: userIdentifier.current,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create session')
      }

      const data = await response.json()
      if (data.success && data.session) {
        const newSessionId = data.session.id
        setSessionIdState(newSessionId)
        setSessionId(newSessionId)
      }
    } catch (error) {
      console.error('Error initializing chat session:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const checkSessionStatus = useCallback(async () => {
    if (!sessionId) return

    try {
      const response = await fetch(`/api/chat/sessions?sessionId=${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.session) {
          if (data.session.status === 'queued') {
            setQueuePosition(data.session.queue_position)
          } else if (data.session.status === 'active') {
            setQueuePosition(null)
          }
        }
      }
    } catch (error) {
      console.error('Error checking session status:', error)
    }
  }, [sessionId])

  // Check if questionnaire is needed when chat opens
  useEffect(() => {
    if (!isOpen) {
      // Reset states when chat closes
      setShowQuestionnaire(false)
      setQueuePosition(null)
      return
    }

    // Always check when chat opens
    if (typeof window === 'undefined') {
      return
    }

    // Check questionnaire immediately when chat opens
    const checkQuestionnaire = async () => {
      try {
        const hasUserInfo = localStorage.getItem('chat_user_info')
        const existingSessionId = getSessionId()
        
        console.log('Checking questionnaire:', { hasUserInfo: !!hasUserInfo, existingSessionId, isOpen })
        
        if (!hasUserInfo) {
          // No user info - skip questionnaire and initialize session directly
          // User info can be collected later if needed
          console.log('No user info - initializing session directly')
          setShowQuestionnaire(false)
          await initializeSession()
        } else if (hasUserInfo && !existingSessionId) {
          // User info exists but no session - initialize session
          console.log('Initializing session - user info exists')
          setShowQuestionnaire(false)
          await initializeSession()
        } else if (existingSessionId) {
          // Session exists - use it
          console.log('Using existing session:', existingSessionId)
          setShowQuestionnaire(false)
          setSessionIdState(existingSessionId)
          setSessionId(existingSessionId)
          await checkSessionStatus()
        }
      } catch (error) {
        console.error('Error checking questionnaire:', error)
        // On error, show questionnaire to be safe
        setShowQuestionnaire(true)
      }
    }

    // Run immediately
    checkQuestionnaire().catch(console.error)
  }, [isOpen, initializeSession, checkSessionStatus])

  // Initialize session and connect when chat opens (after questionnaire)
  useEffect(() => {
    if (isOpen && !showQuestionnaire) {
      // Set connecting state immediately
      setIsConnecting(true)
      
      // Start connection process immediately
      if (sessionId && !wsRef.current) {
        // If session exists but no WebSocket, connect immediately
        connectWebSocket()
      }
    } else if (!isOpen) {
      // Clean up when chat closes
      setIsConnecting(false)
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      setIsConnected(false)
    }

    return () => {
      // Cleanup on unmount
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [isOpen, sessionId, showQuestionnaire])

  // Connect WebSocket immediately when session becomes available
  useEffect(() => {
    if (isOpen && sessionId && !wsRef.current && !isLoading) {
      // Connect immediately when session is ready
      connectWebSocket()
    }
  }, [isOpen, sessionId, isLoading])

  // Load message history when session is available
  useEffect(() => {
    if (sessionId && isOpen) {
      loadMessageHistory()
      checkSessionStatus()
    }
  }, [sessionId, isOpen])

  // Poll for new messages and queue status
  useEffect(() => {
    if (!isOpen || !sessionId) return

    const pollInterval = setInterval(async () => {
      // Check for new messages
      await loadMessageHistory()
      // Check queue status if in queue
      if (queuePosition !== null) {
        await checkSessionStatus()
      }
    }, 3000) // Check every 3 seconds

    return () => clearInterval(pollInterval)
  }, [isOpen, sessionId, queuePosition, checkSessionStatus])

  const loadMessageHistory = async () => {
    if (!sessionId) return

    try {
      const response = await fetch(`/api/chat/messages?sessionId=${sessionId}&recent=true&limit=50`)
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.messages) {
          const formattedMessages: ChatMessage[] = data.messages.map((msg: any) => ({
            id: msg.id,
            text: msg.message_text,
            senderType: msg.sender_type,
            timestamp: msg.created_at,
          }))
          setMessages(formattedMessages)
        }
      }
    } catch (error) {
      console.error('Error loading message history:', error)
    }
  }

  const connectWebSocket = () => {
    if (!sessionId || wsRef.current) {
      console.log('Skipping WebSocket connection:', { sessionId, hasWs: !!wsRef.current })
      return
    }

    try {
      // Set connecting state
      setIsConnected(false)
      setIsConnecting(true)
      
      // Use wss for production (HTTPS) or ws for local development
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      // For production, use the full domain
      const host = window.location.hostname === 'localhost' 
        ? window.location.host 
        : 'spravzni.yaroslavkozak.workers.dev'
      const wsUrl = `${protocol}//${host}/api/chat/ws?sessionId=${sessionId}`
      
      console.log('Connecting to WebSocket:', wsUrl)
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('WebSocket connected successfully')
        setIsConnected(true)
        setIsConnecting(false)
        reconnectAttemptsRef.current = 0
        
        // Send join message
        ws.send(JSON.stringify({
          type: 'join',
          sessionId,
        }))
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          handleWebSocketMessage(message)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setIsConnected(false)
        setIsConnecting(false)
      }

      ws.onclose = () => {
        console.log('WebSocket closed')
        setIsConnected(false)
        setIsConnecting(false)
        wsRef.current = null
        
        // Attempt to reconnect if chat is still open
        if (isOpen && sessionId) {
          scheduleReconnect()
        }
      }
    } catch (error) {
      console.error('Error connecting WebSocket:', error)
      setIsConnected(false)
      setIsConnecting(false)
    }
  }

  const scheduleReconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000) // Max 30 seconds
    reconnectAttemptsRef.current++

    reconnectTimeoutRef.current = window.setTimeout(() => {
      if (isOpen && sessionId && !wsRef.current) {
        connectWebSocket()
      }
    }, delay)
  }

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'session':
        if (message.data?.connected) {
          setIsConnected(true)
          setIsConnecting(false)
        }
        break

      case 'message':
        // New message received
        if (message.data) {
          const newMessage: ChatMessage = {
            id: message.data.id || crypto.randomUUID(),
            text: message.data.text,
            senderType: message.data.senderType || 'manager',
            timestamp: message.data.timestamp || new Date().toISOString(),
          }
          setMessages((prev) => [...prev, newMessage])
        }
        break

      case 'message-sent':
        // Confirmation that our message was sent
        // Message should already be in the list, but we can update it if needed
        break

      case 'pong':
        // Response to ping
        break

      case 'error':
        console.error('WebSocket error:', message.data?.error)
        break

      default:
        console.log('Unknown WebSocket message type:', message.type)
    }
  }

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) {
      console.warn('Cannot send empty message')
      return
    }

    if (!sessionId) {
      console.error('Cannot send message: no session ID')
      alert('Помилка: сесія не ініціалізована. Будь ласка, закрийте та відкрийте чат знову.')
      return
    }

    const messageText = text.trim()
    console.log('Sending message:', { messageText, sessionId, hasWebSocket: !!wsRef.current, wsState: wsRef.current?.readyState })

    // Optimistically add message to UI
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      text: messageText,
      senderType: 'user',
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempMessage])

    // Try WebSocket first
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        console.log('Sending via WebSocket')
        wsRef.current.send(JSON.stringify({
          type: 'message',
          sessionId,
          data: {
            text: messageText,
          },
        }))
        // Message sent via WebSocket - it will be confirmed via WebSocket message
        return
      } catch (error) {
        console.error('Error sending via WebSocket:', error)
        // Fall through to HTTP fallback
      }
    } else {
      console.log('WebSocket not available, using HTTP fallback', { 
        hasWs: !!wsRef.current, 
        readyState: wsRef.current?.readyState 
      })
    }

    // Fallback to HTTP
    try {
      console.log('Sending via HTTP fallback')
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          text: messageText,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('HTTP send failed:', response.status, errorText)
        throw new Error(`Failed to send message: ${response.status}`)
      }

      const data = await response.json()
      console.log('Message sent via HTTP:', data)
      
      if (data.success && data.message) {
        // Replace temp message with real one
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== tempMessage.id)
          return [...filtered, {
            id: data.message.id,
            text: data.message.message_text,
            senderType: data.message.sender_type,
            timestamp: data.message.created_at,
          }]
        })
      } else {
        console.warn('Message sent but unexpected response format:', data)
        // Keep temp message if response format is unexpected
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Remove temp message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id))
      alert('Помилка відправки повідомлення. Спробуйте ще раз.')
      throw error
    }
  }, [sessionId])

  // checkSessionStatus is defined above using useCallback

  const submitQuestionnaire = async (data: { name: string; email: string; phone: string }) => {
    try {
      setIsLoading(true)
      setShowQuestionnaire(false) // Hide questionnaire immediately

      // Save user info to localStorage
      localStorage.setItem('chat_user_info', JSON.stringify(data))

      // Submit questionnaire and create/update session
      const response = await fetch('/api/chat/questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          userIdentifier: userIdentifier.current,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit questionnaire')
      }

      const result = await response.json()
      
      if (result.success) {
        const newSessionId = result.session.id
        setSessionIdState(newSessionId)
        setSessionId(newSessionId)
        setShowQuestionnaire(false)

        // Check if user is in queue
        if (result.session.status === 'queued') {
          setQueuePosition(result.session.queue_position)
        } else {
          setQueuePosition(null)
          // Start connection if active
          setIsConnecting(true)
        }
      }
    } catch (error) {
      console.error('Error submitting questionnaire:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const openChat = () => setIsOpen(true)
  const closeChat = () => {
    setIsOpen(false)
    setShowQuestionnaire(false)
    setQueuePosition(null)
  }

  return (
    <ChatWindowContext.Provider
      value={{
        isOpen,
        openChat,
        closeChat,
        messages,
        sendMessage,
        isConnected,
        isLoading,
        isConnecting,
        sessionId,
        showQuestionnaire,
        queuePosition,
        submitQuestionnaire,
      }}
    >
      {children}
      <ChatWindow isOpen={isOpen} onClose={closeChat} />
    </ChatWindowContext.Provider>
  )
}

export function useChatWindow() {
  const context = useContext(ChatWindowContext)
  if (context === undefined) {
    throw new Error('useChatWindow must be used within a ChatWindowProvider')
  }
  return context
}
