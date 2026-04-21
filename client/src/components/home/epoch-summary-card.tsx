import { Card, CardContent } from '@/components/ui/card'
import { useNow } from '@/hooks/use-now'
import { formatEpochTimeLeft, getEpochMetrics } from '@/utils/formatters'

type EpochSnapshot = {
  network?: string | null
  epoch?: string | number | null
  epochStartMs?: number | null
  epochDurationMs?: number | null
}

type EpochSummaryStats = {
  validators: number
  countries: number
  cities: number
}

type EpochSummaryCardProps = {
  snapshot: EpochSnapshot | null | undefined
  fallbackNetwork: string
  stats: EpochSummaryStats
}

export function EpochSummaryCard({ snapshot, fallbackNetwork, stats }: EpochSummaryCardProps) {
  const nowMs = useNow()
  const network = snapshot?.network ?? fallbackNetwork
  const epoch = snapshot?.epoch ?? '-'
  const epochMetrics = getEpochMetrics({
    epochStartMs: snapshot?.epochStartMs ?? 0,
    epochDurationMs: snapshot?.epochDurationMs ?? 0,
    nowMs,
  })
  const epochCountdown = formatEpochTimeLeft(epochMetrics.timeLeftMs)

  return (
    <section className="relative z-20 mx-auto w-full max-w-6xl px-0 pb-4 md:px-0">
      <Card className="w-full overflow-hidden border-white/10 bg-background/60">
        <CardContent className="grid p-0 lg:grid-cols-3">
          <div className="px-4 py-3 md:px-5 md:py-3.5">
            <div className="flex items-end justify-between gap-3">
              <p className="text-3xl leading-none font-semibold text-indigo-500">#{epoch}</p>

              <p className="text-lg leading-none font-semibold text-foreground">
                {epochMetrics.progressPercent !== null ? `${epochMetrics.progressPercent}%` : '-'}
              </p>
            </div>

            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-indigo-500/90 transition-all duration-500"
                style={{ width: `${epochMetrics.progressPercent ?? 0}%` }}
              />
            </div>

            <p className="pt-1 text-[11px] small-tracking-title">epoch</p>
          </div>

          <div className="border-t border-white/10 px-4 py-3 lg:border-t-0 lg:border-l md:px-5 md:py-3.5">
            <p className="text-[1.35rem] leading-none font-semibold text-foreground">
              {epochCountdown} left
            </p>

            <p className="pt-1 text-[11px] small-tracking-title">network {network}</p>
          </div>

          <div className="border-t border-white/10 px-4 py-3 lg:border-t-0 lg:border-l md:px-5 md:py-3.5">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <SummaryItem label="validators" value={stats.validators} />
              <SummaryItem label="countries" value={stats.countries} withBorder />
              <SummaryItem label="cities" value={stats.cities} withBorder />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

type SummaryItemProps = {
  label: string
  value: string | number
  withBorder?: boolean
}

function SummaryItem({ label, value, withBorder = false }: SummaryItemProps) {
  return (
    <div className={withBorder ? 'border-l border-white/10 px-3' : 'pr-2'}>
      <p className="text-[10px] min-[500px]:text-xs lg:text-[10px] min-[1144px]:text-xs small-tracking-title">
        {label}
      </p>
      <p className="pt-0.5 text-base font-semibold text-foreground">{value}</p>
    </div>
  )
}
