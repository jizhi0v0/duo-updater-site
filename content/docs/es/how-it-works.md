<!-- title: Cómo funciona | summary: De dónde viene cada número de versión, y por qué la vía de instalación es distinta según la app. | order: 1 -->

DuoUpdater explora `/Applications`, `/Applications/Utilities` y `~/Applications`,
y luego comprueba lo que encuentra contra varias fuentes de actualización, en un
orden de prioridad. La primera fuente que reconoce una app responde por ella; el
resto ni se consulta.

1. **Mac App Store** — la API de búsqueda de iTunes de Apple, con reconocimiento
   de tienda y región. Solo se confía en resultados nativos de `mac-software`;
   las apps de iOS en Mac se descartan, porque sus números de versión avanzan de
   forma independiente y, si no, aparecerían como actualizaciones que nunca se
   podrían instalar.
2. **Xcode Releases** — las compilaciones de Xcode que no vienen de la App
   Store: cada beta y cada versión candidata, emparejada con el canal que
   realmente tienes instalado. Un Xcode instalado desde la tienda ya queda
   cubierto por el punto anterior.
3. **Homebrew Cask** — se empareja por el nombre del `.app`, y si eso falla, por
   el bundle id, así que los casks que instalan un `pkg` en lugar de un bundle de
   app también se encuentran. Solo responde por las apps que Homebrew instaló y
   mantiene al día (no los casks marcados como `auto_updates`), así que
   actualizar una deja el registro de Homebrew al corriente y `brew upgrade` no
   vuelve a instalar la misma versión.
4. **Sparkle** — el propio appcast de la app, el `SUFeedURL`, que es el mismo
   feed que lee el actualizador integrado de la app.
5. **GitHub Releases** — emparejamiento que tiene en cuenta el canal para las
   apps que se distribuyen así. Solo detección, salvo que una regla específica para esa
   app haya identificado y verificado un recurso de Mac instalable.
6. **Alcove** — su endpoint de actualización autenticado, y solo si has
   introducido una licencia. Sin ella, esta fuente está simplemente ausente, y
   Alcove recae en la comprobación pública de proveedor de más abajo.
7. **Comprobaciones de proveedor** — reglas escritas a mano contra el propio
   endpoint de un proveedor, para todo lo que no publica ni un feed ni una ficha
   en una tienda.

## Dos tipos de apps que se saltan toda esa lista

Una app gestionada por **JetBrains Toolbox**, y una app instalada desde
**TestFlight**, se resuelven antes de consultar ninguna de las siete fuentes
anteriores. Toolbox y TestFlight son cada una dueña de la actualización de esas
apps, y no hay una segunda opinión útil que obtener, así que la lista nunca se
ejecuta para ellas.

## Actualiza cada app de la forma que esa app espera

La mayoría de los actualizadores eligen un único mecanismo y hacen pasar todas
las apps por él. Este usa lo que la app ya trae de fábrica, por eso el botón
hace algo distinto según la fila:

| Canal | Qué ocurre al pulsar Actualizar |
| --- | --- |
| Sparkle | Descarga, ejecuta las comprobaciones de más abajo, sustituye el bundle; luego cierra y vuelve a abrir la app, salvo que lo hayas desactivado |
| Mac App Store | Una descarga completa a través de la tienda. Cuando eso no es posible —el asistente en segundo plano no está aprobado, o la app está bloqueada a otra región—, la fila cede el control a la app App Store |
| Autoactualizable (Electron, Squirrel) | Abre la app y deja que su propio actualizador haga el trabajo |
| Cask de app de Homebrew | `brew install --cask --force` |
| Cask `pkg` de Homebrew | Descarga el paquete oficial y abre el instalador del sistema |

Cuando una app trae su propio actualizador, DuoUpdater le cede el control en
lugar de pelear con él. Cuando no puede hacer algo con seguridad, lo dice en la
fila en lugar de adivinar.

## Herramientas de línea de comandos y fuentes

Una sola fila al final de la lista cubre todo lo que Homebrew instala que **no
es una app**: fórmulas de línea de comandos, y casks que no instalan ningún
`.app` —un CLI, una fuente, un controlador. Ninguno de esos necesita una
decisión por app, y no tienen bundle que explorar, así que sin esa fila serían
por completo invisibles.

Un cask que sí instala una app recibe una fila normal como cualquier otra, y la
actualización de esa fila inferior nunca lo toca, así que nada se cuenta dos
veces.
