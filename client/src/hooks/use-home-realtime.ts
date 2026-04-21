import { useCallback, useEffect, useState } from 'react'
import type { HomeLiveSnapshot, HomeRealtimePayload } from '@/types'
import { useNetwork } from './use-network'
import type { Network } from '@/lib/network'
import { useActivityStream } from './use-activity-stream'
import { useHomeWebSocket } from './use-home-websocket'

export function useHomeRealtime() {
  const { network } = useNetwork()

  const [snapshot, setSnapshot] = useState<HomeLiveSnapshot | null>(null)
  const [payloadErrorState, setPayloadErrorState] = useState<{
    network: Network
    message: string | null
  }>({
    network,
    message: null,
  })
  const [activityNetwork, setActivityNetwork] = useState<Network>(network)

  const { currentActivity, enqueue, reset: resetActivityStream } = useActivityStream()

  useEffect(() => {
    resetActivityStream()
  }, [network, resetActivityStream])

  const handlePayload = useCallback(
    (payload: HomeRealtimePayload) => {
      switch (payload.type) {
        case 'snapshot':
          if (payload.data.network === network) {
            setPayloadErrorState({
              network,
              message: null,
            })
            setSnapshot(payload.data)
          }

          return

        case 'activity_batch':
          if (payload.data.network === network) {
            setActivityNetwork(network)
            setPayloadErrorState({
              network,
              message: null,
            })
            enqueue(payload.data.items)
          }

          return

        case 'error':
          setPayloadErrorState({
            network,
            message: payload.data.message,
          })
          return

        default:
          return
      }
    },
    [network, enqueue],
  )

  const handleConnectionReset = useCallback(() => {
    setActivityNetwork(network)
    setPayloadErrorState({
      network,
      message: null,
    })
    resetActivityStream()
  }, [network, resetActivityStream])

  const currentSnapshot = snapshot?.network === network ? snapshot : null
  const currentRealtimeActivity = activityNetwork === network ? currentActivity : null
  const payloadError = payloadErrorState.network === network ? payloadErrorState.message : null

  const {
    connectionState,
    isConnected,
    lastError: socketError,
  } = useHomeWebSocket({
    network,
    onPayload: handlePayload,
    onConnectionReset: handleConnectionReset,
  })

  return {
    network,
    snapshot: currentSnapshot,
    currentActivity: currentRealtimeActivity,
    connectionState,
    isConnected,
    lastError: socketError ?? payloadError,
    resetActivityStream,
  }
}
