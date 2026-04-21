import { Card, CardHeader, CardTitle } from '@/components/ui/card'

type MetricCardProps = {
  label: string
  value: string | number
  helper?: string
}

export function MetricCard({ label, value, helper = ' ' }: MetricCardProps) {
  return (
    <Card className="col-span-1 border-white/10 bg-background/60 backdrop-blur-xl md:col-span-4">
      <CardHeader>
        <p className="small-tracking-title text-xs">{label}</p>

        <CardTitle className="truncate text-3xl leading-tight font-semibold tracking-tight">
          {value}
        </CardTitle>

        <p className="text-xs text-muted-foreground/90 sm:text-sm">{helper}</p>
      </CardHeader>
    </Card>
  )
}
