import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'

import type {
  CachedLocation,
  GeoIpResponse,
  MinimalIotaValidator,
  ValidatorWithLocation,
} from '../types/iota-validator.types.js'
import {
  DNS_TIMEOUT_MS,
  GEO_CACHE_TTL_MS,
  GEO_TIMEOUT_MS,
  IP_API_BATCH_SIZE,
  IP_API_FIELDS,
  IP_API_MAX_RETRIES,
  IP_API_RETRY_DELAY_MS,
} from '../constants/geo.js'
import { extractHostFromMultiaddr } from './helpers/multiaddr.js'

const locationCache = new Map<string, CachedLocation>()

type HostWithQuery = [host: string, query: string]

function getValidatorHost(validator: MinimalIotaValidator): string | null {
  return (
    extractHostFromMultiaddr(validator.netAddress) ??
    extractHostFromMultiaddr(validator.p2pAddress) ??
    extractHostFromMultiaddr(validator.primaryAddress)
  )
}

function isFresh(location: CachedLocation): boolean {
  return Date.now() - location.updatedAt < GEO_CACHE_TTL_MS
}

function chunk<T>(items: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size),
  )
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function lookupWithTimeout(host: string, family: 4 | 6): Promise<string | null> {
  try {
    const result = await Promise.race([
      lookup(host, { family }),
      delay(DNS_TIMEOUT_MS).then(() => null),
    ])

    return result?.address ?? null
  } catch {
    return null
  }
}

async function resolveHostToGeoQuery(host: string): Promise<string | null> {
  if (isIP(host)) return host

  return (await lookupWithTimeout(host, 4)) ?? (await lookupWithTimeout(host, 6)) ?? host
}

function toLocation(row: GeoIpResponse): CachedLocation | null {
  if (row.status !== 'success' || row.lat == null || row.lon == null) {
    return null
  }

  return {
    ip: row.query ?? null,
    country: row.country ?? null,
    city: row.city ?? null,
    lat: row.lat,
    lng: row.lon,
    updatedAt: Date.now(),
  }
}

async function fetchGeoBatch(
  hostsWithQuery: HostWithQuery[],
): Promise<Map<string, CachedLocation>> {
  const locations = new Map<string, CachedLocation>()

  if (!hostsWithQuery.length) {
    return locations
  }

  const fields = IP_API_FIELDS.join(',')

  for (let attempt = 0; attempt <= IP_API_MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetch('http://ip-api.com/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          hostsWithQuery.map(([, query]) => ({
            query,
            fields,
          })),
        ),
        signal: AbortSignal.timeout(GEO_TIMEOUT_MS),
      })

      if (!response.ok) {
        if (attempt < IP_API_MAX_RETRIES) {
          await delay(IP_API_RETRY_DELAY_MS * (attempt + 1))
          continue
        }

        return locations
      }

      const rows = (await response.json()) as GeoIpResponse[]

      rows.forEach((row, index) => {
        const host = hostsWithQuery[index]?.[0]
        const location = toLocation(row)

        if (!host || !location) return

        locationCache.set(host, location)
        locations.set(host, location)
      })

      return locations
    } catch (error) {
      if (attempt < IP_API_MAX_RETRIES) {
        await delay(IP_API_RETRY_DELAY_MS * (attempt + 1))
        continue
      }

      const reason = error instanceof Error ? error.message : String(error)
      const previewHosts = hostsWithQuery.slice(0, 8).map(([host]) => host)

      console.warn(
        `Failed to fetch geolocation batch (size=${hostsWithQuery.length}, reason=${reason}). Sample hosts:`,
        previewHosts,
      )
    }
  }

  return locations
}

function isHostWithQuery(value: HostWithQuery | null): value is HostWithQuery {
  return value !== null
}

async function getLocationsForHosts(hosts: string[]): Promise<Map<string, CachedLocation>> {
  const locations = new Map<string, CachedLocation>()

  const missingHosts = hosts.filter((host) => {
    const cached = locationCache.get(host)

    if (!cached || !isFresh(cached)) {
      return true
    }

    locations.set(host, cached)
    return false
  })

  const hostsWithQuery = (
    await Promise.all(
      missingHosts.map(async (host): Promise<HostWithQuery | null> => {
        const query = await resolveHostToGeoQuery(host)

        return query ? [host, query] : null
      }),
    )
  ).filter(isHostWithQuery)

  for (const hostsBatch of chunk(hostsWithQuery, IP_API_BATCH_SIZE)) {
    const batch = await fetchGeoBatch(hostsBatch)

    for (const [host, location] of batch) {
      locations.set(host, location)
    }
  }

  for (const host of missingHosts) {
    const cached = locationCache.get(host)

    if (!locations.has(host) && cached) {
      locations.set(host, cached)
    }
  }

  return locations
}

export async function attachLocationsToValidators<TValidator extends MinimalIotaValidator>(
  validators: TValidator[],
): Promise<ValidatorWithLocation<TValidator>[]> {
  const hosts = [...new Set(validators.map(getValidatorHost).filter(Boolean))] as string[]
  const locationsByHost = await getLocationsForHosts(hosts)

  return validators.map((validator) => {
    const host = getValidatorHost(validator)
    const location = host ? locationsByHost.get(host) : null

    return {
      ...validator,
      host,
      ip: location?.ip ?? null,
      country: location?.country ?? null,
      city: location?.city ?? null,
      lat: location?.lat ?? null,
      lng: location?.lng ?? null,
      locationSource: location ? 'ip-api' : 'unknown',
      locationUpdatedAt: location?.updatedAt ?? null,
    }
  })
}
