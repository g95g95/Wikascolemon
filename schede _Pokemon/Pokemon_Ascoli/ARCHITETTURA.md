# Architettura del gioco (dalla demo in poi)

Tutto statico, zero dipendenze, funziona da `file://`: per questo i dati sono file `.js` che
assegnano a `window.*`, non `.json` (fetch non funziona da file://). Ogni modulo è un IIFE che
espone un oggetto su `window` **e**, se `module` esiste, lo esporta per i test Node
(`if (typeof module !== 'undefined') module.exports = api;`). I moduli logici sono **puri**: niente
DOM, niente `Math.random()` diretto (RNG iniettabile, default `Math.random`).

Ordine degli script in `index.html`:
`species.js` → `moves.js` → `data.js` → `trainers.js` → `battle.js` → `events.js` → `game.js`.

## Identificatori
- id specie = slug ASCII minuscolo del nome senza apostrofi/accenti: `pefna`, `caita`, `peto`,
  `scoglierax`, `segaccio`. Coincide col nome file della scheda wiki (`Wikascolemon/<id>.html`).
- id mossa = slug ASCII del nome italiano, parole unite da `_`: `guscio_chiuso`, `idropompa_a_salve`, `azione`.
- Tipi in italiano come nella wiki: Normale, Fuoco, Acqua, Erba, Elettro, Ghiaccio, Lotta, Veleno,
  Terra, Volante, Psico, Coleottero, Roccia, Spettro, Drago, Buio, Acciaio, Folletto.

## `species.js` (GENERATO da `tools/build-dex.mjs`, non si edita a mano)
```js
window.PokemonAscoliSpecies = {
  basilino: {
    number: 1, name: 'Basilino', types: ['Erba'], base: [hp, att, dif, attSp, difSp, vel],
    catchRate: 120, expYield: 64, growth: 'medio-veloce',
    learnset: [[1, 'azione'], [5, 'fogliame']],        // solo mosse per livello, ordinate; "Inizio" = 1
    evolution: { into: 'turibasil', level: 17 } | { into, item: 'acquasanta' } | { into, level, location: 'campo_parignano' } | null,
    wiki: '../basilino.html'
  }, ...
};
```
Casi speciali (evoluzioni con luogo/strumento/scambio, nomi irregolari) stanno in
`tools/dex-overrides.json` e il generatore li applica sopra ciò che legge dalle pagine.

## `moves.js` (GENERATO, stesso script)
```js
window.PokemonAscoliMoves = {
  azione: { name: 'Azione', type: 'Normale', category: 'Fisico'|'Speciale'|'Stato', power: 40, accuracy: 100 /* null = non fallisce mai */, pp: 35, priority: 0,
            effect: null | { kind: 'stat', target: 'self'|'enemy', stat: 'attack'|'defense'|'spAttack'|'spDefense'|'speed'|'accuracy', stages: 1, chance: 100 }
                          | { kind: 'status', status: 'psn'|'par'|'brn'|'slp'|'frz', chance: 30 }
                          | { kind: 'drain', ratio: 0.5 } | { kind: 'recoil', ratio: 0.25 } | { kind: 'heal', ratio: 0.5 }
                          | { kind: 'protect' } | { kind: 'multi', min: 2, max: 5 } | { kind: 'flinch', chance: 30 } | { kind: 'custom', id: 'guscio_chiuso' },
            description: 'testo breve' }
};
```
Gli effetti vengono da `tools/moves-catalog.json` (curato a mano: id mossa → effetto/priorità/pp);
le mosse che la wiki cita ma il catalogo non conosce diventano attacchi semplici senza effetto e il
generatore le elenca a fine esecuzione.

## `data.js` (mappe, tile, start, strumenti)
Non contiene più `species`/`moves`: li prende da `window.PokemonAscoliSpecies/Moves` e li riespone
come `data.species` / `data.moves` per compatibilità.
Espone `window.PokemonAscoliData = { tileSize, start, respawn, starters, initialItems, items, maps }`.
- `items`: catalogo `{ ball: { name: 'Ball', price: 200, battle: true }, potion: {...}, antidote, repel, acquasanta }`.
- Ogni mappa, oltre ai campi attuali, può avere:
  - `npcs[i].when` (condizione, vedi events) e `npcs[i].script` (script, vedi events) in
    alternativa a `dialogue`; `npcs[i].sprite` (nome foglio in `assets/npc/`, opzionale).
  - `transitions[i].when` + `transitions[i].blockedText` (se la condizione fallisce il passaggio
    non scatta e mostra il testo).
  - `buildings[i].door: { x, y }` (cella davanti alla porta, coordinate mappa) e
    `buildings[i].interior: 'bar'|'market'|'gym'|'none'` + `buildings[i].script` (opzionale, ha
    precedenza). Interagire rivolti verso la porta lancia: bar → cura squadra, market → negozio,
    gym → script della palestra.

## `trainers.js` (dati allenatori + palestre; il configuratore li sovrascrive via localStorage)
```js
window.PokemonAscoliTrainers = {
  classes: { ragazzino: { name: 'Ragazzino', moneyPerLevel: 16, sprite: 'ragazzino' }, bro_security: {...}, capopalestra: {...} },
  trainers: {
    monticelli_ragazzino_1: {
      map: 'monticelli', x: 10, y: 12, direction: 'down', sight: 4,      // sight 0 = sfida solo parlando
      class: 'ragazzino', name: 'Tobia', sprite: null,                    // sprite null → quello della classe
      team: [{ species: 'tifotto', level: 6 }, { species: 'totera', level: 7, moves: ['azione'] }],
      before: ['Ehi tu!', 'Vediamo chi è più forte.'], after: ['Uffa.'], lost: 'Torna quando hai allenato.',
      money: null,                                                         // null → classe.moneyPerLevel × livello massimo
      gym: null | { id: 'castel_di_lama', badge: 1, badgeName: 'Medaglia Spirito', type: 'Veleno', tm: 'velenospina' },
      when: null                                                           // condizione events opzionale
    }
  },
  gyms: { castel_di_lama: { name: 'Palestra di Castel di Lama', city: 'Castel di Lama', leader: 'castel_di_lama_hills', map: 'castel_di_lama', order: 1, type: 'Veleno' } }
};
```
Chiave localStorage dell'override: `pokemonAscoliTrainersV1` = `{ version: 1, updatedAt, trainers: {...}, gyms: {...} }`
(sostituisce interamente le due mappe, come fa `pokemonAscoliConfigV2` per le mappe).
Stato in salvataggio: `save.flags['trainer:<id>'] = true` quando sconfitto; `save.badges = [1, 2]`;
`save.money`.

## `battle.js` — `window.PokemonAscoliBattle` (puro)
```js
createMonster(speciesId, level, { moves?, rng? }) → monster  // { uid, species, level, exp, hp, stats, moves:[{id, pp, maxPp}], status:null|'psn'|'par'|'brn'|'slp'|'frz', sleepTurns }
calculateStats(speciesId, level) ; movesFor(speciesId, level) ; hydrateMonster(m)   // accetta anche il vecchio formato moves:['id']
expToNext(monster) ; expGain(defeated, { trainer: bool, participants: n }) ; gainExperience(monster, amount, ctx) → { levelsGained, learned:[moveId], evolvedInto|null }
   ctx = { map, hasItem(id) } per le condizioni di evoluzione (location, item)
typeMultiplier(moveType, targetTypes)
chooseMove(attacker, defender, { rng }) → moveId         // IA: preferisce la mossa con danno atteso maggiore, un po' di rumore; mosse di stato ogni tanto
turnOrder(a, actionA, b, actionB, rng) → ['player'|'enemy', ...]  // priorità, poi velocità (par dimezza), pari → rng
executeMove(attacker, defender, moveId, stagesA, stagesB, { rng }) → { events: [{ type:'text', text }, { type:'damage', target, amount, effectiveness, crit }, { type:'status', ... }, { type:'faint', target }] }
endOfTurn(monster) → events                               // danno psn/brn, sveglia, ecc.
catchChance(wild, ballId) ; attemptCatch(wild, ballId, rng) → { caught, shakes }
canRun(player, enemy, attempts, rng)
freshStages()
```
`executeMove` rispetta precisione, stati (par 25% salta, slp/frz), STAB, critici (1/16), random
0.85-1, categoria fisico/speciale per mossa, effetti secondari del catalogo. Non tocca DOM né save.

## `events.js` — `window.PokemonAscoliEvents` (puro)
Condizione: `{ flag: 'x' } | { notFlag: 'x' } | { badge: 1 } | { item: 'acquasanta' } | { all: [...] } | { any: [...] }`;
`check(condition, save) → bool` (condizione `null/undefined` = vera).
Script: array di passi:
```
{ say: 'testo' } | { say: ['pag1','pag2'], name: 'Bobby' }
{ choice: 'Domanda?', options: [{ text: 'Sì', then: [...passi] }, { text: 'No', then: [...] }] }
{ setFlag: 'x' } | { clearFlag: 'x' } | { if: cond, then: [...], else: [...] }
{ giveItem: 'ball', qty: 5 } | { takeItem: 'ball', qty: 1 } | { giveMoney: 500 } | { takeMoney: 500 }
{ heal: true } | { shop: ['ball','potion','antidote'] } | { battleTrainer: 'id', onWin: [...], onLose: [...] }
{ giveMonster: { species: 'basilino', level: 5 } } | { wildBattle: { species, level }, onCatch: [...], onOther: [...] }
{ warp: { map, x, y, direction } } | { toast: 'testo' } | { badge: 1 }
```
`createRunner(host)` dove `host` implementa `say(name, text) → Promise`, `choice(q, texts) → Promise<index>`,
`battleTrainer(id) → Promise<'win'|'lose'>`, `wildBattle(spec) → Promise<'caught'|'won'|'fled'|'lost'>`,
`heal()`, `shop(items) → Promise`, `warp(dest)`, `toast(text)`, `giveMonster(spec)`, e espone `save` (oggetto mutabile).
`runner.run(script) → Promise`. Helper: `visibleNpcs(map, save)`, `canUseTransition(t, save)`.

## `game.js`
Resta il guscio: input, rendering, UI overlay, salvataggio. Usa i moduli sopra. Nuovi overlay in
`index.html`: negozio, scheda allenatore con medaglie, scelta a opzioni nel dialogo.
Salvataggio `version: 2` (migrazione dalla 1: aggiunge `flags: {}`, `badges: []`, `money: 3000`,
mosse con pp, `status: null`).

## Test
`node tests/regression.mjs` (dati e mappe) + `node tests/battle.test.mjs` + `node tests/events.test.mjs`
+ `node tests/trainers.test.mjs`. Tutti verdi prima di ogni commit.
