#!/usr/bin/env node
// Simula il percorso principale della demo con ognuno dei 3 starter, per verificare il
// bilanciamento livelli/allenatori (task F2). Usa battle.js "puro" con dati caricati da
// tests/_load.mjs (stesso ordine di index.html). RNG deterministico (LCG) seminato da argv,
// per riproducibilità.
//
// Uso: node tools/simulate-balance.mjs [seedBase] [seedCount]
//   seedBase (default 1): primo seed usato
//   seedCount (default 20): quanti seed simulare per starter
'use strict';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { loadGame } from '../tests/_load.mjs';

const require = createRequire(import.meta.url);
const battle = require('../battle.js');

const gameDir = path.dirname(fileURLToPath(import.meta.url)) + path.sep + '..';

const { data, trainersData } = loadGame({ withEvents: false });
battle.configure({ species: data.species, moves: data.moves });

// --- RNG deterministico (LCG, stessa formula di Numerical Recipes) ---
function makeRng(seed) {
  let state = seed >>> 0;
  return function rng() {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const STARTERS = data.starters; // ['basilino', 'puledrotto', 'tuffito']

// Ordine del percorso principale della demo (mappa -> allenatori normali in ordine di incontro,
// poi capopalestra se presente). Rispecchia trainers/<mapId>.js e la bibbia di design (§3).
const ROUTE = [
  { map: 'porta_maggiore', trainers: ['porta_maggiore_ragazzino_1'] }, // Nando è gestito a parte (fuori palestra)
  { map: 'centro_storico', trainers: [] },
  { map: 'monticelli', trainers: ['monticelli_campeggiatore_1'] },
  { map: 'marino_del_tronto', trainers: ['marino_del_tronto_ragazzino_1', 'marino_del_tronto_ragazzina_1', 'marino_del_tronto_pescatore_1'] },
  { map: 'oasi', trainers: ['oasi_birdwatcher_1', 'oasi_campeggiatore_1'] },
  { map: 'maltignano', trainers: ['maltignano_ciclista_1', 'maltignano_ragazzino_1', 'maltignano_contadino_1'] },
  { map: 'palestra_castel_di_lama', trainers: ['palestra_castel_di_lama_allievo_1', 'palestra_castel_di_lama_allieva_1', 'castel_di_lama_hills'], healBefore: true },
  { map: 'spinetoli_centobuchi', trainers: ['spinetoli_centobuchi_contadino_1', 'spinetoli_centobuchi_ciclista_1', 'spinetoli_centobuchi_ciclista_2', 'spinetoli_centobuchi_gemelle_1'] },
  { map: 'costa', trainers: ['costa_bagnino_1', 'costa_bagnino_2', 'costa_turista_1', 'costa_turista_2', 'costa_dj_1'] },
  { map: 'palestra_costa', trainers: ['jonathan_bro_security_1', 'jonathan_bro_security_2', 'jonathan_bro_security_3', 'costa_riccio'], healBefore: true }
];

// Nando (rivale) sfida sulla mappa porta_maggiore/maltignano/jonathan (chiave dipende dallo starter
// del giocatore, non dal proprio: il team di Nando usa lo starter "debole" contro il tuo, la chiave
// del trainer indica lo starter DEL GIOCATORE che sblocca l'incontro).
const NANDO_SUFFIX = { basilino: 'basilino', puledrotto: 'puledrotto', tuffito: 'tuffito' };
const NANDO_ENCOUNTERS = [
  { afterMap: 'porta_maggiore', prefix: 'porta_maggiore_nando_' },
  { afterMap: 'maltignano', prefix: 'maltignano_nando_' },
  { afterMap: 'jonathan', prefix: 'jonathan_nando_' } // combattuto prima di entrare nello Jonathan/palestra
];

const WILD_ENCOUNTERS_PER_MAP = 3; // incontri selvatici "di passaggio" fra un allenatore e l'altro

function speciesName(id) {
  return data.species[id].name;
}

function mostFrequentWild(mapId) {
  const map = data.maps[mapId];
  if (!map || !map.encounterTable || !map.encounterTable.length) return null;
  return map.encounterTable.reduce((best, entry) => (entry.weight > best.weight ? entry : best));
}

function avgLevel(entry) {
  return Math.round((entry.minLevel + entry.maxLevel) / 2);
}

// Party del giocatore: array di monster vivi/KO, healed fra le città.
function healParty(party) {
  party.forEach(mon => {
    mon.hp = mon.stats.hp;
    mon.status = null;
    mon.sleepTurns = 0;
    mon.moves.forEach(slot => { slot.pp = slot.maxPp; });
  });
}

function fullyFainted(party) {
  return party.every(mon => mon.hp <= 0);
}

function firstAlive(party) {
  return party.find(mon => mon.hp > 0) || null;
}

// Combatte 1v1 fino a KO di uno dei due; players usa `chooseMove` come IA (stessa del nemico,
// da consegna). Ritorna { winner: 'player'|'enemy', turns }.
function fight1v1(playerMon, enemyMon, rng, ctxMap) {
  const stagesP = battle.freshStages();
  const stagesE = battle.freshStages();
  playerMon.turnsFought = 0;
  enemyMon.turnsFought = 0;
  let turns = 0;
  const MAX_TURNS = 100; // guardia anti-loop (PP esauriti -> struggle comunque infligge danno)
  while (playerMon.hp > 0 && enemyMon.hp > 0 && turns < MAX_TURNS) {
    turns += 1;
    const moveP = pickMove(playerMon, rng);
    const moveE = pickMove(enemyMon, rng);
    const actionP = { type: 'move', moveId: moveP };
    const actionE = { type: 'move', moveId: moveE };
    const order = battle.turnOrder(
      { monster: playerMon, stages: stagesP }, actionP,
      { monster: enemyMon, stages: stagesE }, actionE,
      rng
    );
    for (const who of order) {
      if (playerMon.hp <= 0 || enemyMon.hp <= 0) break;
      if (who === 'player') {
        battle.executeMove(playerMon, enemyMon, moveP, stagesP, stagesE, { rng });
        playerMon.turnsFought += 1;
      } else {
        battle.executeMove(enemyMon, playerMon, moveE, stagesE, stagesP, { rng });
        enemyMon.turnsFought += 1;
      }
    }
    if (playerMon.hp <= 0 || enemyMon.hp <= 0) break;
    battle.endOfTurn(playerMon);
    battle.endOfTurn(enemyMon);
  }
  return { winner: playerMon.hp > 0 ? 'player' : 'enemy', turns };
}

function pickMove(mon, rng) {
  const usable = mon.moves.filter(m => m.pp > 0);
  if (!usable.length) return 'struggle';
  const other = mon.__opponent; // impostato prima della chiamata in fightTrainerBattle/fightWild
  return battle.chooseMove(mon, other, { rng }) || 'struggle';
}

// Combattimento contro un allenatore con più mostri: il giocatore manda avanti il primo vivo,
// il nemico manda i suoi mostri in ordine di squadra. Interrompe se il giocatore stramazza tutti.
function fightTrainer(party, trainerTeam, rng, isTrainer) {
  let totalTurns = 0;
  for (const spec of trainerTeam) {
    const enemyMon = battle.createMonster(spec.species, spec.level, { moves: spec.moves, rng });
    let playerMon = firstAlive(party);
    if (!playerMon) return { won: false, turns: totalTurns };
    while (enemyMon.hp > 0) {
      playerMon = firstAlive(party);
      if (!playerMon) return { won: false, turns: totalTurns };
      playerMon.__opponent = enemyMon;
      enemyMon.__opponent = playerMon;
      const result = fight1v1(playerMon, enemyMon, rng);
      totalTurns += result.turns;
      if (result.winner === 'enemy') {
        // playerMon KO, continua col prossimo vivo (o perde se non ce n'è)
        continue;
      }
      // enemy KO: exp al vincitore
      const gain = battle.expGain(enemyMon, { trainer: isTrainer, participants: 1 });
      battle.gainExperience(playerMon, gain, { map: null, hasItem: () => false, mapHasWater: false });
      break;
    }
  }
  return { won: !fullyFainted(party), turns: totalTurns };
}

function fightWild(party, speciesId, level, rng) {
  const enemyMon = battle.createMonster(speciesId, level, { rng });
  const playerMon = firstAlive(party);
  if (!playerMon) return;
  playerMon.__opponent = enemyMon;
  enemyMon.__opponent = playerMon;
  const result = fight1v1(playerMon, enemyMon, rng);
  if (result.winner === 'player') {
    const gain = battle.expGain(enemyMon, { trainer: false, participants: 1 });
    battle.gainExperience(playerMon, gain, { map: null, hasItem: () => false, mapHasWater: false });
  }
}

// Simula un'intera run per uno starter con un seed dato. Ritorna record per allenatore.
function simulateRun(starterId, seed) {
  const rng = makeRng(seed);
  const startMon = battle.createMonster(starterId, 5, { rng });
  const party = [startMon];
  let caughtThisRun = false;
  const trainerRecords = [];

  function currentLeadLevel() {
    const lead = party[0];
    return lead.level;
  }

  function playWildEncounters(mapId, count) {
    const wild = mostFrequentWild(mapId);
    if (!wild) return;
    const lvl = avgLevel(wild);
    for (let i = 0; i < count; i += 1) {
      healParty(party);
      fightWild(party, wild.species, lvl, rng);
    }
  }

  function maybeCatch(mapId) {
    if (caughtThisRun || party.length >= 2) return;
    const wild = mostFrequentWild(mapId);
    if (!wild) return;
    const lvl = avgLevel(wild);
    const mon = battle.createMonster(wild.species, lvl, { rng });
    party.push(mon);
    caughtThisRun = true;
  }

  function fightNandoIfAny(afterMap) {
    const encounter = NANDO_ENCOUNTERS.find(e => e.afterMap === afterMap);
    if (!encounter) return;
    const trainerId = encounter.prefix + NANDO_SUFFIX[starterId];
    const trainer = trainersData.trainers[trainerId];
    if (!trainer) return;
    const result = fightTrainer(party, trainer.team, rng, true);
    trainerRecords.push({
      id: trainerId, leadLevelAtArrival: currentLeadLevel(),
      won: result.won, hpPct: hpPercent(party), turns: result.turns
    });
  }

  for (const stop of ROUTE) {
    // Il giocatore torna al bar prima di ogni sfida (comportamento normale: non affronta un
    // allenatore con la squadra a metà PS), come specificato dal task F2.
    healParty(party);
    if (!stop.healBefore) {
      playWildEncounters(stop.map, WILD_ENCOUNTERS_PER_MAP);
      maybeCatch(stop.map);
    }
    for (const trainerId of stop.trainers) {
      const trainer = trainersData.trainers[trainerId];
      if (!trainer) continue;
      healParty(party);
      const result = fightTrainer(party, trainer.team, rng, true);
      trainerRecords.push({
        id: trainerId, leadLevelAtArrival: currentLeadLevel(),
        won: result.won, hpPct: hpPercent(party), turns: result.turns
      });
    }
    fightNandoIfAny(stop.map);
  }

  return trainerRecords;
}

function hpPercent(party) {
  const lead = party[0];
  return Math.round((lead.hp / lead.stats.hp) * 100);
}

function runAllSeeds(starterId, seedBase, seedCount) {
  const perTrainer = new Map(); // id -> { wins, levels: [], hpPcts: [], turns: [] }
  for (let i = 0; i < seedCount; i += 1) {
    const seed = seedBase + i;
    const records = simulateRun(starterId, seed);
    for (const rec of records) {
      if (!perTrainer.has(rec.id)) perTrainer.set(rec.id, { wins: 0, total: 0, levels: [], hpPcts: [], turns: [] });
      const agg = perTrainer.get(rec.id);
      agg.total += 1;
      if (rec.won) agg.wins += 1;
      agg.levels.push(rec.leadLevelAtArrival);
      agg.hpPcts.push(rec.hpPct);
      agg.turns.push(rec.turns);
    }
  }
  return perTrainer;
}

function avg(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function printReport(starterId, perTrainer, order) {
  console.log(`\n=== Starter: ${speciesName(starterId)} (${starterId}) ===`);
  console.log('Allenatore'.padEnd(38) + 'Vittorie'.padEnd(12) + 'Lv. medio'.padEnd(12) + 'PS medio %'.padEnd(12) + 'Turni medi');
  for (const id of order) {
    const agg = perTrainer.get(id);
    if (!agg) continue;
    const pct = Math.round((agg.wins / agg.total) * 100);
    console.log(
      id.padEnd(38) +
      `${pct}% (${agg.wins}/${agg.total})`.padEnd(12) +
      `${avg(agg.levels).toFixed(1)}`.padEnd(12) +
      `${avg(agg.hpPcts).toFixed(0)}%`.padEnd(12) +
      `${avg(agg.turns).toFixed(1)}`
    );
  }
}

function main() {
  const args = process.argv.slice(2);
  const seedBase = args[0] ? parseInt(args[0], 10) : 1;
  const seedCount = args[1] ? parseInt(args[1], 10) : 20;

  const orderIds = [];
  for (const stop of ROUTE) {
    for (const t of stop.trainers) orderIds.push(t);
    const nando = NANDO_ENCOUNTERS.find(e => e.afterMap === stop.map);
    if (nando) orderIds.push(nando.prefix + '<starter>');
  }

  for (const starterId of STARTERS) {
    const perTrainer = runAllSeeds(starterId, seedBase, seedCount);
    const idsForThisStarter = orderIds.map(id => id.replace('<starter>', NANDO_SUFFIX[starterId]));
    printReport(starterId, perTrainer, idsForThisStarter);
  }
}

main();
