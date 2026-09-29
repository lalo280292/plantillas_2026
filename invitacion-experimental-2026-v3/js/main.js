(() => {
  const config = window.INVITATION_CONFIG;
  if (!config) return;
  const get = path => path.split('.').reduce((o,k)=>o?.[k], config);

  document.querySelectorAll('[data-bind]').forEach(el => {
    const value = get(el.dataset.bind);
    if (value != null) el.textContent = value;
  });
  document.querySelectorAll('[data-bind-src]').forEach(el => {
    const value = get(el.dataset.bindSrc);
    if (value) el.src = value;
  });
  document.querySelectorAll('[data-bind-href]').forEach(el => {
    const value = get(el.dataset.bindHref);
    if (value) el.setAttribute('href', value);
  });
  Object.entries(config.theme || {}).forEach(([key,value]) => {
    const cssKey = key.replace(/[A-Z]/g,m=>`-${m.toLowerCase()}`);
    document.documentElement.style.setProperty(`--${cssKey}`,value);
  });

  document.querySelectorAll('[data-map]').forEach(link => {
    const section = config[link.dataset.map];
    link.href = section?.mapUrl || '#';
    if (!section?.mapUrl || section.mapUrl === '#') link.addEventListener('click', e => {
      e.preventDefault();
      alert(`Configura ${link.dataset.map}.mapUrl en js/config.js`);
    });
  });

  const rail = document.querySelector('[data-itinerary]');
  if (rail) config.itinerary.forEach(item => rail.insertAdjacentHTML('beforeend', `
    <article class="timeline-item" data-timeline-item>
      <i class="timeline-item__dot"></i>
      <div class="timeline-item__time">${item.time}</div>
      <div><h3 class="timeline-item__title">${item.title}</h3><p class="timeline-item__copy">${item.copy}</p></div>
    </article>`));

  const form = document.querySelector('[data-rsvp-form]');
  const success = document.querySelector('[data-rsvp-success]');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    sessionStorage.setItem('experimental-rsvp', JSON.stringify(Object.fromEntries(new FormData(form))));
    form.hidden = true;
    if (success) success.hidden = false;
  });
})();
