// Carica game.js in un contesto vm con un DOM finto minimo per verificare che il modulo
// si avvii senza eccezioni e che la migrazione del salvataggio v1 -> v2 funzioni.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const gameDir = path.resolve(testDir, '..');

function makeFakeElement(id) {
  const el = {
    id: id || '',
    hidden: false,
    innerHTML: '',
    textContent: '',
    value: '',
    style: {},
    dataset: {},
    classList: {
      _set: new Set(),
      toggle(name, on) { on ? this._set.add(name) : this._set.delete(name); },
      add(name) { this._set.add(name); },
      remove(name) { this._set.delete(name); },
      contains(name) { return this._set.has(name); }
    },
    children: [],
    listeners: {},
    addEventListener(type, handler) {
      this.listeners[type] = this.listeners[type] || [];
      this.listeners[type].push(handler);
    },
    removeEventListener() {},
    setPointerCapture() {},
    appendChild(child) { this.children.push(child); return child; },
    append(...items) { items.forEach(item => this.children.push(item)); },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    closest() { return null; },
    getContext() {
      return {
        imageSmoothingEnabled: true,
        fillRect() {}, strokeRect() {}, drawImage() {}, measureText() { return { width: 10 }; },
        fillStyle: '', strokeStyle: '', font: '', textAlign: ''
      };
    }
  };
  return el;
}

const fakeDocument = {
  _elements: {},
  getElementById(id) {
    if (!this._elements[id]) this._elements[id] = makeFakeElement(id);
    return this._elements[id];
  },
  createElement(tag) { return makeFakeElement(); },
  querySelectorAll() { return []; },
  addEventListener() {},
  removeEventListener() {}
};

const canvasEl = fakeDocument.getElementById('gameCanvas');
canvasEl.width = 240;
canvasEl.height = 160;

// pre-crea tutti gli id che game.js legge via getElementById così i test restano stabili
// anche se in futuro l'array `ui` cambia leggermente ordine (i valori sono generati al volo).

const storage = new Map();
const fakeLocalStorage = {
  getItem(key) { return storage.has(key) ? storage.get(key) : null; },
  setItem(key, value) { storage.set(key, String(value)); },
  removeItem(key) { storage.delete(key); }
};

class FakeImage {
  set src(_) { }
}

// Oggetti creati nel sandbox vm sono cross-realm: confronto strutturale via JSON.
function jsonEqual(actual, expected, message) {
  assert.equal(JSON.stringify(actual), JSON.stringify(expected), message);
}

const context = {
  window: {},
  document: fakeDocument,
  localStorage: fakeLocalStorage,
  console,
  performance: { now: () => Date.now() },
  requestAnimationFrame: () => 0,
  Image: FakeImage,
  Math,
  Date,
  JSON,
  Promise,
  setTimeout,
  clearTimeout,
  Blob: class { constructor() {} },
  URL: { createObjectURL: () => 'blob://fake', revokeObjectURL: () => {} },
  Set,
  Number,
  Array,
  Object,
  String,
  Boolean
};
context.window.localStorage = fakeLocalStorage;
context.window.addEventListener = () => {};
context.window.removeEventListener = () => {};
context.globalThis = context;
vm.createContext(context);

function load(file) {
  vm.runInContext(fs.readFileSync(path.join(gameDir, file), 'utf8'), context, { filename: file });
}

load('species.js');
load('moves.js');
load('data.js');
load('trainers.js');
load('battle.js');
load('events.js');

assert.doesNotThrow(() => load('game.js'), 'game.js si avvia senza eccezioni con un DOM finto minimo');

const Game = context.window.PokemonAscoliGame;
assert.ok(Game && Game._debug, 'game.js espone window.PokemonAscoliGame._debug per i test');

// --- migrazione salvataggio v1 -> v2 ---
{
  const v1 = {
    version: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    player: { map: 'porta_maggiore', x: 5, y: 15, direction: 'down' },
    starter: 'basilino',
    team: [],
    storage: [],
    items: { ball: 5, potion: 2, antidote: 0, repel: 0, acquasanta: 0 },
    dex: { seen: {}, caught: {} },
    settings: { sound: true },
    steps: 12
  };
  const migrated = Game._debug.migrateSave(v1);
  assert.equal(migrated.version, 2, 'versione aggiornata a 2');
  jsonEqual(migrated.flags, {}, 'flags aggiunto vuoto');
  jsonEqual(migrated.badges, [], 'badges aggiunto vuoto');
  assert.equal(migrated.money, 3000, 'money di default 3000');
  assert.ok(migrated.lastHeal && migrated.lastHeal.map, 'lastHeal impostato di default');
}

// --- migrazione: non tocca un salvataggio già v2 ---
{
  const v2 = {
    version: 2, player: { map: 'x', x: 0, y: 0, direction: 'down' }, flags: { a: true },
    badges: [1], money: 500, lastHeal: { map: 'x', x: 1, y: 1 }
  };
  const migrated = Game._debug.migrateSave(v2);
  assert.equal(migrated.money, 500, 'salvataggio v2 non alterato');
  jsonEqual(migrated.badges, [1], 'badges v2 preservati');
}

// --- freshSave produce una struttura v2 completa ---
{
  const fresh = Game._debug.freshSave();
  assert.equal(fresh.version, 2);
  jsonEqual(fresh.flags, {});
  jsonEqual(fresh.badges, []);
  assert.equal(fresh.money, 3000);
  assert.ok(fresh.lastHeal);
}

console.log('game.test.mjs: tutti i test superati.');
