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

export type ValidatorsResponse = {
  data: ValidatorListItem[]
}
