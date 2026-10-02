/* Renderizado de módulos. El contenido se edita en config.js. */
(() => {
  "use strict";
  const c = window.WEDDING;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[ch],
    );
  const enabled = (id) => c.modules.some((m) => m.id === id && m.enabled);
  const external = (value) => {
    try {
      const u = new URL(value);
      return ["https:", "http:"].includes(u.protocol) ? esc(u.href) : "";
    } catch {
      return "";
    }
  };
  const paths = {
    heart:
      '<path d="M24 39S5 28 5 15C5 3 20 3 24 14 28 3 43 3 43 15c0 13-19 24-19 24Z"/>',
    arrow: '<path d="M8 24h30M27 13l11 11-11 11"/>',
    camera:
      '<path d="M5 15h10l4-6h10l4 6h10v25H5Z"/><circle cx="24" cy="27" r="8"/>',
    calendar:
      '<rect x="7" y="10" width="34" height="32" rx="2"/><path d="M15 5v10M33 5v10M7 21h34M15 28h3m6 0h3m6 0h2M15 35h3m6 0h3"/>',
    pin: '<path d="M24 44S8 29 8 18a16 16 0 0 1 32 0c0 11-16 26-16 26Z"/><circle cx="24" cy="18" r="5"/>',
    church:
      '<path d="M6 43V22l10-7v28m16 0V15l10 7v21ZM16 43V15l8-9 8 9v28M21 6h6M24 2v7M21 43V31a3 3 0 0 1 6 0v12"/><circle cx="24" cy="20" r="3"/>',
    glasses:
      '<path d="m6 5 13 4-4 13c-3 8-15 4-12-4ZM10 26 6 40M1 39l11 3M29 9l13-4 3 13c3 8-9 12-12 4ZM38 26l4 14m-6 2 11-3M21 3l3 5 3-5"/>',
    plate:
      '<circle cx="24" cy="24" r="13"/><circle cx="24" cy="24" r="9"/><path d="M4 5v16h5V5M6 5v38M43 43V5c-8 7-8 19 0 19"/>',
    music:
      '<path d="M19 34V10l22-5v25M19 17l22-5"/><ellipse cx="12" cy="36" rx="7" ry="5"/><ellipse cx="34" cy="32" rx="7" ry="5"/>',
    dress:
      '<path d="M17 5v10l-4 9L5 43h38l-8-19-4-9V5M17 9c5 7 9 7 14 0M15 22h18"/>',
    gift: '<path d="M7 22h34v21H7ZM4 14h40v8H4ZM24 14v29M24 14C5 15 9-2 17 4c5 4 7 10 7 10Zm0 0C43 15 39-2 31 4c-5 4-7 10-7 10Z"/>',
    bank: '<path d="m4 15 20-12 20 12ZM4 43h40M8 38h32M11 20v14m13-14v14m13-14v14"/>',
    leaf: '<path d="M8 43C27 33 34 15 39 4M16 36C-2 27 5 16 5 16c16 0 20 9 11 20Zm9-13C13 11 20 4 20 4c12 3 13 11 5 19Zm3 0c17 6 19-9 19-9-13-5-19 9-19 9Z"/>',
  };
  const icon = (name) =>
    `<svg class="icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.heart}</svg>`;
  function branch(cls = "") {
    return `<svg class="botanical ${cls}" viewBox="0 0 240 360" aria-hidden="true" fill="none"><g stroke="currentColor" stroke-width="1.1"><path d="M49 350C93 284 126 201 152 34M96 268l-55-47m73-2 75-53m-62 15-58-62m70 15 58-43m-49 4-27-48"/>${[
      [80, 296, -35],
      [105, 247, 28],
      [126, 189, -28],
      [141, 126, 20],
      [151, 63, -15],
      [52, 230, -55],
      [76, 130, -40],
      [176, 174, 40],
      [188, 105, 35],
    ]
      .map(
        ([x, y, r]) =>
          `<path transform="translate(${x} ${y}) rotate(${r})" d="M0 0C-31-10-27-41-17-59 1-43 15-20 0 0Z" fill="currentColor" fill-opacity=".12"/>`,
      )
      .join("")}</g></svg>`;
  }
  const ornament = () =>
    `<div class="ornament"><span></span>${icon("leaf")}<span></span></div>`;
  function photo(p, cls = "", eager = false) {
    let style = "",
      imageStyle = `object-position:${p.position || "50% 50%"}`;
    if (p.crop) {
      const [x, y, w, h, originalWidth] = p.crop;
      style = `aspect-ratio:${w}/${h}`;
      imageStyle = `width:${(originalWidth / w) * 100}%;height:auto;max-width:none;left:${(-x / w) * 100}%;top:0;margin-top:${(-y / w) * 100}%;object-fit:initial`;
    }
    return `<span class="photo ${cls} ${p.crop ? "crop" : ""}" style="${style}"><img src="${esc(p.src)}" alt="${esc(p.alt)}" style="${imageStyle}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></span>`;
  }
  const heading = (eyebrow, title, text = "") =>
    `<div class="section-heading reveal"><p class="eyebrow">${esc(eyebrow)}</p><h2>${title}</h2>${text ? `<p class="intro">${esc(text)}</p>` : ""}</div>`;
  const section = (id, body, cls = "") =>
    `<section id="${id}" class="section ${cls}">${body}</section>`;
  const people = (list) =>
    list
      .map(
        (p) =>
          `<article class="person reveal">${photo(p.photo, "portrait")}<h3>${esc(p.name)}</h3>${p.role ? `<p class="caption">${esc(p.role)}</p>` : ""}</article>`,
      )
      .join("");
  const link = (url, text, ico = "arrow") =>
    `<a class="button" href="${url}" target="_blank" rel="noopener noreferrer">${esc(text)}${icon(ico)}</a>`;
  function venueSection(id) {
    const d = c[id];
    return section(
      id,
      `<div class="venue wrap reveal ${id === "reception" ? "reverse" : ""}"><div class="venue-image">${photo(d.photo)}<span class="venue-number">${id === "ceremony" ? "01" : "02"}</span></div><div class="venue-copy"><p class="eyebrow">${esc(d.label)}</p><h2>${esc(d.title)}</h2><p class="venue-subtitle">${esc(d.subtitle)}</p><p class="venue-time">${esc(d.time)}</p><address>${esc(d.address)}</address>${link("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(d.mapQuery), "Abrir ubicación", "pin")}</div></div>`,
      "venue-section",
    );
  }
  function parallax(id) {
    const d = c[id];
    return section(
      id,
      `${photo(d.photo, "parallax-photo")}<div class="photo-shade"></div><div class="quote-content">${icon("leaf")}<blockquote>${esc(d.quote)}</blockquote></div>`,
      "parallax torn",
    );
  }
  const dateLabel = new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: c.timezone,
  }).format(new Date(c.date));
  const dateParts = new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    weekday: "long",
    timeZone: c.timezone,
  }).formatToParts(new Date(c.date));
  const part = (t) => dateParts.find((p) => p.type === t)?.value;
  const renderers = {
    cover: () =>
      section(
        "cover",
        `<div class="cover-photos">${c.cover.map((p, i) => `<div class="slide ${i === 0 ? "active" : ""}" aria-hidden="${i !== 0}">${photo(p, "", i === 0)}</div>`).join("")}<div class="cover-shade"></div><div class="cover-top"><span>Nuestra boda</span><span>${esc(c.city)}</span></div><div class="cover-caption"><p class="eyebrow">Una vida. Todas las estaciones.</p><p class="cover-promise">El comienzo<br>de nuestro <em>siempre.</em></p></div><div class="slide-controls"><div class="slide-dots">${c.cover.map((_, i) => `<button data-slide="${i}" aria-label="Mostrar foto ${i + 1}" aria-pressed="${i === 0}"><span></span></button>`).join("")}</div><button id="slideshow-toggle" aria-label="Pausar cambio de fotos">Ⅱ</button></div></div><div class="cover-names">${branch("left")}${branch("right")}<p class="eyebrow">Nos elegimos, para siempre</p><h1 class="names"><span class="name name-one">${esc(c.shortNames[0])}</span><span class="amp">&</span><span class="name name-two">${esc(c.shortNames[1])}</span><span class="names-heart">${icon("heart")}</span></h1><p class="cover-date">${esc(dateLabel)} <span>·</span> ${esc(c.city)}</p><a class="scroll-hint" href="#${enabled("couple") ? "couple" : enabled("date") ? "date" : "contenido"}" aria-label="Descubrir la invitación">↓</a></div>`,
        "cover",
      ),
    couple: () =>
      section(
        "couple",
        `<div class="wrap">${heading("Nuestra historia", "Dos caminos.<br><em>Un mismo destino.</em>", c.intro)}${ornament()}<div class="couple-grid">${c.couple.map((p) => `<article class="couple-person reveal">${photo(p.photo, "portrait")}<p class="eyebrow">${esc(p.short)}</p><h3>${esc(p.name)}</h3><p class="personal-message">“${esc(p.message)}”</p></article>`).join("")}</div></div>`,
      ),
    parallaxOne: () => parallax("parallaxOne"),
    parents: () =>
      section(
        "parents",
        `<div class="wrap">${heading("Nuestras raíces", "El amor que nos <em>acompaña.</em>", "Con la bendición y el cariño de nuestros padres.")}<div class="family-grid">${c.parents.map((g) => `<div><h3 class="eyebrow family-label">${esc(g.label)}</h3><div class="people-grid">${people(g.people)}</div></div>`).join("")}</div></div>`,
      ),
    godparents: () =>
      section(
        "godparents",
        `<div class="wrap">${ornament()}${heading("Testigos de nuestro amor", "Nuestros padrinos")}<div class="people-grid godparents">${people(c.godparents)}</div></div>`,
        "godparents-section",
      ),
    date: () =>
      section(
        "date",
        `<div class="wrap">${branch("date-branch")}${heading("Reserva este día", "Una fecha para <em>siempre.</em>")}<div class="date-lockup reveal"><span>${esc(part("weekday"))}</span><strong>${esc(part("day"))}</strong><span>${esc(part("month"))}<br>${esc(part("year"))}</span></div><p class="eyebrow">Cada vez falta menos</p><div class="countdown" role="timer" aria-label="Tiempo para la boda">${["Días", "Horas", "Minutos", "Segundos"].map((s, i) => `<div><strong data-count="${i}">00</strong><span>${s}</span></div>`).join("")}</div><button id="calendar-download" class="button">Guardar en mi calendario${icon("calendar")}</button></div>`,
        "date-section",
      ),
    ceremony: () => venueSection("ceremony"),
    reception: () => venueSection("reception"),
    itinerary: () =>
      section(
        "itinerary",
        `<div class="wrap">${heading("Así viviremos nuestro día", "Momentos que serán <em>recuerdos.</em>")}<ol class="timeline">${c.itinerary.map((d, i) => `<li class="timeline-item"><span class="timeline-number">0${i + 1}</span>${icon(d.icon)}<time>${esc(d.time)}</time><h3>${esc(d.title)}</h3><p>${esc(d.description)}</p></li>`).join("")}</ol></div>`,
      ),
    parallaxTwo: () => parallax("parallaxTwo"),
    album: () =>
      section(
        "album",
        `<div class="wrap album-inner reveal">${icon("camera")}<p class="eyebrow">Nuestro álbum digital</p><h2>Tu mirada también<br>es parte de <em>la historia.</em></h2><p class="intro">${esc(c.album.message)}</p>${external(c.album.url) ? link(external(c.album.url), "Compartir fotos", "camera") : '<button class="button" data-info="album">Compartir fotos' + icon("camera") + "</button>"}<p class="hashtag">${esc(c.album.hashtag)}</p></div>`,
      ),
    gallery: () =>
      section(
        "gallery",
        `<div class="wrap">${heading("Pedacitos de nosotros", "Una historia en <em>imágenes.</em>")}<div class="gallery-grid">${c.gallery.map((p, i) => `<button class="gallery-item reveal" data-gallery="${i}" aria-label="Ampliar: ${esc(p.alt)}">${photo(p)}<span>Ver fotografía ↗</span></button>`).join("")}</div></div>`,
      ),
    dresscode: () =>
      section(
        "dresscode",
        `<div class="wrap dress-inner reveal"><div>${icon("dress")}<p class="eyebrow">Código de vestimenta</p><h2>${esc(c.dresscode.title)}</h2></div><div><p class="intro">${esc(c.dresscode.description)}</p><p class="caption">Inspiración de color</p><div class="swatches">${c.dresscode.colors.map((color) => `<span style="--swatch:${esc(color.value)}" role="img" aria-label="${esc(color.name)}" title="${esc(color.name)}"></span>`).join("")}</div><p class="caption">${esc(c.dresscode.note)}</p></div></div>`,
        "dress-section",
      ),
    gifts: () =>
      section(
        "gifts",
        `<div class="wrap">${heading("Detalles con amor", "El mejor regalo es <em>tenerte aquí.</em>", c.gifts.message)}<div class="gift-grid"><article class="gift-card reveal">${icon("gift")}<h3>Mesa de regalos</h3><p class="liverpool">Liverpool</p>${c.gifts.eventNumber ? `<p>Evento ${esc(c.gifts.eventNumber)}</p>` : ""}${external(c.gifts.liverpoolUrl) ? link(external(c.gifts.liverpoolUrl), "Ver mesa de regalos") : '<button class="text-button" data-info="liverpool">Ver mesa de regalos ↗</button>'}</article><article class="gift-card reveal">${icon("bank")}<h3>Un nuevo comienzo</h3><p>Si prefieres un detalle para<br>nuestro próximo capítulo.</p><button class="text-button" data-info="bank">Ver datos bancarios ↗</button></article></div></div>`,
      ),
    guests: () =>
      section(
        "guests",
        `<div class="invitation-card reveal">${branch("invitation-branch")}<p class="eyebrow">Esta invitación es para</p><h2 id="guest-name">${esc(c.invitation.name)}</h2><p>${esc(c.invitation.message)}</p><p class="seats">${icon("heart")}<span>${c.invitation.seats} ${c.invitation.seats === 1 ? "lugar reservado" : "lugares reservados"}</span></p></div>`,
        "guests-section",
      ),
    rsvp: () =>
      section(
        "rsvp",
        `<div class="wrap">${heading("Nos haría muy felices verte", "¿Nos acompañas?", "Confirma tu asistencia antes del " + c.rsvp.deadline + ".")}${enabled("form") ? '<a class="button button-filled" href="#form">Confirmar asistencia' + icon("arrow") + "</a>" : "<p>Comunícate con los novios para confirmar tu asistencia.</p>"}</div>`,
        "rsvp-section",
      ),
    form: () =>
      section(
        "form",
        `<div class="wrap form-wrap"><form id="rsvp-form"><h2>Un lugar en <em>nuestra historia.</em></h2><label>Nombre completo<input name="name" autocomplete="name" required maxlength="120" placeholder="Escribe tu nombre"></label><fieldset><legend>¿Podrás acompañarnos?</legend><label class="radio-label"><input type="radio" name="attendance" value="yes" required> Sí, ahí estaré</label><label class="radio-label"><input type="radio" name="attendance" value="no"> No podré asistir</label></fieldset><label id="party-size-label">Número de asistentes<select name="guests">${Array.from({ length: c.invitation.seats }, (_, i) => `<option value="${i + 1}">${i + 1} ${i ? "personas" : "persona"}</option>`).join("")}</select></label><label>Un mensaje para los novios <span class="optional">(opcional)</span><textarea name="message" rows="3" maxlength="1000" placeholder="Nos encantará leerte…"></textarea></label><label class="consent"><input type="checkbox" name="consent" required><span>${esc(c.rsvp.privacy)}</span></label><button type="submit" class="button button-filled">${c.rsvp.mode === "demo" ? "Probar confirmación" : c.rsvp.mode === "whatsapp" ? "Preparar mensaje de confirmación" : "Enviar confirmación"}${icon("arrow")}</button>${c.rsvp.mode === "demo" ? '<p class="demo-note">Vista de muestra: este formulario todavía no envía respuestas a los novios.</p>' : ""}<p id="form-status" role="status" aria-live="polite"></p></form></div>`,
        "form-section",
      ),
    closing: () =>
      section(
        "closing",
        `${photo(c.closing.photo)}<div class="photo-shade"></div><div class="closing-copy reveal"><p class="eyebrow">${esc(c.shortNames.join(" & "))}</p><h2>${esc(c.closing.title)}</h2><p>${esc(c.closing.message)}</p>${ornament()}<p>${esc(dateLabel)}</p></div>`,
        "closing",
      ),
  };
  document.title = c.title;
  $("#contenido").innerHTML = c.modules
    .filter((m) => m.enabled && renderers[m.id])
    .map((m) => renderers[m.id]())
    .join("");
  $("#navigation").innerHTML = [
    ["couple", "Nosotros"],
    ["date", "El gran día"],
    ["gallery", "Recuerdos"],
    ["rsvp", "Confirmar"],
  ]
    .filter(([id]) => enabled(id))
    .map(
      ([id, label]) =>
        `<a href="#${id}" ${id === "rsvp" ? 'class="nav-rsvp"' : ""}>${label}</a>`,
    )
    .join("");
  $(".monogram").innerHTML =
    `${esc(c.shortNames[0][0])}<span>&</span>${esc(c.shortNames[1][0])}`;
  $(".footer-mark").textContent = c.shortNames.map((n) => n[0]).join(" & ");
  $("#footer-date").textContent = dateLabel + " · " + c.city;
  // Personalización visible. No es un sistema de autorización ni valida cupos.
  const guest = new URLSearchParams(location.search).get("invitado");
  if (guest && $("#guest-name"))
    $("#guest-name").textContent = guest.slice(0, 120);

  function toast(text) {
    $("#toast").textContent = text;
    $("#toast").classList.add("show");
    clearTimeout(toast.timeout);
    toast.timeout = setTimeout(
      () => $("#toast").classList.remove("show"),
      3500,
    );
  }
  function download(content, name, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function updateCountdown() {
    const diff = Math.max(
      0,
      Math.floor((new Date(c.date) - Date.now()) / 1000),
    );
    const values = [
      Math.floor(diff / 86400),
      Math.floor(diff / 3600) % 24,
      Math.floor(diff / 60) % 60,
      diff % 60,
    ];
    $$("[data-count]").forEach(
      (el, i) => (el.textContent = String(values[i]).padStart(2, "0")),
    );
    if (diff === 0 && $(".countdown"))
      $(".countdown").setAttribute("aria-label", "¡Llegó el gran día!");
  }
  if (enabled("date")) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
  $("#calendar-download")?.addEventListener("click", () => {
    const stamp = (v) =>
      new Date(v)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    const escapeICS = (v) =>
      String(v)
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Boda Otono//ES",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:boda-${stamp(c.date)}@invitacion.local`,
      `DTSTAMP:${stamp(Date.now())}`,
      `DTSTART:${stamp(c.date)}`,
      `DTEND:${stamp(c.endDate)}`,
      `SUMMARY:${escapeICS("Boda de " + c.shortNames.join(" y "))}`,
      `LOCATION:${escapeICS(c.ceremony.title + ", " + c.ceremony.address)}`,
      `DESCRIPTION:${escapeICS("Ceremonia " + c.ceremony.time + ". Recepción " + c.reception.time + " en " + c.reception.title + ".")}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ];
    // Plegar a menos de 75 bytes según RFC 5545, sin partir caracteres UTF-8.
    const folded = lines
      .map((line) => {
        let out = "",
          bytes = 0;
        for (const ch of line) {
          const size = new TextEncoder().encode(ch).length;
          if (bytes + size > 73) {
            out += "\r\n ";
            bytes = 1;
          }
          out += ch;
          bytes += size;
        }
        return out;
      })
      .join("\r\n");
    download(
      folded + "\r\n",
      "nuestra-boda.ics",
      "text/calendar;charset=utf-8",
    );
    toast("Calendario descargado. Ábrelo para agregar la fecha.");
  });

  // Carrusel con pausa explícita, teclado nativo y suspensión al ocultar la pestaña.
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let slideIndex = 0,
    slideTimer,
    paused = motion.matches;
  const slides = $$(".slide");
  function showSlide(index) {
    slideIndex = (index + slides.length) % slides.length;
    slides.forEach((el, i) => {
      el.classList.toggle("active", i === slideIndex);
      el.setAttribute("aria-hidden", String(i !== slideIndex));
    });
    $$("[data-slide]").forEach((el, i) =>
      el.setAttribute("aria-pressed", String(i === slideIndex)),
    );
  }
  function startSlides() {
    clearInterval(slideTimer);
    if (slides.length > 1 && !paused && !document.hidden)
      slideTimer = setInterval(
        () => showSlide(slideIndex + 1),
        c.slideDuration,
      );
    const b = $("#slideshow-toggle");
    if (b) {
      b.textContent = paused ? "▷" : "Ⅱ";
      b.setAttribute(
        "aria-label",
        paused ? "Reanudar cambio de fotos" : "Pausar cambio de fotos",
      );
    }
  }
  $$("[data-slide]").forEach((b) =>
    b.addEventListener("click", () => {
      showSlide(Number(b.dataset.slide));
      startSlides();
    }),
  );
  $("#slideshow-toggle")?.addEventListener("click", () => {
    paused = !paused;
    startSlides();
  });
  document.addEventListener("visibilitychange", startSlides);
  startSlides();

  // Dialog nativo: Escape, foco atrapado por el navegador y retorno al activador.
  $$("[data-close]").forEach((b) =>
    b.addEventListener("click", () => b.closest("dialog").close()),
  );
  $$("dialog").forEach((d) => {
    d.addEventListener("click", (e) => {
      if (e.target === d) {
        const r = d.getBoundingClientRect();
        if (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        )
          d.close();
      }
    });
  });
  let galleryIndex = 0;
  function showPhoto(i) {
    galleryIndex = (i + c.gallery.length) % c.gallery.length;
    $("#lightbox-photo").innerHTML = photo(c.gallery[galleryIndex]);
    $("#photo-counter").textContent =
      `${galleryIndex + 1} / ${c.gallery.length} · ${c.gallery[galleryIndex].alt}`;
  }
  $$("[data-gallery]").forEach((b) =>
    b.addEventListener("click", () => {
      showPhoto(Number(b.dataset.gallery));
      $("#lightbox").showModal();
    }),
  );
  $("#photo-prev").addEventListener("click", () => showPhoto(galleryIndex - 1));
  $("#photo-next").addEventListener("click", () => showPhoto(galleryIndex + 1));
  $("#lightbox").addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") showPhoto(galleryIndex - 1);
    if (e.key === "ArrowRight") showPhoto(galleryIndex + 1);
  });
  $$("[data-info]").forEach((b) =>
    b.addEventListener("click", () => {
      const type = b.dataset.info;
      let content = "";
      if (type === "album")
        content =
          '<h2 id="dialog-title">Nuestro álbum digital</h2><p>El enlace para compartir fotos estará disponible aquí próximamente.</p>';
      if (type === "liverpool")
        content =
          '<h2 id="dialog-title">Mesa de regalos</h2><p>Pronto compartiremos aquí el número de evento y el enlace a nuestra mesa en Liverpool.</p>';
      if (type === "bank") {
        const d = c.gifts.bank;
        content =
          '<h2 id="dialog-title">Un detalle con amor</h2>' +
          (d.clabe && d.holder && d.name
            ? `<dl><dt>Titular</dt><dd>${esc(d.holder)}</dd><dt>Banco</dt><dd>${esc(d.name)}</dd><dt>CLABE</dt><dd class="clabe">${esc(d.clabe)}</dd></dl><button class="button" id="copy-bank">Copiar CLABE</button>`
            : "<p>Los datos de transferencia estarán disponibles aquí próximamente.</p>");
      }
      $("#dialog-content").innerHTML = content;
      $("#info-dialog").showModal();
      $("#copy-bank")?.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(c.gifts.bank.clabe);
          toast("CLABE copiada");
        } catch {
          toast("Selecciona la CLABE para copiarla.");
        }
      });
    }),
  );

  const form = $("#rsvp-form");
  form?.addEventListener("change", () => {
    const declined = form.elements.attendance.value === "no";
    $("#party-size-label").hidden = declined;
    form.elements.guests.disabled = declined;
  });
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form),
      data = {
        name: values.get("name").trim(),
        attendance: values.get("attendance"),
        guests:
          values.get("attendance") === "yes" ? Number(values.get("guests")) : 0,
        message: values.get("message").trim(),
        invitation: guest || c.invitation.name,
        consent: true,
      };
    if (!data.name) {
      form.elements.name.setCustomValidity("Escribe tu nombre.");
      form.elements.name.reportValidity();
      return;
    }
    const status = $("#form-status"),
      submit = $('[type="submit"]', form);
    if (c.rsvp.mode === "demo") {
      status.textContent =
        "Prueba completada. No se ha enviado ninguna confirmación. Puedes descargar tu respuesta de ejemplo.";
      if (!$("#download-rsvp")) {
        const b = document.createElement("button");
        b.type = "button";
        b.id = "download-rsvp";
        b.className = "text-button";
        b.textContent = "Descargar respuesta de ejemplo";
        status.after(b);
      }
      $("#download-rsvp").onclick = () =>
        download(
          JSON.stringify(data, null, 2),
          "respuesta-ejemplo.json",
          "application/json",
        );
      return;
    }
    if (c.rsvp.mode === "whatsapp") {
      if (!/^\d{10,15}$/.test(c.rsvp.whatsapp)) {
        status.textContent =
          "El contacto de confirmación aún no está disponible.";
        return;
      }
      const text = `Hola, soy ${data.name}. ${data.attendance === "yes" ? `Confirmo asistencia de ${data.guests} persona(s).` : "No podré asistir."} ${data.message}`;
      status.innerHTML = `<a class="button" target="_blank" rel="noopener noreferrer" href="https://wa.me/${c.rsvp.whatsapp}?text=${encodeURIComponent(text)}">Abrir WhatsApp para enviar</a><p>Envía el mensaje en WhatsApp para completar tu confirmación.</p>`;
      return;
    }
    if (c.rsvp.mode !== "endpoint" || !external(c.rsvp.endpoint)) {
      status.textContent =
        "El envío aún no está configurado. Comunícate con los novios.";
      return;
    }
    submit.disabled = true;
    status.textContent = "Enviando tu respuesta…";
    try {
      const response = await fetch(c.rsvp.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error("No se pudo confirmar");
      status.textContent =
        "Gracias. Tu respuesta se ha recibido correctamente.";
      form.reset();
      $("#party-size-label").hidden = false;
      form.elements.guests.disabled = false;
    } catch {
      status.textContent =
        "No pudimos enviar tu respuesta. Inténtalo de nuevo o comunícate con los novios.";
    } finally {
      submit.disabled = false;
    }
  });
  form?.elements.name.addEventListener("input", () =>
    form.elements.name.setCustomValidity(""),
  );

  // Animaciones GSAP progresivas: sin la librería todo el contenido sigue visible.
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
      $$(".reveal").forEach((el) =>
        gsap.from(el, {
          opacity: 0,
          y: 28,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 94%", once: true },
        }),
      );
      $$(".parallax-photo").forEach((el) =>
        gsap.fromTo(
          el,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        ),
      );
      if ($(".names")) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".cover-names",
            start: "center 44%",
            end: "bottom 8%",
            scrub: 0.7,
          },
        });
        tl.to(".name-one", { x: 38, rotation: 15, scale: 0.4, opacity: 0 }, 0)
          .to(".name-two", { x: -38, rotation: -15, scale: 0.4, opacity: 0 }, 0)
          .to(".amp", { opacity: 0, scale: 0.2 }, 0)
          .fromTo(
            ".names-heart",
            { opacity: 0, scale: 0.2 },
            { opacity: 1, scale: 1 },
            0.2,
          );
      }
      if ($(".timeline"))
        gsap.from(".timeline-item", {
          opacity: 0,
          y: 35,
          stagger: 0.16,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: { trigger: ".timeline", start: "top 85%", once: true },
        });
    });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }
  motion.addEventListener("change", () => {
    paused = motion.matches;
    startSlides();
  });
})();
