<!-- title: Sicurezza dell'installazione | summary: Cosa viene controllato prima che un'app venga sostituita, e cosa non viene mai fatto di proposito. | order: 2 -->

Possedere l'installazione è ciò che rende possibili questi controlli. Ognuno di
essi riguarda qualcosa che può andare storto quando un software ne sostituisce
un altro sul tuo Mac.

## Non forza mai la chiusura di un'app in esecuzione

Il programma di installazione non chiude mai nulla. Riavviare un'app aggiornata
è un passaggio separato, attivo per impostazione predefinita e disattivabile in
Impostazioni — e quando viene eseguito, la chiusura è un semplice `terminate()`.
L'app gestisce le proprie richieste di salvataggio e può rifiutarsi. Un'app che
si rifiuta resta in esecuzione e conserva un pulsante **Riapri**, così il lavoro
non salvato non è mai a rischio a causa di una chiusura forzata.

Da sapere: il riavvio avviene *dopo* che la nuova versione è già sul disco.
Quindi se rifiuti la chiusura, hai un bundle aggiornato accanto a un processo
che esegue ancora il vecchio codice, finché non lo riavvii tu stesso. È questo
che significa il pulsante Riapri sulla riga.

## Cinque controlli prima che qualcosa venga sostituito

**EdDSA**, quando è l'app stessa a fornire una chiave pubblica. Alcuni
fornitori pubblicano un feed non firmato; questi non vengono rifiutati subito,
devono semplicemente superare da soli i controlli rimanenti. Un'app che *pubblica*
una chiave deve produrre una firma valida — con un'unica eccezione voluta,
descritta più sotto.

Poi, indipendentemente dalla fonte, quattro controlli sul bundle scaricato:

- **Firma Developer ID**, convalidata in modo rigoroso e fino in fondo — ogni
  architettura, incluso il codice annidato, non solo il bundle esterno.
- **Team ID**, che deve corrispondere all'app da sostituire.
- **Identificatore del bundle**, preso dalla *firma* anziché dall'`Info.plist`,
  così un plist riscritto non può aggirare questo controllo.
- **Architettura eseguibile**, letta dalle vere sezioni Mach-O. Una build che
  questo Mac non può avviare viene rifiutata invece che installata e lasciata
  inutilizzabile.

Un download che risulta provenire da uno sviluppatore diverso viene rifiutato,
non installato.

L'eccezione: quando un fornitore cambia la propria chiave di firma senza
pubblicare una build di transizione, la vecchia chiave non può più convalidare
nulla di ciò che pubblica. Invece di lasciare l'app bloccata per sempre, una
firma EdDSA non valida viene trattenuta anziché generare un errore, e
l'installazione può comunque procedere **se gli altri quattro controlli
vengono superati** e il bundle scaricato porta una nuova chiave che convalida
il feed. In quel caso sono la firma Developer ID e il Team ID a garantire la
fiducia.

## Gli aggiornamenti a una nuova versione principale richiedono conferma

Il passaggio a una nuova versione principale viene messo dietro un avviso
anziché un pulsante a un clic, perché per un'app commerciale potrebbe
richiedere una nuova licenza. Decidi tu; DuoUpdater non decide al posto tuo
rendendo la cosa semplice.

## Tutto viene ricontrollato subito prima dell'installazione

Un elenco rimasto aperto per un'ora è ormai superato. Prima della sostituzione,
il controllo viene eseguito di nuovo, così un'installazione ridondante non
scatta mai contro un'app che nel frattempo è già stata aggiornata da qualcos'altro.

## Backup di ripristino

Il bundle sostituito viene conservato e può essere rimesso al suo posto. `duo
backups` elenca i punti di ripristino dalla riga di comando; l'app mostra la
stessa cosa.

## Rilevamento del riavvio

Se un'app è stata aggiornata sul disco ma è ancora in esecuzione con una build
più vecchia — confrontata tramite LaunchServices, non indovinata — viene
segnalata con un'azione **Riapri** invece di essere indicata come aggiornata.
La versione sul disco e la versione in esecuzione sono due fatti diversi, e la
riga ti dice quale dei due è superato.
