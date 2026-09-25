# Validation initiale Google Ads sans label — 25 septembre 2026

> Rapport historique avant fourniture du label. Le contrôle actuel avec le label exact est dans [ADS_LABEL_VALIDATION.md](ADS_LABEL_VALIDATION.md).

Branche `codex/google-ads-consent`, base `main` : `1aaf5b61aa3ee3227a856fb0a2beb893a0ecd92d`.
PR destinée à rester en brouillon, sans fusion ni publication.

## Résultats réellement exécutés

| Suite | Résultat final |
| --- | --- |
| `tests/google-ads.cjs` | Réussite, tag simulé : FR/EN, renouvellement v1, consentement séparé, deux configs après acceptation, une vue GA4, erreurs/succès Formspree, label absent, retrait et cookies. Futur label uniquement injecté localement. |
| `CW_REAL_GA=1 … tests/google-ads.cjs` | Réussite avec les vrais scripts Google : une requête GA4 `page_view` et une `generate_lead` par langue dans le scénario, aucune collecte Ads, aucune donnée du formulaire, aucune requête après retrait. Choix audience seule/publicité seule contrôlés. Collectes toutes interceptées. |
| `tests/consent.cjs` | Réussite : CTA, quatre liens Stripe dont promotion, aucun purchase, échec/succès formulaire, refus, retrait multi-onglets, expiration, stockage bloqué, clavier et audits axe. |
| `tests/consent-ux.cjs` | Réussite : 320/375/390/1440 px, deux cases et quatre boutons au clavier, petits écrans défilables, zoom texte. À 320 px le bandeau recouvre partiellement le hero mais n’a pas de débordement horizontal. |
| `tests/browser.cjs` | Réussite : navigation, tarifs/liens Stripe, Formspree 2xx/422/réseau/timeout, token Turnstile, démo, responsive et réduction des animations. Services externes simulés. |
| `tests/i18n.cjs` | Réussite : FR/EN, formulaire EN complet, consentement interlangues, CTA/Stripe, SEO, responsive et audits axe. |
| `tests/blog-launch.cjs` | Réussite : 16 pages du sitemap historique couvertes par cette suite, ressources/liens, schémas, offre et parcours bilingue. |
| `tests/analysis-guide.cjs` | **Échec préexistant** : `200% CSS layout zoom`. Reproduit avec la même assertion sur archive fraîche du commit main ci-dessus. Les styles/articles ne sont pas modifiés par la PR. |
| `tests/field-guides.cjs` | **Échec préexistant** : la suite attend encore l’absence de dates et le statut brouillon des articles publiés. Reproduit à l’identique sur archive fraîche de main. |
| `tests/field-guides-static.py` | **Échec préexistant** : compare les fichiers à `69d002d` et refuse la modification de `assets/blog.css` déjà dans main. Reproduit sur archive main, avec `GIT_DIR` pointant vers les objets Git pour les lectures. Les liens locaux vérifiés avant cette assertion passent. |
| Préservation / `git diff --check` | Réussite : 62 fichiers existants hors tests/docs identiques à main ; seuls les deux scripts consentement/iframe et les deux politiques sont modifiés. CNAME, Search Console, sitemap, script du formulaire, HTML des landings/articles, ressources et liens Stripe conservés. |

Les logs utiles et deux captures du dialogue sont dans [ads-validation](ads-validation/). Les échecs d’articles n’ont pas été masqués en désactivant des assertions ou en modifiant les anciens articles.

## Correction réseau et limites

La requête supplémentaire était une vue automatique **Ads**, pas un doublon GA4. Le code conserve les deux configs mais bloque la collecte Ads avec une CSP limitée à l’iframe tant que `GOOGLE_ADS_LEAD_LABEL` est null. Le module Ads peut être téléchargé par Google après accord ; il n’envoie aucune collecte Ads dans le test final. Au retrait, une CSP bloque toutes les nouvelles requêtes avant la révocation puis la suppression de l’iframe.

Les premières exécutions ont volontairement échoué sur ce ping Ads et sur le ping de retrait ; elles ont conduit aux corrections. Une exécution concurrente a occupé le port du test, puis le test a été relancé seul. Le test réel attend maintenant le chargement des modules avant fermeture, pour éviter l’erreur de harnais `Request context disposed`. Les résultats « réussite » ci-dessus correspondent aux exécutions finales.

## À valider manuellement

- Fournir le véritable Conversion Label. Son emplacement exact est **`assets/analytics-frame.js:10`**, constante `GOOGLE_ADS_LEAD_LABEL = null`.
- Refaire le contrôle réseau et Tag Assistant lors de son ajout : cela lève aussi le blocage des requêtes automatiques de base Ads, uniquement après accord publicitaire. La procédure est dans [GOOGLE_ADS.md](GOOGLE_ADS.md).
- Contrôler les réglages/destinations Google, conversions avancées, éventuels imports GA4 et comptage. La réception effective dans les rapports GA4/Ads n’est pas démontrée : aucune collecte de test n’a été envoyée.
- Valider les textes du consentement/confidentialité et les captures. Ce travail ne certifie pas juridiquement le site.
- Les trois échecs historiques restent documentés et à traiter séparément avant une validation globale du site.
- Aucun paiement, aucune demande Formspree réelle, aucun changement du moteur, aucun déploiement.
