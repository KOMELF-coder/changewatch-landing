# Validation des deux nouveaux guides — 29 septembre 2026

Base : main `d6c7bcc063faebb643e393a362bdc329281c40fc`. Branche dédiée `codex/price-surveillance-monitor-tool`. Aucun changement dans le moteur de surveillance, aucun déploiement, paiement, contact ou commentaire réel.

## Pages et métadonnées

| Langue | Titre SEO | URL | Contenu |
|---|---|---|---|
| FR | Surveillance des prix des concurrents : vérifier avant d’agir | `/blog/surveillance-prix-concurrents/` | 1 653 mots, 9 minutes |
| EN | Competitor monitor tool: choose the right category | `/en/blog/competitor-monitor-tool/` | 1 771 mots, 9 minutes |

Titres de document suffixés « ChangeWatch ». H1 et descriptions complets dans `metadata.json`. Canonical propre, OG/Twitter et image PNG locale, BlogPosting et BreadcrumbList. dateModified et article:modified_time au 29 septembre 2026 ; aucune datePublished inventée pour ces articles non publiés. Avant une publication autorisée, fixer cette date et remplacer la mention « En attente de publication / Awaiting publication » par la date réelle. Aucun hreflang entre ces sujets indépendants ; sélecteur vers l'accueil de l'autre langue.

Deux entrées ajoutées aux index et au sitemap (20 URL au total) ; lastmod des index actualisé. Les huit anciens articles, leurs métadonnées, URL et ressources sont inchangés. Quatre liens contextuels vers les anciens articles de chaque langue ; aucun lien artificiel ajouté aux anciens textes. CTA contextuel vers trois URL à vérifier, CTA final tarifs et formulaire ; compatibilité facultative avant abonnement, vérification pendant la configuration si souscription directe. Les liens Stripe et tarifs des landings sont inchangés.

## Contrôles exécutés

| Suite | Résultat et portée |
|---|---|
| `price-tool-guides.cjs` | PASS : canonical, schémas, H1/TOC, compte de mots/temps, ressources, calculs fictifs, 320/375/390/768/1024/1440, absence de débordement desktop, scroll des tableaux au clavier, axe WCAG 2/2.1 AA 320/1440, zoom texte et CSS 200 %, CTA locaux, refus/retrait, un page_view par document consenti, événements CTA et absence de paramètres privés |
| `price-tool-static.py` | PASS : huit articles identiques octet par octet, composants commentaires/formulaire/styles/CNAME/Search Console identiques ; seuls deux chemins et alias ajoutés dans les listes Analytics, aucune logique Google modifiée ; sitemap sans doublon |
| `blog-launch.cjs` | PASS : 20 pages du sitemap, tous liens/ancres/ressources locaux, paire hreflang historique, Stripe et promotion, consentement |
| `i18n.cjs` | PASS : navigation FR/EN, formulaire/Turnstile simulés, CTA, événements, démo et mobile |
| `blog-comments.cjs` | PASS : dix articles, deux nouveaux slugs, chargement/état vide/approuvé simulé, HTML rendu comme texte, champs privés exclus, erreurs, timeout, double soumission, honeypot, pagination, six largeurs, axe/clavier/focus/zoom et sans JS |
| `consent.cjs` | PASS : refus, acceptation, retrait/cookies et événements existants |
| `consent-ux.cjs` | PASS selon les assertions existantes ; recouvrement préexistant mesuré à 320 px, aucune modification de cette UI |
| `google-ads.cjs` | PASS avec script simulé : catégories séparées, conversion après succès Formspree uniquement, label absent fermé, refus/retrait, absence de champs privés |
| `browser.cjs` | PASS : formulaire, Stripe, démo, mouvement réduit, liens et responsive existants |
| `operations-guides.cjs` | PASS : les deux guides précédents continuent de fonctionner |
| `git diff --check` | PASS |

Les journaux sont dans `logs/`. Playwright utilise Edge local, axe-core local et services externes interceptés. Aucun vrai événement de collecte envoyé. Il ne s'agit pas d'une validation de réception GA4/Ads, de livraison Formspree ou de modération en production. Aucun appel ni migration Supabase réel nécessaire pour ces slugs ; composant et RPC existants conservés.

Le premier passage du nouveau test attendait `decode()` sur une image lazy hors écran : test arrêté puis corrigé pour faire défiler l'image avant vérification. Le contrôle statique a été exécuté avec le compte propriétaire après refus de Git dans le sandbox, sans assouplir `safe.directory`. Son filtre a été corrigé pour tenir compte des alias index.html. Ces incidents de test sont résolus, aucune protection TLS ou règle de consentement désactivée.

## Sources et inspection visuelle

Les quatre liens externes des articles ont été ouverts et répondent HTTP 200 avec validation TLS : Google Merchant prix, Google Merchant période de promotion, Ahrefs Rank Tracker, Meltwater Social Listening. Les liens indisponibles rencontrés en recherche n'ont pas été conservés dans les articles. Audit et matrice de chevauchement dans `AUDIT.md`, inventaire des anciens articles dans `existing-articles.json`.

Captures 320/1440 des en-têtes, tableaux et CTA : `screenshots/`. Contrôle visuel effectué sur FR mobile, EN desktop, les deux tableaux desktop et CTA mobile ; tableaux mobile défilables, pas de colonnes supprimées. SVG et PNG originaux stockés localement. Pas de faux écran produit ni de nouveau téléchargement peu utile ; ressources CSV anciennes intactes.

## Limites / validation propriétaire

- Relire les deux sujets et leur distinction éditoriale, notamment EN versus price-tracking-software ; le risque résiduel n'est pas présenté comme nul. Surveiller les requêtes par page dans Search Console après publication autorisée.
- Volumes ~70/mois FR et ~260/mois EN fournis par le propriétaire, non vérifiés indépendamment. SERP qualitative, pas de relevé de positions Google géolocalisées.
- Les tests de commentaires constatent toujours un débordement éditorial des anciens guides généraux à 320 px / texte 200 % ; même largeur après retrait du composant, pas de nouvelle régression. Les nouveaux articles passent.
- Les suites historiques analysis-guide et field-guides, connues pour leurs assertions de zoom/dates, ne sont pas revendiquées comme exécutées dans cette passe ; voir leurs rapports historiques. Toutes les suites exécutées ci-dessus ont réussi.
- Validation visuelle sur appareils physiques et lecteur d'écran restant utile ; axe et navigateurs automatisés n'en tiennent pas lieu.
- La publication, indexation et réception Google ne sont pas testées. Fixer datePublished à la publication réelle. Ne pas fusionner ni publier cette PR sans accord.
