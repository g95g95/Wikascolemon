// Prima sistemazione automatica delle mappe esterne: erba alta a chiazze e arredo.
// Scrive maps/zz_arredo.js (GENERATO), che si carica dopo tutte le mappe e ne sostituisce
// `encounterZones` e `decor`. I file maps/<id>.js scritti a mano non vengono toccati.
//
//   node tools/arreda-mappe.mjs
//
// È deterministico (stesso risultato a ogni lancio) e parte sempre dai dati scritti a mano, quindi
// si può rilanciare dopo aver cambiato una mappa. Regole:
// - erba alta: ogni zona d'incontro che sta quasi tutta sull'erba diventa un gruppo di chiazze che
//   ne copre circa il 40%; la probabilità per passo sale di metà per compensare. Le zone su sabbia,
//   riva o misto restano come sono.
// - arredo: fontana e panchine nelle piazze, tavolini davanti ai bar, fiori agli angoli delle case,
//   lampioni lungo le strade, alberi e cespugli sparsi nel verde (ulivi e cipressi in campagna),
//   ombrelloni e barche sulla spiaggia.
// - nessun oggetto finisce su strade, porte, passaggi, punti d'arrivo, NPC, allenatori o sulla loro
//   linea di sguardo, e nessuno può chiudere un passaggio: dopo ogni oggetto si ricontrolla che
//   tutte le celle raggiungibili prima lo siano ancora.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const gameDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = 'zz_arredo.js';

// --- carica i dati scritti a mano (senza il file generato) ---
const context = { window: {}, console };
vm.createContext(context);
const load = file => vm.runInContext(fs.readFileSync(path.join(gameDir, file), 'utf8'), context, { filename: file });
load('species.js');
load('moves.js');
load('maps/_helpers.js');
for (const name of fs.readdirSync(path.join(gameDir, 'maps')).filter(f => f.endsWith('.js') && f !== '_helpers.js' && f !== OUT).sort()) {
  if (fs.statSync(path.join(gameDir, 'maps', name)).size) load(`maps/${name}`);
}
load('data.js');
load('trainers.js');
for (const name of fs.readdirSync(path.join(gameDir, 'trainers')).filter(f => f.endsWith('.js')).sort()) {
  if (fs.statSync(path.join(gameDir, 'trainers', name)).size) load(`trainers/${name}`);
}
load('tiles.js');
const data = context.window.PokemonAscoliData;
const trainers = context.window.PokemonAscoliTrainers.trainers;
const Tiles = context.window.PokemonAscoliTiles;

const COUNTRY = new Set(['ripatransone', 'maltignano', 'spinetoli_centobuchi', 'marino_del_tronto', 'oasi', 'castel_di_lama']);
const BLOCKING_TERRAIN = new Set(['water', 'mare', 'muro', 'albero', 'binari']);
const inRect = (x, y, r) => x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h;
const key = (x, y) => `${x},${y}`;

function rngFor(text) {
  let state = 2166136261;
  for (const ch of text) state = Math.imul(state ^ ch.charCodeAt(0), 16777619);
  return () => {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// celle dove arriva qualcuno da un'altra mappa (passaggi e warp)
const arrivals = {};
const addArrival = (map, x, y) => { (arrivals[map] = arrivals[map] || []).push([x, y]); };
const scanScript = steps => {
  for (const step of steps || []) {
    if (step.warp) addArrival(step.warp.map, step.warp.x, step.warp.y);
    for (const k of ['then', 'else', 'onWin', 'onLose', 'onCatch', 'onOther']) if (Array.isArray(step[k])) scanScript(step[k]);
    if (step.options) step.options.forEach(option => scanScript(option.then));
  }
};
for (const map of Object.values(data.maps)) {
  (map.transitions || []).forEach(t => addArrival(t.to, t.spawnX, t.spawnY));
  (map.npcs || []).forEach(n => scanScript(n.script));
  (map.buildings || []).forEach(b => scanScript(b.script));
}
addArrival(data.start.map, data.start.x, data.start.y);
addArrival(data.respawn.map, data.respawn.x, data.respawn.y);

const report = [];
const result = {};

for (const [id, map] of Object.entries(data.maps)) {
  if (map.indoor) continue;
  const rand = rngFor(id);
  const pick = list => list[Math.floor(rand() * list.length)];
  const W = map.width, H = map.height;
  const terrain = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? null : Tiles.terrainAt(map, x, y));
  const inBuilding = (x, y) => (map.buildings || []).some(b => inRect(x, y, b));
  // un albero dei dati tolto dal disegno perché a ridosso di un edificio resta comunque fuori gioco
  const rawTree = (x, y) => (map.roads || []).some(r => r.type === 'albero' && inRect(x, y, r));

  // --- 1. erba alta a chiazze ---
  const zones = [];
  const grassBeds = [];
  let patched = 0;
  for (const z of map.encounterZones || []) {
    let grass = 0;
    for (let y = z.y; y < z.y + z.h; y += 1) for (let x = z.x; x < z.x + z.w; x += 1) if (terrain(x, y) === 'erba' && !inBuilding(x, y)) grass += 1;
    const area = z.w * z.h;
    if (area >= 80 && grass / area < .6) {
      // zona su selciato (Centro Storico): niente incontri senza erba, quindi ci si mettono delle
      // aiuole d'erba alta. Le zone su sabbia o pendio restano come sono.
      let wild = 0;
      for (let y = z.y; y < z.y + z.h; y += 1) for (let x = z.x; x < z.x + z.w; x += 1) if (['sabbia', 'pendio'].includes(terrain(x, y))) wild += 1;
      if (wild / area < .3) {
        patched += 1;
        const base = map.baseTile;
        const clear = (x0, y0, w, h) => {
          for (let y = y0 - 1; y <= y0 + h; y += 1) for (let x = x0 - 1; x <= x0 + w; x += 1) {
            if (terrain(x, y) !== base || inBuilding(x, y) || (map.transitions || []).some(t => inRect(x, y, t))) return false;
          }
          return !(map.buildings || []).some(b => x0 + w >= b.x - 1 && x0 <= b.x + b.w + 1 && y0 + h >= b.y - 1 && y0 <= b.y + b.h + 2);
        };
        const rate = Math.min(.15, Math.max(.1, z.rate * 3));
        for (let wanted = Math.max(3, Math.round(area / 450)), tries = 0; wanted > 0 && tries < 3000; tries += 1) {
          const w = 4 + Math.floor(rand() * 4), h = 3 + Math.floor(rand() * 3);
          const x0 = z.x + Math.floor(rand() * Math.max(1, z.w - w)), y0 = z.y + Math.floor(rand() * Math.max(1, z.h - h));
          if (!clear(x0, y0, w, h)) continue;
          const patch = { x: x0, y: y0, w, h, type: 'erba' };
          map.roads.unshift(patch);   // da qui in poi terrain() le vede come erba
          grassBeds.push(patch);
          zones.push({ x: x0, y: y0, w, h, rate, table: z.table });
          wanted -= 1;
        }
        continue;
      }
    }
    if (area < 80 || grass / area < .6) { zones.push(z); continue; }
    patched += 1;
    const covered = new Set();
    const rate = Math.min(.25, Math.round(z.rate * 150) / 100);
    for (let tries = 0; tries < 60 && covered.size < area * .4; tries += 1) {
      const cx = z.x + Math.floor(rand() * z.w), cy = z.y + Math.floor(rand() * z.h);
      for (let part = 0; part < 2 + Math.floor(rand() * 2); part += 1) {
        const w = 4 + Math.floor(rand() * 5), h = 3 + Math.floor(rand() * 4);
        const x0 = Math.max(z.x, cx - Math.floor(w / 2) + Math.floor(rand() * 5) - 2);
        const y0 = Math.max(z.y, cy - Math.floor(h / 2) + Math.floor(rand() * 5) - 2);
        const x1 = Math.min(z.x + z.w, x0 + w), y1 = Math.min(z.y + z.h, y0 + h);
        if (x1 - x0 < 2 || y1 - y0 < 2) continue;
        zones.push({ x: x0, y: y0, w: x1 - x0, h: y1 - y0, rate, table: z.table });
        for (let y = y0; y < y1; y += 1) for (let x = x0; x < x1; x += 1) covered.add(key(x, y));
      }
    }
  }
  const tall = (x, y) => terrain(x, y) === 'erba' && zones.some(z => inRect(x, y, z));

  // --- 2. arredo ---
  const reserved = new Set();
  const reserve = (x, y, radius = 0) => { for (let dy = -radius; dy <= radius; dy += 1) for (let dx = -radius; dx <= radius; dx += 1) reserved.add(key(x + dx, y + dy)); };
  (map.npcs || []).forEach(n => reserve(n.x, n.y, 1)); // gli NPC stanno fermi: basta lasciare libero il giro attorno
  Object.values(trainers).filter(t => t.map === id).forEach(t => {
    reserve(t.x, t.y, 1);
    const [dx, dy] = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[t.direction] || [0, 1];
    for (let step = 1; step <= (t.sight || 0) + 1; step += 1) reserve(t.x + dx * step, t.y + dy * step);
  });
  (map.buildings || []).forEach(b => { if (b.door) reserve(b.door.x, b.door.y); });
  (map.transitions || []).forEach(t => { for (let y = t.y - 1; y <= t.y + t.h; y += 1) for (let x = t.x - 1; x <= t.x + t.w; x += 1) reserve(x, y); });
  (arrivals[id] || []).forEach(([x, y]) => reserve(x, y, 1));

  // celle dove sta qualcuno o dove si arriva: lì non va mai niente, nemmeno i cartelli
  const occupied = new Set();
  (map.npcs || []).forEach(n => occupied.add(key(n.x, n.y)));
  Object.values(trainers).filter(t => t.map === id).forEach(t => occupied.add(key(t.x, t.y)));
  (map.buildings || []).forEach(b => { if (b.door) occupied.add(key(b.door.x, b.door.y)); });
  (map.transitions || []).forEach(t => { for (let y = t.y; y < t.y + t.h; y += 1) for (let x = t.x; x < t.x + t.w; x += 1) occupied.add(key(x, y)); });
  (arrivals[id] || []).forEach(([x, y]) => occupied.add(key(x, y)));

  const decor = [];
  const taken = new Set();
  const blockedCell = (x, y) => terrain(x, y) === null || BLOCKING_TERRAIN.has(terrain(x, y)) || inBuilding(x, y) || taken.has(key(x, y));
  const reachable = () => {
    const seen = new Set();
    const queue = [];
    for (const [x, y] of arrivals[id] || []) if (!blockedCell(x, y) && !seen.has(key(x, y))) { seen.add(key(x, y)); queue.push([x, y]); }
    while (queue.length) {
      const [x, y] = queue.pop();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy, k = key(nx, ny);
        if (seen.has(k) || blockedCell(nx, ny)) continue;
        seen.add(k);
        queue.push([nx, ny]);
      }
    }
    return seen.size;
  };
  let open = reachable();

  function place(kind, x, y, allowed, text, anywhere = false) {
    const info = Tiles.DECOR_KINDS[kind];
    const cells = Array.from({ length: info.span || 1 }, (_, i) => [x + i, y]);
    for (const [cx, cy] of cells) {
      if (!allowed.includes(terrain(cx, cy)) || inBuilding(cx, cy) || rawTree(cx, cy) || (!anywhere && reserved.has(key(cx, cy))) || occupied.has(key(cx, cy)) || taken.has(key(cx, cy)) || tall(cx, cy)) return false;
    }
    if (!text && decor.some(item => item.y === y && Math.abs(item.x - x) < 3)) return false; // niente oggetti incollati (i cartelli fanno eccezione)
    if (info.blocks) {
      cells.forEach(([cx, cy]) => taken.add(key(cx, cy)));
      const after = reachable();
      if (after !== open - cells.length) { cells.forEach(([cx, cy]) => taken.delete(key(cx, cy))); return false; }
      open = after;
    }
    decor.push(text ? { x, y, kind, text } : { x, y, kind });
    return true;
  }

  // cartelli: uno accanto alla porta di ogni edificio che ha un nome proprio (le «Casa …» no).
  // Vanno piazzati per primi, prima di riservare il giro attorno alle porte.
  const anyGround = ['erba', 'road', 'piazza', 'ghiaia', 'travertino', 'asfalto', 'sabbia', 'pendio'];
  let unsigned = 0;
  for (const b of map.buildings || []) {
    if (!b.name || /^casa\b/i.test(b.name)) continue;
    const front = b.y + b.h;
    // a due celle dalla porta, non attaccato: altrimenti il cartello copre l'ingresso
    const doorX = b.door ? b.door.x : Math.floor(b.x + b.w / 2);
    const spots = [doorX - 2, doorX + 2, doorX - 3, doorX + 3, b.x, b.x + b.w - 1];
    if (!spots.some(x => place('cartello', x, front, anyGround, b.name, true))) unsigned += 1;
  }
  // cartelli al posto delle scritte: uno accanto a ogni passaggio (dice dove porta) e uno per ogni
  // nome di luogo della mappa. Mai sulla strada: accanto.
  const beside = ['erba', 'sabbia', 'ghiaia', 'piazza', 'travertino', 'pendio'];
  for (const t of map.transitions || []) {
    if (!t.label) continue;
    const spots = [];
    for (let x = t.x - 1; x <= t.x + t.w; x += 1) { spots.push([x, t.y - 1], [x, t.y + t.h]); }
    for (let y = t.y; y < t.y + t.h; y += 1) { spots.push([t.x - 1, y], [t.x + t.w, y]); }
    for (let ring = 2; ring <= 3; ring += 1) for (let x = t.x - ring; x <= t.x + t.w + ring - 1; x += 1) spots.push([x, t.y - ring], [x, t.y + t.h + ring - 1]);
    if (!spots.some(([x, y]) => place('cartello', x, y, beside, `→ ${t.label}`, true))) unsigned += 1;
  }
  for (const label of map.labels || []) {
    const spots = [];
    for (let ring = 0; ring <= 3; ring += 1) for (let dy = -ring; dy <= ring; dy += 1) for (let dx = -ring; dx <= ring; dx += 1) spots.push([label.x + dx, label.y + dy]);
    if (!spots.some(([x, y]) => place('cartello', x, y, beside, label.text, true))) unsigned += 1;
  }
  (map.buildings || []).forEach(b => { if (b.door) reserve(b.door.x, b.door.y, 1); });

  // piazze: fontana al centro, panchine in alto
  for (const p of map.plazas || []) {
    if (p.w >= 6 && p.h >= 5) place('fontana', p.x + Math.floor(p.w / 2) - 1, p.y + Math.floor(p.h / 2), ['piazza']);
    if (p.w >= 8 && p.h >= 4) { place('panchina', p.x + 1, p.y + 1, ['piazza']); place('panchina', p.x + p.w - 3, p.y + 1, ['piazza']); }
  }
  // edifici: tavolini davanti ai bar, fiori agli angoli
  for (const b of map.buildings || []) {
    if (b.kind === 'stadio') continue;
    const front = b.y + b.h;
    if (b.interior === 'bar' && b.door) { place('tavolino', b.door.x + 2, front, ['erba', 'road', 'piazza', 'ghiaia', 'travertino']); place('tavolino', b.door.x - 3, front, ['erba', 'road', 'piazza', 'ghiaia', 'travertino']); }
    place('fiori', b.x, front, ['erba']);
    place('fiori', b.x + b.w - 1, front, ['erba']);
  }
  // strade: lampioni a lati alterni
  for (const r of map.roads || []) {
    if (!['road', 'asfalto', undefined].includes(r.type)) continue;
    const horizontal = r.w >= r.h;
    if (Math.max(r.w, r.h) < 12) continue;
    let side = 0;
    for (let at = 4; at < (horizontal ? r.w : r.h) - 2; at += 9) {
      const x = horizontal ? r.x + at : (side ? r.x + r.w : r.x - 1);
      const y = horizontal ? (side ? r.y + r.h : r.y - 1) : r.y + at;
      if (place('lampione', x, y, ['erba'])) side = 1 - side;
    }
  }
  // verde: alberi e cespugli lontani da strade ed edifici
  const kinds = COUNTRY.has(id) ? ['ulivo', 'ulivo', 'cipresso', 'cespuglio', 'masso', 'fiori'] : ['cespuglio', 'cipresso', 'cespuglio', 'fiori', 'siepe', 'cipresso'];
  const quiet = (x, y) => { for (let dy = -1; dy <= 1; dy += 1) for (let dx = -1; dx <= 2; dx += 1) if (terrain(x + dx, y + dy) !== 'erba' || inBuilding(x + dx, y + dy)) return false; return true; };
  let free = 0;
  for (let y = 0; y < H; y += 1) for (let x = 0; x < W; x += 1) if (terrain(x, y) === 'erba' && !inBuilding(x, y) && !tall(x, y)) free += 1;
  for (let wanted = Math.floor(free / 55), tries = 0; wanted > 0 && tries < 4000; tries += 1) {
    const x = 2 + Math.floor(rand() * (W - 5)), y = 3 + Math.floor(rand() * (H - 5));
    if (quiet(x, y) && place(pick(kinds), x, y, ['erba'])) wanted -= 1;
  }
  // spiaggia: ombrelloni in fila, barche a riva
  const sand = [];
  for (let y = 0; y < H; y += 1) for (let x = 0; x < W; x += 1) if (terrain(x, y) === 'sabbia') sand.push([x, y]);
  if (sand.length > 200) {
    const top = Math.min(...sand.map(([, y]) => y)), bottom = Math.max(...sand.map(([, y]) => y));
    for (const row of [top + 2, top + 5]) for (let x = 6; x < W - 6; x += 7) if (row < bottom - 1) place('ombrellone', x + Math.floor(rand() * 2), row, ['sabbia']);
    for (let n = 0, tries = 0; n < 3 && tries < 200; tries += 1) { const x = 4 + Math.floor(rand() * (W - 9)); if (place('barca', x, bottom, ['sabbia'])) n += 1; }
  }

  decor.sort((a, b) => a.y - b.y || a.x - b.x);
  result[id] = { zones, decor, grassBeds };
  const byKind = {};
  decor.forEach(item => { byKind[item.kind] = (byKind[item.kind] || 0) + 1; });
  report.push(`${id.padEnd(22)} zone ${(map.encounterZones || []).length} → ${zones.length} (${patched} a chiazze) · ${unsigned ? `⚠️ ${unsigned} cartelli non piazzati · ` : ''}arredo ${decor.length}: ${Object.entries(byKind).map(([k, n]) => `${k} ${n}`).join(', ')}`);
}

// --- scrive il file generato ---
const lines = [
  '// GENERATO da tools/arreda-mappe.mjs — non modificare a mano: si rigenera con',
  '//   node tools/arreda-mappe.mjs',
  '// Si carica dopo tutte le mappe e ne sostituisce erba alta (encounterZones, a chiazze) e arredo (decor).',
  '(function () {',
  '  const { zone, rect } = window.PokemonAscoliMapHelpers;',
  '  const maps = window.PokemonAscoliMaps;',
  '  const apply = (id, extra) => { if (maps[id]) Object.assign(maps[id], extra); };',
  '  const d = (x, y, kind, text) => (text ? { x, y, kind, text } : { x, y, kind });',
];
for (const [id, { zones, decor, grassBeds }] of Object.entries(result)) {
  if (grassBeds.length) lines.push(`  if (maps.${id}) maps.${id}.roads.unshift(${grassBeds.map(g => `rect(${g.x}, ${g.y}, ${g.w}, ${g.h}, 'erba')`).join(', ')}); // aiuole`);
  lines.push(`  apply('${id}', {`);
  lines.push(`    encounterZones: [${zones.map(z => `zone(${z.x}, ${z.y}, ${z.w}, ${z.h}, ${z.rate}, '${z.table}')`).join(', ')}],`);
  lines.push(`    decor: [${decor.map(item => `d(${item.x}, ${item.y}, '${item.kind}'${item.text ? `, ${JSON.stringify(item.text)}` : ''})`).join(', ')}]`);
  lines.push('  });');
}
lines.push('}());', '');
fs.writeFileSync(path.join(gameDir, 'maps', OUT), lines.join('\n'));
console.log(report.join('\n'));
console.log(`OK maps/${OUT}`);
