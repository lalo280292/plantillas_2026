/** PLANTILLA 01 · OTOÑO
 * Edita aquí los datos. Activa, desactiva o reordena secciones en `modules`.
 * Todas las rutas de fotografía apuntan a photos/.
 * Las fotos y datos actuales son de demostración; sustituir antes de publicar.
 */
window.WEDDING = {
  demo: true,
  title: "Valeria & Santiago · Nuestra boda",
  shortNames: ["Valeria", "Santiago"],
  date: "2026-11-21T17:00:00-06:00",
  endDate: "2026-11-22T02:00:00-06:00",
  timezone: "America/Mexico_City",
  city: "Oaxaca, México",
  intro:
    "Hay personas que se convierten en hogar. Y hay días que queremos guardar para siempre. Este es el nuestro, y queremos compartirlo contigo.",
  // El orden de esta lista es el orden de la invitación.
  modules: [
    { id: "cover", enabled: true },
    { id: "couple", enabled: true },
    { id: "parallaxOne", enabled: true },
    { id: "parents", enabled: true },
    { id: "godparents", enabled: true },
    { id: "date", enabled: true },
    { id: "ceremony", enabled: true },
    { id: "reception", enabled: true },
    { id: "itinerary", enabled: true },
    { id: "parallaxTwo", enabled: true },
    { id: "album", enabled: true },
    { id: "gallery", enabled: true },
    { id: "dresscode", enabled: true },
    { id: "gifts", enabled: true },
    { id: "guests", enabled: true },
    { id: "rsvp", enabled: true },
    { id: "form", enabled: true },
    { id: "closing", enabled: true },
  ],
  cover: [
    {
      src: "photos/portada-01.jpg",
      alt: "Una pareja entre árboles y flores",
      position: "52% 42%",
    },
    {
      src: "photos/portada-02.jpg",
      alt: "Un abrazo bajo la luz de la tarde",
      position: "52% 45%",
    },
    {
      src: "photos/portada-03.jpg",
      alt: "La alegría de comenzar una vida juntos",
      position: "56% 42%",
    },
  ],
  slideDuration: 6500,
  // crop usa coordenadas de la imagen original en píxeles: [x, y, ancho, alto, anchoOriginal].
  // Es sólo un recorte visual CSS de las referencias. Para una foto nueva, basta src y alt.
  couple: [
    {
      name: "Valeria Ramírez Torres",
      short: "Valeria",
      photo: {
        src: "photos/pareja-referencia.png",
        alt: "Retrato de ejemplo de la novia",
        crop: [514, 298, 206, 206, 941],
      },
      message:
        "En ti encontré mi lugar favorito. Hoy elijo caminar contigo, en todas las estaciones de la vida.",
    },
    {
      name: "Santiago Hernández Morales",
      short: "Santiago",
      photo: {
        src: "photos/pareja-referencia.png",
        alt: "Retrato de ejemplo del novio",
        crop: [376, 292, 210, 210, 941],
      },
      message:
        "Lo más bonito de nuestra historia es todo lo que todavía nos queda por escribir. Siempre, contigo.",
    },
  ],
  parents: [
    {
      label: "Padres de la novia",
      people: [
        {
          name: "Carlos Ramírez",
          photo: {
            src: "photos/familias-referencia.png",
            alt: "Retrato de ejemplo de Carlos",
            crop: [91, 301, 152, 152, 941],
          },
        },
        {
          name: "María Elena Torres",
          photo: {
            src: "photos/familias-referencia.png",
            alt: "Retrato de ejemplo de María Elena",
            crop: [292, 301, 150, 150, 941],
          },
        },
      ],
    },
    {
      label: "Padres del novio",
      people: [
        {
          name: "Javier Hernández",
          photo: {
            src: "photos/familias-referencia.png",
            alt: "Retrato de ejemplo de Javier",
            crop: [542, 301, 150, 150, 941],
          },
        },
        {
          name: "Lucía Morales",
          photo: {
            src: "photos/familias-referencia.png",
            alt: "Retrato de ejemplo de Lucía",
            crop: [706, 301, 150, 150, 941],
          },
        },
      ],
    },
  ],
  godparents: [
    {
      name: "Alejandro Ríos",
      role: "Padrino de velación",
      photo: {
        src: "photos/familias-referencia.png",
        alt: "Retrato de ejemplo de Alejandro",
        crop: [266, 621, 148, 148, 941],
      },
    },
    {
      name: "Fernanda Castillo",
      role: "Madrina de velación",
      photo: {
        src: "photos/familias-referencia.png",
        alt: "Retrato de ejemplo de Fernanda",
        crop: [537, 621, 148, 148, 941],
      },
    },
  ],
  parallaxOne: {
    photo: {
      src: "photos/portada-02.jpg",
      alt: "Un momento juntos al atardecer",
    },
    quote: "De todas las cosas bonitas de la vida, tú.",
  },
  parallaxTwo: {
    photo: {
      src: "photos/portada-03.jpg",
      alt: "Una pareja abrazada bajo un árbol",
    },
    quote: "Que la vida nos encuentre siempre de la mano.",
  },
  ceremony: {
    label: "La ceremonia",
    title: "Templo de Santo Domingo",
    subtitle: "de Guzmán",
    time: "17:00 h",
    address:
      "C. Macedonio Alcalá s/n, Centro Histórico, Oaxaca de Juárez, Oaxaca.",
    mapQuery: "Templo de Santo Domingo de Guzmán Oaxaca",
    photo: {
      src: "photos/lugares-referencia.png",
      alt: "Ilustración de referencia de un templo oaxaqueño",
      crop: [62, 426, 378, 293, 941],
    },
  },
  reception: {
    label: "La recepción",
    title: "Hacienda Los Laureles",
    subtitle: "Una noche para recordar",
    time: "19:00 h",
    address:
      "Carr. a San Felipe del Agua, km 7.5, Oaxaca de Juárez, Oaxaca.",
    mapQuery: "Hacienda Los Laureles Oaxaca",
    photo: {
      src: "photos/lugares-referencia.png",
      alt: "Ilustración de referencia de una hacienda",
      crop: [516, 477, 390, 245, 941],
    },
  },
  itinerary: [
    {
      time: "17:00",
      title: "El «sí, acepto»",
      description: "Ceremonia religiosa",
      icon: "church",
    },
    {
      time: "18:30",
      title: "Un brindis por nosotros",
      description: "Cóctel de bienvenida",
      icon: "glasses",
    },
    {
      time: "19:00",
      title: "A la mesa",
      description: "Recepción y cena",
      icon: "plate",
    },
    {
      time: "21:00",
      title: "Nuestro primer baile",
      description: "Un momento inolvidable",
      icon: "heart",
    },
    {
      time: "21:30",
      title: "¡A celebrar!",
      description: "Que no pare la música",
      icon: "music",
    },
  ],
  album: {
    hashtag: "#ValeriaYSantiago",
    url: "",
    message:
      "Queremos recordar este día también a través de tus ojos. Comparte aquí tus fotos y videos favoritos.",
  },
  gallery: [
    { src: "photos/portada-01.jpg", alt: "Juntos, en nuestro lugar favorito" },
    { src: "photos/portada-02.jpg", alt: "La luz de una tarde juntos" },
    {
      src: "photos/pareja-referencia.png",
      alt: "Inspiración para una boda en Oaxaca",
      crop: [220, 160, 600, 775, 941],
    },
    { src: "photos/portada-03.jpg", alt: "Sonrisas que lo dicen todo" },
  ],
  dresscode: {
    title: "Formal",
    description:
      "Vestidos largos o midi y traje. Celebremos con elegancia y con zapatos listos para bailar.",
    note: "Reservamos el blanco y el marfil para la novia.",
    colors: [
      { name: "Terracota", value: "#ac7259" },
      { name: "Oliva", value: "#77765b" },
      { name: "Cacao", value: "#675047" },
      { name: "Rosa antiguo", value: "#be9690" },
    ],
  },
  gifts: {
    message:
      "Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, aquí encontrarás algunas opciones.",
    liverpoolUrl: "",
    eventNumber: "",
    bank: { holder: "", name: "", clabe: "" },
  },
  invitation: {
    name: "Familia Rodríguez García",
    seats: 2,
    message: "Hemos reservado un lugar muy especial para ustedes.",
  },
  rsvp: {
    deadline: "1 de noviembre de 2026",
    mode: "demo",
    endpoint: "",
    whatsapp: "",
    privacy:
      "Usaremos estos datos únicamente para organizar nuestra boda. No incluyas información sensible en tu mensaje.",
  },
  closing: {
    photo: {
      src: "photos/portada-01.jpg",
      alt: "El comienzo de una vida juntos",
      position: "55% 45%",
    },
    title: "Contigo, siempre.",
    message: "Gracias por ser parte de nuestra historia.",
  },
};
