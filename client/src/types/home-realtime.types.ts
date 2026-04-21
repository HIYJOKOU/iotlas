import type { Network } from '@/lib/network'

export type HomeLiveSnapshot = {
  network: Network
  epoch: string | null
  epochStartMs: number | null
  epochDurationMs: number | null
  latestCheckpoint: string | null
  latestCheckpointTimestampMs: number | null
  referenceGasPrice: string | null
  protocolVersion: string | null
  activeValidators: number
  avgApy: number | null
  leaderApy: number | null
}

export type HomeActivityItem = {
  kind: 'checkpoint'
  sequenceNumber: string
  digest: string
  txCount: number
  timestampMs: number | null
}

export type HomeRealtimePayload =
  | {
      type: 'ready'
      data: {
        network: Network
        ts: number
      }
    }
  | {
      type: 'snapshot'
      data: HomeLiveSnapshot
    }
  | {
      type: 'activity_batch'
      data: {
        network: Network
        items: HomeActivityItem[]
        ts: number
      }
    }
  | {
      type: 'heartbeat'
      data: {
        ts: number
      }
    }
  | {
      type: 'error'
      data: {
        message: string
        ts: number
      }
    }
