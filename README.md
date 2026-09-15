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

Les mentions légales identifient Flavian Combes, entrepreneur individuel / Cybersignal, et l’hébergeur GitHub. cgv.html contient les conditions de vente exclusivement professionnelles. La politique de confidentialité couvre Stripe, Formspree, Apify, Resend et GitHub, les finalités, droits, critères de conservation et transferts éventuels. Aucun contenu provisoire ne reste dans ces pages.

L’offre est réservée aux professionnels. Les CGV prévoient l’arrêt des renouvellements après résiliation, la fin de service au terme de la période payée et l’absence de remboursement automatique, sous réserve de la loi ou d’un accord explicite. Les informations d’identité et le régime de TVA proviennent du propriétaire. Consulter docs/LEGAL_REQUIREMENTS.md pour les vérifications de mise en œuvre et de revue juridique ; la rédaction ne constitue pas une certification de conformité.

Le site n’intègre ni analytics, ni publicité, ni cookie de suivi ; pas de bandeau cookies ajouté.

## Maintenance et contrôles

index.html, styles.css, script.js : page, présentation et interactions. demo-produit.html : exemple fictif. assets/favicon.svg : favicon. Les supports commerciaux restent dans docs/. Voir docs/VALIDATION.md et docs/LAUNCH_CHECKLIST.md.

Prévisualisation : ouvrir index.html ou servir le dossier avec un serveur HTTP statique. Vérification JavaScript : node --check script.js. Après toute modification, contrôler menu, CTA, formulaire, liens, mobile et clavier. Ne pas enregistrer de données de prospects dans ce dépôt.

## Achat public via Stripe

Parcours : landing page → Payment Link Stripe → abonnement mensuel → configuration manuelle ChangeWatch avec l’équipe. Les boutons de forfait ouvrent Stripe dans le même onglet, sans interception JavaScript et sans passer par Formspree. Le bouton du menu et le bouton principal mènent aux tarifs.

- Starter : https://buy.stripe.com/dRm5kC8cA3P93hg9pc4gg02
- Business : https://buy.stripe.com/dRm28q50o2L5aJI58W4gg03
- Pro : https://buy.stripe.com/3cI9AScsQ4Td8BA30O4gg04

Ces liens publics de production fournis par le propriétaire créent des abonnements mensuels sur le compte Cybersignal. Aucune clé Stripe, aucun SDK, backend, webhook ou seconde page de paiement n’est ajouté au dépôt. La confirmation de paiement est hébergée par Stripe ; l’opérateur finalise ensuite la configuration. Vérifier dans Stripe les montants, la périodicité, les notifications et le suivi manuel des nouveaux abonnés. Un clic de contrôle ne doit pas se transformer en achat réel non voulu.

Pages juridiques : mentions-legales.html, cgv.html, confidentialite.html. Elles sont accessibles depuis le pied de page ; les CGV sont également liées près des tarifs. Configurer dans Stripe la présentation des CGV et leur acceptation avant paiement, la restriction aux clients professionnels et la conservation de la version acceptée : le lien de la landing ne prouve pas à lui seul cette acceptation.

## Protection anti-spam Turnstile

Le formulaire charge le script officiel Cloudflare et utilise uniquement la clé publique 0x4AAAAAAE2QTEgZOtjjoxAY. Le widget compact tient dans le formulaire mobile. Le champ caché cf-turnstile-response est inclus dans FormData puis transmis avec les autres champs au même endpoint Formspree. Sans jeton, le message anti-spam apparaît et aucune requête n’est envoyée. Après chaque tentative envoyée, réussie ou échouée, le widget est réinitialisé ; les champs du prospect ne sont effacés qu’après succès.

La clé privée reste exclusivement configurée chez Formspree, qui valide le jeton ; aucun appel de validation Cloudflare ni backend n’est ajouté au site. Vérifier que le domaine changewatch.cybersignal.fr est autorisé pour cette clé publique. Après déploiement, tester une vérification réelle et la livraison de la demande. Les tests locaux utilisent un widget simulé et des réponses Formspree interceptées, sans soumission externe.

## Blog SEO

Index : https://changewatch.cybersignal.fr/blog/
Premier article : https://changewatch.cybersignal.fr/blog/veille-concurrentielle-ecommerce/

Les pages HTML sont statiques et réutilisent styles.css, le favicon et script.js pour la navigation. Les styles éditoriaux sont isolés dans assets/blog.css. Aucun script Stripe, Formspree ou Turnstile n’est chargé par le blog ; le script partagé n’initialise le formulaire que lorsqu’il existe.

Article publié le 15 septembre 2026, auteur ChangeWatch — Cybersignal. Environ 1764 mots, lecture estimée à 9 minutes sur une base de 200 mots/minute. Métadonnées uniques, canonical, Open Graph, Twitter, BlogPosting et BreadcrumbList sont inclus. Aucun visuel ou résultat client fictif.

Pour un nouvel article : créer blog/<slug>/index.html, adapter le contenu et les métadonnées, ajouter la carte sur l’index et l’URL au sitemap. Ne modifier dateModified qu’après une modification éditoriale effective ; conserver la date de publication initiale. Vérifier les chemins relatifs depuis le sous-dossier et actualiser le temps de lecture.

sitemap.xml référence l’accueil, les trois pages juridiques et les deux pages du blog. La démonstration non indexable est exclue. robots.txt autorise l’exploration et indique le sitemap. Une soumission du sitemap dans Search Console peut être effectuée par le propriétaire après déploiement ; elle ne garantit pas l’indexation.
