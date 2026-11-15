/* G1-Trainer – Animations-Engine (klassisches Script, keine Abhängigkeiten)
 * API:
 *   var ctrl = Animator.create(containerEl, animation, { autoplay: true, speed: 1 });
 *   ctrl.play(); ctrl.pause(); ctrl.toggle(); ctrl.isPlaying(); ctrl.setSpeed(0.5|1|2); ctrl.destroy();
 * Datenformat: docs/SCHEMA.md, Abschnitt "Animation" (Feld 100 x 64, t = 0..1).
 */
(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var W = 100, H = 64;
  var uid = 0;

  var COLORS = {
    red: '#ef4444', blue: '#3b82f6', yellow: '#facc15', green: '#22c55e',
    purple: '#8b5cf6', orange: '#f97316', white: '#ffffff', black: '#111827'
  };
  var LIGHT = { yellow: 1, white: 1 }; // helle Farben -> dunkle Schrift

  function col(name, fallback) {
    if (typeof name === 'string') {
      if (COLORS[name]) return COLORS[name];
      if (/^#[0-9a-f]{3,8}$/i.test(name)) return name;
    }
    return fallback || COLORS.orange;
  }
  function num(v, d) { v = Number(v); return isFinite(v) ? v : d; }

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function g(parent, x, y, rot) {
    var t = 'translate(' + x + ' ' + y + ')';
    if (rot) t += ' rotate(' + rot + ')';
    return el('g', { transform: t }, parent);
  }
  function text(parent, x, y, str, attrs) {
    var a = {
      x: x, y: y, 'text-anchor': 'middle', 'dominant-baseline': 'central',
      'font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      'font-weight': '700'
    };
    for (var k in attrs) a[k] = attrs[k];
    var t = el('text', a, parent);
    t.textContent = String(str);
    return t;
  }

  /* ---------- Spielfeld ---------- */

  function drawField(svg, field, id) {
    var layer = el('g', { 'pointer-events': 'none' }, svg);
    if (field === 'rasen') {
      el('rect', { x: 0, y: 0, width: W, height: H, fill: '#3f9b48' }, layer);
      for (var i = 0; i < 10; i += 2) {
        el('rect', { x: i * 10, y: 0, width: 10, height: H, fill: '#4aab53' }, layer);
      }
      var ln = { fill: 'none', stroke: '#ffffff', 'stroke-width': 0.45, 'stroke-opacity': 0.9 };
      el('rect', merge(ln, { x: 2, y: 2, width: W - 4, height: H - 4 }), layer);
      el('line', merge(ln, { x1: 50, y1: 2, x2: 50, y2: H - 2, 'stroke-opacity': 0.35 }), layer);
      el('circle', merge(ln, { cx: 50, cy: 32, r: 8, 'stroke-opacity': 0.35 }), layer);
    } else {
      // Hallenboden: Holz/beige mit Dielen
      el('rect', { x: 0, y: 0, width: W, height: H, fill: '#ead5aa' }, layer);
      for (var y = 4; y < H; y += 4) {
        el('line', { x1: 0, y1: y, x2: W, y2: y, stroke: '#dcc394', 'stroke-width': 0.15 }, layer);
        var off = (y * 7) % 23;
        for (var x = off; x < W; x += 23) {
          el('line', { x1: x, y1: y - 4, x2: x, y2: y, stroke: '#d8bd8a', 'stroke-width': 0.15 }, layer);
        }
      }
      el('rect', { x: 2, y: 2, width: W - 4, height: H - 4, fill: 'none', stroke: '#1e3a8a', 'stroke-width': 0.4, 'stroke-opacity': 0.55 }, layer);
      el('line', { x1: 50, y1: 2, x2: 50, y2: H - 2, stroke: '#dc2626', 'stroke-width': 0.4, 'stroke-opacity': 0.7 }, layer);
      el('circle', { cx: 50, cy: 32, r: 9, fill: 'none', stroke: '#2563eb', 'stroke-width': 0.4, 'stroke-opacity': 0.5 }, layer);
      el('rect', { x: 2, y: 20, width: 9, height: 24, rx: 1, fill: 'none', stroke: '#16a34a', 'stroke-width': 0.35, 'stroke-opacity': 0.45 }, layer);
      el('rect', { x: W - 11, y: 20, width: 9, height: 24, rx: 1, fill: 'none', stroke: '#16a34a', 'stroke-width': 0.35, 'stroke-opacity': 0.45 }, layer);
    }
    return layer;
  }

  function merge(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }

  /* ---------- Material ---------- */

  function drawObject(layer, o, ctx) {
    if (!o || typeof o !== 'object') return;
    var x = num(o.x, 50), y = num(o.y, 32), rot = num(o.rot, 0), c, gg;
    switch (o.type) {
      case 'cone':
        c = col(o.color, COLORS.orange);
        gg = g(layer, x, y);
        el('circle', { cx: 0.25, cy: 0.35, r: 1.35, fill: '#000', 'fill-opacity': 0.2 }, gg);
        el('circle', { r: 1.35, fill: c, stroke: 'rgba(0,0,0,.35)', 'stroke-width': 0.15 }, gg);
        el('circle', { r: 0.8, fill: 'none', stroke: '#fff', 'stroke-width': 0.3, 'stroke-opacity': 0.85 }, gg);
        el('circle', { r: 0.35, fill: c }, gg);
        break;

      case 'goal': {
        gg = g(layer, x, y, rot);
        var gw = num(o.w, 10), gd = 3.6, hw = gw / 2;
        // Netz (Öffnung bei rot 0 nach unten, also +y)
        el('rect', { x: -hw, y: -gd / 2, width: gw, height: gd, fill: 'url(#' + ctx.id + '-net)', stroke: 'none' }, gg);
        var fr = 'M' + (-hw) + ' ' + (gd / 2) + ' L' + (-hw) + ' ' + (-gd / 2) + ' L' + hw + ' ' + (-gd / 2) + ' L' + hw + ' ' + (gd / 2);
        el('path', { d: fr, fill: 'none', stroke: '#1f2937', 'stroke-width': 0.9, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-opacity': 0.55 }, gg);
        el('path', { d: fr, fill: 'none', stroke: '#ffffff', 'stroke-width': 0.55, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, gg);
        // Pfosten (rot markiert)
        el('circle', { cx: -hw, cy: gd / 2, r: 0.55, fill: '#ef4444', stroke: '#fff', 'stroke-width': 0.2 }, gg);
        el('circle', { cx: hw, cy: gd / 2, r: 0.55, fill: '#ef4444', stroke: '#fff', 'stroke-width': 0.2 }, gg);
        break;
      }

      case 'hoop':
        c = col(o.color, COLORS.yellow);
        gg = g(layer, x, y);
        el('circle', { cx: 0.2, cy: 0.3, r: num(o.r, 3), fill: 'none', stroke: '#000', 'stroke-opacity': 0.18, 'stroke-width': 0.6 }, gg);
        el('circle', { r: num(o.r, 3), fill: c, 'fill-opacity': 0.08, stroke: c, 'stroke-width': 0.6 }, gg);
        break;

      case 'pole':
        gg = g(layer, x, y);
        el('circle', { cx: 0.2, cy: 0.3, r: 1.1, fill: '#000', 'fill-opacity': 0.2 }, gg);
        el('circle', { r: 1.1, fill: col(o.color, COLORS.yellow), stroke: '#111827', 'stroke-width': 0.35 }, gg);
        el('circle', { r: 0.4, fill: '#111827' }, gg);
        break;

      case 'bench': {
        var bw = num(o.w, 20), bh = 3;
        gg = g(layer, x, y, rot);
        el('rect', { x: -bw / 2 + 0.3, y: -bh / 2 + 0.4, width: bw, height: bh, rx: 0.5, fill: '#000', 'fill-opacity': 0.2 }, gg);
        el('rect', { x: -bw / 2, y: -bh / 2, width: bw, height: bh, rx: 0.5, fill: '#9a6534', stroke: '#5b3718', 'stroke-width': 0.3 }, gg);
        el('line', { x1: -bw / 2 + 0.6, y1: 0, x2: bw / 2 - 0.6, y2: 0, stroke: '#b97f48', 'stroke-width': 0.35 }, gg);
        break;
      }

      case 'mat': {
        var mw = num(o.w, 16), mh = num(o.h, 10);
        gg = g(layer, x, y, rot);
        el('rect', { x: -mw / 2 + 0.3, y: -mh / 2 + 0.4, width: mw, height: mh, rx: 1.2, fill: '#000', 'fill-opacity': 0.18 }, gg);
        el('rect', { x: -mw / 2, y: -mh / 2, width: mw, height: mh, rx: 1.2, fill: col(o.color, '#2f6fd6'), stroke: '#1e40af', 'stroke-width': 0.3 }, gg);
        el('rect', { x: -mw / 2 + 0.8, y: -mh / 2 + 0.8, width: Math.max(0, mw - 1.6), height: Math.max(0, mh - 1.6), rx: 0.8, fill: 'none', stroke: '#ffffff', 'stroke-opacity': 0.3, 'stroke-width': 0.25 }, gg);
        break;
      }

      case 'box': {
        var xw = num(o.w, 7), xh = num(o.h, 5);
        gg = g(layer, x, y, rot);
        el('rect', { x: -xw / 2 + 0.3, y: -xh / 2 + 0.4, width: xw, height: xh, rx: 0.4, fill: '#000', 'fill-opacity': 0.2 }, gg);
        el('rect', { x: -xw / 2, y: -xh / 2, width: xw, height: xh, rx: 0.4, fill: '#c99a5e', stroke: '#6b4423', 'stroke-width': 0.35 }, gg);
        el('rect', { x: -xw / 2 + 0.9, y: -xh / 2 + 0.9, width: xw - 1.8, height: xh - 1.8, rx: 0.3, fill: '#efe6d6', stroke: '#8a5a2e', 'stroke-width': 0.2 }, gg);
        break;
      }

      case 'line': {
        var la = {
          x1: num(o.x1, 0), y1: num(o.y1, 0), x2: num(o.x2, 0), y2: num(o.y2, 0),
          stroke: col(o.color, ctx.field === 'rasen' ? '#ffffff' : '#ffffff'),
          'stroke-width': num(o.width, 0.5), 'stroke-linecap': 'round'
        };
        if (ctx.field !== 'rasen' && !o.color) la.stroke = '#475569';
        if (o.dash) la['stroke-dasharray'] = '1.8 1.4';
        el('line', la, layer);
        break;
      }

      case 'zone': {
        c = col(o.color, COLORS.blue);
        el('rect', {
          x: x, y: y, width: Math.max(0, num(o.w, 10)), height: Math.max(0, num(o.h, 10)), rx: 0.6,
          fill: c, 'fill-opacity': 0.2, stroke: c, 'stroke-opacity': 0.6, 'stroke-width': 0.3
        }, layer);
        break;
      }

      case 'label':
        if (o.text == null || o.text === '') return;
        var dark = ctx.field !== 'rasen';
        text(layer, x, y, o.text, {
          'font-size': num(o.size, 2.6),
          fill: dark ? '#1f2937' : '#ffffff',
          stroke: dark ? 'rgba(255,255,255,.75)' : 'rgba(0,0,0,.35)',
          'stroke-width': 0.5, 'paint-order': 'stroke'
        });
        break;

      default:
        // unbekannter Typ -> ignorieren
        break;
    }
  }

  /* ---------- Akteure ---------- */

  function buildActor(layer, a) {
    var kind = a.kind || 'player';
    var node = el('g', null, layer), c;
    if (kind === 'ball') {
      el('circle', { cx: 0.25, cy: 0.35, r: 1.2, fill: '#000', 'fill-opacity': 0.28 }, node);
      el('circle', { r: 1.2, fill: '#ffffff', stroke: '#111827', 'stroke-width': 0.22 }, node);
      el('path', { d: 'M0 -0.45 L0.43 -0.14 L0.27 0.37 L-0.27 0.37 L-0.43 -0.14 Z', fill: '#111827' }, node);
      el('path', { d: 'M0 -0.45 L0 -1.15 M0.43 -0.14 L1.1 -0.36 M0.27 0.37 L0.68 0.95 M-0.27 0.37 L-0.68 0.95 M-0.43 -0.14 L-1.1 -0.36', stroke: '#111827', 'stroke-width': 0.14, fill: 'none' }, node);
    } else if (kind === 'coach') {
      el('circle', { cx: 0.35, cy: 0.5, r: 2.4, fill: '#000', 'fill-opacity': 0.25 }, node);
      el('circle', { r: 2.4, fill: '#374151', stroke: '#ffffff', 'stroke-width': 0.5 }, node);
      text(node, 0, 0.1, 'T', { 'font-size': 2.6, fill: '#ffffff' });
    } else {
      c = col(a.color, COLORS.red);
      el('circle', { cx: 0.35, cy: 0.5, r: 2.4, fill: '#000', 'fill-opacity': 0.25 }, node);
      el('circle', { r: 2.4, fill: c, stroke: '#ffffff', 'stroke-width': 0.5 }, node);
      if (a.label != null && a.label !== '') {
        text(node, 0, 0.1, String(a.label).slice(0, 3), {
          'font-size': String(a.label).length > 1 ? 1.9 : 2.4,
          fill: LIGHT[a.color] ? '#1f2937' : '#ffffff'
        });
      }
    }
    return node;
  }

  function normKeys(keys) {
    var out = [];
    if (Array.isArray(keys)) {
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (!Array.isArray(k) || k.length < 3) continue;
        var t = Number(k[0]), x = Number(k[1]), y = Number(k[2]);
        if (!isFinite(t) || !isFinite(x) || !isFinite(y)) continue;
        out.push([Math.max(0, Math.min(1, t)), x, y]);
      }
      out.sort(function (a, b) { return a[0] - b[0]; });
    }
    return out;
  }

  function smooth(u) { return u * u * (3 - 2 * u); }

  function posAt(keys, t) {
    var n = keys.length;
    if (n === 1 || t <= keys[0][0]) return keys[0];
    if (t >= keys[n - 1][0]) return keys[n - 1];
    for (var i = 1; i < n; i++) {
      var b = keys[i];
      if (t <= b[0]) {
        var a = keys[i - 1], span = b[0] - a[0];
        var u = span > 0 ? smooth((t - a[0]) / span) : 1;
        return [t, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
      }
    }
    return keys[n - 1];
  }

  /* ---------- Controller ---------- */

  function create(container, animation, opts) {
    opts = opts || {};
    var anim = (animation && typeof animation === 'object') ? animation : {};
    var loop = num(anim.loop, 6); if (loop <= 0) loop = 6;
    var field = anim.field === 'rasen' ? 'rasen' : 'halle';
    var speed = num(opts.speed, 1) || 1;
    var id = 'g1a' + (++uid);

    var svg = el('svg', {
      viewBox: '0 0 ' + W + ' ' + H, width: '100%',
      preserveAspectRatio: 'xMidYMid meet', role: 'img',
      'aria-label': 'Übungsanimation'
    });
    svg.style.display = 'block';
    svg.style.width = '100%';
    svg.style.height = 'auto';
    svg.style.aspectRatio = W + ' / ' + H;
    svg.style.borderRadius = '8px';
    svg.style.userSelect = 'none';
    svg.style.webkitUserSelect = 'none';

    // defs: Netzschraffur
    var defs = el('defs', null, svg);
    var pat = el('pattern', { id: id + '-net', width: 1, height: 1, patternUnits: 'userSpaceOnUse' }, defs);
    el('rect', { width: 1, height: 1, fill: '#ffffff', 'fill-opacity': 0.35 }, pat);
    el('path', { d: 'M0 0 L1 1 M1 0 L0 1', stroke: '#64748b', 'stroke-width': 0.1, 'stroke-opacity': 0.7 }, pat);

    var ctx = { id: id, field: field };
    drawField(svg, field, id);

    var objLayer = el('g', null, svg);
    var objects = Array.isArray(anim.objects) ? anim.objects : [];
    for (var i = 0; i < objects.length; i++) {
      try { drawObject(objLayer, objects[i], ctx); } catch (e) { /* ignorieren */ }
    }

    var peopleLayer = el('g', null, svg);
    var ballLayer = el('g', null, svg);
    var actors = [];
    var list = Array.isArray(anim.actors) ? anim.actors : [];
    for (var j = 0; j < list.length; j++) {
      var a = list[j];
      if (!a || typeof a !== 'object') continue;
      var kind = a.kind;
      if (kind !== 'ball' && kind !== 'coach' && kind !== 'player') kind = kind == null ? 'player' : null;
      if (!kind) continue;
      var keys = normKeys(a.keys);
      if (!keys.length) continue;
      var node = buildActor(kind === 'ball' ? ballLayer : peopleLayer, { kind: kind, color: a.color, label: a.label });
      actors.push({ node: node, keys: keys, lx: NaN, ly: NaN });
    }

    if (container) {
      while (container.firstChild) container.removeChild(container.firstChild);
      container.appendChild(svg);
    }

    var elapsed = 0;         // Sekunden in der Schleife (inkl. Speed)
    var playing = false;
    var visible = true;
    var rafId = 0;
    var lastTs = 0;
    var destroyed = false;
    var io = null;

    function render(t) {
      for (var k = 0; k < actors.length; k++) {
        var ac = actors[k], p = posAt(ac.keys, t);
        var x = Math.round(p[1] * 100) / 100, y = Math.round(p[2] * 100) / 100;
        if (x !== ac.lx || y !== ac.ly) {
          ac.node.setAttribute('transform', 'translate(' + x + ' ' + y + ')');
          ac.lx = x; ac.ly = y;
        }
      }
    }

    function frame(ts) {
      rafId = 0;
      if (destroyed || !shouldRun()) return;
      if (lastTs) {
        var dt = (ts - lastTs) / 1000;
        if (dt > 0.1) dt = 0.1;      // nach Ruckler/Tab-Wechsel nicht springen
        if (dt > 0) elapsed = (elapsed + dt * speed) % loop;
      }
      lastTs = ts;
      render(elapsed / loop);
      rafId = global.requestAnimationFrame(frame);
    }

    function shouldRun() { return playing && visible && !document.hidden; }

    function update() {
      if (destroyed) return;
      if (shouldRun()) {
        if (!rafId) { lastTs = 0; rafId = global.requestAnimationFrame(frame); }
      } else if (rafId) {
        global.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    function onVis() { update(); }
    document.addEventListener('visibilitychange', onVis);

    if (typeof global.IntersectionObserver === 'function' && container) {
      io = new global.IntersectionObserver(function (entries) {
        for (var e = 0; e < entries.length; e++) visible = entries[e].isIntersecting;
        update();
      }, { threshold: 0 });
      io.observe(container);
    }

    render(0);

    var ctrl = {
      play: function () { if (!destroyed) { playing = true; update(); } return ctrl; },
      pause: function () { playing = false; update(); return ctrl; },
      toggle: function () { return playing ? ctrl.pause() : ctrl.play(); },
      isPlaying: function () { return playing && !destroyed; },
      setSpeed: function (s) { s = Number(s); if (isFinite(s) && s > 0) speed = s; return ctrl; },
      getSpeed: function () { return speed; },
      destroy: function () {
        if (destroyed) return;
        playing = false;
        update();
        destroyed = true;
        document.removeEventListener('visibilitychange', onVis);
        if (io) { io.disconnect(); io = null; }
        if (svg.parentNode) svg.parentNode.removeChild(svg);
        actors.length = 0;
      },
      el: svg
    };

    if (opts.autoplay !== false) ctrl.play();
    return ctrl;
  }

  global.Animator = { create: create, COLORS: COLORS };
})(typeof window !== 'undefined' ? window : this);
