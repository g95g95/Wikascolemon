// Giocatore automatico: apre il gioco in Chrome senza finestra (`index.html?debug=1`) e lo percorre
// per trovare difetti che i test sui dati non vedono. Non ha dipendenze: parla con Chrome via CDP.
//
//   node tools/gioca.mjs                 # tutte le prove
//   node tools/gioca.mjs passaggi porte  # solo alcune: passaggi, porte, npc, allenatori, selvatici, menu
//
// Chrome: variabile CHROME_PATH, altrimenti i percorsi standard di Windows.
// Ogni prova teletrasporta Oliver (aggancio PokemonAscoliDebug in game.js) e poi usa i tasti veri.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const gameDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const wanted = process.argv.slice(2);
const run = name => !wanted.length || wanted.includes(name);
const chromePath = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(p => p && fs.existsSync(p));
if (!chromePath) { console.error('Chrome non trovato: imposta CHROME_PATH.'); process.exit(1); }

const port = 9342;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'pokemon-ascoli-gioca-'));
const chrome = spawn(chromePath, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--window-size=960,760', '--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required', 'about:blank']);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let targets;
for (let i = 0; i < 60; i += 1) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(250); } }
const socket = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(resolve => { socket.onopen = resolve; });
let nextId = 0;
const pending = new Map();
const pageErrors = [];
socket.onmessage = event => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) { pending.get(message.id)(message); pending.delete(message.id); }
  if (message.method === 'Runtime.exceptionThrown') pageErrors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
};
const send = (method, params = {}) => new Promise(resolve => { nextId += 1; pending.set(nextId, resolve); socket.send(JSON.stringify({ id: nextId, method, params })); });
const page = async expression => {
  const reply = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (reply.result.exceptionDetails) throw new Error(reply.result.exceptionDetails.exception?.description || 'errore nella pagina');
  return reply.result.result.value;
};
const call = async (fn, ...args) => JSON.parse(await page(`(async () => JSON.stringify(await (${fn})(...${JSON.stringify(args)})))()`));

// --- il "giocatore" che gira dentro la pagina ---
const BOT = `window.__bot = (() => {
  const D = () => window.PokemonAscoliDebug;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const key = (type, code) => document.dispatchEvent(new KeyboardEvent(type, { code, key: code, bubbles: true }));
  const KEYS = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };
  const shown = id => !document.getElementById(id).hidden;
  // un passo in una direzione (Oliver deve già guardare da quella parte, altrimenti il primo colpo lo gira)
  async function step(direction) {
    const before = D().state();
    key('keydown', KEYS[direction]);
    const started = performance.now();
    let now = before;
    while (now.mode === 'world' && now.map === before.map && now.x === before.x && now.y === before.y && performance.now() - started < 1100) { await sleep(40); now = D().state(); }
    key('keyup', KEYS[direction]);
    for (let i = 0; i < 40 && D().state().moving; i += 1) await sleep(30);
    await sleep(80);
    return D().state();
  }
  // porta avanti dialoghi, lotte, negozi e schermate finché non si torna a camminare
  async function settle(limit = 600) {
    const said = [];
    for (let i = 0; i < limit; i += 1) {
      const s = D().state();
      if (shown('learnMoveScreen')) { const b = [...document.querySelectorAll('#learnMoveChoices button')]; b[b.length - 1].click(); await sleep(80); continue; }
      if (shown('shopScreen')) { document.getElementById('shopClose').click(); await sleep(80); continue; }
      if (shown('creditsScreen')) { document.getElementById('creditsClose').click(); await sleep(80); continue; }
      if (s.mode === 'battle') {
        const buttons = [...document.querySelectorAll('#battleActions button')];
        if (buttons.length === 4 && /borsa/i.test(buttons[1].textContent)) {
          buttons[0].click(); await sleep(50);
          const moves = [...document.querySelectorAll('#battleActions button')].filter(b => !b.disabled && !/indietro/i.test(b.textContent));
          if (moves.length) moves[0].click();
          await sleep(70); continue;
        }
        if (buttons.length) { const usable = buttons.filter(b => !b.disabled); (usable[0] || buttons[0]).click(); await sleep(70); continue; }
        document.getElementById('battleMessage').click(); await sleep(70); continue;
      }
      if (s.mode === 'dialogue') {
        const choices = [...document.querySelectorAll('#dialogueChoices button')];
        if (shown('dialogueChoices') && choices.length) { choices[0].click(); await sleep(90); continue; }
        if (shown('dialogueScreen')) { const text = document.getElementById('dialogueText').textContent; if (said[said.length - 1] !== text) said.push(text); }
        key('keydown', 'Enter'); key('keyup', 'Enter'); await sleep(70); continue;
      }
      if (s.mode === 'world' && !s.approaching && !s.moving) {
        await sleep(200);
        const again = D().state();
        if (again.mode === 'world' && !again.approaching) return { ok: true, said, turns: i, state: again };
        continue;
      }
      await sleep(90);
    }
    return { ok: false, said, state: D().state() };
  }
  const free = (x, y) => !D().blocked(x, y);
  const canMove = () => { const s = D().state(); return [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => free(s.x + dx, s.y + dy)); };
  const interact = async () => { key('keydown', 'Enter'); key('keyup', 'Enter'); await sleep(120); };
  return { D, sleep, key, step, settle, free, canMove, interact, shown };
})();`;

const url = `${pathToFileURL(path.join(gameDir, 'index.html')).href}?debug=1`;
await send('Runtime.enable');
await send('Page.enable');
async function freshGame() {
  await send('Page.navigate', { url });
  await sleep(1200);
  await page(`(() => { const B = window.PokemonAscoliBattle, D = window.PokemonAscoliData;
    localStorage.setItem('pokemonAscoliSaveV1', JSON.stringify({ version: 2, name: 'Prova', player: { ...D.start }, starter: 'basilino',
      team: [B.createMonster('basilino', 70)], storage: [], items: { ...D.initialItems, ball: 50, potion: 20 }, dex: { seen: {}, caught: {} },
      settings: { sound: false, music: false }, steps: 0, flags: { intro_vista: true }, badges: [], money: 3000, lastHeal: { ...D.respawn } })); })()`);
  await send('Page.navigate', { url });
  await sleep(1200);
  await page(`document.getElementById('continueButton').click()`);
  await sleep(500);
  await page(BOT);
  // tutte le condizioni soddisfatte: ogni flag letto da un `when`, e le due medaglie
  await page(`(() => { const flags = new Set(); const walk = v => { if (!v || typeof v !== 'object') return; if (Array.isArray(v)) return v.forEach(walk); if (typeof v.flag === 'string') flags.add(v.flag); Object.values(v).forEach(walk); };
    walk(window.PokemonAscoliMaps); walk(window.PokemonAscoliTrainers.trainers); window.PokemonAscoliDebug.setFlags([...flags].filter(f => !f.startsWith('trainer:')), [1, 2]); })()`);
}

const problems = [];
const note = (area, text) => { problems.push(`[${area}] ${text}`); console.log(`  ✗ ${text}`); };
const mapsInfo = async () => JSON.parse(await page(`JSON.stringify(Object.fromEntries(Object.entries(window.PokemonAscoliMaps).map(([id, m]) => [id, { name: m.name, indoor: !!m.indoor, width: m.width, height: m.height,
  transitions: (m.transitions || []).map(t => ({ x: t.x, y: t.y, w: t.w, h: t.h, to: t.to, label: t.label, back: !!t.back })),
  doors: (m.buildings || []).filter(b => b.door).map(b => ({ name: b.name, x: b.door.x, y: b.door.y, interior: b.interior || null, enters: !!(b.script && JSON.stringify(b.script).includes('warp')) })),
  zones: (m.encounterZones || []).length }])))`));
const VEC = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

await freshGame();
const maps = await mapsInfo();

if (run('passaggi')) {
  console.log('PASSAGGI');
  let done = 0;
  for (const [id, map] of Object.entries(maps)) {
    for (const t of map.transitions) {
      const result = await call(`async (id, t) => { const b = window.__bot, D = b.D(); D.teleport(id, 0, 0, 'down');
        const VEC = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
        for (let y = t.y; y < t.y + t.h; y += 1) for (let x = t.x; x < t.x + t.w; x += 1) for (const [dir, [dx, dy]] of Object.entries(VEC)) {
          const fx = x - dx, fy = y - dy;
          if (fx >= t.x && fx < t.x + t.w && fy >= t.y && fy < t.y + t.h) continue;
          if (!b.free(fx, fy) || !b.free(x, y)) continue;
          D.teleport(id, fx, fy, dir);
          await b.sleep(60);
          const after = await b.step(dir);
          await b.sleep(250);
          const end = D.state();
          return { from: [fx, fy, dir], end, canMove: b.canMove(), toast: document.getElementById('toast').hidden ? '' : document.getElementById('toast').textContent };
        }
        return { unreachable: true }; }`, id, t);
      done += 1;
      if (result.unreachable) { note('passaggi', `${id} → ${t.to} («${t.label}»): nessuna cella libera da cui entrarci`); continue; }
      if (result.end.mode !== 'world') note('passaggi', `${id} → ${t.to}: dopo il passaggio il gioco resta in modalità ${result.end.mode}`);
      else if (result.end.map !== t.to) note('passaggi', `${id} → ${t.to} («${t.label}») da ${result.from}: arrivato in ${result.end.map} (${result.end.x},${result.end.y})${result.toast ? ' — avviso: ' + result.toast : ''}`);
      else if (!result.canMove) note('passaggi', `${id} → ${t.to}: all'arrivo (${result.end.x},${result.end.y}) Oliver è murato`);
    }
  }
  console.log(`  ${done} passaggi provati`);
}

if (run('porte')) {
  console.log('PORTE');
  let done = 0;
  for (const [id, map] of Object.entries(maps)) {
    for (const door of map.doors) {
      const result = await call(`async (id, door) => { const b = window.__bot, D = b.D(); D.teleport(id, door.x, door.y, 'up'); await b.sleep(60);
        if (D.blocked(door.x, door.y + 1) && D.blocked(door.x - 1, door.y) && D.blocked(door.x + 1, door.y)) return { walled: true };
        await b.step('up'); const first = await b.settle(80); const inside = D.state();
        let back = null;
        if (inside.map !== id) { // dentro: esce dal primo passaggio della stanza
          const m = window.PokemonAscoliMaps[inside.map]; const t = m.transitions[0];
          D.teleport(inside.map, t.x, t.y - 1, 'down'); await b.sleep(60); await b.step('down'); await b.sleep(300); back = D.state();
        }
        return { inside, back, said: first.said, ok: first.ok }; }`, id, door);
      done += 1;
      if (result.walled) { note('porte', `${id}: la porta di «${door.name}» è chiusa da ostacoli su tre lati`); continue; }
      if (!result.ok) note('porte', `${id}: «${door.name}» — il gioco resta bloccato dopo aver provato a entrare (${result.inside.mode})`);
      if (door.enters) {
        if (result.inside.map === id) note('porte', `${id}: «${door.name}» dovrebbe far entrare ma Oliver resta fuori${result.said.length ? ' («' + result.said[0] + '»)' : ''}`);
        else if (!result.back || result.back.map !== id) note('porte', `${id}: «${door.name}» — uscendo si finisce in ${result.back ? result.back.map + ' (' + result.back.x + ',' + result.back.y + ')' : '?'} invece che in ${id}`);
        else if (maps[result.inside.map].transitions[0].back && (result.back.x !== door.x || result.back.y < door.y || result.back.y > door.y + 1)) note('porte', `${id}: «${door.name}» — uscendo si torna in (${result.back.x},${result.back.y}) invece che davanti alla porta (${door.x},${door.y})`);
      } else if (!result.said.length) note('porte', `${id}: «${door.name}» ha una porta ma non succede niente`);
    }
  }
  console.log(`  ${done} porte provate`);
}

if (run('npc')) {
  console.log('PERSONAGGI');
  let done = 0;
  for (const id of Object.keys(maps)) {
    const list = await call(`async id => { const D = window.__bot.D(); D.teleport(id, 0, 0, 'down'); return D.npcs(); }`, id);
    for (const npc of list) {
      const result = await call(`async (id, npc) => { const b = window.__bot, D = b.D(); D.teleport(id, 0, 0, 'down'); D.heal();
        const VEC = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
        const counters = (window.PokemonAscoliMaps[id].decor || []).filter(d => (window.PokemonAscoliTiles.DECOR_KINDS[d.kind] || {}).counter);
        for (const [dir, [dx, dy]] of Object.entries(VEC)) {
          let px = npc.x - dx, py = npc.y - dy;
          if (counters.some(c => c.y === py && px >= c.x && px < c.x + 2)) { px -= dx; py -= dy; } // si parla attraverso il bancone
          if (!b.free(px, py)) continue;
          D.teleport(id, px, py, dir); await b.sleep(60); await b.interact();
          const opened = D.state().mode;
          const end = await b.settle(500);
          return { opened, ok: end.ok, said: end.said.length, first: end.said[0] || '', state: end.state };
        }
        return { unreachable: true }; }`, id, npc);
      done += 1;
      if (result.unreachable) note('npc', `${id}: «${npc.name}» (${npc.x},${npc.y}) non ha una cella libera accanto: non ci si può parlare`);
      else if (result.opened === 'world' && !result.said) note('npc', `${id}: parlando con «${npc.name}» (${npc.x},${npc.y}) non succede niente`);
      else if (!result.ok) note('npc', `${id}: dopo «${npc.name}» il gioco resta bloccato in modalità ${result.state.mode}`);
    }
  }
  console.log(`  ${done} personaggi provati`);
}

if (run('allenatori')) {
  console.log('ALLENATORI');
  let done = 0;
  for (const id of Object.keys(maps)) {
    const list = await call(`async id => { const D = window.__bot.D(); D.teleport(id, 0, 0, 'down'); return D.trainers().filter(t => !t.defeated); }`, id);
    for (const trainer of list) {
      const result = await call(`async (id, t) => { const b = window.__bot, D = b.D(); D.teleport(id, 0, 0, 'down'); D.setTeam([{ species: 'basilino', level: 80 }]);
        const VEC = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }; const OPP = { up: 'down', down: 'up', left: 'right', right: 'left' };
        const [dx, dy] = VEC[t.direction]; const money = D.state().money; let how = 'parlando';
        const reach = Math.min(t.sight, 3);
        let started = false;
        if (reach >= 1) { // entra di lato nella linea di sguardo
          const sx = t.x + dx * reach, sy = t.y + dy * reach;
          for (const [dir, [ox, oy]] of Object.entries(VEC)) {
            if (ox === dx && oy === dy || ox === -dx && oy === -dy) continue;
            const fx = sx - ox, fy = sy - oy;
            if (!b.free(fx, fy) || !b.free(sx, sy)) continue;
            let clear = true; for (let i = 1; i < reach; i += 1) if (!b.free(t.x + dx * i, t.y + dy * i)) clear = false;
            if (!clear) continue;
            D.teleport(id, fx, fy, dir); await b.sleep(60); await b.step(dir); await b.sleep(400);
            const s = D.state(); started = s.mode !== 'world' || !!s.approaching; how = 'a vista (' + reach + ' celle)'; break;
          }
        }
        if (!started) { const px = t.x + dx, py = t.y + dy; if (!b.free(px, py)) return { unreachable: true }; D.teleport(id, px, py, OPP[t.direction]); await b.sleep(60); await b.interact(); how = reach >= 1 && how !== 'parlando' ? how + ' NON scattata, poi parlando' : 'parlando'; }
        const end = await b.settle(900);
        const s = D.state();
        return { how, ok: end.ok, beaten: s.flags.includes('trainer:' + t.id), moneyGain: s.money - money, state: s, said: end.said.length }; }`, id, trainer);
      done += 1;
      if (result.unreachable) { note('allenatori', `${id}: ${trainer.id} non ha la cella davanti libera`); continue; }
      if (/NON scattata/.test(result.how)) note('allenatori', `${id}: ${trainer.id} non reagisce quando Oliver entra nel suo campo visivo (${trainer.sight} celle, guarda ${trainer.direction})`);
      if (!result.ok) note('allenatori', `${id}: dopo la sfida con ${trainer.id} il gioco resta in modalità ${result.state.mode}`);
      else if (!result.beaten) note('allenatori', `${id}: ${trainer.id} sfidato (${result.how}) ma non risulta sconfitto`);
      else if (result.moneyGain <= 0) note('allenatori', `${id}: ${trainer.id} sconfitto ma niente Talleri (${result.moneyGain})`);
    }
  }
  console.log(`  ${done} allenatori sfidati`);
}

if (run('selvatici')) {
  console.log('SELVATICI');
  for (const [id, map] of Object.entries(maps)) {
    if (map.indoor || !map.zones) continue;
    const result = await call(`async id => { const b = window.__bot, D = b.D(); D.teleport(id, 0, 0, 'down'); D.setTeam([{ species: 'basilino', level: 80 }]);
      const m = window.PokemonAscoliMaps[id]; let spot = null;
      for (let y = 1; y < m.height - 1 && !spot; y += 1) for (let x = 1; x < m.width - 2 && !spot; x += 1) if (D.tallGrass(x, y) && D.tallGrass(x + 1, y) && b.free(x, y) && b.free(x + 1, y)) spot = [x, y];
      if (!spot) return { noGrass: true, sand: (m.roads || []).some(r => r.type === 'sabbia') };
      D.teleport(id, spot[0], spot[1], 'right');
      let steps = 0;
      for (; steps < 400 && D.state().mode === 'world'; steps += 1) await b.step(steps % 2 ? 'left' : 'right');
      if (D.state().mode !== 'battle') return { noEncounter: true, steps };
      const enemy = D.state().battle.enemy; const end = await b.settle(600);
      // sulla strada o su una piazza non deve capitare niente
      let paved = null;
      for (let y = 1; y < m.height - 1 && !paved; y += 1) for (let x = 1; x < m.width - 2 && !paved; x += 1) {
        const ground = window.PokemonAscoliTiles.terrainAt(m, x, y);
        if (['road', 'asfalto', 'piazza', 'travertino'].includes(ground) && window.PokemonAscoliTiles.terrainAt(m, x + 1, y) === ground && b.free(x, y) && b.free(x + 1, y) && (m.encounterZones || []).some(z => x >= z.x && y >= z.y && x < z.x + z.w && y < z.y + z.h)) paved = [x, y];
      }
      let onRoad = false;
      if (paved) { D.teleport(id, paved[0], paved[1], 'right'); for (let i = 0; i < 120 && D.state().mode === 'world'; i += 1) await b.step(i % 2 ? 'left' : 'right'); onRoad = D.state().mode === 'battle'; if (onRoad) await b.settle(600); }
      return { steps, enemy, ok: end.ok, state: end.state, paved, onRoad }; }`, id);
    if (result.noGrass && result.sand) { console.log(`  ${id}: niente erba alta, zone su sabbia (incontri in spiaggia)`); continue; }
    if (result.noGrass) { note('selvatici', `${id}: ha zone d'incontro ma nessuna cella d'erba alta percorribile`); continue; }
    if (result.noEncounter) { note('selvatici', `${id}: ${result.steps} passi nell'erba alta e nessun incontro`); continue; }
    if (!result.ok) note('selvatici', `${id}: la lotta con ${result.enemy} non si chiude (${result.state.mode})`);
    if (result.onRoad) note('selvatici', `${id}: incontro sulla strada/piazza in (${result.paved})`);
    console.log(`  ${id}: incontro dopo ${result.steps} passi (${result.enemy})${result.paved ? ', strada in zona senza incontri' : ''}`);
  }
  // cattura e sconfitta
  const capture = await call(`async () => { const b = window.__bot, D = b.D(); const id = 'porta_maggiore'; const m = window.PokemonAscoliMaps[id];
    D.teleport(id, 0, 0, 'down'); D.setTeam([{ species: 'basilino', level: 80 }]); D.setItems({ ball: 60 }); let spot = null;
    for (let y = 1; y < m.height - 1 && !spot; y += 1) for (let x = 1; x < m.width - 2 && !spot; x += 1) if (D.tallGrass(x, y) && D.tallGrass(x + 1, y) && b.free(x, y) && b.free(x + 1, y)) spot = [x, y];
    D.teleport(id, spot[0], spot[1], 'right');
    for (let i = 0; i < 400 && D.state().mode === 'world'; i += 1) await b.step(i % 2 ? 'left' : 'right');
    const before = D.state(); let throws = 0;
    for (; throws < 40 && D.state().mode === 'battle'; ) {
      const buttons = [...document.querySelectorAll('#battleActions button')];
      if (buttons.length === 4 && /borsa/i.test(buttons[1].textContent)) { buttons[1].click(); await b.sleep(60); document.querySelector('#battleActions button').click(); throws += 1; await b.sleep(400); continue; }
      document.getElementById('battleMessage').click(); await b.sleep(120);
    }
    await b.sleep(600); const after = D.state();
    return { throws, mode: after.mode, teamBefore: before.team.length, teamAfter: after.team.length, storage: after.storage, balls: after.items.ball, ballHidden: document.getElementById('battleBall').hidden }; }`);
  if (capture.mode !== 'world') note('selvatici', `cattura: dopo ${capture.throws} Ball il gioco resta in modalità ${capture.mode}`);
  else if (capture.teamAfter + capture.storage <= capture.teamBefore) note('selvatici', `cattura: ${capture.throws} Ball lanciate ma nessun Pokémon in più`);
  else if (60 - capture.balls !== capture.throws) note('selvatici', `cattura: lanciate ${capture.throws} Ball ma ne sono state scalate ${60 - capture.balls}`);
  console.log(`  cattura: ${capture.throws} Ball, squadra ${capture.teamBefore} → ${capture.teamAfter}`);
  // esperienza divisa: entra un Pokémon debole, poi il cambio con quello forte che vince
  const share = await call(`async () => { const b = window.__bot, D = b.D(); const id = 'porta_maggiore'; const m = window.PokemonAscoliMaps[id];
    D.teleport(id, 0, 0, 'down'); D.setTeam([{ species: 'tuffito', level: 5 }, { species: 'basilino', level: 80 }]); let spot = null;
    for (let y = 1; y < m.height - 1 && !spot; y += 1) for (let x = 1; x < m.width - 2 && !spot; x += 1) if (D.tallGrass(x, y) && D.tallGrass(x + 1, y) && b.free(x, y) && b.free(x + 1, y)) spot = [x, y];
    D.teleport(id, spot[0], spot[1], 'right');
    for (let i = 0; i < 400 && D.state().mode === 'world'; i += 1) await b.step(i % 2 ? 'left' : 'right');
    const before = D.state().team.map(t => t.exp);
    await b.sleep(1500);
    [...document.querySelectorAll('#battleActions button')][2].click(); await b.sleep(80);
    [...document.querySelectorAll('#battleActions button')][1].click(); await b.sleep(300);
    const end = await b.settle(600); const after = D.state().team;
    return { ok: end.ok, gains: after.map((t, i) => t.exp - before[i]), hp: after.map(t => t.hp) }; }`);
  if (!share.ok) note('selvatici', 'esperienza divisa: la lotta dopo il cambio non si chiude');
  else if (share.hp[0] > 0 && !(share.gains[0] > 0 && share.gains[1] > 0)) note('selvatici', `esperienza divisa: dopo il cambio hanno preso ${share.gains.join(' e ')} punti (dovevano prenderne entrambi)`);
  console.log(`  esperienza dopo un cambio: ${share.gains.join(' e ')} punti (PS ${share.hp.join(' e ')})`);
  const wipe = await call(`async () => { const b = window.__bot, D = b.D(); const id = 'porta_maggiore'; const m = window.PokemonAscoliMaps[id];
    D.teleport(id, 0, 0, 'down'); D.setTeam([{ species: 'basilino', level: 2, hp: 1 }]); let spot = null;
    for (let y = 1; y < m.height - 1 && !spot; y += 1) for (let x = 1; x < m.width - 2 && !spot; x += 1) if (D.tallGrass(x, y) && D.tallGrass(x + 1, y) && b.free(x, y) && b.free(x + 1, y)) spot = [x, y];
    D.teleport(id, spot[0], spot[1], 'right');
    for (let i = 0; i < 400 && D.state().mode === 'world'; i += 1) await b.step(i % 2 ? 'left' : 'right');
    const end = await b.settle(600); const s = D.state();
    return { ok: end.ok, mode: s.mode, map: s.map, x: s.x, y: s.y, hp: s.team[0].hp, canMove: b.canMove() }; }`);
  if (!wipe.ok) note('selvatici', `sconfitta: il gioco resta in modalità ${wipe.mode}`);
  else if (wipe.hp <= 0) note('selvatici', 'sconfitta: la squadra non viene curata');
  else if (!wipe.canMove) note('selvatici', `sconfitta: Oliver riparte murato in ${wipe.map} (${wipe.x},${wipe.y})`);
  console.log(`  sconfitta: si riparte da ${wipe.map} (${wipe.x},${wipe.y}) con ${wipe.hp} PS`);
}

if (run('menu')) {
  console.log('MENU');
  const result = await call(`async () => { const b = window.__bot, D = b.D(); D.teleport('porta_maggiore', window.PokemonAscoliData.start.x, window.PokemonAscoliData.start.y, 'down'); D.setTeam([{ species: 'basilino', level: 20 }, { species: 'tuffito', level: 12 }]);
    document.getElementById('menuButton').click(); await b.sleep(100); const out = {};
    for (const tab of [...document.querySelectorAll('#menuTabs [data-tab]')]) { tab.click(); await b.sleep(120); out[tab.dataset.tab] = document.getElementById('menuContent').innerText.trim().length; }
    document.querySelector('#menuTabs [data-tab=team]').click(); await b.sleep(100); document.querySelector('.party-slot.lead').click(); await b.sleep(100);
    out.scheda = document.getElementById('menuContent').innerText.includes('Mosse'); document.getElementById('summaryBack').click(); await b.sleep(80);
    document.getElementById('menuClose').click(); await b.sleep(100); out.lista = document.getElementById('menuScreen').dataset.view === 'list';
    document.getElementById('menuExit').click(); await b.sleep(100); out.mode = D.state().mode; return out; }`);
  if (!result.lista) note('menu', '«Indietro» non riporta alla lista del menu');
  for (const [tab, length] of Object.entries(result)) if (typeof length === 'number' && length < 5) note('menu', `la scheda «${tab}» del menu è vuota`);
  if (!result.scheda) note('menu', 'la scheda del Pokémon non si apre dalla Squadra');
  if (result.mode !== 'world') note('menu', `chiuso il menu il gioco resta in modalità ${result.mode}`);
  console.log(`  schede: ${Object.keys(result).filter(k => typeof result[k] === 'number').join(', ')}`);
}

pageErrors.forEach(error => note('errori', `errore JavaScript: ${String(error).split('\n')[0]}`));
console.log(problems.length ? `\n${problems.length} PROBLEMI:\n${problems.join('\n')}` : '\nNessun problema trovato.');
socket.close();
chrome.kill();
try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* il profilo temporaneo resta: non è un problema */ }
process.exit(problems.length ? 1 : 0);
