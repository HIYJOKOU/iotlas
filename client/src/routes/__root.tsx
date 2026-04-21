import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Link, createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
})

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

function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[55vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <p className="text-xl uppercase tracking-[0.2em] text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold sm:text-4xl">Page not found</h1>
    </section>
  )
}
