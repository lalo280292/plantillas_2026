(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gate = document.querySelector('[data-gate]');
  const open = document.querySelector('[data-open]');
  const progress = document.querySelector('[data-progress]');
  const chapter = document.querySelector('[data-chapter]');
  const isMobile = () => matchMedia('(max-width: 47.99rem)').matches;

  const unlock = () => { document.body.style.overflow=''; if (gate) gate.remove(); };
  if (!gate || !open) return;
  document.body.style.overflow = 'hidden';

  if (!window.gsap || !window.ScrollTrigger || reduce) {
    open.addEventListener('click',unlock,{once:true});
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // OPENING: the seal breaks the paper composition rather than simply fading it.
  open.addEventListener('click',() => {
    document.body.style.overflow='';
    gsap.timeline({defaults:{ease:'power4.inOut'},onComplete:unlock})
      .to('.seal',{scale:.72,rotation:18,duration:.45,ease:'power2.in'})
      .to('.gate__center,.gate__hint',{opacity:0,duration:.35},'<')
      .to('.gate__leaf--left',{xPercent:-102,rotation:-2,duration:1.15},'-=.05')
      .to('.gate__leaf--right',{xPercent:102,rotation:2,duration:1.15},'<')
      .fromTo('[data-hero-image]',{scale:.82,filter:'brightness(.35)'},{scale:1,filter:'brightness(1)',duration:1.15,ease:'power3.out'},'-=.72')
      .from('[data-hero-bride]',{xPercent:-45,opacity:0,duration:.9,ease:'power3.out'},'-=.75')
      .from('[data-hero-groom]',{xPercent:45,opacity:0,duration:.9,ease:'power3.out'},'<')
      .from('[data-hero-amp]',{scale:0,rotation:-60,opacity:0,duration:.7,ease:'back.out(1.7)'},'-=.5');
  },{once:true});

  // Global scroll progress.
  gsap.to(progress,{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.2}});

  // HUD chapter label follows the narrative section currently occupying the viewport.
  gsap.utils.toArray('[data-chapter-name]').forEach(section => {
    ScrollTrigger.create({trigger:section,start:'top 55%',end:'bottom 55%',onEnter:()=>chapter.textContent=section.dataset.chapterName,onEnterBack:()=>chapter.textContent=section.dataset.chapterName});
  });

  // HERO: one image becomes a framed editorial plate while the names split apart.
  const heroTl = gsap.timeline({scrollTrigger:{trigger:'.hero-stage',start:'top top',end:'bottom bottom',scrub:1}});
  heroTl
    .to('[data-hero-bride]',{xPercent:-22,yPercent:-42,scale:.72,ease:'none'},0)
    .to('[data-hero-groom]',{xPercent:22,yPercent:42,scale:.72,ease:'none'},0)
    .to('[data-hero-amp]',{rotation:90,scale:.45,opacity:.55,ease:'none'},0)
    .to('[data-hero-image]',{clipPath:isMobile()?'inset(8% 7% 18% 7% round 0px)':'inset(9% 22% 10% 22% round 0px)',ease:'none'},0)
    .to('.hero__image img',{scale:1.12,yPercent:5,ease:'none'},0)
    .to('.hero__shade',{opacity:.45,ease:'none'},0)
    .to('.hero__frame',{inset:isMobile()?'2rem':'4rem 24%',opacity:.35,ease:'none'},0)
    .to('.hero__caption,.hero__date,.hero__scroll',{opacity:0,ease:'none'},.15)
    .to('.hero__ghost',{yPercent:-25,opacity:.8,ease:'none'},0);

  // STORY: build a custom word split so the sentence physically assembles while photo is revealed.
  const quote = document.querySelector('[data-story-quote]');
  if (quote && !isMobile()) {
    const words = quote.textContent.trim().split(/\s+/);
    quote.innerHTML = words.map(w=>`<span class="word"><span>${w}&nbsp;</span></span>`).join('');
    const storyTl = gsap.timeline({scrollTrigger:{trigger:'.story',start:'top top',end:'bottom bottom',scrub:1}});
    storyTl
      .fromTo('.story__quote .word>span',{yPercent:115,rotation:3},{yPercent:0,rotation:0,stagger:.035,ease:'power3.out',duration:.34},0)
      .to('[data-story-media]',{clipPath:'inset(0% 0% 0% 0%)',duration:.45,ease:'power3.inOut'},.18)
      .fromTo('[data-story-media] img',{yPercent:-8,scale:1.1},{yPercent:2,scale:1,duration:.7,ease:'none'},.2)
      .to('.story__orb',{scale:1.45,opacity:.16,duration:.6,ease:'none'},.22)
      .fromTo('.story__copy',{y:80,opacity:0},{y:0,opacity:1,duration:.3},.42)
      .to('.story__quote',{xPercent:-7,duration:.3,ease:'none'},.67)
      .to('[data-story-media]',{xPercent:10,duration:.3,ease:'none'},.67);
  }

  // Families: type enters from opposite sides; giant numbers drift slowly.
  gsap.utils.toArray('[data-family]').forEach((card,i)=>{
    gsap.from(card.querySelectorAll('.family__name'),{x:i?70:-70,opacity:0,stagger:.12,duration:1.05,ease:'power3.out',scrollTrigger:{trigger:card,start:'top 78%'}});
    gsap.to(card.querySelector('.family__number'),{x:i?-40:40,ease:'none',scrollTrigger:{trigger:card,start:'top bottom',end:'bottom top',scrub:true}});
  });

  // Venue theatre: first card shrinks/tilts and the second card rises over it.
  if (!isMobile()) {
    const venueTl = gsap.timeline({scrollTrigger:{trigger:'.venues',start:'top top',end:'bottom bottom',scrub:1}});
    gsap.set('[data-venue="reception"]',{yPercent:105,scale:.92,rotation:1.4});
    venueTl
      .to('[data-venue="ceremony"]',{scale:.84,yPercent:-10,rotation:-2,filter:'brightness(.55)',duration:.48,ease:'none'},0)
      .to('[data-venue="ceremony"] .venue-card__media img',{scale:1.12,yPercent:4,duration:.48,ease:'none'},0)
      .to('[data-venue="reception"]',{yPercent:0,scale:1,rotation:0,duration:.52,ease:'power3.inOut'},.2)
      .fromTo('[data-venue="reception"] .venue-card__media img',{scale:1.16,yPercent:-8},{scale:1,yPercent:0,duration:.55,ease:'none'},.25)
      .to('.venues__backword',{xPercent:-12,duration:.7,ease:'none'},0);
  }

  // Countdown: digits have a small arrival choreography.
  gsap.from('.countdown__cell strong',{yPercent:110,opacity:0,stagger:.08,duration:1,ease:'power4.out',scrollTrigger:{trigger:'.countdown__grid',start:'top 78%'}});

  // Horizontal gallery: scroll drives the film strip, each photo gets inverse parallax.
  if (!isMobile()) {
    const track = document.querySelector('[data-gallery-track]');
    const items = gsap.utils.toArray('.gallery__item');
    const updateCounter = self => {
      const n = Math.min(items.length-1,Math.max(0,Math.round(self.progress*(items.length-1))));
      document.querySelector('[data-gallery-current]').textContent=String(n+1).padStart(2,'0');
    };
    const getDistance = () => Math.max(0,track.scrollWidth-innerWidth+parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gutter'))*2);
    gsap.to(track,{x:()=>-getDistance(),ease:'none',scrollTrigger:{trigger:'.gallery',start:'top top',end:'bottom bottom',scrub:1,invalidateOnRefresh:true,onUpdate:updateCounter}});
    gsap.fromTo('.gallery__item img',{xPercent:-3},{xPercent:5,ease:'none',stagger:.04,scrollTrigger:{trigger:'.gallery',start:'top top',end:'bottom bottom',scrub:1}});
  } else {
    gsap.utils.toArray('.gallery__item').forEach((item,i)=>gsap.from(item,{clipPath:'inset(0 0 100% 0)',duration:1.1,ease:'power4.inOut',scrollTrigger:{trigger:item,start:'top 82%'}}));
  }

  // Timeline line literally draws as the schedule enters.
  gsap.to('[data-timeline-progress]',{scaleY:1,ease:'none',scrollTrigger:{trigger:'.timeline__rail',start:'top 70%',end:'bottom 45%',scrub:true}});
  gsap.utils.toArray('[data-timeline-item]').forEach(item=>{
    gsap.from(item.querySelectorAll('.timeline-item__time,.timeline-item__title,.timeline-item__copy'),{x:35,opacity:0,stagger:.08,duration:.75,ease:'power3.out',scrollTrigger:{trigger:item,start:'top 80%'}});
    gsap.to(item.querySelector('.timeline-item__dot'),{scale:1.8,backgroundColor:'var(--gold)',scrollTrigger:{trigger:item,start:'top 62%',toggleActions:'play reverse play reverse'},duration:.25});
  });

  // Dress rings orbit subtly with scroll.
  gsap.to('.dress__rings i:nth-child(1)',{rotation:120,xPercent:9,ease:'none',scrollTrigger:{trigger:'.dress',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.to('.dress__rings i:nth-child(2)',{rotation:-95,xPercent:-8,ease:'none',scrollTrigger:{trigger:'.dress',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.to('.dress__rings i:nth-child(3)',{scale:1.35,ease:'none',scrollTrigger:{trigger:'.dress',start:'top bottom',end:'bottom top',scrub:true}});

  // Closing iris: the final image starts as a small circle and consumes the entire screen.
  const closeTl = gsap.timeline({scrollTrigger:{trigger:'.closing',start:'top top',end:'bottom bottom',scrub:1}});
  closeTl
    .to('[data-closing-photo]',{clipPath:'circle(78% at 50% 50%)',duration:.72,ease:'power2.inOut'},0)
    .fromTo('[data-closing-photo] img',{scale:1.14},{scale:1,yPercent:4,duration:1,ease:'none'},0)
    .fromTo('.closing__content',{scale:.72,opacity:0},{scale:1,opacity:1,duration:.5,ease:'power3.out'},.18)
    .to('.closing__giant',{yPercent:-20,opacity:.7,duration:.8,ease:'none'},0);

  addEventListener('resize',()=>ScrollTrigger.refresh());
})();
