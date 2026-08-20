#!/usr/bin/env node
// Copia i file di gioco in Wikascolemon/gioco/ per pubblicarli su GitHub Pages.
// Cancella prima la destinazione, poi verifica che i link wiki delle specie
// (../<id>.html) risolvano da Wikascolemon/gioco/ a Wikascolemon/<id>.html.
'use strict';

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GAME_DIR = path.resolve(__dirname, '..');
const WIKI_DIR = path.resolve(GAME_DIR, '..', '..', 'Wikascolemon');
const DEST_DIR = path.join(WIKI_DIR, 'gioco');

// File e cartelle da copiare da GAME_DIR a DEST_DIR. maps/ e trainers/ sono
// opzionali: verranno aggiunti quando esisteranno (D0.1).
export const GAME_FILES = [
  'index.html',
  'game.js',
  'data.js',
  'species.js',
  'moves.js',
  'trainers.js',
  'battle.js',
  'events.js',
  'styles.css',
  'configuratore.html',
  'configuratore.js',
  'configuratore.css',
  'README.md',
  'assets',
  'maps',
  'trainers',
];

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function checkWikiLinks() {
  const context = { window: {}, console };
  vm.runInNewContext(fs.readFileSync(path.join(DEST_DIR, 'species.js'), 'utf8'), context);
  const species = context.window.PokemonAscoliSpecies;
  const missing = [];
  for (const [id, entry] of Object.entries(species)) {
    if (!entry.wiki) continue;
    const resolved = path.resolve(DEST_DIR, entry.wiki);
    if (!fs.existsSync(resolved)) missing.push(`${id}: ${entry.wiki}`);
  }
  return missing;
}

function main() {
  if (fs.existsSync(DEST_DIR)) fs.rmSync(DEST_DIR, { recursive: true, force: true });
  fs.mkdirSync(DEST_DIR, { recursive: true });

  for (const name of GAME_FILES) {
    const src = path.join(GAME_DIR, name);
    if (!fs.existsSync(src)) continue; // maps/ e trainers/ non esistono ancora
    copyRecursive(src, path.join(DEST_DIR, name));
  }

  const missing = checkWikiLinks();
  if (missing.length > 0) {
    console.error('Link wiki non risolti da Wikascolemon/gioco/:');
    for (const line of missing) console.error(`  - ${line}`);
    process.exit(1);
  }

  console.log(`OK: copiato in ${DEST_DIR}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
