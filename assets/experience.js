/* Progressive enhancement only: all content is visible without JavaScript. */
'use strict';
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!motion.matches) entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach(section => observer.observe(section));
  }
  const play = document.querySelector('#demo-play');
  if (!play) return;
  const steps = [...document.querySelectorAll('[data-demo-step]')];
  const status = document.querySelector('#demo-status');
  const messages = ['1 sur 4 : une page compatible est suivie à 99 €.', '2 sur 4 : la boutique affiche maintenant 79 €.', '3 sur 4 : une vérification planifiée repère la baisse de 20 €.', '4 sur 4 : une alerte email présente la variation et sa source.'];
  let timer;
  let running = false;
  function stop() {
    clearTimeout(timer);
    running = false;
    play.textContent = 'Rejouer la démonstration ↻';
  }
  function show(index) {
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    status.textContent = messages[index];
    if (index === steps.length - 1) stop();
    else timer = setTimeout(() => show(index + 1), 1400);
  }
  play.hidden = false;
  play.addEventListener('click', () => {
    if (running) { stop(); status.textContent = 'Démonstration interrompue. Les quatre étapes restent consultables.'; return; }
    if (motion.matches) { show(steps.length - 1); return; }
    running = true;
    play.textContent = 'Arrêter la démonstration ■';
    show(0);
  });
  motion.addEventListener('change', () => { if (motion.matches && running) { stop(); show(steps.length - 1); } });
  document.addEventListener('visibilitychange', () => { if (document.hidden && running) stop(); });
})();
