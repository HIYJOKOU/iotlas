import express from 'express'
import validatorsRouter from './routes/validators.js'
import cors from 'cors'

export const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api', validatorsRouter)
