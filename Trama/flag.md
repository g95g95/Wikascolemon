# Flag, medaglie e oggetti-condizione del gioco

Tabella generata leggendo i dati reali (`maps/*.js`, `trainers.js`, `trainers/*.js`, `game.js`)
tramite `loadGame()` di `schede _Pokemon/Pokemon_Ascoli/tests/_load.mjs`. Per rigenerarla: eseguire
uno script Node usa-e-getta che carica il gioco con `loadGame()`, percorre ricorsivamente `when` di
npc/transitions/trainers e gli `if`/`setFlag`/`clearFlag` dentro tutti gli script (compresi i rami
`choice`, `if/else`, `onWin/onLose`, `onCatch/onOther`), poi stampa la tabella; verificata anche da
`tests/flags.test.mjs`, che fa la stessa raccolta e la controlla in automatico ad ogni run.

## Flag di trama

| Flag | Impostato da | Letto da | Note |
|---|---|---|---|
| `starter_scelto` | `porta_maggiore` npc **Bobby**, tutte e tre le scelte dello starter (`choice[0..2]`) | `porta_maggiore` npc **Bobby** (`when`, per non far ridare lo starter) e le 4 transition in uscita da `porta_maggiore` (`centro_storico`, `monticelli`, `borgo_chiaro`, `ripatransone`) | Sblocca l'uscita dalla città iniziale finché non si è scelto lo starter |
| `starter_basilino` | Bobby, scelta "Sant'Emidio alle Grotte" | `trainer:jonathan_nando_puledrotto.when`, `trainer:maltignano_nando_puledrotto.when` | Se il giocatore ha scelto Basilino, il rivale Nando in quella mappa ha in squadra Puledrotto (contro-tipo narrativo) |
| `starter_puledrotto` | Bobby, scelta "Rio Castellano" | `trainer:jonathan_nando_tuffito.when`, `trainer:maltignano_nando_tuffito.when` | Nando ha Tuffito |
| `starter_tuffito` | Bobby, scelta "Ripatransone" | `trainer:jonathan_nando_basilino.when`, `trainer:maltignano_nando_basilino.when` | Nando ha Basilino |
| `ventidio_visto` | `centro_storico` building **Teatro Ventidio Basso**, ramo `else` dello script (prima visita) | stesso script (`if`, per la variante breve alle visite successive) e `monticelli` transition verso `marino_del_tronto` | Sblocca il proseguimento verso `marino_del_tronto` dopo la visita al teatro |
| `ivo_teo_visti` | `costa` npc **Ivo**, nello script dell'agguato | `costa` npc **Ivo** e npc **Teo** (`when`, per passare dal dialogo lungo alla variante breve) | Puramente narrativo, non blocca percorso |
| `mt_idrogetto_dato` | `palestra_costa` npc **Assistente**, dentro lo script | stesso npc **Assistente** (`when`, per non ridare la MT) | Guardia di idempotenza sul premio della seconda palestra |

## Flag impostati dal motore (`game.js`)

| Flag | Impostato da | Letto da | Note |
|---|---|---|---|
| `trainer:<id>` | `game.js` (`startTrainerEncounter`, dopo ogni vittoria su un allenatore) — una entry per **ogni** id in `trainers.js`/`trainers/*.js` | `game.js` stesso (per non riproporre la lotta, mostra `trainer.lost`); nei dati: `palestra_castel_di_lama` npc **Assistente** legge `trainer:castel_di_lama_hills`, `palestra_costa` npc **Assistente** legge `trainer:costa_riccio` | Pattern standard `Events.flagKeys.trainerFlag(id)`; nei dati viene letto solo per i due capipalestra della demo (premio MT), ma esiste per ogni allenatore |
| `demo_finita` | `game.js` (`startTrainerEncounter`), quando si vince contro un allenatore con `gym.badge === 2` (Riccio, seconda palestra) | `game.js` stesso, come guardia per non riaprire i titoli di coda a ripetizione | Non è letto da nessun `when`/`if` dei dati: puramente interno al motore |

## Medaglie (`badge`)

| Badge | Assegnata da | Letta da | Note |
|---|---|---|---|
| `1` (Medaglia Spirito) | `game.js`, vittoria su `castel_di_lama_hills` (`trainer.gym.badge === 1`) | `castel_di_lama` transition verso `spinetoli_centobuchi` (`when: { badge: 1 }`) | Prima palestra, sblocca l'area dopo Castel di Lama |
| `2` (Medaglia della seconda palestra, `costa_riccio`) | `game.js`, vittoria su `costa_riccio` | Nessuna condizione nei dati la legge direttamente; innesca `demo_finita` nel motore | Fine della demo |

## Oggetti usati come condizione (`item`)

| Item | Dato/tolto da | Letto da (`item` in condizione) | Note |
|---|---|---|---|
| `ball` | Bobby, tutte e tre le scelte dello starter (5 Ball di partenza) | — (nessuna condizione lo controlla) | |
| `mt_velenospina` | `palestra_castel_di_lama` npc **Assistente**, ramo `else` (prima visita) | stesso script, ramo `if` (già ricevuta) | Premio prima palestra |
| `mt_idrogetto` | `palestra_costa` npc **Assistente** | — (la guardia di ripetizione usa `mt_idrogetto_dato`, non l'item) | Premio seconda palestra |

## Riepilogo copertura

- Ogni flag letto nei dati ha un corrispondente `setFlag` in uno script o è generato dal motore
  (`trainer:<id>`).
- `demo_finita` è impostato dal motore ma non letto da nessuna condizione nei dati: è
  intenzionalmente solo una guardia interna (vedi `tests/flags.test.mjs`, che lo tratta come
  informativo e non come flag "morto").
- Nessun flag risulta letto senza essere mai impostato: la tabella sopra è verificata dal test
  automatico `node tests/flags.test.mjs`.
