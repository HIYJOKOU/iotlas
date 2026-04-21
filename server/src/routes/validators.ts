import { Router } from 'express'
import { isAllowedNetwork } from '../constants/networks.js'
import { getValidators } from '../services/validators.service.js'

const router = Router()

router.get('/:network/validators', async (req, res) => {
  const { network } = req.params

  if (!isAllowedNetwork(network)) {
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
