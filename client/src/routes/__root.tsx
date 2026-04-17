import { ModeToggle } from '@/components/theme/theme-mode-toggle'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

const RootLayout = () => (
  <>
    <div className="p-2 flex justify-start items-center gap-2">
      <ModeToggle />
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>
      <Link to="/validators" className="[&.active]:font-bold">
        Validators
      </Link>
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>
    </div>
    <hr />
    <Outlet />
  </>
)

export const Route = createRootRoute({ component: RootLayout })
