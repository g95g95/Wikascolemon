# Piano: dalla trama "prime due palestre" a una demo giocabile

Annotato il 20/08/2026. **Approvato il 20/08/2026** (assunzioni confermate; aggiunto C7 configuratore, F0 snapshot demo).

## Premessa e assunzioni (da confermare)

1. **Motore = `schede _Pokemon/Pokemon_Ascoli/`** — il gioco si costruisce a partire dalla demo, che resta pubblicata a `/demo`. (canvas JS, 7 quartieri di Ascoli, 17 specie,
   lotte selvatiche, cattura, evoluzione, salvataggio). Il brief punta a `pokeemerald-expansion`,
   ma quel fork non esiste e nessuno compila: l'unico motore *funzionante* è questo. Il piano lo
   porta a una demo completa della trama fino alla 2ª medaglia; i dati (specie, mosse, mappe,
   allenatori) restano in JSON/JS separati dal codice così da poter essere trasposti nella ROM
   in seguito. Se invece si vuole partire subito dalla ROM, il piano cambia radicalmente (Fase 0
   tecnica del brief) — dirlo ora.
2. **Scope = la trama scritta**: Ascoli → Salaria → Castel di Lama (Veleno) → costa (Acqua).
   Le palestre 3-8, la Lega, Polesio/antagonista e il leggendario restano roadmap (Fase G).
3. **Nomi**: i personaggi reali (Parolisi, Grieco, Hallissey, capipalestra-VIP) nella build
   giocabile diventano nomi di fantasia, come chiede il brief §6; la trama interna può tenerli.
4. Lo starter si **cattura** nel luogo scelto (Ripatransone / Rio Castellano / Sant'Emidio alle
   Grotte), non lo consegna un Professore: la trama non ne prevede uno, Bobby ne fa le veci.

## Cosa manca rispetto a un Gen 3 (Rubino/Zaffiro/Smeraldo)

| Pezzo | Oggi | Serve |
|---|---|---|
| Lotte contro allenatori, line-of-sight, ricompensa in soldi | no | sì |
| Capipalestra, medaglie, palestra con puzzle minimo | no | 2 |
| Eventi/script con flag (palestra chiusa, agguato, sblocco strade) | no | sì |
| Rivale | no | 2-3 incontri |
| Soldi, Market (tabaccheria), strumenti oltre Ball/Pozione | no | sì |
| Centro Pokémon = bar ("Che te faccio?"), Box PC | deposito sì, cura no | sì |
| Stati (VEL/PAR/SON/BRN), critici, STAB, priorità, precisione mosse | parziale | sì |
| IA nemica (oggi: mossa a caso?) | da verificare | scelta per efficacia |
| Mappe fuori Ascoli | 0 | ~10 |
| Specie catturabili di fascia bassa (BST 200-320) | 1 (Pito) | 8-12 |
| Specie in motore | 17 | tutte le 54 della wiki |
| Sprite battaglia | 17 specie | tutte le specie usate |
| Sprite overworld NPC distinti (Bobby, Steven, Elena, rivale, capipalestra) | solo giocatore | sì |
| Musica/SFX | beep | opzionale |
| Pubblicazione online | non servita | `Wikascolemon/gioco/` |

## Fasi e task

### A. Bibbia di design (blocca tutto il resto) → `Trama/bibbia.md`
- [ ] A1. Ordine definitivo delle **8 palestre** con città, capopalestra, tipo, livello asso
      (Castel di Lama/Veleno L14, costa/Acqua L20 fissi dalla trama; proposte per le altre 6).
- [ ] A2. **Percorso principale** della demo, mappa per mappa, con livelli incontri e allenatori.
- [ ] A3. **Rivale** (chi, dove lo si incontra: stazione, Maltignano, costa).
- [ ] A4. Cast con **nomi di gioco** (fittizi) ↔ nomi interni.
- [ ] A5. **Distribuzione specie**: quali delle 54 vivono in quali mappe della demo, e lista delle
      8-12 specie di fascia bassa da inventare (uccello, roditore, insetto, pesce del Tronto,
      erbacea da campi, crostaceo costiero…), con tipi e BST.
- [ ] A6. Squadre di tutti gli allenatori (≈15 normali + 2 capipalestra + rivale).
→ verifica: il documento risponde alle 6 domande di `brief_prossimi_passi` §3A.

### B. Specie mancanti (wiki prima, gioco dopo)
- [ ] B1. Schede delle 8-12 specie di fascia bassa con `crea-scheda` (artwork via `codex exec`),
      pubblicate con `pubblica-scheda`.
- [x] B2. Script `tools/build-dex.mjs`: estrae numero, tipi, statistiche, learnset, evoluzioni
      da `Wikascolemon/*.html` e genera `Pokemon_Ascoli/species.json` (fonte unica; la wiki resta
      autorevole). Il test verifica somma BST e tipi contro le pagine.
- [x] B3. Mosse: tabella completa in `moves.json` (tutte quelle dei learnset, con categoria
      fisico/speciale per mossa, effetti di stato, priorità).
→ verifica: `node tests/regression.mjs` verde; ogni specie della wiki è nel motore.

### C. Motore di gioco
- [x] C1. **Eventi e flag**: `save.flags`, NPC/transizioni/edifici condizionati da flag, dialoghi
      a più pagine e scelte (sì/no, scelta del luogo dello starter).
- [x] C2. **Allenatori**: entità `trainer` con sguardo (line-of-sight), squadra, dialogo
      pre/post, soldi; lotta a squadre con switch forzato; flag "sconfitto".
- [x] C3. **Battaglia Gen 3**: STAB, critici, stati con effetti in lotta, priorità, precisione,
      IA che preferisce la mossa più efficace; exp di gruppo; soldi.
- [x] C4. **Bar-Centro** (cura + PC) e **Market** (compra/vendi: Ball, Pozione, Antidoto, Repellente).
- [x] C5. **Palestre e medaglie**: schermata allenatore con medaglie; medaglia 1 sblocca
      Spinetoli, medaglia 2 chiude la demo con titoli.
- [ ] C6. **Intro**: arrivo in treno, nome del giocatore, Bobby al bar di Porta Maggiore.
- [x] C7. **Configuratore palestre e allenatori** (richiesta del 20/08):
      - `Mappa_Pokemon/configuratore.html` (mappa vera): POI "Palestra" con capopalestra, tipo,
        ordine, città; export nello stesso JSON.
      - `Pokemon_Ascoli/configuratore.html` (pixel): strumento "Palestra" (edificio + capopalestra
        + medaglia) e strumento "Allenatore" (posizione, direzione/raggio di sguardo, classe,
        sprite, squadra specie+livello+mosse, dialoghi pre/post, soldi) con form guidato, lista
        per mappa, duplica/elimina; salva in localStorage ed esporta `trainers.json` letto dal gioco.
→ verifica: test di regressione estesi + un test di "playthrough" scriptato (stato → eventi →
  flag) che percorre l'intera demo senza UI.

## Esecuzione punti 1-3 (flottiglia, 20/08/2026) — Fable orchestra, τ decide il modello

Contratti fra moduli: `Pokemon_Ascoli/ARCHITETTURA.md`.

**Ondata 1 (parallela, file disgiunti)**
- [x] W1-A τ=difficile/Fable — `tools/build-dex.mjs` → `species.js`, `moves.js`, `moves-catalog.json`, `dex-overrides.json`; `data.js` senza specie; test dex.
- [x] W1-B τ=difficile/Fable — `battle.js` puro (stati, critici, STAB, priorità, PP, IA, cattura, exp) + `tests/battle.test.mjs`.
- [x] W1-C τ=medio/Opus — `events.js` (condizioni, script, runner) + `tests/events.test.mjs`.
- [x] W1-D τ=facile/Sonnet — `trainers.js` (classi, allenatori di esempio, palestre) + `tests/trainers.test.mjs`.
- [x] W1-E τ=facile/Sonnet — `Mappa_Pokemon/configuratore.html`: POI Palestra con campi e precompilazione delle 8.

**Ondata 2 (dopo la 1)**
- [x] W2-A τ=difficile/Fable — integrazione in `game.js`/`index.html`: battle.js (lotte allenatori, switch, soldi, stati in UI, PP, apprendimento mosse), events.js (dialoghi a pagine, scelte, flag, NPC/passaggi condizionati, porte: bar cura, market, palestra), medaglie/scheda allenatore, save v2.
- [x] W2-B τ=medio/Opus — configuratore pixel: strumenti Palestra e Allenatore (form squadra, sguardo, dialoghi) → override `pokemonAscoliTrainersV1`.
- [ ] W2-C (rimandato alla Fase E) τ=facile/Sonnet — sprite overworld per classi allenatore + 6 personaggi (assets/npc), rendering con sheet.

**Ondata 3**
- [x] W3 verifica-scettica in Chromium headless: 2 bug trovati e corretti (render loop morto in title screen, flag non salvati a fine script) + guardia squadra vuota; 7 test verdi; commit/push 20/08.

### D. Mondo
- [ ] D1. Revisione delle 7 mappe di Ascoli per la trama (bar di Bobby a Porta Maggiore, Callare
      e Happy Coffee, Ventidio Basso chiuso, Sant'Emidio alle Grotte come luogo-starter).
- [ ] D2. Mappe nuove: **Rio Castellano** e **Ripatransone** (starter), **Marino del Tronto**,
      **Oasi**, **Maltignano** (salita), **Castel di Lama** (+ palestra Free Spirit),
      **Spinetoli**, **Centobuchi**, **Costa** (Ristoro al Porto, spiaggia, Jonathan/palestra).
      Scala Gen 3 (40×30–60×40), con incontri e allenatori da A2/A6.
- [ ] D3. Nuovi tile necessari (sabbia, mare, collina, asfalto, binari) in `drawTile`.
→ verifica: percorso a piedi completo da stazione a Jonathan; test sui limiti mappa.

### E. Asset
- [ ] E1. Sprite battaglia front/back per le specie nuove e per quelle della wiki usate nella demo
      (dall'artwork Gemini, pipeline coerente con i 17 già fatti).
- [ ] E2. Overworld sprite 4 direzioni per Bobby, Steven, Elena, rivale, 2 capipalestra, tipi
      allenatore generici (skill `image-to-overworld-sprites`).
- [ ] E3. Icone medaglie, schermata titolo.

### F. Rifinitura e pubblicazione
- [ ] F1. Testi e dialoghi in italiano/dialetto per tutti gli NPC della demo.
- [ ] F2. Bilanciamento: curva livelli per arrivare alla 2ª palestra a L20-22 senza grinding.
- [x] F0. Snapshot della demo attuale in `Wikascolemon/demo/` (resta online a `/demo`, non si tocca più). Fatto il 20/08.
- [ ] F3. Il gioco evolve *dalla* demo in `schede _Pokemon/Pokemon_Ascoli/`; la build va in `Wikascolemon/gioco/` + link dall'indice della wiki; deploy.
- [ ] F4. Aggiornare `CLAUDE.md`, README, brief con lo stato reale.
→ verifica: partita completa da zero a seconda medaglia in browser; test verdi; sito online.

### G. Roadmap oltre la demo (non in questo piano)
Palestre 3-8 (Remigio/montagna, Ossini/Ventidio Basso, Santa Polisia tardi…), sottotrama
San Giacomo, Polesio e Di Silvestro, Lega (Curti, Celani, Castelli, Fioravanti, Rozzi),
leggendario (picchio vs Sibilla vs Pretalien), eventuale porting a pokeemerald-expansion.

## Ordine di esecuzione
A → B2/B3 e C in parallelo → D → B1/E (man mano che servono) → F.
Ogni fase chiude con commit e test verdi; le schede nuove passano dalla wiki come sempre.

## Criteri di accettazione della demo
- Si gioca da `file://` e da GitHub Pages, zero dipendenze.
- Trama eseguibile esattamente come scritta in `Trama/trama_prime_due_palestre.md`.
- Nessun nome di persona reale nei testi di gioco.
- Tutti i dati di gioco provengono da JSON generati/validati, non da costanti sparse.

---

# Piano: Cerqua (evoluzione di Totera) → #044, con slittamento di +1 di tutto il blocco successivo

Da fare, **non ancora fatto**. Annotato il 20/08/2026 su richiesta di Jacopo.

Cerqua è l'evoluzione di **Totera (#043)** e va messa subito dopo, quindi prende il **#044**,
che oggi è di Pito. Tutto ciò che sta da #044 in su slitta avanti di uno. **#150 Pretalien
non si tocca** (è fuori blocco, numero riservato per il leggendario).

## Rinumerazione

| Oggi | Domani | Pokémon |
|---|---|---|
| — | **#044** | **Cerqua** (nuova, da scrivere) |
| #044 | #045 | Pito |
| #045 | #046 | Pozza |
| #046 | #047 | Umito |
| #047 | #048 | Segaccio |
| #048 | #049 | Venagrox |
| #049 | #050 | Ciccharizard |
| #050 | #051 | Cignalò |
| #051 | #052 | Bracignale |
| #052 | #053 | Caciara |
| #150 | #150 | Pretalien (invariato) |

⚠️ Il blocco #044-#049 sono le sei schede più vecchie della wiki (i tre starter originari più
Segaccio, Venagrox, Ciccharizard): erano "riservate per disegno" e finora mai toccate. Con
questo giro hanno smesso di esserlo: la nota sulla numerazione in `CLAUDE.md` è stata aggiornata
(diceva "#044-049 taken", ora dice "#045-050 taken, #044 reserved for Cerqua").

## Task

**Piano completato il 20/08/2026.** Rinumerazione e scheda di Cerqua pubblicate.

- [x] 1. Scritta la scheda di **Cerqua** (arrivata già pronta in Downloads, artwork incorporato):
      Erba/Terra, "Pokémon Quercia", evoluzione di Totera dal livello 36, 485 di totale
      (90/100/120/60/85/30). Validata: somma statistiche giusta, barre `round(v/150*100)%`
      corrette su tutte e sei, efficacie ricalcolate a mano dalla type chart e coincidenti
      (Ghiaccio 4×, Fuoco/Volante/Coleottero 2×, Terra/Roccia ½×, Elettro 0×), ancore del
      sommario tutte esistenti, nessun asset esterno.
- [x] 2. Rinumerate le **9 schede** da Pito a Caciara, +1 ciascuna (4 punti per file).
- [x] 3. Dexnav ripuntate: il "successivo" di **Totera** e il "precedente" di **Pito** ora
      passano da Cerqua #044. Sistemata anche l'**incoerenza di contenuto**: la scheda di
      Totera dichiarava "Totera non si evolve" in tre punti (intro, riquadro Evoluzioni,
      card dell'indice) — ora mostra la catena a due stadi verso Cerqua.
- [x] 4. Aggiornati `index.html` (card + riga dell'indice rapido, in posizione numerica) e la
      tabella del `README.md`. Nessuna classe `.t-<tipo>` nuova: `.t-erba` e `.t-terra`
      c'erano già sia nell'indice sia in `totera.html`.
- [x] 5. Bozze in `schede _Pokemon/` allineate, tabella della skill `crea-scheda` aggiornata
      (#044 Cerqua ✅, primo libero #054), skill `pubblica-scheda` e `CLAUDE.md` idem.
- [x] 6. Commit + push, deploy verificato.


## Criteri di accettazione

- Nessun numero duplicato, nessun buco: #001-#053 contigui + #150 invariato.
- Ogni dexnav punta al vicino corretto in entrambe le direzioni.
- Nessun riferimento residuo alla vecchia numerazione in HTML, README, index o skill.

---

# Piano: ridurre i quartieri della demo Pokémon Ascoli a scala Gen 3

Le sette mappe sono 256×160 tile (~270 schermate ciascuna): la città sembra vuota per aritmetica.
Target: 40×30 – 60×40 tile per quartiere, stessi landmark, stessi collegamenti.

## Task

- [x] 1. `data.js`: ridisegnare le 7 mappe (48×36 città, 60×40 Monticelli e Porta Cartara) con strade, acque, ponti, edifici, piazze, etichette, zone incontro, passaggi reciproci e NPC alle nuove coordinate; `start`/`respawn` sulla strada davanti alla stazione → verifica: `node tests/regression.mjs`.
- [x] 2. `game.js` + `configuratore.js`: chiave di configurazione `V2` (le vecchie override in localStorage puntano a coordinate 256×160) e guardia in `startSession`: salvataggio con posizione fuori mappa o bloccata → ripristino a `data.start` → verifica: salvataggio vecchio non lascia il giocatore dentro un muro.
- [x] 3. `configuratore.js`: canvas dimensionato sulla mappa corrente (scala 16 px/tile), griglia per tile, clamp del cursore su `width/height` reali invece dei fissi 255/159 → verifica: apertura configuratore, click sull'ultimo tile.
- [x] 4. `tests/regression.mjs`: asserzioni su dimensioni 40-60 × 30-40, oggetti dentro i limiti, spawn/start non su acqua o edificio → verifica: test verdi.

## Criteri di accettazione

- Ogni quartiere è fra 40×30 e 60×40; landmark richiesti dal test invariati; percorso a piedi fra tutti i quartieri possibile.
- Test verdi; nessuna dipendenza aggiunta; nessuna feature nuova al motore.

---

# Piano: Gioco "Pokémon GO del Piceno" (virtuale-prima, predisposto al GPS)

Cartella di lavoro: `Mappa_Pokemon/`. Due file HTML + un file dati condiviso.
La mappa esistente (`mappa_piceno_1.html`, PNG 1024×640 in base64) è il mondo di gioco.

## Architettura

- `Mappa_Pokemon/mappa_piceno.js` — la base64 della mappa estratta in una costante condivisa (evita di duplicare ~850 KB in ogni file).
- `Mappa_Pokemon/configuratore.html` — **editor SVG della mappa** (il pezzo fondamentale):
  - mostra la mappa come sfondo di un `<svg viewBox="0 0 1024 640">`;
  - click sulla mappa per creare punti/zone di spawn (cerchio con raggio regolabile), assegnando: Pokémon (lista: Pito, Pozza, Umito, Segaccio, Venagrox, estendibile), rarità/probabilità, note;
  - stessi strumenti per piazzare luoghi speciali: PokéStop, palestre, laboratorio del Professore;
  - i dati vivono in `localStorage` durante l'editing; pulsanti **Esporta JSON** (download di `mappa_dati.json`) e **Importa JSON**;
  - campo opzionale per la calibrazione GPS: coordinate lat/lon di 2 punti di riferimento noti (es. Ascoli e San Benedetto) → basteranno per la proiezione lat/lon→pixel della fase GPS.
- `Mappa_Pokemon/gioco.html` — il gioco:
  - mappa + marcatore giocatore mosso con frecce/tap (modulo "position provider": oggi tastiera, domani Geolocation API senza riscritture);
  - entri in una zona di spawn → possibile incontro → schermata di cattura semplice (artwork + tap sulla ball a timing);
  - Pokédex: i catturati sbloccano il link alla scheda wiki corrispondente;
  - salvataggio in `localStorage` (catture, inventario);
  - carica i dati di spawn: default incorporato nel file + pulsante "Importa JSON dal configuratore".

## Task

- [x] 1. Estrarre la base64 della mappa in `mappa_piceno.js` → verifica: una pagina di prova la mostra identica all'originale.
- [x] 2. Costruire `configuratore.html`: sfondo SVG + creazione/spostamento/cancellazione di zone spawn e POI, pannello proprietà (Pokémon, raggio, rarità) → verifica: piazzo 3 zone, ricarico la pagina, sono ancora lì (localStorage).
- [ ] 3. Export/Import JSON nel configuratore → verifica: esporto, svuoto localStorage, importo, tutto torna.
- [ ] 4. Costruire `gioco.html`: mappa, movimento a frecce (+ tap su mobile), collision con le zone di spawn → verifica: entrando in zona compare l'incontro.
- [ ] 5. Cattura: schermata incontro con artwork, lancio ball a timing, esito cattura/fuga → verifica: cattura registrata in localStorage.
- [ ] 6. Pokédex in-game: griglia dei catturati con link alle schede wiki → verifica: link corretti, non-catturati oscurati.
- [ ] 7. Seed iniziale dei dati: zone coerenti con la wiki (linea di Pito ad Acquasanta, Segaccio a Offida/Polesio, Venagrox nelle fogne di Venagrox... cioè Ascoli) → verifica: giro di prova completo.
- [ ] 8. Predisposizione GPS: campo calibrazione nel configuratore + stub `positionProvider` con Geolocation dietro un toggle (non attivo di default) → verifica: il toggle non rompe la modalità frecce.

## Criteri di accettazione

- Tutto statico, zero dipendenze esterne, funziona da `file://` e su GitHub Pages.
- Il configuratore permette di piazzare Pokémon sulla mappa e il gioco li usa senza toccare il codice (via JSON).
- Il passaggio futuro al GPS richiede solo di attivare il provider Geolocation, non riscritture.

---

# Piano: scheda Pokédex di Venagrox

- [x] Usare `segaccio_6.html` come base strutturale e mantenere stile, impaginazione responsive e formato autosufficiente con immagine incorporata.
- [x] Definire Venagrox come Pokémon singolo #048, categoria Trattore, tipo Acciaio/Terra, con statistiche, resistenze, abilità e mosse coerenti con la descrizione.
- [x] Generare con GPT Image 2 un artwork originale in stile creatura da enciclopedia di mostri: gigantesco trattore antropomorfo rurale, massiccio e minaccioso, senza loghi, testo o personaggi reali.
- [x] Costruire `venagrox.html`, incorporando l'artwork e adattando tutte le sezioni narrative: grugniti, riparazione delle fogne, critica analitica, produzione di carni e salumi, paura di Zio Peppe e Nonna, mossa finale Armageddon e difesa a base di piombo in chiave fantastica.
- [x] Aggiornare soltanto i collegamenti di navigazione necessari nella scheda precedente e AGENTS.md solo se presente e se emerge una nuova regola di business da documentare.
- [x] Verificare HTML, asset incorporati, collegamenti locali, encoding UTF-8 e contratto responsive; eseguire i controlli di regressione disponibili su tutte le schede esistenti.
- [x] Correggere la mancata visualizzazione dell'artwork sostituendo la variabile CSS sovradimensionata con due elementi `<img>` JPEG incorporati e rigenerando Venagrox in stile più pokemonizzato.
- [ ] Controllare manualmente la resa visiva desktop/mobile: il browser automatico non può aprire URL `file://` per policy di sicurezza.

## Criteri di accettazione

- `venagrox.html` si apre senza dipendenze esterne e replica fedelmente il template delle schede esistenti.
- L'artwork rappresenta chiaramente Venagrox ed è salvato/incorporato nel progetto.
- Tutti gli elementi richiesti compaiono nella scheda in tono Pokédex satirico ma coerente.
- Le quattro schede esistenti restano valide e non subiscono modifiche estranee.

---

# Piano: scheda Pokédex di Ciccharizard

- [x] Usare `venagrox.html` come base strutturale, mantenendo stile, navigazione, impaginazione responsive e formato autosufficiente con immagini incorporate.
- [x] Definire Ciccharizard come Pokémon singolo #049, barista elegante e colto, ibrido ornitorinco/gatto in frac, con tipi, statistiche, abilità e mosse coerenti con l'evocazione di spiriti notturni e con il suo potere centrale di ascolto e partecipazione.
- [x] Trattare la sua durezza verso le minoranze etniche come un difetto contraddittorio e criticabile del personaggio, contrapponendolo alla sua disponibilità a difenderle quando subiscono un torto, senza contenuti degradanti o stereotipi.
- [x] Generare con la modalità integrata di ImageGen un artwork originale in stile creatura da enciclopedia di mostri: elegante barista notturno metà ornitorinco e metà gatto, in frac, circondato da spiriti antichi; niente testo, loghi o personaggi reali.
- [x] Creare `ciccharizard.html`, salvare gli asset sorgente nel progetto e incorporarli nella scheda; ambientare habitat e attività nei locali notturni del centro di Ascoli Piceno.
- [x] Aggiornare soltanto i collegamenti di navigazione necessari, in particolare il passaggio da `venagrox.html` a `ciccharizard.html`; aggiornare `AGENTS.md` solo se presente e se emerge una nuova regola di business.
- [x] Verificare HTML, asset incorporati, link locali, encoding UTF-8 e resa responsive; eseguire i controlli di regressione disponibili su tutte le schede.

## Criteri di accettazione

- `ciccharizard.html` si apre senza dipendenze esterne e replica fedelmente il formato delle schede esistenti.
- L'artwork rappresenta chiaramente Ciccharizard ed è salvato e incorporato nel progetto.
- Tutti i tratti richiesti compaiono in tono Pokédex satirico, con la discriminazione trattata come difetto e non celebrata.
- Le schede esistenti restano valide e ricevono solo l'eventuale modifica minima alla navigazione.

---

# Piano: mappa vettoriale del Piceno in stile videogioco di mostri

## Direzione approvabile

- Usare lo screenshot fornito soltanto come riferimento geografico: area da Ascoli Piceno alla costa adriatica, con rilievi a ovest, valle del Tronto, centri abitati e viabilità principale.
- Creare un'illustrazione originale da videogioco top-down, con forme semplificate, colori naturali saturi, boschi, montagne, fiume, strade e città leggibili; nessun elemento dell'interfaccia Google Maps e nessun asset ufficiale Pokémon.
- Consegnare la base come vero SVG a livelli, non come immagine raster convertita: terreno, acqua, rilievi, vegetazione, strade, insediamenti, etichette e POI restano modificabili separatamente.
- Mantenere, se recuperabile, il `viewBox="0 0 1024 640"` della mappa precedente per non invalidare coordinate, spawn e POI già configurati.

## Task

- [x] 1. Recuperare il contesto reale in `../Mappa_Pokemon/`: verificare la vecchia mappa, il configuratore e le coordinate esistenti prima di modificare l'integrazione.
- [x] 2. Definire la gerarchia SVG e una palette originale coerente con un gioco di cattura mostri: mare, pianura, colline, Appennini, fiume Tronto, boschi, strade, città e landmark.
- [x] 3. Disegnare la nuova mappa vettoriale del Piceno nello stesso sistema di coordinate 1024×640 della mappa precedente, con dettaglio maggiore nelle aree utili al gioco e semplificazione nelle zone di contorno.
- [x] 4. Integrare l'SVG come sfondo sostitutivo nel configuratore e nella pagina di test, mantenendo separato il livello interattivo di spawn e POI.
- [ ] 4b. Collegare lo stesso SVG a `gioco.html` quando verrà realizzato: il file di gioco non esiste ancora.
- [x] 5. Aggiornare solo la documentazione di progetto necessaria; `AGENTS.md` non è presente e non sono state introdotte nuove regole di business.
- [x] 6. Eseguire i test di regressione disponibili e controlli specifici: validità SVG/HTML, assenza di dipendenze esterne, compatibilità statica, coordinate invarianti, resa desktop/mobile e leggibilità con overlay di gioco.

## Criteri di accettazione

- La mappa è un SVG realmente editabile e scalabile senza perdita, non contiene screenshot, tile o immagini incorporate.
- La geografia del Piceno rimane riconoscibile e coerente con il riferimento, ma l'aspetto è un'illustrazione originale da videogioco.
- Spawn, POI e movimento del giocatore restano nello stesso sistema di coordinate o vengono migrati in modo verificabile.
- La nuova base sostituisce la vecchia mappa nel configuratore senza rompere salvataggi o schede Pokédex ed è pronta per il futuro `gioco.html`.
- Tutti i controlli di regressione passano e la resa è verificata almeno a 1024×640, desktop widescreen e mobile.

---

# Piano: editor degli elementi territoriali nel configuratore

## Comportamento previsto

- Separare visivamente la toolbar in strumenti di gioco e strumenti territoriali, senza cambiare le funzioni esistenti.
- Aggiungere tre strumenti: **Montagna**, **Corso d'acqua** e **Struttura**.
- Montagne e strutture si inseriscono con un clic, si trascinano, si ridimensionano e si eliminano come gli elementi già presenti.
- Le strutture possono essere classificate almeno come edificio, borgo, ponte o torre, con nome e dimensione modificabili.
- I corsi d'acqua si disegnano per punti successivi; il tracciato selezionato mostra vertici trascinabili e permette di modificare nome, categoria (fiume, torrente o canale) e larghezza.
- Disegnare gli elementi territoriali in un livello SVG separato sotto spawn e POI, così non coprono né alterano i dati di gioco.

## Task

- [x] 1. Estendere il modello salvato aggiungendo `territorio`, con migrazione trasparente dei salvataggi versione 1 e conservazione integrale di `elementi`.
- [x] 2. Aggiungere toolbar, modalità di disegno e comandi di conclusione/annullamento per montagne, corsi d'acqua e strutture.
- [x] 3. Implementare il rendering vettoriale originale degli elementi territoriali nel nuovo livello SVG dedicato.
- [x] 4. Estendere selezione, trascinamento, modifica dei vertici, pannello proprietà, eliminazione e riepilogo.
- [x] 5. Verificare la persistenza dopo ricaricamento e la compatibilità con dati già presenti in `localStorage`.
- [x] 6. Eseguire le regressioni: creazione/spostamento/eliminazione di spawn e POI, disegno dei tre elementi territoriali, resa desktop/mobile, assenza di errori browser e validità HTML/SVG.
- [x] 7. Aggiornare la documentazione tecnica necessaria; `AGENTS.md` non è presente.

## Criteri di accettazione

- Il configuratore permette di creare, modificare, spostare e cancellare montagne, corsi d'acqua e strutture senza modificare manualmente l'SVG di base.
- Un corso d'acqua può avere più segmenti e i singoli vertici possono essere riposizionati.
- Gli elementi territoriali persistono al ricaricamento, mentre spawn e POI preesistenti restano invariati.
- Il livello territoriale rimane sotto gli overlay di gioco e usa lo stesso sistema di coordinate 1024×640.
- Il configuratore resta statico, senza dipendenze esterne, e funziona sia desktop sia mobile.

---

# Piano: rendere eliminabili gli elementi già presenti sulla mappa

## Causa e soluzione

- La mappa attuale è caricata come un'unica `<image>`: montagne, città e altri elementi disegnati dentro `mappa_piceno.svg` non possono essere selezionati singolarmente.
- Creare una variante di sfondo contenente soltanto gli elementi bloccati: terreno, mare, campi, strade, cornice, titolo, bussola e decorazioni non modificabili.
- Trasformare gli elementi geografici iniziali in dati territoriali con ID stabili: montagne, città/borghi con etichetta, ponti, landmark e corsi d'acqua.
- Conservare i boschi decorativi nello sfondo bloccato in questa fase; potranno diventare modificabili con un tipo dedicato se richiesto.

## Task

- [x] 1. Creare `mappa_piceno_base.svg`, derivata dalla mappa esistente ma senza duplicare gli elementi che diventeranno modificabili.
- [x] 2. Definire un seed territoriale versione 1 con posizioni e nomi degli elementi iniziali nel sistema 1024×640.
- [x] 3. Migrare i salvataggi esistenti aggiungendo il seed una sola volta, senza alterare spawn, POI o elementi territoriali creati dall'utente.
- [x] 4. Rendere selezionabili, spostabili, modificabili ed eliminabili anche montagne, città/borghi, ponti, landmark e corsi d'acqua iniziali.
- [x] 5. Registrare separatamente gli ID degli elementi base eliminati e aggiungere **Ripristina elementi iniziali**, senza cancellare gli elementi creati dall'utente.
- [x] 6. Verificare che eliminare una città rimuova insieme simbolo ed etichetta e che il ripristino non produca duplicati.
- [x] 7. Eseguire regressioni su vecchi salvataggi, elementi territoriali personalizzati, spawn/POI, ricaricamento, desktop/mobile e assenza di errori browser.
- [x] 8. Aggiornare la documentazione tecnica necessaria; `AGENTS.md` non è presente nel progetto.

## Criteri di accettazione

- Ogni elemento geografico iniziale convertito può essere selezionato ed eliminato come un elemento aggiunto manualmente.
- La cancellazione persiste dopo il ricaricamento ed è reversibile tramite il comando di ripristino.
- Il ripristino reinserisce soltanto gli elementi base mancanti e non modifica gli elementi creati dall'utente.
- Non restano copie visive dell'elemento eliminato nello sfondo SVG.
- Spawn, POI e coordinate 1024×640 rimangono invariati.

---

# Piano: sprite overworld di tutti i Pokémon

## Ambito

- Convertire i 16 Pokémon presenti nelle schede HTML: Banconio, Basilino, Brasero, Cavalbrace, Ciccharizard, Compadrone, Fuocavallo, Pito, Pozza, Puledrotto, Segaccio, Tuffito, Turibasil, Umito, Venagrox e Vescovasil.
- Usare per ogni Pokémon l'artwork principale della relativa scheda come riferimento di identità; i file sorgente duplicati di Ciccharizard e Venagrox non generano output aggiuntivi.
- Applicare la skill locale `.agents/skills/image-to-overworld-sprites/` con la modalità integrata `imagegen` e sfondo antracite `#242628`.
- Salvare gli asset finali come frame separati in `sprite/<pokemon>/`, con nomi `front_1.png`...`front_4.png`, `back_1.png`...`back_4.png`, `left_1.png`...`left_4.png` e `right_1.png`...`right_4.png`.

## Task

- [x] 1. Estrarre in staging gli artwork principali incorporati nelle 16 schede, senza modificare le schede originali.
- [x] 2. Analizzare per ogni Pokémon silhouette, palette e tratti identitari da preservare.
- [x] 3. Generare un foglio 4×4 coerente per ciascun Pokémon: 16 frame, righe fronte/retro/sinistra/destra e quattro pose per direzione.
- [x] 4. Validare ogni foglio per identità, griglia, direzioni, scala, baseline, palette, pixel art e assenza di testo/scenari; effettuare fino a tre tentativi mirati se necessario.
- [x] 5. Dividere ogni foglio validato in 16 PNG individuali e salvarli nella directory dedicata al Pokémon.
- [x] 6. Verificare che `sprite/` contenga esattamente 16 directory e 256 frame PNG finali, tutti leggibili e senza output mancanti o duplicati.
- [x] 7. Eseguire i controlli di regressione disponibili e confermare che nessuna scheda HTML o immagine sorgente sia stata alterata.

## Criteri di accettazione

- Ogni Pokémon ha una directory dedicata sotto `sprite/` contenente esattamente 16 frame PNG separati.
- I frame rappresentano le quattro direzioni e un ciclo di camminata coerente, mantenendo l'organizzazione validata della griglia 4×4 usata in generazione.
- I tratti riconoscibili dell'artwork sorgente restano leggibili e coerenti in tutti i frame.
- Tutti gli asset condividono il linguaggio visivo pixel-art overworld da JRPG portatile dei primi anni 2000, senza copiare personaggi esistenti.
- Le schede e gli asset sorgente restano invariati.

---

# Piano approvato: demo statica "Pokémon Ascoli"

## Ambito della prima demo

- Creare in `Pokemon_Ascoli/` un gioco browser statico, in italiano, senza trama e con ambientazione diurna fissa.
- Usare una griglia reale a celle da 16×16 pixel, visuale top-down originale ispirata ai JRPG portatili di terza generazione, viewport logica 240×160 e scaling senza smoothing.
- Avviare la partita all'uscita della stazione ferroviaria di Ascoli Piceno; mostrare subito la scelta dello starter tra Basilino, Puledrotto e Tuffito al livello 5.
- Usare lo sprite provvisorio di Oliver fornito dall'utente, con movimento cella per cella, quattro direzioni, animazione e telecamera a inseguimento.
- Realizzare sette mappe esterne collegate: Centro Storico, Porta Maggiore, Monticelli, Campo Parignano, Borgo Chiaro, Borgo Solestà e Porta Cartara. Gli interni restano fuori da questa fase.

## Geografia e collegamenti approvati

- Centro Storico: Piazza del Popolo, Piazza Arringo, Cattedrale e Battistero, Palazzo dei Capitani e Teatro Ventidio Basso; incontri urbani a bassa frequenza.
- Porta Maggiore: stazione iniziale, Piazza Immacolata e Ponte di Porta Maggiore; incontri nelle aree verdi e periferiche.
- Monticelli: Ospedale Mazzoni, Little Bar, benzinaio di fronte all'ospedale e Pizzeria Mosè; incontri nelle celle esterne attorno ai quattro luoghi con uguale probabilità.
- Campo Parignano: Cinema Odeon, Chiesa del Sacro Cuore e Sant'Emidio alle Grotte; quest'ultima area è esplorabile, inizialmente vuota e con incontri molto rari.
- Borgo Chiaro: Stadio Cino e Lillo Del Duca e aree esterne circostanti come zona incontri.
- Borgo Solestà: Porta Solestà, Ponte Romano, asse urbano, area verde/sportiva e margine collinare.
- Porta Cartara: Rio Castellano, rive esplorabili con incontri e acqua non attraversabile; ponte pedonale verso il Centro Storico.
- Collegamenti: Centro–Porta Maggiore, Porta Maggiore–Monticelli, Centro–Campo Parignano, Campo Parignano–Borgo Chiaro, Centro–Borgo Solestà, Borgo Solestà–Campo Parignano, Borgo Solestà–Borgo Chiaro, Borgo Chiaro–Porta Maggiore e Centro–Porta Cartara.
- Dimensionare i percorsi per circa due minuti di attraversamento medio per quartiere, mantenendo la geografia riconoscibile ma compressa.

## Sistemi di gioco

- Incontri casuali soltanto nelle celle configurate; tabelle per quartiere con specie, livello minimo/massimo, peso e frequenza modificabili.
- Dati delle schede HTML come fonte per nomi, tipi, statistiche, mosse, livelli ed evoluzioni; usare nella demo i Pokémon base che dispongono di sprite.
- Lotta a turni essenziale con quattro mosse, PS, statistiche e tipi, cambio, borsa, fuga e cattura; niente abilità o effetti avanzati nella prima demo.
- Inventario iniziale: 10 Ball e 5 Pozioni. Squadra massima di sei; catture eccedenti nel Deposito accessibile dal menu.
- Menu: Squadra, Borsa, Pokédex, Deposito, Salva e Impostazioni. Pokédex con sagoma/dati minimi dopo l'avvistamento, dati completi e collegamento alla scheda HTML dopo la cattura.
- Sconfitta totale: ritorno alla stazione, squadra curata e nessuna perdita di strumenti.
- Controlli tastiera/frecce/WASD e comandi touch; salvataggio automatico locale, esportazione/importazione JSON e ripristino.
- Effetti sonori essenziali; musica rimandata.

## Configuratore

- Fornire un editor visuale per selezionare il quartiere e modificare tile, collisioni, passaggi, zone e tabelle incontri, edifici/attività e NPC.
- Salvare le modifiche in `localStorage` e permettere esportazione/importazione JSON compatibile con il gioco.
- Lasciare attività commerciali, livelli, rarità, dialoghi e movimenti NPC modificabili senza intervenire sul codice.

## Task

- [x] 1. Creare struttura statica, dati condivisi e controlli di integrità delle schede/sprite.
- [x] 2. Implementare rendering pixel-perfect, sette tilemap, collisioni, movimento, telecamera e transizioni.
- [x] 3. Integrare sprite provvisorio di Oliver, controlli desktop/touch e schermata starter.
- [x] 4. Implementare incontri, battaglie, cattura, squadra, deposito, inventario e sconfitta.
- [x] 5. Implementare menu, Pokédex, salvataggio automatico ed export/import/reset JSON.
- [x] 6. Implementare configuratore visuale completo e compatibile con i dati del gioco.
- [x] 7. Aggiungere NPC ambientali essenziali e relativi controlli configurabili.
- [ ] 8. Eseguire regressioni automatiche, test browser desktop/mobile e verifica del funzionamento statico.
  - [x] Regressioni automatiche, asset e flusso desktop: avvio, starter, movimento, menu, incontro, lotta, Pozione e cattura.
  - [ ] Ripetere la verifica visiva con viewport mobile: il controllo del browser si è disconnesso durante il cambio di viewport.

## Criteri di accettazione

- Il gioco si avvia senza server e senza dipendenze esterne moderne, funziona da file statici su desktop e mobile e non richiede chiavi API.
- Il giocatore parte dalla stazione, sceglie lo starter e può visitare tutte e sette le mappe, incontrare, combattere e catturare Pokémon.
- Il configuratore modifica realmente il comportamento del gioco tramite dati esportabili e importabili.
- Le schede e gli sprite preesistenti non vengono modificati; i nuovi asset sono originali e separati.
- I test di regressione e i controlli browser previsti risultano superati.

---

# Piano: correggere i lati dei Pokémon durante la lotta

## Causa verificata

- I dati della lotta sono corretti: il Pokémon selvatico usa nome, livello e sprite frontale dell'incontro, mentre il Pokémon della squadra usa i propri dati e lo sprite posteriore.
- Il problema è nel layout: attualmente il Pokémon della squadra è mostrato a sinistra e quello selvatico a destra.

## Task

- [x] 1. Invertire soltanto i due schieramenti visivi: Pokémon selvatico a sinistra e Pokémon della squadra a destra.
- [x] 2. Spostare coerentemente ombre e schede PS, evitando sovrapposizioni e mantenendo leggibili nome, livello e salute.
- [x] 3. Aggiungere una regressione sul contratto di posizionamento dei due schieramenti.
- [x] 4. Eseguire la suite automatica e verificare visivamente una lotta su desktop e mobile.

## Criteri di accettazione

- Il Pokémon incontrato appare a sinistra con lo sprite frontale.
- Il Pokémon già posseduto appare a destra con lo sprite posteriore.
- Nome, livello, PS e sprite restano associati al Pokémon corretto.
- Nessun elemento della schermata di lotta si sovrappone su desktop o mobile.

---

# Piano correttivo: associare ogni scheda PS al proprio Pokémon

## Causa verificata

- Gli sprite sono ora sui lati richiesti: Pokémon selvatico a sinistra e Pokémon della squadra a destra.
- Le schede PS sono però rimaste sul lato opposto: a sinistra compare la scheda della squadra accanto al selvatico e a destra quella del selvatico accanto al Pokémon della squadra.

## Task

- [x] 1. Mantenere il Pokémon selvatico a sinistra e quello della squadra a destra.
- [x] 2. Riposizionare la scheda del selvatico nello stesso gruppo visivo dello sprite selvatico e la scheda della squadra nello stesso gruppo dello sprite alleato.
- [x] 3. Calcolare spaziature che evitino sovrapposizioni tra sprite, schede PS, messaggio e pulsanti sia su desktop sia su mobile.
- [x] 4. Aggiornare la regressione affinché verifichi l'associazione visiva corretta, non soltanto il lato dei singoli elementi.
- [x] 5. Eseguire regressioni, controlli di sintassi e una battaglia reale con verifica visiva desktop/mobile.

## Criteri di accettazione

- Nello stesso lato/gruppo visivo compaiono sempre nome, livello, PS e sprite del medesimo Pokémon.
- Incontrando Banconio con Basilino in squadra, Banconio e la sua scheda risultano chiaramente associati a sinistra, mentre Basilino e la sua scheda risultano associati a destra.
- La schermata resta leggibile e senza sovrapposizioni su desktop e mobile.

---

# Piano approvato: pubblicazione GitHub Pages di Pokémon Ascoli

- [x] Conservare la wiki esistente alla radice del sito pubblicato.
- [x] Copiare la demo statica in `/Pokemon_Ascoli/` durante il workflow Pages.
- [x] Validare l'artefatto, pubblicare su `main` e verificare il link live.
