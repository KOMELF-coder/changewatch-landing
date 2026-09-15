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

Les réponses Formspree ont été simulées : aucune demande ni email réel envoyé. Après publication, vérifier un envoi réel et sa livraison dans la boîte de contact. Vérifier aussi HTTPS, les notifications Stripe et la prise en charge manuelle des nouveaux abonnés. Les trois pages juridiques sont désormais rédigées. Les contrôles opérationnels et points de revue sont listés dans LEGAL_REQUIREMENTS.md.

## Finalisation juridique B2B

- Mentions légales finalisées avec identité, adresse, immatriculation et direction de publication fournies ; adresse GitHub vérifiée sur sa politique officielle.
- CGV créées : professionnels uniquement, mensualités, résiliation et fin de période, configuration manuelle, limites, responsabilités, droit français et compétence de droit commun.
- Confidentialité actualisée avec Stripe, Formspree, Apify, Resend et GitHub, droits et CNIL, catégories de conservation et transferts éventuels.
- Notice professionnelle visible près des tarifs ; trois liens juridiques dans le pied de page.
- Trois pages vérifiées à 320, 375, 768 et 1440 pixels sans débordement ; captures mobiles inspectées. Identité, titres, liens locaux et footer contrôlés.
- Recherche des mentions provisoires, anciennes qualifications tarifaires et formulations destinées à d’autres publics : aucune occurrence dans les pages juridiques.
- Régression du site : Stripe, Formspree simulé, menu et clavier, six largeurs, texte agrandi et absence d’erreurs JavaScript validés.

Cette validation porte sur les fichiers et comportements du site, pas sur une certification juridique. Les réglages d’acceptation des CGV dans Stripe, l’éligibilité professionnelle réelle, les coordonnées téléphoniques requises et la mise en œuvre des traitements restent à vérifier selon LEGAL_REQUIREMENTS.md. Aucun paiement ni email réel effectué.
