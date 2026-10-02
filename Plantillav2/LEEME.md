# Plantilla de boda · Otoño

La invitación se edita directamente en HTML. No requiere instalación ni compilación: abre `index.html` en un navegador.

## Dónde editar

- **index.html:** textos, fotos, iconos, adornos laterales y enlaces. Cada sección tiene su propio bloque con un comentario.
- **css/styles.css:** colores, tamaños, alturas y diseño móvil. Los ajustes principales están al inicio, en `:root`.
- **js/config.js:** fecha, duración del carrusel, número de invitados y destino del formulario.
- **js/app.js:** sólo interacciones y animaciones. No contiene el contenido de la invitación.
- **photos/:** coloca aquí tus fotografías, iconos y adornos PNG, JPG o WebP.

## Poner una fotografía

Los retratos y fotos de los lugares están preparados sin archivo. Agrega `src` al `img` correspondiente:

```html
<div class="photo portrait">
  <img src="photos/carlos.jpg" alt="Carlos Ramírez" loading="lazy" />
</div>
```

Cada persona usa su propio archivo. El círculo lo hace CSS; no se toman partes de una imagen grupal ni se calculan coordenadas de recorte. Mientras un `img` no tiene `src`, permanece oculto y no muestra una imagen rota.

Las fotos actuales de portada, parallax y galería son de muestra; sustituye sus rutas por las fotos de la misma pareja. Si necesitas mover el punto de interés de una imagen grande, agrega `style="object-position: 50% 35%"` a su `img`.

## Poner tus iconos

En cada lugar preparado verás un comentario como «Icono calendario». Agrega la ruta:

```html
<img class="icon" src="photos/icono-calendario.png" alt="" />
```

Los iconos se cargan desde archivos; no hay dibujos SVG ni funciones que los generen. Los botones de cerrar, anterior, siguiente y pausa usan texto para que funcionen sin iconos.

## Agregar imágenes a los costados

Cada sección tiene dos `img` opcionales:

```html
<img class="side-image side-left" src="photos/flores-izquierda.png" alt="" />
<img class="side-image side-right" src="photos/flores-derecha.png" alt="" />
```

Usa preferentemente PNG o WebP con fondo transparente. Puedes agregar sólo un lado o ambos. El ancho general se cambia con `--side-width` en CSS; la imagen no altera las columnas ni el ancho de la página.

Para ajustar un adorno de una sección concreta:

```css
#parents .side-left {
  width: 140px;
  top: 25%;
}
```

También puedes usar `bottom` en lugar de `top`; en ese caso escribe `top: auto`.

## Apagar, reordenar o agregar módulos

Para apagar una sección, agrega `hidden` a su etiqueta:

```html
<section id="godparents" class="section" hidden></section>
```

Para encenderla, quita `hidden`. Para reordenar, mueve el bloque completo desde `<section>` hasta `</section>`. Para agregar contenido, escribe una sección nueva con un `id` único y un contenedor `wrap`:

```html
<section id="mensaje-especial" class="section">
  <div class="wrap">
    <h2>Un mensaje especial</h2>
    <p>Tu texto.</p>
  </div>
</section>
```

No necesitas registrar módulos en JavaScript ni editar una segunda lista. Conserva los identificadores de los módulos con funciones: `cover`, `date`, `gallery`, `form` e `itinerary`.

## Alturas de las fotos

En teléfono, portada y parallax ocupan una pantalla (`100svh`), con una altura mínima de 650 px. El cierre ocupa al menos una pantalla. En escritorio se usan `--cover-height` y `--large-photo-height`.

Los nombres permanecen fijos dentro de la portada, al pie de la foto. El carrusel cambia las fotos y sus controles están debajo de la imagen.

## Fecha y confirmación

Cambia fecha, desfase horario, zona horaria y fin del evento en `config.js`. La fecha visible, contador y archivo de calendario se actualizan juntos. El nombre del evento del calendario se toma del `<title>` del HTML y el lugar de la sección de ceremonia.

`seats` cambia los lugares reservados y las opciones del formulario. `deadline` cambia la fecha límite. El saludo puede personalizarse con `?invitado=Ana%20y%20Luis`; este parámetro sólo modifica el nombre visible.

El formulario conserva tres modos:

- `demo`: valida los campos y muestra una respuesta de prueba; no envía confirmaciones.
- `whatsapp`: configura un número internacional de sólo dígitos. El invitado abre WhatsApp y envía el mensaje preparado.
- `endpoint`: configura una URL HTTPS para recibir JSON mediante POST. El servicio debe guardar la respuesta y devolver HTTP 2xx; si está en otro dominio, debe permitir el origen de la invitación. No incluye servidor ni base de datos.

Los campos enviados son `name`, `attendance`, `guests`, `message`, `invitation` y `consent`.

Los enlaces del álbum y Liverpool se editan en `href` dentro del HTML. Los datos bancarios están en el diálogo `bank-dialog`, al final del mismo archivo.

## Recursos conservados

GSAP y ScrollTrigger siguen incluidos localmente para el parallax y las apariciones. Fuentes locales: Cormorant Garamond, Manrope e Italianno; sus licencias están en `fonts/`. El aviso y enlace de licencia de GSAP están en `vendor/`.

La portada 01 es de [Derek Thomson en Unsplash](https://unsplash.com/photos/bride-and-groom-standing-near-tree-e3Xfmhfbxj4). Las fotos 02 y 03 son recursos de muestra relacionados de esa página (`photo-1708126755918-37f570797b1b` y `photo-1708126755913-b239c407ab5d`); sustitúyelas por tus fotos antes de usar la invitación real.
