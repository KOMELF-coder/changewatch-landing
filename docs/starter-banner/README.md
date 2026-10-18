# Header au-dessus du bandeau Starter — validation

La PR #17 a déjà été fusionnée dans main (`51f0d08`). Le propriétaire a explicitement autorisé une nouvelle PR en brouillon pour ce correctif. Branche : `codex/header-above-starter-banner`, issue de ce main. Aucune fusion ni publication dans cette livraison.

## Périmètre

Seul l’ordre du bloc sticky change : **header/navigation, puis bandeau Starter**. Le contenu HTML du header et du bandeau est conservé ; l’aside est déplacé après le header dans `.sticky-top`, sans duplication. Son positionnement sticky individuel est retiré : les deux composants restent dans le flux naturel du conteneur sticky commun, fixé au haut de la fenêtre pendant le scroll.

Aucune hauteur fixe ni nouveau JavaScript. Le ResizeObserver existant mesure toujours la hauteur cumulée et alimente `--sticky-offset` pour les ancres. Aucune modification du formulaire, des tarifs, de Business/Pro, des quatre liens Stripe, de Turnstile, de GA4/Ads/consentement, des événements, des articles ou du SEO.

Mobile inchangé : breakpoint `max-width:600px`, titre court, phrase secondaire masquée, CTA >=44 px ; bandeau de **57 px** à 320/375/390 dans les deux langues. Dès 601 px, le titre long et la phrase secondaire restent visibles. Les dimensions et styles calculés du header, du bandeau et de leurs descendants sont comparés à `2187f36`, à chacune des six largeurs.

## Parcours et tracking

Le CTA conserve `href="#demande"` et `data-starter-trial`. Il présélectionne l’essai FR/EN sans remplir les autres champs. Les autres CTA conservent la compatibilité et le choix reste modifiable. `free_trial_click` reste limité au consentement Analytics avec `plan:starter`, `destination:demande` ; `commercial_cta_click` est conservé. Pas de donnée formulaire ni `request_type` vers Google. Les conversions restent liées au succès Formspree.

## Tests et limites

Les logs sont dans `logs/`. `starter-banner` vérifie le header à y=0, le bandeau exactement sous son bord inférieur, leur visibilité avant/après un scroll de 2500 px, l’absence de chevauchement/espace/overflow, les ancres tarifs/demande/fonctionnement/alertes/FAQ, le menu mobile, le focus clavier et le lien d’évitement, la zone CTA, les dimensions/styles inchangés, axe, le zoom CSS 200 %, la présélection et les événements fixes après consentement.

Le premier essai utilisait une comparaison PNG stricte de chaque composant déplacé. Elle a échoué ; le test compare désormais les styles et dimensions indépendamment de la position, complété par les captures réelles, plutôt que d’exiger des pixels identiques après déplacement vertical.

Services externes interceptés dans les tests : aucun paiement, contact Formspree ou événement Google réel. La réception des événements dans les rapports Google n’est pas validée. Le lecteur d’écran matériel et le zoom natif du navigateur restent des vérifications manuelles. Le débordement global préexistant à 320 px avec texte à 200 % demeure inchangé, documenté dans le rapport Starter.

## Captures régénérées

| Langue | Largeur | Haut | Après scroll |
|---|---|---|---|
| FR | 1440 | [haut](screenshots/fr-1440-top.png) | [scroll](screenshots/fr-1440-scroll.png) |
| FR | 320 | [haut](screenshots/fr-320-top.png) | [scroll](screenshots/fr-320-scroll.png) |
| EN | 1440 | [haut](screenshots/en-1440-top.png) | [scroll](screenshots/en-1440-scroll.png) |
| EN | 320 | [haut](screenshots/en-320-top.png) | [scroll](screenshots/en-320-scroll.png) |

## Résultats finaux

PASS : `starter-banner`, `starter-trial`, `browser`, `i18n`, `consent`, `consent-ux`, `google-ads`, `blog-launch`, `git diff --check`. Exécution locale avec Playwright/Edge, huit captures FR/EN régénérées. Tous les scripts existants sont identiques à main ; seul l’ordre HTML et la règle de positionnement individuel du bandeau changent côté site.
