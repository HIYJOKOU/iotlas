export const NETWORK_OPTIONS = ['mainnet', 'testnet', 'devnet'] as const

export type Network = (typeof NETWORK_OPTIONS)[number]

export const DEFAULT_NETWORK: Network = 'mainnet'

export function isNetwork(value: string): value is Network {
  return NETWORK_OPTIONS.includes(value as Network)
}

export function getNetworkLabel(network: Network): string {
  return network.charAt(0).toUpperCase() + network.slice(1)
}
