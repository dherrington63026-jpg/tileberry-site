// Tileberry cosmetics: scenic backgrounds (drawn in code) and tile styles.
(function (root) {
  function wrap(inner) { return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">' + inner + '</svg>'; }
  function grad(id, a, b, vertical) { return '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (vertical === false ? 1 : 0) + '" y2="' + (vertical === false ? 0 : 1) + '"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>'; }
  function glow(id, c) { return '<radialGradient id="' + id + '"><stop offset="0" stop-color="' + c + '" stop-opacity=".9"/><stop offset="1" stop-color="' + c + '" stop-opacity="0"/></radialGradient>'; }
  function pine(x, y, s, c, cap) {
    var p = '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><rect x="-3" y="0" width="6" height="14" fill="#4a2e18"/>';
    p += '<path d="M0 -48 L16 -16 L-16 -16 Z" fill="' + c + '"/><path d="M0 -34 L20 0 L-20 0 Z" fill="' + c + '"/><path d="M0 -20 L24 14 L-24 14 Z" fill="' + c + '"/>';
    if (cap) p += '<path d="M0 -48 L8 -32 L-8 -32 Z" fill="#fff"/><path d="M0 -34 L10 -16 L-10 -16 Z" fill="#fff" opacity=".9"/>';
    return p + '</g>';
  }
  function dots(n, seed, w, h, r, fill, op) { var s = '', a = seed; for (var i = 0; i < n; i++) { a = (a * 1103515245 + 12345) & 0x7fffffff; var x = a % w; a = (a * 1103515245 + 12345) & 0x7fffffff; var y = a % h; s += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fill + '" opacity="' + op + '"/>'; } return s; }

  var SCENES = {
    lake: wrap('<defs>' + grad('s', '#5aaee3', '#cdeefb') + grad('l', '#3b9fc2', '#1f6f98') + glow('g', '#fff6c2') + '</defs><rect width="400" height="300" fill="url(#s)"/><circle cx="305" cy="70" r="60" fill="url(#g)"/><circle cx="305" cy="70" r="24" fill="#fff6c2"/>' +
      '<path d="M0 175 L70 100 L120 150 L190 85 L270 160 L330 115 L400 170 L400 190 L0 190 Z" fill="#6b97bd"/><path d="M0 190 L60 140 L140 185 L230 130 L330 188 L400 150 L400 200 L0 200 Z" fill="#4f82ab"/>' +
      '<rect y="185" width="400" height="115" fill="url(#l)"/><g stroke="#cfeefb" stroke-width="2" fill="none" opacity=".6"><path d="M40 220 q15 -6 30 0 t30 0"/><path d="M220 250 q15 -6 30 0 t30 0"/><path d="M120 275 q15 -6 30 0 t30 0"/><path d="M300 215 q12 -5 24 0 t24 0"/></g>' +
      pine(28, 200, 1.5, '#1d5c46') + pine(375, 205, 1.7, '#1d5c46') + pine(60, 215, 1.1, '#256e55')),
    autumn: wrap('<defs>' + grad('s', '#ee9a52', '#f8d9a0') + '</defs><rect width="400" height="300" fill="url(#s)"/><circle cx="90" cy="70" r="30" fill="#fff0c4" opacity=".9"/>' +
      '<path d="M0 200 Q100 150 200 190 T400 175 L400 300 L0 300 Z" fill="#b4581f"/><path d="M0 235 Q120 195 230 230 T400 220 L400 300 L0 300 Z" fill="#8a3f17"/>' +
      '<g><rect x="34" y="150" width="9" height="62" fill="#4a2a12"/><circle cx="38" cy="140" r="34" fill="#d9481f"/><circle cx="18" cy="156" r="22" fill="#f08a24"/><circle cx="60" cy="152" r="24" fill="#f2c038"/></g>' +
      '<g><rect x="345" y="140" width="10" height="75" fill="#4a2a12"/><circle cx="350" cy="128" r="38" fill="#f08a24"/><circle cx="328" cy="148" r="24" fill="#d9481f"/><circle cx="376" cy="146" r="26" fill="#f2c038"/></g>' + dots(26, 7, 400, 300, 3.2, '#f2a02a', .85) + dots(18, 31, 400, 300, 3, '#d9481f', .85)),
    winter: wrap('<defs>' + grad('s', '#4a6fa5', '#9dbfe3') + '</defs><rect width="400" height="300" fill="url(#s)"/>' + dots(60, 11, 400, 300, 1.8, '#fff', .8) +
      '<path d="M0 205 Q110 165 220 200 T400 185 L400 300 L0 300 Z" fill="#dfeaf6"/><path d="M0 245 Q130 215 250 240 T400 232 L400 300 L0 300 Z" fill="#c4d8ee"/>' +
      pine(40, 205, 1.5, '#1d5a45', true) + pine(78, 215, 1, '#256e55', true) + pine(360, 205, 1.6, '#1d5a45', true) +
      '<g transform="translate(150 200)"><rect width="46" height="30" fill="#8a5a3a"/><path d="M-6 0 L23 -22 L52 0 Z" fill="#e9f1fb"/><rect x="8" y="9" width="10" height="10" fill="#ffd966"/><rect x="28" y="9" width="10" height="10" fill="#ffd966"/></g>' +
      '<g transform="translate(240 212)"><rect width="38" height="24" fill="#a4694a"/><path d="M-5 0 L19 -18 L43 0 Z" fill="#e9f1fb"/><rect x="14" y="7" width="9" height="9" fill="#ffd966"/></g>'),
    spring: wrap('<defs>' + grad('s', '#f6a9cb', '#ffe6f1') + '</defs><rect width="400" height="300" fill="url(#s)"/>' +
      '<path d="M0 205 Q110 170 220 205 T400 190 L400 300 L0 300 Z" fill="#7fcf9a"/><path d="M0 245 Q130 215 250 245 T400 235 L400 300 L0 300 Z" fill="#58b27f"/>' +
      '<path d="M18 230 Q30 150 70 120 Q100 100 130 70" stroke="#6b4423" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M60 130 Q40 105 20 100" stroke="#6b4423" stroke-width="6" fill="none"/>' +
      '<g fill="#ff8fb8"><circle cx="130" cy="64" r="26"/><circle cx="104" cy="88" r="22"/><circle cx="76" cy="112" r="20"/><circle cx="24" cy="98" r="18"/><circle cx="150" cy="86" r="16"/></g><g fill="#ffc3da"><circle cx="118" cy="52" r="14"/><circle cx="92" cy="80" r="14"/><circle cx="40" cy="110" r="12"/></g>' +
      '<g transform="translate(400 0) scale(-1 1)"><path d="M18 230 Q30 160 62 132" stroke="#6b4423" stroke-width="8" fill="none" stroke-linecap="round"/><g fill="#ff8fb8"><circle cx="62" cy="124" r="24"/><circle cx="40" cy="146" r="18"/></g></g>' + dots(30, 5, 400, 300, 3, '#ffb7d3', .9)),
    night: wrap('<defs>' + grad('s', '#0d1538', '#2b2b72') + glow('o', '#ffb347') + glow('m', '#fff7c8') + '</defs><rect width="400" height="300" fill="url(#s)"/>' + dots(50, 3, 400, 180, 1.4, '#fff', .9) +
      '<circle cx="320" cy="62" r="46" fill="url(#m)"/><circle cx="320" cy="62" r="20" fill="#fff7c8"/>' +
      '<path d="M0 215 Q100 175 200 210 T400 195 L400 300 L0 300 Z" fill="#141c40"/><path d="M0 255 Q120 225 240 252 T400 240 L400 300 L0 300 Z" fill="#0c1230"/>' +
      '<path d="M0 30 Q100 60 200 28 T400 40" stroke="#6b5a42" stroke-width="2" fill="none"/>' +
      [[40, 48, '#ff6b4a'], [110, 60, '#ffb347'], [190, 38, '#ff6b4a'], [265, 52, '#ffb347'], [360, 46, '#ff6b4a']].map(function (l) { return '<circle cx="' + l[0] + '" cy="' + l[1] + '" r="26" fill="url(#o)"/><rect x="' + (l[0] - 8) + '" y="' + (l[1] - 12) + '" width="16" height="22" rx="7" fill="' + l[2] + '"/>'; }).join('')),
    halloween: wrap('<defs>' + grad('s', '#240c45', '#8c3aa6') + glow('m', '#ffb347') + '</defs><rect width="400" height="300" fill="url(#s)"/>' +
      '<circle cx="315" cy="85" r="70" fill="url(#m)"/><circle cx="315" cy="85" r="44" fill="#ffb347"/>' +
      '<g fill="#12071f"><path d="M280 62 q10 -14 20 0 q8 -10 18 0 q10 -12 22 0 q-6 6 -10 4 q-8 6 -14 0 q-6 6 -16 0 q-10 4 -20 -4 Z" transform="translate(-60 -10) scale(.8)"/><path d="M60 40 q8 -12 16 0 q7 -9 14 0 q8 -10 17 0 q-5 5 -8 3 q-6 5 -11 0 q-5 5 -13 0 q-8 3 -15 -3 Z"/></g>' +
      '<path d="M0 215 Q100 180 200 212 T400 200 L400 300 L0 300 Z" fill="#1a0a2b"/><path d="M0 255 Q120 230 240 255 T400 245 L400 300 L0 300 Z" fill="#110620"/>' +
      '<g stroke="#0c0416" stroke-width="7" fill="none" stroke-linecap="round"><path d="M40 220 Q44 160 36 120 M40 160 Q70 140 90 120 M38 140 Q20 118 8 112"/></g>' +
      [[170, 248, 1], [250, 258, .8], [330, 252, 1.15]].map(function (p) { return '<g transform="translate(' + p[0] + ' ' + p[1] + ') scale(' + p[2] + ')"><ellipse cx="0" cy="0" rx="26" ry="20" fill="#ff7a1a"/><ellipse cx="-12" cy="0" rx="12" ry="19" fill="#ff8c33" opacity=".7"/><rect x="-3" y="-26" width="6" height="9" fill="#4a7a2a"/><path d="M-12 -6 l6 -8 l6 8 Z M6 -6 l6 -8 l6 8 Z" fill="#2a1200"/><path d="M-12 6 l5 6 l5 -4 l5 6 l5 -4 l5 6 l5 -6 l-4 -4 l-6 4 l-5 -4 l-5 4 Z" fill="#2a1200"/></g>'; }).join('')),
    holiday: wrap('<defs>' + grad('s', '#0c3a2e', '#1e7254') + '</defs><rect width="400" height="300" fill="url(#s)"/>' + dots(44, 9, 400, 300, 1.7, '#fff', .8) +
      '<path d="M0 220 Q110 188 220 218 T400 205 L400 300 L0 300 Z" fill="#e6f1ee"/><path d="M0 258 Q130 232 250 256 T400 246 L400 300 L0 300 Z" fill="#cfe2dd"/>' +
      '<g transform="translate(200 222)"><path d="M0 -140 L38 -90 L-38 -90 Z" fill="#1d6b3a"/><path d="M0 -112 L52 -50 L-52 -50 Z" fill="#23803f"/><path d="M0 -76 L66 -4 L-66 -4 Z" fill="#2a9a48"/><path d="M0 -150 l5 11 l12 1 l-9 8 l3 12 l-11 -6 l-11 6 l3 -12 l-9 -8 l12 -1 Z" fill="#ffd966"/><circle cx="-18" cy="-70" r="5" fill="#ff5a5a"/><circle cx="22" cy="-60" r="5" fill="#5ab4ff"/><circle cx="-34" cy="-30" r="5" fill="#ffd966"/><circle cx="30" cy="-24" r="5" fill="#ff5a5a"/><circle cx="-6" cy="-98" r="4" fill="#ffd966"/><circle cx="8" cy="-20" r="5" fill="#5ab4ff"/></g>' +
      '<path d="M0 22 Q100 52 200 20 T400 32" stroke="#25402f" stroke-width="2" fill="none"/>' + [[30, 40, '#ff5a5a'], [95, 50, '#ffd966'], [160, 33, '#5ab4ff'], [230, 40, '#ff5a5a'], [300, 36, '#ffd966'], [365, 40, '#5ab4ff']].map(function (l) { return '<circle cx="' + l[0] + '" cy="' + l[1] + '" r="9" fill="' + l[2] + '"/><circle cx="' + l[0] + '" cy="' + l[1] + '" r="16" fill="' + l[2] + '" opacity=".25"/>'; }).join(''))
  };

  var BACKGROUNDS = {
    meadow:    { name: 'Meadow',            price: 0,    free: true, felt: true, page: 'linear-gradient(170deg,#e7f6d8 0%,#cfeacb 55%,#bfe3d6 100%)' },
    lake:      { name: 'Lakeside',          price: 2.99, page: 'linear-gradient(170deg,#d6f0fb 0%,#bfe3f3 55%,#b7d6ee 100%)' },
    autumn:    { name: 'Autumn Forest',     price: 2.99, page: 'linear-gradient(170deg,#fde9c9 0%,#f8d3a3 55%,#efb98a 100%)' },
    winter:    { name: 'Winter Village',    price: 2.99, page: 'linear-gradient(170deg,#e4eefb 0%,#cddff4 55%,#b9d0ec 100%)' },
    spring:    { name: 'Cherry Blossom',    price: 2.99, page: 'linear-gradient(170deg,#ffeaf4 0%,#ffd6e8 55%,#f6c3de 100%)' },
    night:     { name: 'Lantern Night',     price: 2.99, dark: true, page: 'linear-gradient(170deg,#1b2350 0%,#262c68 55%,#161d46 100%)' },
    halloween: { name: 'Pumpkin Night',     price: 3.99, season: { from: '10-17', to: '11-02', label: 'Oct 17 to Nov 2' }, dark: true, page: 'linear-gradient(170deg,#3a1560 0%,#5b2380 55%,#2c0f4a 100%)' },
    holiday:   { name: 'Holiday Lights',    price: 3.99, season: { from: '12-01', to: '01-05', label: 'Dec 1 to Jan 5' }, dark: true, page: 'linear-gradient(170deg,#10453a 0%,#17604a 55%,#0d3a30 100%)' }
  };
  var TILES = {
    classic: { name: 'Classic Ivory',    price: 0,    free: true },
    jade:    { name: 'Jade',             price: 1.99 },
    onyx:    { name: 'Midnight Onyx',    price: 2.99 },
    rose:    { name: 'Rose Porcelain',   price: 1.99 },
    wood:    { name: 'Warm Bamboo',      price: 1.99 },
    ocean:   { name: 'Ocean Glass',      price: 1.99 }
  };
  var TILE_CSS = {
    classic: '',
    jade:  '--tbg:linear-gradient(160deg,#e9fcef,#a6e0bb);--tbd:#62b682;--s1:#1f7a4c;--s2:#14583a;',
    onyx:  '--tbg:linear-gradient(160deg,#4a4a58,#17171e);--tbd:#6a6a80;--s1:#0d0d14;--s2:#050508;--ff:invert(1) hue-rotate(180deg) saturate(1.4) brightness(1.1);',
    rose:  '--tbg:linear-gradient(160deg,#fff3f6,#ffd0de);--tbd:#e6a0b5;--s1:#c24f78;--s2:#963a5b;',
    wood:  '--tbg:linear-gradient(160deg,#f6dfae,#dcae6a);--tbd:#a8763a;--s1:#7a4d24;--s2:#58361a;',
    ocean: '--tbg:linear-gradient(160deg,#eaf8ff,#b3dbf5);--tbd:#78b2d9;--s1:#2c75a6;--s2:#1f5a82;'
  };
  function svgUrl(svg) { return "url('data:image/svg+xml;utf8," + encodeURIComponent(svg).replace(/'/g, '%27') + "')"; }
  function inSeason(b, d) {
    if (!b.season) return true;
    var md = (('0' + (d.getMonth() + 1)).slice(-2)) + '-' + ('0' + d.getDate()).slice(-2), f = b.season.from, t = b.season.to;
    return f <= t ? (md >= f && md <= t) : (md >= f || md <= t);
  }
  root.MMS = { SCENES: SCENES, BACKGROUNDS: BACKGROUNDS, TILES: TILES, TILE_CSS: TILE_CSS, svgUrl: svgUrl, inSeason: inSeason };
})(window);
