# Invitación Luxury Editorial 2026

Plantilla base creada como una invitación responsive real, no como un lienzo fijo.

## Abrir

Abre `index.html` en el navegador. Para desarrollo recomiendo servir la carpeta con un servidor local, por ejemplo con la extensión Live Server de VS Code.

## Lo primero que debes editar

Todo el contenido principal está centralizado en:

`js/config.js`

Ahí puedes cambiar:

- nombres
- fecha
- ciudad
- padres
- ceremonia y recepción
- itinerario
- dress code
- datos de regalos
- fecha límite de RSVP
- paleta
- URLs de imágenes
- URL del video de portada (`images.heroVideo`)

## Arquitectura

- `index.html`: estructura semántica de la invitación.
- `css/tokens.css`: Design Tokens: color, tipografía, espacios, escalas y medidas maestras.
- `css/base.css`: reset, estilos globales y utilidades.
- `css/components.css`: navegación, botones, lightbox, encabezados y componentes globales.
- `css/sections.css`: composición responsive de cada sección.
- `js/config.js`: contenido y configuración editable.
- `js/main.js`: render de contenido, menú, contador, galería, RSVP y utilidades.
- `js/animations.js`: GSAP + ScrollTrigger.

## Qué hace que sea responsive

La plantilla no depende de un ancho maestro. Usa:

- `clamp()` para tipografía y espaciado fluidos.
- CSS Grid y Flexbox.
- `min()` y límites máximos de contenido.
- `aspect-ratio` y `object-fit` para fotografía.
- `container-type` + `@container` en las tarjetas de evento.
- media queries únicamente cuando cambia la composición.
- `100svh` para viewport móvil moderno.
- `prefers-reduced-motion` para accesibilidad.

## Motion

La animación se ejecuta con GSAP 3.13+ y ScrollTrigger, cargados desde CDN.

Incluye:

- apertura de invitación
- reveals por scroll
- parallax de fotografía
- barra de progreso
- header reactivo al scroll
- lightbox de galería

Si GSAP no carga, la invitación sigue siendo usable: la capa de motion es progresiva.

## Fotografías

Las imágenes incluidas son referencias remotas de Unsplash. Para producción sustituye las URLs de `config.js` por las fotos finales del cliente o por rutas locales como:

`assets/images/hero.webp`

Para producción conviene exportar las fotos en WebP/AVIF y optimizarlas según tamaño real de uso.

## Video de portada

Coloca el video principal en `assets/videos/hero.mp4` o cambia `images.heroVideo` en `js/config.js`. El video se reproduce automáticamente sin sonido, en bucle y en formato inline; `images.hero` se utiliza como imagen de poster mientras carga o si el navegador no puede reproducirlo.

## RSVP

El formulario actual es una demostración de interfaz y guarda temporalmente la respuesta en `sessionStorage`.

Para producción conecta el `submit` de `js/main.js` con tu Apps Script / Google Sheets o con el backend que uses.

## Regla de diseño de esta plantilla

El sistema sigue esta jerarquía:

contenido → componente → layout → breakpoint → motion

No se diseñó una versión distinta para cada teléfono. Los breakpoints aparecen cuando la composición necesita cambiar.
