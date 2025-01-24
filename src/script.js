import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import earthVertexShader from './shaders/earth/vertex.glsl'
import earthFragmentShader from './shaders/earth/fragment.glsl'
import earthAtmosphereVertexShader from './shaders/earthatmosphere/vertex.glsl'
import earthAtmosphereFragmentShader from './shaders/earthatmosphere/fragment.glsl'
import sunVertexShader from './shaders/sun/vertex.glsl'
import sunFragmentShader from './shaders/sun/fragment.glsl'
import sunAtmosphereVertexShader from './shaders/sunatmosphere/vertex.glsl'
import sunAtmosphereFragmentShader from './shaders/sunatmosphere/fragment.glsl'


/**
 * Base
 */
// Debug
// const gui = new GUI() 

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

const sunParameters = {}
sunParameters.atmosphereColor = "#FFCC00"

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

/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 20000
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

// Random particle positions
for (let i = 0; i < count; i++) {
    positions[i * 3] = Math.random() * 100 - 50;  // X
    positions[i * 3 + 1] = Math.random() * 100 - 50;  // Y
    positions[i * 3 + 2] = Math.random() * 100 - 50;  // Z

    colors[i * 3] = Math.random() 
    colors[i * 3 + 1] = Math.random()
    colors[i * 3 + 2] = Math.random()

}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const particlesMaterial = new THREE.PointsMaterial({
    size: 2.0,
    sizeAttenuation: true,
    vertexColors: true
})

const particleTexture = textureLoader.load('/particles/3.png')
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

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
const earthAtmosphereMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    vertexShader: earthAtmosphereVertexShader,
    fragmentShader: earthAtmosphereFragmentShader,
    uniforms:
    {
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        uAtmosphereDayColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereDayColor)),
        uAtmosphereTwilightColor: new THREE.Uniform(new THREE.Color(earthParameters.atmosphereTwilightColor))
    },
})
const earthAtmosphere = new THREE.Mesh(earthGeometry, earthAtmosphereMaterial)
earthAtmosphere.scale.set(1.04, 1.04, 1.04)
scene.add(earthAtmosphere)



/**
 * Sun
 */
const sunGeometry = new THREE.SphereGeometry(2, 64, 64)
const sunMaterial = new THREE.ShaderMaterial({
   vertexShader: sunVertexShader,
   fragmentShader: sunFragmentShader,
   uniforms: {
        uSunTexture: new THREE.Uniform(sunTexture),
        uTime: {value: 0.0},
   }
})

const sun = new THREE.Mesh(sunGeometry, sunMaterial)
sun.scale.set(2, 2, 2)
sun.position.set(20, 0, 0);
scene.add(sun)

const sunAtmosphereMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    vertexShader: sunAtmosphereVertexShader,
    fragmentShader: sunAtmosphereFragmentShader,
    uniforms: {
        uAtmosphereColor: new THREE.Uniform(new THREE.Color(sunParameters.atmosphereColor))
    }
})

const sunAtmosphere = new THREE.Mesh(sunGeometry, sunAtmosphereMaterial)
sunAtmosphere.scale.set(2.1, 2.1, 2.1)
sunAtmosphere.position.set(20, 0, 0);
scene.add(sunAtmosphere)

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
    earthAtmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection)
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

function getFOV(){
    if (window.innerWidth > 768) {
        return 9
    } else {
        return 12
    }
}

const camera = new THREE.PerspectiveCamera(getFOV(), sizes.width / sizes.height, 0.1, 500)
camera.position.x = 77.8
camera.position.y = 16.8
camera.position.z = -16.4
scene.add(camera)

// Add GUI for camera position and FOV
const cameraPosition = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
    fov: camera.fov,
};

// gui.add(cameraPosition, 'x').min(-100).max(100).step(0.1).name('Camera X').onChange(() => {
//     camera.position.x = cameraPosition.x;
// });

// gui.add(cameraPosition, 'y').min(-100).max(100).step(0.1).name('Camera Y').onChange(() => {
//     camera.position.y = cameraPosition.y;
// });

// gui.add(cameraPosition, 'z').min(-100).max(100).step(0.1).name('Camera Z').onChange(() => {
//     camera.position.z = cameraPosition.z;
// });

// // Add FOV control
// gui.add(cameraPosition, 'fov').min(1).max(75).step(1).name('Camera FOV').onChange(() => {
//     camera.fov = cameraPosition.fov;
//     camera.updateProjectionMatrix();
// });

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 10
controls.maxDistance = 200
controls.enablePan = true
controls.enableRotate = true

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

    // Earth Rotation
    earth.rotation.y = elapsedTime * (2 * Math.PI / 50)

    // Sun rotation
    sun.rotation.y = elapsedTime * (2 * Math.PI / 150)

    // Update for sun materials
    sunMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()