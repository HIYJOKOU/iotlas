export const ALLOWED_NETWORKS = ['mainnet', 'testnet', 'devnet'] as const

export type Network = (typeof ALLOWED_NETWORKS)[number]

export function isAllowedNetwork(value: string): value is Network {
  return ALLOWED_NETWORKS.includes(value as Network)
}
