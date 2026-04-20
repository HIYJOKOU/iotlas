import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/validators')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <Card className="border-white/10 bg-background/60 backdrop-blur-xl">
        <CardHeader className="-gap-1">
          <CardDescription className="text-sm text-muted-foreground">Validators</CardDescription>
          <CardTitle className="text-lg font-semibold">giota.live</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>This section is a placeholder for the upcoming validators list</p>
        </CardContent>
      </Card>
    </section>
  )
}
