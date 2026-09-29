# Mariana — migración Muse → Código (piloto v2)

Esta carpeta es una reconstrucción independiente de Adobe Muse. La página pública está en `index.html`; el código visual usa HTML, CSS y JavaScript nativo, y el backend de invitados/RSVP existente se conserva en `api/`.

## Qué editar para reutilizar la plantilla

La mayoría del contenido variable está centralizado en `js/config.js`:

- nombre de la quinceañera;
- fecha y hora;
- mensaje;
- padres y padrinos;
- ceremonia y recepción;
- enlaces de Google Maps;
- itinerario;
- hashtag;
- enlace del álbum;
- música;
- rutas del API.

Las imágenes están organizadas en `assets/`:

- `assets/images/`: fotografías y fondos principales;
- `assets/decor/`: flores, ramas y separadores;
- `assets/gallery/`: galería de 15 fotografías;
- `assets/icons/`: iconos;
- `assets/envelope/`: sobre inicial.


## Fondo continuo y ancho del lienzo

La v2 usa **una sola imagen de fondo en todo el lienzo central**. Las secciones normales son transparentes y se colocan encima de ese fondo; la imagen se repite verticalmente como mosaico.

Todo se controla en `js/config.js`, dentro de `layout`:

- `minWidth`: ancho mínimo del lienzo (320 px por defecto);
- `maxWidth`: ancho máximo del lienzo (500 px por defecto);
- `invitationBackgroundImage`: imagen única que se repite en todo el fondo de la invitación;
- `outside.mode`: `image` o `color`;
- `outside.image`: imagen visible a los lados en pantallas mayores a 500 px;
- `outside.color`: color lateral y respaldo si no se usa imagen.

Con `outside.mode: 'color'` se desactiva la imagen lateral. Con `outside.mode: 'image'` se utiliza `assets/images/side-background.jpg` o la imagen que se indique.

## URL personalizada

La invitación sigue leyendo el ID desde la URL:

`index.html?id=EJQC3`

Con ese ID, `js/guest.js` consulta `api/proxy.php?sheet=Lista`, muestra los datos del invitado y `js/rsvp.js` limita los selectores según la información registrada.

## Publicación

Sube **toda la carpeta** conservando su estructura. El servidor debe ejecutar PHP y tener cURL habilitado, porque `api/proxy.php` comunica la invitación con Google Apps Script.

Si se publica directamente en la raíz de `mariana.inv15.com`, la URL queda como:

`https://mariana.inv15.com/?id=EJQC3`

## RSVP

`api/form_visibility.txt` está inicializado en `true` para reproducir el estado mostrado en el video. El panel existente puede activar o desactivar el formulario mediante `api/control_formulario.html`.

## Pase QR

El pase se encuentra en `api/paseqr.html`. También se incluyeron rutas de compatibilidad en la raíz (`paseqr.html`, `escaner.html`, `proxy.php`, etc.) para que los enlaces y QR del sistema anterior sigan funcionando sin cambiar sus URLs.

## Diferencias intencionales frente a Muse

- Eliminadas las dependencias `MuseUtils`, `jquery.museresponsive`, `jquery.scrolleffects` y demás runtime de Muse.
- Las animaciones de aparición se realizan con `IntersectionObserver`.
- La galería y el lightbox son JavaScript nativo.
- El contador, el sobre y el reproductor están separados en módulos.
- No se copiaron Google Analytics, Facebook Pixel ni el rastreo de IP/ubicación del HTML original. Son independientes del diseño y pueden agregarse posteriormente de forma explícita.
- La canción mantiene la misma URL externa usada por la invitación original. Si se desea una plantilla 100% autónoma, basta con guardar el MP3 en `assets/audio/` y cambiar `audio.src` en `js/config.js`.
