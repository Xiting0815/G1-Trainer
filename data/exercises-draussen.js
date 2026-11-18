/* Draußen-Übungsbibliothek (Rasen / Kunstrasen) – Bambini U7
 * Format: siehe docs/SCHEMA.md
 */
window.EXERCISES = window.EXERCISES || [];
window.EXERCISES.push(

  /* =========================================================
   * AUFWÄRMEN
   * ========================================================= */

  {
    id: 'd-ampel-dribbling',
    name: 'Ampel-Dribbling',
    short: 'Alle dribbeln, Trainer zeigt Ampelfarbe: schnell, langsam, Stopp.',
    materialQty: { huetchen: '7', baelle: '1/Kind' },
    venue: ['draussen', 'halle'],
    phase: 'aufwaermen',
    focus: ['ballgefuehl', 'koordination'],
    duration: 8,
    players: [4, 16],
    level: 1,
    material: ['huetchen', 'baelle'],
    story: 'Alle Kinder sind kleine Autos und fahren mit ihrem Ball durch die Stadt. Der Trainer ist die Ampel – wer passt gut auf?',
    setup: 'Feld ca. 20 × 15 m mit 4 Hütchen abstecken. Jedes Kind hat einen Ball. Der Trainer hält ein grünes, gelbes und rotes Hütchen.',
    steps: [
      'Alle Kinder dribbeln kreuz und quer im Feld.',
      'Grün: normal fahren. Gelb: ganz langsam fahren. Rot: Ball mit der Sohle stoppen und stehen bleiben.',
      'Der Trainer wechselt die Farben immer schneller.',
      'Zwischendurch: „Hupen!" – alle rufen laut „Tuuut!" und fahren weiter.'
    ],
    tips: [
      'Ball eng am Fuß führen – das Auto darf nicht wegrollen.',
      'Kopf hoch, damit ihr die Ampel seht!',
      'Lob für jedes saubere Sohlen-Stoppen.'
    ],
    easier: 'Nur Grün und Rot verwenden.',
    harder: 'Zusätzliche Farbe Blau: Rückwärtsgang – Ball mit der Sohle zurückziehen.',
    animation: {
      loop: 8,
      field: 'rasen',
      objects: [
        { type: 'zone', x: 15, y: 6, w: 70, h: 46, color: 'white' },
        { type: 'cone', x: 15, y: 6, color: 'orange' },
        { type: 'cone', x: 85, y: 6, color: 'orange' },
        { type: 'cone', x: 15, y: 52, color: 'orange' },
        { type: 'cone', x: 85, y: 52, color: 'orange' },
        { type: 'cone', x: 40, y: 60, color: 'green' },
        { type: 'cone', x: 46, y: 60, color: 'yellow' },
        { type: 'cone', x: 60, y: 60, color: 'red' },
        { type: 'label', x: 75, y: 60, text: 'Rot = Stopp!' }
      ],
      actors: [
        { id: 'p1', kind: 'player', color: 'red', keys: [[0, 25, 14], [0.2, 45, 18], [0.45, 55, 32], [0.55, 55, 32], [0.8, 35, 40], [1, 25, 14]] },
        { id: 'b1', kind: 'ball', keys: [[0, 27, 15], [0.2, 47, 19], [0.45, 56, 34], [0.55, 56, 34], [0.8, 33, 38], [1, 27, 15]] },
        { id: 'p2', kind: 'player', color: 'blue', keys: [[0, 70, 13], [0.2, 62, 26], [0.45, 72, 42], [0.55, 72, 42], [0.8, 78, 26], [1, 70, 13]] },
        { id: 'b2', kind: 'ball', keys: [[0, 69, 15], [0.2, 63, 28], [0.45, 73, 44], [0.55, 73, 44], [0.8, 77, 24], [1, 69, 15]] },
        { id: 'p3', kind: 'player', color: 'yellow', keys: [[0, 30, 46], [0.2, 42, 38], [0.45, 38, 24], [0.55, 38, 24], [0.8, 52, 46], [1, 30, 46]] },
        { id: 'b3', kind: 'ball', keys: [[0, 32, 45], [0.2, 44, 37], [0.45, 37, 22], [0.55, 37, 22], [0.8, 50, 47], [1, 32, 45]] },
        { id: 'p4', kind: 'player', color: 'green', keys: [[0, 60, 46], [0.2, 50, 42], [0.45, 64, 20], [0.55, 64, 20], [0.8, 76, 34], [1, 60, 46]] },
        { id: 'b4', kind: 'ball', keys: [[0, 58, 46], [0.2, 48, 41], [0.45, 65, 18], [0.55, 65, 18], [0.8, 77, 36], [1, 58, 46]] },
        { id: 'c', kind: 'coach', keys: [[0, 53, 58]] }
      ]
    }
  },

  {
    id: 'd-farbhuetchen-zauber',
    name: 'Zauberer und Farbhütchen',
    short: 'Alle dribbeln, auf Farbruf um ein Hütchen dieser Farbe.',
    materialQty: { huetchen: '12', baelle: '1/Kind' },
    venue: ['draussen'],
    phase: 'aufwaermen',
    focus: ['ballgefuehl', 'koordination'],
    duration: 8,
    players: [4, 16],
    level: 1,
    material: ['huetchen', 'baelle'],
    story: 'Ein Zauberer hat bunte Zauberhütchen auf der Wiese verteilt. Wer eine Farbe hört, muss schnell mit dem Ball hin und das Hütchen einmal umkreisen – dann wirkt der Zauber!',
    setup: 'Feld ca. 25 × 20 m. Viele Hütchen in 4 Farben (rot, blau, gelb, grün) verteilen. Jedes Kind hat einen Ball.',
    steps: [
      'Alle dribbeln frei durch das Feld.',
      'Der Trainer ruft eine Farbe, z. B. „Blau!".',
      'Jedes Kind dribbelt zum nächsten blauen Hütchen und umrundet es einmal mit dem Ball.',
      'Danach weiter frei dribbeln, bis die nächste Farbe kommt.'
    ],
    tips: [
      'Kleine Schritte und viele Ballkontakte beim Umkreisen.',
      'Schaut euch beim Dribbeln um: Wo steht die nächste Farbe?',
      'Nicht drängeln – es gibt mehrere Hütchen jeder Farbe.'
    ],
    easier: 'Nur 2 Farben verwenden, Hütchen näher zusammen.',
    harder: 'Zwei Farben nacheinander rufen („Blau, dann Gelb!") oder nur mit dem schwachen Fuß umkreisen.',
    animation: {
      loop: 8,
      field: 'rasen',
      objects: [
        { type: 'cone', x: 15, y: 6, color: 'white' },
        { type: 'cone', x: 85, y: 6, color: 'white' },
        { type: 'cone', x: 15, y: 58, color: 'white' },
        { type: 'cone', x: 85, y: 58, color: 'white' },
        { type: 'cone', x: 25, y: 14, color: 'red' },
        { type: 'cone', x: 68, y: 48, color: 'red' },
        { type: 'cone', x: 76, y: 15, color: 'blue' },
        { type: 'cone', x: 30, y: 51, color: 'blue' },
        { type: 'cone', x: 50, y: 30, color: 'yellow' },
        { type: 'cone', x: 20, y: 32, color: 'yellow' },
        { type: 'cone', x: 58, y: 12, color: 'green' },
        { type: 'cone', x: 48, y: 52, color: 'green' },
        { type: 'label', x: 60, y: 62, text: 'Trainer: „Blau!“' }
      ],
      actors: [
        { id: 'p1', kind: 'player', color: 'red', keys: [[0, 40, 22], [0.2, 55, 20], [0.35, 71, 17], [0.42, 77, 19], [0.48, 80, 14], [0.55, 74, 11], [0.75, 55, 26], [1, 40, 22]] },
        { id: 'b1', kind: 'ball', keys: [[0, 42, 22], [0.2, 57, 19], [0.35, 73, 17], [0.42, 78, 18], [0.48, 80, 12], [0.55, 72, 11], [0.75, 53, 26], [1, 42, 22]] },
        { id: 'p2', kind: 'player', color: 'blue', keys: [[0, 60, 40], [0.2, 48, 44], [0.35, 34, 48], [0.42, 28, 54], [0.48, 26, 49], [0.55, 31, 46], [0.75, 48, 38], [1, 60, 40]] },
        { id: 'b2', kind: 'ball', keys: [[0, 58, 41], [0.2, 46, 45], [0.35, 32, 49], [0.42, 27, 55], [0.48, 26, 47], [0.55, 33, 45], [0.75, 50, 38], [1, 58, 41]] },
        { id: 'p3', kind: 'player', color: 'yellow', keys: [[0, 58, 28], [0.2, 64, 24], [0.35, 70, 22], [0.42, 75, 22], [0.48, 79, 18], [0.55, 77, 11], [0.75, 66, 20], [1, 58, 28]] },
        { id: 'b3', kind: 'ball', keys: [[0, 60, 27], [0.2, 66, 23], [0.35, 72, 22], [0.42, 77, 21], [0.48, 80, 16], [0.55, 75, 10], [0.75, 64, 21], [1, 60, 27]] },
        { id: 'p4', kind: 'player', color: 'green', keys: [[0, 22, 22], [0.2, 24, 34], [0.35, 26, 45], [0.42, 25, 53], [0.48, 31, 56], [0.55, 35, 51], [0.75, 30, 34], [1, 22, 22]] },
        { id: 'b4', kind: 'ball', keys: [[0, 22, 24], [0.2, 24, 36], [0.35, 26, 47], [0.42, 27, 55], [0.48, 33, 55], [0.55, 35, 49], [0.75, 28, 32], [1, 22, 24]] },
        { id: 'c', kind: 'coach', keys: [[0, 50, 61]] }
      ]
    }
  },

  {
    id: 'd-tunnel-fangen',
    name: 'Tunnelfangen',
    short: 'Fänger schlagen ab, Gefangene werden durch den Tunnel befreit.',
    materialQty: { huetchen: '4', leibchen: '2' },
    venue: ['draussen', 'halle'],
    phase: 'aufwaermen',
    focus: ['laufen', 'sozial'],
    duration: 7,
    players: [6, 16],
    level: 1,
    material: ['huetchen', 'leibchen'],
    story: 'Der Eiszauberer (mit Leibchen) friert alle ein, die er berührt. Eingefrorene Kinder werden zu Tunneln – wer durch den Tunnel krabbelt, taut sie wieder auf!',
    setup: 'Feld ca. 20 × 20 m mit 4 Hütchen. 1–2 Fänger bekommen ein Leibchen.',
    steps: [
      'Die Fänger versuchen, die anderen Kinder abzuschlagen.',
      'Wer abgeschlagen ist, bleibt mit gegrätschten Beinen stehen (Tunnel).',
      'Ein freies Kind krabbelt durch die Beine – schon ist das eingefrorene Kind wieder frei.',
      'Nach ca. 1 Minute neue Fänger bestimmen.'
    ],
    tips: [
      'Sanft abschlagen – nur antippen, nicht schubsen.',
      'Helft euch gegenseitig, niemand bleibt lange eingefroren!',
      'Oft die Fänger wechseln, damit jedes Kind mal dran ist.'
    ],
    easier: 'Größeres Feld, nur ein Fänger.',
    harder: 'Alle Kinder dribbeln dabei einen Ball. Befreien durch Ball durch die Beine passen.',
    animation: {
      loop: 8,
      field: 'rasen',
      objects: [
        { type: 'zone', x: 20, y: 8, w: 60, h: 48, color: 'white' },
        { type: 'cone', x: 20, y: 8, color: 'orange' },
        { type: 'cone', x: 80, y: 8, color: 'orange' },
        { type: 'cone', x: 20, y: 56, color: 'orange' },
        { type: 'cone', x: 80, y: 56, color: 'orange' }
      ],
      actors: [
        { id: 'f', kind: 'player', color: 'orange', label: 'F', keys: [[0, 40, 20], [0.2, 52, 32], [0.35, 58, 38], [0.5, 40, 46], [0.7, 30, 30], [0.85, 50, 16], [1, 40, 20]] },
        { id: 'p1', kind: 'player', color: 'red', keys: [[0, 50, 28], [0.2, 58, 34], [0.35, 60, 40], [0.6, 60, 40], [0.8, 70, 20], [1, 50, 28]] },
        { id: 'p2', kind: 'player', color: 'blue', keys: [[0, 30, 45], [0.25, 42, 50], [0.5, 56, 44], [0.58, 60, 41], [0.62, 62, 38], [0.8, 40, 36], [1, 30, 45]] },
        { id: 'p3', kind: 'player', color: 'yellow', keys: [[0, 70, 14], [0.3, 72, 24], [0.5, 74, 48], [0.75, 60, 52], [1, 70, 14]] },
        { id: 'p4', kind: 'player', color: 'green', keys: [[0, 28, 20], [0.3, 36, 14], [0.55, 26, 26], [0.8, 34, 40], [1, 28, 20]] },
        { id: 'p5', kind: 'player', color: 'purple', keys: [[0, 64, 50], [0.3, 46, 54], [0.6, 30, 50], [0.8, 48, 26], [1, 64, 50]] }
      ]
    }
  },

  {
    id: 'd-autofahrt-stadt',
    name: 'Autofahrt durch die Stadt',
    short: 'Alle dribbeln auf der Hütchenstraße, Tempo nach Zuruf.',
    materialQty: { huetchen: '14', baelle: '1/Kind' },
    venue: ['draussen'],
    phase: 'aufwaermen',
    focus: ['ballgefuehl', 'laufen'],
    duration: 8,
    players: [4, 14],
    level: 1,
    material: ['huetchen', 'baelle'],
    story: 'Mit Hütchen bauen wir eine große Straße rund um einen Park. Jedes Kind ist ein Auto (Ball) und fährt Runde um Runde – mal schnell auf der Autobahn, mal langsam in der Stadt.',
    setup: 'Zwei Hütchen-Rechtecke ineinander (außen ca. 30 × 25 m, innen ca. 20 × 12 m) bilden eine Straße von ca. 4 m Breite. Jedes Kind hat einen Ball.',
    steps: [
      'Alle Kinder fahren mit dem Ball auf der Straße im Uhrzeigersinn.',
      '„Autobahn!": schneller dribbeln. „Stadt!": langsam, kleine Schritte.',
      '„Kurve!": an der nächsten Ecke eng um das Hütchen drehen.',
      '„Umdrehen!": Richtung wechseln – Achtung, Gegenverkehr!'
    ],
    tips: [
      'Auf der Straße bleiben – der Park in der Mitte ist tabu.',
      'Überholen ist erlaubt, aber ohne Unfall!',
      'Mit Innen- und Außenseite des Fußes lenken.'
    ],
    easier: 'Nur geradeaus fahren, keine Richtungswechsel.',
    harder: 'Nur mit dem linken (bzw. schwächeren) Fuß fahren oder „Tankstopp": Ball 3× mit der Sohle hin und her rollen.',
    animation: {
      loop: 9,
      field: 'rasen',
      objects: [
        { type: 'cone', x: 10, y: 6, color: 'orange' },
        { type: 'cone', x: 50, y: 6, color: 'orange' },
        { type: 'cone', x: 90, y: 6, color: 'orange' },
        { type: 'cone', x: 90, y: 32, color: 'orange' },
        { type: 'cone', x: 90, y: 58, color: 'orange' },
        { type: 'cone', x: 50, y: 58, color: 'orange' },
        { type: 'cone', x: 10, y: 58, color: 'orange' },
        { type: 'cone', x: 10, y: 32, color: 'orange' },
        { type: 'zone', x: 30, y: 22, w: 40, h: 20, color: 'green' },
        { type: 'cone', x: 30, y: 22, color: 'yellow' },
        { type: 'cone', x: 50, y: 22, color: 'yellow' },
        { type: 'cone', x: 70, y: 22, color: 'yellow' },
        { type: 'cone', x: 70, y: 42, color: 'yellow' },
        { type: 'cone', x: 50, y: 42, color: 'yellow' },
        { type: 'cone', x: 30, y: 42, color: 'yellow' },
        { type: 'label', x: 50, y: 32, text: 'Park' }
      ],
      actors: [
        { id: 'p1', kind: 'player', color: 'red', keys: [[0, 20, 14], [0.25, 80, 14], [0.5, 80, 50], [0.75, 20, 50], [1, 20, 14]] },
        { id: 'b1', kind: 'ball', keys: [[0, 22, 14], [0.25, 80, 16], [0.5, 78, 50], [0.75, 20, 48], [1, 22, 14]] },
        { id: 'p2', kind: 'player', color: 'blue', keys: [[0, 80, 14], [0.25, 80, 50], [0.5, 20, 50], [0.75, 20, 14], [1, 80, 14]] },
        { id: 'b2', kind: 'ball', keys: [[0, 80, 16], [0.25, 78, 50], [0.5, 20, 48], [0.75, 22, 14], [1, 80, 16]] },
        { id: 'p3', kind: 'player', color: 'yellow', keys: [[0, 80, 50], [0.25, 20, 50], [0.5, 20, 14], [0.75, 80, 14], [1, 80, 50]] },
        { id: 'b3', kind: 'ball', keys: [[0, 78, 50], [0.25, 20, 48], [0.5, 22, 14], [0.75, 80, 16], [1, 78, 50]] },
        { id: 'p4', kind: 'player', color: 'green', keys: [[0, 20, 50], [0.25, 20, 14], [0.5, 80, 14], [0.75, 80, 50], [1, 20, 50]] },
        { id: 'b4', kind: 'ball', keys: [[0, 20, 48], [0.25, 22, 14], [0.5, 80, 16], [0.75, 78, 50], [1, 20, 48]] },
        { id: 'c', kind: 'coach', keys: [[0, 50, 36]] }
      ]
    }
  },

  {
    id: 'd-huetchentore-sammeln',
    name: 'Tore sammeln',
    short: 'Alle dribbeln durch möglichst viele Hütchentore und zählen.',
    materialQty: { huetchen: '16', baelle: '1/Kind' },
    venue: ['draussen'],
    phase: 'aufwaermen',
    focus: ['ballgefuehl', 'koordination'],
    duration: 8,
    players: [4, 16],
    level: 1,
    material: ['huetchen', 'baelle'],
    story: 'Auf der Wiese stehen viele kleine Schatztore. Jedes Mal, wenn du mit dem Ball durch ein Tor dribbelst, sammelst du eine Goldmünze. Wie reich wirst du?',
    setup: 'Feld ca. 25 × 20 m. 7–10 kleine Hütchentore (ca. 1,5 m breit) verteilen. Jedes Kind hat einen Ball.',
    steps: [
      'Auf Startsignal dribbeln alle Kinder durch möglichst viele verschiedene Tore.',
      'Jedes Tor zählt eine Münze – laut mitzählen!',
      'Nicht zweimal hintereinander durch dasselbe Tor.',
      'Nach 60 Sekunden: Wer hat am meisten Münzen?'
    ],
    tips: [
      'Kopf hoch: Welches Tor ist gerade frei?',
      'Vor dem Tor langsamer werden, danach wieder Gas geben.',
      'Jede Runde versuchen, den eigenen Rekord zu knacken.'
    ],
    easier: 'Tore breiter machen, keine Zeitbegrenzung.',
    harder: 'Nach jedem Tor eine Drehung mit dem Ball oder Tore nur mit dem schwachen Fuß durchdribbeln.',
    animation: {
      loop: 9,
      field: 'rasen',
      objects: [
        { type: 'cone', x: 25, y: 13, color: 'yellow' }, { type: 'cone', x: 25, y: 19, color: 'yellow' },
        { type: 'cone', x: 50, y: 9, color: 'yellow' }, { type: 'cone', x: 50, y: 15, color: 'yellow' },
        { type: 'cone', x: 76, y: 15, color: 'yellow' }, { type: 'cone', x: 76, y: 21, color: 'yellow' },
        { type: 'cone', x: 28, y: 41, color: 'yellow' }, { type: 'cone', x: 28, y: 47, color: 'yellow' },
        { type: 'cone', x: 54, y: 31, color: 'yellow' }, { type: 'cone', x: 54, y: 37, color: 'yellow' },
        { type: 'cone', x: 78, y: 43, color: 'yellow' }, { type: 'cone', x: 78, y: 49, color: 'yellow' },
        { type: 'cone', x: 48, y: 51, color: 'yellow' }, { type: 'cone', x: 48, y: 57, color: 'yellow' }
      ],
      actors: [
        { id: 'p1', kind: 'player', color: 'red', keys: [[0, 16, 16], [0.15, 30, 16], [0.3, 44, 12], [0.42, 56, 12], [0.6, 66, 26], [0.8, 40, 26], [1, 16, 16]] },
        { id: 'b1', kind: 'ball', keys: [[0, 18, 16], [0.15, 32, 15], [0.3, 46, 12], [0.42, 58, 13], [0.6, 64, 26], [0.8, 38, 25], [1, 18, 16]] },
        { id: 'p2', kind: 'player', color: 'blue', keys: [[0, 64, 34], [0.2, 48, 34], [0.35, 36, 42], [0.5, 22, 44], [0.65, 18, 54], [0.85, 50, 44], [1, 64, 34]] },
        { id: 'b2', kind: 'ball', keys: [[0, 62, 34], [0.2, 46, 35], [0.35, 34, 43], [0.5, 20, 45], [0.65, 20, 54], [0.85, 52, 43], [1, 62, 34]] },
        { id: 'p3', kind: 'player', color: 'yellow', keys: [[0, 70, 46], [0.15, 84, 46], [0.35, 86, 30], [0.5, 82, 18], [0.6, 70, 18], [0.8, 64, 40], [1, 70, 46]] },
        { id: 'b3', kind: 'ball', keys: [[0, 72, 46], [0.15, 86, 45], [0.35, 86, 28], [0.5, 80, 18], [0.6, 68, 19], [0.8, 65, 42], [1, 72, 46]] },
        { id: 'p4', kind: 'player', color: 'green', keys: [[0, 40, 54], [0.2, 56, 54], [0.4, 62, 44], [0.55, 60, 34], [0.65, 48, 34], [0.85, 36, 50], [1, 40, 54]] },
        { id: 'b4', kind: 'ball', keys: [[0, 42, 54], [0.2, 58, 53], [0.4, 62, 42], [0.55, 58, 34], [0.65, 46, 34], [0.85, 37, 52], [1, 42, 54]] }
      ]
    }
  },

  {
    id: 'd-garagen-spiel',
    name: 'Ab in die Garage',
    short: 'Alle dribbeln, auf „Garage!“ Ball im Reifen stoppen.',
    materialQty: { reifen: '6', baelle: '1/Kind', huetchen: '4' },
    venue: ['draussen', 'halle'],
    phase: 'aufwaermen',
    focus: ['ballgefuehl', 'koordination'],
    duration: 7,
    players: [4, 14],
    level: 1,
    material: ['reifen', 'baelle', 'huetchen'],
    story: 'Die Autos fahren durch die Stadt. Wenn der Trainer „Garage!" ruft, muss jedes Auto schnell in eine Garage (Reifen) einparken.',
    setup: 'Feld ca. 25 × 20 m mit Hütchen begrenzen, 5–8 Reifen verteilt hineinlegen. Jedes Kind hat einen Ball.',
    steps: [
      'Alle dribbeln frei zwischen den Reifen.',
      'Auf „Garage!" dribbelt jedes Kind zu einem Reifen und stoppt den Ball mit der Sohle im Reifen.',
      'Pro Garage dürfen höchstens 2 Autos parken.',
      'Auf „Losfahren!" geht es weiter. Der Trainer nimmt nach und nach Reifen weg.'
    ],
    tips: [
      'Ball genau im Reifen stoppen – Sohle drauf!',
      'Schon beim Dribbeln schauen, wo eine freie Garage ist.',
      'Freundlich bleiben, wenn eine Garage schon voll ist.'
    ],
    easier: 'Mehr Reifen als Kinder.',
    harder: 'Ball in der Garage 3× mit der Sohle vor und zurück rollen, bevor es weitergeht.',
    animation: {
      loop: 8,
      field: 'rasen',
      objects: [
        { type: 'cone', x: 15, y: 6, color: 'orange' },
        { type: 'cone', x: 85, y: 6, color: 'orange' },
        { type: 'cone', x: 15, y: 58, color: 'orange' },
        { type: 'cone', x: 85, y: 58, color: 'orange' },
        { type: 'hoop', x: 30, y: 18, color: 'yellow' },
        { type: 'hoop', x: 70, y: 18, color: 'yellow' },
        { type: 'hoop', x: 30, y: 46, color: 'yellow' },
        { type: 'hoop', x: 70, y: 46, color: 'yellow' },
        { type: 'hoop', x: 50, y: 32, color: 'yellow' }
      ],
      actors: [
        { id: 'p1', kind: 'player', color: 'red', keys: [[0, 40, 14], [0.2, 58, 10], [0.4, 66, 16], [0.5, 68, 20], [0.65, 68, 20], [0.85, 56, 22], [1, 40, 14]] },
        { id: 'b1', kind: 'ball', keys: [[0, 42, 14], [0.2, 60, 11], [0.4, 68, 17], [0.5, 70, 18], [0.65, 70, 18], [0.85, 54, 21], [1, 42, 14]] },
        { id: 'p2', kind: 'player', color: 'blue', keys: [[0, 60, 50], [0.2, 46, 54], [0.4, 34, 48], [0.5, 32, 48], [0.65, 32, 48], [0.85, 48, 44], [1, 60, 50]] },
        { id: 'b2', kind: 'ball', keys: [[0, 58, 50], [0.2, 44, 54], [0.4, 32, 47], [0.5, 30, 46], [0.65, 30, 46], [0.85, 50, 45], [1, 58, 50]] },
        { id: 'p3', kind: 'player', color: 'yellow', keys: [[0, 20, 32], [0.2, 20, 22], [0.4, 26, 16], [0.5, 28, 20], [0.65, 28, 20], [0.85, 22, 36], [1, 20, 32]] },
        { id: 'b3', kind: 'ball', keys: [[0, 20, 30], [0.2, 21, 20], [0.4, 28, 16], [0.5, 30, 18], [0.65, 30, 18], [0.85, 22, 34], [1, 20, 30]] },
        { id: 'p4', kind: 'player', color: 'green', keys: [[0, 80, 30], [0.2, 72, 38], [0.4, 60, 34], [0.5, 52, 34], [0.65, 52, 34], [0.85, 74, 26], [1, 80, 30]] },
        { id: 'b4', kind: 'ball', keys: [[0, 78, 31], [0.2, 70, 38], [0.4, 58, 33], [0.5, 50, 32], [0.65, 50, 32], [0.85, 76, 27], [1, 78, 31]] },
        { id: 'p5', kind: 'player', color: 'purple', keys: [[0, 48, 46], [0.2, 56, 52], [0.4, 66, 50], [0.5, 68, 48], [0.65, 68, 48], [0.85, 52, 40], [1, 48, 46]] },
        { id: 'b5', kind: 'ball', keys: [[0, 50, 47], [0.2, 58, 52], [0.4, 68, 49], [0.5, 70, 46], [0.65, 70, 46], [0.85, 50, 40], [1, 50, 47]] }
      ]
    }
  },

  {
    id: 'd-slalom-staffel',
    name: 'Skifahrer-Slalom',
    short: 'Slalom um Stangen dribbeln, im Tempo zurück, abklatschen.',
    materialQty: { stangen: '4/Bahn', huetchen: '2/Bahn', baelle: '1/Kind' },
    venue: ['draussen'],
    phase: 'aufwaermen',
    focus: ['ballgefuehl', 'koordination', 'laufen'],
    duration: 8,
    players: [4, 16],
    level: 2,
    material: ['stangen', 'huetchen', 'baelle'],
    story: 'Wir sind Skifahrer auf der Piste! Mit dem Ball schlängeln wir uns um die Slalomstangen herum – ohne eine umzufahren.',
    setup: 'Mehrere Slalombahnen nebeneinander (je 4 Stangen im Abstand von ca. 2 m, Wendehütchen am Ende). Höchstens 2 Kinder pro Bahn, jedes Kind mit Ball.',
    steps: [
      'Das erste Kind dribbelt im Slalom um die Stangen bis zum Wendehütchen.',
      'Zurück geht es neben der Bahn im Tempo-Dribbling.',
      'Abklatschen – jetzt startet das zweite Kind.',
      'Wer wartet, macht Ballkunststücke (Sohle vor/zurück, Ball antippen).'
    ],
    tips: [
      'Kleine Kontakte, Ball dicht an der Stange vorbei.',
      'Innen- und Außenseite benutzen – wie beim Skifahren hin und her.',
      'Auf dem Rückweg darf es richtig schnell gehen!'
    ],
    easier: 'Stangen weiter auseinander stellen oder nur 3 Stangen.',
    harder: 'Nur mit dem schwachen Fuß oder nur mit der Außenseite dribbeln.',
    animation: {
      loop: 10,
      field: 'rasen',
      objects: [
        { type: 'cone', x: 14, y: 20, color: 'blue' },
        { type: 'pole', x: 30, y: 20 }, { type: 'pole', x: 42, y: 20 }, { type: 'pole', x: 54, y: 20 }, { type: 'pole', x: 66, y: 20 },
        { type: 'cone', x: 78, y: 20, color: 'orange' },
        { type: 'cone', x: 14, y: 44, color: 'red' },
        { type: 'pole', x: 30, y: 44 }, { type: 'pole', x: 42, y: 44 }, { type: 'pole', x: 54, y: 44 }, { type: 'pole', x: 66, y: 44 },
        { type: 'cone', x: 78, y: 44, color: 'orange' }
      ],
      actors: [
        { id: 'p1', kind: 'player', color: 'blue', keys: [[0, 12, 17], [0.05, 24, 20], [0.1, 30, 16], [0.15, 42, 24], [0.2, 54, 16], [0.25, 66, 24], [0.3, 76, 20], [0.42, 20, 11], [0.47, 12, 17], [1, 12, 17]] },
        { id: 'b1', kind: 'ball', keys: [[0, 14, 18], [0.05, 26, 20], [0.1, 32, 16], [0.15, 44, 24], [0.2, 56, 16], [0.25, 68, 24], [0.3, 78, 21], [0.42, 18, 11], [0.47, 14, 18], [1, 14, 18]] },
        { id: 'p2', kind: 'player', color: 'green', keys: [[0, 12, 23], [0.5, 12, 23], [0.55, 24, 20], [0.6, 30, 16], [0.65, 42, 24], [0.7, 54, 16], [0.75, 66, 24], [0.8, 76, 20], [0.92, 20, 11], [1, 12, 23]] },
        { id: 'b2', kind: 'ball', keys: [[0, 14, 24], [0.5, 14, 24], [0.55, 26, 20], [0.6, 32, 16], [0.65, 44, 24], [0.7, 56, 16], [0.75, 68, 24], [0.8, 78, 21], [0.92, 18, 11], [1, 14, 24]] },
        { id: 'p3', kind: 'player', color: 'red', keys: [[0, 12, 41], [0.05, 24, 44], [0.1, 30, 40], [0.15, 42, 48], [0.2, 54, 40], [0.25, 66, 48], [0.3, 76, 44], [0.42, 20, 35], [0.47, 12, 41], [1, 12, 41]] },
        { id: 'b3', kind: 'ball', keys: [[0, 14, 42], [0.05, 26, 44], [0.1, 32, 40], [0.15, 44, 48], [0.2, 56, 40], [0.25, 68, 48], [0.3, 78, 45], [0.42, 18, 35], [0.47, 14, 42], [1, 14, 42]] },
        { id: 'p4', kind: 'player', color: 'yellow', keys: [[0, 12, 47], [0.5, 12, 47], [0.55, 24, 44], [0.6, 30, 40], [0.65, 42, 48], [0.7, 54, 40], [0.75, 66, 48], [0.8, 76, 44], [0.92, 20, 35], [1, 12, 47]] },
        { id: 'b4', kind: 'ball', keys: [[0, 14, 48], [0.5, 14, 48], [0.55, 26, 44], [0.6, 32, 40], [0.65, 44, 48], [0.7, 56, 40], [0.75, 68, 48], [0.8, 78, 45], [0.92, 18, 35], [1, 14, 48]] }
      ]
    }
  },

  {
    id: 'd-baelle-klauer',
    name: 'Katze und Mäuse',
    short: 'Mäuse dribbeln, Katzen spitzeln Bälle aus dem Feld.',
    materialQty: { huetchen: '4', baelle: '1/Kind', leibchen: '2' },
    venue: ['draussen', 'halle'],
    phase: 'aufwaermen',
    focus: ['ballgefuehl', 'laufen'],
    duration: 8,
    players: [5, 16],
    level: 2,
    material: ['huetchen', 'baelle', 'leibchen'],
    story: 'Die Mäuse haben jede ein Stück Käse (Ball). Die hungrige Katze möchte den Käse aus dem Mäusehaus schießen. Mäuse, passt gut auf euren Käse auf!',
    setup: 'Feld ca. 20 × 20 m mit Hütchen. 1–2 Katzen mit Leibchen ohne Ball, alle anderen Kinder (Mäuse) mit Ball.',
    steps: [
      'Die Mäuse dribbeln im Feld und schützen ihren Ball.',
      'Die Katzen versuchen, Bälle aus dem Feld zu spitzeln.',
      'Wessen Ball rausrollt, holt ihn schnell und dribbelt sofort wieder ins Feld.',
      'Nach ca. 1 Minute werden neue Katzen bestimmt.'
    ],
    tips: [
      'Körper zwischen Katze und Ball bringen.',
      'Kopf hoch – wo ist die Katze gerade?',
      'Katzen: nur den Ball spielen, nicht das Kind.'
    ],
    easier: 'Katze darf den Ball nur antippen (dann muss die Maus einmal um ein Außenhütchen dribbeln).',
    harder: 'Mehr Katzen oder kleineres Feld.',
    animation: {
      loop: 8,
      field: 'rasen',
      objects: [
        { type: 'zone', x: 20, y: 8, w: 60, h: 48, color: 'white' },
        { type: 'cone', x: 20, y: 8, color: 'orange' },
        { type: 'cone', x: 80, y: 8, color: 'orange' },
        { type: 'cone', x: 20, y: 56, color: 'orange' },
        { type: 'cone', x: 80, y: 56, color: 'orange' }
      ],
      actors: [
        { id: 'k', kind: 'player', color: 'orange', label: 'K', keys: [[0, 50, 32], [0.2, 40, 24], [0.35, 34, 22], [0.5, 46, 30], [0.7, 62, 40], [0.85, 60, 30], [1, 50, 32]] },
        { id: 'p1', kind: 'player', color: 'red', keys: [[0, 36, 16], [0.2, 30, 20], [0.35, 31, 22], [0.45, 24, 32], [0.55, 14, 40], [0.65, 15, 38], [0.85, 28, 24], [1, 36, 16]] },
        { id: 'b1', kind: 'ball', keys: [[0, 38, 16], [0.2, 30, 22], [0.35, 31, 24], [0.45, 18, 40], [0.55, 12, 42], [0.65, 17, 38], [0.85, 30, 23], [1, 38, 16]] },
        { id: 'p2', kind: 'player', color: 'blue', keys: [[0, 60, 20], [0.25, 70, 30], [0.5, 60, 46], [0.75, 48, 40], [1, 60, 20]] },
        { id: 'b2', kind: 'ball', keys: [[0, 62, 21], [0.25, 71, 32], [0.5, 58, 47], [0.75, 48, 38], [1, 62, 21]] },
        { id: 'p3', kind: 'player', color: 'yellow', keys: [[0, 40, 46], [0.25, 52, 50], [0.5, 66, 44], [0.75, 72, 30], [1, 40, 46]] },
        { id: 'b3', kind: 'ball', keys: [[0, 42, 47], [0.25, 54, 50], [0.5, 68, 43], [0.75, 72, 28], [1, 42, 47]] },
        { id: 'p4', kind: 'player', color: 'green', keys: [[0, 70, 14], [0.3, 56, 12], [0.6, 74, 20], [1, 70, 14]] },
        { id: 'b4', kind: 'ball', keys: [[0, 68, 14], [0.3, 54, 12], [0.6, 76, 20], [1, 68, 14]] }
      ]
    }
  },

  {
    id: 'd-eichhoernchen',
    name: 'Eichhörnchen sammeln Nüsse',
    short: 'Alle holen Bälle vom Nussbaum und dribbeln sie in ihre Höhle.',
    materialQty: { huetchen: '16', baelle: '10' },
    venue: ['draussen'],
    phase: 'aufwaermen',
    focus: ['ballgefuehl', 'laufen', 'sozial'],
    duration: 8,
    players: [4, 16],
    level: 1,
    material: ['huetchen', 'baelle'],
    story: 'Der Winter kommt! Die Eichhörnchen-Familien müssen alle Nüsse (Bälle) vom großen Nussbaum in der Mitte nach Hause in ihre Höhle bringen.',
    setup: 'Feld ca. 25 × 20 m. In jeder Ecke ein Hütchen-Quadrat (Höhle, ca. 3 × 3 m) in einer Farbe, in der Mitte alle Bälle (Nussbaum).',
    steps: [
      'Die Kinder werden auf 4 Familien (Höhlen) verteilt.',
      'Auf „Los!" läuft jedes Kind zum Nussbaum, holt einen Ball und dribbelt ihn in die eigene Höhle.',
      'Immer nur eine Nuss pro Weg – dann sofort die nächste holen.',
      'Sind alle Nüsse verteilt, wird gezählt. Dann legt der Trainer die Nüsse zurück in die Mitte.'
    ],
    tips: [
      'Ball in der Höhle mit der Sohle stoppen, nicht reinschießen.',
      'Zurück zum Baum ohne Ball sprinten!',
      'Variante „Räuber": Wenn der Baum leer ist, darf man Nüsse aus fremden Höhlen holen.'
    ],
    easier: 'Höhlen näher an den Baum stellen.',
    harder: 'Räuber-Variante mit 2 Minuten Spielzeit; die Familie mit den meisten Nüssen gewinnt.',
    animation: {
      loop: 9,
      field: 'rasen',
      objects: [
        { type: 'zone', x: 6, y: 4, w: 12, h: 12, color: 'red' },
        { type: 'zone', x: 82, y: 4, w: 12, h: 12, color: 'blue' },
        { type: 'zone', x: 6, y: 48, w: 12, h: 12, color: 'yellow' },
        { type: 'zone', x: 82, y: 48, w: 12, h: 12, color: 'green' },
        { type: 'zone', x: 42, y: 24, w: 16, h: 16, color: 'white' },
        { type: 'label', x: 50, y: 21, text: 'Nussbaum' },
        { type: 'cone', x: 6, y: 4, color: 'red' }, { type: 'cone', x: 18, y: 16, color: 'red' },
        { type: 'cone', x: 94, y: 4, color: 'blue' }, { type: 'cone', x: 82, y: 16, color: 'blue' },
        { type: 'cone', x: 6, y: 60, color: 'yellow' }, { type: 'cone', x: 18, y: 48, color: 'yellow' },
        { type: 'cone', x: 94, y: 60, color: 'green' }, { type: 'cone', x: 82, y: 48, color: 'green' }
      ],
      actors: [
        { id: 'p1', kind: 'player', color: 'red', keys: [[0, 14, 12], [0.25, 44, 28], [0.3, 46, 30], [0.6, 16, 13], [0.7, 14, 12], [1, 14, 12]] },
        { id: 'b1', kind: 'ball', keys: [[0, 48, 30], [0.3, 48, 30], [0.6, 18, 14], [0.7, 12, 10], [0.88, 12, 10], [1, 48, 30]] },
        { id: 'p2', kind: 'player', color: 'blue', keys: [[0, 86, 12], [0.25, 56, 28], [0.3, 54, 30], [0.6, 84, 13], [0.7, 86, 12], [1, 86, 12]] },
        { id: 'b2', kind: 'ball', keys: [[0, 52, 30], [0.3, 52, 30], [0.6, 82, 14], [0.7, 88, 10], [0.88, 88, 10], [1, 52, 30]] },
        { id: 'p3', kind: 'player', color: 'yellow', keys: [[0, 14, 52], [0.25, 44, 36], [0.3, 46, 34], [0.6, 16, 51], [0.7, 14, 52], [1, 14, 52]] },
        { id: 'b3', kind: 'ball', keys: [[0, 48, 34], [0.3, 48, 34], [0.6, 18, 50], [0.7, 12, 54], [0.88, 12, 54], [1, 48, 34]] },
        { id: 'p4', kind: 'player', color: 'green', keys: [[0, 86, 52], [0.25, 56, 36], [0.3, 54, 34], [0.6, 84, 51], [0.7, 86, 52], [1, 86, 52]] },
        { id: 'b4', kind: 'ball', keys: [[0, 52, 34], [0.3, 52, 34], [0.6, 82, 50], [0.7, 88, 54], [0.88, 88, 54], [1, 52, 34]] },
        { id: 'c', kind: 'coach', keys: [[0, 50, 46]] }
      ]
    }
  },

  /* =========================================================
   * HAUPTTEIL
   * ========================================================= */

  {
    id: 'd-torschuss-kanone',
    name: 'Torschuss-Kanone',
    short: 'Bis zur Hütchenlinie dribbeln, dann aufs Minitor schießen.',
    materialQty: { minitore: '2', huetchen: '4', baelle: '1/Kind' },
    venue: ['draussen'],
    phase: 'hauptteil',
    focus: ['torschuss', 'ballgefuehl'],
    duration: 12,
    players: [4, 12],
    level: 1,
    material: ['minitore', 'huetchen', 'baelle'],
    story: 'Ihr seid Piraten mit Kanonen-Füßen! Dribbelt zur Schusslinie und feuert die Kanonenkugel ins Piratentor.',
    setup: '2–3 Bahnen nebeneinander, je ein Minitor. Starthütchen ca. 15 m vor dem Tor, Schusslinie (Hütchen) ca. 6 m vor dem Tor. Höchstens 2–3 Kinder pro Bahn, jedes mit Ball.',
    steps: [
      'Das Kind dribbelt vom Starthütchen bis zur Schusslinie.',
      'Dann schießt es aufs Minitor – „Bumm!"',
      'Ball selbst aus dem Tor holen und außen zurück zum Start dribbeln.',
      'Sobald das erste Kind schießt, startet schon das nächste.'
    ],
    tips: [
      'Vor dem Schuss kurz hochschauen: Wo ist das Tor?',
      'Mit dem Spann oder der Innenseite schießen – beides ist super.',
      'Jeder Treffer wird laut gefeiert!'
    ],
    easier: 'Schusslinie näher ans Tor.',
    harder: 'Hütchen in die Torecken stellen, die getroffen werden müssen, oder mit dem schwachen Fuß schießen.',
    animation: {
      loop: 8,
      field: 'rasen',
      objects: [
        { type: 'goal', x: 92, y: 18, rot: 90 },
        { type: 'goal', x: 92, y: 46, rot: 90 },
        { type: 'cone', x: 18, y: 18, color: 'blue' },
        { type: 'cone', x: 18, y: 46, color: 'blue' },
        { type: 'line', x1: 66, y1: 8, x2: 66, y2: 58, dash: true },
        { type: 'cone', x: 66, y: 8, color: 'orange' },
        { type: 'cone', x: 66, y: 32, color: 'orange' },
        { type: 'cone', x: 66, y: 58, color: 'orange' },
        { type: 'label', x: 66, y: 4, text: 'Schusslinie' }
      ],
      actors: [
        { id: 'p1', kind: 'player', color: 'red', keys: [[0, 20, 18], [0.3, 60, 18], [0.4, 66, 18], [0.5, 80, 20], [0.6, 90, 21], [0.8, 50, 26], [0.9, 30, 24], [1, 20, 18]] },
        { id: 'b1', kind: 'ball', keys: [[0, 22, 18], [0.3, 62, 18], [0.4, 93, 18], [0.5, 93, 18], [0.6, 92, 21], [0.8, 48, 26], [0.9, 28, 24], [1, 22, 18]] },
        { id: 'p2', kind: 'player', color: 'blue', keys: [[0, 80, 20], [0.1, 90, 21], [0.3, 50, 26], [0.4, 30, 24], [0.5, 20, 18], [0.8, 60, 18], [0.9, 66, 18], [1, 80, 20]] },
        { id: 'b2', kind: 'ball', keys: [[0, 93, 18], [0.1, 92, 21], [0.3, 48, 26], [0.4, 28, 24], [0.5, 22, 18], [0.8, 62, 18], [0.9, 93, 18], [1, 93, 18]] },
        { id: 'p3', kind: 'player', color: 'yellow', keys: [[0, 20, 46], [0.3, 60, 46], [0.4, 66, 46], [0.5, 80, 48], [0.6, 90, 49], [0.8, 50, 54], [0.9, 30, 52], [1, 20, 46]] },
        { id: 'b3', kind: 'ball', keys: [[0, 22, 46], [0.3, 62, 46], [0.4, 93, 46], [0.5, 93, 46], [0.6, 92, 49], [0.8, 48, 54], [0.9, 28, 52], [1, 22, 46]] },
        { id: 'p4', kind: 'player', color: 'green', keys: [[0, 80, 48], [0.1, 90, 49], [0.3, 50, 54], [0.4, 30, 52], [0.5, 20, 46], [0.8, 60, 46], [0.9, 66, 46], [1, 80, 48]] },
        { id: 'b4', kind: 'ball', keys: [[0, 93, 46], [0.1, 92, 49], [0.3, 48, 54], [0.4, 28, 52], [0.5, 22, 46], [0.8, 62, 46], [0.9, 93, 46], [1, 93, 46]] },
        { id: 'c', kind: 'coach', keys: [[0, 76, 32]] }
      ]
    }
  },

  {
    id: 'd-krokodilfluss',
    name: 'Krokodilfluss',
    short: 'Alle dribbeln über den Fluss, Krokodile spitzeln Bälle weg.',
    materialQty: { huetchen: '8', baelle: '1/Kind', leibchen: '2' },
    venue: ['draussen'],
    phase: 'hauptteil',
    focus: ['ballgefuehl', 'laufen'],
    duration: 10,
    players: [6, 16],
    level: 2,
    material: ['huetchen', 'baelle', 'leibchen'],
    story: 'Die Kinder müssen mit ihrem Schatz (Ball) über den Fluss auf die andere Seite. Doch im Fluss lauern hungrige Krokodile, die nach den Bällen schnappen!',
    setup: 'Feld ca. 25 × 20 m. In der Mitte eine ca. 6 m breite Flusszone mit Hütchen markieren. 2 Krokodile (Leibchen, ohne Ball) im Fluss, alle anderen Kinder mit Ball auf einer Seite.',
    steps: [
      'Auf „Krokodil, Krokodil, wie tief ist der Fluss?" dribbeln alle gleichzeitig los.',
      'Die Krokodile dürfen nur im Fluss Bälle wegspitzeln.',
      'Wer es ans andere Ufer schafft, ist sicher. Dann geht es zurück.',
      'Wer seinen Ball verliert, holt ihn und versucht es erneut – oder wird nach 3 Runden selbst Krokodil.'
    ],
    tips: [
      'Mit Tempo und Richtungswechsel am Krokodil vorbei.',
      'Ball eng führen, wenn das Krokodil nah ist.',
      'Lücken suchen: Wo ist gerade kein Krokodil?'
    ],
    easier: 'Nur 1 Krokodil, breiterer Fluss-Übergang.',
    harder: 'Krokodile dürfen den ganzen Fluss nutzen und auch die Ufer kurz betreten; Fluss breiter machen.',
    animation: {
      loop: 9,
      field: 'rasen',
      objects: [
        { type: 'zone', x: 40, y: 4, w: 20, h: 56, color: 'blue' },
        { type: 'cone', x: 10, y: 4, color: 'orange' }, { type: 'cone', x: 90, y: 4, color: 'orange' },
        { type: 'cone', x: 10, y: 60, color: 'orange' }, { type: 'cone', x: 90, y: 60, color: 'orange' },
        { type: 'cone', x: 40, y: 4, color: 'blue' }, { type: 'cone', x: 60, y: 4, color: 'blue' },
        { type: 'cone', x: 40, y: 60, color: 'blue' }, { type: 'cone', x: 60, y: 60, color: 'blue' },
        { type: 'label', x: 50, y: 32, text: 'Fluss' }
      ],
      actors: [
        { id: 'k1', kind: 'player', color: 'green', label: 'K', keys: [[0, 50, 12], [0.25, 46, 22], [0.5, 54, 14], [0.75, 46, 26], [1, 50, 12]] },
        { id: 'k2', kind: 'player', color: 'green', label: 'K', keys: [[0, 50, 50], [0.25, 54, 40], [0.5, 46, 50], [0.75, 54, 38], [1, 50, 50]] },
        { id: 'p1', kind: 'player', color: 'red', keys: [[0, 15, 12], [0.15, 36, 12], [0.3, 64, 8], [0.45, 85, 12], [0.55, 85, 12], [0.7, 64, 16], [0.85, 36, 10], [1, 15, 12]] },
        { id: 'b1', kind: 'ball', keys: [[0, 17, 12], [0.15, 38, 12], [0.3, 66, 8], [0.45, 87, 12], [0.55, 83, 12], [0.7, 62, 16], [0.85, 34, 10], [1, 17, 12]] },
        { id: 'p2', kind: 'player', color: 'blue', keys: [[0, 15, 26], [0.15, 36, 26], [0.3, 64, 30], [0.45, 85, 26], [0.55, 85, 26], [0.7, 64, 22], [0.85, 36, 28], [1, 15, 26]] },
        { id: 'b2', kind: 'ball', keys: [[0, 17, 26], [0.15, 38, 26], [0.3, 66, 30], [0.45, 87, 26], [0.55, 83, 26], [0.7, 62, 22], [0.85, 34, 28], [1, 17, 26]] },
        { id: 'p3', kind: 'player', color: 'yellow', keys: [[0, 15, 40], [0.15, 36, 40], [0.3, 64, 36], [0.45, 85, 40], [0.55, 85, 40], [0.7, 64, 44], [0.85, 36, 38], [1, 15, 40]] },
        { id: 'b3', kind: 'ball', keys: [[0, 17, 40], [0.15, 38, 40], [0.3, 66, 36], [0.45, 87, 40], [0.55, 83, 40], [0.7, 62, 44], [0.85, 34, 38], [1, 17, 40]] },
        { id: 'p4', kind: 'player', color: 'purple', keys: [[0, 15, 54], [0.15, 36, 54], [0.3, 64, 58], [0.45, 85, 54], [0.55, 85, 54], [0.7, 64, 50], [0.85, 36, 56], [1, 15, 54]] },
        { id: 'b4', kind: 'ball', keys: [[0, 17, 54], [0.15, 38, 54], [0.3, 66, 58], [0.45, 87, 54], [0.55, 83, 54], [0.7, 62, 50], [0.85, 34, 56], [1, 17, 54]] }
      ]
    }
  },

  {
    id: 'd-pass-tore',
    name: 'Briefträger-Pässe',
    short: 'Paare passen sich durch ein Hütchentor, dann Tor wechseln.',
    materialQty: { huetchen: '8', baelle: '1/Paar' },
    venue: ['draussen', 'halle'],
    phase: 'hauptteil',
    focus: ['ballgefuehl', 'sozial'],
    duration: 10,
    players: [4, 16],
    level: 2,
    material: ['huetchen', 'baelle'],
    story: 'Ihr seid Briefträger-Paare! Der Brief (Ball) muss durch den Briefkasten (Hütchentor) zum Partner. Nach drei Briefen zieht ihr zum nächsten Briefkasten weiter.',
    setup: 'Feld ca. 25 × 20 m mit vielen Hütchentoren (ca. 1,5 m breit). Immer 2 Kinder mit einem Ball bilden ein Paar.',
    steps: [
      'Die Partner stellen sich ca. 4–5 m entfernt beidseits eines Tores auf.',
      'Sie passen sich den Ball mit der Innenseite durch das Tor zu.',
      'Ball annehmen (stoppen), dann zurückpassen.',
      'Nach 3 gelungenen Pässen gemeinsam zum nächsten freien Tor laufen.'
    ],
    tips: [
      'Mit der Innenseite schieben – wie mit einem Schläger.',
      'Standbein zeigt zum Partner.',
      'Partner ruft den Namen: „Hier, Mia!"'
    ],
    easier: 'Abstand verkürzen, Tore breiter.',
    harder: 'Direkt zurückpassen oder nach dem Pass einmal um das Tor herumlaufen.',
    animation: {
      loop: 7,
      field: 'rasen',
      objects: [
        { type: 'cone', x: 35, y: 17, color: 'yellow' }, { type: 'cone', x: 35, y: 23, color: 'yellow' },
        { type: 'cone', x: 70, y: 41, color: 'yellow' }, { type: 'cone', x: 70, y: 47, color: 'yellow' },
        { type: 'cone', x: 70, y: 13, color: 'yellow' }, { type: 'cone', x: 70, y: 19, color: 'yellow' },
        { type: 'cone', x: 30, y: 43, color: 'yellow' }, { type: 'cone', x: 30, y: 49, color: 'yellow' },
        { type: 'cone', x: 50, y: 29, color: 'yellow' }, { type: 'cone', x: 50, y: 35, color: 'yellow' }
      ],
      actors: [
        { id: 'p1', kind: 'player', color: 'red', keys: [[0, 25, 20], [0.3, 24, 21], [0.5, 25, 20], [0.8, 24, 19], [1, 25, 20]] },
        { id: 'p2', kind: 'player', color: 'red', keys: [[0, 46, 20], [0.15, 45, 20], [0.3, 46, 21], [0.65, 45, 20], [0.8, 46, 19], [1, 46, 20]] },
        { id: 'b1', kind: 'ball', keys: [[0, 27, 20], [0.15, 43, 20], [0.25, 43, 20], [0.4, 27, 20], [0.5, 27, 20], [0.65, 43, 20], [0.75, 43, 20], [0.9, 27, 20], [1, 27, 20]] },
        { id: 'p3', kind: 'player', color: 'blue', keys: [[0, 59, 44], [0.15, 60, 44], [0.3, 59, 45], [0.65, 60, 44], [0.8, 59, 43], [1, 59, 44]] },
        { id: 'p4', kind: 'player', color: 'blue', keys: [[0, 81, 44], [0.3, 80, 45], [0.5, 81, 44], [0.8, 80, 43], [1, 81, 44]] },
        { id: 'b2', kind: 'ball', keys: [[0, 61, 44], [0.1, 61, 44], [0.25, 78, 44], [0.35, 78, 44], [0.5, 61, 44], [0.6, 61, 44], [0.75, 78, 44], [0.85, 78, 44], [1, 61, 44]] },
        { id: 'p5', kind: 'player', color: 'yellow', keys: [[0, 50, 22], [0.5, 50, 23], [1, 50, 22]] },
        { id: 'p6', kind: 'player', color: 'yellow', keys: [[0, 50, 42], [0.5, 50, 41], [1, 50, 42]] },
        { id: 'b3', kind: 'ball', keys: [[0, 50, 24], [0.2, 50, 40], [0.3, 50, 40], [0.5, 50, 24], [0.7, 50, 40], [0.8, 50, 40], [1, 50, 24]] }
      ]
    }
  },

  {
    id: 'd-1gegen1-minitore',
    name: 'Ritterduell 1:1',
    short: '1 gegen 1 auf zwei Minitore, nach jedem Tor Rollen tauschen.',
    materialQty: { minitore: '2', huetchen: '4', baelle: '6', leibchen: '2' },
    venue: ['draussen'],
    phase: 'hauptteil',
    focus: ['ballgefuehl', 'torschuss'],
    duration: 12,
    players: [4, 12],
    level: 2,
    material: ['minitore', 'huetchen', 'baelle', 'leibchen'],
    story: 'Zwei Ritter treffen sich zum Duell. Jeder verteidigt seine Burg (Minitor) und versucht, den Ball in die Burg des anderen zu schießen.',
    setup: 'Mehrere kleine Felder (ca. 12 × 8 m) nebeneinander, auf jeder Grundlinie ein Minitor. 2 Kinder pro Feld, Ersatzbälle neben den Toren.',
    steps: [
      'Ein Kind startet mit Ball an der eigenen Torlinie.',
      'Es dribbelt Richtung gegnerisches Tor und versucht zu treffen.',
      'Nach einem Tor oder Aus holt das andere Kind den Ball und greift an.',
      'Nach 1 Minute Pause – dann wechseln die Paare die Felder.'
    ],
    tips: [
      'Mit Tempo auf den Gegner zu, dann Haken schlagen.',
      'Als Verteidiger: auf den Ball schauen, nicht auf die Füße.',
      'Kurze Duelle, viele Pausen – Bambini brauchen Erholung.'
    ],
    easier: 'Größere Tore oder Hütchentore verwenden.',
    harder: 'Tor zählt nur aus der vorderen Hälfte des Feldes oder mit dem schwachen Fuß doppelt.',
    animation: {
      loop: 8,
      field: 'rasen',
      objects: [
        { type: 'zone', x: 8, y: 6, w: 84, h: 22, color: 'white' },
        { type: 'zone', x: 8, y: 36, w: 84, h: 22, color: 'white' },
        { type: 'goal', x: 8, y: 17, rot: 270 },
        { type: 'goal', x: 92, y: 17, rot: 90 },
        { type: 'goal', x: 8, y: 47, rot: 270 },
        { type: 'goal', x: 92, y: 47, rot: 90 },
        { type: 'cone', x: 8, y: 6, color: 'orange' }, { type: 'cone', x: 92, y: 6, color: 'orange' },
        { type: 'cone', x: 8, y: 28, color: 'orange' }, { type: 'cone', x: 92, y: 28, color: 'orange' },
        { type: 'cone', x: 8, y: 36, color: 'orange' }, { type: 'cone', x: 92, y: 36, color: 'orange' },
        { type: 'cone', x: 8, y: 58, color: 'orange' }, { type: 'cone', x: 92, y: 58, color: 'orange' }
      ],
      actors: [
        { id: 'r1', kind: 'player', color: 'red', keys: [[0, 14, 17], [0.1, 30, 17], [0.25, 50, 13], [0.32, 58, 20], [0.4, 70, 19], [0.5, 75, 19], [0.6, 60, 16], [0.72, 48, 18], [0.8, 40, 14], [0.9, 16, 15], [0.95, 11, 16], [1, 14, 17]] },
        { id: 'u1', kind: 'player', color: 'blue', keys: [[0, 62, 17], [0.25, 54, 15], [0.32, 54, 15], [0.4, 64, 18], [0.5, 88, 17], [0.6, 70, 15], [0.72, 50, 20], [0.8, 34, 16], [0.9, 40, 17], [1, 62, 17]] },
        { id: 'ba', kind: 'ball', keys: [[0, 16, 17], [0.1, 32, 17], [0.25, 52, 13], [0.32, 60, 20], [0.4, 72, 19], [0.45, 93, 17], [0.5, 90, 17], [0.6, 68, 15], [0.72, 48, 20], [0.8, 32, 16], [0.86, 7, 17], [0.9, 7, 17], [0.95, 12, 16], [1, 16, 17]] },
        { id: 'r2', kind: 'player', color: 'yellow', keys: [[0, 14, 47], [0.1, 30, 47], [0.25, 50, 43], [0.32, 58, 50], [0.4, 70, 49], [0.5, 75, 49], [0.6, 60, 46], [0.72, 48, 48], [0.8, 40, 44], [0.9, 16, 45], [0.95, 11, 46], [1, 14, 47]] },
        { id: 'u2', kind: 'player', color: 'green', keys: [[0, 62, 47], [0.25, 54, 45], [0.32, 54, 45], [0.4, 64, 48], [0.5, 88, 47], [0.6, 70, 45], [0.72, 50, 50], [0.8, 34, 46], [0.9, 40, 47], [1, 62, 47]] },
        { id: 'bb', kind: 'ball', keys: [[0, 16, 47], [0.1, 32, 47], [0.25, 52, 43], [0.32, 60, 50], [0.4, 72, 49], [0.45, 93, 47], [0.5, 90, 47], [0.6, 68, 45], [0.72, 48, 50], [0.8, 32, 46], [0.86, 7, 47], [0.9, 7, 47], [0.95, 12, 46], [1, 16, 47]] }
      ]
    }
  },

  {
    id: 'd-slalom-schuss',
    name: 'Slalom und Schuss',
    short: 'Durch den Stangenslalom dribbeln, dann sofort aufs Minitor.',
    materialQty: { stangen: '4', minitore: '1', baelle: '1/Kind', huetchen: '1' },
    venue: ['draussen'],
    phase: 'hauptteil',
    focus: ['ballgefuehl', 'torschuss', 'koordination'],
    duration: 12,
    players: [4, 12],
    level: 2,
    material: ['stangen', 'minitore', 'baelle', 'huetchen'],
    story: 'Ein Fußballstar dribbelt durch die ganze Abwehr (Stangen) und schießt dann das Tor des Jahres!',
    setup: '2–3 Bahnen nebeneinander: Starthütchen, 4 Stangen im Abstand von ca. 2 m, danach ein Minitor in ca. 8 m Entfernung. Höchstens 2–3 Kinder pro Bahn, alle mit Ball.',
    steps: [
      'Das Kind dribbelt im Slalom durch die Stangen.',
      'Nach der letzten Stange schießt es sofort aufs Minitor.',
      'Ball holen und außen zurück zum Start dribbeln.',
      'Das nächste Kind startet, sobald das erste aus dem Slalom heraus ist.'
    ],
    tips: [
      'Im Slalom kleine Ballkontakte, danach den Ball zum Schuss vorlegen.',
      'Beim Schuss auf den Ball schauen, danach jubeln!',
      'Wer zurückdribbelt, bleibt außen – kein Zusammenstoß.'
    ],
    easier: 'Nur 2–3 Stangen, größerer Abstand.',
    harder: 'Ein Kind steht als Torwart im Tor oder zwei Hütchen markieren die Ecken, die getroffen werden sollen.',
    animation: {
      loop: 9,
      field: 'rasen',
      objects: [
        { type: 'cone', x: 12, y: 18, color: 'blue' },
        { type: 'pole', x: 25, y: 18 }, { type: 'pole', x: 35, y: 18 }, { type: 'pole', x: 45, y: 18 }, { type: 'pole', x: 55, y: 18 },
        { type: 'goal', x: 92, y: 18, rot: 90 },
        { type: 'cone', x: 12, y: 44, color: 'blue' },
        { type: 'pole', x: 25, y: 44 }, { type: 'pole', x: 35, y: 44 }, { type: 'pole', x: 45, y: 44 }, { type: 'pole', x: 55, y: 44 },
        { type: 'goal', x: 92, y: 44, rot: 90 }
      ],
      actors: [
        { id: 'p1', kind: 'player', color: 'red', keys: [[0, 12, 18], [0.08, 25, 14], [0.16, 35, 22], [0.24, 45, 14], [0.32, 55, 22], [0.4, 64, 18], [0.5, 78, 20], [0.6, 90, 22], [0.8, 50, 28], [0.9, 25, 27], [1, 12, 18]] },
        { id: 'b1', kind: 'ball', keys: [[0, 14, 18], [0.08, 27, 14], [0.16, 37, 22], [0.24, 47, 14], [0.32, 57, 22], [0.4, 66, 18], [0.46, 93, 18], [0.5, 93, 18], [0.6, 91, 22], [0.8, 48, 28], [0.9, 23, 27], [1, 14, 18]] },
        { id: 'p2', kind: 'player', color: 'blue', keys: [[0, 78, 20], [0.1, 90, 22], [0.3, 50, 28], [0.4, 25, 27], [0.5, 12, 18], [0.58, 25, 14], [0.66, 35, 22], [0.74, 45, 14], [0.82, 55, 22], [0.9, 64, 18], [1, 78, 20]] },
        { id: 'b2', kind: 'ball', keys: [[0, 93, 18], [0.1, 91, 22], [0.3, 48, 28], [0.4, 23, 27], [0.5, 14, 18], [0.58, 27, 14], [0.66, 37, 22], [0.74, 47, 14], [0.82, 57, 22], [0.9, 66, 18], [0.96, 93, 18], [1, 93, 18]] },
        { id: 'p3', kind: 'player', color: 'yellow', keys: [[0, 12, 44], [0.08, 25, 40], [0.16, 35, 48], [0.24, 45, 40], [0.32, 55, 48], [0.4, 64, 44], [0.5, 78, 46], [0.6, 90, 48], [0.8, 50, 54], [0.9, 25, 53], [1, 12, 44]] },
        { id: 'b3', kind: 'ball', keys: [[0, 14, 44], [0.08, 27, 40], [0.16, 37, 48], [0.24, 47, 40], [0.32, 57, 48], [0.4, 66, 44], [0.46, 93, 44], [0.5, 93, 44], [0.6, 91, 48], [0.8, 48, 54], [0.9, 23, 53], [1, 14, 44]] },
        { id: 'p4', kind: 'player', color: 'green', keys: [[0, 78, 46], [0.1, 90, 48], [0.3, 50, 54], [0.4, 25, 53], [0.5, 12, 44], [0.58, 25, 40], [0.66, 35, 48], [0.74, 45, 40], [0.82, 55, 48], [0.9, 64, 44], [1, 78, 46]] },
        { id: 'b4', kind: 'ball', keys: [[0, 93, 44], [0.1, 91, 48], [0.3, 48, 54], [0.4, 23, 53], [0.5, 14, 44], [0.58, 27, 40], [0.66, 37, 48], [0.74, 47, 40], [0.82, 57, 48], [0.9, 66, 44], [0.96, 93, 44], [1, 93, 44]] }
      ]
    }
  },

  {
    id: 'd-wettlauf-duell',
    name: 'Wer ist zuerst am Ball?',
    short: 'Trainer rollt den Ball, zwei Kinder sprinten, wer zuerst trifft.',
    materialQty: { minitore: '2', baelle: '10', huetchen: '4', leibchen: '2' },
    venue: ['draussen'],
    phase: 'hauptteil',
    focus: ['laufen', 'torschuss', 'ballgefuehl'],
    duration: 10,
    players: [4, 12],
    level: 3,
    material: ['minitore', 'baelle', 'huetchen', 'leibchen'],
    story: 'Der Trainer ist der Ballzauberer: Er zaubert einen Ball aufs Feld. Zwei Kinder flitzen los – wer zuerst am Ball ist, wird Stürmer, das andere Kind verteidigt.',
    setup: 'Feld ca. 25 × 15 m, an beiden Enden ein Minitor. Der Trainer steht mit vielen Bällen in der Mitte. Zwei Paare starten gleichzeitig – eins Richtung linkes, eins Richtung rechtes Tor.',
    steps: [
      'Je 2 Kinder stehen neben dem Trainer, Blick zu ihrem Tor.',
      'Der Trainer rollt den Ball Richtung Tor.',
      'Beide sprinten los: Wer den Ball zuerst hat, greift an, das andere Kind verteidigt (1:1).',
      'Nach Tor oder Aus bringen beide den Ball zurück – das nächste Paar ist sofort dran.'
    ],
    tips: [
      'Bereit-Stellung: leicht in den Knien, Blick zum Ball.',
      'Wer verliert, gibt nicht auf – sofort verteidigen!',
      'Kleine Gruppen (max. 3 Paare pro Tor), damit niemand lange wartet.'
    ],
    easier: 'Trainer rollt den Ball langsam und näher an ein Kind heran.',
    harder: 'Startposition im Sitzen oder Bauchlage; danach 2:2 statt 1:1.',
    animation: {
      loop: 9,
      field: 'rasen',
      objects: [
        { type: 'goal', x: 8, y: 32, rot: 270 },
        { type: 'goal', x: 92, y: 32, rot: 90 },
        { type: 'cone', x: 8, y: 14, color: 'orange' }, { type: 'cone', x: 92, y: 14, color: 'orange' },
        { type: 'cone', x: 8, y: 50, color: 'orange' }, { type: 'cone', x: 92, y: 50, color: 'orange' },
        { type: 'line', x1: 50, y1: 14, x2: 50, y2: 50, dash: true }
      ],
      actors: [
        { id: 'c', kind: 'coach', keys: [[0, 50, 32]] },
        { id: 'a1', kind: 'player', color: 'red', keys: [[0, 52, 27], [0.28, 74, 28], [0.38, 80, 31], [0.45, 82, 32], [0.55, 86, 30], [0.75, 66, 28], [1, 52, 27]] },
        { id: 'a2', kind: 'player', color: 'blue', keys: [[0, 52, 37], [0.28, 70, 35], [0.38, 78, 35], [0.45, 82, 35], [0.55, 88, 34], [0.75, 66, 36], [0.92, 56, 35], [1, 52, 37]] },
        { id: 'ba', kind: 'ball', keys: [[0, 53, 31], [0.25, 74, 30], [0.28, 76, 29], [0.38, 82, 31], [0.45, 84, 32], [0.5, 93, 32], [0.55, 90, 33], [0.75, 68, 36], [0.92, 57, 34], [1, 53, 31]] },
        { id: 'a3', kind: 'player', color: 'yellow', keys: [[0, 48, 27], [0.28, 26, 28], [0.38, 20, 31], [0.45, 18, 32], [0.55, 14, 30], [0.75, 34, 28], [1, 48, 27]] },
        { id: 'a4', kind: 'player', color: 'green', keys: [[0, 48, 37], [0.28, 30, 35], [0.38, 22, 35], [0.45, 18, 35], [0.55, 12, 34], [0.75, 34, 36], [0.92, 44, 35], [1, 48, 37]] },
        { id: 'bb', kind: 'ball', keys: [[0, 47, 31], [0.25, 26, 30], [0.28, 24, 29], [0.38, 18, 31], [0.45, 16, 32], [0.5, 7, 32], [0.55, 10, 33], [0.75, 32, 36], [0.92, 43, 34], [1, 47, 31]] }
      ]
    }
  },

  {
    id: 'd-huetchen-kegeln',
    name: 'Hütchen-Kegeln',
    short: 'Zwei Teams passen von ihren Linien auf Hütchen in der Mitte.',
    materialQty: { huetchen: '8', baelle: '1/Kind' },
    venue: ['draussen', 'halle'],
    phase: 'hauptteil',
    focus: ['torschuss', 'ballgefuehl', 'sozial'],
    duration: 10,
    players: [4, 16],
    level: 1,
    material: ['huetchen', 'baelle'],
    story: 'Wir gehen kegeln! In der Mitte stehen die Kegel (Hütchen). Beide Teams versuchen, mit gezielten Pässen möglichst viele Kegel umzuschießen.',
    setup: 'Feld ca. 20 × 15 m. In der Mitte eine Reihe mit 5–8 Hütchen. Zwei Teams stehen sich an den Grundlinien gegenüber (Abstand je ca. 6–8 m zur Mitte), viele Bälle.',
    steps: [
      'Jedes Kind passt von seiner Linie aus auf die Hütchen in der Mitte.',
      'Bälle, die durchrollen, nimmt das andere Team an und passt zurück.',
      'Umgefallene Hütchen bleiben liegen – zählt am Ende, wer mehr Kegel auf der gegnerischen Seite liegen hat.',
      'Hütchen wieder aufstellen und neue Runde.'
    ],
    tips: [
      'Mit der Innenseite zielen – Fuß zeigt aufs Hütchen.',
      'Ball erst stoppen, dann zielen.',
      'Niemand läuft in die Mitte, solange geschossen wird!'
    ],
    easier: 'Abstand zur Mitte verkürzen, größere Hütchen oder Bälle als Ziele.',
    harder: 'Nur mit dem schwachen Fuß oder direkt aus dem Lauf passen.',
    animation: {
      loop: 7,
      field: 'rasen',
      objects: [
        { type: 'cone', x: 50, y: 12, color: 'yellow' },
        { type: 'cone', x: 50, y: 22, color: 'yellow' },
        { type: 'cone', x: 50, y: 32, color: 'yellow' },
        { type: 'cone', x: 50, y: 42, color: 'yellow' },
        { type: 'cone', x: 50, y: 52, color: 'yellow' },
        { type: 'line', x1: 20, y1: 8, x2: 20, y2: 56, dash: true },
        { type: 'line', x1: 80, y1: 8, x2: 80, y2: 56, dash: true }
      ],
      actors: [
        { id: 'r1', kind: 'player', color: 'red', keys: [[0, 26, 16], [0.15, 23, 16], [0.65, 24, 16], [0.75, 25, 16], [1, 26, 16]] },
        { id: 'u1', kind: 'player', color: 'blue', keys: [[0, 77, 26], [0.2, 75, 26], [0.45, 76, 26], [0.55, 74, 26], [1, 77, 26]] },
        { id: 'b1', kind: 'ball', keys: [[0, 27, 16], [0.2, 73, 26], [0.5, 73, 26], [0.7, 27, 16], [1, 27, 16]] },
        { id: 'r2', kind: 'player', color: 'red', keys: [[0, 25, 32], [0.15, 25, 32], [0.2, 26, 32], [0.85, 25, 32], [1, 25, 32]] },
        { id: 'u2', kind: 'player', color: 'blue', keys: [[0, 75, 32], [0.35, 75, 32], [0.6, 76, 32], [0.65, 74, 32], [1, 75, 32]] },
        { id: 'b2', kind: 'ball', keys: [[0, 27, 32], [0.15, 27, 32], [0.35, 73, 32], [0.65, 73, 32], [0.85, 27, 32], [1, 27, 32]] },
        { id: 'r3', kind: 'player', color: 'red', keys: [[0, 24, 48], [0.2, 25, 48], [0.45, 24, 48], [0.55, 26, 48], [1, 24, 48]] },
        { id: 'u3', kind: 'player', color: 'blue', keys: [[0, 74, 38], [0.15, 77, 38], [0.65, 76, 38], [0.75, 75, 38], [1, 74, 38]] },
        { id: 'b3', kind: 'ball', keys: [[0, 73, 38], [0.2, 27, 48], [0.5, 27, 48], [0.7, 73, 38], [1, 73, 38]] }
      ]
    }
  },

  {
    id: 'd-fussball-golf',
    name: 'Fußball-Golf',
    short: 'Ball mit wenigen Pässen durch drei Hütchentore ins Minitor.',
    materialQty: { huetchen: '7', baelle: '1/Kind', minitore: '1' },
    venue: ['draussen'],
    phase: 'hauptteil',
    focus: ['ballgefuehl', 'torschuss', 'koordination'],
    duration: 12,
    players: [4, 12],
    level: 2,
    material: ['huetchen', 'baelle', 'minitore'],
    story: 'Wir spielen Golf – aber mit den Füßen! Der Ball muss durch alle Golflöcher (Hütchentore) bis ins Ziel-Loch (Minitor). Wer braucht die wenigsten Schüsse?',
    setup: 'Auf ca. 30 × 20 m einen Parcours mit 3 nummerierten Hütchentoren (ca. 2 m breit) und einem Minitor als letztem Loch aufbauen. Jedes Kind hat einen Ball, Start versetzt.',
    steps: [
      'Jedes Kind passt seinen Ball Richtung Tor 1 und läuft hinterher.',
      'Der Ball muss durch alle Tore der Reihe nach, zum Schluss ins Minitor.',
      'Jeder Schuss wird laut mitgezählt.',
      'Wer fertig ist, dribbelt zum Start und versucht, den eigenen Rekord zu brechen.'
    ],
    tips: [
      'Lieber zwei kleine Pässe als ein riesiger Schuss daneben.',
      'Vor jedem Pass kurz zielen: Wo ist das nächste Tor?',
      'Mit Abstand starten, damit sich niemand in die Quere kommt.'
    ],
    easier: 'Tore breiter und näher zusammen, Zählen weglassen.',
    harder: 'Mehr Tore, Tore schmaler oder nur mit dem schwachen Fuß spielen.',
    animation: {
      loop: 10,
      field: 'rasen',
      objects: [
        { type: 'cone', x: 10, y: 56, color: 'white' },
        { type: 'label', x: 10, y: 61, text: 'Start' },
        { type: 'cone', x: 31, y: 42, color: 'red' }, { type: 'cone', x: 29, y: 50, color: 'red' },
        { type: 'label', x: 36, y: 50, text: '1' },
        { type: 'cone', x: 44, y: 24, color: 'blue' }, { type: 'cone', x: 50, y: 20, color: 'blue' },
        { type: 'label', x: 52, y: 26, text: '2' },
        { type: 'cone', x: 70, y: 35, color: 'yellow' }, { type: 'cone', x: 72, y: 43, color: 'yellow' },
        { type: 'label', x: 76, y: 40, text: '3' },
        { type: 'goal', x: 92, y: 12, rot: 90 }
      ],
      actors: [
        { id: 'p1', kind: 'player', color: 'red', keys: [[0, 10, 56], [0.15, 30, 46], [0.25, 41, 33], [0.3, 46, 26], [0.45, 70, 39], [0.5, 76, 31], [0.6, 88, 14], [0.75, 60, 49], [0.8, 50, 60], [1, 10, 56]] },
        { id: 'b1', kind: 'ball', keys: [[0, 12, 55], [0.1, 32, 45], [0.15, 32, 45], [0.25, 47, 24], [0.3, 47, 24], [0.4, 71, 37], [0.45, 71, 37], [0.5, 82, 25], [0.55, 93, 12], [0.6, 90, 14], [0.75, 62, 49], [0.8, 52, 60], [1, 12, 55]] },
        { id: 'p2', kind: 'player', color: 'yellow', keys: [[0, 41, 33], [0.05, 46, 26], [0.2, 70, 39], [0.25, 76, 31], [0.35, 88, 14], [0.5, 60, 49], [0.55, 50, 60], [0.75, 10, 56], [0.9, 30, 46], [1, 41, 33]] },
        { id: 'b2', kind: 'ball', keys: [[0, 47, 24], [0.05, 47, 24], [0.15, 71, 37], [0.2, 71, 37], [0.25, 82, 25], [0.3, 93, 12], [0.35, 90, 14], [0.5, 62, 49], [0.55, 52, 60], [0.75, 12, 55], [0.85, 32, 45], [0.9, 32, 45], [1, 47, 24]] },
        { id: 'p3', kind: 'player', color: 'blue', keys: [[0, 76, 31], [0.1, 88, 14], [0.25, 60, 49], [0.3, 50, 60], [0.5, 10, 56], [0.65, 30, 46], [0.75, 41, 33], [0.8, 46, 26], [0.95, 70, 39], [1, 76, 31]] },
        { id: 'b3', kind: 'ball', keys: [[0, 82, 25], [0.05, 93, 12], [0.1, 90, 14], [0.25, 62, 49], [0.3, 52, 60], [0.5, 12, 55], [0.6, 32, 45], [0.65, 32, 45], [0.75, 47, 24], [0.8, 47, 24], [0.9, 71, 37], [0.95, 71, 37], [1, 82, 25]] },
        { id: 'p4', kind: 'player', color: 'green', keys: [[0, 60, 49], [0.05, 50, 60], [0.25, 10, 56], [0.4, 30, 46], [0.5, 41, 33], [0.55, 46, 26], [0.7, 70, 39], [0.75, 76, 31], [0.85, 88, 14], [1, 60, 49]] },
        { id: 'b4', kind: 'ball', keys: [[0, 62, 49], [0.05, 52, 60], [0.25, 12, 55], [0.35, 32, 45], [0.4, 32, 45], [0.5, 47, 24], [0.55, 47, 24], [0.65, 71, 37], [0.7, 71, 37], [0.75, 82, 25], [0.8, 93, 12], [0.85, 90, 14], [1, 62, 49]] }
      ]
    }
  },

  {
    id: 'd-vier-tore-spiel',
    name: 'Tore-Jäger auf 4 Tore',
    short: 'Alle dribbeln zu einem der vier Minitore und schießen.',
    materialQty: { minitore: '4', baelle: '1/Kind', huetchen: '4' },
    venue: ['draussen'],
    phase: 'hauptteil',
    focus: ['torschuss', 'ballgefuehl', 'laufen'],
    duration: 10,
    players: [4, 12],
    level: 1,
    material: ['minitore', 'baelle', 'huetchen'],
    story: 'Ihr seid Tore-Jäger! Auf jeder Seite des Feldes wartet ein Tor. Jedes Kind dribbelt mit seinem Ball los und schießt in so viele verschiedene Tore wie möglich.',
    setup: 'Feld ca. 20 × 20 m, an jeder Seite ein Minitor (insgesamt 4). Jedes Kind hat einen Ball.',
    steps: [
      'Alle starten mit Ball in der Mitte.',
      'Auf „Los!" dribbelt jedes Kind zu einem Tor und schießt aus kurzer Distanz.',
      'Ball holen und zum nächsten, anderen Tor dribbeln.',
      'Wer schafft in 1 Minute alle 4 Tore? Danach Pause und neue Runde.'
    ],
    tips: [
      'Immer ein anderes Tor wählen – wo ist gerade wenig los?',
      'Kurz vor dem Tor den Kopf heben und zielen.',
      'Viele kleine Kontakte beim Dribbeln, ein fester Schuss am Ende.'
    ],
    easier: 'Tore größer oder Schussabstand kürzer.',
    harder: 'Rechter Fuß nur in 2 Tore, linker Fuß in die anderen 2; oder Tore mit Hütchen-Schusslinie (4 m).',
    animation: {
      loop: 9,
      field: 'rasen',
      objects: [
        { type: 'goal', x: 50, y: 4, rot: 0 },
        { type: 'goal', x: 50, y: 60, rot: 180 },
        { type: 'goal', x: 6, y: 32, rot: 270 },
        { type: 'goal', x: 94, y: 32, rot: 90 },
        { type: 'cone', x: 10, y: 6, color: 'orange' }, { type: 'cone', x: 90, y: 6, color: 'orange' },
        { type: 'cone', x: 10, y: 58, color: 'orange' }, { type: 'cone', x: 90, y: 58, color: 'orange' }
      ],
      actors: [
        { id: 'p1', kind: 'player', color: 'red', keys: [[0, 40, 28], [0.2, 78, 30], [0.3, 88, 32], [0.5, 58, 16], [0.6, 50, 9], [0.8, 42, 22], [1, 40, 28]] },
        { id: 'b1', kind: 'ball', keys: [[0, 42, 28], [0.2, 80, 31], [0.24, 95, 32], [0.3, 90, 32], [0.5, 56, 15], [0.54, 50, 3], [0.6, 50, 7], [0.8, 41, 24], [1, 42, 28]] },
        { id: 'p2', kind: 'player', color: 'blue', keys: [[0, 60, 36], [0.2, 22, 33], [0.3, 12, 32], [0.5, 42, 48], [0.6, 50, 55], [0.8, 58, 42], [1, 60, 36]] },
        { id: 'b2', kind: 'ball', keys: [[0, 58, 36], [0.2, 20, 33], [0.24, 5, 32], [0.3, 10, 32], [0.5, 44, 50], [0.54, 50, 61], [0.6, 50, 57], [0.8, 59, 40], [1, 58, 36]] },
        { id: 'p3', kind: 'player', color: 'yellow', keys: [[0, 50, 22], [0.2, 50, 13], [0.3, 50, 9], [0.5, 24, 26], [0.6, 13, 30], [0.8, 36, 26], [1, 50, 22]] },
        { id: 'b3', kind: 'ball', keys: [[0, 50, 20], [0.2, 50, 11], [0.24, 50, 3], [0.3, 50, 7], [0.5, 22, 27], [0.54, 5, 31], [0.6, 10, 31], [0.8, 38, 25], [1, 50, 20]] },
        { id: 'p4', kind: 'player', color: 'green', keys: [[0, 52, 42], [0.2, 50, 51], [0.3, 50, 55], [0.5, 76, 38], [0.6, 88, 33], [0.8, 66, 40], [1, 52, 42]] },
        { id: 'b4', kind: 'ball', keys: [[0, 52, 44], [0.2, 50, 53], [0.24, 50, 61], [0.3, 50, 57], [0.5, 78, 37], [0.54, 95, 33], [0.6, 90, 33], [0.8, 64, 41], [1, 52, 44]] }
      ]
    }
  },

  {
    id: 'd-doppelpass-tor',
    name: 'Doppelpass-Zauber',
    short: 'Paare spielen Doppelpass bis vors Minitor, dann Schuss.',
    materialQty: { minitore: '1', huetchen: '2', baelle: '1/Paar' },
    venue: ['draussen'],
    phase: 'hauptteil',
    focus: ['torschuss', 'sozial', 'ballgefuehl'],
    duration: 12,
    players: [4, 12],
    level: 3,
    material: ['minitore', 'huetchen', 'baelle'],
    story: 'Zwei Freunde zaubern zusammen: Pass hin, Pass zurück – und schon ist der Ball im Tor! Wie die großen Profis.',
    setup: '2 Bahnen (ca. 20 × 10 m) nebeneinander, am Ende je ein Minitor. Immer 2 Kinder als Paar mit einem Ball, 2–3 Paare pro Bahn.',
    steps: [
      'Kind A dribbelt los, Kind B läuft nebenher (ca. 4 m Abstand).',
      'A passt zu B, B passt sofort zurück in den Lauf von A.',
      'A schießt aufs Minitor.',
      'Ball holen, außen zurück – beim nächsten Mal tauschen A und B die Rollen.'
    ],
    tips: [
      'Nach dem Pass weiterlaufen – nicht stehen bleiben!',
      'Den Rückpass nach vorne spielen, dorthin, wo der Partner hinläuft.',
      'Rufen hilft: „Hier!" – „Zurück!"'
    ],
    easier: 'B steht still und legt den Ball nur zurück.',
    harder: 'Ein Verteidiger kommt passiv dazu (2:1) oder der Schuss muss direkt erfolgen.',
    animation: {
      loop: 8,
      field: 'rasen',
      objects: [
        { type: 'goal', x: 92, y: 18, rot: 90 },
        { type: 'goal', x: 92, y: 48, rot: 90 },
        { type: 'cone', x: 14, y: 14, color: 'blue' }, { type: 'cone', x: 14, y: 24, color: 'blue' },
        { type: 'cone', x: 14, y: 44, color: 'blue' }, { type: 'cone', x: 14, y: 54, color: 'blue' },
        { type: 'line', x1: 8, y1: 33, x2: 92, y2: 33, dash: true }
      ],
      actors: [
        { id: 'a1', kind: 'player', color: 'red', label: 'A', keys: [[0, 15, 14], [0.2, 38, 14], [0.3, 50, 12], [0.45, 62, 14], [0.55, 70, 16], [0.65, 88, 16], [0.85, 45, 7], [1, 15, 14]] },
        { id: 'a2', kind: 'player', color: 'red', label: 'B', keys: [[0, 15, 24], [0.2, 36, 24], [0.3, 48, 24], [0.45, 60, 24], [0.55, 68, 24], [0.65, 72, 26], [0.85, 45, 28], [1, 15, 24]] },
        { id: 'ba', kind: 'ball', keys: [[0, 17, 14], [0.2, 40, 14], [0.27, 46, 22], [0.32, 49, 22], [0.42, 62, 14], [0.45, 64, 14], [0.55, 72, 16], [0.6, 93, 18], [0.65, 90, 17], [0.85, 43, 7], [1, 17, 14]] },
        { id: 'c1', kind: 'player', color: 'yellow', label: 'A', keys: [[0, 15, 44], [0.2, 38, 44], [0.3, 50, 42], [0.45, 62, 44], [0.55, 70, 46], [0.65, 88, 46], [0.85, 45, 37], [1, 15, 44]] },
        { id: 'c2', kind: 'player', color: 'yellow', label: 'B', keys: [[0, 15, 54], [0.2, 36, 54], [0.3, 48, 54], [0.45, 60, 54], [0.55, 68, 54], [0.65, 72, 56], [0.85, 45, 58], [1, 15, 54]] },
        { id: 'bb', kind: 'ball', keys: [[0, 17, 44], [0.2, 40, 44], [0.27, 46, 52], [0.32, 49, 52], [0.42, 62, 44], [0.45, 64, 44], [0.55, 72, 46], [0.6, 93, 48], [0.65, 90, 47], [0.85, 43, 37], [1, 17, 44]] }
      ]
    }
  },

  {
    id: 'd-farben-tor',
    name: 'Farbtore-Alarm',
    short: 'Alle dribbeln, auf Farbruf zum passenden Minitor und schießen.',
    materialQty: { minitore: '4', huetchen: '8', baelle: '1/Kind' },
    venue: ['draussen'],
    phase: 'hauptteil',
    focus: ['torschuss', 'koordination', 'ballgefuehl'],
    duration: 10,
    players: [4, 14],
    level: 2,
    material: ['minitore', 'huetchen', 'baelle'],
    story: 'Feuerwehr-Alarm! Alle Feuerwehrautos (Kinder mit Ball) fahren in der Wache herum. Ruft der Trainer eine Farbe, rasen sie zum Tor mit dieser Farbe und löschen das Feuer mit einem Schuss.',
    setup: 'In der Mitte ein Dribbelfeld (ca. 12 × 10 m). In jeder Ecke des Gesamtfeldes (ca. 30 × 20 m) ein Minitor, markiert mit roten oder blauen Hütchen (je 2 Tore pro Farbe). Jedes Kind hat einen Ball.',
    steps: [
      'Alle dribbeln im mittleren Feld.',
      'Der Trainer ruft „Rot!" oder „Blau!".',
      'Jedes Kind dribbelt zu einem Tor dieser Farbe und schießt.',
      'Ball holen und zurück in die Mitte – nächster Alarm!'
    ],
    tips: [
      'Gut zuhören und schnell entscheiden: Welches Tor ist näher?',
      'Mit Tempo los, vor dem Schuss Ball kontrollieren.',
      'Wer zuerst zurück in der Wache ist, darf die nächste Farbe rufen.'
    ],
    easier: 'Nur 2 Tore, eins pro Farbe.',
    harder: 'Rechenaufgaben oder Tiere statt Farben (z. B. „Elefant" = rot), oder mit dem schwachen Fuß schießen.',
    animation: {
      loop: 8,
      field: 'rasen',
      objects: [
        { type: 'zone', x: 30, y: 18, w: 40, h: 28, color: 'yellow' },
        { type: 'goal', x: 92, y: 12, rot: 90 },
        { type: 'cone', x: 92, y: 5, color: 'red' }, { type: 'cone', x: 92, y: 19, color: 'red' },
        { type: 'goal', x: 92, y: 52, rot: 90 },
        { type: 'cone', x: 92, y: 45, color: 'blue' }, { type: 'cone', x: 92, y: 59, color: 'blue' },
        { type: 'goal', x: 8, y: 12, rot: 270 },
        { type: 'cone', x: 8, y: 5, color: 'blue' }, { type: 'cone', x: 8, y: 19, color: 'blue' },
        { type: 'goal', x: 8, y: 52, rot: 270 },
        { type: 'cone', x: 8, y: 45, color: 'red' }, { type: 'cone', x: 8, y: 59, color: 'red' },
        { type: 'label', x: 50, y: 60, text: 'Trainer: „Rot!“' }
      ],
      actors: [
        { id: 'c', kind: 'coach', keys: [[0, 50, 54]] },
        { id: 'p1', kind: 'player', color: 'red', keys: [[0, 40, 24], [0.15, 52, 22], [0.3, 46, 30], [0.45, 74, 16], [0.55, 88, 13], [0.75, 64, 22], [1, 40, 24]] },
        { id: 'b1', kind: 'ball', keys: [[0, 42, 24], [0.15, 54, 22], [0.3, 48, 29], [0.45, 76, 15], [0.5, 93, 12], [0.55, 90, 13], [0.75, 62, 22], [1, 42, 24]] },
        { id: 'p2', kind: 'player', color: 'blue', keys: [[0, 60, 34], [0.15, 48, 38], [0.3, 56, 26], [0.45, 78, 20], [0.6, 88, 14], [0.8, 66, 30], [1, 60, 34]] },
        { id: 'b2', kind: 'ball', keys: [[0, 58, 34], [0.15, 46, 38], [0.3, 58, 25], [0.45, 80, 19], [0.5, 82, 18], [0.55, 93, 13], [0.6, 90, 14], [0.8, 64, 30], [1, 58, 34]] },
        { id: 'p3', kind: 'player', color: 'yellow', keys: [[0, 50, 40], [0.15, 38, 36], [0.3, 42, 42], [0.45, 24, 48], [0.55, 12, 52], [0.75, 36, 42], [1, 50, 40]] },
        { id: 'b3', kind: 'ball', keys: [[0, 48, 40], [0.15, 36, 36], [0.3, 40, 43], [0.45, 22, 49], [0.5, 7, 52], [0.55, 10, 52], [0.75, 38, 41], [1, 48, 40]] },
        { id: 'p4', kind: 'player', color: 'green', keys: [[0, 34, 30], [0.15, 44, 32], [0.3, 36, 36], [0.45, 22, 44], [0.6, 12, 50], [0.8, 30, 36], [1, 34, 30]] },
        { id: 'b4', kind: 'ball', keys: [[0, 34, 32], [0.15, 46, 32], [0.3, 34, 37], [0.45, 20, 45], [0.5, 18, 46], [0.55, 7, 52], [0.6, 10, 51], [0.8, 32, 35], [1, 34, 32]] }
      ]
    }
  },

  {
    id: 'd-dribbelkoenig',
    name: 'Dribbelkönig',
    short: 'Alle schützen ihren Ball und spitzeln andere aus dem Quadrat.',
    materialQty: { huetchen: '4', baelle: '1/Kind' },
    venue: ['draussen', 'halle'],
    phase: 'hauptteil',
    focus: ['ballgefuehl', 'laufen'],
    duration: 8,
    players: [4, 12],
    level: 3,
    material: ['huetchen', 'baelle'],
    story: 'Im Königreich gibt es nur einen Dribbelkönig! Jedes Kind beschützt seinen Ball und versucht gleichzeitig, die Bälle der anderen aus dem Schloss zu spitzeln.',
    setup: 'Quadrat ca. 15 × 15 m mit Hütchen. Jedes Kind hat einen Ball.',
    steps: [
      'Alle dribbeln im Quadrat und behalten ihren Ball.',
      'Gleichzeitig versucht jedes Kind, andere Bälle aus dem Feld zu spitzeln.',
      'Wessen Ball rausrollt, holt ihn, macht 3 Ballkunststücke (z. B. Sohle vor/zurück) und kommt zurück.',
      'Keiner scheidet aus – wer schafft die meisten Spitzler?'
    ],
    tips: [
      'Körper zwischen Gegner und Ball – Arme leicht seitlich.',
      'Erst den eigenen Ball sichern, dann angreifen.',
      'Fair bleiben: Nur den Ball spielen!'
    ],
    easier: 'Größeres Feld; der Trainer ist der einzige Angreifer.',
    harder: 'Feld verkleinern oder wer rausmuss, dribbelt einmal um das ganze Feld.',
    animation: {
      loop: 8,
      field: 'rasen',
      objects: [
        { type: 'zone', x: 25, y: 12, w: 50, h: 38, color: 'white' },
        { type: 'cone', x: 25, y: 12, color: 'orange' }, { type: 'cone', x: 75, y: 12, color: 'orange' },
        { type: 'cone', x: 25, y: 50, color: 'orange' }, { type: 'cone', x: 75, y: 50, color: 'orange' },
        { type: 'cone', x: 50, y: 12, color: 'orange' }, { type: 'cone', x: 50, y: 50, color: 'orange' }
      ],
      actors: [
        { id: 'p1', kind: 'player', color: 'red', keys: [[0, 35, 25], [0.2, 45, 30], [0.35, 52, 33], [0.5, 60, 28], [0.75, 45, 22], [1, 35, 25]] },
        { id: 'b1', kind: 'ball', keys: [[0, 37, 26], [0.2, 47, 31], [0.35, 52, 31], [0.5, 62, 28], [0.75, 43, 22], [1, 37, 26]] },
        { id: 'p2', kind: 'player', color: 'blue', keys: [[0, 60, 40], [0.2, 57, 37], [0.35, 56, 37], [0.5, 64, 52], [0.6, 68, 58], [0.8, 62, 44], [1, 60, 40]] },
        { id: 'b2', kind: 'ball', keys: [[0, 58, 40], [0.2, 55, 37], [0.35, 54, 36], [0.45, 66, 57], [0.6, 68, 60], [0.8, 61, 46], [1, 58, 40]] },
        { id: 'p3', kind: 'player', color: 'yellow', keys: [[0, 30, 45], [0.25, 40, 42], [0.5, 32, 35], [0.75, 28, 40], [1, 30, 45]] },
        { id: 'b3', kind: 'ball', keys: [[0, 32, 46], [0.25, 42, 41], [0.5, 30, 34], [0.75, 28, 42], [1, 32, 46]] },
        { id: 'p4', kind: 'player', color: 'green', keys: [[0, 65, 20], [0.25, 55, 18], [0.5, 45, 22], [0.75, 60, 24], [1, 65, 20]] },
        { id: 'b4', kind: 'ball', keys: [[0, 63, 20], [0.25, 53, 18], [0.5, 43, 23], [0.75, 62, 23], [1, 63, 20]] },
        { id: 'p5', kind: 'player', color: 'purple', keys: [[0, 70, 32], [0.3, 66, 44], [0.6, 70, 24], [1, 70, 32]] },
        { id: 'b5', kind: 'ball', keys: [[0, 70, 34], [0.3, 64, 45], [0.6, 70, 22], [1, 70, 34]] }
      ]
    }
  },

  /* =========================================================
   * ABSCHLUSS
   * ========================================================= */

  {
    id: 'd-funino',
    name: 'Funino 3:3',
    short: '3 gegen 3 auf je zwei Minitore, Tore nur aus der Schusszone.',
    materialQty: { minitore: '4', huetchen: '8', leibchen: '3', baelle: '4' },
    funino: { step: 4, type: 'spiel' },
    venue: ['draussen'],
    phase: 'abschluss',
    focus: ['torschuss', 'sozial', 'ballgefuehl'],
    duration: 15,
    players: [6, 12],
    level: 2,
    material: ['minitore', 'huetchen', 'leibchen', 'baelle'],
    story: 'Jedes Team verteidigt zwei Tore und greift zwei Tore an. Wer clever ist, spielt dorthin, wo gerade frei ist!',
    setup: 'Feld ca. 25 × 20 m. Auf jeder Grundlinie 2 Minitore an den Ecken (ca. 12 m auseinander). Schusszone ca. 6 m vor den Toren mit Hütchen markieren. Mehrere Felder nebeneinander, Ersatzbälle hinter den Toren.',
    steps: [
      'Es spielen 3 gegen 3, ohne Torwart.',
      'Tore zählen nur, wenn aus der Schusszone geschossen wird.',
      'Nach einem Tor oder Aus geht es sofort mit neuem Ball von der Grundlinie weiter (eindribbeln).',
      'Nach jedem Tor rotiert ein Spieler pro Team aus und ein Auswechselspieler kommt rein (bei 4er-Teams).'
    ],
    tips: [
      'Schaut, welches Tor offen ist – dorthin spielen!',
      'Breit stehen, damit der Ball laufen kann.',
      'Der Trainer coacht wenig – die Kinder entscheiden selbst.'
    ],
    easier: 'Ohne Schusszone spielen oder Feld vergrößern.',
    harder: 'Tor zählt doppelt, wenn vorher 2 Pässe gespielt wurden.',
    animation: {
      loop: 10,
      field: 'rasen',
      objects: [
        { type: 'goal', x: 4, y: 16, rot: 270 },
        { type: 'goal', x: 4, y: 48, rot: 270 },
        { type: 'goal', x: 96, y: 16, rot: 90 },
        { type: 'goal', x: 96, y: 48, rot: 90 },
        { type: 'line', x1: 20, y1: 4, x2: 20, y2: 60, dash: true },
        { type: 'line', x1: 80, y1: 4, x2: 80, y2: 60, dash: true },
        { type: 'line', x1: 50, y1: 4, x2: 50, y2: 60 },
        { type: 'cone', x: 20, y: 4, color: 'yellow' }, { type: 'cone', x: 20, y: 60, color: 'yellow' },
        { type: 'cone', x: 80, y: 4, color: 'yellow' }, { type: 'cone', x: 80, y: 60, color: 'yellow' },
        { type: 'cone', x: 4, y: 4, color: 'orange' }, { type: 'cone', x: 96, y: 4, color: 'orange' },
        { type: 'cone', x: 4, y: 60, color: 'orange' }, { type: 'cone', x: 96, y: 60, color: 'orange' }
      ],
      actors: [
        { id: 'r1', kind: 'player', color: 'red', keys: [[0, 28, 32], [0.1, 38, 32], [0.3, 48, 30], [0.5, 50, 32], [0.7, 40, 38], [0.82, 26, 42], [0.92, 7, 44], [1, 28, 32]] },
        { id: 'r2', kind: 'player', color: 'red', keys: [[0, 45, 14], [0.2, 58, 14], [0.38, 82, 16], [0.48, 86, 18], [0.65, 66, 18], [0.85, 50, 16], [1, 45, 14]] },
        { id: 'r3', kind: 'player', color: 'red', keys: [[0, 45, 50], [0.18, 54, 50], [0.3, 72, 48], [0.4, 76, 46], [0.6, 64, 46], [0.85, 50, 50], [1, 45, 50]] },
        { id: 'u1', kind: 'player', color: 'blue', keys: [[0, 60, 32], [0.15, 56, 34], [0.3, 66, 34], [0.5, 64, 36], [0.66, 58, 36], [0.75, 40, 40], [0.85, 36, 38], [1, 60, 32]] },
        { id: 'u2', kind: 'player', color: 'blue', keys: [[0, 70, 18], [0.2, 64, 20], [0.38, 80, 20], [0.5, 94, 18], [0.6, 78, 22], [0.75, 66, 20], [1, 70, 18]] },
        { id: 'u3', kind: 'player', color: 'blue', keys: [[0, 24, 48], [0.2, 50, 48], [0.3, 66, 46], [0.45, 76, 44], [0.65, 52, 52], [0.82, 22, 50], [0.9, 18, 49], [1, 24, 48]] },
        { id: 'b', kind: 'ball', keys: [[0, 30, 32], [0.1, 40, 32], [0.18, 55, 48], [0.3, 74, 47], [0.38, 82, 18], [0.45, 97, 16], [0.5, 95, 17], [0.6, 76, 23], [0.66, 57, 36], [0.75, 38, 41], [0.82, 22, 48], [0.88, 3, 48], [0.92, 6, 46], [1, 30, 32]] }
      ]
    }
  },

  {
    id: 'd-2gegen2-minitore',
    name: '2:2 auf Minitore',
    short: '2 gegen 2 auf zwei Minitore, nach jedem Tor neu von hinten.',
    materialQty: { minitore: '2', huetchen: '4', leibchen: '2', baelle: '4' },
    venue: ['draussen'],
    phase: 'abschluss',
    focus: ['torschuss', 'sozial', 'ballgefuehl'],
    duration: 12,
    players: [4, 16],
    level: 1,
    material: ['minitore', 'huetchen', 'leibchen', 'baelle'],
    story: 'Kleine Teams, große Helden! Zu zweit stürmt ihr auf das Tor der anderen – jedes Kind ist ganz oft am Ball.',
    setup: 'Mehrere Felder (ca. 15 × 10 m) nebeneinander, auf jeder Grundlinie ein Minitor. 2 gegen 2 pro Feld, Ersatzbälle neben den Toren.',
    steps: [
      'Ein Team startet mit Ball an der eigenen Grundlinie.',
      'Beide Teams versuchen, ins gegnerische Minitor zu treffen.',
      'Nach Tor oder Aus: neuer Ball vom Tor, das andere Team startet.',
      'Nach 3 Minuten wechseln die Teams auf ein anderes Feld (neuer Gegner).'
    ],
    tips: [
      'Wenn dein Partner frei ist: passen! Wenn nicht: dribbeln!',
      'Nach Ballverlust sofort zurück und helfen.',
      'Keine festen Positionen – alle dürfen stürmen.'
    ],
    easier: 'Tore größer machen oder 2:1 mit einem Joker.',
    harder: 'Tor zählt nur nach einem Pass oder aus der vorderen Hälfte.',
    animation: {
      loop: 9,
      field: 'rasen',
      objects: [
        { type: 'goal', x: 6, y: 32, rot: 270 },
        { type: 'goal', x: 94, y: 32, rot: 90 },
        { type: 'zone', x: 6, y: 8, w: 88, h: 48, color: 'white' },
        { type: 'cone', x: 6, y: 8, color: 'orange' }, { type: 'cone', x: 94, y: 8, color: 'orange' },
        { type: 'cone', x: 6, y: 56, color: 'orange' }, { type: 'cone', x: 94, y: 56, color: 'orange' },
        { type: 'line', x1: 50, y1: 8, x2: 50, y2: 56, dash: true }
      ],
      actors: [
        { id: 'r1', kind: 'player', color: 'red', keys: [[0, 30, 24], [0.15, 44, 22], [0.3, 62, 28], [0.4, 72, 26], [0.55, 60, 24], [0.75, 40, 28], [0.9, 10, 32], [1, 30, 24]] },
        { id: 'r2', kind: 'player', color: 'red', keys: [[0, 30, 42], [0.15, 46, 44], [0.25, 60, 42], [0.38, 76, 36], [0.5, 70, 38], [0.75, 44, 40], [1, 30, 42]] },
        { id: 'u1', kind: 'player', color: 'blue', keys: [[0, 60, 30], [0.2, 54, 28], [0.3, 64, 34], [0.4, 80, 34], [0.5, 90, 33], [0.65, 72, 30], [0.75, 58, 34], [0.82, 42, 36], [1, 60, 30]] },
        { id: 'u2', kind: 'player', color: 'blue', keys: [[0, 40, 46], [0.2, 58, 44], [0.35, 70, 40], [0.5, 72, 22], [0.7, 50, 20], [0.82, 34, 24], [0.9, 22, 30], [1, 40, 46]] },
        { id: 'b', kind: 'ball', keys: [[0, 32, 24], [0.15, 46, 22], [0.22, 58, 41], [0.3, 66, 39], [0.38, 78, 35], [0.45, 95, 32], [0.5, 92, 33], [0.65, 70, 30], [0.72, 50, 22], [0.82, 32, 25], [0.88, 5, 32], [0.92, 8, 32], [1, 32, 24]] }
      ]
    }
  },

  {
    id: 'd-wm-turnier',
    name: 'Kleine WM',
    short: 'Länderteams spielen 2:2 oder 3:3, nach jedem Spiel Feldwechsel.',
    materialQty: { minitore: '2', huetchen: '4', leibchen: '3', baelle: '3' },
    venue: ['draussen'],
    phase: 'abschluss',
    focus: ['torschuss', 'sozial'],
    duration: 15,
    players: [8, 16],
    level: 2,
    material: ['minitore', 'huetchen', 'leibchen', 'baelle'],
    story: 'Heute ist Weltmeisterschaft! Jedes Team sucht sich ein Land aus – Brasilien, Deutschland, Spanien … – und spielt in kurzen Spielen gegen die anderen Länder.',
    setup: '2–3 Felder (ca. 20 × 12 m) nebeneinander mit je 2 Minitoren. Teams à 2–3 Kinder mit Leibchen, jedes Team bekommt einen Länder-Namen.',
    steps: [
      'Auf allen Feldern wird gleichzeitig 2:2 oder 3:3 gespielt (je 3–4 Minuten).',
      'Nach jedem Spiel wechseln die Teams nach einem festen Plan das Feld und den Gegner.',
      'Bei Tor geht es sofort mit neuem Ball vom eigenen Tor weiter.',
      'Am Ende feiern alle zusammen – jedes Land bekommt eine „Medaille" (Abklatschen)!'
    ],
    tips: [
      'Spielzeit kurz halten, dazwischen Trinkpause.',
      'Kein Torwart – alle spielen mit.',
      'Ergebnisse nicht zu wichtig nehmen: Spaß und viele Tore zählen!'
    ],
    easier: 'Ohne Wertung spielen, größere Tore.',
    harder: 'Mit Tabelle und Finale, Tore nur aus einer Schusszone.',
    animation: {
      loop: 10,
      field: 'rasen',
      objects: [
        { type: 'zone', x: 4, y: 4, w: 44, h: 56, color: 'white' },
        { type: 'zone', x: 52, y: 4, w: 44, h: 56, color: 'white' },
        { type: 'goal', x: 26, y: 4, rot: 0 },
        { type: 'goal', x: 26, y: 60, rot: 180 },
        { type: 'goal', x: 74, y: 4, rot: 0 },
        { type: 'goal', x: 74, y: 60, rot: 180 },
        { type: 'cone', x: 4, y: 4, color: 'orange' }, { type: 'cone', x: 48, y: 4, color: 'orange' },
        { type: 'cone', x: 4, y: 60, color: 'orange' }, { type: 'cone', x: 48, y: 60, color: 'orange' },
        { type: 'cone', x: 52, y: 4, color: 'orange' }, { type: 'cone', x: 96, y: 4, color: 'orange' },
        { type: 'cone', x: 52, y: 60, color: 'orange' }, { type: 'cone', x: 96, y: 60, color: 'orange' },
        { type: 'label', x: 12, y: 62, text: 'Feld 1' },
        { type: 'label', x: 60, y: 62, text: 'Feld 2' }
      ],
      actors: [
        { id: 'r1', kind: 'player', color: 'red', keys: [[0, 20, 16], [0.2, 22, 28], [0.35, 28, 38], [0.55, 26, 40], [0.7, 24, 30], [0.85, 22, 16], [0.95, 21, 8], [1, 20, 16]] },
        { id: 'r2', kind: 'player', color: 'red', keys: [[0, 34, 20], [0.2, 36, 30], [0.3, 34, 36], [0.42, 24, 50], [0.6, 34, 36], [1, 34, 20]] },
        { id: 'u1', kind: 'player', color: 'blue', keys: [[0, 28, 40], [0.2, 26, 38], [0.35, 28, 46], [0.5, 26, 57], [0.65, 24, 40], [0.78, 28, 22], [0.85, 26, 12], [1, 28, 40]] },
        { id: 'u2', kind: 'player', color: 'blue', keys: [[0, 20, 46], [0.25, 28, 44], [0.4, 22, 50], [0.6, 32, 44], [0.78, 32, 28], [1, 20, 46]] },
        { id: 'ba', kind: 'ball', keys: [[0, 20, 18], [0.2, 22, 30], [0.28, 34, 35], [0.38, 28, 47], [0.45, 26, 61], [0.5, 26, 59], [0.55, 25, 49], [0.65, 24, 38], [0.78, 28, 20], [0.85, 26, 10], [0.9, 26, 3], [0.95, 22, 10], [1, 20, 18]] },
        { id: 'y1', kind: 'player', color: 'yellow', keys: [[0, 68, 48], [0.2, 70, 36], [0.35, 76, 26], [0.55, 74, 24], [0.7, 72, 34], [0.85, 70, 48], [0.95, 69, 56], [1, 68, 48]] },
        { id: 'y2', kind: 'player', color: 'yellow', keys: [[0, 82, 44], [0.2, 84, 34], [0.3, 82, 28], [0.42, 72, 14], [0.6, 82, 28], [1, 82, 44]] },
        { id: 'g1', kind: 'player', color: 'green', keys: [[0, 76, 24], [0.2, 74, 26], [0.35, 76, 18], [0.5, 74, 7], [0.65, 72, 24], [0.78, 76, 42], [0.85, 74, 52], [1, 76, 24]] },
        { id: 'g2', kind: 'player', color: 'green', keys: [[0, 68, 18], [0.25, 76, 20], [0.4, 70, 14], [0.6, 80, 20], [0.78, 80, 36], [1, 68, 18]] },
        { id: 'bb', kind: 'ball', keys: [[0, 68, 46], [0.2, 70, 34], [0.28, 82, 29], [0.38, 76, 17], [0.45, 74, 3], [0.5, 74, 5], [0.55, 73, 15], [0.65, 72, 26], [0.78, 76, 44], [0.85, 74, 54], [0.9, 74, 61], [0.95, 70, 54], [1, 68, 46]] }
      ]
    }
  },

  {
    id: 'd-aufstiegsturnier',
    name: 'Champions-League-Aufstieg',
    short: '1:1 oder 2:2, Sieger steigen ein Feld auf, Verlierer ab.',
    materialQty: { minitore: '2', huetchen: '4', baelle: '3', leibchen: '2' },
    venue: ['draussen'],
    phase: 'abschluss',
    focus: ['torschuss', 'ballgefuehl', 'sozial'],
    duration: 12,
    players: [6, 16],
    level: 3,
    material: ['minitore', 'huetchen', 'baelle', 'leibchen'],
    story: 'Wer gewinnt, steigt auf – bis in die Champions League! Wer verliert, rutscht eine Liga runter und startet dort die nächste Aufholjagd.',
    setup: '3–4 kleine Felder (ca. 12 × 8 m) übereinander, je 2 Minitore. Oberstes Feld = Champions League, darunter Bundesliga, ganz unten Kreisliga. Pro Feld 1:1 oder 2:2.',
    steps: [
      'Auf allen Feldern wird gleichzeitig gespielt (ca. 90 Sekunden).',
      'Auf Pfiff: Sieger gehen ein Feld nach oben, Verlierer ein Feld nach unten.',
      'Wer in der Champions League gewinnt, bleibt oben; wer in der Kreisliga verliert, bleibt unten.',
      'Bei Unentschieden entscheidet „Schnick-Schnack-Schnuck".'
    ],
    tips: [
      'Kurze Runden, damit jedes Kind oft neu starten kann.',
      'Auch in der Kreisliga wird gejubelt – jeder kann wieder aufsteigen!',
      'Ersatzbälle hinter den Toren bereitlegen, damit es sofort weitergeht.'
    ],
    easier: 'Größere Tore, 2:2 statt 1:1 (mehr Hilfe vom Partner).',
    harder: 'Rundenzeit verkürzen oder Tor zählt nur aus der gegnerischen Hälfte.',
    animation: {
      loop: 8,
      field: 'rasen',
      objects: [
        { type: 'zone', x: 8, y: 4, w: 84, h: 14, color: 'yellow' },
        { type: 'zone', x: 8, y: 25, w: 84, h: 14, color: 'white' },
        { type: 'zone', x: 8, y: 46, w: 84, h: 14, color: 'white' },
        { type: 'goal', x: 8, y: 11, rot: 270 }, { type: 'goal', x: 92, y: 11, rot: 90 },
        { type: 'goal', x: 8, y: 32, rot: 270 }, { type: 'goal', x: 92, y: 32, rot: 90 },
        { type: 'goal', x: 8, y: 53, rot: 270 }, { type: 'goal', x: 92, y: 53, rot: 90 },
        { type: 'label', x: 50, y: 2, text: 'Champions League' },
        { type: 'label', x: 50, y: 22.5, text: 'Bundesliga' },
        { type: 'label', x: 50, y: 43.5, text: 'Kreisliga' }
      ],
      actors: [
        { id: 'r1', kind: 'player', color: 'red', keys: [[0, 14, 11], [0.1, 30, 11], [0.25, 50, 7], [0.32, 58, 14], [0.4, 70, 13], [0.5, 75, 13], [0.6, 60, 10], [0.72, 48, 12], [0.8, 40, 8], [0.9, 16, 9], [0.95, 11, 10], [1, 14, 11]] },
        { id: 'u1', kind: 'player', color: 'blue', keys: [[0, 62, 11], [0.25, 54, 9], [0.32, 54, 9], [0.4, 64, 12], [0.5, 88, 11], [0.6, 70, 9], [0.72, 50, 14], [0.8, 34, 10], [0.9, 40, 11], [1, 62, 11]] },
        { id: 'b1', kind: 'ball', keys: [[0, 16, 11], [0.1, 32, 11], [0.25, 52, 7], [0.32, 60, 14], [0.4, 72, 13], [0.45, 93, 11], [0.5, 90, 11], [0.6, 68, 9], [0.72, 48, 14], [0.8, 32, 10], [0.86, 7, 11], [0.9, 7, 11], [0.95, 12, 10], [1, 16, 11]] },
        { id: 'y1', kind: 'player', color: 'yellow', keys: [[0, 86, 32], [0.1, 70, 32], [0.25, 50, 28], [0.32, 42, 35], [0.4, 30, 34], [0.5, 25, 34], [0.6, 40, 31], [0.72, 52, 33], [0.8, 60, 29], [0.9, 84, 30], [0.95, 89, 31], [1, 86, 32]] },
        { id: 'g1', kind: 'player', color: 'green', keys: [[0, 38, 32], [0.25, 46, 30], [0.32, 46, 30], [0.4, 36, 33], [0.5, 12, 32], [0.6, 30, 30], [0.72, 50, 35], [0.8, 66, 31], [0.9, 60, 32], [1, 38, 32]] },
        { id: 'b2', kind: 'ball', keys: [[0, 84, 32], [0.1, 68, 32], [0.25, 48, 28], [0.32, 40, 35], [0.4, 28, 34], [0.45, 7, 32], [0.5, 10, 32], [0.6, 32, 30], [0.72, 52, 35], [0.8, 68, 31], [0.86, 93, 32], [0.9, 93, 32], [0.95, 88, 31], [1, 84, 32]] },
        { id: 'v1', kind: 'player', color: 'purple', keys: [[0, 14, 53], [0.1, 30, 53], [0.25, 50, 49], [0.32, 58, 56], [0.4, 70, 55], [0.5, 75, 55], [0.6, 60, 52], [0.72, 48, 54], [0.8, 40, 50], [0.9, 16, 51], [0.95, 11, 52], [1, 14, 53]] },
        { id: 'o1', kind: 'player', color: 'orange', keys: [[0, 62, 53], [0.25, 54, 51], [0.32, 54, 51], [0.4, 64, 54], [0.5, 88, 53], [0.6, 70, 51], [0.72, 50, 56], [0.8, 34, 52], [0.9, 40, 53], [1, 62, 53]] },
        { id: 'b3', kind: 'ball', keys: [[0, 16, 53], [0.1, 32, 53], [0.25, 52, 49], [0.32, 60, 56], [0.4, 72, 55], [0.45, 93, 53], [0.5, 90, 53], [0.6, 68, 51], [0.72, 48, 56], [0.8, 32, 52], [0.86, 7, 53], [0.9, 7, 53], [0.95, 12, 52], [1, 16, 53]] }
      ]
    }
  },

  {
    id: 'd-dribbeltore-3gegen3',
    name: 'Dribbeltore 3:3',
    short: '3 gegen 3, Punkt für jedes Dribbling durch ein Hütchentor.',
    materialQty: { huetchen: '12', leibchen: '3', baelle: '3' },
    venue: ['draussen'],
    phase: 'abschluss',
    focus: ['ballgefuehl', 'sozial'],
    duration: 12,
    players: [6, 12],
    level: 2,
    material: ['huetchen', 'leibchen', 'baelle'],
    story: 'Im Feld stehen viele Zaubertore. Ein Tor zählt nur, wenn man mit dem Ball am Fuß hindurchdribbelt – schießen gilt nicht!',
    setup: 'Feld ca. 25 × 20 m, darin 5–6 Hütchentore (ca. 2 m breit) verteilt. 2 Teams à 3 Kinder mit Leibchen.',
    steps: [
      'Es spielen 3 gegen 3 mit einem Ball.',
      'Ein Punkt gibt es, wenn ein Kind mit dem Ball durch ein beliebiges Tor dribbelt (von beiden Seiten möglich).',
      'Nicht zweimal hintereinander durch dasselbe Tor.',
      'Die Verteidiger dürfen sich nicht dauerhaft ins Tor stellen.'
    ],
    tips: [
      'Wo ist ein Tor frei? Schnell dorthin passen oder dribbeln!',
      'Nach einem Punkt sofort zum nächsten Tor.',
      'Ruft euch zu, wenn ihr frei seid.'
    ],
    easier: 'Mehr Tore, breitere Tore.',
    harder: 'Punkt nur, wenn man durch das Tor zu einem Mitspieler passt.',
    animation: {
      loop: 9,
      field: 'rasen',
      objects: [
        { type: 'cone', x: 30, y: 15, color: 'yellow' }, { type: 'cone', x: 30, y: 21, color: 'yellow' },
        { type: 'cone', x: 72, y: 15, color: 'yellow' }, { type: 'cone', x: 72, y: 21, color: 'yellow' },
        { type: 'cone', x: 50, y: 29, color: 'yellow' }, { type: 'cone', x: 50, y: 35, color: 'yellow' },
        { type: 'cone', x: 28, y: 43, color: 'yellow' }, { type: 'cone', x: 28, y: 49, color: 'yellow' },
        { type: 'cone', x: 70, y: 43, color: 'yellow' }, { type: 'cone', x: 70, y: 49, color: 'yellow' },
        { type: 'cone', x: 8, y: 4, color: 'orange' }, { type: 'cone', x: 92, y: 4, color: 'orange' },
        { type: 'cone', x: 8, y: 60, color: 'orange' }, { type: 'cone', x: 92, y: 60, color: 'orange' }
      ],
      actors: [
        { id: 'r1', kind: 'player', color: 'red', keys: [[0, 20, 18], [0.12, 34, 18], [0.3, 40, 24], [0.55, 30, 30], [0.66, 25, 27], [0.8, 18, 22], [0.92, 18, 18], [1, 20, 18]] },
        { id: 'r2', kind: 'player', color: 'red', keys: [[0, 55, 52], [0.2, 62, 46], [0.3, 74, 46], [0.38, 78, 44], [0.6, 70, 54], [0.8, 60, 52], [1, 55, 52]] },
        { id: 'r3', kind: 'player', color: 'red', keys: [[0, 70, 28], [0.3, 62, 30], [0.46, 58, 32], [0.55, 44, 32], [0.6, 40, 32], [0.75, 52, 24], [1, 70, 28]] },
        { id: 'u1', kind: 'player', color: 'blue', keys: [[0, 40, 14], [0.15, 38, 20], [0.3, 50, 36], [0.5, 48, 30], [0.7, 34, 26], [0.85, 28, 20], [1, 40, 14]] },
        { id: 'u2', kind: 'player', color: 'blue', keys: [[0, 66, 40], [0.25, 70, 42], [0.4, 72, 40], [0.55, 58, 36], [0.8, 52, 40], [1, 66, 40]] },
        { id: 'u3', kind: 'player', color: 'blue', keys: [[0, 80, 20], [0.3, 74, 30], [0.5, 60, 26], [0.7, 46, 20], [0.85, 60, 16], [1, 80, 20]] },
        { id: 'b', kind: 'ball', keys: [[0, 22, 18], [0.12, 36, 18], [0.2, 62, 44], [0.3, 76, 46], [0.38, 79, 42], [0.46, 56, 32], [0.55, 42, 32], [0.6, 38, 32], [0.66, 23, 26], [0.8, 17, 20], [0.92, 19, 17], [1, 22, 18]] }
      ]
    }
  },

  {
    id: 'd-nummernspiel',
    name: 'Nummernspiel',
    short: 'Trainer ruft Nummern, die Kinder spielen 1:1 oder 2:2 auf Tore.',
    materialQty: { minitore: '2', baelle: '10', huetchen: '4', leibchen: '4' },
    venue: ['draussen'],
    phase: 'abschluss',
    focus: ['laufen', 'torschuss', 'sozial'],
    duration: 10,
    players: [6, 10],
    level: 2,
    material: ['minitore', 'baelle', 'huetchen', 'leibchen'],
    story: 'Jedes Kind bekommt eine Geheimnummer. Ruft der Trainer deine Nummer, flitzt du aufs Feld und spielst um den Ball – wer schießt das Tor?',
    setup: 'Feld ca. 20 × 15 m mit je einem Minitor links und rechts. Zwei Teams (je 3–4 Kinder, nummeriert) stehen an den Seitenlinien gegenüber. Der Trainer steht mit Bällen an der Seite.',
    steps: [
      'Der Trainer ruft eine oder zwei Nummern und rollt den Ball ins Feld.',
      'Die aufgerufenen Kinder beider Teams spielen 1:1 oder 2:2 – jedes Team auf ein Tor.',
      'Nach Tor oder Aus (spätestens nach 30 Sekunden) zurück an die Linie.',
      'Sofort die nächste Nummer – oft auch „Alle!" rufen.'
    ],
    tips: [
      'Gut zuhören – die Nummer kann jederzeit kommen!',
      'Gruppen klein halten (max. 4 pro Team), damit alle oft dran sind.',
      'Lustige Varianten: „2 und 3!" oder Rechenaufgaben „1 plus 1!"'
    ],
    easier: 'Nur 1:1 und Ball direkt zu einem Kind rollen.',
    harder: '2:2 oder 3:3, der Ball wird hoch eingeworfen.',
    animation: {
      loop: 9,
      field: 'rasen',
      objects: [
        { type: 'goal', x: 6, y: 32, rot: 270 },
        { type: 'goal', x: 94, y: 32, rot: 90 },
        { type: 'line', x1: 6, y1: 10, x2: 94, y2: 10, dash: true },
        { type: 'line', x1: 6, y1: 54, x2: 94, y2: 54, dash: true },
        { type: 'cone', x: 6, y: 10, color: 'orange' }, { type: 'cone', x: 94, y: 10, color: 'orange' },
        { type: 'cone', x: 6, y: 54, color: 'orange' }, { type: 'cone', x: 94, y: 54, color: 'orange' },
        { type: 'label', x: 24, y: 14, text: '„Nummer 2!“' }
      ],
      actors: [
        { id: 'c', kind: 'coach', keys: [[0, 12, 20]] },
        { id: 'r1', kind: 'player', color: 'red', label: '1', keys: [[0, 35, 58]] },
        { id: 'r2', kind: 'player', color: 'red', label: '2', keys: [[0, 45, 58], [0.2, 50, 36], [0.3, 62, 34], [0.45, 80, 32], [0.6, 90, 34], [0.7, 70, 44], [0.88, 46, 57], [1, 45, 58]] },
        { id: 'r3', kind: 'player', color: 'red', label: '3', keys: [[0, 55, 58]] },
        { id: 'u1', kind: 'player', color: 'blue', label: '1', keys: [[0, 45, 6]] },
        { id: 'u2', kind: 'player', color: 'blue', label: '2', keys: [[0, 55, 6], [0.2, 52, 26], [0.3, 60, 30], [0.45, 76, 30], [0.6, 70, 22], [0.85, 56, 8], [1, 55, 6]] },
        { id: 'u3', kind: 'player', color: 'blue', label: '3', keys: [[0, 65, 6]] },
        { id: 'b', kind: 'ball', keys: [[0, 14, 22], [0.18, 50, 33], [0.22, 52, 35], [0.3, 64, 34], [0.45, 82, 32], [0.5, 95, 32], [0.6, 92, 34], [0.7, 68, 44], [0.85, 15, 22], [1, 14, 22]] }
      ]
    }
  },

  {
    id: 'd-linienfussball',
    name: 'Linienfußball 3:3',
    short: '3 gegen 3, Ball über die gegnerische Linie dribbeln und stoppen.',
    materialQty: { huetchen: '8', leibchen: '3', baelle: '3' },
    venue: ['draussen'],
    phase: 'abschluss',
    focus: ['ballgefuehl', 'sozial', 'laufen'],
    duration: 12,
    players: [6, 12],
    level: 3,
    material: ['huetchen', 'leibchen', 'baelle'],
    story: 'Jedes Team will in die Burg der anderen einreiten! Ein Punkt gibt es, wenn ein Kind mit dem Ball am Fuß über die gegnerische Burgmauer (Grundlinie) dribbelt.',
    setup: 'Feld ca. 25 × 20 m. Die beiden Grundlinien mit Hütchen gut sichtbar markieren. 2 Teams à 3 Kinder mit Leibchen, Ersatzbälle an der Seite.',
    steps: [
      'Es wird 3 gegen 3 gespielt, ohne Tore.',
      'Punkt: Ball über die gegnerische Grundlinie dribbeln und dort mit der Sohle stoppen.',
      'Danach startet das andere Team von seiner Grundlinie mit Ball.',
      'Spielzeit 3–4 Minuten, dann Teams neu mischen.'
    ],
    tips: [
      'Die Linie ist breit – sucht die Stelle, wo kein Verteidiger ist.',
      'Mit Tempo in die freie Lücke dribbeln.',
      'Verteidiger: zu zweit den Weg zur Linie zustellen.'
    ],
    easier: 'Feld breiter machen oder 3:2 mit Überzahl.',
    harder: 'Punkt zählt nur in einer markierten Zone der Linie (z. B. 5 m breit) oder nach vorherigem Pass.',
    animation: {
      loop: 10,
      field: 'rasen',
      objects: [
        { type: 'line', x1: 10, y1: 4, x2: 10, y2: 60 },
        { type: 'line', x1: 90, y1: 4, x2: 90, y2: 60 },
        { type: 'cone', x: 10, y: 4, color: 'red' }, { type: 'cone', x: 10, y: 22, color: 'red' },
        { type: 'cone', x: 10, y: 42, color: 'red' }, { type: 'cone', x: 10, y: 60, color: 'red' },
        { type: 'cone', x: 90, y: 4, color: 'blue' }, { type: 'cone', x: 90, y: 22, color: 'blue' },
        { type: 'cone', x: 90, y: 42, color: 'blue' }, { type: 'cone', x: 90, y: 60, color: 'blue' },
        { type: 'line', x1: 50, y1: 4, x2: 50, y2: 60, dash: true }
      ],
      actors: [
        { id: 'r1', kind: 'player', color: 'red', keys: [[0, 24, 30], [0.12, 40, 28], [0.3, 58, 24], [0.5, 62, 30], [0.7, 40, 34], [0.85, 16, 40], [0.9, 10, 40], [1, 24, 30]] },
        { id: 'r2', kind: 'player', color: 'red', keys: [[0, 30, 14], [0.15, 48, 12], [0.28, 70, 14], [0.36, 92, 16], [0.5, 84, 18], [0.75, 50, 16], [1, 30, 14]] },
        { id: 'r3', kind: 'player', color: 'red', keys: [[0, 30, 50], [0.2, 50, 50], [0.4, 66, 44], [0.6, 56, 48], [0.8, 36, 50], [1, 30, 50]] },
        { id: 'u1', kind: 'player', color: 'blue', keys: [[0, 60, 28], [0.15, 54, 26], [0.3, 66, 20], [0.45, 90, 20], [0.55, 76, 30], [0.7, 62, 30], [0.85, 56, 28], [1, 60, 28]] },
        { id: 'u2', kind: 'player', color: 'blue', keys: [[0, 52, 16], [0.2, 60, 14], [0.3, 72, 16], [0.4, 84, 16], [0.55, 70, 12], [0.75, 48, 18], [0.9, 44, 20], [1, 52, 16]] },
        { id: 'u3', kind: 'player', color: 'blue', keys: [[0, 20, 48], [0.2, 44, 46], [0.4, 62, 44], [0.55, 58, 46], [0.62, 52, 44], [0.75, 30, 44], [0.82, 8, 44], [1, 20, 48]] },
        { id: 'b', kind: 'ball', keys: [[0, 26, 30], [0.12, 42, 28], [0.22, 61, 14], [0.28, 72, 14], [0.36, 94, 16], [0.42, 92, 18], [0.45, 88, 21], [0.55, 74, 30], [0.62, 50, 44], [0.75, 28, 44], [0.82, 6, 44], [0.9, 12, 41], [1, 26, 30]] }
      ]
    }
  }

);
