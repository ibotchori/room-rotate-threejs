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
// textures
import rockColor from "./img/textures/Rock_Moss_001_basecolor.jpg";
import rockNormal from "./img/textures/Rock_Moss_001_normal.jpg";
import rockHeight from "./img/textures/Rock_Moss_001_height.png";

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
//scene.add(axesHelper);

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
const textureLoader = new THREE.TextureLoader();

// Floor
const floorGeometry = new THREE.PlaneGeometry(30, 30, 100, 100);
const floorMaterial = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
  map: textureLoader.load(rockColor),
  normalMap: textureLoader.load(rockNormal),
  displacementMap: textureLoader.load(rockHeight),
  displacementScale: 1,
});

const floor = new THREE.Mesh(floorGeometry, floorMaterial);
scene.add(floor);

// change floor position
floor.rotation.x = -0.5 * Math.PI;
floor.receiveShadow = true;

// grid helper for floor
const gridHelper = new THREE.GridHelper(30);
// scene.add(gridHelper);

// show loading screen before load assets
const loadingManager = new THREE.LoadingManager();

const progressBar = document.getElementById("progress-bar");
loadingManager.onProgress = function (url, loaded, total) {
  progressBar.value = (loaded / total) * 100;
};

const progressBarContainer = document.querySelector(".progress-bar-container");
loadingManager.onLoad = function () {
  progressBarContainer.style.display = "none";
};

const assetLoader = new GLTFLoader(loadingManager);

// 3D models from blender
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

/* Rotate Objects 90 degrees to the right on button click */
const rotateObject = () => {
  room.rotation.y -= Math.PI / 2;
  roomLarge.rotation.y -= Math.PI / 2;
};
document.getElementById("button").addEventListener("click", rotateObject);

/* Lights */

// Spotlight
const spotLightLeft = new THREE.SpotLight(0xffffff, 1.3);
spotLightLeft.position.set(-100, 100, 0);
spotLightLeft.angle = 0.2;

spotLightLeft.castShadow = true;
scene.add(spotLightLeft);

// spot light helper, to see where is light from
const sLightLeftHelper = new THREE.SpotLightHelper(spotLightLeft);
// scene.add(sLightLeftHelper);

const spotLightRight = new THREE.SpotLight(0xffffff);
spotLightRight.position.set(40, 100, 80);
spotLightRight.angle = 0.2;

spotLightRight.castShadow = true;
scene.add(spotLightRight);

// spot light helper, to see where is light from
const sLightRightHelper = new THREE.SpotLightHelper(spotLightRight);
// scene.add(sLightRightHelper);

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
