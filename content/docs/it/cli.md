<!-- title: Il comando duo | summary: Lo stesso motore come strumento da riga di comando, e le due cose che si rifiuta di fare a metà. | order: 5 -->

Lo stesso motore ha una riga di comando. `duo` collega il vero
`DuoUpdaterCore`, quindi usa le stesse fonti nello stesso ordine, la stessa
politica di installazione e le stesse regole di ignora e salta della barra dei
menu — un disaccordo tra i due è un bug, non una differenza di opinione.

```sh
make cli          # → ~/.local/libexec/duo, con link simbolico in ~/.local/bin/duo

duo list                     # cosa è installato, senza toccare la rete
duo check --json             # cosa ha un aggiornamento, un oggetto JSON per riga
duo install Cursor           # applica uno, oppure --all
duo doctor                   # se questa macchina può davvero installare qualcosa
duo backups                  # elenca i punti di ripristino, o rimettine uno al suo posto
```

`duo check` e `duo list` accettano anche `--source sparkle,github,…` e
`--include-hidden`. `duo ignore` e `duo skip` scrivono le stesse preferenze
lette dall'app, così nascondere qualcosa nell'uno lo nasconde anche nell'altra.

## Due cose che si rifiuta di fare a metà

**Gli aggiornamenti dell'App Store.** Quel percorso richiede o l'helper
privilegiato — la cui registrazione `SMAppService` richiede un bundle app — o
l'API di Accessibilità che pilota App Store.app. Uno strumento da riga di
comando non ha né l'uno né l'altra, quindi lo dice invece di fallire a metà
strada.

**Prendere il blocco d'installazione con la forza.** Se l'app della barra dei
menu è a metà di un'installazione, `duo` esce e indica chi detiene il blocco,
invece di sostituire un bundle da sotto i suoi piedi.

## Il lato manutenzione

`duo verify`, `duo triage` e `duo reconcile` passano in rassegna ogni ricetta
scritta a mano confrontandola con il suo endpoint in tempo reale, chiedono a un
modello perché una ricetta rotta si è rotta, e trasformano il risultato in
issue. È questo che esegue il controllo notturno. Non sono necessari per l'uso
ordinario.
