import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import earthVertexShader from './shaders/earth/vertex.glsl'
import earthFragmentShader from './shaders/earth/fragment.glsl'
import atmosphereVertexShader from './shaders/atmosphere/vertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphere/fragment.glsl'
import sunVertexShader from './shaders/sun/vertex.glsl'
import sunFragmentShader from './shaders/sun/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI() 

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()

/**
 * Earth
 */
const earthParameters = {}
earthParameters.atmosphereDayColor = '#00aaff'
earthParameters.atmosphereTwilightColor = '#ff6600'

// gui
//     .addColor(earthParameters, 'atmosphereDayColor')
//     .onChange(() =>
//     {
//         earthMaterial.uniforms.uAtmosphereDayColor.value.set(earthParameters.atmosphereDayColor)
//         atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(earthParameters.atmosphereDayColor)
//     })

// gui
//     .addColor(earthParameters, 'atmosphereTwilightColor')
//     .onChange(() =>
//     {
//         earthMaterial.uniforms.uAtmosphereTwilightColor.value.set(earthParameters.atmosphereTwilightColor)
//         atmosphereMaterial.uniforms.uAtmosphereTwilightColor.value.set(earthParameters.atmosphereTwilightColor)
//     })


// Textures
const earthDayTexture = textureLoader.load('./earth/day.jpg')
earthDayTexture.colorSpace = THREE.SRGBColorSpace
earthDayTexture.anisotropy = 8

const earthNightTexture = textureLoader.load('./earth/night.jpg')
earthNightTexture.colorSpace = THREE.SRGBColorSpace
earthNightTexture.anisotropy = 8

const earthSpecularCloudsTexture = textureLoader.load('./earth/specularClouds.jpg')
earthSpecularCloudsTexture.anisotropy = 8

const sunTexture = textureLoader.load('./sun/sun.jpg')
sunTexture.colorSpace = THREE.SRGBColorSpace
sunTexture.anisotropy = 8

// Mesh
const earthGeometry = new THREE.SphereGeometry(2, 64, 64)
const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader,
    uniforms:
    {
        uDayTexture: new THREE.Uniform(earthDayTexture),
        uNightTexture: new THREE.Uniform(earthNightTexture),
        uSpecularCloudsTexture: new THREE.Uniform(earthSpecularCloudsTexture),
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
        uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor))
    }
})
const earth = new THREE.Mesh(earthGeometry, earthMaterial)
scene.add(earth)

// Atmosphere
const atmosphereMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    uniforms:
    {
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
        uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor))
    },
})
const atmosphere = new THREE.Mesh(earthGeometry, atmosphereMaterial)
atmosphere.scale.set(1.04, 1.04, 1.04)
scene.add(atmosphere)



/**
 * Sun
 */
const sunGeometry = new THREE.SphereGeometry(2, 10, 10)
const sunMaterial = new THREE.ShaderMaterial({
   vertexShader: sunVertexShader,
   fragmentShader: sunFragmentShader,
   uniforms: {
        uSunTexture: new THREE.Uniform(sunTexture)
   }
})

const sun = new THREE.Mesh(sunGeometry, sunMaterial)
sun.scale.set(2, 2, 2)
sun.position.set(20, 0, 0);
scene.add(sun)

const sunSpherical = new THREE.Spherical(1, Math.PI * 0.5)
const sunDirection = new THREE.Vector3()

// Debug Sun
const debugSun = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.1, 2),
    new THREE.MeshBasicMaterial()
)

// Update
const updateSun = () => {
    // Sun direction
    const sunDirection = sun.position.clone().normalize();
    //debug
    debugSun.position
        .copy(sun.position)
        .multiplyScalar(5)
    
    // Uniforms
    earthMaterial.uniforms.uSunDirection.value.copy(sunDirection)
    atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection)
}

updateSun()

//Tweaks
// gui
//     .add(sunSpherical, 'phi')
//     .min(0)
//     .max(Math.PI)
//     .onChange(updateSun)

// gui
//     .add(sunSpherical, 'theta')
//     .min(- Math.PI)
//     .max(Math.PI)
//     .onChange(updateSun)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -42.2
camera.position.y = 7
camera.position.z = -21.3
scene.add(camera)

// const earthOffset = new THREE.Vector3(-10, 5, 10); // Offset for positioning behind and above the Earth
// const targetPosition = new THREE.Vector3().addVectors(earth.position, earthOffset);
// camera.position.copy(targetPosition);
// camera.lookAt(earth.position); // Ensure the camera looks at the Earth

// GUI controls for camera position
const cameraOffset = {
    x: -42.2,
    y: 7,
    z: -21.3,
};

gui.add(cameraOffset, 'x').min(-50).max(50).step(0.1).name('Camera Offset X').onChange(() => {
    const targetPosition = new THREE.Vector3(cameraOffset.x, cameraOffset.y, cameraOffset.z).add(earth.position);
    camera.position.copy(targetPosition);
    camera.lookAt(earth.position);
});

gui.add(cameraOffset, 'y').min(-50).max(50).step(0.1).name('Camera Offset Y').onChange(() => {
    const targetPosition = new THREE.Vector3(cameraOffset.x, cameraOffset.y, cameraOffset.z).add(earth.position);
    camera.position.copy(targetPosition);
    camera.lookAt(earth.position);
});

gui.add(cameraOffset, 'z').min(-50).max(50).step(0.1).name('Camera Offset Z').onChange(() => {
    const targetPosition = new THREE.Vector3(cameraOffset.x, cameraOffset.y, cameraOffset.z).add(earth.position);
    camera.position.copy(targetPosition);
    camera.lookAt(earth.position);
});

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 10
controls.maxDistance = 50

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)
renderer.setClearColor('#000011')

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    earth.rotation.y = elapsedTime * 0.1

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()