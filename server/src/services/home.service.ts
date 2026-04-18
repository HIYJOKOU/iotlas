import type { Network } from '../constants/networks.js'
import type {
  HomeOverview,
  ValidatorListItem,
  ValidatorWithLocation,
} from '../types/iota-validator.types.js'
import { getIotaClient } from './iota.service.js'
import { attachLocationsToValidators } from './validator-location.service.js'

function buildStats(
  validators: Array<Pick<ValidatorWithLocation, 'lat' | 'lng'>>,
): HomeOverview['stats'] {
  const withLocation = validators.filter(
    (validator) => validator.lat !== null && validator.lng !== null,
  ).length

  return {
    total: validators.length,
    withLocation,
    withoutLocation: validators.length - withLocation,
    generatedAt: Date.now(),
  }
}

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

export async function getHomeOverview(network: Network): Promise<HomeOverview> {
  const client = getIotaClient(network)
  const systemState = await client.getLatestIotaSystemState()

  const validators = systemState.activeValidators ?? []
  const validatorsWithLocation = await attachLocationsToValidators(validators)

  const overviewBase = {
    network,
    epoch: systemState.epoch,
    protocolVersion: systemState.protocolVersion ?? null,
  }
  const stats = buildStats(validatorsWithLocation)

  return {
    ...overviewBase,
    validators: validatorsWithLocation.map(toValidatorListItem),
    stats,
  }
}
