import type { GlobeValidatorCluster, GlobeValidatorPoint } from '@/types/validator-globe.types'
import type { ValidatorListItem } from '@shared/types'

export function shortAddress(address?: string | null) {
  if (!address) return 'Unknown validator'
  if (address.length <= 14) return address

  return `${address.slice(0, 6)}...${address.slice(-6)}`
}

export function getValidatorLocation(validator: GlobeValidatorPoint) {
  const parts = [validator.city, validator.country].filter(Boolean)

  if (parts.length === 0) return 'Unknown location'

  return parts.join(', ')
}

export function mapValidatorsToGlobePoints(validators: ValidatorListItem[]) {
  return validators
    .filter(
      (validator): validator is ValidatorListItem & { lat: number; lng: number } =>
        validator.lat !== null &&
        validator.lat !== undefined &&
        validator.lng !== null &&
        validator.lng !== undefined,
    )
    .map<GlobeValidatorPoint>((validator, index) => ({
      ...validator,
      id: validator.iotaAddress || String(index + 1),
    }))
}

export function getClusterRadiusDeg(distance: number) {
  if (distance > 460) return 22
  if (distance > 400) return 18
  if (distance > 340) return 14
  if (distance > 280) return 10
  if (distance > 230) return 6
  if (distance > 190) return 3

  return 1.5
}

function toRad(value: number) {
  return (value * Math.PI) / 180
}

function geoDistanceDeg(a: GlobeValidatorPoint, b: GlobeValidatorPoint) {
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  return (2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)) * 180) / Math.PI
}

function averageLng(points: GlobeValidatorPoint[]) {
  let x = 0
  let y = 0

  for (const point of points) {
    const lngRad = toRad(point.lng)

    x += Math.cos(lngRad)
    y += Math.sin(lngRad)
  }

  return (Math.atan2(y, x) * 180) / Math.PI
}

export function clusterValidatorsByDistance(
  points: GlobeValidatorPoint[],
  radiusDeg: number,
): GlobeValidatorCluster[] {
  const sorted = [...points].sort((a, b) => {
    if (a.lng === b.lng) return a.lat - b.lat
    return a.lng - b.lng
  })

  const used = new Set<string>()
  const clusters: GlobeValidatorCluster[] = []

  for (const point of sorted) {
    if (used.has(point.id)) continue

    const validators: GlobeValidatorPoint[] = [point]
    used.add(point.id)

    for (const candidate of sorted) {
      if (used.has(candidate.id)) continue

      const distance = geoDistanceDeg(point, candidate)

      if (distance <= radiusDeg) {
        validators.push(candidate)
        used.add(candidate.id)
      }
    }

    const lat = validators.reduce((sum, validator) => sum + validator.lat, 0) / validators.length
    const lng = averageLng(validators)

    clusters.push({
      id: validators
        .map((validator) => validator.id)
        .sort()
        .join(':'),
      lat,
      lng,
      count: validators.length,
      validators,
    })
  }

  return clusters
}

export function formatVotingPower(value?: string | number | null) {
  if (!value) return null

  const numberValue = Number(value)

  if (!Number.isFinite(numberValue)) return String(value)

  return numberValue.toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })
}
