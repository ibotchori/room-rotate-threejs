import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Loader
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import 3D model
const roomURL = new URL("./assets/room.glb", import.meta.url);
const roomLargeURL = new URL("./assets/roomL.glb", import.meta.url);

// image
import stars from "./img/stars.jpg";

// Init renderer
const renderer = new THREE.WebGLRenderer({
  // enable transparent background
  alpha: true,
});

// Enable Shadow
renderer.shadowMap.enabled = true;

// Set size (whole window)
renderer.setSize(window.innerWidth, window.innerHeight);

// Render to canvas element
document.body.appendChild(renderer.domElement);

// Init scene
const scene = new THREE.Scene();

// Init camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Create orbit control instance to change position of camera by mouse
const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// Camera positions
camera.position.set(-10, 30, 30);
// call update method every time when camera position is changed
orbit.update();

// scene background
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  stars,
  stars,
  stars,
  stars,
  stars,
  stars,
]);

/* Objects */
// Floor
const floorGeometry = new THREE.PlaneGeometry(30, 30);
const floorMaterial = new THREE.MeshBasicMaterial({
  color: 0x759e88,
  side: THREE.DoubleSide,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
// change floor position
floor.rotation.x = -0.5 * Math.PI;
// receive shadow to floor
floor.receiveShadow = true;
scene.add(floor);

// Grid helper for floor
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

// 3D models from blender
const assetLoader = new GLTFLoader();

let room;
let roomLarge;

assetLoader.load(
  roomURL.href,
  function (gltf) {
    room = gltf.scene;
    room.rotation.y -= Math.PI;
    room.position.set(-8, 1, 7);
    scene.add(room);
  },
  undefined,
  function (error) {
    console.log(error);
  }
);

assetLoader.load(
  roomLargeURL.href,
  function (gltf) {
    roomLarge = gltf.scene;
    scene.add(roomLarge);
    roomLarge.position.set(7, 1, 7);
  },
  undefined,
  function (error) {
    console.log(error);
  }
);

/* rotate Object 90 degrees to the right, on click event */
const rotateObject = () => {
  room.rotation.y -= Math.PI / 2;
  roomLarge.rotation.y -= Math.PI / 2;
};
document.getElementById("button").addEventListener("click", rotateObject);
/* rotate Object 90 degrees to the right, on click event */

/* Lights */
const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/* Sizes - Making the canvas responsive */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/* Animate  */
const animate = () => {
  // Render
  renderer.render(scene, camera);
};

// Draw the scene every time the screen is refreshed
renderer.setAnimationLoop(animate);
