/* Illustrative frontend story only. No monitoring, checkout or contact requests. */
'use strict';
(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.hero-system');
  const bench = document.querySelector('#story-workbench');
  if (!hero || !bench) return;
  const play = document.querySelector('#demo-play');
  const stops = [...bench.querySelectorAll('[data-step]')];
  const panels = [...bench.querySelector('.result-stage').children];
  const price = document.querySelector('#scene-price');
  const status = document.querySelector('#demo-status');
  const captions = [
    'Une page compatible, un prix de référence. Vous définissez le périmètre ; ChangeWatch prend en charge les vérifications.',
    'Le prix passe de 99 € à 79 €. La prochaine vérification planifiée permettra de repérer ce changement.',
    'La variation est détectée et confirmée : −20 €, soit environ −20,2 %. La source accompagne le signal.',
    'L’alerte réunit le changement, son contexte et la source. Vous décidez de la suite.',
  ];
  let phase = 3;
  let timer;
  let running = false;
  let started = false;
  let heroTimers = [];
  const delays = [1600, 1900, 2200];
  function finishHero() {
    heroTimers.forEach(clearTimeout);
    heroTimers = [];
    hero.dataset.heroPhase = '3';
  }
  function show(next) {
    phase = next;
    bench.dataset.phase = String(next);
    stops.forEach((button, i) => button.setAttribute('aria-pressed', String(i === next)));
    panels.forEach((panel, i) => { panel.hidden = i !== next; });
    price.textContent = next === 0 ? '99 €' : '79 €';
    bench.querySelector('.scene-result .scene-panel-label > span').textContent = [
      'LA VEILLE EST CONFIGURÉE', 'LA PAGE A CHANGÉ', 'CHANGEWATCH COMPARE', 'CE QUE VOUS RECEVEZ',
    ][next];
    bench.querySelector('.result-channel').textContent = ['RÉFÉRENCE', 'EN ATTENTE', 'COMPARAISON', 'PAR EMAIL'][next];
    bench.querySelector('.observation-label').textContent = next === 0 ? 'Observation initiale' : next === 1 ? 'Page modifiée' : 'Vérification suivante';
    bench.querySelector('.caption-index').textContent = '0' + (next + 1) + ' / 04';
    status.textContent = captions[next];
  }
  function pause() {
    clearTimeout(timer);
    running = false;
    bench.classList.remove('is-playing');
    play.textContent = motion.matches ? 'Voir le résultat ↗' : phase === 3 ? 'Rejouer la scène ↻' : 'Reprendre la scène ▶';
  }
  function schedule() {
    if (phase === 3) { pause(); return; }
    timer = setTimeout(() => { show(phase + 1); schedule(); }, delays[phase]);
  }
  function start(userInitiated = false) {
    started = true;
    status.setAttribute('aria-live', userInitiated ? 'polite' : 'off');
    if (motion.matches) { show(3); pause(); return; }
    if (phase === 3) show(0);
    running = true;
    bench.classList.add('is-playing', 'is-animated');
    play.textContent = 'Mettre en pause Ⅱ';
    schedule();
  }
  stops.forEach((button, i) => {
    button.disabled = false;
    button.addEventListener('click', () => {
      started = true;
      pause();
      status.setAttribute('aria-live', 'polite');
      show(i);
      pause();
    });
    button.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (i + 1) % stops.length;
      if (event.key === 'ArrowLeft') target = (i + stops.length - 1) % stops.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = stops.length - 1;
      if (target !== undefined) { event.preventDefault(); stops[target].focus(); stops[target].click(); }
    });
  });
  play.hidden = false;
  if (motion.matches) play.textContent = 'Voir le résultat ↗';
  play.addEventListener('click', () => { if (running) pause(); else start(true); });
  // Stop progression when keyboard users explore a step or the email source.
  bench.addEventListener('focusin', event => {
    if (running && event.target !== play) pause();
  });
  if (!motion.matches) {
    document.body.classList.add('has-story-motion');
    hero.dataset.heroPhase = '0';
    [900, 1900, 3400].forEach((delay, i) => heroTimers.push(setTimeout(() => {
      hero.dataset.heroPhase = String(i + 1);
    }, delay)));
    show(0);
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting && !started && !motion.matches && !document.hidden) start();
        else if (!entry.isIntersecting && running) pause();
      }
    }, { threshold: 0.12 });
    observer.observe(bench.querySelector('.story-scene'));
  }
  motion.addEventListener('change', () => {
    if (motion.matches) {
      finishHero();
      pause();
      show(3);
      pause();
      document.body.classList.remove('has-story-motion');
      bench.classList.remove('is-animated');
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { finishHero(); if (running) pause(); }
  });
})();
