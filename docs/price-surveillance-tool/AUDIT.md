# Audit préalable — 29 septembre 2026

Base inspectée : main d6c7bcc. Huit articles publiés, composants commentaires et retouches visuelles présents. Le blog public répond HTTP 200. Inventaire complet title, H1/H2/H3, canonical, description, schémas, CTA et liens : `existing-articles.json`. Aucun ancien article ne sera modifié.

## Cibles et volumes

- FR : surveillance des prix des concurrents, environ 70 recherches/mois **fourni par le propriétaire**.
- EN : competitor monitor tool, environ 260/mois **fourni par le propriétaire**.

Ni volumes mesurés indépendamment, ni marché EN déduit. Recherche des expressions exactes le 29 septembre 2026 : instantané qualitatif de résultats accessibles, sans prétention de classement Google géolocalisé ou exhaustif.

## Matrice de chevauchement et décisions avant rédaction

| Article existant | Intention et périmètre | Risque avec les nouveaux sujets | Frontière retenue |
|---|---|---|---|
| FR veille-concurrentielle-ecommerce | Organiser une veille générale ; périmètre, méthodes, routine | Moyen avec FR | Nouveau : contrôle d'une offre tarifaire précise, panier comparable et cas d'alerte à ne pas interpréter. Renvoi au guide pour l'organisation générale. |
| FR etude-de-concurrence | Étude stratégique, matrice, forces et décisions | Faible | Pas de nouvelle matrice stratégique ; renvoi pour choisir les concurrents. |
| FR veille-concurrentielle-exemple | Dossier fictif sur cinq jours avec journal/CSV | Moyen avec FR | Pas de deuxième journal sur cinq jours ; nouvelle grille de vérification avant réaction tarifaire. Aucun CSV répétant l'existant. |
| FR logiciel-veille-concurrentielle | Acheter la bonne famille de logiciels et tester son adéquation | Moyen avec FR | Nouveau centré sur le **processus pratique des prix**, pas une sélection de fournisseurs ; tableau des méthodes limité au rôle de chacune. |
| EN ecommerce-competitor-monitoring | Organisation générale et pages à suivre | Moyen avec EN | Nouveau : routage d'un besoin vers une catégorie d'outil, hors prix aussi ; pas une routine de suivi. |
| EN competitor-price-analysis | Calculs, normalisation et note de décision | Faible avec EN | Aucun nouveau cours de calcul ou tableau d'écarts. |
| EN price-tracking-software | Choix de logiciel prix, brief, charge, essai | Élevé si nouveau guide d'achat générique | Angle adapté : **frontières entre sources et familles** (SEO, social, publicité, marketplaces, pages, CI), situations où il faut deux outils et erreurs de catégorie. Le détail d'achat prix reste dans l'ancien article. |
| EN competitor-price-monitoring | Contrôle récurrent, fréquence, statuts et preuve | Moyen | Pas de nouvelle procédure d'alertes ; renvoi au guide opérationnel après sélection de la famille. |

Recoupements interlangues : nouveau FR et ancien EN price-monitoring répondent en partie au même besoin ; nouveau EN et ancien FR logiciel partagent la sélection de familles. Ils ne sont pas des traductions et ne sont pas associés par hreflang. Les exemples, plans et livrables sont propres. Cela ne garantit pas zéro cannibalisation : surveiller les requêtes/pages dans Search Console après une publication autorisée. Des mots-clés différents seuls ne démontrent pas des intentions distinctes.

## Pages concurrentes réellement ouvertes

### FR — résultats fortement commerciaux

- [Comptrace](https://comptrace.app/fr/) : landing catalogue/matching, captures et blocs source/observation/preuve/décision, FAQ et distinction surveillance/repricing. Bon traitement des correspondances incertaines ; objectif commercial de catalogue plus large que les pages ciblées. Nouveau guide : protocole manuel simple, hypothèses de panier et possibilité de ne pas agir.
- [4pricing](https://4pricing.net/fr) : longue landing, catalogue, historique, recommandations, exemples marchands, prix, FAQ. Mélange de promesses de contrôle périodique, temps réel et gains commerciaux ; aucun chiffre ni témoignage repris sans vérification indépendante. Nouveau guide : séparer détection et décision, expliciter une promotion manquée entre deux passages.
- [Competiprice](https://www.competiprice.com/) : offre de surveillance, contexte de prix et forfaits/FAQ ; intention de solution. Nouveau guide : méthode exploitable sans abonnement et lecture critique d'une baisse.
- Allhub : résultat pertinent repéré, mais ouverture non disponible via l'outil ; pas utilisé comme source factuelle ni décrit comme lu.

### EN — listes d'outils et pages produit

- [Octolens](https://octolens.com/blog/best-competitor-monitoring-tools) : longue liste par catégories, tableau avec prix/notes/API, citations et méthodologie revendiquée ; l'auteur vend un outil classé dans sa propre liste. La diversité des catégories est bien traitée, donc elle ne suffit pas à différencier notre contenu. Notre valeur : contrats de preuve par besoin et exemples de mauvais choix, sans classement, notes ou prix concurrents. Les données datées du concurrent ne sont pas reprises comme mesures indépendantes.
- [SiteGauge](https://sitegauge.com/use-cases/competitor-monitoring) : landing consacrée aux changements de sites, exemples de pages et détection/notifications. Périmètre produit spécialisé ; une page modifiée n'est pas une mesure de classement SEO ou de part de marché.
- RivalSweep : repéré mais ouverture non disponible ; non retenu comme preuve.

Ce relevé ne permet pas de déclarer des pages obsolètes sur leur seule date. Les classements, tarifs, performances et affirmations des vendeurs n'ont pas été testés. Pas de copie de leur structure ni d'exemples. Pas de conclusion automatique sur ce que Google préfère.

## Valeur originale et limites éditoriales

FR : grille « information / risque / surveillance possible », scénario fictif différent des journaux existants, contrôle des conditions avant décision. EN : matrice des sources réellement nécessaires, petit diagnostic en trois questions, scénarios de besoins mixtes, fiche d'acceptation par catégorie. Pas de ressource téléchargeable artificielle : les tableaux HTML sont utilisables directement et les ressources existantes restent accessibles par les liens contextuels.

Chaque article contient un CTA contextuel et un CTA final vers compatibilité facultative ou abonnement direct. Aucun nouveau lien Stripe. Sources primaires prévues : Google Merchant price/période promotionnelle ; Ahrefs Rank Tracker et Meltwater Social Listening, pour illustrer les familles sans prétendre évaluer tous les vendeurs.

## Sources retenues et contrôle des liens

Quatre sources ouvertes et HTTP 200 vérifiés avec TLS le 29 septembre : [Google prix](https://support.google.com/merchants/answer/6324371?hl=fr), [Google période de promotion](https://support.google.com/merchants/answer/6324460?hl=fr), [Ahrefs Rank Tracker](https://ahrefs.com/rank-tracker), [Meltwater Social Listening](https://www.meltwater.com/en/capabilities/social-listening). Les deux pages Google illustrent leur propre modèle de données, sans extrapolation juridique. Les deux fournisseurs illustrent leur catégorie, sans benchmark ni tarif comparatif. Les URL indisponibles repérées pendant la recherche ne sont pas utilisées dans les articles.

Commentaires : guide Supabase consulté, changelog et documentation des fonctions vérifiés. Aucun changement RPC, bibliothèque ou schéma ; composant existant réutilisé à l’identique. Les changements annoncés sur des extensions PostgreSQL ne concernent pas cet ajout de contenu statique.
