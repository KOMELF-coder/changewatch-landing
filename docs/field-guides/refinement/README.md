# Passe ciblée — compatibilité facultative

Cette passe conserve les deux angles éditoriaux et corrige le parcours commercial : le formulaire est facultatif. Les deux articles proposent une vérification avant abonnement **ou** une souscription directe avec vérification des pages pendant la configuration. Les titres et boutons qui imposaient un ordre sont reformulés.

## Changements

- FR : CTA contextuel « Vous consultez encore ces pages à la main ? », bouton proposant l'envoi de trois URL, choix des deux parcours explicite dans le CTA contextuel et final.
- EN : tableau de cinq besoins juste après les deux paragraphes introductifs ; distinction page monitoring / price intelligence / repricing / product matching. ChangeWatch n'est pertinent que pour les pages connues compatibles, sans prétendre remplacer une plateforme de price intelligence.
- EN : offre Business sobrement mentionnée dans la section ChangeWatch : nouveaux clients, 14,90 €/mois pendant les trois premiers mois, puis 29,90 €/mois, conditions de la page tarifs. Vérifiée contre la landing EN du dépôt ; aucun lien Stripe changé.
- Cinq exclusions conservées explicitement dans les deux langues : repricing automatique, extraction massive de catalogue, base historique normalisée, export massif, analyse stratégique automatique. Limites de compatibilité, pagination et fréquence conservées.
- Comptage actualisé : FR 1 956 mots / 10 minutes ; EN 2 041 mots / 11 minutes. JSON-LD et temps de lecture de la carte EN alignés. Aucune modification de canonical, URL ou intention de recherche.
- Tableau responsive avec largeur minimale propre à ce tableau pour éviter un défilement inutile sur ordinateur ; aucune feuille de style existante modifiée.

## Tests réellement exécutés

Les sept suites existantes ont été relancées séparément : `field-guides`, `browser`, `consent`, `consent-ux`, `i18n`, `blog-launch`, `analysis-guide` : **PASS**. La suite `field-guides` a ensuite été relancée après le dernier ajustement de largeur du tableau : **PASS**. Leurs journaux sont conservés dans ce dossier.

Contrôle `field-guides-static.py` : **PASS**, 20 HTML, 581 contrôles locaux, 16 URL sitemap, 178 fichiers historiques protégés inchangés. CSV intacts : mêmes données, mêmes téléchargements. Contrôle du diff avec `645bbc3` : seuls les deux nouveaux articles et le temps de lecture de leur carte EN changent dans le site ; les ajouts de rapport/captures sont séparés.

Couverture des tests : 320/375/390/768/1024/1440 px, axe à 320/1440 sans violation détectée sur les nouveaux articles, clavier, tableaux défilants, zoom 200 %, sommaires, CTA, métadonnées, téléchargements, consentement et formulaire. Formspree/Turnstile/GA sont simulés dans les tests fonctionnels ; aucun lead réel, paiement ou collecte réelle envoyé. Les liens Stripe exacts restent contrôlés par les suites existantes.

## Captures ciblées

- [Tableau EN desktop](en-table-1440.png)
- [Tableau EN 320 px, début](en-table-320.png) et [colonnes de droite](en-table-320-right.png)
- [CTA contextuel FR desktop](fr-context-1440.png) et [320 px](fr-context-320.png)

Les captures ont été inspectées. Les anciennes captures et ressources demeurent intactes ; ce dossier documente la nouvelle passe.

## Statut et limites

PR #7 conservée ouverte **en brouillon**, sans fusion ni déploiement. Aucun ancien article, actif CSV/SVG/PNG, lien Stripe, script d'intégration ou configuration externe modifié. Le 404 IntoTheMinds préexistant reste hors périmètre. Les contrôles publics, l'import natif Excel/Sheets et le lecteur d'écran restent les limites déjà documentées ; cette passe ne les présente pas comme résolus.
