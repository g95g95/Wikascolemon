import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const gameDir = path.resolve(testDir, '..');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(gameDir, 'species.js'), 'utf8'), context);
vm.runInNewContext(fs.readFileSync(path.join(gameDir, 'moves.js'), 'utf8'), context);
vm.runInNewContext(fs.readFileSync(path.join(gameDir, 'data.js'), 'utf8'), context);
const data = context.window.PokemonAscoliData;

assert.equal(Object.keys(data.maps).length, 7, 'Devono esistere sette quartieri');
assert.deepEqual(Array.from(data.starters), ['basilino', 'puledrotto', 'tuffito']);
assert.equal(data.start.map, 'porta_maggiore');

const inRect = (x, y, item) => x >= item.x && y >= item.y && x < item.x + item.w && y < item.y + item.h;
const walkable = (map, x, y) => {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return false;
  if (map.buildings.some(item => inRect(x, y, item))) return false;
  if (map.bridges.some(item => inRect(x, y, item))) return true;
  return !map.waters.some(item => inRect(x, y, item));
};
const insideMap = (map, item) => item.x >= 0 && item.y >= 0 && item.x + (item.w || 1) <= map.width && item.y + (item.h || 1) <= map.height;

for (const point of [data.start, data.respawn]) assert.ok(walkable(data.maps[point.map], point.x, point.y), 'Punto di partenza percorribile');

for (const [mapId, map] of Object.entries(data.maps)) {
  assert.ok(map.width >= 40 && map.width <= 60 && map.height >= 30 && map.height <= 40, `${mapId}: dimensioni fra 40×30 e 60×40 (scala Gen 3)`);
  for (const key of ['roads', 'waters', 'bridges', 'plazas', 'buildings', 'encounterZones', 'transitions', 'npcs']) {
    for (const item of map[key] || []) assert.ok(insideMap(map, item), `${mapId}: ${key} dentro la mappa`);
  }
  for (const item of map.npcs) assert.ok(walkable(map, item.x, item.y), `${mapId}: NPC ${item.name} su cella percorribile`);
  assert.ok(Array.isArray(map.transitions) && map.transitions.length > 0, `${mapId}: almeno un passaggio`);
  assert.ok(Array.isArray(map.encounterTable) && map.encounterTable.length > 0, `${mapId}: tabella incontri`);
  for (const exit of map.transitions) {
    assert.ok(data.maps[exit.to], `${mapId}: destinazione ${exit.to} esistente`);
    assert.ok(exit.spawnX >= 0 && exit.spawnX < data.maps[exit.to].width, `${mapId}: spawn X valido`);
    assert.ok(exit.spawnY >= 0 && exit.spawnY < data.maps[exit.to].height, `${mapId}: spawn Y valido`);
    assert.ok(walkable(data.maps[exit.to], exit.spawnX, exit.spawnY), `${mapId}: arrivo in ${exit.to} su cella percorribile`);
    assert.ok(!data.maps[exit.to].transitions.some(back => inRect(exit.spawnX, exit.spawnY, back)), `${mapId}: arrivo in ${exit.to} fuori dai passaggi`);
    assert.ok(data.maps[exit.to].transitions.some(back => back.to === mapId), `${mapId}: collegamento reciproco con ${exit.to}`);
  }
  for (const encounter of map.encounterTable) {
    assert.ok(data.species[encounter.species], `${mapId}: specie ${encounter.species} esistente`);
    assert.ok(encounter.minLevel >= 1 && encounter.maxLevel >= encounter.minLevel, `${mapId}: livelli validi`);
    assert.ok(encounter.weight > 0, `${mapId}: peso valido`);
  }
}

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

for (const htmlName of ['index.html', 'configuratore.html']) {
  const html = fs.readFileSync(path.join(gameDir, htmlName), 'utf8');
  for (const script of [...html.matchAll(/<script src="([^"]+)"/g)].map(match => match[1])) {
    assert.ok(fs.existsSync(path.join(gameDir, script)), `${htmlName}: script ${script} presente`);
  }
  for (const style of [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(match => match[1])) {
    assert.ok(fs.existsSync(path.join(gameDir, style)), `${htmlName}: stile ${style} presente`);
  }
}

const styles = fs.readFileSync(path.join(gameDir, 'styles.css'), 'utf8');
assert.match(styles, /\.enemy-sprite\s*\{[^}]*left:\s*28px;/, 'Il Pokémon selvatico deve apparire a sinistra');
assert.match(styles, /\.ally-sprite\s*\{[^}]*right:\s*28px;/, 'Il Pokémon della squadra deve apparire a destra');
assert.match(styles, /\.enemy-card\s*\{[^}]*left:\s*10px;/, 'La scheda del selvatico deve apparire accanto al selvatico');
assert.match(styles, /\.ally-card\s*\{[^}]*right:\s*10px;/, 'La scheda della squadra deve apparire accanto al Pokémon della squadra');

console.log(`OK: ${Object.keys(data.maps).length} mappe, ${Object.keys(data.species).length} Pokémon, ${Object.keys(data.moves).length} mosse.`);
