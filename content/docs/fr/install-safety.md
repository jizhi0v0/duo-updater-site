<!-- title: Sécurité de l'installation | summary: Ce qui est vérifié avant qu'une app soit remplacée, et ce qui n'est délibérément jamais fait. | order: 2 -->

C'est parce que DuoUpdater réalise lui-même l'installation que ces
vérifications sont possibles. Chacune d'elles correspond à quelque chose qui
peut mal tourner quand un logiciel en remplace un autre sur votre Mac.

## Il ne force jamais une app en cours d'exécution à quitter

L'installateur ne ferme jamais rien. Relancer une app mise à jour est
une étape séparée, activée par défaut et désactivable dans les Réglages — et
quand elle s'exécute, la fermeture demandée est un simple `terminate()`. L'app
affiche ses propres invites d'enregistrement et peut refuser. Une app qui
refuse reste ouverte et conserve un bouton **Relancer**, si bien qu'un travail
non enregistré n'est jamais mis en danger par une fermeture forcée.

À savoir : le relancement se produit *après* que la nouvelle version est déjà
sur le disque. Donc si vous déclinez la fermeture, vous vous retrouvez avec un
bundle mis à jour à côté d'un processus qui exécute toujours l'ancien code,
jusqu'à ce que vous le relanciez vous-même. C'est ce que signifie le bouton
Relancer sur la ligne.

## Cinq vérifications avant tout remplacement

**EdDSA**, quand l'app elle-même fournit une clé publique. Certains éditeurs
diffusent un flux non signé ; ceux-ci ne sont pas refusés d'office, ils doivent
simplement passer seuls les autres vérifications. Une app qui *publie* une clé
doit produire une signature valide — à une exception près, décrite plus bas.

Ensuite, quelle que soit la source, quatre vérifications sur le bundle
téléchargé :

- **Signature Developer ID**, validée de façon stricte et jusqu'au bout — chaque
  architecture, code imbriqué compris, pas seulement le bundle extérieur.
- **Team ID**, qui doit correspondre à celui de l'app remplacée.
- **Identifiant de bundle**, pris depuis la *signature* plutôt que depuis le
  `Info.plist`, de sorte qu'un plist réécrit ne puisse pas contourner cette
  vérification.
- **Architecture exécutable**, lue depuis les véritables tranches Mach-O. Une
  version que ce Mac ne peut pas lancer est refusée plutôt qu'installée et
  laissée cassée.

Un téléchargement qui se révèle provenir d'un autre développeur est refusé, pas
installé.

L'exception : quand un éditeur change de clé de signature sans publier de
version de transition, l'ancienne clé ne peut plus rien valider de ce qu'il
publie. Plutôt que de laisser l'app bloquée pour toujours, une signature EdDSA
invalide est retenue plutôt que rejetée d'emblée, et l'installation peut quand
même se poursuivre **si les quatre autres vérifications passent** et que le
bundle téléchargé porte une nouvelle clé qui valide le flux. Les vérifications
Developer ID et Team ID sont ce qui porte la confiance dans ce cas.

## Les mises à jour majeures demandent votre confirmation

Un saut vers une nouvelle version majeure est placé derrière un avertissement
plutôt que derrière un bouton en un clic, car pour une app commerciale cela
peut nécessiter une nouvelle licence. C'est vous qui décidez ; DuoUpdater ne
décide pas à votre place en rendant l'opération trop facile.

## Tout est revérifié immédiatement avant l'installation

Une liste restée ouverte pendant une heure est obsolète. Avant le
remplacement, la vérification s'exécute à nouveau, de sorte qu'une installation
redondante ne se déclenche jamais contre une app déjà mise à jour entre-temps
par autre chose.

## Sauvegardes de restauration

Le bundle remplacé est conservé, et peut être remis en place. `duo backups`
liste les points de restauration depuis la ligne de commande ; l'app propose la
même chose.

## Détection du besoin de relancement

Si une app a été mise à jour sur le disque mais exécute encore une version plus
ancienne — comparé via LaunchServices, pas deviné — elle est signalée avec une
action **Relancer** plutôt que d'être annoncée comme à jour. La version sur le
disque et la version en cours d'exécution sont deux faits distincts, et la
ligne vous indique lequel des deux est obsolète.
