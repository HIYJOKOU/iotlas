import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Globe from 'react-globe.gl'
import type { GlobeMethods } from 'react-globe.gl'
import type { ValidatorListItem } from '@/types'
import { Color, NoColorSpace, ShaderMaterial, TextureLoader } from 'three'

import { glassMapFragmentShader, glassMapVertexShader } from './material'
import { ValidatorDropdown } from './validator-dropdown'
import { createValidatorClusterMarker, createValidatorMarker } from './validator-marker'

import type { GlobeValidatorCluster } from '@/types/validator-globe.types'
import {
  clusterValidatorsByDistance,
  getClusterRadiusDeg,
  mapValidatorsToGlobePoints,
} from '@/lib/validator-globe.utils'

type ValidatorGlobeProps = {
  validators: ValidatorListItem[]
}

type GlobeSize = {
  width: number
  height: number
}

const GLOBE_COLORS = {
  land: '#735aed',
  ocean: '#050816',
  atmosphere: '#615fff',
}

const EARTH_WATER_MASK_URL = 'https://unpkg.com/three-globe@2.45.2/example/img/earth-water.png'

function getResponsiveGlobeConfig(width: number) {
  if (width < 640) {
    return {
      altitude: 2.7,
      minDistance: 250,
      maxDistance: 400,
      autoRotateSpeed: 1.2,
      globeOffset: [0, 10] as [number, number],
      dropdownOffsetY: 22,
    }
  }

  if (width < 1024) {
    return {
      altitude: 2.15,
      minDistance: 200,
      maxDistance: 400,
      autoRotateSpeed: 0.5,
      globeOffset: [0, 18] as [number, number],
      dropdownOffsetY: 24,
    }
  }

  return {
    altitude: 1.75,
    minDistance: 200,
    maxDistance: 500,
    autoRotateSpeed: 1.8,
    globeOffset: [0, 25] as [number, number],
    dropdownOffsetY: 28,
  }
}

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState<GlobeSize | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      const width = Math.floor(entry.contentRect.width)
      const height = Math.floor(entry.contentRect.height)

      if (width <= 0 || height <= 0) return

      setSize((current) => {
        if (current?.width === width && current.height === height) return current
        return { width, height }
      })
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return [ref, size] as const
}

function createGlobeMaterial() {
  const textureLoader = new TextureLoader()
  const maskMap = textureLoader.load(EARTH_WATER_MASK_URL)

  maskMap.colorSpace = NoColorSpace

  return new ShaderMaterial({
    uniforms: {
      globeTexture: { value: maskMap },
      oceanColor: { value: new Color(GLOBE_COLORS.ocean) },
      landColor: { value: new Color(GLOBE_COLORS.land) },
      glowColor: { value: new Color(GLOBE_COLORS.atmosphere) },
    },
    vertexShader: glassMapVertexShader,
    fragmentShader: glassMapFragmentShader,
    transparent: true,
  })
}

export const ValidatorGlobe = memo(function ValidatorGlobe({ validators }: ValidatorGlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const globeStageRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const lastControlsDistanceRef = useRef<number | null>(null)

  const [containerRef, size] = useElementSize<HTMLDivElement>()

  const [clusterRadiusDeg, setClusterRadiusDeg] = useState(12)
  const [selectedCluster, setSelectedCluster] = useState<GlobeValidatorCluster | null>(null)

  const responsiveConfig = useMemo(
    () => getResponsiveGlobeConfig(size?.width ?? 900),
    [size?.width],
  )

  const points = useMemo(() => mapValidatorsToGlobePoints(validators), [validators])

  const clusteredPoints = useMemo(
    () => clusterValidatorsByDistance(points, clusterRadiusDeg),
    [points, clusterRadiusDeg],
  )

  const globeMaterial = useMemo(() => createGlobeMaterial(), [])

  const focusCluster = useCallback((cluster: GlobeValidatorCluster) => {
    const globe = globeRef.current
    if (!globe) return

    const currentView = globe.pointOfView()

    globe.pointOfView(
      {
        lat: cluster.lat,
        lng: cluster.lng,
        altitude: currentView.altitude,
      },
      700,
    )
  }, [])

  const closeDropdown = useCallback(() => {
    setSelectedCluster(null)
    dropdownRef.current?.style.setProperty('opacity', '0')
  }, [])

  const openDropdown = useCallback(
    (cluster: GlobeValidatorCluster, event: MouseEvent) => {
      event.stopPropagation()

      focusCluster(cluster)
      setSelectedCluster(cluster)
    },
    [focusCluster],
  )

  const getClusterScreenPosition = useCallback((cluster: GlobeValidatorCluster) => {
    const stage = globeStageRef.current
    const globe = globeRef.current

    if (!stage || !globe) return null

    const stageRect = stage.getBoundingClientRect()
    const screen = globe.getScreenCoords(cluster.lat, cluster.lng, 0.012)

    if (!screen || Number.isNaN(screen.x) || Number.isNaN(screen.y)) return null

    return {
      x: stageRect.left + screen.x,
      y: stageRect.top + screen.y,
    }
  }, [])

  const renderHtmlElement = useCallback(
    (point: object) => {
      const cluster = point as GlobeValidatorCluster

      if (cluster.count > 1) {
        return createValidatorClusterMarker(cluster.count, (event) => {
          openDropdown(cluster, event)
        })
      }

      return createValidatorMarker((event) => {
        openDropdown(cluster, event)
      })
    },
    [openDropdown],
  )

  const modifyHtmlElementVisibility = useCallback((element: HTMLElement, isVisible: boolean) => {
    element.style.opacity = isVisible ? '1' : '0'
    element.style.pointerEvents = isVisible ? 'auto' : 'none'
  }, [])

  useEffect(() => {
    return () => {
      globeMaterial.dispose()
    }
  }, [globeMaterial])

  useEffect(() => {
    if (!size) return

    const globe = globeRef.current
    const controls = globe?.controls()

    globe?.pointOfView({ altitude: responsiveConfig.altitude }, 0)

    if (!controls) return

    controls.autoRotate = true
    controls.autoRotateSpeed = responsiveConfig.autoRotateSpeed
    controls.minDistance = responsiveConfig.minDistance
    controls.maxDistance = responsiveConfig.maxDistance
    controls.enablePan = false
    controls.enableZoom = true
    controls.enableDamping = true
    controls.dampingFactor = 0.06

    let frameId = 0

    const updateClusterRadius = () => {
      cancelAnimationFrame(frameId)

      frameId = requestAnimationFrame(() => {
        const distance = controls.object.position.distanceTo(controls.target)
        const previousDistance = lastControlsDistanceRef.current

        if (previousDistance !== null && Math.abs(previousDistance - distance) < 2) {
          return
        }

        lastControlsDistanceRef.current = distance

        const nextRadius = getClusterRadiusDeg(distance)

        setClusterRadiusDeg((current) => {
          if (current === nextRadius) return current
          return nextRadius
        })
      })
    }

    controls.addEventListener('change', updateClusterRadius)
    updateClusterRadius()

    return () => {
      cancelAnimationFrame(frameId)
      controls.removeEventListener('change', updateClusterRadius)
    }
  }, [size, responsiveConfig])

  useEffect(() => {
    if (!selectedCluster) return

    let frameId = 0

    const updateDropdownPosition = () => {
      const dropdown = dropdownRef.current

      if (!dropdown) {
        frameId = requestAnimationFrame(updateDropdownPosition)
        return
      }

      const isMobile = window.innerWidth < 640

      if (isMobile) {
        dropdown.style.transform = 'none'
        dropdown.style.opacity = '1'
        frameId = requestAnimationFrame(updateDropdownPosition)
        return
      }

      const position = getClusterScreenPosition(selectedCluster)

      if (position) {
        dropdown.style.transform = `translate3d(${position.x}px, ${
          position.y + responsiveConfig.dropdownOffsetY
        }px, 0) translateX(-50%)`

        dropdown.style.opacity = '1'
      }

      frameId = requestAnimationFrame(updateDropdownPosition)
    }

    updateDropdownPosition()

    return () => cancelAnimationFrame(frameId)
  }, [selectedCluster, responsiveConfig.dropdownOffsetY, getClusterScreenPosition])

  return (
    <>
      <div
        ref={containerRef}
        className="relative mx-auto h-107.5 w-full max-w-225 overflow-hidden sm:h-130 md:h-150"
        onClick={closeDropdown}
      >
        <div
          ref={globeStageRef}
          className="absolute inset-0 z-10 -translate-y-4 sm:-translate-y-6 md:-translate-y-8"
        >
          {size && (
            <Globe
              ref={globeRef}
              backgroundColor="rgba(0,0,0,0)"
              globeMaterial={globeMaterial}
              atmosphereColor={GLOBE_COLORS.atmosphere}
              atmosphereAltitude={0.14}
              globeOffset={responsiveConfig.globeOffset}
              width={size.width}
              height={size.height}
              htmlElementsData={clusteredPoints}
              htmlLat="lat"
              htmlLng="lng"
              htmlAltitude={0.012}
              htmlTransitionDuration={0}
              htmlElement={renderHtmlElement}
              htmlElementVisibilityModifier={modifyHtmlElementVisibility}
            />
          )}
        </div>
      </div>

      {selectedCluster &&
        createPortal(
          <ValidatorDropdown
            cluster={selectedCluster}
            dropdownRef={dropdownRef}
            onClose={closeDropdown}
          />,
          document.body,
        )}
    </>
  )
})
