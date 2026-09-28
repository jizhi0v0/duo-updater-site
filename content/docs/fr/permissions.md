<!-- title: Autorisations | summary: Ce que macOS va demander, ce que chacune apporte, et ce que vous perdez en refusant. | order: 3 -->

macOS demande certaines autorisations la première fois qu'elles sont
nécessaires, et pour l'une d'elles il ne la demande jamais du tout. **Rien
ici n'est requis pour voir vos apps** — la liste, les vérifications de version
et les notes de version fonctionnent même avec tout refusé. Voici ce
qu'apporte chaque autorisation, pour lesquelles de vos apps elle compte, et ce
qu'il en coûte de s'en passer. Les sections Accès complet au disque et
Automatisation ont été mesurées sur macOS 27 avec une app à qui rien n'avait
été accordé.

## Accès complet au disque — seulement pour les bêtas TestFlight et CotEditor

macOS ne le demande jamais : vous ajoutez vous-même DuoUpdater dans
**Réglages Système → Confidentialité et sécurité → Accès complet au disque**.
Comme l'app est signée avec une identité stable, l'autorisation survit à
chaque future mise à jour. Elle ne compte que si vous avez l'un des cas
suivants :

- **Une bêta installée depuis TestFlight.** DuoUpdater lit les versions que
  TestFlight vous propose depuis les propres registres de TestFlight. Sans
  cette autorisation, la bêta est quand même reconnue, mais sa ligne affiche
  un point d'interrogation à la place de la dernière version.
- **CotEditor.** Il garde son canal de mise à jour à l'intérieur de son
  conteneur sandbox. Sans cette autorisation, CotEditor est vérifié par
  rapport à ses versions stables même si vous lui avez demandé les
  préversions ; une préversion que vous exécutez déjà reste reconnue à partir
  de son numéro de version.

Rien d'autre de ce que DuoUpdater consulte n'en a besoin. Le canal de version
de Fork, TablePlus, OrbStack, IINA, Tailscale, CleanShot et des autres apps
qu'il connaît, votre vitrine App Store, et les fichiers sous Application
Support sont tous lus sans elle.

Sans l'Accès complet au disque, DuoUpdater ne tente même pas ces deux
lectures : chaque tentative serait refusée, et sur macOS 27 une lecture
TestFlight refusée fait apparaître un message « Accès aux données bloqué ».
Si vous avez une bêta TestFlight ou CotEditor, ouvrir le menu explique à quoi
sert l'autorisation et où l'accorder : une fois, et encore une fois seulement
si une autre app de ce genre apparaît. La fenêtre de bienvenue et
**Réglages → Diagnostic** indiquent toujours si elle est accordée, avec un
bouton qui ouvre le bon endroit dans Réglages Système. Cliquer sur le point
d'interrogation sur une ligne TestFlight explique pourquoi il est là, et
propose le même bouton quand une autorisation manquante en est la cause. Un
CotEditor stable porte un petit cadenas à côté de son nom qui fait la même
chose.

## Gestion des apps — requise pour installer quoi que ce soit

Remplacer une app dans `/Applications` qu'un autre installateur y a placée est
soumis à cette autorisation, et macOS ne fournit aucune API pour la demander
à l'avance, donc la première installation déclenche l'invite système. La
refuser n'empêche pas la détection de fonctionner ; les installations
échouent, et DuoUpdater vous ouvre le réglage correspondant.

## Notifications — entièrement facultatives

Demandées au lancement, uniquement pour vous signaler que des mises à jour
ont été trouvées et pour le compteur sur l'icône du Dock. À noter : ce
compteur nécessite spécifiquement l'option **Pastille sur icône d’application**,
pas seulement les alertes — si cette option est désactivée, le compteur
disparaît silencieusement même si les notifications continuent d'apparaître.

## Assistant en arrière-plan — pour les mises à jour de l'App Store

Les mises à jour de l'App Store passent par un élément en arrière-plan que
macOS vous demande d'approuver une fois, sous **Ouverture et extensions**.
Sans cela, les mises à jour de l'App Store échouent et DuoUpdater vous
indique où l'activer.

## Accessibilité — pas nécessaire par défaut

Utilisée si vous faites passer les installations App Store sur la méthode par
interface graphique dans les Réglages, et pour fermer la fenêtre de
l'Installateur après une mise à jour de paquet ; sans elle, cette fenêtre
reste ouverte pour que vous la fermiez vous-même. La méthode App Store par
défaut utilise un téléchargement complet et ne demande rien de plus.

## Automatisation — jamais demandée

Quitter puis relancer une app après sa mise à jour ne la demande pas.
