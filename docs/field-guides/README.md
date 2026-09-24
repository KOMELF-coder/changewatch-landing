# Deux articles indépendants — dossier de validation

État : branche de travail, aucune fusion ni publication autorisée. Recherche et contrôles du 24 septembre 2026. Base : `69d002d78026d25d78bab531a8646cff4fa3b6d7`.

## Cible et provenance

| Langue | Mot-clé | Volume mensuel | Intention et livrable |
|---|---|---:|---|
| FR | veille concurrentielle exemple | 210 | Voir un dossier rempli : périmètre, journal des contrôles et note de synthèse |
| EN | price tracking software | 480 | Choisir le type de logiciel adapté, dimensionner un besoin et vérifier les résultats attendus |

Volumes Semrush **fournis par le propriétaire dans la mission**. Aucun volume recalculé ou vérifié indépendamment. Date d'extraction, pays et appareil non fournis : ne pas les attribuer arbitrairement à la France ou aux États-Unis.

## Audit préalable des quatre articles publiés

L'inventaire complet des titles, descriptions, H1/H2/H3, liens et graphes JSON-LD se trouve dans [existing-articles-audit.json](existing-articles-audit.json). Les fichiers publiés sont conservés ; aucune section, URL, métadonnée ou source n'est réécrite.

| Article | Intention / mots-clés secondaires | Contenu, exemple et CTA | Forces et limites pour le nouveau besoin |
|---|---|---|---|
| `/blog/veille-concurrentielle-ecommerce/` — veille concurrentielle e-commerce | Organiser une méthode ; pages, fréquence, alertes, limites d'extraction | 8 H2 : objectifs, périmètre, comparabilité, manuel/automatique, fonctionnement, couverture, routine, démarrage. Sac fictif 99 → 79 €, conditions à vérifier. Liens accueil, demande, tarifs et juridique | Méthode et limites solides ; pas de journal rempli sur plusieurs passages, de trace des échecs ou de CSV de surveillance |
| `/en/blog/ecommerce-competitor-monitoring/` — ecommerce competitor monitoring | Même intention en anglais ; routine, page changes, email alerts | Traduction de la méthode, même exemple ; hreflang réciproque avec le premier article. CTA vers l'accueil EN et sa demande | Explique l'exploitation du suivi, pas une procédure d'achat de logiciel |
| `/blog/etude-de-concurrence/` — étude de concurrence | Préparer une comparaison stratégique ; concurrents directs/indirects, positionnement, matrice | 7 H2 : objectif, groupe concurrentiel, critères, matrice, interprétation, décision, synthèse. Boutiques de vêtements fictives et montants 35/30/32/22 €. CSV de 26 colonnes ; CTA contextuel puis final vers demande/tarifs | Analyse initiale détaillée, pas dossier de suivi chronologique ; ne pas recycler sa matrice dans le nouveau cas |
| `/en/blog/competitor-price-analysis/` — competitor price analysis | Interpréter des prix comparables ; shipping, discounts, median, price gaps | 7 H2 : question, groupe, tableau, écarts, interprétation, brief, synthèse. 8 lignes fictives d'habillement, médianes 34/64 et écarts 2,94/1,56 %. CSV de 29 colonnes ; CTA demande/tarifs | Calculs et décision de prix ; ne répond pas au choix des fonctions d'un logiciel |

Les quatre pages utilisent BlogPosting et BreadcrumbList. Les deux guides méthodologiques FR/EN sont associés ; les deux articles stratégiques indépendants ne sont pas associés par hreflang. Leurs dates et métadonnées sont conservées.

## Matrice de chevauchement et décision éditoriale

| Nouvelle page / page existante | Recoupement possible | Risque sans adaptation | Délimitation appliquée |
|---|---|---|---|
| Exemple FR / méthode FR | Pages, cadence, lecture des changements | Élevé si nouveau guide général | Entrée immédiate dans un dossier fini ; 24 tentatives documentées, statuts et synthèse. L'organisation générale fait l'objet d'un lien, pas d'une section copiée |
| Exemple FR / étude FR | Observation et décision | Moyen | Chronologie de suivi d'une gourde ; aucune matrice de positionnement ou étude de marché |
| Exemple FR / méthode EN | Notions de surveillance | Parenté thématique entre langues | Aucun statut de traduction ni hreflang ; exemples et livrables différents |
| Exemple FR / analyse de prix EN | Bref calcul de variation | Faible à moyen | Deux variations servent à qualifier un événement ; pas de médiane ni de benchmark de panier concurrentiel |
| Logiciel EN / méthode EN | Alertes et pages compatibles | Élevé si nouvel article « comment surveiller » | Cahier des charges, unités facturées et tests d'acceptation ; routine renvoyée au guide existant |
| Logiciel EN / analyse de prix EN | Produit comparable, prix/historique | Moyen | Sélection d'une capacité et preuve à demander ; aucun nouveau tableau d'analyse de prix |
| Logiciel EN / méthode FR | Définitions de surveillance | Parenté thématique entre langues | Audience d'achat anglophone, pas traduction ; périmètre logiciel distinct |
| Logiciel EN / étude FR | Besoins et décisions | Faible | Décision d'équipement, pas stratégie concurrentielle |

La distinction repose sur la tâche et le livrable, pas seulement sur les mots-clés. Un chevauchement lexical reste normal ; l'absence future de cannibalisation ne peut pas être garantie sans observations Search Console après publication.

## Résultats de recherche étudiés

Requêtes exactes FR/EN et recherches complémentaires consultées le 24/09/2026. Il s'agit des résultats accessibles au moteur de recherche de l'environnement, **pas d'un relevé exhaustif des dix positions Google géolocalisées**. Aucun classement ou position stable n'est annoncé.

### FR : exemple de veille concurrentielle

Intention dominante informationnelle : voir comment la veille se traduit dans une entreprise. Formats mêlés : guides généraux, exemples sectoriels, démarches et offres de cabinets. Variantes utiles : tableau de veille, exemple rempli, fréquence, source datée, synthèse et décision.

| Source primaire lue | Format, questions et profondeur | Apport / besoin restant |
|---|---|---|
| [HEC Junior Conseil](https://www.hec-junior-conseil.fr/veille-concurrentielle) | Définition, critères, collecte hebdomadaire, analyse, recommandations ; exemple narratif construction/smart city | Vision générale et accompagnement ; pas de journal chronologique rempli qui montre aussi les contrôles sans changement |
| [Arkanerisk](https://www.arkanerisk.com/post/comment-r%C3%A9aliser-une-veille-concurrentielle) | Guide, outils, sources humaines et exemples cosmétiques/livraison de repas ; daté du 03/06/2024, mise à jour affichée 21/02/2025 | Cas narratifs et organisation ; pas de 24 observations reconstructibles avec statut d'échec et responsable. Les résultats commerciaux évoqués par le prestataire ne sont pas repris |
| [ESCP Junior Conseil](https://www.escpjunior.fr/blog-posts/benchmark-vs-veille-concurrentielle) | Benchmark initial et suivi dans le temps ; traçabilité, responsable, date, décisions ; date affichée 05/01/2026 | Éclaire le format de dossier ; ne fournit pas le journal chiffré de notre cas. Source citée pour cette distinction uniquement |

L'opportunité n'est pas d'ajouter une définition : fournir les pièces d'un même dossier cohérent, un compte exact des tentatives, une observation ambiguë et une lecture impossible, puis une note utilisable en réunion. Le CSV est utile sans abonnement.

### EN : price tracking software

Intention commerciale dominante, avec des résultats qui mêlent surveillance pour marchands, alertes pour consommateurs, pages fournisseurs, annuaires et listes d'outils. Notre lectorat est explicitement professionnel. Questions : exact product matching, promotions, page monitoring, history, repricing, coverage, costs and trials.

| Source primaire lue | Format, profondeur et outils | Apport / besoin restant |
|---|---|---|
| [Prisync](https://prisync.com/price-tracking-software/) | Landing produit, variantes, disponibilité, historique, FAQ, offre par produits/canaux et fonctions de repricing | Donne un exemple de suivi structuré décrit par le fournisseur ; le lecteur doit encore vérifier son unité de facturation et les cas difficiles sur ses pages |
| [Visualping](https://visualping.io/blog/top-tools-competitor-price-tracking) | Comparaison de cinq outils par usage, tableau et limites ; publication affichée 22/07/2026, intérêt commercial déclaré | Propose déjà une distinction des catégories : nous ne prétendons pas l'inventer. Notre apport est le brief dimensionné et la grille d'acceptation sans classement de marques |
| [Price2Spy](https://www.price2spy.com/) | Offre de monitoring, matching, analytics et repricing avec intégrations | Illustre des fonctions séparées ; les performances et témoignages ne sont ni testés ni repris. Il reste à demander des preuves concrètes de récupération, d'erreurs et de contrôle des actions |

Les sources fournisseurs décrivent leur propre offre ; ce n'est ni un banc d'essai indépendant ni une recommandation d'achat. Les prix de tiers ne sont pas reproduits. Le guide expose aussi l'intérêt commercial de son éditeur ChangeWatch.

### Documentation de référence

Les consignes [prix de Google Merchant Center](https://support.google.com/merchants/answer/6324371?hl=fr) et les [spécifications de données produit](https://support.google.com/merchants/answer/7052112?hl=en) ont été ouvertes. Elles justifient la nécessité de distinguer identité/variante/prix/conditions dans leur contexte de flux produit, sans être présentées comme une certification de la méthode ou du logiciel.

## Pages ajoutées et SEO

| Avant | Après proposé, non publié | Title | Meta description |
|---|---|---|---|
| Aucune page | `/blog/veille-concurrentielle-exemple/` | Veille concurrentielle : exemple concret et tableau à remplir — suffixe ChangeWatch | Six pages, trois concurrents fictifs, un journal rempli et une synthèse : reproduisez cet exemple de veille concurrentielle avec deux CSV gratuits. |
| Aucune page | `/en/blog/price-tracking-software/` | Price tracking software: choose the right fit — suffixe ChangeWatch | Choose price tracking software for your actual workflow: page alerts, price history or repricing. Use a requirements brief and practical acceptance checks. |
| 4 articles déjà publiés | Mêmes 4 URL et contenu | Inchangés | Inchangées |

Canonical propre à chaque page ; BlogPosting + BreadcrumbList ; aucun FAQ schema, hreflang artificiel, translationOfWork ou noindex. 1 956 mots FR et 2 041 EN dans le corps, lecture calculée à 200 mots/minute : 10 minutes FR et 11 minutes EN. Titres/description sociaux, images PNG locales 960 × 500. Aucun nom de client ni résultat commercial présenté comme réel.

**Publication à préparer après validation** : les pages et cartes affichent explicitement leur statut de brouillon. Pas de datePublished/dateModified inventée. Remplacer ce statut par la date effective et renseigner les métadonnées correspondantes lors de la publication autorisée. Les nouvelles entrées sitemap n'ont pas de lastmod anticipé ; les entrées existantes restent inchangées.

## Liens et conversion

- FR : méthode de veille et étude de concurrence, chacun au moment où il prolonge le dossier.
- EN : routine de suivi et analyse de prix, sans recopier leurs méthodes.
- Un CTA contextuel après la démonstration du travail répétitif et un CTA final vers `/#demande` ou `/en/#demande` ; lien secondaire vers les tarifs localisés.
- Trois URL demandées, compatibilité à vérifier ; la demande ne souscrit pas d'abonnement. Le formulaire préalable est facultatif dans l'offre, recommandé dans ce parcours.
- Aucun lien direct Stripe ajouté aux articles. Tarifs standard réels, contrôle quotidien ou jusqu'à trois fois/jour selon le forfait ; aucune promesse de temps réel, repricing, export de base ou catalogue complet.
- Les deux index du blog reçoivent une carte chacun. Les anciens articles ne reçoivent pas de liens réciproques puisque leur modification est interdite.
- La liste fermée des chemins Analytics est étendue aux nouvelles URL et leurs alias index.html ; aucun changement de consentement ou de collecte. Les paramètres et fragments sont toujours exclus.

## Ressources

Deux diagrammes SVG originaux, 440 × 600 : observation → qualification → décision (FR), trois sorties logicielles distinctes (EN). Dimensions, alt, légendes et chargement différé. Deux images sociales PNG issues de SVG locaux.

Deux CSV UTF-8 avec BOM, virgules et champs cités : journal fictif (24 lignes de données, 16 colonnes) et modèle vierge (16 en-têtes et ligne vide). Statuts : 6 premières observations + 13 sans changement + 3 changements confirmés + 1 à confirmer + 1 échec = 24. Aucune formule, macro, connexion ou export attribué à ChangeWatch. Instructions d'import Excel/Sheets dans l'article.

CSV créés via Artifact Tool puis réimportés avec vérification des en-têtes ; contrôle indépendant CSV et téléchargement réel dans Edge comparé au fichier source. Le rendu PNG Artifact Tool a interrompu le processus sans diagnostic ; un aperçu HTML des données a été utilisé à la place. L'ouverture native dans Excel et Google Sheets n'est pas revendiquée et reste une vérification manuelle possible.

## Validations

Dernière passe : [compatibilité facultative, tableau EN et validations relancées](refinement/README.md). Voir aussi [validation.md](validation.md) pour les suites réellement exécutées, les journaux et captures. Les tests de services externes restent simulés ; ils ne prouvent pas la réception effective dans GA4 ni la délivrabilité d'un email. Aucune vraie soumission, aucun paiement, aucune modification de service externe.

## Anomalie préexistante conservée

L'article publié `/blog/etude-de-concurrence/` contient une source IntoTheMinds dont le chemin inclut `4-etapes-pour-etude-de-concurrence-et-reussir-votre-etude-de-marche/` : HTTP 404 observé. Le chemin historiquement correct utilise `4-etapes-pour-analyser-la-concurrence-et-reussir-votre-etude-de-marche/`. **Aucune correction dans cette PR**, car la consigne impose de conserver les liens des anciens articles. À traiter séparément avec l'accord du propriétaire. Cette anomalie empêche d'affirmer « aucun lien externe cassé sur tout le site ».

## Validation humaine avant publication

Valider les deux angles et contenus, les captures et la place de ChangeWatch ; compléter les dates uniquement lors de publication. Confirmer éventuellement le marché/date Semrush et l'ouverture native des CSV. Suivre ensuite indexation et requêtes Search Console : aucune garantie de classement, trafic ou conversion.
