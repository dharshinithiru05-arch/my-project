// === Scene Setup ===
const canvas = document.getElementById("sceneCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3, 2, 4);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// === Lighting ===
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 8, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

// === Room ===
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });

// Floor
const floor = new THREE.Mesh(new THREE.BoxGeometry(6, 0.1, 6), floorMaterial);
floor.position.y = -0.05;
scene.add(floor);

// Walls
const wall1 = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 0.1), wallMaterial);
wall1.position.set(0, 1.5, -3);
scene.add(wall1);

const wall2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3, 6), wallMaterial);
wall2.position.set(-3, 1.5, 0);
scene.add(wall2);

// === GLTF Loader ===
const loader = new THREE.GLTFLoader();
let selectedObject = null;

const modelPaths = {
  "chair": "https://models.babylonjs.com/CornellBox/chair.glb",
  "sofa": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Sofa/glTF/Sofa.gltf",
  "table": "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CoffeeTable/glTF/CoffeeTable.gltf"
};

// === Add Furniture ===
document.getElementById("addFurniture").onclick = () => {
  const choice = document.getElementById("furnitureSelect").value;
  if (choice === "none") return;

  loader.load(modelPaths[choice], gltf => {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 0);
    scene.add(model);
  });
};

// === Change Wall & Floor Colors ===
document.getElementById("wallColor").oninput = e => {
  wallMaterial.color.set(e.target.value);
};

document.getElementById("floorColor").oninput = e => {
  floorMaterial.color.set(e.target.value);
};

// === Remove Selected Object ===
document.getElementById("removeObject").onclick = () => {
  if (selectedObject && selectedObject !== floor && selectedObject !== wall1 && selectedObject !== wall2) {
    scene.remove(selectedObject);
    selectedObject = null;
  }
};

// === Select Object on Click ===
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", event => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    selectedObject = intersects[0].object;
  }
});

// === Snapshot Download ===
document.getElementById("snapshot").onclick = () => {
  const url = renderer.domElement.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = "interior_snapshot.png";
  link.href = url;
  link.click();
};

// === Render Loop ===
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// === Resize Handling ===
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
