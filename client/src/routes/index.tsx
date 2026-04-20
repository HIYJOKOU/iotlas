import { createFileRoute } from '@tanstack/react-router'
import { useHomeOverview } from '@/hooks/use-home-overview'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GlobeTest } from '@/components/globe-test'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { network, data, error, isLoading, refresh } = useHomeOverview()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <div className="flex justify-center items-center pb-4">
        <GlobeTest />
      </div>
      <section className="relative z-20 mx-auto grid w-full max-w-6xl gap-4 px-4 pb-10 md:grid-cols-3 md:px-6">
        <Card className="border-white/10 bg-background/60 backdrop-blur-xl">
          <CardHeader>
            <CardDescription className="text-sm text-muted-foreground">Status</CardDescription>
            <CardTitle className="text-lg font-medium">
              {isLoading ? 'Loading overview...' : error ? 'Error' : 'Ready'}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-white/10 bg-background/60 backdrop-blur-xl">
          <CardHeader>
            <CardDescription className="text-sm text-muted-foreground">Validators</CardDescription>
            <CardTitle className="text-lg font-medium">{data?.stats.total ?? '-'}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-white/10 bg-background/60 backdrop-blur-xl">
          <CardHeader>
            <CardDescription className="text-sm text-muted-foreground">Epoch</CardDescription>
            <CardTitle className="text-lg font-medium">{data?.epoch ?? '-'}</CardTitle>
          </CardHeader>
        </Card>
      </section>
      <section className="relative z-20 mx-auto w-full max-w-6xl px-4 pb-16 md:px-6">
        <Card className="border-white/10 bg-background/60 backdrop-blur-xl">
          <CardHeader className="-gap-1">
            <div className="flex items-center justify-between gap-3">
              <CardDescription className="text-sm text-muted-foreground">
                Backend response
              </CardDescription>
              <Button variant="secondary" type="button" onClick={refresh} disabled={isLoading}>
                Refresh
              </Button>
            </div>
            <CardTitle className="text-lg font-semibold">/api/{network}/home</CardTitle>
          </CardHeader>
        </Card>
      </section>
    </div>
  )
}
