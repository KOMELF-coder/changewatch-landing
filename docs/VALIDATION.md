# Rapport de validation — 15 septembre 2026

## Vérifications réalisées

- JavaScript : `node --check script.js`, sans erreur de syntaxe.
- Exécution dans Microsoft Edge / Chromium via Playwright, sans erreur JavaScript de page.
- Structure de la page principale : une seule balise h1, langue française, absence d’identifiants dupliqués, ancres présentes, champs visibles associés à un label.
- Ressources et liens locaux de la page principale : réponses HTTP 200, favicon et pages secondaires compris.
- Affichage aux largeurs 320, 375, 390, 768, 1024 et 1440 pixels : absence de défilement horizontal. Captures de la page et inspection visuelle ordinateur/mobile.
- Agrandissement du texte à 200 % sur une fenêtre de 1024 pixels : absence de débordement horizontal après adaptation de la navigation.
- Menu mobile : ouverture, fermeture après lien, Escape et retour du focus au bouton.
- FAQ utilisable au clavier ; préférence de réduction des mouvements respectée.
- Sans JavaScript : navigation visible et avertissement du formulaire. Le bouton d’envoi reste désactivé pour empêcher une soumission GET involontaire.
- Présélection Business transmise à la demande ; URL avec protocole non HTTP(S) refusée.
- Sans configuration : aucune fausse confirmation, copie de la demande disponible, absence de lien mailto invalide.
- Email configuré en test : brouillon mailto encodé, texte copiable, aucune affirmation d’envoi ; modifier le formulaire invalide le brouillon précédent.
- Endpoint simulé : succès HTTP avec `success: true`, erreur HTTP, réponse sans confirmation, JSON invalide et panne réseau. Le succès exige une confirmation explicite ; les erreurs conservent les données et proposent le repli email.
- Message LinkedIn : 332 caractères avant personnalisation, inférieur à la cible d’environ 500.

## Limites

Les réponses d’endpoint ont été simulées localement : aucun message réel n’a été envoyé, aucun essai n’a été activé. L’adresse email et le prestataire de formulaire restent à configurer et à tester réellement. Le délai maximal de 15 secondes est implémenté mais doit également être vérifié avec le prestataire retenu.

Contrôles HTML/CSS structurels et navigateur, sans validation de conformité W3C complète ni audit d’accessibilité certifié. Aucun validateur HTML dédié n’était installé. Les essais responsive sont des émulations Chromium ; faire une dernière vérification sur Safari/iOS et Android réels. La configuration DNS, le certificat, l’URL publique et la livraison réelle des emails nécessitent le déploiement et les informations de l’opérateur.

Les pages juridiques et métadonnées d’URL contiennent des éléments à finaliser volontairement documentés. Consulter `LAUNCH_CHECKLIST.md` avant ouverture commerciale.
