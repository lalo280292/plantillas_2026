(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gate = document.querySelector('[data-intro-gate]');
  const openButton = document.querySelector('[data-open-invitation]');
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('.scroll-progress span');

  const unlock = () => {
    document.body.style.overflow = '';
    gate?.setAttribute('aria-hidden', 'true');
    if (gate) gate.style.display = 'none';
  };

  if (!gate || !openButton) return;

  const previewMode = new URLSearchParams(location.search).get('preview') === '1';
  if (previewMode) {
    unlock();
  } else {
    document.body.style.overflow = 'hidden';
  }

  if (!window.gsap || reduceMotion) {
    openButton.addEventListener('click', unlock);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (!previewMode) openButton.addEventListener('click', () => {
    document.body.style.overflow = '';
    gsap.timeline({ onComplete: unlock })
      .to('.intro-gate__inner', { y: -22, opacity: 0, duration: .65, ease: 'power2.in' })
      .to(gate, { clipPath: 'inset(0 0 100% 0)', duration: 1.05, ease: 'power4.inOut' }, '-=.18')
      .from('.hero__media video', { scale: 1.12, duration: 1.55, ease: 'power3.out' }, '-=.7')
      .from('.hero__content > *', { y: 28, opacity: 0, stagger: .11, duration: .8, ease: 'power3.out' }, '-=.95');
  }, { once: true });

  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 42,
      opacity: 0,
      duration: .95,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });
  });

  gsap.utils.toArray('[data-parallax]').forEach((wrap) => {
    const media = wrap.querySelector('img, video');
    if (!media) return;
    gsap.fromTo(media,
      { yPercent: -4 },
      {
        yPercent: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });

  if (progress) {
    gsap.to(progress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: 'max',
        scrub: .15
      }
    });
  }

  let lastY = 0;
  ScrollTrigger.create({
    start: 120,
    end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      header?.classList.toggle('is-solid', y > window.innerHeight * .7);
      header?.classList.toggle('is-hidden', y > lastY && y > 420 && self.direction === 1);
      if (self.direction === -1) header?.classList.remove('is-hidden');
      lastY = y;
    }
  });
})();
