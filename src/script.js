import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import Rocket from './Physics/rocket'
import vector from "./Physics/vector";

/**
 * Debug
 */
const gui = new dat.GUI({ width: 400 })

let up = 4;
let radius = 1.5;
let h = 5;
const rocket1 = new THREE.Group()
const rocket2 = new THREE.Group()
let rotation = 0;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')
    // window.addEventListener("load", init, false);


// Scene
const scene = new THREE.Scene()
const textureLoader = new THREE.TextureLoader()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.1)
directionalLight.position.set(5, 5, 3)
scene.add(directionalLight)


const createScene = () => {


    // TEXTURE TO ENVIRONMENT

    let materialArray = [];
    let materialArray1 = [];

    const environmet1Texture = textureLoader.load('/textures/environment/meadow_ft.jpg')
    const environmet2Texture = textureLoader.load('/textures/environment/meadow_bk.jpg')
    const environmet3Texture = textureLoader.load('/textures/environment/meadow_up.jpg')
    const environmet4Texture = textureLoader.load('/textures/environment/meadow_dn.jpg')
    const environmet5Texture = textureLoader.load('/textures/environment/meadow_rt.jpg')
    const environmet6Texture = textureLoader.load('/textures/environment/meadow_lf.jpg')
    const earthTexture = textureLoader.load('/textures/environment/earth.jpg')

    materialArray.push(new THREE.MeshBasicMaterial({ map: environmet1Texture }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: environmet2Texture }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: environmet3Texture }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: environmet4Texture }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: environmet5Texture }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: environmet6Texture }));

    materialArray1.push(new THREE.MeshBasicMaterial({ map: environmet3Texture }));
    materialArray1.push(new THREE.MeshBasicMaterial({ map: environmet3Texture }));
    materialArray1.push(new THREE.MeshBasicMaterial({ map: environmet3Texture }));
    materialArray1.push(new THREE.MeshBasicMaterial({ map: environmet3Texture }));
    materialArray1.push(new THREE.MeshBasicMaterial({ map: environmet3Texture }));
    materialArray1.push(new THREE.MeshBasicMaterial({ map: environmet3Texture }));


    for (let i = 0; i < 6; i++)
        materialArray[i].side = THREE.BackSide;
    let skyboxGeo = new THREE.BoxGeometry(820, 120, 850);
    let skybox = new THREE.Mesh(skyboxGeo, materialArray);
    skybox.position.y = 57;


    for (let i = 0; i < 6; i++)
        materialArray1[i].side = THREE.BackSide;
    let outskyboxGeo = new THREE.SphereGeometry(820, 420, 150);
    let skybox1 = new THREE.Mesh(outskyboxGeo, materialArray1);
    skybox1.position.y = 247;

    // earth geometry
    const earthGeometry = new THREE.Mesh(
        new THREE.SphereGeometry(820, 900, 900),
        new THREE.MeshStandardMaterial({
            roughness: 1,
            metalness: 0,
            map: earthTexture,
            bumpMap: earthTexture,
            bumpScale: 0.3
        }));
    earthGeometry.position.y = 250;


    scene.add(skybox);
    scene.add(skybox1);
    scene.add(earthGeometry);


}


const createRocket1 = () => {
    const rocket1MetrialTexture = textureLoader.load('static/textures/rocket/bodyRocket1/Material.jpg');
    const rocket1ColorTexture = textureLoader.load('/textures/rocket/bodyRocket1/basecolor.jpg');

    const rocket1AmbientTexture = textureLoader.load('/textures/rocket/bodyRocket1/ambientOcclusion.jpg');
    const rocket1EmissiveTexture = textureLoader.load('/textures/rocket/bodyRocket1/emissive.jpg');
    const rocket1HeightTexture = textureLoader.load('/textures/rocket/bodyRocket1/height.png');
    const rocket1NormalTexture = textureLoader.load('/textures/rocket/bodyRocket1/normal.jpg');
    const rocket1opacityTexture = textureLoader.load('/textures/rocket/bodyRocket1/opacity.jpg');
    const rocket1roughnessTexture = textureLoader.load('/textures/rocket/bodyRocket1/roughness.jpg');
    const celingroughnessTexture = textureLoader.load('/textures/rocket/bodyRocket1/Ceiling_Roughness.jpg');
    const celingHeightTexture = textureLoader.load('/textures/rocket/bodyRocket1/Ceiling_Height.png');
    const celingBaseColorTexture = textureLoader.load('/textures/rocket/bodyRocket1/Ceiling_Base_Color.jpg');
    const celingEmissiveTexture = textureLoader.load('/textures/rocket/bodyRocket1/Ceiling_emissive.jpg');
    const celingAmbientTexture = textureLoader.load('/textures/rocket/bodyRocket1/Ceiling_ambientOcclusion.png');
    const celingMaterialTexture = textureLoader.load('static/textures/rocket/bodyRocket1/Ceiling_Material.png');

    // Group
    const rocket1 = new THREE.Group()
    rocket1.rotateY(Math.PI / 2)
    scene.add(rocket1)

    const launchCylinder1 = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius - 0.5, radius - 0.5, h - 4.8, 50),
        new THREE.MeshBasicMaterial({ color: 0xff0000 }));

    const launchCylinder2 = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius - 0.25, radius - 0.25, 0.4, 50),
        new THREE.MeshStandardMaterial({
            map: rocket1ColorTexture,
            normalMap: rocket1NormalTexture,
            metalnessMap: rocket1MetrialTexture,
            metalness: 0.1,
            aoMap: rocket1AmbientTexture,
            roughnessMap: rocket1roughnessTexture,
            roughness: 32,
            opacity: rocket1opacityTexture,
            emissive: rocket1EmissiveTexture,
        }));

    const bodyrocket = new THREE.Group()
    scene.add(bodyrocket);

    const bodyCylinder1 = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius, radius, h, 50),
        new THREE.MeshStandardMaterial({
            map: rocket1ColorTexture,
            normalMap: rocket1NormalTexture,
            metalnessMap: rocket1MetrialTexture,
            metalness: 0.1,
            aoMap: rocket1AmbientTexture,
            roughnessMap: rocket1roughnessTexture,
            roughness: 32,
            opacity: rocket1opacityTexture,
            emissive: rocket1EmissiveTexture,
        }));

    const rollCylinder1 = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius, radius, h - 4, 50),
        new THREE.MeshStandardMaterial({
            map: celingBaseColorTexture,
            metalnessMap: celingMaterialTexture,
            metalness: 0.1,
            roughnessMap: celingroughnessTexture,
            roughness: 32,
            emissive: celingEmissiveTexture,

        }));
    const bodyCylinder2 = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius, radius, h - 1, 50),
        new THREE.MeshStandardMaterial({
            map: rocket1ColorTexture,
            normalMap: rocket1NormalTexture,
            metalnessMap: rocket1MetrialTexture,
            metalness: 0.1,
            aoMap: rocket1AmbientTexture,
            roughnessMap: rocket1roughnessTexture,
            roughness: 32,
            opacity: rocket1opacityTexture,
            emissive: rocket1EmissiveTexture,

        }));

    const rollCylinder2 = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius, radius, h - 4, 50),
        new THREE.MeshStandardMaterial({
            map: celingBaseColorTexture,
            metalnessMap: celingMaterialTexture,
            metalness: 0.1,
            displacementMap: celingHeightTexture,
            displacementScale: 0.002,
            roughnessMap: celingroughnessTexture,
            roughness: 32,
            emissive: celingEmissiveTexture,

        }));

    const bodyCylinder3 = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius, radius, h - 1, 50),
        new THREE.MeshStandardMaterial({
            map: rocket1ColorTexture,
            normalMap: rocket1NormalTexture,
            metalnessMap: rocket1MetrialTexture,
            metalness: 0.1,
            aoMap: rocket1AmbientTexture,
            roughnessMap: rocket1roughnessTexture,
            roughness: 2,
            opacity: rocket1opacityTexture,
            emissive: rocket1EmissiveTexture,

        }));

    const rollCylinder3 = new THREE.Mesh(new THREE.CylinderBufferGeometry(radius, radius, h - 4, 50),
        new THREE.MeshStandardMaterial({
            map: celingBaseColorTexture,
            metalnessMap: celingMaterialTexture,
            metalness: 0.1,
            displacementMap: celingHeightTexture,
            displacementScale: 0.002,
            roughnessMap: celingroughnessTexture,
            roughness: 32,
            emissive: celingEmissiveTexture,
        }));

    const headRocket = new THREE.Mesh(new THREE.SphereGeometry(radius, h + 15, 12),
        new THREE.MeshStandardMaterial({
            map: rocket1ColorTexture,
            normalMap: rocket1NormalTexture,
            metalnessMap: rocket1MetrialTexture,
            metalness: 0.1,

            roughnessMap: rocket1roughnessTexture,
            roughness: 32,
            opacity: rocket1opacityTexture,
            emissive: rocket1EmissiveTexture,

        }));

    // Add all Rocket in one body
    rocket1.add(launchCylinder1);
    rocket1.add(launchCylinder2);
    rocket1.add(bodyCylinder1);
    rocket1.add(rollCylinder1);
    rocket1.add(bodyCylinder2);
    rocket1.add(rollCylinder2);
    rocket1.add(bodyCylinder3);
    rocket1.add(rollCylinder3);
    rocket1.add(headRocket);


    launchCylinder1.position.y = 2.3;
    launchCylinder2.position.y = 2.5;
    bodyCylinder1.position.y = 5;
    rollCylinder1.position.y = 8;
    bodyCylinder2.position.y = 10.5;
    rollCylinder2.position.y = 12.7;
    bodyCylinder3.position.y = 15.25;
    rollCylinder3.position.y = 17.7;
    headRocket.position.y = 18.2;

    rocket1.position.y = 0;


}

const createRocket2 = () => {

    // const rocket2MetrialTexture = textureLoader.load('static/textures/rocket/bodyRocket2/Material.jpg');
    const rocket2ColorTexture = textureLoader.load('/textures/rocket/bodyRocket2/Plastic_basecolor.jpg');
    const rocket2AmbientTexture = textureLoader.load('/textures/rocket/bodyRocket2/Plastic_ambientOcclusion.jpg');
    const rocket2NormalTexture = textureLoader.load('/textures/rocket/bodyRocket2/Plastic_normal.jpg');
    const rocket2roughnessTexture = textureLoader.load('/textures/rocket/bodyRocket2/Plastic_roughness.jpg');
    // const rollMetrialTexture = textureLoader.load('static/textures/rocket/bodyRocket2/Material_roll.jpg');
    const rollColorTexture = textureLoader.load('/textures/rocket/bodyRocket2/Metal_basecolor.jpg');
    const rollAmbientTexture = textureLoader.load('/textures/rocket/bodyRocket2/Metal_ambientOcclusion.jpg');
    const rollNormalTexture = textureLoader.load('/textures/rocket/bodyRocket2/Metal_normal.jpg');
    const rollroughnessTexture = textureLoader.load('/textures/rocket/bodyRocket2/Metal_roughness.jpg');

    scene.add(rocket2);


    const baseColumn1 = new THREE.Mesh(
        new THREE.CylinderGeometry(radius - 0.9, radius - 0.3, h - 4, 50),
        new THREE.MeshStandardMaterial({
            map: rollColorTexture,
            normalMap: rollNormalTexture,
            // metalnessMap: rollMetrialTexture,
            // metalness: 1.1,
            aoMap: rollAmbientTexture,
            roughnessMap: rollroughnessTexture,
            roughness: 32,

        }));

    const body1 = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, h, 50),
        new THREE.MeshStandardMaterial({
            map: rocket2ColorTexture,
            normalMap: rocket2NormalTexture,
            // metalnessMap: rocket2MetrialTexture,
            // metalness: 0.1,
            aoMap: rocket2AmbientTexture,
            roughnessMap: rocket2roughnessTexture,
            roughness: 32,

        }));

    const roll1 = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, h - 4.5, 50),
        new THREE.MeshStandardMaterial({
            map: rollColorTexture,
            normalMap: rollNormalTexture,
            // metalnessMap: rollMetrialTexture,
            // metalness: 1.1,
            aoMap: rollAmbientTexture,
            roughnessMap: rollroughnessTexture,
            roughness: 32,

        }));

    const body2 = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, h - 2, 50),
        new THREE.MeshStandardMaterial({
            map: rocket2ColorTexture,
            normalMap: rocket2NormalTexture,
            // metalnessMap: rocket2MetrialTexture,
            // metalness: 0.1,
            aoMap: rocket2AmbientTexture,
            roughnessMap: rocket2roughnessTexture,
            roughness: 32,

        }));

    const roll2 = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, h - 4.5, 50),
        new THREE.MeshStandardMaterial({
            map: rollColorTexture,
            normalMap: rollNormalTexture,
            // metalnessMap: rollMetrialTexture,
            // metalness: 0.1,
            aoMap: rollAmbientTexture,
            roughnessMap: rollroughnessTexture,
            roughness: 32,


        }));

    const body3 = new THREE.Mesh(
        new THREE.CylinderGeometry(radius - 0.4, radius, h - 3.75, 50),
        new THREE.MeshStandardMaterial({
            map: rocket2ColorTexture,
            normalMap: rocket2NormalTexture,
            // metalnessMap: rocket2MetrialTexture,
            // metalness: 0.1,
            aoMap: rocket2AmbientTexture,
            roughnessMap: rocket2roughnessTexture,
            roughness: 32,
        }));

    const roll3 = new THREE.Mesh(
        new THREE.CylinderGeometry(radius - 0.6, radius - 0.33, h - 4.5, 50),
        new THREE.MeshStandardMaterial({
            map: rollColorTexture,
            normalMap: rollNormalTexture,
            // metalnessMap: rollMetrialTexture,
            // metalness: 0.1,
            aoMap: rollAmbientTexture,
            roughnessMap: rollroughnessTexture,
            roughness: 32,
        }));


    const body4 = new THREE.Mesh(
        new THREE.CylinderGeometry(radius - 1.1, radius - 0.6, h - 4.3, 50),
        new THREE.MeshStandardMaterial({
            map: rocket2ColorTexture,
            normalMap: rocket2NormalTexture,
            // metalnessMap: rocket2MetrialTexture,
            // metalness: 0.1,
            aoMap: rocket2AmbientTexture,
            roughnessMap: rocket2roughnessTexture,
            roughness: 32,
        }));
    const header = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, radius - 1, h - 4.4, 50),
        new THREE.MeshStandardMaterial({
            map: rocket2ColorTexture,
            normalMap: rocket2NormalTexture,
            // metalnessMap: rocket2MetrialTexture,
            // metalness: 0.1,
            aoMap: rocket2AmbientTexture,
            roughnessMap: rocket2roughnessTexture,
            roughness: 32,
        }));

    const mFinLeft = new THREE.Mesh(
        new THREE.BoxGeometry(1, 2.5, 0.3),
        new THREE.MeshStandardMaterial({
            map: rocket2ColorTexture,
            normalMap: rocket2NormalTexture,
            // metalnessMap: rocket2MetrialTexture,
            // metalness: 0.1,
            aoMap: rocket2AmbientTexture,
            roughnessMap: rocket2roughnessTexture,
            roughness: 32,
        }));
    const mFinRight = new THREE.Mesh(
        new THREE.BoxGeometry(1, 2.7, 0.3),
        new THREE.MeshStandardMaterial({
            map: rocket2ColorTexture,
            normalMap: rocket2NormalTexture,
            // metalnessMap: rocket2MetrialTexture,
            // metalness: 0.1,
            aoMap: rocket2AmbientTexture,
            roughnessMap: rocket2roughnessTexture,
            roughness: 32,
        }));
    const engineRight = new THREE.Mesh(
        new THREE.CylinderGeometry(radius - 1.1, radius - 0.9, h - 3, 50),
        new THREE.MeshStandardMaterial({
            map: rocket2ColorTexture,
            normalMap: rocket2NormalTexture,
            // metalnessMap: rocket2MetrialTexture,
            // metalness: 0.1,
            aoMap: rocket2AmbientTexture,
            roughnessMap: rocket2roughnessTexture,
            roughness: 32,
        }));
    const engineLeft = new THREE.Mesh(
        new THREE.CylinderGeometry(radius - 1.1, radius - 0.9, h - 3, 50),
        new THREE.MeshStandardMaterial({
            map: rocket2ColorTexture,
            normalMap: rocket2NormalTexture,
            // metalnessMap: rocket2MetrialTexture,
            // metalness: 0.1,
            aoMap: rocket2AmbientTexture,
            roughnessMap: rocket2roughnessTexture,
            roughness: 32,
        }));


    baseColumn1.position.y = 2.5;
    body1.position.y = 5;
    roll1.position.y = 7.76;
    body2.position.y = 9.5;
    roll2.position.y = 11.2;
    body3.position.y = 12;
    roll3.position.y = 12.7;
    body4.position.y = 13.3;
    header.position.y = 13.8;
    mFinLeft.position.set(0, 5, 2);
    mFinLeft.rotateX(90);
    mFinLeft.rotateY(11);
    mFinRight.position.set(0, 5, -2);
    mFinRight.rotateX(180);
    mFinRight.rotateY(11);
    engineLeft.position.set(0, 4.5, 3);
    rocket2.position.y = 4;
    engineRight.position.set(0, 4.5, -3);
    rocket2.position.y = up;

    rocket2.add(baseColumn1);
    rocket2.add(body1);
    rocket2.add(roll1);
    rocket2.add(body2);
    rocket2.add(roll2);
    rocket2.add(body3);
    rocket2.add(roll3);
    rocket2.add(body4);
    rocket2.add(header);
    rocket2.add(mFinLeft);
    rocket2.add(mFinRight);
    rocket2.add(engineLeft);
    rocket2.add(engineRight);
    rocket2.position.y = 0;

}

const createLaunch = () => {

    const launchColorTexture = textureLoader.load('/textures/launchpad/launch2/Wall_basecolor.jpg');
    const launchHeightTexture = textureLoader.load('/textures/launchpad/launch2/Wall_height.png');
    const launchNormalTexture = textureLoader.load('/textures/launchpad/launch2/Wall_normal.jpg');
    const launchRoughnessTexture = textureLoader.load('/textures/launchpad/launch2/Wall_roughness.jpg');
    const launchMetrialTexture = textureLoader.load('/textures/launchpad/launch2/Material.jpg');
    // Group
    const lunch = new THREE.Group()
    scene.add(lunch);

    const base = new THREE.Mesh(new THREE.BoxBufferGeometry(20, 5, 20),
        new THREE.MeshStandardMaterial({
            map: launchColorTexture,
            normalMap: launchNormalTexture,
            metalnessMap: launchMetrialTexture,
            metalness: 0.1,
            displacementMap: launchHeightTexture,
            displacementScale: 0.002,
            roughnessMap: launchRoughnessTexture,
            roughness: 32
        }));


    lunch.add(base);

    base.position.y = -0.5;


}

function init() {
    createScene();
    // createRocket1();
    createRocket2();
    createLaunch();

}

init()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000)
camera.position.x = 12
camera.position.y = 4
camera.position.z = 0
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.maxPolarAngle = Math.PI / 3;
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor('#06070E')
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

// rocket object instance
const rocket = new Rocket()

// get inputs
const rocket_panel = gui.addFolder('Rocket Control Panel')
rocket_panel.add(rocket, 'rocket_mass').name('empty rocket mass in (tons)').min(1).max(300).step(1)
rocket_panel.add(rocket, 'fuel_mass')
    .name('initial fuel mass in (tons)')
    .min(0)
    .max(1000).step(1)
    .onFinishChange(() => {
        rocket.total_mass = (rocket.rocket_mass + rocket.fuel_mass) * Math.pow(10, 3)
    })
rocket_panel.add(rocket, 'thrust')
    .name('thrust')
    .min(1)
    .max(35)
    .step(0.001)
    .onFinishChange(() => {
        rocket.total_mass = (rocket.rocket_mass + rocket.fuel_mass) * Math.pow(10, 3)
    }) // in a thousand of newtons

rocket_panel.add(rocket, 'nozzle_angle')
    .name('nozzle angle (XY)')
    .min(-Math.PI * (1 / 6))
    .max(Math.PI * (1 / 6))
    .step(0.001)
rocket_panel.add(rocket, 'rocket_length').name('height rocket').min(3).max(15).step(0.1).onChange(() => {
    h = rocket.rocket_length
})

rocket_panel.add(rocket, 'mass_flow_rate').name('mass flow rate').min(10).max(500).step(1) // in kg/s
rocket_panel.add(rocket, 'radius').name('rocket radius').min(1).max(5).step(0.01)

// enable and disable forces
rocket_panel.add(rocket, 'gravity_enabled').name('Enable Gravity')
rocket_panel.add(rocket, 'drag_enabled').name('Enable Drag')
rocket_panel.add(rocket, 'engine_running').name('Run Rocket Engine')
rocket_panel.open()


// rocket calculation outputs
let outputs = {

    // acceleration
    accX: rocket.acceleration.getX(),
    accY: rocket.acceleration.getY(),
    accZ: rocket.acceleration.getZ(),

    // velocity
    veloX: rocket.velocity.getX(),
    veloY: rocket.velocity.getY(),
    veloZ: rocket.velocity.getZ(),

    // position
    posX: rocket.position.getX(),
    posY: rocket.position.getY(),
    posZ: rocket.position.getZ(),

    gravity: rocket.gravity_acc,
    thrust: rocket.thrust,
    mass: rocket.total_mass,
    burnout_time: rocket.burnout_time,
}

// Show output results in debug ui
const output_panel = gui.addFolder('Rocket Processing Outputs')

output_panel.add(outputs, 'gravity').name('Universal Gravity').step(0.0001)
output_panel.add(outputs, 'mass').name('Current Rocket Mass').step(0.01)
output_panel.add(outputs, 'burnout_time').name('Engine running time').step(0.01)

const acc_ui = output_panel.addFolder('Acceleration')
acc_ui.add(outputs, 'accX').name('X').step(0.0001)
acc_ui.add(outputs, 'accY').name('Y').step(0.0001)
acc_ui.add(outputs, 'accZ').name('Z').step(0.0001)

const velo_ui = output_panel.addFolder('Velocity')
velo_ui.add(outputs, 'veloX').name('X').step(0.01)
velo_ui.add(outputs, 'veloY').name('Y').step(0.01)
velo_ui.add(outputs, 'veloZ').name('Z').step(0.01)

const pos_ui = output_panel.addFolder('Position')
pos_ui.add(outputs, 'posX').name('X').step(0.1)
pos_ui.add(outputs, 'posY').name('Y').step(0.1)
pos_ui.add(outputs, 'posZ').name('Z').step(0.1)


output_panel.open()
acc_ui.open()
velo_ui.open()
pos_ui.open()


function updateOutputs() {

    // refresh acceleration
    outputs.accX = rocket.acceleration.getX()
    outputs.accY = rocket.acceleration.getY()
    outputs.accZ = rocket.acceleration.getZ()

    // refresh velocity
    outputs.veloX = rocket.velocity.getX()
    outputs.veloY = rocket.velocity.getY()
    outputs.veloZ = rocket.velocity.getZ()

    // refresh displacement
    outputs.posX = rocket.position.getX()
    outputs.posY = rocket.position.getY()
    outputs.posZ = rocket.position.getZ()

    outputs.gravity = rocket.gravity_acc
    outputs.thrust = rocket.thrust
    outputs.mass = rocket.total_mass
    outputs.burnout_time = rocket.burnout_time
}

let oldElapsedTime = 0

const tick = () => {


    // delta Time
    const elapsedTime = clock.getElapsedTime()

    rocket.rocket_length = h

    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    rocket.deltaTime = deltaTime

    // if (currentAngle !== (rocket.nozzle_angle))
    //     currentAngle += rocket.nozzle_angle * deltaTime * 0.1
    //

    // rocket2.rotation.z = (Math.PI / 2) - angle
    //
    // currentAngle += (rocket.nozzle_angle * deltaTime)
    // rocket.nozzle_angle -= rocket.nozzle_angle * deltaTime


    rocket2.position.set(
        rocket.position.getX() * 0.06,
        rocket.position.getY() * 0.06,
        rocket.position.getZ() * 0.06
    )



    rocket1.position.set(
        rocket.position.getX() * 0.06,
        rocket.position.getY() * 0.06,
        rocket.position.getZ() * 0.06
    )



    // rocket.nozzle_angle -= alpha
    const ang1 = (rocket.position.getAngleXY() - vector.create(rocket.position.x, 0, 0).getAngleXY())

    const ang2 = (rocket.velocity.getAngleXY() - vector.create(rocket.velocity.x, 0, 0).getAngleXY())
    const alpha = ang1 - ang2

    // rocket.nozzle_angle = ang1 - (Math.PI / 2)
    rocket1.rotation.z = rocket.ang


    console.log('alpha: ' + alpha)
    camera.position.set(
        rocket2.position.x,
        rocket2.position.y + 10, rocket2.position.z - 30)
    camera.lookAt(rocket2.position)


    camera.position.set(
        rocket1.position.x,
        rocket1.position.y + 10, rocket1.position.z - 30)
    camera.lookAt(rocket1.position)
    rocket.update()

    updateOutputs()

    // refresh debug ui
    output_panel.updateDisplay()


    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()