# G1 Trainer – 1. FC Hochstadt ⚽

Trainings-App für die Bambini (G-Jugend) nach DFB-Vorgaben – für Handy und Tablet, funktioniert offline.

## Funktionen
- **Training vorschlagen** – Halle (60 Min) oder draußen (90 Min), Aufbau nach der DFB-Bambini-Spielstunde
  (Begrüßung → Aktivierung → Spielphase 1 → Zwischenblock → Spielphase 2 → Abschlusskreis, draußen mit Trinkpausen & Freispiel).
  Der Vorschlag berücksichtigt Anwesenheit, Leistungsstand, Schwerpunkt, vorhandenes Material, Favoriten und
  vermeidet Übungen der letzten Trainings. Jede Übung lässt sich einzeln tauschen.
- **53 Übungen** (25 Halle, 28 draußen) mit animierten Skizzen (Spieler als farbige Punkte, Hütchen, Tore, Bänke, Matten …).
- **Kinderliste** – Name, Alter, Leistung in 4 Bereichen (Ballgefühl, Koordination, Laufen, Sozial) mit 1–5 Sternen + Notizen.
- **Anwesenheit**, **Verlauf** mit Bewertung und Notiz, **Favoriten**.
- **Trainingstimer** mit Signalton/Vibration, Bildschirm bleibt an.
- **Export/Import** der Daten (z. B. Handy → Tablet). Alle Daten bleiben lokal auf dem Gerät.

## Aktivieren (GitHub Pages)
1. Repository → **Settings → Pages**
2. *Source*: **Deploy from a branch**, Branch **main**, Ordner **/ (root)** → Save
3. Nach 1–2 Minuten läuft die App unter `https://xiting0815.github.io/G1-Trainer/`
4. Auf dem Handy öffnen → *Teilen → Zum Home-Bildschirm* (iPhone) bzw. *⋮ → App installieren* (Android).

## Technik
Reines HTML/CSS/JavaScript ohne Build. `data/` enthält die Übungen (Format: `docs/SCHEMA.md`),
`docs/DFB-KONZEPT.md` die Recherche zu den DFB-Vorgaben. Nach Änderungen an Dateien `VERSION` in `sw.js` erhöhen.
