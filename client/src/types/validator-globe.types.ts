import type { ValidatorListItem } from '@shared/types'

export type GlobeValidatorPoint = ValidatorListItem & {
  id: string
  lat: number
  lng: number
}

export type GlobeValidatorCluster = {
  id: string
  lat: number
  lng: number
  count: number
  validators: GlobeValidatorPoint[]
}
