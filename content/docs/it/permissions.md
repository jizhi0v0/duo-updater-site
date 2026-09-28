<!-- title: Permessi | summary: Cosa chiederà macOS, cosa ottieni con ciascun permesso e cosa perdi rifiutandolo. | order: 3 -->

macOS chiede alcuni permessi la prima volta che servono, e per uno di essi non
chiede mai nulla. **Nessuno di questi è necessario per vedere le tue app**:
l'elenco, i controlli delle versioni e le note di rilascio funzionano tutti
anche se neghi tutto. Segue cosa ottieni con ciascun permesso, per quali delle
tue app conta, e il costo di farne a meno. Le sezioni su Accesso completo al
disco e Automazione sono state misurate su macOS 27 con un'app a cui non era
stato concesso nulla.

## Accesso completo al disco — solo per le beta di TestFlight e CotEditor

macOS non chiede mai questo permesso: sei tu ad aggiungere DuoUpdater in
**Impostazioni di Sistema → Privacy e sicurezza → Accesso completo al disco**.
Poiché l'app è firmata con un'identità stabile, la concessione sopravvive a
ogni aggiornamento futuro. Conta solo se hai una di queste situazioni:

- **Una beta installata da TestFlight.** DuoUpdater legge le build che
  TestFlight ti offre direttamente dai registri di TestFlight. Senza questo
  permesso la beta viene comunque riconosciuta, ma la sua riga mostra un punto
  interrogativo invece dell'ultima build.
- **CotEditor.** Mantiene il proprio canale di aggiornamento dentro il suo
  container sandbox. Senza questo permesso, CotEditor viene controllato
  rispetto alle sue release stabili anche se gli hai chiesto le prerelease; una
  prerelease che già usi resta comunque riconosciuta dalla sua versione.

Nient'altro di ciò che DuoUpdater osserva ne ha bisogno. Il canale di rilascio
di Fork, TablePlus, OrbStack, IINA, Tailscale, CleanShot e delle altre app che
conosce, il tuo storefront dell'App Store e i file sotto Application Support
vengono tutti letti senza questo permesso.

Senza Accesso completo al disco, DuoUpdater non tenta affatto quelle due
letture — ogni tentativo verrebbe rifiutato, e su macOS 27 una lettura di
TestFlight rifiutata mostra un avviso "Accesso ai dati bloccato". Se hai
davvero una beta TestFlight o CotEditor, aprire il menu spiega a cosa serve il
permesso e dove concederlo: una volta, e di nuovo solo se compare un'altra app
di questo tipo. La finestra di benvenuto e **Impostazioni → Diagnostica**
mostrano sempre se è stato concesso, con un pulsante che apre il punto giusto
in Impostazioni di Sistema. Toccare il punto interrogativo su una riga
TestFlight spiega perché è lì, e offre lo stesso pulsante quando la causa è un
permesso mancante. Un CotEditor stabile mostra un piccolo lucchetto accanto al
nome che fa la stessa cosa.

## Gestione app — necessaria per installare qualsiasi cosa

Sostituire un'app in `/Applications` che è stata messa lì da un altro programma
di installazione dipende da questo permesso, e macOS non fornisce alcuna API
per richiederlo in anticipo, quindi la prima installazione fa comparire la
richiesta di sistema. Negalo e il rilevamento continua a funzionare; le
installazioni falliscono, e DuoUpdater apre l'impostazione al posto tuo.

## Notifiche — del tutto facoltative

Richieste all'avvio, solo per avvisarti che sono stati trovati aggiornamenti e
per il numero sul badge del Dock. Nota che il badge richiede specificamente
l'interruttore **Badge**, non solo gli avvisi — con Badge disattivato il numero
viene scartato in silenzio anche se le notifiche continuano a comparire.

## Helper in background — per gli aggiornamenti dell'App Store

Gli aggiornamenti dell'App Store passano attraverso un elemento in background
che macOS ti chiede di approvare una volta, sotto **Elementi login ed
estensioni**. Senza di esso, gli aggiornamenti dell'App Store falliscono e
DuoUpdater ti dice dove attivarlo.

## Accessibilità — non necessaria per impostazione predefinita

Usata se passi le installazioni dell'App Store al percorso grafico in
Impostazioni, e per chiudere la finestra del programma di installazione dopo
un aggiornamento tramite pacchetto; senza di essa quella finestra resta aperta
finché non la chiudi tu. Il percorso predefinito per l'App Store usa un
download completo e non richiede nulla in più.

## Automazione — non richiesta

Chiudere e riaprire un'app dopo averla aggiornata non la richiede.
