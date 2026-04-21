import { lazy, Suspense, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useHomeRealtime } from '@/hooks/use-home-realtime'
import { useValidators } from '@/hooks/use-validators'
import { formatNumber } from '@/utils/formatters'
import { getTopLocation, getValidatorStats } from '@/utils/validators'
import { MetricCard } from '@/components/home/metric-card'
import { EpochSummaryCard } from '@/components/home/epoch-summary-card'
import { ChainActivityCard } from '@/components/home/chain-activity-card'
import { NetworkSnapshotCard } from '@/components/home/network-snapshot-card'

const GlobeTest = lazy(async () => {
  const module = await import('@/components/globe/globe')

  return {
    default: module.GlobeTest,
  }
})

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { validators } = useValidators()
  const { network, snapshot, currentActivity, connectionState, lastError } = useHomeRealtime()
  const { validatorStats, topCountry, topCity } = useMemo(() => {
    return {
      validatorStats: getValidatorStats(validators),
      topCountry: getTopLocation(validators.map((validator) => validator.country)),
      topCity: getTopLocation(validators.map((validator) => validator.city)),
    }
  }, [validators])

  const wsStatusLabel =
    connectionState === 'open'
      ? 'live'
      : connectionState === 'connecting'
        ? 'connecting'
        : 'offline'

  return (
    <div className="mx-auto w-full max-w-6xl px-2 py-6 md:px-6 -mt-16 md:py-8">
      <div className="flex justify-center pb-6 md:pb-8">
        <Suspense fallback={<div className="h-150 w-225 max-w-full rounded-3xl" />}>
          <GlobeTest />
        </Suspense>
      </div>

      <EpochSummaryCard
        snapshot={snapshot}
        fallbackNetwork={network}
        stats={{
          validators: snapshot?.activeValidators ?? validators.length,
          countries: validatorStats.countries,
          cities: validatorStats.cities,
        }}
      />

      <section className="relative z-20 mx-auto grid w-full max-w-6xl gap-4 pb-4 md:grid-cols-12 md:px-0">
        <ChainActivityCard
          snapshot={snapshot}
          latestActivity={currentActivity}
          status={wsStatusLabel}
        />

        <NetworkSnapshotCard
          snapshot={snapshot}
          latestActivity={currentActivity}
          status={wsStatusLabel}
          lastError={lastError}
        />
      </section>

      <section className="relative z-20 mx-auto grid w-full max-w-6xl grid-cols-2 gap-2 px-0 pb-10 sm:gap-3 md:grid-cols-12 md:gap-4 md:px-0">
        <MetricCard
          label="Reference gas price"
          value={
            snapshot?.referenceGasPrice ? formatNumber(Number(snapshot.referenceGasPrice)) : '-'
          }
        />

        <MetricCard
          label="Average APY"
          value={
            snapshot?.avgApy === null || snapshot?.avgApy === undefined
              ? '-'
              : `${snapshot.avgApy.toFixed(2)}%`
          }
        />

        <MetricCard
          label="Leader APY"
          value={
            snapshot?.leaderApy === null || snapshot?.leaderApy === undefined
              ? '-'
              : `${snapshot.leaderApy.toFixed(2)}%`
          }
        />

        <MetricCard
          label="Mapped validators"
          value={`${validatorStats.withLocation} / ${validators.length}`}
          helper={`without location ${validatorStats.withoutLocation}`}
        />

        <MetricCard
          label="Top country"
          value={topCountry?.name ?? '-'}
          helper={topCountry ? `${formatNumber(topCountry.count)} validators` : '-'}
        />

        <MetricCard
          label="Top city"
          value={topCity?.name ?? '-'}
          helper={topCity ? `${formatNumber(topCity.count)} validators` : '-'}
        />
      </section>
    </div>
  )
}
