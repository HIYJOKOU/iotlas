export function getTopLocation(values: Array<string | null | undefined>) {
  const counts = new Map<string, number>()

  for (const value of values) {
    if (!value) continue

    counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  let topName: string | null = null
  let topCount = 0

  for (const [name, count] of counts) {
    if (count > topCount) {
      topName = name
      topCount = count
    }
  }

  if (!topName) return null

  return {
    name: topName,
    count: topCount,
  }
}

export function getValidatorDisplayName(name: string | null | undefined) {
  const trimmedName = name?.trim()

  return trimmedName ? trimmedName : 'Unknown validator'
}

export function getValidatorInitials(name: string | null | undefined) {
  const parts = getValidatorDisplayName(name).split(/\s+/).filter(Boolean)

  if (parts.length === 0) return '?'

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function getValidatorStats(
  validators: Array<{
    country: string | null
    city: string | null
    lat: number | null
    lng: number | null
  }>,
) {
  const countries = new Set(validators.map((v) => v.country).filter(Boolean)).size
  const cities = new Set(validators.map((v) => v.city).filter(Boolean)).size

  const withLocation = validators.filter(
    (v) => typeof v.lat === 'number' && typeof v.lng === 'number',
  ).length

  return {
    countries,
    cities,
    withLocation,
    withoutLocation: validators.length - withLocation,
  }
}
