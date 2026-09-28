<!-- title: Berechtigungen | summary: Wonach macOS fragt, was jede einzelne Berechtigung bringt, und was du beim Ablehnen verlierst. | order: 3 -->

macOS fragt bei manchen Berechtigungen beim ersten Bedarf nach, bei einer davon fragt es überhaupt nie. **Für die Übersicht über deine Apps ist nichts davon nötig** — die Liste, die Versionsprüfungen und die Versionshinweise funktionieren auch, wenn alles verweigert ist. Im Folgenden steht, was jede Berechtigung bringt, für welche deiner Apps sie eine Rolle spielt, und was es kostet, ohne sie auszukommen. Die Abschnitte zu Festplattenvollzugriff und Automation wurden auf macOS 27 mit einer App gemessen, der nichts gewährt worden war.

## Festplattenvollzugriff — nur für TestFlight-Betas und CotEditor

Danach fragt macOS nie von sich aus: Du fügst DuoUpdater selbst unter **Systemeinstellungen → Datenschutz & Sicherheit → Festplattenvollzugriff** hinzu. Weil die App mit einer stabilen Identität signiert ist, übersteht die Freigabe jedes künftige Update. Sie spielt nur eine Rolle, wenn eine der folgenden Situationen auf dich zutrifft:

- **Eine aus TestFlight installierte Beta.** DuoUpdater liest die Builds, die TestFlight dir anbietet, aus TestFlights eigenen Aufzeichnungen. Ohne diese Berechtigung wird die Beta zwar weiterhin erkannt, ihre Zeile zeigt aber ein Fragezeichen statt des neuesten Builds.
- **CotEditor.** Es hält seinen Update-Kanal innerhalb seines Sandbox-Containers. Ohne die Berechtigung wird CotEditor gegen seine stabilen Releases geprüft, selbst wenn du es auf Vorabversionen eingestellt hast; eine bereits laufende Vorabversion wird dennoch anhand ihrer Version erkannt.

Alles andere, was DuoUpdater betrachtet, braucht sie nicht. Der Release-Kanal von Fork, TablePlus, OrbStack, IINA, Tailscale, CleanShot und den anderen Apps, die es kennt, dein App-Store-Storefront und Dateien unter Application Support werden alle auch ohne sie gelesen.

Ohne Festplattenvollzugriff versucht DuoUpdater diese beiden Zugriffe gar nicht erst — jeder Versuch würde ohnehin verweigert, und auf macOS 27 erscheint bei einem verweigerten TestFlight-Zugriff die Meldung „Data Access Blocked“ (Datenzugriff blockiert). Hast du eine TestFlight-Beta oder CotEditor, erklärt das Öffnen des Menüs, wofür die Berechtigung gedacht ist und wo du sie erteilst — einmal, und noch einmal nur, wenn eine weitere solche App auftaucht. Das Willkommensfenster und **Einstellungen → Diagnose** zeigen jederzeit, ob sie erteilt ist, mit einer Schaltfläche, die direkt zur richtigen Stelle in den Systemeinstellungen führt. Ein Tippen auf das Fragezeichen bei einer TestFlight-Zeile erklärt, warum es dort steht, und bietet dieselbe Schaltfläche an, wenn eine fehlende Berechtigung der Grund ist. Ein stabiles CotEditor trägt neben seinem Namen ein kleines Schloss, das dasselbe leistet.

## App-Verwaltung — für jede Installation erforderlich

Das Ersetzen einer App in `/Applications`, die ein anderes Installationsprogramm dort abgelegt hat, hängt an dieser Berechtigung, und macOS bietet keine API, um sie vorab anzufragen — deshalb löst erst die erste Installation die Systemabfrage aus. Lehnst du sie ab, funktioniert die Erkennung weiterhin; Installationen schlagen fehl, und DuoUpdater öffnet die passende Einstellung für dich.

## Mitteilungen — vollkommen optional

Wird beim Start abgefragt, ausschließlich dafür, dich über gefundene Updates zu informieren und für die Zahl im Dock-Abzeichen. Beachte: Das Abzeichen braucht ausdrücklich den Schalter **Kennzeichen**, nicht nur Mitteilungen an sich — ist „Kennzeichen“ aus, verschwindet die Zahl stillschweigend, auch wenn Mitteilungen erscheinen.

## Hintergrund-Helper — für App-Store-Updates

App-Store-Updates laufen über ein Hintergrundelement, das macOS dich einmal zu bestätigen bittet, unter **Anmeldeobjekte & Erweiterungen**. Ohne diese Bestätigung schlagen App-Store-Updates fehl, und DuoUpdater sagt dir, wo du sie einschaltest.

## Bedienungshilfen — standardmäßig nicht benötigt

Wird genutzt, wenn du App-Store-Installationen in den Einstellungen auf den GUI-Weg umstellst, sowie um das Fenster des Installationsprogramms nach einem Paket-Update zu schließen; ohne diese Berechtigung bleibt dieses Fenster offen, damit du es selbst schließen kannst. Der Standardweg für den App Store nutzt einen vollständigen Download und verlangt nichts Zusätzliches.

## Automation — wird nicht angefragt

Das Beenden und Neustarten einer App nach ihrer Aktualisierung fragt nicht danach.
