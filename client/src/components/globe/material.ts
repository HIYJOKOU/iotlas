export const glassMapVertexShader = `
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const glassMapFragmentShader = `
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
