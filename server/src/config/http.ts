const DEFAULT_CORS_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173']

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/+$/, '')
}

function parseOriginList(value: string | undefined): string[] {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean)
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback
  }

  return parsed
}

const configuredCorsOrigins = parseOriginList(process.env.CORS_ALLOWED_ORIGINS)

export const allowedCorsOrigins =
  configuredCorsOrigins.length > 0 ? configuredCorsOrigins : DEFAULT_CORS_ORIGINS

export function isCorsOriginAllowed(origin: string): boolean {
  if (allowedCorsOrigins.includes('*')) {
    return true
  }

  return allowedCorsOrigins.includes(normalizeOrigin(origin))
}

export const validatorsRateLimitConfig = {
  windowMs: parsePositiveInt(process.env.VALIDATORS_RATE_LIMIT_WINDOW_MS, 60_000),
  max: parsePositiveInt(process.env.VALIDATORS_RATE_LIMIT_MAX, 30),
}

export const validatorsCacheTtlMs = parsePositiveInt(
  process.env.VALIDATORS_CACHE_TTL_MS,
  15_000,
)

export const websocketSecurityConfig = {
  maxClientsPerNetwork: parsePositiveInt(process.env.WS_MAX_CLIENTS_PER_NETWORK, 100),
  maxPayloadBytes: parsePositiveInt(process.env.WS_MAX_PAYLOAD_BYTES, 16_384),
}
