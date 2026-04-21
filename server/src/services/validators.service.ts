import type { Network } from '../constants/networks.js'
import type { ValidatorListItem, ValidatorWithLocation } from '../types/iota-validator.types.js'
import { getIotaClient } from './iota.service.js'
import { attachLocationsToValidators } from './validator-location.service.js'

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
  const client = getIotaClient(network)

  const systemState = await client.getLatestIotaSystemState()

  const validators = systemState.activeValidators ?? []
  const validatorsWithLocation = await attachLocationsToValidators(validators)

  return validatorsWithLocation.map(toValidatorListItem)
}
