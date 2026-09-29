# Kinetic Editorial 2026 — V2

Esta versión cambia el enfoque: GSAP no se usa como decoración sino como lenguaje narrativo.

## Escenas principales

1. **Paper Gate** — apertura física de dos hojas con un sello central.
2. **Hero Title Sequence** — los nombres se separan y la foto pasa de full-bleed a placa editorial conforme haces scroll.
3. **Pinned Story** — la frase se construye palabra por palabra y la fotografía se revela mediante máscara.
4. **Venue Theatre** — ceremonia y recepción se presentan como tarjetas escénicas superpuestas.
5. **Horizontal Film Gallery** — el scroll vertical conduce una película horizontal de fotografías.
6. **Drawn Timeline** — la línea del itinerario se dibuja conforme avanzas.
7. **Closing Iris** — la fotografía final nace dentro de un círculo y termina ocupando la pantalla.

## Editar contenido

Todo el contenido y las URLs de imágenes están en `js/config.js`.

## Ejecutar

Usa VS Code + Live Server/Live Preview o cualquier servidor local. Abre `index.html`.

## Responsive

En móviles se eliminan los `pin` y desplazamientos horizontales más agresivos cuando afectarían usabilidad; la identidad visual se conserva mediante reveals, máscaras y composición vertical.

## Producción

Las imágenes de demostración son remotas. Para publicar una invitación real conviene descargarlas, optimizarlas a AVIF/WebP y servirlas desde `assets/images`.
