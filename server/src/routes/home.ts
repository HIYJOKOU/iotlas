import { Router } from 'express'
import { isAllowedNetwork } from '../constants/networks.js'
import { getHomeOverview } from '../services/home.service.js'

const router = Router()

router.get('/:network/home', async (req, res) => {
  const { network } = req.params

  if (!isAllowedNetwork(network)) {
    return res.status(404).json({
      ok: false,
      message: 'Network not found',
    })
  }

  try {
    const overview = await getHomeOverview(network)

    return res.status(200).json({
      data: overview,
    })
  } catch (error) {
    console.error('Failed to fetch home overview:', error)

    return res.status(500).json({
      ok: false,
      message: 'Failed to fetch home overview',
    })
  }
})

export default router
