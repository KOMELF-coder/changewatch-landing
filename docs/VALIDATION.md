# Validation — parcours Stripe et contact facultatif

## Contrôles locaux

- Liens Starter, Business et Pro comparés exactement aux trois Payment Links fournis par le propriétaire.
- Navigation clavier vers chaque destination interceptée localement : même onglet, aucun appel Formspree au clic, aucun attribut data-plan ni interception de paiement.
- CTA du menu et principal vers #tarifs ; liens de question vers #demande avec focus du formulaire.
- Prix conservés : 14,90 €/mois, 29,90 €/mois et 59,90 €/mois. Note « TVA non applicable — art. 293 B du CGI. » conservée. Offre publique payante inchangée.
- Formspree conservé à https://formspree.io/f/mbgjnvjq ; champs contact et URLs, validation, verrou de double soumission, chargement et messages préservés. Présélection de forfait obsolète retirée.
- Succès HTTP simulé : confirmation à l’écran puis formulaire vidé. Échec HTTP, réseau ou expiration : valeurs conservées et bouton réactivé. Adresse de contact toujours disponible.
- Six largeurs contrôlées : 320, 375, 390, 768, 1024 et 1440 pixels, sans débordement horizontal.
- Menu mobile, Escape, FAQ clavier, labels, ancres et ressources locales contrôlés.
- Texte agrandi à 200 %, réduction des mouvements et comportement sans JavaScript contrôlés. Pas d’erreur JavaScript de page.
- Aucun SDK Stripe, clé API, jeton ou secret webhook ajouté. Seulement les trois URL publiques de paiement ; aucun backend ajouté.
- Favicon, CNAME, canonical et architecture statique conservés.

## Limites et contrôles de lancement

Les destinations Stripe ont été interceptées dans les tests pour éviter toute transaction ; leur contenu hébergé, le montant réellement configuré et la périodicité doivent être vérifiés sur Stripe avant ouverture commerciale. Aucune carte n’a été saisie et aucun paiement n’a été effectué.

Les réponses Formspree ont été simulées : aucune demande ni email réel envoyé. Après publication, vérifier un envoi réel et sa livraison dans la boîte de contact. Vérifier aussi HTTPS, les notifications Stripe et la prise en charge manuelle des nouveaux abonnés. Les informations légales encore manquantes restent listées dans LEGAL_REQUIREMENTS.md.
