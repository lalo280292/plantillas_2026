/* Sólo comportamiento: el contenido y las imágenes están en index.html. */
(() => {
  "use strict";
  const settings = window.WEDDING;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const active = (element) => element && !element.closest("[hidden]");
  const motion = matchMedia("(prefers-reduced-motion: reduce)");

  function toast(message) {
    $("#toast").textContent = message;
    $("#toast").classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => $("#toast").classList.remove("show"), 3500);
  }

  // Fecha: un solo ajuste alimenta la fecha visible, el contador y el calendario.
  const dateFormat = {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: settings.timezone,
  };
  const date = new Date(settings.date);
  const dateLabel = new Intl.DateTimeFormat("es-MX", dateFormat).format(date);
  const parts = new Intl.DateTimeFormat("es-MX", {
    ...dateFormat,
    weekday: "long",
  }).formatToParts(date);
  $$("[data-date]").forEach((element) => {
    element.textContent =
      element.dataset.date === "full"
        ? dateLabel
        : parts.find((part) => part.type === element.dataset.date)?.value;
  });
  $$("[data-seats]").forEach((element) => {
    element.textContent = settings.seats;
  });
  $$("[data-deadline]").forEach((element) => {
    element.textContent = settings.deadline;
  });

  function updateCountdown() {
    const seconds = Math.max(0, Math.floor((date - Date.now()) / 1000));
    const values = [
      Math.floor(seconds / 86400),
      Math.floor(seconds / 3600) % 24,
      Math.floor(seconds / 60) % 60,
      seconds % 60,
    ];
    $$("[data-count]").forEach((element, index) => {
      element.textContent = String(values[index]).padStart(2, "0");
    });
  }
  if (active($("#date"))) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  $("#calendar-download")?.addEventListener("click", () => {
    const stamp = (value) =>
      new Date(value)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    const escape = (value) =>
      String(value)
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");
    const venue = $("#ceremony");
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Boda Otono//ES",
      "BEGIN:VEVENT",
      `UID:boda-${stamp(date)}@invitacion.local`,
      `DTSTAMP:${stamp(Date.now())}`,
      `DTSTART:${stamp(date)}`,
      `DTEND:${stamp(settings.endDate)}`,
      `SUMMARY:${escape(document.title)}`,
      `LOCATION:${escape(venue ? $("#ceremony h2").textContent + ", " + $("#ceremony address").textContent : "")}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ];
    const folded = lines
      .map((line) => {
        let result = "",
          bytes = 0;
        for (const character of line) {
          const size = new TextEncoder().encode(character).length;
          if (bytes + size > 73) {
            result += "\r\n ";
            bytes = 1;
          }
          result += character;
          bytes += size;
        }
        return result;
      })
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([folded + "\r\n"], { type: "text/calendar;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "nuestra-boda.ics";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("Abre el archivo descargado para agregar la fecha a tu calendario.");
  });

  // Portada: fundido y controles. Los nombres no tienen ninguna animación.
  const slides = $$(".slide");
  let slideIndex = 0,
    slideTimer,
    paused = motion.matches;
  function showSlide(index) {
    slideIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === slideIndex);
      slide.setAttribute("aria-hidden", String(i !== slideIndex));
    });
    $$("[data-slide]").forEach((button, i) =>
      button.setAttribute("aria-pressed", String(i === slideIndex)),
    );
  }
  function startSlides() {
    clearInterval(slideTimer);
    if (slides.length > 1 && active($("#cover")) && !paused && !document.hidden)
      slideTimer = setInterval(
        () => showSlide(slideIndex + 1),
        settings.slideDuration,
      );
    if ($("#slideshow-toggle"))
      $("#slideshow-toggle").textContent = paused
        ? "Reanudar fotos"
        : "Pausar fotos";
  }
  $$("[data-slide]").forEach((button) =>
    button.addEventListener("click", () => {
      showSlide(Number(button.dataset.slide));
      startSlides();
    }),
  );
  $("#slideshow-toggle")?.addEventListener("click", () => {
    paused = !paused;
    startSlides();
  });
  document.addEventListener("visibilitychange", startSlides);
  motion.addEventListener("change", () => {
    paused = motion.matches;
    startSlides();
  });
  startSlides();

  // Galería: toma las fotos directamente del HTML, sin una segunda lista de rutas.
  const gallery = $$("[data-gallery] img");
  let galleryIndex = 0;
  function showPhoto(index) {
    galleryIndex = (index + gallery.length) % gallery.length;
    const source = gallery[galleryIndex];
    $("#lightbox-photo").src = source.src;
    $("#lightbox-photo").alt = source.alt;
    $("#photo-counter").textContent = `${galleryIndex + 1} / ${gallery.length}`;
  }
  $$("[data-gallery]").forEach((button, index) =>
    button.addEventListener("click", () => {
      showPhoto(index);
      $("#lightbox").showModal();
    }),
  );
  $("#photo-prev")?.addEventListener("click", () =>
    showPhoto(galleryIndex - 1),
  );
  $("#photo-next")?.addEventListener("click", () =>
    showPhoto(galleryIndex + 1),
  );
  $("#lightbox")?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showPhoto(galleryIndex - 1);
    if (event.key === "ArrowRight") showPhoto(galleryIndex + 1);
  });
  $$("[data-open]").forEach((button) =>
    button.addEventListener("click", () =>
      document.getElementById(button.dataset.open)?.showModal(),
    ),
  );
  $$("[data-close]").forEach((button) =>
    button.addEventListener("click", () => button.closest("dialog").close()),
  );
  $$("[data-pending]").forEach((link) =>
    link.addEventListener("click", (event) => {
      if (!link.getAttribute("href")) {
        event.preventDefault();
        toast("El enlace estará disponible próximamente.");
      }
    }),
  );

  // Invitados y formulario.
  const guest = new URLSearchParams(location.search).get("invitado");
  if (guest && $("#guest-name"))
    $("#guest-name").textContent = guest.slice(0, 120);
  const form = $("#rsvp-form");
  if (form) {
    for (let i = 1; i <= settings.seats; i++)
      form.elements.guests.add(
        new Option(`${i} ${i === 1 ? "persona" : "personas"}`, i),
      );
    $("#demo-note").hidden = settings.rsvp.mode !== "demo";
    $("#rsvp-submit").textContent =
      settings.rsvp.mode === "demo"
        ? "Probar confirmación"
        : settings.rsvp.mode === "whatsapp"
          ? "Preparar confirmación"
          : "Enviar confirmación";
    form.addEventListener("change", () => {
      const declined = form.elements.attendance.value === "no";
      $("#party-size-label").hidden = declined;
      form.elements.guests.disabled = declined;
    });
    form.elements.name.addEventListener("input", () =>
      form.elements.name.setCustomValidity(""),
    );
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const values = new FormData(form);
      const data = {
        name: values.get("name").trim(),
        attendance: values.get("attendance"),
        guests:
          values.get("attendance") === "yes" ? Number(values.get("guests")) : 0,
        message: values.get("message").trim(),
        invitation: guest || $("#guest-name")?.textContent || "",
        consent: true,
      };
      if (!data.name) {
        form.elements.name.setCustomValidity("Escribe tu nombre.");
        form.elements.name.reportValidity();
        return;
      }
      const status = $("#form-status"),
        submit = $("#rsvp-submit");
      if (settings.rsvp.mode === "demo") {
        status.textContent =
          "Prueba completada. No se ha enviado ninguna confirmación.";
        return;
      }
      if (settings.rsvp.mode === "whatsapp") {
        if (!/^\d{10,15}$/.test(settings.rsvp.whatsapp)) {
          status.textContent =
            "El contacto de confirmación aún no está disponible.";
          return;
        }
        const text = `Hola, soy ${data.name}. ${data.attendance === "yes" ? `Confirmo asistencia de ${data.guests} persona(s).` : "No podré asistir."} ${data.message}`;
        const link = document.createElement("a");
        link.className = "button";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Abrir WhatsApp para enviar";
        link.href = `https://wa.me/${settings.rsvp.whatsapp}?text=${encodeURIComponent(text)}`;
        status.replaceChildren(
          link,
          document.createTextNode(
            " Envía el mensaje para completar tu confirmación.",
          ),
        );
        return;
      }
      if (
        settings.rsvp.mode !== "endpoint" ||
        !settings.rsvp.endpoint.startsWith("https://")
      ) {
        status.textContent = "El envío aún no está configurado.";
        return;
      }
      submit.disabled = true;
      status.textContent = "Enviando tu respuesta…";
      try {
        const response = await fetch(settings.rsvp.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) throw new Error("Error de envío");
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
  }
  if (!active(form))
    $$('a[href="#form"]').forEach((link) => {
      link.hidden = true;
    });

  // GSAP: apariciones, itinerario y parallax. Sin transformaciones de nombres.
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
      $$(".reveal")
        .filter(active)
        .forEach((element) =>
          gsap.from(element, {
            opacity: 0,
            y: 28,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 94%", once: true },
          }),
        );
      $$(".parallax-photo")
        .filter(active)
        .forEach((element) =>
          gsap.fromTo(
            element,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: element.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            },
          ),
        );
      if (active($("#itinerary")))
        gsap.from(".timeline-item", {
          opacity: 0,
          y: 30,
          stagger: 0.16,
          duration: 0.85,
          scrollTrigger: { trigger: ".timeline", start: "top 85%", once: true },
        });
    });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }
})();
