# Starter : demande d’essai gratuit de 30 jours

Validation locale du 18 octobre 2026. Base : `43dcbdf2adf6199cfeedc2dc53e8c3551120d9cd` (`origin/main`). Branche : `codex/starter-trial-request`. PR destinée à rester en brouillon, sans publication.

## Audit et choix technique

La landing est statique. `README.md` décrit les Payment Links Stripe suivis d’une configuration manuelle. Aucun SDK, backend d’inscription ou mécanisme d’essai n’est implémenté dans ce dépôt. Le moteur de surveillance n’a pas été modifié. L’accès authentifié à Stripe n’étant pas disponible, les Price IDs et paramètres privés n’ont pas été vérifiés : cela ne démontre pas l’absence d’autres liens dans le compte.

Les quatre pages de paiement ont été ouvertes dans un véritable navigateur, en lecture seule :

| Offre | Prix affiché | Lien conservé |
|---|---|---|
| Starter | 14,90 €/mois, paiement aujourd’hui, aucun essai annoncé | https://buy.stripe.com/dRm5kC8cA3P93hg9pc4gg02 |
| Business | 29,90 €/mois | https://buy.stripe.com/dRm28q50o2L5aJI58W4gg03 |
| Pro | 59,90 €/mois | https://buy.stripe.com/3cI9AScsQ4Td8BA30O4gg04 |
| Promotion Business | 14,90 €/mois pendant 3 mois, remise de 15 € pendant 3 mois sur 29,90 €/mois | https://buy.stripe.com/dRm3cu78w4TdbNMdFs4gg05?prefilled_promo_code=CWBUSINESS3MOIS |

Aucun champ de paiement rempli, aucune acceptation de CGV, aucun paiement et aucune modification Stripe. Un véritable essai Stripe de 30 jours reste à configurer et vérifier si le propriétaire souhaite une inscription automatique. Le lien Starter actuel reste payant immédiatement et est présenté séparément comme « sans essai ».

## Parcours réellement livré (FR/EN)

1. Dans les tarifs, Starter présente 30 jours gratuits, puis 14,90 €/mois **si le prospect choisit de s’abonner** ; badge « essai sur demande ».
2. Le CTA principal mène au formulaire existant, avec son comportement de focus existant. Il ne crée ni essai, ni abonnement, ni prélèvement.
3. La carte demande d’indiquer « Essai Starter 30 jours » / « Starter 30-day trial » dans le message. Aucun champ, préremplissage, paramètre d’URL ou traitement Formspree n’est ajouté. Le message reste facultatif techniquement : le propriétaire doit clarifier une demande ambiguë.
4. Le propriétaire vérifie la compatibilité des pages, confirme les dates et active manuellement le périmètre Starter (jusqu’à 5 URL, une surveillance par jour). Le client peut demander l’arrêt avant la fin.
5. À la fin des 30 jours, le propriétaire clôture l’essai sauf choix explicite de souscrire. La poursuite payante passe par le lien Starter existant, à 14,90 €/mois. Aucun basculement automatique n’est implémenté.

Avant publication, le propriétaire doit valider sa capacité à assurer cette activation, le suivi des dates, l’arrêt et la proposition de poursuite payante. Le développement livre la **demande d’essai**, pas l’automatisation de sa gestion.

Le paiement direct Starter reste accessible. Business, Pro et la promotion Business conservent exactement leur contenu et leurs liens. L’essai n’est pas obligatoire. Les CTA du hero/navigation et des articles vers les tarifs bénéficient de cette présentation sans être modifiés. Les articles, leurs métadonnées, les pages juridiques, sitemap, CNAME, le formulaire, Turnstile, Supabase et les scripts partagés sont conservés.

## Mesure

Aucun événement ajouté ou modifié. Le nouveau CTA réutilise `commercial_cta_click` avec `destination: demande` après consentement Analytics. Cet événement mesure un clic vers le formulaire, pas un essai activé ; il ne permet pas de distinguer seul une demande d’essai des autres demandes de compatibilité.

Le lien payant conserve `stripe_click` / `plan: starter`. Le succès HTTP Formspree conserve `cw:lead-confirmed`, GA4 `generate_lead` et la conversion Ads selon les consentements existants. Aucun contenu du formulaire n’est envoyé dans ces événements. Ni `purchase` ni conversion « essai activé » ajoutée.

Pas d’infrastructure A/B. Après validation et publication futures, cette présentation deviendra la nouvelle référence à comparer aux anciennes métriques Google Ads. Compléter les clics et leads par un décompte manuel des demandes d’essai, essais réellement activés et abonnements ; ne pas confondre ces étapes ni attribuer un effet causal à une simple comparaison avant/après.

## Validation

Les logs des suites sont dans `logs/`. Les tests navigateur locaux interceptent les services externes : leurs succès ne constituent pas une validation de livraison d’email, d’activation du moteur ou de réception dans GA4/Ads. Le contrôle réel Stripe porte uniquement sur les pages de paiement affichées.

`starter-trial` vérifie les deux langues, les textes/prix, l’identité de Business/Pro et des quatre liens Stripe, le formulaire inchangé, les fichiers existants conservés (hors les deux homes et leurs assertions), six largeurs (320/375/390/768/1024/1440), absence de débordement de la carte, axe WCAG sur les tarifs à 320/1440, focus clavier, lien sans JavaScript, consentement/refus/retrait, événement CTA sans donnée personnelle et absence de paiement/demande réels.

Zoom CSS à 200 % dans une fenêtre 1440 px : contrôle de débordement réussi. Agrandissement du texte à 200 % à 320 px : la carte Starter reste contenue, mais la page entière a un débordement **préexistant**, identique à la base (FR 371 px, EN 457 px de largeur défilable). Il concerne des éléments hors carte, notamment démonstration et section de contact ; non corrigé pour respecter le périmètre. Le premier test global a échoué, puis la comparaison avant/après a permis de distinguer cet état préexistant d’une régression. Il ne s’agit pas d’un PASS d’accessibilité globale.

La sémantique et les contrastes sont contrôlés par axe et le focus au clavier. Une lecture réelle avec NVDA/VoiceOver et le zoom natif du navigateur restent à vérifier manuellement ; le zoom CSS automatisé n’est pas leur équivalent complet.

## Captures locales

| Langue / largeur | Avant | Après |
|---|---|---|
| FR / 320 | [carte](screenshots/fr-320-before-card.png) | [carte](screenshots/fr-320-after-card.png) |
| FR / 1440 | [carte](screenshots/fr-1440-before-card.png) | [tarifs](screenshots/fr-1440-after-grid.png) |
| EN / 320 | [carte](screenshots/en-320-before-card.png) | [carte](screenshots/en-320-after-card.png) |
| EN / 1440 | [carte](screenshots/en-1440-before-card.png) | [tarifs](screenshots/en-1440-after-grid.png) |

Aucune fusion ni publication autorisée par cette livraison. Validation commerciale et visuelle du propriétaire requise.

### Résultats exécutés

| Suite | Résultat |
|---|---|
| `node tests/starter-trial.cjs` | PASS FR/EN, six largeurs, axe tarifs, clavier, comparaison 200 %, événements et invariants |
| `node tests/browser.cjs` | PASS |
| `node tests/i18n.cjs` | PASS |
| `node tests/consent.cjs` | PASS |
| `node tests/consent-ux.cjs` | PASS |
| `node tests/google-ads.cjs` | PASS (tag simulé, services interceptés) |
| `node tests/blog-launch.cjs` | PASS à la relance isolée ; premier essai interrompu par `ECONNRESET` sur `/en/privacy.html` local, log conservé |
| `git diff --check` | PASS |

Exécution avec Node fourni par Codex, Playwright et Edge headless. `PLAYWRIGHT_MODULE` pointe sur le module fourni ; `CW_AXE_PATH` pointe sur axe-core 4.10.3. Aucun changement de code n’a été nécessaire pour le nouvel essai de `blog-launch`. Les scripts de tracking et formulaire sont identiques à la base ; aucun test réseau Google réel supplémentaire n’a été réalisé dans cette mission.
