/* G1 Trainer – App-Logik (Ansichten, Interaktion, Timer) */
(function () {
  'use strict';

  const state = Store.load();
  const AREAS = Store.AREAS;
  const PHASES = { aufwaermen: 'Aufwärmen', hauptteil: 'Hauptteil', abschluss: 'Abschlussspiel' };
  const VENUES = { halle: 'Halle', draussen: 'Draußen' };
  const FOCUS = { ballgefuehl: 'Ballgefühl', koordination: 'Koordination', laufen: 'Laufen', sozial: 'Sozial', torschuss: 'Torschuss' };
  const MAT = Object.fromEntries(Store.MATERIAL.map((m) => [m.key, m.label]));
  const MAT_ICON = { huetchen: '🔺', baelle: '⚽', minitore: '🥅', leibchen: '🎽', reifen: '⭕', stangen: '📍', baenke: '🪑', matten: '🟦', kaesten: '📦' };
  const LEVEL = { 1: 'Einstieg', 2: 'Mittel', 3: 'Fortgeschritten' };

  const EX = {};
  (window.EXERCISES || []).forEach((e) => (EX[e.id] = e));
  const ACTIVE_EX = (window.EXERCISES || []).filter((e) => !e.retired);

  const $view = document.getElementById('view');
  const $modal = document.getElementById('modal');
  let $modalBody = document.getElementById('modalBody');

  // Nicht gespeicherter UI-Zustand
  const month = new Date().getMonth();
  const ui = {
    venue: month >= 10 || month <= 2 ? 'halle' : 'draussen', // Nov–März Halle
    focus: 'auto',
    attend: null, // Set der anwesenden Kind-IDs
    guestCount: 8,
    exVenue: 'alle',
    exPhase: 'alle',
    exFav: false,
    exSearch: '',
    kidYear: 'alle',
    kidTeam: 'alle',
    withG2: false,
    mode: 'solo',
    kidElig: 'alle',
    openPlan: null,
    newPlan: false,
    newDay: null,
    material: null, // Material-Auswahl beim Planen
  };

  let viewCtrls = [];
  let modalCtrls = [];

  /* ---------- Helfer ---------- */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const save = () => Store.save();
  const activeKids = () => state.kids.filter((k) => k.active !== false).sort((a, b) => a.name.localeCompare(b.name, 'de'));
  const kidById = (id) => state.kids.find((k) => k.id === id);
  const isFav = (id) => state.favorites.includes(id);

  function fmtDate(iso, opts) {
    return new Date(iso).toLocaleDateString('de-DE', opts || { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => (t.hidden = true), 2200);
  }

  const COLORS = ['#7c3aed', '#db2777', '#2563eb', '#059669', '#d97706', '#dc2626', '#0891b2', '#9333ea', '#65a30d'];
  function avatarColor(name) {
    let h = 0;
    for (const c of name || '?') h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return COLORS[h % COLORS.length];
  }
  function initials(name) {
    return (name || '?').trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }

  function starsRO(v) {
    if (v == null) return '<span class="tag unrated">nicht bewertet</span>';
    const r = Math.round(v);
    let s = '<span class="stars ro">';
    for (let i = 1; i <= 5; i++) s += `<span class="${i <= r ? 'on' : ''}">★</span>`;
    return s + '</span>';
  }

  function starsInput(area, v) {
    let s = `<span class="stars" data-area="${area}">`;
    for (let i = 1; i <= 5; i++) s += `<button type="button" data-star="${i}" class="${i <= v ? 'on' : ''}" aria-label="${i} Sterne">★</button>`;
    return s + '</span>';
  }

  function ageOf(k) {
    if (k.birthdate) {
      const b = new Date(k.birthdate + 'T00:00:00'), n = new Date();
      if (isNaN(b)) return k.age || null;
      let a = n.getFullYear() - b.getFullYear();
      const m = n.getMonth() - b.getMonth();
      if (m < 0 || (m === 0 && n.getDate() < b.getDate())) a--;
      return a;
    }
    return k.age || null;
  }
  const yearOf = (k) => (k.birthdate ? +k.birthdate.slice(0, 4) : (k.year ? +k.year : null));
  const yearsOf = (kids) => [...new Set(kids.map(yearOf).filter(Boolean))].sort();

  function kidAvg(kid) {
    if (!kid.ratings) return null;
    const vals = AREAS.map((a) => kid.ratings[a.key]).filter(Boolean);
    return vals.length ? vals.reduce((x, y) => x + y, 0) / vals.length : null;
  }
  const kidAvgOr3 = (kid) => (kidAvg(kid) == null ? 3 : kidAvg(kid));

  function venueTags(ex) {
    return ex.venue.map((v) => `<span class="tag ${v}">${VENUES[v]}</span>`).join(' ');
  }

  function animBox(ex, auto) {
    if (!ex || !ex.animation) return '';
    return `<div class="anim" data-anim="${esc(ex.id)}" data-auto="${auto ? 1 : 0}"></div>`;
  }

  function mountAnims(root, bucket) {
    if (!window.Animator) return;
    root.querySelectorAll('[data-anim]').forEach((el) => {
      const ex = EX[el.dataset.anim];
      if (!ex) return;
      try {
        const ctrl = Animator.create(el, ex.animation, { autoplay: el.dataset.auto === '1', speed: 1 });
        el._ctrl = ctrl;
        bucket.push(ctrl);
      } catch (e) {
        console.warn('Animation fehlgeschlagen', ex.id, e);
      }
    });
  }

  function destroyAll(bucket) {
    bucket.forEach((c) => { try { c.destroy(); } catch (e) { /* ignore */ } });
    bucket.length = 0;
  }

  /* ---------- Modal ---------- */
  function openModal(html, onMount) {
    destroyAll(modalCtrls);
    const fresh = $modalBody.cloneNode(false); // entfernt alle alten Listener
    $modalBody.replaceWith(fresh);
    $modalBody = fresh;
    $modalBody.innerHTML = html;
    $modal.hidden = false;
    document.body.style.overflow = 'hidden';
    mountAnims($modalBody, modalCtrls);
    if (onMount) onMount($modalBody);
    $modal.querySelector('.modal-sheet').scrollTop = 0;
  }
  function closeModal() {
    destroyAll(modalCtrls);
    $modal.hidden = true;
    $modalBody.innerHTML = '';
    document.body.style.overflow = '';
  }
  $modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$modal.hidden) closeModal(); });

  /* ---------- Router ---------- */
  const ROUTES = { training: renderTraining, kinder: renderKinder, uebungen: renderUebungen, verlauf: renderVerlauf, mehr: renderMehr };

  function route() {
    const tab = (location.hash || '#training').slice(1);
    const fn = ROUTES[tab] || renderTraining;
    document.querySelectorAll('#tabs a').forEach((a) => a.classList.toggle('active', a.dataset.tab === (ROUTES[tab] ? tab : 'training')));
    destroyAll(viewCtrls);
    $view.innerHTML = fn();
    mountAnims($view, viewCtrls);
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  document.getElementById('tabs').addEventListener('click', (e) => {
    const a = e.target.closest('[data-tab="training"]');
    if (a && location.hash === '#training') { ui.openPlan = null; ui.newPlan = false; rerender(); }
  });

  function rerender() {
    const y = window.scrollY;
    destroyAll(viewCtrls);
    const tab = (location.hash || '#training').slice(1);
    $view.innerHTML = (ROUTES[tab] || renderTraining)();
    mountAnims($view, viewCtrls);
    window.scrollTo(0, y);
  }

  /* =========================================================
     TRAINING – im Voraus planen, Anwesenheit am Trainingstag
     ========================================================= */
  const WEEKDAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const isoDay = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const todayIso = () => isoDay(new Date());
  const parseDay = (s) => new Date(String(s || '').slice(0, 10) + 'T12:00:00');
  function fmtDay(s, long) {
    return parseDay(s).toLocaleDateString('de-DE', long
      ? { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }
      : { weekday: 'short', day: '2-digit', month: '2-digit' });
  }
  function relDay(s) {
    const diff = Math.round((parseDay(s) - parseDay(todayIso())) / 86400000);
    if (diff === 0) return 'heute';
    if (diff === 1) return 'morgen';
    if (diff > 1) return `in ${diff} Tagen`;
    return diff === -1 ? 'gestern' : `vor ${-diff} Tagen`;
  }
  // Nov–März Halle, sonst draußen
  const defaultVenueFor = (day) => { const m = parseDay(day).getMonth(); return m >= 10 || m <= 2 ? 'halle' : 'draussen'; };
  function nextFreeDay() {
    const wd = state.settings.trainingDay == null ? 3 : +state.settings.trainingDay;
    const taken = new Set(state.planned.map((p) => p.day).concat(state.sessions.map((s) => (s.day || s.date || '').slice(0, 10))));
    const d = new Date(); d.setHours(12, 0, 0, 0);
    for (let i = 0; i < 200; i++) {
      if (d.getDay() === wd && !taken.has(isoDay(d))) return isoDay(d);
      d.setDate(d.getDate() + 1);
    }
    return todayIso();
  }
  const plannedSorted = () => state.planned.slice().sort((a, b) => a.day.localeCompare(b.day));
  const planById = (id) => state.planned.find((p) => p.id === id);
  // G1/G2: Standard nach Jahrgang (Jahrgang <= g1Year = G1), pro Kind überschreibbar
  // Saison beginnt im Juli: in der Saison 2026/27 ist Jahrgang 2020 die G1 (ältere Bambini)
  const seasonG1Year = () => { const n = new Date(); return (n.getMonth() >= 6 ? n.getFullYear() : n.getFullYear() - 1) - 6; };
  const g1Year = () => +(state.settings.g1Year || seasonG1Year());
  const teamOf = (k) => k.team || (yearOf(k) && yearOf(k) > g1Year() ? 'G2' : 'G1');
  const planKids = (plan) => activeKids().filter((k) => teamOf(k) === 'G1' || (plan && plan.withG2));
  const expectedIds = (plan) => planKids(plan).map((k) => k.id);
  const planCount = (plan) => (plan.attendees ? plan.attendees.length : (expectedIds(plan).length || plan.count || 0));

  // Gruppen A/B/C – homogen nach Jahrgang und Leistung (DFB: nach Entwicklungsstand)
  const GROUPS = [{ key: 'A', color: '#ef4444', name: 'Rot' }, { key: 'B', color: '#3b82f6', name: 'Blau' }, { key: 'C', color: '#eab308', name: 'Gelb' }];
  function planGroups(plan) {
    const ids = plan.attendees || expectedIds(plan);
    const kids = ids.map(kidById).filter(Boolean);
    if (plan.groupOverride) {
      const out = plan.groupOverride.map((g) => g.map(kidById).filter((k) => k && ids.includes(k.id)));
      const placed = new Set(out.flat().map((k) => k.id));
      kids.filter((k) => !placed.has(k.id)).forEach((k) => out.slice().sort((a, b) => a.length - b.length)[0].push(k));
      return out;
    }
    kids.sort((a, b) => (yearOf(a) || 0) - (yearOf(b) || 0) || kidAvgOr3(b) - kidAvgOr3(a));
    const out = [[], [], []];
    const n = kids.length;
    kids.forEach((k, i) => out[Math.floor((i * 3) / n)].push(k)); // ausgeglichen: 7 → 3/2/2
    return out;
  }
  // Runde r (1–3): Gruppe g steht an Station (g + r - 1) % 3
  const stationOf = (g, round) => (g + round - 1) % 3;
  const isEligible = (k) => k.eligible !== false;

  const chantStart = () => state.settings.chantStart || 'Alle zusammen:\nEins, zwei, drei –\nHochstadt ist dabei!';
  const chantEnd = () => state.settings.chantEnd || 'Trainer: Wer sind wir?\nAlle: HOCHSTADT!\nTrainer: Und welche Farbe?\nAlle: LILA!';
  const planMaterial = (plan) => new Set(plan.material || state.settings.material);
  const missingFor = (ex, mat) => (ex.material || []).filter((m) => !mat.has(m));

  function materialChips(selected, attr) {
    return `<div class="chips">${Store.MATERIAL.map((m) => `<button class="chip ${selected.has(m.key) ? 'on' : ''}" ${attr}="${m.key}">${m.label}</button>`).join('')}</div>`;
  }

  function renderTraining() {
    const open = ui.openPlan && planById(ui.openPlan);
    if (open) return renderPlan(open);
    if (ui.newPlan) return renderNewPlan();
    return renderPlanList();
  }

  function renderPlanList() {
    const list = plannedSorted();
    const today = todayIso();
    const cards = list.map((p) => {
      const d = parseDay(p.day);
      const names = p.stations ? p.stations.map((id, i) => EX[id] ? `${isSolo(p) ? '🔁' : ST_NUM[i]} ${EX[id].name}` : '').concat(EX[p.funinoLearn] ? ['🎓 ' + EX[p.funinoLearn].name] : [], EX[p.funinoPlay] ? ['🥅 ' + EX[p.funinoPlay].name] : []).filter(Boolean)
        : p.blocks.filter((b) => EX[b.exerciseId]).map((b) => EX[b.exerciseId].name);
      const past = p.day < today;
      const att = p.attendees
        ? `<span class="small" style="color:var(--ok)">✔ ${p.attendees.length} Kinder da</span>`
        : `<span class="small muted">👥 Anwesenheit offen</span>`;
      return `<div class="list-item" data-open-plan="${p.id}" style="${p.day === today ? 'border:2px solid var(--primary-2)' : ''}">
        <div class="date-badge">${d.getDate()}<small>${d.toLocaleDateString('de-DE', { month: 'short' })}</small></div>
        <div style="flex:1;min-width:0">
          <div class="row" style="gap:6px"><b>${fmtDay(p.day)}</b><span class="small muted">· ${relDay(p.day)}</span></div>
          <div class="row" style="gap:6px;margin-top:2px"><span class="tag ${p.venue}">${VENUES[p.venue]} · ${planMinutes(p)}′</span><span class="tag team-G1">G1${p.withG2 ? '+G2' : ''}</span>${att}</div>
          <div class="small muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:4px">${esc(names.join(' · '))}</div>
          ${past ? '<div class="small" style="color:var(--warn)">⚠️ Noch nicht abgeschlossen</div>' : ''}
        </div>
        <span style="font-size:1.4rem;color:var(--muted)">›</span>
      </div>`;
    }).join('');
    const lt = state.liveTimer && planById(state.liveTimer.planId);
    const resume = lt ? `<div class="card resume-card"><b>⏱ Training läuft</b><p class="small" style="margin:4px 0 8px">${fmtDay(lt.day)} · Block ${state.liveTimer.idx + 1} von ${lt.blocks.length}: ${esc(lt.blocks[state.liveTimer.idx] ? lt.blocks[state.liveTimer.idx].label : '')}</p>
      <button class="btn btn-primary" data-act="resume-timer">▶ Fortsetzen</button></div>` : '';
    return `
      ${resume}
      <div class="row" style="margin-bottom:12px"><h1 style="margin:0">Training</h1><span class="spacer"></span>
        ${state.sessions.length ? '<button class="btn" data-act="reuse-last" title="Letztes Training wiederverwenden">♻️ Wie letztes Mal</button>' : ''}
        <button class="btn btn-primary" data-act="plan-new">＋ Planen</button></div>
      ${exportDue() ? `<div class="card small" style="border-left:6px solid var(--warn)">💾 <b>Sicherung empfohlen:</b> ${state.settings.lastExport ? 'letzte vor ' + Math.round((Date.now() - Date.parse(state.settings.lastExport)) / 86400000) + ' Tagen' : 'noch nie gesichert'}. Deine Daten liegen nur auf diesem Handy.
        <div style="margin-top:6px"><button class="btn btn-sm" data-act="export">⬇️ Jetzt sichern / teilen</button></div></div>` : ''}
      ${list.length ? `<h3>Geplante Trainings</h3>${cards}` : `
        <div class="card empty"><div class="big">📅</div>
          <p>Noch kein Training geplant.<br>Plane dein nächstes Training im Voraus – dann weißt du, was du aufbauen musst.</p>
          <button class="btn btn-primary" data-act="plan-new">Nächstes Training planen</button></div>`}
      ${state.sessions.length ? '' : `<div class="card small muted" style="margin-top:14px">
        <b>So funktioniert's:</b> 1. Training im Voraus planen (Datum, Ort, Schwerpunkt) → 2. Übungen und Materialliste ansehen, bei Bedarf tauschen →
        3. Am Trainingstag öffnen, <b>Anwesenheit abhaken</b> und den Timer starten → 4. Abschließen, dann landet es im Verlauf.
      </div>`}`;
  }

  function exportDue() {
    if (!state.kids.length) return false;
    const last = state.settings.lastExport ? Date.parse(state.settings.lastExport) : 0;
    return Date.now() - last > 30 * 86400000;
  }

  function renderNewPlan() {
    const kids = planKids({ withG2: ui.withG2 });
    const tplH = Generator.TEMPLATES.halle, tplD = Generator.TEMPLATES.draussen;
    const avg = Generator.avgRatings(kids);
    const weakLabel = AREAS.find((a) => a.key === Generator.weakestArea(avg)).label;
    const elig = kids.filter(isEligible).length;
    return `
      <button class="btn btn-sm btn-ghost" data-act="plan-back" style="margin-bottom:6px">‹ Zurück</button>
      <h1>Training planen</h1>
      <div class="card">
        <div class="field" style="margin:0"><label for="pDay">📅 Trainingstag</label>
          <input class="input" id="pDay" type="date" value="${ui.newDay}" min="${todayIso()}">
          <span class="small muted">${fmtDay(ui.newDay, true)} · ${relDay(ui.newDay)}${state.planned.some((p) => p.day === ui.newDay) ? ' · <b style="color:var(--warn)">an diesem Tag ist schon ein Training geplant</b>' : ''}</span></div>
      </div>
      <div class="card">
        <h3>Wo trainiert ihr?</h3>
        <div class="seg" role="tablist">
          <button class="${ui.venue === 'halle' ? 'on' : ''}" data-venue="halle">🏟️ Halle<span class="seg-sub">${tplH.minutes} Minuten</span></button>
          <button class="${ui.venue === 'draussen' ? 'on' : ''}" data-venue="draussen">🌳 Draußen<span class="seg-sub">${tplD.minutes} Minuten</span></button>
        </div>
      </div>
      <div class="card">
        <h3>Wer trainiert?</h3>
        <div class="seg">
          <button class="${ui.mode === 'solo' ? 'on' : ''}" data-mode="solo">🧍 Ich bin allein<span class="seg-sub">1 Station + Funino</span></button>
          <button class="${ui.mode === 'team' ? 'on' : ''}" data-mode="team">🧍🧍 Wir sind zu zweit<span class="seg-sub">3 Stationen + Funino</span></button>
        </div>
        <div class="row" style="margin-top:10px"><span class="small" style="flex:1">🥅 Funino-Lernweg: <b>Schritt ${ui.funinoStep || Generator.funinoStep(state)} von 4</b>${ui.funinoStep ? ' (manuell)' : ' (automatisch, steigt alle 2 Trainings)'}</span>
          <button class="btn btn-sm" data-fstep="-1" aria-label="Schritt zurück">◀</button><button class="btn btn-sm" data-fstep="1" aria-label="Schritt vor">▶</button></div>
      </div>
      <div class="card">
        <h3>Schwerpunkt</h3>
        <div class="chips">
          <button class="chip ${ui.focus === 'auto' ? 'on' : ''}" data-focus="auto">✨ Automatisch${kids.length ? ` (${esc(weakLabel)})` : ''}</button>
          ${AREAS.map((a) => `<button class="chip ${ui.focus === a.key ? 'on' : ''}" data-focus="${a.key}">${a.icon} ${a.label}</button>`).join('')}
        </div>
        <p class="small muted" style="margin-top:10px">Automatisch = der Bereich, in dem die Mannschaft im Schnitt am schwächsten ist. Schwierigkeit: <b>${LEVEL[Generator.targetLevel(avg)]}</b>.</p>
      </div>
      <div class="card">
        <h3>🧺 Welches Material ist da?</h3>
        <p class="small muted">Es werden nur Übungen vorgeschlagen, für die alles hier Ausgewählte reicht. Vorauswahl änderst du unter „Mehr“.</p>
        ${materialChips(ui.material, 'data-pmat')}
        ${['baelle', 'huetchen'].filter((m) => !ui.material.has(m)).map((m) => `<p class="small" style="color:var(--warn);margin-top:8px">⚠️ Ohne ${MAT[m]} gibt es kaum passende Übungen.</p>`).join('')}
      </div>
      <div class="card">
        <label class="row" style="cursor:pointer"><input type="checkbox" id="pG2" ${ui.withG2 ? 'checked' : ''} style="width:24px;height:24px;accent-color:var(--primary-2)">
          <span><b>Ich trainiere auch die G2</b><br><span class="small muted">Sonst wird nur für die G1 geplant.</span></span></label>
      </div>
      <div class="card">
        <h3>👥 Kinder</h3>
        ${kids.length
          ? `<p class="small" style="margin:0">Geplant wird für alle <b>${kids.length} Kinder</b> (${elig} spielberechtigt, ${kids.length - elig} nicht spielberechtigt). Wer wirklich da ist, hakst du <b>am Trainingstag</b> ab.</p>`
          : `<p class="small muted">Noch keine Kinder angelegt. Mit wie vielen Kindern rechnest du?</p>
             <div class="field" style="max-width:220px;margin:0"><input class="input" id="guestCount" type="number" min="1" max="30" value="${ui.guestCount}"></div>`}
      </div>
      <button class="btn btn-primary btn-big" data-act="generate">⚽ Training vorschlagen</button>
      <p class="small muted" style="text-align:center;margin-top:10px">${ACTIVE_EX.length} Übungen in der Bibliothek · Aufbau nach DFB-Empfehlungen für Bambini</p>
    `;
  }

  function planMinutes(plan) {
    return plan.blocks.reduce((s, b) => s + (b.minutes || 0), 0);
  }

  /* ---------- Stationsmodell: Darstellung ---------- */
  const PH = {
    aufbau: { icon: '⚽', cls: 'aufbau', label: 'Freies Training & Aufbau' },
    ritual: { icon: '📣', cls: 'ritual', label: 'Ritual' },
    ex: { icon: '🔥', cls: 'warm', label: 'Aufwärmen' },
    station: { icon: '🔁', cls: 'station', label: 'Stationen' },
    pause: { icon: '🥤', cls: 'pause', label: 'Trinkpause' },
    final: { icon: '🏆', cls: 'final', label: 'Abschlussspiel' },
    funino: { icon: '🥅', cls: 'funino', label: 'Funino' },
  };
  function blockPh(b) {
    if (b.type === 'ritual') return b.key === 'aufbau' ? PH.aufbau : PH.ritual;
    if (b.type === 'single') return PH.station;
    if (b.type === 'funino-learn' || b.type === 'funino-play') return PH.funino;
    if (b.type === 'ex') return b.phase === 'abschluss' ? PH.final : b.phase === 'hauptteil' ? PH.station : PH.ex;
    return PH[b.type] || PH.ex;
  }
  const ST_NUM = ['①', '②', '③'];
  const exShort = (ex) => ex.short || (ex.steps && ex.steps[0]) || ex.setup || '';
  function matIcons(ex, qty) {
    return `<ul class="mat-icons">${(ex.material || []).map((m) => `<li title="${esc(MAT[m] || m)}">${MAT_ICON[m] || '•'}${qty && ex.materialQty && ex.materialQty[m] ? `<b>${esc(ex.materialQty[m])}</b>` : ''}</li>`).join('')}</ul>`;
  }
  function matText(ex) {
    return (ex.material || []).map((m) => `${ex.materialQty && ex.materialQty[m] ? esc(ex.materialQty[m]) + ' ' : ''}${MAT_ICON[m] || ''} ${esc(MAT[m] || m)}`).join(' · ');
  }
  const isSolo = (plan) => plan.mode === 'solo';
  function funinoEx(plan, which) {
    if (which === 'learn') return EX[plan.funinoLearn] || (!isSolo(plan) && plan.stations ? EX[plan.stations[2]] : null);
    return EX[plan.funinoPlay] || (plan.stations ? EX[plan.stations[2]] : null);
  }
  function blockEx(plan, b) {
    if (b.type === 'single') return EX[(plan.stations || [])[0]];
    if (b.type === 'funino-learn') return funinoEx(plan, 'learn');
    if (b.type === 'funino-play' || b.type === 'final') return funinoEx(plan, 'play');
    return EX[b.exerciseId];
  }
  function blockTitle(plan, b) {
    if (b.type === 'station') return `Stationen – Runde ${b.round} von 3`;
    if (b.type === 'single') { const ex = blockEx(plan, b); return 'Station' + (ex ? ': ' + ex.name : ''); }
    if (b.type === 'funino-learn' || b.type === 'funino-play') { const ex = blockEx(plan, b); return b.label + (ex ? ': ' + ex.name : ''); }
    if (b.type === 'final') { const ex = blockEx(plan, b); return 'Abschlussspiel' + (ex ? ': ' + ex.name : ''); }
    if (b.type === 'ex') { const ex = EX[b.exerciseId]; return ex ? `${b.label}: ${ex.name}` : b.label; }
    return b.label;
  }
  function chantFor(b) {
    if (b.key === 'begruessung') return chantStart();
    if (b.key === 'verabschiedung') return chantEnd();
    return '';
  }
  function callCard(text, small) {
    const lines = String(text || '').split('\n').map((l) => l.trim()).filter(Boolean);
    return `<div class="call-card${small ? ' small' : ''}">${lines.map((l) => {
      const m = l.match(/^(Trainer|Alle)\s*:\s*(.*)$/i);
      if (m && /^trainer$/i.test(m[1])) return `<div><div class="call-who">🗣 Trainer</div><div class="call-lead">${esc(m[2])}</div></div>`;
      if (m) return `<div><div class="call-who">🙌 Alle</div><div class="call-resp">${esc(m[2])}</div></div>`;
      if (/:$/.test(l)) return `<div class="call-who">🙌 ${esc(l.slice(0, -1))}</div>`;
      return `<div class="call-resp">${esc(l)}</div>`;
    }).join('')}</div>`;
  }
  function setupItems(plan) {
    const items = [];
    (plan.stations || []).forEach((id, i) => {
      const ex = EX[id];
      if (!ex) return;
      const title = isSolo(plan) ? `🔁 Station: ${ex.name}` : `${ST_NUM[i]} ${ex.name}${i === 2 ? ' (Funino-Feld)' : ''}`;
      items.push({ key: 's' + i, cls: isSolo(plan) ? 'st-1' : `st-${i + 1}`, title, sub: matText(ex) || 'kein Material', note: ex.setup });
    });
    if (isSolo(plan)) {
      const fp = funinoEx(plan, 'play') || funinoEx(plan, 'learn');
      if (fp) items.push({ key: 'f', cls: 'st-funino', title: '🥅 Funino-Feld: 4 Minitore + Schusszonen', sub: matText(fp), note: fp.setup });
    }
    const wb = plan.blocks.find((b) => b.type === 'ex' && EX[b.exerciseId]);
    if (wb) { const ex = EX[wb.exerciseId]; items.push({ key: 'w', cls: 'st-warm', title: `🔥 Aufwärmen: ${ex.name}`, sub: matText(ex) || 'kein Material', note: ex.setup }); }
    items.push({ key: 'x', cls: '', title: '⚽ Ballkiste offen, 🥤 Platz für Trinkflaschen', sub: '', note: '' });
    return items;
  }
  function setupChecklist(plan, compact) {
    const items = setupItems(plan);
    const done = plan.setupDone || {};
    const n = items.filter((it) => done[it.key]).length;
    return `<div class="setup-check">
      <div class="row" style="margin-bottom:4px"><b>🧰 Aufbau-Checkliste</b><span class="spacer"></span><span class="tag">${n}/${items.length}</span></div>
      ${items.map((it) => `<label class="${it.cls}"><input type="checkbox" data-setup="${it.key}" ${done[it.key] ? 'checked' : ''}>
        <span><b>${esc(it.title)}</b>${it.sub ? `<br><span class="small">${it.sub}</span>` : ''}${!compact && it.note ? `<br><span class="small muted">${esc(it.note)}</span>` : ''}</span></label>`).join('')}
    </div>`;
  }
  function groupNames(g) { return g.map((k) => k.name.split(' ')[0]).join(', '); }

  function rotationTable(plan, groups) {
    return `<table class="rotation">
      <tr><th></th><th>Runde 1</th><th>Runde 2</th><th>Runde 3</th></tr>
      ${GROUPS.map((G, g) => `<tr><th><span class="grp grp-${G.key}">${G.key}</span></th>${[1, 2, 3].map((r) => { const si = stationOf(g, r); return `<td class="st-c st-${si + 1}">${ST_NUM[si]}</td>`; }).join('')}</tr>`).join('')}
    </table>
    <div class="grp-list">${GROUPS.map((G, g) => `<div><span class="grp grp-${G.key} sm">${G.key}</span> ${groups[g].length ? groups[g].map((k) => `<button class="chip chip-sm" data-move-kid="${k.id}">${esc(k.name.split(' ')[0])}</button>`).join(' ') : '<span class="muted small">–</span>'}</div>`).join('')}</div>
    <div class="row small muted" style="margin-top:6px"><span style="flex:1">Kind antippen = in nächste Gruppe schieben.</span>${plan.groupOverride ? '<button class="btn btn-sm" data-act="groups-reset">🔀 Automatisch</button>' : ''}</div>
    <p class="small muted" style="margin:6px 0 0">Gruppen nach Jahrgang & Leistungsstand (DFB: Teams nach Entwicklungsstand). ${plan.attendees ? '' : 'Vorläufig – nach dem Abhaken der Anwesenheit aktualisiert.'}</p>`;
  }

  function stationCard(plan, ex, i, opts) {
    const mat = planMaterial(plan);
    const cls = opts && opts.warm ? 'st-warm' : `st-${i + 1}`;
    const num = opts && opts.warm ? '🔥' : i + 1;
    const pill = opts && opts.warm ? '<span class="phase-pill warm">🔥 Aufwärmspiel</span>'
      : opts && opts.solo ? '<span class="phase-pill station">Station · alle zusammen</span>'
      : i === 2 && ex && ex.funino ? '<span class="phase-pill funino">Station 3 · Funino lernen – danach Funino 3:3</span>'
      : i === 2 ? '<span class="phase-pill final">Station 3 · Spielform, danach Abschlussspiel</span>' : `<span class="phase-pill station">Station ${i + 1}</span>`;
    const swap = opts && opts.warm ? `data-swap="${opts.blockIdx}"` : `data-swap-station="${i}"`;
    if (!ex) {
      return `<article class="station ${cls}"><div class="st-num">${num}</div><div class="st-body">${pill}
        <p class="small">Mit dem ausgewählten Material gibt es hier keine passende Übung.</p>
        <button class="btn btn-sm" ${swap}>🔄 Neu suchen</button></div></article>`;
    }
    const miss = missingFor(ex, mat);
    return `<article class="station ${cls}">
      <div class="st-num">${num}</div>
      <div class="st-body">${pill}
        <h3 class="st-name">${esc(ex.name)}</h3>
        <p class="st-short">${esc(exShort(ex))}</p>
        ${matIcons(ex, true)}
        ${miss.length ? `<p class="small" style="color:var(--danger);margin:6px 0 0">⚠️ Braucht ${miss.map((m) => MAT[m] || m).join(', ')} – nicht ausgewählt.</p>` : ''}
      </div>
      <div class="st-anim">${animBox(ex, true)}</div>
      <div class="st-actions">
        <button class="btn btn-sm" data-ex="${ex.id}">📖 Details</button>
        <button class="btn btn-sm" ${swap}>🔄 Tauschen</button>
        <button class="fav ${isFav(ex.id) ? 'on' : ''}" data-fav="${ex.id}" aria-label="Favorit">★</button>
      </div>
    </article>`;
  }

  function funinoRules() {
    return `<div class="rules-card"><b>🥅 Funino-Regeln</b><ul>${Generator.FUNINO_RULES.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div>`;
  }
  function funinoCard(plan, which) {
    const ex = funinoEx(plan, which);
    const label = ex && !ex.funino ? '⚽ Spielform (für Funino fehlen Minitore)' : which === 'learn' ? `🎓 Funino lernen · Schritt ${ex && ex.funino ? ex.funino.step : '–'} von 4` : '⚽ Funino 3:3 spielen';
    if (!ex) return `<article class="station st-funino"><div class="st-num">🥅</div><div class="st-body"><span class="phase-pill funino">${label}</span>
      <p class="small">Ohne Minitore gibt es keine Funino-Übung.</p><button class="btn btn-sm" data-swap-funino="${which}">🔄 Neu suchen</button></div></article>`;
    const miss = missingFor(ex, planMaterial(plan));
    return `<article class="station st-funino">
      <div class="st-num">🥅</div>
      <div class="st-body"><span class="phase-pill funino">${label}</span>
        <h3 class="st-name">${esc(ex.name)}</h3>
        <p class="st-short">${esc(exShort(ex))}</p>
        ${matIcons(ex, true)}
        ${miss.length ? `<p class="small" style="color:var(--danger);margin:6px 0 0">⚠️ Braucht ${miss.map((m) => MAT[m] || m).join(', ')} – nicht ausgewählt.</p>` : ''}
      </div>
      <div class="st-anim">${animBox(ex, true)}</div>
      <div class="st-actions">
        <button class="btn btn-sm" data-ex="${ex.id}">📖 Details</button>
        <button class="btn btn-sm" data-swap-funino="${which}">🔄 Tauschen</button>
        <button class="fav ${isFav(ex.id) ? 'on' : ''}" data-fav="${ex.id}" aria-label="Favorit">★</button>
      </div>
    </article>`;
  }

  // Mengen wie '8', '1/Kind', '1/Paar' in Stückzahlen umrechnen
  function qtyNum(q, n) {
    const m = String(q || '').match(/(\d+)/); const v = m ? +m[1] : 1;
    if (/kind/i.test(q)) return v * n;
    if (/paar/i.test(q)) return v * Math.ceil(n / 2);
    if (/team|gruppe|bahn/i.test(q)) return v * 2;
    return v;
  }
  function packList(plan) {
    const n = Math.max(1, planCount(plan));
    const tot = {};
    const addEx = (ex, nKids) => { if (ex) (ex.material || []).forEach((m) => { tot[m] = (tot[m] || 0) + qtyNum((ex.materialQty || {})[m], nKids); }); };
    const maxEx = (list, nKids) => { const t = {}; list.filter(Boolean).forEach((ex) => (ex.material || []).forEach((m) => { t[m] = Math.max(t[m] || 0, qtyNum((ex.materialQty || {})[m], nKids)); })); Object.entries(t).forEach(([m, v]) => { tot[m] = (tot[m] || 0) + v; }); };
    if (isSolo(plan)) { addEx(EX[plan.stations[0]], n); maxEx([EX[plan.funinoLearn], EX[plan.funinoPlay]], n); }
    else { plan.stations.forEach((id) => addEx(EX[id], Math.ceil(n / 3))); }
    if (tot.baelle) tot.baelle = Math.max(tot.baelle, n + 2); // Ballkiste: jedes Kind + Reserve
    if (tot.minitore) tot.minitore = Math.min(tot.minitore, 4);
    return Object.entries(tot);
  }
  function observeKids(plan) {
    return planKids(plan).slice().sort((a, b) => (a.ratings ? 1 : 0) - (b.ratings ? 1 : 0) || (a.updatedAt || '').localeCompare(b.updatedAt || '')).slice(0, 3);
  }
  function birthdaysNear(plan) {
    const d = parseDay(plan.day);
    return planKids(plan).filter((k) => k.birthdate).map((k) => {
      const b = new Date(d.getFullYear(), +k.birthdate.slice(5, 7) - 1, +k.birthdate.slice(8, 10), 12);
      const diff = Math.round((b - d) / 86400000);
      return { k, diff, age: d.getFullYear() - +k.birthdate.slice(0, 4), b };
    }).filter((x) => x.diff >= -6 && x.diff <= 6);
  }

  function renderPlan(plan) {
    if (!plan.stations) return renderPlanLegacy(plan);
    const solo = isSolo(plan);
    const pack = packList(plan);
    const watch = observeKids(plan);
    const bdays = birthdaysNear(plan);
    const groups = planGroups(plan);
    const kidsTotal = planKids(plan).length;
    const focusLabel = (AREAS.find((a) => a.key === plan.focus) || {}).label || '–';
    let t = 0;
    const lines = plan.blocks.map((b) => {
      const s0 = t; t += b.minutes;
      const ph = blockPh(b);
      return `<div class="plan-line"><span class="pl-time">${s0}′</span><span class="pl-dot tl-${ph.cls}">${b.type === 'station' ? ST_NUM[b.round - 1] : ph.icon}</span><span class="pl-title">${esc(blockTitle(plan, b))}</span><span class="pl-min">${b.minutes}′</span></div>`;
    }).join('');
    const timeline = plan.blocks.map((b) => { const ph = blockPh(b); return `<span class="tl tl-${ph.cls}" style="flex:${b.minutes}">${b.type === 'station' ? ST_NUM[b.round - 1] : ph.icon}</span>`; }).join('');
    const stB = plan.blocks.find((b) => b.type === 'station' || b.type === 'single');
    const warmIdx = plan.blocks.findIndex((b) => b.type === 'ex');
    const warm = warmIdx >= 0 ? EX[plan.blocks[warmIdx].exerciseId] : null;
    const finalEx = funinoEx(plan, 'play');
    const finalB = plan.blocks.find((b) => b.type === 'final');
    const mat = planMaterial(plan);
    const conflicts = [warm, EX[plan.funinoLearn], EX[plan.funinoPlay]].concat(plan.stations.map((id) => EX[id])).filter((ex) => ex && missingFor(ex, mat).length).length;
    const isToday = plan.day <= todayIso();
    const startB = plan.blocks.find((b) => b.key === 'begruessung');
    const endB = plan.blocks.find((b) => b.key === 'verabschiedung');

    return `
      <div class="row" style="margin-bottom:4px"><button class="btn btn-sm btn-ghost" data-act="plan-back">‹ Alle Trainings</button><span class="spacer"></span>
        <input type="date" id="planDay" class="input input-sm" value="${plan.day}" style="width:auto" aria-label="Datum ändern"></div>
      <h1 style="margin-bottom:4px">${fmtDay(plan.day, true)}</h1>
      <div class="plan-head" style="margin-bottom:12px">
        <span class="tag ${plan.venue}">${VENUES[plan.venue]} · ${planMinutes(plan)}′</span>
        <span class="tag team-G1">G1${plan.withG2 ? ' + G2' : ''}</span>
        <span class="tag">${solo ? '🧍 allein' : '🧍🧍 zu zweit'}</span>
        <span class="tag">👥 ${planCount(plan)}</span>
        <span class="tag">🎯 ${esc(focusLabel)}</span>
        <span class="small muted">${relDay(plan.day)}</span>
      </div>

      <div class="card">
        <div class="timeline">${timeline}</div>
        <div class="tl-legend"><span>0′</span><span>${solo ? `1 Station ${stB ? stB.minutes : ''}′ + Funino` : `3 Stationen à ${stB ? stB.minutes : ''}′ + Funino`}</span><span>${planMinutes(plan)}′</span></div>
        <details class="plan-lines"><summary class="small" style="font-weight:700;margin-top:8px">Ablauf mit Uhrzeiten</summary>${lines}</details>
      </div>

      <div class="card pack-card">
        <div class="row"><b style="flex:1">🧺 Mitnehmen</b><span class="small muted">für ${planCount(plan)} Kinder</span></div>
        <div class="pack">${pack.map(([m, v]) => `<span>${MAT_ICON[m] || ''} <b>${v}</b> ${esc(MAT[m] || m)}</span>`).join('')}<span>🎽 Leibchen-Farben für Teams</span></div>
      </div>
      ${bdays.length ? `<div class="card small">🎂 ${bdays.map((x) => `<b>${esc(x.k.name.split(' ')[0])}</b> wird ${x.age} (${x.b.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })})`).join(' · ')} – Geburtstagsständchen im Abschlusskreis?</div>` : ''}
      ${watch.length ? `<div class="card small">👀 <b>Heute im Blick:</b> ${watch.map((k) => `<button class="chip" data-kid="${k.id}">${esc(k.name.split(' ')[0])}${k.ratings ? '' : ' ⭐'}</button>`).join(' ')}
        <div class="muted" style="margin-top:4px">${watch.some((k) => !k.ratings) ? 'Noch nicht bewertet – heute beobachten und beim Abschließen kurz bewerten.' : 'Am längsten nicht bewertet.'}</div></div>` : ''}
      ${conflicts ? `<div class="card" style="border:2px solid var(--danger)"><b style="color:var(--danger)">⚠️ ${conflicts} Übung(en) brauchen Material, das nicht da ist.</b>
        <div style="margin-top:8px"><button class="btn btn-primary btn-sm" data-act="fix-mat">Passend ersetzen</button></div></div>` : ''}

      ${warmIdx >= 0 ? `<div class="card" style="border:2px solid var(--primary-2)"><b>Älterer Ablauf mit Aufwärmübung.</b><p class="small" style="margin:4px 0 8px">Neu: freies Training während des Aufbaus, danach direkt Stationen (längere Stationszeiten).</p>
        <button class="btn btn-primary btn-sm" data-act="regen-keep">Auf neuen Ablauf umstellen (Stationen bleiben)</button></div>
        <h2 class="sec-h">🔥 Aufwärmspiel</h2>${stationCard(plan, warm, 0, { warm: true, blockIdx: warmIdx })}` : `<div class="card" style="border-left:6px solid var(--ph-aufbau)"><b>⚽ Freies Training & Aufbau · ${plan.blocks[0].minutes}′</b><p class="small" style="margin:4px 0 0">Kinder toben frei mit Ball, ${solo ? 'du baust in der Zeit die Station und das Funino-Feld auf' : 'ihr baut in der Zeit die 3 Stationen auf'}.</p></div>`}

      ${solo ? `
      <h2 class="sec-h">🔁 Station <span class="muted small">alle Kinder zusammen</span></h2>
      ${stationCard(plan, EX[plan.stations[0]], 0, { solo: true })}
      <h2 class="sec-h">🥅 Funino <span class="muted small">Lernweg Schritt ${plan.funinoStep || 1} von 4</span></h2>
      ${funinoCard(plan, 'learn')}
      ${funinoCard(plan, 'play')}
      <details class="card"><summary style="font-weight:700;cursor:pointer">🥅 Funino-Regeln</summary>${funinoRules()}</details>
      <p class="small muted">Bei mehr als 6 Kindern: 3 gegen 3, die anderen warten als Wechselkinder an der Seitenlinie (mit Ball-Aufgabe) und kommen nach jedem Tor rein.</p>
      ` : `
      <h2 class="sec-h">🔁 3 Stationen <span class="muted small">Gruppen wechseln</span></h2>
      ${plan.stations.map((id, i) => stationCard(plan, EX[id], i)).join('')}

      <div class="card">
        <h3>Wer ist wann wo?</h3>
        ${rotationTable(plan, groups)}
      </div>

      <h2 class="sec-h">🏆 Abschlussspiel · Funino ${finalB ? finalB.minutes + '′' : ''} <span class="muted small">auf dem Feld von Station ③</span></h2>
      ${plan.funinoPlay ? funinoCard(plan, 'play') : `<div class="card final-card"><p style="margin:0">${finalEx ? `An <b>Station ③</b>: <b>${esc(finalEx.name)}</b> – alle zusammen.` : 'Spielform an Station ③.'}</p></div>`}
      <details class="card"><summary style="font-weight:700;cursor:pointer">🥅 Funino-Regeln</summary>${funinoRules()}</details>
      `}

      <details class="card">
        <summary style="font-weight:700;cursor:pointer">📣 Rufe</summary>
        <div class="grid grid-2" style="margin-top:10px">
          ${startB ? `<div><div class="small muted" style="margin-bottom:4px">Begrüßung</div>${callCard(chantStart(), true)}</div>` : ''}
          ${endB ? `<div><div class="small muted" style="margin-bottom:4px">Abschluss</div>${callCard(chantEnd(), true)}</div>` : ''}
        </div>
      </details>

      <div class="card">${setupChecklist(plan, true)}</div>

      <h2 class="sec-h">⚙️ Verwaltung</h2>
      <div class="card" style="${!plan.attendees && isToday ? 'border:2px solid var(--primary-2)' : ''}">
        <div class="row">
          <div style="flex:1"><h3 style="margin:0">👥 Anwesenheit</h3>
            <div class="small muted">${plan.attendees ? `<b style="color:var(--ok)">${plan.attendees.length} von ${kidsTotal} da</b>` : (isToday ? 'Heute ist Training – hake ab, wer da ist.' : 'Wird am Trainingstag abgehakt.')}</div></div>
          <button class="btn ${!plan.attendees && isToday ? 'btn-primary' : ''}" data-act="attendance">${plan.attendees ? 'Ändern' : 'Abhaken'}</button>
        </div>
        <div class="row" style="margin-top:12px"><span class="small" style="flex:1">${solo ? '🧍 Du trainierst allein: 1 Station + Funino.' : '🧍🧍 Ihr seid zu zweit: 3 Stationen + Funino.'}</span>
          <button class="btn btn-sm" data-act="switch-mode">${solo ? 'Wir sind zu zweit' : 'Ich bin allein'}</button></div>
        <label class="row" style="margin-top:12px;cursor:pointer"><input type="checkbox" id="planG2" ${plan.withG2 ? 'checked' : ''} style="width:22px;height:22px;accent-color:var(--primary-2)"> <span>Ich trainiere heute auch die <b>G2</b></span></label>
      </div>
      <details class="card">
        <summary style="font-weight:700;cursor:pointer">🧺 Verfügbares Material (${mat.size}/${Store.MATERIAL.length})</summary>
        <p class="small muted" style="margin:8px 0">Antippen zum Ändern – Übungen, für die dann etwas fehlt, werden automatisch ersetzt.</p>
        ${materialChips(mat, 'data-plmat')}
      </details>
      <div class="row" style="margin-bottom:14px">
        <button class="btn" data-act="regen">🔄 Alle Übungen neu</button><span class="spacer"></span>
        <button class="btn btn-danger" data-act="plan-delete">Löschen</button>
      </div>
      <button class="btn btn-big" data-act="finish">✅ Training abschließen & speichern</button>
      <div class="sticky-cta"><button class="btn btn-primary btn-big" data-act="start">${state.liveTimer && state.liveTimer.planId === plan.id ? `▶ Training fortsetzen (Block ${state.liveTimer.idx + 1}/${plan.blocks.length})` : '▶ Training starten'}</button></div>
    `;
  }

  function renderPlanLegacy(plan) {
    const count = planCount(plan);
    let t = 0;
    const blocks = plan.blocks.map((b, i) => {
      const start = t; t += b.minutes;
      const timeCol = `<div class="block-time"><b>${b.minutes}′</b><span>ab ${start}′</span></div>`;
      if (b.type !== 'ex') {
        const r = Generator.RITUALS[b.key] || { title: b.label, text: '' };
        return `<div class="block ${b.type}">${timeCol}<div><div class="block-title">${esc(b.label)}</div><p style="margin-top:4px">${esc(r.text)}</p></div></div>`;
      }
      const ex = EX[b.exerciseId];
      if (!ex) {
        return `<div class="block">${timeCol}<div><div class="block-title">${esc(b.label)}</div><p class="muted">Mit dem ausgewählten Material gibt es hierfür keine passende Übung. Material ergänzen oder neu suchen.</p>
          <div class="block-actions"><button class="btn btn-sm" data-swap="${i}">🔄 Neu suchen</button></div></div></div>`;
      }
      const big = ex.players && count > ex.players[1];
      const miss = missingFor(ex, planMaterial(plan));
      const otherPhase = ex.phase !== b.phase;
      return `<div class="block">${timeCol}<div>
        <div class="block-title">${esc(b.label)}</div>
        <div class="block-ex">
          ${animBox(ex, true)}
          <div>
            <h3>${esc(ex.name)}</h3>
            <div class="ex-meta" style="margin-bottom:6px">${ex.focus.map((f) => `<span class="tag">${FOCUS[f] || f}</span>`).join(' ')}</div>
            <p class="small">${esc(ex.setup)}</p>
            ${miss.length ? `<p class="small" style="color:var(--danger)">⚠️ Braucht ${miss.map((m) => MAT[m] || m).join(', ')} – nicht ausgewählt.</p>` : ''}
            ${otherPhase ? `<p class="small muted">ℹ️ Mit deinem Material gibt es kein passendes ${PHASES[b.phase]} – Ersatz aus „${PHASES[ex.phase]}“.</p>` : ''}
            ${big ? `<p class="small" style="color:var(--warn)">👥 ${count} Kinder – in Gruppen à max. ${ex.players[1]} aufteilen.</p>` : ''}
            <p class="small muted">Material: ${(ex.material || []).map((m) => MAT[m] || m).join(', ') || '–'}</p>
            <div class="block-actions">
              <button class="btn btn-sm" data-ex="${ex.id}">📖 Details</button>
              <button class="btn btn-sm" data-swap="${i}">🔄 Tauschen</button>
              <button class="fav ${isFav(ex.id) ? 'on' : ''}" data-fav="${ex.id}" aria-label="Favorit">★</button>
            </div>
          </div>
        </div>
      </div></div>`;
    }).join('');

    const materials = new Set();
    plan.blocks.forEach((b) => { const ex = EX[b.exerciseId]; if (ex) (ex.material || []).forEach((m) => materials.add(m)); });
    const focusLabel = (AREAS.find((a) => a.key === plan.focus) || {}).label || '–';
    const total = activeKids().length;
    const isToday = plan.day <= todayIso();

    return `
      <div class="row" style="margin-bottom:6px"><button class="btn btn-sm btn-ghost" data-act="plan-back">‹ Alle Trainings</button><span class="spacer"></span>
        <button class="btn btn-sm btn-ghost btn-danger" data-act="plan-delete">Löschen</button></div>
      <h1 style="margin-bottom:2px">${fmtDay(plan.day, true)}</h1>
      <p class="muted" style="margin-bottom:12px">${relDay(plan.day)} · <label style="color:var(--primary-2);font-weight:600;cursor:pointer">📅 Datum ändern<input type="date" id="planDay" value="${plan.day}" style="position:absolute;opacity:0;width:1px;height:1px"></label></p>
      <div class="card">
        <div class="plan-head">
          <span class="tag ${plan.venue}">${VENUES[plan.venue]} · ${planMinutes(plan)} Min</span>
          <span class="tag">🎯 ${esc(focusLabel)}</span>
          <span class="tag">📶 ${LEVEL[plan.level]}</span>
        </div>
        <p class="small" style="margin:10px 0 0"><b>🧺 Aufbauen / mitnehmen:</b> ${[...materials].map((m) => MAT[m] || m).join(', ') || '–'}</p>
      </div>
      ${(() => {
        const mat = planMaterial(plan);
        const conflicts = plan.blocks.filter((b) => b.type === 'ex' && EX[b.exerciseId] && missingFor(EX[b.exerciseId], mat).length).length;
        return `<details class="card" ${conflicts ? 'open' : ''}>
          <summary style="font-weight:700;cursor:pointer">🧺 Verfügbares Material (${mat.size}/${Store.MATERIAL.length})</summary>
          <p class="small muted" style="margin:8px 0">Antippen zum Ändern – Übungen, für die dann etwas fehlt, werden automatisch ersetzt.</p>
          ${materialChips(mat, 'data-plmat')}
          ${conflicts ? `<p class="small" style="color:var(--danger);margin-top:10px">⚠️ ${conflicts} Übung(en) brauchen Material, das nicht da ist.</p><button class="btn btn-primary btn-sm" data-act="fix-mat">Passend ersetzen</button>` : ''}
        </details>`;
      })()}
      <div class="card" style="${!plan.attendees && isToday ? 'border:2px solid var(--primary-2)' : ''}">
        <div class="row">
          <div style="flex:1"><h3 style="margin:0">👥 Anwesenheit</h3>
            <div class="small muted">${plan.attendees ? `<b style="color:var(--ok)">${plan.attendees.length} von ${total} da</b>` : (isToday ? 'Heute ist Training – hake ab, wer da ist.' : 'Wird am Trainingstag abgehakt.')}</div></div>
          <button class="btn ${!plan.attendees && isToday ? 'btn-primary' : ''}" data-act="attendance">${plan.attendees ? 'Ändern' : 'Abhaken'}</button>
        </div>
      </div>
      <div class="grid grid-2" style="margin-bottom:14px">
        <button class="btn btn-primary btn-big" data-act="start">▶️ Training starten</button>
        <button class="btn btn-big" data-act="regen">🔁 Auf 3-Stationen-Ablauf umstellen</button>
      </div>
      <div class="card">${blocks}</div>
      <button class="btn btn-big" data-act="finish">✅ Training abschließen & speichern</button>
    `;
  }

  // Training wiederverwenden: gleiche Stationen, neuer Tag, Funino passend zum aktuellen Lernschritt
  function reuseSession(s) {
    if (!s) return;
    const copy = JSON.parse(JSON.stringify(s));
    Object.assign(copy, { id: Store.uid(), rating: 0, note: '', attendees: null, day: nextFreeDay(), setupDone: {}, groupOverride: null });
    delete copy.date;
    copy.stations = (copy.stations || []).map((id) => (EX[id] && !EX[id].retired ? id : null));
    state.planned.push(copy);
    if (copy.stations) {
      copy.funinoStep = Generator.funinoStep(state);
      copy.stations.forEach((id, i) => { if (!id) swapStationInPlan(copy, i); });
      if (copy.mode === 'solo') swapFuninoInPlan(copy, 'learn');
      else if (copy.stations[2] && EX[copy.stations[2]] && EX[copy.stations[2]].funino) swapStationInPlan(copy, 2);
    }
    save();
    toast(`Für ${fmtDay(copy.day)} eingeplant`);
    openPlan(copy.id);
  }

  function openPlan(id) {
    ui.openPlan = id; ui.newPlan = false;
    if (location.hash !== '#training') location.hash = '#training'; else rerender();
    window.scrollTo(0, 0);
  }

  function startNewPlan() {
    ui.newPlan = true; ui.openPlan = null;
    ui.newDay = nextFreeDay();
    ui.venue = defaultVenueFor(ui.newDay);
    ui.focus = 'auto';
    ui.material = new Set(state.settings.material);
    ui.withG2 = false;
    ui.mode = state.settings.lastMode || 'solo';
    ui.funinoStep = null;
    rerender(); window.scrollTo(0, 0);
  }

  function generatePlan() {
    const expected = expectedIds({ withG2: ui.withG2 });
    const plan = Generator.generate({ venue: ui.venue, attendees: expected, focus: ui.focus, state, count: expected.length || ui.guestCount, material: [...(ui.material || state.settings.material)], mode: ui.mode, funinoStep: ui.funinoStep });
    state.settings.lastMode = ui.mode;
    plan.day = ui.newDay || nextFreeDay();
    plan.attendees = null; // wird am Trainingstag abgehakt
    plan.withG2 = !!ui.withG2;
    plan.count = expected.length || ui.guestCount;
    state.planned.push(plan);
    save();
    toast(`Training für ${fmtDay(plan.day)} geplant`);
    openPlan(plan.id);
  }

  function regenPlan(plan) {
    const fresh = Generator.generate({ venue: plan.venue, attendees: plan.attendees || expectedIds(plan), focus: plan.autoFocus ? 'auto' : plan.focus, state, count: plan.count, material: [...planMaterial(plan)], mode: plan.mode });
    Object.assign(plan, { setupDone: {}, groupOverride: null, mode: fresh.mode, funinoStep: fresh.funinoStep, funinoLearn: fresh.funinoLearn, funinoPlay: fresh.funinoPlay, stations: fresh.stations, blocks: fresh.blocks, level: fresh.level, focus: fresh.focus, autoFocus: fresh.autoFocus });
    save(); rerender(); toast('Neue Übungen');
  }

  function swapInPlan(plan, i) {
    const view = Object.assign({}, plan, { attendees: plan.attendees || expectedIds(plan), material: [...planMaterial(plan)] }); // blocks/stations sind dieselben Arrays
    return Generator.swap(view, i, state);
  }
  function swapFuninoInPlan(plan, which) {
    const view = Object.assign({}, plan, { attendees: plan.attendees || expectedIds(plan), material: [...planMaterial(plan)] });
    const ex = Generator.swapFunino(view, which, state);
    plan.funinoLearn = view.funinoLearn; plan.funinoPlay = view.funinoPlay;
    return ex;
  }
  function swapStationInPlan(plan, i) {
    const view = Object.assign({}, plan, { attendees: plan.attendees || expectedIds(plan), material: [...planMaterial(plan)] });
    return Generator.swapStation(view, i, state);
  }

  // Ersetzt alle Übungen, deren Material fehlt. Gibt Anzahl ersetzter Übungen zurück.
  function fixMaterial(plan) {
    const mat = planMaterial(plan);
    let n = 0;
    plan.blocks.forEach((b, i) => {
      const ex = EX[b.exerciseId];
      if (b.type === 'ex' && (!ex || missingFor(ex, mat).length)) { swapInPlan(plan, i); n++; }
    });
    (plan.stations || []).forEach((id, i) => {
      const ex = EX[id];
      if (!ex || missingFor(ex, mat).length) { swapStationInPlan(plan, i); n++; }
    });
    [['learn', 'funinoLearn'], ['play', 'funinoPlay']].forEach(([w, f]) => {
      if (plan[f] && missingFor(EX[plan[f]], mat).length) { swapFuninoInPlan(plan, w); n++; }
    });
    save();
    return n;
  }

  function openAttendance(plan, finishAfter, onDone) {
    // Beim Abschließen ohne Liste: alle Erwarteten vorbelegen (meist fehlen nur wenige)
    const set = new Set(plan.attendees || (finishAfter ? expectedIds(plan) : []));
    const kids = planKids(plan);
    const years = yearsOf(kids);
    const groups = years.map((y) => [`Jahrgang ${y}`, kids.filter((k) => yearOf(k) === y)]);
    const noYear = kids.filter((k) => !yearOf(k));
    if (noYear.length) groups.push(['Ohne Jahrgang', noYear]);
    const item = (k) => `<label class="${set.has(k.id) ? '' : 'off'}"><input type="checkbox" data-a="${k.id}" ${set.has(k.id) ? 'checked' : ''}>
      <span>${esc(k.name)}${isEligible(k) ? '' : ' <span class="tag ns">n. s.</span>'}</span></label>`;
    openModal(`
      <h2>Anwesenheit</h2>
      <p class="muted">${fmtDay(plan.day, true)}</p>
      <div class="row" style="margin-bottom:6px"><b id="aCount"></b><span class="spacer"></span>
        <button class="btn btn-sm btn-ghost" data-aset="all">Alle</button>
        ${years.map((y) => `<button class="btn btn-sm btn-ghost" data-aset="${y}">Jg. ${y}</button>`).join('')}
        <button class="btn btn-sm btn-ghost" data-aset="none">Keine</button></div>
      ${kids.length ? groups.map(([t, ks]) => `<h3 style="margin:14px 0 8px">${t}</h3><div class="attend">${ks.map(item).join('')}</div>`).join('') : '<p class="muted">Noch keine Kinder angelegt.</p>'}
      <p class="small muted" style="margin-top:10px"><span class="tag ns">n. s.</span> = nicht spielberechtigt</p>
      <button class="btn btn-primary btn-big" id="aDone" style="margin-top:8px">${finishAfter ? '✅ Speichern & Training abschließen' : 'Fertig'}</button>
    `, (root) => {
      const sync = () => {
        root.querySelectorAll('[data-a]').forEach((cb) => { cb.checked = set.has(cb.dataset.a); cb.parentElement.classList.toggle('off', !cb.checked); });
        root.querySelector('#aCount').textContent = `${set.size} von ${kids.length} da`;
        plan.attendees = [...set]; save();
      };
      root.addEventListener('change', (e) => {
        const cb = e.target.closest('[data-a]'); if (!cb) return;
        if (cb.checked) set.add(cb.dataset.a); else set.delete(cb.dataset.a);
        sync();
      });
      root.addEventListener('click', (e) => {
        const b = e.target.closest('[data-aset]'); if (!b) return;
        const v = b.dataset.aset;
        set.clear();
        if (v === 'all') kids.forEach((k) => set.add(k.id));
        else if (v !== 'none') kids.filter((k) => yearOf(k) === +v).forEach((k) => set.add(k.id));
        sync();
      });
      root.querySelector('#aDone').addEventListener('click', () => {
        plan.attendees = [...set]; save(); closeModal();
        if (finishAfter) openFinish(plan); else if (onDone) onDone(); else rerender();
      });
      root.querySelector('#aCount').textContent = `${set.size} von ${kids.length} da`;
    });
  }

  function finishPlan(plan) {
    if (!plan) return;
    if (!plan.attendees && planKids(plan).length) { openAttendance(plan, true); return; }
    openFinish(plan);
  }

  // Abschluss: Training bewerten + anwesende Kinder kurz bewerten (optional) → Verlauf
  function openFinish(plan) {
    const kids = (plan.attendees || []).map(kidById).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name, 'de'));
    const unrated = kids.filter((k) => !k.ratings);
    let rating = plan.rating || 0;
    openModal(`
      <h2>✅ Training abschließen</h2>
      <p class="muted">${fmtDay(plan.day, true)} · ${kids.length} Kinder da</p>
      <h3>Wie war's?</h3>
      <div class="smileys" id="fRate">${SMILEYS.map(([v, e]) => `<button data-rate="${v}" class="${rating === v ? 'on' : ''}">${e}</button>`).join('')}</div>
      <div class="field" style="margin-top:10px"><input class="input" id="fNote" placeholder="Notiz zum Training (optional)" value="${esc(plan.note || '')}"></div>
      ${kids.length ? `<details ${unrated.length ? 'open' : ''} class="card" style="padding:12px">
        <summary style="font-weight:700;cursor:pointer">⭐ Kinder kurz bewerten <span class="small muted">(optional${unrated.length ? `, ${unrated.length} noch nie bewertet` : ''})</span></summary>
        <p class="small muted">Nur antippen, wo dir heute etwas aufgefallen ist. Wird sofort gespeichert und als Entwicklung festgehalten.</p>
        ${kids.map((k) => `<div class="rate-card"><div class="row"><b style="flex:1">${esc(k.name)}</b>${!k.ratings ? '<span class="tag unrated">neu</span>' : ''}</div>
          ${AREAS.map((a) => `<div class="rate-row"><span>${a.icon} ${a.label}</span>${rateDots(k, a.key)}</div>`).join('')}
          <input class="input input-sm" data-knote="${k.id}" placeholder="Notiz zu ${esc(k.name.split(' ')[0])} (optional)"></div>`).join('')}
      </details>` : ''}
      <button class="btn btn-primary btn-big" id="fSave">Speichern & abschließen</button>
    `, (root) => {
      bindRateDots(root);
      root.querySelector('#fRate').addEventListener('click', (e) => {
        const b = e.target.closest('[data-rate]'); if (!b) return;
        rating = +b.dataset.rate;
        root.querySelectorAll('#fRate button').forEach((x) => x.classList.toggle('on', x === b));
      });
      root.querySelector('#fSave').addEventListener('click', () => {
        root.querySelectorAll('[data-knote]').forEach((inp) => {
          const t = inp.value.trim(); const k = kidById(inp.dataset.knote);
          if (t && k) { k.notes = k.notes || []; k.notes.push({ date: new Date().toISOString(), text: t.slice(0, 500) }); }
        });
        plan.rating = rating;
        plan.note = root.querySelector('#fNote').value.trim();
        plan.date = plan.day + 'T12:00:00';
        plan.attendees = plan.attendees || [];
        state.sessions.push(plan);
        state.planned = state.planned.filter((p) => p.id !== plan.id);
        if (state.liveTimer && state.liveTimer.planId === plan.id) state.liveTimer = null;
        ui.openPlan = null;
        save();
        closeModal();
        location.hash = '#verlauf';
        rerender();
        toast('Training gespeichert 👍');
      });
    });
  }

  /* =========================================================
     KINDER
     ========================================================= */
  function attendanceCount(id) {
    return state.sessions.filter((s) => (s.attendees || []).includes(id)).length;
  }

  // Anwesenheit relativ zu den Trainings, für die das Kind erwartet war
  function kidStats(k) {
    const exp = state.sessions.filter((s) => teamOf(k) === 'G1' || s.withG2)
      .sort((a, b) => (a.day || a.date).localeCompare(b.day || b.date));
    const present = exp.filter((s) => (s.attendees || []).includes(k.id));
    let streak = 0;
    for (let i = exp.length - 1; i >= 0 && !(exp[i].attendees || []).includes(k.id); i--) streak++;
    const last = present.length ? present[present.length - 1] : null;
    return { expected: exp.length, present: present.length, quote: exp.length ? Math.round((present.length / exp.length) * 100) : null, last: last ? (last.day || last.date.slice(0, 10)) : null, streak };
  }

  function rateDots(kid, area) {
    const v = kid.ratings && kid.ratings[area];
    let s = `<span class="dots" data-rk="${kid.id}" data-ra="${area}">`;
    for (let i = 1; i <= 5; i++) s += `<button type="button" data-rv="${i}" class="${v && i <= v ? 'on' : ''}" aria-label="${i}">${i}</button>`;
    return s + '</span>';
  }
  // Delegierter Handler für Bewertungs-Punkte in einem Container
  function bindRateDots(root, onChange) {
    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-rv]'); if (!b) return;
      const box = b.closest('[data-rk]');
      const kid = kidById(box.dataset.rk); if (!kid) return;
      const v = +b.dataset.rv;
      const r = Object.assign({}, kid.ratings || {}, { [box.dataset.ra]: v });
      if (Store.setRatings(kid, r)) save();
      box.querySelectorAll('[data-rv]').forEach((x) => x.classList.toggle('on', +x.dataset.rv <= v));
      if (onChange) onChange(kid);
    });
  }

  function trendFor(k, area) {
    const h = (k.history || []).filter((x) => x.ratings && x.ratings[area]);
    if (h.length < 2) return '';
    const first = h[0].ratings[area], now = h[h.length - 1].ratings[area];
    const arrow = now > first ? '<b style="color:var(--ok)">↑</b>' : now < first ? '<b style="color:var(--danger)">↓</b>' : '→';
    const pts = h.slice(-10).map((x, i, arr) => `${(i / Math.max(1, arr.length - 1)) * 60},${18 - (x.ratings[area] - 1) * 4}`).join(' ');
    return `<span class="trend"><svg viewBox="-2 0 64 20" width="64" height="20" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="var(--primary-2)" stroke-width="2" stroke-linejoin="round"/></svg>
      <span class="small muted">seit ${fmtDate(h[0].date, { day: '2-digit', month: '2-digit' })}: ${first} → ${now} ${arrow}</span></span>`;
  }

  function renderKinder() {
    const allKids = activeKids();
    const byElig = (k) => ui.kidElig === 'alle' || (ui.kidElig === 'unrated' ? !k.ratings : (ui.kidElig === 'ja') === (k.eligible !== false));
    const kids = allKids.filter((k) => (ui.kidTeam === 'alle' || teamOf(k) === ui.kidTeam) && byElig(k));
    const nElig = allKids.filter((k) => k.eligible !== false).length;
    const nUnrated = allKids.filter((k) => !k.ratings).length;
    const inactive = state.kids.filter((k) => k.active === false);
    const rated = kids.filter((k) => k.ratings);
    const avg = Generator.avgRatings(rated);
    const overview = rated.length ? `
      <details class="card">
        <summary class="card-head" style="cursor:pointer;margin:0"><h3 style="margin:0">📊 ${ui.kidTeam === 'alle' ? 'G1 + G2' : ui.kidTeam} im Schnitt</h3><span class="tag">📶 ${LEVEL[Generator.targetLevel(avg)]}</span></summary>
        ${AREAS.map((a) => `<div class="area-row"><span>${a.icon} ${a.label}</span><div class="bar"><i style="width:${(avg[a.key] / 5) * 100}%"></i></div><b>${avg[a.key].toFixed(1)}</b></div>`).join('')}
        <p class="small muted" style="margin:8px 0 0">Größtes Potenzial: <b>${AREAS.find((a) => a.key === Generator.weakestArea(avg)).label}</b> (aus ${rated.length} bewerteten Kindern) – darauf legt der automatische Vorschlag den Schwerpunkt.</p>
      </details>` : '';
    const groups = [];
    yearsOf(kids).forEach((y) => groups.push([`Jahrgang ${y}`, kids.filter((k) => yearOf(k) === y)]));
    const noYear = kids.filter((k) => !yearOf(k));
    if (noYear.length) groups.push([groups.length ? 'Ohne Jahrgang' : '', noYear]);
    const list = groups.map(([title, ks]) => `${title ? `<h3 style="margin:18px 0 10px">${title} <span class="muted" style="font-weight:500">(${ks.length})</span></h3>` : ''}<div class="grid grid-2">${ks.map((k) => kidRow(k)).join('')}</div>`).join('');
    const chips = allKids.length ? `<div class="chips chip-scroll" style="margin-bottom:8px">
        <button class="chip ${ui.kidTeam === 'alle' ? 'on' : ''}" data-kid-team="alle">G1 + G2 (${allKids.length})</button>
        <button class="chip ${ui.kidTeam === 'G1' ? 'on' : ''}" data-kid-team="G1">G1 (${allKids.filter((k) => teamOf(k) === 'G1').length})</button>
        <button class="chip ${ui.kidTeam === 'G2' ? 'on' : ''}" data-kid-team="G2">G2 (${allKids.filter((k) => teamOf(k) === 'G2').length})</button></div>
      <div class="chips chip-scroll" style="margin-bottom:12px">
        <button class="chip ${ui.kidElig === 'alle' ? 'on' : ''}" data-kid-elig="alle">Alle</button>
        <button class="chip ${ui.kidElig === 'ja' ? 'on' : ''}" data-kid-elig="ja">✅ Spielberechtigt (${nElig})</button>
        <button class="chip ${ui.kidElig === 'nein' ? 'on' : ''}" data-kid-elig="nein">⛔ Nicht (${allKids.length - nElig})</button>
        ${nUnrated ? `<button class="chip ${ui.kidElig === 'unrated' ? 'on' : ''}" data-kid-elig="unrated">⭐ Nicht bewertet (${nUnrated})</button>` : ''}</div>` : '';
    return `
      <div class="row" style="margin-bottom:12px"><h1 style="margin:0">Kinder</h1><span class="spacer"></span>
        ${nUnrated && allKids.length ? `<button class="btn" data-act="kid-rate-all">⭐ Bewerten</button>` : ''}
        <button class="btn btn-primary" data-act="kid-new">＋ Kind</button></div>
      ${chips}
      ${overview}
      ${kids.length ? list : allKids.length ? `<div class="card empty"><p>Keine Kinder für diesen Filter.</p></div>` : `<div class="card empty"><div class="big">👧🧒</div><p>Noch keine Kinder eingetragen.<br>Tipp: Kinderliste vom 2. Trainer unter „Mehr → Importieren“.</p><button class="btn btn-primary" data-act="kid-new">Erstes Kind anlegen</button></div>`}
      ${inactive.length ? `<details style="margin-top:20px"><summary class="small" style="font-weight:700;cursor:pointer">Inaktiv (${inactive.length})</summary><div class="grid grid-2" style="margin-top:10px">${inactive.map((k) => kidRow(k)).join('')}</div></details>` : ''}
    `;
  }

  function kidRow(k) {
    const st = kidStats(k);
    return `<div class="kid" data-kid="${k.id}" style="${k.active === false ? 'opacity:.6' : ''}">
      <div class="avatar" style="background:${avatarColor(k.name)}">${esc(initials(k.name))}</div>
      <div class="kid-main">
        <div class="kid-name">${esc(k.name)}</div>
        <div class="row" style="gap:4px;margin-top:2px"><span class="tag team-${teamOf(k)}">${teamOf(k)}</span><span class="small muted">${[ageOf(k) ? ageOf(k) + ' J.' : '', yearOf(k) ? 'Jg. ' + yearOf(k) : ''].filter(Boolean).join(' · ')}</span>${k.eligible === false ? '<span class="tag ns">n. s.</span>' : ''}</div>
        ${k.ratings ? `<div class="kid-areas">${AREAS.map((a) => `<span>${a.icon} ${k.ratings[a.key] || '–'}</span>`).join('')}</div>` : ''}
      </div>
      <div style="text-align:right">${starsRO(kidAvg(k))}
        <div class="small muted">${st.quote != null ? `${st.quote} % da` : ''}</div>
        ${st.streak >= 2 ? `<div class="small" style="color:var(--warn)">${st.streak}× gefehlt</div>` : ''}</div>
    </div>`;
  }

  // Mehrere Kinder schnell bewerten (z. B. alle noch nicht bewerteten)
  function openRateMany(kids, title) {
    openModal(`
      <h2>${esc(title || 'Schnell bewerten')}</h2>
      <p class="small muted">Tippe die Stufe pro Bereich: 1 = fängt gerade an · 3 = altersgerecht · 5 = schon sehr sicher. Wird sofort gespeichert.</p>
      ${kids.map((k) => `<div class="rate-card"><b>${esc(k.name)}</b>
        ${AREAS.map((a) => `<div class="rate-row"><span>${a.icon} ${a.label}</span>${rateDots(k, a.key)}</div>`).join('')}</div>`).join('')}
      <button class="btn btn-primary btn-big" data-close>Fertig</button>`, (root) => bindRateDots(root));
  }

  function openKid(id) {
    if (!id) return openKidForm(null);
    const k = kidById(id);
    if (!k) return;
    const st = kidStats(k);
    const sc = window.DFB_SCALE || {};
    const notes = (k.notes || []).slice().reverse();
    openModal(`
      <div class="row" style="gap:12px;margin-bottom:8px;padding-right:40px">
        <div class="avatar" style="background:${avatarColor(k.name)}">${esc(initials(k.name))}</div>
        <div style="flex:1;min-width:0"><h2 style="margin:0">${esc(k.name)}</h2>
          <div class="row" style="gap:4px;margin-top:4px"><span class="tag team-${teamOf(k)}">${teamOf(k)}</span><span class="small muted">${[ageOf(k) ? ageOf(k) + ' Jahre' : '', yearOf(k) ? 'Jg. ' + yearOf(k) : ''].filter(Boolean).join(' · ')}</span>
          ${k.eligible === false ? '<span class="tag ns">nicht spielberechtigt</span>' : '<span class="tag">✅ spielberechtigt</span>'}</div></div>
      </div>
      <div class="facts"><span>👥 ${st.expected ? `${st.present} von ${st.expected} Trainings (${st.quote} %)` : 'noch kein Training'}</span>${st.last ? `<span>zuletzt ${fmtDate(st.last + 'T12:00:00', { day: '2-digit', month: '2-digit' })}</span>` : ''}${st.streak >= 2 ? `<span style="color:var(--warn)">${st.streak}× in Folge gefehlt</span>` : ''}</div>
      <h3>Leistung <span class="small muted" style="font-weight:500">${k.updatedAt ? 'Stand ' + fmtDate(k.updatedAt, { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'noch nicht bewertet'}</span></h3>
      <p class="small muted" style="margin-top:-4px">Tippen speichert sofort · 1 = fängt an · 3 = altersgerecht · 5 = sehr sicher</p>
      ${AREAS.map((a) => `<div class="rate-block"><div class="rate-row"><span>${a.icon} ${a.label}</span>${rateDots(k, a.key)}</div>
        <div id="tr-${a.key}">${trendFor(k, a.key)}</div>
        ${sc[a.key] ? `<details class="small muted"><summary>Woran erkenne ich die Stufe?</summary><p style="margin:6px 0 0">1: ${esc(sc[a.key][1])}<br>3: ${esc(sc[a.key][3])}<br>5: ${esc(sc[a.key][5])}</p></details>` : ''}</div>`).join('')}
      <h3 style="margin-top:16px">📝 Notizen</h3>
      <div class="row" style="flex-wrap:nowrap"><input class="input" id="kNewNote" placeholder="z. B. hat heute zum ersten Mal ein Tor geschossen" autocomplete="off"><button class="btn" id="kAddNote">＋</button></div>
      <div id="kNotes">${notes.map((n) => `<div class="note-item"><span class="small muted">${fmtDate(n.date, { day: '2-digit', month: '2-digit', year: '2-digit' })}</span> ${esc(n.text)}</div>`).join('')}
        ${k.note ? `<div class="note-item"><span class="small muted">Allgemein</span> ${esc(k.note)}</div>` : ''}</div>
      <div class="row" style="margin-top:16px"><button class="btn" id="kEdit">✏️ Daten bearbeiten</button><span class="spacer"></span><button class="btn btn-primary" data-close>Fertig</button></div>
    `, (root) => {
      bindRateDots(root, (kid) => AREAS.forEach((a) => { const el = root.querySelector('#tr-' + a.key); if (el) el.innerHTML = trendFor(kid, a.key); }));
      const add = () => {
        const inp = root.querySelector('#kNewNote'); const text = inp.value.trim(); if (!text) return;
        k.notes = k.notes || []; k.notes.push({ date: new Date().toISOString(), text: text.slice(0, 500) }); save();
        root.querySelector('#kNotes').insertAdjacentHTML('afterbegin', `<div class="note-item"><span class="small muted">heute</span> ${esc(text)}</div>`);
        inp.value = '';
      };
      root.querySelector('#kAddNote').addEventListener('click', add);
      root.querySelector('#kNewNote').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
      root.querySelector('#kEdit').addEventListener('click', () => openKidForm(k.id));
    });
  }

  function openKidForm(id) {
    const isNew = !id;
    const k = isNew
      ? { id: Store.uid(), name: '', birthdate: '', year: null, eligible: null, ratings: null, note: '', active: true, history: [], notes: [] }
      : JSON.parse(JSON.stringify(kidById(id)));
    openModal(`
      <h2>${isNew ? 'Neues Kind' : 'Daten: ' + esc(k.name)}</h2>
      <form id="kidForm">
        <div class="grid grid-2">
          <div class="field"><label for="kName">Name</label><input class="input" id="kName" required value="${esc(k.name)}" placeholder="Vorname Nachname" autocomplete="off"></div>
          <div class="field"><label for="kYear">Jahrgang</label><select class="input" id="kYear">
            <option value="">– bitte wählen –</option>
            ${Array.from({ length: 9 }, (_, i) => new Date().getFullYear() - 2 - i).map((y) => `<option value="${y}" ${yearOf(k) === y ? 'selected' : ''}>${y}</option>`).join('')}</select></div>
        </div>
        <div class="field"><label>Spielberechtigt?</label>
          <div class="seg" id="kElig">
            <button type="button" data-elig="1" class="${k.eligible === true || (!isNew && k.eligible !== false) ? 'on' : ''}">✅ Ja</button>
            <button type="button" data-elig="0" class="${k.eligible === false ? 'on' : ''}">⛔ Nein</button>
          </div></div>
        <div class="field"><label>Mannschaft</label>
          <div class="seg" id="kTeam">
            <button type="button" data-team="" class="${!k.team ? 'on' : ''}">Auto (Jahrgang)</button>
            <button type="button" data-team="G1" class="${k.team === 'G1' ? 'on' : ''}">G1</button>
            <button type="button" data-team="G2" class="${k.team === 'G2' ? 'on' : ''}">G2</button>
          </div><span class="small muted">Auto: Jahrgang ${g1Year()} und älter = G1, jünger = G2.</span></div>
        <div class="field"><label for="kBirth">Geburtsdatum (optional)</label><input class="input" id="kBirth" type="date" value="${esc(k.birthdate || '')}" max="${todayIso()}">
          <span class="small muted" id="kAgeInfo"></span></div>
        <div class="field"><label for="kNote">Allgemeine Notiz</label><textarea class="input" id="kNote" placeholder="z. B. Allergie, Abholung durch Oma …">${esc(k.note)}</textarea></div>
        ${!isNew ? `<label class="row small" style="margin-bottom:12px"><input type="checkbox" id="kActive" ${k.active !== false ? 'checked' : ''} style="width:20px;height:20px;accent-color:var(--primary-2)"> aktiv im Team (erscheint in der Anwesenheit)</label>` : '<p class="small muted">Die Leistung bewertest du danach im Profil – oder direkt nach dem nächsten Training.</p>'}
        <div class="row" style="margin-top:8px">
          ${!isNew ? '<button type="button" class="btn btn-danger" id="kDel">Löschen</button>' : ''}
          <span class="spacer"></span>
          <button type="submit" class="btn btn-primary">Speichern</button>
        </div>
      </form>`, (root) => {
      const birth = root.querySelector('#kBirth'), info = root.querySelector('#kAgeInfo'), yearSel = root.querySelector('#kYear');
      let elig = k.eligible === true || (!isNew && k.eligible !== false) ? true : (k.eligible === false ? false : null);
      let team = k.team || '';
      root.querySelector('#kTeam').addEventListener('click', (e) => {
        const b = e.target.closest('[data-team]'); if (!b) return;
        team = b.dataset.team;
        root.querySelectorAll('#kTeam button').forEach((x) => x.classList.toggle('on', x === b));
      });
      root.querySelector('#kElig').addEventListener('click', (e) => {
        const b = e.target.closest('[data-elig]'); if (!b) return;
        elig = b.dataset.elig === '1';
        root.querySelectorAll('#kElig button').forEach((x) => x.classList.toggle('on', x === b));
      });
      const updAge = () => {
        if (birth.value) {
          const y = birth.value.slice(0, 4);
          if (![...yearSel.options].some((o) => o.value === y)) yearSel.add(new Option(y, y));
          yearSel.value = y;
          info.textContent = `${ageOf({ birthdate: birth.value })} Jahre · Jahrgang ${y}`;
        } else info.textContent = '';
      };
      birth.addEventListener('change', updAge); updAge();
      if (isNew) setTimeout(() => root.querySelector('#kName').focus(), 100);
      const del = root.querySelector('#kDel');
      if (del) del.addEventListener('click', () => {
        if (!confirm(`${k.name} wirklich löschen? (Tipp: „aktiv“ abwählen behält den Verlauf.)`)) return;
        state.kids = state.kids.filter((x) => x.id !== k.id);
        save(); closeModal(); rerender(); toast('Gelöscht');
      });
      root.querySelector('#kidForm').addEventListener('submit', (e) => {
        e.preventDefault();
        k.name = root.querySelector('#kName').value.trim().slice(0, 80);
        if (!k.name) return;
        if (!yearSel.value) { alert('Bitte den Jahrgang auswählen.'); return; }
        if (elig === null) { alert('Bitte auswählen, ob das Kind spielberechtigt ist.'); return; }
        k.birthdate = birth.value || '';
        k.year = +yearSel.value;
        k.eligible = elig;
        if (team) k.team = team; else delete k.team;
        k.note = root.querySelector('#kNote').value.trim();
        const act = root.querySelector('#kActive');
        if (act) k.active = act.checked;
        const old = kidById(k.id);
        if (old) Object.assign(old, k); else state.kids.push(Store.normKid(k));
        save(); rerender(); toast(isNew ? `${k.name} hinzugefügt` : 'Gespeichert');
        openKid(old ? old.id : state.kids[state.kids.length - 1].id);
      });
    });
  }

  /* =========================================================
     ÜBUNGEN
     ========================================================= */
  function filteredExercises() {
    const q = ui.exSearch.trim().toLowerCase();
    return ACTIVE_EX.filter((e) =>
      (ui.exVenue === 'alle' || e.venue.includes(ui.exVenue)) &&
      (ui.exPhase === 'alle' || e.phase === ui.exPhase) &&
      (!ui.exFav || isFav(e.id)) &&
      (!q || (e.name + ' ' + e.story + ' ' + e.setup).toLowerCase().includes(q))
    );
  }

  function exCards() {
    const list = filteredExercises();
    if (!list.length) return `<div class="card empty"><div class="big">🔍</div><p>Keine Übungen gefunden.</p></div>`;
    const pill = { aufwaermen: 'warm', hauptteil: 'station', abschluss: 'final' };
    return `<div class="ex-list">${list.map((e) => `
      <div class="ex-row ph-${e.phase}" data-ex="${e.id}">
        ${animBox(e, false)}
        <div style="min-width:0">
          <h3>${esc(e.name)}</h3>
          <p class="st-short">${esc(exShort(e))}</p>
          <div class="ex-meta"><span class="phase-pill ${pill[e.phase]}">${PHASES[e.phase]}</span>${ui.exVenue === 'alle' ? venueTags(e) : ''}<span class="small muted">${e.duration}′ · 👥 ${e.players ? e.players[0] + '–' + e.players[1] : '–'}</span></div>
          <div style="margin-top:4px">${matIcons(e)}</div>
        </div>
        <button class="fav ${isFav(e.id) ? 'on' : ''}" data-fav="${e.id}" aria-label="Favorit">★</button>
      </div>`).join('')}</div>`;
  }

  function renderUebungen() {
    const chip = (group, val, label) => `<button class="chip ${ui[group] === val ? 'on' : ''}" data-filter="${group}" data-val="${val}">${label}</button>`;
    return `
      <h1>Übungen</h1>
      <div class="field"><input class="input" id="exSearch" type="search" placeholder="🔍 Übung suchen …" value="${esc(ui.exSearch)}"></div>
      <div class="chips chip-scroll" style="margin-bottom:8px">
        ${chip('exVenue', 'alle', 'Alle Orte')}${chip('exVenue', 'halle', '🏟️ Halle')}${chip('exVenue', 'draussen', '🌳 Draußen')}
        <button class="chip ${ui.exFav ? 'on' : ''}" data-act="ex-fav">★ Favoriten</button>
      </div>
      <div class="chips chip-scroll" style="margin-bottom:14px">
        ${chip('exPhase', 'alle', 'Alle Phasen')}${chip('exPhase', 'aufwaermen', 'Aufwärmen')}${chip('exPhase', 'hauptteil', 'Hauptteil')}${chip('exPhase', 'abschluss', 'Abschlussspiel')}
      </div>
      <p class="small muted" id="exCount">${filteredExercises().length} Übungen</p>
      <div id="exList">${exCards()}</div>
    `;
  }

  function refreshExList() {
    destroyAll(viewCtrls);
    const box = document.getElementById('exList');
    if (!box) return;
    box.innerHTML = exCards();
    document.getElementById('exCount').textContent = filteredExercises().length + ' Übungen';
    mountAnims($view, viewCtrls);
  }

  function openExercise(id) {
    const e = EX[id];
    if (!e) return;
    const list = (arr) => (arr || []).map((x) => `<li>${esc(x)}</li>`).join('');
    const pillCls = { aufwaermen: 'warm', hauptteil: 'station', abschluss: 'final' }[e.phase];
    openModal(`
      <div class="detail">
        <h2>${esc(e.name)} <button class="fav ${isFav(e.id) ? 'on' : ''}" id="dFav" aria-label="Favorit" style="vertical-align:middle">★</button></h2>
        <div class="ex-meta"><span class="phase-pill ${pillCls}">${PHASES[e.phase]}</span>${venueTags(e)} ${e.focus.map((f) => `<span class="tag">${FOCUS[f] || f}</span>`).join(' ')}</div>
        <div class="facts"><span>⏱ ${e.duration}′</span><span>👥 ${e.players ? e.players[0] + '–' + e.players[1] : '–'}</span><span>📶 ${LEVEL[e.level]}</span></div>
        ${animBox(e, true)}
        <div class="anim-ctrl">
          <button class="btn btn-sm" id="aToggle">⏸️ Pause</button>
          <span class="spacer"></span>
          <div class="chips" id="aSpeed"><button class="chip" data-speed="0.5">½×</button><button class="chip on" data-speed="1">1×</button><button class="chip" data-speed="2">2×</button></div>
        </div>
        <p class="ex-short-big" style="font-size:1.15rem">${esc(exShort(e))}</p>
        <p><b>🧺 Material:</b> ${matText(e) || 'kein Material'}</p>
        <h3>Aufbau</h3><p>${esc(e.setup)}</p>
        <h3>Ablauf</h3><ol>${list(e.steps)}</ol>
        ${e.story ? `<details><summary>📖 Geschichte zum Erzählen</summary><p>${esc(e.story)}</p></details>` : ''}
        ${e.tips && e.tips.length ? `<details><summary>💡 Coaching-Tipps</summary><ul>${list(e.tips)}</ul></details>` : ''}
        ${e.easier || e.harder ? `<details><summary>🟢 Leichter / 🔴 Schwerer</summary>${e.easier ? `<p><b>🟢</b> ${esc(e.easier)}</p>` : ''}${e.harder ? `<p><b>🔴</b> ${esc(e.harder)}</p>` : ''}</details>` : ''}
      </div>`, (root) => {
      const animEl = root.querySelector('.anim');
      const ctrl = animEl && animEl._ctrl;
      const tg = root.querySelector('#aToggle');
      const upd = () => (tg.textContent = ctrl && ctrl.isPlaying() ? '⏸️ Pause' : '▶️ Abspielen');
      tg.addEventListener('click', () => { if (ctrl) { ctrl.toggle(); upd(); } });
      if (animEl) animEl.addEventListener('click', () => { if (ctrl) { ctrl.toggle(); upd(); } });
      root.querySelector('#aSpeed').addEventListener('click', (ev) => {
        const b = ev.target.closest('[data-speed]'); if (!b || !ctrl) return;
        ctrl.setSpeed(+b.dataset.speed);
        root.querySelectorAll('#aSpeed .chip').forEach((c) => c.classList.toggle('on', c === b));
      });
      root.querySelector('#dFav').addEventListener('click', (ev) => {
        toggleFav(e.id);
        ev.target.classList.toggle('on', isFav(e.id));
      });
    });
  }

  function toggleFav(id) {
    if (isFav(id)) state.favorites = state.favorites.filter((x) => x !== id);
    else state.favorites.push(id);
    save();
    document.querySelectorAll(`#view [data-fav="${CSS.escape(id)}"]`).forEach((b) => b.classList.toggle('on', isFav(id)));
    toast(isFav(id) ? 'Als Favorit gemerkt ★' : 'Favorit entfernt');
  }

  /* =========================================================
     VERLAUF
     ========================================================= */
  const SMILEYS = [[1, '😕'], [2, '🙂'], [3, '😄'], [4, '🤩']];

  function renderVerlauf() {
    const list = state.sessions.slice().sort((a, b) => b.date.localeCompare(a.date));
    if (!list.length) return `<h1>Verlauf</h1><div class="card empty"><div class="big">🗓️</div><p>Noch keine Trainings gespeichert.<br>Nach dem Training auf „Training abschließen“ tippen.</p></div>`;
    const avgAtt = list.reduce((s, x) => s + (x.attendees.length || x.count || 0), 0) / list.length;
    const halle = list.filter((s) => s.venue === 'halle').length;
    return `
      <h1>Verlauf</h1>
      <div class="grid grid-3" style="grid-template-columns:repeat(3,1fr);margin-bottom:14px">
        <div class="card" style="margin:0;text-align:center"><b style="font-size:1.5rem;color:var(--primary-2)">${list.length}</b><div class="small muted">Trainings</div></div>
        <div class="card" style="margin:0;text-align:center"><b style="font-size:1.5rem;color:var(--primary-2)">${avgAtt.toFixed(1)}</b><div class="small muted">Ø Kinder</div></div>
        <div class="card" style="margin:0;text-align:center"><b style="font-size:1.5rem;color:var(--primary-2)">${halle}/${list.length - halle}</b><div class="small muted">Halle/Draußen</div></div>
      </div>
      ${list.map((s) => {
        const d = new Date(s.date);
        const names = (s.stations || []).concat([s.funinoLearn, s.funinoPlay], s.blocks.map((b) => b.exerciseId)).filter((id) => id && EX[id]).map((id) => EX[id].name);
        const sm = SMILEYS.find((x) => x[0] === s.rating);
        return `<div class="list-item" data-session="${s.id}">
          <div class="date-badge">${d.getDate()}<small>${d.toLocaleDateString('de-DE', { month: 'short' })}</small></div>
          <div style="flex:1;min-width:0">
            <div class="row" style="gap:6px"><span class="tag ${s.venue}">${VENUES[s.venue]}</span><span class="small muted">👥 ${s.attendees.length || s.count || '?'}</span></div>
            <div class="small" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:4px">${esc(names.join(' · '))}</div>
          </div>
          <div style="font-size:1.5rem">${sm ? sm[1] : ''}</div>
        </div>`;
      }).join('')}
    `;
  }

  function openSession(id) {
    const s = state.sessions.find((x) => x.id === id);
    if (!s) return;
    const names = s.attendees.map((a) => (kidById(a) || {}).name).filter(Boolean).sort((a, b) => a.localeCompare(b, 'de'));
    openModal(`
      <h2>${VENUES[s.venue]}-Training</h2>
      <p class="muted">${fmtDate(s.date)} · ${planMinutes(s)} Minuten</p>
      <h3>Wie war's?</h3>
      <div class="smileys" id="sRate">${SMILEYS.map(([v, e]) => `<button data-rate="${v}" class="${s.rating === v ? 'on' : ''}">${e}</button>`).join('')}</div>
      <div class="field" style="margin-top:12px"><label for="sNote">Notiz zum Training</label>
        <textarea class="input" id="sNote" placeholder="Was lief gut, was nehme ich mir vor?">${esc(s.note)}</textarea></div>
      <h3>Anwesend (${names.length || s.count || 0})</h3>
      <p class="small">${names.length ? esc(names.join(', ')) : '<span class="muted">keine Liste</span>'}</p>
      <h3>Ablauf</h3>
      ${s.stations ? `<p>${s.stations.concat([s.funinoLearn, s.funinoPlay]).map((id, i) => EX[id] ? `${i < s.stations.length ? (isSolo(s) ? '🔁' : ST_NUM[i]) : '🥅'} <a href="#" data-ex="${id}">${esc(EX[id].name)}</a>` : '').filter(Boolean).join('<br>')}</p>` : ''}
      <ul style="padding-left:1.1rem">${s.blocks.map((b) => {
        const ex = EX[b.exerciseId];
        return `<li><b>${b.minutes}′</b> ${esc(b.type !== 'ex' ? blockTitle(s, b) : b.label)}${ex ? `: <a href="#" data-ex="${ex.id}">${esc(ex.name)}</a>` : ''}</li>`;
      }).join('')}</ul>
      <div class="row" style="margin-top:12px">
        <button class="btn btn-danger" id="sDel">Löschen</button><span class="spacer"></span>
        <button class="btn" id="sReuse">♻️ Nochmal verwenden</button>
      </div>`, (root) => {
      root.querySelector('#sRate').addEventListener('click', (e) => {
        const b = e.target.closest('[data-rate]'); if (!b) return;
        s.rating = +b.dataset.rate; save();
        root.querySelectorAll('#sRate button').forEach((x) => x.classList.toggle('on', x === b));
        rerender();
      });
      root.querySelector('#sNote').addEventListener('change', (e) => { s.note = e.target.value; save(); });
      root.querySelectorAll('[data-ex]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); openExercise(a.dataset.ex); }));
      root.querySelector('#sDel').addEventListener('click', () => {
        if (!confirm('Training aus dem Verlauf löschen?')) return;
        state.sessions = state.sessions.filter((x) => x.id !== s.id); save(); closeModal(); rerender();
      });
      root.querySelector('#sReuse').addEventListener('click', () => { closeModal(); reuseSession(s); });
    });
  }

  /* =========================================================
     MEHR / EINSTELLUNGEN
     ========================================================= */
  function renderMehr() {
    const st = state.settings;
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    return `
      <h1>Mehr</h1>
      ${!standalone ? `<div class="card" style="border:2px solid var(--primary-2)"><h3>📲 App installieren</h3>
        <p class="small">${isIOS ? 'In Safari unten auf <b>Teilen</b> (□↑) tippen → <b>„Zum Home-Bildschirm“</b>.' : 'Im Browser-Menü (⋮) auf <b>„App installieren“</b> bzw. <b>„Zum Startbildschirm hinzufügen“</b> tippen.'} Danach startet die App wie eine normale App und funktioniert auch offline.</p></div>` : ''}
      <div class="card">
        <h3>Verein</h3>
        <div class="grid grid-2">
          <div class="field"><label for="sClub">Vereinsname</label><input class="input" id="sClub" value="${esc(st.club)}"></div>
          <div class="field"><label for="sTeam">Mannschaft</label><input class="input" id="sTeam" value="${esc(st.team)}"></div>
        </div>
      </div>
      <div class="card">
        <h3>📣 Sprüche</h3>
        <div class="field"><label for="sChantStart">Begrüßung</label><textarea class="input" id="sChantStart" style="min-height:60px">${esc(chantStart())}</textarea></div>
        <div class="field" style="margin:0"><label for="sChantEnd">Abschluss</label><textarea class="input" id="sChantEnd" style="min-height:80px">${esc(chantEnd())}</textarea>
          <span class="small muted">Tipp: Jede Zeile wird im Timer groß als eigene Zeile angezeigt.</span></div>
      </div>
      <div class="card">
        <h3>G1 / G2</h3>
        <div class="field" style="margin:0;max-width:300px"><label for="sG1Year">G1 = Jahrgang … und älter</label>
          <select class="input" id="sG1Year">${Array.from({ length: 8 }, (_, i) => new Date().getFullYear() - 3 - i).map((y) => `<option value="${y}" ${g1Year() === y ? 'selected' : ''}>${y}</option>`).join('')}</select>
          <span class="small muted">Jüngere Kinder = G2. Einzelne Kinder kannst du in ihrem Profil umstellen.</span></div>
      </div>
      <div class="card">
        <h3>Standard-Material</h3>
        <p class="small muted">Vorauswahl beim Planen. Pro Training kannst du das Material beim Planen noch anpassen.</p>
        <div class="chips">${Store.MATERIAL.map((m) => `<button class="chip ${st.material.includes(m.key) ? 'on' : ''}" data-mat="${m.key}">${m.label}</button>`).join('')}</div>
        <div class="field" style="margin-top:14px;max-width:260px"><label for="sDay">Fester Trainingstag (für neue Planungen)</label>
          <select class="input" id="sDay">${WEEKDAYS.map((d, i) => `<option value="${i}" ${(state.settings.trainingDay == null ? 3 : +state.settings.trainingDay) === i ? 'selected' : ''}>${d}</option>`).join('')}</select></div>
        <label class="row" style="margin-top:4px"><input type="checkbox" id="sSound" ${st.sound ? 'checked' : ''} style="width:20px;height:20px;accent-color:var(--primary-2)"> Signalton & Vibration im Timer</label>
      </div>
      <div class="card">
        <h3>⚽ DFB-Leitlinien Bambini</h3>
        <ul class="info-list small">${(window.DFB_INFO || DEFAULT_INFO).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>

      </div>
      <div class="card">
        <h3>💾 Daten</h3>
        <p class="small muted">Alle Daten liegen nur auf diesem Gerät. <b>Alles exportieren</b> = komplette Sicherung (Import ersetzt alles). <b>Nur Kinderliste</b> = zum Teilen mit dem 2. Trainer (Import ergänzt/aktualisiert nur die Kinder).</p>
        <div class="row">
          <button class="btn" data-act="export">⬇️ Alles exportieren</button>
          <button class="btn" data-act="export-kids">👧 Nur Kinderliste</button>
          <label class="btn">⬆️ Importieren<input type="file" id="importFile" accept="application/json,.json" hidden></label>
          <span class="spacer"></span>
          <button class="btn btn-danger" data-act="reset">Alles löschen</button>
        </div>
        ${Store.hasBackup() ? `<p class="small" style="margin-top:10px">↩️ Automatische Sicherung vom ${Store.backupInfo() ? fmtDate(Store.backupInfo(), { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + new Date(Store.backupInfo()).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : '–'} (vor dem letzten Import/Löschen) <button class="btn btn-sm" data-act="restore-backup">Wiederherstellen</button></p>` : ''}
        <p class="small muted" style="margin-top:10px">Letzte Sicherung: ${state.settings.lastExport ? fmtDate(state.settings.lastExport, { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'noch nie'} · ${state.kids.length} Kinder · ${state.planned.length} geplant · ${state.sessions.length} Trainings · ${state.favorites.length} Favoriten</p>
      </div>
      <p class="small muted" style="text-align:center">G1 Trainer v1.0 · ${ACTIVE_EX.length} Übungen</p>
    `;
  }

  const DEFAULT_INFO = [
    'Spaß und Bewegungsfreude stehen im Mittelpunkt – Ergebnisse sind unwichtig.',
    'Viele Ballkontakte: möglichst jedes Kind hat einen eigenen Ball.',
    'Kein langes Anstellen – kleine Gruppen, alle sind gleichzeitig aktiv.',
    'Spielgeschichten statt Erklärungen: Kinder lernen durch Ausprobieren.',
    'Kleine Spielformen (2:2, 3:3 auf Minitore) statt großer Mannschaften.',
    'Viel loben, wenig korrigieren – Fehler gehören zum Lernen.',
  ];

  function updateBrand() {
    document.getElementById('brandClub').textContent = state.settings.club || 'G1 Trainer';
  }

  // Teilen (WhatsApp, Mail …) wenn möglich, sonst Download
  async function shareOrDownload(name, text, title) {
    try {
      const file = new File([text], name, { type: 'application/json' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title }); return; }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    download(name, text);
  }

  function download(name, text) {
    const blob = new Blob([text], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  /* =========================================================
     TIMER
     ========================================================= */
  let timer = null;

  // Zeitbasis: echte Uhrzeit (endsAt), Stand wird gespeichert → übersteht Neuladen, Sperre, App-Wechsel
  function startTimer(plan) {
    if (!plan) return;
    if (timer) closeTimer(false);
    document.getElementById('toast').hidden = true;
    const lt = state.liveTimer && state.liveTimer.planId === plan.id ? state.liveTimer : null;
    timer = { plan, idx: lt ? Math.min(lt.idx, plan.blocks.length - 1) : 0, running: lt ? lt.running : false, endsAt: lt && lt.running ? lt.endsAt : null,
      remaining: 0, rem: (lt && lt.rem) || {}, startedAt: lt ? lt.startedAt : Date.now(), beeped: false, warned: false, lastOver: 0, ctrls: [], int: null, audio: null };
    timer.remaining = lt ? (lt.running && lt.endsAt ? (lt.endsAt - Date.now()) / 1000 : lt.remaining) : plan.blocks[0].minutes * 60;
    timer.beeped = timer.remaining <= 0; timer.warned = timer.remaining <= 60;
    persistTimer();
    const el = document.createElement('div');
    el.className = 'timer';
    el.id = 'timer';
    document.body.appendChild(el);
    document.body.style.overflow = 'hidden';
    try { timer.audio = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* kein Audio */ }
    drawTimer();
    timer.int = setInterval(tick, 250);
    requestWake();
    Store.requestPersist();
  }

  document.addEventListener('visibilitychange', () => {
    if (!timer || document.visibilityState !== 'visible') return;
    tick();
    if (timer.audio && timer.audio.state !== 'running') timer.audio.resume().catch(() => {});
    if (timer.running && timer.remaining < 0) toast(`⏰ Zeit ist um (+${fmtClock(-timer.remaining).replace('+', '')})`);
  });

  function updateAwake(on) {
    const b = document.getElementById('tAwake');
    if (!b) return;
    b.textContent = on ? '🔆 Display bleibt an' : '⚠️ Display kann ausgehen – antippen';
    b.classList.toggle('off', !on);
  }
  function requestWake() {
    if (!window.KeepAwake) return;
    KeepAwake.onChange(updateAwake);
    KeepAwake.enable().then(updateAwake);
  }

  function fmtClock(sec) {
    const neg = sec < 0; sec = Math.abs(Math.round(sec));
    return (neg ? '+' : '') + Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }

  function persistTimer() {
    if (!timer) return;
    state.liveTimer = { planId: timer.plan.id, idx: timer.idx, running: timer.running, endsAt: timer.running ? timer.endsAt : null,
      remaining: timer.remaining, rem: timer.rem, startedAt: timer.startedAt };
    save();
  }

  // Signal: kräftiger Pfiff-ähnlicher Ton (laut genug für die Halle); short = Vorwarnung/Überzeit
  function beep(short) {
    if (!state.settings.sound) return;
    try { navigator.vibrate && navigator.vibrate(short ? [200] : [400, 150, 400, 150, 700]); } catch (e) { /* */ }
    const ac = timer && timer.audio;
    if (!ac) return;
    try {
      if (ac.state !== 'running') ac.resume();
      const seq = short ? [[0, 1318, 0.18]] : [[0, 1046, 0.35], [0.45, 1046, 0.35], [0.9, 1568, 0.7]];
      seq.forEach(([d, f, len]) => {
        const o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain();
        o.type = 'square'; o.frequency.value = f; o2.type = 'sine'; o2.frequency.value = f * 1.5;
        const t0 = ac.currentTime + d;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.6, t0 + 0.02);
        g.gain.setValueAtTime(0.6, t0 + len - 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
        o.connect(g); o2.connect(g); g.connect(ac.destination);
        o.start(t0); o2.start(t0); o.stop(t0 + len + 0.02); o2.stop(t0 + len + 0.02);
      });
    } catch (e) { /* */ }
  }

  function tick() {
    if (!timer) return;
    if (timer.running) timer.remaining = (timer.endsAt - Date.now()) / 1000;
    const r = timer.remaining;
    if (timer.running) {
      if (r <= 60 && r > 0 && !timer.warned) { timer.warned = true; beep(true); }
      if (r <= 0 && !timer.beeped) { timer.beeped = true; timer.lastOver = 0; beep(); }
      if (r < 0 && Math.floor(-r / 60) > timer.lastOver) { timer.lastOver = Math.floor(-r / 60); beep(true); }
    }
    updateClock();
  }

  function drawTimer() {
    const plan = timer && timer.plan;
    const el = document.getElementById('timer');
    if (!el || !plan) return;
    destroyAll(timer.ctrls);
    const b = plan.blocks[timer.idx];
    const next = plan.blocks[timer.idx + 1];
    const type = b.type === 'ritual' ? (b.key === 'aufbau' ? 'arrive' : 'ritual') : (['single', 'funino-learn', 'funino-play', 'final'].includes(b.type) ? 'ex' : b.type);
    const colorType = b.type === 'single' ? 'station' : (b.type.startsWith('funino') || (b.type === 'final' && plan.funinoPlay)) ? 'funino' : b.type === 'final' ? 'final' : type;
    const ph = blockPh(b);
    const total = planMinutes(plan);
    const elapsed = plan.blocks.slice(0, timer.idx).reduce((s, x) => s + x.minutes, 0);
    const list = (arr) => (arr || []).map((x) => `<li>${esc(x)}</li>`).join('');
    const groups = plan.stations ? planGroups(plan) : null;
    const nextRound = plan.blocks.slice(timer.idx + 1).find((x) => x.type === 'station');
    const moveHint = (round) => GROUPS.map((G, g) => `<span class="grp grp-${G.key} sm">${G.key}</span>→${ST_NUM[stationOf(g, round)]}`).join(' &nbsp; ');
    el.dataset.type = colorType;
    el.classList.toggle('paused', !timer.running);

    let core = '', details = '', typeLabel = ph.label, title = blockTitle(plan, b);
    if (type === 'ritual') {
      const r = Generator.RITUALS[b.key] || {};
      typeLabel = '📣 Ritual';
      title = b.label;
      core = (chantFor(b) ? callCard(chantFor(b)) : '') + `<p class="timer-note">${esc(r.text || '')}</p>`;
      if (r.tips) details = `<details><summary>Tipps</summary><ul>${list(r.tips)}</ul></details>`;
    } else if (type === 'arrive') {
      typeLabel = '⚽ Freies Training';
      title = 'Kinder toben mit Ball – ihr baut auf';
      core = `<p class="timer-note"><b>Kinder:</b> ankommen, laufen, toben – jedes Kind mit Ball.<br><b>Trainer:</b> Stationen aufbauen ↓</p>${plan.stations ? setupChecklist(plan, true) : ''}`;
    } else if (type === 'station') {
      typeLabel = `🔁 Stationen · Runde ${b.round}/3`;
      title = 'Stationsbetrieb';
      core = `<div class="rot-grid">${GROUPS.map((G, g) => {
        const si = stationOf(g, b.round); const ex = EX[plan.stations[si]];
        return `<div class="rot-row st-${si + 1}"><span class="grp grp-${G.key}">${G.key}</span><span class="st-num sm">${si + 1}</span>
          <div style="min-width:0"><div class="rot-st">${ex ? esc(ex.name) : '–'}</div><div class="rot-short">${ex ? esc(exShort(ex)) : ''}</div>
          ${groups[g].length ? `<div class="grp-names">${esc(groupNames(groups[g]))}</div>` : ''}</div></div>`;
      }).join('')}</div>
      ${b.round < 3 ? `<div class="rot-switch">Beim Wechsel: ${moveHint(b.round + 1)}</div>` : ''}`;
      details = `<details><summary>Animationen der Stationen</summary>${plan.stations.map((id, i) => EX[id] ? `<p style="margin:10px 0 4px"><b>${ST_NUM[i]} ${esc(EX[id].name)}</b></p>${animBox(EX[id], true)}<ol class="small">${list(EX[id].steps)}</ol>` : '').join('')}</details>`;
    } else if (type === 'pause') {
      typeLabel = '🥤 Trinkpause';
      core = `<div class="big-emoji">🥤</div><p class="timer-note" style="text-align:center">Alle trinken. Lob für die Gruppe!</p>
        ${nextRound ? `<div class="rot-switch">Danach Runde ${nextRound.round}: ${moveHint(nextRound.round)}</div>` : ''}`;
    } else {
      const ex = blockEx(plan, b);
      const isFun = b.type.startsWith('funino') || (b.type === 'final' && ex && ex.funino);
      typeLabel = b.type.startsWith('funino') && ex && !ex.funino ? '⚽ Spielform' : b.type === 'single' ? '🔁 Station · alle zusammen' : b.type === 'funino-learn' ? `🎓 Funino lernen · Schritt ${ex && ex.funino ? ex.funino.step : ''}/4`
        : b.type === 'funino-play' ? '🥅 ' + b.label : b.type === 'final' ? (isFun ? '🏆 Abschluss · Funino 3:3' : '🏆 Abschlussspiel') : (b.phase === 'aufwaermen' ? '🔥 Aufwärmen' : '⚽ Übung');
      title = ex ? ex.name : b.label;
      core = ex ? `<p class="ex-short-big">${esc(exShort(ex))}</p>
          ${b.type === 'final' ? '<p class="timer-note">Auf dem Feld von Station ③ – alle zusammen.</p>' : ''}
          ${isFun && ex && ex.funino ? funinoRules() : ''}
          <ul class="timer-steps">${list((ex.steps || []).slice(0, 3))}</ul>
          <div class="timer-thumb">${animBox(ex, true)}</div>`
        : '<p class="timer-note">Keine Übung hinterlegt.</p>';
      if (ex) details = `<details><summary>Aufbau, Tipps, Varianten</summary>
          <p class="small"><b>Aufbau:</b> ${esc(ex.setup)}</p>${ex.story ? `<p class="small"><b>Geschichte:</b> ${esc(ex.story)}</p>` : ''}
          ${ex.tips && ex.tips.length ? `<ul class="small">${list(ex.tips)}</ul>` : ''}
          ${ex.easier ? `<p class="small">🟢 ${esc(ex.easier)}</p>` : ''}${ex.harder ? `<p class="small">🔴 ${esc(ex.harder)}</p>` : ''}</details>`;
    }

    el.innerHTML = `
      <div class="timer-top">
        <button class="icon-btn" id="tClose" aria-label="Timer schließen">✕</button>
        <div class="timer-progress">${plan.blocks.map((x, i) => `<i class="tl-${blockPh(x).cls} ${i < timer.idx ? 'done' : i === timer.idx ? 'now' : ''}" style="--min:${x.minutes}"></i>`).join('')}</div>
        <span class="small muted" id="tTotal" style="white-space:nowrap"></span>
        <button class="icon-btn att-btn" id="tAtt" aria-label="Anwesenheit">👥 ${plan.attendees ? plan.attendees.length : '?'}</button>
      </div>
      <button class="awake-badge" id="tAwake" type="button"></button>
      <div class="timer-main">
        <div>
          <span class="timer-type">${typeLabel}</span>
          <h1 class="timer-title">${esc(title)}</h1>
          ${['single', 'funino-learn', 'funino-play'].includes(b.type) ? '<button class="btn btn-sm btn-ghost" id="tSwap" style="margin-top:4px">🔄 Andere Übung</button>' : ''}
          <div class="clock-wrap"><div id="tClock" class="clock">${fmtClock(timer.remaining)}</div><span class="paused-badge">PAUSE</span></div>
          ${core}
        </div>
        <div>
          <div class="next-bar" id="tNextBar">${next ? `▸ Danach: <b>${esc(blockTitle(plan, next))}</b> · ${next.minutes}′` : '🏁 Letzter Block'}</div>
          ${details}
        </div>
      </div>
      <div class="timer-dock">
        <div class="main">
          <button class="btn" id="tMinus">−1′</button>
          <button class="btn btn-primary" id="tPlay">${timer.running ? '⏸ Pause' : '▶ Start'}</button>
          <button class="btn" id="tPlus">+1′</button>
        </div>
        <div class="nav">
          <button class="btn btn-ghost" id="tPrev" ${timer.idx === 0 ? 'disabled' : ''}>‹ Zurück</button>
          <span class="dock-clock" id="tMini"></span>
          <button class="btn btn-ghost" id="tNext">${next ? 'Weiter ›' : 'Fertig 🏁'}</button>
        </div>
      </div>`;
    mountAnims(el, timer.ctrls);
    updateClock();
    updateAwake(window.KeepAwake ? KeepAwake.status() : false);
    el.querySelector('#tAwake').onclick = () => requestWake();
    el.querySelector('#tClose').onclick = () => { if (confirm('Timer schließen? Der Stand bleibt gespeichert – du kannst jederzeit fortsetzen.')) { closeTimer(false); rerender(); } };
    el.querySelector('#tAtt').onclick = () => openAttendance(plan, false, () => { drawTimer(); });
    const sw = el.querySelector('#tSwap');
    if (sw) sw.onclick = () => {
      const ex = b.type === 'single' ? swapStationInPlan(plan, 0) : swapFuninoInPlan(plan, b.type === 'funino-learn' ? 'learn' : 'play');
      save(); drawTimer(); toast(ex ? `Neu: ${ex.name}` : 'Keine Alternative gefunden');
    };
    el.querySelector('#tPlay').onclick = () => {
      if (timer.audio && timer.audio.state !== 'running') timer.audio.resume();
      if (timer.running) { tick(); timer.running = false; timer.endsAt = null; }
      else { timer.running = true; timer.endsAt = Date.now() + timer.remaining * 1000; }
      persistTimer();
      if (window.KeepAwake && !KeepAwake.status()) requestWake();
      el.querySelector('#tPlay').textContent = timer.running ? '⏸ Pause' : '▶ Start';
      el.classList.toggle('paused', !timer.running);
    };
    el.querySelector('#tPrev').onclick = () => goBlock(timer.idx - 1);
    el.querySelector('#tNext').onclick = () => {
      if (next) goBlock(timer.idx + 1);
      else if (confirm('Training beenden und abschließen?')) { const pl = timer.plan; closeTimer(true); rerender(); finishPlan(pl); }
    };
    const shift = (sec) => {
      timer.remaining += sec; if (timer.running) timer.endsAt += sec * 1000;
      if (timer.remaining > 0) timer.beeped = false; if (timer.remaining > 60) timer.warned = false;
      persistTimer(); updateClock();
    };
    el.querySelector('#tPlus').onclick = () => shift(60);
    el.querySelector('#tMinus').onclick = () => shift(-60);
    el.onchange = (e) => {
      const cb = e.target.closest('[data-setup]'); if (!cb) return;
      plan.setupDone = plan.setupDone || {}; plan.setupDone[cb.dataset.setup] = cb.checked; save();
    };
  }

  function updateClock() {
    const c = document.getElementById('tClock');
    const el = document.getElementById('timer');
    if (!c || !timer) return;
    c.textContent = fmtClock(timer.remaining);
    const mini = document.getElementById('tMini');
    if (mini) { mini.textContent = (timer.running ? '' : '⏸ ') + fmtClock(timer.remaining); mini.classList.toggle('over', timer.remaining < 0); }
    const tot = document.getElementById('tTotal');
    if (tot) {
      const later = timer.plan.blocks.slice(timer.idx + 1).reduce((s2, x) => s2 + x.minutes, 0);
      tot.textContent = `noch ${Math.max(0, Math.round(Math.max(0, timer.remaining) / 60 + later))}′`;
    }
    c.className = 'clock' + (timer.remaining < 0 ? ' over' : timer.remaining < 60 ? ' low' : '');
    el.classList.toggle('over', timer.remaining < 0);
    const nb = document.getElementById('tNextBar');
    if (nb) nb.classList.toggle('soon', timer.remaining < 60);
    const nx = document.getElementById('tNext');
    if (nx) nx.classList.toggle('btn-primary', timer.remaining < 0);
  }

  function goBlock(i) {
    const plan = timer.plan;
    if (i < 0 || i >= plan.blocks.length) return;
    tick();
    timer.rem[timer.idx] = timer.remaining; // Restzeit merken (Fehltipp → zurück ohne Zeitverlust)
    timer.idx = i;
    timer.remaining = timer.rem[i] != null && timer.rem[i] > 0 ? timer.rem[i] : plan.blocks[i].minutes * 60;
    timer.beeped = timer.remaining <= 0; timer.warned = timer.remaining <= 60; timer.lastOver = 0;
    if (timer.running) timer.endsAt = Date.now() + timer.remaining * 1000;
    persistTimer();
    drawTimer();
    document.getElementById('timer').scrollTop = 0;
  }

  // clear=true: Training beendet, gespeicherten Stand löschen
  function closeTimer(clear) {
    if (!timer) return;
    if (clear) { state.liveTimer = null; save(); } else persistTimer();
    clearInterval(timer.int);
    destroyAll(timer.ctrls);
    try { window.KeepAwake && KeepAwake.disable(); } catch (e) { /* */ }
    try { timer.audio && timer.audio.close(); } catch (e) { /* */ }
    timer = null;
    const el = document.getElementById('timer');
    if (el) el.remove();
    document.body.style.overflow = '';
  }

  /* =========================================================
     Events (Delegation)
     ========================================================= */
  $view.addEventListener('click', (e) => {
    const t = e.target;
    const fav = t.closest('[data-fav]');
    if (fav) { e.stopPropagation(); toggleFav(fav.dataset.fav); return; }

    const venue = t.closest('[data-venue]');
    if (venue) { ui.venue = venue.dataset.venue; rerender(); return; }

    const focus = t.closest('[data-focus]');
    if (focus) { ui.focus = focus.dataset.focus; rerender(); return; }

    const swapB = t.closest('[data-swap]');
    if (swapB) {
      const ex = swapInPlan(planById(ui.openPlan), +swapB.dataset.swap);
      save(); rerender();
      toast(ex ? `Neu: ${ex.name}` : 'Keine Alternative gefunden');
      return;
    }

    const exB = t.closest('[data-ex]');
    if (exB) { openExercise(exB.dataset.ex); return; }

    const ky = t.closest('[data-kid-year]');
    if (ky) { ui.kidYear = ky.dataset.kidYear; rerender(); return; }

    const kt = t.closest('[data-kid-team]');
    if (kt) { ui.kidTeam = kt.dataset.kidTeam; rerender(); return; }

    const fs = t.closest('[data-fstep]');
    if (fs) { ui.funinoStep = Math.min(4, Math.max(1, (ui.funinoStep || Generator.funinoStep(state)) + +fs.dataset.fstep)); rerender(); return; }

    const md = t.closest('[data-mode]');
    if (md) { ui.mode = md.dataset.mode; rerender(); return; }

    const sf = t.closest('[data-swap-funino]');
    if (sf) {
      const ex = swapFuninoInPlan(planById(ui.openPlan), sf.dataset.swapFunino);
      save(); rerender(); toast(ex ? `Funino: ${ex.name}` : 'Keine Alternative gefunden');
      return;
    }

    const mk = t.closest('[data-move-kid]');
    if (mk) {
      const pl = planById(ui.openPlan); if (!pl) return;
      const gs = planGroups(pl).map((g) => g.map((k) => k.id));
      const gi = gs.findIndex((g) => g.includes(mk.dataset.moveKid));
      gs[gi] = gs[gi].filter((id) => id !== mk.dataset.moveKid);
      gs[(gi + 1) % 3].push(mk.dataset.moveKid);
      pl.groupOverride = gs; save(); rerender();
      return;
    }

    const ss = t.closest('[data-swap-station]');
    if (ss) {
      const ex = swapStationInPlan(planById(ui.openPlan), +ss.dataset.swapStation);
      save(); rerender(); toast(ex ? `Station ${+ss.dataset.swapStation + 1}: ${ex.name}` : 'Keine Alternative gefunden');
      return;
    }

    const ke = t.closest('[data-kid-elig]');
    if (ke) { ui.kidElig = ke.dataset.kidElig; rerender(); return; }

    const pm = t.closest('[data-pmat]');
    if (pm) { const m = pm.dataset.pmat; if (ui.material.has(m)) ui.material.delete(m); else ui.material.add(m); rerender(); return; }

    const plm = t.closest('[data-plmat]');
    if (plm) {
      const pl = planById(ui.openPlan); const m = plm.dataset.plmat;
      const mat = planMaterial(pl);
      if (mat.has(m)) mat.delete(m); else mat.add(m);
      pl.material = [...mat];
      const n = fixMaterial(pl);
      rerender();
      toast(n ? `${n} Übung(en) passend ersetzt` : 'Material gespeichert');
      return;
    }

    const op = t.closest('[data-open-plan]');
    if (op) { openPlan(op.dataset.openPlan); return; }

    const kid = t.closest('[data-kid]');
    if (kid) { openKid(kid.dataset.kid); return; }

    const sess = t.closest('[data-session]');
    if (sess) { openSession(sess.dataset.session); return; }

    const f = t.closest('[data-filter]');
    if (f) {
      ui[f.dataset.filter] = f.dataset.val;
      document.querySelectorAll(`[data-filter="${f.dataset.filter}"]`).forEach((c) => c.classList.toggle('on', c === f));
      refreshExList(); return;
    }

    const mat = t.closest('[data-mat]');
    if (mat) {
      const m = mat.dataset.mat, list = state.settings.material;
      state.settings.material = list.includes(m) ? list.filter((x) => x !== m) : list.concat(m);
      mat.classList.toggle('on'); save(); return;
    }

    const act = t.closest('[data-act]');
    if (!act) return;
    switch (act.dataset.act) {
      case 'plan-new': startNewPlan(); break;
      case 'plan-back': ui.openPlan = null; ui.newPlan = false; rerender(); window.scrollTo(0, 0); break;
      case 'generate': generatePlan(); break;
      case 'regen': { const pl = planById(ui.openPlan); if (pl && confirm('Alle Übungen neu vorschlagen?')) regenPlan(pl); break; }
      case 'plan-delete': {
        const pl = planById(ui.openPlan);
        if (pl && confirm(`Training am ${fmtDay(pl.day)} löschen?`)) { state.planned = state.planned.filter((p) => p.id !== pl.id); if (state.liveTimer && state.liveTimer.planId === pl.id) state.liveTimer = null; ui.openPlan = null; save(); rerender(); toast('Gelöscht'); }
        break;
      }
      case 'switch-mode': {
        const pl = planById(ui.openPlan);
        if (pl && confirm(pl.mode === 'solo' ? 'Auf 3 Stationen (zu zweit) umstellen? Die Übungen werden neu vorgeschlagen.' : 'Auf 1 Station + Funino (allein) umstellen? Die Übungen werden neu vorgeschlagen.')) {
          pl.mode = pl.mode === 'solo' ? 'team' : 'solo'; state.settings.lastMode = pl.mode; regenPlan(pl);
        }
        break;
      }
      case 'regen-keep': {
        const pl = planById(ui.openPlan);
        if (pl) { pl.blocks = (pl.mode === 'solo' ? Generator.SOLO_TEMPLATES : Generator.TEMPLATES)[pl.venue].blocks.map((x) => Object.assign({ exerciseId: null, phase: null, key: null }, x)); save(); rerender(); toast('Ablauf umgestellt'); }
        break;
      }
      case 'groups-reset': { const pl = planById(ui.openPlan); if (pl) { pl.groupOverride = null; save(); rerender(); } break; }
      case 'fix-mat': { const pl = planById(ui.openPlan); const n = fixMaterial(pl); rerender(); toast(`${n} Übung(en) ersetzt`); break; }
      case 'attendance': openAttendance(planById(ui.openPlan), false); break;
      case 'start': startTimer(planById(ui.openPlan)); break;
      case 'reuse-last': { const last = state.sessions.slice().sort((a, b) => b.date.localeCompare(a.date))[0]; reuseSession(last); break; }
      case 'resume-timer': { const pl = state.liveTimer && planById(state.liveTimer.planId); if (pl) { ui.openPlan = pl.id; rerender(); startTimer(pl); } break; }
      case 'finish': finishPlan(planById(ui.openPlan)); break;
      case 'kid-new': openKid(null); break;
      case 'kid-rate-all': openRateMany(activeKids().filter((k) => !k.ratings), 'Noch nicht bewertet'); break;
      case 'ex-fav': ui.exFav = !ui.exFav; act.classList.toggle('on', ui.exFav); refreshExList(); break;
      case 'export-kids': shareOrDownload(`g1-kinderliste-${todayIso()}.json`, Store.exportKidsJSON(), 'G1 Kinderliste'); break;
      case 'export': shareOrDownload(`g1-trainer-sicherung-${todayIso()}.json`, Store.exportJSON(), 'G1 Trainer Sicherung'); rerender(); break;
      case 'restore-backup':
        if (confirm('Automatische Sicherung wiederherstellen? Der aktuelle Stand wird dabei selbst gesichert.')) { try { Store.restoreBackup(); location.reload(); } catch (err) { alert(err.message); } }
        break;
      case 'reset':
        if (confirm('Wirklich ALLE Daten (Kinder, Verlauf, Favoriten) löschen?') && confirm('Sicher? Das kann nicht rückgängig gemacht werden.')) {
          Store.reset(); Object.assign(state, Store.state); location.reload();
        }
        break;
    }
  });

  $view.addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset.setup) {
      const pl = planById(ui.openPlan);
      if (pl) { pl.setupDone = pl.setupDone || {}; pl.setupDone[t.dataset.setup] = t.checked; save(); rerender(); }
      return;
    }
    if (t.id === 'pG2') { ui.withG2 = t.checked; rerender(); return; }
    if (t.id === 'planG2') {
      const pl = planById(ui.openPlan);
      if (pl) { pl.withG2 = t.checked; if (pl.attendees) pl.attendees = pl.attendees.filter((id) => expectedIds(pl).includes(id)); save(); rerender(); toast(t.checked ? 'G2 trainiert mit' : 'Nur G1'); }
      return;
    }
    if (t.id === 'sChantStart') { state.settings.chantStart = t.value.trim(); save(); toast('Gespeichert'); return; }
    if (t.id === 'sChantEnd') { state.settings.chantEnd = t.value.trim(); save(); toast('Gespeichert'); return; }
    if (t.id === 'sG1Year') { state.settings.g1Year = +t.value; save(); toast('Gespeichert'); return; }
    if (t.id === 'pDay') {
      if (t.value) { ui.newDay = t.value; ui.venue = defaultVenueFor(t.value); }
      rerender(); return;
    }
    if (t.id === 'planDay') {
      const pl = planById(ui.openPlan);
      if (pl && t.value) { pl.day = t.value; save(); rerender(); toast(`Verschoben auf ${fmtDay(t.value)}`); }
      return;
    }
    if (t.id === 'sDay') { state.settings.trainingDay = +t.value; save(); toast('Gespeichert'); return; }
    if (t.id === 'guestCount') { ui.guestCount = Math.max(1, +t.value || 1); return; }
    if (t.id === 'sClub') { state.settings.club = t.value.trim() || '1. FC Hochstadt'; save(); updateBrand(); toast('Gespeichert'); return; }
    if (t.id === 'sTeam') { state.settings.team = t.value.trim(); save(); toast('Gespeichert'); return; }
    if (t.id === 'sSound') { state.settings.sound = t.checked; save(); return; }
    if (t.id === 'importFile' && t.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (Store.isKidsFile(data)) {
            if (!confirm(`Kinderliste mit ${data.kids.length} Kindern importieren? Neue Kinder werden hinzugefügt, vorhandene (gleicher Name) aktualisiert.`)) return;
            const r = Store.importJSON(reader.result);
            alert(`Fertig: ${r.added} Kinder hinzugefügt, ${r.updated} aktualisiert.${r.noElig && r.noElig.length ? `\n\nBei ${r.noElig.length} Kindern stand keine Spielberechtigung in der Datei – sie wurden als „spielberechtigt“ übernommen. Bitte kurz prüfen.` : ''}`);
            location.hash = '#kinder'; route();
            return;
          }
          if (!confirm('Diese Datei ist eine komplette Sicherung und ersetzt ALLE Daten auf diesem Gerät. Fortfahren?')) return;
          Store.importJSON(reader.result);
          location.reload();
        } catch (err) { alert('Import fehlgeschlagen: ' + err.message); }
      };
      reader.readAsText(t.files[0]);
    }
  });

  $view.addEventListener('input', (e) => {
    if (e.target.id === 'exSearch') {
      ui.exSearch = e.target.value;
      clearTimeout(refreshExList._t);
      refreshExList._t = setTimeout(refreshExList, 200);
    }
  });

  /* ---------- Start ---------- */
  let saveWarned = 0;
  Store.onSaveError = () => { if (Date.now() - saveWarned > 10000) { saveWarned = Date.now(); toast('⚠️ Speichern fehlgeschlagen – Speicher voll? Bitte unter „Mehr“ sichern.'); } };
  if (Store.loadProblem) setTimeout(() => alert(Store.loadProblem), 300);
  if (!Array.isArray(state.planned)) state.planned = [];
  if (state.draft) {
    const d = state.draft;
    d.day = nextFreeDay(); d.attendees = null;
    state.planned.push(d); state.draft = null; save();
  }
  updateBrand();
  if (state.liveTimer && planById(state.liveTimer.planId)) {
    ui.openPlan = state.liveTimer.planId;
    if (location.hash !== '#training') history.replaceState(null, '', '#training');
    route();
    startTimer(planById(state.liveTimer.planId));
  } else {
    if (state.liveTimer) { state.liveTimer = null; save(); }
    route();
  }

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
