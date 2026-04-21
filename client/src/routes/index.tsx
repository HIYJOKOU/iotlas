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

const ValidatorGlobe = lazy(async () => {
  const module = await import('@/components/globe/globe')

  return {
    default: module.ValidatorGlobe,
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
    <div className="mx-auto w-full max-w-6xl py-6 md:px-6 -mt-16 md:py-8">
      <div className="flex justify-center">
        <Suspense
          fallback={<div className="h-107.5 w-full max-w-225 rounded-3xl sm:h-130 md:h-150" />}
        >
          {/* <div className="pointer-events-none absolute left-1/2 top-[22%] z-0 h-[50%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#615fff] opacity-20 blur-[120px] sm:top-[24%] sm:h-[90%] sm:w-[105%] sm:blur-[140px] md:top-[27%] md:h-[30%] md:w-[40%] md:blur-[160px]" /> */}

          <ValidatorGlobe validators={validators} />
        </Suspense>
      </div>
      <div className="-mt-4 sm:-mt-8 px-2">
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
    </div>
  )
}
