<!-- title: Permisos | summary: Qué te pedirá macOS, qué te da cada uno y qué pierdes si lo rechazas. | order: 3 -->

macOS pide algunos permisos la primera vez que se necesitan, y para uno de ellos
no llega a pedirlo nunca. **Nada de esto hace falta para ver tus apps**: la
lista, las comprobaciones de versión y las notas de la versión funcionan con
todo denegado. A continuación se explica qué te da cada permiso, para cuáles de
tus apps importa, y qué te cuesta prescindir de él. Los apartados de Acceso
total al disco y Automatización se midieron en macOS 27 con una app a la que no
se le había concedido nada.

## Acceso total al disco — solo para betas de TestFlight y CotEditor

macOS nunca pide este: eres tú quien añade DuoUpdater en **Ajustes del Sistema →
Privacidad y seguridad → Acceso total al disco**. Como la app está firmada con
una identidad estable, la concesión sobrevive a todas las actualizaciones
futuras. Solo importa si tienes alguna de estas:

- **Una beta instalada desde TestFlight.** DuoUpdater lee las compilaciones que
  TestFlight te ofrece a partir de los propios registros de TestFlight. Sin
  este permiso, la beta sigue reconociéndose, pero su fila muestra un signo de
  interrogación en lugar de la última compilación.
- **CotEditor.** Guarda su canal de actualizaciones dentro de su contenedor de
  sandbox. Sin este permiso, CotEditor se comprueba contra sus versiones
  estables aunque lo hayas configurado para versiones preliminares; una versión
  preliminar que ya tengas instalada se sigue reconociendo por su número de
  versión.

Nada más de lo que DuoUpdater revisa necesita este permiso. El canal de
publicación de Fork, TablePlus, OrbStack, IINA, Tailscale, CleanShot y las
demás apps que reconoce, tu región de la App Store y los archivos bajo
Application Support se leen todos sin él.

Sin Acceso total al disco, DuoUpdater ni siquiera intenta esas dos lecturas:
cualquier intento se rechazaría, y en macOS 27 una lectura de TestFlight
rechazada muestra un aviso de «Data Access Blocked» (acceso a los datos
bloqueado). Si tienes una beta de TestFlight o CotEditor, abrir el menú explica
para qué sirve el permiso y dónde concederlo: una vez, y otra más solo si
aparece otra app así. La ventana de bienvenida y **Ajustes → Diagnóstico**
siempre muestran si está concedido, con un botón que abre el lugar correcto en
Ajustes del Sistema. Tocar el signo de interrogación en una fila de TestFlight
explica por qué está ahí, y ofrece el mismo botón cuando falta el permiso. Un
CotEditor estable lleva un pequeño candado junto a su nombre que hace lo mismo.

## Gestión de las apps — necesaria para instalar cualquier cosa

Sustituir una app en `/Applications` que puso ahí otro instalador depende de
este permiso, y macOS no ofrece ninguna API para pedirlo con antelación, así que
la primera instalación dispara el aviso del sistema. Recházalo y la detección
sigue funcionando; las instalaciones fallan, y DuoUpdater te abre el ajuste
correspondiente.

## Notificaciones — totalmente opcional

Se piden al arrancar, solo para avisarte de que se encontraron actualizaciones y
para el contador de la insignia del Dock. Ten en cuenta que la insignia necesita
específicamente el interruptor **Globos**, no basta con las alertas: con
Globos desactivado, el contador se descarta en silencio aunque las
notificaciones sí aparezcan.

## Asistente en segundo plano — para las actualizaciones de la App Store

Las actualizaciones de la App Store se ejecutan mediante un elemento en segundo
plano que macOS te pide aprobar una vez, en **Ítems de inicio y extensiones**. Sin él, las actualizaciones de la App Store fallan y DuoUpdater
te dice dónde activarlo.

## Accesibilidad — no hace falta de forma predeterminada

Se usa si cambias las instalaciones de la App Store a la vía por interfaz
gráfica en Ajustes, y para cerrar la ventana del Instalador tras actualizar un
paquete; sin este permiso, esa ventana se queda abierta para que la cierres tú.
La vía predeterminada para la App Store usa una descarga completa y no pide
nada más.

## Automatización — no se solicita

Cerrar y volver a abrir una app después de actualizarla no lo pide.
