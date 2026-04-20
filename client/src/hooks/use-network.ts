import { useAtom } from 'jotai'
import { atom } from 'jotai'
import { DEFAULT_NETWORK, type Network } from '@/lib/network'

export const networkAtom = atom<Network>(DEFAULT_NETWORK)

export function useNetwork() {
  const [network, setNetwork] = useAtom(networkAtom)

  return {
    network,
    setNetwork,
  }
}
