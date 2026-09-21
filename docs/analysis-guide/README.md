# PR #6 — Deux articles indépendants et parcours commercial

Validation du 21 septembre 2026, publication autorisée par le propriétaire sous réserve des contrôles. Ce rapport remplace celui du brouillon bilingue. État pré-fusion : contrôles ci-dessous réussis ; le résultat du déploiement sera consigné dans la PR.

## Sujets et recherche

| Article | Mot-clé principal | Volume fourni | Intention |
|---|---|---:|---|
| FR : étude stratégique | étude de concurrence | 110/mois | Comparer les offres et choisir un positionnement / une action |
| EN : analyse tarifaire | competitor price analysis | 260/mois | Normaliser les prix, calculer les écarts, interpréter et décider |

Chiffres issus du relevé Semrush du propriétaire. Pas de mesure indépendante ; pays et date inconnus. Aucune demande d'accès Semrush. L'exemple EN utilise le marché américain, USD avant sales tax : choix éditorial et non déduction sur l'origine du volume. Les articles ne sont pas des traductions et aucun périmètre commun artificiel n'est imposé.

Recherches web réellement réalisées : « étude de concurrence méthode matrice analyse offres positionnement », « étude de concurrence méthode », « competitor price analysis method shipping discounts median ». Elles ne sont pas un classement Google géolocalisé certifié.

### Sources et résultats examinés

- [Bpifrance — étapes de l'étude de marché](https://bpifrance-creation.fr/moment-de-vie/4-etapes-bien-realiser-votre-etude-marche) : marché/demande/offre/environnement ; aide à délimiter l'étude de concurrence comme une partie de l'étude de marché.
- [Bpifrance — concurrence indirecte](https://bpifrance-creation.fr/concurrence-indirecte) : substitution au besoin même avec des produits éloignés.
- [IntoTheMinds — méthode d'analyse concurrentielle](https://www.intotheminds.com/blog/white-paper-etude-de-marche/4-etapes-pour-analyser-la-concurrence-et-reussir-votre-etude-de-marche/) : sélection des concurrents, critères, informations et synthèse ; publié 18 mai 2018, mise à jour 25 octobre 2023 selon la page.
- [Shopify — competitive pricing](https://www.shopify.com/blog/competitive-pricing) : stratégies, coûts, valeur et groupe concurrentiel ; source de l'article EN.

Pages ouvertes et consultées. Ces quatre liens présents dans les articles ont répondu HTTP 200, TLS vérifié avec la confiance système Node. Autres résultats repérés : supports pédagogiques CRCM sur l'étude concurrentielle et Qualtrics sur l'analyse stratégique côté FR ; PriceRest et AFCommerce sur le benchmark, la médiane et les coûts comparables côté EN. Ces derniers résultats servent à qualifier la couverture concurrentielle, pas de preuves de statistiques ou de performances.

Valeur ajoutée FR : exemple continu de boutique, matrice multi-critères, distinction promesse/preuve, synthèse forces/faiblesses/opportunités/menaces puis action avec validation. EN : huit offres fictives, inversion du classement par la livraison, médianes, dénominateur et distinction constat/hypothèse/conclusion. Aucun test logiciel ou relevé réel de prix revendiqué.

## Matrice de cannibalisation établie avant rédaction

| Dimension | Guide publié FR/EN | Nouveau FR | EN conservé |
|---|---|---|---|
| Question centrale | Organiser une veille e-commerce | Quelle place défendre face aux offres ? | Que signifient les écarts de prix ? |
| Livrable | Périmètre et routine de surveillance | Matrice stratégique et plan d'action | Tableau normalisé et décision tarifaire |
| Choix des concurrents | Pages pertinentes à surveiller | Alternatives directes et indirectes | Vendeurs d'articles identiques |
| Comparabilité | Précautions de veille | Différences d'offre et de valeur à conserver | Taxes, remise, livraison, variante normalisées |
| Surveillance / alertes | Cœur du guide | Bref lien de continuité et CTA | Bref lien de continuité et CTA |
| Interprétation | Exploiter les signaux | Forces/faiblesses, preuves, opportunités à tester | Écarts, causalité et limites |
| Exemple | Organisation d'une veille | Trois alternatives, matrice qualitative | Deux références, trois concurrents et boutique |
| Risque résiduel | — | Pré-requis concurrents/prix partagés | Pré-requis de comparaison partagés |

Des concepts communs restent nécessaires ; ils ne suffisent pas à conclure à une intention identique. Le nouveau FR ne développe aucun mode d'emploi de logiciel ou de surveillance. L'anglais garde son angle spécifique, pas une analyse stratégique générale.

## Parcours vers l'abonnement

Chaque article cible un professionnel, résout le problème puis identifie la vérification répétitive des pages qui sous-tendent l'étude. Un encart contextuel propose de vérifier trois pages ; la conclusion donne la priorité à la demande de compatibilité et un second bouton vers les forfaits. Ces liens rejoignent la langue correspondante de l'accueil.

- FR : `/#demande` et `/#tarifs`.
- EN : `/en/#demande` et `/en/#tarifs`.
- Les formulaires demandent déjà trois URL : le texte prépare le lecteur à ce besoin.
- Starter cité : 14,90 €/mois, cinq URL, une surveillance/jour, configuration incluse. Aucun tarif ou lien de paiement modifié.
- La demande avant abonnement est facultative, comme sur l'accueil ; pas de promesse de réponse automatisée ou de souscription déclenchée par le formulaire.
- ChangeWatch détecte des changements sur pages compatibles et envoie des emails. Il ne produit pas l'étude, les métriques, le CSV, des recommandations ni du repricing. Pagination, extraction et absence de temps réel restent explicites.
- Événements commerciaux existants, sans changement de logique : CTA → commercial_cta_click ; forfait → stripe_click ; jamais purchase sur simple clic. Pas de collecte avant consentement/refus.

## URLs et ressources

| Avant | Après | Statut |
|---|---|---|
| /blog/analyser-la-concurrence/ (brouillon non publié) | /blog/etude-de-concurrence/ | Brouillon remplacé, aucune redirection nécessaire |
| /en/blog/competitor-price-analysis/ (brouillon) | Identique | Finalisé, indépendant |
| /blog/ | Identique | Ancien et nouvel article présents |
| /en/blog/ | Identique | Ancien et nouvel article présents |
| /blog/veille-concurrentielle-ecommerce/ | Identique | Contenu intégralement inchangé |
| /en/blog/ecommerce-competitor-monitoring/ | Identique | Contenu intégralement inchangé |

Les anciens brouillons outil-veille-tarifaire et price-monitoring-software restent absents. Aucun lien actif vers les routes abandonnées. Illustration et image sociale FR remplacées par etude-decision-fr.svg et etude-concurrence-social-fr.svg/png. Illustration EN conservée. Les captures de l'ancien brouillon sont remplacées par les captures finales.

Canonical propre à chaque article. Aucun link hreflang ni translationOfWork entre les nouveaux articles. Les liens FR/EN de navigation vont aux accueils du site, avec libellés explicites. Les hreflang des anciens articles ne changent pas. Sitemap : 14 routes dont les deux nouvelles, anciennes entrées préservées. Publication/modification : 21 septembre 2026, sans mention Brouillon/Draft. FR : 1 982 mots, 10 min ; EN : 1 786 mots, 9 min, comptage de la zone article et arrondi à 200 mots/min.

## Calculs et téléchargements

FR : 30+5=35 ; 24+6=30 ; 32+0=32 ; 18+4=22. Écart 35−30=5. Offres alternatives différentes, donc pas d'indice homogène ni objectif de prix basé sur l'occasion.

EN : T01 [35,36,32,34], S01 [65,66,64,62] ; remise C 20 %, médianes concurrentes 34/64, écarts relatifs +2.94 % / +1.56 %. Montants avant sales tax ; pas des totaux finaux de checkout. Tous noms/données/dates d'observation fictifs.

CSV FR : 26 colonnes, une ligne par concurrent/critère. CSV EN : 29 colonnes, une ligne par référence/vendeur. En-têtes plus ligne vide, UTF-8 BOM, aucune formule/macro/connexion. Les champs suivent les méthodes exposées. Ressources éditoriales manuelles, pas une fonctionnalité de ChangeWatch.

## Neuf critères SEO/GEO

1. Intentions distinctes annoncées dès le début.
2. Analyse des résultats et valeur ajoutée décrites ci-dessus.
3. H1 propres, sept H2 avec sommaire, H3 pédagogiques.
4. Réponse directe et autonome à l'ouverture.
5. Concepts associés couverts sans accumulation de mots-clés.
6. Sources vérifiables ; exemples fictifs explicités ; volumes attribués.
7. Titles, descriptions, URL, illustrations et images sociales propres.
8. Pages indexables, accessibles et structurées ; canonical et schémas valides.
9. Liens contextuels vers les premiers guides, CTA commerciaux, index et sitemap.

## Tests réellement exécutés avant fusion

| Suite | Résultat final | Couverture |
|---|---|---|
| browser.cjs | PASS, code 0 | Site FR, tarifs/Stripe, formulaire simulé, démo, clavier, responsive, liens |
| consent.cjs | PASS, code 0 en relance isolée | Refus, acceptation, retrait/cookies, événements, absence de données privées |
| consent-ux.cjs | PASS, code 0 | 320/375/390/1440, boutons et défilement ; comportement historique du bandeau à 320 préservé |
| i18n.cjs | PASS, code 0 en relance isolée | FR/EN, formulaires simulés, démo, accessibilité, tarifs |
| blog-launch.cjs | PASS, code 0 | 14 routes du sitemap, liens/ancres/ressources, anciens hreflang, offre Business |
| analysis-guide.cjs | PASS, code 0 | Deux nouveaux articles, calculs, CSV, SEO indépendant, dates, clavier, CTA et consentement |

Deux échecs initiaux en exécution parallèle sont documentés : consent.cjs attendait quatre événements stripe_click simulés et en a observé trois ; i18n.cjs a reçu ECONNRESET sur une requête localhost. Les deux suites ont réussi séparément, sans modification de leurs assertions ni du code de production. Instabilité transitoire non reproduite ; origine exacte non prouvée.

Nouveaux articles : 320, 375, 390, 768, 1024, 1440 px ; axe-core 4.10.3 à 320/1440 ; navigation clavier, tableau défilant, texte 200 % à 320, zoom CSS 200 % desktop (pas zoom natif), mode sans JS. Liens CTA réellement cliqués en local : arrivée sur formulaire correct / tarifs ; destinations Stripe comparées aux liens existants. Trois événements CTA par article et alias index.html vérifiés après consentement ; aucun purchase, aucune donnée privée dans les chemins transmis. Toutes les intégrations externes sont simulées dans ces tests locaux. Aucun paiement ni véritable demande.

Captures finales : [FR mobile](screenshots/fr-390-header.png), [EN desktop](screenshots/en-1440-header.png), [CTA FR](screenshots/fr-390-cta.png), [CTA EN](screenshots/en-390-cta.png). Inspection visuelle des en-têtes FR390/EN1440, illustration FR390 et CTA des deux langues à 390. Les versions intégrales 375/390/1440 sont également enregistrées.

## Préservation et publication

GitHub Pages vérifié par API : source main, racine /, domaine changewatch.cybersignal.fr, build_type legacy. Aucun changement d'infrastructure, DNS ou services externes. Les anciens articles, accueils, démonstrations, pages juridiques, CNAME, robots et formulaire/script sont comparés au contenu Git de main. Seules les listes de routes Analytics ajoutent les nouveaux chemins ; le mécanisme de consentement est inchangé.

Restent hors de ces tests : lecteur d'écran manuel, Safari/iOS/Firefox, performances Lighthouse, résultats commerciaux et réception effective des événements dans GA4. Aucun taux de conversion garanti. Le contrôle public post-déploiement doit être distingué des simulations locales et consigné dans la PR.

## Plans exacts

### blog/etude-de-concurrence/index.html

- H1 : Étude de concurrence : méthode complète, matrice et exemple concret
- H2 : 01. Cadrer l'objectif de l'étude de concurrence
- H2 : 02. Identifier les concurrents directs et indirects
- H2 : 03. Choisir des critères qui éclairent la décision
- H3 : Distinguer promesse, preuve et information manquante
- H2 : 04. Construire une matrice comparative exploitable
- H3 : Éviter le faux classement scientifique
- H3 : Évitez de rouvrir chaque page pour chercher un changement
- H2 : 05. Identifier forces, faiblesses et opportunités
- H2 : 06. Transformer l'étude en décisions concrètes
- H3 : Télécharger la matrice d'étude de concurrence
- H2 : Une étude utile débouche sur un choix, puis reste à jour
- H3 : Gardez un œil sur les pages qui comptent pour votre stratégie

### en/blog/competitor-price-analysis/index.html

- H1 : Competitor price analysis: a practical method with a worked example
- H2 : 01. Start with a pricing question you can answer
- H2 : 02. Build a defensible comparison group
- H2 : 03. Keep the raw offer separate from the comparable price
- H3 : Normalize only what you can justify
- H2 : 04. Calculate gaps for each item
- H3 : Name the reference before quoting a percentage
- H3 : Know when a page behind your analysis changes
- H2 : 05. Separate the observation from the explanation
- H2 : 06. Write a decision brief with a validation step
- H3 : A blank template that follows the method
- H2 : Turn a price table into a defensible conclusion
- H3 : Keep track of the pages behind your pricing decisions
