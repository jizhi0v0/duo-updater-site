<!-- title: Privacy | summary: Nessuna telemetria, nessuna analisi, nessun server — e i quattro casi in cui si legge fuori dal nostro container. | order: 4 -->

Non c'è telemetria, non c'è alcun SDK di analisi, e non c'è un server nostro.
Ogni richiesta di rete va direttamente al fornitore dell'app che si sta
controllando — oppure a `api.github.com`, `formulae.brew.sh` e
`xcodereleases.com` (l'indice mantenuto dalla community da cui vengono lette
le versioni di Xcode) — e non porta nulla su di te oltre a ciò che quella
richiesta necessita: la versione dell'app stessa, così che il feed di un
fornitore possa rispondere per il canale giusto.

Quattro cose vale la pena segnalare esplicitamente, perché comportano una
lettura al di fuori del nostro container.

**CleanShot X.** Se è installato, la sua `activationKey` viene letta dalle sue
preferenze e usata per richiedere l'appcast personalizzato che il programma di
aggiornamento di CleanShot usa lui stesso. Senza la chiave, il feed di
CleanShot segnala il canale di prova e ti verrebbero annunciati aggiornamenti
che non puoi installare. La chiave viene inviata solo a `legit.maketheweb.io`,
non viene mai scritta in un log ed è esclusa dalla cache su disco HTTP.

**TablePlus.** Viene letta la sua preferenza `IsReceiveBetaBuild`, così il
rilevamento viene eseguito sullo stesso canale su cui è impostata l'app.

**GitHub.** Per alzare il limite di richieste API da 60 all'ora a 5.000, un
token viene preso da `GITHUB_TOKEN` / `GH_TOKEN`, o in mancanza da `gh auth
token`. Viene inviato solo a `api.github.com`, ed è rimosso da qualsiasi
reindirizzamento che lascia quell'host.

**Il tuo accesso App Store.** Ogni volta che vengono letti i dati di
TestFlight, il database degli account di sistema viene letto per una sola
cosa: se i tipi di contenuto dell'account App Store attivo includono l'App
Store. Decide se una beta di TestFlight può esserti proposta in questo
momento, ed evita che il pulsante di aggiornamento avvii TestFlight solo per
chiederti di accedere. Nient'altro viene letto da lì — nessun Apple ID, nessun
nome, nessun identificativo — e nulla di ciò che vi si legge lascia il Mac.

## Il tuo accesso Apple Developer (Xcode)

Le beta e le release candidate di Xcode si scaricano solo dal sito
sviluppatori di Apple, dietro il tuo Apple ID. Se scegli di accedere in
Impostazioni → Xcode, l'accesso avviene sulla pagina di Apple stessa dentro
l'app: la tua password e il codice a due fattori vanno ad Apple, e l'app non li
legge. Ciò che l'app conserva è la sessione risultante — i cookie di
`apple.com` impostati da Apple — nel Portachiavi e nell'archivio dati web
dell'app stessa, così un riavvio non ti disconnette. Vengono inviati solo a
`*.apple.com`: per scaricare Xcode, per leggere l'elenco di Apple dei download
di Xcode quando lo apri o lo aggiorni in Impostazioni → Xcode, e una volta
all'ora per chiedere ad Apple se la sessione è ancora valida. I loro valori non
vengono mai scritti in un log; il log registra solo i nomi dei cookie che
Apple restituisce. Impostazioni → Xcode → Esci e cancella li elimina, insieme
al cookie del "dispositivo attendibile", così il prossimo accesso richiede di
nuovo un codice.

Apple termina la sessione dal suo lato dopo alcune ore — circa otto nei nostri
test. Quando l'app scopre che è terminata (al controllo orario, o quando avvii
un download di Xcode), carica una volta, in modo nascosto, la pagina di accesso
di Apple in quello stesso archivio dati web. Se Apple riconosce ancora
l'accesso di questo Mac, restituisce una nuova sessione senza la tua password.
Non compare alcuna finestra e non viene digitato nulla; se Apple vuole la tua
password, la pagina viene scartata dopo 30 secondi e la riga di Xcode ti chiede
di accedere di nuovo. Questo avviene al massimo una volta ogni volta che la
sessione termina, e puoi disattivarlo in Impostazioni → Xcode → Rinnova la
sessione in background.

## Le credenziali restano nel Portachiavi

Qualsiasi cosa inserisci tu stesso — un token GitHub, una licenza Alcove, la
sessione Apple Developer descritta sopra — viene memorizzata nel Portachiavi di
accesso come `AfterFirstUnlockThisDeviceOnly`. Non sincronizzata con iCloud,
non scritta in un plist.

## Le pagine dei fornitori non lasciano cookie

Le note di rilascio che possono essere mostrate solo come pagina web del
fornitore vengono renderizzate in una `WKWebView` con un archivio dati non
persistente, così i cookie del fornitore non sopravvivono a un riavvio.
L'unica eccezione è l'accesso Apple Developer — la sua finestra e la sua pagina
di rinnovo nascosta — che mantiene la sessione di proposito, come descritto
sopra.

## Questo sito web

Tutto quanto sopra riguarda l'app. Questa pagina che stai leggendo è una cosa a
sé, e raccoglie qualcosa, quindi vale la pena dirlo chiaramente invece di
lasciartelo dedurre dal comportamento dell'app.

Il sito esegue due script, entrambi di Vercel, entrambi di prima parte.

**Vercel Web Analytics** conta le visualizzazioni di pagina. Secondo la
documentazione ufficiale di Vercel, per ogni visualizzazione registra: l'ora,
l'URL e il suo pattern di route, il referrer, i parametri di query filtrati,
una posizione approssimativa (paese, regione, città), il browser e il sistema
operativo con le rispettive versioni, e il tipo di dispositivo.

**Vercel Speed Insights** misura quanto velocemente la pagina si è caricata
davvero per te. Secondo la documentazione ufficiale di Vercel, ogni misurazione
porta con sé: l'URL e il suo pattern di route, il Web Vital segnalato e
l'elemento a cui è stato attribuito (un selettore CSS come `html>body
img.header`), la classe di connessione (`4g`, `3g`, …), il browser, il tipo di
dispositivo e il suo sistema operativo, il paese come codice di due lettere, la
versione del pacchetto di misurazione e l'ora in cui l'evento è stato ricevuto.
Nota la posizione più ristretta: solo il paese, mentre Analytics scende fino
alla città.

Cosa non fa nessuno dei due: non ci sono cookie di terze parti. Analytics
identifica un visitatore tramite un hash derivato dalla richiesta in arrivo
anziché da qualcosa memorizzato sulla tua macchina, e scarta quell'identità
dopo 24 ore — quindi non può seguirti tra i siti, e non può ricostruire cosa
hai fatto qui una settimana fa. Speed Insights non ha alcuna identità di
visitatore; Vercel dichiara di non raccogliere né conservare nulla che
permetta di ricostruire una sessione di navigazione attraverso le pagine, e che
nessuna delle due funzionalità lega i propri dati a un indirizzo IP.

Non c'è nient'altro. Nessuna rete pubblicitaria, nessuna registrazione delle
sessioni, nessuno script di terze parti di alcun tipo. Il pulsante di download
punta direttamente a GitHub, e le note di rilascio provengono da un file nel
repository di questo stesso sito.

Se preferisci non essere misurato, qualsiasi blocco dei contenuti eliminerà
entrambi gli script, e il sito funziona esattamente allo stesso modo senza di
essi.
