/* =========================================================
   CONFIGURACIÓN EDITABLE
   ========================================================= */
const CONFIG = {
  imagenes: {
    // COMPUTADORA (pantalla horizontal) · recomendado 2560 × 1440 px
    horizontal: {
      sobreAbajo:     "img/sobre-abajo-horizontal.webp",   // bolsillo (con la abertura transparente)
      sobreArriba:    "img/sobre-arriba-horizontal.webp",  // solapa que se abre
      solapaInterior: "",     // opcional: cómo se ve la solapa por dentro ("" = la misma, un poco más oscura)
      alturaSolapa:   0.58,   // hasta dónde baja la solapa (0 a 1 del alto de la imagen)
      bisagra:        0,      // dónde se dobla la solapa (0 = borde superior de la imagen)
      sello: { x: 50, y: 53, tamano: 15 },  // posición (% de la imagen) y ancho (% del ancho de la imagen)
    },

    // CELULAR (pantalla vertical) · recomendado 1440 × 2560 px
    vertical: {
      sobreAbajo:     "img/sobre-abajo-vertical.webp",
      sobreArriba:    "img/sobre-arriba-vertical.webp",
      solapaInterior: "",
      alturaSolapa:   0.56,
      bisagra:        0,
      sello: { x: 50, y: 52, tamano: 30 },
    },

    // SELLO (cuadrado, fondo transparente) · recomendado 800 × 800 px
    sello: "img/sello.webp",
  },

  sello: {
    texto: "V",          // Iniciales encima del sello ("" si tu imagen ya trae las letras)
    tamanoTexto: 0,      // 0 = automático · o un número (% del ancho del sello), ej. 30
  },

  colores: {
    fondo:      "#2a211c",  // fondo detrás del sobre
    interior:   "#6f5c45",  // interior del sobre (se ve por la abertura)
    carta:      "#fbf7ef",  // papel de la carta
    tinta:      "#3b2b22",  // texto
    acento:     "#a8844c",  // detalles dorados
    boton:      "#8b1a2b",  // botón "Confirmar asistencia"
    selloTexto: "#4a0c16",  // color de las iniciales del sello
  },

  textoAyuda: "Toca para abrir", // "" para ocultarlo
  velocidad: 1,                  // 1 = normal · 1.5 = más rápido · 0.7 = más lento
};

/* =========================================================
   (A partir de aquí no es necesario editar)
   ========================================================= */
(() => {
  const root = document.documentElement;
  const $ = (s) => document.querySelector(s);

  const scene   = $("#scene");
  const rig     = $("#rig");
  const stage   = $("#stage");
  const flap    = $("#flap");
  const flapIn  = $("#flapIn");
  const letter  = $("#letter");
  const cover   = $("#letterCover");
  const seal    = $("#seal");
  const sealArt = $("#sealArt");
  const hint    = $("#hint");
  const imgPocket = $("#imgPocket");
  const imgFlap   = $("#imgFlap");
  const imgFlapIn = $("#imgFlapIn");
  const imgSeal   = $("#imgSeal");

  const H_CFG = CONFIG.imagenes.horizontal;
  const V_CFG = CONFIG.imagenes.vertical;
  const isPortrait = () => window.matchMedia("(orientation: portrait)").matches;
  const current = () => (isPortrait() ? V_CFG : H_CFG);

  /* ---------- Colores ---------- */
  const VARS = {
    fondo: "--fondo", interior: "--interior", carta: "--carta", tinta: "--tinta",
    acento: "--acento", boton: "--boton", selloTexto: "--sello-texto",
  };
  Object.entries(CONFIG.colores).forEach(([k, v]) => {
    if (VARS[k] && v) root.style.setProperty(VARS[k], v);
  });
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.content = CONFIG.colores.fondo;

  /* ---------- Posiciones (por orientación) ---------- */
  [["h", H_CFG], ["v", V_CFG]].forEach(([k, c]) => {
    root.style.setProperty(`--${k}-seal-x`, c.sello.x + "%");
    root.style.setProperty(`--${k}-seal-y`, c.sello.y + "%");
    root.style.setProperty(`--${k}-seal-w`, c.sello.tamano + "%");
    root.style.setProperty(`--${k}-hinge`, (c.bisagra || 0) * 100 + "%");
  });

  /* ---------- Imágenes ---------- */
  function setPicture(img, sourceId, hPath, vPath) {
    const source = document.getElementById(sourceId);
    const h = hPath || vPath, v = vPath || hPath;
    if (!h) return false;
    if (v && v !== h) source.srcset = v; else source.remove();
    img.src = h;
    return true;
  }
  setPicture(imgPocket, "srcPocketV", H_CFG.sobreAbajo, V_CFG.sobreAbajo);
  setPicture(imgFlap, "srcFlapV", H_CFG.sobreArriba, V_CFG.sobreArriba);
  const hasFlapIn = setPicture(imgFlapIn, "srcFlapInV", H_CFG.solapaInterior, V_CFG.solapaInterior);
  if (!hasFlapIn) flapIn.remove();
  imgSeal.src = CONFIG.imagenes.sello;

  // La proporción del escenario se toma de la imagen real → nunca se deforma
  function syncRatio() {
    if (imgPocket.naturalWidth && imgPocket.naturalHeight) {
      stage.style.setProperty("--ar", (imgPocket.naturalWidth / imgPocket.naturalHeight).toFixed(5));
    }
  }
  imgPocket.addEventListener("load", syncRatio);   // también se dispara al girar el celular

  function whenLoaded(img) {
    if (!img || !img.getAttribute("src")) return Promise.resolve();
    const done = img.complete && img.naturalWidth
      ? Promise.resolve()
      : new Promise((res) => {
          img.addEventListener("load", res, { once: true });
          img.addEventListener("error", res, { once: true });
        });
    return done.then(() => (img.decode ? img.decode().catch(() => {}) : null));
  }

  /* ---------- Texto del sello ---------- */
  const sealText = $("#sealText");
  sealText.textContent = CONFIG.sello.texto || "";
  const len = [...(CONFIG.sello.texto || "")].length;
  const autoSize = len <= 1 ? 34 : len === 2 ? 26 : len <= 4 ? 18 : Math.max(8, 64 / len);
  seal.style.setProperty("--seal-font", CONFIG.sello.tamanoTexto || autoSize);

  hint.textContent = CONFIG.textoAyuda;
  if (!CONFIG.textoAyuda) hint.hidden = true;
  scene.setAttribute("aria-label", "Sobre sellado. Toca para abrir.");

  /* ---------- Utilidades ---------- */
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const f = (n) => n.toFixed(2);

  /* ---------- Textura del papel de la carta (se dibuja una vez) ---------- */
  function makePaperTexture() {
    const S = 256, G = 16, r = rng(7);
    const c = document.createElement("canvas");
    c.width = c.height = S;
    const ctx = c.getContext("2d");
    const img = ctx.createImageData(S, S);
    const d = img.data;
    const grid = Array.from({ length: G * G }, () => r());
    const sm = (t) => t * t * (3 - 2 * t);
    const cell = (x, y) => grid[(y % G) * G + (x % G)];
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const gx = (x / S) * G, gy = (y / S) * G;
        const x0 = Math.floor(gx), y0 = Math.floor(gy);
        const tx = sm(gx - x0), ty = sm(gy - y0);
        const m = (cell(x0, y0) * (1 - tx) + cell(x0 + 1, y0) * tx) * (1 - ty) +
                  (cell(x0, y0 + 1) * (1 - tx) + cell(x0 + 1, y0 + 1) * tx) * ty;
        const a = 0.02 + m * 0.05 + r() * 0.04;
        const i = (y * S + x) * 4;
        d[i] = 88; d[i + 1] = 66; d[i + 2] = 40; d[i + 3] = Math.round(a * 255);
      }
    }
    ctx.putImageData(img, 0, 0);
    ctx.lineCap = "round";
    for (let i = 0; i < 200; i++) {
      const x = r() * S, y = r() * S, ang = r() * Math.PI, len = 5 + r() * 16;
      const light = r() < 0.4;
      ctx.strokeStyle = light ? `rgba(255,255,255,${(0.06 + r() * 0.1).toFixed(3)})`
                              : `rgba(95,70,40,${(0.03 + r() * 0.06).toFixed(3)})`;
      ctx.lineWidth = 0.6 + r() * 0.7;
      const dx = Math.cos(ang) * len, dy = Math.sin(ang) * len;
      for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) {
        ctx.beginPath();
        ctx.moveTo(x + ox, y + oy);
        ctx.lineTo(x + ox + dx, y + oy + dy);
        ctx.stroke();
      }
    }
    return new Promise((res) => {
      if (c.toBlob) c.toBlob((b) => res(b ? URL.createObjectURL(b) : c.toDataURL()));
      else res(c.toDataURL("image/png"));
    });
  }

  /* ---------- Piezas del sello ----------
     La imagen del sello se "corta" en 3–4 pedazos con líneas irregulares. */
  function buildPieces(rand) {
    const c = [100 + (rand() - 0.5) * 18, 100 + (rand() - 0.5) * 18];
    const K = 3 + Math.floor(rand() * 2);
    const off = rand() * Math.PI * 2;
    const angles = Array.from({ length: K }, (_, i) => off + ((i + (rand() - 0.5) * 0.4) / K) * Math.PI * 2);
    const radii = [12, 26, 42, 58, 74, 90, 180];
    const cracks = angles.map((a) =>
      radii.map((r, j) => {
        const aa = a + (j === radii.length - 1 ? 0 : (rand() - 0.5) * 0.3);
        return [c[0] + Math.cos(aa) * r, c[1] + Math.sin(aa) * r];
      })
    );
    return angles.map((a0, i) => {
      let a1 = angles[(i + 1) % K];
      if (a1 <= a0) a1 += Math.PI * 2;
      const pts = [c, ...cracks[i]];
      for (let s = 1; s < 8; s++) {
        const a = a0 + ((a1 - a0) * s) / 8;
        pts.push([c[0] + Math.cos(a) * 180, c[1] + Math.sin(a) * 180]);
      }
      pts.push(...[...cracks[(i + 1) % K]].reverse());
      const mid = (a0 + a1) / 2;
      return { pts, mid, origin: [c[0] + Math.cos(mid) * 45, c[1] + Math.sin(mid) * 45] };
    });
  }

  let prepared = null;
  function prepare() {
    if (prepared) return prepared;
    const rand = rng((Math.random() * 1e9) | 0);
    const html = sealArt.innerHTML;
    const frags = buildPieces(rand).map((p) => {
      const el = document.createElement("div");
      el.className = "frag";
      el.innerHTML = `<div class="frag-in">${html}</div>`;
      el.firstChild.style.clipPath =
        `polygon(${p.pts.map((q) => `${f(q[0] / 2)}% ${f(q[1] / 2)}%`).join(",")})`;
      gsap.set(el, { autoAlpha: 0, transformOrigin: `${f(p.origin[0] / 2)}% ${f(p.origin[1] / 2)}%` });
      seal.insertBefore(el, hint);
      return { el, p };
    });
    prepared = { rand, frags };
    return prepared;
  }

  /* ---------- Apertura ---------- */
  let opened = false;
  let intro = null;

  function open() {
    if (opened) return;
    opened = true;
    scene.classList.add("is-opening");
    scene.removeAttribute("role");
    scene.removeAttribute("tabindex");
    if (intro) intro.progress(1);
    gsap.killTweensOf(hint);

    const P = prepare();
    const tl = gsap.timeline();
    tl.to(hint, { autoAlpha: 0, duration: 0.2 }, 0)
      .add(() => breakSeal(P), 0)
      .add(openEnvelope(), 0.4);

    if (reduceMotion) tl.timeScale(2);
  }

  // Discreto: el sello se parte y los pedazos caen
  function breakSeal(P) {
    const size = seal.offsetWidth;
    const H = stage.offsetHeight;
    const rand = P.rand;
    gsap.set(P.frags.map((x) => x.el), { autoAlpha: 1 });
    gsap.set(sealArt, { autoAlpha: 0 });

    P.frags.forEach(({ el, p }, i) => {
      const nx = Math.cos(p.mid), ny = Math.sin(p.mid);
      const gap = size * 0.015;
      const delay = 0.16 + i * 0.04;
      gsap.timeline()
        .to(el, { x: nx * gap, y: ny * gap, duration: 0.08, ease: "power2.out" }, 0)   // se agrieta
        .to(el, {                                                                         // y cae
          x: nx * size * 0.12,
          y: H * 0.8,
          rotation: (rand() - 0.5) * 50,
          duration: 0.85,
          ease: "power2.in",
        }, delay)
        .to(el, { autoAlpha: 0, duration: 0.25 }, delay + 0.6);
    });
  }

  function openEnvelope() {
    const cfg = current();
    const fh = cfg.alturaSolapa ?? 0.56;
    const vw = window.innerWidth, vh = window.innerHeight;
    const W = stage.offsetWidth, H = stage.offsetHeight;
    // Escala PROPORCIONAL para que quepan el sobre y la solapa abierta
    const s = Math.min((0.92 * vw) / W, (0.9 * vh) / (H * (1 + fh)));
    const yOff = (fh * H * s) / 2;
    const rise = Math.min(62, ((fh + 0.04) / 0.86) * 100);

    gsap.set(flap, { transformPerspective: H * 2.6 });

    const tl = gsap.timeline();
    tl.to(rig, { scale: s, y: yOff, duration: 0.85, ease: "power3.inOut" }, 0)
      .to(flap, { rotationX: 180, duration: 0.7, ease: "power2.inOut" }, 0.05)
      .add(() => {
        // a 90° la solapa está de canto: se cambia a su cara interior
        gsap.set(flap, { zIndex: 1 });
        if (hasFlapIn) {
          flapIn.style.visibility = "visible";
          flap.querySelector(".flap-face--out").style.visibility = "hidden";
        } else {
          gsap.set(imgFlap, { filter: "brightness(0.8)" });
        }
      }, 0.4)
      .to(letter, { yPercent: -rise, duration: 0.65, ease: "power3.out" }, 0.65)
      .add(expandLetter, 1.3);
    return tl;
  }

  function expandLetter() {
    const r = letter.getBoundingClientRect();
    document.body.appendChild(letter);
    gsap.set(letter, {
      clearProps: "transform",
      position: "fixed", margin: 0, right: "auto", bottom: "auto",
      left: r.left, top: r.top, width: r.width, height: r.height, zIndex: 50,
    });

    const page = letter.querySelector(".page");
    const reveals = letter.querySelectorAll(".reveal");
    gsap.set(reveals, { autoAlpha: 0, y: 24 });

    gsap.timeline()
      .to(rig, { y: "+=" + window.innerHeight * 1.3, duration: 0.55, ease: "power2.in" }, 0)
      .to(letter, {
        left: 0, top: 0, width: window.innerWidth, height: window.innerHeight,
        borderRadius: 0, duration: 0.7, ease: "power3.inOut",
      }, 0.08)
      .to(cover, { autoAlpha: 0, duration: 0.3 }, 0.3)
      .add(() => {
        gsap.set(letter, { clearProps: "all" });
        letter.classList.add("is-open");
        rig.style.display = "none";
        page.setAttribute("tabindex", "-1");
        page.focus({ preventScroll: true });
      }, 0.78)
      .to(reveals, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.06 }, 0.78);
  }

  /* ---------- Arranque ---------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  gsap.globalTimeline.timeScale(CONFIG.velocidad || 1);
  gsap.set(rig, { autoAlpha: 0 });
  gsap.set(hint, { autoAlpha: 0 });

  function start() {
    syncRatio();
    scene.classList.add("is-ready");
    intro = gsap.timeline();
    intro
      .to(rig, { autoAlpha: 1, duration: 0.6, ease: "power1.out" })
      .to(hint, { autoAlpha: 1, duration: 0.4 }, 0.5)
      .to(hint, { opacity: 0.35, duration: 1.3, ease: "sine.inOut", yoyo: true, repeat: -1 }, 1);

    scene.addEventListener("pointerdown", open, { passive: true });
    scene.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });

    (window.requestIdleCallback || ((fn) => setTimeout(fn, 200)))(() => prepare(), { timeout: 600 });
  }

  // Espera a que carguen las imágenes, la textura y las fuentes (máx. 4 s)
  const ready = Promise.all([
    whenLoaded(imgPocket), whenLoaded(imgFlap), whenLoaded(imgSeal),
    makePaperTexture().then((url) => root.style.setProperty("--tex", `url("${url}")`)),
    document.fonts && document.fonts.load
      ? document.fonts.load("40px 'Pinyon Script'", CONFIG.sello.texto || "A").catch(() => {})
      : null,
  ]);
  Promise.race([ready, new Promise((r) => setTimeout(r, 4000))]).then(start);
})();
