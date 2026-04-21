import { ScrollArea } from '@/components/ui/scroll-area'
import { formatVotingPower, getValidatorLocation, shortAddress } from '@/lib/validator-globe.utils'
import type { GlobeValidatorCluster } from '@/types/validator-globe.types'
import { useEffect, type RefObject } from 'react'
import { Button } from '../ui/button'

type ValidatorDropdownProps = {
  cluster: GlobeValidatorCluster
  dropdownRef: RefObject<HTMLDivElement | null>
  onClose: () => void
}

type Validator = GlobeValidatorCluster['validators'][number]

function ValidatorAvatar({ validator }: { validator: Validator }) {
  return (
    <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
      {validator.imageUrl ? (
        <img
          src={validator.imageUrl}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="h-3 w-3 rounded-full bg-white/80 shadow-lg" />
      )}
    </div>
  )
}

function ValidatorCard({ validator }: { validator: Validator }) {
  const name = validator.name || shortAddress(validator.iotaAddress)
  const location = getValidatorLocation(validator)
  const votingPower = formatVotingPower(validator.votingPower)

  const card = (
    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-3 transition hover:border-white/20 hover:bg-white/10">
      <div className="flex items-start gap-3">
        <ValidatorAvatar validator={validator} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white/90">{name}</div>
              <div className="mt-0.5 truncate text-xs text-white/50">{location}</div>
            </div>

            {votingPower && (
              <div className="shrink-0 rounded-md border border-white/10 bg-black/30 px-1.5 py-0.5 text-xs font-medium text-white/50">
                VP {votingPower}
              </div>
            )}
          </div>

          <div className="mt-2 truncate font-mono text-xs text-white/30">
            {shortAddress(validator.iotaAddress)}
          </div>
        </div>
      </div>
    </div>
  )

  if (!validator.projectUrl) return card

  return (
    <a href={validator.projectUrl} target="_blank" rel="noreferrer" className="block">
      {card}
    </a>
  )
}

export function ValidatorDropdown({ cluster, dropdownRef, onClose }: ValidatorDropdownProps) {
  const validators = cluster.validators
  const firstValidator = validators[0]
  const isSingleValidator = validators.length === 1

  useEffect(() => {
    if (window.innerWidth >= 640) return

    const bodyStyle = document.body.style
    const htmlStyle = document.documentElement.style

    const previousBodyOverflow = bodyStyle.overflow
    const previousHtmlOverflow = htmlStyle.overflow
    const previousBodyOverscrollBehavior = bodyStyle.overscrollBehavior
    const previousHtmlOverscrollBehavior = htmlStyle.overscrollBehavior

    bodyStyle.overflow = 'hidden'
    htmlStyle.overflow = 'hidden'
    bodyStyle.overscrollBehavior = 'none'
    htmlStyle.overscrollBehavior = 'none'

    return () => {
      bodyStyle.overflow = previousBodyOverflow
      htmlStyle.overflow = previousHtmlOverflow
      bodyStyle.overscrollBehavior = previousBodyOverscrollBehavior
      htmlStyle.overscrollBehavior = previousHtmlOverscrollBehavior
    }
  }, [])

  const title = isSingleValidator
    ? firstValidator?.name || shortAddress(firstValidator?.iotaAddress)
    : `${validators.length} validators in this area`

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm sm:hidden"
        onClick={onClose}
      />

      <div
        ref={dropdownRef}
        className={[
          'pointer-events-auto z-50 overflow-hidden text-white',
          'border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur-xl',
          'fixed inset-x-3 bottom-3 max-h-[70dvh] rounded-2xl',
          'sm:fixed sm:left-0 sm:top-0 sm:bottom-auto sm:inset-x-auto',
          'sm:w-85 sm:max-w-sm sm:rounded-xl sm:opacity-0',
        ].join(' ')}
        style={{
          transform: 'translateX(-50%)',
        }}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
        onWheel={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="min-w-0">
            <div className="text-xs font-medium uppercase tracking-widest text-white/40">
              {isSingleValidator ? 'Validator' : 'Validator cluster'}
            </div>

            <div className="mt-1 truncate text-sm font-semibold text-white">{title}</div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-white/40 hover:bg-white/10 hover:text-white"
            onClick={onClose}
          >
            x
          </Button>
        </div>

        <div className="bg-black/30">
          <ScrollArea className={isSingleValidator ? 'max-h-[52dvh]' : 'h-[52dvh] sm:h-72'}>
            <div className="flex flex-col gap-2 p-3">
              {validators.map((validator) => (
                <ValidatorCard key={validator.id} validator={validator} />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  )
}
