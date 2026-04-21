import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { isAllowedNetwork } from '../constants/networks.js'
import { validatorsRateLimitConfig } from '../config/http.js'
import { getValidators } from '../services/validators.service.js'

const router = Router()

const validatorsRateLimit = rateLimit({
  windowMs: validatorsRateLimitConfig.windowMs,
  max: validatorsRateLimitConfig.max,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    ok: false,
    message: 'Too many validator requests, try again later.',
  },
})

router.get('/:network/validators', validatorsRateLimit, async (req, res) => {
  const { network } = req.params

  if (typeof network !== 'string' || !isAllowedNetwork(network)) {
    return res.status(404).json({
      ok: false,
      message: 'Network not found',
    })
  }

  try {
    const validators = await getValidators(network)

    return res.status(200).json({
      data: validators,
    })
  } catch (error) {
    console.error('Failed to fetch validators:', error)

    return res.status(500).json({
      ok: false,
      message: 'Failed to fetch validators',
    })
  }
})

export default router
