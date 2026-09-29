(() => {
  const overlay = document.getElementById('envelopeOverlay');
  const left = document.getElementById('envelopeLeft');
  const right = document.getElementById('envelopeRight');
  const tap = document.getElementById('envelopeTap');

  let opened = false;

  // Comprobación para detectar errores
  if (!overlay || !left || !right || !tap) {
    console.error('No se encontraron todos los elementos del sobre:', {
      overlay,
      left,
      right,
      tap
    });
    return;
  }

  // ========================================
  // MODO DESARROLLO
  // ========================================
  const skipEnvelope =
    window.INVITATION_CONFIG?.development?.skipEnvelope === true;

  if (skipEnvelope) {
    overlay.remove();
    document.body.classList.remove('envelope-locked');

    window.dispatchEvent(
      new CustomEvent('invitation:open')
    );

    return;
  }

  // ========================================
  // APERTURA NORMAL
  // ========================================
  function openEnvelope() {
    if (opened) return;

    opened = true;

    console.log('Abriendo sobre...');

    overlay.classList.add('is-closing');
    left.classList.add('is-open');
    right.classList.add('is-open');

    window.dispatchEvent(
      new CustomEvent('invitation:open')
    );

    setTimeout(() => {
      overlay.remove();
      document.body.classList.remove('envelope-locked');
    }, 2000);
  }

  // ========================================
  // EVENTOS
  // ========================================
  tap.addEventListener('click', openEnvelope);
  left.addEventListener('click', openEnvelope);
  right.addEventListener('click', openEnvelope);
})();