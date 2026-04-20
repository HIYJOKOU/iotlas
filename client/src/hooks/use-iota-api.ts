import { useMemo } from 'react'
import { initApi } from '@/api/init-api'
import { useNetwork } from './use-network'

export function useIotaApi() {
  const { network } = useNetwork()

  const api = useMemo(() => initApi(network), [network])

  return {
    network,
    api,
  }
}
