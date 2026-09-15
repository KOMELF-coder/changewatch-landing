# Validation de production — 15 septembre 2026

- Syntaxe JavaScript vérifiée avec node --check.
- Microsoft Edge / Chromium : aucune erreur JavaScript de page.
- Largeurs 320, 375, 390, 768, 1024 et 1440 pixels sans débordement horizontal.
- Texte agrandi à 200 %, préférence de réduction des mouvements, navigation clavier et FAQ vérifiés.
- Menu mobile : ouverture, fermeture après lien, Escape et retour du focus.
- CTA d’essai vers #demande ; focus du formulaire et présélection Business vérifiés.
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

Les requêtes de formulaire ont été interceptées localement pour tester les états : aucune demande réelle ni email de test envoyé. Le parcours est prêt pour un essai réel dès que la nouvelle version est déployée et le certificat HTTPS valide. Vérifier ensuite la réception dans Formspree et dans la boîte changewatch@cybersignal.fr. Le contrôle public par l’outil web n’a pas permis de confirmer le certificat ; son état reste à vérifier dans GitHub Pages.

Pas de validation W3C complète ni d’audit certifié. Vérifier aussi Safari/iOS et Android réels. Les informations légales restent à compléter ; les URL de production et coordonnées de contact sont maintenant renseignées.
