import type { Network } from '../constants/networks.js'
import type { HomeActivityItem, HomeLiveSnapshot } from '../../../shared/src/types/home-realtime.js'
import { getIotaClient } from './iota.service.js'

type FetchNewCheckpointActivityOptions = {
  network: Network
  afterCheckpoint: string | null
}

type FetchNewCheckpointActivityResult = {
  latestCheckpoint: string | null
  items: HomeActivityItem[]
}

const MAX_CHECKPOINTS_PER_TICK = 25

export async function fetchHomeLiveSnapshot(network: Network): Promise<HomeLiveSnapshot> {
  const client = getIotaClient(network)

  const [referenceGasPrice, systemState, latestCheckpoint, validatorsApy] = await Promise.all([
    client.getReferenceGasPrice(),
    client.getLatestIotaSystemState(),
    client.getLatestCheckpointSequenceNumber(),
    client.getValidatorsApy(),
  ])

  const checkpoint = await client.getCheckpoint({
    id: String(latestCheckpoint),
  })

  const apyStats = getApyStats(validatorsApy.apys)

  return {
    network,
    epoch: String(systemState.epoch),
    epochStartMs: toPositiveNumberOrNull(systemState.epochStartTimestampMs),
    epochDurationMs: toPositiveNumberOrNull(systemState.epochDurationMs),
    latestCheckpoint: String(latestCheckpoint),
    latestCheckpointTimestampMs: toPositiveNumberOrNull(checkpoint.timestampMs),
    referenceGasPrice: String(referenceGasPrice),
    protocolVersion: String(systemState.protocolVersion),
    activeValidators: systemState.activeValidators.length,
    avgApy: apyStats.avg,
    leaderApy: apyStats.leader,
  }
}

export async function fetchNewCheckpointActivity({
  network,
  afterCheckpoint,
}: FetchNewCheckpointActivityOptions): Promise<FetchNewCheckpointActivityResult> {
  const client = getIotaClient(network)
  const latestCheckpoint = String(await client.getLatestCheckpointSequenceNumber())

  if (!afterCheckpoint) {
    return {
      latestCheckpoint,
      items: [],
    }
  }

  const from = Number(afterCheckpoint) + 1
  const to = Number(latestCheckpoint)

  if (!Number.isFinite(from) || !Number.isFinite(to) || to < from) {
    return {
      latestCheckpoint,
      items: [],
    }
  }

  const count = Math.min(to - from + 1, MAX_CHECKPOINTS_PER_TICK)
  const checkpointIds = Array.from({ length: count }, (_, index) => String(from + index))

  const checkpoints = await Promise.all(checkpointIds.map((id) => client.getCheckpoint({ id })))

  return {
    latestCheckpoint: checkpointIds[checkpointIds.length - 1] ?? latestCheckpoint,
    items: checkpoints.map(toActivityItem),
  }
}

function toActivityItem(checkpoint: {
  sequenceNumber: string | number
  digest: string
  transactions?: unknown[]
  timestampMs?: string | number | null
}): HomeActivityItem {
  return {
    kind: 'checkpoint',
    sequenceNumber: String(checkpoint.sequenceNumber),
    digest: String(checkpoint.digest),
    txCount: checkpoint.transactions?.length ?? 0,
    timestampMs: toPositiveNumberOrNull(checkpoint.timestampMs),
  }
}

function getApyStats(validatorsApy: Array<{ apy: number }>) {
  const apys = validatorsApy.map((item) => Number(item.apy) * 100).filter(Number.isFinite)

  if (apys.length === 0) {
    return {
      avg: null,
      leader: null,
    }
  }

  const sum = apys.reduce((acc, apy) => acc + apy, 0)

  return {
    avg: Number((sum / apys.length).toFixed(2)),
    leader: Number(Math.max(...apys).toFixed(2)),
  }
}

function toPositiveNumberOrNull(value: unknown): number | null {
  const parsed = Number(value)

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}
