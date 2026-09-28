/* Taloki — app logic: wallet, collection, pack opening flow. Loaded after data.js. */
const SELL_RATE = 0.9;

/* ============ STATE ============ */
const KEY = 'taloki-v1';
let S = {bal:50, col:{}, spent:0, earned:0, opened:0, best:null, filter:'all', added:50, history:[]};
try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s) S = Object.assign(S, s); } catch(e) {}
if (S.v !== 2) { for (let i = 101; i <= 110; i++) delete S.col[i]; if (S.best > 100 && S.best <= 110) S.best = null; if ('ML'.includes(S.filter)) S.filter = 'all'; S.v = 2; }
for (const id in S.col) if (!CARD[id]) delete S.col[id];
if (S.best && !CARD[S.best]) S.best = null;
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e) {} }

/* ============ HELPERS ============ */
const $ = s => document.querySelector(s);
const money = v => '$' + v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const rand = () => { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] / 4294967296; };
const pick = arr => arr[Math.floor(rand() * arr.length)];
function roll(table){ let x = rand(), acc = 0; for (const r of ORDER) { if (!table[r]) continue; acc += table[r]; if (x < acc) return r; } return ORDER.filter(r => table[r]).pop(); }
function avg(r){ return BY[r].reduce((a,c) => a + c.value, 0) / BY[r].length; }
function sellPrice(c){ return Math.round(c.value * SELL_RATE * 100) / 100; }
function toast(t){ const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 1800); }

function cardHTML(c, qty){
  if (c.slab) { const [l,t,w,h] = c.slab.box;
    return `<div class="card r${c.r} full" style="aspect-ratio:${(w*c.slab.ar/h).toFixed(4)}">${qty > 1 ? `<span class="qty">×${qty}</span>` : ''}<img src="${c.slab.src}" alt="${c.name}" style="position:absolute;width:${(100/w).toFixed(3)}%;height:${(100/h).toFixed(3)}%;left:${(-l/w*100).toFixed(3)}%;top:${(-t/h*100).toFixed(3)}%;max-width:none"></div>`; }
  const art = CARD_ART[c.id] ? `<img src="${CARD_ART[c.id]}" alt="">` : `<span class="glyph">${c.el.icon}</span>`;
  return `<div class="card r${c.r}" style="--a:${c.el.a};--b:${c.el.b}">
    ${qty > 1 ? `<span class="qty">×${qty}</span>` : ''}
    <div class="in">
      <div class="hd"><span>${c.name}</span><span>${c.el.icon}</span></div>
      <div class="art">${art}</div>
      <div class="ft"><span class="r">${RAR[c.r].name}</span><span>#${c.num}</span></div>
    </div></div>`;
}
const graded = c => !!(c.slab && !c.slab.raw);
function slabHTML(c){ return `<img class="slabImg" src="${c.slab.src}" alt="${c.name}, graded ${GRADE[c.grade]}">`; }
function packHTML(p){ return `<div class="pack" style="--pk:${p.pk};--glow:${p.glow}"><div class="tearTop"></div><span class="ptint"></span><span class="gem">$${p.price}</span><span class="pname"><b>${p.name}</b><small>Astral Beasts</small></span></div>`; }
/* ---- pack engine (per volatility style, optional Gold Boost) ---- */
const vol = () => S.vol === 'high' ? 'high' : 'normal';
const conf = (p, m, b) => b ? p[m].boost : p[m];            // Gold Boost swaps in its own odds
const cost = (p, b) => p.price * (b ? 2 : 1);
const POOLS = {};
function band(p, m, i, b){   // big packs set their own dollar ranges; the rest scale with price
  if (b && i === 5 && p[m].boost.goldLo) return [p[m].boost.goldLo, Infinity];
  if (p[m].bands) return p[m].bands[i];
  const [lo, hi] = MODES[m].bands[i]; return [lo * p.price, hi * p.price]; }
function bandPool(p, m, i, b){
  const k = p.id + m + i + (b && i === 5 ? 'B' : '');
  if (!POOLS[k]) { const [lo, hi] = band(p, m, i, b); POOLS[k] = CARDS.filter(c => (p[m].all || !'APX'.includes(c.r)) && c.value >= lo && c.value < hi); }
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
/* chance a pull is worth at least what you paid, and chance of an Ascended or better */
function shareOf(p, m, b, test){
  const c = conf(p, m, b); let q = 0;
  c.odds.forEach((o, i) => { const w = poolWeights(p, m, b, i), t = w.reduce((a,[,x]) => a + x, 0);
    q += (i === 5 ? o - jackpotTotal(p, m, b) : o) * w.filter(([x]) => test(x)).reduce((a,[,x]) => a + x, 0) / t; });
  return q;
}
function chaseChance(p, m = vol(), b = false){ return jackpotTotal(p, m, b) + (p[m].all ? shareOf(p, m, b, x => 'APX'.includes(x.r)) : 0); }
function profitChance(p, m = vol(), b = false){ const k = cost(p, b); return jackpotTotal(p, m, b) + shareOf(p, m, b, x => x.value >= k); }
function packStats(p, m = vol(), b = false){
  let ev = 0; const c = conf(p, m, b);
  c.odds.forEach((q, i) => { ev += (i === 5 ? q - jackpotTotal(p, m, b) : q) * bandMean(p, m, i, b); });
  for (const r of ['A','P','X']) ev += c.jackpot[r] * avg(r);
  return {ev, profit: profitChance(p, m, b), jp: jackpotTotal(p, m, b), gold: c.odds[5]};
}
function pullFrom(p, m = vol(), b = false){
  const c = conf(p, m, b); let x = rand(), i = 0, acc = 0;
  for (; i < 5; i++) { acc += c.odds[i]; if (x < acc) break; }
  if (i === 5) { let y = rand() * c.odds[5];
    for (const r of ['X','P','A']) { if (y < c.jackpot[r]) return {band:5, card:pick(BY[r]), jackpot:true}; y -= c.jackpot[r]; } }
  return {band:i, card: i === 5 ? pickGold(bandPool(p, m, 5, b), c.skew) : pick(bandPool(p, m, i))};
}
const MAX_PULL = () => Math.max(...CARDS.map(c => c.value));
const pct = x => x >= 1 ? '100%' : x === 0 ? '—' : x >= .1 ? (x*100).toFixed(0)+'%' : x >= .01 ? (x*100).toFixed(1)+'%' : x >= .001 ? (x*100).toFixed(2)+'%' : +(x*100).toPrecision(2)+'%';
const oneIn = x => x <= 0 ? '' : x >= .5 ? '' : `1 in ${Math.round(1/x).toLocaleString('en-US')}`;

/* ============ RENDER ============ */
function renderBal(){ $('#bal').textContent = money(S.bal); document.querySelectorAll('.buy[data-p]').forEach(b => b.disabled = S.bal < PACKS.find(p => p.id === b.dataset.p).price); }

function volToggle(){
  return `<div class="volT"><div class="volHead"><span>Pack style</span>
    <div class="seg">${Object.entries(MODES).map(([k, v]) => `<button data-vol="${k}" class="${k === vol() ? 'on' : ''}">${v.name}</button>`).join('')}</div></div>
    <p class="volDesc">${MODES[vol()].desc}</p></div>`;
}
function renderVol(){
  ['#volPacks', '#volOdds'].forEach(sel => { const el = $(sel); if (el) el.innerHTML = volToggle(); });
  document.querySelectorAll('[data-vol]').forEach(b => b.onclick = () => { S.vol = b.dataset.vol; save(); renderPacks(); renderOdds(); });
}
function renderPacks(){
  renderVol();
  const m = vol();
  $('#packList').innerHTML = PACKS.map(p => {
    const st = packStats(p, m), bs = packStats(p, m, true);
    return `<article class="packTile">
      <div class="ptArt">${packHTML(p)}</div>
      <div class="packInfo">
        <div class="ptHead"><b class="pt">${p.name}</b><span class="ptPrice">${money(p.price)}</span></div>
        <dl class="ptStats">
          <div><dt>Avg value</dt><dd>${money(st.ev)}</dd></div>
          <div><dt>Profit</dt><dd>${Math.round(st.profit * 100)}%</dd></div>
          <div><dt>Gold</dt><dd>${(st.gold * 100).toFixed(st.gold < 0.1 ? 1 : 0)}%</dd></div>
          <div><dt>Ascended+</dt><dd>${oneIn(chaseChance(p, m)) || Math.round(chaseChance(p, m) * 100) + '%'}</dd></div>
        </dl>
        <div class="ptBtns">
          <button class="buy" data-p="${p.id}"><span>Open pack</span><small>$${p.price.toLocaleString("en-US")}</small></button>
          <button class="boostBtn" data-pb="${p.id}" title="Gold Boost: pay 2x, Gold becomes 25% of pulls"><span>Gold Boost</span><small>$${(p.price * 2).toLocaleString("en-US")} · ${Math.round(bs.gold * 100)}% Gold</small></button>
        </div>
      </div></article>`;
  }).join('');
  document.querySelectorAll('.buy[data-p]').forEach(b => b.onclick = () => openPack(b.dataset.p, false));
  document.querySelectorAll('.boostBtn[data-pb]').forEach(b => b.onclick = () => openPack(b.dataset.pb, true));
  renderBal();
}

function bandBars(p, m, b){
  const odds = conf(p, m, b).odds, top = Math.max(...odds);
  return odds.map((q, i) => `<div class="bandRow"><span class="bl">${bandRange(p, m, i, b)}</span>
    <span class="bb"><i style="width:${Math.max(q/top*100, 1.5)}%;--c:${TIERS[i].rgb}"></i></span><span class="bp">${(q*100).toFixed(1)}%</span></div>`).join('');
}
function renderOdds(){
  renderVol();
  const maxPull = MAX_PULL(), m = vol(), b = !!S.oddsBoost;
  $('#oddsBoost').innerHTML = `<div class="seg"><button data-ob="0" class="${b ? '' : 'on'}">Standard</button><button data-ob="1" class="${b ? 'on' : ''}">Gold Boost</button></div>
    <p class="volDesc">${b ? 'Gold Boost costs 2x the pack price and makes Gold 25% of pulls.' : 'Regular odds at the listed pack price.'}</p>`;
  document.querySelectorAll('[data-ob]').forEach(x => x.onclick = () => { S.oddsBoost = x.dataset.ob === '1'; save(); renderOdds(); });
  $('#oddsList').innerHTML = PACKS.map(p => {
    const st = packStats(p, m, b), j = conf(p, m, b).jackpot, k = cost(p, b);
    return `<div class="oddsCard"><header><b>${p.name}</b><span class="meta">${money(k)}${b ? ' (Gold Boost)' : ''} · 1 card · avg value ${money(st.ev)} (${Math.round(st.ev/k*100)}%)</span></header>
    <div class="bands">${bandBars(p, m, b)}</div>
    <p class="meta">Min value <strong>${money(band(p, m, 0)[0])}</strong> · Max pull <strong>${money(maxPull)}</strong><br>
    ${p[m].all ? `Ascended, Apex and Mythic Legend cards sit in the upper tiers of this pack. Chance of one: ${oneIn(chaseChance(p, m, b)) || Math.round(chaseChance(p, m, b) * 100) + '%'}.`
      : `Gold includes a jackpot: Ascended ${oneIn(j.A)}, Apex ${oneIn(j.P)}, Mythic Legend ${oneIn(j.X)}.`}</p></div>`;
  }).join('');
  $('#valTable').innerHTML = `<tr><th>Rarity</th><th>Cards in set</th><th>Value range</th></tr>` +
    ORDER.map(r => `<tr><td><span class="dot" style="background:var(--${r})"></span>${RAR[r].name}</td><td>${RAR[r].count}</td><td>${money(Math.min(...BY[r].map(c => c.value)))} – ${money(Math.max(...BY[r].map(c => c.value)))}</td></tr>`).join('') +
    ['X','P','A'].map(r => `<tr><th>${RAR[r].name}</th><th>Grade</th><th>Value</th></tr>` + BY[r].map(c => `<tr><td>#${c.num} ${c.name}</td><td>${c.grade || 'Raw'}</td><td>${money(c.value)}</td></tr>`).join('')).join('');
}

function colValue(){ return Object.entries(S.col).reduce((a,[id,q]) => a + CARD[id].value * q, 0); }
/* ---- evolution lines: Stage 1 → 2 → 3 → 4 ---- */
function evoLines(){
  const find = f => CARDS.find(f);
  const lines = [];
  BY.A.filter(a => a.stage === 3).forEach(a => {
    const s2 = find(c => c.stage === 2 && c.name === a.from);
    const s1 = find(c => c.stage === 1 && c.into === a.from);
    const s4 = find(c => c.stage === 4 && c.name === a.into);
    lines.push([{c: s1, name: s1 ? s1.name : (s2 && s2.from) || 'Unknown'}, {c: s2, name: a.from}, {c: a, name: a.name}, {c: s4, name: a.into}]);
  });
  // Stage 4 cards whose earlier stages aren't in the set yet
  CARDS.filter(c => c.stage === 4 && !BY.A.some(a => a.into === c.name))
    .forEach(c => lines.push([{name: 'Unknown'}, {name: 'Unknown'}, {name: c.from}, {c, name: c.name}]));
  return lines;
}
function renderEvo(){
  const lines = evoLines().map(l => ({l, have: l.filter(s => s.c && S.col[s.c.id] > 0).length}));
  lines.sort((a, b) => b.have - a.have);
  const done = lines.filter(x => x.have === 4).length;
  $('#evoSum').textContent = `${done} of ${lines.length} lines complete. Own all four stages of a creature to complete its line.`;
  $('#evoList').innerHTML = lines.map(({l, have}) => `<div class="evoLine${have === 4 ? ' done' : ''}">
    <div class="evoHead"><b>${l[3].name} line</b><span>${have === 4 ? '✓ Complete' : have + ' / 4'}</span></div>
    <div class="evoRow">${l.map((s, i) => `${i ? '<i class="evoArrow">›</i>' : ''}<div class="evoSlot">
      ${s.c && S.col[s.c.id] > 0 ? `<div class="evoCard" data-id="${s.c.id}">${cardHTML(s.c)}</div>`
        : s.c ? `<div class="card locked"><div class="in">#${s.c.num}</div></div>`
        : `<div class="evoMissing">Not in the set yet</div>`}
      <span class="evoName">Stage ${i + 1}<br><b>${s.name}</b></span></div>`).join('')}</div></div>`).join('');
  document.querySelectorAll('#evoList .evoCard').forEach(el => el.onclick = () => showCard(+el.dataset.id));
}
function setColView(v){
  S.colView = v; save();
  document.querySelectorAll('#colSeg button').forEach(b => b.classList.toggle('on', b.dataset.cv === v));
  $('#cvCards').hidden = v !== 'cards'; $('#cvEvo').hidden = v !== 'evo';
  if (v === 'evo') renderEvo();
}
document.querySelectorAll('#colSeg button').forEach(b => b.onclick = () => setColView(b.dataset.cv));

function renderCol(){
  if (S.colView === 'evo') { setColView('evo'); }
  const owned = Object.keys(S.col).filter(id => S.col[id] > 0).length;
  $('#colStats').innerHTML = `
    <div class="stat"><b>${owned}/${CARDS.length}</b><span>Set complete</span><div class="bar"><i style="width:${owned/CARDS.length*100}%"></i></div></div>
    <div class="stat"><b>${money(colValue())}</b><span>Collection value</span></div>
    <div class="stat"><b>${S.opened}</b><span>Packs ripped</span></div>
    <div class="stat"><b>${S.best ? CARD[S.best].name : '—'}</b><span>Best pull${S.best ? ' · ' + money(CARD[S.best].value) : ''}</span></div>`;
  const filters = [['all','All'],['owned','Owned'],...ORDER.map(r => [r, RAR[r].name])];
  $('#chips').innerHTML = filters.map(([k,l]) => `<button class="chip ${S.filter===k?'on':''}" data-f="${k}">${l}</button>`).join('');
  document.querySelectorAll('.chip').forEach(b => b.onclick = () => { S.filter = b.dataset.f; save(); renderCol(); });
  let list = CARDS.slice();
  if (S.filter === 'owned') list = list.filter(c => S.col[c.id] > 0);
  else if (S.filter !== 'all') list = list.filter(c => c.r === S.filter);
  list.sort((a,b) => b.value - a.value);
  $('#colGrid').innerHTML = list.length ? list.map(c => S.col[c.id] > 0
    ? `<div data-id="${c.id}" tabindex="0" role="button" aria-label="${c.name}">${cardHTML(c, S.col[c.id])}</div>`
    : `<div class="card locked"><div class="in">#${c.num}</div></div>`).join('')
    : `<div class="empty">No cards here yet. Rip a pack to start your collection.</div>`;
  document.querySelectorAll('#colGrid [data-id]').forEach(el => { el.onclick = () => showCard(+el.dataset.id); el.onkeydown = e => { if (e.key === 'Enter') showCard(+el.dataset.id); }; });
}

function showCard(id){
  const c = CARD[id], q = S.col[id] || 0;
  $('#sheet').innerHTML = `${card3dHTML(c)}<div class="meta tiny">Drag to tilt · tap to flip</div><h3>${c.name}</h3>
    <div class="meta">${RAR[c.r].name} · ${c.el.name} · #${c.num}${c.grade ? ' · ' + GRADE[c.grade] : ''}${c.basic ? '<br>Basic creature' : ''}${c.stage ? `<br>Stage ${c.stage}${c.from ? ' · evolves from ' + c.from : ''}${c.into ? ' · into ' + c.into : ''}` : ''}<br>Value <strong>${money(c.value)}</strong> · You own ${q}</div>
    <div class="actions" style="justify-content:center">
      ${q ? `<button class="buy" id="sell1" style="width:auto">Sell 1 for ${money(sellPrice(c))}</button>` : ''}
      <button class="ghost" id="closeM">Close</button></div>`;
  $('#modal').classList.add('on');
  attach3d($('#sheet .v3d'));
  $('#closeM').onclick = closeModal;
  if (q) $('#sell1').onclick = () => { sell([[id,1]]); closeModal(); };
}
function closeModal(){ $('#modal').classList.remove('on'); }
$('#modal').onclick = e => { if (e.target.id === 'modal') closeModal(); };

function sell(pairs){
  let total = 0, n = 0;
  for (const [id,q] of pairs) { const have = S.col[id] || 0, k = Math.min(q, have); if (!k) continue; S.col[id] = have - k; if (!S.col[id]) delete S.col[id]; total += sellPrice(CARD[id]) * k; n += k; }
  total = Math.round(total * 100) / 100;
  if (!n) { toast('Nothing to sell'); return 0; }
  S.bal = Math.round((S.bal + total) * 100) / 100; S.earned += total; save(); renderBal(); renderCol(); renderProfile();
  toast(`Sold ${n} card${n>1?'s':''} for ${money(total)}`);
  return total;
}
$('#sellCommons').onclick = () => sell(Object.entries(S.col).filter(([id]) => 'CU'.includes(CARD[id].r)).map(([id,q]) => [+id,q]));
$('#sellDupes').onclick = () => sell(Object.entries(S.col).filter(([,q]) => q > 1).map(([id,q]) => [+id,q-1]));

/* ============ PACK OPENING ============ */
const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
let cur = null, lastPack = null, lastBoost = false;   // cur = {p, m, boost, band, card, jackpot}
const wait = ms => new Promise(r => setTimeout(r, RM() ? Math.min(ms, 150) : ms));

function openPack(pid, boost = false){
  const p = PACKS.find(x => x.id === pid), k = cost(p, boost);
  if (S.bal < k) { toast('Not enough funds. Tap + to add play money.'); return; }
  lastPack = pid; lastBoost = boost;
  S.bal = Math.round((S.bal - k) * 100) / 100; S.spent = Math.round((S.spent + k) * 100) / 100; S.opened++;
  const m = vol();
  cur = Object.assign({p, m, boost}, pullFrom(p, m, boost));
  const c = cur.card;
  S.col[c.id] = (S.col[c.id] || 0) + 1; if (!S.best || c.value > CARD[S.best].value) S.best = c.id;
  S.history = [{t: Date.now(), p: p.id, c: c.id, b: cur.band, m, g: boost ? 1 : 0}, ...(S.history || [])].slice(0, 300);
  save(); renderBal();
  document.body.style.overflow = 'hidden';
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
  const glow = cur.jackpot ? ' gold' : cur.band >= 4 ? ' fire' : cur.band >= 2 ? ' teal' : '';
  SB().innerHTML = `<div class="hint">Swipe across the top to cut it open</div>
    <div class="bigpack seam${glow}" id="bp" tabindex="0" role="button" aria-label="Cut the pack open: swipe across the top, or press Enter">${packHTML(cur.p)}<i class="streak"></i>
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
  const face = cls => `<div class="mf${cls}"><span class="mEye"><img src="images/brand/eye.webp" alt=""></span></div>`;
  return `<div class="myst" id="myst" style="--tc:${rgb}"><div class="mIn" id="mIn">${face('')}${face(' mb')}</div></div>`;
}
function showSpin(){
  const band = cur.band, seq = [0, 0, 0, 0];
  for (let t = 1; t <= band; t++) seq.push(t);          // climbs one tier per half-turn
  if (band === 0) seq.push(0, 0);
  if (cur.jackpot) seq.push(5, 5, 'J');                  // jackpot: extra spins, then rainbow
  const N = seq.length - 1;
  SB().innerHTML = `<button class="skip" id="skip">Skip</button>
    <div class="spinBox">${mysteryHTML(tierRGB(0))}</div>
    <div class="tierLbl" id="tl"><b>${TIERS[0].name}</b></div>
    <div class="hint hintSm" id="spd">Tap to speed up</div>`;
  const myst = $('#myst'), mIn = $('#mIn'), tl = $('#tl');
  let speed = 1, t = 0, last = performance.now(), k = 0, done = false;
  const T = RM() ? 0.2 : Math.max(2.4, 0.55 * N) * (cur.jackpot ? 1.35 : 1);
  const setTier = x => {
    if (x === 'J') { myst.classList.add('rainbow'); tl.innerHTML = '<b class="jp">JACKPOT</b><small>A chase card is inside</small>'; sparks('255,215,60', 40, myst, 220); return; }
    myst.style.setProperty('--tc', tierRGB(x));
    tl.innerHTML = `<b style="color:rgb(${tierRGB(x)})">${TIERS[x].name}</b>`;
    if (x > 0) sparks(tierRGB(x), 14 + x * 4, myst, 150);
  };
  const land = () => { if (done) return; done = true;
    mIn.style.transform = 'rotateX(8deg) rotateY(0deg)';
    const fin = seq[N]; if (fin !== 'J') setTier(fin); else setTier('J');
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
function faceAR(c){ return c.slab ? c.slab.ar : 5/7; }
function frontHTML(c){ return graded(c) ? `<img class="slabImg" src="${c.slab.src}" alt="${c.name}">` : cardHTML(c); }
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
    <div class="peelWrap" id="pw" style="--ar:${faceAR(c)};--tc:${rgb}">
      <div class="pfront" id="pfr">${frontHTML(c)}</div>
      <div class="pcover mf${cur.jackpot ? ' rainbowBg' : ''}" id="pc"><span class="mEye"><img src="images/brand/eye.webp" alt=""></span></div>
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
    $('#pulled').innerHTML = `<span class="bigVal">${money(c.value)}</span>${c.name}<small>${RAR[c.r].name}${c.grade ? ' · ' + GRADE[c.grade] : ''}</small>`;
    $('#pulled').classList.toggle('x', c.r === 'X'); $('#pulled').classList.toggle('a', c.r === 'A'); $('#pulled').classList.toggle('p', c.r === 'P');
    $('#ph').textContent = 'Tap to continue';
    setTimeout(() => { SB().onclick = showResults; }, 350);
  }
}

/* ---- 3D card viewer: drag to tilt, tap to flip and see the back ---- */
function card3dHTML(c){
  const back = graded(c) ? 'images/brand/back-graded.webp' : 'images/brand/back.webp';
  return `<div class="v3d${graded(c) ? ' isSlab' : ''}" style="--ar:${faceAR(c)}"><div class="v3dIn">
    <div class="f3 front3">${frontHTML(c)}<i class="glare"></i></div>
    <div class="f3 back3"><img src="${back}" alt="Card back"></div></div><i class="shadow3"></i></div>`;
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
    <div class="resName">${c.name} #${c.num}</div>
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
function closeStage(){ const st = $('#stage'); st.className = 'stage'; st.innerHTML = ''; document.body.style.overflow = ''; renderCol(); renderBal(); renderProfile(); }

/* ============ NAV + INIT ============ */
document.querySelectorAll('.nav button').forEach(b => b.onclick = () => {
  document.querySelectorAll('.nav button').forEach(x => x.classList.toggle('on', x === b));
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('on', v.id === 'v-' + b.dataset.v));
  if (b.dataset.v === 'col') renderCol();
  if (b.dataset.v === 'me') renderProfile();
  scrollTo(0,0);
});
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

/* ---- profile / history ---- */
function renderProfile(){
  const el = $('#profile'); if (!el) return;
  const best = S.best && CARD[S.best], hist = S.history || [];
  el.innerHTML = `
    <div class="statrow">
      <div class="stat"><b>${money(S.bal)}</b><span>Balance</span></div>
      <div class="stat"><b>${money(S.added || 0)}</b><span>Money added</span></div>
      <div class="stat"><b>${money(S.spent || 0)}</b><span>Spent on packs</span></div>
      <div class="stat"><b>${money(S.earned || 0)}</b><span>Earned from selling</span></div>
      <div class="stat"><b>${money(colValue())}</b><span>Collection value</span></div>
      <div class="stat"><b>${(S.opened || 0).toLocaleString('en-US')}</b><span>Packs opened</span></div>
    </div>
    <h2>Best pull</h2>
    ${best ? `<div class="bestPull" data-id="${best.id}"><div class="bpCard">${cardHTML(best)}</div>
      <div><b>${best.name}</b><div class="meta">${RAR[best.r].name} · #${best.num}</div><div class="bpVal">${money(best.value)}</div></div></div>`
      : `<div class="empty">No pulls yet. Rip a pack!</div>`}
    <div class="actions"><button class="buy" id="profAdd" style="width:auto">Add money</button></div>
    <h2>Pull history</h2>
    ${hist.length ? `<div class="histList">${hist.slice(0, 100).map(h => { const c = CARD[h.c], p = PACKS.find(x => x.id === h.p); if (!c) return '';
      return `<div class="histRow" data-id="${c.id}"><i class="hdot" style="--c:${TIERS[h.b] ? TIERS[h.b].rgb : '154,163,178'}"></i>
        <div class="hMain"><b>${c.name}</b><span>${p ? p.name : 'Pack'}${h.m === 'high' ? ' · High' : ''}${h.g ? ' · Boost' : ''} · ${new Date(h.t).toLocaleString([], {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'})}</span></div>
        <b class="hVal">${money(c.value)}</b></div>`; }).join('')}</div>` : `<div class="empty">Your pulls will show up here.</div>`}
    <h2>Settings</h2>
    <div class="actions"><button class="ghost" id="resetAll">Reset balance, collection and history</button></div>`;
  $('#profAdd').onclick = openAddMoney;
  document.querySelectorAll('#profile [data-id]').forEach(r => r.onclick = () => { if (S.col[r.dataset.id]) showCard(+r.dataset.id); });
  $('#resetAll').onclick = () => { if (!confirm('Reset everything? Your balance goes back to $50 and your collection and history are cleared.')) return;
    S = {bal:50, col:{}, spent:0, earned:0, opened:0, best:null, filter:'all', added:50, history:[], vol:S.vol, hideInstall:S.hideInstall};
    save(); renderPacks(); renderOdds(); renderCol(); renderProfile(); toast('Everything was reset'); };
}
renderPacks(); renderOdds(); renderCol(); renderProfile();

/* ============ FULL-SCREEN / INSTALL ============ */
(function(){
  const standalone = matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches || navigator.standalone;
  if (standalone) { document.documentElement.classList.add('standalone'); return; }
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const bar = $('#installBar');
  const show = html => { if (S.hideInstall) return; bar.innerHTML = html + '<button class="ibClose" aria-label="Dismiss">✕</button>'; bar.hidden = false;
    bar.querySelector('.ibClose').onclick = () => { bar.hidden = true; S.hideInstall = true; save(); }; };
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault();
    show('<span>Install Taloki to play full screen</span><button class="ibGo">Install</button>');
    const go = bar.querySelector('.ibGo'); if (go) go.onclick = async () => { e.prompt(); await e.userChoice; bar.hidden = true; }; });
  if (ios) show('<span>For full screen: tap <b>Share</b> then <b>Add to Home Screen</b></span>');
})();

/* ============ OFFLINE ============ */
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      if (!navigator.serviceWorker.controller) reg.addEventListener('updatefound', () => {
        const w = reg.installing; if (w) w.addEventListener('statechange', () => { if (w.state === 'activated') toast('Taloki is saved for offline play'); });
      });
    }).catch(() => {});
  });
}
