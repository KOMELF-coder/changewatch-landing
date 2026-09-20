# Validation finale FR/EN — 20 septembre 2026

## Décision proposée

**Les contrôles techniques locaux réussissent. La publication reste en attente de l’accord du propriétaire et de la résolution des mentions téléphoniques manquantes.** Aucune fusion ni publication effectuée. La version française reste fonctionnelle dans les tests locaux et les contrôles publics décrits ci-dessous.

Branche : `codex/fr-en-internationalization`, PR #4. `git fetch origin` puis mise à jour fast-forward : branche déjà à jour au début de la revue, commit `056e01699074d9366fbb361e14491d42c6363172`. Base distante `main` : `f83234103c4deb184d93889548d837a9c46e2b69`. Cette finalisation ne change aucun fichier exécuté ou affiché par le site : correction d’un test instable et actualisation du dossier de revue uniquement.

## Exécutions indépendantes

Node / Playwright / Microsoft Edge headless, axe-core fourni localement. Chaque suite a été lancée séparément, sans déduire ses résultats d’une exécution antérieure. Aucune vérification TLS désactivée. Le vrai script Google a été téléchargé avec `--use-system-ca` ; toutes ses collectes ont été interceptées **sur localhost**.

| Commande / contrôle | Résultat du 20 septembre |
| --- | --- |
| `node tests/browser.cjs` | Réussi, code 0 : sept pages françaises, ressources/ancres, blog/JSON-LD, prix et liens Stripe, menu/Échap, FAQ, formulaire, quatre états de démonstration, animations, réduction des animations, texte 200 %, sans JS |
| `node tests/i18n.cjs` avec `CW_AXE_PATH` | Première exécution en échec dans le test de double soumission ; corrigé puis deux exécutions complètes réussies, code 0 |
| `node tests/consent.cjs` avec `CW_AXE_PATH` | Réussi, code 0 : absence de Google avant accord/au refus, accord, retrait, cookies, onglets, stockage bloqué, expiration et événements filtrés |
| `node tests/consent-ux.cjs` | Réussi, code 0 : 320 / 375 / 390 / 1440 px, trois choix accessibles, boutons, clavier, petit écran et agrandissement ; pas de débordement ni de masquage du CTA contrôlé |
| `CW_REAL_GA=1 node --use-system-ca tests/consent.cjs` avec axe | Réussi, code 0 : véritable balise GA4, collecte entièrement interceptée |
| `node --check` sur `script.js`, `assets/experience.js`, `assets/consent.js`, `assets/analytics-frame.js`, `tests/i18n.cjs` | Réussi |
| `git diff --check` | Réussi |
| Sitemap XML | Analyse réussie, 10 URL ; paires canonical/hreflang/ressources/ancres vérifiées par la suite bilingue, démonstrations noindex exclues |
| Accessibilité / responsive EN | Cinq pages EN sans violation axe ; liens de langue au clavier, menu, consentement, labels, affichage à 320 / 375 / 390 / 768 / 1024 / 1440 px, texte 200 % et sans JS |
| Liens HTTP externes + pages publiques FR | 30 URL : HTTP 200, dont les trois Payment Links et les pages françaises, blog, sitemap, robots, Search Console ; [résultats détaillés](HTTP_CHECKS_2026-09-20.json) |

### Anomalie corrigée : synchronisation du test anglais

Dans le scénario d’erreur réseau immédiate, l’ancien test déclenchait sa seconde soumission via un second aller-retour Playwright. La première tentative pouvait déjà avoir terminé et réinitialisé Turnstile ; la seconde tentative affichait alors légitimement le message de jeton manquant, au lieu du message réseau attendu par le test.

Le test déclenche maintenant ses deux soumissions dans la même tâche JavaScript du navigateur, avant toute résolution de la requête. Il vérifie aussi le bouton désactivé, `aria-busy`, « Sending… » et « Sending your request… ». Les assertions d’une seule requête, de réinitialisation Turnstile, de conservation des champs en échec et de confirmation uniquement après 2xx restent présentes. Aucune temporisation du code produit ni aucun assouplissement de sa protection n’a été ajouté.

Les réponses Formspree, le jeton et le widget des suites locales sont simulés explicitement. Succès 2xx, HTTP 422, erreur réseau et délai de 15 secondes ont été testés en français et en anglais. **Aucune demande réelle n’a été envoyée.**

La balise Google réelle a produit les seuls noms attendus dans les requêtes interceptées : `page_view`, `commercial_cta_click`, `stripe_click`, `generate_lead`. Aucun `purchase`. Ce contrôle ne démontre pas la réception dans les rapports GA4, car aucune collecte locale n’est transmise.

## Contrôle du site français déjà publié

Navigation réelle vers `https://changewatch.cybersignal.fr/`, sans remplacement des ressources distantes : HTTP 200, TLS vérifié. Refus du consentement, affichage aux largeurs 320 / 390 / 768 / 1440 px, menu mobile/Échap et quatre étapes du démonstrateur contrôlés. Aucun débordement horizontal, aucune exception JavaScript de page, aucune requête Analytics après refus ni requête réseau abandonnée observés. Formulaire affiché, ni rempli ni soumis.

Le véritable script Turnstile répond 302 puis 200 et son iframe se charge en 200. Une réponse HTTP 401 sur la requête Private Access Token est relevée ; Cloudflare décrit ce cas comme pouvant faire partie du fonctionnement normal ([documentation officielle](https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/error-codes/)). **Aucun jeton final observé après six secondes au niveau du formulaire : résolution complète du CAPTCHA non validée**, sans conclure que le 401 en est la cause. Vérification humaine toujours nécessaire, suivie d’un test de livraison uniquement s’il est autorisé.

Les sept pages françaises et les trois fichiers sitemap/robots/Search Console répondent 200. Le corps du fichier Search Console correspond exactement à la ligne attendue. Les pages anglaises ne sont pas publiées ; leur contrôle HTTPS public reste à faire après un déploiement autorisé.

Le blog, ses illustrations, CNAME, robots.txt et la validation Search Console sont inchangés par rapport à `origin/main`. Les vues locales desktop/mobile ont été régénérées et revues ; les captures de la PR restent représentatives, aucun changement de présentation n’étant introduit par cette finalisation.

## Stripe : provenance des vérifications

**Confirmations du propriétaire, reçues pour cette mission — pas un nouvel audit du Dashboard :**

- Acceptation obligatoire des CGV activée pour Starter, Business, Pro et le lien promotionnel Business.
- Messages de confirmation des trois forfaits publics bilingues FR/EN.
- Tarifs et Payment Links inchangés.

**Vérifié dans le dépôt et par les tests :** 14,90 / 29,90 / 59,90 € par mois, limites 5 / 15 / 40 URLs, fréquences et trois liens Stripe identiques ; navigation dans le même onglet et HTTP 200. Aucune modification Stripe et aucun achat.

**Anomalie distante signalée :** la description de l’abonnement du lien promotionnel Business a disparu après une modification. Selon le propriétaire, le coupon reste actif : **14,90 €/mois pendant trois mois, puis 29,90 €/mois**. Aucun autre tarif n’est déduit. Le lien promotionnel n’est ni ajouté au site ni reconstitué ; il n’a pas été inspecté dans Stripe. Le propriétaire doit rétablir/valider sa description et contrôler l’affichage des conditions avant de réutiliser ce lien en prospection. Cette anomalie concerne ce parcours promotionnel, pas les trois liens publics conservés.

La version exacte des CGV liée dans Stripe, la preuve/version de l’acceptation et le rendu des confirmations restent à contrôler par le propriétaire ; les confirmations après paiement n’ont pas été ouvertes via un paiement de test réel.

## Dernière comparaison juridique FR/EN

Relecture des six documents et contrôle structurel de leurs blocs de contenu. Aucun écart de fond identifié ; aucune disposition française modifiée. Cette revue de traduction et de cohérence **n’est pas une certification juridique**.

| Paire | Comparaison |
| --- | --- |
| `cgv.html` / `en/terms.html` | 19 sections, 30 paragraphes et 8 éléments de liste dans chaque version. Identité, prix, limites, TVA, B2B, setup manuel, absence de garantie exhaustive/temps réel, paiement, résiliation, pénalités BCE + 10 points / 40 €, responsabilité, article 1218 et droit français conservés. Pas de clause nouvelle de primauté linguistique. L’acceptation Stripe confirmée est cohérente avec la section 1. |
| `mentions-legales.html` / `en/legal-notice.html` | 6 sections, 9 paragraphes et 4 éléments de liste. Même exploitant, SIREN/SIRET, adresse, publication, hébergeur et régime fiscal. Traduction fidèle ; la même lacune téléphonique existe dans les deux langues. |
| `confidentialite.html` / `en/privacy.html` | 10 sections, 21 paragraphes et 15 éléments de liste. Mêmes traitements, prestataires, droits et transferts ; préférence de consentement six mois, cookies 180 jours sans renouvellement automatique, refus/retrait cohérents avec les scripts. GA4 : 2 mois événements / 14 mois utilisateurs, réinitialisation activée, Signals et données fournies par les utilisateurs désactivés selon les confirmations antérieures du propriétaire. Aucun nouvel audit du compte GA4 distant. |

Les engagements opérationnels de conservation, suppression, facturation, résiliation et transferts des prestataires ne sont pas démontrés par des tests du site statique. Le dossier [LEGAL_REQUIREMENTS.md](../LEGAL_REQUIREMENTS.md) conserve ces vérifications opérationnelles. Les dates de version des textes ne sont pas modifiées puisqu’aucune clause n’est changée.

### Mentions téléphoniques : point à résoudre avant publication

L’article 19, 2° de la LCEN impose des coordonnées téléphoniques permettant un contact effectif pour l’activité de commerce électronique ([version applicable consultée](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032236011)). Le site n’en indique pas. Le statut B2B ne permet pas de présumer une dispense. Il s’agit d’une obligation de contact, **pas d’une obligation démontrée d’acheter une ligne professionnelle distincte**. Le refus d’acquérir un numéro dédié ne résout donc pas à lui seul cette absence : une coordonnée réelle et validée, ou une analyse juridique documentant une solution conforme applicable, reste nécessaire.

La fiche officielle [Service Public — mentions de l’entrepreneur individuel](https://entreprendre.service-public.gouv.fr/vosdroits/F31228) demande aussi le téléphone de l’hébergeur. Les deux pages indiquent GitHub, Inc., son adresse et des liens de contact, mais aucun numéro. L’adresse correspond bien à la [page officielle GitHub consultée](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement#contact-us), qui ne fournit pas de téléphone dans sa section contact. Ce complément reste à vérifier auprès de l’hébergeur ; aucun numéro tiré d’un annuaire non vérifié n’a été ajouté.

Ces lacunes sont préexistantes sur le français ; leur traduction fidèle ne les corrige pas. Le rapport les traite comme des points bloquants de préparation juridique, sans conclure à une conformité globale ni inventer de coordonnées.

## Checklist de décision

- [ ] Résoudre les coordonnées téléphoniques de l’exploitant et de l’hébergeur avec des informations vérifiées et la revue juridique adaptée.
- [ ] Valider explicitement les trois traductions juridiques et donner l’accord de fusion/publication.
- [ ] Dans Stripe : contrôler les CGV effectivement liées et la conservation de leur acceptation ; rétablir la description promotionnelle avant usage de ce lien.
- [ ] Sur navigateur humain : résoudre le vrai Turnstile ; n’effectuer un envoi Formspree qu’avec autorisation et vérifier sa livraison.
- [ ] Après publication autorisée : contrôler les routes EN, ressources/SEO sur HTTPS et les requêtes GA4 réelles, puis leur réception dans les rapports avec le propriétaire.

**Bilan : pas de blocage technique connu dans le code du site ; test instable corrigé. Accord de publication non reçu, revue juridique/téléphones non clôturés, validations externes ci-dessus non remplacées par des simulations.**
