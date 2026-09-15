'use strict';

// The only form configuration location. These values are public, never add secrets.
const CONTACT_CONFIG = Object.freeze({
  CONTACT_EMAIL: 'changewatch@cybersignal.fr',
  FORM_ENDPOINT: 'https://formspree.io/f/mbgjnvjq',
});

document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menu?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('is-open');
}
menu?.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  navigation.classList.toggle('is-open', expanded);
});
navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);
const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const form = document.querySelector('#demande');
if (form) {
  const status = document.querySelector('#form-status');
  const submit = form.querySelector('[type="submit"]');
  const originalButton = submit.innerHTML;
  let sending = false;
  submit.disabled = false;
  document.querySelectorAll('a[href="#demande"]').forEach((link) => {
    link.addEventListener('click', () => {
      form.focus({ preventScroll: true });
    });
  });
  const urls = [1, 2, 3].map((i) => form.elements['competitor_url_' + i]);
  function validateUrl(input) {
    input.setCustomValidity('');
    if (!input.value) return;
    try {
      const url = new URL(input.value);
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('invalid');
    } catch {
      input.setCustomValidity('Indiquez une URL publique complète en https:// ou http://, sans identifiant ni mot de passe.');
    }
  }
  urls.forEach((input) => input.addEventListener('input', () => validateUrl(input)));
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    urls.forEach(validateUrl);
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    Object.keys(data).forEach((key) => { data[key] = data[key].trim(); });
    sending = true;
    submit.disabled = true;
    submit.textContent = 'Envoi en cours…';
    form.setAttribute('aria-busy', 'true');
    status.dataset.state = 'info';
    status.textContent = 'Envoi de votre demande en cours…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(CONTACT_CONFIG.FORM_ENDPOINT, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data), signal: controller.signal, credentials: 'omit',
      });
      // Formspree confirms acceptance with an HTTP 2xx response to an AJAX request.
      if (!response.ok) throw new Error('Formspree rejected the request');
      status.dataset.state = 'success';
      status.textContent = 'Votre demande a bien été reçue. Nous vous recontactons rapidement pour finaliser la configuration de ChangeWatch.';
      form.reset();
    } catch {
      status.dataset.state = 'error';
      status.textContent = 'Impossible d’envoyer votre demande pour le moment. Vous pouvez nous écrire directement à ' + CONTACT_CONFIG.CONTACT_EMAIL + '.';
    } finally {
      clearTimeout(timeout);
      sending = false;
      submit.disabled = false;
      submit.innerHTML = originalButton;
      form.removeAttribute('aria-busy');
    }
  });
}
