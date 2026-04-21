import { useCallback, useEffect, useRef, useState } from 'react'
import type { HomeRealtimePayload } from '@shared/types'
import { getHomeWebSocketUrl } from '@/api/init-api'
import type { Network } from '@/lib/network'

type ConnectionState = 'connecting' | 'open' | 'closed'

const INITIAL_RECONNECT_DELAY_MS = 1_000
const MAX_RECONNECT_DELAY_MS = 10_000

const STALE_CONNECTION_MS = 45_000
const MAX_CONNECTING_MS = 10_000
const RECONNECT_AFTER_HIDDEN_MS = 10_000

type UseHomeWebSocketOptions = {
  network: Network
  onPayload: (payload: HomeRealtimePayload) => void
  onConnectionReset?: () => void
}

export function useHomeWebSocket({
  network,
  onPayload,
  onConnectionReset,
}: UseHomeWebSocketOptions) {
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting')
  const [lastError, setLastError] = useState<string | null>(null)

  const socketRef = useRef<WebSocket | null>(null)
  const reconnectTimerRef = useRef<number | null>(null)
  const reconnectAttemptRef = useRef(0)

  const socketCreatedAtRef = useRef(0)
  const lastMessageAtRef = useRef(0)
  const hiddenAtRef = useRef<number | null>(null)

  const onPayloadRef = useRef(onPayload)
  const onConnectionResetRef = useRef(onConnectionReset)

  useEffect(() => {
    onPayloadRef.current = onPayload
  }, [onPayload])

  useEffect(() => {
    onConnectionResetRef.current = onConnectionReset
  }, [onConnectionReset])

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current === null) return

    window.clearTimeout(reconnectTimerRef.current)
    reconnectTimerRef.current = null
  }, [])

  const closeSocket = useCallback(() => {
    const socket = socketRef.current
    socketRef.current = null

    if (!socket) return

    socket.onopen = null
    socket.onmessage = null
    socket.onerror = null
    socket.onclose = null

    if (socket.readyState !== WebSocket.CLOSED) {
      socket.close()
    }
  }, [])

  useEffect(() => {
    let disposed = false

    hiddenAtRef.current = null
    reconnectAttemptRef.current = 0
    socketCreatedAtRef.current = 0
    lastMessageAtRef.current = 0
    connect()

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', checkConnectionSoon)
    window.addEventListener('online', replaceConnection)

    return () => {
      disposed = true

      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', checkConnectionSoon)
      window.removeEventListener('online', replaceConnection)

      clearReconnectTimer()
      closeSocket()
    }

    function connect() {
      if (disposed) return

      const socket = socketRef.current

      if (socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING) {
        return
      }

      clearReconnectTimer()

      setConnectionState('connecting')
      setLastError(null)

      const nextSocket = new WebSocket(getHomeWebSocketUrl(network))

      socketRef.current = nextSocket
      socketCreatedAtRef.current = Date.now()
      lastMessageAtRef.current = Date.now()

      nextSocket.onopen = () => {
        if (!isCurrentSocket(nextSocket)) return

        reconnectAttemptRef.current = 0
        lastMessageAtRef.current = Date.now()
        setConnectionState('open')
      }

      nextSocket.onmessage = (event) => {
        if (!isCurrentSocket(nextSocket)) return

        lastMessageAtRef.current = Date.now()

        const payload = parsePayload(event.data)

        if (payload) {
          onPayloadRef.current(payload)
        }
      }

      nextSocket.onerror = () => {
        if (!isCurrentSocket(nextSocket)) return

        setLastError('WebSocket connection error')
        replaceConnection()
      }

      nextSocket.onclose = () => {
        if (!isCurrentSocket(nextSocket)) return

        socketRef.current = null
        onConnectionResetRef.current?.()
        setConnectionState('closed')
        scheduleReconnect()
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        hiddenAtRef.current = Date.now()
        return
      }

      const hiddenForMs = hiddenAtRef.current ? Date.now() - hiddenAtRef.current : 0

      hiddenAtRef.current = null

      if (hiddenForMs > RECONNECT_AFTER_HIDDEN_MS) {
        replaceConnection()
        return
      }

      checkConnectionSoon()
    }

    function checkConnectionSoon() {
      window.setTimeout(ensureFreshConnection, 100)
    }

    function ensureFreshConnection() {
      if (disposed) return

      const socket = socketRef.current

      if (!socket) {
        connect()
        return
      }

      if (socket.readyState === WebSocket.CONNECTING) {
        const connectingMs = Date.now() - socketCreatedAtRef.current

        if (connectingMs > MAX_CONNECTING_MS) {
          replaceConnection()
        }

        return
      }

      if (socket.readyState !== WebSocket.OPEN) {
        replaceConnection()
        return
      }

      const inactiveMs = Date.now() - lastMessageAtRef.current

      if (inactiveMs > STALE_CONNECTION_MS) {
        replaceConnection()
      }
    }

    function replaceConnection() {
      if (disposed) return

      clearReconnectTimer()
      onConnectionResetRef.current?.()
      closeSocket()
      connect()
    }

    function scheduleReconnect() {
      clearReconnectTimer()

      const delay = getReconnectDelay(reconnectAttemptRef.current)
      reconnectAttemptRef.current += 1

      reconnectTimerRef.current = window.setTimeout(connect, delay)
    }

    function isCurrentSocket(socket: WebSocket) {
      return !disposed && socketRef.current === socket
    }
  }, [network, clearReconnectTimer, closeSocket])

  return {
    connectionState,
    isConnected: connectionState === 'open',
    lastError,
  }
}

function parsePayload(raw: unknown): HomeRealtimePayload | null {
  if (typeof raw !== 'string') return null

  try {
    return JSON.parse(raw) as HomeRealtimePayload
  } catch {
    return null
  }
}

function getReconnectDelay(attempt: number) {
  return Math.min(INITIAL_RECONNECT_DELAY_MS * 2 ** attempt, MAX_RECONNECT_DELAY_MS)
}
