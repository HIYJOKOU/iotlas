import type { Network } from './networks.js'

export function getRpcUrl(network: Network): string {
  const rpcUrls: Record<Network, string | undefined> = {
    mainnet: process.env.IOTA_MAINNET_RPC_URL,
    testnet: process.env.IOTA_TESTNET_RPC_URL,
    devnet: process.env.IOTA_DEVNET_RPC_URL,
  }

  const url = rpcUrls[network]

  if (!url) {
    throw new Error(`Missing RPC URL for network: ${network}`)
  }

  return url
}
