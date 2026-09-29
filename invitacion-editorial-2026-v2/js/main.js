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
  Object.entries(config.theme || {}).forEach(([key,value]) => {
    const cssKey = key.replace(/[A-Z]/g,m=>`-${m.toLowerCase()}`);
    document.documentElement.style.setProperty(`--${cssKey}`,value);
  });

  const renderParents = (selector,names) => {
    const host = document.querySelector(selector);
    if (!host) return;
    host.innerHTML = names.map(name => `<span class="family__name">${name}</span>`).join('');
  };
  renderParents('[data-bride-parents]',config.parents.bride);
  renderParents('[data-groom-parents]',config.parents.groom);

  const rail = document.querySelector('[data-itinerary]');
  if (rail) {
    config.itinerary.forEach(item => {
      rail.insertAdjacentHTML('beforeend', `<article class="timeline-item" data-timeline-item><i class="timeline-item__dot"></i><div class="timeline-item__time">${item.time}</div><div><h3 class="timeline-item__title">${item.title}</h3><p class="timeline-item__copy">${item.copy}</p></div></article>`);
    });
  }

  document.querySelectorAll('[data-map]').forEach(link => {
    const section = config[link.dataset.map];
    link.href = section?.mapUrl || '#';
    if (!section?.mapUrl || section.mapUrl === '#') link.addEventListener('click', e => { e.preventDefault(); alert(`Configura ${link.dataset.map}.mapUrl en js/config.js`); });
  });

  const countdown = document.querySelector('[data-countdown]');
  if (countdown) {
    const target = new Date(config.date.iso).getTime();
    const update = () => {
      const diff = Math.max(0,target-Date.now());
      const values = {
        days: Math.floor(diff/86400000),
        hours: Math.floor(diff/3600000)%24,
        minutes: Math.floor(diff/60000)%60,
        seconds: Math.floor(diff/1000)%60
      };
      countdown.querySelector('[data-days]').textContent = String(values.days).padStart(3,'0');
      countdown.querySelector('[data-hours]').textContent = String(values.hours).padStart(2,'0');
      countdown.querySelector('[data-minutes]').textContent = String(values.minutes).padStart(2,'0');
      countdown.querySelector('[data-seconds]').textContent = String(values.seconds).padStart(2,'0');
    };
    update(); setInterval(update,1000);
  }

  const form = document.querySelector('[data-rsvp-form]');
  const success = document.querySelector('[data-rsvp-success]');
  form?.addEventListener('submit',e => {
    e.preventDefault();
    sessionStorage.setItem('kinetic-rsvp',JSON.stringify(Object.fromEntries(new FormData(form))));
    form.hidden = true; success.hidden = false;
  });
})();
