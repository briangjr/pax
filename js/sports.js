/* PAX — NFL and NBA sets. Loaded after data.js.
   Each sports set has 136 cards. They reuse Taloki's card values tier by tier, so every pack
   has exactly the same odds and the same 92% average return as the matching Taloki pack.

   ============ ADD YOUR ART HERE ============
   Pack cover art: put an image in images/nfl/packs/ or images/nba/packs/ and add its path to
   the pack's `cover` below (for example cover:'images/nfl/packs/rookie.webp').
   Player photos: add  'Player Name': 'images/nfl/players/player-name.webp'  to NFL_ART / NBA_ART.
   Every card of that player then uses the photo. Cards without art use the built-in design. */
const NFL_ART = {};
const NBA_ART = {};

const TEAMS = {
  nfl: {
    ARI:['#97233F','#FFB612'], ATL:['#A71930','#101820'], BAL:['#241773','#9E7C0C'], BUF:['#00338D','#C60C30'],
    CAR:['#0085CA','#101820'], CHI:['#0B162A','#C83803'], CIN:['#FB4F14','#101820'], CLE:['#311D00','#FF3C00'],
    DAL:['#003594','#869397'], DEN:['#FB4F14','#002244'], DET:['#0076B6','#B0B7BC'], GB:['#203731','#FFB612'],
    HOU:['#03202F','#A71930'], IND:['#002C5F','#A2AAAD'], JAX:['#006778','#D7A22A'], KC:['#E31837','#FFB81C'],
    LV:['#101820','#A5ACAF'], LAC:['#0080C6','#FFC20E'], LAR:['#003594','#FFA300'], MIA:['#008E97','#FC4C02'],
    MIN:['#4F2683','#FFC62F'], NE:['#002244','#C60C30'], NO:['#101820','#D3BC8D'], NYG:['#0B2265','#A71930'],
    NYJ:['#125740','#E8E8E8'], PHI:['#004C54','#A5ACAF'], PIT:['#101820','#FFB612'], SF:['#AA0000','#B3995D'],
    SEA:['#002244','#69BE28'], TB:['#D50A0A','#34302B'], TEN:['#0C2340','#4B92DB'], WAS:['#5A1414','#FFB612']
  },
  nba: {
    ATL:['#C8102E','#FDB927'], BOS:['#007A33','#BA9653'], BKN:['#101010','#E8E8E8'], CHA:['#1D1160','#00788C'],
    CHI:['#CE1141','#101010'], CLE:['#860038','#FDBB30'], DAL:['#00538C','#B8C4CA'], DEN:['#0E2240','#FEC524'],
    DET:['#C8102E','#1D42BA'], GSW:['#1D428A','#FFC72C'], HOU:['#CE1141','#101010'], IND:['#002D62','#FDBB30'],
    LAC:['#C8102E','#1D428A'], LAL:['#552583','#FDB927'], MEM:['#5D76A9','#12173F'], MIA:['#98002E','#F9A01B'],
    MIL:['#00471B','#EEE1C6'], MIN:['#0C2340','#78BE20'], NOP:['#0C2340','#C8102E'], NYK:['#006BB6','#F58426'],
    OKC:['#007AC1','#EF3B24'], ORL:['#0077C0','#C4CED4'], PHI:['#006BB6','#ED174C'], PHX:['#1D1160','#E56020'],
    POR:['#E03A3E','#101010'], SAC:['#5A2D81','#63727A'], SAS:['#101010','#C4CED4'], TOR:['#CE1141','#101010'],
    UTA:['#3E2680','#101010'], WAS:['#002B5C','#E31837']
  }
};

/* Players in order of chase value. [name, position, team, rookie]
   The first 10 headline the One of One tier, the next 11 Patch Autos, the next 25 Autos, the last 10 Gold. */
const NFL_PLAYERS = [
  // One of One
  ['Patrick Mahomes','QB','KC'], ['Josh Allen','QB','BUF'], ['Lamar Jackson','QB','BAL'], ['Joe Burrow','QB','CIN'],
  ['Jayden Daniels','QB','WAS'], ["Ja'Marr Chase",'WR','CIN'], ['Justin Jefferson','WR','MIN'], ['Saquon Barkley','RB','PHI'],
  ['Fernando Mendoza','QB','LV',1], ['Drake Maye','QB','NE'],
  // Patch Auto
  ['Caleb Williams','QB','CHI'], ['C.J. Stroud','QB','HOU'], ['Jalen Hurts','QB','PHI'], ['Puka Nacua','WR','LAR'],
  ['CeeDee Lamb','WR','DAL'], ['Bijan Robinson','RB','ATL'], ['Jahmyr Gibbs','RB','DET'], ['Brock Bowers','TE','LV'],
  ['Micah Parsons','EDGE','GB'], ['Malik Nabers','WR','NYG'], ['Jeremiyah Love','RB','ARI',1],
  // Auto
  ['Ashton Jeanty','RB','LV'], ['Travis Hunter','WR','JAX'], ['Cam Ward','QB','TEN'], ['Marvin Harrison Jr.','WR','ARI'],
  ['Brian Thomas Jr.','WR','JAX'], ['Jaxon Smith-Njigba','WR','SEA'], ['Amon-Ra St. Brown','WR','DET'], ['Christian McCaffrey','RB','SF'],
  ['Justin Herbert','QB','LAC'], ['Bo Nix','QB','DEN'], ['Brock Purdy','QB','SF'], ['Jordan Love','QB','GB'],
  ['Myles Garrett','EDGE','LAR'], ['T.J. Watt','EDGE','PIT'], ['Aidan Hutchinson','EDGE','DET'], ['Derrick Henry','RB','BAL'],
  ['Trey McBride','TE','ARI'], ['A.J. Brown','WR','NE'], ['Nico Collins','WR','HOU'], ['Ladd McConkey','WR','LAC'],
  ['Carnell Tate','WR','TEN',1], ['Abdul Carter','EDGE','NYG'], ['Tetairoa McMillan','WR','CAR'], ['Shedeur Sanders','QB','CLE'],
  ["De'Von Achane",'RB','MIA'],
  // Gold
  ['Dak Prescott','QB','DAL'], ['Jared Goff','QB','DET'], ['Baker Mayfield','QB','TB'], ['Jonathan Taylor','RB','IND'],
  ['George Kittle','TE','SF'], ['Will Anderson Jr.','EDGE','HOU'], ['Kyle Hamilton','S','BAL'], ['Garrett Wilson','WR','NYJ'],
  ['Jaylen Waddle','WR','DEN'], ['Nick Bosa','EDGE','SF']
];
const NBA_PLAYERS = [
  // One of One
  ['Victor Wembanyama','C','SAS'], ['Shai Gilgeous-Alexander','PG','OKC'], ['Nikola Jokic','C','DEN'], ['Luka Doncic','PG','LAL'],
  ['Anthony Edwards','SG','MIN'], ['Cooper Flagg','F','DAL'], ['AJ Dybantsa','SF','WAS',1], ['Stephen Curry','PG','GSW'],
  ['LeBron James','F','PHI'], ['Giannis Antetokounmpo','F','MIA'],
  // Patch Auto
  ['Jayson Tatum','F','BOS'], ['Cade Cunningham','PG','DET'], ['Jalen Brunson','PG','NYK'], ['Donovan Mitchell','SG','CLE'],
  ['Tyrese Haliburton','PG','IND'], ['Darryn Peterson','G','UTA',1], ['Kevin Durant','F','HOU'], ['Ja Morant','PG','POR'],
  ['Jalen Williams','F','OKC'], ['Chet Holmgren','C','OKC'], ['Paolo Banchero','F','ORL'],
  // Auto
  ['Cameron Boozer','PF','MEM',1], ['Dylan Harper','G','SAS'], ['Jaylen Brown','G','PHI'], ['Devin Booker','SG','PHX'],
  ['Tyrese Maxey','PG','PHI'], ['Joel Embiid','C','PHI'], ['LaMelo Ball','PG','MIN'], ['Ace Bailey','F','UTA'],
  ['VJ Edgecombe','G','PHI'], ['Kon Knueppel','F','CHA'], ['Stephon Castle','G','SAS'], ['Amen Thompson','F','HOU'],
  ['Alperen Sengun','C','HOU'], ['Evan Mobley','F','CLE'], ['Scottie Barnes','F','TOR'], ['Franz Wagner','F','ORL'],
  ['Jalen Johnson','F','ATL'], ['Trae Young','PG','WAS'], ["De'Aaron Fox",'PG','SAS'], ['Kawhi Leonard','F','TOR'],
  ['Karl-Anthony Towns','C','NYK'], ['Bam Adebayo','C','MIA'], ['Jamal Murray','PG','DEN'], ['Zion Williamson','F','NOP'],
  ['Caleb Wilson','F','CHI',1],
  // Gold
  ['James Harden','G','CLE'], ['Austin Reaves','G','LAL'], ['Derrick White','G','BOS'], ['Pascal Siakam','F','IND'],
  ['Lauri Markkanen','F','UTA'], ['Desmond Bane','G','ORL'], ['Jimmy Butler','F','GSW'], ['Domantas Sabonis','C','SAC'],
  ['Zaccharie Risacher','F','ATL'], ['Keaton Wagler','G','LAC',1]
];

/* Card versions, cheapest to rarest. Same rarity letters as Taloki so the pack engine works unchanged. */
const SPORT_RAR = {
  X:{name:'One of One', count:10, run:1},
  P:{name:'Patch Auto', count:11, run:25},
  A:{name:'Auto',       count:25, run:99},
  E:{name:'Gold',       count:10, run:10},
  R:{name:'Holo',       count:15, run:199},
  U:{name:'Silver',     count:25},
  C:{name:'Base',       count:40}
};
const SPORT_GRADE = {10:'PAX 10 Gem Mint', 9:'PAX 9 Mint', 8:'PAX 8 NM-MT'};


/* ============ PHOTO CARDS (your uploaded art) ============
   Extra NFL cards drawn from your images in images/nfl/cards/. run = print run (0 = unnumbered short print).
   The printed number was removed from each image; ser = [center x %, center y %, digit height % of width, color]
   is where the game prints the live serial number instead. Lower print runs are much rarer (see RUN_WEIGHT). */
const NFL_PHOTO_CARDS = [
  {name:"Cam Ward", pos:'QB', team:'TEN', rc:1, r:'X', value:18750, run:1, vname:'Metal Auto', auto:1, patch:0, img:{"src": "images/nfl/cards/cam-ward-leaf-metal-auto-1of1.webp", "ar": 0.66667, "ser": [76.8, 61.0, 3.9, "goldDark"]}},
  {name:"Patrick Mahomes", pos:'QB', team:'KC', rc:1, r:'X', value:46500, run:5, vname:'Rookie Patch Auto', auto:1, patch:1, img:{"src": "images/nfl/cards/patrick-mahomes-rpa-5.webp", "ar": 0.66667, "ser": [76.61, 57.58, 4.6, "gold"]}},
  {name:"Tom Brady", pos:'QB', team:'NE', rc:0, r:'X', value:39000, run:5, vname:'Patch Auto', auto:1, patch:1, img:{"src": "images/nfl/cards/tom-brady-patch-auto-5.webp", "ar": 0.66667, "ser": [19.4, 21.4, 2.8, "gold"]}},
  {name:"Jahmyr Gibbs", pos:'RB', team:'DET', rc:0, r:'P', value:8900, run:5, vname:'Patch Auto', auto:1, patch:1, img:{"src": "images/nfl/cards/jahmyr-gibbs-patch-auto-5.webp", "ar": 0.66667, "ser": [21.29, 20.48, 2.6, "gold"]}},
  {name:"Ja'Marr Chase", pos:'WR', team:'CIN', rc:1, r:'P', value:4850, run:25, vname:'Origins Auto', auto:1, patch:0, img:{"src": "images/nfl/cards/jamarr-chase-origins-auto-25.webp", "ar": 0.66667, "ser": [84.47, 74.64, 3.0, "goldDark"]}},
  {name:"Justin Jefferson", pos:'WR', team:'MIN', rc:1, r:'A', value:2150, run:50, vname:'Prizm Gold', auto:0, patch:0, img:{"src": "images/nfl/cards/justin-jefferson-prizm-gold-50.webp", "ar": 0.66667, "ser": [73.19, 74.5, 3.9, "gold"]}},
  {name:"Cam Ward", pos:'QB', team:'TEN', rc:1, r:'A', value:1180, run:50, vname:'Chrome Gold', auto:0, patch:0, img:{"src": "images/nfl/cards/cam-ward-chrome-gold-50.webp", "ar": 0.66667, "ser": [79.3, 75.5, 4.4, "gold"]}},
  {name:"Cam Ward", pos:'QB', team:'TEN', rc:1, r:'A', value:890, run:0, vname:'Downtown', auto:0, patch:0, img:{"src": "images/nfl/cards/cam-ward-downtown.webp", "ar": 0.66667}},
  {name:"Matthew Stafford", pos:'QB', team:'LAR', rc:0, r:'A', value:640, run:25, vname:'Prestige', auto:0, patch:0, img:{"src": "images/nfl/cards/matthew-stafford-prestige-25.webp", "ar": 0.66667, "ser": [81.01, 23.89, 4.4, "goldDark"]}},
  {name:"Cam Ward", pos:'QB', team:'TEN', rc:1, r:'E', value:64.5, run:299, vname:'Donruss', auto:0, patch:0, img:{"src": "images/nfl/cards/cam-ward-donruss-299.webp", "ar": 0.66667, "ser": [79.6, 74.5, 4.7, "dark"]}}
];
/* how often a card shows up compared with other cards in its tier: lower print run = rarer */
const RUN_WEIGHT = run => run === 1 ? 0.01 : run <= 5 ? 0.15 : run <= 25 ? 0.4 : run <= 50 ? 0.6 : run === 0 ? 0.5 : 1;

function buildSportSet(id, cfg){
  const RAR = JSON.parse(JSON.stringify(SPORT_RAR));
  const BY = {C:[],U:[],R:[],E:[],A:[],P:[],X:[]}, CARDS = [];
  const P = cfg.players.map(([name, pos, team, rc], rank) => ({name, pos, team, rc:!!rc, rank, c:TEAMS[id][team] || ['#333','#999']}));
  // which players appear in each version
  const who = {X:P.slice(0,10), P:P.slice(10,21), A:P.slice(21,46), E:P.slice(46,56), R:P.slice(0,15), U:P.slice(0,25), C:P.slice(16,56)};
  let seed = id === 'nfl' ? 7 : 13; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  let n = 0, cid = 0;
  for (const r of ['X','P','A','E','R','U','C']) {
    // borrow Taloki's values (and grades) in the same order, highest first
    const src = SETS.taloki.BY[r].slice().sort((a, b) => b.value - a.value);
    who[r].forEach((pl, i) => {
      const s = src[i], run = RAR[r].run;
      const c = {id: ++cid, n: ++n, set:id, r, name: pl.name, pos: pl.pos, team: pl.team, tc: pl.c, rc: pl.rc, rank: pl.rank,
        value: s.value, sport: cfg.sport, art: cfg.art[pl.name] || null,
        auto: 'APX'.includes(r), patch: 'PX'.includes(r), vname: RAR[r].name,
        el:{name: pl.team, icon:''}};
      if (s.grade && (s.slab ? !s.slab.raw : true)) c.grade = s.grade;
      if (run) c.run = run;               // numbered: each copy gets its own serial when pulled
      CARDS.push(c); BY[r].push(c);
    });
  }
  (cfg.photo || []).forEach(pc => {        // photo cards join their tier
    let pl = P.find(x => x.name === pc.name);
    if (!pl) { pl = {name: pc.name, pos: pc.pos, team: pc.team, rc: !!pc.rc, rank: P.length, c: TEAMS[id][pc.team] || ['#333','#999']}; P.push(pl); }
    const c = {id: ++cid, n: ++n, set:id, r: pc.r, name: pc.name, pos: pc.pos, team: pc.team, tc: pl.c, rc: !!pc.rc, rank: pl.rank,
      value: pc.value, sport: cfg.sport, auto: !!pc.auto, patch: !!pc.patch, vname: pc.vname, img: pc.img, photo: true,
      w: RUN_WEIGHT(pc.run), el:{name: pc.team, icon:''}};
    if (pc.run) c.run = pc.run;
    CARDS.push(c); BY[pc.r].push(c); RAR[pc.r].count++;
  });
  CARDS.forEach(c => c.num = String(c.n).padStart(3, '0'));
  const CARD = Object.fromEntries(CARDS.map(c => [c.id, c]));
  // same seven price points and odds as Taloki, new names and looks
  const cloneMode = md => md && Object.assign({}, md, md.boost ? {boost: Object.assign({}, md.boost)} : {});
  const PACKS = SETS.taloki.PACKS.map((tp, i) => Object.assign({}, tp, cfg.packs[i], {id: id + '-' + tp.id, cover: cfg.packs[i].cover || null},
    {normal: cloneMode(tp.normal), high: cloneMode(tp.high), max: cloneMode(tp.max), fifty: cloneMode(tp.fifty)}));
  return {id, sport: cfg.sport, sportName: cfg.sportName, name: cfg.name, setName: cfg.setName, eyebrow: cfg.eyebrow, headline: cfg.headline,
    packLabel: cfg.packLabel, chaseLabel:'Auto+', chaseNames:'Auto, Patch Auto and One of One', altView:'Players',
    RAR, ORDER:['C','U','R','E','A','P','X'], CARDS, BY, CARD, PACKS, GRADE: SPORT_GRADE, players: P};
}

/* Pack looks: pk = cover gradient, glow = shadow color. Add cover:'images/…' to use your own art. */
const SPORT_PACKS = [
  {name:'Rookie Pack',       pk:'linear-gradient(160deg,#3A4352,#141821)',              glow:'#3B82F6'},
  {name:'Starter Pack',      pk:'linear-gradient(160deg,#C9D1DC,#59657A)',              glow:'#10B981'},
  {name:'Veteran Pack',      pk:'linear-gradient(160deg,#2A2F3A,#07080B)',              glow:'#EF4444'},
  {name:'All-Star Pack',     pk:'linear-gradient(160deg,#F4F6FA,#9AA3B2 55%,#4C5361)',  glow:'#8B5CF6'},
  {name:'MVP Pack',          pk:'linear-gradient(160deg,#F7E3A1,#C9A24C 55%,#5A4316)',  glow:'#E8C25A'},
  {name:'Hall of Fame Pack', pk:'linear-gradient(160deg,#1A1A1A,#5B4A2A 50%,#C9A24C)',  glow:'#C9A24C'},
  {name:'GOAT Pack',         pk:'linear-gradient(160deg,#FFFFFF,#BFC6D2 30%,#1A1D24 70%,#000)', glow:'#C4B5FD'}
];

SETS.nfl = buildSportSet('nfl', {
  sport:'football', sportName:'Football', name:'NFL', setName:'PAX Football 2026', eyebrow:'Football · 2026 Series',
  headline:'Rip packs.<br>Pull the stars.', packLabel:'Football 2026', players: NFL_PLAYERS, art: NFL_ART, photo: NFL_PHOTO_CARDS,
  packs: SPORT_PACKS.map(p => Object.assign({}, p))
});
SETS.nba = buildSportSet('nba', {
  sport:'basketball', sportName:'Basketball', name:'NBA', setName:'PAX Basketball 2026-27', eyebrow:'Basketball · 2026-27 Series',
  headline:'Rip packs.<br>Chase the greats.', packLabel:'Basketball 26-27', players: NBA_PLAYERS, art: NBA_ART,
  packs: SPORT_PACKS.map(p => Object.assign({}, p))
});
