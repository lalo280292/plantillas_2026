/* =====================================================================
   📝  DATOS DEL EVENTO  —  el archivo que más vas a editar
   =====================================================================

   CÓMO EDITAR (lee esto una vez):

   • Cambia SOLO lo que está entre comillas "así". No borres las comillas
     ni las comas del final de cada línea.
   • Para hacer un salto de línea dentro de un texto escribe  <br>
   • Si dejas un texto vacío ""  ese elemento se oculta solo.
   • Las fotos van en la carpeta /fotos, los iconos en /iconos y los
     adornos en /tematica. Escribe la ruta así: "fotos/mi-foto.jpg"

   ANIMACIONES:
   • Cada módulo tiene  animacion: "subir"  → es la animación de TODO
     lo que hay dentro del módulo.
   • Si quieres una animación distinta en UN SOLO dato, cámbialo así:
         nombre: "Sofía"
     por:
         nombre: { texto: "Sofía", animacion: "letras" },
   • Lista de animaciones disponibles → abre  js/animaciones.js
     (aparecer, subir, bajar, izquierda, derecha, zoom, zoom-suave,
      desenfoque, letras, palabras, escribir, rebote, girar, voltear,
      cortina, circulo, linea, flotar, latido, balanceo, ninguna)

   HOJAS A LOS COSTADOS:
   • Cada módulo tiene  hojas: "ambos" | "izquierda" | "derecha" | "no"

   FONDO DE CADA MÓDULO:
   • fondo: "claro" | "alterno"   (los colores se cambian en css/colores.css)
   ===================================================================== */

const DATOS = {

  /* ===================================================================
     1) ENCENDER / APAGAR MÓDULOS  y  ORDEN
     -------------------------------------------------------------------
     true  = se muestra      false = se oculta
     El ORDEN de esta lista es el orden en que aparecen en la invitación:
     para mover un módulo, corta su línea y pégala en otro lugar.
     =================================================================== */
  modulos: {
    sobre:       true,    // pantalla inicial con sobre y sello
    portada:     true,
    frase:       true,
    novios:      true,
    parallax1:   true,
    padres:      true,
    padrinos:    true,
    fecha:       true,
    misa:        true,
    recepcion:   true,
    itinerario:  true,
    parallax2:   true,
    album:       true,
    galeria:     true,
    vestimenta:  true,
    regalos:     true,
    hospedaje:   true,
    invitados:   true,
    confirmar:   true,
    formulario:  true,
    final:       true,
    pie:         true,    // pie de página con el crédito de tu marca
    musica:      false,   // botón de música (pon tu canción en /musica y cambia a true)
  },


  /* ===================================================================
     2) DATOS GENERALES DEL EVENTO
     =================================================================== */
  evento: {
    titulo:        "Boda de Sofía & Mateo",          // se usa en el calendario y en WhatsApp
    // Fecha y hora de inicio. Formato: AAAA-MM-DDTHH:MM:00  (hora en 24 h)
    fecha:         "2027-04-17T17:00:00",
    fechaFin:      "2027-04-18T02:00:00",              // para el calendario
    lugar:         "Tepoztlán, Morelos",                // para el calendario
    descripcion:   "¡Te esperamos para celebrar nuestra boda!",
  },


  /* ===================================================================
     3) TEMÁTICA (adornos, fondo e imágenes del sobre)  → carpeta /tematica
     =================================================================== */
  tematica: {
    hojaIzquierda:  "tematica/hoja-izquierda.svg",
    hojaDerecha:    "tematica/hoja-derecha.svg",
    divisor:        "tematica/rama-divisor.svg",     // adorno debajo de cada título
    fondo:          "tematica/fondo-papel.svg",      // textura del fondo ("" = sin textura)
  },


  /* ===================================================================
     4) MÓDULOS
     =================================================================== */

  // ----- SOBRE (pantalla de entrada) -----
  sobre: {
    iniciales:   "S&M",                         // letras dentro del sello
    titulo:      "Sofía & Mateo",               // texto escrito en el sobre
    para:        "Una invitación especial para", // arriba del nombre del invitado
    textoAyuda:  "Toca el sello para abrir",
    velocidad:   1,                             // 1 normal · 1.5 más rápido · 0.7 más lento
    imagenes: {
      arribaVertical:    "tematica/sobre-arriba-vertical.webp",    // celular
      abajoVertical:     "tematica/sobre-abajo-vertical.webp",
      arribaHorizontal:  "tematica/sobre-arriba-horizontal.webp",  // computadora
      abajoHorizontal:   "tematica/sobre-abajo-horizontal.webp",
      sello:             "tematica/sello.webp",
    },
  },

  // ----- PORTADA (3 fotos que cambian solas) -----
  portada: {
    animacion:    "subir",
    fotos: [
      "fotos/portada-1.jpg",
      "fotos/portada-2.jpg",
      "fotos/portada-3.jpg",
    ],
    cadaSegundos:       5,     // tiempo que se queda cada foto
    transicionSegundos: 2,     // duración del cambio entre fotos
    antesDeNombres: "Nos casamos",
    nombres:        { texto: "Sofía & Mateo", animacion: "letras" },
    fechaCorta:     "17 · 04 · 2027",
  },

  // ----- FRASE -----
  frase: {
    animacion: "desenfoque",
    hojas:     "no",
    fondo:     "claro",
    texto:     "“El amor es paciente, es bondadoso… todo lo disculpa, todo lo cree, todo lo espera, todo lo soporta.”",
    autor:     "1 Corintios 13:4-7",
  },

  // ----- NOVIOS -----
  novios: {
    animacion: "subir",
    hojas:     "ambos",
    fondo:     "claro",
    titulo:    "Los novios",
    novia: {
      foto:    "fotos/novia.jpg",
      rol:     "La novia",
      nombre:  "Sofía Valdés Ortega",
      mensaje: "Encontré en ti a mi mejor amigo y al compañero de todas mis aventuras. Hoy elijo caminar a tu lado para siempre.",
    },
    novio: {
      foto:    "fotos/novio.jpg",
      rol:     "El novio",
      nombre:  "Mateo Herrera Ruiz",
      mensaje: "Contigo aprendí que el hogar no es un lugar, es una persona. Gracias por decir que sí.",
    },
  },

  // ----- FOTO PARALLAX 1 -----
  parallax1: {
    animacion: "zoom-suave",
    foto:      "fotos/parallax-1.jpg",
    texto:     "Dos almas, un mismo camino",
  },

  // ----- PADRES -----
  padres: {
    animacion: "subir",
    hojas:     "izquierda",
    fondo:     "alterno",
    titulo:    "Nuestros padres",
    texto:     "Con la bendición de Dios y de nuestros padres",
    lista: [
      { foto: "fotos/padres-novia.jpg", titulo: "Padres de la novia",
        nombres: ["Ricardo Valdés Montes", "Laura Ortega Salinas"] },
      { foto: "fotos/padres-novio.jpg", titulo: "Padres del novio",
        nombres: ["Jorge Herrera Campos", "Mónica Ruiz Delgado"] },
    ],
  },

  // ----- PADRINOS -----
  padrinos: {
    animacion: "zoom",
    hojas:     "derecha",
    fondo:     "claro",
    titulo:    "Nuestros padrinos",
    texto:     "Gracias por acompañarnos en este paso tan importante",
    lista: [
      { foto: "fotos/padrinos-1.jpg", rol: "Velación",  nombres: ["Andrés Molina", "Carolina Paz"] },
      { foto: "fotos/padrinos-2.jpg", rol: "Anillos",   nombres: ["Diego Fuentes", "Mariana León"] },
      { foto: "fotos/padrinos-3.jpg", rol: "Lazo",      nombres: ["Héctor Ríos", "Paola Cárdenas"] },
    ],
  },

  // ----- FECHA + CONTADOR + CALENDARIO -----
  fecha: {
    animacion:   "subir",
    hojas:       "ambos",
    fondo:       "alterno",
    titulo:      "Save the date",
    diaSemana:   "Sábado",
    dia:         { texto: "17", animacion: "rebote" },
    mes:         "Abril",
    anio:        "2027",
    hora:        "5:00 p.m.",
    textoContador: "Faltan",
    etiquetas:   { dias: "Días", horas: "Horas", minutos: "Min", segundos: "Seg" },
    textoFinal:  "¡Llegó el gran día!",   // se muestra cuando el contador llega a cero
    botonCalendario: "Guardar en mi calendario",
  },

  // ----- MISA -----
  misa: {
    animacion: "subir",
    hojas:     "izquierda",
    fondo:     "claro",
    titulo:    "Ceremonia religiosa",
    icono:     "iconos/iglesia.svg",
    foto:      "fotos/misa.jpg",
    nombre:    "Parroquia de la Natividad",
    direccion: "Av. Revolución s/n, Centro<br>Tepoztlán, Morelos",
    hora:      "5:00 p.m.",
    boton:     "Abrir ubicación",
    mapa:      "https://www.google.com/maps/search/?api=1&query=Parroquia+de+la+Natividad+Tepoztlan",
  },

  // ----- RECEPCIÓN -----
  recepcion: {
    animacion: "subir",
    hojas:     "derecha",
    fondo:     "claro",
    titulo:    "Recepción",
    icono:     "iconos/copas.svg",
    foto:      "fotos/recepcion.jpg",
    nombre:    "Jardín Los Olivos",
    direccion: "Camino a San Andrés de la Cal 120<br>Tepoztlán, Morelos",
    hora:      "7:00 p.m.",
    boton:     "Abrir ubicación",
    mapa:      "https://www.google.com/maps/search/?api=1&query=Tepoztlan+Morelos",
  },

  // ----- ITINERARIO -----
  itinerario: {
    hojas:     "no",
    fondo:     "alterno",
    titulo:    "Itinerario",
    lista: [
      { hora: "5:00 p.m.",  titulo: "Ceremonia religiosa", texto: "Parroquia de la Natividad",  icono: "iconos/anillos.svg" },
      { hora: "6:30 p.m.",  titulo: "Cóctel de bienvenida", texto: "Jardín Los Olivos",         icono: "iconos/copas.svg" },
      { hora: "7:30 p.m.",  titulo: "Sesión de fotos",     texto: "Con familia y amigos",       icono: "iconos/camara.svg" },
      { hora: "8:30 p.m.",  titulo: "Cena",                texto: "Menú de tres tiempos",       icono: "iconos/cubiertos.svg" },
      { hora: "10:00 p.m.", titulo: "Primer baile",        texto: "",                           icono: "iconos/musica.svg" },
      { hora: "10:30 p.m.", titulo: "Pastel",              texto: "",                           icono: "iconos/pastel.svg" },
      { hora: "11:00 p.m.", titulo: "¡A bailar!",          texto: "Hasta que el cuerpo aguante", icono: "iconos/fiesta.svg" },
    ],
  },

  // ----- FOTO PARALLAX 2 -----
  parallax2: {
    animacion: "zoom-suave",
    foto:      "fotos/parallax-2.jpg",
    texto:     "",
  },

  // ----- ÁLBUM DIGITAL -----
  album: {
    animacion: "subir",
    hojas:     "izquierda",
    fondo:     "claro",
    titulo:    "Álbum digital",
    icono:     "iconos/camara.svg",
    foto:      "fotos/album.jpg",
    texto:     "Ayúdanos a guardar cada momento. Sube tus fotos y videos de la boda a nuestro álbum compartido y usa nuestro hashtag en redes.",
    hashtag:   "#SofiaYMateo2027",
    boton:     "Subir mis fotos",
    enlace:    "https://photos.google.com/",
  },

  // ----- GALERÍA (toca una foto para verla en grande) -----
  galeria: {
    animacion: "zoom",
    hojas:     "no",
    fondo:     "alterno",
    titulo:    "Nuestra historia",
    texto:     "Algunos de nuestros momentos favoritos",
    fotos: [
      "fotos/galeria-01.jpg", "fotos/galeria-02.jpg", "fotos/galeria-03.jpg",
      "fotos/galeria-04.jpg", "fotos/galeria-05.jpg", "fotos/galeria-06.jpg",
      "fotos/galeria-07.jpg", "fotos/galeria-08.jpg", "fotos/galeria-09.jpg",
      "fotos/galeria-10.jpg",
    ],
  },

  // ----- CÓDIGO DE VESTIMENTA -----
  vestimenta: {
    animacion: "subir",
    hojas:     "ambos",
    fondo:     "claro",
    titulo:    "Código de vestimenta",
    tipo:      "Formal",
    mujeres:   { icono: "iconos/vestido.svg", titulo: "Mujeres", texto: "Vestido largo o de coctel" },
    hombres:   { icono: "iconos/traje.svg",   titulo: "Hombres", texto: "Traje oscuro y corbata" },
    nota:      "Con mucho cariño, reservamos el color blanco para la novia.",
    textoPaleta: "Paleta sugerida",
    paleta:    ["#c8b99c", "#a3826c", "#8b8f6a", "#5b6b7a", "#3d3a32"],   // "" o [] para ocultar
  },

  // ----- REGALOS -----
  regalos: {
    animacion: "subir",
    hojas:     "derecha",
    fondo:     "alterno",
    titulo:    "Mesa de regalos",
    texto:     "Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, te compartimos algunas opciones.",
    lista: [
      {
        icono:  "iconos/bolsa.svg",
        titulo: "Liverpool",
        texto:  "Número de evento",
        numero: "51234567",
        boton:  "Ver mesa de regalos",
        enlace: "https://mesaderegalos.liverpool.com.mx/milistaderegalos/51234567",
      },
      {
        icono:  "iconos/banco.svg",
        titulo: "Transferencia bancaria",
        texto:  "",
        filas: [
          { etiqueta: "Banco",   valor: "BBVA" },
          { etiqueta: "Titular", valor: "Sofía Valdés Ortega" },
          { etiqueta: "Cuenta",  valor: "0123 4567 89" },
          { etiqueta: "CLABE",   valor: "012180001234567891", copiar: true },
        ],
      },
      {
        mostrar: false,   // ← cambia a true si habrá lluvia de sobres
        icono:  "iconos/sobre.svg",
        titulo: "Lluvia de sobres",
        texto:  "El día del evento habrá una caja para depositar tu sobre.",
      },
    ],
  },

  // ----- HOSPEDAJE -----
  hospedaje: {
    animacion: "subir",
    hojas:     "izquierda",
    fondo:     "claro",
    titulo:    "Hospedaje",
    texto:     "Para nuestros invitados que vienen de fuera, te sugerimos estas opciones cercanas.",
    lista: [
      {
        icono:     "iconos/hotel.svg",
        nombre:    "Hotel Casa Olivo",
        texto:     "A 5 minutos de la recepción",
        direccion: "Calle del Tepozteco 15, Tepoztlán",
        telefono:  "+52 739 123 4567",
        codigo:    "Menciona el código BODASYM para 15% de descuento",
        reservar:  "https://www.google.com/search?q=hotel+tepoztlan",
        mapa:      "https://www.google.com/maps/search/?api=1&query=hoteles+Tepoztlan",
      },
      {
        icono:     "iconos/hotel.svg",
        nombre:    "Posada Jardín del Valle",
        texto:     "A 10 minutos de la parroquia",
        direccion: "Av. 5 de Mayo 48, Tepoztlán",
        telefono:  "+52 739 765 4321",
        codigo:    "",
        reservar:  "https://www.google.com/search?q=posada+tepoztlan",
        mapa:      "https://www.google.com/maps/search/?api=1&query=posadas+Tepoztlan",
      },
    ],
    botonReservar: "Reservar",
    botonMapa:     "Ubicación",
  },

  // ----- INVITADOS (pase personalizado) -----
  // El nombre y los pases se pueden poner en el LINK de cada invitado:
  //    index.html?invitado=Familia%20López&pases=4
  // (usa generador-links.html para crearlos fácil). Si el link no los trae,
  // se usan los de aquí abajo.
  invitados: {
    animacion:     "subir",
    hojas:         "ambos",
    fondo:         "alterno",
    titulo:        "Pase de entrada",
    textoAntes:    "Esta invitación es para",
    invitado:      "Familia Ramírez Ortega",
    pases:         4,
    textoPases:    "Hemos reservado <b>{pases}</b> lugares en su honor",
    textoUnPase:   "Hemos reservado <b>1</b> lugar en su honor",
    nota:          "Con cariño, este evento es solo para adultos.",   // "" para ocultar
  },

  // ----- CONFIRMAR ASISTENCIA -----
  confirmar: {
    animacion:   "subir",
    hojas:       "no",
    fondo:       "claro",
    titulo:      "Confirma tu asistencia",
    texto:       "Por favor confírmanos antes del <b>1 de marzo de 2027</b>. Tu respuesta nos ayuda a preparar todo con mucho cariño.",
    boton:       { texto: "Ir al formulario", animacion: "latido" },
    botonWhatsapp: "Confirmar por WhatsApp",   // "" para ocultar este botón
    whatsapp:    "5215512345678",              // número con código de país, solo dígitos (52 + 1 + 10 dígitos)
    mensajeWhatsapp: "¡Hola! Soy {invitado} y quiero confirmar mi asistencia a la boda de Sofía & Mateo.",
  },

  // ----- FORMULARIO DE CONFIRMACIÓN -----
  formulario: {
    animacion: "subir",
    hojas:     "ambos",
    fondo:     "alterno",
    titulo:    "Formulario",
    texto:     "Llena tus datos y presiona enviar.",
    // A dónde se envía la confirmación:
    //   "whatsapp" → abre WhatsApp con el mensaje listo para enviar al número de abajo
    //   "prueba"   → solo muestra el mensaje de gracias (para hacer pruebas)
    enviarA:   "whatsapp",
    whatsapp:  "5215512345678",
    // OPCIONAL: URL de un Google Apps Script para guardar respuestas en Google Sheets
    googleSheets: "",
    etiquetas: {
      nombre:     "Nombre completo",
      asistencia: "¿Nos acompañarás?",
      si:         "¡Sí, ahí estaré!",
      no:         "Lo siento, no podré ir",
      personas:   "Número de asistentes",
      telefono:   "Teléfono (opcional)",
      mensaje:    "Mensaje para los novios (opcional)",
      boton:      "Enviar confirmación",
    },
    gracias:   "¡Gracias por confirmar! Nos hace muy felices compartir este día contigo.",
  },

  // ----- FOTO FINAL (pantalla completa) -----
  final: {
    animacion: "desenfoque",
    foto:      "fotos/final.jpg",
    titulo:    "¡Te esperamos!",
    texto:     "Gracias por ser parte de nuestra historia",
    firma:     "Sofía & Mateo",
  },

  // ----- PIE DE PÁGINA (tu marca) -----
  pie: {
    texto:  "Invitación digital diseñada con ♥ por Tu Marca",
    enlace: "",    // link a tu Instagram / WhatsApp / página ("" = sin link)
  },

  // ----- MÚSICA -----
  musica: {
    archivo:  "musica/cancion.mp3",   // pon tu archivo .mp3 en la carpeta /musica
    volumen:  0.5,                    // de 0 a 1
  },
};
