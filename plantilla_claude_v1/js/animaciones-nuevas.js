/* =====================================================================
   🆕  ANIMACIONES NUEVAS (tus animaciones futuras)
   ---------------------------------------------------------------------
   Aquí agregas animaciones nuevas sin tocar js/animaciones.js.
   Cuando la registres, ya puedes usar su nombre en js/datos.js.

   RECETA:
     registrarAnimacion("nombre-de-tu-animacion", (el, o) =>
       gsap.from(el, { duration: o.duracion, ease: o.suavizado,
                       ...AQUÍ LO QUE CAMBIA... })
     );

   "el" es el elemento que se anima. "o" trae los ajustes generales:
     o.duracion, o.suavizado, o.distancia

   QUÉ PUEDES ANIMAR (propiedades de GSAP más usadas):
     autoAlpha: 0          → transparente (y oculto)
     x: 100 / y: -50       → mover en píxeles
     xPercent / yPercent   → mover en % de su tamaño
     scale: 0.5            → tamaño
     rotation: 45          → girar (grados)
     rotationX / rotationY → girar en 3D
     filter: "blur(10px)"  → desenfoque
     clipPath: "..."       → recortar / descubrir

   gsap.from(el, {...})  = el elemento VIENE desde esos valores
   gsap.to(el, {...})    = el elemento VA hacia esos valores (para bucles)

   Más ideas y ejemplos: https://gsap.com/docs/v3/Eases (tipos de movimiento)

   TIP: también puedes REEMPLAZAR una animación existente registrándola
   aquí con el mismo nombre (ej: "subir").
   ===================================================================== */


/* ---------- EJEMPLO 1: cae desde arriba girando ---------- */
registrarAnimacion("caer", (el, o) =>
  gsap.from(el, { duration: o.duracion, ease: "bounce.out", autoAlpha: 0, y: -120, rotation: -10 })
);

/* ---------- EJEMPLO 2: se estira como acordeón ---------- */
registrarAnimacion("acordeon", (el, o) =>
  gsap.from(el, { duration: o.duracion, ease: "elastic.out(1, 0.6)", autoAlpha: 0, scaleY: 0, transformOrigin: "50% 0%" })
);

/* ---------- EJEMPLO 3: brillo que pasa por encima (en bucle) ---------- */
// Para usarla en bucle, agrégala también a la lista ANIMACIONES_EN_BUCLE:
ANIMACIONES_EN_BUCLE.push("parpadeo");
registrarAnimacion("parpadeo", (el) =>
  gsap.to(el, { autoAlpha: 0.45, duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: -1 })
);


/* ---------- TUS ANIMACIONES AQUÍ ABAJO ---------- */

