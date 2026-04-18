import type { Network } from '../constants/networks.js'

export type MinimalIotaValidator = {
  name: string
  iotaAddress: string
  netAddress?: string | null
  p2pAddress?: string | null
  primaryAddress?: string | null
  votingPower?: string
  stakingPoolIotaBalance?: string
  commissionRate?: string
  gasPrice?: string
  imageUrl?: string
  projectUrl?: string
  description?: string
}

export type IotaValidator = MinimalIotaValidator & Record<string, unknown>

export type ValidatorLocationSource = 'ip-api' | 'unknown'

export type ValidatorLocation = {
  host: string | null
  ip: string | null
  country: string | null
  city: string | null
  lat: number | null
  lng: number | null
  locationSource: ValidatorLocationSource
  locationUpdatedAt: number | null
}

export type ValidatorWithLocation<TValidator extends MinimalIotaValidator = MinimalIotaValidator> =
  TValidator & ValidatorLocation

export type ValidatorListItem = {
  iotaAddress: string
  name: string
  imageUrl: string | null
  projectUrl: string | null
  votingPower: string | null
  stakingPoolIotaBalance: string | null
  commissionRate: string | null
  gasPrice: string | null
  host: string | null
  country: string | null
  city: string | null
  lat: number | null
  lng: number | null
  locationUpdatedAt: number | null
}

export type CachedLocation = {
  ip: string | null
  country: string | null
  city: string | null
  lat: number | null
  lng: number | null
  updatedAt: number
}

export type GeoIpResponse = {
  status: 'success' | 'fail'
  message?: string
  query?: string
  country?: string
  city?: string
  lat?: number
  lon?: number
}

export type IotaSystemStateVersioned<T> = {
  V1?: T
  V2?: T
}

export type MinimalSystemState = {
  epoch: string
  protocolVersion?: string
  activeValidators?: unknown[]
}

export type HomeOverview = {
  network: Network
  epoch: string
  protocolVersion: string | null
  validators: ValidatorListItem[]
  stats: {
    total: number
    withLocation: number
    withoutLocation: number
    generatedAt: number
  }
}

export type HomeOverviewFull = {
  network: Network
  epoch: string
  protocolVersion: string | null
  validators: ValidatorWithLocation<IotaValidator>[]
  stats: {
    total: number
    withLocation: number
    withoutLocation: number
    generatedAt: number
  }
}
