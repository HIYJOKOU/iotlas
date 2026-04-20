import { useQuery } from '@tanstack/react-query'
import { fetchHomeOverview } from '@/api/home-api'
import { useIotaApi } from './use-iota-api'

export function useHomeOverview() {
  const { network, api } = useIotaApi()
  const query = useQuery({
    queryKey: ['home-overview', network],
    queryFn: ({ signal }) => fetchHomeOverview(api, signal),
  })

  return {
    network,
    data: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refresh: () => query.refetch(),
  }
}
