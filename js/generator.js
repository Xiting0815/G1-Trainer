/* Trainingsgenerator: stellt aus der Übungsbibliothek eine Einheit nach DFB-Bambini-Aufbau zusammen. */
(function () {
  // Aufbau der Einheiten (siehe docs/DFB-KONZEPT.md)
  // Stationsmodell: Aufbau von 3 Stationen in der ersten Phase, Gruppen A/B/C rotieren.
  //  type 'station' = Stationsrunde (round 1–3), type 'final' = Abschlussspiel an Station 3
  const TEMPLATES = {
    halle: {
      label: 'Halle',
      minutes: 60,
      blocks: [
        { type: 'ritual', key: 'aufbau', label: 'Freies Training & Aufbau', minutes: 7 },
        { type: 'ritual', key: 'begruessung', label: 'Begrüßung & Ruf', minutes: 3 },
        { type: 'station', round: 1, label: 'Stationen – Runde 1', minutes: 12 },
        { type: 'station', round: 2, label: 'Stationen – Runde 2', minutes: 12 },
        { type: 'pause', key: 'trinken', label: 'Trinkpause', minutes: 3 },
        { type: 'station', round: 3, label: 'Stationen – Runde 3', minutes: 12 },
        { type: 'final', label: 'Abschlussspiel', minutes: 8 },
        { type: 'ritual', key: 'verabschiedung', label: 'Abschlusskreis & Ruf', minutes: 3 },
      ],
    },
    draussen: {
      label: 'Draußen',
      minutes: 90,
      blocks: [
        { type: 'ritual', key: 'aufbau', label: 'Freies Training & Aufbau', minutes: 7 },
        { type: 'ritual', key: 'begruessung', label: 'Begrüßung & Ruf', minutes: 3 },
        { type: 'station', round: 1, label: 'Stationen – Runde 1', minutes: 18 },
        { type: 'pause', key: 'trinken', label: 'Trinkpause', minutes: 3 },
        { type: 'station', round: 2, label: 'Stationen – Runde 2', minutes: 18 },
        { type: 'pause', key: 'trinken', label: 'Trinkpause', minutes: 3 },
        { type: 'station', round: 3, label: 'Stationen – Runde 3', minutes: 18 },
        { type: 'final', label: 'Abschlussspiel', minutes: 15 },
        { type: 'ritual', key: 'verabschiedung', label: 'Abschlusskreis & Ruf', minutes: 5 },
      ],
    },
  };

  // Allein (1 Trainer): eine Station mit allen, danach Funino lernen + spielen
  const SOLO_TEMPLATES = {
    halle: {
      label: 'Halle',
      minutes: 60,
      blocks: [
        { type: 'ritual', key: 'aufbau', label: 'Freies Training & Aufbau', minutes: 7 },
        { type: 'ritual', key: 'begruessung', label: 'Begrüßung & Ruf', minutes: 3 },
        { type: 'single', label: 'Station (alle zusammen)', minutes: 15 },
        { type: 'pause', key: 'trinken', label: 'Trinkpause', minutes: 3 },
        { type: 'funino-learn', label: 'Funino lernen', minutes: 10 },
        { type: 'funino-play', label: 'Funino 3:3 spielen', minutes: 19 },
        { type: 'ritual', key: 'verabschiedung', label: 'Abschlusskreis & Ruf', minutes: 3 },
      ],
    },
    draussen: {
      label: 'Draußen',
      minutes: 90,
      blocks: [
        { type: 'ritual', key: 'aufbau', label: 'Freies Training & Aufbau', minutes: 7 },
        { type: 'ritual', key: 'begruessung', label: 'Begrüßung & Ruf', minutes: 3 },
        { type: 'single', label: 'Station (alle zusammen)', minutes: 20 },
        { type: 'pause', key: 'trinken', label: 'Trinkpause', minutes: 3 },
        { type: 'funino-learn', label: 'Funino lernen', minutes: 15 },
        { type: 'pause', key: 'trinken', label: 'Trinkpause', minutes: 3 },
        { type: 'funino-play', label: 'Funino 3:3 spielen', minutes: 15 },
        { type: 'pause', key: 'trinken', label: 'Trinkpause', minutes: 3 },
        { type: 'funino-play', label: 'Funino-Turnier', minutes: 16 },
        { type: 'ritual', key: 'verabschiedung', label: 'Abschlusskreis & Ruf', minutes: 5 },
      ],
    },
  };

  const SPREAD_CALLS = ['Mach dich breit!', 'Such dir eine Lücke!', 'Nicht alle zum Ball!', 'Welches Tor ist frei?'];

  const FUNINO_RULES = [
    'Tore zählen nur aus der Schusszone.',
    'Ball im Aus: eindribbeln statt einwerfen.',
    'Nach dem Tor: Wechselkind rein, Neustart von der Grundlinie.',
    'Kein Torwart – alle spielen mit.',
  ];

  // Station 1+2 = Hauptteil-Übungen, Station 3 = Spielform (wird auch das Abschlussspiel)
  const STATION_PHASES = ['hauptteil', 'hauptteil', 'abschluss'];
  const LIGHT = new Set(['baelle', 'leibchen', 'huetchen']); // Aufwärmen ohne großen Aufbau

  const RITUALS = {
    aufbau: {
      title: 'Freies Training & Aufbau',
      text: 'Freies Training: Die Kinder kommen an, laufen und toben – jedes Kind mit Ball. Trainer bauen währenddessen die 3 Stationen auf.',
      tips: ['Eltern beim Aufbau einbinden.', 'Jedes Kind beim Ankommen mit Namen begrüßen.'],
    },
    begruessung: {
      title: 'Begrüßung & Ruf',
      text: 'Kreis bilden, Hände in die Mitte. Kurz die Geschichte des Tages erzählen, dann gemeinsam rufen.',
      tips: ['Auf Augenhöhe gehen (hinknien).', 'Neue Kinder vorstellen.', 'Trinkflaschen an einen festen Platz stellen.'],
    },
    trinken: {
      title: 'Trinkpause',
      text: 'Alle trinken etwas, kurz verschnaufen (DFB: in Spielphasen alle 5–6 Minuten kurz trinken/wechseln). Lob für die Gruppe und Vorfreude auf das nächste Spiel wecken.',
      tips: ['Währenddessen nächste Station aufbauen (Eltern einbinden).', 'Kinder fragen, was ihnen bisher am meisten Spaß gemacht hat.'],
    },
    freispiel: {
      title: 'Freispiel / Wunschspiel',
      text: 'Die Kinder dürfen sich ihr Lieblingsspiel des Tages wünschen oder frei mit dem Ball spielen. Der Trainer spielt mit.',
      tips: ['Abstimmen per Handzeichen – Kinder entscheiden mit.', 'Kein Coaching, nur Spaß.'],
    },
    verabschiedung: {
      title: 'Abschlusskreis & Ruf',
      text: 'Kreis bilden: Was war heute toll? Jedes Kind abklatschen, dann gemeinsam rufen.',
      tips: ['Jedes Kind individuell loben.', 'Gemeinsam Material einsammeln – das macht Kindern Spaß.'],
    },
  };

  function avgRatings(kids) {
    const areas = Store.AREAS.map((a) => a.key);
    const sum = {}; areas.forEach((k) => (sum[k] = 0));
    if (!kids.length) {
      areas.forEach((k) => (sum[k] = 3));
      return sum;
    }
    // nur bewertete Kinder zählen; ohne Bewertungen neutral 3
    areas.forEach((k) => {
      const vals = kids.map((kid) => kid.ratings && kid.ratings[k]).filter(Boolean);
      sum[k] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 3;
    });
    return sum;
  }

  function targetLevel(avg) {
    const vals = Object.values(avg);
    const m = vals.reduce((a, b) => a + b, 0) / vals.length;
    if (m < 2.4) return 1;
    if (m < 3.7) return 2;
    return 3;
  }

  function weakestArea(avg) {
    return Object.entries(avg).sort((a, b) => a[1] - b[1])[0][0];
  }

  function focusMatches(ex, area) {
    if (!area) return false;
    if (ex.focus.includes(area)) return true;
    return area === 'ballgefuehl' && ex.focus.includes('torschuss');
  }

  /** ctx: { venue, count, level, focus, material:Set, recent:Map(id->age), favorites:Set } */
  function score(ex, ctx) {
    let s = 10;
    s -= Math.abs((ex.level || 1) - ctx.level) * 2;
    if (focusMatches(ex, ctx.focus)) s += 3;
    if (ctx.favorites.has(ex.id)) s += 2;
    if (ctx.recent.has(ex.id)) s -= 6 / ctx.recent.get(ex.id); // zuletzt gemacht = stärker abwerten
    const [min, max] = ex.players || [1, 99];
    if (ctx.count && ctx.count < min) s -= 4;
    if (ctx.count && ctx.count > max) s -= 1.5;
    if (ex.venue.length === 1 && ex.venue[0] === ctx.venue) s += 1; // ortstypische Übungen bevorzugen
    if (ctx.light && (ex.material || []).every((m) => LIGHT.has(m))) s += 4; // Aufwärmen ohne Aufbau
    if (ctx.spread && ex.spread) s += 7; // Schwerpunkt „Verteilen statt Haufen“ (Vorbereitung Funino-Spielbetrieb)
    return s + Math.random() * 3;
  }

  const hasMaterial = (ex, material) => (ex.material || []).every((m) => material.has(m));

  // Streng: nur Übungen, für die ALLES Material vorhanden ist.
  function candidates(phase, ctx, exclude) {
    return (window.EXERCISES || []).filter(
      (ex) => !ex.retired && ex.phase === phase && ex.venue.includes(ctx.venue) && !exclude.has(ex.id) && hasMaterial(ex, ctx.material)
    );
  }

  // Ersatz-Phasen, falls für eine Phase mit dem Material nichts passt
  const FALLBACK = { abschluss: ['hauptteil', 'aufwaermen'], hauptteil: ['aufwaermen', 'abschluss'], aufwaermen: ['hauptteil'] };

  function pick(phase, ctx, exclude) {
    let list = candidates(phase, ctx, exclude);
    if (!list.length) {
      for (const alt of FALLBACK[phase] || []) { list = candidates(alt, ctx, exclude); if (list.length) break; }
    }
    list = list.map((ex) => ({ ex, s: score(ex, ctx) })).sort((a, b) => b.s - a.s);
    if (!list.length) return null;
    // Aus den besten 3 zufällig wählen – für Abwechslung
    const top = list.slice(0, 3);
    return top[Math.floor(Math.random() * top.length)].ex;
  }

  function buildContext({ venue, attendees, focus, state, count, material }) {
    const kids = state.kids.filter((k) => attendees.includes(k.id));
    const avg = avgRatings(kids);
    const recent = new Map();
    const done = state.sessions.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
    done.forEach((sess, i) =>
      sess.blocks.map((b) => b.exerciseId).concat(sess.stations || [], [sess.funinoLearn, sess.funinoPlay]).forEach((id) => { if (id && !recent.has(id)) recent.set(id, i + 1); })
    );
    return {
      venue,
      count: attendees.length || count || 0,
      avg,
      level: targetLevel(avg),
      focus: focus && focus !== 'auto' ? focus : weakestArea(avg),
      autoFocus: !focus || focus === 'auto',
      material: new Set(material || state.settings.material),
      spread: state.settings.spreadFocus !== false,
      recent,
      favorites: new Set(state.favorites),
    };
  }

  const isFunino = (id) => { const ex = (window.EXERCISES || []).find((e) => e.id === id); return !!(ex && ex.funino); };

  // Lernweg: alle 2 Trainings mit Funino eine Stufe weiter (1–4)
  function funinoStep(state) {
    const n = state.sessions.filter((s) => s.funinoLearn || s.funinoPlay || (s.stations || []).some(isFunino)).length;
    return Math.min(4, 1 + Math.floor(n / 2));
  }

  function pickFunino(type, ctx, used) {
    let list = (window.EXERCISES || []).filter((ex) => ex.funino && !ex.retired && ex.venue.includes(ctx.venue) && !used.has(ex.id) && hasMaterial(ex, ctx.material));
    const pref = list.filter((ex) => ex.funino.type === type);
    if (pref.length) list = pref;
    if (!list.length) return pick('abschluss', ctx, used);
    const target = type === 'spiel' ? 4 : ctx.funinoStep || 1;
    const scored = list.map((ex) => ({ ex, s: score(ex, ctx) - Math.abs(ex.funino.step - target) * 4 - (ex.funino.step > target ? 4 : 0) }))
      .sort((a, b) => b.s - a.s).slice(0, 2);
    return scored[Math.floor(Math.random() * scored.length)].ex;
  }

  function pickStation(i, ctx, used, mode) {
    if (mode === 'solo') return pick('hauptteil', ctx, used);
    if (i === 2) return pickFunino('lernen', ctx, used);
    const groupCtx = Object.assign({}, ctx, { count: Math.ceil((ctx.count || 9) / 3) });
    return pick(STATION_PHASES[i], groupCtx, used);
  }

  function generate({ venue, attendees, focus, state, count, material, mode, funinoStep: stepOverride }) {
    mode = mode === 'solo' ? 'solo' : 'team';
    const tpl = (mode === 'solo' ? SOLO_TEMPLATES : TEMPLATES)[venue];
    const ctx = buildContext({ venue, attendees, focus, state, count, material });
    ctx.funinoStep = stepOverride || funinoStep(state);
    const used = new Set();
    const take = (ex) => { if (ex) used.add(ex.id); return ex ? ex.id : null; };
    const stations = (mode === 'solo' ? [0] : [0, 1, 2]).map((i) => take(pickStation(i, ctx, used, mode)));
    const funinoLearn = mode === 'solo' ? take(pickFunino('lernen', ctx, used)) : null;
    const funinoPlay = take(pickFunino('spiel', ctx, used));
    const blocks = tpl.blocks.map((b) => {
      const block = Object.assign({ exerciseId: null, phase: null, key: null }, b);
      if (b.type === 'final') block.label = 'Abschlussspiel: Funino 3:3';
      return block;
    });
    return {
      id: Store.uid(),
      date: new Date().toISOString(),
      venue,
      mode,
      minutes: tpl.minutes,
      attendees: attendees.slice(),
      focus: ctx.focus,
      autoFocus: ctx.autoFocus,
      level: ctx.level,
      material: [...ctx.material],
      funinoStep: ctx.funinoStep,
      stations,
      funinoLearn,
      funinoPlay,
      blocks,
      rating: 0,
      note: '',
    };
  }

  function usedIds(plan) {
    return new Set(plan.blocks.map((b) => b.exerciseId).concat(plan.stations || [], [plan.funinoLearn, plan.funinoPlay]).filter(Boolean));
  }

  function planCtx(plan, state) {
    const ctx = buildContext({ venue: plan.venue, attendees: plan.attendees, focus: plan.autoFocus ? 'auto' : plan.focus, state, count: plan.count, material: plan.material });
    ctx.funinoStep = plan.funinoStep || funinoStep(state);
    return ctx;
  }

  function swap(plan, index, state) {
    const block = plan.blocks[index];
    if (!block || block.type !== 'ex') return null;
    const ex = pick(block.phase, Object.assign(planCtx(plan, state), { light: true }), usedIds(plan));
    block.exerciseId = ex ? ex.id : null;
    return ex;
  }

  function swapStation(plan, i, state) {
    if (!plan.stations) return null;
    const ex = pickStation(i, planCtx(plan, state), usedIds(plan), plan.mode);
    plan.stations[i] = ex ? ex.id : null;
    return ex;
  }

  // which: 'learn' | 'play'
  function swapFunino(plan, which, state) {
    const ex = pickFunino(which === 'learn' ? 'lernen' : 'spiel', planCtx(plan, state), usedIds(plan));
    plan[which === 'learn' ? 'funinoLearn' : 'funinoPlay'] = ex ? ex.id : null;
    return ex;
  }

  window.Generator = { SPREAD_CALLS, TEMPLATES, SOLO_TEMPLATES, FUNINO_RULES, RITUALS, STATION_PHASES, funinoStep, generate, swap, swapStation, swapFunino, hasMaterial, avgRatings, targetLevel, weakestArea };
})();
