import { memo, useEffect, useMemo, useRef } from 'react'
import Globe from 'react-globe.gl'
import type { GlobeMethods } from 'react-globe.gl'
import { TextureLoader, ShaderMaterial, Color, NoColorSpace } from 'three'
import { glassMapFragmentShader, glassMapVertexShader } from './material'
import { EARTH_WATER_MASK_URL, GM_ATMOSPHERE_COLOR, GM_LAND_COLOR, GM_OCEAN_COLOR } from './config'

export const GlobeTest = memo(function GlobeTest() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)

  const globeMaterial = useMemo(() => {
    const textureLoader = new TextureLoader()
    const maskMap = textureLoader.load(EARTH_WATER_MASK_URL)

    maskMap.colorSpace = NoColorSpace

    return new ShaderMaterial({
      uniforms: {
        globeTexture: {
          value: maskMap,
        },
        oceanColor: {
          value: new Color(GM_OCEAN_COLOR),
        },
        landColor: {
          value: new Color(GM_LAND_COLOR),
        },
        glowColor: {
          value: new Color(GM_ATMOSPHERE_COLOR),
        },
      },
      vertexShader: glassMapVertexShader,
      fragmentShader: glassMapFragmentShader,
      transparent: true,
    })
  }, [])

  useEffect(() => {
    const controls = globeRef.current?.controls()
    const globe = globeRef.current

    globe?.pointOfView(
      {
        altitude: 1.75,
      },
      0,
    )

    if (!controls) return

    controls.autoRotate = true
    controls.autoRotateSpeed = 2.5
    controls.minDistance = 200
    controls.maxDistance = 500
  }, [])

  return (
    <div>
      <div className="pointer-events-none absolute left-1/2 top-2/5 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#615fff] opacity-20 blur-[120px]" />
      <Globe
        ref={globeRef}
        backgroundColor="rgba(0,0,0,0)"
        globeMaterial={globeMaterial}
        atmosphereColor={GM_ATMOSPHERE_COLOR}
        atmosphereAltitude={0.14}
        globeOffset={[0, 25]}
        width={900}
        height={600}
        animateIn={true}
      />
    </div>
  )
})
