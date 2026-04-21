import { useState } from 'react'
import { useValidators } from '@/hooks/use-validators'
import { formatCompactMetric, formatDigestCompact } from '@/utils/formatters'
import { getValidatorDisplayName, getValidatorInitials } from '@/utils/validators'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/validators')({
  component: RouteComponent,
})

function RouteComponent() {
  const { validators, isLoading, error } = useValidators()

  const validatorRows = validators.map((validator) => ({
    id: validator.iotaAddress,
    name: getValidatorDisplayName(validator.name),
    address: validator.iotaAddress,
    imageUrl: validator.imageUrl,
    host: validator.host ?? '-',
    location: [validator.city, validator.country].filter(Boolean).join(', ') || '-',
    votingPower: validator.votingPower,
    commissionRate: validator.commissionRate,
  }))

  return (
    <section className="mx-auto w-full max-w-6xl px-2 py-6 md:px-4 md:py-8">
      <Card className="border-white/10 bg-background/80">
        <CardHeader className="-gap-1">
          <CardTitle className="text-lg font-semibold">
            {validatorRows.length} Validators found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading validators...</p>
          ) : null}

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          {!isLoading && !error && validatorRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No validators available.</p>
          ) : null}

          {!isLoading && !error && validatorRows.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full min-w-180 text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Validator</th>
                    <th className="px-4 py-3 font-medium">Host</th>
                    <th className="px-4 py-3 font-medium">Voting power</th>
                    <th className="px-4 py-3 font-medium">Commission</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {validatorRows.map((validator, index) => (
                    <tr key={validator.id} className="border-t border-white/10 align-top">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ValidatorLogo
                            name={validator.name}
                            imageUrl={validator.imageUrl}
                            priority={index < 12}
                          />
                          <div>
                            <div className="font-medium text-foreground">{validator.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDigestCompact(validator.address)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{validator.host}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatCompactMetric(validator.votingPower)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatCompactMetric(validator.commissionRate)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{validator.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  )
}

function ValidatorLogo({
  name,
  imageUrl,
  priority,
}: {
  name: string
  imageUrl: string | null
  priority?: boolean
}) {
  const [imageFailed, setImageFailed] = useState(false)
  const initials = getValidatorInitials(name)

  if (!imageUrl || imageFailed) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-foreground ring-1 ring-white/10">
        {initials}
      </div>
    )
  }

  return (
    <img
      src={imageUrl}
      alt={`${name} logo`}
      width={40}
      height={40}
      className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-white/10"
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'low'}
      onError={() => setImageFailed(true)}
    />
  )
}

