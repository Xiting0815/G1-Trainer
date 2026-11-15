/* G1 Trainer – App-Logik (Ansichten, Interaktion, Timer) */
(function () {
  'use strict';

  const state = Store.load();
  const AREAS = Store.AREAS;
  const PHASES = { aufwaermen: 'Aufwärmen', hauptteil: 'Hauptteil', abschluss: 'Abschlussspiel' };
  const VENUES = { halle: 'Halle', draussen: 'Draußen' };
  const FOCUS = { ballgefuehl: 'Ballgefühl', koordination: 'Koordination', laufen: 'Laufen', sozial: 'Sozial', torschuss: 'Torschuss' };
  const MAT = Object.fromEntries(Store.MATERIAL.map((m) => [m.key, m.label]));
  const LEVEL = { 1: 'Einstieg', 2: 'Mittel', 3: 'Fortgeschritten' };

  const EX = {};
  (window.EXERCISES || []).forEach((e) => (EX[e.id] = e));

  const $view = document.getElementById('view');
  const $modal = document.getElementById('modal');
  const $modalBody = document.getElementById('modalBody');

  // Nicht gespeicherter UI-Zustand
  const month = new Date().getMonth();
  const ui = {
    venue: month >= 10 || month <= 1 ? 'halle' : 'draussen', // Nov–Feb Halle
    focus: 'auto',
    attend: null, // Set der anwesenden Kind-IDs
    guestCount: 8,
    exVenue: 'alle',
    exPhase: 'alle',
    exFav: false,
    exSearch: '',
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

  function kidAvg(kid) {
    const vals = AREAS.map((a) => (kid.ratings && kid.ratings[a.key]) || 3);
    return vals.reduce((x, y) => x + y, 0) / vals.length;
  }

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

  function rerender() {
    const y = window.scrollY;
    destroyAll(viewCtrls);
    const tab = (location.hash || '#training').slice(1);
    $view.innerHTML = (ROUTES[tab] || renderTraining)();
    mountAnims($view, viewCtrls);
    window.scrollTo(0, y);
  }

  /* =========================================================
     TRAINING
     ========================================================= */
  function ensureAttend() {
    const ids = activeKids().map((k) => k.id);
    if (!ui.attend) ui.attend = new Set(ids);
    // neue Kinder automatisch als anwesend markieren, gelöschte entfernen
    ui.attend.forEach((id) => { if (!ids.includes(id)) ui.attend.delete(id); });
    return ids;
  }

  function renderTraining() {
    if (state.draft) return renderPlan(state.draft);
    const ids = ensureAttend();
    const kids = activeKids();
    const tplH = Generator.TEMPLATES.halle, tplD = Generator.TEMPLATES.draussen;
    const present = kids.filter((k) => ui.attend.has(k.id));
    const avg = Generator.avgRatings(present);
    const weakest = Generator.weakestArea(avg);
    const weakLabel = AREAS.find((a) => a.key === weakest).label;

    const attendHtml = kids.length
      ? `<div class="row" style="margin-bottom:8px"><b>${present.length} von ${kids.length} da</b><span class="spacer"></span>
           <button class="btn btn-sm btn-ghost" data-act="att-all">Alle</button><button class="btn btn-sm btn-ghost" data-act="att-none">Keine</button></div>
         <div class="attend">${kids.map((k) => `
           <label class="${ui.attend.has(k.id) ? '' : 'off'}"><input type="checkbox" data-att="${k.id}" ${ui.attend.has(k.id) ? 'checked' : ''}>
           <span>${esc(k.name)}</span></label>`).join('')}</div>`
      : `<p class="muted">Noch keine Kinder angelegt. Lege unter <a href="#kinder">Kinder</a> deine Spieler an – dann passt der Vorschlag zum Leistungsstand. Bis dahin:</p>
         <div class="field" style="max-width:220px"><label for="guestCount">Anzahl Kinder</label>
         <input class="input" id="guestCount" type="number" min="1" max="30" value="${ui.guestCount}"></div>`;

    return `
      <h1>Training planen</h1>
      <div class="card">
        <h3>Wo trainiert ihr?</h3>
        <div class="seg" role="tablist">
          <button class="${ui.venue === 'halle' ? 'on' : ''}" data-venue="halle">🏟️ Halle<span class="seg-sub">${tplH.minutes} Minuten</span></button>
          <button class="${ui.venue === 'draussen' ? 'on' : ''}" data-venue="draussen">🌳 Draußen<span class="seg-sub">${tplD.minutes} Minuten</span></button>
        </div>
      </div>
      <div class="card">
        <h3>Wer ist heute da?</h3>
        ${attendHtml}
      </div>
      <div class="card">
        <h3>Schwerpunkt</h3>
        <div class="chips">
          <button class="chip ${ui.focus === 'auto' ? 'on' : ''}" data-focus="auto">✨ Automatisch${kids.length ? ` (${esc(weakLabel)})` : ''}</button>
          ${AREAS.map((a) => `<button class="chip ${ui.focus === a.key ? 'on' : ''}" data-focus="${a.key}">${a.icon} ${a.label}</button>`).join('')}
        </div>
        <p class="small muted" style="margin-top:10px">Automatisch = der Bereich, in dem die anwesenden Kinder im Schnitt am schwächsten sind. Schwierigkeit: <b>${LEVEL[Generator.targetLevel(avg)]}</b>.</p>
      </div>
      <button class="btn btn-primary btn-big" data-act="generate">⚽ Training vorschlagen</button>
      <p class="small muted" style="text-align:center;margin-top:10px">${(window.EXERCISES || []).length} Übungen in der Bibliothek · Aufbau nach DFB-Empfehlungen für Bambini</p>
    `;
  }

  function planMinutes(plan) {
    return plan.blocks.reduce((s, b) => s + (b.minutes || 0), 0);
  }

  function renderPlan(plan) {
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
        return `<div class="block">${timeCol}<div><div class="block-title">${esc(b.label)}</div><p class="muted">Keine passende Übung gefunden.</p>
          <div class="block-actions"><button class="btn btn-sm" data-swap="${i}">🔄 Neu suchen</button></div></div></div>`;
      }
      const big = ex.players && plan.attendees.length && plan.attendees.length > ex.players[1];
      return `<div class="block">${timeCol}<div>
        <div class="block-title">${esc(b.label)}</div>
        <div class="block-ex">
          ${animBox(ex, true)}
          <div>
            <h3>${esc(ex.name)}</h3>
            <div class="ex-meta" style="margin-bottom:6px">${ex.focus.map((f) => `<span class="tag">${FOCUS[f] || f}</span>`).join(' ')}</div>
            <p class="small">${esc(ex.setup)}</p>
            ${big ? `<p class="small" style="color:var(--warn)">👥 ${plan.attendees.length} Kinder – in Gruppen à max. ${ex.players[1]} aufteilen.</p>` : ''}
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

    return `
      <div class="row" style="margin-bottom:10px"><h1 style="margin:0">Dein Training</h1><span class="spacer"></span>
        <button class="btn btn-sm btn-ghost btn-danger" data-act="discard">Verwerfen</button></div>
      <div class="card">
        <div class="plan-head">
          <span class="tag ${plan.venue}">${VENUES[plan.venue]} · ${planMinutes(plan)} Min</span>
          <span class="tag">👥 ${plan.attendees.length || plan.count || '?'} Kinder</span>
          <span class="tag">🎯 ${esc(focusLabel)}</span>
          <span class="tag">📶 ${LEVEL[plan.level]}</span>
        </div>
        <p class="small muted" style="margin:10px 0 0">🧺 Material: ${[...materials].map((m) => MAT[m] || m).join(', ') || '–'}</p>
      </div>
      <div class="grid grid-2" style="margin-bottom:14px">
        <button class="btn btn-primary btn-big" data-act="start">▶️ Training starten</button>
        <button class="btn btn-big" data-act="regen">🔄 Komplett neu</button>
      </div>
      <div class="card">${blocks}</div>
      <button class="btn btn-big" data-act="finish">✅ Training abschließen & speichern</button>
    `;
  }

  function generatePlan() {
    const attendees = state.kids.length ? [...ui.attend] : [];
    const plan = Generator.generate({ venue: ui.venue, attendees, focus: ui.focus, state, count: attendees.length || ui.guestCount });
    if (!attendees.length) plan.count = ui.guestCount;
    state.draft = plan;
    save();
    rerender();
    window.scrollTo(0, 0);
  }

  function finishPlan() {
    const plan = state.draft;
    if (!plan) return;
    plan.date = new Date().toISOString();
    state.sessions.push(plan);
    state.draft = null;
    ui.attend = null;
    save();
    location.hash = '#verlauf';
    toast('Training gespeichert 👍');
    setTimeout(() => openSession(plan.id), 50);
  }

  /* =========================================================
     KINDER
     ========================================================= */
  function attendanceCount(id) {
    return state.sessions.filter((s) => s.attendees.includes(id)).length;
  }

  function renderKinder() {
    const kids = activeKids();
    const inactive = state.kids.filter((k) => k.active === false);
    const avg = Generator.avgRatings(kids);
    const overview = kids.length ? `
      <div class="card">
        <div class="card-head"><h3 style="margin:0">Mannschaft im Schnitt</h3><span class="tag">📶 ${LEVEL[Generator.targetLevel(avg)]}</span></div>
        ${AREAS.map((a) => `<div class="area-row"><span>${a.icon} ${a.label}</span><div class="bar"><i style="width:${(avg[a.key] / 5) * 100}%"></i></div><b>${avg[a.key].toFixed(1)}</b></div>`).join('')}
        <p class="small muted" style="margin:8px 0 0">Größtes Potenzial: <b>${AREAS.find((a) => a.key === Generator.weakestArea(avg)).label}</b> – darauf legt der automatische Vorschlag den Schwerpunkt.</p>
      </div>` : '';

    const list = kids.map((k) => kidRow(k)).join('');
    return `
      <div class="row" style="margin-bottom:12px"><h1 style="margin:0">Kinder <span class="muted" style="font-weight:500">(${kids.length})</span></h1><span class="spacer"></span>
        <button class="btn btn-primary" data-act="kid-new">＋ Kind</button></div>
      ${overview}
      ${kids.length ? `<div class="grid grid-2">${list}</div>` : `<div class="card empty"><div class="big">👧🧒</div><p>Noch keine Kinder eingetragen.</p><button class="btn btn-primary" data-act="kid-new">Erstes Kind anlegen</button></div>`}
      ${inactive.length ? `<h3 style="margin-top:20px">Inaktiv (${inactive.length})</h3><div class="grid grid-2">${inactive.map((k) => kidRow(k)).join('')}</div>` : ''}
    `;
  }

  function kidRow(k) {
    return `<div class="kid" data-kid="${k.id}" style="${k.active === false ? 'opacity:.6' : ''}">
      <div class="avatar" style="background:${avatarColor(k.name)}">${esc(initials(k.name))}</div>
      <div class="kid-main">
        <div class="kid-name">${esc(k.name)} <span class="muted small">· ${k.age ? k.age + ' J.' : '–'}</span></div>
        <div class="kid-areas">${AREAS.map((a) => `<span>${a.icon} ${(k.ratings && k.ratings[a.key]) || 3}</span>`).join('')}</div>
      </div>
      <div style="text-align:right">${starsRO(kidAvg(k))}<div class="small muted">${attendanceCount(k.id)}× da</div></div>
    </div>`;
  }

  function openKid(id) {
    const isNew = !id;
    const k = isNew
      ? { id: Store.uid(), name: '', age: 5, ratings: { ballgefuehl: 3, koordination: 3, laufen: 3, sozial: 3 }, note: '', active: true }
      : JSON.parse(JSON.stringify(kidById(id)));
    const ages = [3, 4, 5, 6, 7, 8];
    openModal(`
      <h2>${isNew ? 'Neues Kind' : esc(k.name)}</h2>
      <form id="kidForm">
        <div class="grid grid-2">
          <div class="field"><label for="kName">Name</label><input class="input" id="kName" required value="${esc(k.name)}" placeholder="Vorname (Nachname)" autocomplete="off"></div>
          <div class="field"><label for="kAge">Alter</label><select class="input" id="kAge">${ages.map((a) => `<option value="${a}" ${+k.age === a ? 'selected' : ''}>${a} Jahre</option>`).join('')}</select></div>
        </div>
        <h3 style="margin-top:6px">Aktuelle Leistung</h3>
        <p class="small muted">1 = fängt gerade an · 3 = altersgerecht · 5 = schon sehr sicher</p>
        ${AREAS.map((a) => {
          const sc = (window.DFB_SCALE || {})[a.key];
          return `<div style="border-top:1px solid var(--line);padding:6px 0"><div class="row" style="justify-content:space-between"><span>${a.icon} ${a.label}</span>${starsInput(a.key, k.ratings[a.key] || 3)}</div>
          ${sc ? `<details class="small muted"><summary>Woran erkenne ich die Stufe?</summary><p style="margin:6px 0 0">★1 ${esc(sc[1])}<br>★3 ${esc(sc[3])}<br>★5 ${esc(sc[5])}</p></details>` : ''}</div>`;
        }).join('')}
        <div class="field" style="margin-top:12px"><label for="kNote">Notizen</label><textarea class="input" id="kNote" placeholder="z. B. braucht noch Mut beim Zweikampf, sehr hilfsbereit …">${esc(k.note)}</textarea></div>
        ${!isNew ? `<label class="row small" style="margin-bottom:12px"><input type="checkbox" id="kActive" ${k.active !== false ? 'checked' : ''} style="width:20px;height:20px;accent-color:var(--primary-2)"> aktiv im Team (erscheint in der Anwesenheit)</label>
        <p class="small muted">Bei ${attendanceCount(k.id)} gespeicherten Trainings dabei${k.updatedAt ? ' · Bewertung zuletzt geändert am ' + fmtDate(k.updatedAt, { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}.</p>` : ''}
        <div class="row" style="margin-top:8px">
          ${!isNew ? '<button type="button" class="btn btn-danger" id="kDel">Löschen</button>' : ''}
          <span class="spacer"></span>
          <button type="submit" class="btn btn-primary">Speichern</button>
        </div>
      </form>`, (root) => {
      root.querySelectorAll('.stars').forEach((st) => st.addEventListener('click', (e) => {
        const b = e.target.closest('[data-star]'); if (!b) return;
        const v = +b.dataset.star;
        k.ratings[st.dataset.area] = v;
        st.querySelectorAll('button').forEach((x) => x.classList.toggle('on', +x.dataset.star <= v));
      }));
      if (isNew) setTimeout(() => root.querySelector('#kName').focus(), 100);
      const del = root.querySelector('#kDel');
      if (del) del.addEventListener('click', () => {
        if (!confirm(`${k.name} wirklich löschen?`)) return;
        state.kids = state.kids.filter((x) => x.id !== k.id);
        save(); closeModal(); rerender(); toast('Gelöscht');
      });
      root.querySelector('#kidForm').addEventListener('submit', (e) => {
        e.preventDefault();
        k.name = root.querySelector('#kName').value.trim();
        if (!k.name) return;
        k.age = +root.querySelector('#kAge').value;
        k.note = root.querySelector('#kNote').value.trim();
        const act = root.querySelector('#kActive');
        if (act) k.active = act.checked;
        const old = kidById(k.id);
        if (!old || JSON.stringify(old.ratings) !== JSON.stringify(k.ratings)) k.updatedAt = new Date().toISOString();
        if (old) Object.assign(old, k); else state.kids.push(k);
        if (isNew && ui.attend) ui.attend.add(k.id);
        save(); closeModal(); rerender(); toast(isNew ? `${k.name} hinzugefügt` : 'Gespeichert');
      });
    });
  }

  /* =========================================================
     ÜBUNGEN
     ========================================================= */
  function filteredExercises() {
    const q = ui.exSearch.trim().toLowerCase();
    return (window.EXERCISES || []).filter((e) =>
      (ui.exVenue === 'alle' || e.venue.includes(ui.exVenue)) &&
      (ui.exPhase === 'alle' || e.phase === ui.exPhase) &&
      (!ui.exFav || isFav(e.id)) &&
      (!q || (e.name + ' ' + e.story + ' ' + e.setup).toLowerCase().includes(q))
    );
  }

  function exCards() {
    const list = filteredExercises();
    if (!list.length) return `<div class="card empty"><div class="big">🔍</div><p>Keine Übungen gefunden.</p></div>`;
    return `<div class="grid grid-3">${list.map((e) => `
      <div class="ex-card" data-ex="${e.id}">
        ${animBox(e, true)}
        <div class="ex-card-body">
          <div class="row" style="align-items:flex-start;flex-wrap:nowrap"><h3 style="flex:1">${esc(e.name)}</h3>
            <button class="fav ${isFav(e.id) ? 'on' : ''}" data-fav="${e.id}" aria-label="Favorit">★</button></div>
          <div class="ex-meta">${venueTags(e)} <span class="tag">${PHASES[e.phase]}</span> <span class="small muted">${e.duration}′ · ${LEVEL[e.level]}</span></div>
        </div>
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
    openModal(`
      <div class="detail">
        <h2>${esc(e.name)}</h2>
        <div class="ex-meta" style="margin-bottom:12px">${venueTags(e)} <span class="tag">${PHASES[e.phase]}</span>
          ${e.focus.map((f) => `<span class="tag">${FOCUS[f] || f}</span>`).join(' ')}</div>
        ${animBox(e, true)}
        <div class="anim-ctrl">
          <button class="btn btn-sm" id="aToggle">⏸️ Pause</button>
          <span class="spacer"></span>
          <span class="small muted">Tempo</span>
          <div class="chips" id="aSpeed"><button class="chip" data-speed="0.5">½×</button><button class="chip on" data-speed="1">1×</button><button class="chip" data-speed="2">2×</button></div>
        </div>
        ${e.story ? `<div class="story">📖 ${esc(e.story)}</div>` : ''}
        <h3>Aufbau</h3><p>${esc(e.setup)}</p>
        <h3>Ablauf</h3><ol>${list(e.steps)}</ol>
        ${e.tips && e.tips.length ? `<h3>Coaching-Tipps</h3><ul>${list(e.tips)}</ul>` : ''}
        <div class="vari" style="margin-bottom:12px">
          ${e.easier ? `<div><b>🟢 Leichter:</b><br>${esc(e.easier)}</div>` : ''}
          ${e.harder ? `<div><b>🔴 Schwerer:</b><br>${esc(e.harder)}</div>` : ''}
        </div>
        <p class="small muted">⏱️ ${e.duration} Min · 👥 ${e.players ? e.players[0] + '–' + e.players[1] : '–'} Kinder · 📶 ${LEVEL[e.level]} · 🧺 ${(e.material || []).map((m) => MAT[m] || m).join(', ') || 'kein Material'}</p>
        <button class="btn ${isFav(e.id) ? 'btn-primary' : ''}" id="dFav">★ ${isFav(e.id) ? 'Favorit' : 'Als Favorit merken'}</button>
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
        ev.target.classList.toggle('btn-primary', isFav(e.id));
        ev.target.textContent = '★ ' + (isFav(e.id) ? 'Favorit' : 'Als Favorit merken');
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
        const names = s.blocks.filter((b) => b.exerciseId && EX[b.exerciseId]).map((b) => EX[b.exerciseId].name);
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
      <ul style="padding-left:1.1rem">${s.blocks.map((b) => {
        const ex = EX[b.exerciseId];
        return `<li><b>${b.minutes}′</b> ${esc(b.label)}${ex ? `: <a href="#" data-ex="${ex.id}">${esc(ex.name)}</a>` : ''}</li>`;
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
      root.querySelector('#sReuse').addEventListener('click', () => {
        const copy = JSON.parse(JSON.stringify(s));
        copy.id = Store.uid(); copy.rating = 0; copy.note = '';
        copy.attendees = activeKids().map((k) => k.id);
        state.draft = copy; save(); closeModal(); location.hash = '#training'; route();
        toast('Als neues Training übernommen');
      });
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
        <h3>Vorhandenes Material</h3>
        <p class="small muted">Der Vorschlag nutzt nur Übungen, für die das Material da ist.</p>
        <div class="chips">${Store.MATERIAL.map((m) => `<button class="chip ${st.material.includes(m.key) ? 'on' : ''}" data-mat="${m.key}">${m.label}</button>`).join('')}</div>
        <label class="row" style="margin-top:14px"><input type="checkbox" id="sSound" ${st.sound ? 'checked' : ''} style="width:20px;height:20px;accent-color:var(--primary-2)"> Signalton & Vibration im Timer</label>
      </div>
      <div class="card">
        <h3>⚽ DFB-Leitlinien Bambini</h3>
        <ul class="info-list small">${(window.DFB_INFO || DEFAULT_INFO).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        <p class="small muted">Einheit Halle: ${Generator.TEMPLATES.halle.blocks.map((b) => b.label + ' ' + b.minutes + '′').join(' → ')}</p>
        <p class="small muted">Einheit draußen: ${Generator.TEMPLATES.draussen.blocks.map((b) => b.label + ' ' + b.minutes + '′').join(' → ')}</p>
      </div>
      <div class="card">
        <h3>💾 Daten</h3>
        <p class="small muted">Alle Daten liegen nur auf diesem Gerät. Zum Übertragen aufs Tablet (oder als Sicherung) exportieren und dort importieren.</p>
        <div class="row">
          <button class="btn" data-act="export">⬇️ Exportieren</button>
          <label class="btn">⬆️ Importieren<input type="file" id="importFile" accept="application/json,.json" hidden></label>
          <span class="spacer"></span>
          <button class="btn btn-danger" data-act="reset">Alles löschen</button>
        </div>
        <p class="small muted" style="margin-top:10px">${state.kids.length} Kinder · ${state.sessions.length} Trainings · ${state.favorites.length} Favoriten</p>
      </div>
      <p class="small muted" style="text-align:center">G1 Trainer v1.0 · ${(window.EXERCISES || []).length} Übungen</p>
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

  function startTimer() {
    const plan = state.draft;
    if (!plan) return;
    timer = { idx: 0, remaining: plan.blocks[0].minutes * 60, running: false, last: 0, beeped: false, ctrls: [], wake: null, int: null, audio: null };
    const el = document.createElement('div');
    el.className = 'timer';
    el.id = 'timer';
    document.body.appendChild(el);
    document.body.style.overflow = 'hidden';
    try { timer.audio = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* kein Audio */ }
    drawTimer();
    timer.int = setInterval(tick, 250);
    requestWake();
  }

  async function requestWake() {
    try { if (navigator.wakeLock && timer) timer.wake = await navigator.wakeLock.request('screen'); } catch (e) { /* nicht unterstützt */ }
  }
  document.addEventListener('visibilitychange', () => { if (timer && document.visibilityState === 'visible') requestWake(); });

  function fmtClock(sec) {
    const neg = sec < 0; sec = Math.abs(Math.round(sec));
    return (neg ? '+' : '') + Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }

  function beep() {
    if (!state.settings.sound) return;
    try { navigator.vibrate && navigator.vibrate([300, 120, 300, 120, 500]); } catch (e) { /* */ }
    const ac = timer && timer.audio;
    if (!ac) return;
    try {
      if (ac.state === 'suspended') ac.resume();
      [0, 0.35, 0.7].forEach((d, i) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = 'sine'; o.frequency.value = i === 2 ? 1046 : 784;
        g.gain.setValueAtTime(0.0001, ac.currentTime + d);
        g.gain.exponentialRampToValueAtTime(0.4, ac.currentTime + d + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + d + 0.3);
        o.connect(g).connect(ac.destination); o.start(ac.currentTime + d); o.stop(ac.currentTime + d + 0.32);
      });
    } catch (e) { /* */ }
  }

  function tick() {
    if (!timer || !timer.running) return;
    const now = performance.now();
    timer.remaining -= (now - timer.last) / 1000;
    timer.last = now;
    if (timer.remaining <= 0 && !timer.beeped) { timer.beeped = true; beep(); }
    const c = document.getElementById('tClock');
    if (c) {
      c.textContent = fmtClock(timer.remaining);
      c.className = 'clock' + (timer.remaining < 0 ? ' over' : timer.remaining < 60 ? ' low' : '');
    }
  }

  function drawTimer() {
    const plan = state.draft;
    const el = document.getElementById('timer');
    if (!el || !plan) return;
    destroyAll(timer.ctrls);
    const b = plan.blocks[timer.idx];
    const ex = EX[b.exerciseId];
    const next = plan.blocks[timer.idx + 1];
    const r = b.type !== 'ex' ? Generator.RITUALS[b.key] : null;
    const list = (arr) => (arr || []).map((x) => `<li>${esc(x)}</li>`).join('');
    el.innerHTML = `
      <div class="timer-top">
        <button class="icon-btn" id="tClose" aria-label="Timer schließen">✕</button>
        <div style="flex:1"><div class="small muted">${timer.idx + 1} / ${plan.blocks.length} · ${esc(b.label)}</div><b>${esc(ex ? ex.name : (r ? r.title : b.label))}</b></div>
      </div>
      <div class="timer-progress">${plan.blocks.map((x, i) => `<i class="${i < timer.idx ? 'done' : i === timer.idx ? 'now' : ''}"></i>`).join('')}</div>
      <div class="timer-main">
        <div>
          ${ex ? animBox(ex, true) : `<div class="card" style="text-align:center;font-size:3rem;margin:0">${b.type === 'pause' ? '🥤' : '🙌'}</div>`}
          <div id="tClock" class="clock">${fmtClock(timer.remaining)}</div>
          <div class="timer-ctrl">
            <button class="btn" id="tPrev" ${timer.idx === 0 ? 'disabled' : ''}>⏮️</button>
            <button class="btn btn-primary" id="tPlay">${timer.running ? '⏸️ Pause' : '▶️ Start'}</button>
            <button class="btn" id="tNext">${next ? '⏭️' : '🏁'}</button>
          </div>
          <div class="row" style="justify-content:center;margin-top:8px"><button class="btn btn-sm btn-ghost" id="tMinus">−1 Min</button><button class="btn btn-sm btn-ghost" id="tPlus">+1 Min</button></div>
          <div class="next-up">${next ? `Danach: <b>${esc(next.label)}</b>${EX[next.exerciseId] ? ' – ' + esc(EX[next.exerciseId].name) : ''} (${next.minutes}′)` : 'Letzter Block 🎉'}</div>
        </div>
        <div class="card detail" style="margin:0">
          ${ex ? `
            ${ex.story ? `<div class="story">📖 ${esc(ex.story)}</div>` : ''}
            <h3>Aufbau</h3><p class="small">${esc(ex.setup)}</p>
            <h3>Ablauf</h3><ol class="small">${list(ex.steps)}</ol>
            ${ex.tips && ex.tips.length ? `<h3>Tipps</h3><ul class="small">${list(ex.tips)}</ul>` : ''}
            ${ex.easier ? `<p class="small"><b>🟢</b> ${esc(ex.easier)}</p>` : ''}${ex.harder ? `<p class="small"><b>🔴</b> ${esc(ex.harder)}</p>` : ''}`
          : `<p>${esc(r ? r.text : '')}</p>${r && r.tips ? `<ul class="small">${list(r.tips)}</ul>` : ''}`}
        </div>
      </div>`;
    mountAnims(el, timer.ctrls);
    el.querySelector('#tClose').onclick = () => { if (confirm('Timer beenden?')) closeTimer(); };
    el.querySelector('#tPlay').onclick = () => {
      if (timer.audio && timer.audio.state === 'suspended') timer.audio.resume();
      timer.running = !timer.running; timer.last = performance.now();
      el.querySelector('#tPlay').textContent = timer.running ? '⏸️ Pause' : '▶️ Start';
    };
    el.querySelector('#tPrev').onclick = () => goBlock(timer.idx - 1);
    el.querySelector('#tNext').onclick = () => {
      if (next) goBlock(timer.idx + 1);
      else { closeTimer(); if (confirm('Training abschließen und im Verlauf speichern?')) finishPlan(); }
    };
    el.querySelector('#tPlus').onclick = () => { timer.remaining += 60; if (timer.remaining > 0) timer.beeped = false; tick(); forceClock(); };
    el.querySelector('#tMinus').onclick = () => { timer.remaining -= 60; tick(); forceClock(); };
  }

  function forceClock() {
    const c = document.getElementById('tClock');
    if (c) { c.textContent = fmtClock(timer.remaining); c.className = 'clock' + (timer.remaining < 0 ? ' over' : timer.remaining < 60 ? ' low' : ''); }
  }

  function goBlock(i) {
    const plan = state.draft;
    if (i < 0 || i >= plan.blocks.length) return;
    timer.idx = i;
    timer.remaining = plan.blocks[i].minutes * 60;
    timer.beeped = false;
    timer.last = performance.now();
    drawTimer();
    document.getElementById('timer').scrollTop = 0;
  }

  function closeTimer() {
    if (!timer) return;
    clearInterval(timer.int);
    destroyAll(timer.ctrls);
    try { timer.wake && timer.wake.release(); } catch (e) { /* */ }
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
      const ex = Generator.swap(state.draft, +swapB.dataset.swap, state);
      save(); rerender();
      toast(ex ? `Neu: ${ex.name}` : 'Keine Alternative gefunden');
      return;
    }

    const exB = t.closest('[data-ex]');
    if (exB) { openExercise(exB.dataset.ex); return; }

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
      case 'att-all': ui.attend = new Set(activeKids().map((k) => k.id)); rerender(); break;
      case 'att-none': ui.attend = new Set(); rerender(); break;
      case 'generate': generatePlan(); break;
      case 'regen':
        ui.venue = state.draft.venue;
        ui.attend = new Set(state.draft.attendees);
        ui.focus = state.draft.autoFocus ? 'auto' : state.draft.focus;
        if (state.draft.count) ui.guestCount = state.draft.count;
        generatePlan(); toast('Neuer Vorschlag'); break;
      case 'discard':
        if (confirm('Diesen Trainingsvorschlag verwerfen?')) { state.draft = null; save(); rerender(); }
        break;
      case 'start': startTimer(); break;
      case 'finish': finishPlan(); break;
      case 'kid-new': openKid(null); break;
      case 'ex-fav': ui.exFav = !ui.exFav; act.classList.toggle('on', ui.exFav); refreshExList(); break;
      case 'export': download(`g1-trainer-${new Date().toISOString().slice(0, 10)}.json`, Store.exportJSON()); toast('Export erstellt'); break;
      case 'reset':
        if (confirm('Wirklich ALLE Daten (Kinder, Verlauf, Favoriten) löschen?') && confirm('Sicher? Das kann nicht rückgängig gemacht werden.')) {
          Store.reset(); Object.assign(state, Store.state); location.reload();
        }
        break;
    }
  });

  $view.addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset.att) {
      if (t.checked) ui.attend.add(t.dataset.att); else ui.attend.delete(t.dataset.att);
      rerender(); return;
    }
    if (t.id === 'guestCount') { ui.guestCount = Math.max(1, +t.value || 1); return; }
    if (t.id === 'sClub') { state.settings.club = t.value.trim() || '1. FC Hochstadt'; save(); updateBrand(); toast('Gespeichert'); return; }
    if (t.id === 'sTeam') { state.settings.team = t.value.trim(); save(); toast('Gespeichert'); return; }
    if (t.id === 'sSound') { state.settings.sound = t.checked; save(); return; }
    if (t.id === 'importFile' && t.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          if (!confirm('Import ersetzt alle aktuellen Daten auf diesem Gerät. Fortfahren?')) return;
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
  updateBrand();
  route();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
