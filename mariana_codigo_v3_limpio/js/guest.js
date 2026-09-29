(() => {
  const config = window.INVITATION_CONFIG;
  const id = new URLSearchParams(location.search).get('id');
  const card = document.getElementById('guestCard');
  const numericFields = new Set(['Invitados', 'Adultos', 'Adolescentes', 'Ninos']);

  window.GuestData = { id, data: null, ready: null };

  async function load() {
    if (!id) return null;
    try {
      const response = await fetch(config.api.guests, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const rows = await response.json();
      const guest = Array.isArray(rows) ? rows.find((row) => String(row.ID) === String(id)) : null;
      if (!guest) return null;
      window.GuestData.data = guest;

      ['Familia','Invitados','Adultos','Adolescentes','Ninos','Nombres','Mesa'].forEach((key) => {
        const row = card.querySelector(`[data-guest-row="${key}"]`);
        const valueNode = card.querySelector(`[data-guest="${key}"]`);
        const value = guest[key];
        const valid = numericFields.has(key) ? Number(value) > 0 : value != null && String(value).trim() !== '';
        row.hidden = !valid;
        if (valid) valueNode.textContent = value;
      });
      card.hidden = false;
      return guest;
    } catch (error) {
      console.error('No se pudieron cargar los datos del invitado:', error);
      return null;
    }
  }

  window.GuestData.ready = load();
})();
