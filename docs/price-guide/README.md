# Guide de choix bilingue — validation éditoriale et technique

Date de travail : 21 septembre 2026. Branche : `codex/price-monitoring-guide`.
Base : `ad3dd03fb54de7a8bd12d7e11dd779f8bccafc9f` (main après fusion de la PR #5).
Statut : contenu destiné à une PR **en brouillon**, sans fusion ni déploiement.

## A. Recherche de mots-clés

### Méthode et preuve de volume

Source : **Ahrefs Free Keyword Generator**, moteur Google, interface consultée le **2026-09-21**. Le pays a été sélectionné dans l'interface et vérifié pour chaque recherche. Les expressions sont françaises ou anglaises ; aucun filtre de langue distinct n'était affiché. Les valeurs ci-dessous sont une **transcription manuelle des lignes réellement affichées**, pas un export Ahrefs, ni des volumes exacts. L'export du navigateur intégré n'était pas disponible. Les liens permettent de reproduire les recherches dans l'outil interactif ; les estimations peuvent évoluer.

L'outil gratuit affiche des classes `>100` et `<100` recherches mensuelles estimées. `>100` satisfait le seuil demandé de 50 ; `<100` ne permet pas de le prouver. Aucun volume mondial, Google Trends ou nombre de résultats n'est utilisé pour valider ce seuil. [Présentation de l'outil et de ses estimations](https://ahrefs.com/keyword-generator).

| Sujet candidat | Mot-clé FR, France | Mot-clé EN, États-Unis | Source interactive FR / EN | Décision |
|---|---|---|---|---|
| Choix d'un outil | `outil veille tarifaire` : **>100** / mois | `price monitoring software` : **>100** / mois | [FR : résultats du seed veille tarifaire](https://ahrefs.com/keyword-generator/?country=fr&input=veille%20tarifaire) / [EN](https://ahrefs.com/keyword-generator/?country=us&input=price%20monitoring%20software) | Retenu : les deux seuils sont démontrés par les classes affichées |
| Changements de sites | `surveillance site web` : **<100** / mois | `website change monitoring` : **>100** / mois | [FR](https://ahrefs.com/keyword-generator/?country=fr&input=surveillance%20site%20web) / [EN](https://ahrefs.com/keyword-generator/?country=us&input=website%20change%20monitoring) | Écarté : seuil FR non démontré |
| Alertes prix | `alerte prix` : **<100** / mois | `price alerts` : **>100** / mois | [FR](https://ahrefs.com/keyword-generator/?country=fr&input=alerte%20prix) / [EN](https://ahrefs.com/keyword-generator/?country=us&input=price%20alerts) | Écarté : seuil FR non démontré, intentions grand public |

Précisions de lecture : le seed FR `veille tarifaire` lui-même affichait `<100` ; c'est bien la ligne distincte **`outil veille tarifaire`** qui affichait `>100`. Ne pas confondre les deux. Pour la sélection EN, la colonne de mise à jour affichait « 6 September » ; pas de date de mise à jour exploitable pour la ligne FR sélectionnée. La date de consultation n'est pas une date de collecte sous-jacente. L'outil ne fournit ici ni chiffre précis, ni intervalle supérieur borné, ni garantie de trafic.

### Comparaison éditoriale des candidats

| Sujet | Intention / questions connexes | Types de résultats et pertinence B2B | Cannibalisation et angle possible |
|---|---|---|---|
| Outil de veille tarifaire / price monitoring software | Investigation commerciale : quel périmètre, quelles variantes, quelle fréquence, quelles alertes, quel coût ? | Pages de solutions et comparatifs de fournisseurs, directement reliés aux acheteurs potentiels | Guide existant = organiser une veille ; accueil = acheter ChangeWatch. Nouveau guide = qualifier un outil à partir de preuves sur ses pages. Risque limité par cette distinction, à suivre après publication |
| Surveillance site web / website change monitoring | Repérer un changement ; fréquence, zones surveillées, alerte ou disponibilité du site ? | Outils de changements, mais ambiguïté FR avec la disponibilité technique ; pertinence variable | Risque plus fort avec le fonctionnement déjà expliqué sur l'accueil et le guide. Angle possible : qualifier des pages, mais seuil FR non prouvé |
| Alerte prix / price alerts | Recevoir une notification au bon moment ; produit, seuil, promotions | Suggestions/résultats mêlant voyages, Amazon, consommateurs et instruments financiers ; moins qualifiés pour notre B2B | Faible répétition du guide, mais risque d'attirer des acheteurs particuliers. Angle professionnel possible sans validation de volume FR |

Choix : un guide de décision, avec grille vierge à télécharger et statut « inconnu » explicite. Les expressions anglaises ont été recherchées indépendamment, pas validées par traduction du volume français. Aucune facilité de positionnement ni première place n'est promise.

## B. Analyse concurrentielle

Recherches consultées le 21 septembre 2026 : expressions exactes puis `outil veille tarifaire choisir logiciel France` et `price monitoring software ecommerce how to choose USA`, complétées par des recherches ciblées sur les domaines rencontrés. Le moteur de recherche fourni par l'environnement **ne permet pas de certifier une SERP Google géolocalisée France/US, son ordre, ni l'absence de personnalisation**. Les lignes ci-dessous ne sont donc pas des positions Google. Pays vérifiés pour les volumes Ahrefs, pas pour les classements. Objectif idéal de dix pages par marché non atteint : six pages FR et sept EN réellement consultées ; les extraits et la redirection sont séparés.

### Pages FR réellement ouvertes et lues

| Page / type | Structure, questions et atouts observés | Preuve, fraîcheur et limite utile à notre angle |
|---|---|---|
| [Minderest](https://www.minderest.com/fr), accueil commercial « La Plateforme de AI Pricing » | Monitoring, réaction, prédiction ; pricing/catalog intelligence et repricing ; visuels produit et logos | Affirmations et résultats auto-déclarés par le fournisseur, non validés ici. Pas de date éditoriale confirmée. Notre guide demande des observations sur les URL du lecteur plutôt qu'une extrapolation de résultats clients |
| [La Fabrique du Net](https://www.lafabriquedunet.fr/logiciels/marketing-digital/veille-tarifaire), comparatif 2026 | Cartes, notes, fonctionnalités et prix de solutions ; aide à la présélection | Le millésime est affiché ; pas de date exacte confirmée. Les scores ne constituent pas une preuve de compatibilité de nos pages. Notre contribution commence après la shortlist |
| [BDM Tools](https://www.blogdumoderateur.com/tools/marketing-digital/veille-tarifaire/), sélection de cinq outils | Répertoire court, descriptions de solutions, fonctions et orientation vers les outils | Date exacte non confirmée ; format utile pour découvrir, moins détaillé sur le protocole d'évaluation. Ne pas en déduire l'absence de méthode sur toutes les pages liées |
| [Rivalyse](https://rivalyse.com/veille-tarifaire-logiciel/), comparatif commercial | Surveillance, alertes, historique, repricing, export/intégration ; exemples illustrés | Capacités et fréquences présentées par le vendeur, non testées ici. Pas de date exacte confirmée. Notre guide sépare les fonctionnalités au lieu de supposer qu'elles accompagnent toute alerte |
| [Retail Shake](https://www.retailshake.com/), accueil de solution | Veille large, parcours marques/distributeurs, tableaux de bord et logos | Promesses de couverture/fiabilité non reprises comme faits ; pas de date éditoriale confirmée. Notre périmètre est explicitement borné et n'assimile pas une URL à un catalogue |
| [Price Observatory](https://www.price-observatory.com/fr/solutions/e-commercants/veille-tarifaire/), page solution | Matching, positionnement prix, promotions, vues de suivi ; CTA démonstration et livre blanc | Description fournisseur, pas benchmark indépendant. Date non confirmée. Notre grille rend la correspondance et les limites vérifiables par le lecteur |

### Pages EN réellement ouvertes et lues

| Page / type | Structure, questions et atouts observés | Preuve, fraîcheur et limite utile à notre angle |
|---|---|---|
| [Shopify](https://www.shopify.com/blog/ecommerce-price-monitoring-tools), « Ecommerce Price Monitoring Tools: 10 Top Options » | Guide puis dix options, fonctionnalités, intégrations, liens fournisseurs ; contexte e-commerce/B2B | Date exacte non relevée ; liste utile pour découvrir les catégories, mais pas preuve d'extraction sur les pages du lecteur. Nous ne recopions ni tarifs ni performances |
| [Pricefy](https://www.pricefy.io/), accueil logiciel | Matching, repricing, canaux, intégrations et forfaits ; visuels et logos | Promesses de précision/fréquence auto-déclarées, non validées ; pas de date confirmée. Notre article demande la preuve et l'unité facturée |
| [PricingHunter](https://www.pricinghunter.com/resources/best-price-monitoring-tools), « 10 Best Price Monitoring Tools…2026 » | Tableau, avantages/inconvénients, coûts, captures et sélection ; propre outil présenté en premier | Mise à jour affichée 6 mai 2026, auteur Manuel Velazquez. Comparatif rédigé par un fournisseur ; l'expérience revendiquée n'est pas la nôtre. Nous n'attribuons pas de notes sans observations |
| [ChangeTower](https://changetower.com/solutions/product-monitoring/), page produit | Exemples prix/stock/promotions et éléments manquants ; captures/HTML archivés, alertes | La date visible dans une interface d'exemple n'est pas une date de publication. Des exemples concrets existent déjà ; notre ajout est la qualification de la fraîcheur et des inconnues |
| [Price2Spy](https://www.price2spy.com/blog/top-price-monitoring-tools/), « Top 8…2026 » | Choix selon taille du catalogue et modèle commercial, présentation des outils | 29 janvier 2026, Marijana Bjelobrk, lecture annoncée six minutes. Guide fournisseur ; notre guide ne se présente pas comme une comparaison de logiciels testés |
| [Preismonitoring](https://www.preismonitoring.de/en/solutions), page solution | Champs collectés, identifiants, fréquence, alertes, périmètres sélectionnés ou catalogues, interfaces | Pas de date confirmée ; possibilités commerciales décrites, pas résultats indépendants. Notre angle force la définition de la portion réellement accessible |
| [Changeflow](https://changeflow.com/solutions/price-monitoring), page commerciale | Petits ensembles de pages, alertes email/Slack/Teams, exemples de prix et historique | Fréquence/compatibilité annoncées non validées ici ; date non confirmée. Notre article ne reprend pas ces intégrations pour ChangeWatch |

### Extraits seulement et page redirigée

- [Siècle Digital, guide d'outils](https://siecledigital.fr/2025/10/23/le-guide-des-meilleurs-outils-de-veille-tarifaire/) : extrait vu (choix notamment géographique), date 23 octobre 2025 dans l'URL ; ouverture impossible avec l'outil. **Corps non consulté.**
- [RetailGrid, choix logiciel](https://www.retailgrid.io/blog/choosing-price-monitoring-software-ecommerce-2026) : extrait daté du 13 juillet 2026 ; ouverture redirigée vers [un guide d'indice de prix](https://www.retailgrid.io/blog/how-to-calculate-price-index-retail-guide). Ne pas compter le guide de choix comme lu.
- Autres extraits EN rencontrés : répertoire SourceForge (tri sponsorisé), comparatifs Pricelysis/PriceMonitor et guide PriceIntelligence. Des démarches par critères/preuves existent déjà. Nous ne revendiquons pas l'invention du concept de checklist ni un manque universel chez les concurrents.

### Valeur ajoutée retenue

Passer de « quelles marques de logiciels ? » à « quelles preuves suffisent pour mon périmètre ? ». Deux exemples localisés, distinction stable/changé/inconnu, variantes et frais, protocole qui autorise « non vérifié », grille CSV vierge, critères éliminatoires avant confort et coût. Le lecteur peut conclure que ChangeWatch n'est pas adapté à un besoin de repricing ou de catalogue exhaustif. Structure et dessins rédigés/créés pour cet article ; aucun visuel concurrent reproduit.

## C. Stratégie éditoriale

Inventaire initial : un guide général FR `/blog/veille-concurrentielle-ecommerce/` et son équivalent EN `/en/blog/ecommerce-competitor-monitoring/`, deux index de blog, accueil et démonstrations FR/EN, documents juridiques. La PR #5 est fusionnée dans la base. Aucun deuxième guide de choix ne préexistait dans ce périmètre.

- **Intention principale :** aider un responsable e-commerce à choisir/qualifier un outil, avant abonnement.
- **Secondaires FR :** logiciel de veille tarifaire, comparaison des prix, variantes, fréquence, couverture, alerte email. **EN :** competitor price tracking, product matching, data freshness, monitoring scope, price alerts, repricing. Pas de volume revendiqué pour ces secondaires.
- **Cluster :** guide général → guide de qualification → démonstration fictive / compatibilité / tarifs. Le nouveau guide explique pourquoi certaines demandes ne conviennent pas à un suivi par URL.
- **Localisation :** FR vocabulaire veille tarifaire, exemple TTC/livraison en euros ; EN expression effectivement recherchée, vocabulaire catalog/SKU/matching, exemple américain en dollars avant taxes. Précision explicite : les forfaits ChangeWatch sont facturés en euros.
- **Auteur/éditeur :** ChangeWatch — Cybersignal, identités organisationnelles déjà utilisées ; aucune expertise personnelle ni expérience de test fournisseur inventée.

H1 FR : « Outil de veille tarifaire : comment choisir pour votre e-commerce ».
H1 EN : « Price monitoring software: how to choose for your ecommerce team ».

Les sept H2 suivent le même raisonnement : type de besoin → unité de suivi → six critères → protocole → décision → adéquation de ChangeWatch → synthèse/action. Les six H3 de critères couvrent variante, base de prix, fraîcheur, couverture, alerte exploitable et coût. Les encarts de téléchargement et de conclusion ont leurs propres H3. Sommaire de sept ancres, pas de FAQ artificielle.

## D. SEO / GEO et intégration

| Élément | FR | EN |
|---|---|---|
| URL / canonical | `https://changewatch.cybersignal.fr/blog/outil-veille-tarifaire/` | `https://changewatch.cybersignal.fr/en/blog/price-monitoring-software/` |
| Title | Outil de veille tarifaire : comment choisir pour votre e-commerce \| ChangeWatch | Price monitoring software: how to choose for your ecommerce team \| ChangeWatch |
| Description | Comparez les outils de veille tarifaire sur vos pages réelles : variantes, couverture, fréquence, alertes et coûts. Grille de qualification à télécharger. | Evaluate price monitoring software on your own pages. Check matching, coverage, data freshness, alerts and costs with a downloadable buyer’s checklist. |
| Langue | HTML `fr`, schéma `fr-FR`, OG `fr_FR` | HTML `en`, schéma `en-US`, OG `en_US` |
| Corps / lecture | 1 679 mots, 9 minutes | 1 532 mots, 8 minutes |
| Image sociale | `assets/price-monitoring-social-fr.png` | `assets/price-monitoring-social-en.png` |

Comptage du texte du corps en séparant les balises, arrondi supérieur à 200 mots/minute. Titres, navigation et bloc auteur hors corps. Le calcul est vérifié dans le navigateur contre `wordCount` et `timeRequired`.

Chaque page possède : canonical propre, hreflang `fr` et `en` réciproques, `x-default` français par cohérence avec le site sans redirection géographique, sélecteur de langue vers l'autre article, OG/Twitter localisés, BlogPosting et BreadcrumbList, auteur/éditeur Organization imbriqués. EN `translationOfWork` référence le nouvel article FR, pas l'ancien guide. Aucun FAQ schema ni promesse de rich result.

Dates des **brouillons** : 21 septembre 2026, visibles, OG et schéma cohérents. **Si la publication intervient un autre jour, adapter la date de publication réelle et les dates de modification concernées, les cartes, le sitemap et le test avant fusion.** Aucun contenu n'a été présenté comme déjà disponible en production. Les anciens corps d'article et leurs dates de révision éditoriale restent conservés ; seul un encart de lecture complémentaire extérieur au corps est ajouté. Le sitemap signale cette modification de page.

Routes créées comme dossiers contenant `index.html`, compatibles avec le service statique existant. Liens publics et sitemap utilisent uniquement les nouvelles URL avec slash final, aucune nouvelle URL publique `.html`. L'alias technique `/index.html` a le même canonical propre ; il n'est ni lié ni ajouté au sitemap. Pas de nouvelle infrastructure ou règle de redirection. Réponse locale HTTP 200 vérifiée ; vérification réelle GitHub Pages impossible avant déploiement autorisé.

Maillage : deux nouvelles cartes d'index, anciens guides → nouveau guide correspondant, nouveau guide → ancien guide, accueil `#alertes`, `#tarifs`, `#demande`, CGV de la même langue. Fil d'Ariane adapté. Sitemap : **14 URL**. Ajout des deux routes propres et de leurs alias aux listes Analytics autorisées ; seulement des libellés fixes et chemins contrôlés, sans paramètres ni fragments transmis. Aucune modification de la logique de consentement ni ajout de nouvel événement.

GEO : réponse autonome au début, définitions SKU/URL/repricing, paragraphes contextualisés, distinction observations/promesses/exemples, méthode reproductible et sources officielles. Cela facilite l'interprétation ; **aucune garantie de classement, trafic ou citation IA**.

## E. Fiabilité et neuf critères

Sources publiques réellement consultées puis vérifiées en HTTP 200 le 21 septembre, TLS actif :

- [GTIN, Google FR](https://support.google.com/merchants/answer/6324461?hl=fr) : rôle de l'identifiant produit.
- [Product data specification, Google EN](https://support.google.com/merchants/answer/7052112?hl=en) : identifiants, variantes, prix, disponibilité.
- Prix : [FR](https://support.google.com/merchants/answer/6324371?hl=fr) / [EN](https://support.google.com/merchants/answer/6324371?hl=en).
- Prix soldé : [FR](https://support.google.com/merchants/answer/6324471?hl=fr) / [EN](https://support.google.com/merchants/answer/6324471?hl=en).

Ces sources décrivent Merchant Center, pas les performances des outils concurrents ni la compatibilité de ChangeWatch. Cette limite figure dans le texte. Les recommandations de qualification sont une méthode éditoriale proposée, pas les résultats d'une étude. Les exemples chiffrés sont explicitement fictifs et calculables : 5 × 3 = 15 URL ; 99 + 8 = 107 contre 104 ; 80 + 10 = 90 contre 85, avant taxes dans l'exemple US.

Faits produit vérifiés contre les pages/README/CGV de la base : B2B, mise en place manuelle incluse, 5/15/40 URL, une fois par jour ou jusqu'à trois fois avec Pro, email, limites d'extraction/pagination/JavaScript/protections, absence de prise en charge des pages avec connexion. Pas de promesse de temps réel, couverture universelle/exhaustive, correspondance automatique de catalogue, repricing, essai gratuit, export ou intégration inexistante. Les CSV sont expressément des feuilles vierges à remplir dans le tableur du lecteur, pas un export de données du service.

| Critère obligatoire | FR et EN — élément vérifiable |
|---|---|
| 1. Intention principale | Guide de choix et qualification, distinct du guide général et de la vente sur l'accueil |
| 2. Analyse / valeur ajoutée | Section B, résultats lus séparés des extraits ; protocole sur pages propres et grille vierge |
| 3. H1 / hiérarchie | Un H1, sept H2 avec ancres, H3 de critères et CTA ; contrôlés dans DOM et axe |
| 4. Réponse directe | Encadré « La réponse courte / The short answer » immédiatement après l'introduction |
| 5. Concepts associés | Variantes, GTIN, SKU, taxes/livraison, fraîcheur, échecs, matching, repricing, coût/périmètre |
| 6. Sources / honnêteté | Six liens primaires vérifiés, exemples étiquetés fictifs, aucune statistique de performance ou expérience inventée |
| 7. Métadonnées / images | Tableau D ; sociaux PNG localisés avec sources SVG, description, alt et dimensions |
| 8. Accessibilité / indexabilité | Tests clavier/axe/responsive/no-JS, canonical propre et absence de noindex ; indexation Google non garantie |
| 9. Maillage / cluster | Cartes, guides réciproques, démo/tarifs/compatibilité/juridique dans la langue du lecteur |

## F. Qualité visuelle

Identité existante préservée : bleu profond, bleu de lien, fond clair, typographie du site, largeur éditoriale, sommaire et tableaux existants. Nouveau CSS limité à `.buying-guide`, sans dépendance ni animation ajoutée.

Créations locales : deux schémas SVG verticaux **440 × 630** (états de la donnée) et deux SVG sociaux **960 × 500**, rendus en PNG. Les SVG restent les sources modifiables ; pas d'image issue d'un concurrent. Schémas différés et dimensions fixées ; textes localisés et alternative descriptive, caption expliquant l'absence de preuve lorsque la collecte échoue. Les visuels ne prétendent pas représenter une interface ChangeWatch.

Captures du rendu local final, Edge headless, refus enregistré pour observer le contenu :

| Langue | Mobile | Desktop | Schéma |
|---|---|---|---|
| FR | [375 px](screenshots/fr-375-header.png), [390 px](screenshots/fr-390-header.png), [page complète 375](screenshots/fr-375.png) | [1440 px](screenshots/fr-1440-header.png), [page complète](screenshots/fr-1440.png) | [390 px](screenshots/fr-390-diagram.png) |
| EN | [375 px](screenshots/en-375-header.png), [390 px](screenshots/en-390-header.png), [page complète 375](screenshots/en-375.png) | [1440 px](screenshots/en-1440-header.png), [page complète](screenshots/en-1440.png) | [375 px](screenshots/en-375-diagram.png) |

[FR texte 200 % à 320 px](screenshots/fr-320-text200.png) / [EN texte 200 % à 320 px](screenshots/en-320-text200.png).

Revue visuelle : titres, rythmes, boutons et diagrammes lisibles aux dimensions ciblées ; tableaux conservés dans une zone de défilement accessible au clavier. Les captures de page entière sont très longues : utiliser les extraits pour juger les tailles, pas une miniature réduite. Axe WCAG 2 A/AA et 2.1 AA : aucune violation retournée sur les nouvelles pages aux largeurs 320 et 1440. Cela ne constitue pas une certification WCAG.

## G. Résultats techniques réellement exécutés

Environnement : Windows, Node avec `--use-system-ca`, Playwright/Edge headless, axe-core 4.10.3 local. Aucune désactivation de TLS. Suites lancées indépendamment, serveurs locaux distincts. Variables pour reproduire (adapter les chemins au poste) :

```powershell
$env:PLAYWRIGHT_MODULE='C:/Users/flavi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'
$env:CW_AXE_PATH="$env:TEMP/changewatch-axe.min.js"
node --use-system-ca tests/browser.cjs
node --use-system-ca tests/consent.cjs
node --use-system-ca tests/consent-ux.cjs
node --use-system-ca tests/i18n.cjs
node --use-system-ca tests/blog-launch.cjs
node --use-system-ca tests/price-guide.cjs
git diff --check
```

| Suite / contrôle | Résultat observé |
|---|---|
| `browser.cjs` | **PASS, code 0.** Structure FR, liens, 320/375/390/768/1024/1440, menu/clavier, Stripe exact, formulaire sans jeton puis succès/HTTP/réseau/timeout simulés, préservation des champs/réinitialisation Turnstile, démonstrateur, mouvement réduit, ancien blog |
| `consent.cjs` | **PASS, code 0.** Aucune requête Google avant/refus, un tag/page, événements autorisés, pas de données de formulaire, retrait runtime/cookies et multi-onglets, stockage bloqué/expiration. **Tag déterministe simulé**, pas réception GA4 réelle |
| `consent-ux.cjs` | **PASS, code 0.** 320/375/390/1440, boutons visibles, aucun débordement ; le bandeau recouvre encore une partie du premier écran à 320 comme sur la base. Desktop 1440×720 : CTA non recouvert |
| `i18n.cjs` | **PASS, code 0.** Dix pages FR/EN existantes, SEO réciproque, six largeurs, clavier, axe configuré, formulaire EN quatre issues simulées, tarifs/Stripe, consentement partagé, démonstrations et absence de JS bloquant |
| `blog-launch.cjs` | **PASS, code 0.** Parcourt les **14** routes du sitemap, toutes ressources/liens/ancres locaux, anciens guides/index, offre standard/promotion inchangée, six largeurs, absence de JS, consentement et événements simulés. L'ancien message console était figé à « 12 » : corrigé pour afficher le nombre réellement parcouru, sans affaiblir les assertions |
| `price-guide.cjs` (nouveau) | **PASS, code 0.** Deux routes, schema/count/temps/dates, canonical/hreflang, ancres cliquées, CSV 15 colonnes, image décodée, six largeurs, axe 320/1440, clavier skip-link/table, texte 200 % à 320, mise en page CSS zoom 200 % à 1440, aller-retour FR/EN, no-JS, refus/acceptation/retrait, un `page_view` simulé sur chaque route et alias sans query/hash privés, aucun appel Formspree/Stripe |
| Sources externes des articles | Six GET HTTPS réels : **HTTP 200**, aucune redirection, TLS actif ; résultats enregistrés dans [external-links.json](external-links.json) |
| Fichiers protégés / diff | CNAME, robots, vérification Google, accueils/tarifs/Payment Links, script formulaire, démonstrateur, styles partagés et consentement visuel, CGV/confidentialité inchangés ; modification JS limitée aux listes de routes Analytics. `git diff --check` sans erreur |

### Échecs rencontrés et corrections

1. Un premier script d'assemblage dépassait la longueur de commande Windows : aucun fichier produit par cette tentative. Découpage en fichiers temporaires plus courts ; assemblage exécuté ensuite.
2. Le nouveau test a détecté un débordement de texte à **320 px / 200 %** (largeur de document 380 px). Correction locale : `overflow-wrap:anywhere` sur `.buying-guide`, retour à la ligne des boutons. Nouveau passage : largeur 320 px, aucune troncature masquée par `overflow:hidden`.
3. L'essai initial de zoom CSS 200 % sur un viewport de 320 px imposait environ 160 px de largeur utile à l'ensemble du site. Le contrôle de zoom de mise en page est réalisé à 1440 px, en complément de l'agrandissement de texte à 320 px. Ce n'est **pas** un contrôle du zoom natif via le menu du navigateur ; cette distinction reste explicite.
4. Pas de test supprimé à cause d'un échec fonctionnel. Les suites de base ont passé ; la nouvelle suite a été relancée après correction puis pour générer les captures finales.

Poids des nouveaux médias : schémas SVG environ 1,7 Ko chacun ; PNG sociaux FR 25 537 octets, EN 30 611 octets. Dimensions réservées, aucun nouveau JavaScript de production au-delà des routes, aucune bibliothèque ajoutée. Pas de mesure Lighthouse/Core Web Vitals en production ni benchmark réseau mobile : ces chiffres ne sont pas inventés.

## H. Réserves avant publication

- **PR brouillon uniquement.** Validation éditoriale et visuelle du propriétaire requise avant fusion. Aucun déploiement déclenché par cette mission.
- Adapter les dates de publication si la mise en ligne n'a pas lieu le 21 septembre 2026, puis relancer les tests concernés.
- Après publication autorisée : vérifier les deux URL et leurs images/CSV en HTTP 200 sur le domaine public, canonicals, sitemap, rendu et éventuelles caches. La structure `dossier/index.html` est testée localement, pas sur une publication inexistante.
- Les volumes sont des estimations Ahrefs par classes ; aucun volume précis ni rang garanti. L'analyse des résultats n'est pas un relevé certifié des dix premières positions Google dans chaque pays. Un contrôle manuel localisé peut compléter ce travail.
- Confirmer l'indexation et les requêtes réelles dans Search Console après publication ; les effets SEO/GEO restent inconnus.
- Formspree, Turnstile et Analytics ont été **simulés dans les tests navigateur**. Aucun paiement ni contact réel ; pas de validation de livraison email, de challenge Turnstile réel, de réception des événements dans GA4 ni de nouvelle validation des paramètres Stripe distants. Les intégrations et URL existantes restent inchangées.
- Le zoom natif navigateur à 200 %, Safari/iOS, Firefox, lecteur d'écran et appareils physiques n'ont pas été testés. Axe, clavier, texte/CSS agrandis et six viewports constituent les contrôles effectivement réalisés, pas une certification d'accessibilité.
- Aucun audit juridique nouveau. Décisions antérieures conservées : coordonnées actuelles provisoires ; description du lien promotionnel Business à rétablir dans Stripe par le propriétaire. Aucun prix/coupon/paramètre externe modifié.
- Dépôt du moteur, DNS et services externes non modifiés. Aucun retour arrière de production nécessaire, puisque aucune publication n'a été effectuée.
