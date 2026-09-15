# ChangeWatch — site commercial

Site statique français de veille concurrentielle pour e-commerce. HTML, CSS et JavaScript natifs ; aucune installation, compilation, base de données ou dépendance de production. Le moteur de surveillance est un projet distinct. Aucun code de surveillance n’est inclus ici.

## État de livraison

Le site est prêt techniquement pour GitHub Pages. **L’ouverture commerciale nécessite une adresse de contact valide et des pages juridiques finalisées.** Le dépôt ne contient ni identité d’entreprise inventée, ni témoignages, ni suivi analytique. L’exemple produit est fictif et identifié comme tel. Le badge Business « Le plus populaire » est le libellé commercial demandé, pas une statistique client.

## Fichiers

- `index.html` : page commerciale, formulaire, FAQ et métadonnées.
- `styles.css` : thème, dispositions responsive, focus clavier et réduction des mouvements.
- `script.js` : menu mobile, présélection du forfait, validation et traitement du formulaire.
- `assets/favicon.svg` : marque provisoire locale, à conserver ou remplacer par le futur logo.
- `demo-produit.html` : page source fictive pour le lien de démonstration.
- `mentions-legales.html`, `confidentialite.html` : pages explicitement provisoires et non indexables.
- `.nojekyll` : publication statique directe, sans transformation Jekyll.
- `docs/` : offre, préparation juridique, prospection, lancement et rapport de validation.

## Aperçu local

Ouvrir `index.html` dans un navigateur suffit pour consulter la page et préparer un email. Pour tester un endpoint et les comportements réseau, utiliser un serveur HTTP local, par exemple `python -m http.server 8080` si Python est installé, puis ouvrir `http://localhost:8080`. Ne jamais tester avec de vraies données personnelles sur un service de démonstration.

## Configuration unique du formulaire

Modifier **uniquement le bloc `CONTACT_CONFIG` au début de `script.js`** :

```js
const CONTACT_CONFIG = Object.freeze({
  CONTACT_EMAIL: 'YOUR_CONTACT_EMAIL',
  FORM_ENDPOINT: '',
});
```

### Option de lancement : email

1. Remplacer `YOUR_CONTACT_EMAIL` par une adresse professionnelle réelle, dont vous contrôlez la boîte.
2. Laisser `FORM_ENDPOINT` vide.
3. Soumettre un formulaire de test : la page affiche le lien « Ouvrir mon application email » et le texte à copier.
4. Cliquer sur le lien puis **envoyer le brouillon dans votre messagerie**. Le site n’envoie rien lui-même.
5. Vérifier sa réception. Si aucun logiciel de messagerie n’est configuré ou si le lien est trop long pour le logiciel, copier le destinataire, l’objet et le corps affichés dans votre webmail.

Sans adresse valide ni endpoint, le formulaire signale que l’envoi est indisponible, permet de conserver le texte et n’annonce jamais de succès. Les informations ne sont pas stockées dans le navigateur.

### Option ultérieure : endpoint HTTPS

Renseigner `FORM_ENDPOINT` avec l’URL réelle d’un service acceptant ce contrat. L’adresse de contact reste recommandée pour le repli. Aucune clé privée ne doit figurer dans le JavaScript public.

- Méthode : `POST`, corps JSON, `Content-Type: application/json`, `Accept: application/json`.
- Champs texte : `name`, `company`, `email`, `url1`, `url2`, `url3`, `message`, `plan`.
- Succès : statut HTTP 2xx **et** corps JSON `{ "success": true }`, retournés uniquement après réception durable de la demande.
- Aucun envoi de cookies (`credentials: omit`). Le prestataire doit autoriser l’origine du site, POST et Content-Type via CORS, y compris la requête préalable OPTIONS. Le mode `no-cors` ne convient pas : il empêcherait de vérifier le résultat.
- Erreur HTTP, réseau, JSON invalide, absence de confirmation ou attente supérieure à 15 secondes : aucun succès affiché, données conservées et repli email proposé.
- Après une erreur réseau, la réception peut être incertaine : vérifier les demandes reçues avant de réessayer pour éviter un doublon.
- Validation serveur, limitation de débit, lutte contre les soumissions abusives, conservation et politique de confidentialité relèvent du futur prestataire ; la validation navigateur seule ne suffit pas.

Un formulaire reçu n’active pas automatiquement une surveillance : l’opérateur confirme les trois pages, la langue, le fuseau horaire et la date de démarrage. Voir `docs/TRIAL_INTAKE.md`.

## Tarifs de lancement

| Forfait | Prix HT / mois | URLs | Fréquence |
| --- | --- | --- | --- |
| Starter | 14,90 € | 5 | 1 / jour |
| Business | 29,90 € | 15 | 1 / jour |
| Pro | 59,90 € | 40 | Jusqu’à 3 / jour |

Chaque forfait inclut détection des changements importants, alertes email et configuration manuelle. Business et Pro : configuration et support prioritaires. Essai : **7 jours gratuits, 3 URLs, sans carte bancaire**, configuration incluse.

## Publication exacte sur GitHub Pages

1. Configurer le contact et finaliser les pages juridiques avant l’ouverture aux prospects. Tester une demande complète.
2. Vérifier que les fichiers, notamment `index.html` et `.nojekyll`, sont à la racine de `main`, puis les pousser sur GitHub.
3. Ouvrir le dépôt `KOMELF-coder/changewatch-landing` → **Settings → Pages**.
4. Dans **Build and deployment**, choisir **Source → Deploy from a branch**.
5. Choisir **Branch → main**, dossier **/ (root)**, puis **Save**.
6. Attendre la fin du déploiement dans l’onglet **Actions**. Retourner dans **Settings → Pages**, puis ouvrir l’URL affichée par GitHub. Utiliser cette URL comme référence, sans supposer que Pages est déjà activé.
7. Vérifier la disponibilité publique de l’URL, des styles, du favicon, des pages secondaires et des liens. Les chemins sont relatifs et compatibles avec le sous-dossier d’un site de projet.
8. Renseigner les métadonnées décrites ci-dessous et repousser les fichiers modifiés. Les poussées suivantes sur `main` republient le site.

GitHub Pages doit être disponible pour la visibilité du dépôt et le forfait GitHub du propriétaire. Si le menu indique une restriction, résoudre cette condition dans le compte sans changer silencieusement la visibilité du dépôt.

Documentation : [source de publication GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Domaine personnalisé : changewatch.cybersignal.fr

1. Activer Pages et vérifier d’abord l’URL attribuée dans **Settings → Pages**.
2. Vérifier la propriété du domaine dans les paramètres Pages du compte ou de l’organisation lorsque cette option est disponible. GitHub fournit alors le nom et la valeur TXT exacts ; les recopier chez le gestionnaire DNS.
3. Dans le dépôt, **Settings → Pages → Custom domain**, saisir `changewatch.cybersignal.fr` sans protocole ni chemin, puis enregistrer. Avec une publication par branche, GitHub crée le fichier `CNAME` à la racine ; récupérer ce commit par `git pull --ff-only` avant la prochaine modification locale.
4. Dans la zone DNS de `cybersignal.fr`, créer un enregistrement **CNAME** pour le sous-domaine `changewatch`. Sa cible doit être **le domaine GitHub Pages du compte propriétaire**, sous la forme `<propriétaire>.github.io`, à confirmer avec l’URL et la configuration Pages réelles. Ne pas saisir de protocole, de chemin de dépôt, d’adresse IP inventée ni le domaine racine `cybersignal.fr` comme cible. La syntaxe relative ou complète du nom dépend du fournisseur DNS.
5. Résoudre les enregistrements contradictoires uniquement pour ce sous-domaine, sans modifier les autres services de la zone. Attendre la propagation et la validation DNS de GitHub.
6. Quand le certificat est prêt, activer **Enforce HTTPS** dans Pages. Vérifier que `https://changewatch.cybersignal.fr/` et ses assets fonctionnent ; vérifier aussi la redirection depuis HTTP et l’ancienne URL Pages.
7. Mettre à jour canonical et `og:url` vers `https://changewatch.cybersignal.fr/`, repousser, puis refaire le test complet.

Ne pas ajouter de fichier `CNAME` ni de DNS avant d’avoir choisi/configuré effectivement ce domaine. Les valeurs TXT et toute configuration dépendante du compte sont à récupérer dans GitHub.

Documentation : [gestion d’un domaine personnalisé](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Métadonnées et juridique

Dans le `<head>` de `index.html`, remplacer les deux occurrences de `YOUR_CANONICAL_URL` par l’URL HTTPS définitive, puis sortir les deux balises du commentaire. Elles sont volontairement inactives pour ne pas publier un faux canonical. Conserver le slash final ; l’URL du site de projet contient son chemin de dépôt. Aucun `og:image` n’est déclaré sans image sociale réelle.

Remplacer les contenus provisoires des deux pages juridiques avec les informations vérifiées listées dans `docs/LEGAL_REQUIREMENTS.md`. Ajuster ensuite le texte de confidentialité du formulaire au service réellement retenu. Les pages provisoires ont `noindex` ; revoir cette directive une fois leur contenu finalisé.

## Contrôles

Pas de suite ni de dépendance à installer pour servir le site. Le rapport `docs/VALIDATION.md` liste les vérifications réellement réalisées et leurs limites. Refaire les tests fonctionnels du formulaire après chaque changement d’endpoint. Pour les 10 étapes finales et le premier jour commercial : `docs/LAUNCH_CHECKLIST.md`.
