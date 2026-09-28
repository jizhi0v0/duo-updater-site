<!-- title: So funktioniert es | summary: Woher jede Versionsnummer stammt und warum der Installationsweg von App zu App unterschiedlich ist. | order: 1 -->

DuoUpdater durchsucht `/Applications`, `/Applications/Utilities` und `~/Applications` und gleicht das Gefundene in fester Rangfolge mit mehreren Update-Quellen ab. Die erste Quelle, die eine App erkennt, ist für sie zuständig; die übrigen werden nicht mehr befragt.

1. **Mac App Store** — Apples iTunes-Lookup-API, mit Berücksichtigung von Storefront und Region. Vertraut wird nur nativen `mac-software`-Ergebnissen; iOS-Apps auf dem Mac werden übersprungen, weil sich ihre Versionsnummern unabhängig bewegen und sonst als Updates erscheinen würden, die sich nie installieren lassen.
2. **Xcode Releases** — die Xcode-Builds, die nicht aus dem App Store stammen: jede Beta und jeder Release Candidate, abgeglichen mit dem Kanal, den du tatsächlich installiert hast. Ein aus dem Store installiertes Xcode ist bereits oben abgedeckt.
3. **Homebrew Cask** — abgeglichen über den `.app`-Dateinamen, mit Rückfall auf die Bundle-ID, sodass auch Casks gefunden werden, die ein `pkg` statt eines App-Bundles installieren. Zuständig ist diese Quelle nur für Apps, die Homebrew installiert hat und aktuell hält (nicht für Casks, die als `auto_updates` markiert sind), sodass Homebrews Datensatz nach einem Update aktuell bleibt und `brew upgrade` nicht dieselbe Version erneut installiert.
4. **Sparkle** — der eigene `SUFeedURL`-Appcast der App, derselbe Feed, den der eingebaute Updater der App liest.
5. **GitHub Releases** — kanalbewusster Abgleich für so verteilte Apps. Nur zur Erkennung, sofern keine app-spezifische Regel ein installierbares Mac-Asset für diese App benannt und geprüft hat.
6. **Alcove** — dessen authentifizierter Update-Endpunkt, nur wenn du eine Lizenz hinterlegt hast. Ohne Lizenz fehlt diese Quelle vollständig, und Alcove fällt auf die öffentliche Anbieterprüfung weiter unten zurück.
7. **Anbieterprüfungen** — handgeschriebene Regeln gegen den eigenen Endpunkt eines Anbieters, für alles, was weder einen Feed noch einen Store-Eintrag veröffentlicht.

## Zwei Arten von Apps überspringen diese Liste ganz

Eine App, die von **JetBrains Toolbox** verwaltet wird, und eine aus **TestFlight** installierte App werden bereits zugeordnet, bevor eine der sieben obigen Quellen befragt wird. Toolbox und TestFlight sind jeweils selbst für das Update dieser Apps zuständig, und eine nützliche zweite Meinung gibt es dazu nicht — deshalb läuft die Liste für sie gar nicht erst durch.

## Jede App wird so aktualisiert, wie sie es erwartet

Die meisten Updater setzen auf einen einzigen Mechanismus und schicken jede App dort hindurch. Dieser hier nutzt, was die App bereits mitbringt — deshalb tut die Schaltfläche je nach Zeile etwas anderes:

| Kanal | Was beim Drücken von „Aktualisieren“ passiert |
| --- | --- |
| Sparkle | Herunterladen, die Prüfungen unten durchführen, das Bundle austauschen — dann die App beenden und neu öffnen, sofern du das nicht abgeschaltet hast |
| Mac App Store | Ein vollständiger Download über den Store. Wo das nicht möglich ist — der Hintergrund-Helper ist nicht freigegeben, oder die App ist an eine andere Region gebunden —, übergibt die Zeile stattdessen an die App-Store-App |
| Selbstaktualisierend (Electron, Squirrel) | Die App öffnen und ihren eigenen Updater die Arbeit machen lassen |
| Homebrew-App-Cask | `brew install --cask --force` |
| Homebrew-`pkg`-Cask | Das offizielle Paket herunterladen und das System-Installationsprogramm öffnen |

Bringt eine App ihren eigenen Updater mit, überlässt DuoUpdater ihm die Arbeit, statt dagegenzuhalten. Lässt sich etwas nicht sicher durchführen, sagt die Zeile das, statt zu raten.

## Kommandozeilen-Tools und Schriften

Eine einzelne Zeile am Ende der Liste deckt alles ab, was Homebrew installiert und **keine App ist**: Kommandozeilen-Formeln sowie Casks, die überhaupt keine `.app` installieren — ein CLI-Tool, eine Schriftart, ein Treiber. Für keines davon ist eine app-spezifische Entscheidung nötig, und sie haben kein Bundle zum Scannen — ohne diese Zeile blieben sie also völlig unsichtbar.

Ein Cask, das *doch* eine App installiert, bekommt eine ganz gewöhnliche eigene Zeile und wird von der Aktualisierung in dieser untersten Zeile nie berührt, sodass nichts doppelt gezählt wird.
