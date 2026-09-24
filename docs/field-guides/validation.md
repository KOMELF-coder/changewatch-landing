# Résultats des contrôles — 24 septembre 2026

Environnement : Node 24.19.0, Playwright fourni par le runtime, Microsoft Edge headless local, axe-core 4.10.3 ; serveurs HTTP locaux des tests. Aucune désactivation TLS. Les lectures HTTPS de liens externes utilisent le magasin de confiance système (`--use-system-ca`).

## Exécuté et réussi

| Suite | Résultat et couverture |
|---|---|
| `node tests/browser.cjs` | PASS : FR, menu/clavier/FAQ, 6 largeurs, tarifs/liens, erreurs et réussite Formspree simulées, absence de jeton, double envoi, champs préservés, démo, réduction des animations, blog |
| `node tests/consent.cjs` | PASS : absence de Google avant choix/refus, acceptation, CTA/plans/lead simulé, retrait, cookies, onglets, stockage bloqué, absence de données personnelles |
| `node tests/consent-ux.cjs` | PASS : 320/375/390/1440, boutons visibles et aucun débordement ; bandeau existant recouvrant une partie du premier écran à 320 px, inchangé |
| `node tests/i18n.cjs` | PASS : navigation/localisation, 10 pages FR/EN, axe EN, démonstrateur, formulaire EN simulé et états d'erreur, consentement interlangues, zoom et clavier |
| `node tests/blog-launch.cjs` | PASS : 16 routes sitemap, canonical, liens/ancres/ressources, guides historiques, offres standard et promo inchangées, consentement et parcours |
| `node tests/analysis-guide.cjs` | PASS : les deux articles stratégiques publiés, leur SEO, dates, tableaux/calculs, CSV et six largeurs |
| `node tests/field-guides.cjs` | PASS : deux nouveaux articles, métadonnées, schémas, brouillons sans fausse date, sommaires, deux CSV réellement téléchargés et comparés, responsive, axe, clavier, zoom, CTA et confidentialité des routes |
| `python tests/field-guides-static.py` | PASS : 20 fichiers HTML, 581 liens/ressources/ancres locaux, 16 URL sitemap, 178 fichiers existants conservés hors des 5 points d'intégration autorisés ; CSV et statuts cohérents |

Journaux des six suites historiques dans ce dossier ; [nouvelle suite](field-guides.log), [résultats statiques](static-results.json), [réponses HTTP externes](external-results.json).

Tests navigateur nouveaux articles : 320, 375, 390, 768, 1024 et 1440 px ; aucun débordement horizontal de page, tableaux défilants. Axe WCAG 2 A/AA et 2.1 AA à 320/1440 : zéro violation détectée. Clavier : lien d'évitement, ancres, tableaux défilants et sélecteur de langue. Zoom texte 200 %, zoom de mise en page 200 %, absence de JS : contenu et liens utilisables. Ces tests ne constituent pas une certification d'accessibilité ; lecteur d'écran réel non testé.

Les CTA contextuels et finaux atteignent le formulaire localisé avec ses trois champs URL, puis les tarifs exacts. Les listes de chemins Analytics acceptent les deux nouvelles routes et aliases tout en retirant query/hash. Un page_view par document et trois commercial_cta_click attendus dans la simulation. Aucun purchase. Aucun trafic Google avant consentement ni après refus/retrait dans ces tests ; cookies accessibles supprimés.

Aucune erreur JavaScript bloquante observée. Les tests de formulaire simulent Formspree et Turnstile ; aucune vraie demande n'est envoyée. Le script public Turnstile répond HTTP 200, mais **la résolution d'un challenge réel n'est pas testée**. Les trois liens Stripe publics et le lien promotionnel répondent HTTP 200 ; aucun paiement ni changement de configuration.

## Liens externes : 30 HTTP 200, un échec préexistant

31 URL uniques du site vérifiées par GET. Toutes les nouvelles sources répondent HTTP 200. Le lien IntoTheMinds de l'article historique FR répond HTTP 404 ; il n'est pas modifié conformément à la préservation demandée. Ce point est détaillé dans le [rapport éditorial](README.md). Les réponses HTTP ne garantissent pas le contenu futur ni l'absence de changements chez les tiers.

## Ressources et captures

CSV UTF-8/BOM validés par réimport Artifact Tool et lecture indépendante : 16 colonnes, 24 contrôles fictifs / modèle vierge. Statuts 6/13/3/1/1 ; totaux et variations numériques vérifiés. Téléchargement navigateur réel identique octet pour octet au fichier servi. Aucun test d'import dans une session native Excel ou Google Sheets : point manuel restant. Le renderer Artifact Tool s'est arrêté sans diagnostic ; aperçu de secours des données via HTML/Edge.

Captures locales des nouvelles pages, sans prétendre à une validation en production :

- [FR mobile 375](screenshots/fr-375.png), [FR en-tête 320](screenshots/fr-320-header.png), [FR desktop](screenshots/fr-1440-header.png), [FR diagramme](screenshots/fr-1440-diagram.png), [FR CTA](screenshots/fr-375-cta.png).
- [EN mobile 375](screenshots/en-375.png), [EN en-tête 320](screenshots/en-320-header.png), [EN desktop](screenshots/en-1440-header.png), [EN diagramme](screenshots/en-1440-diagram.png), [EN CTA](screenshots/en-375-cta.png).
- [Aperçu du journal CSV](screenshots/csv-preview.png).

Les captures ont été inspectées : typographie, navigation, diagrammes et CTA lisibles. Pas de « avant » pour ces URL inédites ; la comparaison des fichiers historiques établit leur préservation.

## Reproduction

Définir `PLAYWRIGHT_MODULE` vers le module Playwright installé et `CW_AXE_PATH` vers axe-core 4.10.3, disposer de Microsoft Edge. Exécuter les sept commandes Node ci-dessus séparément (les sorties du rapport proviennent d'exécutions successives), puis le contrôle Python. Les scripts démarrent et arrêtent leurs serveurs locaux. Ne pas utiliser `CW_REAL_GA=1` pour reproduire les tests déterministes de ce rapport.

## Avant fusion/publication

1. Validation éditoriale et visuelle du propriétaire ; PR laissée en brouillon.
2. Renseigner les dates effectives et retirer les mentions de brouillon lors de la publication autorisée.
3. Traiter séparément le lien historique 404 si le propriétaire autorise cette modification.
4. Contrôle public des nouvelles URL, indexation et éventuelle réception GA4 après un futur déploiement : non réalisables avant publication, non revendiqués ici.

Aucune modification du backend, de CNAME, robots.txt, Search Console, des pages juridiques, tarifs, scripts de formulaire ou configurations externes. Aucune promesse de trafic, classement ou conversion.
