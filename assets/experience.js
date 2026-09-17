/* Illustrative frontend story only. No monitoring, checkout or contact requests. */
'use strict';
(() => {
  const text = (fr, en) => document.documentElement.lang === 'en' ? en : fr;
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
    text("Une page compatible, un prix de référence. Vous définissez le périmètre ; ChangeWatch prend en charge les vérifications.", "A compatible page and a reference price. You define the scope; ChangeWatch handles the checks."),
    text("Le prix passe de 99 € à 79 €. La prochaine vérification planifiée permettra de repérer ce changement.", "The price drops from €99 to €79. The next scheduled check will detect the change."),
    text("La variation est détectée et confirmée : −20 €, soit environ −20,2 %. La source accompagne le signal.", "The change is detected and confirmed: −€20, or approximately −20.2%. The source is included."),
    text("L’alerte réunit le changement, son contexte et la source. Vous décidez de la suite.", "The alert brings together the change, its context and the source. You decide what happens next."),
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
    price.textContent = next === 0 ? text("99 €", "€99") : text("79 €", "€79");
    bench.querySelector('.scene-result .scene-panel-label > span').textContent = [
      text("LA VEILLE EST CONFIGURÉE", "MONITORING IS SET UP"), text("LA PAGE A CHANGÉ", "THE PAGE HAS CHANGED"), text("CHANGEWATCH COMPARE", "CHANGEWATCH COMPARES"), text("CE QUE VOUS RECEVEZ", "WHAT YOU RECEIVE"),
    ][next];
    bench.querySelector('.result-channel').textContent = [text("RÉFÉRENCE", "BASELINE"), text("EN ATTENTE", "PENDING"), text("COMPARAISON", "COMPARISON"), text("PAR EMAIL", "BY EMAIL")][next];
    bench.querySelector('.observation-label').textContent = next === 0 ? text("Observation initiale", "Initial observation") : next === 1 ? text("Page modifiée", "Updated page") : text("Vérification suivante", "Next check");
    bench.querySelector('.caption-index').textContent = '0' + (next + 1) + ' / 04';
    status.textContent = captions[next];
  }
  function pause() {
    clearTimeout(timer);
    running = false;
    bench.classList.remove('is-playing');
    play.textContent = motion.matches ? text("Voir le résultat ↗", "See the result ↗") : phase === 3 ? text("Rejouer la scène ↻", "Replay the scene ↻") : text("Reprendre la scène ▶", "Resume the scene ▶");
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
    play.textContent = text("Mettre en pause Ⅱ", "Pause Ⅱ");
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
  if (motion.matches) play.textContent = text("Voir le résultat ↗", "See the result ↗");
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
