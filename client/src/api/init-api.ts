import ky from 'ky'
import type { KyInstance } from 'ky'
import type { Network } from '@/lib/network'

const DEFAULT_API_URL = 'http://localhost:3001'

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_URL ?? DEFAULT_API_URL
}

export function initApi(network: Network): KyInstance {
  return ky.create({
    prefix: `${getApiBaseUrl()}/api/${network}`,
    timeout: 20_000,
  })
}
