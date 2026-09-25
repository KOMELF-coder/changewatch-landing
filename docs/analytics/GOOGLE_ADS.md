# Google Ads et GA4 — intégration consentie

État : PR en brouillon, aucune publication. Validation locale : 25 septembre 2026.
Ce document décrit la version Ads et remplace les choix techniques Analytics-only du dossier historique `README.md`.

## Identifiants et activation du lead Ads

- GA4 : `G-RB6NSRRM9L`.
- Google Ads : `AW-18472426652`.
- **Emplacement du futur label : `assets/analytics-frame.js`, constante `GOOGLE_ADS_LEAD_LABEL = null` (près des identifiants).** Remplacer uniquement `null` par le label exact entre quotes, fourni par Google Ads pour la conversion de demande confirmée. Ne pas copier l’identifiant AW ni le `send_to` complet dans cette constante.
- Ne pas inventer de label. Pas de conversion Ads, de valeur, de devise ou de `purchase` en son absence.
- Une fois un label valide fourni, `cw:lead-confirmed` émettra `conversion` avec `send_to: AW-18472426652/<label>` uniquement si la publicité est consentie. GA4 conserve indépendamment `generate_lead`, avec `form_name: contact`, si l’audience est consentie.
- Ajouter le label exige une nouvelle revue, des tests et une autorisation de publication. Vérifier l’action Ads choisie, son type, sa fenêtre d’attribution, son comptage et les éventuels imports GA4 pour éviter le double comptage. Aucun paramètre du compte Google n’a été modifié ici.

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

## Cause de la requête supplémentaire et protection sans label

Le vrai script a émis une requête automatique Google Ads `https://www.google.com/ccm/collect?...&tid=AW-18472426652&en=page_view`, puis un transport DoubleClick. **Ce n’était pas une seconde vue GA4**. Le paramètre `send_page_view:false` n’a pas supprimé ce comportement Ads dans la version testée.

Pour respecter l’exigence de zéro événement Ads sans label, une **Content Security Policy (CSP) propre à l’iframe** autorise les scripts Google Tag et uniquement les destinations de collecte `*.google-analytics.com` tant que le label est absent ou invalide. Les transports Ads par fetch, image, script ou iframe sont bloqués par le navigateur. Les deux configurations restent préparées après consentement, mais **la collecte Ads de base est elle aussi inactive sans label**. Des messages CSP attendus peuvent apparaître dans la console ; ce ne sont pas des erreurs du formulaire.

Avec un label valide, cette protection provisoire n’est plus installée : les requêtes automatiques de base Ads peuvent alors réapparaître en plus de la conversion lead. Il faudra les contrôler à nouveau et ne pas présenter le label comme un simple changement sans incidence réseau.

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

`--use-system-ca` utilise le magasin de confiance du poste, sans désactiver TLS. Les suites utilisent Edge headless. Les tests GA4/Ads enregistrent les tentatives de collecte, puis répondent localement. Ils ne démontrent **pas** la réception dans les rapports Google. La future conversion est testée avec un label factice injecté uniquement dans une réponse locale, jamais dans le code déployable.

## Google Tag Assistant — contrôle manuel avant publication

1. Démarrer le site local ou une prévisualisation autorisée ; ouvrir [Tag Assistant](https://tagassistant.google.com/) et connecter cette URL. Ne pas publier cette branche pour tester.
2. Effacer le choix local, puis refuser : aucune balise GA4/Ads. Recharger et naviguer FR/EN ; contrôler aussi le réseau hors Tag Assistant, dont les propres requêtes de diagnostic ne sont pas des événements du site.
3. Tout accepter : vérifier les quatre signaux granted, les deux configs, une seule vue GA4 et ses paramètres fixes. Sans label, les tentatives Ads automatiques doivent être bloquées par CSP ; aucune conversion ne doit apparaître comme envoyée.
4. Personnaliser : audience seule puis publicité seule ; vérifier les destinations et signaux correspondants. Revenir à refus, naviguer et vérifier l’absence de nouvelles collectes et la suppression des cookies accessibles.
5. Tester le lead uniquement avec les mocks automatisés. Ne pas envoyer une vraie demande Formspree pour vérifier Tag Assistant sans autorisation. Après fourniture du label, exécuter un test autorisé et vérifier séparément sa réception dans le compte Ads.
6. Vérifier côté Google l’absence de collecte automatique de données fournies par les utilisateurs/conversions avancées, les destinations connectées et les conversions importées depuis GA4. Aucune certification juridique ou de configuration du compte n’est donnée par ces tests navigateur.

## Références primaires

- [Consent Mode](https://developers.google.com/tag-platform/security/guides/consent)
- [Routage explicite send_to](https://developers.google.com/tag-platform/gtagjs/routing)
- [Vues GA4](https://developers.google.com/analytics/devguides/collection/ga4/views)
- [CNIL : consentement et nouvelles finalités](https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi)

Les observations réseau Ads décrites ici proviennent du test réel intercepté du 25 septembre 2026, et non d’une garantie sur les futures versions du tag.
