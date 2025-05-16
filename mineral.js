// Obtén el botón de "Volver atrás"
document.getElementById("volver-atras").addEventListener("click", function() {
    // Redirige al usuario a la página de inicio o al menú
    window.location.href = "index.html"; // Reemplaza con la ruta de tu página de menú
});

// Agregar el evento de clic a las píldoras
document.querySelectorAll('.pildora').forEach(pildora => {
    pildora.addEventListener('click', (e) => {
        const nombre = pildora.textContent.trim();
        const urlNombre = encodeURIComponent(nombre); // Para manejar espacios y caracteres especiales
        window.location.href = `mapa.html?marcador=${urlNombre}`;
    });
});
