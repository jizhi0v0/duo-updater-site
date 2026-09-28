<!-- title: Comment ça marche | summary: D'où vient chaque numéro de version, et pourquoi la méthode d'installation diffère selon l'app. | order: 1 -->

DuoUpdater analyse `/Applications`, `/Applications/Utilities` et `~/Applications`,
puis compare ce qu'il trouve à plusieurs sources de mise à jour, par ordre de
priorité. La première source qui reconnaît une app répond pour elle ; les
suivantes ne sont pas consultées.

1. **Mac App Store** — l'API iTunes lookup d'Apple, avec prise en compte de la
   vitrine et de la région. Seuls les résultats natifs `mac-software` sont pris
   en compte ; les apps iOS exécutées sur Mac sont ignorées, car leurs numéros
   de version évoluent indépendamment et apparaîtraient sinon comme des mises à
   jour impossibles à installer.
2. **Xcode Releases** — les versions de Xcode qui ne viennent pas de l'App
   Store : chaque bêta et release candidate, mise en correspondance avec le
   canal que vous avez réellement installé. Un Xcode installé depuis l'App
   Store est déjà pris en charge au point précédent.
3. **Homebrew Cask** — mis en correspondance par le nom de fichier `.app`, avec
   repli sur le bundle id, si bien que les casks qui installent un `pkg`
   plutôt qu'un bundle d'app sont quand même trouvés. Cette source ne répond
   que pour les apps que Homebrew a installées et maintient à jour (pas les
   casks marqués `auto_updates`), si bien que mettre à jour l'une d'elles
   laisse l'enregistrement de Homebrew à jour et `brew upgrade` n'installe pas
   la même version une seconde fois.
4. **Sparkle** — l'appcast `SUFeedURL` propre à l'app, le même flux que lit le
   propre outil de mise à jour de l'app.
5. **GitHub Releases** — mise en correspondance tenant compte du canal, pour
   les apps distribuées de cette façon. Détection seule, sauf si une règle
   propre à l'app a nommé et validé un fichier Mac installable pour elle.
6. **Alcove** — son point de terminaison de mise à jour authentifié, et
   seulement si vous avez saisi une licence. Sans cela, cette source est
   totalement absente, et Alcove retombe sur la sonde publique de l'éditeur
   ci-dessous.
7. **Sondes d'éditeur** — des règles écrites à la main contre le point de
   terminaison propre d'un éditeur, pour tout ce qui ne publie ni flux ni fiche
   sur une boutique.

## Deux types d'app échappent entièrement à cette liste

Une app gérée par **JetBrains Toolbox**, et une app installée depuis
**TestFlight**, sont prises en charge avant même que l'une des sept sources
ci-dessus soit consultée. Toolbox et TestFlight gèrent chacun eux-mêmes la mise
à jour de ces apps, et il n'y a pas de second avis utile à obtenir, si bien que la
liste ne s'exécute jamais pour elles.

## Il met à jour chaque app comme cette app s'y attend

La plupart des outils de mise à jour choisissent un seul mécanisme et y font
passer toutes les apps. Celui-ci utilise ce que l'app fournit déjà, ce qui
explique pourquoi le bouton fait quelque chose de différent selon la ligne :

| Canal | Ce qui se passe quand vous appuyez sur Mettre à jour |
| --- | --- |
| Sparkle | Téléchargement, vérifications ci-dessous, remplacement du bundle — puis l'app quitte et se rouvre, sauf si vous avez désactivé cette option |
| Mac App Store | Un téléchargement complet via la boutique. Quand ce n'est pas possible — l'assistant en arrière-plan n'est pas approuvé, ou l'app est verrouillée sur une autre région — la ligne passe la main à l'app App Store à la place |
| Mise à jour automatique (Electron, Squirrel) | Ouvre l'app et laisse son propre outil de mise à jour faire le travail |
| Cask Homebrew d'app | `brew install --cask --force` |
| Cask Homebrew `pkg` | Télécharge le paquet officiel et ouvre l'installateur système |

Quand une app fournit son propre outil de mise à jour, DuoUpdater passe la main
au lieu de lutter contre lui. Quand une opération ne peut pas être effectuée
sans risque, il le dit sur la ligne plutôt que de deviner.

## Outils en ligne de commande et polices

Une seule ligne, en bas de la liste, couvre tout ce que Homebrew installe qui
**n'est pas une app** : formules en ligne de commande, et casks qui n'installent
aucun `.app` du tout — un outil CLI, une police, un pilote. Aucun d'eux n'a
besoin d'une décision propre à l'app, et ils n'ont pas de bundle à analyser,
donc sans cette ligne ils resteraient totalement invisibles.

Un cask qui installe *effectivement* une app reçoit une ligne ordinaire comme
n'importe quelle autre, et n'est jamais touché par la mise à jour de cette
dernière ligne, si bien que rien n'est jamais compté deux fois.
