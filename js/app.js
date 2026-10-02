/* PAX — app logic: hub, shared wallet, per-set collections, pack opening flow.
   Loaded after data.js (Taloki) and sports.js (NFL, NBA). */
const SELL_RATE = 0.9;

/* ============ STATE ============ */
const KEY = 'pax-v1', OLD_KEY = 'taloki-v1';
const fresh = () => ({bal:50, cols:{taloki:{}, nfl:{}, nba:{}}, spent:0, earned:0, opened:0, openedBy:{}, bestBy:{}, best:null, filter:'all', added:50, history:[]});
let S = fresh();
const cardOf = (s, id) => SETS[s] && SETS[s].CARD[id];
try {
  const s = JSON.parse(localStorage.getItem(KEY) || 'null') || JSON.parse(localStorage.getItem(OLD_KEY) || 'null');
  if (s) S = Object.assign(S, s);
} catch(e) {}
/* bring over saves from before PAX (Taloki only) */
if (S.col) {
  if (S.v !== 2) { for (let i = 101; i <= 110; i++) delete S.col[i]; if (S.best > 100 && S.best <= 110) S.best = null; if ('ML'.includes(S.filter)) S.filter = 'all'; }
  S.cols = Object.assign({taloki:{}, nfl:{}, nba:{}}, S.cols, {taloki: S.col}); delete S.col;
  if (typeof S.best === 'number') { S.bestBy = {taloki: S.best}; S.best = {s:'taloki', id:S.best}; }
  S.openedBy = {taloki: S.opened || 0};
  (S.history || []).forEach(h => { if (!h.s) h.s = 'taloki'; });
}
S.v = 3;
for (const k in SETS) { S.cols[k] = S.cols[k] || {}; for (const id in S.cols[k]) if (!SETS[k].CARD[id]) delete S.cols[k][id]; }
if (S.best && !(SETS[S.best.s] && SETS[S.best.s].CARD[S.best.id])) S.best = null;
S.openedBy = S.openedBy || {}; S.bestBy = S.bestBy || {};
for (const k in S.bestBy) if (!cardOf(k, S.bestBy[k])) delete S.bestBy[k];
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e) {} }

/* G = the set you're in (Taloki, NFL or NBA); COL = your cards in that set */
let G = SETS[S.set] || SETS.taloki, COL = S.cols[G.id];
const bestCard = () => S.best && cardOf(S.best.s, S.best.id);

/* ============ HELPERS ============ */
const $ = s => document.querySelector(s);
const money = v => '$' + v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const rand = () => { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] / 4294967296; };
const pick = arr => arr[Math.floor(rand() * arr.length)];
function avg(r){ return G.BY[r].reduce((a,c) => a + c.value, 0) / G.BY[r].length; }
function sellPrice(c){ return Math.round(c.value * SELL_RATE * 100) / 100; }
function toast(t){ const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 1800); }
const esc = t => String(t).replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[ch]);

/* ---- sports card design (coded; swaps in a photo when one is added in sports.js) ---- */
const ICON = {
  football:'<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="32" rx="27" ry="16" transform="rotate(-35 32 32)"/><path d="M22 42 42 22M27 33l4 4M30 30l4 4M33 27l4 4"/></svg>',
  basketball:'<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="25"/><path d="M7 32h50M32 7v50M14 14c8 8 8 28 0 36M50 14c-8 8-8 28 0 36"/></svg>'
};
const initials = n => n.replace(/\./g,'').split(/[\s-]+/).filter(w => !/^(jr|sr|ii|iii)$/i.test(w)).map(w => w[0]).slice(0, 2).join('').toUpperCase();
function spCardHTML(c, qty, inSlab){
  const L = c.name.length;
  return `<div class="spc s${c.r}${c.rc ? ' isRc' : ''}" style="--t1:${c.tc[0]};--t2:${c.tc[1]}">
    ${qty > 1 ? `<span class="qty">×${qty}</span>` : ''}
    <div class="spBg"></div>
    <div class="spArt">${c.art ? `<img src="${c.art}" alt="">` : `<span class="spIco">${ICON[c.sport]}</span><span class="spIni">${initials(c.name)}</span>`}</div>
    <div class="spTop"><span class="spVar">${c.vname}</span>${c.serial ? `<span class="spSer">${c.serial}</span>` : ''}</div>
    ${c.patch ? '<div class="spPatch"><i></i></div>' : ''}
    ${c.grade && !inSlab ? `<span class="spGr">PAX ${c.grade}</span>` : ''}
    ${c.auto ? `<div class="spAuto"><span class="spSig" style="font-size:${Math.min(13, 150 / L).toFixed(2)}cqw">${esc(c.name)}</span></div>` : ''}
    <div class="spFoot"><span class="spTeam">${c.team}</span><b class="spName" style="font-size:${Math.min(9.4, 118 / L).toFixed(2)}cqw">${esc(c.name)}</b><span class="spPos">${c.pos}${c.rc ? ' <i class="rcB">RC</i>' : ''}</span></div>
    <span class="spPax">PAX</span>
  </div>`;
}
function spSlabHTML(c){
  const G2 = SETS[c.set];
  return `<div class="pxSlab"><div class="pxLbl"><div class="pxL1"><b>PAX</b><span>${G2.setName.replace('PAX ','')}</span></div>
    <div class="pxL2"><span>${esc(c.name)}</span><span>${c.vname}${c.serial ? ' ' + c.serial : ''} · #${c.num}</span></div>
    <div class="pxGr"><small>${(G2.GRADE[c.grade] || '').replace(/^PAX \d+ /,'')}</small><b>${c.grade}</b></div></div>
    <div class="pxWin">${spCardHTML(c, 0, true)}</div></div>`;
}
const pxBackHTML = (c, slab) => `<div class="pxBack${slab ? ' inSlab' : ''}"><div class="pxBackIn"><span class="pxBackMark">PAX</span><small>${SETS[c.set].sportName || ''}</small></div></div>`;

function cardHTML(c, qty){
  if (c.sport) return spCardHTML(c, qty);
  if (c.slab) { const [l,t,w,h] = c.slab.box;
    return `<div class="card r${c.r} full" style="aspect-ratio:${(w*c.slab.ar/h).toFixed(4)}">${qty > 1 ? `<span class="qty">×${qty}</span>` : ''}<img src="${c.slab.src}" alt="${c.name}" style="position:absolute;width:${(100/w).toFixed(3)}%;height:${(100/h).toFixed(3)}%;left:${(-l/w*100).toFixed(3)}%;top:${(-t/h*100).toFixed(3)}%;max-width:none"></div>`; }
  const art = CARD_ART[c.id] ? `<img src="${CARD_ART[c.id]}" alt="">` : `<span class="glyph">${c.el.icon}</span>`;
  return `<div class="card r${c.r}" style="--a:${c.el.a};--b:${c.el.b}">
    ${qty > 1 ? `<span class="qty">×${qty}</span>` : ''}
    <div class="in">
      <div class="hd"><span>${c.name}</span><span>${c.el.icon}</span></div>
      <div class="art">${art}</div>
      <div class="ft"><span class="r">${SETS[c.set].RAR[c.r].name}</span><span>#${c.num}</span></div>
    </div></div>`;
}
const lockedHTML = c => `<div class="card locked${c.sport ? ' spLocked' : ''}"><div class="in">#${c.num}</div></div>`;
const graded = c => c.sport ? !!c.grade : !!(c.slab && !c.slab.raw);
const markHTML = () => G.sport ? '<span class="mEye pxMark"><img src="images/brand/pax-logo.webp" alt=""></span>' : '<span class="mEye"><img src="images/brand/eye.webp" alt=""></span>';
function packHTML(p){
  const cover = p.cover ? `;--packimg:url('${p.cover}')` : '';
  return `<div class="pack${G.sport ? ' sp' : ''}${p.cover ? ' hasCover' : ''}" style="--pk:${p.pk};--glow:${p.glow}${cover}"><div class="tearTop"></div><span class="ptint"></span><i class="crimp ct"></i><i class="crimp cb"></i>
    ${G.sport && !p.cover ? `<span class="pkIco">${ICON[G.sport]}</span><span class="pkPax">PAX</span>` : ''}
    <span class="gem">$${p.price}</span><span class="pname"><b>${p.name}</b><small>${G.packLabel}</small></span></div>`;
}
/* ---- pack engine (per volatility style, optional Gold Boost) ---- */
const vol = () => MODES[S.vol] ? S.vol : 'normal';
const conf = (p, m, b) => b ? p[m].boost : p[m];            // Gold Boost swaps in its own odds
const cost = (p, b) => p.price * (b ? 2 : 1);
const POOLS = {};
function band(p, m, i, b){   // big packs set their own dollar ranges; the rest scale with price
  if (b && i === 5 && p[m].boost.goldLo) return [p[m].boost.goldLo, Infinity];
  if (p[m].bands) return p[m].bands[i];
  const [lo, hi] = MODES[m].bands[i]; return [lo * p.price, hi * p.price]; }
function bandPool(p, m, i, b){
  const k = p.id + m + i + (b && i === 5 ? 'B' : '');
  if (!POOLS[k]) { const [lo, hi] = band(p, m, i, b); POOLS[k] = G.CARDS.filter(c => (p[m].all || !'APX'.includes(c.r)) && c.value >= lo && c.value < hi); }
  return POOLS[k];
}
const goldWeight = (c, s) => Math.pow(c.value, -s);
function pickGold(pool, s){ const tot = pool.reduce((a,c) => a + goldWeight(c, s), 0); let x = rand() * tot;
  for (const c of pool) { x -= goldWeight(c, s); if (x < 0) return c; } return pool[pool.length - 1]; }
function poolWeights(p, m, b, i){ const pool = bandPool(p, m, i, b), s = conf(p, m, b).skew;
  return pool.map(c => [c, i === 5 ? goldWeight(c, s) : 1]); }
function bandMean(p, m, i, b){ const w = poolWeights(p, m, b, i), t = w.reduce((a,[,x]) => a + x, 0); return w.reduce((a,[c,x]) => a + c.value * x, 0) / t; }
function jackpotTotal(p, m, b){ const j = conf(p, m, b).jackpot; return j.A + j.P + j.X; }
function bandRange(p, m, i, b){ const [lo, hi] = band(p, m, i, b); return i === 5 || hi === Infinity ? `${money(lo)}+` : `${money(lo)} – ${money(hi)}`; }
/* chance a pull is worth at least what you paid, and chance of a chase card (top three rarities) */
function shareOf(p, m, b, test){
  const c = conf(p, m, b); let q = 0;
  c.odds.forEach((o, i) => { if (!o) return; const w = poolWeights(p, m, b, i), t = w.reduce((a,[,x]) => a + x, 0);
    q += (i === 5 ? o - jackpotTotal(p, m, b) : o) * w.filter(([x]) => test(x)).reduce((a,[,x]) => a + x, 0) / t; });
  return q;
}
function chaseChance(p, m = vol(), b = false){ return jackpotTotal(p, m, b) + (p[m].all ? shareOf(p, m, b, x => 'APX'.includes(x.r)) : 0); }
function profitChance(p, m = vol(), b = false){ const k = cost(p, b); return jackpotTotal(p, m, b) + shareOf(p, m, b, x => x.value >= k); }
function packStats(p, m = vol(), b = false){
  let ev = 0; const c = conf(p, m, b);
  c.odds.forEach((q, i) => { if (q) ev += (i === 5 ? q - jackpotTotal(p, m, b) : q) * bandMean(p, m, i, b); });
  for (const r of ['A','P','X']) ev += c.jackpot[r] * avg(r);
  return {ev, profit: profitChance(p, m, b), jp: jackpotTotal(p, m, b), gold: c.odds[5]};
}
function pullFrom(p, m = vol(), b = false){
  const c = conf(p, m, b); let x = rand(), i = 0, acc = 0;
  for (; i < 5; i++) { acc += c.odds[i]; if (x < acc) break; }
  if (i === 5) { let y = rand() * c.odds[5];
    for (const r of ['X','P','A']) { if (y < c.jackpot[r]) return {band:5, card:pick(G.BY[r]), jackpot:true}; y -= c.jackpot[r]; } }
  return {band:i, card: i === 5 ? pickGold(bandPool(p, m, 5, b), c.skew) : pick(bandPool(p, m, i))};
}
const MAX_PULL = () => Math.max(...G.CARDS.map(c => c.value));
const pct = x => x >= 1 ? '100%' : x === 0 ? '—' : x >= .1 ? (x*100).toFixed(0)+'%' : x >= .01 ? (x*100).toFixed(1)+'%' : x >= .001 ? (x*100).toFixed(2)+'%' : +(x*100).toPrecision(2)+'%';
const oneIn = x => x <= 0 ? '' : x >= .5 ? '' : `1 in ${Math.round(1/x).toLocaleString('en-US')}`;

/* ============ RENDER: main pack screen ============ */
let PI = 0;                                   // pack centered in the carousel
const boostOK = m => m === 'normal' || m === 'high';
const boostOn = () => !!S.boost && boostOK(vol());
const curPack = () => G.PACKS[Math.min(PI, G.PACKS.length - 1)];
const nice = v => v >= 100 || v % 1 === 0 ? '$' + Math.round(v).toLocaleString('en-US') : money(v);
const pctTxt = q => q === 0 ? '0%' : (Math.round(q * 1000) / 10) % 1 === 0 ? Math.round(q * 100) + '%' : (q * 100).toFixed(1) + '%';
function packRange(p, m, b){                  // lowest and highest card this pack can give
  const c = conf(p, m, b); let lo = Infinity, hi = 0;
  c.odds.forEach((q, i) => { if (!q) return; bandPool(p, m, i, b).forEach(x => { lo = Math.min(lo, x.value); hi = Math.max(hi, x.value); }); });
  for (const r of ['A','P','X']) if (c.jackpot[r] > 0) G.BY[r].forEach(x => { hi = Math.max(hi, x.value); });
  return [lo, hi];
}
function textOn(hex){ const h = hex.replace('#',''), n = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h, 16);
  const l = (0.299 * (n >> 16 & 255) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255; return l > 0.62 ? '#0A0B0D' : '#fff'; }
function renderBal(){
  $('#bal').textContent = money(S.bal);
  const b = $('#buyBtn'); if (b && G.PACKS.length) b.classList.toggle('short', S.bal < cost(curPack(), boostOn()));
}
function renderCat(){
  $('#catIco').innerHTML = catIcon(G.id);
  $('#catName').textContent = G.name;
  $('#catMenu').innerHTML = ['taloki','nfl','nba'].map(id => `<button data-cat="${id}" class="${id === G.id ? 'on' : ''}"><span class="ci">${catIcon(id)}</span>${SETS[id].name}</button>`).join('');
  $('#catMenu').querySelectorAll('[data-cat]').forEach(b => b.onclick = () => { closeCat(); if (b.dataset.cat !== G.id) switchSet(b.dataset.cat); });
}
const catIcon = id => id === 'taloki' ? '<img src="images/brand/logo-eye.png" alt="">' : ICON[SETS[id].sport];
function openCat(){ $('#catMenu').hidden = false; $('#catBtn').classList.add('open'); }
function closeCat(){ $('#catMenu').hidden = true; $('#catBtn').classList.remove('open'); }
$('#catBtn').onclick = e => { e.stopPropagation(); $('#catMenu').hidden ? openCat() : closeCat(); };
document.addEventListener('click', e => { if (!e.target.closest('#catMenu')) closeCat(); });

function renderPacks(){
  PI = Math.min(S.pi && S.pi[G.id] || 0, G.PACKS.length - 1);
  const car = $('#pkCar');
  car.innerHTML = G.PACKS.map((p, i) => `<div class="pkItem" data-i="${i}">${packHTML(p)}</div>`).join('');
  const els = [...car.children];
  const step = () => els.length > 1 ? els[1].offsetLeft - els[0].offsetLeft : 1;
  const paint = () => { const cx = car.scrollLeft + car.clientWidth / 2;
    els.forEach(el => { const d = Math.min(1, Math.abs(el.offsetLeft + el.offsetWidth / 2 - cx) / step());
      el.style.transform = `scale(${1 - d * .16})`; el.style.opacity = 1 - d * .45; }); };
  const settle = () => { const i = Math.max(0, Math.min(els.length - 1, Math.round(car.scrollLeft / step())));
    if (i !== PI) { PI = i; S.pi = Object.assign(S.pi || {}, {[G.id]: i}); save(); renderPackInfo(); } };
  let t;
  car.onscroll = () => { paint(); clearTimeout(t); t = setTimeout(settle, 90); };
  els.forEach((el, i) => el.onclick = () => { if (i !== PI) car.scrollTo({left: i * step(), behavior: RM() ? 'auto' : 'smooth'}); });
  requestAnimationFrame(() => { car.scrollLeft = PI * step(); paint(); });
  renderPackInfo();
}
function renderPackInfo(){
  const p = curPack(), m = vol(), b = boostOn(), [lo, hi] = packRange(p, m, b);
  $('#pkTitle').textContent = p.name;
  $('#pkMin').textContent = nice(lo);
  $('#pkMax').textContent = nice(hi);
  $('#pkStyle').innerHTML = `${MODES[m].name}${b ? '<small> + Boost</small>' : ''}`;
  const btn = $('#buyBtn');
  btn.style.setProperty('--bc', p.glow); btn.style.color = textOn(p.glow);
  btn.innerHTML = `Buy for ${nice(cost(p, b))}`;
  renderBal();
}
$('#buyBtn').onclick = () => openPack(curPack().id, boostOn());
$('#styleBtn').onclick = () => openStyleSheet();
$('#insideBtn').onclick = () => openInside();

/* ---- bottom sheets ---- */
function openBS(html){ $('#bsIn').innerHTML = html; $('#bs').classList.add('on'); document.body.classList.add('sheetOpen'); }
function closeBS(){ $('#bs').classList.remove('on'); document.body.classList.remove('sheetOpen'); }
$('#bs').onclick = e => { if (e.target.id === 'bs') closeBS(); };

function oddsRows(p, m, b){
  const odds = conf(p, m, b).odds, top = Math.max(...odds);
  return odds.map((q, i) => `<div class="orow${q ? '' : ' zero'}"><span class="ol">${q ? bandRange(p, m, i, b).replace(/\.00/g, '') : '-'}</span>
    <span class="ob"><i style="width:${q ? Math.max(q / top * 100, 2) : 0}%;--c:${TIERS[i].rgb}"></i></span><span class="op">${pctTxt(q)}</span></div>`).join('');
}
function openStyleSheet(){
  let tm = vol(), tb = !!S.boost;
  const draw = () => {
    const p = curPack(), b = tb && boostOK(tm), [lo, hi] = packRange(p, tm, b), st = packStats(p, tm, b);
    openBS(`<div class="ssHead"><div class="ssIco">${packHTML(p)}</div>
        <div class="ssTxt"><h3>${MODES[tm].name}</h3><p>${MODES[tm].desc}</p></div><button class="ssX" id="ssX" aria-label="Close">✕</button></div>
      <div class="ssLbl">Choose your pack style</div>
      <div class="ssSeg">${Object.entries(MODES).map(([k, v]) => `<button data-m="${k}" class="${k === tm ? 'on' : ''}">${v.name}</button>`).join('')}</div>
      <button class="ssBoost${b ? ' on' : ''}${boostOK(tm) ? '' : ' off'}" id="ssBoost"><span class="tg"><i></i></span>
        <span><b>Gold Boost</b><small>${boostOK(tm) ? 'Pay 2x, Gold becomes 25% of pulls' : 'Not available on ' + MODES[tm].name}</small></span></button>
      <div class="ssOdds">Estimated Payout Odds:</div>
      <div class="orows">${oddsRows(p, tm, b)}</div>
      <div class="ssRange"><span>Min Value</span><b>${nice(lo)}</b><i class="dots"></i><b>${nice(hi)}</b><span>Max Pull</span></div>
      <p class="ssNote">${p.name} · ${nice(cost(p, b))} · average card value ${money(st.ev)} (${Math.round(st.ev / cost(p, b) * 100)}%). Play money only. Every pull is random and the odds above are exact. Selling a card back pays 90% of its value.</p>
      <button class="buyBig" id="ssApply" style="--bc:${p.glow};color:${textOn(p.glow)}">Apply</button>`);
    $('#ssX').onclick = closeBS;
    document.querySelectorAll('.ssSeg [data-m]').forEach(x => x.onclick = () => { tm = x.dataset.m; draw(); });
    $('#ssBoost').onclick = () => { if (boostOK(tm)) { tb = !tb; draw(); } };
    $('#ssApply').onclick = () => { S.vol = tm; S.boost = tb; save(); closeBS(); renderPackInfo(); };
  };
  draw();
}
/* every card the centered pack can give, with its exact chance */
function cardChances(p, m, b){
  const c = conf(p, m, b), pr = new Map();
  c.odds.forEach((q, i) => { if (!q) return; const w = poolWeights(p, m, b, i), t = w.reduce((a, [, x]) => a + x, 0), qq = i === 5 ? q - jackpotTotal(p, m, b) : q;
    w.forEach(([card, x]) => pr.set(card, (pr.get(card) || 0) + qq * x / t)); });
  for (const r of ['A','P','X']) if (c.jackpot[r] > 0) G.BY[r].forEach(card => pr.set(card, (pr.get(card) || 0) + c.jackpot[r] / G.BY[r].length));
  return [...pr].sort((a, b2) => b2[0].value - a[0].value);
}
function openInside(){
  const p = curPack(), m = vol(), b = boostOn(), list = cardChances(p, m, b), SHOW = 60;
  openBS(`<div class="ssHead"><div class="ssIco">${packHTML(p)}</div>
      <div class="ssTxt"><h3>What's inside</h3><p>${p.name} · ${MODES[m].name}${b ? ' + Gold Boost' : ''} · ${list.length} possible cards</p></div><button class="ssX" id="ssX" aria-label="Close">✕</button></div>
    <div class="wiList">${list.slice(0, SHOW).map(([c, q]) => `<div class="wiRow"><div class="wiCard">${cardHTML(c)}</div>
      <div class="wiMain"><b>${esc(c.name)}</b><span>${c.sport ? c.vname + (c.serial ? ' ' + c.serial : '') : G.RAR[c.r].name}${c.grade ? ' · ' + G.GRADE[c.grade] : ''}</span></div>
      <div class="wiVal"><b>${money(c.value)}</b><span>${q >= .5 ? pctTxt(q) : '1 in ' + Math.round(1 / q).toLocaleString('en-US')}</span></div></div>`).join('')}</div>
    ${list.length > SHOW ? `<p class="ssNote">+ ${list.length - SHOW} more cards from ${money(list[list.length - 1][0].value)} to ${money(list[SHOW][0].value)}.</p>` : ''}`);
  $('#ssX').onclick = closeBS;
}

function colValue(sid = G.id){ return Object.entries(S.cols[sid]).reduce((a,[id,q]) => a + SETS[sid].CARD[id].value * q, 0); }
const totalValue = () => Object.keys(SETS).reduce((a, k) => a + colValue(k), 0);
/* ---- evolution lines: Stage 1 → 2 → 3 → 4 ---- */
function evoLines(){
  const find = f => G.CARDS.find(f);
  const lines = [];
  G.BY.A.filter(a => a.stage === 3).forEach(a => {
    const s2 = find(c => c.stage === 2 && c.name === a.from);
    const s1 = find(c => c.stage === 1 && c.into === a.from);
    const s4 = find(c => c.stage === 4 && c.name === a.into);
    lines.push([{c: s1, name: s1 ? s1.name : (s2 && s2.from) || 'Unknown'}, {c: s2, name: a.from}, {c: a, name: a.name}, {c: s4, name: a.into}]);
  });
  // Stage 4 cards whose earlier stages aren't in the set yet
  G.CARDS.filter(c => c.stage === 4 && !G.BY.A.some(a => a.into === c.name))
    .forEach(c => lines.push([{name: 'Unknown'}, {name: 'Unknown'}, {name: c.from}, {c, name: c.name}]));
  return lines;
}
function renderEvo(){
  const lines = evoLines().map(l => ({l, have: l.filter(s => s.c && COL[s.c.id] > 0).length}));
  lines.sort((a, b) => b.have - a.have);
  const done = lines.filter(x => x.have === 4).length;
  $('#evoSum').textContent = `${done} of ${lines.length} lines complete. Own all four stages of a creature to complete its line.`;
  $('#evoList').innerHTML = lines.map(({l, have}) => `<div class="evoLine${have === 4 ? ' done' : ''}">
    <div class="evoHead"><b>${l[3].name} line</b><span>${have === 4 ? '✓ Complete' : have + ' / 4'}</span></div>
    <div class="evoRow">${l.map((s, i) => `${i ? '<i class="evoArrow">›</i>' : ''}<div class="evoSlot">
      ${s.c && COL[s.c.id] > 0 ? `<div class="evoCard" data-id="${s.c.id}">${cardHTML(s.c)}</div>`
        : s.c ? lockedHTML(s.c)
        : `<div class="evoMissing">Not in the set yet</div>`}
      <span class="evoName">Stage ${i + 1}<br><b>${s.name}</b></span></div>`).join('')}</div></div>`).join('');
  document.querySelectorAll('#evoList .evoCard').forEach(el => el.onclick = () => showCard(+el.dataset.id));
}
/* ---- sports: every version of each player (Base → One of One) ---- */
function renderPlayers(){
  const rows = G.players.map(pl => { const cards = G.CARDS.filter(c => c.name === pl.name).sort((a, b) => a.value - b.value);
    return {pl, cards, have: cards.filter(c => COL[c.id] > 0).length}; });
  rows.sort((a, b) => (b.have / b.cards.length) - (a.have / a.cards.length) || a.pl.rank - b.pl.rank);
  const done = rows.filter(x => x.have === x.cards.length).length;
  $('#evoSum').textContent = `${done} of ${rows.length} players complete. Own every version of a player to complete their run.`;
  $('#evoList').innerHTML = rows.map(({pl, cards, have}) => `<div class="evoLine plLine${have === cards.length ? ' done' : ''}">
    <div class="evoHead"><b>${esc(pl.name)} <small class="plTag">${pl.team} · ${pl.pos}${pl.rc ? ' · RC' : ''}</small></b><span>${have === cards.length ? '✓ Complete' : have + ' / ' + cards.length}</span></div>
    <div class="evoRow plRow">${cards.map(c => `<div class="evoSlot">
      ${COL[c.id] > 0 ? `<div class="evoCard" data-id="${c.id}">${cardHTML(c)}</div>` : lockedHTML(c)}
      <span class="evoName"><b>${c.vname}</b></span></div>`).join('')}</div></div>`).join('');
  document.querySelectorAll('#evoList .evoCard').forEach(el => el.onclick = () => showCard(+el.dataset.id));
}
function setColView(v){
  S.colView = v; save();
  document.querySelectorAll('#colSeg button').forEach(b => b.classList.toggle('on', b.dataset.cv === v));
  $('#cvCards').hidden = v !== 'cards'; $('#cvEvo').hidden = v !== 'evo';
  $('#altTitle').textContent = G.sport ? 'Player runs' : 'Evolution lines';
  if (v === 'evo') G.sport ? renderPlayers() : renderEvo();
}
document.querySelectorAll('#colSeg button').forEach(b => b.onclick = () => setColView(b.dataset.cv));

function renderCol(){
  $('#colSetName').textContent = G.setName + ' set';
  $('#colSeg [data-cv="evo"]').textContent = G.altView;
  setColView(S.colView === 'evo' ? 'evo' : 'cards');
  const owned = Object.keys(COL).filter(id => COL[id] > 0).length;
  $('#colStats').innerHTML = `
    <div class="stat"><b>${owned}/${G.CARDS.length}</b><span>Set complete</span><div class="bar"><i style="width:${owned/G.CARDS.length*100}%"></i></div></div>
    <div class="stat"><b>${money(colValue())}</b><span>Collection value</span></div>
    <div class="stat"><b>${S.openedBy[G.id] || 0}</b><span>Packs ripped</span></div>
    <div class="stat"><b>${S.bestBy[G.id] ? esc(G.CARD[S.bestBy[G.id]].name) : '—'}</b><span>Best pull${S.bestBy[G.id] ? ' · ' + money(G.CARD[S.bestBy[G.id]].value) : ''}</span></div>`;
  const filters = [['all','All'],['owned','Owned'],...G.ORDER.map(r => [r, G.RAR[r].name])];
  $('#chips').innerHTML = filters.map(([k,l]) => `<button class="chip ${S.filter===k?'on':''}" data-f="${k}">${l}</button>`).join('');
  document.querySelectorAll('.chip').forEach(b => b.onclick = () => { S.filter = b.dataset.f; save(); renderCol(); });
  let list = G.CARDS.slice();
  if (S.filter === 'owned') list = list.filter(c => COL[c.id] > 0);
  else if (S.filter !== 'all') list = list.filter(c => c.r === S.filter);
  list.sort((a,b) => b.value - a.value);
  $('#colGrid').innerHTML = list.length ? list.map(c => COL[c.id] > 0
    ? `<div data-id="${c.id}" tabindex="0" role="button" aria-label="${c.name}">${cardHTML(c, COL[c.id])}</div>`
    : lockedHTML(c)).join('')
    : `<div class="empty">No cards here yet. Rip a pack to start your collection.</div>`;
  document.querySelectorAll('#colGrid [data-id]').forEach(el => { el.onclick = () => showCard(+el.dataset.id); el.onkeydown = e => { if (e.key === 'Enter') showCard(+el.dataset.id); }; });
}

function cardMeta(c){
  if (c.sport) { const G2 = SETS[c.set];
    return `${c.vname}${c.serial ? ' · ' + c.serial : ''} · ${c.pos} · ${c.team}${c.rc ? ' · Rookie' : ''}${c.grade ? '<br>' + G2.GRADE[c.grade] : ''}<br>${G2.setName} #${c.num}`; }
  return `${SETS.taloki.RAR[c.r].name} · ${c.el.name} · #${c.num}${c.grade ? ' · ' + SETS.taloki.GRADE[c.grade] : ''}${c.basic ? '<br>Basic creature' : ''}${c.stage ? `<br>Stage ${c.stage}${c.from ? ' · evolves from ' + c.from : ''}${c.into ? ' · into ' + c.into : ''}` : ''}`;
}
function showCard(id, sid = G.id){
  const c = SETS[sid].CARD[id], col = S.cols[sid], q = col[id] || 0;
  $('#sheet').innerHTML = `${card3dHTML(c)}<div class="meta tiny">Drag to tilt · tap to flip</div><h3>${c.name}</h3>
    <div class="meta">${cardMeta(c)}<br>Value <strong>${money(c.value)}</strong> · You own ${q}</div>
    <div class="actions" style="justify-content:center">
      ${q ? `<button class="buy" id="sell1" style="width:auto">Sell 1 for ${money(sellPrice(c))}</button>` : ''}
      <button class="ghost" id="closeM">Close</button></div>`;
  $('#modal').classList.add('on');
  attach3d($('#sheet .v3d'));
  $('#closeM').onclick = closeModal;
  if (q) $('#sell1').onclick = () => { sell([[id,1]], sid); closeModal(); };
}
function closeModal(){ $('#modal').classList.remove('on'); }
$('#modal').onclick = e => { if (e.target.id === 'modal') closeModal(); };

function sell(pairs, sid = G.id){
  let total = 0, n = 0; const col = S.cols[sid];
  for (const [id,q] of pairs) { const have = col[id] || 0, k = Math.min(q, have); if (!k) continue; col[id] = have - k; if (!col[id]) delete col[id]; total += sellPrice(SETS[sid].CARD[id]) * k; n += k; }
  total = Math.round(total * 100) / 100;
  if (!n) { toast('Nothing to sell'); return 0; }
  S.bal = Math.round((S.bal + total) * 100) / 100; S.earned += total; save(); renderBal(); renderCol(); renderProfile(); if (document.body.dataset.view === 'show') renderShowroom();
  toast(`Sold ${n} card${n>1?'s':''} for ${money(total)}`);
  return total;
}
$('#sellCommons').onclick = () => sell(Object.entries(COL).filter(([id]) => 'CU'.includes(G.CARD[id].r)).map(([id,q]) => [+id,q]));
$('#sellDupes').onclick = () => sell(Object.entries(COL).filter(([,q]) => q > 1).map(([id,q]) => [+id,q-1]));

/* ============ PACK OPENING ============ */
const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
let cur = null, lastPack = null, lastBoost = false;   // cur = {p, m, boost, band, card, jackpot}
const wait = ms => new Promise(r => setTimeout(r, RM() ? Math.min(ms, 150) : ms));

function openPack(pid, boost = false){
  const p = G.PACKS.find(x => x.id === pid), k = cost(p, boost);
  if (S.bal < k) { toast('Not enough funds. Tap + to add play money.'); return; }
  lastPack = pid; lastBoost = boost;
  S.bal = Math.round((S.bal - k) * 100) / 100; S.spent = Math.round((S.spent + k) * 100) / 100; S.opened++; S.openedBy[G.id] = (S.openedBy[G.id] || 0) + 1;
  const m = vol();
  cur = Object.assign({p, m, boost}, pullFrom(p, m, boost));
  const c = cur.card;
  COL[c.id] = (COL[c.id] || 0) + 1;
  if (!bestCard() || c.value > bestCard().value) S.best = {s:G.id, id:c.id};
  if (!S.bestBy[G.id] || c.value > G.CARD[S.bestBy[G.id]].value) S.bestBy[G.id] = c.id;
  S.history = [{t: Date.now(), s: G.id, p: p.id, c: c.id, b: cur.band, m, g: boost ? 1 : 0}, ...(S.history || [])].slice(0, 300);
  save(); renderBal();
  document.body.style.overflow = 'hidden'; document.body.classList.add('opening'); closeBS(); closeCat();
  const st = $('#stage');
  st.className = 'stage on';
  st.innerHTML = `<div class="stars">${Array.from({length: 90}, () =>
    `<i style="left:${rand()*100}%;top:${rand()*100}%;--s:${(rand()*2+0.6).toFixed(1)}px;animation-delay:${(rand()*4).toFixed(2)}s"></i>`).join('')}</div><div class="sb" id="sb"></div>`;
  showChooser();
}
const SB = () => $('#sb');

/* ---- effects ---- */
function sparks(rgb, n = 26, el, spread = 170){
  const r = el ? el.getBoundingClientRect() : {left: innerWidth/2, top: innerHeight/2, width: 0, height: 0};
  const cx = r.left + r.width/2, cy = r.top + r.height/2;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('i'); s.className = 'spark';
    const a = rand() * Math.PI * 2, d = spread * (0.35 + rand() * 0.65);
    s.style.cssText = `left:${cx}px;top:${cy}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;--c:${rgb};animation-delay:${Math.round(rand()*90)}ms`;
    $('#stage').appendChild(s); setTimeout(() => s.remove(), 1200);
  }
}
function ring(rgb, el){
  const r = el.getBoundingClientRect(), g = document.createElement('i'); g.className = 'ringFx';
  g.style.cssText = `left:${r.left + r.width/2}px;top:${r.top + r.height/2}px;--c:${rgb}`;
  $('#stage').appendChild(g); setTimeout(() => g.remove(), 1000);
}
function flash(r){ flashRGB({A:'25,200,230', P:'255,122,47', X:'255,215,60'}[r]); }
function flashRGB(rgb, big){
  const b = $('#burst');
  b.style.background = big
    ? 'conic-gradient(from 0deg,rgba(255,61,154,.7),rgba(255,210,31,.8),rgba(25,198,255,.7),rgba(155,77,255,.7),rgba(255,61,154,.7))'
    : `radial-gradient(circle at 50% 45%, rgba(${rgb},.85), rgba(${rgb},0) 60%)`;
  b.classList.remove('go'); void b.offsetWidth; b.classList.add('go');
}
const tierRGB = i => TIERS[i].rgb;

/* ---- Step 1: scroll a looping row of 6 packs and pick one ---- */
function showChooser(){
  const p = cur.p, LOOPS = 9, N = 6;
  const serials = Array.from({length: N}, () => String(1000 + Math.floor(rand() * 9000)));
  const items = [];
  for (let l = 0; l < LOOPS; l++) for (let k = 0; k < N; k++)
    items.push(`<div class="cItem" data-k="${k}" style="--tilt:${[-4,3,-2,4,-3,2][k]}deg">${packHTML(p)}<span class="serial">No. ${serials[k]}</span></div>`);
  SB().innerHTML = `<button class="topX" id="cancelPick" aria-label="Close">✕</button>
    <div class="hint">Pick your pack</div><div class="carousel" id="car">${items.join('')}</div>
    <button class="buy pickBtn" id="pickBtn">Open this pack</button>
    <div class="meta hintSm">${MODES[cur.m].name} style${cur.boost ? ' · Gold Boost' : ''} · swipe to browse · tap a pack to choose it</div>`;
  $('#cancelPick').onclick = () => { if (confirm('Leave now? Your pack is already paid for, so its card goes straight to your collection.')) closeStage(); };
  const car = $('#car'), els = [...car.children];
  const w = () => els[1].offsetLeft - els[0].offsetLeft;
  const centerIdx = () => Math.round(car.scrollLeft / w());
  const paint = () => { const cx = car.scrollLeft + car.clientWidth / 2;
    els.forEach(el => { const d = Math.min(1, Math.abs(el.offsetLeft + el.offsetWidth / 2 - cx) / (w() * 1.6));
      el.style.transform = `scale(${1 - d * .22}) rotate(calc(var(--tilt) * ${d}))`; el.style.opacity = 1 - d * .5; el.classList.toggle('mid', d < .2); }); };
  const jumpTo = i => { car.scrollLeft = i * w(); };
  requestAnimationFrame(() => { jumpTo(N * Math.floor(LOOPS / 2)); paint(); });
  let t;
  car.addEventListener('scroll', () => { paint(); clearTimeout(t); t = setTimeout(() => {
    const i = centerIdx();   // keeps the loop endless by hopping back to the middle copy
    if (i < N * 2 || i >= N * (LOOPS - 2)) { jumpTo(N * Math.floor(LOOPS / 2) + (i % N)); paint(); } }, 140); }, {passive: true});
  const choose = el => { $('#pickBtn').disabled = true; el.classList.add('chosen'); setTimeout(showRip, RM() ? 0 : 380); };
  els.forEach((el, i) => el.onclick = () => {
    if (i === centerIdx()) choose(el); else car.scrollTo({left: i * w(), behavior: RM() ? 'auto' : 'smooth'}); });
  $('#pickBtn').onclick = () => choose(els[centerIdx()]);
}

/* ---- Step 2: swipe across the top to cut the pack open ---- */
function showRip(){
  // the pack looks the same no matter what's inside
  SB().innerHTML = `<div class="hint">Swipe across the top to cut it open</div>
    <div class="bigpack seam" id="bp" tabindex="0" role="button" aria-label="Cut the pack open: swipe across the top, or press Enter">${packHTML(cur.p)}<i class="streak"></i>
      <div class="cutZone" id="cz"><i class="cutGuide"></i><i class="cutLine" id="cl"></i><i class="blade" id="bl"></i><i class="ghostFinger"></i></div></div>
    <div class="hint hintSm">Drag your finger along the dashed line</div>`;
  const bp = $('#bp'), cz = $('#cz'), cl = $('#cl'), bl = $('#bl');
  let sx = null, lastX = 0, done = false;
  const go = async () => { if (done) return; done = true; cz.classList.add('cut'); cl.style.width = '100%';
    bp.classList.add('ripping'); await wait(420); sparks('255,220,160', 30, bp.querySelector('.tearTop'), 150);
    await wait(600); bp.classList.add('rise'); await wait(520); showSpin(); };
  const pos = e => { const r = cz.getBoundingClientRect(); return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); };
  cz.addEventListener('pointerdown', e => { if (done) return; sx = pos(e); lastX = sx; cz.setPointerCapture(e.pointerId); cz.classList.add('active'); });
  cz.addEventListener('pointermove', e => { if (sx === null || done) return; lastX = pos(e);
    const a = Math.min(sx, lastX), w = Math.abs(lastX - sx);
    cl.style.left = a * 100 + '%'; cl.style.width = w * 100 + '%'; bl.style.left = lastX * 100 + '%';
    if (Math.random() < 0.35) sparks('255,230,170', 2, bl, 40);
    if (w >= 0.72) go(); });
  const up = () => { if (done || sx === null) return; sx = null; cz.classList.remove('active'); cl.style.width = '0'; };
  cz.addEventListener('pointerup', up); cz.addEventListener('pointercancel', up);
  bp.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') go(); };
}

/* ---- Step 3: the mystery card spins and changes color until it lands on your tier ---- */
function mysteryHTML(rgb){
  const face = cls => `<div class="mf${cls}">${markHTML()}</div>`;
  return `<div class="myst" id="myst" style="--tc:${rgb}"><div class="mIn" id="mIn">${face('')}${face(' mb')}</div></div>`;
}
/* Every half-turn shows a random color. The number of turns and the spin time never depend on the
   result, so nothing hints at the outcome until the card stops on its final color. */
function showSpin(){
  const band = cur.band, N = 11, seq = [];
  const randTier = prev => { let x; do { x = Math.floor(rand() * TIERS.length); } while (x === prev); return x; };
  for (let k = 0; k < N; k++) seq.push(randTier(seq[k - 1]));
  seq.push(cur.jackpot ? 'J' : band);                     // the last turn lands on the real result
  SB().innerHTML = `<button class="skip" id="skip">Skip</button>
    <div class="spinBox">${mysteryHTML(tierRGB(seq[0]))}</div>
    <div class="tierLbl" id="tl"><b style="color:rgb(${tierRGB(seq[0])})">${TIERS[seq[0]].name}</b></div>
    <div class="hint hintSm" id="spd">Tap to speed up</div>`;
  const myst = $('#myst'), mIn = $('#mIn'), tl = $('#tl');
  let speed = 1, t = 0, last = performance.now(), k = 0, done = false;
  const T = RM() ? 0.2 : 3.6;
  const setTier = x => {
    if (x === 'J') { myst.classList.add('rainbow'); tl.innerHTML = '<b class="jp">JACKPOT</b><small>A chase card is inside</small>'; sparks('255,215,60', 40, myst, 220); return; }
    myst.style.setProperty('--tc', tierRGB(x));
    tl.innerHTML = `<b style="color:rgb(${tierRGB(x)})">${TIERS[x].name}</b>`;
    if (!done) sparks(tierRGB(x), 10, myst, 130);
  };
  const land = () => { if (done) return; done = true;
    mIn.style.transform = 'rotateX(8deg) rotateY(0deg)';
    setTier(seq[N]);
    ring(tierRGB(band), myst); sparks(tierRGB(band), 34 + band * 6, myst, 230); flashRGB(tierRGB(band), cur.jackpot);
    myst.classList.add('landed'); $('#spd').textContent = '';
    setTimeout(showPeel, RM() ? 200 : cur.jackpot ? 1500 : 1000);
  };
  const ease = x => 1 - Math.pow(1 - x, 3);
  const frame = now => {
    if (done) return;
    t += (now - last) / 1000 * speed; last = now;
    const f = Math.min(1, t / T), ang = 180 * N * ease(f);
    mIn.style.transform = `rotateX(8deg) rotateY(${ang}deg)`;
    const idx = Math.min(N, Math.floor((ang + 90) / 180));
    while (k < idx) { k++; setTier(seq[k]); }
    if (f >= 1) land(); else requestAnimationFrame(frame);
  };
  requestAnimationFrame(n => { last = n; requestAnimationFrame(frame); });
  SB().onclick = e => { if (e.target.id === 'skip') return; speed = Math.min(speed * 2.2, 8); };
  $('#skip').onclick = e => { e.stopPropagation(); done = true; showResults(); };
}

/* ---- Step 4: peel the cover off (or tap to open) ---- */
const SLAB_AR = 0.62;
function faceAR(c){ return c.sport ? (c.grade ? SLAB_AR : 5/7) : c.slab ? c.slab.ar : 5/7; }
function frontHTML(c){ if (c.sport) return c.grade ? spSlabHTML(c) : spCardHTML(c);
  return graded(c) ? `<img class="slabImg" src="${c.slab.src}" alt="${c.name}">` : cardHTML(c); }
/* every cover is the same card shape; the real card (raw or graded) is fitted inside it */
function fitStyle(ar){ const box = 5/7; return ar < box ? `height:100%;width:${(ar / box * 100).toFixed(2)}%` : `width:100%;height:${(box / ar * 100).toFixed(2)}%`; }
function clipHalf(poly, f){
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], fa = f(a), fb = f(b);
    if (fa >= 0) out.push(a);
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
  }
  return out;
}
const polyCSS = pts => pts.length >= 3 ? `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})` : 'polygon(0 0,0 0,0 0)';
function showPeel(){
  const c = cur.card, rgb = cur.jackpot ? '255,215,60' : tierRGB(cur.band);
  SB().onclick = null;
  SB().innerHTML = `<button class="skip" id="skip">Skip</button>
    <div class="hint">${cur.jackpot ? 'Jackpot! Peel it open' : TIERS[cur.band].name + ' tier · peel it open'}</div>
    <div class="peelWrap" id="pw" style="--ar:${5/7};--tc:${rgb}">
      <div class="pfront" id="pfr"><div class="pfit" style="${fitStyle(faceAR(c))}">${frontHTML(c)}</div></div>
      <div class="pcover mf${cur.jackpot ? ' rainbowBg' : ''}" id="pc">${markHTML()}</div>
      <div class="pflapWrap"><div class="pflap" id="pf"></div></div>
    </div>
    <div class="pulled" id="pulled"></div>
    <div class="hint hintSm" id="ph">Drag across the card to peel it · or tap to open</div>`;
  const pw = $('#pw'), pc = $('#pc'), pf = $('#pf');
  let L = 0, sx, sy, drag = false, moved = false, opened = false, anim;
  const W = () => pw.clientWidth, H = () => pw.clientHeight;
  const setPeel = l => {
    L = l; const w = W(), h = H(), box = [[0,0],[w,0],[w,h],[0,h]];
    const g = pt => (w - pt[0]) + pt[1] - L;             // fold line runs from the top-right corner
    pc.style.clipPath = polyCSS(clipHalf(box, g));
    pf.style.clipPath = polyCSS(clipHalf(box, pt => -g(pt)).map(([x, y]) => [w - L + y, L - w + x]));
  };
  const animateTo = (target, ms, then) => { cancelAnimationFrame(anim); const from = L, t0 = performance.now();
    const step = now => { const f = Math.min(1, (now - t0) / (RM() ? 1 : ms)), e = 1 - Math.pow(1 - f, 3);
      setPeel(from + (target - from) * e); if (f < 1) anim = requestAnimationFrame(step); else if (then) then(); };
    anim = requestAnimationFrame(step); };
  const open = () => { if (opened) return; opened = true; animateTo(W() + H() + 60, 420, revealed); };
  pw.addEventListener('pointerdown', e => { if (opened) return; drag = true; moved = false; sx = e.clientX; sy = e.clientY; pw.setPointerCapture(e.pointerId); cancelAnimationFrame(anim); });
  pw.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) + Math.abs(dy) > 6) moved = true; setPeel(Math.max(0, (Math.abs(dx) + Math.abs(dy)) * 0.8)); });
  const up = () => { if (!drag) return; drag = false;
    if (!moved) { animateTo(W() + H() + 60, 900, () => { opened = true; revealed(); }); opened = true; return; }
    if (L > (W() + H()) * 0.33) open(); else animateTo(0, 300); };
  pw.addEventListener('pointerup', up); pw.addEventListener('pointercancel', up);
  $('#skip').onclick = showResults;
  function revealed(){
    pc.remove(); pf.parentElement.remove();
    $('#pfr').classList.add('zap'); pw.style.setProperty('--tc', rgb);
    ring(rgb, pw); sparks(rgb, 40, pw, 240);
    if ('APX'.includes(c.r)) flash(c.r); else flashRGB(rgb, false);
    $('#pulled').style.setProperty('--tc', rgb);
    $('#pulled').innerHTML = `<span class="bigVal">${money(c.value)}</span>${c.name}<small>${c.sport ? c.vname + (c.serial ? ' ' + c.serial : '') : G.RAR[c.r].name}${c.grade ? ' · ' + G.GRADE[c.grade] : ''}</small>`;
    $('#pulled').classList.toggle('x', c.r === 'X'); $('#pulled').classList.toggle('a', c.r === 'A'); $('#pulled').classList.toggle('p', c.r === 'P');
    $('#ph').textContent = 'Tap to continue';
    setTimeout(() => { SB().onclick = showResults; }, 350);
  }
}

/* ---- 3D card viewer: drag to tilt, tap to flip and see the back ---- */
function card3dHTML(c){
  const back = c.sport ? (c.grade ? `<div class="pxSlab pxSlabBack"><div class="pxLbl pxLblBack"><b>PAX</b><span>Grading · Cert ${String(c.id * 7919 + 100000).slice(-8)}</span></div><div class="pxWin">${pxBackHTML(c, true)}</div></div>` : pxBackHTML(c))
    : `<img src="${graded(c) ? 'images/brand/back-graded.webp' : 'images/brand/back.webp'}" alt="Card back">`;
  return `<div class="v3d${graded(c) ? ' isSlab' : ''}${c.sport ? ' isSp' : ''}" style="--ar:${faceAR(c)}"><div class="v3dIn">
    <div class="f3 front3">${frontHTML(c)}<i class="glare"></i></div>
    <div class="f3 back3">${back}</div></div><i class="shadow3"></i></div>`;
}
function attach3d(root){
  if (!root) return;
  const inner = root.querySelector('.v3dIn');
  let ry = 0, rx = 0, base = 0, sx, sy, drag = false, moved = false;
  const set = tr => { inner.style.transition = tr || 'none'; inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    root.style.setProperty('--gx', `${50 + (ry - base) * 0.9}%`); };
  root.addEventListener('pointerdown', e => { drag = true; moved = false; sx = e.clientX; sy = e.clientY; root.setPointerCapture(e.pointerId); root.classList.add('grab'); });
  root.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) + Math.abs(dy) > 6) moved = true; ry = base + dx * 0.55; rx = Math.max(-22, Math.min(22, -dy * 0.3)); set(); });
  const end = () => { if (!drag) return; drag = false; root.classList.remove('grab');
    base = moved ? Math.round(ry / 180) * 180 : base + 180; ry = base; rx = 0; set('transform .65s cubic-bezier(.2,.8,.2,1)'); };
  root.addEventListener('pointerup', end); root.addEventListener('pointercancel', end);
}

/* ---- Step 5: result screen ---- */
function showResults(){
  const c = cur.card, p = cur.p, st = $('#stage');
  SB().onclick = null;
  st.classList.add('resMode');
  SB().innerHTML = `<div class="res">
    <div class="resTop"><button class="topX" id="closeRes" aria-label="Close">✕</button></div>
    <div class="resCard">${card3dHTML(c)}</div>
    <div class="resVal" id="rv" style="--vc:${cur.jackpot ? '255,215,60' : tierRGB(cur.band)}">$0.00</div>
    <div class="resName">${c.name}${c.sport ? ' · ' + c.vname + (c.serial ? ' ' + c.serial : '') : ' #' + c.num}</div>
    <div class="resTier"><span class="tchip" style="--c:${cur.jackpot ? '255,215,60' : tierRGB(cur.band)}">${cur.jackpot ? 'Jackpot' : TIERS[cur.band].name + ' tier'}</span></div>
    <div class="meta tiny">Drag to tilt · tap the card to flip it</div>
    <div class="resBtns"><button class="sellB" id="sellPull">Sell · ${money(sellPrice(c))}</button><button class="keepB" id="keep">Keep</button></div>
    <button class="againB" id="again">Rip another ${p.name}${cur.boost ? ' · Gold Boost' : ''} · ${money(cost(p, cur.boost))}</button>
  </div>`;
  attach3d($('.res .v3d'));
  const rv = $('#rv'), t0 = performance.now(), D = RM() ? 1 : 900;
  const count = now => { const f = Math.min(1, (now - t0) / D); rv.textContent = money(c.value * (1 - Math.pow(1 - f, 3))); if (f < 1) requestAnimationFrame(count); };
  requestAnimationFrame(count);
  $('#keep').onclick = $('#closeRes').onclick = closeStage;
  $('#sellPull').onclick = () => { sell([[c.id, 1]]); closeStage(); };
  $('#again').onclick = () => { closeStage(); openPack(lastPack, lastBoost); };
}
function closeStage(){ const st = $('#stage'); st.className = 'stage'; st.innerHTML = ''; document.body.style.overflow = ''; document.body.classList.remove('opening'); renderCol(); renderBal(); renderProfile(); }

/* ============ NAV + CATEGORY SWITCH ============ */
function showView(v){
  document.querySelectorAll('.nav button').forEach(x => x.classList.toggle('on', x.dataset.v === v));
  document.querySelectorAll('.view').forEach(el => el.classList.toggle('on', el.id === 'v-' + v));
  document.body.dataset.view = v;
  if (v === 'col') renderCol();
  if (v === 'show') renderShowroom();
  if (v === 'hist') renderHistory();
  if (v === 'me') renderProfile();
  scrollTo(0,0);
}
document.querySelectorAll('.nav button').forEach(b => b.onclick = () => showView(b.dataset.v));

function applySet(id){
  G = SETS[id]; COL = S.cols[id]; S.set = id; save();
  document.body.dataset.set = id;
  if (S.filter !== 'all' && S.filter !== 'owned' && !G.RAR[S.filter]) S.filter = 'all';
  renderCat(); renderPacks(); renderCol();
  if (document.body.dataset.view === 'show') renderShowroom();
}
function switchSet(id){   // short "Loading packs" moment, like changing category in a pack app
  const ld = $('#pkLoad');
  ld.innerHTML = `<div class="ldIcons">${[0,1,2].map(i => `<span style="animation-delay:${i * .12}s">${catIcon(id)}</span>`).join('')}</div><small>Loading packs…</small>`;
  document.body.classList.add('loading');
  setTimeout(() => { applySet(id); setTimeout(() => document.body.classList.remove('loading'), RM() ? 0 : 260); }, RM() ? 0 : 420);
}

/* ---- showroom: your best cards across PAX ---- */
function renderShowroom(){
  const all = [];
  for (const k in SETS) for (const id in S.cols[k]) if (S.cols[k][id] > 0) all.push(SETS[k].CARD[id]);
  all.sort((a, b) => b.value - a.value);
  const top = all.slice(0, 24);
  $('#showroom').innerHTML = top.length ? `<div class="showGrid">${top.map(c => `<button class="showItem" data-id="${c.id}" data-s="${c.set}">
      <div class="showCard" style="--ar:${faceAR(c)}">${frontHTML(c)}</div>
      <b>${esc(c.name)}</b><span>${SETS[c.set].name} · ${c.sport ? c.vname : SETS[c.set].RAR[c.r].name}</span><em>${money(c.value)}</em></button>`).join('')}</div>`
    : `<div class="empty">Your best pulls will be displayed here. Rip a pack!</div>`;
  document.querySelectorAll('#showroom .showItem').forEach(b => b.onclick = () => showCard(+b.dataset.id, b.dataset.s));
}
/* ---- pull history ---- */
function renderHistory(){
  const hist = S.history || [];
  $('#history').innerHTML = hist.length ? `<div class="histList">${hist.slice(0, 100).map(h => { const sid = h.s || 'taloki', c = cardOf(sid, h.c), p = c && SETS[sid].PACKS.find(x => x.id === h.p); if (!c) return '';
      return `<div class="histRow" data-id="${c.id}" data-s="${sid}"><i class="hdot" style="--c:${TIERS[h.b] ? TIERS[h.b].rgb : '154,163,178'}"></i>
        <div class="hMain"><b>${esc(c.name)}${c.sport ? ' <small>' + c.vname + '</small>' : ''}</b><span>${SETS[sid].name} · ${p ? p.name : 'Pack'}${h.m && h.m !== 'normal' ? ' · ' + (MODES[h.m] ? MODES[h.m].name : h.m) : ''}${h.g ? ' · Boost' : ''} · ${new Date(h.t).toLocaleString([], {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'})}</span></div>
        <b class="hVal">${money(c.value)}</b></div>`; }).join('')}</div>` : `<div class="empty">Your pulls will show up here.</div>`;
  document.querySelectorAll('#history [data-id]').forEach(r => r.onclick = () => { if (S.cols[r.dataset.s][r.dataset.id]) showCard(+r.dataset.id, r.dataset.s); });
}

/* ---- add any amount of play money ---- */
function addMoney(v){
  v = Math.round(v * 100) / 100;
  if (!(v > 0) || v > 100000) { toast('Enter an amount from $0.01 to $100,000'); return false; }
  S.bal = Math.round((S.bal + v) * 100) / 100; S.added = Math.round(((S.added || 0) + v) * 100) / 100;
  save(); renderBal(); renderProfile(); toast(`Added ${money(v)} play money`); return true;
}
function openAddMoney(){
  $('#sheet').innerHTML = `<h3>Add play money</h3>
    <div class="amtRow"><span>$</span><input id="amt" type="text" inputmode="decimal" placeholder="0.00" autocomplete="off" aria-label="Amount"></div>
    <div class="chipsAmt">${[10, 25, 50, 100, 500, 1000].map(v => `<button class="chip" data-a="${v}">$${v.toLocaleString('en-US')}</button>`).join('')}</div>
    <div class="actions" style="justify-content:center;width:100%"><button class="buy" id="doAdd" style="width:auto">Add</button><button class="ghost" id="closeM">Cancel</button></div>
    <div class="meta tiny">Play money only. Balance ${money(S.bal)}</div>`;
  $('#modal').classList.add('on');
  const inp = $('#amt');
  document.querySelectorAll('.chipsAmt .chip').forEach(b => b.onclick = () => { inp.value = b.dataset.a; inp.focus(); });
  const go = () => { const v = parseFloat(String(inp.value).replace(/[$,\s]/g, '')); if (addMoney(v)) closeModal(); };
  $('#doAdd').onclick = go; inp.onkeydown = e => { if (e.key === 'Enter') go(); };
  $('#closeM').onclick = closeModal;
  setTimeout(() => inp.focus(), 50);
}
$('#addFunds').onclick = openAddMoney;

/* ---- account ---- */
function renderProfile(){
  const el = $('#profile'); if (!el) return;
  const best = bestCard();
  el.innerHTML = `
    <div class="acHead"><img src="images/brand/pax-logo.webp" alt="PAX"><div><b>PAX</b><span>Play money only</span></div></div>
    <div class="statrow">
      <div class="stat"><b>${money(S.bal)}</b><span>Balance</span></div>
      <div class="stat"><b>${money(totalValue())}</b><span>Collection value</span></div>
      <div class="stat"><b>${money(S.added || 0)}</b><span>Money added</span></div>
      <div class="stat"><b>${money(S.spent || 0)}</b><span>Spent on packs</span></div>
      <div class="stat"><b>${money(S.earned || 0)}</b><span>Earned from selling</span></div>
      <div class="stat"><b>${(S.opened || 0).toLocaleString('en-US')}</b><span>Packs opened</span></div>
    </div>
    <h2>Best pull</h2>
    ${best ? `<div class="bestPull" data-id="${best.id}" data-s="${best.set}"><div class="bpCard">${cardHTML(best)}</div>
      <div><b>${esc(best.name)}</b><div class="meta">${SETS[best.set].name} · ${best.sport ? best.vname : SETS[best.set].RAR[best.r].name} · #${best.num}</div><div class="bpVal">${money(best.value)}</div></div></div>`
      : `<div class="empty">No pulls yet. Rip a pack!</div>`}
    <div class="actions"><button class="buy" id="profAdd" style="width:auto">Add money</button></div>
    <h2>Settings</h2>
    <div class="actions"><button class="ghost" id="resetAll">Reset balance, collection and history</button></div>`;
  $('#profAdd').onclick = openAddMoney;
  const bp = el.querySelector('.bestPull'); if (bp) bp.onclick = () => { if (S.cols[bp.dataset.s][bp.dataset.id]) showCard(+bp.dataset.id, bp.dataset.s); };
  $('#resetAll').onclick = () => { if (!confirm('Reset everything? Your balance goes back to $50 and your collection and history are cleared.')) return;
    S = Object.assign(fresh(), {v:3, vol:S.vol, hideInstall:S.hideInstall, set:S.set, pi:S.pi}); COL = S.cols[G.id];
    save(); renderBal(); renderPackInfo(); renderCol(); renderProfile(); toast('Everything was reset'); };
}
applySet(G.id); showView('packs');
setTimeout(() => { const sp = $('#splash'); if (sp) { sp.classList.add('out'); setTimeout(() => sp.remove(), 600); } }, RM() ? 0 : 900);

/* ============ FULL-SCREEN / INSTALL ============ */
(function(){
  const standalone = matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches || navigator.standalone;
  if (standalone) { document.documentElement.classList.add('standalone'); return; }
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const bar = $('#installBar');
  const show = html => { if (S.hideInstall) return; bar.innerHTML = html + '<button class="ibClose" aria-label="Dismiss">✕</button>'; bar.hidden = false;
    bar.querySelector('.ibClose').onclick = () => { bar.hidden = true; S.hideInstall = true; save(); }; };
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault();
    show('<span>Install PAX to play full screen</span><button class="ibGo">Install</button>');
    const go = bar.querySelector('.ibGo'); if (go) go.onclick = async () => { e.prompt(); await e.userChoice; bar.hidden = true; }; });
  if (ios) show('<span>For full screen: tap <b>Share</b> then <b>Add to Home Screen</b></span>');
})();

/* ============ OFFLINE ============ */
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      if (!navigator.serviceWorker.controller) reg.addEventListener('updatefound', () => {
        const w = reg.installing; if (w) w.addEventListener('statechange', () => { if (w.state === 'activated') toast('PAX is saved for offline play'); });
      });
    }).catch(() => {});
  });
}
