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
      },
      kids: [],
      sessions: [],
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

  function importJSON(text) {
    const data = JSON.parse(text);
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
    load, save, uid, exportJSON, importJSON, reset,
    get state() { return state; },
  };
})();
