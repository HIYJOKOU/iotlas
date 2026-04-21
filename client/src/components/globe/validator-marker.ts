const SINGLE_MARKER_SIZE_PX = 12
const CLUSTER_MARKER_SIZE_PX = 38

function createMarkerShell(size: number, onClick: (event: MouseEvent) => void) {
  const wrapper = document.createElement('div')

  wrapper.style.width = `${size}px`
  wrapper.style.height = `${size}px`

  wrapper.className = [
    'group relative grid place-items-center',
    'cursor-pointer select-none pointer-events-auto',
    'opacity-100',
    'transition-opacity duration-200 ease-out',
  ].join(' ')

  wrapper.addEventListener('click', (event) => {
    event.stopPropagation()
    onClick(event)
  })

  return wrapper
}

export function createValidatorMarker(onClick: (event: MouseEvent) => void) {
  const wrapper = createMarkerShell(SINGLE_MARKER_SIZE_PX, onClick)

  const dot = document.createElement('div')
  const inner = document.createElement('div')

  dot.dataset.markerVisual = 'true'

  dot.className = [
    'validator-marker',
    'grid h-full w-full place-items-center box-border rounded-full',
    'border border-white/25',
    'bg-gradient-to-b from-[#1f2030]/90 to-[#0e0f1a]/95',
    'backdrop-blur-md',
    'transition-[border-color] duration-200 ease-out',
    'group-hover:border-white/35',
  ].join(' ')

  inner.className = [
    'h-[5px] w-[5px] rounded-full',
    'bg-white/90',
    'shadow-md shadow-indigo-400/60',
  ].join(' ')

  dot.appendChild(inner)
  wrapper.appendChild(dot)

  return wrapper
}

export function createValidatorClusterMarker(count: number, onClick: (event: MouseEvent) => void) {
  const wrapper = createMarkerShell(CLUSTER_MARKER_SIZE_PX, onClick)

  const badge = document.createElement('div')
  const label = document.createElement('span')

  badge.dataset.markerVisual = 'true'

  badge.className = [
    'validator-cluster-marker',
    'flex h-full w-full items-center justify-center box-border',
    'rounded-[10px]',
    'border border-white/15',
    'bg-gradient-to-b from-[#1f2030]/95 to-[#0e0f1a]/95',
    'backdrop-blur-lg',
    'transition-[border-color] duration-200 ease-out',
    'group-hover:border-white/30',
  ].join(' ')

  label.className = [
    'validator-cluster-label',
    'block',
    'font-sans text-[15px] font-bold leading-none',
    'text-white/90',
    'tabular-nums',
  ].join(' ')

  label.textContent = String(count)

  badge.appendChild(label)
  wrapper.appendChild(badge)

  return wrapper
}
