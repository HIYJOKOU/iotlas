import express from 'express'
import validatorsRouter from './routes/validators.js'
import cors from 'cors'
import type { CorsOptions } from 'cors'
import { isCorsOriginAllowed } from './config/http.js'

export const app = express()

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || isCorsOriginAllowed(origin)) {
      return callback(null, true)
    }

    return callback(null, false)
  },
}

app.use(cors(corsOptions))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api', validatorsRouter)
