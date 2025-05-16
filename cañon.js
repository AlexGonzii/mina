// Evento para volver a la página principal
document.getElementById('volver-atras').addEventListener("click", function() {
    window.location.href = "index.html";
});

// Acceder a la cámara del dispositivo
const video = document.getElementById("video");

// Intentamos acceder a la cámara trasera del dispositivo móvil o portátil
navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: "environment" // Esto solicita la cámara trasera (si está disponible)
    }
})
.then(stream => {
    video.srcObject = stream;
    video.play();  
})
.catch(err => {
    console.error("Error al acceder a la cámara:", err);
    alert("No se pudo acceder a la cámara.");
});

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      200
  );

  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  // Crear renderer con fondo transparente
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0); 
  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.zIndex = '-1';
  renderer.domElement.style.pointerEvents = 'none';
  document.body.appendChild(renderer.domElement);

  // Luz
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  // Cañón
  const cañonGeometry = new THREE.CylinderGeometry(0.3, 0.3, isMobile ? 1.5 : 3, 32);
  const cañonMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const cañon = new THREE.Mesh(cañonGeometry, cañonMaterial);
  cañon.rotation.x = 1.5;
  cañon.position.y = 0;
  scene.add(cañon);

  // Base
  const baseGeometry = new THREE.BoxGeometry(0.99, 0.48, 0.99);
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = -0.25;
  scene.add(base);

  // Ruedas
  function crearRueda(x) {
    const geo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
    const mat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const rueda1 = new THREE.Mesh(geo, mat);
    rueda1.rotation.z = Math.PI / 2;
    rueda1.position.set(x, -0.25, 0.5);
    scene.add(rueda1);

    const rueda2 = rueda1.clone();
    rueda2.position.z = -0.5;
    scene.add(rueda2);
  }
  crearRueda(-0.4);
  crearRueda(0.4);

  // Cámara
  camera.position.z = 2;
  camera.position.y = 1;
  camera.position.x = 2;
  camera.lookAt(0, 0, 0);

  // Animación
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
