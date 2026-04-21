import type { Network } from '../constants/networks.js'
import type { HomeRealtimePayload } from '../../../shared/src/types/home-realtime.js'
import { fetchHomeLiveSnapshot, fetchNewCheckpointActivity } from './iota-home-live.service.js'

type StartHomeRealtimeStreamOptions = {
  network: Network
  onEvent: (event: HomeRealtimePayload) => void
}

const SNAPSHOT_INTERVAL_MS = 60_000
const ACTIVITY_INTERVAL_MS = 1_000

export function startHomeRealtimeStream({ network, onEvent }: StartHomeRealtimeStreamOptions) {
  let stopped = false
  let lastCheckpoint: string | null = null
  let snapshotTimer: ReturnType<typeof setTimeout> | null = null
  let activityTimer: ReturnType<typeof setTimeout> | null = null

  function emit(event: HomeRealtimePayload) {
    if (!stopped) {
      onEvent(event)
    }
  }

  function rememberLatestCheckpoint(candidate: string | null) {
    if (!candidate) return

    if (!lastCheckpoint) {
      lastCheckpoint = candidate
      return
    }

    const nextCheckpoint = Number(candidate)
    const currentCheckpoint = Number(lastCheckpoint)

    if (!Number.isFinite(nextCheckpoint) || !Number.isFinite(currentCheckpoint)) {
      lastCheckpoint = candidate
      return
    }

    if (nextCheckpoint > currentCheckpoint) {
      lastCheckpoint = candidate
    }
  }

  function emitError(error: unknown, message: string) {
    emit({
      type: 'error',
      data: {
        message: error instanceof Error ? error.message : message,
        ts: Date.now(),
      },
    })
  }

  async function sendSnapshot() {
    try {
      const snapshot = await fetchHomeLiveSnapshot(network)

      rememberLatestCheckpoint(snapshot.latestCheckpoint)

      emit({
        type: 'snapshot',
        data: snapshot,
      })
    } catch (error) {
      emitError(error, 'Failed to fetch home snapshot')
    }
  }

  async function sendActivityBatch() {
    try {
      const result = await fetchNewCheckpointActivity({
        network,
        afterCheckpoint: lastCheckpoint,
      })

      rememberLatestCheckpoint(result.latestCheckpoint)

      if (result.items.length === 0) return

      emit({
        type: 'activity_batch',
        data: {
          network,
          items: result.items,
          ts: Date.now(),
        },
      })
    } catch (error) {
      emitError(error, 'Failed to fetch checkpoint activity')
    }
  }

  async function runSnapshotLoop() {
    if (stopped) return

    await sendSnapshot()

    if (stopped) return

    snapshotTimer = setTimeout(() => {
      void runSnapshotLoop()
    }, SNAPSHOT_INTERVAL_MS)
  }

  async function runActivityLoop() {
    if (stopped) return

    await sendActivityBatch()

    if (stopped) return

    activityTimer = setTimeout(() => {
      void runActivityLoop()
    }, ACTIVITY_INTERVAL_MS)
  }

  void runSnapshotLoop()
  void runActivityLoop()

  return {
    stop() {
      if (stopped) return

      stopped = true

      if (snapshotTimer) {
        clearTimeout(snapshotTimer)
      }

      if (activityTimer) {
        clearTimeout(activityTimer)
      }
    },
  }
}
