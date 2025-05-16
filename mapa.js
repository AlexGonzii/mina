const puntos = [
    { nombre: "Extracción", lat: 43.39123020099338, lng: -3.2226381027574793, url: "extraccion.html" },
    { nombre: "Trituración", lat: 43.38365868419052, lng: -3.2171957622766274, url: "trituracion.html" },
    { nombre: "Lavado del mineral", lat: 43.369243258625694, lng: -3.1953150917912114, url: "lavado.html" },
    { nombre: "Transporte", lat: 43.356785234294584, lng: -3.1965135948396566, url: "transporte.html" },
    { nombre: "Flotación", lat: 43.354096682122844, lng: -3.1668761310153415, url: "flotacion.html" },
    { nombre: "Fundición", lat: 43.34630181972187, lng: -3.1748383155828233, url: "fundicion.html" },
    { nombre: "Refinación", lat: 43.33591995032406, lng: -3.180585780492332, url: "refinacion.html" },
    {nombre: "4", lat:43.52567989312455, lng: -5.6815715503132385 },
    {nombre: "5", lat:43.52577542548395, lng:-5.675305790301615 }
];

// Inicializar mapa
const mapa = new maplibregl.Map({
    container: 'mapa',
    style: 'https://api.maptiler.com/maps/hybrid/style.json?key=aD1i3AUWKXjP9B8oymC7',
    center: [-3.1880941076435025, 43.3631597625436],
    zoom: 12
});

// Variables globales
let marca = null;
let marcadorSeleccionado = null;
let marcadorUsuario = null;
let seguimientoID = null;
const marcadorPOIs = [];
const popups = {};
const coordsPorNombre = {};

// Agregar marcadores con control de proximidad
puntos.forEach(punto => {
    const popup = new maplibregl.Popup({ offset: 25 })
        .setHTML(`<p><a class="enlace" href="${punto.url}">${punto.nombre}</a></p>`);

    const marcador = new maplibregl.Marker({ color: 'red' })
        .setLngLat([punto.lng, punto.lat])
        .setPopup(popup)
        .addTo(mapa);

    const el = marcador.getElement();

    el.addEventListener('click', () => {
        if (!navigator.geolocation) {
            alert("La geolocalización no está disponible en tu navegador.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userCoords = [position.coords.longitude, position.coords.latitude];
                const destinoCoords = [punto.lng, punto.lat];
                const distancia = turf.distance(turf.point(userCoords), turf.point(destinoCoords), { units: 'meters' });

                if (distancia <= 20) {
                    if (marcadorSeleccionado) {
                        marcadorSeleccionado.remove();
                        marcadorSeleccionado = null;
                    }

                    const marcadorVerde = new maplibregl.Marker({ color: 'green' })
                        .setLngLat(destinoCoords)
                        .addTo(mapa);

                    marcadorSeleccionado = marcadorVerde;
                    popup.setLngLat(destinoCoords).addTo(mapa);

                    iniciarSeguimiento(punto);
                } else {
                popup.remove(); // ❗️Cierra el popup si está demasiado lejos
                alert("Estás demasiado lejos, acércate un poco más.");
            }
        },
        () => alert("No se pudo obtener tu ubicación actual.")
    );
});

    const clave = punto.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    popups[clave] = popup;
    coordsPorNombre[clave] = [punto.lng, punto.lat];

    marcadorPOIs.push(marcador);
});

// Leer parámetro de la URL y abrir popup si corresponde
const params = new URLSearchParams(window.location.search);
const marcadorParam = params.get('marcador');

if (marcadorParam) {
    const claveBuscada = marcadorParam.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const popup = popups[claveBuscada];
    const coords = coordsPorNombre[claveBuscada];

    if (popup && coords) {
        mapa.flyTo({ center: coords, zoom: 12 });
        popup.setLngLat(coords).addTo(mapa);

        if (marcadorSeleccionado) marcadorSeleccionado.remove();
        marcadorSeleccionado = new maplibregl.Marker({ color: 'green' })
            .setLngLat(coords)
            .addTo(mapa);
    } else {
        console.warn("No se encontró el marcador:", marcadorParam);
    }
}

// Botón de localización
document.getElementById('boton-localizacion').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                mapa.flyTo({ center: [longitude, latitude], zoom: 17 });

                if (marca) {
                    marca.setLngLat([longitude, latitude]);
                } else {
                    marca = new maplibregl.Marker({ color: 'blue' })
                        .setLngLat([longitude, latitude])
                        .setPopup(new maplibregl.Popup().setText("Tú estás aquí"))
                        .addTo(mapa);
                }
            },
            () => alert('No se pudo obtener tu ubicación')
        );
    }
});

// Volver atrás
document.getElementById("volver-atras").addEventListener("click", function () {
    window.location.href = "index.html";
});

// Seguimiento en tiempo real
function iniciarSeguimiento(destino) {
    if (seguimientoID) navigator.geolocation.clearWatch(seguimientoID);

    seguimientoID = navigator.geolocation.watchPosition((position) => {
        const userCoords = [position.coords.longitude, position.coords.latitude];
        const destinoCoords = [destino.lng, destino.lat];

        if (!marcadorUsuario) {
            marcadorUsuario = new maplibregl.Marker({ color: 'blue' })
                .setLngLat(userCoords)
                .addTo(mapa);
        } else {
            marcadorUsuario.setLngLat(userCoords);
        }

        const distancia = turf.distance(turf.point(userCoords), turf.point(destinoCoords), { units: 'meters' });
        const distanciaTexto = document.getElementById('distancia');
        if (distanciaTexto) {
            distanciaTexto.innerText = `Distancia: ${distancia.toFixed(1)} m`;
        }

        if (distancia <= 20) {
            window.location.href = destino.url;
            navigator.geolocation.clearWatch(seguimientoID);
        }
    }, () => alert('No se pudo obtener tu ubicación'));
}
