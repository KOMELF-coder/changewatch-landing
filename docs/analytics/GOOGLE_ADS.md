# Google Ads et GA4 — intégration consentie

État : PR en brouillon, aucune publication. Validation locale : 25 septembre 2026.
Ce document décrit la version Ads et remplace les choix techniques Analytics-only du dossier historique `README.md`.

## Identifiants et conversion lead Ads configurée

- GA4 : `G-RB6NSRRM9L`.
- Google Ads : `AW-18472426652`.
- Label confirmé par le propriétaire : **`fb09CMW964MdEJy5q-hE`**.
- `send_to` exact : **`AW-18472426652/fb09CMW964MdEJy5q-hE`**.
- Emplacement : **`assets/analytics-frame.js:10`**, `const GOOGLE_ADS_LEAD_LABEL = 'fb09CMW964MdEJy5q-hE';`.
- Le label n’est envoyé qu’avec `conversion` après `cw:lead-confirmed` (succès Formspree) et consentement publicitaire. GA4 conserve indépendamment `generate_lead` avec `form_name: contact` si la mesure d’audience est consentie.
- Aucune valeur, devise ou conversion `purchase` n’est inventée. Le cas d’un label absent reste testé : aucune conversion Ads, GA4 demeure actif.
- Vérifier côté Google les imports GA4 pour éviter de compter une même demande via deux actions de conversion. Les tests prouvent un déclenchement côté site, pas la configuration de comptage du compte. Aucun paramètre du compte Google n’a été modifié ici.

## Consentement et isolation

L’iframe locale reste la seule propriétaire de `gtag`. Aucun tag Google n’est ajouté dans les pages éditoriales. Aucun chargement Google avant un accord valide. Les choix audience et publicité sont séparés dans Personnaliser, avec Tout accepter / Tout refuser aussi accessibles. Formspree et Turnstile fonctionnent indépendamment.

Le stockage conserve la clé historique `cw-consent-v1`, mais son contenu passe en **version 2** avec deux booléens `analytics` et `advertising`. Un accord version 1 est invalide : l’ancienne finalité audience seule n’autorise jamais automatiquement Ads. Le choix reste valable six mois. Le retrait se synchronise dans les onglets ouverts.

| Choix | analytics_storage | ad_storage / ad_user_data / ad_personalization |
| --- | --- | --- |
| Absence d’accord / refus | denied | denied |
| Audience seule | granted | denied |
| Publicité seule | denied | granted |
| Tout accepter | granted | granted |

Les defaults `denied` précèdent toute config dans l’iframe. Seules les destinations consenties sont configurées. Un changement de catégorie détruit puis recrée l’iframe ; une simple nouvelle confirmation identique ne recharge pas le tag. Le garde-fou parent évite une seconde vue GA4 sur le même document.

Un seul élément script gtag est créé par notre code et par iframe. Google peut télécharger lui-même le module de la seconde destination (`gtag/js?id=AW-…&cx=c`), ce qui ne constitue pas une seconde installation manuelle. Tous les événements métier GA4 portent explicitement `send_to: G-RB6NSRRM9L`.

## Requêtes automatiques Ads et protection sans label

Le vrai script a émis une requête automatique Google Ads `https://www.google.com/ccm/collect?...&tid=AW-18472426652&en=page_view`, puis un transport DoubleClick. **Ce n’était pas une seconde vue GA4**. Le paramètre `send_page_view:false` n’a pas supprimé ce comportement Ads dans la version testée.

Pour respecter l’exigence de zéro événement Ads sans label, une **Content Security Policy (CSP) propre à l’iframe** autorise les scripts Google Tag et uniquement les destinations de collecte `*.google-analytics.com` tant que le label est absent ou invalide. Les transports Ads par fetch, image, script ou iframe sont bloqués par le navigateur. Les deux configurations restent préparées après consentement, mais **la collecte Ads de base est elle aussi inactive sans label**. Des messages CSP attendus peuvent apparaître dans la console ; ce ne sont pas des erreurs du formulaire.

Le label exact est désormais configuré : cette protection provisoire n’est plus installée et les requêtes automatiques de base Ads réapparaissent après accord publicitaire. Le test avec les vrais scripts les distingue de la conversion lead : une seule commande conversion produit deux transports Google corrélés par le même paramètre random. Une seule vue GA4 et un seul generate_lead sont observés par scénario. Voir [ADS_LABEL_VALIDATION.md](ADS_LABEL_VALIDATION.md).

Au retrait, une CSP supplémentaire bloque **toutes** les nouvelles destinations dans l’iframe avant `consent update denied`, puis l’iframe est supprimée. Cela empêche le ping sans cookie observé lors de la révocation avec le vrai tag. Les cookies `_ga`, `_ga_*` et `_gcl_*` accessibles sont expirés. Les requêtes déjà parties ne peuvent pas être rappelées ; les cookies tiers/HttpOnly ne peuvent pas être supprimés par le site.

`ads_data_redaction:true` est conservé (il agit lorsque `ad_storage` est denied, pas lorsqu’il est granted), `url_passthrough:false`, pas de conversions avancées. GA4 conserve Google Signals et personnalisation désactivés dans sa config. Le site n’envoie aucun `user_data` ni identifiant client fourni par le visiteur.

## Données et formulaire

`script.js` est inchangé. Seul son signal `cw:lead-confirmed`, après HTTP 2xx Formspree, déclenche le lead. Pas de signal au clic submit, en erreur, sans jeton ou au simple affichage du formulaire. Les tests utilisent de fausses réponses Formspree ; aucune véritable demande n’est envoyée.

La file transmet seulement des noms d’événements et paramètres autorisés : plan, destination, `form_name: contact`. Aucun nom, email, entreprise, message ou URL concurrente. Les chemins/titres de pages proviennent de listes fixes sans query/hash/referrer. L’iframe évite l’inspection automatique du formulaire ; elle n’est pas une frontière de sécurité contre du JavaScript malveillant de même origine. Les réglages distants Google restent à contrôler par le propriétaire.

## Tests reproductibles

```powershell
$env:PLAYWRIGHT_MODULE='chemin/vers/playwright'
node tests/google-ads.cjs
# Vrai JavaScript Google, mais TOUTE collecte interceptée :
$env:CW_REAL_GA='1'
node --use-system-ca tests/google-ads.cjs
Remove-Item Env:CW_REAL_GA
node tests/consent.cjs
node tests/consent-ux.cjs
node tests/browser.cjs
node tests/i18n.cjs
node tests/blog-launch.cjs
node tests/analysis-guide.cjs
node tests/field-guides.cjs
python tests/field-guides-static.py
```

`--use-system-ca` utilise le magasin de confiance du poste, sans désactiver TLS. Les suites utilisent Edge headless. Les tests GA4/Ads enregistrent les tentatives de collecte, puis répondent localement. Ils ne démontrent **pas** la réception dans les rapports Google. Le label exact est testé, mais toutes ses requêtes sont interceptées avant envoi. Le cas sans label est injecté uniquement dans une réponse locale pour vérifier le comportement fermé par défaut.

## Google Tag Assistant — contrôle manuel avant publication

1. Démarrer le site local ou une prévisualisation autorisée ; ouvrir [Tag Assistant](https://tagassistant.google.com/) et connecter cette URL. Ne pas publier cette branche pour tester.
2. Effacer le choix local, puis refuser : aucune balise GA4/Ads. Recharger et naviguer FR/EN ; contrôler aussi le réseau hors Tag Assistant, dont les propres requêtes de diagnostic ne sont pas des événements du site.
3. Tout accepter : vérifier les quatre signaux granted, les deux configs, une seule vue GA4 et ses paramètres fixes. Avec ce label, les requêtes Ads automatiques de base sont attendues après accord publicitaire. Elles ne portent pas le label de conversion lead. Aucune conversion lead ne doit apparaître avant succès du formulaire.
4. Personnaliser : audience seule puis publicité seule ; vérifier les destinations et signaux correspondants. Revenir à refus, naviguer et vérifier l’absence de nouvelles collectes et la suppression des cookies accessibles.
5. Tester le lead uniquement avec les mocks automatisés. Ne pas envoyer une vraie demande Formspree pour vérifier Tag Assistant sans autorisation. Après autorisation d’un test réel, vérifier séparément sa réception dans le compte Ads et les règles de comptage.
6. Vérifier côté Google l’absence de collecte automatique de données fournies par les utilisateurs/conversions avancées, les destinations connectées et les conversions importées depuis GA4. Aucune certification juridique ou de configuration du compte n’est donnée par ces tests navigateur.

## Références primaires

- [Consent Mode](https://developers.google.com/tag-platform/security/guides/consent)
- [Routage explicite send_to](https://developers.google.com/tag-platform/gtagjs/routing)
- [Vues GA4](https://developers.google.com/analytics/devguides/collection/ga4/views)
- [CNIL : consentement et nouvelles finalités](https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi)

Les observations réseau Ads décrites ici proviennent du test réel intercepté du 25 septembre 2026, et non d’une garantie sur les futures versions du tag.
