# GA4 et consentement — dossier de validation

**Intégration prête à la revue ; ne pas fusionner ni publier avant validation du propriétaire.**
Audit et tests : 16 septembre 2026. Ce travail n’est pas une certification juridique.

## Audit initial

- Sept pages éditoriales : accueil, blog, article, démonstration, CGV, mentions légales, confidentialité. Le fichier Google Search Console est une preuve de propriété, pas une page éditoriale : il reste inchangé.
- Aucun Analytics, GTM, cookie marketing ou stockage de préférence dans le code initial.
- Seul script distant incorporé : Cloudflare Turnstile sur l’accueil. L’API Formspree reçoit le JSON du formulaire et son jeton anti-spam ; aucun changement d’endpoint, de validation ou de remise à zéro.
- Trois liens Stripe directs : Starter / Business / Pro ; prix et liens inchangés. Aucun SDK de paiement.
- Hébergement GitHub Pages, CNAME, Google Search Console, animations et illustrations conservés.
- La confidentialité déclarait l’absence de traceurs non essentiels : cette partie est remplacée par les finalités, modalités de consentement et durées confirmées par le propriétaire. La mention provisoire de paramètres inconnus est retirée après ses confirmations.

## Choix techniques

`assets/consent.js` est local et commun aux sept pages. Le bandeau non modal n’impose pas de réponse : aucune balise Google ni requête Analytics sans accord. Accepter et refuser utilisent le même style et la même accessibilité. Personnaliser ouvre un dialogue natif, case facultative non cochée, fermeture Échap et restitution du focus. Les pieds de page comportent un lien permanent ; sans JS, il mène aux informations et aucun suivi ne démarre.

La préférence versionnée est stockée six mois calendaires dans `localStorage` (`cw-consent-v1`), pour l’accord comme pour le refus. Une préférence absente, invalide ou expirée ne vaut pas accord. Si le stockage est bloqué, le choix ne s’applique qu’au document ouvert. Les changements se répercutent dans les onglets ouverts ; expiration, retour sur la page et restauration du cache de navigation sont recontrôlés.

### Pourquoi un document technique séparé ?

Le propriétaire confirme que **la mesure améliorée GA4 est activée**. Charger la balise sur le document contenant les champs de contact exposerait le formulaire à ses automatismes. Après accord seulement, une iframe locale masquée (`assets/analytics-frame.html`, noindex, sans referrer) reçoit une liste restreinte d’informations. Elle ne contient ni formulaire, ni lien sortant, ni contenu fourni par le visiteur. Son viewport hors écran conserve une géométrie non défilée (plutôt que `display:none`, qui déclenchait un faux événement `scroll` avec la mesure améliorée). Les tests du vrai tag confirment uniquement les quatre noms d’événements prévus. Les paramètres et fragments du parent ne lui sont pas transmis ; ses changements d’historique ne déclenchent pas la mesure améliorée dans cette iframe. Le fichier technique ouvert directement ne charge pas Google.

Ce cloisonnement du DOM est une mesure de minimisation, **pas une frontière de sécurité contre du JavaScript malveillant de même origine**. Il évite les automatismes indésirables du tag dans l’intégration testée ; il ne dispense pas de contrôler les paramètres distants, les balises connectées et les évolutions de Google.

La seule balise est `G-RB6NSRRM9L`, chargée une fois par document consenti. Les quatre paramètres Consent Mode v2 démarrent à `denied`, puis seul `analytics_storage` passe à `granted`. Publicité, Google Signals, personnalisation publicitaire et URL passthrough désactivés par le code. Aucun GTM. Le domaine `googletagmanager.com/gtag/js` héberge la balise Google ; il ne s’agit pas d’un conteneur GTM.

`send_page_view:false` et une émission explicite évitent les vues en double. Page et titre sont issus d’une liste fixe, sans query/hash ni referrer. Les cookies GA propres au site sont configurés à 180 jours, sans renouvellement à chaque visite ; ce choix technique ne présume pas de la conservation serveur GA4.

Au retrait, le drapeau officiel `ga-disable-G-RB6NSRRM9L` est activé avant la mise à jour du consentement et le retrait de l’iframe. Le contexte du tag et ses timers disparaissent ; la file locale d’événements est vidée. Les cookies `_ga` / `_ga_*` accessibles sont expirés sur le domaine hôte, les domaines parents et les chemins pertinents. Les cookies tiers, HttpOnly ou appartenant à un autre domaine ne peuvent pas être effacés par ce code. Une requête déjà partie avant le retrait ne peut pas être rappelée.

### Événements explicites

| Événement | Déclencheur | Paramètres autorisés |
| --- | --- | --- |
| `page_view` | Une fois par document après accord | Adresse publique canonique et titre prédéfini, referrer vide |
| `stripe_click` | Clic sur l’un des trois liens exacts | `plan`: Starter, Business ou Pro |
| `commercial_cta_click` | Lien vers tarifs ou contact | `destination`: tarifs ou demande |
| `generate_lead` | Réponse HTTP 2xx Formspree | `form_name`: contact |

Le formulaire ne transmet à Analytics qu’un signal sans détail, après son succès. Un refus Analytics ne change pas le formulaire. Aucun événement `purchase` ni revenu inventé. Les événements sont passés au tag de façon synchrone avant une navigation Stripe, sans retarder ni détourner celle-ci. Comme toute mesure navigateur, l’enregistrement peut être empêché par un bloqueur, une coupure réseau ou une fermeture immédiate ; ce n’est pas un registre de ventes.

## Tests reproductibles

```powershell
$env:PLAYWRIGHT_MODULE='C:/Users/flavi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'
node tests/browser.cjs
node --use-system-ca tests/consent.cjs
$env:CW_REAL_GA='1'
# Optionnel : chemin vers axe-core local, version utilisée 4.10.3
$env:CW_AXE_PATH="$env:TEMP/changewatch-axe.min.js"
node --use-system-ca tests/consent.cjs
```

`--use-system-ca` est nécessaire sur le poste audité à cause de l’inspection HTTPS Norton. La vérification TLS reste active. Le mode normal utilise un double de balise déterministe. Le mode réel télécharge le vrai script Google (une copie en mémoire par exécution) ; **toutes les requêtes de collecte et autres destinations externes sont interceptées et ne sont pas envoyées**. Formspree et Turnstile sont simulés. Le test ne remplit ni ne valide de paiement. Le serveur local utilise le port 8768 ; les tests de régression utilisent 8765.

Résultats de la validation finale (suite de régression, balise simulée et vrai tag Google avec collecte interceptée) :

- A/B : première visite, bandeau ignoré, personnalisation sans choix, refus, navigation et rechargement sans script Google ni cookie GA.
- C/E : un seul chargement et une seule vue par document consenti, acceptation répétée sans doublon ; paramètres personnels et changements d’historique du parent non transmis.
- D : aucune nouvelle requête à partir du clic de retrait (observation de six secondes avec le vrai tag), suppression des cookies accessibles et du contexte GA dans les deux onglets ; refus maintenu après rechargement.
- F : aucun lead lors d’une erreur 422 ; un lead après succès simulé ; succès sans consentement non mesuré. La suite existante couvre aussi panne réseau, délai expiré, jeton absent/blanc, double soumission et conservation des champs.
- G : les trois liens Stripe restent exacts ; paramètres collectés Starter / Business / Pro contrôlés, aucun événement purchase. Identifiant de destination GA4 contrôlé et absence de destination publicitaire/inattendue dans le parcours testé.
- H : enregistrement du choix personnalisé, navigation clavier, Échap et focus, largeurs 320/390/768/1440, sept liens de gestion, expiration, stockage bloqué, préférence de mouvement réduit. Axe ne signale aucune violation sur le bandeau et le dialogue testés. Cela ne remplace pas une vérification avec lecteur d’écran.
- Régression : les sept pages, images/liens/ancres, données structurées de l’article, sitemap, tarifs, animations, lecture/pause/reprise et 24 états responsive du démonstrateur passent.
- Syntaxe JS et `git diff --check` contrôlés.

Captures de la première version : [desktop](consent-desktop.png), [mobile](consent-mobile.png), [personnalisation](consent-settings.png).

**Présentation finale : [ajustement UX et captures avant/après aux quatre largeurs](ux/README.md).** Les suites de régression et le test du vrai tag GA4 avec collecte interceptée ont été relancés avec succès après cet ajustement CSS.

## Paramètres confirmés et revue avant publication

Réglages confirmés par le propriétaire dans GA4 (déclaration du 16 septembre 2026 ; pas de lecture directe du compte par cet agent) :

| Réglage | Valeur vérifiée |
| --- | --- |
| Conservation des données d’événements | 2 mois |
| Conservation des données utilisateur | 14 mois |
| Réinitialisation lors d’une nouvelle activité | Activée |
| Mesure améliorée | Activée |
| Google Signals | Désactivé |
| Collecte des données fournies par les utilisateurs | Désactivée |

1. Conservation : valeurs intégrées dans la politique. Selon la documentation Google, la réinitialisation repousse l’échéance de l’identifiant utilisateur à partir de la nouvelle activité ; elle ne modifie pas la durée des événements. Les rapports agrégés standards ne sont pas limités par ces réglages. Le consentement de six mois et les cookies de 180 jours sont des durées distinctes. Aucun réglage du compte ni du code de suivi n’a été modifié à cette étape.
2. Google Signals et collecte de données fournies par les utilisateurs : désactivés selon la confirmation du propriétaire. Le code conserve ses restrictions publicitaires et ne les active pas.
3. Mesure améliorée : conservée activée dans le compte. Le test du vrai tag contrôle la liste exacte des événements collectés, les paramètres de forfait et l’absence de données saisies ou issues des URL, y compris lors des changements d’historique. Aucun `scroll`, `form_start`, `form_submit`, `click` ou `purchase` parasite observé dans les parcours testés. Recontrôler après tout changement distant.
4. Vérifier les destinations / balises connectées : uniquement la propriété souhaitée, aucun Google Ads ou ajout inattendu. Vérifier partage des données, conditions contractuelles, destinataires/transferts et valider le texte de confidentialité.
5. Relire la politique finalisée et valider la PR. Fusion et publication nécessitent toujours une autorisation séparée. La réception en DebugView/Temps réel reste à vérifier après autorisation, car les requêtes de test sont interceptées.

## Vérification manuelle GA4 après autorisation

1. Utiliser un navigateur sans bloqueur pour le test, accepter Analytics ; vérifier dans Réseau un seul `gtag/js?id=G-RB6NSRRM9L`, puis les requêtes `collect`. Au refus, zéro requête Google ; au retrait, aucune nouvelle collecte.
2. Dans GA4 → Temps réel, contrôler les événements `page_view`, `commercial_cta_click` et `stripe_click`. Cliquer une offre ne doit pas produire `purchase`. Ne pas payer.
3. Pour DebugView, choisir le contexte `analytics-frame.html` dans la console DevTools après accord, puis exécuter `gtag('set', 'debug_mode', true)`. Effectuer les clics de test et consulter GA4 → DebugView. Ce réglage n’est pas ajouté au code de production et disparaît au rechargement du document.
4. `generate_lead` a été vérifié avec succès simulé uniquement. Une validation bout en bout avec livraison Formspree nécessite une autorisation distincte ; ne pas envoyer de demande réelle sans celle-ci. Les données de tests interceptées ne sont pas censées apparaître dans GA4.
5. Si souhaité, marquer `generate_lead` comme événement clé dans GA4 ; ne pas marquer le clic Stripe comme vente. Créer les dimensions personnalisées d’événement `plan` et `destination` si des rapports les nécessitent. Aucune modification administrative n’a été faite.
6. Compléter sur Safari/iOS, téléphone physique et lecteur d’écran. Vérifier le vrai challenge Turnstile sur le domaine autorisé, indépendamment du choix Analytics.

## Sources officielles consultées

- [CNIL : cookies et consentement](https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi) : information, simplicité comparable de l’accord et du refus, retrait.
- [CNIL : questions-réponses](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/FAQ) : six mois constitue une bonne pratique pour conserver le choix, pas une durée de conservation GA4.
- [Google : Consent Mode](https://developers.google.com/tag-platform/security/concepts/consent-mode) et [mise en œuvre](https://developers.google.com/tag-platform/security/guides/consent) : mode basique, chargement conditionné à l’accord.
- [Google : contrôles de confidentialité](https://developers.google.com/tag-platform/security/guides/privacy) : désactivation du tag et des signaux publicitaires.
- [Google : configuration GA4](https://developers.google.com/analytics/devguides/collection/ga4/reference/config) : page_view, métadonnées de page et paramètres des cookies.
- [Google : mesure améliorée](https://support.google.com/analytics/answer/9216061) : fonctionnalités automatiques à examiner dans le flux réel.

- [Google : conservation des données](https://support.google.com/analytics/answer/7667196?hl=fr) : portée des durées utilisateur/événement, réinitialisation et rapports agrégés.
