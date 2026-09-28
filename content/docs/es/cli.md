<!-- title: El comando duo | summary: El mismo motor como herramienta de línea de comandos, y las dos cosas que se niega a hacer a medias. | order: 5 -->

El mismo motor tiene una línea de comandos. `duo` enlaza el propio
`DuoUpdaterCore`, así que usa las mismas fuentes en el mismo orden, la misma
política de instalación y las mismas reglas de ignorar y omitir que la barra de
menús: un desacuerdo entre ambos es un fallo, no una diferencia de criterio.

```sh
make cli          # → ~/.local/libexec/duo, con enlace simbólico en ~/.local/bin/duo

duo list                     # qué está instalado, sin tocar la red
duo check --json             # qué tiene actualización, un objeto JSON por línea
duo install Cursor           # aplica una, o --all
duo doctor                   # si esta máquina puede realmente instalar algo
duo backups                  # lista los puntos de reversión, o restaura uno
```

`duo check` y `duo list` también aceptan `--source sparkle,github,…` y
`--include-hidden`. `duo ignore` y `duo skip` escriben las mismas preferencias
que lee la app, así que ocultar algo en uno lo oculta también en el otro.

## Dos cosas que se niega a hacer a medias

**Las actualizaciones de la App Store.** Esa vía necesita el asistente
privilegiado —cuyo registro con `SMAppService` requiere un bundle de app— o la
API de Accesibilidad manejando App Store.app. Una herramienta de línea de
comandos no tiene ninguna de las dos, así que lo dice en lugar de fallar a
medio camino.

**Tomar el bloqueo de instalación por la fuerza.** Si la app de la barra de
menús está instalando algo en ese momento, `duo` se detiene y nombra a quien lo
tiene, en lugar de sustituir un bundle por debajo de él.

## El lado de mantenimiento

`duo verify`, `duo triage` y `duo reconcile` revisan cada receta escrita a
mano contra su endpoint real, le preguntan a un modelo por qué se rompió una
que falló, y convierten el resultado en issues. Eso es lo que ejecuta la
comprobación nocturna. No hacen falta para el uso habitual.
