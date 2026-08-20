// Helper riusabili per il playthrough e2e: apertura del gioco, navigazione BFS cella per cella,
// lotta automatica, dialoghi, forzatura livello squadra, screenshot. Deriva da verify-common.mjs
// (scritto durante la verifica manuale della flottiglia D), ripulito per uso riusabile.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const gameDir = path.resolve(here, '..', '..');
export const shotsDir = path.join(here, 'shots');
export const gameUrl = 'file:///' + path.resolve(gameDir, 'index.html').replace(/\\/g, '/').replace(/ /g, '%20');

// Individua un eseguibile Chromium/Edge utilizzabile: variabile d'ambiente CHROME_PATH, poi
// l'installazione locale di playwright-core in questo repo, poi i percorsi standard di Windows.
export function findBrowserExecutable() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Users/pisel/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

export async function openGame() {
  const executablePath = findBrowserExecutable();
  if (!executablePath) {
    throw new Error('Nessun eseguibile Chromium/Edge trovato: imposta CHROME_PATH o installa Chrome/Edge/playwright chromium.');
  }
  fs.mkdirSync(shotsDir, { recursive: true });
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !m.text().includes('404')) errors.push('CONSOLE: ' + m.text()); });
  await page.goto(gameUrl, { waitUntil: 'networkidle' });
  return { browser, page, errors };
}

export async function newGame(page) {
  await page.click('#newGameButton');
  await page.waitForTimeout(400);
}

export async function getSave(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('pokemonAscoliSaveV1')));
}

export async function setSave(page, save) {
  await page.evaluate((s) => localStorage.setItem('pokemonAscoliSaveV1', JSON.stringify(s)), save);
}

export async function getMapsData(page) {
  return page.evaluate(() => window.PokemonAscoliData.maps);
}

const inRect = (x, y, item) => x >= item.x && y >= item.y && x < item.x + item.w && y < item.y + item.h;
const BLOCKING_ROAD_TYPES = new Set(['albero', 'muro', 'binari']);

function walkableBase(map, x, y) {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return false;
  if (map.buildings.some(item => inRect(x, y, item))) return false;
  if (map.bridges.some(item => inRect(x, y, item))) return true;
  if (map.waters.some(item => inRect(x, y, item) && (!item.type || item.type === 'water' || item.type === 'mare'))) return false;
  if (map.roads.some(item => inRect(x, y, item) && BLOCKING_ROAD_TYPES.has(item.type))) return false;
  return true;
}

// BFS cella per cella evitando ostacoli (npc/allenatori). Ritorna la sequenza di tasti freccia.
export function bfsPath(map, obstacles, from, to, maxSteps = 20000) {
  const key = (x, y) => x + ',' + y;
  const blocked = new Set();
  obstacles.forEach(o => blocked.add(key(o.x, o.y)));
  const visited = new Set([key(from.x, from.y)]);
  const queue = [[from.x, from.y, []]];
  let steps = 0;
  while (queue.length && steps < maxSteps) {
    steps++;
    const [x, y, keyPath] = queue.shift();
    if (x === to.x && y === to.y) return keyPath;
    const neighbors = [
      [x, y - 1, 'ArrowUp'], [x, y + 1, 'ArrowDown'], [x - 1, y, 'ArrowLeft'], [x + 1, y, 'ArrowRight']
    ];
    for (const [nx, ny, k] of neighbors) {
      const kk = key(nx, ny);
      if (visited.has(kk)) continue;
      if (nx === to.x && ny === to.y) { visited.add(kk); queue.push([nx, ny, [...keyPath, k]]); continue; }
      if (!walkableBase(map, nx, ny)) continue;
      if (blocked.has(kk)) continue;
      visited.add(kk);
      queue.push([nx, ny, [...keyPath, k]]);
    }
  }
  return null;
}

const KEY_VECTOR = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };

// Attende che il gioco sia in modalita' "world" (nessuna battaglia a schermo). ATTENZIONE:
// #dialogueScreen.hidden NON e' un segnale affidabile qui - dopo una lotta con un allenatore
// startTrainerEncounter (game.js) non chiama mai closeDialogue(), quindi resta a `false` per il
// resto della partita anche se il gioco e' tornato in world (verificato: il movimento funziona
// comunque, il routing tastiera segue la variabile interna `mode`, non questo attributo). Solo
// #battleScreen.hidden si comporta in modo affidabile.
export async function waitForWorldMode(page, { timeoutMs = 4000 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const busy = await page.evaluate(() => {
      const el = document.getElementById('battleScreen');
      return el && !el.hidden;
    });
    if (!busy) return true;
    await page.waitForTimeout(100);
  }
  return false;
}

// L'animazione di movimento di game.js dura 170ms e ignora l'input durante il movimento: si
// interroga la posizione e si ripete la pressione (bump-safe: premere la stessa direzione contro
// un muro è un no-op) finché il passo non avviene davvero, invece di fidarsi di un ritardo fisso.
// Un allenatore con sight>0 puo' intercettare il giocatore a meta' passo (checkTrainerSight scatta
// dopo ogni cella percorsa in game.js): in quel caso ci si ferma appena si apre la battaglia (unico
// segnale affidabile, vedi waitForWorldMode), invece di continuare a premere frecce inutilmente.
export async function walkPath(page, keys, stepDelay = 130) {
  for (const k of keys) {
    const [dx, dy] = KEY_VECTOR[k];
    const before = await page.evaluate(() => JSON.parse(localStorage.getItem('pokemonAscoliSaveV1')).player);
    const targetX = before.x + dx, targetY = before.y + dy;
    let moved = false;
    for (let attempt = 0; attempt < 15 && !moved; attempt++) {
      await page.keyboard.press(k);
      await page.waitForTimeout(stepDelay);
      const after = await page.evaluate(() => JSON.parse(localStorage.getItem('pokemonAscoliSaveV1')).player);
      if (after.x === targetX && after.y === targetY) moved = true;
      else if (after.map !== before.map) moved = true; // una transizione è scattata a metà percorso
      const battleOpen = await page.evaluate(() => { const el = document.getElementById('battleScreen'); return el && !el.hidden; });
      if (battleOpen) return false; // un allenatore ha intercettato il giocatore: il resto del percorso non ha piu' senso
    }
    if (!moved) return false;
  }
  return true;
}

export async function defaultObstacles(page, mapId) {
  return page.evaluate((mapId) => {
    const save = JSON.parse(localStorage.getItem('pokemonAscoliSaveV1'));
    const trainers = Object.entries(window.PokemonAscoliTrainers.trainers)
      .filter(([, t]) => t.map === mapId)
      .filter(([, t]) => {
        const w = t.when;
        if (!w) return true;
        if (w.flag) return !!save.flags[w.flag];
        if (w.notFlag) return !save.flags[w.notFlag];
        return true;
      })
      .map(([, t]) => ({ x: t.x, y: t.y }));
    const map = window.PokemonAscoliData.maps[mapId];
    const npcs = (map.npcs || []).map(n => ({ x: n.x, y: n.y }));
    return [...trainers, ...npcs];
  }, mapId);
}

// Un allenatore disabilita il bottone "Fuga" (game.js: canRunAway = battle.kind === 'wild'), un
// Pokémon selvatico no: e' l'unico modo affidabile per distinguere le due battaglie da fuori,
// perche' battle.kind non e' esposto su window.
export async function isWildBattle(page) {
  const buttons = await page.$$('#battleActions button');
  if (!buttons.length) return null; // menu non ancora renderizzato
  const texts = await Promise.all(buttons.map(b => b.textContent()));
  const idx = texts.findIndex(t => t.trim() === 'Fuga');
  if (idx === -1) return null;
  return !(await buttons[idx].isDisabled());
}

// Cammina verso (x,y) via BFS. Le mappe esterne hanno zone di incontro: un Pokémon selvatico puo'
// interrompere il cammino in qualunque momento (apre #battleScreen). walkTo lo risolve da solo (lo
// combatte e prosegue verso lo stesso bersaglio) fino a un massimo di incontri, perche' altrimenti
// ogni chiamata nell'erba fallirebbe in modo indistinguibile da un vero allenatore sulla strada. Se
// invece e' un allenatore (Fuga disabilitata) si ferma senza combattere: il chiamante
// (walkUntilBattle) gestisce quel caso esplicitamente.
export async function walkTo(page, x, y, { obstaclesFn = defaultObstacles, maxWildEncounters = 40 } = {}) {
  const startSave = await getSave(page);
  let blockedRetries = 0;
  // dialoghi residui (es. il testo post-lotta di un allenatore): si chiudono con Invio prima di partire
  for (let k = 0; k < 12; k++) {
    const open = await page.evaluate(() => { const d = document.getElementById('dialogueScreen'); const b = document.getElementById('battleScreen'); return d && !d.hidden && b && b.hidden; });
    if (!open) break;
    await page.keyboard.press('Enter'); await page.waitForTimeout(220);
  }
  for (let encounter = 0; encounter <= maxWildEncounters; encounter++) {
    await waitForWorldMode(page);
    const save = await getSave(page);
    const maps = await getMapsData(page);
    const map = maps[save.player.map];
    const obstacles = await obstaclesFn(page, save.player.map);
    const path = bfsPath(map, obstacles, { x: save.player.x, y: save.player.y }, { x, y });
    if (!path) return { ok: false, reason: 'no-path', from: startSave.player, to: { x, y } };
    const completed = await walkPath(page, path);
    // un allenatore che ha visto il giocatore impiega ~0.5 s (punto esclamativo + avvicinamento)
    // prima che #battleScreen compaia: senza questa attesa lo si scambierebbe per un ostacolo
    if (!completed) await page.waitForTimeout(900);
    const battleOpen = await page.evaluate(() => { const el = document.getElementById('battleScreen'); return el && !el.hidden; });
    const dialogueOpen = await page.evaluate(() => { const el = document.getElementById('dialogueScreen'); return el && !el.hidden; });
    if (!completed && !battleOpen && dialogueOpen) {
      // un allenatore ha intercettato il giocatore e sta parlando (la lotta parte dopo il dialogo)
      return { ok: false, reason: 'trainer-battle', from: startSave.player, to: await getSave(page).then(s => s.player) };
    }
    if (!completed && !battleOpen && blockedRetries < 8) {
      // un NPC in movimento occupa temporaneamente la cella successiva: aspetta e ricalcola
      blockedRetries += 1;
      await page.waitForTimeout(700);
      encounter -= 1;
      continue;
    }
    if (battleOpen) {
      const wild = await isWildBattle(page);
      if (wild === false) return { ok: false, reason: 'trainer-battle', from: startSave.player, to: await getSave(page).then(s => s.player) };
      await autoBattle(page, { maxTurns: 60 });
      // cura completa (ricaricando il save): lungo le mappe grandi gli incontri sono decine e
      // senza bar intermedi la squadra finirebbe KO, riportando il giocatore all'ultimo bar
      const cur = await getSave(page);
      if (cur.team.length) await forceTeamLevel(page, Math.max(...cur.team.map(m => m.level)));
      continue; // riprova dalla nuova posizione verso lo stesso bersaglio
    }
    const after = await getSave(page);
    return { ok: after.player.x === x && after.player.y === y, from: startSave.player, to: after.player };
  }
  const after = await getSave(page);
  return { ok: after.player.x === x && after.player.y === y, from: startSave.player, to: after.player, reason: 'too-many-wild-encounters' };
}

// Preme la freccia indicata finché il personaggio non entra nella cella (x,y), utile per attraversare
// una transizione dove la cella di destinazione appartiene a un'altra mappa (non "walkable" su quella corrente).
export async function pushInto(page, key, maxAttempts = 5) {
  for (let i = 0; i < maxAttempts; i++) {
    const before = await getSave(page);
    await page.keyboard.press(key);
    await page.waitForTimeout(300);
    const after = await getSave(page);
    if (after.player.map !== before.player.map || after.player.x !== before.player.x || after.player.y !== before.player.y) return true;
  }
  return false;
}

// Lotta automatica: sceglie la prima mossa dannosa (Fisico/Speciale) disponibile ogni turno finché
// la schermata di battaglia non si chiude. NOTE: molte specie imparano prima una mossa di stato,
// quindi "premi sempre lo slot 1" spamma una mossa non offensiva all'infinito e non vince mai.
export async function autoBattle(page, { maxTurns = 120 } = {}) {
  for (let turn = 0; turn < maxTurns; turn++) {
    await page.waitForTimeout(120);
    const battleVisible = await page.evaluate(() => !document.getElementById('battleScreen').hidden);
    if (!battleVisible) return { ended: true, turn };
    const learnVisible = await page.evaluate(() => !document.getElementById('learnMoveScreen').hidden);
    if (learnVisible) {
      const buttons = await page.$$('#learnMoveChoices button');
      if (buttons.length) { await buttons[buttons.length - 1].click(); await page.waitForTimeout(150); continue; }
    }
    const buttons = await page.$$('#battleActions button');
    if (!buttons.length) {
      // Un messaggio di battaglia e' a schermo: si auto-avanza dopo 700ms (showNextMessage in
      // game.js), ma premere Invio (advanceMessage) lo fa scorrere subito, molto piu' veloce.
      await page.keyboard.press('Enter');
      await page.waitForTimeout(80);
      continue;
    }
    const texts = await Promise.all(buttons.map(b => b.textContent()));
    if (texts.some(t => t.trim() === 'Lotta')) {
      await buttons[texts.findIndex(t => t.trim() === 'Lotta')].click();
      await page.waitForTimeout(120);
      continue;
    }
    // Menu mosse (o un cambio squadra forzato dopo uno svenimento, senza categorie di mosse: cade
    // sul fallback generico "primo bottone abilitato diverso da Indietro" qui sotto).
    const categories = await page.evaluate((labels) => {
      const moves = window.PokemonAscoliMoves;
      return labels.map(label => {
        const name = label.replace(/\s*\d+\/\d+$/, '').trim();
        const entry = Object.values(moves).find(m => m.name === name);
        return entry ? entry.category : null;
      });
    }, texts);
    const disabledFlags = await Promise.all(buttons.map(b => b.isDisabled()));
    let idx = categories.findIndex((c, i) => (c === 'Fisico' || c === 'Speciale') && !disabledFlags[i]);
    if (idx === -1) idx = texts.findIndex((t, i) => t.trim() !== 'Indietro' && !disabledFlags[i]);
    if (idx === -1) idx = buttons.length - 1;
    await buttons[idx].click();
    await page.waitForTimeout(200);
  }
  return { ended: false, turn: maxTurns };
}

// Ricalcola le statistiche della squadra al livello dato, direttamente in save (velocizza il
// playthrough evitando di macinare livelli con lotte selvatiche). game.js tiene lo stato di gioco
// in una variabile `save` interna alla IIFE, non su `window`: scrivere solo in localStorage non la
// aggiorna, quindi si ricarica la pagina e si riprende con "Continua" per risincronizzarla.
export async function forceTeamLevel(page, level) {
  await page.evaluate((level) => {
    const save = JSON.parse(localStorage.getItem('pokemonAscoliSaveV1'));
    save.team.forEach(m => {
      m.level = level;
      const stats = window.PokemonAscoliBattle.calculateStats(m.species, level);
      m.stats = stats;
      m.hp = stats.hp;
      m.status = null;
      m.sleepTurns = 0;
      m.moves = window.PokemonAscoliBattle.movesFor(m.species, level).map(id => {
        const known = window.PokemonAscoliMoves[id];
        return { id, pp: known ? known.pp : 20, maxPp: known ? known.pp : 20 };
      });
    });
    localStorage.setItem('pokemonAscoliSaveV1', JSON.stringify(save));
  }, level);
  // game.js autosalva su ogni passo, quindi localStorage riflette gia' la posizione corrente:
  // ricaricare + "Continua" risincronizza la variabile `save` interna della IIFE senza spostare
  // il giocatore (non e' esposta su window, quindi scrivere solo in localStorage non basta).
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(200);
  await page.click('#continueButton');
  await page.waitForTimeout(300);
}

export async function healTeam(page) {
  await page.evaluate(() => {
    const save = JSON.parse(localStorage.getItem('pokemonAscoliSaveV1'));
    save.team.forEach(m => { m.hp = m.stats.hp; m.status = null; m.sleepTurns = 0; });
    localStorage.setItem('pokemonAscoliSaveV1', JSON.stringify(save));
  });
}

// Preme Invio finché la schermata di dialogo si chiude (o compare una scelta, che il chiamante
// deve gestire esplicitamente con chooseDialogueOption).
// Preme Invio finche' il dialogo si chiude. ATTENZIONE: se si preme Invio anche una sola volta di
// troppo dopo che il dialogo e' gia' chiuso, quell'Invio arriva in modalita' "world" e viene letto
// come "interagisci" - se il giocatore e' ancora rivolto verso un allenatore appena sconfitto lo
// re-interpella (mostrandone il testo `lost`) invece di restare a mani vuote. Per questo si
// ricontrolla `hidden` subito dopo ogni pressione, non solo all'inizio del giro successivo, e ci si
// ferma alla primissima conferma di chiusura invece di fidarsi di un `maxPages` generoso.
export async function advanceDialogue(page, { maxPages = 20 } = {}) {
  const pages = [];
  for (let i = 0; i < maxPages; i++) {
    const hidden = await page.evaluate(() => document.getElementById('dialogueScreen').hidden);
    if (hidden) break;
    const choicesVisible = await page.evaluate(() => !document.getElementById('dialogueChoices').hidden);
    if (choicesVisible) break;
    const name = await page.$eval('#dialogueName', e => e.textContent).catch(() => '');
    const text = await page.$eval('#dialogueText', e => e.textContent).catch(() => '');
    pages.push({ name, text });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    const closedNow = await page.evaluate(() => document.getElementById('dialogueScreen').hidden);
    if (closedNow) break;
  }
  return pages;
}

// Sceglie un'opzione del dialogo per indice (0-based) quando #dialogueChoices è visibile.
export async function chooseDialogueOption(page, index) {
  await page.click(`#dialogueChoices button >> nth=${index}`);
  await page.waitForTimeout(300);
}

// Cammina fino a (standX,standY), si volta verso faceKey, preme Invio (parla con NPC/allenatore
// o interagisce con una porta). standX/standY devono essere adiacenti al bersaglio.
export async function approachAndInteract(page, standX, standY, faceKey) {
  const r = await walkTo(page, standX, standY);
  await page.keyboard.press(faceKey);
  await page.waitForTimeout(200);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(350);
  return r;
}

// Cammina verso (x,y) come walkTo, ma un allenatore con sight>0 puo' intercettare il giocatore a
// meta' strada (checkTrainerSight scatta ad ogni cella percorsa in game.js): in quel caso il resto
// del percorso pianificato da BFS non viene eseguito, il dialogo "before" dell'allenatore si apre
// da solo e va solo scolato fino alla comparsa della schermata di battaglia. Ritorna true se una
// battaglia e' scattata durante il cammino (il chiamante puo' saltare l'autoBattle "prima" e agire
// solo dopo), false se il cammino e' arrivato a destinazione senza incontri.
// ATTENZIONE: non usare #dialogueScreen.hidden per decidere se c'e' un dialogo "before" da scolare
// dopo la prima battaglia della partita (vedi la nota su waitForWorldMode): resta sempre a `false`.
// Se il cammino si interrompe prima del bersaglio (walkTo non riuscito) si preme Invio un numero
// fisso di volte finche' non appare la battaglia, che e' l'unico segnale affidabile; se invece il
// cammino e' arrivato a destinazione senza intoppi non si preme nulla (nessun allenatore atteso).
export async function walkUntilBattle(page, x, y, { obstaclesFn = defaultObstacles } = {}) {
  const r = await walkTo(page, x, y, { obstaclesFn });
  const battleAlready = await page.evaluate(() => { const el = document.getElementById('battleScreen'); return el && !el.hidden; });
  if (battleAlready) return true;
  if (r.ok) return false; // arrivato a destinazione: nessun allenatore ha intercettato il giocatore
  for (let i = 0; i < 20; i++) {
    const battleOn = await page.evaluate(() => { const el = document.getElementById('battleScreen'); return el && !el.hidden; });
    if (battleOn) return true;
    await page.keyboard.press('Enter');
    await page.waitForTimeout(250);
  }
  return page.evaluate(() => { const el = document.getElementById('battleScreen'); return el && !el.hidden; });
}

export async function screenshot(page, name) {
  fs.mkdirSync(shotsDir, { recursive: true });
  await page.screenshot({ path: path.join(shotsDir, name.endsWith('.png') ? name : name + '.png') });
}
