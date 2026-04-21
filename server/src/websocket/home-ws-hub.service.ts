import { WebSocket } from 'ws'
import type { Network } from '../constants/networks.js'
import { startHomeRealtimeStream } from '../services/home-realtime.service.js'
import type { HomeRealtimePayload } from '../../../shared/src/types/home-realtime.js'

type SnapshotPayload = Extract<HomeRealtimePayload, { type: 'snapshot' }>
type ActivityBatchPayload = Extract<HomeRealtimePayload, { type: 'activity_batch' }>

type HomeHub = {
  clients: Set<WebSocket>
  stop: () => void
  latestSnapshot: SnapshotPayload | null
  latestActivityBatch: ActivityBatchPayload | null
}

const hubs = new Map<Network, HomeHub>()
const clientAliveState = new WeakMap<WebSocket, boolean>()

const MAX_BUFFERED_AMOUNT = 1_000_000
const HEARTBEAT_INTERVAL_MS = 15_000

function send(websocket: WebSocket, payload: HomeRealtimePayload) {
  if (websocket.readyState !== WebSocket.OPEN) return

  if (websocket.bufferedAmount > MAX_BUFFERED_AMOUNT) {
    websocket.close(1008, 'Client too slow')
    return
  }

  websocket.send(JSON.stringify(payload))
}

function getHomeHub(network: Network) {
  const existingHub = hubs.get(network)

  if (existingHub) {
    return existingHub
  }

  const hub: HomeHub = {
    clients: new Set(),
    stop: () => {},
    latestSnapshot: null,
    latestActivityBatch: null,
  }

  const stream = startHomeRealtimeStream({
    network,
    onEvent: (event) => {
      if (event.type === 'snapshot') {
        hub.latestSnapshot = event
      }

      if (event.type === 'activity_batch') {
        hub.latestActivityBatch = event
      }

      for (const client of hub.clients) {
        send(client, event)
      }
    },
  })

  hub.stop = stream.stop
  hubs.set(network, hub)

  return hub
}

export function subscribeToHomeHub(network: Network, websocket: WebSocket) {
  const hub = getHomeHub(network)

  hub.clients.add(websocket)
  clientAliveState.set(websocket, true)

  send(websocket, {
    type: 'ready',
    data: {
      network,
      ts: Date.now(),
    },
  })

  if (hub.latestSnapshot) {
    send(websocket, hub.latestSnapshot)
  }

  if (hub.latestActivityBatch) {
    send(websocket, hub.latestActivityBatch)
  }

  const markAlive = () => {
    clientAliveState.set(websocket, true)
  }

  const heartbeat = setInterval(() => {
    if (clientAliveState.get(websocket) === false) {
      websocket.terminate()
      return
    }

    clientAliveState.set(websocket, false)

    send(websocket, {
      type: 'heartbeat',
      data: {
        ts: Date.now(),
      },
    })

    if (websocket.readyState === WebSocket.OPEN) {
      websocket.ping()
    }
  }, HEARTBEAT_INTERVAL_MS)

  let isCleanedUp = false

  function cleanup() {
    if (isCleanedUp) return

    isCleanedUp = true
    clearInterval(heartbeat)
    hub.clients.delete(websocket)
    clientAliveState.delete(websocket)
    websocket.off('pong', markAlive)

    if (hub.clients.size > 0) return

    hub.stop()
    hubs.delete(network)
  }

  websocket.on('pong', markAlive)
  websocket.once('close', cleanup)
  websocket.once('error', cleanup)
}
