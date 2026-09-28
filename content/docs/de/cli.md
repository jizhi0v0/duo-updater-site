<!-- title: Der Befehl „duo“ | summary: Dieselbe Engine als Kommandozeilen-Tool, und die zwei Dinge, die sie verweigert, statt sie halb zu tun. | order: 5 -->

Dieselbe Engine gibt es als Kommandozeilen-Tool. `duo` bindet das echte `DuoUpdaterCore` ein, nutzt also dieselben Quellen in derselben Reihenfolge, dieselbe Installationsrichtlinie und dieselben Ignorier- und Überspring-Regeln wie die Menüleiste — eine Abweichung zwischen den beiden ist ein Bug, keine Meinungsverschiedenheit.

```sh
make cli          # → ~/.local/libexec/duo, verlinkt unter ~/.local/bin/duo

duo list                     # was installiert ist, ohne das Netzwerk anzufassen
duo check --json             # was ein Update hat, ein JSON-Objekt pro Zeile
duo install Cursor           # eines anwenden, oder --all
duo doctor                   # ob dieser Rechner überhaupt etwas installieren kann
duo backups                  # Wiederherstellungspunkte auflisten oder einen wiederherstellen
```

`duo check` und `duo list` akzeptieren außerdem `--source sparkle,github,…` und `--include-hidden`. `duo ignore` und `duo skip` schreiben dieselben Einstellungen, die auch die App liest — etwas in einem zu verbergen verbirgt es also auch im anderen.

## Zwei Dinge, die verweigert statt halb gemacht werden

**App-Store-Updates.** Dieser Weg braucht entweder den privilegierten Helper — dessen `SMAppService`-Registrierung ein App-Bundle voraussetzt — oder die Accessibility-API, die die App-Store-App steuert. Ein Kommandozeilen-Tool hat keines von beidem, also sagt es das, statt auf halbem Weg zu scheitern.

**Die Installationssperre gewaltsam übernehmen.** Ist die Menüleisten-App gerade mitten in einer Installation, bricht `duo` ab und nennt, wer die Sperre hält, statt ihr mitten im Vorgang das Bundle unter den Füßen wegzutauschen.

## Die Wartungsseite

`duo verify`, `duo triage` und `duo reconcile` gleichen jede handgeschriebene Regel mit ihrem Live-Endpunkt ab, fragen ein Modell, warum eine defekte kaputtgegangen ist, und wandeln das Ergebnis in Issues um. Das ist es, was die nächtliche Prüfung ausführt. Für den normalen Gebrauch werden sie nicht gebraucht.
