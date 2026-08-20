import assert from 'node:assert';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const battle = require('../battle.js');

// --- Fixture: specie ---
const species = {
  basilino: {
    number: 1, name: 'Basilino', types: ['Erba'], base: [45, 49, 49, 65, 65, 45],
    catchRate: 45, expYield: 64, growth: 'medio-veloce',
    learnset: [[1, 'azione'], [1, 'crescita'], [5, 'foglieaguzze'], [50, 'gigapalla']],
    evolution: { into: 'basilone', level: 16 }, wiki: '../basilino.html'
  },
  basilone: {
    number: 2, name: 'Basilone', types: ['Erba'], base: [60, 62, 63, 80, 80, 60],
    catchRate: 45, expYield: 142, growth: 'medio-veloce',
    learnset: [[1, 'azione'], [1, 'crescita'], [5, 'foglieaguzze']],
    evolution: null, wiki: '../basilone.html'
  },
  brace: {
    number: 3, name: 'Brace', types: ['Fuoco'], base: [39, 52, 43, 60, 50, 65],
    catchRate: 45, expYield: 62, growth: 'medio-veloce',
    learnset: [[1, 'azione'], [1, 'braciere'], [7, 'lanciafiamme']],
    evolution: null, wiki: '../brace.html'
  },
  tuffito: {
    number: 4, name: 'Tuffito', types: ['Acqua'], base: [44, 48, 65, 50, 64, 43],
    catchRate: 45, expYield: 63, growth: 'medio-veloce',
    learnset: [[1, 'azione'], [1, 'schizzo'], [4, 'idropompa'], [8, 'velenospina'], [10, 'guscio_chiuso']],
    evolution: { into: 'tuffotto', level: 12, location: 'porta_cartara' }, wiki: '../tuffito.html'
  },
  tuffotto: {
    number: 5, name: 'Tuffotto', types: ['Acqua'], base: [79, 83, 100, 85, 105, 78],
    catchRate: 45, expYield: 142, growth: 'medio-veloce',
    learnset: [[1, 'azione'], [1, 'schizzo'], [4, 'idropompa']],
    evolution: null, wiki: '../tuffotto.html'
  },
  spettrolo: {
    number: 6, name: 'Spettrolo', types: ['Spettro'], base: [50, 40, 40, 70, 70, 60],
    catchRate: 90, expYield: 60, growth: 'medio-veloce',
    learnset: [[1, 'azione'], [1, 'ombra']],
    evolution: null, wiki: '../spettrolo.html'
  }
};

// --- Fixture: mosse (coprono tutti i kind) ---
const moves = {
  azione: { name: 'Azione', type: 'Normale', category: 'Fisico', power: 40, accuracy: 100, pp: 35, priority: 0, effect: null, description: 'Attacco base.' },
  crescita: { name: 'Crescita', type: 'Normale', category: 'Stato', power: 0, accuracy: null, pp: 40, priority: 0, effect: { kind: 'stat', target: 'self', stat: 'attack', stages: 1, chance: 100 }, description: 'Aumenta Attacco.' },
  foglieaguzze: { name: 'Foglie Aguzze', type: 'Erba', category: 'Speciale', power: 55, accuracy: 95, pp: 25, priority: 0, effect: null, description: 'Attacco erba.' },
  gigapalla: { name: 'Gigapalla', type: 'Erba', category: 'Speciale', power: 90, accuracy: 90, pp: 10, priority: 0, effect: { kind: 'drain', ratio: 0.5 }, description: 'Assorbe PS.' },
  braciere: { name: 'Braciere', type: 'Fuoco', category: 'Speciale', power: 40, accuracy: 100, pp: 25, priority: 0, effect: { kind: 'status', status: 'brn', chance: 30 }, description: 'Può scottare.' },
  lanciafiamme: { name: 'Lanciafiamme', type: 'Fuoco', category: 'Speciale', power: 90, accuracy: 100, pp: 15, priority: 0, effect: { kind: 'status', status: 'brn', chance: 10 }, description: 'Attacco fuoco potente.' },
  schizzo: { name: 'Schizzo', type: 'Acqua', category: 'Fisico', power: 40, accuracy: 100, pp: 30, priority: 1, effect: null, description: 'Attacco acqua veloce, priorità 1.' },
  idropompa: { name: 'Idropompa', type: 'Acqua', category: 'Speciale', power: 110, accuracy: 80, pp: 5, priority: 0, effect: { kind: 'recoil', ratio: 0.25 }, description: 'Attacco acqua con contraccolpo.' },
  velenospina: { name: 'Velenospina', type: 'Veleno', category: 'Fisico', power: 15, accuracy: 100, pp: 35, priority: 0, effect: { kind: 'status', status: 'psn', chance: 30 }, description: 'Può avvelenare.' },
  guscio_chiuso: { name: 'Guscio Chiuso', type: 'Acqua', category: 'Stato', power: 0, accuracy: null, pp: 10, priority: 4, effect: { kind: 'protect' }, description: 'Si protegge.' },
  ombra: { name: 'Ombra', type: 'Spettro', category: 'Speciale', power: 65, accuracy: 100, pp: 15, priority: 0, effect: null, description: 'Attacco spettro.' },
  ipnosi: { name: 'Ipnosi', type: 'Psico', category: 'Stato', power: 0, accuracy: 60, pp: 20, priority: 0, effect: { kind: 'status', status: 'slp', chance: 100 }, description: 'Fa addormentare.' },
  tuonoshock: { name: 'Tuonoshock', type: 'Elettro', category: 'Speciale', power: 40, accuracy: 100, pp: 30, priority: 0, effect: { kind: 'status', status: 'par', chance: 10 }, description: 'Può paralizzare.' },
  multicolpo: { name: 'Multicolpo', type: 'Normale', category: 'Fisico', power: 25, accuracy: 100, pp: 20, priority: 0, effect: { kind: 'multi', min: 2, max: 5 }, description: 'Colpisce 2-5 volte.' },
  malocchio: { name: 'Malocchio', type: 'Buio', category: 'Fisico', power: 60, accuracy: 100, pp: 15, priority: 0, effect: { kind: 'flinch', chance: 30 }, description: 'Può far tentennare.' },
  megassorbimento: { name: 'Megassorbimento', type: 'Erba', category: 'Speciale', power: 0, accuracy: null, pp: 10, priority: 0, effect: { kind: 'heal', ratio: 0.5 }, description: 'Recupera PS.' },
  raggioconfusione: { name: 'Raggio Confusione', type: 'Psico', category: 'Speciale', power: 0, accuracy: 100, pp: 25, priority: 0, effect: { kind: 'custom', id: 'confonde' }, description: 'Effetto speciale custom.' },
  acciaiopesante: { name: 'Testata di Ferro', type: 'Acciaio', category: 'Fisico', power: 80, accuracy: 100, pp: 15, priority: 0, effect: null, description: 'Attacco acciaio.' }
};

battle.configure({ species, moves });

function seq(values) {
  let i = 0;
  return () => values[Math.min(i++, values.length - 1)];
}

// --- Statistiche ---
{
  const stats = battle.calculateStats('basilino', 10);
  assert.ok(stats.hp > 0 && stats.attack > 0, 'calculateStats produce valori positivi');
  const stats5 = battle.calculateStats('basilino', 5);
  assert.ok(stats.hp > stats5.hp, 'HP cresce col livello');
}

// --- createMonster / hydrateMonster ---
{
  const mon = battle.createMonster('basilino', 5, { rng: () => 0.5 });
  assert.strictEqual(mon.status, null);
  assert.strictEqual(mon.sleepTurns, 0);
  assert.ok(Array.isArray(mon.moves) && mon.moves.every(m => 'pp' in m && 'maxPp' in m), 'moves hanno pp/maxPp');

  const oldFormat = { species: 'basilino', level: 5, hp: 10, moves: ['azione', 'crescita'] };
  const hydrated = battle.hydrateMonster(oldFormat);
  assert.ok(hydrated.moves.every(m => typeof m === 'object' && m.id), 'hydrateMonster converte vecchio formato');
  assert.strictEqual(hydrated.hp, 10);
}

// --- Ordine turni: priorità e velocità, paralisi ---
{
  const fast = battle.createMonster('brace', 10); // veloce
  const slow = battle.createMonster('basilino', 10); // lento
  const order = battle.turnOrder(
    { monster: fast, stages: battle.freshStages() }, { type: 'move', moveId: 'azione' },
    { monster: slow, stages: battle.freshStages() }, { type: 'move', moveId: 'azione' },
    () => 0.5
  );
  assert.deepStrictEqual(order, ['player', 'enemy'], 'il più veloce agisce per primo');

  const priorityOrder = battle.turnOrder(
    { monster: slow, stages: battle.freshStages() }, { type: 'move', moveId: 'schizzo' }, // priorità 1
    { monster: fast, stages: battle.freshStages() }, { type: 'move', moveId: 'azione' },
    () => 0.5
  );
  assert.deepStrictEqual(priorityOrder, ['player', 'enemy'], 'priorità batte velocità');

  const paralyzed = battle.createMonster('brace', 10);
  paralyzed.status = 'par';
  const parOrder = battle.turnOrder(
    { monster: paralyzed, stages: battle.freshStages() }, { type: 'move', moveId: 'azione' },
    { monster: slow, stages: battle.freshStages() }, { type: 'move', moveId: 'azione' },
    () => 0.5
  );
  // brace (65 speed) / 2 = 32.5 vs basilino 45 -> basilino ora più veloce
  assert.deepStrictEqual(parOrder, ['enemy', 'player'], 'paralisi dimezza la velocità');
}

// --- STAB / efficacia / critico con rng deterministico ---
{
  const attacker = battle.createMonster('basilino', 20); // Erba
  const defender = battle.createMonster('tuffito', 20); // Acqua: erba è superefficace
  const rngNoCrit = seq([0, 0.99, 0.5]); // accuracy ok, crit-check alto=no crit, random factor
  const result = battle.executeMove(attacker, defender, 'foglieaguzze', battle.freshStages(), battle.freshStages(), { rng: rngNoCrit });
  const dmgEvent = result.events.find(e => e.type === 'damage');
  assert.ok(dmgEvent, 'evento danno presente');
  assert.strictEqual(dmgEvent.effectiveness, 2, 'erba su acqua è superefficace (x2)');
  assert.ok(result.events.some(e => e.text && e.text.includes('superefficace')), 'testo superefficacia presente');
}

{
  // Critico forzato: rng molto basso al primo controllo utile
  const attacker = battle.createMonster('basilino', 20);
  const defender = battle.createMonster('brace', 20);
  const rngCrit = seq([0, 0, 0.5]); // primo valore = crit roll (< 1/16)
  const result = battle.executeMove(attacker, defender, 'azione', battle.freshStages(), battle.freshStages(), { rng: rngCrit });
  const dmgEvent = result.events.find(e => e.type === 'damage');
  assert.strictEqual(dmgEvent.crit, true, 'critico forzato con rng basso');
  assert.ok(result.events.some(e => e.text === 'Brutto colpo!'), 'testo critico presente');
}

// --- Immunità: Normale su Spettro = 0 ---
{
  assert.strictEqual(battle.typeMultiplier('Normale', ['Spettro']), 0, 'Normale non ha effetto su Spettro');
  const attacker = battle.createMonster('basilino', 20);
  const defender = battle.createMonster('spettrolo', 20);
  const result = battle.executeMove(attacker, defender, 'azione', battle.freshStages(), battle.freshStages(), { rng: () => 0.99 });
  assert.ok(result.events.some(e => e.text && e.text.includes('Non ha alcun effetto')), 'messaggio di immunità');
  assert.ok(!result.events.some(e => e.type === 'damage'), 'nessun danno su immunità');
}

// --- Stati che bloccano: sonno, congelamento, paralisi ---
{
  const attacker = battle.createMonster('basilino', 10);
  attacker.status = 'slp';
  attacker.sleepTurns = 2;
  const defender = battle.createMonster('brace', 10);
  const result = battle.executeMove(attacker, defender, 'azione', battle.freshStages(), battle.freshStages(), { rng: () => 0.5 });
  assert.strictEqual(attacker.sleepTurns, 1, 'contatore sonno decrementato');
  assert.ok(result.events.some(e => e.text.includes('dorme')), 'messaggio sonno');
  assert.ok(!result.events.some(e => e.type === 'damage'), 'nessun danno mentre dorme');
}
{
  const attacker = battle.createMonster('basilino', 10);
  attacker.status = 'frz';
  const defender = battle.createMonster('brace', 10);
  const result = battle.executeMove(attacker, defender, 'azione', battle.freshStages(), battle.freshStages(), { rng: () => 0.99 }); // >0.2 -> resta congelato
  assert.ok(result.events.some(e => e.text.includes('congelato')), 'messaggio congelamento');
}
{
  const attacker = battle.createMonster('basilino', 10);
  attacker.status = 'par';
  const defender = battle.createMonster('brace', 10);
  const result = battle.executeMove(attacker, defender, 'azione', battle.freshStages(), battle.freshStages(), { rng: () => 0 }); // <0.25 -> paralizzato
  assert.ok(result.events.some(e => e.text.includes('paralizzato')), 'messaggio paralisi blocca mossa');
}

// --- Mossa di stato: stages e messaggi limite ---
{
  const attacker = battle.createMonster('basilino', 10);
  const defender = battle.createMonster('brace', 10);
  const stagesA = battle.freshStages();
  stagesA.attack = 6;
  const result = battle.executeMove(attacker, defender, 'crescita', stagesA, battle.freshStages(), { rng: () => 0.5 });
  assert.ok(result.events.some(e => e.text.includes('non può aumentare ulteriormente')), 'messaggio stat al massimo');
}

// --- Status non sovrascrive stato esistente + immunità status per tipo ---
{
  const attacker = battle.createMonster('brace', 10);
  const defender = battle.createMonster('tuffito', 10);
  defender.status = 'par';
  const result = battle.executeMove(attacker, defender, 'braciere', battle.freshStages(), battle.freshStages(), { rng: () => 0 });
  assert.strictEqual(defender.status, 'par', 'stato esistente non sovrascritto');
}
{
  const attacker = battle.createMonster('brace', 10);
  const defender = battle.createMonster('brace', 10); // Fuoco: immune a brn
  const result = battle.executeMove(attacker, defender, 'braciere', battle.freshStages(), battle.freshStages(), { rng: () => 0 });
  assert.strictEqual(defender.status, null, 'Fuoco immune a scottatura');
}

// --- Danno da veleno a fine turno ---
{
  const mon = battle.createMonster('basilino', 20);
  mon.status = 'psn';
  const hpBefore = mon.hp;
  const events = battle.endOfTurn(mon);
  assert.strictEqual(mon.hp, hpBefore - Math.max(1, Math.floor(mon.stats.hp / 8)), 'danno veleno 1/8 PS');
  assert.ok(events.some(e => e.type === 'damage'), 'evento danno fine turno');
}

// --- Drain, recoil, multi, flinch, protect ---
{
  const attacker = battle.createMonster('basilino', 30);
  const defender = battle.createMonster('tuffito', 10);
  const hpBefore = attacker.hp - 5;
  attacker.hp = hpBefore;
  const result = battle.executeMove(attacker, defender, 'gigapalla', battle.freshStages(), battle.freshStages(), { rng: () => 0.5 });
  assert.ok(attacker.hp > hpBefore, 'drain recupera PS');
}
{
  const attacker = battle.createMonster('tuffotto', 30);
  const defender = battle.createMonster('basilone', 10);
  const hpBefore = attacker.stats.hp;
  attacker.hp = hpBefore;
  battle.executeMove(attacker, defender, 'idropompa', battle.freshStages(), battle.freshStages(), { rng: () => 0.5 });
  assert.ok(attacker.hp < hpBefore, 'recoil danneggia attaccante');
}
{
  const attacker = battle.createMonster('basilino', 30);
  const defender = battle.createMonster('brace', 10);
  const result = battle.executeMove(attacker, defender, 'multicolpo', battle.freshStages(), battle.freshStages(), { rng: () => 0.9 }); // -> max hits
  const dmgEvents = result.events.filter(e => e.type === 'damage');
  assert.ok(dmgEvents.length >= 2, 'multicolpo colpisce più volte');
}
{
  const attacker = battle.createMonster('spettrolo', 15);
  const defender = battle.createMonster('basilone', 30);
  // sequenza: accuracy(ok), crit(no), random-factor, flinch-chance(basso -> scatta)
  const rngFlinch = seq([0.5, 0.9, 0.5, 0]);
  const result = battle.executeMove(attacker, defender, 'malocchio', battle.freshStages(), battle.freshStages(), { rng: rngFlinch });
  assert.ok(defender.hp > 0, 'il difensore sopravvive al colpo');
  assert.strictEqual(defender.flinched, true, 'flinch applicato al difensore');
}
{
  const defender = battle.createMonster('basilino', 10);
  const attackerProtect = battle.createMonster('tuffito', 10);
  battle.executeMove(attackerProtect, defender, 'guscio_chiuso', battle.freshStages(), battle.freshStages(), { rng: () => 0.5 });
  assert.strictEqual(attackerProtect.protected, true, 'protect si attiva');

  const attackerHit = battle.createMonster('basilino', 10);
  const hpBefore = attackerProtect.hp;
  battle.executeMove(attackerHit, attackerProtect, 'azione', battle.freshStages(), battle.freshStages(), { rng: () => 0.99 });
  assert.strictEqual(attackerProtect.hp, hpBefore, 'protect blocca il danno');
}

// --- PP che scendono e struggle ---
{
  const mon = battle.createMonster('basilino', 10);
  const before = mon.moves[0].pp;
  battle.executeMove(mon, battle.createMonster('brace', 10), mon.moves[0].id, battle.freshStages(), battle.freshStages(), { rng: () => 0.99 });
  assert.strictEqual(mon.moves[0].pp, before - 1, 'PP decrementati dopo l\'uso');

  const attacker = battle.createMonster('basilino', 10);
  const defender = battle.createMonster('brace', 10);
  const hpBefore = attacker.hp;
  const result = battle.executeMove(attacker, defender, 'struggle', battle.freshStages(), battle.freshStages(), { rng: () => 0.99 });
  assert.ok(result.events.some(e => e.type === 'damage'), 'struggle infligge danno');
  assert.ok(attacker.hp < hpBefore, 'struggle infligge recoil all\'attaccante');
}

// --- Esperienza / level-up multipli con mosse apprese ed evoluzione con location ---
{
  const mon = battle.createMonster('basilino', 4);
  const gain = battle.expGain({ species: 'basilino', level: 10 }, { trainer: false, participants: 1 });
  assert.ok(gain > 0, 'expGain positivo');

  const trainerGain = battle.expGain({ species: 'basilino', level: 10 }, { trainer: true, participants: 1 });
  assert.ok(trainerGain > gain, 'exp da trainer è maggiore (x1.5)');

  const result = battle.gainExperience(mon, 5000, { map: 'altrove', hasItem: () => false });
  assert.ok(result.levelsGained > 1, 'sale più livelli con exp abbondante');
  assert.ok(mon.level > 4, 'livello aumentato');

  // apprendimento mossa: basilino impara foglieaguzze a livello 5
  const learner = battle.createMonster('basilino', 4, { moves: ['azione'] });
  const learnResult = battle.gainExperience(learner, 500, { map: 'x', hasItem: () => false });
  assert.ok(learner.level >= 5, 'sale almeno a livello 5');
  assert.ok(learner.moves.some(m => m.id === 'foglieaguzze'), 'nuova mossa appresa aggiunta se spazio libero');

  // evoluzione con location: tuffito leva 12 SOLO a porta_cartara
  const tuffitoMon = battle.createMonster('tuffito', 11);
  const noEvo = battle.gainExperience(tuffitoMon, 2000, { map: 'altra_mappa', hasItem: () => false });
  assert.strictEqual(tuffitoMon.species, 'tuffito', 'niente evoluzione se location sbagliata');

  const tuffitoMon2 = battle.createMonster('tuffito', 11);
  const evoResult = battle.gainExperience(tuffitoMon2, 2000, { map: 'porta_cartara', hasItem: () => false });
  assert.strictEqual(tuffitoMon2.species, 'tuffotto', 'evoluzione con location corretta');
  assert.strictEqual(evoResult.evolvedInto, 'tuffotto');
}

// --- learnMove esplicito con sostituzione ---
{
  const mon = battle.createMonster('basilino', 50, { moves: ['azione', 'crescita', 'foglieaguzze', 'gigapalla'] });
  assert.strictEqual(mon.moves.length, 4);
  const ok = battle.learnMove(mon, 'braciere', 1);
  assert.ok(ok, 'sostituzione riuscita');
  assert.strictEqual(mon.moves[1].id, 'braciere');
}

// --- Cattura: HP basso > HP pieno ---
{
  const wildFull = battle.createMonster('spettrolo', 10);
  const wildLow = battle.createMonster('spettrolo', 10);
  wildLow.hp = 1;
  const chanceFull = battle.catchChance(wildFull, 'ball');
  const chanceLow = battle.catchChance(wildLow, 'ball');
  assert.ok(chanceLow > chanceFull, 'HP basso aumenta la chance di cattura');

  const attempt = battle.attemptCatch(wildLow, 'ball', () => 0); // rng 0 -> sempre successo shake
  assert.ok(attempt.caught === true || attempt.shakes >= 0, 'attemptCatch restituisce forma valida');
  assert.ok('caught' in attempt && 'shakes' in attempt);
}

// --- IA sceglie la mossa superefficace ---
{
  const attacker = battle.createMonster('basilino', 20, { moves: ['azione', 'foglieaguzze'] }); // erba
  const defender = battle.createMonster('tuffito', 20); // acqua: foglieaguzze è superefficace
  attacker.turnsFought = 1; // evita il ramo mossa di stato al primo turno
  const chosen = battle.chooseMove(attacker, defender, { rng: () => 0.99 }); // evita anche il 20% random
  assert.strictEqual(chosen, 'foglieaguzze', 'IA preferisce la mossa superefficace');
}

// --- canRun ---
{
  const fast = { stats: { speed: 100 } };
  const slow = { stats: { speed: 30 } };
  assert.strictEqual(battle.canRun(fast, slow, 0, () => 0.99), true, 'più veloce fugge sempre');
}

console.log('battle.test.mjs: tutti i test superati.');
