import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/validators')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-2">
      <h3>Welcome /validators</h3>
    </div>
  )
}
