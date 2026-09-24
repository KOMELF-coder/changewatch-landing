# Commentaires modérés du blog — déploiement bloqué jusqu'à validation SQL

## Statut

Cette PR part de `main` **1aaf5b6**, qui contient les six articles publiés et les dernières corrections de tableaux. Elle reste **en brouillon**. Aucune migration, lecture de données privées ou écriture de commentaire n'a été réalisée sur Supabase. Le SQL est testé dans PostgreSQL local via PGlite, et l'API est simulée dans le navigateur.

**Ne pas fusionner ni déployer avant l'application et la validation du SQL par le propriétaire.** Le problème d'accès potentiel à l'email dans la table actuelle n'est pas corrigé par ce commit frontend : la migration doit réellement être exécutée.

## Architecture

```text
Article + slug défini dans son HTML
  ├─ fetch RPC get_approved_comments → colonnes publiques de cet article seulement
  └─ fetch RPC submit_blog_comment → validation SQL → insertion pending
                                          ↓
                          Table Editor : approved / rejected
```

- `assets/blog-comments.js` : composant natif partagé FR/EN, sans SDK ou bibliothèque tierce. Le formulaire est construit hors écran à l'initialisation ; le chargement réseau attend la proximité de la section via IntersectionObserver. Repli sans cet API : chargement immédiat, toujours non bloquant.
- `assets/blog-comments.css` : styles isolés sous `.blog-comments`, sans changement des styles éditoriaux existants.
- Six articles : deux références de ressources et une section après `</article>`, avant `</main>`/footer. Aucun changement du corps éditorial, title, meta description, H1, canonical, JSON-LD, URL ou sitemap.
- `supabase/migrations/20260924170000_blog_comments.sql` : migration transactionnelle à exécuter manuellement.
- `supabase/verify_blog_comments.sql` : vérification SQL en lecture seule.
- `supabase/disable_blog_comments.sql` : arrêt des RPC publiques sans réexposer la table.
- `tests/blog-comments.cjs` : navigateur, API intégralement simulée.
- `tests/blog-comments-sql.cjs` : PostgreSQL local éphémère, permissions/RLS/validation réelles dans cette base de test.

Projet public : **https://isobceqeaiwsxndqxqas.supabase.co**. Publishable key : `sb_publishable_L3nGfR6XoeU1NSA1pabmpw_22N3lkZl`.

La clé publishable identifie l'application et est conçue pour le navigateur. Elle ne confère pas de droit administrateur : les privilèges SQL et les RPC délimitent les opérations possibles. Les appels utilisent `apikey` et `Content-Type: application/json`, sans transformer cette clé non-JWT en Bearer token. `credentials: omit`, `referrerPolicy: no-referrer`, absence de logs de formulaire et de stockage local des champs.

**Aucune clé secrète/service, aucun mot de passe ni chaîne PostgreSQL privée n'est nécessaire dans ce dépôt.** Ne pas en ajouter pour contourner un problème de permission. Voir la documentation officielle [clés API Supabase](https://supabase.com/docs/guides/getting-started/api-keys).

## Table et confidentialité

Table existante `public.comments` : `id bigint identity`, `article_slug text`, `name text`, `email text`, `comment text`, `status text default 'pending'`, `created_at timestamptz default now()`. La migration conserve les lignes existantes ; elle refuse les statuts NULL ou inconnus sans les convertir automatiquement.

RLS protège les lignes, pas les colonnes. La migration retire donc **tous les privilèges directs de table** à PUBLIC, anon et authenticated, y compris les droits colonne associés, et retire les accès à la séquence d'identité. Elle vérifie qu'aucun droit hérité ne laisse encore une lecture ou écriture directe. En cas d'échec, la transaction s'annule : résoudre les droits avec le propriétaire, ne pas ignorer l'erreur.

Les anciennes policies publiques peuvent rester définies ; elles ne redonnent aucun privilège de table. Deux policies supplémentaires s'appliquent au rôle dédié : lecture des lignes approuvées, insertion de lignes pending. Les RPC ajoutent leurs propres prédicats explicites. La table et ses données restent accessibles au propriétaire dans Table Editor.

### Rôle des fonctions

`cw_comments_rpc` est NOLOGIN, NOINHERIT, sans superutilisateur, création de rôles/base, réplication ou contournement RLS. Il ne possède pas la table. Il reçoit uniquement :

- USAGE du schéma et de la séquence ;
- SELECT de `id, article_slug, name, comment, status, created_at` (**pas email**) ;
- INSERT de `article_slug, name, email, comment, status` ;
- propriété des deux RPC.

Le propriétaire qui installe le SQL est membre administratif de ce rôle afin de pouvoir transférer la propriété des fonctions même sans superutilisateur. Aucun rôle API ne doit être membre. CREATE sur le schéma est temporairement accordé au rôle pour ce transfert, puis révoqué. Une configuration préexistante de rôle ou une surcharge RPC inattendue provoque un arrêt pour revue.

Les fonctions sont SECURITY DEFINER avec `search_path = ''`, des relations qualifiées, aucun SQL dynamique et aucune valeur de status contrôlée par le navigateur. Seul **anon** reçoit EXECUTE ; authenticated n'est pas nécessaire car le composant ne crée ni compte ni session. PUBLIC n'a pas EXECUTE. Voir [fonctions Supabase](https://supabase.com/docs/guides/database/functions) et [privilèges PostgreSQL](https://www.postgresql.org/docs/current/sql-revoke.html).

### Lecture

`get_approved_comments(p_article_slug text)` renvoie seulement `id, article_slug, name, comment, created_at`, filtre article + `approved`, trie par date puis id. Le client demande 51 résultats, affiche 50 et propose « suivants » ; il conserve l'offset et déduplique les id. Recharger la page reflète les nouvelles décisions de modération, notamment une ancienne ligne nouvellement approuvée. Pas de synchronisation temps réel.

Seuls le nom, la date UTC localisée et le commentaire sont rendus. Pas d'identifiant visible, pas de status, pas d'email. Les réponses sont traitées comme non fiables : projection d'affichage explicite, vérification du slug et `textContent`. Un texte ressemblant à du HTML, du Markdown ou une URL reste du texte, sans lien actif. Le modérateur doit aussi retirer les données personnelles que l'auteur aurait volontairement écrites dans le **texte public** ; la confidentialité du champ email ne nettoie pas ce texte.

### Insertion

`submit_blog_comment(p_article_slug, p_name, p_email, p_comment, p_website default null)` renvoie void. Slug ASCII minuscule/tirets, maximum 120 caractères ; nom normalisé de 2 à 80 ; email trimé, maximum 254 et syntaxe simple ; commentaire trimé de 3 à 3000 caractères avec retours à la ligne conservés. Limites brutes avant normalisation. Honeypot non vide : erreur générique. La fonction force pending et ne renvoie jamais l'enregistrement.

Les champs ont labels, maxlength, erreurs liées par aria-describedby, focus visible, statut aria-live. Bouton verrouillé pendant l'envoi, champs conservés en erreur, reset uniquement après succès HTTP. Timeout 15 secondes, aucune relance automatique : après une coupure, une insertion peut avoir réussi sans réponse reçue ; le texte est conservé et le message n'affirme pas un échec certain. Un renvoi manuel peut produire un doublon à traiter en modération. Un commentaire pending n'est jamais ajouté à la liste publique.

Une RPC de lecture absente/en erreur désactive initialement le bouton d'envoi, avec message et bouton réessayer. Ce repli ne remplace **pas** la validation SQL préalable au déploiement.

## Antispam V1

Champ website dans un conteneur hidden/aria-hidden, non focalisable, sans gêne au lecteur d'écran. Vérifié à la fois côté client et SQL. Délai client de deux secondes après initialisation ou dernier succès, contournable volontairement : ce n'est pas une limitation de débit serveur.

**Honeypot + modération ne constituent pas une protection antispam complète.** Les RPC publiques peuvent être appelées directement et remplir pending. Surveiller les volumes/coûts, traiter les doublons et utiliser le script d'arrêt en cas d'abus. Pas de collecte d'adresse IP ajoutée. `prepareSubmission()` isole la préparation antispam pour un futur challenge Turnstile ; il faudra alors un jeton vérifié côté serveur et une mise à jour RPC. Ne jamais ajouter une clé secrète Turnstile au navigateur. Le Turnstile du formulaire commercial est inchangé et distinct.

## Procédure propriétaire — exactement quoi exécuter

1. Dans le projet Supabase `isobceqeaiwsxndqxqas`, ouvrir **SQL Editor → New query**, avec le rôle propriétaire habituel (postgres). Il doit posséder la table, avoir CREATEROLE et pouvoir accorder USAGE/CREATE sur le schéma public. Ne fournir aucun identifiant privé à Codex.
2. Lire puis copier **tout** [20260924170000_blog_comments.sql](../../supabase/migrations/20260924170000_blog_comments.sql), de `begin;` à `commit;`, et l'exécuter. En cas de statuts inconnus, droits hérités, rôle incompatible, surcharge ou droit insuffisant : ne pas continuer ; faire examiner les éléments indiqués. La migration ne modifie pas les données pour « faire passer » la validation. Après une erreur laissant la transaction ouverte, exécuter `ROLLBACK;` dans SQL Editor avant toute nouvelle tentative.
3. Copier et exécuter **tout** [verify_blog_comments.sql](../../supabase/verify_blog_comments.sql). Attendu : aucune exception, résultat de lecture limité aux cinq colonnes publiques, résultat d'insertion void, SECURITY DEFINER et search_path fixé. Ce script ne lit aucun email ni commentaire et n'insère rien.
4. Vérifier dans les permissions et éventuelles vues/autres RPC déjà présentes qu'aucun autre objet préexistant n'expose l'email. Cette migration sécurise la table et ces deux fonctions ; elle ne certifie pas tous les objets du projet que nous n'avons pas inspectés.
5. Vérifier la Data API avec la clé **publique** : une lecture directe de table doit être refusée (401/403 permission denied). La lecture RPC doit répondre 200 avec un tableau ; seuls les commentaires approved du slug demandé peuvent y apparaître. Ne pas créer de faux commentaire de production. Tests d'insertion et de modération à réaliser dans un environnement de test, ou attendre une vraie contribution autorisée après lancement.
6. Confirmer les résultats au propriétaire de la PR, finaliser les mentions de confidentialité ci-dessous, puis demander une validation de publication. Tant que ces étapes ne sont pas validées, **garder la PR en brouillon**.

Exemple de contrôle RPC sans sélectionner de données personnelles (console de navigateur locale ; clé publique seulement) :

```js
fetch('https://isobceqeaiwsxndqxqas.supabase.co/rest/v1/rpc/get_approved_comments?limit=0', {
  method: 'POST',
  headers: { apikey: 'sb_publishable_L3nGfR6XoeU1NSA1pabmpw_22N3lkZl', 'Content-Type': 'application/json' },
  body: JSON.stringify({ p_article_slug: 'veille-concurrentielle-exemple' })
}).then(response => console.log(response.status)); // attendu 200, pas de journalisation de contenu
```

## Email et mentions de confidentialité à valider

Le formulaire explique que l'email reste privé et sert uniquement à la modération ou à un suivi lié au commentaire. Il renvoie vers `/confidentialite.html` ou `/en/privacy.html`. Aucun compte, mot de passe, abonnement newsletter ni transmission aux événements Analytics n'est ajouté.

Les politiques actuelles ne décrivent pas encore cette nouvelle finalité et Supabase. La région choisie et la durée de conservation n'ont pas été fournies. **Avant publication**, le propriétaire doit valider ces paramètres, les règles de suppression (pending/rejected/approved et emails), les mentions concernant Supabase et les informations contractuelles applicables. Aucune durée ou région inventée, aucune certification RGPD revendiquée. La question a été posée pendant le développement ; ces points restent bloquants sans réponse validée.

## Modération dans Table Editor

Ouvrir `public.comments`, filtrer `status = pending`. Lire nom, texte et contexte de l'article ; l'email n'est utilisé que si un suivi lié au commentaire est nécessaire. Retirer les données personnelles inutiles du texte et vérifier les abus avant publication.

- Publier : changer uniquement `status` en `approved` ; visible lors d'un prochain chargement.
- Refuser : `status = rejected` ; jamais visible publiquement.
- Retirer un commentaire déjà approuvé : passer à rejected ; les visiteurs ayant déjà chargé la page le verront jusqu'à rechargement. Pas de contrôle des copies qu'ils auraient conservées.

La contrainte n'autorise que pending/approved/rejected, avec status non NULL. Aucun dashboard public ni droit de modération navigateur.

## Futur article

Ajouter dans son head les références `/assets/blog-comments.css` et `/assets/blog-comments.js` (defer). Après le contenu de l'article et avant le footer, ajouter :

```html
<section class="blog-comments" data-comments data-article-slug="nouvel-article" aria-labelledby="comments-title">
  <h2 id="comments-title">Commentaires</h2>
  <p>Une question, un retour ou une expérience à partager ?</p>
  <noscript><p>Activez JavaScript pour lire et envoyer des commentaires.</p></noscript>
</section>
```

Pour EN, utiliser les textes anglais et `html lang="en"`. Slug explicite, stable, unique, jamais dérivé d'un champ utilisateur ou d'une query string. Aucun nouveau JS à recopier et pas de modification SQL nécessaire si le slug respecte le format. Les six slugs actuels sont dans `tests/blog-comments.cjs`.

## Rollback

Avant publication, il suffit de ne pas fusionner la PR. Si le SQL a déjà été appliqué, conserver la protection email ; ne jamais restaurer les anciens SELECT/INSERT publics.

Pour arrêter les commentaires après un déploiement autorisé : exécuter [disable_blog_comments.sql](../../supabase/disable_blog_comments.sql), puis rétablir le frontend précédent par un commit de revert de cette PR. Le script retire EXECUTE et conserve données, RLS, contrainte et absence d'accès direct. Ne pas supprimer la table ni ses commentaires. La réactivation exige une nouvelle revue des droits et de la migration.

## Validation et limites

Voir [validation.md](validation.md) pour les résultats exécutés, captures, échecs préexistants de zoom, environnement PostgreSQL local et étapes externes non réalisées. Aucun résultat simulé n'est présenté comme une validation du projet Supabase réel.
