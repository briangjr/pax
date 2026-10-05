/* PAX offline support.
   Everything the game needs is saved on the device the first time it loads online,
   so after that it runs with no connection. VERSION changes whenever the files change. */
const VERSION = 'pax-4cc6bcd337';
const FILES = [
  "./",
  "css/styles.css",
  "images/brand/app-icon-1024.png",
  "images/brand/app-icon-180.png",
  "images/brand/app-icon-192.png",
  "images/brand/app-icon-512.png",
  "images/brand/app-icon-maskable-512.png",
  "images/brand/back-graded.webp",
  "images/brand/back.webp",
  "images/brand/eye.webp",
  "images/brand/favicon-64.png",
  "images/brand/logo-eye.png",
  "images/brand/pax-app-icon-1024.png",
  "images/brand/pax-app-icon-180.png",
  "images/brand/pax-app-icon-192.png",
  "images/brand/pax-app-icon-512.png",
  "images/brand/pax-app-icon-maskable-512.png",
  "images/brand/pax-favicon-64.png",
  "images/brand/pax-logo.webp",
  "images/cards/001-thundrake.webp",
  "images/cards/002-aquarion.webp",
  "images/cards/003-knoxara.webp",
  "images/cards/004-pleezer.webp",
  "images/cards/005-gracious.webp",
  "images/cards/006-montunzer.webp",
  "images/cards/007-velmora.webp",
  "images/cards/008-loz.webp",
  "images/cards/009-phoenixon.webp",
  "images/cards/010-flamingopp.webp",
  "images/cards/011-helioris.webp",
  "images/cards/012-cryontra.webp",
  "images/cards/013-verdantor.webp",
  "images/cards/014-leviathanis.webp",
  "images/cards/015-celestaris.webp",
  "images/cards/016-bogmaw.webp",
  "images/cards/017-nulltusk.webp",
  "images/cards/018-tyrannox.webp",
  "images/cards/019-zephyron.webp",
  "images/cards/020-pristelle.webp",
  "images/cards/021-pyrozarok.webp",
  "images/cards/022-stormaryn.webp",
  "images/cards/023-tiderion.webp",
  "images/cards/024-duskara.webp",
  "images/cards/025-terrunzer.webp",
  "images/cards/026-emberopp.webp",
  "images/cards/027-frostalon.webp",
  "images/cards/028-coralith.webp",
  "images/cards/029-vesperyn.webp",
  "images/cards/030-ironox.webp",
  "images/cards/031-venomara.webp",
  "images/cards/032-solaryn.webp",
  "images/cards/033-glacivex.webp",
  "images/cards/034-briarclaw.webp",
  "images/cards/035-riptalon.webp",
  "images/cards/036-astrowl.webp",
  "images/cards/037-mirefang.webp",
  "images/cards/038-gravorn.webp",
  "images/cards/039-scorpinox.webp",
  "images/cards/040-cloudane.webp",
  "images/cards/041-crystara.webp",
  "images/cards/042-chronolith.webp",
  "images/cards/043-tempestra.webp",
  "images/cards/044-selunaris.webp",
  "images/cards/045-gorgalyth.webp",
  "images/cards/046-pyrelios.webp",
  "images/cards/047-voltryn.webp",
  "images/cards/048-marivex.webp",
  "images/cards/049-umbrix.webp",
  "images/cards/050-cragorn.webp",
  "images/cards/051-rosaflare.webp",
  "images/cards/052-solenith.webp",
  "images/cards/053-frostlup.webp",
  "images/cards/054-thornkit.webp",
  "images/cards/055-finclaw.webp",
  "images/cards/056-lunowl.webp",
  "images/cards/057-marshclaw.webp",
  "images/cards/058-gravoltan.webp",
  "images/cards/059-skorven.webp",
  "images/cards/060-aeralyn.webp",
  "images/cards/061-luminae.webp",
  "images/cards/062-dunestag.webp",
  "images/cards/063-mirehop.webp",
  "images/cards/064-coralisk.webp",
  "images/cards/065-tiderock.webp",
  "images/cards/066-vinetail.webp",
  "images/cards/067-whispling.webp",
  "images/cards/068-cragrip.webp",
  "images/cards/069-stormrook.webp",
  "images/cards/070-glimmerfin.webp",
  "images/cards/071-shroomble.webp",
  "images/cards/072-sparklin.webp",
  "images/cards/073-aquini.webp",
  "images/cards/074-noxlet.webp",
  "images/cards/075-pebblor.webp",
  "images/cards/076-flicko.webp",
  "images/cards/077-taloki-cub.webp",
  "images/cards/078-chillpup.webp",
  "images/cards/079-sprigpaw.webp",
  "images/cards/080-ripfin.webp",
  "images/cards/081-taloki-owlet.webp",
  "index.html",
  "js/app.js",
  "js/data.js",
  "js/sports.js",
  "manifest.webmanifest"
];
const FONT_CACHE = 'pax-fonts';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== FONT_CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Google Fonts: keep a copy so the fonts still look right offline
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONT_CACHE).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  // Pages and code: try the network first so updates show up, fall back to the saved copy offline
  const fresh = req.mode === 'navigate' || /\.(html|js|css|webmanifest)$/.test(url.pathname) || url.pathname.endsWith('/');
  if (fresh) {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return r; })
      .catch(() => caches.match(req, {ignoreSearch: true}).then(r => r || caches.match('./'))));
    return;
  }
  // Images and everything else: use the saved copy, fetch only if missing
  e.respondWith(caches.match(req, {ignoreSearch: true}).then(r => r || fetch(req).then(res => {
    const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; })));
});
