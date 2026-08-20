// La build pubblicata in Wikascolemon/gioco/ deve essere identica ai sorgenti: nessuno la edita a
// mano. Separato da regression.mjs perché durante lo sviluppo in parallelo la build si rigenera
// solo prima del commit (node tools/build-gioco.mjs).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { GAME_FILES } from '../tools/build-gioco.mjs';
import { gameDir } from './_load.mjs';

// --- Wikascolemon/gioco/ deve essere identica ai sorgenti (nessuno la edita a mano) ---
const wikiGiocoDir = path.resolve(gameDir, '..', '..', 'Wikascolemon', 'gioco');
assert.ok(fs.existsSync(wikiGiocoDir), 'Wikascolemon/gioco/ assente: lancia node tools/build-gioco.mjs');
{
  function compareRecursive(name, src, dest) {
    const srcStat = fs.statSync(src);
    if (srcStat.isDirectory()) {
      for (const entry of fs.readdirSync(src)) {
        compareRecursive(`${name}/${entry}`, path.join(src, entry), path.join(dest, entry));
      }
      return;
    }
    assert.ok(fs.existsSync(dest), `Wikascolemon/gioco/${name} diverso dal sorgente: rilancia node tools/build-gioco.mjs`);
    const srcBuf = fs.readFileSync(src);
    const destBuf = fs.readFileSync(dest);
    assert.ok(srcBuf.equals(destBuf), `Wikascolemon/gioco/${name} diverso dal sorgente: rilancia node tools/build-gioco.mjs`);
  }
  for (const name of GAME_FILES) {
    const src = path.join(gameDir, name);
    if (!fs.existsSync(src)) continue;
    compareRecursive(name, src, path.join(wikiGiocoDir, name));
  }
}

console.log('build.test.mjs: Wikascolemon/gioco/ identica ai sorgenti.');
