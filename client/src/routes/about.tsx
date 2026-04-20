import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <Card className="border-white/10 bg-background/60 backdrop-blur-xl">
        <CardHeader className="-gap-1">
          <CardDescription className="text-sm text-muted-foreground">
            About this project
          </CardDescription>
          <CardTitle className="text-lg font-semibold">giota.live</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>
            giota.live is a recruitment project inspired by gmonads.com, built as an interactive
            dashboard for exploring live IOTA validator data.
          </p>

          <p>
            The application displays validators on a responsive 3D globe, and presents network
            information.
          </p>

          <p>
            The project uses React 19, TypeScript, Tailwind CSS, and a dedicated Node.js backend
            layer responsible for fetching, processing, caching, and exposing IOTA network data to
            the frontend.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
