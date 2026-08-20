# Pokémon Ascoli — demo "prime due palestre"

Gioco browser statico, in italiano, zero dipendenze. Aprire `index.html` direttamente (funziona
da `file://`); pubblicato online in `Wikascolemon/gioco/` (build corrente, in sviluppo) e
`Wikascolemon/demo/` (la demo originale, congelata, senza trama).

## Come si gioca

- Frecce o WASD: movimento cella per cella.
- Invio, Spazio o A: interazione.
- M: menu (Squadra, Borsa, Pokédex, Deposito, Salva, Impostazioni).
- X, Esc o B: indietro.

Salvataggio automatico in `localStorage`; dal menu **Salva** si esporta/importa la partita in JSON.

## Trama (in breve)

Si arriva in treno ad Ascoli; Bobby (ex bar di Porta Maggiore) fa da mentore e assegna lo starter
in base al luogo scelto (Rio Castellano → Tuffito, Sant'Emidio alle Grotte → Basilino, Ripatransone
→ Puledrotto, raggiungibile in corriera). Il rivale Nando sfida subito dopo, fuori dal bar. Il
Teatro Ventidio Basso (futura 3ª palestra) è chiuso "per riprese". Si sale la Salaria (Marino del
Tronto → Oasi → Maltignano) fino a Castel di Lama, dove Daniel Hills tiene la 1ª palestra (Veleno,
Medaglia Spirito). Proseguendo per Spinetoli/Centobuchi e la costa (Ristoro al Porto, agguato a
Riccio sventato da Ivo e Teo) si arriva allo Jonathan: 2ª palestra, Riccio (Acqua, Medaglia
Balneare). La demo finisce lì con i titoli di coda.

## Struttura dei file

| File/cartella | Contenuto |
|---|---|
| `species.js`, `moves.js` | Dex e mosse, **generati** da `tools/build-dex.mjs` dalla wiki — non editare a mano |
| `maps/_helpers.js` + `maps/<id>.js` | Una mappa per file (scala 120-180×90-120 tile) |
| `trainers.js` + `trainers/<mapId>.js` | Classi/palestre in `trainers.js`; allenatori normali per mappa nei file `trainers/` |
| `data.js` | Tile, start, oggetti; prende specie/mosse/mappe dagli altri moduli |
| `battle.js`, `events.js` | Motore di lotta e motore di script, puri (senza DOM) |
| `game.js` | Guscio: input, rendering, UI, salvataggio |
| `configuratore.html`/`.js`/`.css` | Editor visuale di mappe, allenatori, tabelle incontri |
| `tools/build-gioco.mjs` | Pubblica in `Wikascolemon/gioco/` (mai editare la build a mano) |
| `tools/build-dex.mjs` | Rigenera `species.js`/`moves.js` dopo ogni scheda wiki pubblicata |
| `tools/scale-maps.mjs` | Scala le mappe (usato una tantum per il passaggio a scala ×3) |
| `tests/*.mjs` | Suite di regressione |

Dettagli sui contratti fra moduli: [`ARCHITETTURA.md`](./ARCHITETTURA.md).

## Comandi

```powershell
cd "schede _Pokemon/Pokemon_Ascoli"
for t in tests/*.mjs; do node $t; done   # tutti i test, verdi prima di ogni commit
node tools/build-gioco.mjs               # pubblica in Wikascolemon/gioco/
node tools/build-dex.mjs                 # rigenera species.js/moves.js dalla wiki
```

Test end-to-end: `node tests/e2e/run.mjs` (playthrough Chromium, opzionale — vedi `tests/e2e/README.md`).

Simulazione di bilanciamento (livelli/allenatori lungo il percorso della demo, 3 starter, 20 seed
ciascuno di default): `node tools/simulate-balance.mjs [seedBase] [seedCount]`.

## Aggiungere una mappa

1. Copiare lo scheletro di `maps/porta_maggiore.js` in `maps/<id>.js`, usando gli helper di
   `maps/_helpers.js` (`building, rect, zone, transition, npc, city, wide, tall`).
2. Se ha allenatori normali, creare `trainers/<id>.js` con `Object.assign(window.PokemonAscoliTrainers.trainers, {...})`.
3. Aggiungere `<script src="maps/<id>.js">` (e l'eventuale `trainers/<id>.js`) in `index.html` e
   `configuratore.html`, dopo `maps/_helpers.js` e prima di `data.js`.
4. `node tests/regression.mjs` e `node tests/maps.test.mjs` per validare dimensioni, passaggi,
   `levelRange`, raggiungibilità a piedi.

## Aggiungere un allenatore

Aggiungere una voce a `trainers/<mapId>.js` (o a `trainers.js` se è un capopalestra) col formato
documentato in `ARCHITETTURA.md` (`map, x, y, direction, sight, class, team, ...`); verificare con
`node tests/trainers.test.mjs` e `node tests/maps.test.mjs` (posizione percorribile, livello dentro
`levelRange`).
