# PR #9 — actualisation du 27 septembre 2026

## Base et périmètre

`main` **9580788** intégré dans la branche existante `codex/moderated-blog-comments` par merge, sans conflit. Aucun rebase forcé, nouvelle PR, fusion vers main ou déploiement. Les changements Google Ads/GA4/consentement, routes publiques, SEO, CTA, tarifs, Formspree et sitemap sont préservés. Comparaison automatique : corps et métadonnées des huit articles identiques à main après retrait des seuls ajouts du composant commentaires.

Composant partagé inchangé : `assets/blog-comments.js` et `.css`. Deux nouveaux points de montage : `logiciel-veille-concurrentielle` et `competitor-price-monitoring`, portant la couverture à huit articles FR/EN. RPC uniquement, rendu textContent, pagination, honeypot, validation, modération et verrou de soumission conservés.

## Supabase

Selon la confirmation du propriétaire, la migration `20260924170000_blog_comments.sql` a été appliquée avec succès le 27 septembre 2026 et la vérification SQL a réussi. Table présente, RLS activé, aucun accès public direct, deux RPC SECURITY DEFINER avec search_path verrouillé, projection publique sans email/status, insertion void et email inaccessible au rôle RPC. Migration et scripts SQL inchangés ; aucune réexécution en production.

**Vérification réelle de cette tâche :** POST de lecture à `get_approved_comments`, clé publishable existante, TLS vérifié, pour chacun des deux nouveaux slugs. HTTP **200**, réponse **[]** pour chacun. Aucun champ email/status retourné. Les réponses vides ne prouvent pas à elles seules la projection d'une ligne approuvée réelle : celle-ci est vérifiée dans la base locale et par le script SQL exécuté par le propriétaire. Aucun appel réel à submit_blog_comment, aucune modification de commentaire ni de statut, aucune lecture directe de la table. Voir `rpc-readonly.log`.

## Confidentialité

Pages FR/EN datées du 27 septembre, complétées sur le nom, l'email privé, le texte, la modération, le suivi lié au commentaire et Supabase. Conservation pendant la durée nécessaire à ces finalités et aux obligations applicables, sans durée chiffrée inventée. Aucun transfert de ces champs vers Google. La logique de tracking est strictement identique à main.

## Tests exécutés

| Test | Résultat |
|---|---|
| blog-comments | PASS : huit articles ; 320, 375, 390, 768, 1024, 1440 ; lecture différée, vide/approuvé simulé, contenu HTML rendu comme texte, champs privés exclus, erreurs RPC/réseau, timeout 15 s FR/EN, double soumission, validation/honeypot, pagination, focus/clavier, axe, zoom 200 %, sans JS |
| blog-comments-sql | PASS PostgreSQL 18.3/PGlite local : permissions/RLS, projection, isolation, pending, validations, modération, search_path, retour void ; chemin du module corrigé après un premier MODULE_NOT_FOUND |
| browser | PASS |
| consent | PASS |
| consent-ux | PASS |
| i18n | PASS |
| blog-launch | PASS : 18 pages, liens/ancres/ressources et SEO |
| google-ads | PASS : simulateur, événements autorisés et refus/retrait ; aucun envoi réel Google |
| operations-guides | PASS : comparaison adaptée pour ignorer uniquement l'ajout des commentaires, métadonnées/CTA/consentement préservés |
| comparaison de préservation | PASS : huit articles et intégrations principales vs main 9580788 |
| git diff --check | PASS |

Journaux dans ce dossier. Les autres services externes sont interceptés dans les tests navigateur : aucun paiement, contact Formspree ou commentaire réel. Le SQL est exécuté exclusivement dans une base éphémère locale. Aucun test avec le vrai script Google n'est revendiqué pour cette passe.

## Limites et état préexistant

- Débordement éditorial préexistant à 320 px et texte 200 % dans les anciens guides généraux FR/EN : le test supprime le composant et constate la même largeur ; les commentaires eux-mêmes tiennent. Pas de modification des anciens styles pour masquer le défaut.
- Le test consent-ux signale le recouvrement existant à 320 px, sans nouvel échec ni modification du bandeau.
- Les anciens échecs analysis-guide (zoom CSS) et field-guides (dates de publication attendues absentes) restent documentés dans les rapports historiques ; pas de résultat de nouvelle exécution revendiqué ici.
- Avant publication : validation visuelle du propriétaire, organisation effective de la modération et suppression/conservation, paramètres régionaux et contractuels Supabase à confirmer. Cette revue n'est pas une certification RGPD.
- L'insertion et la modération réelles ne sont volontairement pas testées en production avec de fausses données. Les valider en environnement de test ou lors d'une contribution réelle autorisée.
- PR à garder en brouillon ; aucune publication autorisée par cette mission.

Contrôle statique supplémentaire : PASS tests/field-guides-static.py après actualisation de la base de comparaison sur main 9580788 ; 694 liens locaux, 18 URL sitemap et ressources CSV préservées. Captures FR/EN actualisées dans refresh/screenshots/.
