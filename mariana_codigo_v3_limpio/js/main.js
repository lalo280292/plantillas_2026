(() => {
  const config = window.INVITATION_CONFIG;


  function getByPath(object, path) {
    return path.split('.').reduce((value, key) => value?.[key], object);
  }

  function bindConfig() {
    document.querySelectorAll('[data-bind]').forEach((node) => {
      const value = getByPath(config, node.dataset.bind);
      if (value !== undefined && value !== null) node.textContent = value;
    });
    document.querySelectorAll('[data-bind-href]').forEach((node) => {
      const value = getByPath(config, node.dataset.bindHref);
      if (value) node.href = value;
    });
  }

  function renderNames(containerId, names) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.replaceChildren();
    names.forEach((name, index) => {
      const span = document.createElement('span');
      span.textContent = name;
      container.appendChild(span);
      if (index < names.length - 1) {
        const amp = document.createElement('span');
        amp.className = 'amp';
        amp.textContent = '&';
        container.appendChild(amp);
      }
    });
  }

  function renderTimeline() {
    const root = document.getElementById('timeline');
    if (!root) return;
    root.replaceChildren();
    config.itinerary.forEach((item) => {
      const article = document.createElement('article');
      article.className = 'timeline-item';
      article.dataset.reveal = 'fade-up';
      article.innerHTML = `
        <div class="timeline-photo" style="background-image:url('${item.image}')"></div>
        <div class="timeline-copy"><strong>${item.label}</strong><span>${item.time}</span></div>`;
      root.appendChild(article);
    });
  }

  function init() {
    bindConfig();
    renderNames('parentsNames', config.family.parents);
    renderNames('godparentsNames', config.family.godparents);
    renderTimeline();
    const album = document.getElementById('albumButton');
    if (album) album.href = config.social.albumUrl;
    document.body.classList.add('envelope-locked');
  }

  window.Invitation = { config, getByPath };
  init();
})();
