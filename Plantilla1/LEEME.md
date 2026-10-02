# Plantilla 01 — Otoño

Primera base de invitación de boda para continuar la migración de Adobe Muse a HTML, CSS, JavaScript y GSAP. Entrada directa a la portada. Diseño marfil, terracota, cacao y oliva, con tipografía editorial y detalles botánicos vectoriales.

## Abrir

Abre `index.html` en un navegador. Los recursos visuales, fuentes y GSAP están incluidos localmente; no requiere instalación ni compilación. Para probar un servicio de confirmaciones, sírvela desde un servidor local y publica después con HTTPS.

Para iniciar una vista local desde esta carpeta, si tienes Python:

```sh
python3 -m http.server 8765
```

Después abre `http://localhost:8765`.

## Editar lo habitual

| Archivo / carpeta | Contenido |
| --- | --- |
| `js/config.js` | Nombres, mensajes, fecha, fotografías, invitados, módulos, enlaces y envío de confirmaciones. |
| `css/styles.css` | Colores y tamaños en `:root`; después, estilos por sección y restricciones móviles. |
| `js/app.js` | Plantillas de los módulos, interacciones y animaciones. |
| `photos/` | Todas las fotografías, incluidas las referencias entregadas. |
| `fonts/` | Fuentes locales. |
| `vendor/` | GSAP 3.13.0 y ScrollTrigger locales. |
| `index.html` | Estructura principal, metadatos, navegación y diálogos. |

### Apagar, encender o reordenar un módulo

En `config.js`, cambia `enabled` o mueve la entrada dentro de `modules`:

```js
{ id: "godparents", enabled: false }
```

No hace falta borrar HTML. La navegación se genera con las secciones activas. Los dos bloques de parallax son independientes. Los nombres con transición a corazón forman parte de `cover`; hay 18 módulos que cubren todos los bloques solicitados.

Para crear un tipo de módulo nuevo: agrega sus datos a la configuración, una función al objeto `renderers` en `app.js`, sus estilos y una entrada en `modules`. Usa un `id` único. La función `section()` crea el contenedor y `heading()` mantiene la jerarquía visual.

### Cambiar fotos

1. Coloca los nuevos archivos en `photos/` con nombres simples, por ejemplo `novia.jpg`.
2. Cambia el objeto de la fotografía:

```js
photo: {
  src: "photos/novia.jpg",
  alt: "Valeria",
  position: "50% 35%"
}
```

`position` ajusta el punto de interés sin editar la imagen. Quita `crop` al reemplazar una referencia por una foto individual. Los retratos de familia y las ilustraciones de lugares actuales son recortes visuales CSS de las imágenes que proporcionaste; los originales se mantienen intactos.

La portada contiene tres imágenes locales. Sustitúyelas por tres fotos de la misma pareja para la invitación real. Las fotos adicionales son de muestra y representan parejas diferentes. Recomendaciones: portada de 1600–2000 px de ancho; retratos de 500–700 px; imágenes JPG o WebP comprimidas.

### Ajustar diseño y restricciones

Los tokens principales de `styles.css` son `--paper`, `--ink`, `--accent`, `--olive`, `--content`, `--gutter` y `--section`. El contenido tiene un ancho máximo de 1100 px y márgenes fluidos; Grid organiza las columnas. `clamp()` limita los tamaños de texto y espacios. Los cortes a 760 y 480 px reorganizan contenido, sin duplicar secciones para móvil.

Las posiciones absolutas se reservan para capas de fotografía, adornos, controles y animación. Los módulos usan el flujo natural de la página. El cierre ocupa al menos una pantalla (`100svh`). Los iconos y ramas son SVG; los bordes de papel son formas CSS.

### Animaciones

- Tres fotos con fundido, selección manual y pausa; se suspenden cuando la pestaña no está visible.
- Los nombres se acercan, se reducen y se desvanecen para dar paso al corazón SVG conforme se desplaza la portada. Es una transición visual, no una conversión geométrica de cada letra.
- Dos fotografías con parallax ligado al desplazamiento.
- Aparición gradual de secciones e itinerario con GSAP y ScrollTrigger.
- `prefers-reduced-motion` desactiva movimiento y rotación automática. Sin GSAP el contenido permanece accesible y visible.

## Invitados y confirmaciones

Configura `invitation.name` y `invitation.seats`. También se admite un nombre visible en el enlace:

```text
index.html?invitado=Ana%20y%20Luis
```

El parámetro personaliza el saludo; no autentica al invitado ni controla permisos. El cupo viene de la configuración. Para gestionar invitaciones privadas y cupos reales por familia, conecta un servicio con identificadores y validación del lado del servidor.

### Modo actual: demostración

`rsvp.mode: "demo"` valida campos y ofrece descargar una respuesta JSON de ejemplo. No envía ni guarda respuestas en un servidor, y lo indica en pantalla. No se simula una confirmación real.

### Envío por WhatsApp

```js
rsvp: {
  mode: "whatsapp",
  whatsapp: "NUMERO_INTERNACIONAL_SOLO_DIGITOS",
  endpoint: "",
  deadline: "1 de noviembre de 2026",
  privacy: "Usaremos estos datos únicamente para organizar nuestra boda."
}
```

El formulario prepara un enlace con el mensaje. El invitado debe abrir WhatsApp y enviarlo. Este modo no registra automáticamente una respuesta en una base de datos.

### Envío a un servicio

Usa `mode: "endpoint"` y una URL HTTPS en `endpoint`. El formulario envía JSON mediante POST con los campos `name`, `attendance` (`yes`/`no`), `guests`, `message`, `invitation` y `consent`. El servicio debe responder con HTTP 2xx sólo después de guardar la respuesta, permitir el origen de la invitación si usa otro dominio y validar contenido/cupo. No guardes claves privadas en `config.js`. La plantilla no incluye un servidor ni una base de datos.

## Enlaces por completar

- `album.url`: álbum externo con permiso para que los invitados aporten fotos. No incluye almacenamiento de imágenes propio.
- `gifts.liverpoolUrl` y `gifts.eventNumber`: evento real de Liverpool.
- `gifts.bank`: titular, banco y CLABE reales. Mientras están vacíos, el diálogo anuncia que estarán disponibles próximamente.
- Direcciones, ubicaciones, fecha, horarios y datos de todos los participantes.

Los botones de ubicación abren una búsqueda en Google Maps; reemplaza `mapQuery` por el lugar real. El calendario genera un archivo `.ics` con inicio y fin en UTC calculados a partir del desfase explícito. Modifica fecha, desfase y zona horaria juntos si cambia el lugar del evento.

## Nueva base de trabajo para Muse

1. Duplica esta carpeta para cada boda y conserva una copia maestra.
2. Extrae textos, fotografías y datos del proyecto anterior. No copies las posiciones absolutas ni el JavaScript generado por Muse.
3. Introduce los datos en `config.js` y sustituye las fotos de muestra.
4. Selecciona y ordena módulos. Ajusta tokens para cada dirección visual.
5. Conecta álbum, mesa de regalos y destino de las confirmaciones.
6. Revisa móvil y escritorio, imágenes, contraste, teclado, movimiento reducido, fechas, mapas y un envío real.
7. Publica el contenido completo de esta carpeta en el alojamiento que elijas.

No se ha importado un archivo `.muse`: esta entrega establece la nueva estructura para las siguientes migraciones.

## Verificación realizada

- Sintaxis de ambos archivos JavaScript comprobada.
- Página abierta en navegador y 18 módulos presentes; sin fotografías rotas ni errores de consola observados.
- Sin desbordamiento horizontal a 320, 390, 541, 768, 1440 y 1920 px.
- Galería ampliada y navegación a la siguiente foto comprobadas.
- Validación del formulario de prueba y ocultación de asistentes al declinar comprobadas.
- Botón de calendario ejecutado; el navegador de revisión no permitió capturar el archivo descargado para inspeccionarlo. Revisar su importación en el calendario de destino antes de publicar.
- Los destinos de álbum, Liverpool, transferencia y confirmación real quedan pendientes de los datos finales.

## Recursos

- Las tres imágenes de referencia fueron proporcionadas por el usuario y se incluyen para facilitar la edición de esta primera versión.
- Fotografía de portada 01: Derek Thomson, [Unsplash](https://unsplash.com/photos/bride-and-groom-standing-near-tree-e3Xfmhfbxj4).
- Fotografías de portada 02 y 03: recursos relacionados observados en esa página, identificadores `photo-1708126755918-37f570797b1b` y `photo-1708126755913-b239c407ab5d`; sólo demostración, sustituir por las fotos propias antes de publicar.
- Fuentes: Cormorant Garamond, Manrope e Italianno, distribuidas por Google Fonts. Licencias incluidas en `fonts/`.
- GSAP y ScrollTrigger 3.13.0: distribución npm oficial mediante jsDelivr. Aviso y enlace a la licencia oficial incluidos en `vendor/`.
