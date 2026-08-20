// Helper condiviso: carica tutti i moduli di gioco (species, moves, maps/*, data, trainers,
// trainers/*, events) in un unico contesto vm, replicando l'ordine degli script in index.html.
// I file vuoti in maps/ e trainers/ sono stub predisposti per agenti futuri: si ignorano sia nel
// caricamento sia nei controlli di regression.mjs.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
export const gameDir = path.resolve(testDir, '..');

function nonEmptyModuleFiles(dirName, exclude = []) {
  const dir = path.join(gameDir, dirName);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(name => name.endsWith('.js') && !exclude.includes(name))
    .filter(name => fs.statSync(path.join(dir, name)).size > 0)
    .sort()
    .map(name => path.join(dirName, name));
}

export function mapModuleFiles() {
  return nonEmptyModuleFiles('maps', ['_helpers.js']);
}

export function trainerModuleFiles() {
  return nonEmptyModuleFiles('trainers');
}

export function loadGame({ withEvents = true } = {}) {
  const context = { window: {}, console };
  vm.createContext(context);
  const load = file => vm.runInContext(fs.readFileSync(path.join(gameDir, file), 'utf8'), context, { filename: file });

  load('species.js');
  load('moves.js');
  load('maps/_helpers.js');
  for (const file of mapModuleFiles()) load(file);
  load('data.js');
  load('trainers.js');
  for (const file of trainerModuleFiles()) load(file);
  if (withEvents) load('events.js');

  return {
    context,
    window: context.window,
    data: context.window.PokemonAscoliData,
    trainersData: context.window.PokemonAscoliTrainers,
    Events: withEvents ? context.window.PokemonAscoliEvents : undefined
  };
}

export const inRect = (x, y, item) => x >= item.x && y >= item.y && x < item.x + item.w && y < item.y + item.h;

// Allineata a game.js isBlocked/terrainAt: buildings bloccano, bridges passano, waters bloccano
// (salvo eccezioni gestite altrove), roads di tipo bloccante bloccano.
const BLOCKING_ROAD_TYPES = new Set(['albero', 'muro', 'binari']);

export const walkable = (map, x, y) => {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return false;
  if (map.buildings.some(item => inRect(x, y, item))) return false;
  if (map.bridges.some(item => inRect(x, y, item))) return true;
  if (map.waters.some(item => inRect(x, y, item) && (!item.type || item.type === 'water' || item.type === 'mare'))) return false;
  if (map.roads.some(item => inRect(x, y, item) && BLOCKING_ROAD_TYPES.has(item.type))) return false;
  return true;
};
