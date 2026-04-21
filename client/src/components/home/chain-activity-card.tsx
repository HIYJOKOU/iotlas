import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedNumber } from './animated-number'
import { LiveStatusBadge } from './live-status-badge'
import { resolveLatestCheckpoint } from '@/utils/checkpoint-display'
import { formatDigestCompact, formatNumber } from '@/utils/formatters'

type RealtimeSnapshot = {
  latestCheckpoint?: string | number | null
  latestCheckpointTimestampMs?: number | null
}

type RealtimeActivity = {
  sequenceNumber?: string | number | null
  txCount?: number | null
  digest?: string | null
  timestampMs?: number | null
}

type ChainActivityCardProps = {
  snapshot: RealtimeSnapshot | null | undefined
  latestActivity: RealtimeActivity | null
  status: 'live' | 'connecting' | 'offline'
}

export function ChainActivityCard({ snapshot, latestActivity, status }: ChainActivityCardProps) {
  const checkpoint = resolveLatestCheckpoint(snapshot, latestActivity)
  const txCount = checkpoint.txCount ?? '-'

  return (
    <Card className="border-white/10 bg-background/60 backdrop-blur-xl md:col-span-8">
      <CardHeader className="gap-2 border-b border-white/10 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs small-tracking-title">Chain activity</p>

            <CardTitle className="text-xl font-semibold tracking-tight">Live checkpoint</CardTitle>
          </div>

          <LiveStatusBadge status={status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-4">
        <div className="rounded-xl border border-white/10 bg-white/2 px-4 py-3">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div className="space-y-1">
              <p className="small-tracking-title text-xs">Checkpoint</p>

              <p className="text-xl leading-none font-semibold text-foreground sm:text-4xl">
                <AnimatedNumber value={formatCheckpointValue(checkpoint.latestCheckpoint)} />
              </p>
            </div>

            <div className="space-y-1 md:text-right">
              <p className="small-tracking-title text-xs">TX BLOCKS</p>

              <p className="text-3xl leading-none font-semibold text-foreground sm:text-4xl">
                <AnimatedNumber value={txCount} />
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/2 px-3 py-2.5">
          <p className="small-tracking-title text-xs">Latest digest</p>

          <p className="truncate pt-1  text-base text-foreground">
            {formatDigestCompact(checkpoint.digest)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function formatCheckpointValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '-') return '-'

  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) return String(value)

  return formatNumber(numericValue)
}
