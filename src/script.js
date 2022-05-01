import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
