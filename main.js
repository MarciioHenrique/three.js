// Obtém o elemento do canvas do documento HTML
const canvas = document.querySelector("#canvas");

const renderer = new THREE.WebGLRenderer({ canvas });

const camera = new THREE.PerspectiveCamera(
  75,
  canvas.width / canvas.height,
  0.1,
  50
);
camera.position.z = 4;

const scene = new THREE.Scene();

const reactSymbol = new THREE.Group();

const textureLoader = new THREE.TextureLoader();

const texture1 = textureLoader.load("/assets/pensante.png");
const texture2 = textureLoader.load("/assets/maluco.png");
const texture3 = textureLoader.load("/assets/triste.png");
const texture4 = textureLoader.load("/assets/sono.png");

const materials = [
  new THREE.MeshBasicMaterial({ map: texture1 }),
  new THREE.MeshBasicMaterial({ map: texture2 }),
  new THREE.MeshBasicMaterial({ map: texture3 }),
  new THREE.MeshBasicMaterial({ map: texture4 }),
];

const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const newMaterials = shuffleArray(materials);

const random = (range) => {
  return (Math.random() - 0.5) * range;
};

const sphereRadius = 0.4;

for (let i = 0; i < newMaterials.length; i++) {
  if (i % 2 === 0) {
    const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
    const sphere = new THREE.Mesh(sphereGeometry, newMaterials[i]);
    sphere.position.set(random(10), random(10), random(10));
    reactSymbol.add(sphere);
  } else {
    const cylinderGeometry = new THREE.CylinderGeometry(
      sphereRadius,
      sphereRadius,
      0.8,
      32
    );
    const cylinder = new THREE.Mesh(cylinderGeometry, newMaterials[i]);
    cylinder.position.set(random(10), random(10), random(10));
    reactSymbol.add(cylinder);
  }
}

const cubeTexture = textureLoader.load("/assets/joinha.png");
const cubeMaterial = new THREE.MeshPhongMaterial({ map: cubeTexture });

const boxSize = 0.5;

const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
const box = new THREE.Mesh(boxGeometry, cubeMaterial);
reactSymbol.add(box);
scene.add(reactSymbol);

const color = 0xffffff;
const intensity = 1;

const color2 = 0xff00ff;
const intensity2 = 0.8;

const light = new THREE.DirectionalLight(color, intensity);
const light2 = new THREE.DirectionalLight(color2, intensity2);

light.position.set(1, 2, 4);
light2.position.set(-1, -2, -4);
scene.add(light);
scene.add(light2);

// Adiciona interação do mouse para rotação
let isDragging = false;
let previousMousePosition = {
  x: 0,
  y: 0,
};

canvas.addEventListener("mousedown", (event) => {
  isDragging = true;
});

canvas.addEventListener("mouseup", (event) => {
  isDragging = false;
});

canvas.addEventListener("mousemove", (event) => {
  const deltaMove = {
    x: event.clientX - previousMousePosition.x,
    y: event.clientY - previousMousePosition.y,
  };

  if (isDragging) {
    const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        (deltaMove.y * Math.PI) / 180,
        (deltaMove.x * Math.PI) / 180,
        0,
        "XYZ"
      )
    );

    reactSymbol.quaternion.multiplyQuaternions(
      deltaRotationQuaternion,
      reactSymbol.quaternion
    );
  }

  previousMousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
});

function render() {
  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

render();
