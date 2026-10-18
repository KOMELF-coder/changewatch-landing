# Bandeau Starter sticky — validation locale

Branche créée depuis `origin/main` au commit `cde98b9` (PR #16 déjà intégrée par le propriétaire). Pas de fusion ni déploiement dans cette livraison.

## Modification

Le bandeau global FR/EN annonce désormais l’essai Starter de 30 jours et pointe vers `#demande`. Son attribut `data-starter-trial` réutilise sans modification les mécanismes de présélection et de tracking existants. Le contenu tarifaire, les quatre liens Stripe, la promotion Business, le formulaire complet et les scripts Analytics/Ads/consentement sont inchangés.

Le bandeau et le header sont regroupés dans `.sticky-top`, un conteneur `position:sticky; top:0`, de hauteur naturelle. Le header reste dans le flux sous le bandeau : aucun offset fixe entre eux. Le conteneur est limité à la hauteur du viewport et reste défilable si le menu ou le zoom dépassent cette hauteur ; le bandeau reste sticky dans ce conteneur. Son niveau de superposition laisse le lien d’évitement clavier au-dessus.

`ResizeObserver` ne pilote pas le sticky : il mesure uniquement la hauteur cumulée pour `--sticky-offset` / `scroll-padding-top`. Cela évite de figer une hauteur fragile pour les ancres malgré traductions, menu ouvert, retours à la ligne et zoom. Le formulaire garde une marge supplémentaire de 16 px. Sans JS, le sticky CSS reste actif avec un dégagement d’ancre conservateur de 18 rem ; l’envoi du formulaire conserve son alternative email existante.

## CTA et mesure

Le clic sélectionne l’essai dans `request_type` et donne le focus au formulaire, sans remplir les autres champs. Les autres CTA continuent de sélectionner la compatibilité. Le choix reste modifiable.

Après consentement Analytics : un `free_trial_click` avec `plan:starter`, `destination:demande`, routé uniquement vers GA4 ; `commercial_cta_click` conservé. Aucun événement d’essai ne devient une conversion Ads. Aucun changement du label Ads, de `generate_lead`, des champs envoyés ou de Turnstile. Aucune donnée personnelle ni `request_type` dans les événements.

## Contrôles

Logs dans `logs/`. Les tests utilisent Edge headless et interceptent les services externes : pas de demande Formspree, paiement ou collecte Google réels. Les événements Google sont vérifiés dans l’iframe ou avec le tag simulé, pas dans les rapports GA4.

Le test `starter-banner` couvre FR/EN, textes et marqueur, 320/375/390/768/1024/1440 px, scroll de 2500 px, position visible du bandeau et absence de recouvrement par le header, menu mobile, ancres tarifs/fonctionnement/alertes/FAQ/formulaire, titre et type de demande visibles, focus clavier, zone CTA >=44 px, zoom CSS 200 %, axe, refus et événement consenti à paramètres fixes. Il compare la section tarifs et le formulaire à main.

Suites exécutées — toutes PASS : starter-banner, starter-trial, browser, i18n, consent, consent-ux, google-ads, blog-launch et git diff --check. Les premiers essais du nouveau test ont nécessité de normaliser CRLF/LF et de préciser un sélecteur de test ambigu ; aucun changement métier associé.

Limites : zoom natif et lecteur d’écran matériel non validés ; le contrôle automatisé 200 % utilise le zoom CSS. Le débordement global préexistant à 320 px avec texte agrandi à 200 % reste documenté dans le rapport Starter, sans aggravation. Validation visuelle propriétaire requise avant publication.

## Captures

| Langue | Largeur | Haut de page | Après scroll |
|---|---|---|---|
| FR | 1440 | [haut](screenshots/fr-1440-top.png) | [scroll](screenshots/fr-1440-scroll.png) |
| FR | 320 | [haut](screenshots/fr-320-top.png) | [scroll](screenshots/fr-320-scroll.png) |
| EN | 1440 | [haut](screenshots/en-1440-top.png) | [scroll](screenshots/en-1440-scroll.png) |
| EN | 320 | [haut](screenshots/en-320-top.png) | [scroll](screenshots/en-320-scroll.png) |
