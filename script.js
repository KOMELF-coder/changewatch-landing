'use strict';

// The only form configuration location. These values are public, never add secrets.
const CONTACT_CONFIG = Object.freeze({
  CONTACT_EMAIL: 'YOUR_CONTACT_EMAIL',
  FORM_ENDPOINT: '', // HTTPS endpoint accepting JSON; see README.md for the response contract.
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
  submit.disabled = false;
  const fallback = document.querySelector('#email-fallback');
  const emailLink = document.querySelector('#email-link');
  const requestCopy = document.querySelector('#request-copy');
  const selectedPlan = document.querySelector('#selected-plan');
  const emailConfigured = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(CONTACT_CONFIG.CONTACT_EMAIL);
  const setStatus = (message, state = 'info') => {
    status.textContent = message;
    status.dataset.state = state;
  };
  if (!CONTACT_CONFIG.FORM_ENDPOINT && !emailConfigured) {
    setStatus('Les demandes en ligne ne sont pas encore ouvertes. Vous pouvez préparer votre demande ici, mais aucun envoi ne sera effectué.');
  } else if (!CONTACT_CONFIG.FORM_ENDPOINT) {
    setStatus('Ce formulaire prépare un email à envoyer depuis votre messagerie. Votre essai sera confirmé après la configuration des pages.');
  }
  document.querySelectorAll('[data-plan]').forEach((link) => {
    link.addEventListener('click', () => {
      form.elements.plan.value = link.dataset.plan;
      selectedPlan.textContent = `Forfait envisagé : ${link.dataset.plan}. L’essai reste gratuit pendant 7 jours sur 3 URLs.`;
      selectedPlan.hidden = false;
    });
  });
  const urls = ['url1', 'url2', 'url3'].map((name) => form.elements[name]);
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
  function prepareEmail(data, prefix = '') {
    const body = [
      'Bonjour, je souhaite essayer ChangeWatch gratuitement pendant 7 jours sur 3 URLs.',
      '', `Contact : ${data.name}`, `Entreprise : ${data.company}`, `Email : ${data.email}`,
      `Forfait envisagé : ${data.plan}`, '', 'Pages concurrentes :', data.url1, data.url2, data.url3,
      '', `Message : ${data.message || 'Non renseigné'}`,
    ].join('\n');
    fallback.hidden = false;
    emailLink.hidden = !emailConfigured;
    requestCopy.value = `${emailConfigured ? `Destinataire : ${CONTACT_CONFIG.CONTACT_EMAIL}\n` : ''}Objet : Demande d’essai ChangeWatch — 7 jours\n\n${body}`;
    if (emailConfigured) {
      emailLink.href = `mailto:${CONTACT_CONFIG.CONTACT_EMAIL}?subject=${encodeURIComponent('Demande d’essai ChangeWatch — 7 jours')}&body=${encodeURIComponent(body)}`;
      setStatus(`${prefix}Votre demande est prête. Ouvrez votre messagerie ci-dessous, puis envoyez l’email. ${prefix ? 'Vérifiez votre messagerie avant de réessayer pour éviter une demande en double.' : 'Aucun message n’a encore été envoyé.'}`, prefix ? 'error' : 'info');
    } else {
      emailLink.removeAttribute('href');
      setStatus(`${prefix}L’envoi par email est indisponible pour le moment. ${prefix ? 'Vérifiez votre messagerie avant de réessayer.' : 'Aucun message n’a été envoyé.'} Vous pouvez conserver une copie de votre demande ci-dessous.`, 'error');
    }
  }
  form.addEventListener('input', () => {
    if (!fallback.hidden) {
      fallback.hidden = true;
      emailLink.removeAttribute('href');
      requestCopy.value = '';
      setStatus('Votre demande a été modifiée. Cliquez à nouveau sur « Activer mon essai gratuit » pour la préparer.');
    }
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    urls.forEach(validateUrl);
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    Object.keys(data).forEach((key) => { data[key] = data[key].trim(); });
    if (!CONTACT_CONFIG.FORM_ENDPOINT) {
      prepareEmail(data);
      return;
    }
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    fallback.hidden = true;
    setStatus('Envoi de votre demande en cours…');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const endpoint = new URL(CONTACT_CONFIG.FORM_ENDPOINT);
      if (endpoint.protocol !== 'https:') throw new Error('An HTTPS endpoint is required');
      const response = await fetch(endpoint.href, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data), signal: controller.signal, credentials: 'omit',
      });
      if (!response.ok) throw new Error('Request rejected');
      const result = await response.json();
      if (result.success !== true) throw new Error('No explicit confirmation');
      setStatus('Votre demande a bien été reçue. La compatibilité des pages et le démarrage de votre essai vous seront confirmés par email.', 'success');
      form.reset();
      selectedPlan.hidden = true;
    } catch {
      prepareEmail(data, 'La réception de votre demande n’a pas pu être confirmée. ');
    } finally {
      clearTimeout(timeout);
      submit.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
}
