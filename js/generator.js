/* Trainingsgenerator: stellt aus der Übungsbibliothek eine Einheit nach DFB-Bambini-Aufbau zusammen. */
(function () {
  // Aufbau der Einheiten (siehe docs/DFB-KONZEPT.md)
  const TEMPLATES = {
    halle: {
      label: 'Halle',
      minutes: 60,
      blocks: [
        { type: 'ritual', key: 'begruessung', label: 'Ankommen & Begrüßung', minutes: 5 },
        { type: 'ex', phase: 'aufwaermen', label: 'Aktivierung / Spielgeschichte', minutes: 10 },
        { type: 'ex', phase: 'hauptteil', label: 'Spielphase 1', minutes: 15 },
        { type: 'ex', phase: 'hauptteil', label: 'Zwischenblock', minutes: 10 },
        { type: 'ex', phase: 'abschluss', label: 'Spielphase 2 (2:2 auf Minitore)', minutes: 15 },
        { type: 'ritual', key: 'verabschiedung', label: 'Abschlusskreis & Ritual', minutes: 5 },
      ],
    },
    draussen: {
      label: 'Draußen',
      minutes: 90,
      blocks: [
        { type: 'ritual', key: 'begruessung', label: 'Ankommen & Begrüßung', minutes: 5 },
        { type: 'ex', phase: 'aufwaermen', label: 'Tummelphase', minutes: 10 },
        { type: 'ex', phase: 'aufwaermen', label: 'Aktivierung / Spielgeschichte', minutes: 10 },
        { type: 'pause', key: 'trinken', label: 'Trinkpause', minutes: 5 },
        { type: 'ex', phase: 'hauptteil', label: 'Spielphase 1', minutes: 20 },
        { type: 'pause', key: 'trinken', label: 'Trinkpause', minutes: 5 },
        { type: 'ex', phase: 'hauptteil', label: 'Zwischenblock', minutes: 10 },
        { type: 'ex', phase: 'abschluss', label: 'Spielphase 2 (2:2/3:3 Mini-Festival)', minutes: 15 },
        { type: 'ritual', key: 'freispiel', label: 'Freispiel / Wunschspiel', minutes: 5 },
        { type: 'ritual', key: 'verabschiedung', label: 'Abschlusskreis & Ritual', minutes: 5 },
      ],
    },
  };

  const RITUALS = {
    begruessung: {
      title: 'Begrüßung & Ritual',
      text: 'Alle Kinder im Kreis begrüßen, jedes Kind beim Namen nennen. Kurz erzählen, was heute passiert (eine Geschichte, z. B. „Heute sind wir Piraten“). Gemeinsamer Teamruf.',
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
      title: 'Abschlusskreis',
      text: 'Im Kreis zusammenkommen: Was war heute toll? Jedes Kind bekommt ein Abklatschen. Teamruf und Verabschiedung bis zum nächsten Mal.',
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
    kids.forEach((kid) => areas.forEach((k) => (sum[k] += (kid.ratings && kid.ratings[k]) || 3)));
    areas.forEach((k) => (sum[k] = sum[k] / kids.length));
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
    return s + Math.random() * 3;
  }

  const hasMaterial = (ex, material) => (ex.material || []).every((m) => material.has(m));

  // Streng: nur Übungen, für die ALLES Material vorhanden ist.
  function candidates(phase, ctx, exclude) {
    return (window.EXERCISES || []).filter(
      (ex) => ex.phase === phase && ex.venue.includes(ctx.venue) && !exclude.has(ex.id) && hasMaterial(ex, ctx.material)
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
      sess.blocks.forEach((b) => { if (b.exerciseId && !recent.has(b.exerciseId)) recent.set(b.exerciseId, i + 1); })
    );
    return {
      venue,
      count: attendees.length || count || 0,
      avg,
      level: targetLevel(avg),
      focus: focus && focus !== 'auto' ? focus : weakestArea(avg),
      autoFocus: !focus || focus === 'auto',
      material: new Set(material || state.settings.material),
      recent,
      favorites: new Set(state.favorites),
    };
  }

  function generate({ venue, attendees, focus, state, count, material }) {
    const tpl = TEMPLATES[venue];
    const ctx = buildContext({ venue, attendees, focus, state, count, material });
    const used = new Set();
    const blocks = tpl.blocks.map((b) => {
      const block = { type: b.type, label: b.label, minutes: b.minutes, phase: b.phase || null, key: b.key || null, exerciseId: null };
      if (b.type === 'ex') {
        const ex = pick(b.phase, ctx, used);
        if (ex) { block.exerciseId = ex.id; used.add(ex.id); }
      }
      return block;
    });
    return {
      id: Store.uid(),
      date: new Date().toISOString(),
      venue,
      minutes: tpl.minutes,
      attendees: attendees.slice(),
      focus: ctx.focus,
      autoFocus: ctx.autoFocus,
      level: ctx.level,
      material: [...ctx.material],
      blocks,
      rating: 0,
      note: '',
    };
  }

  function swap(plan, index, state) {
    const block = plan.blocks[index];
    if (!block || block.type !== 'ex') return null;
    const ctx = buildContext({ venue: plan.venue, attendees: plan.attendees, focus: plan.autoFocus ? 'auto' : plan.focus, state, count: plan.count, material: plan.material });
    const used = new Set(plan.blocks.map((b) => b.exerciseId).filter(Boolean));
    const ex = pick(block.phase, ctx, used);
    block.exerciseId = ex ? ex.id : null;
    return ex;
  }

  window.Generator = { TEMPLATES, RITUALS, generate, swap, hasMaterial, avgRatings, targetLevel, weakestArea };
})();
