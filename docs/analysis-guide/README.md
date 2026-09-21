# Validation éditoriale et technique — PR #6

Contrôles exécutés le 21 septembre 2026. **Brouillon : aucune fusion, aucun déploiement.**
Le travail rejeté a été annulé par `c021b3df78645ae3c0d649dc51d010c174b5a45d` : son arbre était identique à main. Ce nouveau travail conserve la branche existante.

## Décision éditoriale prise avant rédaction

| Langue | Requête | Volume mensuel | Provenance et limites |
|---|---|---:|---|
| FR | analyser la concurrence | 110 | Relevé Semrush fourni par le propriétaire ; pays et date non transmis |
| EN | competitor price analysis | 260 | Même provenance ; pays et date non transmis |

Ces chiffres n'ont pas été mesurés ou vérifiés indépendamment. Ils dépassent numériquement 50, sans prouver un volume en France ou aux États-Unis. Les recherches web réalisées ne constituent pas un classement Google géolocalisé reproductible.

La requête française est plus large : étude de marché, benchmark, forces/faiblesses, tableau comparatif. La requête anglaise porte sur la comparaison et l'interprétation des prix. Leur intersection est exploitable à condition de délimiter explicitement le guide FR au **positionnement prix e-commerce**. Il ne prétend pas couvrir toute l'analyse concurrentielle. L'exemple EN en USD avant sales tax est un choix éditorial américain, pas une déduction sur le marché du relevé Semrush.

## Résultats consultés et valeur ajoutée

Recherches : expressions exactes FR/EN, puis « analyser la concurrence étude méthode Bpifrance » et « analyser la concurrence méthode tableau ». Pages effectivement ouvertes et lues :

| Source | Intention / couverture | Différence de notre guide |
|---|---|---|
| [Bpifrance : benchmark](https://bpifrance-creation.fr/moment-de-vie/benchmark-comment-analyser-vos-concurrents) | Benchmark général, concurrents directs/indirects, critères et tableau | Huit observations fictives, calculs et conclusion explicite |
| [Bpifrance : matrice](https://bpifrance-creation.fr/boiteaoutils/matrice-analyser-principaux-concurrents) | Synthèse structurée des concurrents | Passage chiffré de la normalisation à une décision ; seule la page de présentation a été consultée, pas le fichier téléchargeable |
| [Shopify : competitive pricing](https://www.shopify.com/blog/competitive-pricing) | Stratégies, coûts, valeur et choix des concurrents ; 4 juin 2025 | Cas limité reproductible et distinction constat/hypothèse |
| [Competera : competitive pricing analysis](https://competera.ai/resources/articles/competitive-pricing-analysis) | Étapes, SKU, données, indices, règles ; 5 juin 2025 | Méthode manuelle accessible sans promesse d'automatisation du catalogue |
| [Competitive Intelligence Alliance](https://www.competitiveintelligencealliance.io/how-to-do-competitive-pricing-analysis/) | Analyse tarifaire large, comparaison et contexte commercial ; 11 juin 2026 | Petit cas e-commerce et ressource vierge directement alignée |

Les trois liens externes présents dans les articles (deux Bpifrance, Shopify) ont également répondu HTTP 200 avec Node `--use-system-ca`, vérification TLS active. Aucun texte cité ni statistique propriétaire repris. La valeur ajoutée n'est pas l'invention de la médiane : c'est l'explication suivie d'une comparaison normalisée, de ses limites et de la décision testable qui en découle.

## Matrice de cannibalisation (FR et EN)

| Dimension / question | Guides publiés FR et EN | Nouveaux guides FR et EN | Chevauchement et traitement |
|---|---|---|---|
| Intention centrale | Organiser une veille concurrentielle e-commerce | Transformer des offres comparables en analyse du positionnement prix | Deux livrables différents : routine de veille / note de décision |
| Mots-clés principaux | veille concurrentielle e-commerce / ecommerce competitor monitoring | analyser la concurrence / competitor price analysis | Différence lexicale insuffisante seule ; séparation par problème traité |
| Concepts secondaires | pages, changements, alertes, fréquence, limites d'extraction | tableau, prix comparable, médiane, écarts, hypothèses, décision | Vocabulaire prix/concurrents partagé, périmètre différent |
| Quels concurrents / produits comparer ? | Choix du périmètre à surveiller | Groupe de comparaison au service d'une question précise | Moyen : prérequis partagé, aucune prétention à zéro chevauchement |
| Comment comparer les offres ? | Précautions de comparaison | Normalisation détaillée variantes, réduction, livraison, taxes, date | Moyen : développé par des calculs et deux références |
| Comment collecter / automatiser ? | Sujet central, pages compatibles et alertes | Bref contexte avec lien vers le premier guide | Faible : aucune section de sélection de logiciel ou configuration d'alertes |
| Comment interpréter un écart ? | Contexte de la veille | Médiane, dénominateur, causalité, limites et hypothèses | Faible, valeur ajoutée centrale |
| Quelle décision prendre ? | Exploiter la veille dans une routine | Conclusion limitée, action et critère de validation | Faible, note de décision explicite |
| Exemples | Organisation d'une veille | Vêtements fictifs, huit lignes, inversion du classement avec livraison | Nouveau cas, aucune observation réelle revendiquée |
| Résultats recherchés | Guides de veille et monitoring | Benchmark / méthode d'analyse des prix | Recoupement partiel possible sur la comparaison ; aucun résultat SEO garanti |

## Exemple, calculs et CSV

Tout est fictif, y compris la date d'observation du 1 septembre 2026 : elle n'est pas une date de publication. Même article, variante, destination et commande d'un article ; livraison et retours supposés comparables uniquement dans l'exemple. FR EUR TTC ; EN USD avant sales tax, donc pas un total final de checkout.

| Référence | Boutique | A | B | C | Médiane concurrents | Écart boutique |
|---|---:|---:|---:|---:|---:|---:|
| T01 | 30 + 5 = 35 | 28 + 8 = 36 | 32 + 0 = 32 | 35 × 0,8 + 6 = 34 | 34 | +1 ; +2,94 % |
| S01 | 60 + 5 = 65 | 58 + 8 = 66 | 64 + 0 = 64 | 70 × 0,8 + 6 = 62 | 64 | +1 ; +1,56 % |

Écart relatif = (prix boutique − médiane) / médiane × 100. A affiche moins que B sur T01 mais revient à 4 de plus avec livraison. Aucun vendeur universellement moins cher ; pas de moyenne ou panier construit en additionnant artificiellement les frais d'envois unitaires.

CSV FR et EN : 29 colonnes, en-tête et ligne vide, UTF-8 BOM, aucun calcul automatisé. Les champs couvrent question, scénario, vendeur, référence/variante, devise/taxes, prix/remise/conditions, livraison/frais, prix comparable, date/source/vérification, conditions, référence/médiane/écarts, constat/hypothèse/limites, action/responsable/critère/date de revue. Ressource éditoriale manuelle, pas export ni fonctionnalité de ChangeWatch.

## Neuf critères SEO/GEO

1. Intention explicitement limitée au positionnement prix.
2. Recherche et comparaison ci-dessus ; bénéfice pédagogique identifié.
3. H1 descriptif, sept H2 et sous-sections logiques (inventaire ci-dessous).
4. Réponse autonome dès le premier paragraphe.
5. Concurrents, normalisation, médiane, incertitudes et décision traités naturellement.
6. Sources primaires citées, exemple fictif identifié, volumes attribués au propriétaire.
7. Title/description propres à chaque langue, URLs courtes, illustrations locales et images sociales PNG.
8. HTTP local 200, indexabilité, canonical/hreflang réciproques, BlogPosting/BreadcrumbList, accessibilité testée.
9. Liens contextuels vers le guide existant, les sections commerciales, index FR/EN et sitemap.

Aucune datePublished/dateModified ni date sociale de publication sur les nouveaux articles. Les mentions Brouillon/Draft devront être retirées et les vraies dates ajoutées uniquement au moment d'une publication autorisée. FR : 1 832 mots / 10 min ; EN : 1 613 mots / 9 min, calcul à 200 mots/min arrondi au supérieur.

## URL avant / après

| Avant | Après | État |
|---|---|---|
| /blog/ | identique | Carte ajoutée |
| /en/blog/ | identique | Carte ajoutée |
| /blog/veille-concurrentielle-ecommerce/ | identique | Fichier intégralement préservé |
| /en/blog/ecommerce-competitor-monitoring/ | identique | Fichier intégralement préservé |
| — | /blog/analyser-la-concurrence/ | Nouveau brouillon |
| — | /en/blog/competitor-price-analysis/ | Nouveau brouillon |
| /blog/outil-veille-tarifaire/ (ancien brouillon rejeté) | absent | Ni publication ni redirection |
| /en/blog/price-monitoring-software/ (ancien brouillon rejeté) | absent | Ni publication ni redirection |

Toutes les autres routes publiées sont conservées. Aucun changement des pages commerciales, juridiques, Stripe, Formspree, Turnstile, CNAME, robots ou moteur. Consentement : seuls les nouveaux chemins et libellés fixes sont ajoutés aux listes autorisées ; logique inchangée.

## Tests réellement exécutés

Six processus indépendants, tous terminés avec code 0 :

| Commande | Résultat |
|---|---|
| node --use-system-ca tests/browser.cjs | PASS : navigation, formulaires simulés succès/erreur/réseau/timeout, Turnstile simulé, démo/clavier/mouvement réduit, responsive, liens |
| node --use-system-ca tests/consent.cjs | PASS : aucun Analytics avant consentement/refus, événements contrôlés, retrait/cookies, synchronisation, stockage |
| node --use-system-ca tests/consent-ux.cjs | PASS : 320/375/390/1440, disposition et absence de débordement |
| node --use-system-ca tests/i18n.cjs | PASS : FR/EN, navigation, SEO, formulaire et consentement simulés, axe, démo |
| node --use-system-ca tests/blog-launch.cjs | PASS : sitemap/liens/ressources, anciens articles, offres et consentement ; journal « 12 pages » historique, boucle sur les 14 entrées effectives |
| node --use-system-ca tests/analysis-guide.cjs | PASS : deux articles, huit calculs, deux médianes/écarts, CSV29, SEO/schema sans dates, images, liens, navigation sans JS, consentement et chemins nettoyés |

Runtime Node avec confiance système et Edge headless / Playwright. Variables requises : PLAYWRIGHT_MODULE vers le module Playwright installé ; CW_AXE_PATH vers axe-core 4.10.3. Aucun contournement TLS.

Nouveaux articles contrôlés à 320, 375, 390, 768, 1024 et 1440 px : pas de débordement de page, tableau défilant au clavier, skip link, alternatives d'images. Axe à 320 et 1440. Texte à 200 % sur 320 et zoom CSS à 200 % sur desktop (pas un test du zoom natif). Captures générées à 375/390/1440 et 320 texte agrandi. Inspection visuelle des en-têtes FR390/EN375/EN1440 et illustrations FR1440/EN390 : lisibles sans texte tronqué.

Tous les services externes sont simulés dans les tests navigateur (GA4, Formspree, Turnstile). Aucun paiement ni demande de contact réelle. Les événements observés dans ces tests ne prouvent pas leur réception dans GA4. Aucun contrôle en production des nouvelles URL, puisqu'elles ne sont pas publiées. Pas de certification juridique, audit manuel lecteur d'écran, Safari/iOS/Firefox ou Lighthouse.

## Captures

Voir [FR mobile](screenshots/fr-390-header.png), [EN mobile](screenshots/en-375-header.png), [FR desktop](screenshots/fr-1440-header.png), [EN desktop](screenshots/en-1440-header.png), [illustration FR](screenshots/fr-1440-diagram.png), [illustration EN](screenshots/en-390-diagram.png). Les captures intégrales mobiles/desktop sont dans le même dossier.

## À valider avant publication

Validation propriétaire du sujet et des deux textes ; pays/date du relevé Semrush restent inconnus. Relire le choix éditorial EN américain. À autorisation seulement : remplacer les mentions de brouillon, ajouter la vraie date et contrôler les services réels ainsi que les nouvelles URL après déploiement. PR #6 doit rester en brouillon jusque-là.

## Inventaire exact des titres

### blog/veille-concurrentielle-ecommerce/index.html

- H1 : Veille concurrentielle e-commerce : une méthode pour décider
- H2 : 01. Partez de vos décisions, pas d’une liste de concurrents
- H2 : 02. Construisez un périmètre que vous pouvez expliquer
- H2 : 03. Comparez la même offre, pas seulement deux nombres
- H2 : 04. Choisissez ce qui reste manuel et ce qui peut être automatisé
- H3 : À quoi ressemble un changement détecté ?
- H2 : 05. De la page surveillée à l’alerte ChangeWatch
- H2 : 06. Vérifiez la couverture réelle et ses limites
- H2 : 07. Transformez chaque alerte en une petite routine de décision
- H2 : Commencez avec un périmètre clair
- H3 : Gardez votre temps pour l’analyse.

### en/blog/ecommerce-competitor-monitoring/index.html

- H1 : Ecommerce competitor monitoring: a practical guide
- H2 : 01. What decisions should competitor monitoring support?
- H2 : 02. Which competitor pages should you monitor?
- H2 : 03. How do you compare competitor prices fairly?
- H2 : 04. Manual checks or automated competitor monitoring?
- H3 : What does a detected change look like?
- H2 : 05. How does ChangeWatch turn a page change into an alert?
- H2 : 06. What are the limits of automated page monitoring?
- H2 : 07. What should you do after a competitor alert?
- H2 : Start with a clearly defined set of pages
- H3 : Keep your time for analysis.

### blog/analyser-la-concurrence/index.html

- H1 : Analyser la concurrence : tableau et exemple e-commerce
- H2 : 01. Définir la question que l'analyse doit trancher
- H2 : 02. Choisir un groupe de comparaison défendable
- H2 : 03. Construire un tableau où chaque ligne se vérifie
- H3 : Normaliser sans effacer les différences
- H2 : 04. Mesurer les écarts, produit par produit
- H3 : Choisir et nommer son point de référence
- H2 : 05. Séparer constat, hypothèse et conclusion
- H2 : 06. Formuler une décision et une manière de la vérifier
- H3 : Reproduire la méthode avec vos données
- H2 : Du relevé à une conclusion défendable

### en/blog/competitor-price-analysis/index.html

- H1 : Competitor price analysis: a method with a worked example
- H2 : 01. Start with a pricing question you can answer
- H2 : 02. Build a defensible comparison group
- H2 : 03. Keep the raw offer separate from the comparable price
- H3 : Normalize only what you can justify
- H2 : 04. Calculate gaps for each item
- H3 : Name the reference before quoting a percentage
- H2 : 05. Separate the observation from the explanation
- H2 : 06. Write a decision brief with a validation step
- H3 : A blank template that follows the method
- H2 : Turn a price table into a defensible conclusion
