type CheckpointSnapshot = {
  latestCheckpoint?: string | number | null
  latestCheckpointTimestampMs?: number | null
}

type CheckpointActivity = {
  sequenceNumber?: string | number | null
  timestampMs?: number | null
  txCount?: number | null
  digest?: string | null
}

export function resolveLatestCheckpoint(
  snapshot: CheckpointSnapshot | null | undefined,
  activity: CheckpointActivity | null | undefined,
) {
  const snapshotSequence = toSequence(snapshot?.latestCheckpoint)
  const activitySequence = toSequence(activity?.sequenceNumber)
  const hasActivitySequence =
    activity?.sequenceNumber !== null &&
    activity?.sequenceNumber !== undefined &&
    activity?.sequenceNumber !== ''

  const isActivityCurrent =
    hasActivitySequence &&
    (snapshotSequence === null ||
      (activitySequence !== null && activitySequence >= snapshotSequence))

  return {
    latestCheckpoint: isActivityCurrent
      ? activity?.sequenceNumber ?? snapshot?.latestCheckpoint ?? '-'
      : snapshot?.latestCheckpoint ?? activity?.sequenceNumber ?? '-',
    latestCheckpointTimestampMs: isActivityCurrent
      ? activity?.timestampMs ?? null
      : snapshot?.latestCheckpointTimestampMs ?? null,
    txCount: isActivityCurrent ? activity?.txCount ?? null : null,
    digest: isActivityCurrent ? activity?.digest ?? null : null,
  }
}

function toSequence(value: unknown): number | null {
  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : null
}
