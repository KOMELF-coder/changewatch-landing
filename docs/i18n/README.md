# ChangeWatch FR / EN — dossier de revue

**Branche prête pour revue. Aucune fusion ni publication autorisée par cette mission.**

Audit et contrôles locaux : 17 septembre 2026. Base : `main` au commit `f83234103c4deb184d93889548d837a9c46e2b69`. Les trois traductions juridiques doivent être validées explicitement par le propriétaire avant publication.

## Audit et périmètre

Le site de départ comporte sept pages publiques statiques, un formulaire AJAX Formspree protégé par Turnstile, une démonstration illustrative et GA4 sous consentement. Pas de framework, de serveur applicatif ou de construction à ajouter. GitHub Pages publie depuis `main` / racine ; cette branche ne modifie ni ce réglage, ni le domaine.

Le README annonçait encore l’absence d’Analytics et un certificat en cours d’émission. Il est corrigé pour décrire le code actuel et demander le contrôle HTTPS après publication, sans déduire de configuration distante.

Les tarifs effectivement présents dans le code sont conservés :

| Forfait | Prix mensuel | URLs | Vérifications | Payment Link inchangé |
| --- | --- | --- | --- | --- |
| Starter | 14,90 € | 5 | 1 / jour | `https://buy.stripe.com/dRm5kC8cA3P93hg9pc4gg02` |
| Business | 29,90 € | 15 | 1 / jour | `https://buy.stripe.com/dRm28q50o2L5aJI58W4gg03` |
| Pro | 59,90 € | 40 | Jusqu’à 3 / jour | `https://buy.stripe.com/3cI9AScsQ4Td8BA30O4gg04` |

Configuration manuelle incluse ; priorité Business/Pro conservée. B2B uniquement, conditions de résiliation, TVA et limites de compatibilité/extraction inchangées. Aucune offre promotionnelle privée ajoutée à l’offre publique, aucun changement distant Stripe, aucune incohérence de montant constatée dans les textes du site.

## Architecture

| Français conservé | Anglais ajouté | Indexation |
| --- | --- | --- |
| `/` | `/en/` | Oui |
| `/cgv.html` | `/en/terms.html` | Oui |
| `/mentions-legales.html` | `/en/legal-notice.html` | Oui |
| `/confidentialite.html` | `/en/privacy.html` | Oui |
| `/demo-produit.html` | `/en/demo-product.html` | Non : exemple fictif |

Les cinq pages anglaises sont du HTML rédigé, pas une traduction générée dans le navigateur. Les deux langues utilisent les mêmes images, styles et scripts. `assets/languages.css` ne contient que les adaptations du sélecteur. Les messages des scripts partagés sont choisis selon `html[lang]` ; la logique du service reste unique. Les validations natives du navigateur peuvent suivre la langue du navigateur ; les validations personnalisées du site suivent la langue de la page.

Le sélecteur utilise des liens HTML vers les pages correspondantes, des libellés accessibles et `aria-current`. Il reste disponible sans JavaScript. Pas de détection de langue ni de redirection. Le blog et ses illustrations restent intégralement inchangés ; les liens depuis l’anglais annoncent « French ». Sa traduction éditoriale complète pourra faire l’objet d’une mission séparée. Aucun hreflang anglais fictif n’est ajouté au blog.

Les canonical sont absolus et propres à chaque page ; les paires possèdent des hreflang réciproques `fr`, `en`, `x-default` (français), descriptions et Open Graph localisés. Les métadonnées Twitter et données structurées existantes du blog sont préservées. Le sitemap ajoute les quatre pages anglaises indexables ; les deux démonstrations restent noindex et hors sitemap. Références : [versions localisées, Google Search](https://developers.google.com/search/docs/specialty/international/localized-versions), [sites multilingues](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites).

### Formulaire et consentement

- Même endpoint `https://formspree.io/f/mbgjnvjq`, destinataire, noms des champs et format JSON.
- Même clé Turnstile publique ; langue du widget anglais explicitement définie par `data-language="en"`. Aucune clé secrète.
- Même validation d’URL, exigence de jeton, verrou de soumission, délai de 15 secondes, conservation des champs en échec et réinitialisation du widget. Confirmation uniquement sur HTTP 2xx.
- Même préférence de consentement `cw-consent-v1`, partagée entre `/` et `/en/`. Accepter/refuser restent de même importance. Retrait accessible dans tous les pieds de page.
- Liste explicite des routes Analytics étendue aux pages anglaises, dans les deux scripts. Aucun événement nouveau, aucun contenu de formulaire, query/hash ou referrer transmis. Les liens de confidentialité des bandeaux visent la section `#cookies` dans la bonne langue (le fragment français est également préservé).

## Tests réellement exécutés

Environnement : Node, Playwright / Edge headless, axe-core 4.10.3. Tests servis sur localhost. Aucun paiement, aucune demande Formspree réelle et aucune collecte Analytics envoyée.

| Contrôle | Résultat |
| --- | --- |
| `node --check` des quatre scripts partagés et du test ajouté | Réussi |
| `node tests/browser.cjs` | Réussi : sept pages FR, blog/JSON-LD, liens, tarifs, AJAX, menu, démonstration, clavier, réduction des animations, texte 200 %, sans JS |
| `node tests/consent.cjs` avec axe | Réussi : refus, consentement, retrait, cookies, onglets, stockage indisponible/expiration, événements filtrés |
| `node tests/consent-ux.cjs` | Réussi : 320 / 375 / 390 / 1440 px, dialogue, clavier, petits écrans et zoom |
| `CW_REAL_GA=1 node --use-system-ca tests/consent.cjs` avec axe | Réussi avec le véritable script Google ; toutes les collectes interceptées, TLS vérifié |
| `node tests/i18n.cjs` avec axe | Réussi : dix pages FR/EN, SEO réciproque, ressources/ancres, sitemap, sélecteur clavier, six largeurs, audit axe des cinq pages EN, parcours anglais et consentement partagé |
| HTTP GET des trois Payment Links et des liens externes juridiques | 200 ; aucun paiement ni changement de configuration |
| Revue visuelle des captures mobile/desktop | Effectuée : accueil, démonstrateur, consentement ; pas de texte ou bouton coupé observé |
| Préservation Git du blog, illustrations, CNAME, robots et validation Search Console | Inchangés |

Le test anglais couvre notamment : 320 / 375 / 390 / 768 / 1024 / 1440 px ; prix €14.90 / €29.90 / €59.90 ; liens Stripe dans le même onglet ; absence de requête sans jeton ; erreurs HTTP 422, réseau et expiration 15 s ; double soumission ; conservation des champs en échec ; succès simulé **local uniquement**. Les messages affichés sont anglais, et les tests existants vérifient les messages français.

Un contraste insuffisant du nouveau sélecteur sur l’en-tête sombre a été détecté puis corrigé. Le dernier audit axe des cinq pages anglaises ne relève aucune violation. Un audit automatisé ne remplace pas une revue avec lecteur d’écran.

Les tests Analytics avec balise simulée vérifient la continuité FR/EN et les adresses canoniques. La suite avec la véritable balise observe uniquement `page_view`, `commercial_cta_click`, `stripe_click`, `generate_lead` dans les requêtes interceptées ; aucun `purchase`. Ces résultats ne prouvent aucune réception dans les rapports GA4, puisque la collecte est volontairement bloquée pendant ces tests locaux.

## Captures de revue

Captures locales, formulaire/Turnstile simulés par les tests. La production n’est pas modifiée.

| Français conservé | Anglais |
| --- | --- |
| [Accueil desktop](fr-home-1440.png) | [Accueil desktop](en-home-1440.png) |
| [Accueil mobile](fr-home-390.png) | [Accueil mobile](en-home-390.png) |

[Consentement anglais à 320 px](en-consent-320.png) · [Consentement anglais desktop](en-consent-1440.png)

## Validation juridique requise avant publication

Les traductions suivantes sont **préparées pour validation, pas approuvées juridiquement** :

- `en/terms.html` : traduction des 19 sections des CGV françaises, notamment B2B, facturation, retard, résiliation, responsabilité et droit français.
- `en/legal-notice.html` : identité, adresse, SIREN/SIRET, hébergement et mentions fiscales conservés.
- `en/privacy.html` : mêmes traitements et prestataires, consentement, conservation 2 mois événements / 14 mois utilisateurs, renouvellement sur activité activé, Signals et données fournies par les utilisateurs désactivés.

Les dates de version reflètent les textes français traduits, et non une nouvelle disposition contractuelle. Aucune clause de primauté de langue, extension de garantie, nouveau droit applicable ou modification fiscale n’est introduite. Le propriétaire doit valider l’équivalence des termes juridiques anglais et le parcours commercial international avant toute publication.

## Checklist avant une publication ultérieure autorisée

- [ ] Valider les trois traductions juridiques et les textes commerciaux anglais.
- [ ] Approuver visuellement la PR (mobile/desktop, navigation clavier et idéalement lecteur d’écran).
- [ ] Contrôler dans Stripe l’affichage client de la langue, des montants, de la périodicité et des conditions ; les liens restent identiques et la langue de Stripe dépend de ses propres réglages.
- [ ] Après autorisation et déploiement : contrôler les URL `/en/`, hreflang, sitemap et ressources sur le domaine HTTPS réel.
- [ ] Vérifier le véritable widget Turnstile anglais sur le domaine autorisé. La résolution CAPTCHA et la livraison réelle Formspree ne sont pas prouvées par les simulations locales ; un envoi réel nécessite une autorisation distincte.
- [ ] Après publication : contrôler les requêtes GA4 réelles après consentement, l’absence de collecte au refus/retrait et leur réception dans les rapports avec le propriétaire.

Aucun blocage technique connu à la fin des tests locaux. Les validations juridiques et les contrôles externes ci-dessus restent nécessaires ; la branche n’est ni fusionnée ni publiée.
