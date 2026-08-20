import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const gameDir = path.resolve(testDir, '..');

// --- DOM finto minimo, come tests/regression.mjs fa per i controlli statici, ma qui serve
// eseguire configuratore.js dentro un vm con document/canvas/localStorage fittizi: il modulo
// gira come IIFE che tocca il DOM al caricamento (popola select, disegna, registra eventi).

function makeElement(id) {
  const el = {
    id,
    value: '',
    textContent: '',
    innerHTML: '',
    checked: false,
    dataset: {},
    style: {},
    classList: { toggle() {}, add() {}, remove() {}, contains() { return false; } },
    children: [],
    options: [],
    addEventListener() {},
    removeEventListener() {},
    appendChild(child) { this.children.push(child); return child; },
    add(option) { this.options.push(option); },
    querySelectorAll() { return []; },
    querySelector() { return null; },
    getBoundingClientRect() { return { left: 0, top: 0, width: 768, height: 576 }; },
    setPointerCapture() {},
    getContext() {
      return {
        clearRect() {}, fillRect() {}, strokeRect() {}, beginPath() {}, moveTo() {}, lineTo() {},
        stroke() {}, fillText() {}, measureText() { return { width: 10 }; },
        set fillStyle(_) {}, set strokeStyle(_) {}, set lineWidth(_) {}, set font(_) {}, set textAlign(_) {}
      };
    }
  };
  return el;
}

class FakeStorage {
  constructor() { this.store = new Map(); }
  getItem(key) { return this.store.has(key) ? this.store.get(key) : null; }
  setItem(key, value) { this.store.set(key, String(value)); }
  removeItem(key) { this.store.delete(key); }
}

function makeDocument() {
  const elements = new Map();
  return {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, makeElement(id));
      return elements.get(id);
    },
    querySelectorAll() { return []; },
    querySelector() { return null; },
    createElement(tag) {
      const el = makeElement(`created-${tag}`);
      if (tag === 'a') { el.click = () => {}; }
      return el;
    }
  };
}

class FakeOption {
  constructor(text, value) { this.text = text; this.value = value; }
  cloneNode() { return new FakeOption(this.text, this.value); }
}

const context = {
  window: {},
  console,
  localStorage: new FakeStorage(),
  confirm: () => true,
  Blob: class { constructor() {} },
  URL: { createObjectURL: () => '', revokeObjectURL: () => {} },
  FileReader: class { readAsText() {} },
  Option: FakeOption,
  Math
};
context.document = makeDocument();
context.window.document = context.document;
vm.createContext(context);

for (const file of ['species.js', 'moves.js', 'data.js', 'trainers.js']) {
  vm.runInContext(fs.readFileSync(path.join(gameDir, file), 'utf8'), context);
}
context.module = { exports: {} };
vm.runInContext(fs.readFileSync(path.join(gameDir, 'configuratore.js'), 'utf8'), context, { filename: 'configuratore.js' });

const { validateTrainers } = context.module.exports;
assert.equal(typeof validateTrainers, 'function', 'validateTrainers deve essere esportata da configuratore.js per i test');

const data = context.window.PokemonAscoliData;
const trainersDefault = context.window.PokemonAscoliTrainers;

// --- Dati buoni: usa la configurazione reale di trainers.js. I due capipalestra vivono su
// mappe (castel_di_lama, costa) non ancora presenti in data.js: è un gap noto del roster mappe,
// non un bug di validateTrainers, quindi qui verifichiamo solo che non emerga altro.
const goodProblems = validateTrainers(
  { trainers: trainersDefault.trainers, gyms: trainersDefault.gyms },
  data.maps,
  data.species
);
const knownMissingMaps = new Set(['castel_di_lama_hills: quartiere "castel_di_lama" inesistente', 'costa_riccio: quartiere "costa" inesistente']);
const unexpectedProblems = goodProblems.filter(p => !knownMissingMaps.has(p));
assert.equal(unexpectedProblems.length, 0, `Dati reali di trainers.js non dovrebbero avere altri problemi oltre alle mappe palestra mancanti, trovati: ${JSON.stringify(unexpectedProblems)}`);

// --- Dati cattivi: un problema per categoria.
const baseTrainer = {
  map: 'porta_maggiore', x: 22, y: 19, direction: 'down', sight: 4,
  class: 'ragazzino', name: 'Test', sprite: null,
  team: [{ species: 'basilino', level: 5 }],
  before: ['Ciao'], after: ['Ok'], lost: 'Torna',
  money: null, gym: null, when: null
};

function withProblems(overrides, gymOverrides) {
  const trainers = { good: { ...baseTrainer, ...overrides } };
  const gyms = gymOverrides || {};
  return validateTrainers({ trainers, gyms }, data.maps, data.species);
}

// Cella su edificio.
{
  const buildingsMap = data.maps.porta_maggiore;
  const b = buildingsMap.buildings[0];
  const problems = withProblems({ x: b.x, y: b.y });
  assert.ok(problems.some(p => p.includes('edificio o acqua')), `Cella su edificio non rilevata: ${JSON.stringify(problems)}`);
}

// Cella su acqua.
{
  const waterMap = data.maps.porta_maggiore;
  const w = waterMap.waters[0];
  const problems = withProblems({ x: w.x, y: w.y });
  assert.ok(problems.some(p => p.includes('edificio o acqua')), `Cella su acqua non rilevata: ${JSON.stringify(problems)}`);
}

// Cella fuori mappa.
{
  const problems = withProblems({ x: 999, y: 999 });
  assert.ok(problems.some(p => p.includes('fuori dalla mappa')), `Cella fuori mappa non rilevata: ${JSON.stringify(problems)}`);
}

// Squadra vuota.
{
  const problems = withProblems({ team: [] });
  assert.ok(problems.some(p => p.includes('squadra vuota')), `Squadra vuota non rilevata: ${JSON.stringify(problems)}`);
}

// Specie inesistente.
{
  const problems = withProblems({ team: [{ species: 'non_esiste', level: 5 }] });
  assert.ok(problems.some(p => p.includes('specie') && p.includes('non_esiste')), `Specie inesistente non rilevata: ${JSON.stringify(problems)}`);
}

// Leader di palestra non definito.
{
  const problems = validateTrainers(
    { trainers: {}, gyms: { fantasma: { name: 'Palestra Fantasma', leader: 'nessuno' } } },
    data.maps,
    data.species
  );
  assert.ok(problems.some(p => p.includes('leader di palestra non definito')), `Leader mancante non rilevato: ${JSON.stringify(problems)}`);
}

// Palestra referenziata dal trainer ma non definita in gyms.
{
  const problems = withProblems({ gym: { id: 'palestra_mai_definita', badge: 1, badgeName: 'X', type: 'Normale', tm: null } });
  assert.ok(problems.some(p => p.includes('palestra') && p.includes('non definita')), `Palestra non definita non rilevata: ${JSON.stringify(problems)}`);
}

// Badge duplicati.
{
  const trainers = {
    uno: { ...baseTrainer, gym: { id: 'g1', badge: 3, badgeName: 'A', type: 'Normale', tm: null } },
    due: { ...baseTrainer, gym: { id: 'g2', badge: 3, badgeName: 'B', type: 'Normale', tm: null } }
  };
  const gyms = {
    g1: { name: 'G1', city: 'A', leader: 'uno', map: 'porta_maggiore', order: 1, type: 'Normale' },
    g2: { name: 'G2', city: 'B', leader: 'due', map: 'porta_maggiore', order: 2, type: 'Normale' }
  };
  const problems = validateTrainers({ trainers, gyms }, data.maps, data.species);
  assert.ok(problems.some(p => p.includes('duplicata')), `Badge duplicati non rilevati: ${JSON.stringify(problems)}`);
}

console.log(`OK: validateTrainers copre tutti i casi (${goodProblems.length} problemi su dati reali, tutti mappe palestra note come mancanti).`);
