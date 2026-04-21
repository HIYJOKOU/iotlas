export type { ValidatorListItem } from '../../../shared/src/types/validators.js'

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
