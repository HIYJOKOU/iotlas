export function extractHostFromMultiaddr(address?: string | null): string | null {
  if (!address) return null

  const patterns = [
    /\/dns\/([^/]+)/,
    /\/dns4\/([^/]+)/,
    /\/dns6\/([^/]+)/,
    /\/ip4\/([^/]+)/,
    /\/ip6\/([^/]+)/,
  ]

  for (const pattern of patterns) {
    const match = address.match(pattern)
    if (match?.[1]) return match[1]
  }

  return null
}