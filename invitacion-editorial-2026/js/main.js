(() => {
  const config = window.INVITATION_CONFIG;
  if (!config) return;

  const get = (path) => path.split('.').reduce((acc, key) => acc?.[key], config);

  document.querySelectorAll('[data-bind]').forEach((el) => {
    const value = get(el.dataset.bind);
    if (value !== undefined && value !== null) el.textContent = value;
  });

  document.querySelectorAll('[data-bind-src]').forEach((el) => {
    const value = get(el.dataset.bindSrc);
    if (value) el.src = value;
  });

  document.querySelectorAll('[data-bind-poster]').forEach((el) => {
    const value = get(el.dataset.bindPoster);
    if (value) el.poster = value;
  });

  Object.entries(config.theme || {}).forEach(([key, value]) => {
    const cssName = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    document.documentElement.style.setProperty(`--${cssName}`, value);
  });

  const renderNames = (selector, names) => {
    const host = document.querySelector(selector);
    if (!host) return;
    host.innerHTML = '';
    names.forEach((name) => {
      const span = document.createElement('span');
      span.textContent = name;
      host.appendChild(span);
    });
  };
  renderNames('[data-bride-parents]', config.parents.bride);
  renderNames('[data-groom-parents]', config.parents.groom);

  const itinerary = document.querySelector('[data-itinerary]');
  if (itinerary) {
    itinerary.innerHTML = config.itinerary.map((item, i) => `
      <article class="timeline-item" data-reveal>
        <div class="timeline-item__time">${item.time}</div>
        <div>
          <h3 class="timeline-item__title">${item.title}</h3>
          <p class="timeline-item__copy">${item.copy}</p>
        </div>
      </article>
    `).join('');
  }

  document.querySelectorAll('[data-map]').forEach((link) => {
    const section = config[link.dataset.map];
    if (!section) return;
    link.href = section.mapUrl || '#';
    if (!section.mapUrl || section.mapUrl === '#') {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        alert(`Configura ${link.dataset.map}.mapUrl en js/config.js`);
      });
    }
  });

  const giftLink = document.querySelector('[data-gift-link]');
  if (giftLink) {
    giftLink.href = config.gifts.registryUrl || '#';
    if (!config.gifts.registryUrl || config.gifts.registryUrl === '#') {
      giftLink.addEventListener('click', (event) => {
        event.preventDefault();
        alert('Configura gifts.registryUrl en js/config.js');
      });
    }
  }

  const bankButton = document.querySelector('[data-bank-button]');
  const bankDetails = document.querySelector('[data-bank-details]');
  bankButton?.addEventListener('click', () => {
    bankDetails.hidden = !bankDetails.hidden;
    bankButton.textContent = bankDetails.hidden ? 'Datos para transferencia ↗' : 'Ocultar datos ↑';
  });

  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const setMenu = (open) => {
    menuButton?.setAttribute('aria-expanded', String(open));
    if (mobileMenu) mobileMenu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  mobileMenu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  const countdown = document.querySelector('[data-countdown]');
  if (countdown) {
    const target = new Date(config.date.iso).getTime();
    const slots = {
      days: countdown.querySelector('[data-days]'),
      hours: countdown.querySelector('[data-hours]'),
      minutes: countdown.querySelector('[data-minutes]'),
      seconds: countdown.querySelector('[data-seconds]')
    };
    const pad = (n, size = 2) => String(Math.max(0, n)).padStart(size, '0');
    const update = () => {
      const diff = Math.max(0, target - Date.now());
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff / 3600000) % 24);
      const minutes = Math.floor((diff / 60000) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      slots.days.textContent = pad(days, 3);
      slots.hours.textContent = pad(hours);
      slots.minutes.textContent = pad(minutes);
      slots.seconds.textContent = pad(seconds);
    };
    update();
    setInterval(update, 1000);
  }

  const form = document.querySelector('[data-rsvp-form]');
  const success = document.querySelector('[data-rsvp-success]');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    sessionStorage.setItem('invitation-rsvp-demo', JSON.stringify(data));
    form.hidden = true;
    success.hidden = false;
  });
  document.querySelector('[data-rsvp-reset]')?.addEventListener('click', () => {
    sessionStorage.removeItem('invitation-rsvp-demo');
    success.hidden = true;
    form.hidden = false;
  });

  const galleryItems = [...document.querySelectorAll('[data-lightbox-index]')];
  const dialog = document.querySelector('[data-lightbox]');
  const dialogImage = dialog?.querySelector('[data-lightbox-image]');
  const dialogCaption = dialog?.querySelector('[data-lightbox-caption]');
  let activeIndex = 0;

  const transition = (callback) => {
    if (document.startViewTransition) return document.startViewTransition(callback);
    callback();
  };

  const showImage = (index) => {
    activeIndex = (index + galleryItems.length) % galleryItems.length;
    const img = galleryItems[activeIndex].querySelector('img');
    if (!img || !dialogImage) return;
    dialogImage.src = img.currentSrc || img.src;
    dialogImage.alt = img.alt;
    if (dialogCaption) dialogCaption.textContent = img.alt;
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => transition(() => {
      showImage(index);
      if (!dialog.open) dialog.showModal();
    }));
  });
  dialog?.querySelector('[data-lightbox-close]')?.addEventListener('click', () => transition(() => dialog.close()));
  dialog?.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => transition(() => showImage(activeIndex - 1)));
  dialog?.querySelector('[data-lightbox-next]')?.addEventListener('click', () => transition(() => showImage(activeIndex + 1)));
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) transition(() => dialog.close());
  });

  window.__INVITATION_READY__ = true;
})();
