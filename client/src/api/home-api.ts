import type { KyInstance } from 'ky'
import type { HomeOverviewResponse } from '@/types/iota-api.types'

export async function fetchHomeOverview(api: KyInstance, signal?: AbortSignal) {
  const response = await api.get('home', { signal }).json<HomeOverviewResponse>()

  return response.data
}
