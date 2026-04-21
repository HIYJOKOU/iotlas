export function formatEpochTimeLeft(timeLeftMs: number | null) {
  if (timeLeftMs === null) return '-'

  const totalMinutes = Math.floor(timeLeftMs / 60_000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${hours}h ${minutes}m`
}

export function getEpochMetrics({
  epochStartMs,
  epochDurationMs,
  nowMs,
}: {
  epochStartMs: number
  epochDurationMs: number
  nowMs: number
}) {
  const elapsedMs = Math.min(Math.max(0, nowMs - epochStartMs), epochDurationMs)

  return {
    progressPercent: Number(((elapsedMs / epochDurationMs) * 100).toFixed(1)),
    timeLeftMs: epochDurationMs - elapsedMs,
  }
}

export function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) return '-'

  return value.toLocaleString('en-US')
}

export function formatCompactMetric(value: string | number | null | undefined) {
  if (value === null || value === undefined) return '-'

  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) return String(value)

  if (numericValue >= 1_000_000) {
    return `${(numericValue / 1_000_000).toFixed(2)}M`
  }

  if (numericValue >= 1_000) {
    return `${(numericValue / 1_000).toFixed(2)}K`
  }

  return formatNumber(numericValue)
}

export function formatCheckpointAge(timestampMs: number | null | undefined, nowMs: number) {
  if (!timestampMs || !Number.isFinite(timestampMs)) return '-'

  const ageMs = Math.max(0, nowMs - timestampMs)
  const ageSeconds = Math.floor(ageMs / 1000)

  if (ageSeconds < 60) return `${ageSeconds}s`

  const ageMinutes = Math.floor(ageSeconds / 60)
  if (ageMinutes < 60) return `${ageMinutes}m`

  const ageHours = Math.floor(ageMinutes / 60)
  if (ageHours < 24) return `${ageHours}h`

  const ageDays = Math.floor(ageHours / 24)

  return `${ageDays}d`
}

export function formatDigestCompact(digest: string | null | undefined) {
  if (!digest) return '-'
  if (digest.length <= 26) return digest

  return `${digest.slice(0, 10)}...${digest.slice(-10)}`
}
