<!-- title: Confidentialité | summary: Aucune télémétrie, aucune analyse, aucun serveur — et les quatre cas qui lisent hors de notre propre conteneur. | order: 4 -->

Il n'y a ni télémétrie, ni SDK d'analyse, ni serveur qui nous appartienne.
Chaque requête réseau va directement vers l'éditeur de l'app en cours de
vérification — ou vers `api.github.com`, `formulae.brew.sh` et
`xcodereleases.com` (l'index communautaire à partir duquel les versions de
Xcode sont lues), et, pour les icônes des formules Homebrew, vers les sites
indiqués juste en dessous — et ne transporte rien vous concernant au-delà de
ce dont la requête a besoin : le numéro de version de l'app elle-même, pour
que le flux d'un éditeur puisse répondre pour le bon canal.

**Icônes des formules Homebrew.** Pour une formule dont l'app n'embarque pas
de logo, la liste Homebrew affiche l'icône propre à la formule, récupérée la
première fois que sa ligne apparaît. Elle n'est demandée que là où le projet
en publie lui-même une : la page d'accueil de la formule (les liens d'icône de
la page, puis `/favicon.ico`, et seulement ceux situés sur l'hôte même de la
page d'accueil ou sur ses sous-domaines : un lien vers un CDN ou un autre hôte
est ignoré, et une redirection ailleurs n'est pas suivie) ou, pour un projet
sur GitHub, `api.github.com/users/<owner>` et, lorsque le propriétaire est une
organisation, son avatar sur `avatars.githubusercontent.com`. L'avatar d'une
personne n'est jamais récupéré, et les sites d'hébergement de code
(SourceForge, GitLab et autres) ne sont pas interrogés. Chacun de ces sites,
ainsi que GitHub, peut donc savoir qu'une de ses formules est installée sur
votre Mac. Les icônes sont mises en cache sur le disque ; pour une formule
sans icône, la demande n'est pas renouvelée avant une semaine.

Quatre choses méritent d'être mentionnées explicitement, parce qu'elles
impliquent une lecture hors de notre propre conteneur.

**CleanShot X.** S'il est installé, son `activationKey` est lue dans ses
préférences et utilisée pour demander l'appcast personnalisé qu'utilise le
propre outil de mise à jour de CleanShot. Sans cette clé, le flux de
CleanShot indique le canal d'essai et on vous signalerait des mises à jour
que vous ne pouvez pas installer. La clé n'est envoyée qu'à
`legit.maketheweb.io`, n'est jamais écrite dans un journal, et est exclue du
cache disque HTTP.

**TablePlus.** Sa préférence `IsReceiveBetaBuild` est lue, afin que la
détection s'exécute sur le même canal que celui sur lequel l'app elle-même
est réglée.

**GitHub.** Pour faire passer la limite de l'API de 60 requêtes par heure à
5 000, un jeton est pris depuis `GITHUB_TOKEN` / `GH_TOKEN`, ou à défaut
depuis `gh auth token`. Il n'est envoyé qu'à `api.github.com`, et il est
retiré de toute redirection qui quitte cet hôte.

**Votre connexion App Store.** Chaque fois que les données de TestFlight sont
lues, la base de données des comptes système est consultée pour une seule
chose : si les types de médias du compte App Store actif incluent l'App
Store. Cela détermine si une bêta TestFlight peut vous être proposée en ce
moment, et évite au bouton d'actualisation de lancer TestFlight juste
pour vous demander de vous connecter. Rien d'autre n'y est lu — ni identifiant
Apple, ni nom, ni identifiant — et rien de ce qui y est lu ne quitte le Mac.

## Votre connexion Apple Developer (Xcode)

Les bêtas et release candidates de Xcode se téléchargent uniquement depuis le
site développeur d'Apple, derrière votre identifiant Apple. Si vous choisissez
de vous connecter dans Réglages → Xcode, la connexion se fait sur la propre
page d'Apple à l'intérieur de l'app : votre mot de passe et votre code à deux
facteurs vont à Apple, et l'app ne les lit pas. Ce que l'app conserve, c'est
la session qui en résulte — les cookies `apple.com` qu'Apple a définis — dans
le Trousseau et dans le propre espace de stockage web de l'app, de sorte
qu'un relancement ne vous déconnecte pas. Ils ne sont envoyés qu'à
`*.apple.com` : pour télécharger Xcode, pour lire la liste des téléchargements
Xcode d'Apple quand vous l'ouvrez ou l'actualisez dans Réglages → Xcode, et
une fois par heure pour demander à Apple si la session tient toujours. Leurs
valeurs ne sont jamais écrites dans un journal ; le journal n'enregistre que
les noms des cookies renvoyés par Apple. Réglages → Xcode → Se déconnecter et
effacer les supprime, ainsi que le cookie d'« appareil de confiance », si bien
que la connexion suivante redemande un code.

Apple met fin à la session de son côté au bout de quelques heures — environ
huit dans nos tests. Quand l'app constate qu'elle a pris fin (lors de la
vérification horaire, ou quand vous lancez un téléchargement de Xcode), elle
charge une fois la page de connexion d'Apple, masquée, dans ce même espace de
stockage web. Si Apple reconnaît toujours la connexion de ce Mac, elle
renvoie une nouvelle session sans votre mot de passe. Aucune fenêtre
n'apparaît et rien n'est saisi ; si Apple demande votre mot de passe, la page
est abandonnée après 30 secondes et la ligne Xcode vous demande de vous
reconnecter. Cela se produit au plus une fois à chaque fin de session, et vous
pouvez désactiver cela sous Réglages → Xcode → Renouveler la session en
arrière-plan.

## Les identifiants restent dans le Trousseau

Tout ce que vous saisissez vous-même — un jeton GitHub, une licence Alcove, la
session Apple Developer décrite ci-dessus — est stocké dans le Trousseau de
connexion sous la forme `AfterFirstUnlockThisDeviceOnly`. Non synchronisé avec
iCloud, jamais écrit dans un plist.

## Les pages des éditeurs ne laissent pas de cookies derrière elles

Les notes de version qui ne peuvent être affichées que sous la forme de la
propre page web de l'éditeur sont rendues dans une `WKWebView` avec un espace
de stockage non persistant, si bien que les cookies de l'éditeur ne survivent
pas à un relancement. La seule exception est la connexion Apple Developer —
sa fenêtre et sa page de renouvellement masquée — qui conserve sa session
volontairement, comme décrit plus haut.

## Ce site web

Tout ce qui précède concerne l'app. Cette page que vous lisez est une chose
séparée, et elle collecte bel et bien quelque chose, ce qui mérite d'être dit
clairement plutôt que de vous laisser le déduire du comportement de l'app.

Le site exécute deux scripts, tous deux fournis par Vercel et servis depuis le
domaine du site lui-même (first-party).

**Vercel Web Analytics** compte les pages vues. Selon la propre documentation
de Vercel, il enregistre, pour chaque vue : l'heure, l'URL et son modèle de
route, le référent, des paramètres de requête filtrés, une localisation
approximative (pays, région, ville), le navigateur et le système
d'exploitation avec leurs versions, et le type d'appareil.

**Vercel Speed Insights** mesure la vitesse réelle de chargement de la page
pour vous. Selon la propre documentation de Vercel, chaque mesure transporte :
l'URL et son modèle de route, le Web Vital rapporté et l'élément auquel il a
été attribué (un sélecteur CSS tel que `html>body img.header`), la classe de
connexion (`4g`, `3g`, …), le navigateur, le type d'appareil et son système
d'exploitation, le pays sous forme de code à deux lettres, la version du
paquet de mesure, et l'heure de réception de l'événement. Notez la
localisation plus restreinte : le pays seulement, là où Analytics descend
jusqu'à la ville.

Ce que ni l'un ni l'autre ne fait : il n'y a aucun cookie tiers. Analytics
identifie un visiteur par un hachage dérivé de la requête entrante plutôt que
par quelque chose stocké sur votre machine, et abandonne cette identité au
bout de 24 heures — il ne peut donc pas vous suivre d'un site à l'autre, ni
reconstituer ce que vous avez fait ici il y a une semaine. Speed Insights n'a
aucune identité de visiteur du tout ; Vercel indique qu'il ne collecte ni ne
stocke rien qui permettrait de reconstituer une session de navigation à
travers plusieurs pages, et qu'aucune des deux fonctionnalités ne relie ses
données à une adresse IP.

Il n'y a rien d'autre. Aucun réseau publicitaire, aucun enregistrement de
session, aucun script tiers d'aucune sorte. Le bouton de téléchargement pointe
directement vers GitHub, et les notes de version proviennent d'un fichier du
propre dépôt de ce site.

Si vous préférez ne pas être mesuré, n'importe quel bloqueur de contenu
supprimera les deux scripts, et le site fonctionne exactement de la même
façon sans eux.
