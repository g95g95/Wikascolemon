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

- [ ] 1. Recuperare o ricostruire il contesto mancante di `Mappa_Pokemon/`: verificare la vecchia mappa, il configuratore e le coordinate esistenti prima di modificare l'integrazione.
- [ ] 2. Definire la gerarchia SVG e una palette originale coerente con un gioco di cattura mostri: mare, pianura, colline, Appennini, fiume Tronto, boschi, strade, città e landmark.
- [ ] 3. Disegnare la nuova mappa vettoriale del Piceno nello stesso sistema di coordinate della mappa precedente, con dettaglio maggiore nelle aree utili al gioco e semplificazione nelle zone di contorno.
- [ ] 4. Integrare l'SVG come sfondo sostitutivo nel configuratore e nel gioco, mantenendo separato il livello interattivo di spawn, POI e giocatore.
- [ ] 5. Aggiornare solo la documentazione di progetto necessaria; aggiornare `AGENTS.md` esclusivamente se viene introdotta una nuova regola di business o di integrazione.
- [ ] 6. Eseguire i test di regressione disponibili e controlli specifici: validità SVG/HTML, assenza di dipendenze esterne, compatibilità `file://`, coordinate invarianti, resa desktop/mobile e leggibilità con overlay di gioco.

## Criteri di accettazione

- La mappa è un SVG realmente editabile e scalabile senza perdita, non contiene screenshot, tile o immagini incorporate.
- La geografia del Piceno rimane riconoscibile e coerente con il riferimento, ma l'aspetto è un'illustrazione originale da videogioco.
- Spawn, POI e movimento del giocatore restano nello stesso sistema di coordinate o vengono migrati in modo verificabile.
- La nuova base sostituisce la vecchia mappa senza rompere configuratore, salvataggi o schede Pokédex.
- Tutti i controlli di regressione passano e la resa è verificata almeno a 1024×640, desktop widescreen e mobile.
