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

export function getHomeWebSocketUrl(network: Network) {
  const explicitWsBaseUrl = import.meta.env.VITE_WS_URL
  const base = explicitWsBaseUrl ? new URL(explicitWsBaseUrl) : new URL(getApiBaseUrl())
  const basePath = base.pathname.replace(/\/+$/, '')

  if (!explicitWsBaseUrl) {
    base.protocol = base.protocol === 'https:' ? 'wss:' : 'ws:'
  }

  base.pathname = `${basePath}/ws/${network}/home`
  base.search = ''
  base.hash = ''

  return base.toString()
}
