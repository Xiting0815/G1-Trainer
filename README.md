# G1 Trainer – 1. FC Hochstadt ⚽

Trainings-App für die Bambini (G-Jugend) nach DFB-Vorgaben – für Handy und Tablet, funktioniert offline.

## Funktionen
- **Training im Voraus planen** – Halle (60′) oder draußen (90′), Datum (Standard: nächster freier Mittwoch).
  - *Allein:* freies Training & Aufbau → Begrüßung mit Ruf → 1 Station mit allen → Funino lernen → Funino 3:3 → Abschlusskreis mit Ruf.
  - *Zu zweit:* 3 Stationen im Wechsel (Gruppen A/B/C, ausgeglichen, per Antippen verschiebbar) + Funino-Abschluss.
  - Berücksichtigt Material (streng), Leistungsstand, Favoriten, zuletzt gemachte Übungen; Funino-Lernweg in 4 Stufen.
  - Packliste mit Mengen, Aufbau-Checkliste, „Heute im Blick“, Geburtstage, „♻️ Wie letztes Mal“.
- **Trainingsmodus (Timer)** – große Uhr, Phasenfarben, Rufe groß, Stationsrotation, lautes Signal mit Vorwarnung,
  Display bleibt an, **Stand übersteht Neuladen/App-Wechsel**, Anwesenheit & neues Kind direkt im Timer.
- **Kinder** – Name, Jahrgang, G1/G2, spielberechtigt, Leistung in 4 Bereichen (1–5) mit **Entwicklungs-Historie**,
  datierte Notizen, Anwesenheitsquote; Schnell-Bewertung beim Abschließen eines Trainings.
- **56 Übungen** (Halle, draußen, Funino-Lernweg, Extras) mit animierten Skizzen.
- **Daten** bleiben auf dem Gerät: Sicherung/Kinderliste teilen (WhatsApp, Mail), automatische Sicherung vor Import/Löschen.

## Aktivieren (GitHub Pages)
Settings → Pages → *Deploy from a branch* → **main** / **(root)**. App: `https://xiting0815.github.io/G1-Trainer/`
→ auf dem Handy „Zum Home-Bildschirm“.

## Technik
HTML/CSS/JavaScript ohne Build. `data/` = Übungen (Format `docs/SCHEMA.md`, `retired: true` blendet aus),
`docs/DFB-KONZEPT.md` = DFB-Recherche. Nach Änderungen `VERSION` in `sw.js` erhöhen.
