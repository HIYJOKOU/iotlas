import type { Server } from 'node:http'
import { WebSocketServer } from 'ws'
import { isAllowedNetwork } from '../constants/networks.js'
import { isCorsOriginAllowed, websocketSecurityConfig } from '../config/http.js'
import { subscribeToHomeHub } from './home-ws-hub.service.js'

export function setupWebSocketServer(server: Server) {
  const websocketServer = new WebSocketServer({
    noServer: true,
    maxPayload: websocketSecurityConfig.maxPayloadBytes,
  })

  server.on('upgrade', (request, socket, head) => {
    const origin = request.headers.origin
    const { pathname } = new URL(request.url ?? '/', `http://${request.headers.host}`)
    const [scope, network, resource] = pathname.split('/').filter(Boolean)

    if (
      typeof origin !== 'string' ||
      !isCorsOriginAllowed(origin) ||
      scope !== 'ws' ||
      resource !== 'home' ||
      !network ||
      !isAllowedNetwork(network)
    ) {
      socket.destroy()
      return
    }

    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      subscribeToHomeHub(network, websocket)
    })
  })

  return websocketServer
}
