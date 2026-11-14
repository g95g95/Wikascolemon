// Riduce le mappe ESTERNE di un fattore n/d. Gli interni (palestra_*) non si toccano. Riscrive i
// sorgenti sul posto conservando commenti e struttura: cambia solo i numeri.
//
//   node tools/scala-mappe.mjs 3/4          # anteprima: conta le sostituzioni
//   node tools/scala-mappe.mjs 3/4 --scrivi # riscrive i file
//
// ⚠️ Ogni lancio con --scrivi riduce ancora: non è idempotente. Dopo, vanno fatti a mano:
// limiti di misura in tests/regression.mjs, chiavi ConfigVn/TrainersVn e passo `mapScale` in game.js,
// `node tools/arreda-mappe.mjs`, e il controllo dei pochi punti che finiscono sovrapposti.
//
// Storia (14/11/2026, «le mappe sono enormi»): 2/3 → 96×72 e 120×80; poi 3/4 → 72×54 e 90×60.
//
// Regola unica per bordi e celle: S(v) = floor((n·v + floor(d/2)) / d).
// - rettangoli (rect, zone, building, transition): si trasformano i due bordi, così ciò che si
//   toccava continua a toccarsi; larghezza e altezza minime 1.
// - celle puntuali (npc, allenatori, door, label, spawn, warp, start): S(x), S(y). La cella davanti
//   a una porta resta la prima fuori dall'edificio, perché coincide col bordo trasformato.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const gameDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const write = process.argv.includes('--scrivi');
const factor = (process.argv.find(arg => /^\d+\/\d+$/.test(arg)) || '').split('/').map(Number);
if (factor.length !== 2 || factor[0] >= factor[1]) { console.error('Uso: node tools/scala-mappe.mjs <n/d> [--scrivi]   (es. 3/4)'); process.exit(1); }
const [NUM, DEN] = factor;
const S = v => Math.floor((NUM * Number(v) + Math.floor(DEN / 2)) / DEN);
const span = (start, size) => [S(start), Math.max(1, S(Number(start) + Number(size)) - S(start))];
const isInterior = id => id.startsWith('palestra_');
const N = '(\\d+)';
const SEP = '\\s*,\\s*';
let total = 0;

function rewrite(file, transform) {
  const full = path.join(gameDir, file);
  const before = fs.readFileSync(full, 'utf8');
  if (!before.trim()) return;
  let count = 0;
  const after = transform(before, () => { count += 1; });
  total += count;
  console.log(`${file.padEnd(36)} ${count} sostituzioni`);
  if (write && after !== before) fs.writeFileSync(full, after);
}

function scaleRects(text, hit) {
  // rect(x, y, w, h…  zone(…  building(…
  text = text.replace(new RegExp(`\\b(rect|zone|building)\\(\\s*${N}${SEP}${N}${SEP}${N}${SEP}${N}`, 'g'), (_, fn, x, y, w, h) => {
    hit();
    const [nx, nw] = span(x, w);
    const [ny, nh] = span(y, h);
    return `${fn}(${nx}, ${ny}, ${nw}, ${nh}`;
  });
  return text;
}

for (const name of fs.readdirSync(path.join(gameDir, 'maps')).filter(f => f.endsWith('.js') && f !== '_helpers.js')) {
  const mapId = name.replace(/\.js$/, '');
  rewrite(`maps/${name}`, (text, hit) => {
    const outdoor = !isInterior(mapId);
    // 1. warp verso un'altra mappa: conta la mappa di arrivo. Segnaposto per non ripassarci sopra.
    text = text.replace(new RegExp(`warp:\\s*\\{\\s*map:\\s*'(\\w+)'${SEP}x:\\s*${N}${SEP}y:\\s*${N}`, 'g'), (_, to, x, y) => {
      if (isInterior(to)) return `warp: { map: '${to}', x§ ${x}, y§ ${y}`;
      hit();
      return `warp: { map: '${to}', x§ ${S(x)}, y§ ${S(y)}`;
    });
    // 2. transition(x, y, w, h, 'to', spawnX, spawnY: il rettangolo segue questa mappa, l'arrivo l'altra
    text = text.replace(new RegExp(`\\btransition\\(\\s*${N}${SEP}${N}${SEP}${N}${SEP}${N}${SEP}'(\\w+)'${SEP}${N}${SEP}${N}`, 'g'), (_, x, y, w, h, to, sx, sy) => {
      hit();
      const [nx, nw] = outdoor ? span(x, w) : [x, w];
      const [ny, nh] = outdoor ? span(y, h) : [y, h];
      const [nsx, nsy] = isInterior(to) ? [sx, sy] : [S(sx), S(sy)];
      return `transition(${nx}, ${ny}, ${nw}, ${nh}, '${to}', ${nsx}, ${nsy}`;
    });
    if (outdoor) {
      text = scaleRects(text, hit);
      text = text.replace(new RegExp(`\\bnpc\\(\\s*${N}${SEP}${N}`, 'g'), (_, x, y) => { hit(); return `npc(${S(x)}, ${S(y)}`; });
      // 3. tutte le altre coppie x: N, y: N di una mappa esterna sono celle sue (door, label, npc scritti a mano)
      text = text.replace(new RegExp(`\\bx:\\s*${N}${SEP}y:\\s*${N}`, 'g'), (_, x, y) => { hit(); return `x: ${S(x)}, y: ${S(y)}`; });
    }
    return text.replace(/x§/g, 'x:').replace(/y§/g, 'y:');
  });
}

rewrite('maps/_helpers.js', (text, hit) => text.replace(new RegExp(`\\b(city|wide|tall) = \\{ width: ${N}, height: ${N} \\}`, 'g'), (_, name, w, h) => {
  hit();
  return `${name} = { width: ${S(w)}, height: ${S(h)} }`;
}));

// allenatori e punti di partenza: map: 'id', x: N, y: N
const byMap = (text, hit) => text.replace(new RegExp(`map:\\s*'(\\w+)'${SEP}x:\\s*${N}${SEP}y:\\s*${N}`, 'g'), (whole, map, x, y) => {
  if (isInterior(map)) return whole;
  hit();
  return `map: '${map}', x: ${S(x)}, y: ${S(y)}`;
});
for (const name of fs.readdirSync(path.join(gameDir, 'trainers')).filter(f => f.endsWith('.js'))) rewrite(`trainers/${name}`, byMap);
rewrite('trainers.js', byMap);
rewrite('data.js', byMap);

console.log(`${write ? 'SCRITTE' : 'ANTEPRIMA'}: ${total} sostituzioni in tutto.`);
