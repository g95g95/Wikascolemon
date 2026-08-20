import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const gameDir = path.resolve(testDir, '..');
const context = { window: {} };

const speciesPath = path.join(gameDir, 'species.js');
let species;
if (fs.existsSync(speciesPath)) {
  vm.runInContext(fs.readFileSync(speciesPath, 'utf8'), vm.createContext(context));
  species = context.window.PokemonAscoliSpecies;
} else {
  vm.runInContext(fs.readFileSync(path.join(gameDir, 'data.js'), 'utf8'), vm.createContext(context));
  species = context.window.PokemonAscoliData.species;
}

vm.runInContext(fs.readFileSync(path.join(gameDir, 'data.js'), 'utf8'), vm.createContext(context));
const data = context.window.PokemonAscoliData;

vm.runInContext(fs.readFileSync(path.join(gameDir, 'trainers.js'), 'utf8'), vm.createContext(context));
const trainers = context.window.PokemonAscoliTrainers;

assert.ok(trainers, 'window.PokemonAscoliTrainers deve esistere');
assert.ok(trainers.classes && trainers.trainers && trainers.gyms, 'classes/trainers/gyms presenti');

const inRect = (x, y, item) => x >= item.x && y >= item.y && x < item.x + item.w && y < item.y + item.h;
const walkable = (map, x, y) => {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return false;
  if (map.buildings.some(item => inRect(x, y, item))) return false;
  if (map.bridges.some(item => inRect(x, y, item))) return true;
  return !map.waters.some(item => inRect(x, y, item));
};

const validDirections = new Set(['up', 'down', 'left', 'right']);

for (const [id, trainer] of Object.entries(trainers.trainers)) {
  assert.ok(trainers.classes[trainer.class], `${id}: classe ${trainer.class} esistente`);
  assert.ok(Array.isArray(trainer.team) && trainer.team.length >= 1 && trainer.team.length <= 6, `${id}: team 1-6 Pokémon`);
  for (const member of trainer.team) {
    assert.ok(species[member.species], `${id}: specie ${member.species} esistente`);
    assert.ok(member.level >= 1 && member.level <= 100, `${id}: livello valido per ${member.species}`);
  }
  assert.ok(Array.isArray(trainer.before) && trainer.before.length > 0, `${id}: before non vuoto`);
  assert.ok(Array.isArray(trainer.after) && trainer.after.length > 0, `${id}: after non vuoto`);
  assert.ok(trainer.sight >= 0 && trainer.sight <= 8, `${id}: sight 0-8`);
  assert.ok(validDirections.has(trainer.direction), `${id}: direction valida`);

  if (data.maps[trainer.map]) {
    const map = data.maps[trainer.map];
    assert.ok(trainer.x >= 0 && trainer.x < map.width && trainer.y >= 0 && trainer.y < map.height, `${id}: coordinate dentro la mappa`);
    assert.ok(walkable(map, trainer.x, trainer.y), `${id}: cella (${trainer.x},${trainer.y}) percorribile su ${trainer.map}`);
  }

  assert.ok(trainer.gym === null || typeof trainer.gym === 'object', `${id}: gym null o oggetto`);
}

const trainerIds = Object.keys(trainers.trainers);
assert.equal(new Set(trainerIds).size, trainerIds.length, 'Id allenatori univoci');

const badges = [];
for (const [gymId, gym] of Object.entries(trainers.gyms)) {
  const leader = trainers.trainers[gym.leader];
  assert.ok(leader, `${gymId}: leader ${gym.leader} esistente`);
  assert.ok(leader.gym && leader.gym.id === gymId, `${gymId}: leader.gym.id combacia con la chiave palestra`);
  badges.push(leader.gym.badge);
}
assert.equal(new Set(badges).size, badges.length, 'Badge univoci');
const sortedBadges = [...badges].sort((a, b) => a - b);
assert.deepEqual(badges.slice().sort((a, b) => a - b), sortedBadges.map((_, i) => i + 1), 'Badge progressivi da 1');

console.log(`OK: ${Object.keys(trainers.trainers).length} allenatori, ${Object.keys(trainers.gyms).length} palestre, ${Object.keys(trainers.classes).length} classi.`);
