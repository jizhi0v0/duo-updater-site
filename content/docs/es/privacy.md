<!-- title: Privacidad | summary: Sin telemetría, sin analítica, sin servidor propio — y los cuatro casos en los que se lee fuera de nuestro propio contenedor. | order: 4 -->

No hay telemetría, ni SDK de analítica, ni servidor nuestro. Cada solicitud de
red va directamente al proveedor cuya app se está comprobando —o a
`api.github.com`, `formulae.brew.sh` y `xcodereleases.com` (el índice
mantenido por la comunidad del que se leen las versiones de Xcode) y, para los iconos de
fórmulas de Homebrew, los sitios indicados justo debajo— y no lleva
nada sobre ti más allá de lo que esa solicitud necesita: la versión de la
propia app, para que el feed de un proveedor pueda responder con el canal
correcto.

**Iconos de fórmulas de Homebrew.** Para una fórmula de la que la app no
incluye un logotipo propio, la lista de Homebrew muestra el icono de la propia
fórmula, que se descarga cuando su fila aparece por primera vez. Solo se pide
donde el propio proyecto publica uno: la página de inicio de la fórmula (los
enlaces de icono de la página y después `/favicon.ico`, y solo los que están
en el propio host de la página de inicio o en sus subdominios: un enlace a una
CDN o a otro host se omite, y no se sigue una redirección a otro sitio) o,
para un proyecto en GitHub, `api.github.com/users/<owner>` y, cuando el
propietario es una organización, su avatar en `avatars.githubusercontent.com`.
Nunca se descarga el avatar de una persona, y no se consulta a los sitios de
alojamiento de código (SourceForge, GitLab y similares). Por tanto, cada uno
de esos sitios, y GitHub, puede saber que una de sus fórmulas está instalada
en tu Mac. Los iconos se guardan en caché en el disco; si una fórmula no tiene
icono, no se vuelve a pedir durante una semana.

Hay cuatro cosas que merece la pena destacar explícitamente, porque implican
leer fuera de nuestro propio contenedor.

**CleanShot X.** Si está instalado, se lee su `activationKey` de sus
preferencias y se usa para pedir el appcast personalizado que utiliza el propio
actualizador de CleanShot. Sin la clave, el feed de CleanShot informa del canal
de prueba y se te avisaría de actualizaciones que no puedes instalar. La clave
solo se envía a `legit.maketheweb.io`, nunca se escribe en un registro, y se
excluye de la caché de disco HTTP.

**TablePlus.** Se lee su preferencia `IsReceiveBetaBuild`, para que la
detección se ejecute en el mismo canal que tiene configurado la propia app.

**GitHub.** Para elevar el límite de la API de 60 solicitudes por hora a 5000,
se toma un token de `GITHUB_TOKEN` / `GH_TOKEN`, o si no de `gh auth token`.
Solo se envía a `api.github.com`, y se elimina de cualquier redirección que
salga de ese host.

**Tu inicio de sesión de App Store.** Cada vez que se leen datos de TestFlight,
se consulta la base de datos de cuentas del sistema por una sola cosa: si los
tipos de contenido de la cuenta activa de App Store incluyen App Store. Eso
decide si se te puede ofrecer ahora mismo una beta de TestFlight, y evita que el
botón de actualizar tenga que abrir TestFlight solo para pedirte que inicies
sesión. No se lee nada más de ahí —ni Apple ID, ni nombre, ni identificador— y
nada de lo que se lee ahí sale del Mac.

## Tu inicio de sesión de Apple Developer (Xcode)

Las betas y versiones candidatas de Xcode se descargan solo desde el sitio de
desarrolladores de Apple, con tu Apple ID. Si eliges iniciar sesión en
Ajustes → Xcode, el inicio de sesión ocurre en la propia página de Apple dentro
de la app: tu contraseña y tu código de verificación en dos pasos van a Apple,
y la app no los lee. Lo que la app conserva es la sesión resultante —las
cookies de `apple.com` que fija Apple— en el Llavero y en el almacén de datos
web propio de la app, para que reabrir la app no cierre tu sesión. Solo se envían
a `*.apple.com`: para descargar Xcode, para leer la lista de descargas de
Xcode de Apple cuando la abres o la actualizas en Ajustes → Xcode, y una vez
por hora para preguntarle a Apple si la sesión sigue siendo válida. Sus valores
nunca se escriben en un registro; el registro solo anota los nombres de las
cookies que devuelve Apple. Ajustes → Xcode → Cerrar sesión y borrar las
elimina, junto con la cookie de «dispositivo de confianza», así que el próximo
inicio de sesión volverá a pedir un código.

Apple da por terminada la sesión por su lado tras unas horas: unas ocho en
nuestras pruebas. Cuando la app detecta que ha terminado (en la comprobación
horaria, o cuando empiezas una descarga de Xcode), carga una vez la página de
inicio de sesión de Apple, oculta, en ese mismo almacén de datos web. Si Apple
sigue reconociendo el inicio de sesión de este Mac, devuelve una sesión nueva
sin pedir tu contraseña. No aparece ninguna ventana y no se escribe nada; si
Apple pide tu contraseña, la página se descarta a los 30 segundos y la fila de
Xcode te pide que inicies sesión de nuevo. Esto ocurre como máximo una vez cada
vez que la sesión termina, y puedes desactivarlo en Ajustes → Xcode → Renovar
la sesión en segundo plano.

## Las credenciales se quedan en el Llavero

Cualquier cosa que introduzcas tú mismo —un token de GitHub, una licencia de
Alcove, la sesión de Apple Developer de arriba— se guarda en el Llavero de
inicio de sesión como `AfterFirstUnlockThisDeviceOnly`. No se sincroniza con
iCloud, ni se escribe en un plist.

## Las páginas de los proveedores no dejan cookies

Las notas de versión que solo se pueden mostrar como la propia página web del
proveedor se renderizan en un `WKWebView` con un almacén de datos no
persistente, así que las cookies del proveedor no sobreviven a reabrir la app. La
única excepción es el inicio de sesión de Apple Developer —su ventana y su
página de renovación oculta—, que conserva su sesión a propósito, como se
explica arriba.

## Este sitio web

Todo lo anterior habla de la app. Esta página que estás leyendo es algo
distinto, y sí recoge algo, así que merece la pena decirlo con claridad en
lugar de dejar que lo infieras del comportamiento de la app.

El sitio ejecuta dos scripts, ambos de Vercel, ambos de origen propio.

**Vercel Web Analytics** cuenta las visitas a la página. Según la propia
documentación de Vercel, registra, por cada visita: la hora, la URL y su patrón
de ruta, el referente, los parámetros de consulta filtrados, una ubicación
aproximada (país, región, ciudad), el navegador y el sistema operativo con sus
versiones, y el tipo de dispositivo.

**Vercel Speed Insights** mide con qué rapidez cargó realmente la página para
ti. Según la propia documentación de Vercel, cada medición incluye: la URL y su
patrón de ruta, el Web Vital que se está reportando y el elemento al que se
atribuye (un selector CSS como `html>body img.header`), la clase de conexión
(`4g`, `3g`, …), el navegador, el tipo de dispositivo y su sistema operativo, el
país como código de dos letras, la versión del paquete de medición, y la hora
en que se recibió el evento. Fíjate en que la ubicación es menos precisa: solo el
país, mientras que Analytics llega hasta la ciudad.

Lo que ninguno de los dos hace: no hay cookies de terceros. Analytics
identifica a un visitante mediante un hash derivado de la propia solicitud
entrante, en lugar de algo guardado en tu máquina, y descarta esa identidad
pasadas 24 horas, así que no puede seguirte entre sitios ni reconstruir lo que
hiciste aquí hace una semana. Speed Insights no tiene ninguna identidad de
visitante: Vercel indica que no recopila ni guarda nada que permita reconstruir
una sesión de navegación a través de varias páginas, y que ninguna de las dos
funciones vincula sus datos a una dirección IP.

No hay nada más. Ninguna red publicitaria, ninguna grabación de sesión, ningún
script de terceros de ningún tipo. El botón de descarga enlaza directamente a
GitHub, y las notas de versión vienen de un archivo del propio repositorio de
este sitio.

Si prefieres no ser medido, cualquier bloqueador de contenido eliminará ambos
scripts, y el sitio funciona exactamente igual sin ellos.
