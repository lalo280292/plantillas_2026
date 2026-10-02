/* =====================================================================
   ⚙️  NÚCLEO  —  lógica que casi nunca cambia
   ---------------------------------------------------------------------
   Contiene: llenado de datos, orden de módulos, sobre, carrusel de
   portada, contador, calendario, galería, copiar datos, invitado por
   link, formulario, música y arranque de animaciones.

   ⚠️ No necesitas editar este archivo para hacer una invitación nueva.
   ===================================================================== */

(() => {
  "use strict";

  const D = DATOS;
  const hayGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  if (hayGsap) gsap.registerPlugin(ScrollTrigger);

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const raizHtml = document.documentElement;

  /* ---------------------------------------------------------------
     UTILIDADES PARA LEER DATOS
     --------------------------------------------------------------- */
  // Lee "novios.novia.nombre" dentro de los datos. "/..." = desde la raíz. "." = el mismo dato.
  function leer(ruta, raiz) {
    if (!ruta) return undefined;
    if (ruta.startsWith("/")) { raiz = D; ruta = ruta.slice(1); }
    if (ruta === ".") return raiz;
    return ruta.split(".").reduce((o, k) => (o == null ? undefined : o[k]), raiz);
  }
  const esDatoConAnimacion = (v) => v && typeof v === "object" && !Array.isArray(v) && "texto" in v;
  const texto = (v) => {
    if (esDatoConAnimacion(v)) v = v.texto;
    if (Array.isArray(v)) return v.join("<br>");
    return v == null || v === false ? "" : String(v);
  };
  const vacio = (v) =>
    v == null || v === "" || v === false ||
    (Array.isArray(v) && v.length === 0) ||
    (esDatoConAnimacion(v) && !v.texto);
  const limpiar = (s) => texto(s).replace(/<br\s*\/?>/gi, ", ").replace(/<[^>]+>/g, "").trim();

  // Si un dato trae { texto, animacion }, la animación se pone en el elemento animado más cercano
  function marcarAnimacion(el, nombre) {
    if (!nombre) return;
    const destino = el.hasAttribute("data-anim") ? el : el.closest("[data-anim]") || el;
    destino.setAttribute("data-anim", nombre);
  }

  // Ejecuta un paso sin que un error detenga toda la invitación
  function paso(nombre, fn) {
    try { return fn(); } catch (e) { console.error(`[Invitación] Error en "${nombre}":`, e); }
  }

  /* ---------------------------------------------------------------
     LLENAR EL HTML CON LOS DATOS
     --------------------------------------------------------------- */
  function enlazar(raiz, datos) {
    // 1) Listas (padrinos, galería, itinerario…)
    $$("[data-lista]", raiz).forEach((cont) => {
      const lista = leer(cont.getAttribute("data-lista"), datos);
      cont.removeAttribute("data-lista");
      const plantilla = $("template", cont);
      if (!plantilla) return;
      plantilla.remove();
      const items = Array.isArray(lista) ? lista.filter((x) => !(x && x.mostrar === false)) : [];
      if (!items.length) { cont.hidden = true; return; }
      items.forEach((item, i) => {
        const copia = plantilla.content.cloneNode(true);
        enlazar(copia, item);
        const el = copia.firstElementChild;
        if (el) {
          el.dataset.indice = i;
          if (item && typeof item === "object" && item.animacion) marcarAnimacion(el, item.animacion);
        }
        cont.appendChild(copia);
      });
    });

    // 2) Mostrar solo si existe el dato
    $$("[data-si]", raiz).forEach((el) => {
      if (vacio(leer(el.getAttribute("data-si"), datos))) el.hidden = true;
      el.removeAttribute("data-si");
    });

    // 3) Textos
    $$("[data-texto]", raiz).forEach((el) => {
      const v = leer(el.getAttribute("data-texto"), datos);
      el.removeAttribute("data-texto");
      if (vacio(v)) { el.hidden = true; return; }
      el.innerHTML = texto(v);
      if (esDatoConAnimacion(v)) marcarAnimacion(el, v.animacion);
    });

    // 4) Imágenes
    $$("[data-imagen]", raiz).forEach((el) => {
      const v = leer(el.getAttribute("data-imagen"), datos);
      el.removeAttribute("data-imagen");
      if (vacio(v)) { el.hidden = true; return; }
      el.src = texto(v);
      if (esDatoConAnimacion(v)) marcarAnimacion(el, v.animacion);
    });
    $$("[data-srcset]", raiz).forEach((el) => {
      const v = texto(leer(el.getAttribute("data-srcset"), datos));
      el.removeAttribute("data-srcset");
      if (v) el.srcset = v; else el.remove();
    });

    // 5) Links, teléfonos, colores y datos para copiar
    $$("[data-enlace]", raiz).forEach((el) => {
      const v = texto(leer(el.getAttribute("data-enlace"), datos));
      el.removeAttribute("data-enlace");
      if (v) el.href = v; else el.hidden = true;
    });
    $$("[data-telefono]", raiz).forEach((el) => {
      const v = texto(leer(el.getAttribute("data-telefono"), datos));
      el.removeAttribute("data-telefono");
      if (v) el.href = "tel:" + v.replace(/[^\d+]/g, "");
    });
    $$("[data-color]", raiz).forEach((el) => {
      el.style.background = texto(leer(el.getAttribute("data-color"), datos));
      el.removeAttribute("data-color");
    });
    $$("[data-copiar]", raiz).forEach((el) => {
      el.dataset.valorCopiar = limpiar(leer(el.getAttribute("data-copiar"), datos));
      el.removeAttribute("data-copiar");
    });
  }

  /* ---------------------------------------------------------------
     MÓDULOS: encender/apagar, orden, fondo y hojas
     --------------------------------------------------------------- */
  function prepararModulos() {
    const main = $("#invitacion");
    const modulos = D.modulos || {};
    // Un módulo apagado (false) o que no está en la lista no se muestra
    $$("[data-modulo]").forEach((el) => { if (!modulos[el.dataset.modulo]) el.remove(); });
    Object.keys(modulos).forEach((nombre) => {
      const el = $(`[data-modulo="${nombre}"]`);
      if (!el) return;
      if (el.parentElement === main) main.appendChild(el);   // respeta el orden de la lista
      el.hidden = false;
    });

    if (D.tematica && D.tematica.fondo) {
      const url = new URL(D.tematica.fondo, location.href).href;   // ruta completa para que CSS la encuentre
      raizHtml.style.setProperty("--imagen-fondo", `url("${url}")`);
    }

    $$("main [data-modulo]").forEach((sec) => {
      const cfg = D[sec.dataset.modulo] || {};
      if (cfg.fondo === "alterno") sec.classList.add("modulo--alterno");
      const lados = { ambos: ["izquierda", "derecha"], izquierda: ["izquierda"], derecha: ["derecha"] }[cfg.hojas] || [];
      lados.forEach((lado) => {
        const src = D.tematica && D.tematica[lado === "izquierda" ? "hojaIzquierda" : "hojaDerecha"];
        if (!src) return;
        const img = document.createElement("img");
        img.className = `hoja hoja--${lado}`;
        img.src = src;
        img.alt = "";
        img.setAttribute("aria-hidden", "true");
        sec.appendChild(img);
      });
    });
  }

  /* ---------------------------------------------------------------
     INVITADO PERSONALIZADO  (?invitado=Familia%20López&pases=4)
     --------------------------------------------------------------- */
  const params = new URLSearchParams(location.search);
  const INV = D.invitados || {};
  const nombreInvitado = (params.get("invitado") || params.get("n") || texto(INV.invitado)).trim();
  const pasesInvitado = parseInt(params.get("pases") || params.get("p") || INV.pases, 10) || 0;

  function prepararInvitado() {
    $$("[data-invitado-nombre]").forEach((el) => {
      el.textContent = nombreInvitado;          // textContent: el link no puede inyectar HTML
      if (!nombreInvitado) el.hidden = true;
    });
    if (!nombreInvitado) $$(".sobre__para").forEach((el) => (el.hidden = true));
    $$("[data-invitado-pases]").forEach((el) => {
      if (!pasesInvitado) { el.hidden = true; return; }
      const plantilla = pasesInvitado === 1 ? INV.textoUnPase : INV.textoPases;
      el.innerHTML = texto(plantilla).replace(/\{pases\}/g, pasesInvitado);
    });
  }

  /* ---------------------------------------------------------------
     MÚSICA
     --------------------------------------------------------------- */
  const musica = { reproducir() {} };
  function prepararMusica() {
    const boton = $("#musica");
    const audio = $("#audio");
    if (!boton || !audio || !D.musica || !D.musica.archivo) { if (boton) boton.remove(); return; }
    audio.src = D.musica.archivo;
    audio.volume = Math.min(1, Math.max(0, D.musica.volumen ?? 0.5));
    boton.hidden = false;
    const actualizar = () => boton.classList.toggle("sonando", !audio.paused);
    audio.addEventListener("play", actualizar);
    audio.addEventListener("pause", actualizar);
    musica.reproducir = () => audio.play().catch(() => {});
    boton.addEventListener("click", () => (audio.paused ? musica.reproducir() : audio.pause()));
    // Sin sobre, la música empieza con el primer toque en la pantalla
    if (!$("#sobre")) document.addEventListener("pointerdown", musica.reproducir, { once: true });
  }

  /* ---------------------------------------------------------------
     SOBRE
     --------------------------------------------------------------- */
  function prepararSobre(alAbrir) {
    const sobre = $("#sobre");
    if (!sobre) { alAbrir(); return; }
    raizHtml.classList.add("bloqueado");
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const partes = {
      sobre,
      solapa: $(".sobre__solapa", sobre),
      abajo:  $(".sobre__abajo", sobre),
      sello:  $(".sobre__sello", sobre),
      textos: $(".sobre__textos", sobre),
    };
    let pulso = null;
    if (hayGsap) {
      gsap.from([partes.sello, partes.textos], { autoAlpha: 0, y: 20, duration: 1, stagger: 0.2, ease: "power2.out" });
      pulso = gsap.to(partes.sello, { scale: 1.05, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1 });
    }

    let abierto = false;
    function abrir() {
      if (abierto) return;
      abierto = true;
      sobre.removeAttribute("role");
      musica.reproducir();
      const terminar = () => {
        sobre.remove();
        raizHtml.classList.remove("bloqueado");
        if (hayGsap) ScrollTrigger.refresh();
      };
      if (!hayGsap) { terminar(); alAbrir(); return; }
      if (pulso) pulso.kill();
      const tl = EFECTOS.abrirSobre(partes);
      tl.timeScale((D.sobre && D.sobre.velocidad) || 1);
      tl.call(alAbrir, null, Math.max(0, tl.duration() - 0.8));
      tl.eventCallback("onComplete", terminar);
    }
    sobre.addEventListener("click", abrir);
    sobre.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(); }
    });
  }

  /* ---------------------------------------------------------------
     PORTADA: fotos que cambian solas
     --------------------------------------------------------------- */
  const portada = { empezar() {} };
  function prepararPortada() {
    const cont = $("[data-portada-fotos]");
    if (!cont) return;
    const P = D.portada || {};
    const fotos = (P.fotos || []).map(texto).filter(Boolean);
    const cada = Number(P.cadaSegundos) || 5;
    const trans = Number(P.transicionSegundos) || 2;

    const imgs = fotos.map((src, i) => {
      const img = document.createElement("img");
      img.className = "portada__foto";
      img.src = src;
      img.alt = "";
      if (i === 0) img.fetchPriority = "high";
      cont.appendChild(img);
      return img;
    });

    const contPuntos = $("[data-portada-puntos]");
    const puntos = imgs.length > 1 ? imgs.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "portada__punto" + (i === 0 ? " activo" : "");
      b.setAttribute("aria-label", `Foto ${i + 1}`);
      b.addEventListener("click", () => ir(i));
      contPuntos.appendChild(b);
      return b;
    }) : [];

    let actual = 0;
    let temporizador = null;
    function ir(n) {
      if (n === actual || !imgs[n]) return;
      const saliente = imgs[actual];
      const entrante = imgs[n];
      if (hayGsap) EFECTOS.cambiarFoto(saliente, entrante, trans, cada);
      else { saliente.style.opacity = 0; entrante.style.opacity = 1; }
      actual = n;
      puntos.forEach((p, i) => p.classList.toggle("activo", i === n));
      programar();
    }
    function programar() {
      clearTimeout(temporizador);
      if (imgs.length < 2) return;
      temporizador = setTimeout(() => {
        if (document.hidden) programar();
        else ir((actual + 1) % imgs.length);
      }, (cada + trans) * 1000);
    }

    // Flecha "ver más": baja al siguiente módulo
    const flecha = $(".portada__bajar");
    if (flecha) flecha.addEventListener("click", (e) => {
      e.preventDefault();
      const siguiente = $("#portada").nextElementSibling;
      if (siguiente) siguiente.scrollIntoView({ behavior: "smooth" });
    });

    portada.empezar = () => {
      if (hayGsap) EFECTOS.entradaPortada($("#portada"));
      programar();
    };
  }

  /* ---------------------------------------------------------------
     CONTADOR
     --------------------------------------------------------------- */
  function prepararContador() {
    const cont = $("[data-contador]");
    if (!cont || !D.evento) return;
    const meta = new Date(D.evento.fecha).getTime();
    if (isNaN(meta)) { console.warn("Revisa evento.fecha en datos.js (formato AAAA-MM-DDTHH:MM:00)"); return; }
    const final = $("[data-contador-final]");
    const partes = {};
    $$("[data-contador-parte]", cont).forEach((el) => (partes[el.dataset.contadorParte] = el));
    const previo = {};
    let intervalo = null;

    function tick() {
      const dif = meta - Date.now();
      if (dif <= 0) {
        clearInterval(intervalo);
        cont.hidden = true;
        const etiqueta = cont.previousElementSibling;
        if (etiqueta && etiqueta.classList.contains("etiqueta")) etiqueta.hidden = true;
        if (final && D.fecha && D.fecha.textoFinal) { final.innerHTML = texto(D.fecha.textoFinal); final.hidden = false; }
        return;
      }
      const valores = {
        dias:     Math.floor(dif / 864e5),
        horas:    Math.floor(dif / 36e5) % 24,
        minutos:  Math.floor(dif / 6e4) % 60,
        segundos: Math.floor(dif / 1e3) % 60,
      };
      Object.keys(valores).forEach((k) => {
        const t = String(valores[k]).padStart(2, "0");
        if (!partes[k] || previo[k] === t) return;
        partes[k].textContent = t;
        if (previo[k] !== undefined && hayGsap) EFECTOS.cambioContador(partes[k]);
        previo[k] = t;
      });
    }
    tick();
    intervalo = setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------------
     GUARDAR EN CALENDARIO  (Google + archivo .ics para Apple/Outlook)
     --------------------------------------------------------------- */
  function prepararCalendario() {
    const boton = $("[data-calendario-abrir]");
    const opciones = $("[data-calendario-opciones]");
    if (!boton || !opciones || !D.evento) return;
    const E = D.evento;
    const inicio = new Date(E.fecha);
    const fin = E.fechaFin ? new Date(E.fechaFin) : new Date(inicio.getTime() + 6 * 36e5);
    if (isNaN(inicio)) return;
    const utc = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const titulo = limpiar(E.titulo);
    const lugar = limpiar(E.lugar);
    const descripcion = limpiar(E.descripcion) + "\n" + location.href.split("?")[0];

    $("[data-calendario-google]", opciones).href =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent(titulo)}&dates=${utc(inicio)}/${utc(fin)}` +
      `&details=${encodeURIComponent(descripcion)}&location=${encodeURIComponent(lugar)}`;

    const esc = (s) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Invitacion//ES", "BEGIN:VEVENT",
      `UID:${utc(inicio)}-${Math.random().toString(36).slice(2)}@invitacion`,
      `DTSTAMP:${utc(new Date())}`, `DTSTART:${utc(inicio)}`, `DTEND:${utc(fin)}`,
      `SUMMARY:${esc(titulo)}`, `LOCATION:${esc(lugar)}`, `DESCRIPTION:${esc(descripcion)}`,
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", `DESCRIPTION:${esc(titulo)}`, "END:VALARM",
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const enlaceIcs = $("[data-calendario-ics]", opciones);
    enlaceIcs.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
    enlaceIcs.download = (titulo || "evento").normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-") + ".ics";

    boton.addEventListener("click", () => {
      opciones.hidden = !opciones.hidden;
      if (!opciones.hidden && hayGsap) EFECTOS.mostrar(opciones);
    });
  }

  /* ---------------------------------------------------------------
     GALERÍA + VISOR A PANTALLA COMPLETA
     --------------------------------------------------------------- */
  function prepararGaleria() {
    const galeria = $("[data-galeria]");
    const visor = $("#visor");
    if (!galeria || !visor) return;
    const botones = $$(".galeria__item", galeria);
    const fotos = botones.map((b) => b.querySelector("img").getAttribute("src"));
    if (!fotos.length) return;
    const img = $(".visor__img", visor);
    const contador = $(".visor__contador", visor);
    const cerrarBtn = $(".visor__cerrar", visor);
    let actual = 0;
    let focoPrevio = null;

    function mostrar(n, direccion) {
      actual = (n + fotos.length) % fotos.length;
      img.src = fotos[actual];
      contador.textContent = `${actual + 1} / ${fotos.length}`;
      if (direccion && hayGsap) EFECTOS.cambiarFotoVisor(img, direccion);
    }
    function abrir(n) {
      focoPrevio = document.activeElement;
      mostrar(n);
      visor.hidden = false;
      raizHtml.classList.add("bloqueado");
      if (hayGsap) EFECTOS.abrirVisor(visor, img);
      cerrarBtn.focus({ preventScroll: true });
    }
    function cerrar() {
      const fin = () => {
        visor.hidden = true;
        raizHtml.classList.remove("bloqueado");
        if (focoPrevio) focoPrevio.focus({ preventScroll: true });
      };
      if (hayGsap) EFECTOS.cerrarVisor(visor, fin); else fin();
    }
    const siguiente = () => mostrar(actual + 1, 1);
    const anterior  = () => mostrar(actual - 1, -1);

    botones.forEach((b, i) => {
      b.setAttribute("aria-label", `Ver foto ${i + 1} de ${fotos.length}`);
      b.addEventListener("click", () => abrir(i));
    });
    cerrarBtn.addEventListener("click", cerrar);
    $(".visor__siguiente", visor).addEventListener("click", siguiente);
    $(".visor__anterior", visor).addEventListener("click", anterior);
    visor.addEventListener("click", (e) => { if (e.target === visor) cerrar(); });
    document.addEventListener("keydown", (e) => {
      if (visor.hidden) return;
      if (e.key === "Escape") cerrar();
      if (e.key === "ArrowRight") siguiente();
      if (e.key === "ArrowLeft") anterior();
    });
    // Deslizar con el dedo
    let inicioX = null;
    visor.addEventListener("pointerdown", (e) => (inicioX = e.clientX));
    visor.addEventListener("pointerup", (e) => {
      if (inicioX === null) return;
      const dx = e.clientX - inicioX;
      inicioX = null;
      if (Math.abs(dx) > 45) (dx < 0 ? siguiente : anterior)();
    });
  }

  /* ---------------------------------------------------------------
     BOTONES "COPIAR" (CLABE, cuenta…)
     --------------------------------------------------------------- */
  function prepararCopiar() {
    document.addEventListener("click", async (e) => {
      const b = e.target.closest("[data-valor-copiar]");
      if (!b) return;
      const valor = b.dataset.valorCopiar.replace(/\s+/g, "");
      try {
        await navigator.clipboard.writeText(valor);
      } catch {
        const t = document.createElement("textarea");
        t.value = valor;
        t.style.position = "fixed";
        t.style.opacity = "0";
        document.body.appendChild(t);
        t.select();
        document.execCommand("copy");
        t.remove();
      }
      const etiqueta = b.querySelector("span");
      const original = etiqueta.textContent;
      b.classList.add("copiado");
      etiqueta.textContent = "¡Copiado!";
      setTimeout(() => { b.classList.remove("copiado"); etiqueta.textContent = original; }, 2000);
    });
  }

  /* ---------------------------------------------------------------
     CONFIRMAR POR WHATSAPP (botón directo)
     --------------------------------------------------------------- */
  const soloDigitos = (s) => String(s || "").replace(/\D/g, "");
  function prepararConfirmar() {
    const C = D.confirmar || {};
    const boton = $("[data-confirmar-whatsapp]");
    if (!boton) return;
    const numero = soloDigitos(C.whatsapp);
    if (!numero) { boton.hidden = true; return; }
    const mensaje = limpiar(C.mensajeWhatsapp).replace(/\{invitado\}/g, nombreInvitado || "");
    boton.href = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  }

  /* ---------------------------------------------------------------
     FORMULARIO DE CONFIRMACIÓN
     --------------------------------------------------------------- */
  function prepararFormulario() {
    const form = $("#form-confirmacion");
    if (!form) return;
    const F = D.formulario || {};
    const E = F.etiquetas || {};
    const error = $("[data-form-error]");
    const gracias = $("[data-form-gracias]");
    const campoPersonas = $("[data-campo-personas]", form);
    const selectPersonas = form.elements.personas;

    const maximo = pasesInvitado || 10;
    for (let i = 1; i <= maximo; i++) selectPersonas.add(new Option(String(i), String(i)));
    selectPersonas.value = String(maximo);
    if (nombreInvitado) form.elements.nombre.value = nombreInvitado;

    form.addEventListener("change", () => {
      campoPersonas.hidden = form.elements.asistencia.value === "no";
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = form.elements.nombre.value.trim();
      const campoNombre = form.elements.nombre.closest(".campo");
      if (!nombre) {
        error.textContent = "Por favor escribe tu nombre.";
        error.hidden = false;
        campoNombre.classList.add("con-error");
        form.elements.nombre.focus();
        return;
      }
      error.hidden = true;
      campoNombre.classList.remove("con-error");

      const asiste = form.elements.asistencia.value === "si";
      const datos = {
        evento:     limpiar(D.evento && D.evento.titulo),
        invitacion: nombreInvitado,
        nombre,
        asistencia: asiste ? "Sí" : "No",
        personas:   asiste ? selectPersonas.value : "0",
        telefono:   form.elements.telefono.value.trim(),
        mensaje:    form.elements.mensaje.value.trim(),
        fecha:      new Date().toISOString(),
      };

      // Opcional: guardar en Google Sheets
      if (F.googleSheets) {
        fetch(F.googleSheets, { method: "POST", mode: "no-cors", body: JSON.stringify(datos) }).catch(() => {});
      }

      // WhatsApp
      const numero = soloDigitos(F.whatsapp);
      if (F.enviarA === "whatsapp" && numero) {
        const lineas = [
          `*Confirmación · ${datos.evento}*`,
          `${limpiar(E.nombre) || "Nombre"}: ${datos.nombre}`,
          `${limpiar(E.asistencia) || "¿Asistirá?"} ${asiste ? "Sí ✅" : "No ❌"}`,
        ];
        if (asiste) lineas.push(`${limpiar(E.personas) || "Personas"}: ${datos.personas}`);
        if (datos.telefono) lineas.push(`Teléfono: ${datos.telefono}`);
        if (datos.mensaje) lineas.push(`Mensaje: ${datos.mensaje}`);
        window.open(`https://wa.me/${numero}?text=${encodeURIComponent(lineas.join("\n"))}`, "_blank");
      }

      form.hidden = true;
      if (gracias) {
        gracias.hidden = false;
        if (hayGsap) EFECTOS.mostrar(gracias);
      }
    });
  }

  /* ---------------------------------------------------------------
     PIE DE PÁGINA
     --------------------------------------------------------------- */
  function prepararPie() {
    const conEnlace = D.pie && D.pie.enlace;
    $$("[data-pie-sin-enlace]").forEach((el) => { if (conEnlace) el.hidden = true; });
  }

  /* ---------------------------------------------------------------
     ANIMACIONES (se encienden al abrir el sobre)
     --------------------------------------------------------------- */
  function iniciarAnimaciones() {
    if (!hayGsap) return;
    $$("[data-parallax]").forEach((m) => paso("parallax", () => EFECTOS.parallax(m)));
    $$("[data-itinerario]").forEach((it) => paso("itinerario", () => EFECTOS.itinerario(it)));
    $$(".hoja").forEach((h) => paso("hojas", () =>
      EFECTOS.hoja(h, h.classList.contains("hoja--izquierda") ? "izquierda" : "derecha")));

    $$("[data-anim]").forEach((el) => paso("animación", () => {
      if (el.closest("[hidden]")) return;
      const modulo = el.closest("[data-modulo]");
      const cfg = (modulo && D[modulo.dataset.modulo]) || {};
      let nombre = el.getAttribute("data-anim");
      if (!nombre && el.classList.contains("titulo") && cfg.animacionTitulo) nombre = cfg.animacionTitulo;
      if (!nombre) nombre = cfg.animacion || CONFIG_ANIMACIONES.porDefecto;
      const indice = Number(el.dataset.indice || 0);
      const extra = Number(el.dataset.retraso || 0);   // data-retraso="0.5" en el HTML = medio segundo más
      animarElemento(el, nombre, (indice % 4) * CONFIG_ANIMACIONES.escalonado + extra);
    }));
    ScrollTrigger.refresh();
  }

  /* ---------------------------------------------------------------
     ARRANQUE
     --------------------------------------------------------------- */
  paso("módulos", prepararModulos);
  paso("datos", () => enlazar(document, D));
  paso("invitado", prepararInvitado);
  paso("música", prepararMusica);
  paso("portada", prepararPortada);
  paso("contador", prepararContador);
  paso("calendario", prepararCalendario);
  paso("galería", prepararGaleria);
  paso("copiar", prepararCopiar);
  paso("confirmar", prepararConfirmar);
  paso("formulario", prepararFormulario);
  paso("pie", prepararPie);

  paso("sobre", () => prepararSobre(() => {
    paso("animaciones", iniciarAnimaciones);
    paso("portada", () => portada.empezar());
  }));

  raizHtml.classList.remove("cargando");
  window.addEventListener("load", () => { if (hayGsap) ScrollTrigger.refresh(); });
})();
