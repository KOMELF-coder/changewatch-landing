# ChangeWatch — site commercial

Production : https://changewatch.cybersignal.fr
Contact : changewatch@cybersignal.fr
Formulaire : Formspree, https://formspree.io/f/mbgjnvjq

Site statique HTML/CSS/JavaScript, sans dépendance de production ni serveur. Le moteur de surveillance reste dans son dépôt séparé.

## Infrastructure

GitHub Pages est configuré sur main / racine. Le domaine personnalisé et son DNS sont configurés ; CNAME contient uniquement changewatch.cybersignal.fr. Préserver ce fichier. Les poussées sur main déclenchent la publication ; vérifier le résultat dans Actions puis Settings → Pages. Le certificat HTTPS était en cours d’émission lors de la demande : vérifier sa disponibilité et activer Enforce HTTPS dès que possible. Ne jamais contourner un avertissement de certificat.

Canonical et og:url : https://changewatch.cybersignal.fr/ ; favicon local conservé. Aucun ancien domaine github.io n’est utilisé comme URL publique canonique.

## Formulaire

Configuration publique dans CONTACT_CONFIG au début de script.js. L’endpoint Formspree est public par conception, ce n’est pas une clé secrète. Aucun secret n’est nécessaire dans le navigateur.

Soumission AJAX par fetch POST JSON avec Accept: application/json. Champs : name, company, email, competitor_url_1, competitor_url_2, competitor_url_3, optional_message.

Le bouton affiche « Envoi en cours… », est désactivé et un verrou empêche les doubles soumissions simultanées. Une réponse HTTP 2xx de Formspree confirme la réception : le message de succès s’affiche sans rechargement et le formulaire est vidé. Pas de simulation de succès ni d’exigence d’un champ JSON propriétaire success.

En cas d’erreur HTTP, réseau ou après 15 secondes sans confirmation, les données sont conservées, le bouton réactivé et un message propose changewatch@cybersignal.fr. Le lien email reste visible en permanence. Un délai expiré ne prouve pas l’absence de réception : vérifier Formspree avant de retenter un envoi incertain. Sans JavaScript, l’envoi reste désactivé et le lien email fonctionne.

La confirmation signifie réception de la demande, pas activation automatique du service. Le formulaire reste facultatif pour les questions de compatibilité, l’avant-vente, les agences et les besoins particuliers. Il n’intervient pas dans le paiement. Documentation prestataire : https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax

## Tarifs conservés

| Forfait | Prix / mois | URLs | Fréquence |
| --- | --- | --- | --- |
| Starter | 14,90 € | 5 | 1 / jour |
| Business | 29,90 € | 15 | 1 / jour |
| Pro | 59,90 € | 40 | Jusqu’à 3 / jour |

Forfaits mensuels sans engagement, résiliables à tout moment. Configuration manuelle incluse. TVA non applicable — art. 293 B du CGI.

L’offre publique est payante dès le départ. Un essai manuel discrétionnaire peut être proposé uniquement en privé à un prospect qualifié ; voir docs/TRIAL_INTAKE.md.

Lorsqu’aucune alerte significative n’a été envoyée, un récapitulatif hebdomadaire confirme l’activité de surveillance. La compatibilité et la couverture des pages publiques sont vérifiées à la configuration.

## Test complet de production

Après déploiement et validation HTTPS, ouvrir le domaine public, remplir une demande identifiable comme test avec une adresse contrôlée et trois URLs publiques, puis envoyer une seule fois. Vérifier le message à l’écran, la demande dans Formspree et sa livraison à changewatch@cybersignal.fr. Vérifier aussi les spams et les paramètres de notification du formulaire. Les tests automatisés utilisent des réponses simulées et ne prouvent pas la livraison réelle. Aucune demande réelle n’a été envoyée pendant la finalisation.

## Juridique et confidentialité

Les pages expliquent le rôle de Formspree et indiquent le contact réel. L’identité légale de l’éditeur et du responsable du traitement, les mentions applicables, les coordonnées de l’hébergeur et les modalités de conservation restent à fournir ; voir docs/LEGAL_REQUIREMENTS.md. Aucune durée ou identité n’a été inventée. Le site n’intègre ni analytics, ni publicité, ni cookie de suivi ; pas de bandeau cookies ajouté.

## Maintenance et contrôles

index.html, styles.css, script.js : page, présentation et interactions. demo-produit.html : exemple fictif. assets/favicon.svg : favicon. Les supports commerciaux restent dans docs/. Voir docs/VALIDATION.md et docs/LAUNCH_CHECKLIST.md.

Prévisualisation : ouvrir index.html ou servir le dossier avec un serveur HTTP statique. Vérification JavaScript : node --check script.js. Après toute modification, contrôler menu, CTA, formulaire, liens, mobile et clavier. Ne pas enregistrer de données de prospects dans ce dépôt.

## Achat public via Stripe

Parcours : landing page → Payment Link Stripe → abonnement mensuel → configuration manuelle ChangeWatch avec l’équipe. Les boutons de forfait ouvrent Stripe dans le même onglet, sans interception JavaScript et sans passer par Formspree. Le bouton du menu et le bouton principal mènent aux tarifs.

- Starter : https://buy.stripe.com/dRm5kC8cA3P93hg9pc4gg02
- Business : https://buy.stripe.com/dRm28q50o2L5aJI58W4gg03
- Pro : https://buy.stripe.com/3cI9AScsQ4Td8BA30O4gg04

Ces liens publics de production fournis par le propriétaire créent des abonnements mensuels sur le compte Cybersignal. Aucune clé Stripe, aucun SDK, backend, webhook ou seconde page de paiement n’est ajouté au dépôt. La confirmation de paiement est hébergée par Stripe ; l’opérateur finalise ensuite la configuration. Vérifier dans Stripe les montants, la périodicité, les notifications et le suivi manuel des nouveaux abonnés. Un clic de contrôle ne doit pas se transformer en achat réel non voulu.
