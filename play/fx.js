// Tileberry visual effects: ambient drifting particles behind the game, and sparkle bursts on matches.
(function (root) {
  var amb = null, spk = null, actx, sctx, W = 0, H = 0, dpr = 1, kind = null, parts = [], bursts = [], running = false, last = 0;
  var reduce = false; try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function size() { dpr = Math.min(2, window.devicePixelRatio || 1); W = window.innerWidth; H = window.innerHeight; [amb, spk].forEach(function (c) { if (!c) return; c.width = W * dpr; c.height = H * dpr; c.style.width = W + 'px'; c.style.height = H + 'px'; }); if (actx) actx.setTransform(dpr, 0, 0, dpr, 0, 0); if (sctx) sctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  var KINDS = {
    petals:    { n: 26, make: function () { return { x: rnd(0, W), y: rnd(-H, 0), s: rnd(5, 10), vy: rnd(18, 34), vx: rnd(-8, 8), a: rnd(0, 6.28), va: rnd(-1.5, 1.5), c: ['#ffc2da', '#ffd9e8', '#fff0f6', '#ffaecb'][Math.floor(rnd(0, 4))], sw: rnd(0, 6.28) }; }, draw: function (p, c) { c.save(); c.translate(p.x, p.y); c.rotate(p.a); c.fillStyle = p.c; c.globalAlpha = .85; c.beginPath(); c.ellipse(0, 0, p.s, p.s * .55, 0, 0, 6.283); c.fill(); c.restore(); } },
    leaves:    { n: 24, make: function () { var cs = ['#e0551f', '#f08a24', '#f2c038', '#c9481f', '#a8501c']; return { x: rnd(0, W), y: rnd(-H, 0), s: rnd(6, 11), vy: rnd(20, 40), vx: rnd(-12, 12), a: rnd(0, 6.28), va: rnd(-2, 2), c: cs[Math.floor(rnd(0, 5))], sw: rnd(0, 6.28) }; }, draw: function (p, c) { c.save(); c.translate(p.x, p.y); c.rotate(p.a); c.fillStyle = p.c; c.globalAlpha = .9; c.beginPath(); c.moveTo(0, -p.s); c.quadraticCurveTo(p.s, 0, 0, p.s); c.quadraticCurveTo(-p.s, 0, 0, -p.s); c.fill(); c.strokeStyle = 'rgba(80,30,0,.35)'; c.lineWidth = 1; c.beginPath(); c.moveTo(0, -p.s); c.lineTo(0, p.s); c.stroke(); c.restore(); } },
    snow:      { n: 46, make: function () { return { x: rnd(0, W), y: rnd(-H, 0), s: rnd(1.6, 4.2), vy: rnd(14, 34), vx: rnd(-6, 6), a: 0, va: 0, c: '#ffffff', sw: rnd(0, 6.28) }; }, draw: function (p, c) { c.globalAlpha = .9; c.fillStyle = p.c; c.beginPath(); c.arc(p.x, p.y, p.s, 0, 6.283); c.fill(); } },
    fireflies: { n: 22, make: function () { return { x: rnd(0, W), y: rnd(H * .3, H), s: rnd(2, 3.6), vy: rnd(-10, 10), vx: rnd(-10, 10), a: 0, va: 0, c: '#ffe58a', sw: rnd(0, 6.28), ph: rnd(0, 6.28), stay: true }; }, draw: function (p, c, t) { var al = .35 + .65 * Math.abs(Math.sin(t * 1.4 + p.ph)); var g = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s * 5); g.addColorStop(0, 'rgba(255,240,150,' + al + ')'); g.addColorStop(1, 'rgba(255,240,150,0)'); c.fillStyle = g; c.beginPath(); c.arc(p.x, p.y, p.s * 5, 0, 6.283); c.fill(); c.fillStyle = 'rgba(255,255,220,' + al + ')'; c.beginPath(); c.arc(p.x, p.y, p.s * .7, 0, 6.283); c.fill(); } },
    stars:     { n: 34, make: function () { return { x: rnd(0, W), y: rnd(0, H * .6), s: rnd(1, 2.6), vy: 0, vx: 0, a: 0, va: 0, c: '#fff', sw: 0, ph: rnd(0, 6.28), stay: true, fixed: true }; }, draw: function (p, c, t) { c.globalAlpha = .35 + .65 * Math.abs(Math.sin(t * 1.1 + p.ph)); c.fillStyle = '#fff'; c.beginPath(); c.arc(p.x, p.y, p.s, 0, 6.283); c.fill(); } },
    embers:    { n: 26, make: function () { var cs = ['#ffb347', '#ff7a1a', '#ffd966', '#ff5a3a']; return { x: rnd(0, W), y: rnd(0, H), s: rnd(1.6, 3.4), vy: rnd(-34, -14), vx: rnd(-10, 10), a: 0, va: 0, c: cs[Math.floor(rnd(0, 4))], sw: rnd(0, 6.28), up: true }; }, draw: function (p, c) { c.globalAlpha = .8; c.fillStyle = p.c; c.beginPath(); c.arc(p.x, p.y, p.s, 0, 6.283); c.fill(); } },
    hearts:    { n: 18, make: function () { var cs = ['#ff4f86', '#ff7aa2', '#ffb3cf', '#ffffff']; return { x: rnd(0, W), y: rnd(0, H), s: rnd(6, 12), vy: rnd(-28, -12), vx: rnd(-8, 8), a: 0, va: 0, c: cs[Math.floor(rnd(0, 4))], sw: rnd(0, 6.28), up: true }; }, draw: function (p, c) { c.save(); c.translate(p.x, p.y); c.globalAlpha = .75; c.fillStyle = p.c; var s = p.s / 12; c.scale(s, s); c.beginPath(); c.moveTo(0, 2); c.bezierCurveTo(-10, -9, -22, 3, 0, 20); c.bezierCurveTo(22, 3, 10, -9, 0, 2); c.fill(); c.restore(); } },
    sparkle:   { n: 26, make: function () { return { x: rnd(0, W), y: rnd(H * .35, H), s: rnd(1.4, 3), vy: 0, vx: 0, a: 0, va: 0, c: '#fff', sw: 0, ph: rnd(0, 6.28), stay: true, fixed: true }; }, draw: function (p, c, t) { var al = Math.max(0, Math.sin(t * 1.6 + p.ph)); c.globalAlpha = al * .9; c.fillStyle = '#fff'; c.beginPath(); c.arc(p.x, p.y, p.s, 0, 6.283); c.fill(); } }
  };
  function build() { parts = []; var K = KINDS[kind]; if (!K) return; var n = reduce ? Math.round(K.n / 3) : K.n; for (var i = 0; i < n; i++) parts.push(K.make()); }
  function step(ts) {
    if (!running) return; var dt = Math.min(.05, (ts - last) / 1000 || .016); last = ts; var t = ts / 1000;
    actx.clearRect(0, 0, W, H);
    var K = KINDS[kind];
    if (K) for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (!p.fixed) { p.sw += dt * 1.4; p.x += (p.vx + Math.sin(p.sw) * 14) * dt; p.y += p.vy * dt; p.a += p.va * dt; if (p.stay) { if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < H * .25) p.vy = Math.abs(p.vy); if (p.y > H) p.vy = -Math.abs(p.vy); } else if (p.up) { if (p.y < -20) { p.y = H + 20; p.x = rnd(0, W); } } else if (p.y > H + 20) { p.y = -20; p.x = rnd(0, W); } if (p.x < -30) p.x = W + 30; if (p.x > W + 30) p.x = -30; }
      actx.globalAlpha = 1; K.draw(p, actx, t);
    }
    actx.globalAlpha = 1;
    // sparkle bursts
    sctx.clearRect(0, 0, W, H);
    for (var b = bursts.length - 1; b >= 0; b--) {
      var s = bursts[b]; s.life -= dt; if (s.life <= 0) { bursts.splice(b, 1); continue; }
      s.vy += 260 * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.r += s.vr * dt;
      var al = Math.min(1, s.life / s.max * 1.4); sctx.save(); sctx.globalAlpha = al; sctx.translate(s.x, s.y); sctx.rotate(s.r); sctx.fillStyle = s.c;
      var R = s.size; sctx.beginPath(); for (var k = 0; k < 8; k++) { var rr = k % 2 ? R * .38 : R; var an = -Math.PI / 2 + k * Math.PI / 4; sctx.lineTo(Math.cos(an) * rr, Math.sin(an) * rr); } sctx.closePath(); sctx.fill(); sctx.restore();
    }
    requestAnimationFrame(step);
  }
  var FX = {
    init: function () {
      amb = document.getElementById('ambient'); spk = document.getElementById('sparks'); if (!amb || !spk) return;
      actx = amb.getContext('2d'); sctx = spk.getContext('2d'); size(); window.addEventListener('resize', function () { size(); build(); });
      document.addEventListener('visibilitychange', function () { if (document.hidden) { running = false; } else if (!running) { running = true; last = performance.now(); requestAnimationFrame(step); } });
      running = true; last = performance.now(); requestAnimationFrame(step);
    },
    ambient: function (k) { kind = k; build(); },
    burst: function (x, y, n, colors) { if (!sctx) return; colors = colors || ['#ffd966', '#fff6c2', '#ff9ec7', '#ffffff', '#9be3ff']; n = reduce ? Math.round(n / 2) : n; for (var i = 0; i < n; i++) { var a = rnd(0, 6.283), sp = rnd(70, 230); bursts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 90, size: rnd(3.5, 8), c: colors[Math.floor(rnd(0, colors.length))], r: rnd(0, 6), vr: rnd(-6, 6), life: rnd(.55, 1.05), max: 1.05 }); } },
    float: function (x, y, text, cls) { var d = document.createElement('div'); d.className = 'floaty ' + (cls || ''); d.textContent = text; d.style.left = x + 'px'; d.style.top = y + 'px'; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 1100); }
  };
  root.FX = FX;
})(window);
