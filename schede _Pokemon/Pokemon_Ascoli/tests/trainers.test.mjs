import assert from 'node:assert/strict';
import { loadGame, walkable } from './_load.mjs';

const { data, trainersData: trainers } = loadGame();
const species = data.species;

assert.ok(trainers, 'window.PokemonAscoliTrainers deve esistere');
assert.ok(trainers.classes && trainers.trainers && trainers.gyms, 'classes/trainers/gyms presenti');

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
