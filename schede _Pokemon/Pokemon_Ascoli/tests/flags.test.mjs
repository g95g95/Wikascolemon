import assert from 'node:assert/strict';
import { loadGame } from './_load.mjs';

// Raccoglie ricorsivamente i flag letti (flag/notFlag, dentro all/any/not) e impostati (setFlag/
// clearFlag) in tutte le condizioni `when` (npc, transitions, trainer) e in tutti gli script del
// gioco (npc.script, building.script, rami choice/if/else/onWin/onLose/onCatch/onOther), verificando
// che ogni flag letto sia impostato da qualche script o dal motore, e viceversa (con avviso, non
// fallimento, per i flag impostati ma mai letti: sono guardie interne legittime, es. `demo_finita`).
const { data, trainersData } = loadGame();

// Flag impostati direttamente da game.js, non da uno script dati (vedi grep `save.flags.` / `setFlag[
// Events.flagKeys.trainerFlag`] in game.js). `trainer:<id>` è generato per ogni allenatore esistente
// e gestito a parte.
const ENGINE_FLAGS = new Set(['demo_finita']);
// Flag impostati dal motore ma intenzionalmente non letti da nessuna condizione nei dati (guardie
// interne di idempotenza): documentato in Trama/flag.md.
const ENGINE_ONLY_FLAGS = new Set(['demo_finita']);

const readFlags = new Map();
const setFlags = new Map();

function addRead(name, loc) {
  if (!readFlags.has(name)) readFlags.set(name, new Set());
  readFlags.get(name).add(loc);
}
function addSet(name, loc) {
  if (!setFlags.has(name)) setFlags.set(name, new Set());
  setFlags.get(name).add(loc);
}

function walkCondition(cond, loc) {
  if (!cond || typeof cond !== 'object') return;
  if ('flag' in cond) addRead(cond.flag, loc);
  if ('notFlag' in cond) addRead(cond.notFlag, loc);
  if ('not' in cond) walkCondition(cond.not, loc);
  if ('all' in cond) for (const c of cond.all) walkCondition(c, loc);
  if ('any' in cond) for (const c of cond.any) walkCondition(c, loc);
}

function walkScript(script, loc) {
  for (const step of script || []) {
    if (!step || typeof step !== 'object') continue;
    if ('setFlag' in step) addSet(step.setFlag, loc);
    if ('clearFlag' in step) addSet(step.clearFlag, loc);
    if ('if' in step) {
      walkCondition(step.if, loc + '.if');
      walkScript(step.then, loc + '.then');
      walkScript(step.else, loc + '.else');
    }
    if ('choice' in step) {
      (step.options || []).forEach((opt, i) => walkScript(opt.then, loc + `.choice[${i}]`));
    }
    if ('battleTrainer' in step) {
      walkScript(step.onWin, loc + `.battleTrainer(${step.battleTrainer}).onWin`);
      walkScript(step.onLose, loc + `.battleTrainer(${step.battleTrainer}).onLose`);
    }
    if ('wildBattle' in step) {
      walkScript(step.onCatch, loc + '.wildBattle.onCatch');
      walkScript(step.onOther, loc + '.wildBattle.onOther');
    }
  }
}

for (const [mapId, map] of Object.entries(data.maps)) {
  for (const npc of map.npcs || []) {
    if (npc.when) walkCondition(npc.when, `map:${mapId} npc:${npc.name}.when`);
    if (npc.script) walkScript(npc.script, `map:${mapId} npc:${npc.name}.script`);
  }
  for (const t of map.transitions || []) {
    if (t.when) walkCondition(t.when, `map:${mapId} transition->${t.to}.when`);
  }
  for (const b of map.buildings || []) {
    if (b.script) walkScript(b.script, `map:${mapId} building:${b.name}.script`);
  }
}

for (const [id, trainer] of Object.entries(trainersData.trainers)) {
  if (trainer.when) walkCondition(trainer.when, `trainer:${id}.when`);
}

// Flag impostati dal motore: ENGINE_FLAGS + `trainer:<id>` per ogni allenatore esistente.
const engineSetFlags = new Set(ENGINE_FLAGS);
for (const id of Object.keys(trainersData.trainers)) engineSetFlags.add(`trainer:${id}`);

// --- ogni flag letto deve essere impostato da qualche script o dal motore ---
for (const [flag, locs] of readFlags) {
  const settable = setFlags.has(flag) || engineSetFlags.has(flag);
  assert.ok(settable, `flag "${flag}" letto da ${[...locs].join('; ')} ma mai impostato (né da script né dal motore)`);
}

// --- ogni flag impostato da uno script deve essere letto da qualcuno, altrimenti è morto (warn, non fail) ---
for (const [flag, locs] of setFlags) {
  if (!readFlags.has(flag)) {
    console.warn(`WARN: flag "${flag}" impostato da ${[...locs].join('; ')} ma mai letto da nessuna condizione (flag morto o solo narrativo)`);
  }
}

// --- ENGINE_FLAGS dichiarati devono comparire davvero in game.js (controllo statico sul sorgente) ---
import fs from 'node:fs';
import path from 'node:path';
import { gameDir } from './_load.mjs';
const gameJs = fs.readFileSync(path.join(gameDir, 'game.js'), 'utf8');
for (const flag of ENGINE_FLAGS) {
  assert.ok(gameJs.includes(flag), `ENGINE_FLAGS: "${flag}" dichiarato nel test ma non trovato in game.js`);
}

// --- ENGINE_ONLY_FLAGS: se in futuro vengono letti da un when/if nei dati, il test deve saperlo
// (altrimenti la lista in Trama/flag.md e qui va aggiornata volontariamente, non silenziosamente) ---
for (const flag of ENGINE_ONLY_FLAGS) {
  assert.ok(!readFlags.has(flag), `"${flag}" era considerato solo-motore (mai letto dai dati) ma ora è letto da: ${readFlags.has(flag) ? [...readFlags.get(flag)].join('; ') : ''} — aggiorna ENGINE_ONLY_FLAGS e Trama/flag.md`);
}

console.log(`OK: ${readFlags.size} flag letti, ${setFlags.size} flag impostati da script (+ ${engineSetFlags.size} dal motore).`);
