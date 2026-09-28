<!-- title: Datenschutz | summary: Keine Telemetrie, keine Analyse, kein Server — und die vier Fälle, die außerhalb unseres eigenen Containers lesen. | order: 4 -->

Es gibt keine Telemetrie, kein Analyse-SDK und keinen Server von uns. Jede Netzwerkanfrage geht direkt an den Anbieter, dessen App geprüft wird — oder an `api.github.com`, `formulae.brew.sh` und `xcodereleases.com` (den von der Community gepflegten Index, aus dem Xcode-Versionen gelesen werden) — und enthält nichts über dich, das über den Bedarf der Anfrage hinausgeht: die eigene Version der App, damit der Feed eines Anbieters für den richtigen Kanal antworten kann.

Vier Dinge verdienen es, ausdrücklich genannt zu werden, weil sie außerhalb unseres eigenen Containers lesen.

**CleanShot X.** Ist es installiert, wird sein `activationKey` aus seinen Einstellungen gelesen und genutzt, um den personalisierten Appcast anzufragen, den CleanShots eigener Updater verwendet. Ohne den Schlüssel meldet CleanShots Feed den Testkanal, und dir würden Updates angezeigt, die du nicht installieren kannst. Der Schlüssel wird ausschließlich an `legit.maketheweb.io` gesendet, nie in ein Log geschrieben und vom HTTP-Festplatten-Cache ausgenommen.

**TablePlus.** Dessen `IsReceiveBetaBuild`-Einstellung wird gelesen, damit die Prüfung auf demselben Kanal läuft, auf den die App selbst eingestellt ist.

**GitHub.** Um das API-Ratenlimit von 60 Anfragen pro Stunde auf 5.000 anzuheben, wird ein Token aus `GITHUB_TOKEN` / `GH_TOKEN` entnommen, ersatzweise aus `gh auth token`. Es wird ausschließlich an `api.github.com` gesendet und aus jeder Weiterleitung entfernt, die diesen Host verlässt.

**Deine App-Store-Anmeldung.** Wann immer TestFlight-Daten gelesen werden, wird die Systemkontendatenbank für genau eine Sache abgefragt: ob die Medientypen des aktiven App-Store-Kontos den App Store einschließen. Das entscheidet, ob dir gerade jetzt eine TestFlight-Beta angeboten werden kann, und verhindert, dass die Schaltfläche zum Aktualisieren TestFlight startet, nur um dich zur Anmeldung aufzufordern. Sonst wird nichts daraus gelesen — keine Apple-ID, kein Name, keine Kennung — und nichts davon verlässt den Mac.

## Deine Apple-Developer-Anmeldung (Xcode)

Xcode-Betas und Release Candidates werden ausschließlich von Apples Entwicklerseite heruntergeladen, hinter deiner Apple-ID. Meldest du dich unter Einstellungen → Xcode an, findet die Anmeldung auf Apples eigener Seite innerhalb der App statt: Dein Passwort und dein Zwei-Faktor-Code gehen an Apple, die App liest sie nicht mit. Was die App behält, ist die entstehende Sitzung — die `apple.com`-Cookies, die Apple setzt — im Schlüsselbund und im eigenen Web-Datenspeicher der App, damit ein Neustart dich nicht abmeldet. Sie werden ausschließlich an `*.apple.com` gesendet: um Xcode herunterzuladen, um Apples Liste der Xcode-Downloads zu lesen, wenn du sie unter Einstellungen → Xcode öffnest oder aktualisierst, und einmal pro Stunde, um Apple zu fragen, ob die Sitzung noch gültig ist. Ihre Werte werden nie in ein Log geschrieben; das Log verzeichnet nur die Namen der von Apple zurückgesendeten Cookies. Einstellungen → Xcode → Abmelden und löschen entfernt sie zusammen mit dem „Vertrauenswürdiges Gerät“-Cookie, sodass die nächste Anmeldung wieder einen Code verlangt.

Apple beendet die Sitzung auf seiner Seite nach einigen Stunden — in unseren Tests etwa acht. Stellt die App fest, dass die Sitzung beendet ist (bei der stündlichen Prüfung oder wenn du einen Xcode-Download startest), lädt sie einmal, versteckt, Apples Anmeldeseite in demselben Web-Datenspeicher. Erkennt Apple die Anmeldung dieses Macs noch, liefert es eine neue Sitzung zurück, ohne dass du dein Passwort eingibst. Es erscheint kein Fenster, und nichts wird getippt; verlangt Apple dein Passwort, wird die Seite nach 30 Sekunden verworfen, und die Xcode-Zeile bittet dich, dich erneut anzumelden. Das geschieht höchstens einmal pro Sitzungsende, und du kannst es unter Einstellungen → Xcode → Sitzung im Hintergrund erneuern abschalten.

## Zugangsdaten bleiben im Schlüsselbund

Alles, was du selbst einträgst — ein GitHub-Token, eine Alcove-Lizenz, die oben beschriebene Apple-Developer-Sitzung — wird im Anmeldeschlüsselbund als `AfterFirstUnlockThisDeviceOnly` gespeichert. Nicht mit iCloud synchronisiert, nicht in ein Plist geschrieben.

## Anbieterseiten hinterlassen keine Cookies

Versionshinweise, die sich nur als die eigene Webseite des Anbieters anzeigen lassen, werden in einer `WKWebView` mit nicht-persistentem Datenspeicher gerendert, sodass Anbieter-Cookies einen Neustart nicht überdauern. Die einzige Ausnahme ist die oben beschriebene Apple-Developer-Anmeldung — ihr Fenster und ihre versteckte Erneuerungsseite —, die ihre Sitzung absichtlich behält, wie oben beschrieben.

## Diese Website

Alles bisher Genannte betrifft die App. Diese Seite, die du gerade liest, ist eine eigene Sache, und sie sammelt tatsächlich etwas — das sollte man klar aussprechen, statt es aus dem Verhalten der App erraten zu lassen.

Die Website nutzt zwei Skripte, beide von Vercel, beide first-party.

**Vercel Web Analytics** zählt Seitenaufrufe. Laut Vercels eigener Dokumentation erfasst es pro Aufruf: den Zeitpunkt, die URL und ihr Routenmuster, den Referrer, gefilterte Query-Parameter, einen ungefähren Standort (Land, Region, Stadt), Browser und Betriebssystem mit Versionen sowie den Gerätetyp.

**Vercel Speed Insights** misst, wie schnell die Seite bei dir tatsächlich geladen hat. Laut Vercels eigener Dokumentation trägt jede Messung: die URL und ihr Routenmuster, den gemessenen Web Vital und das Element, dem er zugeordnet wurde (ein CSS-Selektor wie `html>body img.header`), die Verbindungsklasse (`4g`, `3g`, …), den Browser, den Gerätetyp und das Geräte-Betriebssystem, das Land als Zwei-Buchstaben-Code, die Version des Mess-Pakets sowie den Zeitpunkt, an dem das Ereignis empfangen wurde. Beachte die engere Standortangabe: nur das Land, wo Analytics bis auf die Stadt heruntergeht.

Was keines von beiden tut: Es gibt keine Third-Party-Cookies. Analytics identifiziert einen Besucher über einen aus der eingehenden Anfrage abgeleiteten Hash statt über etwas, das auf deinem Gerät gespeichert wird, und verwirft diese Identität nach 24 Stunden — sie kann dich also weder über Websites hinweg verfolgen noch rekonstruieren, was du vor einer Woche hier getan hast. Speed Insights hat überhaupt keine Besucheridentität; Vercel erklärt, dass es nichts sammelt oder speichert, womit sich eine Sitzung über Seiten hinweg rekonstruieren ließe, und dass keines der beiden Features seine Datenpunkte an eine IP-Adresse bindet.

Mehr gibt es nicht. Kein Werbenetzwerk, keine Sitzungsaufzeichnung, keine Skripte von Drittanbietern jeglicher Art. Die Download-Schaltfläche verlinkt direkt zu GitHub, und die Versionshinweise stammen aus einer Datei im eigenen Repository dieser Website.

Wenn du lieber nicht gemessen werden möchtest: Jeder Content-Blocker unterbindet beide Skripte, und die Website funktioniert ohne sie genauso.
