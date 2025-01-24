varying vec3 vNormal;
varying vec3 vPosition; 

uniform vec3 uAtmosphereColor;

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = uAtmosphereColor;

    // Apha
    float edgeAlpha = dot(viewDirection, normal);
    edgeAlpha = smoothstep(0.0, 0.6, edgeAlpha);
 
    // Final color
    gl_FragColor = vec4(color, edgeAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}