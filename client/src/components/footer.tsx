export function Footer() {
  return (
    <footer className="py-4 text-zinc-600 dark:text-zinc-400 md:py-6">
      <div className="mx-auto w-full max-w-6xl px-3 md:px-4">
        <div className="flex flex-col items-center gap-2 rounded-2xl px-3 py-2 text-center text-sm md:flex-row md:items-center md:justify-between md:gap-3 md:px-4 md:py-3 md:text-sm md:text-left">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-300 md:text-base">
              <span className="text-indigo-600 dark:text-indigo-500">gIOTA.live</span>
              {' - recruitment build'}
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400 md:mt-1 md:text-xs">
              Interactive dashboard for exploring live IOTA validator data.
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <a
              href="https://github.com/hiyjokou/iotlas"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full border border-zinc-950/15 bg-zinc-950/5 px-2.5 py-1 text-xs font-medium text-zinc-700 transition-all hover:-translate-y-px hover:bg-zinc-950/10 hover:text-zinc-950 dark:border-white/15 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 dark:hover:text-white md:px-3 md:py-1.5 md:text-sm"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
