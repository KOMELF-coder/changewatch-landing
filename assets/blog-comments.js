(() => {
  'use strict';
  // Public project credentials only. Authorization is enforced by SQL grants, RLS and RPCs.
  const API = 'https://isobceqeaiwsxndqxqas.supabase.co/rest/v1/rpc/';
  const KEY = 'sb_publishable_L3nGfR6XoeU1NSA1pabmpw_22N3lkZl';
  const PAGE_SIZE = 50;
  const copy = {
    fr: {
      loading: 'Chargement des commentaires…', empty: 'Aucun commentaire pour le moment. Soyez le premier à participer.',
      loadError: 'Les commentaires sont momentanément indisponibles. Vous pouvez réessayer.', retry: 'Réessayer', more: 'Afficher les commentaires suivants',
      name: 'Nom', email: 'Email', comment: 'Commentaire', send: 'Envoyer mon commentaire', sending: 'Envoi en cours…',
      emailNote: 'Votre adresse email ne sera jamais publiée.', moderation: 'Les commentaires sont modérés avant publication.',
      purpose: 'Votre email sert uniquement à la modération ou à un suivi lié à votre commentaire.', privacy: 'Politique de confidentialité',
      success: 'Merci ! Votre commentaire a bien été envoyé et sera publié après modération.',
      error: 'Nous ne pouvons pas confirmer la réception de votre commentaire. Votre texte est conservé. Veuillez réessayer plus tard.',
      wait: 'Veuillez patienter quelques secondes avant d’envoyer votre commentaire.',
      invalidName: 'Indiquez un nom de 2 à 80 caractères.', invalidEmail: 'Indiquez une adresse email valide (254 caractères maximum).',
      invalidComment: 'Écrivez un commentaire de 3 à 3 000 caractères.', loaded: 'Commentaires chargés.',
      website: 'Laissez ce champ vide.', ready: 'Vous pouvez laisser un commentaire.', formTitle: 'Laisser un commentaire'
    },
    en: {
      loading: 'Loading comments…', empty: 'No comments yet. Be the first to join the discussion.',
      loadError: 'Comments are temporarily unavailable. Please try again.', retry: 'Try again', more: 'Load more comments',
      name: 'Name', email: 'Email', comment: 'Comment', send: 'Submit my comment', sending: 'Submitting…',
      emailNote: 'Your email address will never be published.', moderation: 'Comments are reviewed before publication.',
      purpose: 'Your email is used only for moderation or follow-up related to your comment.', privacy: 'Privacy policy',
      success: 'Thanks! Your comment has been submitted and will appear after moderation.',
      error: 'We cannot confirm receipt of your comment. Your text has been kept. Please try again later.',
      wait: 'Please wait a few seconds before submitting your comment.',
      invalidName: 'Enter a name between 2 and 80 characters.', invalidEmail: 'Enter a valid email address (254 characters maximum).',
      invalidComment: 'Write a comment between 3 and 3,000 characters.', loaded: 'Comments loaded.',
      website: 'Leave this field empty.', ready: 'You can leave a comment.', formTitle: 'Leave a comment'
    }
  };
  const el = (tag, text, attrs = {}) => {
    const node = document.createElement(tag);
    if (text !== null) node.textContent = text;
    for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
    return node;
  };
  const length = value => Array.from(value).length;
  async function rpc(method, params, suffix = '') {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(API + method + suffix, {
        method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify(params), credentials: 'omit', referrerPolicy: 'no-referrer',
        cache: 'no-store', signal: controller.signal
      });
      if (!response.ok) throw new Error('Comments unavailable');
      // Never log or display a backend error body (which could contain private data).
      return method === 'get_approved_comments' ? await response.json() : null;
    } finally { clearTimeout(timer); }
  }
  // Extension point for a future server-verified challenge. Not a security boundary.
  async function prepareSubmission(form, startedAt) {
    if (form.elements.website.value.trim()) throw new Error('spam');
    if (performance.now() - startedAt < 2000) throw new Error('early');
    return { p_website: form.elements.website.value };
  }
  function mount(section) {
    if (section.dataset.commentsMounted) return;
    section.dataset.commentsMounted = 'true';
    const slug = section.dataset.articleSlug;
    const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
    const t = copy[lang];
    if (!slug || slug.length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return;
    const prefix = 'comments-' + slug;
    const status = el('p', t.loading, { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true', class: 'comments-status' });
    const list = el('ol', null, { class: 'comments-list', 'aria-label': lang === 'en' ? 'Published comments' : 'Commentaires publiés' });
    const more = el('button', t.more, { type: 'button', class: 'button button-outline', hidden: '' });
    const retry = el('button', t.retry, { type: 'button', class: 'button button-outline', hidden: '' });
    const form = el('form', null, { class: 'comments-form', novalidate: '', 'aria-labelledby': prefix + '-form-title' });
    form.append(el('h3', t.formTitle, { id: prefix + '-form-title' }));
    const fields = {};
    for (const [name, min, max] of [['name', 2, 80], ['email', 3, 254], ['comment', 3, 3000]]) {
      const box = el('div', null, { class: 'comments-field' });
      const id = prefix + '-' + name;
      const input = el(name === 'comment' ? 'textarea' : 'input', null, {
        id, name, required: '', minlength: String(min), maxlength: String(max),
        'aria-describedby': id + '-error' + (name === 'email' ? ' ' + id + '-note' : '')
      });
      if (name !== 'comment') { input.type = name === 'email' ? 'email' : 'text'; input.autocomplete = name; }
      else input.rows = 6;
      const error = el('p', '', { id: id + '-error', class: 'comments-field-error' });
      box.append(el('label', t[name], { for: id }), input);
      if (name === 'email') box.append(el('p', t.emailNote, { id: id + '-note', class: 'comments-note' }));
      box.append(error); form.append(box); fields[name] = { input, error };
      input.addEventListener('input', () => { input.removeAttribute('aria-invalid'); error.textContent = ''; });
    }
    const trap = el('div', null, { hidden: '', 'aria-hidden': 'true' });
    trap.append(el('label', t.website, { for: prefix + '-website' }), el('input', null, {
      id: prefix + '-website', name: 'website', type: 'text', tabindex: '-1', autocomplete: 'off', maxlength: '200'
    }));
    const submit = el('button', t.send, { type: 'submit', class: 'button', disabled: '' });
    const feedback = el('p', '', { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true', tabindex: '-1', class: 'comments-feedback' });
    const privacy = el('p', t.purpose + ' ', { class: 'comments-note' });
    privacy.append(el('a', t.privacy, { href: lang === 'en' ? '/en/privacy.html' : '/confidentialite.html' }));
    form.append(trap, submit, feedback, el('p', t.moderation, { class: 'comments-note' }), privacy);
    let ready = false, sending = false, loading = false, offset = 0;
    let startedAt = performance.now();
    const seen = new Set();
    const dateFormat = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'fr-FR', { dateStyle: 'long', timeZone: 'UTC' });
    async function load() {
      if (loading) return;
      loading = true; more.disabled = true; retry.hidden = true;
      status.textContent = t.loading;
      try {
        // Only the safe RPC; no direct table access and no private column selection.
        const rows = await rpc('get_approved_comments', { p_article_slug: slug }, `?offset=${offset}&limit=${PAGE_SIZE + 1}`);
        if (!Array.isArray(rows)) throw new Error('Invalid response');
        for (const row of rows.slice(0, PAGE_SIZE)) {
          if (!row || row.article_slug !== slug || typeof row.name !== 'string' || typeof row.comment !== 'string'
              || length(row.name) > 80 || length(row.comment) > 3000 || !Number.isFinite(Date.parse(row.created_at))) continue;
          const id = String(row.id);
          if (seen.has(id)) continue;
          seen.add(id);
          const item = el('li', null, { class: 'comments-item' });
          const date = new Date(row.created_at);
          item.append(el('p', row.name, { class: 'comments-author' }),
            el('time', dateFormat.format(date), { datetime: date.toISOString() }),
            el('p', row.comment, { class: 'comments-text' }));
          list.append(item); // Plain text only, even when a message looks like HTML or Markdown.
        }
        offset += Math.min(PAGE_SIZE, rows.length);
        more.hidden = rows.length <= PAGE_SIZE;
        status.textContent = seen.size ? t.loaded : t.empty;
        ready = true;
      } catch {
        status.textContent = t.loadError;
        retry.hidden = false;
      } finally {
        loading = false; more.disabled = false; submit.disabled = !ready || sending;
      }
    }
    more.addEventListener('click', load); retry.addEventListener('click', load);
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (sending || !ready) return;
      const values = {
        name: fields.name.input.value.trim().replace(/\s+/gu, ' '),
        email: fields.email.input.value.trim(), comment: fields.comment.input.value.trim()
      };
      let invalid = null;
      for (const name of ['name', 'email', 'comment']) {
        const value = values[name];
        const valid = name === 'name' ? length(value) >= 2 && length(value) <= 80
          : name === 'email' ? length(value) <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value)
          : length(value) >= 3 && length(value) <= 3000;
        const field = fields[name];
        field.error.textContent = valid ? '' : t['invalid' + name[0].toUpperCase() + name.slice(1)];
        field.input.setAttribute('aria-invalid', String(!valid));
        if (!valid && !invalid) invalid = field.input;
      }
      if (invalid) { invalid.focus(); return; }
      sending = true; submit.disabled = true; submit.textContent = t.sending; form.setAttribute('aria-busy', 'true');
      feedback.textContent = '';
      try {
        const protection = await prepareSubmission(form, startedAt);
        await rpc('submit_blog_comment', { p_article_slug: slug, p_name: values.name, p_email: values.email, p_comment: values.comment, ...protection });
        form.reset(); startedAt = performance.now(); feedback.textContent = t.success;
        // Pending comments are never appended to the public list.
      } catch (error) {
        feedback.textContent = error.message === 'early' ? t.wait : t.error;
      } finally {
        sending = false; submit.disabled = !ready; submit.textContent = t.send; form.removeAttribute('aria-busy'); feedback.focus();
      }
    });
    section.append(status, list, more, retry, form);
    // Build the form below the fold immediately; defer only the external request.
    // This avoids inserting a whole form when the reader reaches the article footer.
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); load(); }
      }, { rootMargin: '200px' });
      observer.observe(section);
    } else load();
  }
  for (const section of document.querySelectorAll('[data-comments]')) mount(section);
})();
