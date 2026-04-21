import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

const stackGroups = [
  {
    title: 'Frontend',
    items: ['React 19', 'TypeScript', 'TanStack Router', 'TanStack Query', 'Tailwind CSS'],
  },
  {
    title: 'UI + visuals',
    items: ['shadcn/ui', 'react-globe.gl', 'Three.js'],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Express', '@iota/iota-sdk', 'WebSocket'],
  },
] as const

function RouteComponent() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-white/10 bg-background/70 backdrop-blur-xl">
          <CardHeader>
            <CardDescription className="text-xs small-tracking-title">
              About this project
            </CardDescription>
            <CardTitle className="text-xl font-semibold">gIOTA.live</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <p className="text-sm leading-7 text-muted-foreground">
              gIOTA.live is a recruitment project inspired by{' '}
              <ExternalLink href="https://gmonads.com/">gmonads.com</ExternalLink>, but built around
              the IOTA network. The goal was to create a lightweight dashboard for exploring
              validators and basic network data in a visual form.
            </p>

            <div className="space-y-3">
              <LinkRow label="IOTA" href="https://www.iota.org/" value="Official IOTA website" />
              <LinkRow
                label="IOTA API"
                href="https://docs.iota.org/developer/references/iota-api"
                value="Official IOTA RPC documentation"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-background/70 backdrop-blur-xl">
          <CardHeader>
            <CardDescription className="text-xs small-tracking-title">Stack</CardDescription>
            <CardTitle className="text-xl font-semibold">Technology panel</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {stackGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function LinkRow({ label, href, value }: { label: string; href: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 p-4">
      <p className="text-xs small-tracking-title text-muted-foreground">{label}</p>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex text-sm font-medium text-foreground transition-colors hover:text-indigo-500"
      >
        {value}
      </a>
    </div>
  )
}

function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-foreground underline decoration-white/20 underline-offset-4 transition-colors hover:text-indigo-500"
    >
      {children}
    </a>
  )
}
