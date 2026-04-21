import type { Network } from '../constants/networks.js'
import type { ValidatorListItem, ValidatorWithLocation } from '../types/iota-validator.types.js'
import { validatorsCacheTtlMs } from '../config/http.js'
import { getIotaClient } from './iota.service.js'
import { attachLocationsToValidators } from './validator-location.service.js'

type CacheEntry = {
  data: ValidatorListItem[]
  expiresAt: number
}

const validatorsCache = new Map<Network, CacheEntry>()
const validatorsInFlight = new Map<Network, Promise<ValidatorListItem[]>>()

function toValidatorListItem(validator: ValidatorWithLocation): ValidatorListItem {
  return {
    iotaAddress: validator.iotaAddress,
    name: validator.name,
    imageUrl: validator.imageUrl ?? null,
    projectUrl: validator.projectUrl ?? null,
    votingPower: validator.votingPower ?? null,
    stakingPoolIotaBalance: validator.stakingPoolIotaBalance ?? null,
    commissionRate: validator.commissionRate ?? null,
    gasPrice: validator.gasPrice ?? null,
    host: validator.host,
    country: validator.country,
    city: validator.city,
    lat: validator.lat,
    lng: validator.lng,
    locationUpdatedAt: validator.locationUpdatedAt,
  }
}

export async function getValidators(network: Network): Promise<ValidatorListItem[]> {
  const cached = validatorsCache.get(network)

  if (cached && cached.expiresAt > Date.now()) {
    return cached.data
  }

  const inFlight = validatorsInFlight.get(network)

  if (inFlight) {
    return inFlight
  }

  const request = (async () => {
    const client = getIotaClient(network)

    const systemState = await client.getLatestIotaSystemState()

    const validators = systemState.activeValidators ?? []
    const validatorsWithLocation = await attachLocationsToValidators(validators)
    const data = validatorsWithLocation.map(toValidatorListItem)

    validatorsCache.set(network, {
      data,
      expiresAt: Date.now() + validatorsCacheTtlMs,
    })

    return data
  })()

  validatorsInFlight.set(network, request)

  try {
    return await request
  } finally {
    validatorsInFlight.delete(network)
  }
}
