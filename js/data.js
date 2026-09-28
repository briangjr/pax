/* Taloki — card set data: art, values, tiers, packs and odds.
   Card art lives in images/cards/. Each card's value is fixed. */
/* ============ ADD YOUR CARD ART HERE ============
   Key = card number (1-100). Value = image data URI or same-origin path.
   Example: 1: "data:image/png;base64,....."            */
const BACKS = {slab:"images/brand/back-graded.webp"};
const CARD_ART = {};
/* Graded card art: one slab image per card. box = where the card sits inside the slab [left, top, width, height] as fractions */
const SLABS = {
  x1: {"src": "images/cards/001-thundrake.webp", "box": [0.0926, 0.1989, 0.8231, 0.7486], "ar": 0.70729},
  x2: {"src": "images/cards/002-aquarion.webp", "box": [0.0926, 0.1981, 0.8231, 0.7494], "ar": 0.70803},
  x3: {"src": "images/cards/003-knoxara.webp", "box": [0.0918, 0.1978, 0.8159, 0.7525], "ar": 0.71728},
  x4: {"src": "images/cards/004-pleezer.webp", "box": [0.0906, 0.1976, 0.8182, 0.7517], "ar": 0.71444},
  x5: {"src": "images/cards/005-gracious.webp", "box": [0.0902, 0.1976, 0.8147, 0.7517], "ar": 0.71757},
  x6: {"src": "images/cards/006-montunzer.webp", "box": [0.0919, 0.1983, 0.8171, 0.7502], "ar": 0.71399},
  x7: {"src": "images/cards/007-velmora.webp", "box": [0.0915, 0.1976, 0.8135, 0.7517], "ar": 0.71862},
  x8: {"src": "images/cards/008-loz.webp", "box": [0.0913, 0.1978, 0.8243, 0.7525], "ar": 0.70995},
  x9: {"src": "images/cards/009-phoenixon.webp", "box": [0.0918, 0.1989, 0.8159, 0.7565], "ar": 0.72105},
  x10: {"src": "images/cards/010-flamingopp.webp", "box": [0.0921, 0.1983, 0.8182, 0.7541], "ar": 0.71668},
  a1: {"src": "images/cards/022-stormaryn.webp", "box": [0.093, 0.2013, 0.8163, 0.7472], "ar": 0.65528},
  a2: {"src": "images/cards/023-tiderion.webp", "box": [0.0922, 0.2015, 0.8097, 0.748], "ar": 0.66132},
  a3: {"src": "images/cards/024-duskara.webp", "box": [0.0921, 0.2009, 0.8084, 0.7456], "ar": 0.66028},
  a4: {"src": "images/cards/025-terrunzer.webp", "box": [0.0915, 0.2011, 0.8176, 0.7464], "ar": 0.65352},
  a5: {"src": "images/cards/026-emberopp.webp", "box": [0.0915, 0.2013, 0.8176, 0.7472], "ar": 0.65422},
  a6: {"src": "images/cards/027-frostalon.webp", "box": [0.0915, 0.2011, 0.8176, 0.7464], "ar": 0.65352},
  a7: {"src": "images/cards/028-coralith.webp", "box": [0.0903, 0.2013, 0.8071, 0.7472], "ar": 0.66275},
  a8: {"src": "images/cards/029-vesperyn.webp", "box": [0.0915, 0.2013, 0.8176, 0.7472], "ar": 0.65422},
  a9: {"src": "images/cards/030-ironox.webp", "box": [0.0915, 0.2011, 0.8176, 0.7464], "ar": 0.65352},
  a10: {"src": "images/cards/031-venomara.webp", "box": [0.0908, 0.202, 0.811, 0.7496], "ar": 0.66167},
  a11: {"src": "images/cards/032-solaryn.webp", "box": [0.0898, 0.2024, 0.829, 0.7515], "ar": 0.67125},
  a12: {"src": "images/cards/033-glacivex.webp", "box": [0.0924, 0.2004, 0.8376, 0.7439], "ar": 0.6576},
  a13: {"src": "images/cards/034-briarclaw.webp", "box": [0.0872, 0.2029, 0.8206, 0.7533], "ar": 0.67968},
  a14: {"src": "images/cards/035-riptalon.webp", "box": [0.0921, 0.2004, 0.8347, 0.7439], "ar": 0.65986},
  a15: {"src": "images/cards/036-astrowl.webp", "box": [0.0935, 0.2013, 0.8318, 0.7473], "ar": 0.66515},
  a16: {"src": "images/cards/037-mirefang.webp", "box": [0.0924, 0.2008, 0.8376, 0.7456], "ar": 0.65909},
  a17: {"src": "images/cards/038-gravorn.webp", "box": [0.0921, 0.2013, 0.8347, 0.7473], "ar": 0.66287},
  a18: {"src": "images/cards/039-scorpinox.webp", "box": [0.0948, 0.2039, 0.813, 0.75], "ar": 0.69072},
  a19: {"src": "images/cards/040-cloudane.webp", "box": [0.083, 0.2024, 0.829, 0.7515], "ar": 0.67125},
  a20: {"src": "images/cards/041-crystara.webp", "box": [0.0928, 0.2034, 0.8154, 0.7483], "ar": 0.68},
  p1: {"src": "images/cards/011-helioris.webp", "box": [0.0802, 0.2313, 0.8396, 0.7143], "ar": 0.63433},
  p2: {"src": "images/cards/012-cryontra.webp", "box": [0.0802, 0.2313, 0.8396, 0.7143], "ar": 0.63433},
  p3: {"src": "images/cards/013-verdantor.webp", "box": [0.0802, 0.2313, 0.8396, 0.7143], "ar": 0.63433},
  p4: {"src": "images/cards/014-leviathanis.webp", "box": [0.0802, 0.2313, 0.8396, 0.7143], "ar": 0.63433},
  p5: {"src": "images/cards/015-celestaris.webp", "box": [0.0802, 0.2313, 0.8396, 0.7143], "ar": 0.63433},
  p6: {"src": "images/cards/016-bogmaw.webp", "box": [0.0802, 0.2313, 0.8396, 0.7143], "ar": 0.63433},
  p7: {"src": "images/cards/017-nulltusk.webp", "box": [0.0803, 0.2313, 0.8409, 0.7143], "ar": 0.6334},
  p8: {"src": "images/cards/018-tyrannox.webp", "box": [0.0803, 0.2313, 0.8409, 0.7143], "ar": 0.6334},
  p9: {"src": "images/cards/019-zephyron.webp", "box": [0.0803, 0.2313, 0.8409, 0.7143], "ar": 0.6334},
  p10: {"src": "images/cards/020-pristelle.webp", "box": [0.0802, 0.2313, 0.8396, 0.7143], "ar": 0.63433},
  p11: {"src": "images/cards/021-pyrozarok.webp", "box": [0.0803, 0.2313, 0.8409, 0.7143], "ar": 0.6334},
  e1: {"src": "images/cards/047-voltryn.webp", "box": [0.0917, 0.1975, 0.8222, 0.7532], "ar": 0.67294},
  e2: {"src": "images/cards/048-marivex.webp", "box": [0, 0, 1, 1], "ar": 0.70758, "raw": true},
  e3: {"src": "images/cards/049-umbrix.webp", "box": [0, 0, 1, 1], "ar": 0.70758, "raw": true},
  e4: {"src": "images/cards/050-cragorn.webp", "box": [0, 0, 1, 1], "ar": 0.70758, "raw": true},
  e5: {"src": "images/cards/051-rosaflare.webp", "box": [0, 0, 1, 1], "ar": 0.70758, "raw": true},
  e6: {"src": "images/cards/052-solenith.webp", "box": [0.0651, 0.173, 0.8739, 0.7827], "ar": 0.6444},
  e7: {"src": "images/cards/053-frostlup.webp", "box": [0, 0, 1, 1], "ar": 0.70758, "raw": true},
  e8: {"src": "images/cards/054-thornkit.webp", "box": [0, 0, 1, 1], "ar": 0.70758, "raw": true},
  e9: {"src": "images/cards/055-finclaw.webp", "box": [0, 0, 1, 1], "ar": 0.70758, "raw": true},
  e10: {"src": "images/cards/056-lunowl.webp", "box": [0, 0, 1, 1], "ar": 0.70758, "raw": true},
  r1: {"src": "images/cards/057-marshclaw.webp", "box": [0, 0, 1, 1], "ar": 0.70758, "raw": true},
  r2: {"src": "images/cards/058-gravoltan.webp", "box": [0, 0, 1, 1], "ar": 0.70758, "raw": true},
  r3: {"src": "images/cards/059-skorven.webp", "box": [0, 0, 1, 1], "ar": 0.70758, "raw": true},
  r4: {"src": "images/cards/060-aeralyn.webp", "box": [0, 0, 1, 1], "ar": 0.70758, "raw": true},
  r5: {"src": "images/cards/061-luminae.webp", "box": [0.061, 0.1677, 0.8801, 0.7767], "ar": 0.6444},
  b062: {"src": "images/cards/062-dunestag.webp", "box": [0, 0, 1, 1], "ar": 0.72029, "raw": true},
  b063: {"src": "images/cards/063-mirehop.webp", "box": [0, 0, 1, 1], "ar": 0.73082, "raw": true},
  b065: {"src": "images/cards/065-tiderock.webp", "box": [0, 0, 1, 1], "ar": 0.71514, "raw": true},
  b066: {"src": "images/cards/066-vinetail.webp", "box": [0, 0, 1, 1], "ar": 0.71344, "raw": true},
  b067: {"src": "images/cards/067-whispling.webp", "box": [0, 0, 1, 1], "ar": 0.72551, "raw": true},
  b068: {"src": "images/cards/068-cragrip.webp", "box": [0, 0, 1, 1], "ar": 0.72376, "raw": true},
  b042: {"src": "images/cards/042-chronolith.webp", "box": [0, 0, 1, 1], "ar": 0.58997, "raw": true},
  b043: {"src": "images/cards/043-tempestra.webp", "box": [0, 0, 1, 1], "ar": 0.5988, "raw": true},
  b044: {"src": "images/cards/044-selunaris.webp", "box": [0, 0, 1, 1], "ar": 0.6424, "raw": true},
  b045: {"src": "images/cards/045-gorgalyth.webp", "box": [0, 0, 1, 1], "ar": 0.64171, "raw": true},
  b046: {"src": "images/cards/046-pyrelios.webp", "box": [0, 0, 1, 1], "ar": 0.64103, "raw": true},
  b064: {"src": "images/cards/064-coralisk.webp", "box": [0, 0, 1, 1], "ar": 0.65502, "raw": true},
  b069: {"src": "images/cards/069-stormrook.webp", "box": [0, 0, 1, 1], "ar": 0.65431, "raw": true},
  b070: {"src": "images/cards/070-glimmerfin.webp", "box": [0, 0, 1, 1], "ar": 0.68571, "raw": true},
  b071: {"src": "images/cards/071-shroomble.webp", "box": [0, 0, 1, 1], "ar": 0.67644, "raw": true},
  u072: {"src": "images/cards/072-sparklin.webp", "box": [0, 0, 1, 1], "ar": 0.6772, "raw": true},
  u073: {"src": "images/cards/073-aquini.webp", "box": [0, 0, 1, 1], "ar": 0.6993, "raw": true},
  u074: {"src": "images/cards/074-noxlet.webp", "box": [0, 0, 1, 1], "ar": 0.69124, "raw": true},
  u075: {"src": "images/cards/075-pebblor.webp", "box": [0, 0, 1, 1], "ar": 0.70588, "raw": true},
  u076: {"src": "images/cards/076-flicko.webp", "box": [0, 0, 1, 1], "ar": 0.70505, "raw": true},
  u077: {"src": "images/cards/077-taloki-cub.webp", "box": [0, 0, 1, 1], "ar": 0.68807, "raw": true},
  u078: {"src": "images/cards/078-chillpup.webp", "box": [0, 0, 1, 1], "ar": 0.66667, "raw": true},
  u079: {"src": "images/cards/079-sprigpaw.webp", "box": [0, 0, 1, 1], "ar": 0.68966, "raw": true},
  u080: {"src": "images/cards/080-ripfin.webp", "box": [0, 0, 1, 1], "ar": 0.70012, "raw": true},
  u081: {"src": "images/cards/081-taloki-owlet.webp", "box": [0, 0, 1, 1], "ar": 0.66667, "raw": true}
};

/* ============ SET DATA ============ */
const RAR = {
  X:{name:'Mythic Legend', count:10},
  P:{name:'Apex Rare', count:11},
  A:{name:'Ascended Rare', count:25},
  E:{name:'Epic',     count:10, min:2.00, max:6.00},
  R:{name:'Rare',     count:15, min:0.40, max:1.25},
  U:{name:'Uncommon', count:25, min:0.06, max:0.20},
  C:{name:'Common',   count:40, min:0.01, max:0.05}
};
const ORDER = ['C','U','R','E','A','P','X'];
const EL = [
  {name:'Blaze', icon:'🔥', a:'#FF7A1A', b:'#FFD21F', pre:['Ember','Cinder','Pyro','Scorch','Flare']},
  {name:'Tide',  icon:'💧', a:'#1FA2FF', b:'#6FF0FF', pre:['Ripple','Coral','Aqua','Brine','Surf']},
  {name:'Volt',  icon:'⚡', a:'#FFB300', b:'#FFF36B', pre:['Zap','Spark','Static','Ion','Jolt']},
  {name:'Leaf',  icon:'🌿', a:'#1FBF6A', b:'#C8F56B', pre:['Moss','Sprout','Bramble','Fern','Thorn']},
  {name:'Frost', icon:'❄️', a:'#56C8FF', b:'#E8F9FF', pre:['Glacia','Rime','Sleet','Crystal','Hail']},
  {name:'Shade', icon:'🌙', a:'#6A3DFF', b:'#D07BFF', pre:['Umbra','Dusk','Gloom','Nyx','Hex']},
  {name:'Stone', icon:'🪨', a:'#B07A4A', b:'#F0C98A', pre:['Boulder','Quartz','Crag','Pebble','Flint']},
  {name:'Aero',  icon:'🌪️', a:'#2FD0CE', b:'#C8FFF2', pre:['Gale','Zephyr','Cirrus','Swoop','Drift']}
];
const SUF = ['pup','fang','wing','tail','horn','claw','drake','mite','lynx','roo','byte','moth','kit','rex','ling'];
const MYTHIC_LEGENDS = [ // [name, element, icon, value] — all graded Gem Mint 10
  ['Thundrake', 'Volt',  '⚡', 49119.16], ['Aquarion',  'Tide',  '💧', 43428.82],
  ['Knoxara',   'Shade', '🌙', 40603.74], ['Pleezer',   'Trickster','🌀', 33503.53],
  ['Gracious',  'Light', '🌟', 30107.65], ['Montunzer', 'Stone', '⛰️', 24664.22],
  ['Velmora',   'Spirit','👻', 19116.37], ['Loz',       'Leaf',  '🍃', 15011.15],
  ['Phoenixon', 'Blaze', '🔥', 11921.87], ['Flamingopp','Blaze', '🔥', 10187.42]
];
const ASCENDED_BASIC = [ // #042-#046: [name, element, icon, value] — ungraded Basic Ascended Rares, priced by HP
  ["Chronolith", "Time", "⏳", 1106.19],
  ["Tempestra", "Aero", "🌪️", 1214.56],
  ["Selunaris", "Cosmic", "🌙", 987.73],
  ["Gorgalyth", "Stone", "🐍", 1329.84],
  ["Pyrelios", "Light", "☀️", 1468.37]
];
const ASCENDED = [ // [name, element, icon, grade, value] — value follows the grade
  ["Stormaryn", "Volt", "⚡", 10, 2342.86],
  ["Tiderion", "Tide", "💧", 9, 1291.84],
  ["Duskara", "Shade", "🌙", 10, 2909.05],
  ["Terrunzer", "Stone", "⛰️", 8, 636.26],
  ["Emberopp", "Blaze", "🔥", 9, 1255.49],
  ["Frostalon", "Frost", "❄️", 10, 2504.86],
  ["Coralith", "Tide", "🌊", 8, 523.86],
  ["Vesperyn", "Shade", "🌙", 9, 1258.34],
  ["Ironox", "Metal", "⚙️", 10, 2555.86],
  ["Venomara", "Poison", "☣️", 9, 1455.08],
  ["Solaryn", "Light", "☀️", 10, 1912.95],
  ["Glacivex", "Frost", "❄️", 9, 1112.38],
  ["Briarclaw", "Leaf", "🍃", 8, 486.27],
  ["Riptalon", "Tide", "💧", 10, 2771.57],
  ["Astrowl", "Cosmic", "✨", 9, 1385.41],
  ["Mirefang", "Poison", "☠️", 8, 466.75],
  ["Gravorn", "Gravity", "🪐", 9, 1587.54],
  ["Scorpinox", "Shade", "🦂", 10, 2957.71],
  ["Cloudane", "Aero", "🌪️", 8, 711.57],
  ["Crystara", "Crystal", "💎", 10, 2538.68],
];
const APEX = [ // [name, element, icon, grade, value, evolves from] — Stage 4
  ["Helioris", "Light", "☀️", 9, 6742.22, "Solaryn"],
  ["Cryontra", "Frost", "❄️", 9, 6792.07, "Glacivex"],
  ["Verdantor", "Leaf", "🍃", 10, 9341.84, "Briarclaw"],
  ["Leviathanis", "Tide", "💧", 8, 3400.26, "Riptalon"],
  ["Celestaris", "Cosmic", "✨", 9, 6043.26, "Astrowl"],
  ["Bogmaw", "Poison", "🐊", 10, 8216.99, "Mirefang"],
  ["Nulltusk", "Gravity", "🪐", 8, 3936.11, "Gravorn"],
  ["Tyrannox", "Blaze", "🦂", 10, 7512.73, "Scorpinox"],
  ["Zephyron", "Aero", "🌪️", 9, 5203.19, "Cloudane"],
  ["Pristelle", "Crystal", "💎", 9, 5733.6, "Crystara"],
  ["Pyrozarok", "Blaze", "🔥", 10, 7730.49, "Emberjaw"],
];
/* Placeholder-tier values (ids 11-100), spread so every pack's payout tiers have cards in them */
const LOW_VALUES = [0.18, 0.37, 1.15, 1.52, 0.37, 0.29, 0.32, 0.67, 0.75, 1.19, 2.16, 1.51, 1.79, 1.75, 0.37, 2.32, 2.42, 0.15, 0.73, 0.35, 2.16, 1.36, 2.16, 0.63, 2.41, 1.14, 0.17, 0.78, 0.32, 1.88, 0.24, 0.16, 1.18, 0.63, 0.11, 0.13, 1.27, 1.34, 0.69, 0.58, 4.93, 7.51, 6.34, 7.73, 2.51, 4.77, 3.83, 3.55, 6.39, 2.95, 2.72, 5.93, 2.46, 5.87, 8.67, 3.36, 6.53, 2.51, 2.73, 9.57, 7.88, 5.54, 8.65, 4.35, 11.49, 15.03, 12.62, 27.53, 22.9, 32.4, 14.31, 12.94, 32.22, 19.26, 14.18, 11.75, 14.93, 30.71, 25.09, 28.77, 199.67, 62.96, 40.07, 94.61, 77.27, 133.79, 52.99, 71.36, 56.69, 36.71];
const EPICS = [ // #047-#056: [name, element, icon, evolves from, evolves into, grade or null if ungraded] — Stage 2
  ["Voltryn", "Volt", "⚡", "Sparklin", "Stormaryn", 10],
  ["Marivex", "Tide", "💧", "Aquini", "Tiderion", null],
  ["Umbrix", "Shade", "🌙", "Noxlet", "Duskara", null],
  ["Cragorn", "Stone", "⛰️", "Pebblor", "Terrunzer", null],
  ["Rosaflare", "Blaze", "🔥", "Flicko", "Emberopp", null],
  ["Solenith", "Light", "☀️", "Raycub", "Solaryn", 9],
  ["Frostlup", "Frost", "❄️", "Chillpup", "Glacivex", null],
  ["Thornkit", "Leaf", "🍃", "Sprigpaw", "Briarclaw", null],
  ["Finclaw", "Tide", "💧", "Ripfin", "Riptalon", null],
  ["Lunowl", "Shade", "🌙", "Starlit", "Astrowl", null],
];
const RARES = [ // #057-#061: same format as EPICS — Stage 2
  ["Marshclaw", "Leaf", "🍃", "Mireling", "Mirefang", null],
  ["Gravoltan", "Gravity", "🪐", "Gravbit", "Gravorn", null],
  ["Skorven", "Blaze", "🔥", "Skritch", "Scorpinox", null],
  ["Aeralyn", "Aero", "🌪️", "Mistkit", "Cloudane", null],
  ["Luminae", "Crystal", "💎", "Shardlet", "Crystara", 9],
];
const BASIC_RARES = [ // [card number, name, element, icon] — Basic creatures, no evolution line
  [62, "Dunestag", "Stone", "⛰️"],
  [63, "Mirehop", "Leaf", "🐸"],
  [65, "Tiderock", "Tide", "🐢"],
  [66, "Vinetail", "Leaf", "🍃"],
  [67, "Whispling", "Shade", "🏮"],
  [68, "Cragrip", "Tide", "🦀"],
  [64, "Coralisk", "Tide", "🐉"],
  [69, "Stormrook", "Volt", "🦅"],
  [70, "Glimmerfin", "Tide", "🐟"],
  [71, "Shroomble", "Leaf", "🍄"],
];
const STAGE1 = [ // [card number, name, element, icon, evolves into] — Stage 1 Uncommons
  [72, "Sparklin", "Volt", "⚡", "Voltryn"],
  [73, "Aquini", "Tide", "💧", "Marivex"],
  [74, "Noxlet", "Shade", "🌙", "Umbrix"],
  [75, "Pebblor", "Stone", "⛰️", "Cragorn"],
  [76, "Flicko", "Blaze", "🔥", "Rosaflare"],
  [77, "Taloki", "Light", "☀️", "Solenith"],
  [78, "Chillpup", "Frost", "❄️", "Frostlup"],
  [79, "Sprigpaw", "Leaf", "🍃", "Thornkit"],
  [80, "Ripfin", "Tide", "💧", "Finclaw"],
  [81, "Taloki", "Shade", "🌙", "Lunowl"],
];
const ASC_EVO = {"Stormaryn": ["Voltryn", "Thundrake"], "Tiderion": ["Marivex", "Aquarion"], "Duskara": ["Umbrix", "Knoxara"], "Terrunzer": ["Cragorn", "Montunzer"], "Emberopp": ["Rosaflare", "Flamingopp"], "Solaryn": ["Solenith", "Helioris"], "Glacivex": ["Frostlup", "Cryontra"], "Briarclaw": ["Thornkit", "Verdantor"], "Riptalon": ["Finclaw", "Leviathanis"], "Astrowl": ["Lunowl", "Celestaris"], "Mirefang": ["Marshclaw", "Bogmaw"], "Gravorn": ["Gravoltan", "Nulltusk"], "Scorpinox": ["Skorven", "Tyrannox"], "Cloudane": ["Aeralyn", "Zephyron"], "Crystara": ["Luminae", "Pristelle"]}; // Ascended (Stage 3): [evolves from, evolves into]
const MYTH_FROM = {"Thundrake": "Stormaryn", "Aquarion": "Tiderion", "Knoxara": "Duskara", "Montunzer": "Terrunzer", "Flamingopp": "Emberopp"}; // Mythic Legends that are Stage 4
const GRADE = {10:'Gem Mint 10', 9:'Mint 9', 8:'NM-MT 8'};

/* Card ids stay fixed so saved collections keep working; the printed number (num) follows tier order from the top. */
const CARDS = []; const BY = {C:[],U:[],R:[],E:[],A:[],P:[],X:[]};
(function build(){
  const add = c => { CARDS.push(c); BY[c.r].push(c); };
  MYTHIC_LEGENDS.forEach(([name, eln, icon, value], i) =>
    add({id:i+1, n:i+1, name, r:'X', el:{name:eln, icon}, value, grade:10, slab:SLABS['x'+(i+1)]}));
  APEX.forEach(([name, eln, icon, grade, value, evo], i) =>
    add({id:141+i, n:11+i, name, r:'P', el:{name:eln, icon}, value, grade, evo, slab:SLABS['p'+(i+1)]}));
  ASCENDED_BASIC.forEach(([name, eln, icon, value], i) =>
    add({id:131+i, n:42+i, name, r:'A', el:{name:eln, icon}, value, basic:true, slab:SLABS['b0'+(42+i)]}));
  ASCENDED.forEach(([name, eln, icon, grade, value], i) =>
    add({id:111+i, n:22+i, name, r:'A', el:{name:eln, icon}, value, grade, slab:SLABS['a'+(i+1)]}));
  // placeholder tiers, printed #047 onward 
  const start = {E:47, R:57, U:72, C:97};
  let n = 0, id = 11;
  for (const r of ['C','U','R','E']) {
    const k = RAR[r];
    for (let i = 0; i < k.count; i++) {
      const el = EL[n % 8], name = el.pre[Math.floor(n/8) % 5] + SUF[(n*7) % 15]; n++;
      add({id, n:start[r]+i, name, r, el, value: LOW_VALUES[id - 11]});
      id++;
    }
  }
  // real Epic art replaces the placeholders at #047-#056
  EPICS.forEach(([name, eln, icon, from, into, grade], i) => {
    const c = BY.E[i]; Object.assign(c, {name, el:{name:eln, icon}, stage:2, from, into, slab:SLABS['e'+(i+1)]});
    if (grade) c.grade = grade;
  });
  RARES.forEach(([name, eln, icon, from, into, grade], i) => {
    const c = BY.R[i]; Object.assign(c, {name, el:{name:eln, icon}, stage:2, from, into, slab:SLABS['r'+(i+1)]});
    if (grade) c.grade = grade;
  });
  BASIC_RARES.forEach(([n, name, eln, icon]) => {
    const c = BY.R[n - 57]; Object.assign(c, {name, el:{name:eln, icon}, basic:true, slab:SLABS['b' + String(n).padStart(3,'0')]});
  });
  STAGE1.forEach(([n, name, eln, icon, into]) => {
    const c = BY.U[n - 72]; Object.assign(c, {name, el:{name:eln, icon}, stage:1, into, slab:SLABS['u' + String(n).padStart(3,'0')]});
  });
  BY.A.forEach(c => { const e = ASC_EVO[c.name]; if (e) Object.assign(c, {stage:3, from:e[0], into:e[1]}); });
  BY.P.forEach(c => Object.assign(c, {stage:4, from:c.evo}));
  BY.X.forEach(c => { if (MYTH_FROM[c.name]) Object.assign(c, {stage:4, from:MYTH_FROM[c.name]}); });
  CARDS.forEach(c => c.num = String(c.n).padStart(3,'0'));
})();
const CARD = Object.fromEntries(CARDS.map(c => [c.id, c]));

/* Payout tiers. Each volatility style sets the tier ranges, as multiples of the pack price.
   Blue always sits a little above the pack price; Gold has no ceiling and holds the jackpot. */
const TIERS = [
  {name:'Gray',   rgb:'154,163,178'},
  {name:'Green',  rgb:'34,197,94'},
  {name:'Blue',   rgb:'59,130,246'},
  {name:'Purple', rgb:'168,85,247'},
  {name:'Red',    rgb:'239,68,68'},
  {name:'Gold',   rgb:'250,204,21'}
];
const MODES = {
  normal: {name:'Normal', desc:'Reliable pulls with results close to the average value of a pack.',
           bands:[[0.10,0.35],[0.35,0.95],[1.12,1.35],[1.35,1.80],[1.80,2.60],[2.60,Infinity]]},
  high:   {name:'High',   desc:'Wider swings with more weight on the higher tiers.',
           bands:[[0.32,0.40],[0.40,1.00],[1.04,1.20],[1.20,1.40],[1.40,1.80],[1.80,Infinity]]}
};
/* One card per pack. For each style: odds = chance of each tier; jackpot = per-pack chance (inside Gold)
   of each chase tier; skew = how steeply pricier cards get rarer inside Gold. */
const PACKS = [
  {id:'starter', name:'Starter Pack', price:1, gem:'🌱', pk:'linear-gradient(160deg,#2FD0CE,#1FBF6A)', glow:'#1FBF6A',
   normal:{odds:[0.387, 0.313, 0.14, 0.08, 0.05, 0.03], jackpot:{A:1/60000, P:1/300000, X:1/2000000}, skew:1.5},
   high:  {odds:[0.459, 0.341, 0.014, 0.017, 0.044, 0.125], jackpot:{A:1/42744, P:1/213722, X:1/1424811}, skew:3}},
  {id:'base', name:'Base Pack', price:2, gem:'💠', pk:'linear-gradient(160deg,#19C6FF,#2447F5)', glow:'#2447F5',
   normal:{odds:[0.369, 0.331, 0.14, 0.08, 0.05, 0.03], jackpot:{A:1/30000, P:1/150000, X:1/1000000}, skew:1.5},
   high:  {odds:[0.459, 0.341, 0.014, 0.017, 0.044, 0.125], jackpot:{A:1/30000, P:1/150000, X:1/1000000}, skew:3.498}},
  {id:'pro', name:'Pro Pack', price:5, gem:'🔮', pk:'linear-gradient(160deg,#C07BFF,#6A3DFF)', glow:'#6A3DFF',
   normal:{odds:[0.246, 0.454, 0.14, 0.08, 0.05, 0.03], jackpot:{A:1/12000, P:1/60000, X:1/400000}, skew:1.5},
   high:  {odds:[0.459, 0.341, 0.014, 0.017, 0.044, 0.125], jackpot:{A:1/7614, P:1/38071, X:1/253808}, skew:3}},
  {id:'ultra', name:'Ultra Pack', price:10, gem:'👑', pk:'linear-gradient(160deg,#FFE066,#FF9A1A)', glow:'#FF9A1A',
   normal:{odds:[0.365, 0.335, 0.14, 0.08, 0.05, 0.03], jackpot:{A:1/3000, P:1/15000, X:1/120000}, skew:1.5},
   high:  {odds:[0.459, 0.341, 0.014, 0.017, 0.044, 0.125], jackpot:{A:1/3000, P:1/15000, X:1/120000}, skew:4.431}},
  {id:'legendary', name:'Legendary Pack', price:25, gem:'🌈', pk:'linear-gradient(160deg,#FF3D9A,#9B4DFF 50%,#19C6FF)', glow:'#FF3D9A',
   normal:{odds:[0.396, 0.304, 0.14, 0.08, 0.05, 0.03], jackpot:{A:1/1000, P:1/5000, X:1/40000}, skew:1.5},
   high:  {odds:[0.459, 0.341, 0.014, 0.017, 0.044, 0.125], jackpot:{A:1/1000, P:1/5000, X:1/40000}, skew:4.024}},
  /* $100 and $500: chase cards sit in the regular tiers, so these use their own dollar ranges */
  {id:'mythic', name:'Mythic Pack', price:100, gem:'💎', pk:'linear-gradient(160deg,#F7D774,#8A5A12 55%,#1A1206)', glow:'#E8B923',
   normal:{odds:[0.3301, 0.5029, 0.14, 0.02, 0.006, 0.001], jackpot:{A:0, P:0, X:0}, skew:1.5, all:true,
            bands:[[10,35],[35,95],[105,200],[450,1000],[1000,3000],[3000,Infinity]]},
   high:  {odds:[0.262, 0.6699, 0.017, 0.031, 0.0075, 0.0126], jackpot:{A:0, P:0, X:0}, skew:1.2, all:true,
            bands:[[30,40],[40,100],[105,140],[150,200],[450,700],[700,Infinity]]}},
  {id:'sovereign', name:'Sovereign Pack', price:500, gem:'👁️', pk:'linear-gradient(160deg,#6FF0FF,#2E5BFF 45%,#05081A)', glow:'#3FD6A5',
   normal:{odds:[0.5626, 0.1674, 0.16, 0.07, 0.03, 0.01], jackpot:{A:0, P:0, X:0}, skew:1.5, all:true,
            bands:[[36,200],[200,500],[520,720],[980,1500],[1500,3000],[3000,Infinity]]},
   high:  {odds:[0.262, 0.5931, 0.017, 0.031, 0.057, 0.0399], jackpot:{A:0, P:0, X:0}, skew:2, all:true,
            bands:[[100,200],[200,500],[500,550],[550,650],[650,900],[900,Infinity]]}}
];

/* Gold Boost: costs 2x the pack price and makes Gold 25% of pulls. The other tiers shrink to fit,
   the jackpot doubles, and Gold leans toward its cheaper cards so a boosted pack still averages
   92% of what you paid. goldLo lowers the Gold floor on the $100/$500 packs. */
const BOOST = {
  starter: {
    normal: {odds:[0.29923, 0.242, 0.10825, 0.06186, 0.03866, 0.25], jackpot:{A:1/30000, P:1/150000, X:1/1000000}, skew:2.111},
    high: {odds:[0.39343, 0.29229, 0.012, 0.01457, 0.03771, 0.25], jackpot:{A:1/21372, P:1/106861, X:1/712406}, skew:1.194}
  },
  base: {
    normal: {odds:[0.28531, 0.25592, 0.10825, 0.06186, 0.03866, 0.25], jackpot:{A:1/15000, P:1/75000, X:1/500000}, skew:1.807},
    high: {odds:[0.39343, 0.29229, 0.012, 0.01457, 0.03771, 0.25], jackpot:{A:1/15000, P:1/75000, X:1/500000}, skew:1.172}
  },
  pro: {
    normal: {odds:[0.19021, 0.35102, 0.10825, 0.06186, 0.03866, 0.25], jackpot:{A:1/6000, P:1/30000, X:1/200000}, skew:1.739},
    high: {odds:[0.39343, 0.29229, 0.012, 0.01457, 0.03771, 0.25], jackpot:{A:1/3807, P:1/19036, X:1/126904}, skew:0.875}
  },
  ultra: {
    normal: {odds:[0.28222, 0.25901, 0.10825, 0.06186, 0.03866, 0.25], jackpot:{A:1/1500, P:1/7500, X:1/60000}, skew:1.325},
    high: {odds:[0.39343, 0.29229, 0.012, 0.01457, 0.03771, 0.25], jackpot:{A:1/1500, P:1/7500, X:1/60000}, skew:0.479}
  },
  legendary: {
    normal: {odds:[0.30619, 0.23504, 0.10825, 0.06186, 0.03866, 0.25], jackpot:{A:1/500, P:1/2500, X:1/20000}, skew:0.636},
    high: {odds:[0.39343, 0.29229, 0.012, 0.01457, 0.03771, 0.25], jackpot:{A:1/500, P:1/2500, X:1/20000}, skew:-0.97}
  },
  mythic: {
    normal: {odds:[0.24782, 0.37755, 0.10511, 0.01502, 0.0045, 0.25], jackpot:{A:0, P:0, X:0}, skew:13.636, goldLo:450},
    high: {odds:[0.19901, 0.50883, 0.01291, 0.02355, 0.0057, 0.25], jackpot:{A:0, P:0, X:0}, skew:4.807, goldLo:450}
  },
  sovereign: {
    normal: {odds:[0.42621, 0.12682, 0.12121, 0.05303, 0.02273, 0.25], jackpot:{A:0, P:0, X:0}, skew:2.753, goldLo:1500},
    high: {odds:[0.20467, 0.4633, 0.01328, 0.02422, 0.04453, 0.25], jackpot:{A:0, P:0, X:0}, skew:1.137}
  }
};
PACKS.forEach(p => ['normal', 'high'].forEach(m => { p[m].boost = BOOST[p.id][m]; }));
