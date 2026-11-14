// Rende le mappe ESTERNE più raccolte SENZA rimpicciolire gli elementi: toglie righe e colonne
// "vuote" (solo prato, alberi sparsi, acqua larga, zone d'incontro) e lascia intatto tutto ciò che ha
// una misura che conta. Richiesta di Jacopo del 14/11/2026: «non ho chiesto di rimpicciolire gli
// elementi, la dimensione di prima di case e strade era perfetta».
//
//   node tools/compatta-mappe.mjs          # anteprima: misure prima → dopo
//   node tools/compatta-mappe.mjs --scrivi # riscrive maps/, trainers/, data.js
//
// Si lancia UNA volta sulle mappe a misura piena (quelle che usano `...city/wide/tall`): dopo, ogni
// mappa ha `width`/`height` suoi e lo script si rifiuta di ripartire. Poi: `node tools/arreda-mappe.mjs`.
//
// Colonne (e righe) PROTETTE, che non si tolgono mai:
// - la cornice della mappa (2 celle per lato);
// - gli edifici, con una cella di margine attorno e la fila davanti alla porta;
// - NPC, allenatori (con tutta la loro linea di sguardo), porte, passaggi, punti d'arrivo: ±1 cella;
// - lo spessore di strade, ponti, muri, binari e corsi d'acqua stretti (fino a 6 celle): una strada
//   resta larga uguale, si accorcia soltanto.
// Tutto il resto è spazio: se ne toglie quanto basta per dimezzare il lato (se c'è), a intervalli
// regolari, così le distanze si accorciano in modo uniforme. Boschetti e zone che finiscono per
// intero in una fascia tolta spariscono.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const gameDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const write = process.argv.includes('--scrivi');
const GENERATED = 'zz_arredo.js';
const THIN = 6;

// --- dati scritti a mano ---
const context = { window: {}, console };
vm.createContext(context);
const load = file => vm.runInContext(fs.readFileSync(path.join(gameDir, file), 'utf8'), context, { filename: file });
const mapFiles = fs.readdirSync(path.join(gameDir, 'maps')).filter(f => f.endsWith('.js') && f !== '_helpers.js' && f !== GENERATED && fs.statSync(path.join(gameDir, 'maps', f)).size).sort();
const trainerFiles = fs.readdirSync(path.join(gameDir, 'trainers')).filter(f => f.endsWith('.js') && fs.statSync(path.join(gameDir, 'trainers', f)).size).sort();
load('species.js'); load('moves.js'); load('maps/_helpers.js');
mapFiles.forEach(f => load(`maps/${f}`));
load('data.js'); load('trainers.js');
trainerFiles.forEach(f => load(`trainers/${f}`));
const data = context.window.PokemonAscoliData;
const trainers = context.window.PokemonAscoliTrainers.trainers;

if (!mapFiles.some(f => /\.\.\.(city|wide|tall)\b/.test(fs.readFileSync(path.join(gameDir, 'maps', f), 'utf8')))) {
  console.error('Le mappe sono già compattate (nessuna usa più ...city/wide/tall): non riparto.');
  process.exit(1);
}

// punti d'arrivo da altre mappe
const arrivals = {};
const addArrival = (map, x, y) => { (arrivals[map] = arrivals[map] || []).push([x, y]); };
const scan = steps => { for (const s of steps || []) { if (s.warp) addArrival(s.warp.map, s.warp.x, s.warp.y); for (const k of ['then', 'else', 'onWin', 'onLose', 'onCatch', 'onOther']) if (Array.isArray(s[k])) scan(s[k]); if (s.options) s.options.forEach(o => scan(o.then)); } };
for (const map of Object.values(data.maps)) {
  (map.transitions || []).forEach(t => addArrival(t.to, t.spawnX, t.spawnY));
  (map.npcs || []).forEach(n => scan(n.script));
  (map.buildings || []).forEach(b => scan(b.script));
}
addArrival(data.start.map, data.start.x, data.start.y);
addArrival(data.respawn.map, data.respawn.x, data.respawn.y);

// --- per ogni mappa esterna: quali colonne e righe restano ---
const plans = {};
for (const [id, map] of Object.entries(data.maps)) {
  if (map.indoor) continue;
  const size = { x: map.width, y: map.height };
  const keep = { x: new Uint8Array(size.x), y: new Uint8Array(size.y) };
  const protect = (axis, from, to) => { for (let v = Math.max(0, from); v <= Math.min(size[axis] - 1, to); v += 1) keep[axis][v] = 1; };
  const around = (x, y, r = 1) => { protect('x', x - r, x + r); protect('y', y - r, y + r); };
  for (const axis of ['x', 'y']) { protect(axis, 0, 1); protect(axis, size[axis] - 2, size[axis] - 1); }
  (map.buildings || []).forEach(b => { protect('x', b.x - 1, b.x + b.w); protect('y', b.y - 1, b.y + b.h + 1); if (b.door) around(b.door.x, b.door.y); });
  (map.npcs || []).forEach(n => around(n.x, n.y));
  Object.values(trainers).filter(t => t.map === id).forEach(t => {
    around(t.x, t.y);
    const [dx, dy] = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[t.direction] || [0, 1];
    const reach = (t.sight || 0) + 1;
    if (dx) protect('x', Math.min(t.x, t.x + dx * reach), Math.max(t.x, t.x + dx * reach));
    if (dy) protect('y', Math.min(t.y, t.y + dy * reach), Math.max(t.y, t.y + dy * reach));
  });
  (map.transitions || []).forEach(t => { protect('x', t.x - 1, t.x + t.w); protect('y', t.y - 1, t.y + t.h); });
  (arrivals[id] || []).forEach(([x, y]) => around(x, y));
  const thin = r => { if (r.w <= THIN) protect('x', r.x, r.x + r.w - 1); if (r.h <= THIN) protect('y', r.y, r.y + r.h - 1); };
  (map.roads || []).filter(r => r.type !== 'albero').forEach(thin);
  (map.bridges || []).forEach(thin);
  (map.waters || []).forEach(thin);

  const prefix = {};
  for (const axis of ['x', 'y']) {
    const total = size[axis];
    const wanted = total - Math.ceil(total / 2);                    // quante toglierne per dimezzare
    const runs = [];
    for (let v = 0; v < total; v += 1) {
      if (keep[axis][v]) continue;
      let end = v;
      while (end + 1 < total && !keep[axis][end + 1]) end += 1;
      runs.push([v, end - v + 1]);
      v = end;
    }
    const free = runs.reduce((sum, [, length]) => sum + length, 0);
    const share = free ? Math.min(1, wanted / free) : 0;
    const removed = new Uint8Array(total);
    for (const [start, length] of runs) {
      const n = Math.floor(length * share);
      for (let i = 0; i < n; i += 1) removed[start + Math.floor((i + .5) * length / n)] = 1;
    }
    prefix[axis] = new Uint16Array(total + 1);                      // prefix[v] = celle rimaste prima di v
    for (let v = 0; v < total; v += 1) prefix[axis][v + 1] = prefix[axis][v] + (removed[v] ? 0 : 1);
  }
  plans[id] = { fx: v => prefix.x[Math.max(0, Math.min(size.x, v))], fy: v => prefix.y[Math.max(0, Math.min(size.y, v))], width: prefix.x[size.x], height: prefix.y[size.y], from: [size.x, size.y] };
  console.log(`${id.padEnd(22)} ${size.x}×${size.y} → ${plans[id].width}×${plans[id].height}`);
}

// --- riscrittura dei sorgenti (stesse regole di lettura di tools/scala-mappe.mjs) ---
const N = '(\\d+)';
const SEP = '\\s*,\\s*';
let total = 0, dropped = 0;
function rewrite(file, transform) {
  const full = path.join(gameDir, file);
  const before = fs.readFileSync(full, 'utf8');
  let count = 0;
  const after = transform(before, () => { count += 1; });
  total += count;
  if (write && after !== before) fs.writeFileSync(full, after);
}
const point = (id, x, y) => (plans[id] ? [plans[id].fx(Number(x)), plans[id].fy(Number(y))] : [x, y]);

for (const name of mapFiles) {
  const id = name.replace(/\.js$/, '');
  const plan = plans[id];
  rewrite(`maps/${name}`, (text, hit) => {
    text = text.replace(new RegExp(`warp:\\s*\\{\\s*map:\\s*'(\\w+)'${SEP}x:\\s*${N}${SEP}y:\\s*${N}`, 'g'), (_, to, x, y) => {
      const [nx, ny] = point(to, x, y);
      if (plans[to]) hit();
      return `warp: { map: '${to}', x§ ${nx}, y§ ${ny}`;
    });
    text = text.replace(new RegExp(`\\btransition\\(\\s*${N}${SEP}${N}${SEP}${N}${SEP}${N}${SEP}'(\\w+)'${SEP}${N}${SEP}${N}`, 'g'), (_, x, y, w, h, to, sx, sy) => {
      hit();
      const [nx, ny] = plan ? [plan.fx(+x), plan.fy(+y)] : [x, y];
      const [nw, nh] = plan ? [Math.max(1, plan.fx(+x + +w) - nx), Math.max(1, plan.fy(+y + +h) - ny)] : [w, h];
      const [nsx, nsy] = point(to, sx, sy);
      return `transition(${nx}, ${ny}, ${nw}, ${nh}, '${to}', ${nsx}, ${nsy}`;
    });
    if (!plan) return text.replace(/x§/g, 'x:').replace(/y§/g, 'y:');
    // rect e zone: se spariscono su un asse si toglie l'intera chiamata
    text = text.replace(new RegExp(`\\b(rect|zone)\\(\\s*${N}${SEP}${N}${SEP}${N}${SEP}${N}([^()]*)\\)(\\s*,[ \\t]*)?`, 'g'), (_, fn, x, y, w, h, rest, comma) => {
      hit();
      const nx = plan.fx(+x), ny = plan.fy(+y), nw = plan.fx(+x + +w) - nx, nh = plan.fy(+y + +h) - ny;
      if (nw < 1 || nh < 1) { dropped += 1; return ''; }
      return `${fn}(${nx}, ${ny}, ${nw}, ${nh}${rest})${comma || ''}`;
    });
    text = text.replace(new RegExp(`\\bbuilding\\(\\s*${N}${SEP}${N}${SEP}${N}${SEP}${N}`, 'g'), (_, x, y, w, h) => {
      hit();
      const nx = plan.fx(+x), ny = plan.fy(+y);
      return `building(${nx}, ${ny}, ${plan.fx(+x + +w) - nx}, ${plan.fy(+y + +h) - ny}`;
    });
    text = text.replace(new RegExp(`\\bnpc\\(\\s*${N}${SEP}${N}`, 'g'), (_, x, y) => { hit(); return `npc(${plan.fx(+x)}, ${plan.fy(+y)}`; });
    text = text.replace(new RegExp(`\\bx:\\s*${N}${SEP}y:\\s*${N}`, 'g'), (_, x, y) => { hit(); return `x: ${plan.fx(+x)}, y: ${plan.fy(+y)}`; });
    text = text.replace(/\.\.\.(city|wide|tall),/, `width: ${plan.width}, height: ${plan.height},`);
    return text.replace(/x§/g, 'x:').replace(/y§/g, 'y:');
  });
}
const byMap = (text, hit) => text.replace(new RegExp(`map:\\s*'(\\w+)'${SEP}x:\\s*${N}${SEP}y:\\s*${N}`, 'g'), (whole, map, x, y) => {
  if (!plans[map]) return whole;
  hit();
  const [nx, ny] = point(map, x, y);
  return `map: '${map}', x: ${nx}, y: ${ny}`;
});
trainerFiles.forEach(name => rewrite(`trainers/${name}`, byMap));
rewrite('trainers.js', byMap);
rewrite('data.js', byMap);
console.log(`${write ? 'SCRITTE' : 'ANTEPRIMA'}: ${total} coordinate, ${dropped} boschetti/zone spariti.`);
