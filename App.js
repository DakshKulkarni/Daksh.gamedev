(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let savedMotion = null;
  try { savedMotion = localStorage.getItem('daksh-motion'); } catch {}
  let motionOff = savedMotion === 'off' || (savedMotion !== 'on' && preference.matches);
  let animationContext, galleryContext, galleryTween, lenis;
  let navigating = false;
  const track = $('#project-track');
  const dialog = $('#project-dialog');
  let lastProjectTrigger;
  const projects = {
    carnival: { title: 'VR Carnival', type: 'VIRTUAL REALITY / GAMEPLAY', image: 'carnival', description: 'An interactive VR amusement park combining mini-games, joy rides, and controller-based UI. Built with Unity, C#, Solidity, Kotlin, and the Meta All-in-1 SDK.', built: ['2–3 VR mini-games using Rigidbody physics', 'Prefab pooling and controller-driven UI Canvas interactions', 'Immersive joy-ride experiences'], role: ['VR interaction design and UI implementation', 'Gameplay systems and physics', 'Connecting smart-contract functionality with the game'], url: 'https://ethglobal.com/showcase/vr-carnival-098z4', link: 'View ETHGlobal showcase' },
    viewkia: { title: 'ViewKia', type: 'MULTIPLAYER / MIXED REALITY', image: 'viewkia', description: 'A multiplayer mixed-reality application that brings furniture into your real environment. Voice input spawns furniture in real time, with Gemini API integration for colour transitions.', built: ['Real-time furniture spawning in mixed reality', 'Voice-driven furniture and colour interactions', 'Multiplayer interaction flow'], role: ['Core MR systems and UI logic', 'Voice-input pipeline integration', 'Gameplay interaction implementation'], url: 'https://devpost.com/software/viewkea-nrld5c', link: 'View Devpost showcase' },
    puzzles: { title: 'VR Puzzles', type: 'VR / EEG RESEARCH', image: 'vr-puzzles', description: 'Three VR puzzles designed to create confusion and study cognitive responses through EEG feedback. Developed in Unity and C# with the Meta All-in-1 SDK for an ongoing research study.', built: ['Three interactive VR puzzle scenarios', 'Research flow and VR interaction feedback', 'EEG data collected from 25+ participants'], role: ['₹50,000 seed grant secured for the VR research project', 'Patent filed and published in January 2026', 'Featured by SRM University AP'], roleTitle: 'RESEARCH OUTCOMES', url: 'https://www.srmap.edu.in/news/patent-on-real-time-stress-analysis-for-emotional-and-cognitive-assessment/', link: 'Read the university feature' },
    scp: { title: 'SCP Maze Runner', type: 'VR HORROR / AI SYSTEMS', image: 'scp', description: 'A VR horror experience using flickering lights, spatial audio, and reactive AI to build tension. A creature responds to player positioning and triggers, turning the maze into a chase.', built: ['Dynamic lighting and atmospheric audio', 'AI movement and trigger reactions', 'Chase mechanics and player feedback'], role: ['VR interaction mechanics', 'Character movement systems', 'AI behaviour implementation'], url: 'https://github.com/DakshKulkarni/Claustrophobia', link: 'Explore source on GitHub' },
    valak: { title: 'Valak', type: 'HORROR / WEB3', image: 'valak', description: 'A horror game where players collect hidden shards with limited visibility. Gameplay is connected to wallet onboarding, tokens, and NFT unlocks using Thirdweb and Solidity.', built: ['Collectible shards and a speed-based tension loop', 'Token and NFT unlock mechanics', 'MetaMask onboarding'], role: ['Gameplay systems and wallet integration', 'Thirdweb–Unity setup and UX', 'Scene setup'], url: 'https://devfolio.co/projects/valak-82b3', link: 'View Devfolio showcase' },
    thanos: { title: 'Thanos Simulator', type: 'UNITY 2D / PHYSICS', image: 'thanos', description: 'A 2D planetary game featuring custom per-planet gravity, rocket movement, and time bombs. A compact experiment in physics-driven gameplay and responsive controls.', built: ['Custom gravity for individual planets', 'Rocket controls and readable HUD', 'Per-planet time bombs'], role: ['Core physics and movement logic', 'Planet interaction systems', 'Game-over logic'], url: 'https://wombatty.itch.io/avenge-infinite-war', link: 'Play on itch.io' }
  };

  $('#year').textContent = new Date().getFullYear();
  function applyMotion() {
    document.documentElement.classList.toggle('motion-off', motionOff);
    $('.motion-toggle').setAttribute('aria-pressed', String(motionOff));
    $('.motion-toggle span').textContent = motionOff ? 'OFF' : 'ON';
    window.portfolioMotionOff = motionOff;
    window.dispatchEvent(new CustomEvent('portfolio:motion', { detail: { off: motionOff } }));
  }
  applyMotion();

  // Keep all content usable even when enhancement libraries are unavailable.
  const hasAnimation = !!(window.gsap && window.ScrollTrigger);
  if (hasAnimation) gsap.registerPlugin(ScrollTrigger);
  function initSmoothScroll() {
    lenis?.destroy(); lenis = null;
    if (!motionOff && window.Lenis && hasAnimation) {
      lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false });
      lenis.on('scroll', ScrollTrigger.update);
    }
  }
  if (hasAnimation) {
    gsap.ticker.add(time => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  initSmoothScroll();

  function initAnimations() {
    animationContext?.revert();
    window.portfolioSceneProgress = 0;
    if (!hasAnimation || motionOff) return;
    animationContext = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: '(min-width: 1001px) and (min-height: 680px)', mobile: '(max-width: 640px) and (min-height: 740px)' }, context => {
        const wrapper = $('.hero-scroll');
        const hero = $('.hero');
        const scene = $('#world-scene');
        const mobile = context.conditions.mobile;
        wrapper.classList.add('portal-journey');
        const sizeJourney = () => { wrapper.style.height = `${hero.offsetHeight + innerHeight * 1.35}px`; };
        sizeJourney();
        if (mobile) gsap.set(scene, { position: 'absolute', left: 0, right: 0, top: () => $('.hero-content').offsetTop + $('.hero-content').offsetHeight + 5, bottom: 75, height: 'auto', width: 'auto', marginLeft: 0 });
        const state = { progress: 0 };
        let crossed = false;
        let previous = 0;
        const sequence = gsap.timeline({ scrollTrigger: {
          trigger: wrapper, start: 'top top', end: () => `+=${innerHeight * 1.35}`, scrub: .55,
          invalidateOnRefresh: true, onRefreshInit: sizeJourney,
          onUpdate: self => {
            if (self.progress < .3) crossed = false;
            if (!crossed && !navigating && self.scroll() <= self.end + innerHeight * .5 && self.direction > 0 && previous < .94 && self.progress >= .94) {
              crossed = true;
              const destination = $('#projects').getBoundingClientRect().top + scrollY - 78;
              if (lenis) lenis.scrollTo(destination, { duration: .85 });
              else window.scrollTo({ top: destination, behavior: 'smooth' });
            }
            previous = self.progress;
          }
        } });
        sequence.to('.hero-content', { opacity: 0, y: -28, duration: .24, ease: 'power1.in' }, 0)
          .to('.hero-bottom', { opacity: 0, duration: .18 }, 0)
          .to(scene, { left: 0, right: 0, top: 78, bottom: 0, duration: .4, ease: 'power2.inOut' }, .05)
          .to(state, { progress: 1, duration: .72, ease: 'power2.in', onUpdate: () => { window.portfolioSceneProgress = state.progress; } }, .25);
        return () => { wrapper.classList.remove('portal-journey'); wrapper.style.height = ''; window.portfolioSceneProgress = 0; };
      });
      $$('.about-copy, .education > div, .skill-row, .experience-row, .research-card').forEach(el => {
        gsap.from(el, { y: 24, opacity: .65, duration: .85, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
      });
      gsap.fromTo('.portrait img', { scale: 1.16, yPercent: -5 }, { scale: 1, yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.portrait', start: 'top bottom', end: 'bottom top', scrub: 1 } });
      gsap.from('.contact h2', { y: 65, skewY: 3, opacity: .2, scrollTrigger: { trigger: '.contact', start: 'top 85%', end: 'top 30%', scrub: .7 } });
    });
  }
  function initGallery() {
    galleryContext?.revert(); galleryTween = null;
    $('.projects').classList.toggle('static-gallery', !hasAnimation || motionOff);
    if (!hasAnimation || motionOff) return;
    galleryContext = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1001px) and (min-height: 680px)', () => {
        const distance = () => Math.max(0, track.scrollWidth - innerWidth);
        const section = $('.projects');
        const stage = $('.gallery-stage');
        section.classList.add('scroll-gallery');
        const sizeStage = () => { section.style.height = `${stage.offsetHeight + distance()}px`; };
        sizeStage();
        galleryTween = gsap.to(track, { x: () => -distance(), ease: 'none', scrollTrigger: { id: 'gallery', trigger: section, start: 'top 78px', end: () => `+=${distance()}`, scrub: .7, invalidateOnRefresh: true, onRefreshInit: sizeStage, onUpdate: s => { $('.gallery-progress i').style.transform = `scaleX(${.02 + s.progress * .98})`; } } });
        return () => { section.classList.remove('scroll-gallery'); section.style.height = ''; };
      });
    });
  }
  initAnimations(); initGallery();
  document.fonts.ready.then(() => { if (hasAnimation) ScrollTrigger.refresh(); });
  window.addEventListener('load', () => { if (hasAnimation) ScrollTrigger.refresh(); });
  $('.motion-toggle').addEventListener('click', () => {
    motionOff = !motionOff;
    try { localStorage.setItem('daksh-motion', motionOff ? 'off' : 'on'); } catch {}
    applyMotion(); initSmoothScroll(); initAnimations(); initGallery();
    if (hasAnimation) ScrollTrigger.refresh();
  });
  preference.addEventListener('change', event => {
    motionOff = event.matches; applyMotion(); initSmoothScroll(); initAnimations(); initGallery();
    if (hasAnimation) ScrollTrigger.refresh();
  });

  $$('.filters button').forEach(button => button.addEventListener('click', () => {
    const pin = galleryTween?.scrollTrigger;
    if (pin?.isActive) { lenis?.scrollTo(pin.start, { immediate: true }); window.scrollTo(0, pin.start); }
    galleryContext?.revert();
    $$('.filters button').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
    const filter = button.dataset.filter;
    let count = 0;
    $$('.project-card').forEach(card => {
      card.hidden = filter !== 'all' && !card.dataset.category.split(' ').includes(filter);
      if (!card.hidden) count++;
    });
    $('#gallery-count').textContent = `${count} PROJECTS`;
    $('.gallery-progress i').style.transform = 'scaleX(.02)';
    initGallery(); if (hasAnimation) ScrollTrigger.refresh();
  }));

  // Keyboard focus follows the horizontally pinned card's scroll position.
  track.addEventListener('focusin', event => {
    const card = event.target.closest('.project-card');
    const pin = galleryTween?.scrollTrigger;
    if (!card || !pin) return;
    const fraction = Math.min(1, Math.max(0, (card.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft)) / Math.max(1, track.scrollWidth - innerWidth)));
    const destination = pin.start + fraction * (pin.end - pin.start);
    if (lenis) lenis.scrollTo(destination, { immediate: true });
    else window.scrollTo({ top: destination, behavior: 'instant' });
  });

  $$('[data-detail]').forEach(button => button.addEventListener('click', () => {
    const p = projects[button.dataset.detail];
    lastProjectTrigger = button;
    $('#dialog-content').innerHTML = `<img class="dialog-image" src="assets/${p.image}.jpg" alt="${p.title} project screenshot"><div class="dialog-body"><p class="eyebrow">${p.type}</p><h2 id="dialog-title">${p.title.toUpperCase()}</h2><p>${p.description}</p><div class="dialog-columns"><div><h3>WHAT I BUILT</h3><ul>${p.built.map(item => `<li>${item}</li>`).join('')}</ul></div><div><h3>${p.roleTitle || 'MY CONTRIBUTION'}</h3><ul>${p.role.map(item => `<li>${item}</li>`).join('')}</ul></div></div><a class="button primary" href="${p.url}" target="_blank" rel="noopener noreferrer">${p.link} <span>↗</span></a></div>`;
    dialog.showModal(); dialog.scrollTop = 0;
    lenis?.stop();
    document.body.style.overflow = 'hidden';
  }));
  $('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    lenis?.start(); lastProjectTrigger?.focus({ preventScroll: true });
  });

  const menu = $('#mobile-menu');
  const menuButton = $('.menu-button');
  const closeMenu = () => { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation'); };
  menuButton.addEventListener('click', () => {
    const open = menu.hidden; menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  $$('a[href^="#"]').forEach(link => link.addEventListener('click', e => {
    const target = $(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault(); closeMenu();
    const pin = hasAnimation ? ScrollTrigger.getAll().find(t => t.trigger === target && t.pin) : null;
    const destination = target.id === 'home' ? 0 : pin ? pin.start : target.getBoundingClientRect().top + scrollY - 75;
    if (lenis) { navigating = true; lenis.scrollTo(destination, { duration: 1.3, onComplete: () => { navigating = false; } }); }
    else window.scrollTo({ top: destination, behavior: motionOff ? 'instant' : 'smooth' });
    history.replaceState(null, '', link.getAttribute('href'));
    if (link.classList.contains('skip-link')) {
      $('.filters button').focus({ preventScroll: true });
    }
  }));
  $('.copy-email').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('dakshkulki04@gmail.com'); $('#copy-status').textContent = 'COPIED!'; }
    catch { $('#copy-status').textContent = 'Select the email above to copy.'; }
  });

  let queued = false;
  const updateScroll = () => {
    $('.nav').classList.toggle('scrolled', scrollY > 30);
    const progress = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
    $('.scroll-progress').style.transform = `scaleX(${progress})`;
    if (scrollY < $('.hero').offsetHeight - 100) $$('.nav nav a').forEach(link => link.classList.remove('active'));
    queued = false;
  };
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(updateScroll); } }, { passive: true });
  updateScroll();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $$('.nav nav a').forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-15% 0px -65% 0px' });
  $$('#projects, #about, #experience, #contact').forEach(section => observer.observe(section));
})();
