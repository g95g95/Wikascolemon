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

// Nando (rivale): la chiave dell'allenatore porta lo starter DI NANDO, che è quello forte contro
// il tuo (`when: { flag: 'starter_<tuo>' }` in trainers/*.js). Quindi tuo starter -> suffisso:
const NANDO_SUFFIX = { basilino: 'puledrotto', puledrotto: 'tuffito', tuffito: 'basilino' };
const NANDO_ENCOUNTERS = [
  { afterMap: 'porta_maggiore', prefix: 'porta_maggiore_nando_' },
  { afterMap: 'maltignano', prefix: 'maltignano_nando_' },
  { afterMap: 'palestra_costa', prefix: 'jonathan_nando_', before: true } // davanti allo Jonathan, prima della palestra
];

// Il giocatore simulato. Opzioni da riga di comando:
//   --solo         solo lo starter (caso peggiore: nessuna cattura)
//   --selvatici=N  lotte selvatiche per mappa (default 4)
//   --squadra=N    grandezza della squadra (default 4)
const OPTIONS = { solo: false, selvatici: 4, squadra: 4 };

function speciesName(id) {
  return data.species[id].name;
}

function weightedWild(mapId, rng) {
  const table = (data.maps[mapId] || {}).encounterTable || [];
  if (!table.length) return null;
  let roll = rng() * table.reduce((sum, entry) => sum + entry.weight, 0);
  const entry = table.find(item => (roll -= item.weight) < 0) || table[table.length - 1];
  return { species: entry.species, level: entry.minLevel + Math.floor(rng() * (entry.maxLevel - entry.minLevel + 1)) };
}

function healParty(party) {
  party.forEach(mon => {
    mon.hp = mon.stats.hp;
    mon.status = null;
    mon.sleepTurns = 0;
    mon.moves.forEach(slot => { slot.pp = slot.maxPp; });
  });
}

// Danno atteso di una mossa (potenza × STAB × efficacia × precisione × attacco/difesa della categoria).
function moveScore(attacker, defender, moveId) {
  const move = data.moves[moveId];
  if (!move || !move.power) return 0;
  const stab = data.species[attacker.species].types.includes(move.type) ? 1.5 : 1;
  const effectiveness = battle.typeMultiplier(move.type, data.species[defender.species].types);
  const special = move.category === 'Speciale';
  const ratio = (special ? attacker.stats.spAttack : attacker.stats.attack) / (special ? defender.stats.spDefense : defender.stats.defense);
  return move.power * stab * effectiveness * ((move.accuracy ?? 100) / 100) * ratio * attacker.level;
}

function bestScore(attacker, defender) {
  return Math.max(0, ...attacker.moves.filter(slot => slot.pp > 0).map(slot => moveScore(attacker, defender, slot.id)));
}

// Un giocatore sceglie la mossa che fa più male; l'avversario usa l'IA del gioco.
function playerMove(mon, enemy) {
  const usable = mon.moves.filter(slot => slot.pp > 0);
  if (!usable.length) return 'struggle';
  return usable.reduce((best, slot) => (moveScore(mon, enemy, slot.id) > moveScore(mon, enemy, best.id) ? slot : best)).id;
}

// Chi mandare in campo: chi fa più male in rapporto a quanto ne prende.
function bestFighter(party, enemy) {
  const alive = party.filter(mon => mon.hp > 0);
  const value = mon => (bestScore(mon, enemy) / enemy.stats.hp) / ((bestScore(enemy, mon) || 1) / mon.hp);
  return alive.length ? alive.reduce((best, mon) => (value(mon) > value(best) ? mon : best)) : null;
}

// Nel gioco, a quattro mosse piene, si sceglie quale dimenticare: qui esce la più debole.
function learnBetterMoves(mon, levelBefore) {
  const species = data.species[mon.species];
  const power = id => (data.moves[id] && data.moves[id].power) || 0;
  species.learnset.filter(([level]) => level > levelBefore && level <= mon.level).forEach(([, moveId]) => {
    if (mon.moves.some(slot => slot.id === moveId) || !data.moves[moveId]) return;
    const weakest = mon.moves.reduce((low, slot) => (power(slot.id) < power(low.id) ? slot : low));
    if (power(moveId) <= power(weakest.id)) return;
    mon.moves[mon.moves.indexOf(weakest)] = battle.createMonster(mon.species, mon.level, { moves: [moveId] }).moves[0];
  });
}

function giveExp(sharers, enemyMon, isTrainer) {
  const alive = sharers.filter(mon => mon.hp > 0);
  const gain = battle.expGain(enemyMon, { trainer: isTrainer, participants: Math.max(1, alive.length) });
  alive.forEach(mon => {
    const levelBefore = mon.level;
    battle.gainExperience(mon, gain, { map: null, hasItem: () => false, mapHasWater: false });
    learnBetterMoves(mon, levelBefore);
  });
}

function fight1v1(playerMon, enemyMon, rng) {
  const stagesP = battle.freshStages();
  const stagesE = battle.freshStages();
  enemyMon.turnsFought = enemyMon.turnsFought || 0;
  let turns = 0;
  while (playerMon.hp > 0 && enemyMon.hp > 0 && turns < 100) {
    turns += 1;
    const moveP = playerMove(playerMon, enemyMon);
    const moveE = battle.chooseMove(enemyMon, playerMon, { rng }) || 'struggle';
    const order = battle.turnOrder(
      { monster: playerMon, stages: stagesP }, { type: 'move', moveId: moveP },
      { monster: enemyMon, stages: stagesE }, { type: 'move', moveId: moveE },
      rng
    );
    for (const who of order) {
      if (playerMon.hp <= 0 || enemyMon.hp <= 0) break;
      if (who === 'player') battle.executeMove(playerMon, enemyMon, moveP, stagesP, stagesE, { rng });
      else { battle.executeMove(enemyMon, playerMon, moveE, stagesE, stagesP, { rng }); enemyMon.turnsFought += 1; }
    }
    if (playerMon.hp <= 0 || enemyMon.hp <= 0) break;
    battle.endOfTurn(playerMon);
    battle.endOfTurn(enemyMon);
  }
  return turns;
}

// Contro ogni avversario scende chi ha l'abbinamento migliore; se va KO entra il migliore dei rimasti.
// L'esperienza si divide fra chi è sceso in campo ed è ancora in piedi, come in game.js.
function fightTrainer(party, trainerTeam, rng, isTrainer) {
  let turns = 0;
  for (const spec of trainerTeam) {
    const enemyMon = battle.createMonster(spec.species, spec.level, { moves: spec.moves, rng });
    const participants = new Set();
    while (enemyMon.hp > 0) {
      const playerMon = bestFighter(party, enemyMon);
      if (!playerMon) return { won: false, turns };
      participants.add(playerMon);
      turns += fight1v1(playerMon, enemyMon, rng);
    }
    giveExp([...participants], enemyMon, isTrainer);
  }
  return { won: true, turns };
}

// Simula un'intera run per uno starter con un seed dato. Ritorna record per allenatore.
function simulateRun(starterId, seed) {
  const rng = makeRng(seed);
  const party = [battle.createMonster(starterId, 5, { rng })];
  const trainerRecords = [];

  // Le lotte selvatiche le fa chi è più indietro (così si allena la squadra); una per mappa finisce in cattura.
  function playWildEncounters(mapId) {
    const table = (data.maps[mapId] || {}).encounterTable || [];
    if (!table.length) return;
    if (!OPTIONS.solo && party.length < OPTIONS.squadra) {
      const wild = weightedWild(mapId, rng);
      if (!party.some(mon => mon.species === wild.species)) party.push(battle.createMonster(wild.species, wild.level, { rng }));
    }
    for (let i = 0; i < OPTIONS.selvatici; i += 1) {
      healParty(party);
      const trainee = party.reduce((low, mon) => (mon.level < low.level ? mon : low));
      fightTrainer([trainee], [weightedWild(mapId, rng)], rng, false);
    }
  }

  function record(trainerId) {
    const trainer = trainersData.trainers[trainerId];
    if (!trainer) return;
    healParty(party);
    const levels = party.map(mon => mon.level);
    const result = fightTrainer(party, trainer.team, rng, true);
    trainerRecords.push({
      id: trainerId, won: result.won, turns: result.turns,
      topLevel: Math.max(...levels), teamLevel: levels.reduce((a, b) => a + b, 0) / levels.length,
      standing: party.filter(mon => mon.hp > 0).length / party.length
    });
  }

  for (const stop of ROUTE) {
    const nando = NANDO_ENCOUNTERS.find(e => e.afterMap === stop.map);
    if (!stop.healBefore) playWildEncounters(stop.map);
    if (nando && nando.before) record(nando.prefix + NANDO_SUFFIX[starterId]);
    stop.trainers.forEach(record);
    if (nando && !nando.before) record(nando.prefix + NANDO_SUFFIX[starterId]);
  }

  return trainerRecords;
}

function runAllSeeds(starterId, seedBase, seedCount) {
  const perTrainer = new Map();
  for (let i = 0; i < seedCount; i += 1) {
    for (const rec of simulateRun(starterId, seedBase + i)) {
      if (!perTrainer.has(rec.id)) perTrainer.set(rec.id, { wins: 0, total: 0, top: [], team: [], standing: [], turns: [] });
      const agg = perTrainer.get(rec.id);
      agg.total += 1;
      if (rec.won) agg.wins += 1;
      agg.top.push(rec.topLevel);
      agg.team.push(rec.teamLevel);
      agg.standing.push(rec.standing);
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
  console.log('Allenatore'.padEnd(38) + 'Vittorie'.padEnd(14) + 'Lv. più alto'.padEnd(14) + 'Lv. squadra'.padEnd(13) + 'In piedi'.padEnd(10) + 'Turni');
  for (const id of order) {
    const agg = perTrainer.get(id);
    if (!agg) continue;
    const pct = Math.round((agg.wins / agg.total) * 100);
    console.log(
      id.padEnd(38) +
      `${pct}% (${agg.wins}/${agg.total})`.padEnd(14) +
      avg(agg.top).toFixed(1).padEnd(14) +
      avg(agg.team).toFixed(1).padEnd(13) +
      `${Math.round(avg(agg.standing) * 100)}%`.padEnd(10) +
      avg(agg.turns).toFixed(1)
    );
  }
}

function main() {
  const args = process.argv.slice(2).filter(arg => {
    const option = arg.match(/^--(solo|selvatici|squadra)(?:=(\d+))?$/);
    if (!option) return true;
    OPTIONS[option[1]] = option[1] === 'solo' ? true : Number(option[2]);
    return false;
  });
  const seedBase = args[0] ? parseInt(args[0], 10) : 1;
  const seedCount = args[1] ? parseInt(args[1], 10) : 20;
  console.log(`Giocatore: ${OPTIONS.solo ? 'solo starter' : `squadra fino a ${OPTIONS.squadra}`} · ${OPTIONS.selvatici} lotte selvatiche per mappa · ${seedCount} partite per starter`);

  const orderIds = [];
  for (const stop of ROUTE) {
    const nando = NANDO_ENCOUNTERS.find(e => e.afterMap === stop.map);
    if (nando && nando.before) orderIds.push(nando.prefix + '<starter>');
    for (const t of stop.trainers) orderIds.push(t);
    if (nando && !nando.before) orderIds.push(nando.prefix + '<starter>');
  }

  for (const starterId of STARTERS) {
    const perTrainer = runAllSeeds(starterId, seedBase, seedCount);
    printReport(starterId, perTrainer, orderIds.map(id => id.replace('<starter>', NANDO_SUFFIX[starterId])));
  }
}

main();
