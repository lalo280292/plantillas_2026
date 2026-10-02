# Plantilla de invitación · v1 (formato general)

Estilo elegante, neutros cálidos con verde olivo y hojas de olivo a los costados.
Hecha solo con **HTML, CSS, JavaScript y GSAP**: no necesita instalar nada.

---

## 📁 Qué hay en cada carpeta y archivo

| Archivo / carpeta | Para qué sirve | ¿Lo edito? |
| --- | --- | --- |
| `js/datos.js` | **Todos los textos, fechas, fotos, links**, encender/apagar módulos, su orden y su animación | ✅ Siempre |
| `css/colores.css` | Colores de toda la invitación | ✅ Si cambia la paleta |
| `css/tipografias.css` | Fuentes y tamaños de letra | ✅ Si cambias fuentes |
| `css/posiciones.css` | Posiciones y tamaños de cada elemento | ✅ Para ajustes finos |
| `js/animaciones.js` | Animaciones GSAP disponibles y sus ajustes generales | ⚠️ Solo ajustes de arriba |
| `js/animaciones-nuevas.js` | Aquí agregas animaciones nuevas | ✅ Cuando quieras |
| `js/nucleo.js` | Lógica fija: sobre, contador, galería, calendario, formulario… | ❌ No |
| `css/estilos.css` | Diseño base | ❌ Casi nunca |
| `index.html` | Estructura. Solo editas el título y la vista previa de WhatsApp (arriba) | ⚠️ Solo el `<head>` |
| `generador-links.html` | Crea un link personalizado por invitado | Herramienta |
| `fotos/` | Solo fotografías | ✅ |
| `iconos/` | Todos los iconos (SVG o PNG) | ✅ |
| `tematica/` | Adornos (hojas, divisor), fondo, imágenes del sobre y del sello | ✅ |
| `musica/` | Canción de fondo (opcional) | ✅ |
| `fuentes/`, `librerias/` | Fuentes locales y GSAP | ❌ |

---

## 🚀 Hacer una invitación nueva (paso a paso)

1. **Copia toda la carpeta** y cámbiale el nombre (ej. `boda-ana-luis`).
2. Pon las fotos nuevas en `fotos/`. Lo más fácil es **usar los mismos nombres de archivo**
   (`portada-1.jpg`, `novia.jpg`…) y así no tienes que tocar las rutas.
3. Abre `js/datos.js` y cambia textos, fecha, lugares, links y número de WhatsApp.
4. Enciende/apaga módulos en la lista `modulos` (arriba de `datos.js`).
5. En `index.html` cambia solo el bloque «EDITA AQUÍ» (título y vista previa de WhatsApp).
6. Abre `index.html` con doble clic para revisarla.
7. Publícala (ver abajo) y crea los links de invitados con `generador-links.html`.

---

## 🔀 Módulos: mostrar, ocultar y reordenar

En `js/datos.js`:

```js
modulos: {
  sobre:    true,
  portada:  true,
  padrinos: false,   // ← oculto
  ...
}
```

- `true` = se ve · `false` = se oculta. Si borras una línea, ese módulo tampoco se muestra.
- **El orden de la lista es el orden en la invitación.** Corta y pega la línea para moverlo.
- Si dejas un texto vacío `""`, ese elemento se oculta solo (por ejemplo, el texto sobre la foto parallax).
- En listas (padrinos, regalos, hoteles…) puedes ocultar un elemento con `mostrar: false`.

---

## ✨ Animaciones

- Cada módulo tiene `animacion: "subir"` → la usan **todos** sus elementos.
- Para animar **un solo dato** distinto, cambia el texto por un objeto:

```js
nombre: "Sofía Valdés"                                   // normal
nombre: { texto: "Sofía Valdés", animacion: "letras" },  // con animación propia
```

- También funciona en elementos de listas: `{ rol: "Anillos", ..., animacion: "voltear" }`.
- Los títulos de un módulo pueden tener su propia animación: `animacionTitulo: "desenfoque"`.
- La lista completa de animaciones está al inicio de `js/animaciones.js`.
- Ajustes generales (duración, intensidad del parallax, repetir al subir…) en `CONFIG_ANIMACIONES`.
- Animaciones nuevas → `js/animaciones-nuevas.js` (trae 3 ejemplos y la receta).

Efectos especiales ya incluidos: apertura del sobre, fotos de portada con fundido de 2 s y
acercamiento lento, parallax, itinerario que se dibuja con el scroll, hojas que se mecen,
números del contador que caen al cambiar y visor de fotos.

---

## 🖼️ Tamaños recomendados de fotos

| Foto | Tamaño | Notas |
| --- | --- | --- |
| Portada (3) | 1600–2000 px de ancho | Vertical u horizontal. Ajusta el encuadre con `--portada-foto-posicion` |
| Novios, padres, padrinos | 500 × 500 px | Cuadradas; el círculo lo hace el diseño |
| Parallax y final | 1600–2000 px de ancho | |
| Misa / recepción | 900 × 675 px | |
| Galería (10) | 1200 px de ancho | Se usa la misma foto para miniatura y pantalla completa |

Usa JPG o WebP comprimidos (menos de 300 KB cada una) para que cargue rápido en celular.
Las fotos actuales son **de muestra**: reemplázalas antes de entregar.

---

## 👥 Links personalizados por invitado

Cada invitado recibe su propio link con su nombre y número de pases:

```
https://tusitio.com/boda-ana-luis/?invitado=Familia%20López&pases=4
```

El nombre aparece en el sobre, en el «Pase de entrada» y se llena solo en el formulario,
que además limita el número de asistentes a sus pases.
Abre **`generador-links.html`**, pega tu lista (`Nombre, pases`), y obtendrás todos los links
con botón para copiar, para enviar por WhatsApp y para descargar en Excel.

> El link solo personaliza lo que se ve; no es un sistema de seguridad.

---

## ✅ Confirmaciones (formulario)

En `datos.js → formulario`:

- `enviarA: "whatsapp"` → al enviar, se abre WhatsApp con el mensaje listo para el número indicado.
- `enviarA: "prueba"` → solo muestra el mensaje de gracias (para probar).
- `googleSheets: "URL"` (opcional) → además guarda cada respuesta en una hoja de Google.

**Guardar en Google Sheets (opcional):** crea una hoja → *Extensiones → Apps Script* → pega:

```js
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActiveSheet().appendRow([
    new Date(), d.invitacion, d.nombre, d.asistencia, d.personas, d.telefono, d.mensaje
  ]);
  return ContentService.createTextOutput("ok");
}
```

*Implementar → Nueva implementación → Aplicación web → Acceso: Cualquier usuario*, y pega la
URL que te da en `googleSheets`.

---

## 🎨 Cambiar el estilo para otro evento

- **Colores:** `css/colores.css`. El sello del sobre se recolorea con `--filtro-sello`.
- **Iconos:** los iconos se ven en círculos claros. Si usas iconos negros descargados y los
  quieres blancos, cambia `--filtro-icono` a `brightness(0) invert(1)`.
- **Hojas/adornos:** reemplaza `tematica/hoja-izquierda.svg` y `hoja-derecha.svg` por tus PNG
  (fondo transparente) y cambia las rutas en `datos.js → tematica`.
- **Sobre:** cambia las imágenes del sobre y sello en `datos.js → sobre.imagenes`. Si tus
  imágenes tienen otra proporción, ajusta la posición del sello en `css/posiciones.css`.
- **Música:** pon tu `cancion.mp3` en `musica/` y activa `musica: true`. Empieza al abrir el sobre.

---

## 🌐 Publicar

Funciona en cualquier hosting de archivos estáticos. Opciones fáciles:
**Netlify Drop** (arrastras la carpeta), **GitHub Pages**, **Vercel** o tu propio hosting.
Después de publicar, cambia `og:image` en `index.html` por la URL completa de la foto
para que la vista previa de WhatsApp muestre la imagen.

---

## Créditos

- GSAP 3.13 + ScrollTrigger (licencia en `librerias/`).
- Fuentes: Pinyon Script, Italianno, Cormorant Garamond y Manrope (licencia SIL Open Font).
- Fotos de muestra derivadas de las de `Plantillav2` (Unsplash). Sustitúyelas por las del cliente.
