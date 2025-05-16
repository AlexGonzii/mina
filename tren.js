// Evento para volver a la página principal
document.getElementById('volver-atras').addEventListener("click", function () {
    window.location.href = "index.html";
});

// Acceder a la cámara del dispositivo
const video = document.getElementById("video");

// Intentamos acceder a la cámara trasera del dispositivo móvil o portátil
navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: "environment"
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
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-6, 3,3); 
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '-1';
document.body.appendChild(renderer.domElement);

// Luz
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
scene.add(light);

// Locomotora básica
const bodyGeometry = new THREE.CylinderGeometry(1, 1, 4.6, 32);
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x5555ff });
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.rotation.z = Math.PI / 2;
scene.add(body);

const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 2, 2),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
);
cabin.position.set(1.5, 1, 0);
scene.add(cabin);

const chimney = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16),
    new THREE.MeshStandardMaterial({ color: 0x000000 })
);
chimney.position.set(-2, 1.2, 0);
scene.add(chimney);

// Ruedas
const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 32);
const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

const wheelPositions = [-2, 2]; 

wheelPositions.forEach(i => {
    const leftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    leftWheel.rotation.x = Math.PI / 2;
    leftWheel.position.set(i, -1, -1);
    scene.add(leftWheel);

    const rightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    rightWheel.rotation.x = Math.PI / 2;
    rightWheel.position.set(i, -1, 1);
    scene.add(rightWheel);
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();