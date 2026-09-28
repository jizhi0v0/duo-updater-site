<!-- title: Come funziona | summary: Da dove viene ogni numero di versione, e perché il percorso di installazione cambia da app ad app. | order: 1 -->

DuoUpdater analizza `/Applications`, `/Applications/Utilities` e `~/Applications`,
poi confronta ciò che trova con diverse fonti di aggiornamento, in ordine di
priorità. La prima fonte che riconosce un'app risponde per essa; le altre non
vengono consultate.

1. **Mac App Store** — l'API iTunes lookup di Apple, con riconoscimento dello
   storefront e della regione. Sono attendibili solo i risultati nativi
   `mac-software`; le app iOS eseguite su Mac vengono escluse, perché i loro
   numeri di versione si muovono in modo indipendente e altrimenti
   comparirebbero come aggiornamenti che non si potranno mai installare.
2. **Xcode Releases** — le build di Xcode che non provengono dall'App Store: ogni
   beta e release candidate, abbinata al canale che hai effettivamente
   installato. Uno Xcode installato dallo store è già coperto dal punto
   precedente.
3. **Homebrew Cask** — abbinato in base al nome file `.app`, con il bundle id
   come ripiego, così vengono trovati anche i cask che installano un `pkg`
   invece di un bundle app. Risponde solo per le app che Homebrew ha installato
   e mantiene aggiornate (non i cask contrassegnati `auto_updates`), così
   aggiornarne una lascia il registro di Homebrew aggiornato e `brew upgrade`
   non installa di nuovo la stessa release.
4. **Sparkle** — l'appcast `SUFeedURL` dell'app stessa, lo stesso feed letto dal
   programma di aggiornamento integrato dell'app.
5. **GitHub Releases** — corrispondenza sensibile al canale per le app
   distribuite in questo modo. Solo rilevamento, a meno che una regola
   specifica per l'app non abbia individuato e verificato un asset Mac
   installabile per quell'app.
6. **Alcove** — il suo endpoint di aggiornamento autenticato, e solo se hai
   inserito una licenza. Senza licenza questa fonte è del tutto assente, e
   Alcove passa alla sonda del fornitore pubblica descritta più sotto.
7. **Sonde per singolo fornitore** — regole scritte a mano contro l'endpoint di
   un fornitore, per tutto ciò che non pubblica né un feed né una scheda nello
   store.

## Due tipi di app che saltano completamente l'elenco

Un'app gestita da **JetBrains Toolbox**, e un'app installata da **TestFlight**,
ricevono risposta prima che una qualsiasi delle sette fonti sopra venga
consultata. Toolbox e TestFlight possiedono ciascuno l'aggiornamento delle
proprie app, e non c'è una seconda opinione utile da raccogliere, quindi
l'elenco non viene mai eseguito per loro.

## Aggiorna ogni app nel modo in cui quell'app se lo aspetta

La maggior parte dei programmi di aggiornamento sceglie un solo meccanismo e ci
fa passare ogni app. Questo usa qualunque meccanismo l'app porti già con sé, ed
è per questo che il pulsante fa qualcosa di diverso a seconda della riga:

| Canale | Cosa succede quando premi Aggiorna |
| --- | --- |
| Sparkle | Scarica, esegue i controlli descritti più sotto, sostituisce il bundle — poi chiude e riapre l'app, a meno che tu non l'abbia disattivato |
| Mac App Store | Un download completo tramite lo store. Dove non è possibile — l'helper in background non è approvato, o l'app è vincolata a un'altra regione — la riga passa la mano all'app App Store |
| Aggiornamento autonomo (Electron, Squirrel) | Apre l'app e lascia che il suo programma di aggiornamento faccia il lavoro |
| Cask Homebrew per app | `brew install --cask --force` |
| Cask Homebrew di tipo `pkg` | Scarica il pacchetto ufficiale e apre il programma di installazione di sistema |

Quando un'app porta con sé il proprio programma di aggiornamento, DuoUpdater
passa la mano invece di ostacolarlo. Quando non può fare qualcosa in modo
sicuro, lo dice sulla riga invece di tirare a indovinare.

## Strumenti da riga di comando e font

Una singola riga in fondo all'elenco copre tutto ciò che Homebrew installa che
**non è un'app**: formule da riga di comando, e cask che non installano alcuna
`.app` — una CLI, un font, un driver. Nessuno di questi richiede una decisione
per singola app, e non hanno alcun bundle da analizzare, quindi senza quella
riga sarebbero del tutto invisibili.

Un cask che *installa* un'app riceve invece una normale riga come qualsiasi
altra, e non viene mai toccato dall'aggiornamento in quella riga in fondo, così
niente viene contato due volte.
