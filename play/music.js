// Tileberry music packs: calm music composed live with the browser's audio (no sound files).
(function (root) {
  var PACKS = {
    meadow:   { name: 'Meadow Breeze',   price: 0,    free: true, blurb: 'Soft piano-like notes', bpm: 70, root: 60, scale: [0, 2, 4, 7, 9], beats: 4, pad: { wave: 'sine', vol: .05, prog: [[0, 4, 7], [-3, 0, 4], [-5, -1, 2], [-7, -3, 0]] }, mel: { wave: 'triangle', vol: .09, decay: 1.4, density: .5, lo: -5, hi: 14 } },
    zen:      { name: 'Zen Garden',      price: 1.99, blurb: 'Koto-style plucks, slow and still', bpm: 52, root: 62, scale: [0, 2, 3, 7, 8], beats: 4, drone: true, pad: { wave: 'sine', vol: .035, prog: [[0, 7], [0, 7], [-2, 5], [0, 7]] }, mel: { wave: 'triangle', vol: .11, decay: 1.9, density: .38, lo: 0, hi: 17, pluck: true } },
    tea:      { name: 'Rainy Tea House', price: 1.99, blurb: 'Gentle rain with warm pads', bpm: 60, root: 57, scale: [0, 3, 5, 7, 10], beats: 4, rain: true, pad: { wave: 'triangle', vol: .045, prog: [[0, 7, 10], [-4, 3, 7], [-2, 5, 9], [-5, 2, 7]] }, mel: { wave: 'sine', vol: .07, decay: 2.2, density: .26, lo: 3, hi: 15 } },
    lantern:  { name: 'Evening Lanterns', price: 1.99, blurb: 'Warm marimba and glowing chords', bpm: 66, root: 65, scale: [0, 2, 4, 6, 7, 9, 11], beats: 4, pad: { wave: 'triangle', vol: .05, prog: [[0, 4, 7], [2, 6, 9], [4, 7, 11], [-1, 2, 7]] }, mel: { wave: 'sine', vol: .1, decay: .9, density: .55, lo: -2, hi: 12, pluck: true } },
    autumn:   { name: 'Autumn Waltz',    price: 1.99, blurb: 'A gentle waltz in three-four time', bpm: 84, root: 58, scale: [0, 2, 3, 5, 7, 8, 10], beats: 3, pad: { wave: 'sine', vol: .045, prog: [[0, 7, 10], [-4, 3, 7], [-2, 5, 8], [-7, 0, 5]] }, mel: { wave: 'triangle', vol: .09, decay: 1.1, density: .62, lo: 0, hi: 14 } },
    winter:   { name: 'Winter Bells',    price: 2.99, season: { from: '12-01', to: '01-05', label: 'Dec 1 to Jan 5' }, blurb: 'Music-box bells', bpm: 62, root: 72, scale: [0, 2, 4, 7, 9], beats: 4, bell: true, pad: { wave: 'sine', vol: .03, prog: [[0, 7], [-3, 4], [-5, 2], [-7, 0]] }, mel: { wave: 'sine', vol: .08, decay: 2.4, density: .5, lo: 0, hi: 12 } },
    spooky:   { name: 'Spooky Hollow',   price: 2.99, season: { from: '10-17', to: '11-02', label: 'Oct 17 to Nov 2' }, blurb: 'Slow, eerie and fun', bpm: 54, root: 52, scale: [0, 1, 3, 5, 7, 8, 11], beats: 4, heart: true, pad: { wave: 'sine', vol: .05, prog: [[0, 3, 7], [-4, 0, 3], [-2, 1, 5], [-5, -1, 2]] }, mel: { wave: 'sine', vol: .07, decay: 2.6, density: .3, lo: 5, hi: 17, glide: true } },
    beach:    { name: 'Beach Day',        price: 1.99, blurb: 'Steel-drum feel with ocean waves', bpm: 78, root: 62, scale: [0, 2, 4, 7, 9], beats: 4, amb: 'waves', pad: { wave: 'triangle', vol: .04, prog: [[0, 4, 7], [-3, 0, 4], [-5, -1, 2], [0, 4, 9]] }, mel: { wave: 'triangle', vol: .1, decay: .7, density: .6, lo: 0, hi: 14, pluck: true } },
    fireside: { name: 'By the Fireside',  price: 1.99, blurb: 'Warm low chords and a crackling fire', bpm: 56, root: 53, scale: [0, 2, 4, 5, 7, 9, 11], beats: 4, amb: 'crackle', pad: { wave: 'triangle', vol: .06, prog: [[0, 4, 7], [-5, -1, 2], [-3, 0, 4], [-7, -3, 0]] }, mel: { wave: 'sine', vol: .07, decay: 2.4, density: .24, lo: 2, hi: 12 } },
    lullaby:  { name: 'Lullaby',          price: 1.99, blurb: 'A soft music-box lullaby', bpm: 76, root: 72, scale: [0, 2, 4, 5, 7, 9], beats: 3, bell: true, pad: { wave: 'sine', vol: .028, prog: [[0, 7], [-3, 4], [-5, 2], [0, 7]] }, mel: { wave: 'sine', vol: .075, decay: 2.2, density: .6, lo: 0, hi: 10 } },
    sunrise:  { name: 'Sunrise Birds',    price: 1.99, blurb: 'Bright morning chords and birdsong', bpm: 68, root: 64, scale: [0, 2, 4, 7, 9], beats: 4, amb: 'birds', pad: { wave: 'sine', vol: .05, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 9]] }, mel: { wave: 'triangle', vol: .08, decay: 1.5, density: .42, lo: 2, hi: 16 } },
    ocean:    { name: 'Deep Ocean',       price: 1.99, blurb: 'Slow waves and floating pads', bpm: 48, root: 55, scale: [0, 2, 5, 7, 9], beats: 4, amb: 'waves', pad: { wave: 'sine', vol: .06, prog: [[0, 7, 9], [-3, 2, 7], [-5, 0, 5], [-7, -2, 2]] }, mel: { wave: 'sine', vol: .06, decay: 3, density: .2, lo: 4, hi: 16 } },
    harvest:  { name: 'Harvest Fiddle',   price: 2.99, season: { from: '11-03', to: '11-30', label: 'Nov 3 to Nov 30' }, blurb: 'Cozy folk plucks for autumn', bpm: 92, root: 57, scale: [0, 2, 4, 7, 9], beats: 4, pad: { wave: 'triangle', vol: .045, prog: [[0, 4, 7], [-5, -1, 2], [-3, 0, 4], [-7, -3, 0]] }, mel: { wave: 'triangle', vol: .1, decay: .8, density: .66, lo: 0, hi: 14, pluck: true } },
    sweet:    { name: 'Sweet Waltz',      price: 2.99, season: { from: '02-07', to: '02-15', label: 'Feb 7 to Feb 15' }, blurb: 'A gentle waltz for Valentine day', bpm: 88, root: 60, scale: [0, 2, 4, 5, 7, 9, 11], beats: 3, pad: { wave: 'sine', vol: .05, prog: [[0, 4, 7], [5, 9, 12], [-3, 0, 4], [-5, -1, 2]] }, mel: { wave: 'sine', vol: .09, decay: 1.4, density: .62, lo: 0, hi: 13 } }
  };
  var ctx = null, master = null, timer = null, nextT = 0, beat = 0, bar = 0, pack = 'meadow', on = false, vol = .9, rainNode = null, noteSeed = 1;
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function env(g, t, a, d, v) { g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(v, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + a + d); }
  function osc(freq, t, dur, wave, v, a, extra) {
    var o = ctx.createOscillator(), g = ctx.createGain(); o.type = wave; o.frequency.setValueAtTime(freq, t);
    if (extra && extra.glide) { o.frequency.setValueAtTime(freq * .94, t); o.frequency.linearRampToValueAtTime(freq, t + .5); var lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 5; lg.gain.value = freq * .012; lfo.connect(lg); lg.connect(o.frequency); lfo.start(t); lfo.stop(t + dur + a); }
    env(g, t, a, dur, v); o.connect(g); g.connect(master); o.start(t); o.stop(t + a + dur + .05);
  }
  function rnd() { noteSeed = (noteSeed * 1664525 + 1013904223) >>> 0; return noteSeed / 4294967296; }
  var lastDeg = 5;
  function scaleNote(p, deg) { var n = p.scale.length, oct = Math.floor(deg / n), idx = ((deg % n) + n) % n; return p.root + p.scale[idx] + 12 * oct; }
  function schedBeat(t) {
    var p = PACKS[pack], spb = 60 / p.bpm;
    if (beat === 0) {
      var ch = p.pad.prog[bar % p.pad.prog.length];
      ch.forEach(function (s, i) { osc(hz(p.root + s - 12 + (i ? 0 : 0)), t, spb * p.beats * 1.1, p.pad.wave, p.pad.vol, spb * 1.2); });
      if (p.drone) osc(hz(p.root - 24), t, spb * p.beats * 1.2, 'sine', .05, spb);
      bar++;
    }
    if (p.heart && (beat === 0 || beat === 2)) { osc(55, t, .25, 'sine', .12, .01); osc(55, t + .18, .22, 'sine', .08, .01); }
    // melody: gentle random walk on the scale, with rests
    var steps = p.beats === 3 ? [0, .5] : [0, .5];
    steps.forEach(function (sub) {
      if (rnd() < p.mel.density * (sub ? .7 : 1)) {
        var step = Math.round((rnd() - .5) * 4); lastDeg = Math.max(p.mel.lo, Math.min(p.mel.hi, lastDeg + step)); if (rnd() < .12) lastDeg = Math.round(p.mel.lo + rnd() * (p.mel.hi - p.mel.lo));
        var f = hz(scaleNote(p, lastDeg)), tt = t + sub * spb;
        if (p.bell) { osc(f, tt, p.mel.decay, 'sine', p.mel.vol, .004); osc(f * 2.76, tt, p.mel.decay * .4, 'sine', p.mel.vol * .3, .004); }
        else osc(f, tt, p.mel.decay, p.mel.wave, p.mel.vol, p.mel.pluck ? .004 : .03, { glide: p.mel.glide });
      }
    });
  }
  function tick() {
    var p = PACKS[pack], spb = 60 / p.bpm;
    while (nextT < ctx.currentTime + .6) { schedBeat(nextT); nextT += spb; beat = (beat + 1) % p.beats; }
  }

  var amb = [];
  function noiseBuf(kind) { var len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0), last = 0; for (var i = 0; i < len; i++) { var w = Math.random() * 2 - 1; last = kind === 'brown' ? (last + .02 * w) / 1.02 : w; d[i] = kind === 'brown' ? last * 3.5 : w; } return buf; }
  function startAmb(kind) {
    stopAmb(); if (!kind) return;
    if (kind === 'waves') {
      var src = ctx.createBufferSource(); src.buffer = noiseBuf('brown'); src.loop = true; var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900; var g = ctx.createGain(); g.gain.value = .25;
      var lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = .11; lg.gain.value = .18; lfo.connect(lg); lg.connect(g.gain); src.connect(f); f.connect(g); g.connect(master); src.start(); lfo.start(); amb.push({ stop: function () { try { src.stop(); lfo.stop(); } catch (e) {} } });
    } else if (kind === 'crackle') {
      var iv = setInterval(function () { if (!on) return; var n = 1 + Math.floor(Math.random() * 3); for (var i = 0; i < n; i++) (function (dl) { setTimeout(function () { if (!on) return; var b = ctx.createBuffer(1, 600, ctx.sampleRate), d = b.getChannelData(0); for (var k = 0; k < 600; k++) d[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / 600, 3); var s2 = ctx.createBufferSource(); s2.buffer = b; var g2 = ctx.createGain(); g2.gain.value = .25 + Math.random() * .3; var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1200; s2.connect(hp); hp.connect(g2); g2.connect(master); s2.start(); }, dl); })(Math.random() * 400); }, 380);
      var src2 = ctx.createBufferSource(); src2.buffer = noiseBuf('brown'); src2.loop = true; var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260; var g3 = ctx.createGain(); g3.gain.value = .22; src2.connect(lp); lp.connect(g3); g3.connect(master); src2.start();
      amb.push({ stop: function () { clearInterval(iv); try { src2.stop(); } catch (e) {} } });
    } else if (kind === 'birds') {
      var iv2 = setInterval(function () { if (!on || Math.random() > .55) return; var base = 2200 + Math.random() * 1800, t = ctx.currentTime, notes = 2 + Math.floor(Math.random() * 3); for (var i = 0; i < notes; i++) { var o = ctx.createOscillator(), g4 = ctx.createGain(), st = t + i * .13; o.type = 'sine'; o.frequency.setValueAtTime(base, st); o.frequency.exponentialRampToValueAtTime(base * (1.2 + Math.random() * .4), st + .09); g4.gain.setValueAtTime(.0001, st); g4.gain.linearRampToValueAtTime(.05, st + .02); g4.gain.exponentialRampToValueAtTime(.0001, st + .11); o.connect(g4); g4.connect(master); o.start(st); o.stop(st + .13); } }, 1400);
      amb.push({ stop: function () { clearInterval(iv2); } });
    }
  }
  function stopAmb() { amb.forEach(function (a) { a.stop(); }); amb = []; }
  function startRain() {
    if (rainNode) return; var len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0), last = 0;
    for (var i = 0; i < len; i++) { var w = Math.random() * 2 - 1; last = (last + .08 * w) / 1.08; d[i] = last * 3.2; }
    var src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2200; f.Q.value = .5; var g = ctx.createGain(); g.gain.value = .5;
    src.connect(f); f.connect(g); g.connect(master); src.start(); rainNode = { src: src, g: g };
  }
  function stopRain() { if (rainNode) { try { rainNode.src.stop(); } catch (e) {} rainNode = null; } }
  var Music = {
    PACKS: PACKS, get on() { return on; }, get pack() { return pack; },
    setPack: function (id) { if (!PACKS[id]) return; pack = id; beat = 0; bar = 0; if (on) { stopRain(); if (PACKS[id].rain) startRain(); startAmb(PACKS[id].amb); } },
    start: function () {
      try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume();
        if (!master) { master = ctx.createGain(); master.gain.value = vol * .8; master.connect(ctx.destination); }
        on = true; nextT = ctx.currentTime + .1; beat = 0; if (PACKS[pack].rain) startRain(); startAmb(PACKS[pack].amb); clearInterval(timer); timer = setInterval(tick, 120); tick();
      } catch (e) { on = false; }
    },
    stop: function () { on = false; clearInterval(timer); stopRain(); stopAmb(); if (master) { try { master.gain.setTargetAtTime(0, ctx.currentTime, .15); setTimeout(function () { if (!on && master) master.gain.value = vol * .8; }, 600); } catch (e) {} } }
  };
  document.addEventListener('visibilitychange', function () { if (document.hidden && on) { try { ctx.suspend(); } catch (e) {} } else if (on && ctx) { try { ctx.resume(); } catch (e) {} } });
  root.MMusic = Music;
})(window);
