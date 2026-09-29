# Estándar Muse → Código

## Estructura obligatoria

Cada plantilla migrada seguirá este patrón:

- `index.html`: estructura semántica de la invitación.
- `css/styles.css`: apariencia y responsive.
- `js/config.js`: contenido variable de la plantilla.
- `js/main.js`: render general.
- módulos JS independientes para contador, sobre, música, galería, invitados, RSVP y animaciones.
- `assets/`: recursos visuales clasificados por función.
- `api/`: backend existente que no pertenece al diseño.


## Regla de lienzo y fondo (obligatoria desde v2)

1. La invitación utiliza **un solo fondo base continuo** aplicado al contenedor principal, no una copia del mismo fondo en cada sección.
2. Ese fondo se repite verticalmente como mosaico para conservar la continuidad de los bordes diseñados.
3. Las secciones normales son transparentes y se construyen encima del fondo global. Las fotografías de portada, separadores fotográficos y otros bloques que son contenido visual pueden conservar su propia imagen.
4. El lienzo central tiene ancho configurable con **320 px mínimo y 500 px máximo** por defecto. Dentro de ese rango ocupa el ancho del navegador; por encima del máximo permanece centrado y vertical.
5. El área exterior visible en escritorio debe ser configurable como **imagen o color**, preferentemente con una imagen relacionada con la estética de la plantilla.
6. Estos valores deben quedar centralizados en `js/config.js` para que puedan cambiarse sin modificar la estructura HTML.

## Regla de fidelidad

El exportado de Muse y el video son referencia visual, pero no se reutiliza el runtime de Muse. Se conservan los recursos gráficos originales cuando aportan fidelidad; los textos que cambian entre eventos deben estar en `js/config.js` siempre que sea razonable.

## Regla de funcionalidad

Las funciones comunes se implementan una sola vez y se reutilizan entre plantillas:

1. sobre de apertura;
2. reproductor de música;
3. cuenta regresiva;
4. animaciones al hacer scroll;
5. galería/lightbox;
6. lectura del `?id=`;
7. ficha del invitado;
8. RSVP;
9. pase QR.

## Regla de compatibilidad

Cuando una plantilla existente ya tiene URLs públicas utilizadas por invitados o administradores, la migración debe conservarlas mediante archivos de compatibilidad o redirecciones. No deben romperse QR ya generados ni enlaces enviados previamente.

## Flujo para la siguiente plantilla

Entregar: ZIP de Muse/exportación + video + URL publicada. Comparar contra este piloto y reutilizar los módulos comunes. Solo deben reemplazarse el diseño, recursos, datos y comportamiento que sea realmente particular de la nueva plantilla.
