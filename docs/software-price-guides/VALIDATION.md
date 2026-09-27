## Finalisation du 27 septembre 2026

Prisync vérifié dans le navigateur intégré réel : article accessible, contenu URL-based / Channel-based / Hybrid lisible et pertinent. Lien conservé ; réserve HTTP 403 curl levée pour l’accès lecteur. Les deux articles et cartes sont prêts à publier : mentions de brouillon retirées, datePublished et dateModified au 2026-09-27, lastmod des deux index actualisé. PR toujours en brouillon, sans fusion ni déploiement. Les constats ci-dessous décrivent la passe initiale et sont remplacés sur ces points par cette finalisation.

# Validation locale — nouveaux guides FR et EN

27 septembre 2026 — branche `codex/software-and-price-monitoring-guides`, base `40836f8`. Aucun déploiement, paiement, contact Formspree ou événement de test réellement envoyé à Google.

## Résultats exécutés

| Suite | Résultat | Portée |
|---|---|---|
| `tests/operations-guides.cjs` | PASS | Deux nouveaux articles, 320/375/390/768/1024/1440 px, zéro débordement global, tableaux défilables au clavier sur mobile et sans débordement sur desktop, clavier/skiplink, zoom texte et CSS 200 %, axe WCAG 2/2.1 AA à 320 et 1440, images décodées, TOC, schémas, mots/temps, cartes/sitemap, CTA locaux, canonical propres et absence de fausse traduction. |
| `tests/browser.cjs` | PASS | FR : tarifs/liens Stripe, formulaire, absence de jeton, succès/HTTP/réseau/timeout, double soumission, démo/clavier/mouvement réduit et ressources. |
| `tests/consent.cjs` | PASS | Refus, acceptation, événements existants, retrait, cookies et synchronisation. |
| `tests/consent-ux.cjs` | PASS | Bandeau et personnalisation aux largeurs existantes. Le journal mesure encore un recouvrement mobile à 320 px, accepté par la suite existante ; interface de consentement inchangée. |
| `tests/i18n.cjs` | PASS à la relance | Première tentative interrompue par ECONNRESET sur une ressource du serveur local ; seconde exécution complète réussie, FR/EN, formulaire et démo. |
| `tests/blog-launch.cjs` | PASS | Les 18 pages du sitemap, canonical, ressources/liens/ancres internes, paire historique hreflang, tarifs standard/promotionnels, consentement et routes. |
| `tests/google-ads.cjs` | PASS | Simulation déterministe FR/EN : séparation audience/publicité, conversions après succès uniquement, label absent fermé, refus/retrait, absence de champs privés. |
| `CW_REAL_GA=1 node --use-system-ca tests/google-ads.cjs` | PASS FR/EN | Véritables scripts Google téléchargés avec TLS vérifié ; toute collecte interceptée, Formspree/Turnstile simulés. Ne valide pas la réception des événements dans les comptes Google. |
| `tests/analysis-guide.cjs` | ÉCHEC préexistant reproduit | Assertion `200% CSS layout zoom` ; même échec sur une archive intacte de `40836f8`. Ni ancien article ni CSS partagé modifié. |
| `tests/field-guides.cjs` | ÉCHEC préexistant reproduit | Attend l'absence de datePublished/dateModified alors que les anciens articles sont publiés ; même échec sur l'archive de `40836f8`. |
| `tests/field-guides-static.py` | ÉCHEC préexistant | Compare les anciens fichiers au commit obsolète `69d002d`, échoue sur `assets/blog.css` déjà modifié dans main. Ce fichier est strictement inchangé par ce travail. Le parcours des liens statiques avant cette assertion passe. |
| `git diff --check` | PASS | Pas d'erreur d'espacement. |

Commandes : exécuter les fichiers `.cjs` avec Node et `PLAYWRIGHT_MODULE` pointant vers Playwright, `CW_AXE_PATH` vers axe-core. Le nouveau test utilise Edge headless ; `CW_RENDER_SOCIAL=1` régénère les deux PNG depuis les SVG originaux. Les tests ordinaires ne régénèrent pas les images. Les journaux sont dans `logs/`.

## Intégrations et préservation

Seuls les nouveaux chemins publics et leurs libellés fixes sont ajoutés aux listes autorisées de `assets/consent.js` et `assets/analytics-frame.js`. Aucun changement de logique, d'ID Google ou de label Ads. Le nouveau test couvre chaque URL canonique et son alias index.html, avec query/hash privés : un seul page_view GA4, CTA mesurés après consentement, pas de paramètres privés, refus et retrait sans nouvelle collecte.

Les six anciens articles, les deux landings (tarifs et liens Stripe inclus), `script.js`, le style partagé, CNAME et la vérification Google sont comparés à la base. Aucun changement. Les seuls autres fichiers existants édités sont les deux index de blog et le sitemap pour ajouter des entrées.

La compatibilité est facultative avant abonnement. Les CTA mènent aux vrais identifiants `#demande` et `#tarifs` dans la bonne langue ; les formulaires conservent trois URL, le sitekey public et le garde anti-spam. Aucun nouveau champ ou envoi. Les ressources de téléchargement anciennes ne sont pas modifiées.

## Captures contrôlées

Douze captures locales à 320 et 1440 px : en-tête, tableau et CTA final pour chaque article. Le cadrage mobile du tableau montre sa partie visible ; le test vérifie qu'on peut faire défiler la suite au clavier. Le contenu n'est pas supprimé pour le faire tenir.

| FR | EN |
|---|---|
| [En-tête desktop](screenshots/fr-1440-header.png) | [Desktop header](screenshots/en-1440-header.png) |
| [En-tête mobile](screenshots/fr-320-header.png) | [Mobile header](screenshots/en-320-header.png) |
| [Tableau desktop](screenshots/fr-1440-table.png) | [Desktop table](screenshots/en-1440-table.png) |
| [Tableau mobile](screenshots/fr-320-table.png) | [Mobile table](screenshots/en-320-table.png) |
| [CTA desktop](screenshots/fr-1440-cta.png) | [Desktop CTA](screenshots/en-1440-cta.png) |
| [CTA mobile](screenshots/fr-320-cta.png) | [Mobile CTA](screenshots/en-320-cta.png) |

## Limites et validations restantes

- Validation éditoriale et visuelle du propriétaire avant toute fusion. Publication non autorisée par cette mission.
- Les tests automatiques axe ne remplacent pas une revue manuelle avec lecteur d'écran et appareils physiques.
- Prisync : contenu ouvert dans la recherche, mais HTTP 403 avec curl ; vérifier l'accès dans un navigateur humain. Les cinq autres liens externes des nouveaux articles répondent HTTP 200 avec TLS.
- Volumes de recherche communiqués par le propriétaire ; aucun nouvel export de volume ni relevé Google géolocalisé indépendant. Risque résiduel de chevauchement avec l'ancien guide général EN documenté dans l'audit.
- Aucun contrôle de publication, indexation Google, rendu OG des réseaux sociaux, widget Turnstile réel ou livraison réelle Formspree/Google réalisé pour ces brouillons. Les services sont simulés/interceptés pour éviter de créer des demandes ou conversions.
- Avant publication autorisée : supprimer les mentions de brouillon, fixer la datePublished réelle et actualiser dateModified/sitemap si nécessaire, puis relancer les tests ciblés. Ne pas présenter la date de rédaction comme date de publication.
- Les trois échecs historiques restent visibles ; ne pas masquer leur sortie et ne pas modifier les anciens articles dans cette PR.

### Tests finaux de préparation à la publication

PASS : operations-guides (assertion datePublished actualisée), blog-launch, consent, google-ads (simulation), i18n et git diff --check. Journaux publication-*.log joints. Canonical, JSON-LD, CTA formulaire/tarifs, maillage et préservation des six articles vérifiés. Aucun code GA4/Ads/consentement modifié par cette finalisation. Aucune collecte réelle ni demande envoyée.
