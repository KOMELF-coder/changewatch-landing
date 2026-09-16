# Refonte premium — revue du 16 septembre 2026

Branche : `codex/premium-redesign`. Base : `7f228bd`.
Cette proposition attend une validation visuelle avant fusion. Aucun déploiement sur `main`.

## Parcours et direction visuelle

- Typographie système expressive, bleu nuit, bleu d’action, fonds clairs et accent menthe pour la démonstration. Aucun téléchargement de police.
- Hero centré sur les vérifications répétitives et l’alerte email. CTA principal vers les tarifs, secondaire vers la démonstration.
- Fonctionnement accompagné, fonctionnalités regroupées par usage, limites explicites, grille tarifaire et FAQ réorganisée autour des questions d’achat.
- La mention non démontrée « Le plus populaire » est remplacée par une indication factuelle de volume.
- Démonstration fictive du Sac Atelier : page à 99 €, nouveau prix à 79 €, détection, email. Lecture volontaire de 4,2 secondes, arrêt/relecture au clavier ; résultat immédiat si réduction des mouvements. Aucun appel au moteur.
- Apparitions légères, sans contenu caché en l’absence de JavaScript ; navigation native avec défilement doux et focus visible.
- Guide SEO réécrit : 1 589 mots dans le corps, 8 minutes estimées à 200 mots/minute. Publication initiale conservée, modification au 16 septembre 2026. Exemples fictifs, tableaux, liens contextuels, deux illustrations SVG originales avec variantes verticales mobiles et image sociale PNG locale.

## Captures

Les captures avant et après représentent le même viewport (1440 × 1000 et 390 × 1000). Les images longues montrent aussi les sections sous le premier écran. Le widget Turnstile tiers est bloqué pendant les captures ; elles ne représentent pas son rendu réel. Les vues isolées de sections masquent l’en-tête fixe pour ne pas recouvrir le contenu.

| Page | Avant | Après |
| --- | --- | --- |
| Accueil, desktop | [Avant](before-home-1440.webp) | [Après](after-home-1440.webp) · [Page complète](after-home-1440-full.webp) |
| Accueil, mobile | [Avant](before-home-390.webp) | [Après](after-home-390.webp) · [Page complète](after-home-390-full.webp) |
| Article, desktop | [Avant](before-article-1440.webp) | [Après](after-article-1440.webp) · [Page complète](after-article-1440-full.webp) |
| Article, mobile | [Avant](before-article-390.webp) | [Après](after-article-390.webp) · [Page complète](after-article-390-full.webp) |

[Démonstration](after-alertes.webp) · [Tarifs](after-tarifs.webp) · [Contact](after-configuration.webp) · [FAQ](after-faq.webp)

## Validation effectuée

`tests/browser.cjs` : tests Playwright sur Microsoft Edge headless. Tous les appels de formulaire sont interceptés ; aucune demande réelle ni transaction.

- Structure, H1, labels, ancres, chemins des images, variantes mobiles, liens internes de toutes les pages HTML.
- Accueil aux largeurs 320, 375, 390, 768, 1024 et 1440 px ; sept pages à 320, 390, 768, 1024 et 1440 px, sans débordement global. Le tableau de l’article défile dans sa région accessible.
- Navigation mobile, fermeture par Échap et retour du focus, FAQ avec Entrée, accès clavier aux trois liens Stripe dans le même onglet.
- Prix et liens Stripe comparés à leurs valeurs exactes. Clics sans interception par Formspree.
- Formulaire : jeton absent/blanc, succès HTTP, erreur 422, panne réseau, délai de 15 secondes, verrou de double soumission, conservation des données à l’échec, vidage au succès, remise à zéro du widget simulé après chaque requête.
- Démonstration : lecture/arrêt/relecture clavier, achèvement, réduction des mouvements ; navigation sans JavaScript, formulaire désactivé et email de secours ; texte à 200 % sur l’accueil.
- Canonical, Open Graph, titres, descriptions, BlogPosting, BreadcrumbList, date et nombre de mots, sitemap et robots. JavaScript contrôlé avec `node --check`.
- Axe-core 4.10.3, règles WCAG 2 A/AA et 2.1 AA : **aucune violation signalée sur 14 combinaisons page/viewport**, après stabilisation des animations. [Résultats](accessibility.json). Ce contrôle automatisé ne constitue pas une certification exhaustive.
- 16 liens externes vérifiés par GET, tous HTTP 200, y compris les trois Payment Links et le script Turnstile. [Résultats](external-links.json). Les trois sources éditoriales (France Num, Google Merchant Center, CNIL) ont aussi été lues pour vérifier leur pertinence.

## Performance et intégrité

Pas de dépendance de production ajoutée, pas de framework, pas de police distante. Le script d’interaction ajouté pèse environ 2,1 ko (0,9 ko gzip). L’accueil et ses ressources locales initiales représentent environ 59 ko bruts / 17 ko gzip, hors script tiers Turnstile. Les illustrations de l’article sont chargées à la demande ; les captures de revue ne sont pas chargées par le site.

Mesures exploratoires sur serveur local, sans ralentissement réseau/CPU et avec Turnstile bloqué : CLS observé de 0 sur les pages contrôlées. Les temps LCP locaux dans le JSON servent au diagnostic uniquement ; ce ne sont pas des résultats Lighthouse ni des performances de production. Aucun score de performance commercial n’est revendiqué.

`script.js`, `CNAME`, `.nojekyll`, `robots.txt`, les pages juridiques et les trois liens Stripe sont préservés. Aucun secret, backend, modification du moteur Apify ou changement de ses données.

## Reproduire les tests

Prérequis de développement uniquement : Node.js, Playwright et Microsoft Edge. Avec Playwright disponible dans la résolution de modules :

```sh
node tests/browser.cjs
node --check script.js
node --check assets/experience.js
```

Si Playwright est fourni par un environnement externe, définir `PLAYWRIGHT_MODULE` vers son module. Le test sert le dépôt sur `127.0.0.1:8765` et ferme le serveur en fin de test. Les réponses Stripe, Formspree et Turnstile sont simulées. Les résultats d’axe et les contrôles réseau correspondent à l’audit daté ci-dessus, distinct de cette suite fonctionnelle.

## À vérifier manuellement avant publication

- Validation visuelle du propriétaire, en particulier l’accroche, la composition et le parcours de démonstration. Ne pas fusionner automatiquement.
- Safari/iOS, Firefox, appareil tactile réel et lecture avec NVDA/VoiceOver ; l’automatisation réalisée ici utilise Edge.
- Rendu et configuration du véritable widget Turnstile sur le domaine autorisé, notamment si le script est lent ou bloqué.
- Livraison effective Formspree/email et configuration commerciale Stripe (forfait, périodicité, notifications) : les tests locaux et une réponse HTTP 200 ne prouvent pas ces services de bout en bout. Aucun paiement ou message réel effectué.
- Après une fusion explicitement approuvée : GitHub Pages, HTTPS, métadonnées sociales, Rich Results/Search Console et performance réseau réelle avec Turnstile.
