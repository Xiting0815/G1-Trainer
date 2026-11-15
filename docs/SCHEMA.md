# Datenformat Übungen (verbindlich für alle Übungsdateien)

Übungsdateien sind reine JS-Dateien ohne Module/Build, die sich in ein globales Array eintragen:

```js
window.EXERCISES = window.EXERCISES || [];
window.EXERCISES.push(
  { /* Übung */ },
  { /* Übung */ }
);
```

## Übungsobjekt

```js
{
  id: 'h-feuer-wasser-eis',        // eindeutig, Präfix 'h-' (Halle) oder 'd-' (draußen), kebab-case
  name: 'Feuer, Wasser, Eis',
  venue: ['halle'],                 // 'halle' und/oder 'draussen' – nur wo die Übung WIRKLICH passt
  phase: 'aufwaermen',              // 'aufwaermen' | 'hauptteil' | 'abschluss'
  focus: ['koordination', 'laufen'],// beliebige aus: 'ballgefuehl','koordination','laufen','sozial','torschuss'
  duration: 10,                     // empfohlene Minuten
  players: [4, 16],                 // [min, max] Kinder
  level: 1,                         // 1 = Einstieg, 2 = mittel, 3 = fortgeschritten (für Bambini!)
  material: ['huetchen', 'baelle'], // aus: 'huetchen','baelle','minitore','leibchen','reifen','stangen','baenke','matten','kaesten'
  story: 'Kurze kindgerechte Geschichte/Einkleidung (DFB: Spielgeschichten!)',
  setup: 'Aufbau in 1–2 Sätzen (Feldgröße in Metern)',
  steps: ['Ablauf Schritt 1', 'Schritt 2', '...'],
  tips: ['Coaching-Tipp 1', '...'],          // kurz, positiv, kindgerecht
  easier: 'Vereinfachung',
  harder: 'Erschwerung',
  animation: { /* siehe unten */ }
}
```

## Animation

Koordinatensystem: Feld ist **100 breit × 64 hoch** (Einheiten, nicht Meter). (0,0) = links oben.
Eine Animation ist eine Endlosschleife von `loop` Sekunden. Alle Zeitangaben `t` sind **0…1** (Anteil der Schleife).

```js
animation: {
  loop: 6,                       // Sekunden pro Durchlauf (4–10)
  field: 'halle',                // 'halle' (Hallenboden mit Linien) | 'rasen' (Rasen)
  objects: [                     // statisches Material
    { type: 'cone',  x: 20, y: 10, color: 'orange' },  // color: 'orange'|'yellow'|'blue'|'red'|'green'|'white'
    { type: 'goal',  x: 95, y: 32, rot: 90 },            // Minitor, rot in Grad (0 = Öffnung nach unten)
    { type: 'hoop',  x: 50, y: 30, color: 'yellow' },    // Reifen
    { type: 'pole',  x: 40, y: 20 },                     // Stange (von oben = Punkt mit Ring)
    { type: 'bench', x: 50, y: 50, w: 30, rot: 0 },      // Langbank, w = Länge
    { type: 'mat',   x: 20, y: 50, w: 16, h: 10 },       // Matte
    { type: 'box',   x: 70, y: 50 },                     // kleiner Kasten
    { type: 'line',  x1: 10, y1: 5, x2: 10, y2: 59, dash: true }, // Markierungslinie
    { type: 'zone',  x: 5, y: 5, w: 20, h: 20, color: 'blue' },   // farbige Zone/Feld
    { type: 'label', x: 50, y: 4, text: 'Start' }
  ],
  actors: [                      // bewegte Spieler (farbige Punkte) und Bälle
    { id: 'p1', kind: 'player', color: 'red',  label: '',          // color: 'red'|'blue'|'yellow'|'green'|'purple'|'orange'
      keys: [[0, 10, 10], [0.5, 50, 10], [1, 10, 10]] },           // [t, x, y] – linear interpoliert
    { id: 'b1', kind: 'ball',
      keys: [[0, 12, 10], [0.5, 52, 10], [1, 12, 10]] },
    { id: 'c',  kind: 'coach', keys: [[0, 50, 60]] }               // Trainer (optional), 1 Key = steht still
  ]
}
```

Regeln:
- `keys` aufsteigend nach `t`, erster Key `t=0`, letzter `t=1`. Für nahtlose Schleife: letzter Key = erster Key (Position).
- Ein Ball, der von einem Spieler geführt wird, bekommt einfach Keys knapp neben dem Spieler (+2 in Laufrichtung).
- 4–10 Spieler-Punkte reichen für die Darstellung, nicht jedes Kind zeigen.
- Material muss zum Text passen (Hütchen, Tore etc. sichtbar).
