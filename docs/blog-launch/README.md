# Validation — Blog bilingue et offre Business

État au 20 septembre 2026 : **PR en brouillon, aucune fusion ni publication**.
Base : `0350028be8c1677d5daa6998fb0f12a8984404a3` (version FR/EN publiée).
Branche : `codex/bilingual-blog-business-launch`.

## Inventaire et correspondances

Un seul article français existe. Aucun nouvel article français, aucune migration, aucun changement des anciennes URL.

| Type | URL française conservée | Nouvelle URL anglaise |
|---|---|---|
| Blog | `/blog/` | `/en/blog/` |
| Guide | `/blog/veille-concurrentielle-ecommerce/` | `/en/blog/ecommerce-competitor-monitoring/` |

### Inventaire initial français

- Blog : titre « Conseils et ressources sur la veille concurrentielle e-commerce | ChangeWatch », description présentant méthodes et limites, canonical `/blog/`, OG `website`, langue `fr_FR`, Twitter `summary`.
- Article : titre « Veille concurrentielle e-commerce : une méthode pour décider | ChangeWatch » ; description « Choisissez les bonnes pages, comparez les offres et transformez les changements concurrents en décisions. Méthode, exemples et limites de la veille automatisée. » ; canonical propre, OG `article`, Twitter `summary_large_image`, image locale `guide-social.png`.
- Article français : publication 15/09/2026, modification éditoriale 16/09/2026, 1 589 mots, 8 minutes, BlogPosting et BreadcrumbList, auteur ChangeWatch — Cybersignal. Ces informations et son texte sont conservés.
- Liens internes : accueil, fonctionnement, alertes, tarifs, FAQ, contact, blog, CGV, mentions légales, confidentialité/cookies. Le sommaire a huit ancres : objectif, perimetre, comparaison, methode, fonctionnement, limites, routine, demarrer. Le blog pointe vers l’article ; l’article renvoie au blog et aux parcours démonstration/tarifs/contact.
- Sources : France Num (veille/études de marché), spécification produit Google Merchant Center, recommandations CNIL sur la réutilisation de données publiques.

### Changements SEO et éditoriaux

Traduction complète, anglais naturel, huit sections, définitions explicites, questions opérationnelles, tableau comparatif, deux illustrations déclinées desktop/mobile, exemples explicitement fictifs. Les informations de couverture, extraction/pagination, fréquence et absence de temps réel sont conservées. Les sources françaises restent signalées comme telles ; Merchant Center pointe vers sa version anglaise.

L’article anglais contient 1 435 mots dans `.article-body` (texte décodé, balises remplacées par espaces), soit 8 minutes à 200 mots/minute. Son titre SEO/H1 est « Ecommerce competitor monitoring: a practical guide ». BlogPosting en `en-GB`, lien `translationOfWork` vers l’article français, fil d’Ariane anglais et image PNG locale pour le partage social. Les quatre SVG anglais gardent une version mobile lisible. Les encarts d’article FR/EN deviennent des blocs ordinaires pour éviter des repères complémentaires imbriqués ; aucun contenu français supprimé.

Canonical propre à chaque langue ; hreflang `fr`, `en`, `x-default` réciproques ; langue par liens HTML sans redirection automatique. Deux nouvelles entrées dans le sitemap (12 au total). Toutes les nouvelles pages utilisent un dossier avec `index.html`, mais leurs liens publics finissent par `/`. Les accès directs `index.html` ont le même canonical vers le dossier et ne sont jamais promus dans les liens ni le sitemap. Pas de redirection GitHub Pages inventée.

Les dates anglaises sont celles de préparation de cette édition en brouillon (20/09/2026). Si sa publication intervient plus tard, actualiser les dates de publication visibles, métadonnées et sitemap avant fusion. Aucune indexation de ces nouvelles URL en production n’a été vérifiée puisqu’elles ne sont pas publiées.

## Recherche de mots-clés — limites explicites

Recherche web effectuée le 20/09/2026 sur « ecommerce competitor monitoring price monitoring competitor analysis guide ». Les résultats visibles utilisent notamment « competitor price monitoring », « ecommerce competitor analysis » et « competitor monitoring » pour des guides et des outils. Il s’agit d’une observation qualitative des résultats, **pas de données sur les requêtes réellement saisies, les volumes, la difficulté ou le potentiel de trafic**. Aucun accès à Keyword Planner ou aux requêtes Search Console n’a été utilisé. Aucune expression n’est donc présentée comme validée par des données de recherche quantitatives.

| Expression | Intention éditoriale retenue | Justification / statut |
|---|---|---|
| ecommerce competitor monitoring | Organiser un suivi récurrent de pages concurrentes | Axe principal proposé : décrit l’ensemble du guide, pas seulement les prix. Hypothèse éditoriale étayée qualitativement. |
| competitor price monitoring | Comparer les prix et vérifier les conditions | Sujet secondaire présent dans les résultats observés et dans la section 3. Pas de volume vérifié. |
| automated competitor monitoring | Comprendre l’automatisation et ses limites | Section 4 et fonctionnement ChangeWatch ; hypothèse éditoriale. |
| ecommerce competitor analysis | Analyser le marché plus largement | Intention plus large que notre suivi de pages ; pas choisie comme slug principal. |

Slug retenu : `ecommerce-competitor-monitoring`, court, descriptif et adapté au sujet réel. `price-monitoring` serait trop étroit pour les sections assortiment/livraison ; `website-change-monitoring` serait trop générique. Aucun classement Google ou citation par une IA promis.

Repères vérifiés :

- [Google : versions linguistiques](https://developers.google.com/search/docs/specialty/international/localized-versions) : annotations réciproques et URL dédiées.
- [Google : fonctionnalités IA et sites web](https://developers.google.com/search/docs/appearance/ai-features) : contenu utile et bonnes pratiques SEO, pas de balisage GEO spécial ni de promesse de présence.
- Sources de l’article : [France Num](https://www.francenum.gouv.fr/guides-et-conseils/developpement-commercial/veille-et-etudes-de-marche), [Merchant Center](https://support.google.com/merchants/answer/7052112?hl=en), [CNIL](https://www.cnil.fr/fr/recommandations-reutilisateurs-donnees-internet).

## Offre Business

Bandeau discret sous l’en-tête des deux accueils, lien d’ancre vers un encart dans la carte Business. Conditions toujours visibles, sans JavaScript : **14,90 €/mois pendant 3 mois, puis 29,90 €/mois dès le 4e mois**, **45 € d’économie**, **nouveaux clients uniquement**, code **CWBUSINESS3MOIS**. Traduction anglaise intégrale, sans échéance ni compte à rebours.

Lien exact : `https://buy.stripe.com/dRm3cu78w4TdbNMdFs4gg05?prefilled_promo_code=CWBUSINESS3MOIS`.

Les trois liens classiques Starter/Business/Pro et leurs tarifs restent présents et inchangés. Le clic promotionnel autorisé par consentement émet uniquement `stripe_click` avec `plan: Business` ; ni `purchase`, ni code promotionnel, ni URL/query visiteurs ne sont transmis. Les deux nouvelles routes sont ajoutées aux listes explicites autorisées pour les page_view, sans changement de logique de consentement.

## Contrôles exécutés

Environnement : Edge/Chromium headless via Playwright, serveur HTTP local, axe-core 4.10.3, Node avec `--use-system-ca` pour les accès HTTPS (vérification TLS active). Toutes les soumissions Formspree des tests sont interceptées ; aucun paiement ni contact réel. Les widgets Turnstile locaux sont simulés : ces tests ne valident pas une résolution CAPTCHA réelle.

| Suite | Résultat / périmètre |
|---|---|
| `node tests/browser.cjs` | Réussi : français, liens/assets, 320/375/390/768/1024/1440, clavier, FAQ, démo, no-JS, texte 200 %, Stripe classique, formulaire succès/422/réseau/timeout/jeton vide/double envoi, blog français. |
| `node tests/consent.cjs` | Réussi avec script simulé : aucun Analytics avant choix/refus ; page_view/CTA/Stripe/promo/lead, pas de PII, retrait/cookies/onglets, expiration et stockage indisponible. |
| `node tests/consent-ux.cjs` | Réussi : 320/375/390/1440, options accessibles, dialogue/clavier/petits écrans. À 320 px, le bandeau initial recouvre encore une partie du premier écran (comportement existant) ; pas de débordement ni d’option masquée. |
| `node tests/i18n.cjs` | Réussi : dix pages FR/EN existantes, SEO réciproque, axe anglais, menu/formulaire/démo/Stripe/consentement, six largeurs, sans JS. |
| `node tests/blog-launch.cjs` | Réussi : 12 routes sitemap et liens/assets/ancres, anciennes URL, blog et article FR/EN, sélecteurs clavier, quatre audits axe sans violation, schéma/mots/lecture, quatre SVG sans texte hors cadre, offre exacte, quatre liens Stripe, six largeurs, 200 %, sans JS, routes Analytics anglaises et promo simulées. |
| GET HTTPS externes | Les quatre Stripe et les trois sources de l’article répondent 200, TLS vérifié. Détail : [HTTP_CHECKS.json](HTTP_CHECKS.json). Cela ne prouve pas les paramètres internes Stripe ni la livraison d’un paiement. |
| Intégrité | CNAME, robots.txt, Search Console, formulaire/script.js, démonstrateur, CSS consentement, pages juridiques FR/EN inchangés par rapport à la base. Aucun changement du moteur, DNS ou service externe. |

### Test complémentaire avec le script GA4 réel

Un premier passage a échoué au contrôle multi-onglets de retrait : 12 requêtes observées contre 10 au point de mesure. Une relance instrumentée a réussi, sans requête après retrait. La cause exacte du premier échec n’a pas été établie ; ne pas l’interpréter comme une preuve de régression ou comme un diagnostic résolu.

Le test attend maintenant explicitement le troisième `page_view` (deuxième onglet prêt), au lieu d’une pause fixe de trois secondes, avant de déclencher le retrait. La logique de production n’a pas été modifiée pour faire passer ce contrôle. Dernière exécution de `CW_REAL_GA=1 node --use-system-ca tests/consent.cjs` : **réussie**, y compris retrait multi-onglets, suppression des cookies et absence de requête ultérieure. Événements observés dans les requêtes interceptées : `page_view`, `commercial_cta_click`, `stripe_click`, `generate_lead` (ce dernier après une réponse Formspree simulée uniquement). Aucun `purchase`.

Toutes les collectes de ce test restent interceptées : téléchargement du vrai script Google, mais aucune télémétrie envoyée à la propriété. La réception dans les rapports GA4 n’est pas testée.

## Captures et revue visuelle

Avant : base publiée, captures locales à 390 et 1440 px. Après : même navigateur, mêmes dimensions, consentement refusé pour isoler la comparaison du contenu. Les captures de l’article chargent explicitement les images différées avant capture.

| Vue | Avant | Après |
|---|---|---|
| FR mobile | [Avant](before/fr-home-390.png) | [Après](after/fr-home-390.png) |
| FR desktop | [Avant](before/fr-home-1440.png) | [Après](after/fr-home-1440.png) |
| EN mobile | [Avant](before/en-home-390.png) | [Après](after/en-home-390.png) |
| EN desktop | [Avant](before/en-home-1440.png) | [Après](after/en-home-1440.png) |

Nouvelles vues : [Business FR](after/fr-business-390.png), [Business EN](after/en-business-390.png), [blog anglais mobile](after/en-blog-390.png), [blog anglais desktop](after/en-blog-1440.png), [article mobile complet](after/en-article-390.png), [article desktop complet](after/en-article-1440.png).

Revue : bandeau statique sous l’en-tête, prix récurrent visible, hero préservé, encart lisible, grille et sommaire adaptés, illustrations localisées. Aucun débordement horizontal aux six largeurs testées. Les tests headless ne remplacent pas une revue sur Safari/iPhone réel ou un lecteur d’écran.

## Points restant à vérifier avant/après publication autorisée

- Validation visuelle/éditoriale par le propriétaire, puis actualisation des dates si nécessaire. Cette PR doit rester en brouillon ; pas de déploiement effectué.
- Vérifier manuellement dans Stripe le coupon et l’éligibilité réelle « nouveaux clients », ainsi que l’échéancier final ; le lien prérempli et HTTP 200 ne suffisent pas à certifier ces règles. **La description d’abonnement du lien promotionnel Business reste à rétablir par le propriétaire**, anomalie déjà connue. Aucun prix/coupon/configuration modifié ici.
- L’acceptation obligatoire des CGV a été confirmée précédemment par le propriétaire. Les coordonnées provisoires et les obligations juridiques déjà documentées restent inchangées ; aucune certification juridique.
- Après publication ultérieure : tester les nouvelles routes sur GitHub Pages, inspecter les canonicals/hreflang dans Search Console et attendre l’indexation. Compatibilité locale testée avec fichiers statiques et `.nojekyll`, pas prétendue validation du déploiement futur.
- Contrôler le vrai Turnstile et, uniquement avec autorisation, une livraison Formspree. Recontrôler GA4 réel et retrait multi-onglets en production ; réception des événements dans GA4 à confirmer par le propriétaire.
