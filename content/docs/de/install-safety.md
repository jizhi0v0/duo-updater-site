<!-- title: Installationssicherheit | summary: Was vor dem Ersetzen einer App geprüft wird, und was bewusst nie getan wird. | order: 2 -->

Dass die Installation selbst übernommen wird, macht diese Prüfungen überhaupt erst möglich. Jede einzelne davon adressiert etwas, das schiefgehen kann, wenn Software andere Software auf deinem Mac ersetzt.

## Eine laufende App wird nie zwangsweise beendet

Das Installationsprogramm beendet nie irgendetwas. Das Neustarten einer aktualisierten App ist ein eigener Schritt, standardmäßig aktiviert und in den Einstellungen abschaltbar — und wenn er läuft, ist das Beenden ein ganz normales `terminate()`. Die App zeigt ihre eigenen Sicherungsabfragen und kann das Beenden ablehnen. Eine App, die ablehnt, läuft weiter und behält eine Schaltfläche **Neu starten** — ungesicherte Arbeit ist so nie durch ein erzwungenes Beenden gefährdet.

Gut zu wissen: Der Neustart erfolgt, *nachdem* die neue Version bereits auf der Festplatte liegt. Lehnst du das Beenden also ab, liegt ein aktualisiertes Bundle neben einem Prozess, der weiterhin den alten Code ausführt — bis du die App selbst neu startest. Genau das bedeutet die Schaltfläche „Neu starten“ in der Zeile.

## Fünf Prüfungen, bevor irgendetwas ersetzt wird

**EdDSA**, sofern die App selbst einen öffentlichen Schlüssel bereitstellt. Manche Anbieter liefern einen unsignierten Feed aus; solche werden nicht von vornherein abgelehnt, sie müssen die übrigen Prüfungen einfach aus eigener Kraft bestehen. Eine App, die *tatsächlich* einen Schlüssel veröffentlicht, muss eine gültige Signatur liefern — mit einer bewussten Ausnahme, siehe unten.

Danach, unabhängig von der Quelle, vier Prüfungen des heruntergeladenen Bundles:

- **Developer-ID-Signatur**, streng und bis in die Tiefe geprüft — jede Architektur und eingebetteter Code eingeschlossen, nicht nur das äußere Bundle.
- **Team ID**, die zur ersetzten App passen muss.
- **Bundle-Identifier**, entnommen aus der *Signatur* statt aus der `Info.plist`, damit ein umgeschriebenes Plist sich hier nicht vorbeimogeln kann.
- **Ausführbare Architektur**, gelesen aus den echten Mach-O-Slices. Ein Build, den dieser Mac nicht starten kann, wird abgelehnt, statt installiert und dann kaputt zurückgelassen zu werden.

Ein Download, der sich als von einem anderen Entwickler stammend erweist, wird abgelehnt, nicht installiert.

Die Ausnahme: Wenn ein Anbieter seinen Signierschlüssel wechselt, ohne einen Übergangs-Build auszuliefern, kann der alte Schlüssel nichts mehr validieren, was der Anbieter veröffentlicht. Statt die App für immer im Stich zu lassen, führt eine ungültige EdDSA-Signatur nicht sofort zum Abbruch, sondern wird vorgemerkt, und die Installation kann trotzdem fortfahren, **wenn die anderen vier Prüfungen bestehen** und das heruntergeladene Bundle einen neuen Schlüssel mitbringt, der den Feed validiert. In diesem Fall tragen die Developer-ID- und die Team-ID-Prüfung das Vertrauen.

## Große Versionssprünge sind abgesichert

Ein Sprung auf eine neue Hauptversion wird hinter eine Warnung statt hinter eine Ein-Klick-Schaltfläche gelegt, weil das bei einer kommerziellen App eine neue Lizenz erfordern kann. Du entscheidest; DuoUpdater entscheidet nicht an deiner Stelle, indem es dir das leicht macht.

## Unmittelbar vor der Installation wird alles noch einmal geprüft

Eine Liste, die eine Stunde lang offen war, ist veraltet. Vor dem Austausch läuft die Prüfung erneut, damit keine überflüssige Installation gegen eine App losgeht, die in der Zwischenzeit bereits von etwas anderem aktualisiert wurde.

## Backups zum Zurücksetzen

Das ersetzte Bundle wird aufbewahrt und kann wieder eingesetzt werden. `duo backups` listet die Wiederherstellungspunkte von der Kommandozeile aus auf; die App bietet dasselbe.

## Neustart-Erkennung

Wurde eine App auf der Festplatte aktualisiert, läuft aber noch mit einem älteren Build — abgeglichen über LaunchServices, nicht geraten —, wird das mit einer **Neu starten**-Aktion angezeigt, statt als aktuell gemeldet zu werden. Die Version auf der Festplatte und die laufende Version sind zwei verschiedene Tatsachen, und die Zeile sagt dir, welche davon veraltet ist.
