# Audit éditorial et SERP — 1er octobre 2026

## Périmètre et méthode

Base : `3ccfe3b287a1275a1543835479c95d8966e05a61` (main après fusion de la PR #14). Les dix articles existants ont été lus/inventoriés avant rédaction. `existing-articles.json` conserve titres, H1/H2/H3, descriptions, canonical, graphes JSON-LD complets, CTA et liens internes ; le tableau ci-dessous consigne l'interprétation éditoriale. Aucun de ces articles, URL, ressource ou métadonnée n'est modifié.

Requêtes réellement exécutées : `veille concurrentielle site internet`, `retail price monitoring`, puis `"retail price monitoring" -site:reddit.com`. Les résultats accessibles ont été ouverts, pas seulement lus dans les extraits. Observation qualitative d'un moteur de recherche via l'outil Web, au 1er octobre 2026 : ce n'est pas une mesure de positions Google géolocalisées ni un relevé exhaustif. Aucun classement, difficulté SEO ou volume indépendant n'est revendiqué.

Volumes : **~40/mois FR et ~590/mois EN fournis par le propriétaire**, issus de son fichier de recherche. Marché et date de mesure non réinventés. Ces chiffres ne figurent pas dans les articles et ne constituent pas des résultats commerciaux.

## Résultats FR inspectés

| Page ouverte | Type, couverture et profondeur | Forme et exemples | Limites observées et apport retenu |
|---|---|---|---|
| [Meltwater — analyser l'activité d'un concurrent](https://www.meltwater.com/fr/blog/analyser-activite-concurrent) | Guide long, définition, sélection des concurrents, stratégie, engagement et partage de veille | Sommaire, listes, exemples de marques, recrutement et indicateurs ; liens vers d'autres outils, dont Semrush | Périmètre beaucoup plus large qu'une liste de pages. L'exemple de recrutement décrit une période de 2013 malgré une date de mise à jour en 2026 : exemple ancien, pas preuve que tout le guide soit obsolète. Notre guide distingue annonce et embauche, et choisit une URL par question. |
| [Semrush — Veille concurrentielle](https://fr.semrush.com/kb/1206-traffic-and-market-competitor-monitoring) | Documentation produit détaillée : nouvelles pages, annonces, blogs et activité sociale | Captures et étapes de configuration ; pays, périodes et notifications ; exemples intégrés au produit | La documentation explicite le périmètre et un délai possible d'initialisation. Ce n'est pas un guide neutre de sélection des pages. Notre article ne reprend ni son plan ni ses capacités : il distingue source connue, découverte et analyse. |

Les résultats de recherche incluent aussi des pages commerciales (Mention, Hikimia, Vigile) et des listes d'outils. Ils servent à caractériser l'intention mixte, pas à valider leurs chiffres ou promesses. Ils ne sont pas cités comme preuves dans l'article. Aucun tarif concurrent ni statistique de performance n'est repris.

**Intention retenue :** « Quelles pages de ce site dois-je vraiment suivre et pour détecter quoi ? ». L'apport est une grille de dix types de pages, des rythmes explicitement indicatifs, une méthode de sélection et un exemple comportant tarifs, produit et livraison. Le guide n'est ni une liste de logiciels, ni une étude de marché, ni un second journal de veille.

## Résultats EN inspectés

| Page ouverte | Couverture et forme | Limites et distinction de notre guide |
|---|---|---|
| [Costless — Retail price monitoring](https://costless.business/en/blog/retail-price-monitoring-guide) | Guide large : définition, retailers/brands/suppliers, collecte terrain et en ligne, tableau de méthodes, matching, démarche de départ et FAQ ; promotion de sa plateforme | Couvre déjà la qualité des données : ne pas prétendre découvrir ce besoin. Notre article se limite aux offres publiques en ligne et détaille les cas d'éligibilité, de vendeur et de panier, sans comparaison d'outils ou promesse de couverture. |
| [Visualping — Retailer price monitoring](https://visualping.io/blog/retailer-price-monitoring-guide) | Guide orienté marques/revendeurs, prix/stock/avis, liste des champs d'une offre, procédure et tutoriel de l'outil avec captures ; statistiques propres au fournisseur | Il traite déjà variante, vendeur et livraison : l'absence supposée de ces sujets ne serait pas un différenciateur honnête. Notre valeur est la grille d'acceptation des offres, les cas limites de quantité/membre/seuil et le calcul transparent demandé. Ni statistiques ni promesses de rendement reprises. |
| [Monity — Retail price monitoring](https://monity.ai/guides/retail-price-monitoring/) | Tutoriel court de produit : configuration, prompts, résumés IA, pages dynamiques, arguments sur la réactivité et les ventes | Beaucoup de bénéfices annoncés et peu de démonstration chiffrée d'une offre comparable. Pas d'évaluation indépendante du produit ici. Notre guide conserve les inconnues et sépare explicitement observation, interprétation et repricing. |

Les SERP présentent aussi des infrastructures et services de collecte (Massive, Scrapewise, Datahut). Leurs extraits renforcent le caractère commercial de la requête ; leurs couvertures et performances ne sont pas validées. Pas de benchmark inventé, pas de date d'obsolescence déduite d'une ancienneté seule.

**Intention retenue :** contrôler si l'offre retail observée appartient au scénario d'achat avant de l'utiliser. Le guide couvre produit/variante, SKU, vendeur marketplace, lot, éligibilité, taxes affichées, stock, livraison et promotions. Il n'est pas une reformulation du protocole générique de traitement des alertes.

## Matrice des dix articles existants et chevauchements

| Article existant | Intention/angle propre | Recoupement avec le nouveau sujet | Garde-fou appliqué |
|---|---|---|---|
| FR `/blog/veille-concurrentielle-ecommerce/` | Organiser la veille e-commerce, son périmètre et ses décisions | Élevé si le nouveau guide restait une méthode générale | FR centré sur la sélection de types de pages, y compris FAQ, CGV, recrutement ; renvoi au guide existant pour l'organisation générale |
| FR `/blog/etude-de-concurrence/` | Étude, critères, matrice stratégique, interprétation | Sélection de concurrents | Renvoi vers la matrice, pas de nouvelle matrice de positionnement |
| FR `/blog/veille-concurrentielle-exemple/` | Dossier fictif sur cinq jours, journal et CSV | Exemples et consignation | Un cas bref sur trois sources, sans recréer le journal ni les téléchargements |
| FR `/blog/logiciel-veille-concurrentielle/` | Choisir une famille d'outils, preuve, budget | Définitions du suivi et du crawling | Pas de classement, grille d'achat ou budget dans le nouveau FR ; lien vers le guide d'achat |
| FR `/blog/surveillance-prix-concurrents/` | Relever une offre/prix, fréquence, contrôle avant décision | Fort sur les fiches produits | FR limité à leur rôle dans une sélection de pages ; détail tarifaire renvoyé à l'article existant |
| EN `/en/blog/ecommerce-competitor-monitoring/` | Organisation générale de la veille, sources et responsabilités | Méthode et périmètre | Nouveau EN consacré aux opérations retail, pas à l'organisation complète |
| EN `/en/blog/competitor-price-analysis/` | Normalisation justifiée, écarts, analyse, décision | Comparabilité et exemple arithmétique | Calcul livré unique demandé ; pas de matrice d'écarts ou de méthode stratégique, renvoi à l'analyse |
| EN `/en/blog/price-tracking-software/` | Cahier des charges et sélection de logiciel | Limites ChangeWatch | Pas de comparatif de logiciels, essai fournisseur, sizing ou ROI |
| EN `/en/blog/competitor-price-monitoring/` | Procédure répétable : cadence, statut, triage, transmission | **Fort et réel** : l'offre et ses conditions y sont déjà traitées | Ne pas refaire le protocole/triage : approfondir les sept contrôles retail, petits lots, prix membres, vendeurs et seuils de panier ; lien vers la procédure |
| EN `/en/blog/competitor-monitor-tool/` | Choisir la catégorie selon la source : pages, SEO, social, publicité | Définition de monitoring | Pas de nouvelle grille de catégories, renvoi explicite au guide existant |

### Réponses explicites au contrôle anti-cannibalisation

**FR :** le nouveau guide vise le choix concret des pages d'un site et du signal attendu sur chacune. « Logiciel » vise l'achat d'un outil ; « e-commerce » organise la démarche générale ; « surveillance des prix » qualifie les offres tarifaires. Le tableau de pages et les sources non tarifaires portent la nouvelle page. H1, description, sommaire et exemple suivent cet angle.

**EN :** le nouveau guide vise la qualification retail d'une offre : variante, vendeur, quantité, conditions client et panier. « Competitor price monitoring » fournit le protocole d'exploitation des observations ; « price tracking software » choisit les capacités d'un outil ; « competitor monitor tool » choisit la catégorie de source. Il n'y a pas de reprise du plan de ces articles.

La différence de mot-clé ne prouve pas une intention différente. Les chevauchements restent réels et le risque SEO n'est **pas nul**, notamment pour EN versus competitor-price-monitoring et FR versus le guide e-commerce. Les liens orientent vers l'approfondissement existant ; aucune promesse de positions indépendantes n'est faite. Après publication autorisée, surveiller les requêtes/pages dans Search Console pour détecter une alternance indésirable. Les nouveaux articles sont indépendants et ne portent pas de hreflang l'un vers l'autre.

## Sources retenues dans les articles

- FR : [Google — robots d'exploration](https://developers.google.com/crawling/docs/crawlers-fetchers/overview-google-crawlers?hl=fr), pour illustrer la notion de robot ; pas une description du moteur ChangeWatch.
- EN : [Google Merchant — variantes](https://support.google.com/merchants/answer/6324507?hl=en), pour distinguer groupe de produits et versions ; contexte Merchant Center explicite.
- EN : [Google Merchant — prix](https://support.google.com/merchants/answer/6324371?hl=en), pour prix, conditions et cohérence de la page ; pas une règle juridique universelle.
- EN : [Google Merchant — livraison](https://support.google.com/merchants/answer/6324484?hl=en), pour destination et valeur du panier.

Ces sources primaires ont été lues. La page variantes a initialement renvoyé une erreur à l'ouverture Web ; la recherche spécifique a retourné son contenu complet. Contrôles HTTP séparés consignés dans `logs/external-links.log`. Aucun article concurrent n'est utilisé comme preuve d'une capacité de ChangeWatch. Les calculs de l'exemple sont entièrement fictifs et vérifiables : 69 + 8 = 77 ; 74 + 0 = 74 ; 77 − 74 = 3.

## Intégration

Réutilisation des composants existants : styles, navigation, pied de page, consentement, CTA et commentaires. Slugs uniques, deux routes ajoutées aux listes Analytics sans modification de logique. Pas de nouveau PDF/CSV : les grilles HTML sont directement utilisables et les anciens téléchargements restent disponibles.

Le guide Supabase a été appliqué à la vérification du composant partagé. Changelog et documentation des fonctions consultés le 1er octobre : nouveautés OrioleDB/middleware et changements PostgreSQL sans incidence identifiée sur l'ajout de slugs HTML. Aucune migration, requête réelle, RPC ou donnée Supabase modifiée. La suite commentaires utilise les réponses simulées existantes.
