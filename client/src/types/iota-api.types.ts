import type { Network } from '@/lib/network'

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

export type HomeOverviewResponse = {
  data: HomeOverview
}
