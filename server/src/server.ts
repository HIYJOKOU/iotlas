import dotenv from 'dotenv'
import { createServer } from 'node:http'
import { app } from './app.js'
import { setupWebSocketServer } from './websocket/websocket.server.js'

dotenv.config()

const PORT = Number(process.env.PORT) || 3001

const server = createServer(app)

setupWebSocketServer(server)

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
