uniform sampler2D uSunTexture;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;


void main() {
  // Sun texture
  vec3 sunColor = texture2D(uSunTexture, vUv).rgb;

  // Normalize the normal for lighting calculations
  vec3 normal = normalize(vNormal);

  // Add a simple emissive glow effect
  float glow = max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0);
  sunColor += glow * 0.2;

  // Final color
  gl_FragColor = vec4(sunColor, 1.0);
}