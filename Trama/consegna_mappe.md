# Consegna mappe — flottiglia D1-D2 (20/08/2026)

Tabella di consegna derivata da `bibbia.md` §3-4. **Le coordinate dei passaggi qui sotto sono
fissate e non si toccano**: sono l'unico punto di contatto fra agenti vicini. Tutto il resto della
mappa (strade, edifici, zone incontro, NPC, allenatori) è libero, entro i vincoli dei test.

## Regole comuni a tutti gli agenti

- Un agente possiede solo `maps/<id>.js` e `trainers/<id>.js` (più eventuali ritocchi indicati
  nella sua riga). Non tocca `data.js`, `trainers.js`, `game.js`, `index.html`,
  `configuratore.*` salvo dove la riga lo dice esplicitamente.
- Formato di `maps/<id>.js` (vedi `maps/_helpers.js` per gli helper `building, rect, zone,
  transition, npc, city, wide, tall`; una mappa esistente, es. `maps/porta_maggiore.js`, è il modello):
  ```js
  (function () {
    const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
    window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
    window.PokemonAscoliMaps.marino_del_tronto = { ...wide, name: 'Marino del Tronto', baseTile: 'erba', levelRange: [4, 7], encounterTable: [...], roads: [...], waters: [], bridges: [], plazas: [], buildings: [...], labels: [...], encounterZones: [...], transitions: [...], npcs: [...] };
  }());
  ```
- Formato di `trainers/<id>.js`:
  ```js
  (function () {
    Object.assign(window.PokemonAscoliTrainers.trainers, {
      marino_ragazzino_1: { map: 'marino_del_tronto', x, y, direction, sight, class, name, sprite: null, team: [...], before: [...], after: [...], lost: '...', money: null, gym: null, when: null }
    });
  }());
  ```
  Id allenatore = `<mapId>_<classe>_<n>` (i capipalestra `castel_di_lama_hills` e `costa_riccio`
  esistono già in `trainers.js`: l'agente della palestra li **sposta** nel proprio file
  `trainers/<mapId>.js` con le coordinate giuste e li rimuove da `trainers.js`).
- Tile disponibili (`game.js` `drawTile`): `erba, travertino, piazza, road, water, bridge, muro,
  albero, sabbia, mare, pendio, asfalto, binari, ghiaia, pavimento`. Bloccano: `water, mare, muro,
  albero, binari`. Le strade si dichiarano con `rect(x, y, w, h, 'road'|'asfalto'|'ghiaia'|'pendio'|'sabbia'|'pavimento'|'albero'|'muro')`;
  `waters` accetta `type: 'water'|'mare'`.
- Campo nuovo obbligatorio: `levelRange: [min, max]` (fascia della riga qui sotto). I livelli
  della tabella incontri devono starci dentro; gli allenatori normali hanno livello ≤ max+1
  (`tests/maps.test.mjs`).
- **Scala (richiesta del 20/08)**: le distanze sono triplicate rispetto alla demo. Le costanti sono
  `city = 144×108`, `wide = 180×120`, `tall = 144×120`; i test accettano 120-180 × 90-120 per le
  mappe esterne. Strade larghe 3-4 tile, edifici 6-16 tile di lato, il resto è spazio da riempire con
  alberi, campi, filari, acqua: una mappa non deve sembrare vuota (almeno 25 elementi fra
  roads/waters/buildings/plazas, più zone incontro che coprono il verde).
- Mappe interne: `indoor: true`, `baseTile: 'pavimento'`, dimensioni libere (≥ 12×10, ≤ 60×40),
  `encounterTable: []`, `encounterZones: []`, bordo di `muro` disegnato con `roads`.
  L'uscita è una `transition` sull'ultima riga verso la cella-porta della città. L'ingresso dalla
  città è `building.interior: 'gym'` + `building.script: [{ warp: { map, x, y, direction: 'up' } }]`
  (il runner di `events.js` ha `warp`). Il test di reciprocità accetta come ritorno anche un
  `building.script` che fa `warp` verso la mappa.
- Specie nuove (#057-064) **non esistono ancora**: dove la bibbia dice "uccello/roditore/zanzara/
  pesce nuovo" usare per ora rispettivamente `tamburino`, `tifotto`, `anicino`, `soldatino`;
  l'orchestratore sostituirà dopo B1. Gli sprite di battaglia mancano per molte specie: non è un
  problema vostro (task E1), il gioco nasconde l'immagine.
- Flag di trama (nomi fissi): `starter_scelto`, `starter_basilino|starter_puledrotto|starter_tuffito`
  (impostati da Bobby, D1-a), `ventidio_visto` (D1-a), `ivo_teo_visti` (D2-g), `demo_finita` (D2-h).
  Gli allenatori sconfitti sono `trainer:<id>` (automatico). Medaglie: `badge: 1` Hills, `badge: 2` Riccio.
- Rivale Nando: tre voci allenatore per incontro, stessa posizione, distinte da `when`:
  `{ flag: 'starter_basilino' }` → Nando ha Puledrotto; `{ flag: 'starter_puledrotto' }` → Tuffito;
  `{ flag: 'starter_tuffito' }` → Basilino. Classe `rivale`, id `<mapId>_nando_<starterDiNando>`.
  Squadre da bibbia §4: (2) starter L10 + Tamburino L9; (3) starter evoluto L19 (Cavalbrace/Brasero/Turibasil),
  Tifotto L17, Tamburino L17. Il primo incontro (porta_maggiore) è di D4.1, non di questa ondata.
- Testi: italiano con colore ascolano, **nessun nome di persona reale** (Ivo e Teo, Hills, Riccio,
  Nando, Bobby, Steven, Elena sono nomi di gioco e vanno bene).
- Verifica di ogni agente: `node tests/regression.mjs && node tests/maps.test.mjs && node tests/trainers.test.mjs`
  (e le altre suite) verdi; screenshot della mappa dal configuratore (`configuratore.html`,
  select mappa) con Chromium headless (playwright-core in
  `C:\Users\pisel\AppData\Local\Temp\claude\C--Users-pisel-Desktop-Guloi-Pokemon\0f03e68f-2d90-4f1b-a4d3-0783a21b1e02\scratchpad\pw\`,
  eseguibile `C:\Users\pisel\AppData\Local\ms-playwright\chromium-1217\chrome-win64\chrome.exe`).

## Grafo e passaggi (coordinate FISSE)

Tutte le mappe nuove della Salaria sono collegate in catena orizzontale: uscita **ovest**
`transition(0, 54, 2, 4, …)` e uscita **est** `transition(W-2, 54, 2, 4, …)` con W = 180 (wide) o
144 (city/tall). Le righe 54-57 devono essere strada percorribile almeno nelle celle di
ingresso/uscita e nello spawn. Spawn sempre 6 celle dentro il bordo, riga 55: x=6 da ovest,
x=W-7 da est (173 per W=180, 137 per W=144).

| Mappa (id) | Dim. | Passaggi (rect → destinazione, spawn) | Condizione |
|---|---|---|---|
| `porta_maggiore` (esiste, 144×108) | — | **+** `transition(<fermataX>, <fermataY>, 2, 4, 'ripatransone', 6, 55, 'Corriera per Ripatransone')`: fermata a sinistra della stazione, coordinate scelte da D1-a su cella libera; lo spawn di ritorno da Ripatransone è la cella davanti alla fermata, scelta da D1-a e comunicata qui sotto (D2-a la legge da `maps/porta_maggiore.js` dopo che D1-a ha finito; in attesa usa `start` di `data.js`) | `when: { flag: 'starter_scelto' }`, `blockedText: 'La corriera parte dopo che hai parlato con Bobby.'` |
| `ripatransone` | 144×108 | `transition(0, 54, 2, 4, 'porta_maggiore', <spawnX>, <spawnY>, 'Corriera per Ascoli')` → spawn = `data.start` (stazione) finché D1-a non fissa la fermata; l'orchestratore allinea alla fine | — |
| `monticelli` (esiste, 180×120) | — | **+** `transition(178, 54, 2, 4, 'marino_del_tronto', 6, 55, 'Via Salaria')` (D2-b prolunga la strada principale fino al bordo est righe 54-57) | `when: { flag: 'ventidio_visto' }`, `blockedText: 'Prima passa dal Teatro Ventidio Basso in centro.'` |
| `marino_del_tronto` | 180×120 | O: `transition(0, 54, 2, 4, 'monticelli', 173, 55, 'Monticelli')` · E: `transition(178, 54, 2, 4, 'oasi', 6, 55, 'Oasi')` | — |
| `oasi` | 144×120 | O: `transition(0, 54, 2, 4, 'marino_del_tronto', 173, 55, 'Marino del Tronto')` · E: `transition(142, 54, 2, 4, 'maltignano', 6, 55, 'Maltignano')` | — |
| `maltignano` | 144×120 | O: `transition(0, 54, 2, 4, 'oasi', 137, 55, 'Oasi')` · E: `transition(142, 54, 2, 4, 'castel_di_lama', 6, 55, 'Castel di Lama')` | — |
| `castel_di_lama` | 180×120 | O: `transition(0, 54, 2, 4, 'maltignano', 137, 55, 'Maltignano')` · E: `transition(178, 54, 2, 4, 'spinetoli_centobuchi', 6, 55, 'Spinetoli')` | E: `when: { badge: 1 }`, `blockedText: 'Senza la Medaglia Spirito non si passa.'` |
| `palestra_castel_di_lama` | 24×20, indoor | uscita: `transition(11, 19, 2, 1, 'castel_di_lama', <doorX>, <doorY>, 'Uscita')` → cella-porta dell'edificio Free Spirit (scelta da D2-e) | — |
| `spinetoli_centobuchi` | 180×120 | O: `transition(0, 54, 2, 4, 'castel_di_lama', 173, 55, 'Castel di Lama')` · E: `transition(178, 54, 2, 4, 'costa', 6, 55, 'Costa')` | — |
| `costa` | 180×120 | O: `transition(0, 54, 2, 4, 'spinetoli_centobuchi', 173, 55, 'Spinetoli')` · E: `transition(178, 54, 2, 4, 'jonathan', 6, 55, 'Jonathan')` | — |
| `jonathan` | 144×108 | O: `transition(0, 54, 2, 4, 'costa', 173, 55, 'Spiaggia')` | — |
| `palestra_costa` | 30×22, indoor | uscita: `transition(14, 21, 2, 1, 'jonathan', <doorX>, <doorY>, 'Uscita')` → cella-porta (scelta da D2-h) | — |

Verifica incrociata: lo spawn in arrivo non deve cadere dentro un passaggio della mappa di arrivo
(test esistente), quindi spawn a x=6 o x=W-7 e mai nelle due colonne di bordo.

## Contenuto per agente

| Agente | Mappa | Livelli | Specie selvatiche (peso indicativo) | Allenatori (classe: squadra) | Script / landmark |
|---|---|---|---|---|---|
| D1-a | `porta_maggiore` (ritocco) + `centro_storico` (ritocco) | 2-4 / 3-5 | PM: Tifotto 45, Tamburino 40, Banconio 15 (L2-4). CS: Tamburino 45, Anicino 40, Banconio 15 (L3-5) | — (lascia `porta_maggiore_ragazzino_1`, adegua i livelli a ≤5) | PM: fermata corriera (riga sopra), Bobby imposta anche `starter_<specie>`. CS: Teatro Ventidio Basso con `door` + `script`: una maschera dice che Ossidio è via «per le riprese», consiglia la Salaria verso il mare → `{ setFlag: 'ventidio_visto' }`; rigiocabile (se flag già messo, testo breve). Bar Callare resta bar con Steven come nome. NPC di colore: 2-3. |
| D1-b | `campo_parignano` (ritocco) + `porta_cartara` (ritocco) | 5-7 / 5-7 | CP: Basilino 40, Anicino 40, Tamburino 20. PC: Tuffito 50, Soldatino 35, Tamburino 15 | adegua i due esistenti (`campo_parignano_contadino_1`, `porta_cartara_pescatore_1`) alla fascia | Happy Coffee Centro: edificio `interior: 'bar'` con `door`, nome «Happy Coffee» (Elena). Cartelli (NPC `fermo`, nome «Cartello») davanti a Sant’Emidio alle Grotte e al Rio Castellano che raccontano il luogo-starter (lore). NPC di colore 2-3 per mappa. |
| D2-a | `ripatransone` | 5-7 | Pef'na (`pefna`) 55, Tamburino 30, Pətò (`peto`) 15 raro | 1: `ripatransone_contadino_1` Contadino: Pef'na L7, Cignalò L8 | Colline con filari (usa `albero` a righe), piazza centrale con bar («Bar del Belvedere», `interior: 'bar'`), NPC che parla dell'ottava di Pasqua e del Puledrotto (lore starter). Solo la corriera come uscita. |
| D2-b | `marino_del_tronto` + `monticelli` (ritocco: sola transizione est, riga sopra) | 4-7 | Tifotto 35, Totera 30, Tamburino 20 (uccello nuovo), Tifotto→ roditore nuovo placeholder: usa `tifotto` già; Anicino 15 | 3: `marino_del_tronto_ragazzino_1` (Tifotto L6, Totera L7), `marino_del_tronto_ragazzina_1` (Tamburino L7, Anicino L7), `marino_del_tronto_pescatore_1` (Soldatino L7, Soldatino L8) | Salaria = `asfalto` orizzontale riga 18-21 con alberi ai lati, Tronto a sud (`water`), cartello «Percorso 1 — Via Salaria». |
| D2-c | `oasi` | 5-8 | Soldatino 35, Alghetta 30, Anicino 20, Soldatino (pesce nuovo) — riserva acqua: zona incontro sulla riva con tabella uguale | 2: `oasi_birdwatcher_1` (Tamburino L8, Anicino L8), `oasi_campeggiatore_1` (Totera L8, Soldatino L9) | Laghetto centrale (`water`) con canneto (`albero` sparsi), sentiero `ghiaia`, capanno di osservazione (edificio). Le zone incontro «in acqua» sono le celle di `ghiaia`/erba lungo la riva (la pesca non esiste come meccanica: simulare con zona a rate alto lungo la riva). |
| D2-d | `maltignano` | 7-10 | Cignalò 35, Pef'na 30, Tifotto 20, Anicino 15 | 3 + rivale: `maltignano_ciclista_1` (Cignalò L10, Tifotto L10), `maltignano_ragazzino_1` (Pef'na L9, Totera L10), `maltignano_contadino_1` (Cignalò L11); Nando ×3 varianti (riga «Rivale») in cima alla salita, `sight: 0`, con `npc` «Nando» assente: la lotta parte parlandogli o meglio con `sight: 3` sulla strada obbligata | Salita a tornanti: strada `pendio` a zig-zag da sud-ovest a nord-est con muri di `albero`/`muro`, poi discesa verso est alla riga 18-21. Cartello «Maltignano — la salita record». |
| D2-e | `castel_di_lama` + `palestra_castel_di_lama` | 9-12 | Totera 45, Anicino 35 (zanzara placeholder), Ca'ità (`caita`) 10 raro, Tifotto 10 | Palestra: `palestra_castel_di_lama_allievo_1` (Ragazzino: Anicino L10, Mucillax L11), `palestra_castel_di_lama_allieva_1` (Ragazzina: Mucillax L11, Pef'na L11) con `sight` in corridoio; **Hills** (`castel_di_lama_hills` spostato qui, `map: 'palestra_castel_di_lama'`, `sight: 0`, squadra bibbia §4: Mucillax L11, Mucillax L12, Pozza L14) | Città con piazza, bar «Bar Centrale» (`interior: 'bar'`), tabacchi (`interior: 'market'`), edificio «Free Spirit (palestra)» con `door` + `interior: 'gym'` + `script` warp dentro. Interno: pavimento, muri, due allievi, Hills in fondo. Dopo la vittoria: Hills delira sulla «caccia sulla costa» (testo `after`), dà MT `mt_velenospina` (item già nel catalogo `data.js`) — la medaglia la assegna `game.js`; per l'MT usa un NPC/script dopo la lotta o il campo `after` + script `{ if: { flag: 'trainer:castel_di_lama_hills' }, … giveItem }` su un NPC assistente con `when`. Uscita interna → cella-porta. |
| D2-f | `spinetoli_centobuchi` | 12-16 | Totera 30, Pef'na 25, Pətò 15, Cignalò 15, Tifotto 15 | 4: `spinetoli_centobuchi_contadino_1` (Totera L15, Cignalò L16), `spinetoli_centobuchi_ciclista_1` (Tifotto L16, Pef'na L15), `spinetoli_centobuchi_ciclista_2` (Pətò L17), `spinetoli_centobuchi_gemelle_1` (Pef'na L15, Pef'na L15) | Pianura agricola: campi (`erba`), filari (`albero`), strada `asfalto`, qualche casa, cartello «Centobuchi». |
| D2-g | `costa` | 15-19 | Cozzetta 25, Alghetta 15, Lettino 20, Bagnetto 15, Maranzino 10, Mucillax 10, Scoglieràx (`scoglierax`) 5 raro | 5: `costa_bagnino_1` (Lettino L18, Cozzetta L18), `costa_bagnino_2` (Bagnetto L19), `costa_turista_1` (Maranzino L18), `costa_turista_2` (Alghetta L17, Cozzetta L18), `costa_dj_1` (Mucillax L19, Bagnetto L18) | Nord: lungomare `asfalto`; centro: «Ristoro al Porto» (`interior: 'bar'`); sud: spiaggia `sabbia` + `mare` (blocca). Script Ivo e Teo: due NPC `congressista` vicino alla spiaggia, `when: { notFlag: 'ivo_teo_visti' }`, dialogo a pagine (agguato a Riccio respinto, «ci rimandano al congresso»), poi `setFlag: 'ivo_teo_visti'`; dopo il flag una variante breve con `when: { flag: 'ivo_teo_visti' }`. Passaggio est verso lo Jonathan. |
| D2-h | `jonathan` + `palestra_costa` | — | nessun incontro (tabelle vuote ammesse: `levelRange: [17, 20]`, `encounterTable: []`) | `jonathan_bro_security_1/2/3` a catena sul corridoio d'ingresso (sight 2-3; Cozzetta L18 / Lettino L18 / Bagnetto L19 + Mucillax L18); Nando ×3 varianti davanti all'ingresso (L19 evoluto + Tifotto L17 + Tamburino L17); **Riccio** (`costa_riccio` spostato qui, `map: 'palestra_costa'`, `sight: 0`, squadra §4) | Esterno: discoteca (edificio «Jonathan», `interior: 'gym'`, `script` warp), parcheggio `asfalto`, palme (`albero`), `mare` a sud. Interno: pista, i 3 Bro, Riccio in fondo. Dopo Riccio: MT `mt_idrogetto` + **titoli di coda**. Unico agente autorizzato a toccare `game.js`, `index.html`, `styles.css`: overlay `creditsScreen` (sezione in `index.html` nello stile degli altri overlay) che `game.js` mostra in `startTrainerEncounter` dopo la vittoria su un allenatore con `gym.badge === 2` (dopo il messaggio della medaglia), impostando `save.flags.demo_finita = true`; testo «Fine della demo — grazie», poche righe di crediti (luoghi e bar), tasto «Continua a giocare» che chiude l'overlay e torna in `world`. |

## Dopo l'ondata (orchestratore)
- Inserisce i `<script src="maps/<id>.js">` / `trainers/<id>.js` mancanti in `index.html` e
  `configuratore.html` (già predisposti come file vuoti prima dell'ondata).
- `node tools/build-gioco.mjs`, tutti i test, playthrough Chromium stazione → medaglia 2.
