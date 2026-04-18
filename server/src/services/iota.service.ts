import { IotaClient } from '@iota/iota-sdk/client'
import type { Network } from '../constants/networks.js'
import { getRpcUrl } from '../constants/rpc.js'

export function getIotaClient(network: Network) {
  return new IotaClient({
    url: getRpcUrl(network),
  })
}
