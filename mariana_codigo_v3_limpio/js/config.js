window.INVITATION_CONFIG = Object.freeze({

  development: {
  skipEnvelope: false
},

  event: {
    honoree: 'Mariana',
    subtitle: 'XV Años',
    subtitle2: '8-8-8',
    dateISO: '2026-10-17T16:00:00-06:00',
    day: '17',
    month: 'Octubre',
    year: '2026',
    message: 'Hoy celebro mis XV años con el corazón lleno de gratitud. Agradezco a Dios por permitirme llegar a este momento especial y por acompañarme en cada paso de mi camino. Hace 15 años, mi familia dio gracias a Dios por mi llegada. Hoy, soy yo quien agradece a Dios por ellos: por su amor incondicional, por sus consejos y por estar siempre ahí apoyándome. He aprendido que estar con quienes quiero es suficiente para ser feliz, es por ello que quiero hacerte partícipe en este día tan especial.'
  },
  family: {
    parents: ['Haydeé Gómez Llanos Juárez', 'Gilberto Cárdenas Tostado'],
    godparents: ['Nisa Enia Vásquez Luque', 'Teodoro Gómez Llanos Juárez']
  },
  locations: {
    ceremony: {
      name: 'Parroquia Divino Maestro y Nuestra Señora de Guadalupe',
      time: '4:00 p.m.',
      maps: 'https://maps.app.goo.gl/UZgjXYZ6UaDfFi996'
    },
    reception: {
      name: 'Salón Aqua Rio',
      time: '7:00 p.m.',
      maps: 'https://maps.app.goo.gl/qNLcLSVbk6TPiTHU8'
    }
  },
  itinerary: [
    { label: 'Ceremonia', time: '4:00 p.m.', image: 'assets/images/itinerary-ceremony.jpg' },
    { label: 'Recepción', time: '7:00 p.m.', image: 'assets/images/itinerary-reception.jpg' },
    { label: 'Cena', time: '8:00 p.m.', image: 'assets/images/itinerary-dinner.jpg' }
  ],
  social: {
    hashtag: '#XVMarianacgll',
    albumUrl: 'https://weduploader.com/mariana'
  },
  gallery: Array.from({ length: 15 }, (_, i) => `assets/gallery/${String(i + 1).padStart(2, '0')}.jpg`),
  audio: {
    // El archivo original de Muse también usa esta URL externa.
    src: 'https://musica.enfoquedigital.com.mx/musica/yiruma.mp3'
  },
  api: {
    guests: 'api/proxy.php?sheet=Lista',
    submit: 'api/proxy.php',
    control: 'api/control.php',
    qrPass: 'api/paseqr.html'
  }
});
