type LiveStatusBadgeProps = {
  status: 'live' | 'connecting' | 'offline'
}

export function LiveStatusBadge({ status }: LiveStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
        status === 'live'
          ? 'border-emerald-400/35 bg-emerald-400/10 text-emerald-300'
          : status === 'connecting'
            ? 'border-amber-400/35 bg-amber-400/10 text-amber-300'
            : 'border-rose-400/30 bg-rose-400/10 text-rose-300'
      }`}
    >
      <span
        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
          status === 'live'
            ? 'bg-emerald-300'
            : status === 'connecting'
              ? 'bg-amber-300'
              : 'bg-rose-300'
        }`}
      >
        {status === 'live' && (
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-300/70" />
        )}
      </span>

      {status}
    </span>
  )
}
