import type { KyInstance } from 'ky'
import type { ValidatorsResponse } from '@/types/iota-api.types'

export async function fetchValidators(api: KyInstance, signal?: AbortSignal) {
  const response = await api.get('validators', { signal }).json<ValidatorsResponse>()

  return response.data
}
