/* Lokale Datenhaltung (localStorage) – alle Daten bleiben auf dem Gerät. */
(function () {
  const KEY = 'g1trainer.v1';

  const AREAS = [
    { key: 'ballgefuehl', label: 'Ballgefühl', icon: '⚽' },
    { key: 'koordination', label: 'Koordination', icon: '🤸' },
    { key: 'laufen', label: 'Laufen', icon: '🏃' },
    { key: 'sozial', label: 'Sozial & Konzentration', icon: '🤝' },
  ];

  const MATERIAL = [
    { key: 'huetchen', label: 'Hütchen' },
    { key: 'baelle', label: 'Bälle' },
    { key: 'minitore', label: 'Minitore' },
    { key: 'leibchen', label: 'Leibchen' },
    { key: 'reifen', label: 'Reifen' },
    { key: 'stangen', label: 'Stangen' },
    { key: 'baenke', label: 'Langbänke' },
    { key: 'matten', label: 'Matten' },
    { key: 'kaesten', label: 'Kästen' },
  ];

  function defaults() {
    return {
      version: 1,
      settings: {
        club: '1. FC Hochstadt',
        team: 'G-Jugend (Bambini)',
        material: MATERIAL.map((m) => m.key),
        sound: true,
        trainingDay: 3,
      },
      kids: [],
      sessions: [],
      planned: [],
      favorites: [],
      draft: null,
    };
  }

  let state = null;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const d = defaults();
        state = Object.assign(d, parsed);
        state.settings = Object.assign(d.settings, parsed.settings || {});
        return state;
      }
    } catch (e) {
      console.warn('Laden fehlgeschlagen', e);
    }
    state = defaults();
    return state;
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      console.warn('Speichern fehlgeschlagen', e);
      return false;
    }
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function exportJSON() {
    return JSON.stringify(Object.assign({ exportedAt: new Date().toISOString() }, state), null, 2);
  }

  // Reine Kinderliste (z. B. vom 2. Trainer): ergänzt bzw. aktualisiert Kinder, alles andere bleibt.
  const KIDS_TYPE = 'g1-kinderliste';

  function exportKidsJSON() {
    return JSON.stringify({
      type: KIDS_TYPE, version: 1, exportedAt: new Date().toISOString(),
      kids: state.kids.map((k) => ({ name: k.name, birthdate: k.birthdate || '', year: k.year || null, eligible: k.eligible !== false, age: k.age || null, ratings: k.ratings, note: k.note || '', active: k.active !== false })),
    }, null, 2);
  }

  function isKidsFile(data) {
    return data && data.type === KIDS_TYPE && Array.isArray(data.kids);
  }

  function mergeKids(data) {
    const norm = (n) => String(n || '').trim().toLowerCase().replace(/\s+/g, ' ');
    let added = 0, updated = 0;
    data.kids.forEach((src) => {
      if (!src || !src.name) return;
      const ex = state.kids.find((k) => norm(k.name) === norm(src.name));
      const ratings = Object.assign({ ballgefuehl: 3, koordination: 3, laufen: 3, sozial: 3 }, src.ratings || {});
      if (ex) {
        if (src.birthdate) ex.birthdate = src.birthdate;
        if (src.year) ex.year = src.year;
        if (typeof src.eligible === 'boolean') ex.eligible = src.eligible;
        if (src.ratings) ex.ratings = ratings;
        if (src.note) ex.note = src.note;
        updated++;
      } else {
        state.kids.push({
          id: uid(), name: String(src.name).trim(), birthdate: src.birthdate || '', year: src.year || null,
          eligible: typeof src.eligible === 'boolean' ? src.eligible : true, age: src.age || null,
          ratings, note: src.note || '', active: src.active !== false,
        });
        added++;
      }
    });
    save();
    return { added, updated };
  }

  function importJSON(text) {
    const data = JSON.parse(text);
    if (isKidsFile(data)) return mergeKids(data);
    if (!data || !Array.isArray(data.kids) || !Array.isArray(data.sessions)) {
      throw new Error('Datei ist kein G1-Trainer-Export.');
    }
    const d = defaults();
    state = Object.assign(d, data);
    state.settings = Object.assign(d.settings, data.settings || {});
    delete state.exportedAt;
    save();
    return state;
  }

  function reset() {
    state = defaults();
    save();
    return state;
  }

  window.Store = {
    KEY, AREAS, MATERIAL,
    load, save, uid, exportJSON, exportKidsJSON, importJSON, isKidsFile, reset,
    get state() { return state; },
  };
})();
