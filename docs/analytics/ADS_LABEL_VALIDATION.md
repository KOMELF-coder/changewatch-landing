# Validation du label Google Ads confirmé — 25 septembre 2026

PR #10, branche `codex/google-ads-consent`. Ce rapport remplace les résultats « sans label » pour la version courante. Aucun déploiement.

## Valeur exacte

Dans `assets/analytics-frame.js:10` :

```js
const GOOGLE_ADS_LEAD_LABEL = 'fb09CMW964MdEJy5q-hE';
```

Destination de la conversion : `AW-18472426652/fb09CMW964MdEJy5q-hE`.
Le fichier de production change uniquement cette constante par rapport au commit précédent. Le formulaire, Formspree, Turnstile et le mécanisme de révocation sont inchangés.

## Tests exécutés

| Contrôle | Résultat |
| --- | --- |
| `google-ads.cjs` simulé, FR/EN | PASS : 422, 500 et erreur réseau ne déclenchent ni lead GA4 ni conversion Ads. HTTP 200 déclenche une commande de chaque type, avec le send_to exact. Double clic : une seule requête Formspree réussie, une seule conversion. |
| `CW_REAL_GA=1 … google-ads.cjs`, FR/EN | PASS avec vrais scripts Google et **toute collecte interceptée**. Une vue GA4 et un generate_lead GA4 par scénario ; une commande de conversion Ads au succès uniquement ; aucun contenu de formulaire dans les requêtes Google. |
| Consentement | PASS : aucun tag avant consentement/après refus ; ancien accord renouvelé ; audience seule sans conversion Ads, publicité seule sans generate_lead GA4 ; retrait sans nouvelle requête et suppression des cookies accessibles. |
| Label absent, réponse locale modifiée | PASS : aucune conversion Ads, generate_lead GA4 préservé. Le label de production n’est pas remplacé par le test. |
| `consent.cjs` | PASS : CTA/Stripe, formulaire, retrait multi-onglets, expiration, stockage bloqué. |
| `consent-ux.cjs` | PASS : 320/375/390/1440 px, clavier et petit écran défilable. |
| `browser.cjs`, `i18n.cjs`, `blog-launch.cjs` | PASS : fonctionnalités FR/EN, formulaire/Turnstile simulés, Stripe/CTA, ressources, SEO, responsive et accessibilité couverts par ces suites. |
| `git diff --check` | PASS. |

Les trois échecs historiques des suites d’articles, reproduits sur main lors de la validation précédente, restent documentés dans [ADS_VALIDATION.md](ADS_VALIDATION.md). Ils n’ont pas été corrigés dans cette modification ciblée du label et ne sont pas présentés comme des suites réussies. Les articles/styles concernés n’ont pas changé.

Logs de cette passe : `ads-validation/label-*.log`.

## Lecture correcte du réseau Ads

Avec un label valide, le blocage provisoire « sans label » ne s’applique plus. Après consentement publicitaire, le vrai tag émet des mesures de base `/ccm/collect`, dont une vue Ads **distincte de la vue GA4**. Elles ne portent pas le label de conversion lead.

Au succès Formspree, une seule commande `conversion` génère deux transports :

- `www.google.com/pagead/1p-conversion/18472426652/`
- `googleads.g.doubleclick.net/pagead/viewthroughconversion/18472426652/`

Les deux portent le label exact et le **même paramètre `random`** dans chaque scénario. Le test vérifie un seul groupe de transports corrélés et une seule commande Ads ; deux requêtes ne sont pas présentées comme deux leads. Aucun `purchase`, montant ou donnée client n’est ajouté.

## Vérifications manuelles restantes

Toutes les requêtes de collecte sont interceptées : aucune conversion de test ni demande réelle n’a été envoyée. La réception et le comptage effectifs dans les comptes GA4/Ads restent à vérifier par le propriétaire. Contrôler notamment les éventuels imports de generate_lead GA4 en parallèle de cette action Ads, les conversions principales/secondaires et les règles de comptage. La validation navigateur ne peut pas certifier ces réglages distants.

La procédure Tag Assistant est dans [GOOGLE_ADS.md](GOOGLE_ADS.md). La PR reste en brouillon, sans fusion ni publication.
