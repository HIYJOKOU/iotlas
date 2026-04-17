import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/validators')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/validators"!</div>
}
