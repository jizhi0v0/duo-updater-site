<!-- title: Seguridad al instalar | summary: Qué se comprueba antes de sustituir una app, y qué se deja deliberadamente sin hacer. | order: 2 -->

Que sea DuoUpdater quien controla la instalación es lo que hace posibles estas
comprobaciones. Cada una de ellas es algo que puede salir mal cuando un software
sustituye a otro en tu Mac.

## Nunca fuerza el cierre de una app en ejecución

El instalador nunca cierra nada. Reabrir una app tras actualizarla
es un paso aparte, activado de forma predeterminada y desactivable en Ajustes;
y cuando se ejecuta, el cierre es un simple `terminate()`. La app gestiona sus
propios avisos para guardar y puede negarse. Una que se niega se queda
funcionando y conserva un botón **Reabrir**, así que el trabajo sin guardar
nunca corre riesgo por un cierre forzado.

Algo que conviene saber: la reapertura ocurre *después* de que la versión nueva
ya está en el disco. Así que si rechazas el cierre, te quedas con un bundle
actualizado junto a un proceso que sigue ejecutando el código antiguo, hasta
que lo vuelves a abrir tú mismo. Eso es lo que significa el botón Reabrir en la
fila.

## Cinco comprobaciones antes de sustituir nada

**EdDSA**, cuando la propia app aporta una clave pública. Algunos proveedores
publican un feed sin firmar; a esos no se les rechaza de entrada, simplemente
tienen que superar el resto de comprobaciones por su cuenta. Una app que sí
publica una clave debe producir una firma válida, con una excepción deliberada,
más abajo.

Después, sea cual sea la fuente, cuatro comprobaciones sobre el bundle
descargado:

- **Firma de Developer ID**, validada de forma estricta y hasta el final: cada
  arquitectura, código anidado incluido, no solo el bundle exterior.
- **Team ID**, que tiene que coincidir con el de la app que se sustituye.
- **Identificador del bundle**, tomado de la *firma* y no del `Info.plist`, así
  que un plist reescrito no puede colarse por ahí.
- **Arquitectura ejecutable**, leída de los segmentos Mach-O reales. Una
  compilación que este Mac no puede abrir se rechaza en lugar de instalarse y
  dejarse rota.

Una descarga que resulta ser de un desarrollador distinto se rechaza, no se
instala.

La excepción: cuando un proveedor rota su clave de firma sin publicar una
compilación de transición, la clave antigua ya no puede validar nada de lo que
publique. En vez de dejar la app varada para siempre, una firma EdDSA no válida
se retiene en lugar de descartarse, y la instalación puede seguir adelante **si
las otras cuatro comprobaciones pasan** y el bundle descargado trae una clave
nueva que sí valida el feed. En ese caso, las comprobaciones de Developer ID y
Team ID son las que sostienen la confianza.

## Los saltos de versión mayor requieren tu confirmación

Un salto a una nueva versión mayor se pone detrás de un aviso en lugar de un
botón de un clic, porque en una app comercial puede requerir una licencia
nueva. Decides tú; DuoUpdater no decide por ti facilitándotelo.

## Todo se vuelve a comprobar justo antes de instalar

Una lista que lleva una hora abierta está desactualizada. Antes del cambio, la
comprobación se repite, así que una instalación redundante nunca se dispara
contra una app que ya actualizó otra cosa mientras tanto.

## Copias de seguridad para revertir

El bundle que se sustituye se conserva, y se puede volver a poner en su sitio.
`duo backups` lista los puntos de reversión desde la línea de comandos; la app
ofrece lo mismo.

## Detección de reapertura pendiente

Si una app se actualizó en el disco pero sigue ejecutando una compilación
anterior —comparado mediante LaunchServices, no adivinado—, se señala con una
acción **Reabrir** en lugar de reportarse como actualizada. La versión en el
disco y la versión en ejecución son dos hechos distintos, y la fila te dice
cuál de los dos está desactualizado.
