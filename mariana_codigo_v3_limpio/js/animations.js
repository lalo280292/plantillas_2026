(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -5% 0px' });

  const observeAll = () => document.querySelectorAll('[data-reveal]:not(.is-observed)').forEach((el) => {
    el.classList.add('is-observed');
    observer.observe(el);
  });
  observeAll();
  queueMicrotask(observeAll);
})();
