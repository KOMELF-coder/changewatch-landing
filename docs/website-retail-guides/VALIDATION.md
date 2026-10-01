# Validation — guides site internet / retail — 1er octobre 2026

Branche : `codex/website-retail-guides`. Base : `3ccfe3b287a1275a1543835479c95d8966e05a61`. Travail local uniquement, pas de fusion ni publication.

## Contenu livré

| Langue | H1 | URL | Longueur / lecture |
|---|---|---|---|
| FR | Veille concurrentielle sur un site internet : choisir les pages utiles | `/blog/veille-concurrentielle-site-internet/` | 1 805 mots / 10 min |
| EN | Retail price monitoring: qualify the offer before comparing | `/en/blog/retail-price-monitoring/` | 1 939 mots / 10 min |

SEO titles, descriptions, canonical, Open Graph/Twitter, images sociales locales, BlogPosting et BreadcrumbList cohérents. Deux sujets indépendants, aucun hreflang artificiel entre eux. La navigation de langue conduit aux accueils respectifs. `dateModified` au 2026-10-01, mentions visibles de préparation/en attente et **aucun `datePublished`**. Date de publication réelle à fixer uniquement après validation propriétaire.

Deux cartes dans les index, anciennes cartes inchangées. Sitemap de 22 URL ; lastmod des index et des deux nouveaux articles au 2026-10-01. Toutes les URL existantes conservées. Les cinq liens vers les anciens articles de chaque langue sont contextuels. Pas de modification des anciens articles pour ajouter des liens inverses ; pas de nouveau téléchargement sans besoin.

Deux schémas SVG originaux avec contenu essentiel également présent en HTML ; deux SVG sociaux et leurs PNG locaux. Réutilisation de `.article-figure` et `.workflow-figure` pour un ratio correct sur mobile ; aucun changement CSS global. Pas de nouvelle dépendance frontend. Tous les titres, tableaux, CTA, commentaires et pieds de page reprennent les composants existants.

## Suites réellement exécutées

| Suite | Résultat | Portée |
|---|---|---|
| `website-retail-guides.cjs` | PASS | JSON-LD, canonical, indépendance linguistique, absence de datePublished, dateModified, mots/temps, sommaire, dix types de pages FR, sept contrôles EN, données réelles du tableau fictif et calculs, images/ratio, cartes/index/sitemap, six largeurs, axe, clavier, zoom, CTA vers pages locales, routes GA4 et confidentialité |
| `website-retail-preservation.py` | PASS | Les dix articles et tous les fichiers préexistants identiques hors six intégrations explicitement autorisées ; scripts Google réduits à l'ajout des routes, anciennes cartes inchangées, 22 URL sans suppression |
| `blog-launch.cjs` | PASS | 22 pages du sitemap, liens locaux/ancres/ressources, canonical et SEO existant, exactitude des liens Stripe/promotion, responsive, no-JS et consentement simulé |
| `i18n.cjs` | PASS | Navigation FR/EN, formulaire EN/Turnstile simulés, erreur/succès/timeout/double soumission, démo, mobile, consentement interlangues et absence de données privées |
| `blog-comments.cjs` | PASS | 12 articles, y compris les deux nouveaux slugs : chargement, rendu texte, absence d'email/statut affiché, validation, erreurs, timeout, double soumission, honeypot, pagination, clavier/focus/axe, zoom, no-JS ; API simulée |
| `consent.cjs` | PASS | Refus, retrait/cookies, synchronisation, acceptation et événements autorisés ; succès Formspree simulé uniquement pour le lead |
| `consent-ux.cjs` | PASS selon les assertions existantes | Boutons visibles, absence de débordement et tailles ; recouvrement préexistant à 320 px signalé ci-dessous |
| `google-ads.cjs` | PASS | FR/EN, séparation des catégories de consentement, un page_view GA4, une conversion après succès simulé, aucune conversion après erreur, label absent fermé, absence de PII, retrait |
| `browser.cjs` | PASS | Landing, formulaires, tarifs/liens Stripe, Turnstile simulé, navigation, FAQ, démo/animations/mouvement réduit, zoom et blog existant |
| `operations-guides.cjs` | PASS | Les deux articles de la PR #11 restent fonctionnels : metadata, CTA, responsive, axe, confidentialité |
| `price-tool-guides.cjs` | PASS | Les deux articles de la PR #14 restent fonctionnels et leurs dates de publication sont préservées |
| `git diff --check` | PASS | Pas d'erreur d'espacement |

Les journaux sont conservés dans `logs/`. Tests exécutés avec Node, Playwright/Edge local et axe-core **4.10.3**. Services externes simulés/interceptés : ces tests ne prouvent pas la réception réelle dans GA4/Ads, la livraison d'un message Formspree, le fonctionnement du challenge Turnstile public ou les écritures Supabase en production. Aucune demande, aucun commentaire ni paiement réel envoyé.

Les suites historiques `analysis-guide` et `field-guides` ne sont pas présentées comme relancées. Le contrôle de préservation de cette passe utilise la base à dix articles et couvre tous les fichiers préexistants ; les anciens scripts à comptage fixe du sitemap ne sont pas adaptés ni présentés comme valides pour 22 URL.

## Responsive et accessibilité

- Largeurs testées : **320, 375, 390, 768, 1024, 1440 px**.
- Nouveaux articles : pas de débordement de la page ; tableaux défilables sur mobile au clavier, sans défilement horizontal nécessaire sur desktop.
- Axe WCAG 2/2.1 A/AA à 320 et 1440, skip link, sommaire, focus, zoom texte à 200 % et zoom CSS à 200 % ; alt et légendes présents.
- Capture visuelle des en-têtes, tableaux, illustrations et CTA à 320/1440 ; vues inspectées FR mobile, EN desktop, deux tableaux desktop, CTA EN mobile et deux schémas mobile. Fichiers dans `screenshots/`.
- Les captures de composants masquent temporairement la barre sticky pour rendre leur contenu lisible ; le site n'est pas modifié par cette option de capture.

## Incidents de test et limites préexistantes

1. Le premier lancement du nouveau test s'est arrêté sur l'absence du fichier temporaire axe-core. La version épinglée 4.10.3 a été téléchargée puis tous les tests concernés ont passé. Aucune protection TLS désactivée.
2. L'inspection visuelle a détecté un espace inutile autour des nouveaux SVG sur mobile. Réutilisation du style d'image existant `article-figure`, augmentation de la taille des textes des nouveaux SVG et ajout d'une assertion de ratio. Les tests des nouvelles pages, blog-launch et la préservation ont été relancés après cette correction ; aucune modification des styles partagés.
3. La suite commentaires signale le débordement éditorial déjà connu des anciens guides généraux FR/EN à 320 px / texte 200 %. Les commentaires n'ajoutent pas ce débordement et les nouveaux articles passent.
4. `consent-ux` constate le recouvrement déjà connu du bandeau à 320 px ; pas de changement de cette UI dans la branche. Aucun nouvel échec final.

## Sources et contrôles réseau

Quatre sources externes des nouveaux articles : **HTTP 200**, requêtes GET suivant les redirections, TLS vérifié. Détail dans `logs/external-links.log`. Les contenus ont été lus avec l'outil Web ; le statut HTTP seul ne constitue pas la validation éditoriale. Pas d'accès réel aux services de paiement ou de collecte lors des tests de parcours. Les liens Stripe sont comparés aux valeurs existantes et le parcours des CTA jusqu'aux forfaits/formulaire est testé localement.

L'audit SERP, la matrice des dix articles et les limites de l'analyse de cannibalisation figurent dans `AUDIT.md`. Volumes ~40 FR/~590 EN fournis par le propriétaire, pas mesurés indépendamment.

## Avant publication

- Validation éditoriale et visuelle par le propriétaire, notamment l'angle retail distinct du guide competitor-price-monitoring ; risque de cannibalisation non nul, documenté.
- Fixer la vraie datePublished, les dates visibles et ajuster les assertions de publication lors de l'autorisation de mise en ligne.
- Lecteur d'écran et appareils physiques restent à vérifier manuellement ; l'automatisation ne remplace pas ces essais.
- Après publication autorisée : contrôler les URL publiques, le widget Turnstile réel et l'indexation Search Console. La réception effective GA4/Ads relève d'une validation séparée.
- PR à conserver en brouillon ; aucune fusion ni publication autorisée par cette mission.
