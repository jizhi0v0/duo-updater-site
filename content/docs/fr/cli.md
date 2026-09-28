<!-- title: La commande duo | summary: Le même moteur sous forme d'outil en ligne de commande, et les deux choses qu'il refuse de faire à moitié. | order: 5 -->

Le même moteur dispose d'une ligne de commande. `duo` établit un lien direct
avec le véritable `DuoUpdaterCore`, il utilise donc les mêmes sources dans le
même ordre, la même politique d'installation, et les mêmes règles
d'exclusion et de saut que la barre des menus — un désaccord entre les deux
est un bug, pas une différence d'opinion.

```sh
make cli          # → ~/.local/libexec/duo, avec un lien symbolique dans ~/.local/bin/duo

duo list                     # ce qui est installé, sans toucher au réseau
duo check --json             # ce qui a une mise à jour, un objet JSON par ligne
duo install Cursor           # en applique une, ou --all
duo doctor                   # si cette machine peut vraiment installer quoi que ce soit
duo backups                  # liste les points de restauration, ou en remet un en place
```

`duo check` et `duo list` acceptent aussi `--source sparkle,github,…` et
`--include-hidden`. `duo ignore` et `duo skip` écrivent les mêmes préférences
que celles lues par l'app, donc masquer quelque chose dans l'un le masque
aussi dans l'autre.

## Deux choses qu'il refuse plutôt que de les faire à moitié

**Les mises à jour de l'App Store.** Cette méthode nécessite soit l'assistant
privilégié — dont l'enregistrement `SMAppService` requiert un bundle d'app —
soit l'API Accessibilité pilotant App Store.app. Un outil en ligne de commande
n'a ni l'un ni l'autre, il le dit donc au lieu d'échouer à mi-chemin.

**Prendre le verrou d'installation de force.** Si l'app de la barre des menus
est en train d'installer, `duo` s'arrête et nomme le détenteur du verrou
plutôt que de remplacer un bundle sous ses pieds.

## Le côté maintenance

`duo verify`, `duo triage` et `duo reconcile` passent chaque recette écrite à
la main au crible de son point de terminaison en direct, demandent à un modèle
pourquoi une recette cassée s'est cassée, et transforment le résultat en
tickets. C'est ce qu'exécute la vérification nocturne. Ils ne sont pas
nécessaires pour un usage courant.
