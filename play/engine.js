// Mahjong Meadow engine: board layouts, guaranteed-solvable tile assignment, free-tile rules, hints, shuffle.
// Positions are in half-tile units: a tile is 2 wide x 2 tall; z is the layer (0 = bottom).
(function (root) {
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hashStr(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function shuffle(arr, r) {
    for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    return arr;
  }

  // ---- layouts: built from rectangles of tiles on a grid (col,row), one layer at a time
  function L() { return { t: [], rect: function (z, c0, r0, w, h, skip) { for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) { if (skip && skip(i, j, w, h)) continue; this.t.push({ x: (c0 + i) * 2, y: (r0 + j) * 2, z: z }); } return this; } }; }
  var corners = function (i, j, w, h) { return (i === 0 || i === w - 1) && (j === 0 || j === h - 1); };
  var LAYOUTS = {
    beginner: { name: 'Meadow', build: function () { return L().rect(0, 0, 0, 6, 4); } },
    steps:    { name: 'Steps', build: function () { return L().rect(0, 0, 0, 8, 4).rect(1, 1, 1, 6, 2); } },
    diamond:  { name: 'Diamond', build: function () {
      var l = L(), w0 = [2, 4, 6, 8, 8, 6, 4, 2], i, j;
      for (j = 0; j < 8; j++) l.rect(0, (8 - w0[j]) / 2, j, w0[j], 1);
      var w1 = [2, 4, 4, 2];
      for (j = 0; j < 4; j++) l.rect(1, (8 - w1[j]) / 2, j + 2, w1[j], 1);
      return l; } },
    pyramid:  { name: 'Pyramid', build: function () { return L().rect(0, 0, 0, 8, 5).rect(1, 1, 1, 6, 3).rect(2, 2, 2, 4, 1); } },
    cross:    { name: 'Cross', build: function () {
      var l = L().rect(0, 0, 2, 12, 2); l.rect(0, 4, 0, 4, 2).rect(0, 4, 4, 4, 2); l.rect(1, 4, 2, 4, 2); return l; } },
    fortress: { name: 'Fortress', build: function () { return L().rect(0, 0, 0, 10, 6).rect(1, 1, 1, 8, 4).rect(2, 2, 2, 6, 2); } },
    garden:   { name: 'Garden', build: function () { return L().rect(0, 0, 0, 12, 6, corners).rect(1, 1, 1, 10, 4, corners).rect(2, 2, 2, 8, 2); } },
    tower:    { name: 'Tower', build: function () { return L().rect(0, 0, 0, 6, 7).rect(1, 1, 1, 4, 5).rect(2, 2, 2, 2, 3); } },
    blossom:  { name: 'Blossom', build: function () {
      var l = L(), w0 = [2, 4, 6, 6, 6, 6, 4, 2], w1 = [2, 4, 4, 4, 2], j;
      for (j = 0; j < 8; j++) l.rect(0, (6 - w0[j]) / 2, j, w0[j], 1);
      for (j = 0; j < 5; j++) l.rect(1, (6 - w1[j]) / 2, j + 2, w1[j], 1);
      l.rect(2, 2, 3, 2, 2); return l; } },
    grand:    { name: 'Grand', build: function () { return L().rect(0, 0, 0, 12, 6).rect(1, 1, 1, 10, 4).rect(2, 2, 1, 8, 3); } }
  };

  function tilesFor(layoutKey) {
    var t = LAYOUTS[layoutKey].build().t.slice();
    if (t.length % 2) {   // keep the count even: drop the last tile on the top layer
      var top = 0, k; for (k = 0; k < t.length; k++) if (t[k].z >= top) top = t[k].z;
      for (k = t.length - 1; k >= 0; k--) if (t[k].z === top) { t.splice(k, 1); break; }
    }
    return t;
  }

  // neighbour tables: who covers me, who sits left / right of me on the same layer
  function link(tiles) {
    var n = tiles.length, i, j;
    for (i = 0; i < n; i++) { tiles[i].cov = []; tiles[i].left = []; tiles[i].right = []; }
    for (i = 0; i < n; i++) for (j = 0; j < n; j++) {
      if (i === j) continue;
      var a = tiles[i], b = tiles[j], dx = b.x - a.x, dy = b.y - a.y;
      if (b.z === a.z + 1 && Math.abs(dx) < 2 && Math.abs(dy) < 2) a.cov.push(j);
      if (b.z === a.z && Math.abs(dy) < 2) { if (dx === -2) a.left.push(j); if (dx === 2) a.right.push(j); }
    }
  }
  function isFree(g, i) {
    var t = g.tiles[i], k;
    if (g.gone[i]) return false;
    for (k = 0; k < t.cov.length; k++) if (!g.gone[t.cov[k]]) return false;
    var lb = false, rb = false;
    for (k = 0; k < t.left.length; k++) if (!g.gone[t.left[k]]) lb = true;
    for (k = 0; k < t.right.length; k++) if (!g.gone[t.right[k]]) rb = true;
    return !(lb && rb);
  }
  function freeList(g) { var out = [], i; for (i = 0; i < g.tiles.length; i++) if (isFree(g, i)) out.push(i); return out; }

  // Fill the board by playing it BACKWARDS: remove two free tiles at a time and give them the same face.
  // Because that order is a real winning order, the board is always solvable.
  function assign(g, pairFaces, r) {
    var n = g.tiles.length, order = [];
    g.gone = []; for (var i = 0; i < n; i++) g.gone.push(false);
    var left = n, p = 0;
    while (left > 0) {
      var free = freeList(g);
      if (free.length < 2) return null;
      var a = free.splice(Math.floor(r() * free.length), 1)[0], b = free[Math.floor(r() * free.length)];
      g.tiles[a].face = pairFaces[p]; g.tiles[b].face = pairFaces[p]; p++;
      g.gone[a] = g.gone[b] = true; left -= 2; order.push([a, b]);
    }
    for (i = 0; i < n; i++) g.gone[i] = false;
    return order;
  }

  // opts: layout key, seed, copies (tiles per face: 4 normal, 6/8 easier), faceCount (max distinct faces, <=34)
  function newGame(opts) {
    var r = rng(opts.seed), tiles = tilesFor(opts.layout), n = tiles.length;
    link(tiles);
    var copies = opts.copies || 4, pairs = n / 2, perFace = copies / 2;
    var pool = opts.pool || 34, faces = Math.min(opts.faceCount || pool, Math.ceil(pairs / perFace), pool);
    var ids = []; for (var f = 0; f < pool; f++) ids.push(f);
    shuffle(ids, r); ids = ids.slice(0, faces);
    var tries = 0, g = { tiles: tiles, gone: [], hist: [], layout: opts.layout, seed: opts.seed };
    while (tries++ < 400) {
      var pf = []; for (var k = 0; k < pairs; k++) pf.push(ids[k % faces]);
      shuffle(pf, r);
      var order = assign(g, pf, r);
      if (order) { g.solution = order; return g; }
    }
    return null;
  }

  function matches(g, a, b) { return a !== b && g.tiles[a].face === g.tiles[b].face; }
  function findPair(g) {
    var free = freeList(g), by = {}, i;
    for (i = 0; i < free.length; i++) { var f = g.tiles[free[i]].face; (by[f] = by[f] || []).push(free[i]); }
    for (var k in by) if (by[k].length >= 2) return [by[k][0], by[k][1]];
    return null;
  }
  function removePair(g, a, b) { g.gone[a] = g.gone[b] = true; g.hist.push([a, b]); }
  function undo(g) { var h = g.hist.pop(); if (!h) return false; g.gone[h[0]] = g.gone[h[1]] = false; return true; }
  function remaining(g) { var c = 0; for (var i = 0; i < g.gone.length; i++) if (!g.gone[i]) c++; return c; }

  // Shuffle what is left on the board; the new arrangement is solvable too.
  function reshuffle(g, seed) {
    var r = rng(seed), faces = [], i;
    for (i = 0; i < g.tiles.length; i++) if (!g.gone[i]) faces.push(g.tiles[i].face);
    var cnt = {}; faces.forEach(function (f) { cnt[f] = (cnt[f] || 0) + 1; });
    for (var tries = 0; tries < 400; tries++) {
      var pf = []; for (var f in cnt) for (var k = 0; k < Math.floor(cnt[f] / 2); k++) pf.push(+f);
      shuffle(pf, r);
      var saved = g.gone.slice(), keep = g.tiles.map(function (t) { return t.face; });
      // temporarily treat removed tiles as already removed; assign only among remaining
      var rem = []; for (i = 0; i < g.tiles.length; i++) if (!saved[i]) rem.push(i);
      var order = assignSubset(g, rem, pf, r);
      g.gone = saved;
      if (order) { g.solution = order; return true; }
      g.tiles.forEach(function (t, idx) { t.face = keep[idx]; });
    }
    return false;
  }
  function assignSubset(g, rem, pairFaces, r) {
    var saved = g.gone.slice(), order = [], p = 0, left = rem.length;
    while (left > 0) {
      var free = rem.filter(function (i) { return isFree(g, i); });
      if (free.length < 2) { g.gone = saved; return null; }
      var a = free.splice(Math.floor(r() * free.length), 1)[0], b = free[Math.floor(r() * free.length)];
      g.tiles[a].face = pairFaces[p]; g.tiles[b].face = pairFaces[p]; p++;
      g.gone[a] = g.gone[b] = true; left -= 2; order.push([a, b]);
    }
    g.gone = saved;
    return order;
  }

  root.MJ = { rng: rng, hashStr: hashStr, LAYOUTS: LAYOUTS, newGame: newGame, isFree: isFree, freeList: freeList, matches: matches,
    findPair: findPair, removePair: removePair, undo: undo, remaining: remaining, reshuffle: reshuffle };
  if (typeof module !== 'undefined') module.exports = root.MJ;
})(typeof window !== 'undefined' ? window : globalThis);
