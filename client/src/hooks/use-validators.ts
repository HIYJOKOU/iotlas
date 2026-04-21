import { useQuery } from '@tanstack/react-query'
import { fetchValidators } from '@/api/validators-api'
import { useIotaApi } from './use-iota-api'

export function useValidators() {
  const { network, api } = useIotaApi()
  const query = useQuery({
    queryKey: ['validators', network],
    queryFn: ({ signal }) => fetchValidators(api, signal),
  })

  return {
    network,
    validators: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
    refresh: () => query.refetch(),
  }
}
