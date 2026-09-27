# Validation des commentaires

Date : 24 septembre 2026. Base publiée : `1aaf5b6`. Aucun appel réel d'insertion ni modification de Supabase. Toutes les captures représentent des **fixtures locales**, pas des commentaires clients.

## Réussites

### PostgreSQL local — `tests/blog-comments-sql.cjs`

PASS avec **PGlite 0.5.8 / PostgreSQL 18.3**, en mémoire. Migration réellement exécutée et répétée, pas une comparaison de chaînes SQL. Vérification sous propriétaire superutilisateur puis sous propriétaire non-superutilisateur avec CREATEROLE et droits de schéma requis.

Contrôles :

- SELECT (y compris email), INSERT direct, UPDATE, DELETE et séquence refusés à anon et authenticated ; RPC refusées aux rôles non autorisés.
- RPC de lecture : cinq colonnes publiques seulement, tri chronologique, filtre article, exclusion pending/rejected et absence d'email.
- Paramètres de slug, nom, email, texte et honeypot invalides refusés côté SQL ; paramètres nettoyés ; status imposé pending ; argument status arbitraire inexistant.
- Statut de modération approved visible au prochain appel ; autres valeurs refusées par contrainte.
- Rôle propriétaire des fonctions limité, search_path fixé, aucun SELECT sur email pour ce rôle.
- Anciennes données avec status incompatible : migration rejetée sans conversion des données.
- Script de vérification en lecture seule exécuté ; script d'arrêt révoquant EXECUTE exécuté ; table toujours privée après arrêt.

Journal : [sql.log](sql.log). Ceci ne valide pas les privilèges, la version PostgreSQL, PostgREST ou les éventuels autres objets du projet Supabase réel. La validation propriétaire reste obligatoire.

### Navigateur — `tests/blog-comments.cjs`

PASS sur les six articles avec Edge headless et Playwright, axe-core 4.10.3. API Supabase entièrement interceptée ; aucun commentaire écrit en production.

- Section et slug explicites FR/EN ; aucun appel Supabase au premier écran, lecture différée à l'approche de la section.
- Etat de chargement, liste vide, liste remplie, chargement paginé, RPC absente, reprise après erreur.
- Email/status supplémentaires dans la fixture jamais rendus ; un commentaire d'un autre slug ignoré. Chaînes HTML et Markdown affichées littéralement, sans balise injectée ni lien actif.
- Clé publishable attendue dans apikey ; aucune Authorization fabriquée, aucun Referer ni cookie envoyé ; paramètres de lecture limités au slug. Aucune requête Google après refus.
- Validation des champs, honeypot masqué au focus/AT, délai local, succès après réponse, formulaire réinitialisé uniquement après succès, erreurs HTTP/réseau conservant le texte.
- Bouton désactivé pendant une réponse retenue ; second événement submit sans second appel ; pas d'ajout local de commentaire pending dans la liste publique.
- 320/375/1024/1440 px ; zéro violation axe détectée dans la section à 320/1440 ; labels, erreurs associées, aria-live, parcours clavier et focus visible.
- Texte agrandi à 200 % : la section commentaires ne déborde pas. Sans JS, les articles restent lisibles et un message explique le besoin de JS pour les commentaires.

Journal : [comments-browser.log](comments-browser.log). Le délai réseau de 15 secondes est implémenté ; le test navigateur couvre erreur HTTP/réseau, pas une vraie coupure de connexion Supabase. Aucun lecteur d'écran natif ni smartphone physique testé.

### Préservation et suites historiques

`tests/field-guides-static.py` : PASS, **20 HTML, 593 contrôles locaux, 16 URL sitemap**. Comparaison de **231 fichiers de la base** ; pour les six articles, seuls les marqueurs de section et les deux références ajoutées sont retirés avant comparaison. Corps éditorial, SEO, ressources, CSV, images, liens, styles historiques, CNAME et sitemap préservés.

Deux assertions historiques étaient obsolètes depuis la publication : les nouvelles pages ne sont plus des brouillons, et la base de préservation doit être la dernière version publiée. `field-guides.cjs` vérifie maintenant les dates réelles déjà présentes (24/09/2026) ; `field-guides-static.py` compare à `1aaf5b6`. Aucun assouplissement des assertions de zoom des suites historiques.

Suites relancées :

| Suite | Résultat |
|---|---|
| browser | PASS : navigation, CTA, liens Stripe, formulaire Formspree/Turnstile simulé, démonstration, articles |
| consent | PASS : refus/acceptation/retrait, cookies, événements simulés, absence de données de formulaire dans Analytics |
| consent-ux | PASS : tailles et boutons du consentement |
| i18n | PASS : navigation FR/EN, formulaire, prix, démonstrateur, clavier et consentement interlangues |
| blog-launch | PASS : 16 pages sitemap, SEO, liens/ressources, versions linguistiques, offres et confidentialité |
| analysis-guide | **ÉCHEC préexistant** : assertion `200% CSS layout zoom` |
| field-guides | **ÉCHEC préexistant** : même assertion de zoom |

Les journaux sont dans ce dossier. Les étapes suivant ces assertions n'ont pas été exécutées dans ces deux suites ; elles ne sont pas présentées comme réussies.

## Echecs préexistants confirmés

Les deux suites de guides échouent aussi sur une extraction intacte de `main` au commit `1aaf5b6`, sans composant commentaires. Pour field-guides, seule l'assertion obsolète de brouillon a été alignée sur les dates publiées avant cette reproduction. Journaux : [baseline-analysis.log](baseline-analysis.log), [baseline-field.log](baseline-field.log).

Relevé complémentaire : à 1440 px avec `body.style.zoom = 2`, la page étude de concurrence atteint une largeur défilante de 1820 px ; retirer la section commentaires laisse exactement la même largeur. Les styles de tableaux préexistants sont hors périmètre. Aucun correctif global ajouté pour masquer cet échec.

Sur les guides initiaux de veille FR/EN, certains titres débordent aussi à 320 px avec la taille de texte forcée à 200 %. Le test vérifie que retirer les commentaires ne change pas ce débordement. Les autres pages et la section commentaires ne présentent pas ce problème dans les cas exécutés. Ces points restent à traiter séparément avant d'affirmer que toutes les suites du dépôt passent.

## Captures

Les données affichées sont fictives : les chaînes ressemblant à des scripts démontrent le rendu en texte brut, et l'email saisi dans le formulaire n'est pas dans la liste publique. Le header fixe et le lien d'évitement sont masqués uniquement pendant la capture ciblée, pas dans le site ni les assertions.

- [FR 320](screenshots/fr-320.png), [FR 375](screenshots/fr-375.png), [FR 1024](screenshots/fr-1024.png), [FR 1440](screenshots/fr-1440.png).
- [EN 320](screenshots/en-320.png), [EN 375](screenshots/en-375.png), [EN 1024](screenshots/en-1024.png), [EN 1440](screenshots/en-1440.png).

## Performance

JS natif : environ 11,6 ko non compressés ; CSS : 1,8 ko. Aucun SDK tiers. Les tests observent zéro requête externe de commentaires au premier écran. La structure du formulaire est préparée sous l'article avant le défilement ; seules les données sont différées. Pas de mesure Lighthouse/LCP/CLS de production revendiquée. La liste dynamique peut modifier sa propre hauteur lors du chargement ou de « suivants » ; elle ne bloque pas l'article.

## Reproduction

Définir `PLAYWRIGHT_MODULE` vers Playwright, `CW_AXE_PATH` vers axe-core 4.10.3, disposer d'Edge. Définir `PGLITE_MODULE` vers `@electric-sql/pglite` 0.5.8 installé dans un répertoire de test (pas besoin de l'ajouter au site).

```text
node tests/blog-comments-sql.cjs
node tests/blog-comments.cjs
python tests/field-guides-static.py
node tests/browser.cjs
node tests/consent.cjs
node tests/consent-ux.cjs
node tests/i18n.cjs
node tests/blog-launch.cjs
node tests/analysis-guide.cjs
node tests/field-guides.cjs
```

Le paquet de test PGlite téléchargé a été vérifié avec l'intégrité SHA-512 du registre npm : `sha512-n9tsbUOhwx2epK1V0ZG9Ar4SHWUju04dhmzZXiSBXwBoleOvIfals33NAaWgagQVAL4Rbvx/Ptsu3P+pA09f6Q==`. Il n'est pas distribué aux visiteurs. Le SQL est exécuté uniquement en mémoire ; aucune connexion Supabase privée n'est utilisée.

## Etapes encore nécessaires

Appliquer la migration et la vérification dans Supabase, vérifier les autres vues/RPC éventuelles, compléter et valider les mentions de confidentialité avec les paramètres réels, puis obtenir l'accord explicite de publication. Garder la PR en brouillon jusque-là. Les problèmes historiques de zoom restent documentés ; aucun déploiement n'est effectué dans cette mission.
