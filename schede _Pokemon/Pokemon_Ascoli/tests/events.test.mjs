import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const gameDir = path.resolve(testDir, '..');
const context = { window: {}, console };
vm.runInNewContext(fs.readFileSync(path.join(gameDir, 'events.js'), 'utf8'), context);
const Events = context.window.PokemonAscoliEvents;

// Oggetti creati nel sandbox vm sono cross-realm: confronto strutturale via JSON.
function jsonEqual(actual, expected, message) {
  assert.equal(JSON.stringify(actual), JSON.stringify(expected), message);
}

// ---------- check() ----------

assert.equal(Events.check(null, {}), true, 'condizione nulla è vera');
assert.equal(Events.check(undefined, {}), true, 'condizione undefined è vera');

assert.equal(Events.check({ flag: 'x' }, { flags: { x: true } }), true, 'flag presente');
assert.equal(Events.check({ flag: 'x' }, { flags: { x: false } }), false, 'flag falso');
assert.equal(Events.check({ flag: 'x' }, { flags: {} }), false, 'flag assente');
assert.equal(Events.check({ flag: 'x' }, {}), false, 'flag senza save.flags');

assert.equal(Events.check({ notFlag: 'x' }, { flags: {} }), true, 'notFlag assente è vero');
assert.equal(Events.check({ notFlag: 'x' }, { flags: { x: true } }), false, 'notFlag presente è falso');
assert.equal(Events.check({ notFlag: 'x' }, {}), true, 'notFlag senza save.flags è vero');

assert.equal(Events.check({ badge: 1 }, { badges: [1, 2] }), true, 'badge posseduta');
assert.equal(Events.check({ badge: 3 }, { badges: [1, 2] }), false, 'badge non posseduta');
assert.equal(Events.check({ badge: 1 }, {}), false, 'badge senza save.badges');

assert.equal(Events.check({ item: 'ball' }, { items: { ball: 3 } }), true, 'oggetto posseduto');
assert.equal(Events.check({ item: 'ball' }, { items: { ball: 0 } }), false, 'oggetto a quantità zero');
assert.equal(Events.check({ item: 'ball' }, {}), false, 'oggetto senza save.items');

assert.equal(Events.check({ money: 100 }, { money: 100 }), true, 'money uguale alla soglia');
assert.equal(Events.check({ money: 100 }, { money: 50 }), false, 'money insufficiente');

assert.equal(
  Events.check({ all: [{ flag: 'a' }, { badge: 1 }] }, { flags: { a: true }, badges: [1] }),
  true,
  'all: tutte vere'
);
assert.equal(
  Events.check({ all: [{ flag: 'a' }, { badge: 1 }] }, { flags: { a: true }, badges: [] }),
  false,
  'all: una falsa'
);

assert.equal(
  Events.check({ any: [{ flag: 'a' }, { badge: 1 }] }, { flags: {}, badges: [1] }),
  true,
  'any: una vera'
);
assert.equal(
  Events.check({ any: [{ flag: 'a' }, { badge: 1 }] }, { flags: {}, badges: [] }),
  false,
  'any: nessuna vera'
);

assert.equal(Events.check({ not: { flag: 'a' } }, { flags: { a: true } }), false, 'not su vera');
assert.equal(Events.check({ not: { flag: 'a' } }, { flags: {} }), true, 'not su falsa');

// condizione nidificata complessa
const nested = { all: [{ any: [{ flag: 'a' }, { flag: 'b' }] }, { not: { badge: 5 } }] };
assert.equal(Events.check(nested, { flags: { b: true }, badges: [] }), true, 'condizione nidificata vera');
assert.equal(Events.check(nested, { flags: {}, badges: [5] }), false, 'condizione nidificata falsa');

// condizione sconosciuta -> false + warn
{
  let warned = false;
  const origWarn = console.warn;
  console.warn = () => { warned = true; };
  assert.equal(Events.check({ boh: 1 }, {}), false, 'condizione sconosciuta è falsa');
  assert.equal(warned, true, 'condizione sconosciuta stampa un warning');
  console.warn = origWarn;
}

// ---------- flagKeys ----------

assert.equal(Events.flagKeys.trainerFlag('tobia'), 'trainer:tobia');

// ---------- host fittizio ----------

function makeHost(overrides) {
  const calls = [];
  const save = { flags: {}, badges: [], items: {}, money: 0 };
  const defaults = {
    say: async (name, text) => { calls.push(['say', name, text]); },
    choice: async (question, texts) => { calls.push(['choice', question, texts]); return 0; },
    battleTrainer: async (id) => { calls.push(['battleTrainer', id]); return 'win'; },
    wildBattle: async (spec) => { calls.push(['wildBattle', spec]); return 'caught'; },
    heal: async () => { calls.push(['heal']); },
    shop: async (items) => { calls.push(['shop', items]); },
    warp: async (dest) => { calls.push(['warp', dest]); },
    toast: async (text) => { calls.push(['toast', text]); },
    giveMonster: async (spec) => { calls.push(['giveMonster', spec]); }
  };
  const host = Object.assign({ save }, defaults, overrides);
  host.calls = calls;
  return host;
}

// say: array -> una chiamata per pagina, name opzionale
{
  const host = makeHost();
  const runner = Events.createRunner(host);
  await runner.run([{ say: ['pag1', 'pag2'], name: 'Bobby' }]);
  assert.deepEqual(host.calls, [['say', 'Bobby', 'pag1'], ['say', 'Bobby', 'pag2']]);
}

{
  const host = makeHost();
  const runner = Events.createRunner(host);
  await runner.run([{ say: 'ciao' }]);
  assert.deepEqual(host.calls, [['say', null, 'ciao']]);
}

// choice: segue il ramo giusto
{
  const host = makeHost({
    choice: async (question, texts) => { host.calls.push(['choice', question, texts]); return 1; }
  });
  const runner = Events.createRunner(host);
  await runner.run([{
    choice: 'Scegli',
    options: [
      { text: 'A', then: [{ toast: 'ramo A' }] },
      { text: 'B', then: [{ toast: 'ramo B' }] }
    ]
  }]);
  assert.deepEqual(host.calls[0], ['choice', 'Scegli', ['A', 'B']]);
  assert.deepEqual(host.calls[1], ['toast', 'ramo B']);
  assert.equal(host.calls.length, 2, 'solo il ramo scelto viene eseguito');
}

// if/then/else
{
  const host = makeHost();
  const runner = Events.createRunner(host);
  await runner.run([{ if: { flag: 'mai' }, then: [{ toast: 'then' }], else: [{ toast: 'else' }] }]);
  assert.deepEqual(host.calls, [['toast', 'else']]);
}
{
  const host = makeHost();
  host.save.flags.x = true;
  const runner = Events.createRunner(host);
  await runner.run([{ if: { flag: 'x' }, then: [{ toast: 'then' }], else: [{ toast: 'else' }] }]);
  assert.deepEqual(host.calls, [['toast', 'then']]);
}

// setFlag / clearFlag (crea save.flags se manca)
{
  const host = makeHost();
  delete host.save.flags;
  const runner = Events.createRunner(host);
  await runner.run([{ setFlag: 'visto' }]);
  assert.equal(host.save.flags.visto, true);
  await runner.run([{ clearFlag: 'visto' }]);
  assert.equal(host.save.flags.visto, false);
}

// giveItem / takeItem (non sotto zero, crea save.items se manca)
{
  const host = makeHost();
  delete host.save.items;
  const runner = Events.createRunner(host);
  await runner.run([{ giveItem: 'ball', qty: 3 }]);
  assert.equal(host.save.items.ball, 3);
  await runner.run([{ takeItem: 'ball', qty: 1 }]);
  assert.equal(host.save.items.ball, 2);
  await runner.run([{ takeItem: 'ball', qty: 100 }]);
  assert.equal(host.save.items.ball, 0, 'takeItem non va sotto 0');
}
{
  const host = makeHost();
  const runner = Events.createRunner(host);
  await runner.run([{ giveItem: 'potion' }]);
  assert.equal(host.save.items.potion, 1, 'giveItem senza qty usa 1');
}

// giveMoney / takeMoney (non sotto zero)
{
  const host = makeHost();
  const runner = Events.createRunner(host);
  await runner.run([{ giveMoney: 500 }]);
  assert.equal(host.save.money, 500);
  await runner.run([{ takeMoney: 200 }]);
  assert.equal(host.save.money, 300);
  await runner.run([{ takeMoney: 1000 }]);
  assert.equal(host.save.money, 0, 'takeMoney non va sotto 0');
}

// badge: aggiunge se assente, ordinato
{
  const host = makeHost();
  const runner = Events.createRunner(host);
  await runner.run([{ badge: 3 }, { badge: 1 }, { badge: 3 }]);
  assert.deepEqual(host.save.badges, [1, 3], 'badge aggiunta una sola volta e ordinata');
}

// heal / shop / warp / toast / giveMonster delegano all'host
{
  const host = makeHost();
  const runner = Events.createRunner(host);
  await runner.run([
    { heal: true },
    { shop: ['ball', 'potion'] },
    { warp: { map: 'monticelli', x: 1, y: 2, direction: 'down' } },
    { toast: 'ciao' },
    { giveMonster: { species: 'basilino', level: 5 } }
  ]);
  assert.deepEqual(host.calls, [
    ['heal'],
    ['shop', ['ball', 'potion']],
    ['warp', { map: 'monticelli', x: 1, y: 2, direction: 'down' }],
    ['toast', 'ciao'],
    ['giveMonster', { species: 'basilino', level: 5 }]
  ]);
}

// battleTrainer: win -> flag trainer:<id> + onWin
{
  const host = makeHost({ battleTrainer: async (id) => { host.calls.push(['battleTrainer', id]); return 'win'; } });
  const runner = Events.createRunner(host);
  await runner.run([{ battleTrainer: 'tobia', onWin: [{ toast: 'vittoria' }], onLose: [{ toast: 'sconfitta' }] }]);
  assert.equal(host.save.flags['trainer:tobia'], true);
  assert.deepEqual(host.calls[1], ['toast', 'vittoria']);
}

// battleTrainer: lose -> niente flag, esegue onLose
{
  const host = makeHost({ battleTrainer: async (id) => { host.calls.push(['battleTrainer', id]); return 'lose'; } });
  const runner = Events.createRunner(host);
  await runner.run([{ battleTrainer: 'tobia', onWin: [{ toast: 'vittoria' }], onLose: [{ toast: 'sconfitta' }] }]);
  assert.equal(host.save.flags['trainer:tobia'], undefined, 'nessun flag alla sconfitta');
  assert.deepEqual(host.calls[1], ['toast', 'sconfitta']);
}

// wildBattle: caught -> onCatch
{
  const host = makeHost({ wildBattle: async (spec) => { host.calls.push(['wildBattle', spec]); return 'caught'; } });
  const runner = Events.createRunner(host);
  await runner.run([{ wildBattle: { species: 'basilino', level: 5 }, onCatch: [{ toast: 'preso' }], onOther: [{ toast: 'altro' }] }]);
  assert.deepEqual(host.calls[1], ['toast', 'preso']);
}

// wildBattle: won/fled/lost -> onOther
for (const result of ['won', 'fled', 'lost']) {
  const host = makeHost({ wildBattle: async (spec) => { host.calls.push(['wildBattle', spec]); return result; } });
  const runner = Events.createRunner(host);
  await runner.run([{ wildBattle: { species: 'basilino', level: 5 }, onCatch: [{ toast: 'preso' }], onOther: [{ toast: 'altro' }] }]);
  assert.deepEqual(host.calls[1], ['toast', 'altro'], `wildBattle esito ${result} -> onOther`);
}

// coda di due run concorrenti: il secondo aspetta il primo
{
  const order = [];
  const host = makeHost({
    toast: async (text) => {
      if (text === 'primo') {
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      order.push(text);
    }
  });
  const runner = Events.createRunner(host);
  const p1 = runner.run([{ toast: 'primo' }]);
  const p2 = runner.run([{ toast: 'secondo' }]);
  await Promise.all([p1, p2]);
  assert.deepEqual(order, ['primo', 'secondo'], 'la seconda run parte solo dopo la fine della prima');
}

// running riflette lo stato del runner
{
  const host = makeHost({
    toast: async () => { await new Promise((resolve) => setTimeout(resolve, 10)); }
  });
  const runner = Events.createRunner(host);
  assert.equal(runner.running, false, 'running falso a riposo');
  const p = runner.run([{ toast: 'x' }]);
  assert.equal(runner.running, true, 'running vero durante l\'esecuzione');
  await p;
  assert.equal(runner.running, false, 'running falso a fine esecuzione');
}

// host incompleto non lancia, salta con warn
{
  const host = { save: { flags: {}, badges: [], items: {}, money: 0 } };
  const origWarn = console.warn;
  let warnCount = 0;
  console.warn = () => { warnCount++; };
  const runner = Events.createRunner(host);
  await assert.doesNotReject(runner.run([{ say: 'ciao' }, { heal: true }, { toast: 'x' }]));
  assert.ok(warnCount >= 3, 'ogni metodo mancante genera un warning');
  console.warn = origWarn;
}

// passo sconosciuto: warn e continua
{
  const host = makeHost();
  const origWarn = console.warn;
  let warned = false;
  console.warn = () => { warned = true; };
  await Events.createRunner(host).run([{ mistero: true }, { toast: 'dopo' }]);
  console.warn = origWarn;
  assert.equal(warned, true, 'passo sconosciuto stampa un warning');
  assert.deepEqual(host.calls, [['toast', 'dopo']], 'esecuzione continua dopo il passo sconosciuto');
}

// ---------- visibleNpcs / canUseTransition / npcScript ----------

{
  const map = {
    npcs: [
      { name: 'A', dialogue: 'ciao A' },
      { name: 'B', dialogue: 'ciao B', when: { flag: 'segreto' } }
    ]
  };
  assert.deepEqual(Events.visibleNpcs(map, { flags: {} }).map((n) => n.name), ['A'], 'npc senza when sempre visibile, con when nascosto se falsa');
  assert.deepEqual(
    Events.visibleNpcs(map, { flags: { segreto: true } }).map((n) => n.name),
    ['A', 'B'],
    'npc con when visibile se la condizione è vera'
  );
}

{
  const transitionFree = { to: 'monticelli' };
  const transitionGated = { to: 'gym', when: { badge: 1 } };
  assert.equal(Events.canUseTransition(transitionFree, {}), true, 'transizione senza when sempre percorribile');
  assert.equal(Events.canUseTransition(transitionGated, { badges: [] }), false, 'transizione con when non soddisfatta');
  assert.equal(Events.canUseTransition(transitionGated, { badges: [1] }), true, 'transizione con when soddisfatta');
}

{
  const npcWithScript = { name: 'Bobby', script: [{ say: 'script personalizzato' }] };
  jsonEqual(Events.npcScript(npcWithScript), [{ say: 'script personalizzato' }], 'npc con script restituisce lo script');

  const npcWithDialogue = { name: 'Anna', dialogue: 'ciao' };
  jsonEqual(Events.npcScript(npcWithDialogue), [{ say: 'ciao', name: 'Anna' }], 'npc senza script genera un say');
}

console.log('events.test.mjs: tutti i test superati');
