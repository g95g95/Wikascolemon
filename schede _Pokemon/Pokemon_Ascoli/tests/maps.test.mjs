import assert from 'node:assert/strict';
import { loadGame, inRect, walkable } from './_load.mjs';

const { data, trainersData, Events } = loadGame();

let checkedTrainers = 0;

for (const [mapId, map] of Object.entries(data.maps)) {
  // 1. levelRange valido
  assert.ok(Array.isArray(map.levelRange) && map.levelRange.length === 2, `${mapId}: levelRange presente`);
  const [minLevel, maxLevel] = map.levelRange;
  assert.ok(minLevel >= 1 && minLevel <= maxLevel && maxLevel <= 100, `${mapId}: levelRange [${minLevel}, ${maxLevel}] valido`);

  // 2. encounterTable dentro il levelRange della mappa
  for (const encounter of map.encounterTable || []) {
    assert.ok(encounter.minLevel >= minLevel, `${mapId}: incontro ${encounter.species} minLevel ${encounter.minLevel} >= levelRange[0] ${minLevel}`);
    assert.ok(encounter.maxLevel <= maxLevel, `${mapId}: incontro ${encounter.species} maxLevel ${encounter.maxLevel} <= levelRange[1] ${maxLevel}`);
  }

  // 3. allenatori della mappa: livelli entro maxLevel+2 (tranne capipalestra), su cella walkable, dentro la mappa
  const trainersOnMap = Object.entries(trainersData.trainers).filter(([, trainer]) => trainer.map === mapId);
  for (const [id, trainer] of trainersOnMap) {
    checkedTrainers += 1;
    assert.ok(trainer.x >= 0 && trainer.x < map.width && trainer.y >= 0 && trainer.y < map.height, `${id}: coordinate dentro ${mapId}`);
    assert.ok(walkable(map, trainer.x, trainer.y), `${id}: cella (${trainer.x},${trainer.y}) percorribile su ${mapId}`);
    if (!trainer.gym) {
      for (const member of trainer.team) {
        assert.ok(member.level <= maxLevel + 2, `${id}: ${member.species} livello ${member.level} <= levelRange[1]+2 (${maxLevel + 2})`);
      }
    }
  }

  // 5. script/when validi (le door sono già coperte da regression.mjs)
  for (const building of map.buildings || []) {
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
  for (const [id, trainer] of trainersOnMap) {
    if (trainer.when !== undefined && trainer.when !== null) {
      assert.doesNotThrow(() => Events.check(trainer.when, { flags: {}, badges: [], items: {}, money: 0 }), `${id}: when valutabile`);
    }
  }
  for (const transitionItem of map.transitions || []) {
    if (transitionItem.when !== undefined && transitionItem.when !== null) {
      assert.doesNotThrow(() => Events.check(transitionItem.when, { flags: {}, badges: [], items: {}, money: 0 }), `${mapId}: transizione verso ${transitionItem.to} when valutabile`);
    }
  }

  // 6. transition w/h >= 1, nessun NPC/allenatore su una cella di transition
  for (const transitionItem of map.transitions || []) {
    assert.ok(transitionItem.w >= 1 && transitionItem.h >= 1, `${mapId}: transizione verso ${transitionItem.to} con w>=1, h>=1`);
  }
  for (const npcItem of map.npcs || []) {
    assert.ok(!(map.transitions || []).some(t => inRect(npcItem.x, npcItem.y, t)), `${mapId}: npc ${npcItem.name} non su cella di transizione`);
  }
  for (const [id, trainer] of trainersOnMap) {
    assert.ok(!(map.transitions || []).some(t => inRect(trainer.x, trainer.y, t)), `${id}: allenatore non su cella di transizione`);
  }

  // 7. mappe esterne con encounterZones non vuote: almeno una zona con 0 < rate <= 0.2
  if (!map.indoor && (map.encounterZones || []).length > 0) {
    assert.ok(map.encounterZones.some(z => z.rate > 0 && z.rate <= 0.2), `${mapId}: almeno una zona incontro con rate in (0, 0.2]`);
  }

  // 8. nessuna coppia di allenatori sulla stessa cella; nessun allenatore sulla cella di un NPC
  for (let i = 0; i < trainersOnMap.length; i++) {
    for (let j = i + 1; j < trainersOnMap.length; j++) {
      const [idA, a] = trainersOnMap[i];
      const [idB, b] = trainersOnMap[j];
      assert.ok(!(a.x === b.x && a.y === b.y), `${mapId}: allenatori ${idA} e ${idB} non sulla stessa cella`);
    }
  }
  for (const [id, trainer] of trainersOnMap) {
    for (const npcItem of map.npcs || []) {
      assert.ok(!(trainer.x === npcItem.x && trainer.y === npcItem.y), `${mapId}: allenatore ${id} non sulla cella dell'npc ${npcItem.name}`);
    }
  }
}

console.log(`OK: ${Object.keys(data.maps).length} mappe, ${checkedTrainers} allenatori controllati`);
