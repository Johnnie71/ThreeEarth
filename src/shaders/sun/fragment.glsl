uniform sampler2D uSunTexture;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;


void main() {
  // Sun texture
  vec3 sunColor = texture2D(uSunTexture, vUv).rgb;

  // Normalize the normal for lighting calculations
  vec3 normal = normalize(vNormal);

  // Final color
  gl_FragColor = vec4(sunColor, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}