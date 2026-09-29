(() => {
  const config = window.INVITATION_CONFIG;
  const form = document.getElementById('rsvpForm');
  const status = document.getElementById('rsvpStatus');
  const details = document.getElementById('attendanceDetails');
  const submit = document.getElementById('submitButton');
  const id = new URLSearchParams(location.search).get('id');

  function setStatus(message, visible = true) {
    status.textContent = message;
    status.hidden = !visible;
  }

  function populate(name, containerId, count, startAtOne = false) {
    const container = document.getElementById(containerId);
    const select = form.querySelector(`select[name="${name}"]`);
    const max = Number(count) || 0;
    if (max <= 0) {
      container.hidden = true;
      select.replaceChildren();
      return;
    }
    container.hidden = false;
    select.replaceChildren();
    const start = startAtOne ? 1 : 0;
    for (let n = start; n <= max; n++) {
      const option = document.createElement('option');
      option.value = String(n);
      option.textContent = String(n);
      select.appendChild(option);
    }
    select.value = String(max);
  }

  function prefill(guest) {
    if (!guest) return;
    document.getElementById('nombre').value = guest.Familia || '';
    document.getElementById('mesaField').value = guest.Mesa || '';
    populate('cantidad_personas', 'container-personas', guest.Invitados, true);
    populate('cantidad_adultos', 'container-adultos', guest.Adultos);
    populate('cantidad_adolescentes', 'container-adolescentes', guest.Adolescentes);
    populate('cantidad_ninos', 'container-ninos', guest.Ninos);
  }

  async function init() {
    if (!id) {
      setStatus('Esta invitación necesita un ID en la URL para confirmar asistencia.');
      return;
    }
    document.getElementById('idField').value = id;
    try {
      const control = await fetch(config.api.control, { cache: 'no-store' }).then((r) => r.json());
      if (!control.formVisible) {
        setStatus('La confirmación de asistencia no está disponible en este momento.');
        return;
      }
    } catch (error) {
      console.warn('No se pudo consultar el control del formulario:', error);
      // En la migración piloto se mantiene visible si el control no responde,
      // para evitar que un fallo de red o PHP oculte toda la interfaz.
    }

    form.hidden = false;
    setStatus('', false);
    const guest = await window.GuestData?.ready;
    prefill(guest);
  }

  form.querySelectorAll('input[name="asistira"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
      details.hidden = event.target.value !== 'Si';
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const attendance = form.querySelector('input[name="asistira"]:checked')?.value;
    if (!attendance) return;
    submit.disabled = true;
    submit.textContent = 'Enviando...';
    try {
      const response = await fetch(config.api.submit, { method: 'POST', body: new FormData(form) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      submit.textContent = '¡Gracias!';
      setStatus('¡Confirmación recibida!');
      if (attendance !== 'No') {
        setTimeout(() => {
          location.href = `${config.api.qrPass}?id=${encodeURIComponent(id)}`;
        }, 650);
      }
    } catch (error) {
      console.error(error);
      setStatus('No se pudo enviar la confirmación. Inténtalo nuevamente.');
      submit.disabled = false;
      submit.textContent = 'Reintentar';
    }
  });

  init();
})();
