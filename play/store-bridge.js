// Connects Tileberry's Shop and Club to RevenueCat inside the phone app. On the web (and until the keys exist) it does nothing.
// Sets window.PBStore = { owned(), restore(), buy(id), prices() }: each returns a Promise.
// owned/restore/buy give the ids the player owns WITHOUT the store prefix (com.huezelgames.tileberry.bg_lake -> bg_lake);
// any active Club subscription gives 'club'. KEYS are RevenueCat's PUBLIC app keys (appl_... iPhone, goog_... Android), safe to ship.
// Put the keys in REVENUECAT-KEYS.txt (never in chat); the release scripts copy them in. Until a key is set the game says "store not available".
(function () {
  var KEYS = { ios: '', android: '' };
  var PRE = 'com.huezelgames.tileberry.';
  var ENTITLEMENT = 'club';
  var ONE_TIME = [
    'bg_lake', 'bg_autumn', 'bg_winter', 'bg_spring', 'bg_night', 'bg_halloween', 'bg_holiday', 'bg_beach', 'bg_sunset', 'bg_mountain', 'bg_zen', 'bg_space', 'bg_valentine', 'bg_july4', 'bg_harvest',
    'tiles_jade', 'tiles_onyx', 'tiles_rose', 'tiles_wood', 'tiles_ocean', 'tiles_gold', 'tiles_pearl', 'tiles_slate', 'tiles_amber', 'tiles_lavender', 'tiles_lacquer',
    'music_piano', 'music_zen', 'music_tea', 'music_lantern', 'music_autumn', 'music_winter', 'music_spooky', 'music_beach', 'music_fireside', 'music_lullaby', 'music_sunrise', 'music_ocean', 'music_harvest', 'music_sweet',
    'faces_states', 'faces_animals', 'faces_flags', 'faces_landmarks'];
  var SUBS = ['club_monthly', 'club_yearly'];
  var C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  var key = KEYS[C.getPlatform()];
  var RC = (C.Plugins && C.Plugins.Purchases) || (C.registerPlugin && C.registerPlugin('Purchases'));
  if (!key || !RC) return;            // no key yet: nothing is sold
  var ready = RC.configure({ apiKey: key });
  function strip(p) { p = String(p).split(':')[0]; return p.indexOf(PRE) === 0 ? p.slice(PRE.length) : p; }   // Google subscription ids look like id:baseplan
  function owned(res) {
    var ci = (res && (res.customerInfo || res)) || {}, out = [];
    (ci.allPurchasedProductIdentifiers || []).forEach(function (p) { p = strip(p); if (ONE_TIME.indexOf(p) >= 0) out.push(p); });
    var club = !!(ci.entitlements && ci.entitlements.active && ci.entitlements.active[ENTITLEMENT]);
    (ci.activeSubscriptions || []).forEach(function (p) { if (SUBS.indexOf(strip(p)) >= 0) club = true; });
    if (club) out.push('club');
    return out;
  }
  var cache = {};
  function products(ids, type) {
    return RC.getProducts({ productIdentifiers: ids.map(function (i) { return PRE + i; }), type: type }).then(function (r) {
      (r.products || []).forEach(function (p) { cache[strip(p.identifier)] = p; });
      return cache;
    });
  }
  window.PBStore = {
    owned: function () { return ready.then(function () { return RC.getCustomerInfo(); }).then(owned); },
    restore: function () { return ready.then(function () { return RC.restorePurchases(); }).then(owned); },
    buy: function (id) {
      var sub = SUBS.indexOf(id) >= 0;
      return ready.then(function () { return cache[id] ? cache : products([id], sub ? 'SUBSCRIPTION' : 'NON_SUBSCRIPTION'); }).then(function (c) {
        if (!c[id]) throw new Error('product not found: ' + id);
        return RC.purchaseStoreProduct({ product: c[id] });
      }).then(owned);
    },
    prices: function () {
      return ready.then(function () { return Promise.all([products(ONE_TIME, 'NON_SUBSCRIPTION'), products(SUBS, 'SUBSCRIPTION')]); }).then(function () {
        var out = {}; Object.keys(cache).forEach(function (i) { out[i] = cache[i].priceString; }); return out;
      });
    }
  };
})();
