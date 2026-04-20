import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({ component: RootLayout })

function RootLayout() {
  return (
    <div className="app-shell flex min-h-dvh flex-col text-foreground">
      <Header />
      <main className="w-full flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
