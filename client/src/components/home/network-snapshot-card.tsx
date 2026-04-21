import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNow } from '@/hooks/use-now'
import { resolveLatestCheckpoint } from '@/utils/checkpoint-display'
import { formatCheckpointAge, formatCompactMetric, formatNumber } from '@/utils/formatters'

type RealtimeSnapshot = {
  latestCheckpoint?: string | number | null
  latestCheckpointTimestampMs?: number | null
  referenceGasPrice?: string | number | null
  protocolVersion?: string | number | null
}

type RealtimeActivity = {
  sequenceNumber?: string | number | null
  txCount?: number | null
  timestampMs?: number | null
}

type NetworkSnapshotCardProps = {
  snapshot: RealtimeSnapshot | null | undefined
  latestActivity: RealtimeActivity | null
  status: 'live' | 'connecting' | 'offline'
  lastError: string | null | undefined
}

export function NetworkSnapshotCard({
  snapshot,
  latestActivity,
  status,
  lastError,
}: NetworkSnapshotCardProps) {
  const nowMs = useNow()
  const checkpoint = resolveLatestCheckpoint(snapshot, latestActivity)
  const latestCheckpointCompact = formatCompactMetric(checkpoint.latestCheckpoint)
  const checkpointAge = formatCheckpointAge(checkpoint.latestCheckpointTimestampMs, nowMs)

  const nodeStatus =
    status === 'connecting'
      ? 'syncing'
      : status !== 'live'
        ? 'offline'
        : lastError
          ? 'degraded'
          : 'healthy'

  return (
    <Card className="border-white/10 bg-background/60 backdrop-blur-xl md:col-span-4">
      <CardHeader className="gap-0 border-b border-white/10 pb-4">
        <p className="text-xs small-tracking-title">Chain status</p>

        <CardTitle className="text-xl font-semibold tracking-tight">Current state</CardTitle>
      </CardHeader>

      <CardContent className="space-y-1.5 pt-4  text-sm text-foreground">
        <SnapshotRow label="Latest checkpoint" value={latestCheckpointCompact} />

        <SnapshotRow label="Checkpoint tx blocks" value={checkpoint.txCount ?? '-'} />

        <SnapshotRow
          label="Reference gas"
          value={
            snapshot?.referenceGasPrice ? formatNumber(Number(snapshot.referenceGasPrice)) : '-'
          }
        />

        <SnapshotRow
          label="Protocol version"
          value={formatProtocolVersion(snapshot?.protocolVersion)}
        />

        <SnapshotRow label="Checkpoint age" value={checkpointAge} />

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-foreground/75">RPC status</span>

          <span
            className={`font-semibold ${
              nodeStatus === 'healthy'
                ? 'text-emerald-300'
                : nodeStatus === 'syncing'
                  ? 'text-amber-300'
                  : nodeStatus === 'degraded'
                    ? 'text-orange-300'
                    : 'text-rose-300'
            }`}
          >
            {nodeStatus}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

type SnapshotRowProps = {
  label: string
  value: string | number
}

function SnapshotRow({ label, value }: SnapshotRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-foreground/75">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function formatProtocolVersion(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return 'unavailable'
  }

  const normalizedValue = String(value)

  return normalizedValue.toLowerCase().startsWith('v') ? normalizedValue : `v${normalizedValue}`
}
