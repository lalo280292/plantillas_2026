(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gate = document.querySelector('[data-gate]');
  const openButton = document.querySelector('[data-open]');
  const progressBar = document.querySelector('[data-progress]');
  const chapterLabel = document.querySelector('[data-chapter]');
  const mobileMQ = matchMedia('(max-width: 47.99rem)');
  const isMobile = () => mobileMQ.matches;

  const canGSAP = !!window.gsap;
  const ST = window.ScrollTrigger;
  const FlipP = window.Flip;
  const MotionP = window.MotionPathPlugin;
  const MorphP = window.MorphSVGPlugin;
  const DrawP = window.DrawSVGPlugin;

  if (!canGSAP || !ST || reduce) {
    if (gate && openButton) {
      document.body.style.overflow = 'hidden';
      openButton.addEventListener('click', () => {
        document.body.style.overflow = '';
        gate.remove();
      }, {once:true});
    }
    return;
  }

  const plugins = [ST, FlipP, MotionP, MorphP, DrawP].filter(Boolean);
  gsap.registerPlugin(...plugins);

  // ---------- helpers ----------
  const drawFallback = (target, from = 0, to = 1, vars = {}) => {
    const nodes = gsap.utils.toArray(target);
    nodes.forEach(path => {
      const length = path.getTotalLength?.() || 1000;
      gsap.set(path, {strokeDasharray:length, strokeDashoffset:length * (1 - from)});
      gsap.to(path, {...vars, strokeDashoffset:length * (1 - to)});
    });
  };

  const drawTo = (target, value, vars = {}) => {
    if (DrawP) return gsap.to(target, {...vars, drawSVG:value});
    return drawFallback(target, 0, value === '100%' ? 1 : 0, vars);
  };

  // ---------- gate / permission / opening ----------
  if (gate && openButton) {
    document.body.style.overflow = 'hidden';

    if (DrawP) {
      gsap.set('.gate-vine,.gate-leaf', {drawSVG:'0%'});
      gsap.timeline({defaults:{ease:'power2.out'}})
        .to('.gate-vine',{drawSVG:'100%',duration:1.8,stagger:.12})
        .to('.gate-leaf',{drawSVG:'100%',duration:.7,stagger:.08},'-=.75');
    } else {
      drawFallback('.gate-vine',0,1,{duration:1.8,stagger:.12,ease:'power2.out'});
    }

    const requestMotionPermission = async () => {
      try {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
          const state = await DeviceOrientationEvent.requestPermission();
          if (state === 'granted') attachOrientation();
        } else if ('DeviceOrientationEvent' in window) {
          attachOrientation();
        }
      } catch (_) { /* motion remains pointer-only */ }
    };

    openButton.addEventListener('click', async () => {
      requestMotionPermission();
      document.body.style.overflow = '';

      const tl = gsap.timeline({
        defaults:{ease:'power4.inOut'},
        onComplete:() => gate.remove()
      });
      tl.to('.seal',{scale:.58,rotation:28,duration:.48,ease:'power3.in'})
        .to('.gate__center',{opacity:0,scale:.92,duration:.42},'<')
        .to('.gate__botanical--a',{xPercent:-45,yPercent:18,rotation:-17,duration:1.05},'-=.12')
        .to('.gate__botanical--b',{xPercent:45,yPercent:-18,rotation:184,duration:1.05},'<')
        .to('.gate__curtain--left',{xPercent:-103,rotationY:-9,duration:1.15},'-=.82')
        .to('.gate__curtain--right',{xPercent:103,rotationY:9,duration:1.15},'<')
        .fromTo('.hero__media img',{scale:1.18,filter:'brightness(.42) saturate(.45)'},{scale:1.04,filter:'brightness(1) saturate(.75)',duration:1.5,ease:'power3.out'},'-=.85')
        .from('[data-hero-word]',{yPercent:125,rotation:3,opacity:0,stagger:.11,duration:1.05,ease:'power4.out'},'-=1.1')
        .from('.hero-amp',{scale:0,rotation:-110,opacity:0,duration:.8,ease:'back.out(1.5)'},'-=.65')
        .from('.hero__topline,.hero__scroll',{opacity:0,y:18,duration:.7,stagger:.08},'-=.5');
    }, {once:true});
  }

  // ---------- global narrative HUD ----------
  gsap.to(progressBar,{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.15}});
  gsap.utils.toArray('[data-chapter-name]').forEach(section => {
    ST.create({
      trigger:section,start:'top 55%',end:'bottom 55%',
      onEnter:()=>chapterLabel.textContent=section.dataset.chapterName,
      onEnterBack:()=>chapterLabel.textContent=section.dataset.chapterName
    });
  });

  // ---------- pointer + gyroscope depth ----------
  const depthEls = gsap.utils.toArray('[data-depth]');
  let depthX = 0, depthY = 0;
  const renderDepth = (x,y) => {
    depthX = x; depthY = y;
    depthEls.forEach(el => {
      const d = parseFloat(el.dataset.depth || 0);
      gsap.to(el,{x:x*d*46,y:y*d*34,rotation:x*d*1.8,duration:.9,ease:'power3.out',overwrite:'auto'});
    });
  };
  addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    renderDepth((e.clientX/innerWidth-.5)*2,(e.clientY/innerHeight-.5)*2);
  }, {passive:true});

  let orientationAttached = false;
  function attachOrientation(){
    if (orientationAttached) return;
    orientationAttached = true;
    addEventListener('deviceorientation', e => {
      const x = Math.max(-1,Math.min(1,(e.gamma || 0)/28));
      const y = Math.max(-1,Math.min(1,((e.beta || 45)-45)/30));
      renderDepth(x,y);
    }, {passive:true});
  }

  // ---------- HERO: line draw + typographic fracture ----------
  if (DrawP) gsap.set('[data-hero-line]',{drawSVG:'0%'});
  else drawFallback('[data-hero-line]',0,0);

  const heroTl = gsap.timeline({scrollTrigger:{trigger:'.hero-stage',start:'top top',end:'bottom bottom',scrub:1}});
  if (DrawP) heroTl.to('[data-hero-line]',{drawSVG:'100%',duration:.48,ease:'none'},0);
  else heroTl.to('[data-hero-line]',{strokeDashoffset:0,duration:.48,ease:'none'},0);
  heroTl
    .to('.hero-word--one',{xPercent:-22,yPercent:-52,scale:.67,letterSpacing:'.01em',ease:'none'},0)
    .to('.hero-word--two',{xPercent:22,yPercent:54,scale:.67,letterSpacing:'.01em',ease:'none'},0)
    .to('.hero-amp',{rotation:180,scale:.42,opacity:.62,ease:'none'},0)
    .to('.hero__media',{clipPath:isMobile()?'inset(9% 6% 20% 6% round 44% 44% 2% 2%)':'inset(8% 25% 9% 25% round 48% 48% 3% 3%)',ease:'none'},0)
    .to('.hero__media img',{scale:1.18,yPercent:6,ease:'none'},0)
    .to('.hero__echo span:first-child',{xPercent:-18,ease:'none'},0)
    .to('.hero__echo span:nth-child(2)',{xPercent:4,ease:'none'},0)
    .to('.hero__echo span:nth-child(3)',{xPercent:16,ease:'none'},0)
    .to('.hero__topline,.hero__scroll',{opacity:0,ease:'none'},.12)
    .to('.flower-depth--1',{rotation:62,scale:1.35,ease:'none'},0)
    .to('.flower-depth--2',{rotation:-45,scale:.98,ease:'none'},0);

  // ---------- FLIP: same DOM photo migrates through four layouts ----------
  const flipPhoto = document.querySelector('[data-flip-photo]');
  const flipSlots = gsap.utils.toArray('[data-flip-slot]');
  let currentSlot = -1;

  function moveFlipPhoto(index, animate = true) {
    if (!FlipP || !flipPhoto || !flipSlots[index] || index === currentSlot) return;
    const targetSlot = flipSlots[index];
    const state = FlipP.getState(flipPhoto,{props:'borderRadius'});
    targetSlot.style.overflow = 'visible';
    targetSlot.appendChild(flipPhoto);
    flipPhoto.style.borderRadius = index === 2 ? '50%' : index === 3 ? '1px' : '0px';
    currentSlot = index;
    if (animate) {
      FlipP.from(state,{
        duration:1.05,ease:'power4.inOut',absolute:true,scale:true,prune:true,
        onComplete:()=>{ targetSlot.style.overflow = 'hidden'; }
      });
      gsap.fromTo(flipPhoto.querySelector('img'),{scale:1.14},{scale:1.03,duration:1.25,ease:'power3.out'});
    } else {
      targetSlot.style.overflow = 'hidden';
    }
  }
  if (FlipP && flipPhoto && flipSlots.length) moveFlipPhoto(0,false);

  if (!isMobile()) {
    const thresholds = [0,.245,.50,.755];
    ST.create({
      trigger:'.continuum',start:'top top',end:'bottom bottom',scrub:true,
      onUpdate:self => {
        let index = 0;
        thresholds.forEach((t,i)=>{ if (self.progress >= t) index=i; });
        moveFlipPhoto(index,true);
        gsap.set('.continuum__intro',{opacity:gsap.utils.clamp(.08,1,1-self.progress*1.7),yPercent:-self.progress*18});
      }
    });
    gsap.utils.toArray('.flip-copy').forEach((el,i)=>{
      gsap.fromTo(el,{opacity:.12,y:34},{opacity:1,y:0,ease:'none',scrollTrigger:{trigger:'.continuum',start:`top+=${i*24}% top`,end:`top+=${(i+1)*24}% top`,scrub:true}});
    });
  } else if (FlipP) {
    flipSlots.forEach((slot,i)=>ST.create({
      trigger:slot,start:'top 62%',end:'bottom 38%',
      onEnter:()=>moveFlipPhoto(i,true),onEnterBack:()=>moveFlipPhoto(i,true)
    }));
  }

  // ---------- Organic SVG mask: live path morph, not clip-path presets ----------
  if (MorphP) {
    const organicTl = gsap.timeline({scrollTrigger:{trigger:'.organic',start:'top 78%',end:'bottom 18%',scrub:1}});
    organicTl
      .to('#organicMask',{morphSVG:{shape:'#maskShapeB'},duration:.5,ease:'none'},0)
      .to('.organic__outline',{morphSVG:{shape:'#maskShapeB'},duration:.5,ease:'none'},0)
      .to('#organicMask',{morphSVG:{shape:'#maskShapeC'},duration:.5,ease:'none'},.5)
      .to('.organic__outline',{morphSVG:{shape:'#maskShapeC'},duration:.5,ease:'none'},.5)
      .fromTo('[data-organic-image]',{attr:{y:-30},scale:1.08,transformOrigin:'50% 50%'},{attr:{y:25},scale:1,duration:1,ease:'none'},0);
  } else {
    gsap.from('.organic__art',{clipPath:'inset(0 0 100% 0)',duration:1.2,ease:'power4.inOut',scrollTrigger:{trigger:'.organic__art',start:'top 78%'}});
  }

  // ---------- SVG botanical journey: draw + object follows exact SVG path ----------
  if (DrawP) gsap.set('.botanical__path,.botanical__twig',{drawSVG:'0%'});
  else {
    drawFallback('.botanical__path',0,0);
    drawFallback('.botanical__twig',0,0);
  }
  const journeyTl = gsap.timeline({scrollTrigger:{trigger:'.botanical',start:'top top',end:'bottom bottom',scrub:1}});
  if (DrawP) {
    journeyTl.to('.botanical__path',{drawSVG:'100%',duration:.78,ease:'none'},0)
      .to('.botanical__twig',{drawSVG:'100%',stagger:.07,duration:.34,ease:'none'},.18);
  } else {
    journeyTl.to('.botanical__path',{strokeDashoffset:0,duration:.78,ease:'none'},0)
      .to('.botanical__twig',{strokeDashoffset:0,stagger:.07,duration:.34,ease:'none'},.18);
  }
  if (MotionP) {
    journeyTl.to('[data-journey-leaf]',{motionPath:{path:'#journeyPath',align:'#journeyPath',alignOrigin:[.5,.5],autoRotate:true,start:0,end:1},duration:.83,ease:'none'},0);
  }
  journeyTl
    .fromTo('.botanical__labels span',{opacity:.2},{opacity:1,stagger:.22,duration:.18,ease:'none'},.1)
    .to('.botanical__copy',{yPercent:-18,opacity:.58,duration:.65,ease:'none'},.28);

  // ---------- Type × image: word travels behind and in front of the same photo ----------
  const typeTl = gsap.timeline({scrollTrigger:{trigger:'.type-photo',start:'top top',end:'bottom bottom',scrub:1}});
  typeTl
    .fromTo('.type-photo__media',{clipPath:'inset(0 48% 0 48%)'},{clipPath:'inset(0 0% 0 0%)',duration:.32,ease:'power3.inOut'},0)
    .fromTo('.type-photo__word--back',{xPercent:-18},{xPercent:12,duration:1,ease:'none'},0)
    .fromTo('.type-photo__word--front',{xPercent:18},{xPercent:-12,duration:1,ease:'none'},0)
    .fromTo('.type-photo__media img',{scale:1.22,xPercent:-5},{scale:1.04,xPercent:4,duration:1,ease:'none'},0)
    .to('.type-photo__media',{left:isMobile()?'8%':'18%',width:isMobile()?'84%':'64%',duration:.55,ease:'power2.inOut'},.42)
    .fromTo('.type-photo__copy',{opacity:0,y:50},{opacity:1,y:0,duration:.3},.58);

  // ---------- Venue cards ----------
  gsap.from('.venue-card',{y:110,rotation:i=>i?2.5:-2.5,opacity:0,stagger:.16,duration:1.15,ease:'power4.out',scrollTrigger:{trigger:'.venues__grid',start:'top 76%'}});

  // ---------- Horizontal gallery / mobile reveal ----------
  if (!isMobile()) {
    const track = document.querySelector('[data-gallery-track]');
    const distance = () => Math.max(0,track.scrollWidth-innerWidth+parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gutter'))*2);
    gsap.to(track,{x:()=>-distance(),ease:'none',scrollTrigger:{trigger:'.gallery',start:'top top',end:'bottom bottom',scrub:1,invalidateOnRefresh:true}});
    gsap.fromTo('.gallery__track img',{xPercent:-7,scale:1.13},{xPercent:7,scale:1.02,ease:'none',scrollTrigger:{trigger:'.gallery',start:'top top',end:'bottom bottom',scrub:1}});
    gsap.to('.gallery__title',{yPercent:-42,opacity:.45,ease:'none',scrollTrigger:{trigger:'.gallery',start:'top top',end:'bottom bottom',scrub:1}});
  } else {
    gsap.utils.toArray('.gallery__track figure').forEach((item,i)=>gsap.from(item,{clipPath:i%2?'inset(100% 0 0 0)':'inset(0 0 100% 0)',duration:1.15,ease:'power4.inOut',scrollTrigger:{trigger:item,start:'top 82%'}}));
  }

  // ---------- Timeline ----------
  gsap.to('[data-timeline-progress]',{scaleY:1,ease:'none',scrollTrigger:{trigger:'.timeline__rail',start:'top 72%',end:'bottom 42%',scrub:true}});
  gsap.utils.toArray('[data-timeline-item]').forEach((item,i)=>{
    gsap.from(item.querySelectorAll('.timeline-item__time,.timeline-item__title,.timeline-item__copy'),{x:42,opacity:0,stagger:.07,duration:.8,ease:'power3.out',scrollTrigger:{trigger:item,start:'top 82%'}});
    gsap.to(item.querySelector('.timeline-item__dot'),{scale:1.8,backgroundColor:'var(--gold)',scrollTrigger:{trigger:item,start:'top 61%',toggleActions:'play reverse play reverse'},duration:.25});
  });

  // ---------- Closing depth / zoom ----------
  gsap.fromTo('.closing__media img',{scale:1.2},{scale:1,ease:'none',scrollTrigger:{trigger:'.closing',start:'top bottom',end:'bottom bottom',scrub:1}});
  gsap.from('.closing__copy',{y:90,opacity:0,duration:1,ease:'power4.out',scrollTrigger:{trigger:'.closing',start:'top 48%'}});

  // Progressive refresh after images/fonts settle.
  addEventListener('load',()=>ST.refresh());
  let resizeTimer;
  addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>ST.refresh(),180);});
})();
