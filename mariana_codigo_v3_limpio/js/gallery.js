(() => {
  const config = window.INVITATION_CONFIG;
  const gallery = document.getElementById('gallery');
  const dialog = document.getElementById('lightbox');
  const image = document.getElementById('lightboxImage');
  const close = dialog.querySelector('.lightbox-close');
  const prev = dialog.querySelector('.lightbox-prev');
  const next = dialog.querySelector('.lightbox-next');
  let index = 0;

  config.gallery.forEach((src, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Abrir fotografía ${i + 1}`);
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Fotografía ${i + 1} de Mariana`;
    img.loading = 'lazy';
    button.appendChild(img);
    button.addEventListener('click', () => open(i));
    gallery.appendChild(button);
  });

  function show(i) {
    index = (i + config.gallery.length) % config.gallery.length;
    image.src = config.gallery[index];
  }
  function open(i) {
    show(i);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }
  function hide() { dialog.close?.(); if (dialog.hasAttribute('open')) dialog.removeAttribute('open'); }

  close.addEventListener('click', hide);
  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  dialog.addEventListener('click', (e) => { if (e.target === dialog) hide(); });
  document.addEventListener('keydown', (e) => {
    if (!dialog.open) return;
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
})();
