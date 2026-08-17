import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const gameDir = path.resolve(testDir, '..');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(gameDir, 'data.js'), 'utf8'), context);
const data = context.window.PokemonAscoliData;

assert.equal(Object.keys(data.maps).length, 7, 'Devono esistere sette quartieri');
assert.deepEqual(Array.from(data.starters), ['basilino', 'puledrotto', 'tuffito']);
assert.equal(data.start.map, 'porta_maggiore');

for (const [mapId, map] of Object.entries(data.maps)) {
  assert.ok(map.width > 0 && map.height > 0, `${mapId}: dimensioni valide`);
  assert.ok(Array.isArray(map.transitions) && map.transitions.length > 0, `${mapId}: almeno un passaggio`);
  assert.ok(Array.isArray(map.encounterTable) && map.encounterTable.length > 0, `${mapId}: tabella incontri`);
  for (const exit of map.transitions) {
    assert.ok(data.maps[exit.to], `${mapId}: destinazione ${exit.to} esistente`);
    assert.ok(exit.spawnX >= 0 && exit.spawnX < data.maps[exit.to].width, `${mapId}: spawn X valido`);
    assert.ok(exit.spawnY >= 0 && exit.spawnY < data.maps[exit.to].height, `${mapId}: spawn Y valido`);
    assert.ok(data.maps[exit.to].transitions.some(back => back.to === mapId), `${mapId}: collegamento reciproco con ${exit.to}`);
  }
  for (const encounter of map.encounterTable) {
    assert.ok(data.species[encounter.species], `${mapId}: specie ${encounter.species} esistente`);
    assert.ok(encounter.minLevel >= 1 && encounter.maxLevel >= encounter.minLevel, `${mapId}: livelli validi`);
    assert.ok(encounter.weight > 0, `${mapId}: peso valido`);
  }
}

for (const [speciesId, species] of Object.entries(data.species)) {
  assert.equal(species.base.length, 6, `${speciesId}: sei statistiche`);
  assert.ok(species.learnset.length > 0, `${speciesId}: learnset presente`);
  assert.ok(fs.existsSync(path.resolve(gameDir, species.wiki)), `${speciesId}: scheda wiki presente`);
  for (const direction of ['front', 'back']) {
    assert.ok(fs.existsSync(path.join(gameDir, 'assets', 'battle', `${speciesId}-${direction}.png`)), `${speciesId}: sprite ${direction}`);
  }
  for (const [, moveId] of species.learnset) assert.ok(data.moves[moveId], `${speciesId}: mossa ${moveId} definita`);
}

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
assert.match(styles, /\.enemy-card\s*\{[^}]*right:\s*10px;/, 'La scheda del selvatico deve restare separata dal suo sprite');
assert.match(styles, /\.ally-card\s*\{[^}]*left:\s*10px;/, 'La scheda della squadra deve restare separata dal suo sprite');

console.log(`OK: ${Object.keys(data.maps).length} mappe, ${Object.keys(data.species).length} Pokémon, ${Object.keys(data.moves).length} mosse.`);
