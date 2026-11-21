/* Lokale Datenhaltung (localStorage) – alle Daten bleiben auf dem Gerät.
 * - Alle Daten werden beim Laden/Import normalisiert (Schutz vor kaputten oder manipulierten Dateien).
 * - Vor Import/Reset und bei unlesbaren Daten wird eine Sicherung unter KEY.bak abgelegt.
 * - save() meldet Fehler (z. B. Speicher voll) über Store.onSaveError.
 */
(function () {
  const KEY = 'g1trainer.v1';
  const BAK = KEY + '.bak';

  const AREAS = [
    { key: 'ballgefuehl', label: 'Ballgefühl', icon: '⚽' },
    { key: 'koordination', label: 'Koordination', icon: '🤸' },
    { key: 'laufen', label: 'Laufen', icon: '🏃' },
    { key: 'sozial', label: 'Sozial', icon: '🤝' },
  ];
  const AREA_KEYS = AREAS.map((a) => a.key);

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
  const MAT_KEYS = MATERIAL.map((m) => m.key);

  function defaults() {
    return {
      version: 2,
      settings: {
        club: '1. FC Hochstadt',
        team: 'G-Jugend (Bambini)',
        material: MAT_KEYS.slice(),
        sound: true,
        trainingDay: 3,
      },
      kids: [],
      sessions: [],
      planned: [],
      favorites: [],
      liveTimer: null,
    };
  }

  /* ---------- Normalisierung ---------- */
  const str = (v, max) => (v == null ? '' : String(v)).slice(0, max || 500);
  const safeId = (v) => { const s = str(v, 64).replace(/[^A-Za-z0-9_-]/g, ''); return s || uid(); };
  const isDay = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v.slice(0, 10));
  const isoOrNull = (v) => (typeof v === 'string' && !isNaN(Date.parse(v)) ? v.slice(0, 30) : null);
  const int = (v, min, max) => { const n = parseInt(v, 10); return isNaN(n) ? null : Math.min(max, Math.max(min, n)); };
  const exId = (v) => (v == null ? null : str(v, 64).replace(/[^A-Za-z0-9_-]/g, '') || null);

  function normRatings(r) {
    if (!r || typeof r !== 'object') return null;
    const out = {};
    let any = false;
    AREA_KEYS.forEach((k) => { const n = int(r[k], 1, 5); out[k] = n; if (n) any = true; });
    return any ? out : null;
  }

  function normKid(k) {
    if (!k || typeof k !== 'object' || !str(k.name).trim()) return null;
    const kid = {
      id: safeId(k.id),
      name: str(k.name, 80).trim(),
      birthdate: isDay(k.birthdate) ? k.birthdate.slice(0, 10) : '',
      year: int(k.year, 2000, 2100),
      ratings: normRatings(k.ratings),
      note: str(k.note, 2000),
      active: k.active !== false,
      eligible: k.eligible === false ? false : (k.eligible === true ? true : null),
      updatedAt: isoOrNull(k.updatedAt),
      createdAt: isoOrNull(k.createdAt),
      history: Array.isArray(k.history) ? k.history.map((h) => h && ({ date: isoOrNull(h.date), ratings: normRatings(h.ratings) })).filter((h) => h && h.date && h.ratings).slice(-200) : [],
      notes: Array.isArray(k.notes) ? k.notes.map((n) => n && ({ date: isoOrNull(n.date), text: str(n.text, 500) })).filter((n) => n && n.date && n.text).slice(-200) : [],
    };
    if (k.team === 'G1' || k.team === 'G2') kid.team = k.team;
    if (!kid.createdAt) delete kid.createdAt;
    if (!kid.year && kid.birthdate) kid.year = +kid.birthdate.slice(0, 4);
    if (kid.eligible === null) kid.eligible = true;
    return kid;
  }

  const BLOCK_TYPES = ['ritual', 'ex', 'station', 'pause', 'final', 'single', 'funino-learn', 'funino-play'];
  function normBlock(b) {
    if (!b || !BLOCK_TYPES.includes(b.type)) return null;
    return {
      type: b.type,
      label: str(b.label, 80),
      minutes: int(b.minutes, 1, 120) || 5,
      phase: ['aufwaermen', 'hauptteil', 'abschluss'].includes(b.phase) ? b.phase : null,
      key: ['aufbau', 'begruessung', 'trinken', 'verabschiedung', 'freispiel'].includes(b.key) ? b.key : null,
      round: int(b.round, 1, 3),
      exerciseId: exId(b.exerciseId),
    };
  }

  function normPlan(p) {
    if (!p || typeof p !== 'object') return null;
    const blocks = Array.isArray(p.blocks) ? p.blocks.map(normBlock).filter(Boolean) : [];
    if (!blocks.length) return null;
    const ids = (a) => (Array.isArray(a) ? a.map((x) => str(x, 64).replace(/[^A-Za-z0-9_-]/g, '')).filter(Boolean) : null);
    const plan = {
      id: safeId(p.id),
      day: isDay(p.day) ? p.day.slice(0, 10) : (isoOrNull(p.date) ? p.date.slice(0, 10) : new Date().toISOString().slice(0, 10)),
      date: isoOrNull(p.date),
      venue: p.venue === 'draussen' ? 'draussen' : 'halle',
      mode: p.mode === 'solo' ? 'solo' : (p.mode === 'team' ? 'team' : undefined),
      minutes: int(p.minutes, 1, 300),
      attendees: ids(p.attendees),
      withG2: !!p.withG2,
      count: int(p.count, 0, 99),
      focus: AREA_KEYS.includes(p.focus) ? p.focus : null,
      autoFocus: p.autoFocus !== false,
      level: int(p.level, 1, 3) || 2,
      material: Array.isArray(p.material) ? p.material.filter((m) => MAT_KEYS.includes(m)) : null,
      funinoStep: int(p.funinoStep, 1, 4),
      stations: Array.isArray(p.stations) ? p.stations.map(exId) : undefined,
      funinoLearn: exId(p.funinoLearn),
      funinoPlay: exId(p.funinoPlay),
      blocks,
      setupDone: p.setupDone && typeof p.setupDone === 'object' ? Object.fromEntries(Object.entries(p.setupDone).filter(([k]) => /^[a-z0-9]{1,4}$/.test(k)).map(([k, v]) => [k, !!v])) : {},
      groupOverride: Array.isArray(p.groupOverride) ? p.groupOverride.slice(0, 3).map((g) => ids(g) || []) : null,
      rating: int(p.rating, 0, 4) || 0,
      note: str(p.note, 2000),
    };
    if (!plan.mode) delete plan.mode;
    if (!plan.stations) delete plan.stations;
    if (!plan.material) delete plan.material;
    return plan;
  }

  function normState(data) {
    const d = defaults();
    const st = d;
    const src = data && typeof data === 'object' ? data : {};
    const s = src.settings && typeof src.settings === 'object' ? src.settings : {};
    st.settings = {
      club: str(s.club, 80) || d.settings.club,
      team: str(s.team, 80) || d.settings.team,
      material: Array.isArray(s.material) ? s.material.filter((m) => MAT_KEYS.includes(m)) : d.settings.material,
      sound: s.sound !== false,
      trainingDay: int(s.trainingDay, 0, 6) == null ? 3 : int(s.trainingDay, 0, 6),
      g1Year: int(s.g1Year, 2000, 2100),
      chantStart: s.chantStart != null ? str(s.chantStart, 400) : undefined,
      chantEnd: s.chantEnd != null ? str(s.chantEnd, 400) : undefined,
      lastMode: s.lastMode === 'team' ? 'team' : (s.lastMode === 'solo' ? 'solo' : undefined),
      lastExport: isoOrNull(s.lastExport),
      g2Removed: !!s.g2Removed || undefined,
      spreadFocus: s.spreadFocus !== false,
    };
    Object.keys(st.settings).forEach((k) => st.settings[k] === undefined && delete st.settings[k]);
    if (!st.settings.g1Year) delete st.settings.g1Year;
    st.kids = (Array.isArray(src.kids) ? src.kids : []).map(normKid).filter(Boolean);
    st.sessions = (Array.isArray(src.sessions) ? src.sessions : []).map(normPlan).filter(Boolean)
      .map((x) => { x.attendees = x.attendees || []; x.date = x.date || x.day + 'T12:00:00'; return x; });
    st.planned = (Array.isArray(src.planned) ? src.planned : []).map(normPlan).filter(Boolean);
    if (src.draft) { const dp = normPlan(src.draft); if (dp) { dp.attendees = null; st.planned.push(dp); } }
    st.favorites = (Array.isArray(src.favorites) ? src.favorites : []).map(exId).filter(Boolean);
    const lt = src.liveTimer;
    st.liveTimer = lt && typeof lt === 'object' && str(lt.planId) ? {
      planId: str(lt.planId, 64), idx: int(lt.idx, 0, 50) || 0, running: !!lt.running,
      endsAt: typeof lt.endsAt === 'number' ? lt.endsAt : null, remaining: typeof lt.remaining === 'number' ? lt.remaining : 0,
      rem: lt.rem && typeof lt.rem === 'object' ? Object.fromEntries(Object.entries(lt.rem).filter(([k, v]) => /^\d+$/.test(k) && typeof v === 'number')) : {},
      startedAt: typeof lt.startedAt === 'number' ? lt.startedAt : Date.now(),
    } : null;
    // Migration: unveränderte 3er-Standardwerte = noch nicht bewertet
    st.kids.forEach((k) => {
      if (k.ratings && !k.updatedAt && !k.history.length && AREA_KEYS.every((a) => k.ratings[a] === 3)) k.ratings = null;
    });
    return st;
  }

  /* ---------- Fotos (separat gespeichert, nur auf diesem Gerät) ---------- */
  const PHOTOS = KEY + '.photos';
  const PHOTO_RE = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
  let photos = null;
  function loadPhotos() {
    if (photos) return photos;
    try { photos = JSON.parse(localStorage.getItem(PHOTOS) || '{}') || {}; } catch (e) { photos = {}; }
    return photos;
  }
  function getPhoto(id) { const v = loadPhotos()[id]; return typeof v === 'string' && v.length < 400000 && PHOTO_RE.test(v) ? v : null; }
  function setPhoto(id, url) {
    loadPhotos();
    if (url && PHOTO_RE.test(url)) photos[id] = url; else delete photos[id];
    try { localStorage.setItem(PHOTOS, JSON.stringify(photos)); return true; } catch (e) { if (api.onSaveError) api.onSaveError(e); return false; }
  }
  function importPhotos(obj) {
    if (!obj || typeof obj !== 'object') return;
    loadPhotos();
    Object.entries(obj).forEach(([id, url]) => { if (/^[A-Za-z0-9_-]{1,64}$/.test(id) && typeof url === 'string' && url.length < 400000 && PHOTO_RE.test(url)) photos[id] = url; });
    try { localStorage.setItem(PHOTOS, JSON.stringify(photos)); } catch (e) { /* */ }
  }

  /* ---------- Laden / Speichern ---------- */
  let state = null;
  let loadProblem = null;
  const api = { onSaveError: null };

  function load() {
    let raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { loadProblem = 'Speicher nicht verfügbar (privater Modus?)'; }
    if (raw) {
      try {
        state = normState(JSON.parse(raw));
        return state;
      } catch (e) {
        // Unlesbar: Rohdaten sichern, nicht überschreiben
        try { localStorage.setItem(KEY + '.corrupt.' + Date.now(), raw); } catch (e2) { /* */ }
        loadProblem = 'Gespeicherte Daten waren beschädigt und wurden gesichert. Bitte eine Export-Datei importieren.';
      }
    }
    state = normState(null);
    return state;
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      console.warn('Speichern fehlgeschlagen', e);
      if (api.onSaveError) api.onSaveError(e);
      return false;
    }
  }

  function backup() {
    try { localStorage.setItem(BAK, JSON.stringify(Object.assign({ backupAt: new Date().toISOString() }, state))); return true; } catch (e) { return false; }
  }
  function hasBackup() { try { return !!localStorage.getItem(BAK); } catch (e) { return false; } }
  function backupInfo() { try { const b = JSON.parse(localStorage.getItem(BAK)); return b && b.backupAt; } catch (e) { return null; } }
  function restoreBackup() {
    const raw = localStorage.getItem(BAK);
    if (!raw) throw new Error('Keine Sicherung vorhanden.');
    const cur = JSON.stringify(state);
    state = normState(JSON.parse(raw));
    save();
    try { localStorage.setItem(BAK, cur); } catch (e) { /* */ }
    return state;
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function exportJSON() {
    state.settings.lastExport = new Date().toISOString();
    save();
    const ids = new Set(state.kids.map((k) => k.id));
    const ph = Object.fromEntries(Object.entries(loadPhotos()).filter(([id]) => ids.has(id)));
    return JSON.stringify(Object.assign({ type: 'g1-backup', exportedAt: new Date().toISOString() }, state, { photos: ph }), null, 2);
  }

  /* ---------- Kinderliste teilen ---------- */
  const KIDS_TYPE = 'g1-kinderliste';

  function exportKidsJSON() {
    state.settings.lastExport = new Date().toISOString();
    save();
    return JSON.stringify({
      type: KIDS_TYPE, version: 2, exportedAt: new Date().toISOString(),
      kids: state.kids.map((k) => ({
        name: k.name, birthdate: k.birthdate || '', year: k.year || null, team: 'G1', eligible: k.eligible !== false,
        ratings: k.ratings, note: k.note || '', active: k.active !== false, updatedAt: k.updatedAt || null, history: k.history || [], notes: k.notes || [],
      })),
    }, null, 2);
  }

  function isKidsFile(data) {
    return data && data.type === KIDS_TYPE && Array.isArray(data.kids);
  }

  // Ergänzt neue Kinder, aktualisiert vorhandene – bei Bewertungen gewinnt der neuere Stand.
  // G1-Jahrgang der laufenden Saison (Saisonbeginn Juli): 2026/27 → 2020
  const seasonG1Year = () => { const n = new Date(); return (n.getMonth() >= 6 ? n.getFullYear() : n.getFullYear() - 1) - 6; };
  function mergeKids(data) {
    const norm = (n) => String(n || '').trim().toLowerCase().replace(/\s+/g, ' ');
    let added = 0, updated = 0, skipped = 0;
    const noElig = [];
    const g1 = (state.settings && state.settings.g1Year) || seasonG1Year();
    data.kids.forEach((raw) => {
      const src = normKid(raw);
      if (!src) return;
      if (src.team === 'G2' || (src.team !== 'G1' && src.year && src.year > g1)) { skipped++; return; }
      delete src.team;
      if (raw.eligible === undefined) noElig.push(src.name);
      const ex = state.kids.find((k) => norm(k.name) === norm(src.name));
      // 3er-Platzhalter ohne Datum = nicht bewertet (nie echte Bewertungen überschreiben)
      if (src.ratings && !src.updatedAt && !src.history.length && AREA_KEYS.every((k) => src.ratings[k] === 3)) src.ratings = null;
      if (!ex) {
        src.id = uid();
        state.kids.push(src);
        added++;
        return;
      }
      if (src.birthdate) ex.birthdate = src.birthdate;
      if (src.year) ex.year = src.year;
      if (src.team) ex.team = src.team;
      if (raw.eligible !== undefined) ex.eligible = src.eligible;
      if (raw.active !== undefined) ex.active = src.active;
      const srcNewer = src.updatedAt && (!ex.updatedAt || src.updatedAt > ex.updatedAt);
      if (src.ratings && (srcNewer || !ex.ratings)) { ex.ratings = src.ratings; ex.updatedAt = src.updatedAt || ex.updatedAt; }
      if (src.note && (srcNewer || !ex.note)) ex.note = src.note;
      const seen = new Set(ex.history.map((h) => h.date));
      src.history.forEach((h) => { if (!seen.has(h.date)) ex.history.push(h); });
      ex.history.sort((a, b) => a.date.localeCompare(b.date));
      const seenN = new Set(ex.notes.map((n) => n.date + n.text));
      src.notes.forEach((n) => { if (!seenN.has(n.date + n.text)) ex.notes.push(n); });
      ex.notes.sort((a, b) => a.date.localeCompare(b.date));
      updated++;
    });
    save();
    return { added, updated, skipped, noElig };
  }

  function importJSON(text) {
    const data = JSON.parse(text);
    if (isKidsFile(data)) { backup(); return mergeKids(data); }
    if (!data || !Array.isArray(data.kids) || !Array.isArray(data.sessions)) {
      throw new Error('Datei ist kein G1-Trainer-Export.');
    }
    backup();
    state = normState(data);
    save();
    importPhotos(data.photos);
    return state;
  }

  function reset() {
    backup();
    state = normState(null);
    save();
    return state;
  }

  // Bewertung setzen und Historie fortschreiben (max. 1 Eintrag pro Tag)
  function setRatings(kid, ratings) {
    const r = normRatings(ratings);
    if (!r || JSON.stringify(r) === JSON.stringify(kid.ratings)) return false;
    const now = new Date().toISOString();
    kid.history = kid.history || [];
    if (!kid.history.length && kid.ratings) kid.history.push({ date: kid.updatedAt || now, ratings: kid.ratings });
    const last = kid.history[kid.history.length - 1];
    if (last && last.date.slice(0, 10) === now.slice(0, 10)) last.ratings = r;
    else kid.history.push({ date: now, ratings: r });
    kid.ratings = r;
    kid.updatedAt = now;
    return true;
  }

  function requestPersist() {
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {}); } catch (e) { /* */ }
  }

  Object.assign(api, {
    KEY, AREAS, AREA_KEYS, MATERIAL,
    load, save, uid, exportJSON, exportKidsJSON, importJSON, isKidsFile, reset,
    backup, hasBackup, backupInfo, restoreBackup, setRatings, normKid, requestPersist, getPhoto, setPhoto,
  });
  Object.defineProperty(api, 'state', { get: () => state });
  Object.defineProperty(api, 'loadProblem', { get: () => loadProblem });
  window.Store = api;
})();
