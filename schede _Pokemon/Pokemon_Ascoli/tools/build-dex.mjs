#!/usr/bin/env node
// Genera species.js e moves.js leggendo tutte le schede Pokémon in Wikascolemon/*.html.
// Vedi ARCHITETTURA.md per il formato di output. Non modificare species.js/moves.js a mano:
// sono rigenerati da questo script.
'use strict';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..');
const WIKI_DIR = path.join(ROOT, 'Wikascolemon');
const OUT_DIR = path.resolve(__dirname, '..');
const TOOLS_DIR = __dirname;

const OVERRIDES_PATH = path.join(TOOLS_DIR, 'dex-overrides.json');
const CATALOG_PATH = path.join(TOOLS_DIR, 'moves-catalog.json');
const REPORT_PATH = path.join(TOOLS_DIR, 'dex-report.json');

// ---------- helpers ----------

function slugify(str) {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, '').trim();
}

function listSpeciesFiles() {
  return fs.readdirSync(WIKI_DIR)
    .filter(f => f.endsWith('.html'))
    .filter(f => f !== 'index.html')
    .filter(f => !f.startsWith('brief'))
    .filter(f => {
      const stat = fs.statSync(path.join(WIKI_DIR, f));
      return stat.isFile();
    })
    .sort();
}

function section(html, startId, endIds) {
  const startMarker = `id="${startId}"`;
  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) return null;
  const sectionStart = html.lastIndexOf('<h', startIdx);
  let end = html.length;
  for (const id of endIds) {
    const marker = `id="${id}"`;
    const idx = html.indexOf(marker, startIdx + startMarker.length);
    if (idx !== -1) {
      const hStart = html.lastIndexOf('<h', idx);
      if (hStart !== -1 && hStart < end) end = hStart;
    }
  }
  return html.slice(sectionStart, end);
}

// ---------- per-page extraction ----------

function extractNumber(html, fileName, errors) {
  const m = html.match(/Pok[eé]dex del Piceno #(\d+)/);
  if (!m) { errors.push(`${fileName}: numero Pokédex non trovato`); return null; }
  return parseInt(m[1], 10);
}

function extractName(html, fileName, errors) {
  const m = html.match(/<h1>([^<]+)<\/h1>/);
  if (!m) { errors.push(`${fileName}: <h1> non trovato`); return null; }
  return m[1].trim();
}

function extractTypes(html, fileName, errors) {
  const m = html.match(/<tr><th>Tipo<\/th><td>([\s\S]*?)<\/td><\/tr>/);
  if (!m) { errors.push(`${fileName}: riga Tipo non trovata`); return []; }
  const types = [...m[1].matchAll(/class="type t-[a-z]+">([^<]+)</g)].map(x => x[1]);
  if (types.length === 0) errors.push(`${fileName}: nessun tipo estratto dalla riga Tipo`);
  return types;
}

function extractCatchRate(html, fileName, errors) {
  const m = html.match(/<tr><th>Tasso di cattura<\/th><td>(\d+)/);
  if (!m) { errors.push(`${fileName}: Tasso di cattura non trovato`); return null; }
  return parseInt(m[1], 10);
}

function extractExpYield(html, fileName, errors) {
  const m = html.match(/<tr><th>Esperienza base ceduta<\/th><td>(\d+)/);
  if (!m) { errors.push(`${fileName}: Esperienza base ceduta non trovata`); return null; }
  return parseInt(m[1], 10);
}

const GROWTH_SLUGS = {
  'lento': 'lento',
  'medio': 'medio',
  'medio-lento': 'medio-lento',
  'medio lento': 'medio-lento',
  'medio-veloce': 'medio-veloce',
  'medio veloce': 'medio-veloce',
  'veloce': 'veloce'
};

function extractGrowth(html, fileName, errors, warnings) {
  const m = html.match(/<tr><th>Tasso di allevamento<\/th><td>([^<]+)<\/td><\/tr>/);
  if (!m) { errors.push(`${fileName}: Tasso di allevamento non trovato`); return null; }
  const raw = m[1].trim();
  const norm = GROWTH_SLUGS[raw.toLowerCase()];
  if (!norm) {
    warnings.push(`${fileName}: tasso di allevamento non standard ("${raw}"), mantenuto come testo`);
    return raw.toLowerCase();
  }
  return norm;
}

function extractStats(html, fileName, errors) {
  const statSection = section(html, 'Statistiche', ['Mosse']);
  if (!statSection) { errors.push(`${fileName}: blocco statistiche non trovato`); return null; }
  const rows = [...statSection.matchAll(/<span class="sv">(?:<b>)?(\d+)(?:<\/b>)?<\/span>/g)].map(x => parseInt(x[1], 10));
  if (rows.length !== 7) { errors.push(`${fileName}: attese 7 statistiche (6 + totale), trovate ${rows.length}`); return null; }
  const base = rows.slice(0, 6);
  const total = rows[6];
  const sum = base.reduce((a, b) => a + b, 0);
  if (sum !== total) errors.push(`${fileName}: somma statistiche (${sum}) diversa dal Totale dichiarato (${total})`);
  return { base, total, sum };
}

function extractLearnset(html, fileName, errors, warnings) {
  const mosseSection = section(html, 'Mosse', ['Voci']);
  if (!mosseSection) { errors.push(`${fileName}: sezione Mosse non trovata`); return []; }
  const tableMatch = mosseSection.match(/<table class="wtable">([\s\S]*?)<\/table>/);
  if (!tableMatch) { errors.push(`${fileName}: tabella learnset non trovata`); return []; }
  const table = tableMatch[1];
  const headerMatch = table.match(/<tr>\s*<th>([^<]+)<\/th>/);
  if (!headerMatch || !headerMatch[1].startsWith('Lv.')) {
    errors.push(`${fileName}: la prima tabella in Mosse non ha intestazione "Lv." (forse è la tabella MT/uova?)`);
    return [];
  }
  const rows = [...table.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(m => m[1]).filter(r => !r.includes('<th>'));
  const learnset = [];
  for (const row of rows) {
    const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(m => m[1]);
    if (cells.length < 7) { warnings.push(`${fileName}: riga learnset scartata (celle insufficienti): ${row}`); continue; }
    const lvlRaw = stripTags(cells[0]);
    let level;
    if (lvlRaw === 'Inizio') level = 1;
    else if (lvlRaw === 'Evo' || lvlRaw === 'Fusione') level = 'Evo'; // risolto dopo, dal livello dell'evoluzione entrante
    else level = parseInt(lvlRaw, 10);
    if (level !== 'Evo' && Number.isNaN(level)) { warnings.push(`${fileName}: livello non valido "${lvlRaw}"`); continue; }
    const moveName = stripTags(cells[1]);
    const moveId = slugify(moveName);
    learnset.push([level, moveId, moveName]);
  }
  return learnset;
}

function extractEvolution(html, fileName, errors, warnings) {
  const evoSection = section(html, 'Evoluzioni', ['Statistiche']);
  if (!evoSection) { errors.push(`${fileName}: sezione Evoluzioni non trovata`); return null; }
  const cards = [...evoSection.matchAll(/<div class="evocard">([\s\S]*?)<\/div>\s*<\/div>/g)].map(m => m[1]);
  // Trova la card "propria" (nome senza <a href>)
  const nmMatches = [...evoSection.matchAll(/<div class="nm">([\s\S]*?)<\/div>/g)].map(m => m[1].trim());
  const ownIndex = nmMatches.findIndex(nm => !nm.includes('<a '));
  if (ownIndex === -1) { warnings.push(`${fileName}: impossibile individuare la card della specie stessa in Evoluzioni`); return null; }
  const isLast = ownIndex === nmMatches.length - 1;
  if (isLast) return null;
  // Prende l'evoarrow subito dopo la propria card e l'evocard successiva (con link)
  const arrows = [...evoSection.matchAll(/<div class="evoarrow">([\s\S]*?)<\/div>/g)].map(m => m[1]);
  const arrowText = arrows[ownIndex] ? stripTags(arrows[ownIndex].replace(/<span class="ar">.*?<\/span>/, '')) : '';
  const nextName = nmMatches[ownIndex + 1];
  const hrefMatch = nextName.match(/href="([a-z0-9_]+)\.html"/);
  const intoId = hrefMatch ? hrefMatch[1] : null;
  if (!intoId) { warnings.push(`${fileName}: evoluzione successiva senza link .html, servirà un override`); return { into: null, raw: arrowText }; }
  const levelMatch = arrowText.match(/(?:Livello|Lv\.)\s*(\d+)/);
  if (levelMatch && /^Livello \d+$/.test(arrowText)) {
    return { into: intoId, level: parseInt(levelMatch[1], 10) };
  }
  // Testo libero (strumento/luogo/scambio): segnala, verrà completato da dex-overrides.json
  warnings.push(`${fileName}: evoluzione verso ${intoId} con condizione non standard ("${arrowText}"), verificare dex-overrides.json`);
  return { into: intoId, raw: arrowText, level: levelMatch ? parseInt(levelMatch[1], 10) : undefined };
}

function extractCustomMoveDescriptions(html) {
  // <p><small>...</small></p> subito dopo la tabella learnset, con eventuali <b>Nome</b>: <i>descrizione</i>
  const m = html.match(/<p><small>([\s\S]*?)<\/small><\/p>/);
  if (!m) return {};
  const text = m[1];
  const out = {};
  const boldMatches = [...text.matchAll(/<b>([^<]+)<\/b>/g)];
  for (const bm of boldMatches) {
    const name = bm[1].trim();
    if (name === 'grassetto') continue;
    const id = slugify(name);
    // testo tra questo <b> e il prossimo (o la fine), preferendo il contenuto in <i>...</i>
    const after = text.slice(bm.index + bm[0].length);
    const nextBoldIdx = after.search(/<b>/);
    const chunk = nextBoldIdx === -1 ? after : after.slice(0, nextBoldIdx);
    const italic = chunk.match(/<i>([\s\S]*?)<\/i>/);
    const desc = italic ? stripTags(italic[1]) : stripTags(chunk).replace(/^[:\s—-]+/, '').split(/\s*Descrizione in gioco/)[0].trim();
    if (desc) out[id] = desc;
  }
  return out;
}

// ---------- main ----------

function main() {
  const errors = [];
  const warnings = [];
  const files = listSpeciesFiles();

  const overrides = fs.existsSync(OVERRIDES_PATH) ? JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf8')) : {};
  const catalog = fs.existsSync(CATALOG_PATH) ? JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8')) : {};

  const species = {};
  const allLearnsetMoves = new Map(); // moveId -> { name, type, category, power, accuracy, pp, files:[] }
  const dexReport = { species: [], anomalies: [] };

  for (const file of files) {
    const id = path.basename(file, '.html');
    const html = fs.readFileSync(path.join(WIKI_DIR, file), 'utf8');

    const number = extractNumber(html, file, errors);
    const name = extractName(html, file, errors);
    const types = extractTypes(html, file, errors);
    const catchRate = extractCatchRate(html, file, errors);
    const expYield = extractExpYield(html, file, errors);
    const growth = extractGrowth(html, file, errors, warnings);
    const statsResult = extractStats(html, file, errors);
    const learnsetRaw = extractLearnset(html, file, errors, warnings);
    const evolution = extractEvolution(html, file, errors, warnings);
    const customDescriptions = extractCustomMoveDescriptions(html);

    for (const [lvl, moveId, moveName] of learnsetRaw) {
      if (!allLearnsetMoves.has(moveId)) allLearnsetMoves.set(moveId, { name: moveName, files: [] });
      allLearnsetMoves.get(moveId).files.push(id);
      Object.assign(allLearnsetMoves.get(moveId), customDescriptions[moveId] ? { descriptionOverride: customDescriptions[moveId] } : {});
    }

    if (number === null || name === null || !statsResult) {
      errors.push(`${file}: dati insufficienti, specie SALTATA`);
      continue;
    }

    species[id] = {
      number,
      name,
      types,
      base: statsResult.base,
      catchRate,
      expYield,
      growth,
      learnset: learnsetRaw.map(([lvl, moveId]) => [lvl, moveId]),
      evolution: evolution && evolution.into ? { into: evolution.into, level: evolution.level } : null,
      wiki: `../${id}.html`
    };
    if (species[id].evolution) {
      // ripulisci chiavi undefined
      if (species[id].evolution.level === undefined) delete species[id].evolution.level;
    }

    dexReport.species.push({ id, number, name, statTotal: statsResult.total, statSum: statsResult.sum, ok: statsResult.total === statsResult.sum });
  }

  // Applica overrides (evoluzioni con strumento/luogo/scambio, casi speciali)
  for (const [id, patch] of Object.entries(overrides)) {
    if (!species[id]) { warnings.push(`dex-overrides.json: id "${id}" non trovato tra le specie generate`); continue; }
    if (patch.evolution !== undefined) species[id].evolution = patch.evolution;
    for (const key of Object.keys(patch)) {
      if (key === 'evolution') continue;
      species[id][key] = patch[key];
    }
  }

  // Verifica che ogni evolution.into esista
  for (const [id, sp] of Object.entries(species)) {
    if (sp.evolution && sp.evolution.into && !species[sp.evolution.into]) {
      errors.push(`${id}: evolution.into "${sp.evolution.into}" non esiste tra le specie`);
    }
  }

  // Risolvi il livello "Evo" nei learnset: significa "appresa quando questa specie si è
  // evoluta dalla preevoluzione", quindi corrisponde al livello dell'evoluzione ENTRANTE
  // (quella di sp.evolution.level sulla specie precedente che punta a questa).
  const incomingLevel = {};
  for (const [id, sp] of Object.entries(species)) {
    if (sp.evolution && sp.evolution.into && typeof sp.evolution.level === 'number') {
      incomingLevel[sp.evolution.into] = sp.evolution.level;
    }
  }
  for (const [id, sp] of Object.entries(species)) {
    const resolvedLevel = incomingLevel[id];
    for (const entry of sp.learnset) {
      if (entry[0] === 'Evo') {
        if (typeof resolvedLevel === 'number') {
          entry[0] = resolvedLevel;
        } else {
          warnings.push(`${id}: livello "Evo" per la mossa "${entry[1]}" non risolvibile (nessuna evoluzione entrante con livello numerico), impostato a 1`);
          entry[0] = 1;
        }
      }
    }
    sp.learnset.sort((a, b) => a[0] - b[0]);
  }

  // ---------- moves.js ----------
  const moves = {};
  const uncatalogued = [];
  for (const [moveId, info] of allLearnsetMoves) {
    const catEntry = catalog[moveId];
    // Recupera type/category/power/accuracy/pp dalla prima occorrenza nella pagina wiki (ri-derivati per coerenza)
    const sourceFile = info.files[0];
    const sourceHtml = fs.readFileSync(path.join(WIKI_DIR, sourceFile + '.html'), 'utf8');
    const mosseSection = section(sourceHtml, 'Mosse', ['Voci']);
    const tableMatch = mosseSection.match(/<table class="wtable">([\s\S]*?)<\/table>/);
    const rows = [...tableMatch[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(m => m[1]).filter(r => !r.includes('<th>'));
    let rowData = null;
    for (const row of rows) {
      const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(m => m[1]);
      if (cells.length < 7) continue;
      if (slugify(stripTags(cells[1])) === moveId) { rowData = cells; break; }
    }
    if (!rowData) { errors.push(`${moveId}: impossibile ritrovare la riga sorgente in ${sourceFile}`); continue; }

    const type = stripTags(rowData[2]);
    const category = stripTags(rowData[3]);
    const powerRaw = stripTags(rowData[4]);
    const power = powerRaw === '—' ? 0 : parseInt(powerRaw, 10);
    const accRaw = stripTags(rowData[5]).replace('%', '');
    const accuracy = accRaw === '—' || accRaw === '' ? null : parseInt(accRaw, 10);
    const ppRaw = stripTags(rowData[6]);
    const pp = parseInt(ppRaw, 10);

    if (catEntry) {
      moves[moveId] = {
        name: info.name,
        type,
        category,
        power,
        accuracy,
        pp: catEntry.ppOverride !== undefined ? catEntry.ppOverride : pp,
        priority: catEntry.priority || 0,
        effect: catEntry.effect || null,
        description: info.descriptionOverride || catEntry.description || ''
      };
    } else {
      uncatalogued.push(moveId);
      moves[moveId] = {
        name: info.name,
        type,
        category,
        power,
        accuracy,
        pp,
        priority: 0,
        effect: null,
        description: info.descriptionOverride || ''
      };
    }
  }

  // Verifica che ogni mossa nei learnset esista in moves
  for (const [id, sp] of Object.entries(species)) {
    for (const [, moveId] of sp.learnset) {
      if (!moves[moveId]) errors.push(`${id}: mossa "${moveId}" nel learnset assente da moves.js`);
    }
  }

  // ---------- scrittura file ----------
  const speciesJs = `// GENERATO da tools/build-dex.mjs — non modificare a mano.\n(function () {\n  const api = ${JSON.stringify(species, null, 2)};\n  if (typeof window !== 'undefined') window.PokemonAscoliSpecies = api;\n  if (typeof module !== 'undefined') module.exports = api;\n}());\n`;
  fs.writeFileSync(path.join(OUT_DIR, 'species.js'), speciesJs);

  const movesJs = `// GENERATO da tools/build-dex.mjs — non modificare a mano.\n(function () {\n  const api = ${JSON.stringify(moves, null, 2)};\n  if (typeof window !== 'undefined') window.PokemonAscoliMoves = api;\n  if (typeof module !== 'undefined') module.exports = api;\n}());\n`;
  fs.writeFileSync(path.join(OUT_DIR, 'moves.js'), movesJs);

  fs.writeFileSync(REPORT_PATH, JSON.stringify(dexReport, null, 2));

  // ---------- output console ----------
  console.log(`Specie generate: ${Object.keys(species).length}`);
  console.log(`Mosse generate: ${Object.keys(moves).length}`);
  if (uncatalogued.length) {
    console.log(`\nMosse DA CATALOGARE (${uncatalogued.length}, attacco semplice senza effetto):`);
    for (const m of uncatalogued) console.log(`  - ${m}`);
  }
  if (warnings.length) {
    console.log(`\nAvvisi (${warnings.length}):`);
    for (const w of warnings) console.log(`  - ${w}`);
  }
  if (errors.length) {
    console.log(`\nERRORI (${errors.length}):`);
    for (const e of errors) console.log(`  - ${e}`);
    process.exitCode = 1;
  }
}

main();
