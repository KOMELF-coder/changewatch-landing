# Validation de production — 15 septembre 2026

- Syntaxe JavaScript vérifiée avec node --check.
- Microsoft Edge / Chromium : aucune erreur JavaScript de page.
- Largeurs 320, 375, 390, 768, 1024 et 1440 pixels sans débordement horizontal.
- Texte agrandi à 200 %, préférence de réduction des mouvements, navigation clavier et FAQ vérifiés.
- Menu mobile : ouverture, fermeture après lien, Escape et retour du focus.
- CTA de mise en place vers #demande ; focus du formulaire et présélection Business vérifiés.
- Ancres, labels, identifiants, h1 unique, langue française et assets locaux vérifiés.
- Canonical et og:url : https://changewatch.cybersignal.fr/.
- Champs Formspree vérifiés : name, company, email, competitor_url_1, competitor_url_2, competitor_url_3, optional_message, plus plan.
- Réponses Formspree simulées : HTTP 200, HTTP 422, erreur réseau et expiration après 15 secondes.
- Bouton désactivé et verrou contre doubles soumissions simultanées : une seule requête.
- Succès uniquement après réponse HTTP 2xx, message exact et remise à zéro du formulaire.
- Erreur : message exact, valeurs conservées, bouton réactivé, email de contact visible.
- Sans JavaScript : menu disponible, envoi désactivé et contact email accessible.
- CNAME récupéré depuis GitHub et conservé : changewatch.cybersignal.fr.

## Limites et contrôle réel restant

Les requêtes de formulaire ont été interceptées localement pour tester les états : aucune demande réelle ni email de test envoyé. Le parcours est prêt pour un test de soumission réel dès que la nouvelle version est déployée et le certificat HTTPS valide. Vérifier ensuite la réception dans Formspree et dans la boîte changewatch@cybersignal.fr. Le contrôle public par l’outil web n’a pas permis de confirmer le certificat ; son état reste à vérifier dans GitHub Pages.

Pas de validation W3C complète ni d’audit certifié. Vérifier aussi Safari/iOS et Android réels. Les informations légales restent à compléter ; les URL de production et coordonnées de contact sont maintenant renseignées.

## Vérification finale de l’offre payante

Les montants publics sont 14,90 €/mois, 29,90 €/mois et 59,90 €/mois. La note « TVA non applicable — art. 293 B du CGI. » est présente. Les anciennes accroches promotionnelles et qualifications de prix ont été supprimées du site et des supports standard. Seule la possibilité d’un essai privé discrétionnaire subsiste dans les documents internes explicitement dédiés.

Les trois boutons sélectionnent respectivement Starter, Business et Pro. Le message de réception correspond exactement au texte demandé pour la configuration du service. Le récapitulatif hebdomadaire figure dans la section fiabilité et la FAQ. La couverture reste conditionnée aux informations publiques et à la vérification de compatibilité.

Nouvelle exécution complète des contrôles Chromium : six largeurs, clavier, menu, ancres, métadonnées, labels, absence d’erreurs JavaScript, succès et échecs Formspree simulés, expiration, verrou de double soumission, conservation et remise à zéro des champs. Captures des tarifs sur ordinateur et de la mise en place sur mobile inspectées. Endpoint, domaine canonique, favicon et configuration Pages préservés. Aucun email réel envoyé.
