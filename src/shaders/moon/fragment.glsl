varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform sampler2D uMoonTexture;
uniform vec3 uSunDirection;  // Direction of the sun
uniform vec3 uCameraPosition; // Camera position to calculate the view direction

void main()
{
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - uCameraPosition);
    
    // Sunlight illumination on the moon: Dot product of the sun's direction and the moon's normal
    float sunOrientation = dot(normal, uSunDirection);
    
    // Determine whether the moon is in daylight (this could be based on whether sunOrientation is positive or negative)
    float darkSideBrightness = 0.01; // Adjust this value to control how much light is added to the dark side
    float dayMix = smoothstep(0.0, 1.0, sunOrientation) + darkSideBrightness * (1.0 - smoothstep(-0.25, 0.5, sunOrientation));

    // Modify the moon's texture based on the moon phase
    vec3 moonColor = texture2D(uMoonTexture, vUv).rgb;
    moonColor *= dayMix;  // Dim the moon during daylight (moon is only visible at night)


    // Final color calculation
    gl_FragColor = vec4(moonColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
