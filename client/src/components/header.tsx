import { NetworkSelect } from '@/components/network/network-select'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export function Header() {
  return (
    <header className="sticky top-0 z-40  bg-zinc-950/15 backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 md:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center gap-3 md:justify-self-start">
          <Link
            to="/"
            className="group flex items-center gap-1 pr-2 text-xl font-extrabold tracking-tight transition-all duration-300 hover:scale-101"
          >
            <LogoIcon className="h-7 w-7 shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 text-indigo-700" />

            <span className="text-zinc-950 dark:text-zinc-100">
              gIOTA
              <span className="text-indigo-700">.live</span>
            </span>
          </Link>
        </div>

        <div className="col-span-2 row-start-2 justify-self-center md:col-span-1 md:row-start-auto md:justify-self-center">
          <nav className="inline-flex items-center gap-2 whitespace-nowrap md:gap-3">
            <NavPillLink to="/">Home</NavPillLink>
            <NavPillLink to="/validators">Validators</NavPillLink>
            <NavPillLink to="/about">About</NavPillLink>
          </nav>
        </div>

        <div className="relative justify-self-end">
          <div className="pointer-events-none absolute -inset-x-4 -top-2 h-7 rounded-full bg-indigo-500/40 blur-2xl" />
          <div className="relative">
            <NetworkSelect />
          </div>
        </div>
      </div>
    </header>
  )
}

type NavPillLinkProps = {
  to: '/' | '/validators' | '/about'
  children: ReactNode
}

function NavPillLink({ to, children }: NavPillLinkProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center whitespace-nowrap rounded-lg border border-transparent px-2.5 py-1.5 text-sm font-medium text-zinc-500 transition-all duration-300 ease-out hover:-translate-y-px hover:bg-zinc-950/8 hover:text-zinc-950 hover:backdrop-blur-md dark:text-zinc-400 dark:hover:bg-white/8 dark:hover:text-zinc-100 [&.active]:-translate-y-px [&.active]:border-zinc-950/15 [&.active]:bg-zinc-950/10 [&.active]:text-zinc-950 [&.active]:shadow-(--nav-pill-active-shadow) [&.active]:backdrop-blur-md dark:[&.active]:border-white/15 dark:[&.active]:bg-white/10 dark:[&.active]:text-white"
    >
      {children}
    </Link>
  )
}

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="28" fill="currentColor" />

      <path
        d="M32 14C33.9 24.1 39.9 30.1 50 32C39.9 33.9 33.9 39.9 32 50C30.1 39.9 24.1 33.9 14 32C24.1 30.1 30.1 24.1 32 14Z"
        fill="white"
      />
    </svg>
  )
}
