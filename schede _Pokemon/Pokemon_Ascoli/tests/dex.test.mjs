// Verifica che species.js e moves.js siano davvero generati da tools/build-dex.mjs e non
// modificati a mano: rilancia il generatore in una cartella temporanea e confronta l'output
// byte per byte con i file committati.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const gameDir = path.resolve(testDir, '..');
const toolsDir = path.join(gameDir, 'tools');
const repoRoot = path.resolve(gameDir, '..', '..');

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pokemon-ascoli-dex-'));
// Il generatore risale tre livelli da __dirname (tools/) per trovare Wikascolemon/, quindi
// ricreiamo la stessa profondità: <tmp>/a/b/Pokemon_Ascoli/tools/build-dex.mjs
const fakeToolsDir = path.join(tmpRoot, 'a', 'b', 'Pokemon_Ascoli', 'tools');
fs.mkdirSync(fakeToolsDir, { recursive: true });

function copyFile(name) {
  fs.copyFileSync(path.join(toolsDir, name), path.join(fakeToolsDir, name));
}
copyFile('build-dex.mjs');
copyFile('dex-overrides.json');
copyFile('moves-catalog.json');

// Wikascolemon/ deve trovarsi a fianco di "schede _Pokemon" nella root del repo: creiamo un
// link cartella non è portabile, quindi copiamo la build in loco puntando alla vera cartella
// tramite una piccola patch del percorso ROOT: più semplice, eseguiamo lo script così com'è e
// gli passiamo ROOT reale con una variabile d'ambiente.
const genContent = fs.readFileSync(path.join(toolsDir, 'build-dex.mjs'), 'utf8');
const patched = genContent.replace(
  "const ROOT = path.resolve(__dirname, '..', '..', '..');",
  "const ROOT = process.env.DEX_TEST_ROOT || path.resolve(__dirname, '..', '..', '..');"
);
fs.writeFileSync(path.join(fakeToolsDir, 'build-dex.mjs'), patched);

execFileSync(process.execPath, [path.join(fakeToolsDir, 'build-dex.mjs')], {
  cwd: fakeToolsDir,
  env: { ...process.env, DEX_TEST_ROOT: repoRoot }
});

const outDir = path.join(fakeToolsDir, '..');
for (const file of ['species.js', 'moves.js']) {
  const generated = fs.readFileSync(path.join(outDir, file), 'utf8');
  const committed = fs.readFileSync(path.join(gameDir, file), 'utf8');
  assert.equal(generated, committed, `${file}: output rigenerato diverso dal file committato (qualcuno l'ha modificato a mano?)`);
}

fs.rmSync(tmpRoot, { recursive: true, force: true });

console.log('dex.test.mjs: species.js e moves.js combaciano con l\'output del generatore.');

// Ogni tipo di specie e mosse deve essere un tipo che la lotta conosce: un nome fuori dalla
// type chart (es. l'abbreviazione «Coleot» dei badge) vale 1× contro tutto, in silenzio.
const require = createRequire(import.meta.url);
const { typeChart } = require('../battle.js');
const species = require('../species.js');
const moves = require('../moves.js');
const unknown = [
  ...Object.entries(species).flatMap(([id, s]) => s.types.filter(t => !typeChart[t]).map(t => `specie ${id}: ${t}`)),
  ...Object.entries(moves).filter(([, m]) => !typeChart[m.type]).map(([id, m]) => `mossa ${id}: ${m.type}`)
];
assert.deepEqual(unknown, [], `tipi sconosciuti alla type chart di battle.js:\n${unknown.join('\n')}`);

console.log('dex.test.mjs: tutti i tipi di specie e mosse sono nella type chart.');
