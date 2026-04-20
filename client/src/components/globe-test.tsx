import { useEffect, useMemo, useRef } from 'react'
import Globe from 'react-globe.gl'
import * as THREE from 'three'

const GM_LAND_COLOR = '#735aed'
const GM_OCEAN_COLOR = '#050816'
const GM_ATMOSPHERE_COLOR = '#615fff'

const EARTH_WATER_MASK_URL = 'https://unpkg.com/three-globe@2.45.2/example/img/earth-water.png'

const glassMapVertexShader = `
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const glassMapFragmentShader = `
  uniform sampler2D globeTexture;

  uniform vec3 oceanColor;
  uniform vec3 landColor;
  uniform vec3 glowColor;

  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    float mask = texture2D(globeTexture, vUv).r;

    float waterMask = smoothstep(0.45, 0.55, mask);
    float landMask = 1.0 - waterMask;

    float viewDot = max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);

    float rim = 1.0 - viewDot;
    float fresnel = pow(rim, 2.1);

    vec3 color = mix(landColor, oceanColor, waterMask);

    color += landColor * landMask * 0.18;
    color += landColor * landMask * viewDot * 0.12;

    color += oceanColor * waterMask * 0.08;
    color += glowColor * fresnel * 0.9;

    color *= 0.52 + viewDot * 0.55;

    float alpha = 0.86 + fresnel * 0.12;

    gl_FragColor = vec4(color, alpha);
  }
`

export function GlobeTest() {
  const globeRef = useRef<any>(null)

  const globeMaterial = useMemo(() => {
    const textureLoader = new THREE.TextureLoader()
    const maskMap = textureLoader.load(EARTH_WATER_MASK_URL)

    maskMap.colorSpace = THREE.NoColorSpace

    return new THREE.ShaderMaterial({
      uniforms: {
        globeTexture: {
          value: maskMap,
        },
        oceanColor: {
          value: new THREE.Color(GM_OCEAN_COLOR),
        },
        landColor: {
          value: new THREE.Color(GM_LAND_COLOR),
        },
        glowColor: {
          value: new THREE.Color(GM_ATMOSPHERE_COLOR),
        },
      },
      vertexShader: glassMapVertexShader,
      fragmentShader: glassMapFragmentShader,
      transparent: true,
    })
  }, [])

  useEffect(() => {
    const controls = globeRef.current?.controls()

    if (!controls) return

    controls.autoRotate = true
    controls.autoRotateSpeed = 5
    controls.minDistance = 200
    controls.maxDistance = 500
  }, [])

  return (
    <Globe
      ref={globeRef}
      backgroundColor="rgba(0,0,0,0)"
      globeMaterial={globeMaterial}
      atmosphereColor={GM_ATMOSPHERE_COLOR}
      atmosphereAltitude={0.14}
      width={500}
      height={300}
    />
  )
}
