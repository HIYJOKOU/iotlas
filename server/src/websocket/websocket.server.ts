import type { Server } from 'node:http'
import { WebSocketServer } from 'ws'
import { isAllowedNetwork } from '../constants/networks.js'
import { subscribeToHomeHub } from './home-ws-hub.service.js'

export function setupWebSocketServer(server: Server) {
  const websocketServer = new WebSocketServer({
    noServer: true,
  })

  server.on('upgrade', (request, socket, head) => {
    const { pathname } = new URL(request.url ?? '/', `http://${request.headers.host}`)
    const [scope, network, resource] = pathname.split('/').filter(Boolean)

    if (scope !== 'ws' || resource !== 'home' || !network || !isAllowedNetwork(network)) {
      socket.destroy()
      return
    }

    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      subscribeToHomeHub(network, websocket)
    })
  })

  return websocketServer
}
