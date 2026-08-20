import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { GAME_FILES } from '../tools/build-gioco.mjs';
import { loadGame, gameDir, mapModuleFiles, trainerModuleFiles, inRect, walkable } from './_load.mjs';

const { data, trainersData, Events } = loadGame();

assert.ok(Object.keys(data.maps).length >= 7, 'Devono esistere almeno sette quartieri');
assert.deepEqual(Array.from(data.starters), ['basilino', 'puledrotto', 'tuffito']);
assert.equal(data.start.map, 'porta_maggiore');

const insideMap = (map, item) => item.x >= 0 && item.y >= 0 && item.x + (item.w || 1) <= map.width && item.y + (item.h || 1) <= map.height;

// Un edificio della mappa destinazione con uno script che contiene un warp verso questa mappa
// conta come collegamento di ritorno, anche senza una transition esplicita (es. interni).
function scriptWarpsTo(script, targetMapId) {
  for (const step of script || []) {
    if (!step || typeof step !== 'object') continue;
    if (step.warp && step.warp.map === targetMapId) return true;
    if ('choice' in step) { for (const option of step.options || []) if (scriptWarpsTo(option.then, targetMapId)) return true; }
    if ('if' in step) { if (scriptWarpsTo(step.then, targetMapId) || scriptWarpsTo(step.else, targetMapId)) return true; }
    if ('wildBattle' in step) { if (scriptWarpsTo(step.onCatch, targetMapId) || scriptWarpsTo(step.onOther, targetMapId)) return true; }
    if ('battleTrainer' in step) { if (scriptWarpsTo(step.onWin, targetMapId) || scriptWarpsTo(step.onLose, targetMapId)) return true; }
  }
  return false;
}
function hasReturnLink(fromMapId, toMap) {
  if (toMap.transitions.some(back => back.to === fromMapId)) return true;
  return (toMap.buildings || []).some(building => building.script && scriptWarpsTo(building.script, fromMapId));
}

for (const point of [data.start, data.respawn]) assert.ok(walkable(data.maps[point.map], point.x, point.y), 'Punto di partenza percorribile');

for (const [mapId, map] of Object.entries(data.maps)) {
  if (map.indoor) {
    assert.ok(map.width >= 12 && map.width <= 60 && map.height >= 10 && map.height <= 40, `${mapId}: dimensioni interne fra 12×10 e 60×40`);
  } else {
    assert.ok(map.width >= 120 && map.width <= 180 && map.height >= 90 && map.height <= 120, `${mapId}: dimensioni fra 120×90 e 180×120 (scala Gen 3 ×3)`);
  }
  for (const key of ['roads', 'waters', 'bridges', 'plazas', 'buildings', 'encounterZones', 'transitions', 'npcs']) {
    for (const item of map[key] || []) assert.ok(insideMap(map, item), `${mapId}: ${key} dentro la mappa`);
  }
  for (const item of map.npcs) assert.ok(walkable(map, item.x, item.y), `${mapId}: NPC ${item.name} su cella percorribile`);
  assert.ok(Array.isArray(map.transitions) && map.transitions.length > 0, `${mapId}: almeno un passaggio`);
  if (map.indoor) {
    assert.ok(Array.isArray(map.encounterTable), `${mapId}: tabella incontri (array, anche vuoto per interni)`);
  } else {
    assert.ok(Array.isArray(map.encounterTable) && map.encounterTable.length > 0, `${mapId}: tabella incontri`);
  }
  for (const exit of map.transitions) {
    assert.ok(data.maps[exit.to], `${mapId}: destinazione ${exit.to} esistente`);
    assert.ok(exit.spawnX >= 0 && exit.spawnX < data.maps[exit.to].width, `${mapId}: spawn X valido`);
    assert.ok(exit.spawnY >= 0 && exit.spawnY < data.maps[exit.to].height, `${mapId}: spawn Y valido`);
    assert.ok(walkable(data.maps[exit.to], exit.spawnX, exit.spawnY), `${mapId}: arrivo in ${exit.to} su cella percorribile`);
    assert.ok(!data.maps[exit.to].transitions.some(back => inRect(exit.spawnX, exit.spawnY, back)), `${mapId}: arrivo in ${exit.to} fuori dai passaggi`);
    assert.ok(hasReturnLink(mapId, data.maps[exit.to]), `${mapId}: collegamento reciproco con ${exit.to}`);
  }
  for (const encounter of map.encounterTable) {
    assert.ok(data.species[encounter.species], `${mapId}: specie ${encounter.species} esistente`);
    assert.ok(encounter.minLevel >= 1 && encounter.maxLevel >= encounter.minLevel, `${mapId}: livelli validi`);
    assert.ok(encounter.weight > 0, `${mapId}: peso valido`);
  }
}

// --- raggiungibilità a piedi (BFS): da data.start si deve poter raggiungere ogni npc,
// allenatore, door e transition di ogni mappa a sua volta raggiungibile, muovendosi sulle
// celle walkable e attraversando le transitions verso il loro spawn (ignorando i "when").
function reachableCells(mapId, startX, startY) {
  const map = data.maps[mapId];
  const visited = new Set([`${startX},${startY}`]);
  const queue = [[startX, startY]];
  const crossedTransitions = [];
  while (queue.length) {
    const [x, y] = queue.shift();
    for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
      const nx = x + dx, ny = y + dy;
      const key = `${nx},${ny}`;
      if (visited.has(key) || !walkable(map, nx, ny)) continue;
      visited.add(key);
      queue.push([nx, ny]);
      const exit = (map.transitions || []).find(t => inRect(nx, ny, t));
      if (exit && data.maps[exit.to]) crossedTransitions.push(exit);
    }
  }
  return { visited, crossedTransitions };
}

const visitedMaps = new Set();
const mapQueue = [[data.start.map, data.start.x, data.start.y]];
while (mapQueue.length) {
  const [mapId, startX, startY] = mapQueue.shift();
  if (visitedMaps.has(mapId)) continue;
  visitedMaps.add(mapId);
  const map = data.maps[mapId];
  const { visited, crossedTransitions } = reachableCells(mapId, startX, startY);
  const isReached = (x, y) => [-1, 0, 1].some(dx => [-1, 0, 1].some(dy => visited.has(`${x + dx},${y + dy}`)));
  for (const item of map.npcs || []) assert.ok(isReached(item.x, item.y), `${mapId}: npc ${item.name} raggiungibile a piedi da start`);
  for (const [id, trainer] of Object.entries(trainersData.trainers)) {
    if (trainer.map === mapId) assert.ok(isReached(trainer.x, trainer.y), `${mapId}: allenatore ${id} raggiungibile a piedi da start`);
  }
  for (const building of map.buildings || []) {
    if (building.door) assert.ok(isReached(building.door.x, building.door.y), `${mapId}: door ${building.name} raggiungibile a piedi da start`);
  }
  for (const exit of map.transitions || []) assert.ok(isReached(exit.x, exit.y) || isReached(exit.x + exit.w - 1, exit.y + exit.h - 1), `${mapId}: passaggio verso ${exit.to} raggiungibile a piedi da start`);
  for (const exit of crossedTransitions) mapQueue.push([exit.to, exit.spawnX, exit.spawnY]);
}
assert.equal(visitedMaps.size, Object.keys(data.maps).length, `Tutte le mappe devono essere raggiungibili da data.start (raggiunte: ${[...visitedMaps].join(', ')})`);

// Sprite disponibili solo per gli starter e per le specie usate nelle tabelle incontri delle
// mappe: le altre specie generate dalla wiki non hanno ancora sprite (verranno fatti in un
// secondo momento). Non falliamo per queste, ma segnaliamo quante mancano.
const spritesRequiredFor = new Set(data.starters);
for (const map of Object.values(data.maps)) {
  for (const encounter of map.encounterTable) spritesRequiredFor.add(encounter.species);
}

const dexReportPath = path.join(gameDir, 'tools', 'dex-report.json');
const dexReport = fs.existsSync(dexReportPath) ? JSON.parse(fs.readFileSync(dexReportPath, 'utf8')) : null;

const seenNumbers = new Map();
let missingSpriteCount = 0;
let missingDraftCount = 0;
for (const [speciesId, species] of Object.entries(data.species)) {
  assert.equal(species.base.length, 6, `${speciesId}: sei statistiche`);
  assert.ok(species.learnset.length > 0, `${speciesId}: learnset presente`);
  assert.ok(fs.existsSync(path.join(gameDir, '..', '..', 'Wikascolemon', `${speciesId}.html`)), `${speciesId}: scheda pubblicata presente in Wikascolemon/`);
  // La copia "bozza" in schede _Pokemon/ può essere disallineata dal nome file pubblicato
  // (es. segaccio_6.html vs segaccio.html): non è un errore di dati, si segnala soltanto.
  if (!fs.existsSync(path.resolve(gameDir, species.wiki))) missingDraftCount += 1;

  assert.ok(!seenNumbers.has(species.number), `${speciesId}: numero Pokédex ${species.number} duplicato (già usato da ${seenNumbers.get(species.number)})`);
  seenNumbers.set(species.number, speciesId);

  const sum = species.base.reduce((a, b) => a + b, 0);
  if (dexReport) {
    const reportEntry = dexReport.species.find(s => s.id === speciesId);
    if (reportEntry) assert.equal(sum, reportEntry.statTotal, `${speciesId}: somma statistiche (${sum}) diversa dal Totale della wiki (${reportEntry.statTotal})`);
  }

  if (spritesRequiredFor.has(speciesId)) {
    for (const direction of ['front', 'back']) {
      assert.ok(fs.existsSync(path.join(gameDir, 'assets', 'battle', `${speciesId}-${direction}.png`)), `${speciesId}: sprite ${direction}`);
    }
  } else {
    for (const direction of ['front', 'back']) {
      if (!fs.existsSync(path.join(gameDir, 'assets', 'battle', `${speciesId}-${direction}.png`))) missingSpriteCount += 1;
    }
  }

  for (const [, moveId] of species.learnset) assert.ok(data.moves[moveId], `${speciesId}: mossa ${moveId} definita`);
  if (species.evolution && species.evolution.into) {
    assert.ok(data.species[species.evolution.into], `${speciesId}: evolution.into "${species.evolution.into}" esistente`);
  }
}
console.log(`Sprite mancanti (specie non ancora in gioco): ${missingSpriteCount}`);
console.log(`Bozze disallineate in "schede _Pokemon/" (nome file diverso dal pubblicato): ${missingDraftCount}`);

const playerSheet = path.join(gameDir, 'assets', 'player', 'oliver-sheet.png');
assert.ok(fs.existsSync(playerSheet), 'Foglio sprite di Oliver presente');

const requiredLandmarks = {
  centro_storico: ['Palazzo dei Capitani', 'Teatro Ventidio Basso', 'Cattedrale di Sant’Emidio', 'Battistero'],
  porta_maggiore: ['Stazione ferroviaria', 'Chiesa dell’Immacolata'],
  monticelli: ['Ospedale Mazzoni', 'Little Bar', 'Benzinaio', 'Pizzeria Mosè'],
  campo_parignano: ['Cinema Odeon', 'Chiesa del Sacro Cuore', 'Sant’Emidio alle Grotte'],
  borgo_chiaro: ['Stadio Cino e Lillo Del Duca']
};
for (const [mapId, landmarks] of Object.entries(requiredLandmarks)) {
  const names = data.maps[mapId].buildings.map(item => item.name);
  for (const landmark of landmarks) assert.ok(names.includes(landmark), `${mapId}: landmark ${landmark}`);
}

// I file vuoti in maps/ e trainers/ sono stub predisposti per agenti futuri (flottiglia mappe):
// non devono essere caricati né referenziati finché restano vuoti.
const expectedModuleFiles = [...mapModuleFiles(), ...trainerModuleFiles()].map(file => file.replace(/\\/g, '/'));

for (const htmlName of ['index.html', 'configuratore.html']) {
  const html = fs.readFileSync(path.join(gameDir, htmlName), 'utf8');
  const referencedScripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(match => match[1]);
  for (const script of referencedScripts) {
    assert.ok(fs.existsSync(path.join(gameDir, script)), `${htmlName}: script ${script} presente`);
  }
  for (const style of [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(match => match[1])) {
    assert.ok(fs.existsSync(path.join(gameDir, style)), `${htmlName}: stile ${style} presente`);
  }
  for (const moduleFile of expectedModuleFiles) {
    assert.ok(referencedScripts.includes(moduleFile), `${htmlName}: ${moduleFile} deve essere referenziato con <script src>`);
  }
}

const styles = fs.readFileSync(path.join(gameDir, 'styles.css'), 'utf8');
assert.match(styles, /\.enemy-sprite\s*\{[^}]*left:\s*28px;/, 'Il Pokémon selvatico deve apparire a sinistra');
assert.match(styles, /\.ally-sprite\s*\{[^}]*right:\s*28px;/, 'Il Pokémon della squadra deve apparire a destra');
assert.match(styles, /\.enemy-card\s*\{[^}]*left:\s*10px;/, 'La scheda del selvatico deve apparire accanto al selvatico');
assert.match(styles, /\.ally-card\s*\{[^}]*right:\s*10px;/, 'La scheda della squadra deve apparire accanto al Pokémon della squadra');

// --- door/interior/script/when sulle mappe ---
const validInteriors = new Set(['bar', 'market', 'gym', 'none']);
for (const [mapId, map] of Object.entries(data.maps)) {
  for (const building of map.buildings || []) {
    if (building.door) {
      const door = building.door;
      assert.ok(Number.isFinite(door.x) && Number.isFinite(door.y), `${mapId}: ${building.name} door con coordinate valide`);
      assert.ok(walkable(map, door.x, door.y), `${mapId}: ${building.name} door su cella percorribile`);
      const adjacent = door.x >= building.x - 1 && door.x <= building.x + building.w
        && door.y >= building.y - 1 && door.y <= building.y + building.h;
      assert.ok(adjacent, `${mapId}: ${building.name} door adiacente all'edificio`);
    }
    if (building.interior !== undefined) {
      assert.ok(validInteriors.has(building.interior), `${mapId}: ${building.name} interior "${building.interior}" fra i valori ammessi`);
    }
    if (building.script) {
      const errors = Events.validateScript(building.script, [], `${mapId}.${building.name}.script`);
      assert.deepEqual(errors, [], `${mapId}: ${building.name} script valido (${errors.join('; ')})`);
    }
  }
  for (const npcItem of map.npcs || []) {
    if (npcItem.script) {
      const errors = Events.validateScript(npcItem.script, [], `${mapId}.npc(${npcItem.name}).script`);
      assert.deepEqual(errors, [], `${mapId}: npc ${npcItem.name} script valido (${errors.join('; ')})`);
    }
    if (npcItem.when !== undefined && npcItem.when !== null) {
      assert.doesNotThrow(() => Events.check(npcItem.when, { flags: {}, badges: [], items: {}, money: 0 }), `${mapId}: npc ${npcItem.name} when valutabile`);
    }
  }
  for (const exit of map.transitions || []) {
    if (exit.when !== undefined && exit.when !== null) {
      assert.doesNotThrow(() => Events.check(exit.when, { flags: {}, badges: [], items: {}, money: 0 }), `${mapId}: transizione verso ${exit.to} when valutabile`);
    }
  }
}

// --- id allenatori referenziati nelle mappe (npc.script battleTrainer / building.script) devono esistere ---
function collectTrainerIds(script, out) {
  for (const step of script || []) {
    if (!step || typeof step !== 'object') continue;
    if ('battleTrainer' in step) out.add(step.battleTrainer);
    if ('choice' in step) for (const option of step.options || []) collectTrainerIds(option.then, out);
    if ('if' in step) { collectTrainerIds(step.then, out); collectTrainerIds(step.else, out); }
    if ('wildBattle' in step) { collectTrainerIds(step.onCatch, out); collectTrainerIds(step.onOther, out); }
    if ('battleTrainer' in step) { collectTrainerIds(step.onWin, out); collectTrainerIds(step.onLose, out); }
  }
}
const referencedTrainerIds = new Set();
for (const map of Object.values(data.maps)) {
  for (const npcItem of map.npcs || []) if (npcItem.script) collectTrainerIds(npcItem.script, referencedTrainerIds);
  for (const building of map.buildings || []) if (building.script) collectTrainerIds(building.script, referencedTrainerIds);
}
for (const trainerId of referencedTrainerIds) {
  assert.ok(trainersData.trainers[trainerId], `allenatore referenziato "${trainerId}" esistente in trainers.js`);
}

// --- Wikascolemon/gioco/ deve essere identica ai sorgenti (nessuno la edita a mano) ---
const wikiGiocoDir = path.resolve(gameDir, '..', '..', 'Wikascolemon', 'gioco');
if (fs.existsSync(wikiGiocoDir)) {
  function compareRecursive(name, src, dest) {
    const srcStat = fs.statSync(src);
    if (srcStat.isDirectory()) {
      for (const entry of fs.readdirSync(src)) {
        compareRecursive(`${name}/${entry}`, path.join(src, entry), path.join(dest, entry));
      }
      return;
    }
    assert.ok(fs.existsSync(dest), `Wikascolemon/gioco/${name} diverso dal sorgente: rilancia node tools/build-gioco.mjs`);
    const srcBuf = fs.readFileSync(src);
    const destBuf = fs.readFileSync(dest);
    assert.ok(srcBuf.equals(destBuf), `Wikascolemon/gioco/${name} diverso dal sorgente: rilancia node tools/build-gioco.mjs`);
  }
  for (const name of GAME_FILES) {
    const src = path.join(gameDir, name);
    if (!fs.existsSync(src)) continue;
    compareRecursive(name, src, path.join(wikiGiocoDir, name));
  }
}

console.log(`OK: ${Object.keys(data.maps).length} mappe, ${Object.keys(data.species).length} Pokémon, ${Object.keys(data.moves).length} mosse.`);
