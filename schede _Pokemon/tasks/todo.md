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

# Piano approvato: pubblicazione GitHub Pages di Pokémon Ascoli

- [x] Conservare la wiki esistente alla radice del sito pubblicato.
- [x] Copiare la demo statica in `/Pokemon_Ascoli/` durante il workflow Pages.
- [x] Validare l'artefatto, pubblicare su `main` e verificare il link live.
