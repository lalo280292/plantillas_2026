# Invitación Experimental 2026 — V3

Esta versión no trata GSAP como una capa de adornos. El movimiento forma parte de la composición y conecta capítulos completos de la invitación.

## Qué incluye

- Apertura botánica con SVG dibujado y sello interactivo.
- Hero cinemático con tipografía fracturada, línea SVG y profundidad por cursor/giroscopio.
- **FLIP real:** la misma fotografía cambia de contenedor, proporción, posición y máscara a lo largo del scroll.
- Máscara orgánica SVG que cambia de forma con MorphSVG.
- Línea botánica dibujada con DrawSVG y hoja que recorre el trazo con MotionPath.
- Tipografía que pasa visualmente por detrás y por delante de una fotografía.
- Galería horizontal controlada por scroll en desktop y composición vertical en móvil.
- Itinerario dibujado progresivamente.
- RSVP de demostración.
- `prefers-reduced-motion` y fallbacks si GSAP no está disponible.

## GSAP utilizado

La plantilla carga GSAP 3.14 y los plugins:

- ScrollTrigger
- Flip
- MotionPathPlugin
- MorphSVGPlugin
- DrawSVGPlugin

Desde GSAP 3.13+ los plugins están disponibles gratuitamente. Para producción puedes dejar el CDN o instalar GSAP con npm.

## Editar contenido

Abre `js/config.js`. Nombres, fecha, padres, sedes, itinerario, colores e imágenes siguen centralizados ahí.

## Movimiento por dispositivo

En desktop, elementos con `data-depth` reaccionan al puntero. En móviles compatibles se solicita permiso para `DeviceOrientation` al pulsar **Entrar**; si no hay permiso, la invitación funciona normalmente sin ese efecto.

## Responsive

Los capítulos que dependen de una composición panorámica cambian en móvil:

- FLIP se activa al entrar en cada slot vertical.
- La galería deja de ser horizontal y se convierte en una secuencia vertical.
- El capítulo Type × Image cambia su composición para no forzar textos panorámicos.

No se diseña para un modelo de teléfono específico.

## Ejecución local

Usa un servidor local, por ejemplo Live Server / Live Preview de VS Code. Abrir directamente `index.html` también puede funcionar, pero un servidor local es preferible para probar de forma consistente.

## Imágenes

Las imágenes de demostración se cargan desde Unsplash mediante URLs configuradas en `js/config.js`. Sustitúyelas por los archivos finales del evento antes de publicar.
