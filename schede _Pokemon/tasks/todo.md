# ▶ A CHE PUNTO SIAMO (21/11/2026, pomeriggio)

## ✅ DA FARE (lista unica, al 21/11)

Il gioco si gioca dal treno alla seconda medaglia (Jonathan), fino alla Costa, e in corriera a Ripatransone.
ROM: `pokemon-piceno.gba` del 21/11 pomeriggio (commit `302cfdff63` di `pokemon-piceno`), con accanto
`pokemon-piceno.sym` della stessa compilazione. Giulio lavora in parallelo e ha un suo piano in
`pokemon-piceno/tasks/todo.md`: **i due piani restano separati per ora** (deciso da Jacopo), si integrano dopo.

**Da dove si riparte (lasciato il 21/11 pomeriggio)**
1. **Fatto il 21/11: terzo giro di sprite** (commit `302cfdff63` di `pokemon-piceno`). I 18 fogli di Jacopo
   (Costa, evoluzioni degli starter) sono ritagliati e montati: Alghetta, Mucillax, Bagnetto, Cozzetta,
   Scoglieràx, Lettino, Maranzino, Cignalo, Peto, Caita, Turibasil, Vescovasil, Cavalbrace, Fuocavallo,
   Brasero, Compadrone, Cavedone, Batterino. Con i primi due giri sono 34 su 149. Nella stessa ROM gli
   strumenti in italiano (794 più le cocchie). Le tre prove passano; sprite e strumenti **non visti in
   gioco**, solo in anteprima: da guardare da Jacopo. L'anteprima di `ritaglia_fogli.py` esce nera in
   fondo (il foglio è alto 2000 e i pezzi ora sono 102): da allungare.
2. **Jacopo deve provare la ROM del 21/11**: le sette mosse con l'effetto ufficiale, la consegna delle MT da
   Hills e Riccio, la Mappa Città dal bigliettaio (per chi ha già una partita), la scheda allenatore con
   Oliver, le otto figure in lotta, Riccio sulla mappa, gli sprite nuovi in lotta.
3. Aperte, in attesa di Jacopo: le sei mosse che fanno solo danno, le 32 mosse da MT della wiki che non
   esistono, la proposta di Giulio sulle abilità, togliere Hoenn.

**Proposte del 21/11 mattina sulle mosse: aspettano il sì di Jacopo, niente è montato**

*Risposte di Jacopo (21/11 pomeriggio):* «Portacocchie perfetto»; Aeroattacco = Aeroassalto, sì; Battipiedi
ufficiale per Tifotto e Sciarpone, sì; il Battipiedi di Fatella e Ancella in sospeso. Sul resto non ha
ancora risposto.
- [x] Aeroassalto: nome corretto nelle sei schede (pubblicate e bozze), `species.js`/`moves.js` rigenerati.
- [x] Battipiedi: `MOSSE_PER_SPECIE` in `porta_pokedex.py` (Tifotto e Sciarpone → `STOMPING_TANTRUM`).
- [ ] **Da finire: rilanciare `porta_pokedex.py`** nel repo del gioco (il 21/11 è stato fermato a metà dal
      sistema per poca memoria, niente di generato è rimasto), rimettere le icone delle altre specie,
      push, ROM, tre prove. Finché non si fa, nel gioco le due mosse sono ancora come prima.
- Trovato per caso: `Wikascolemon/gioco/` non è allineata ai sorgenti della demo (mappe e allenatori
  cambiati senza rilanciare `build-gioco.mjs`), quindi `tests/build.test.mjs` fallisce. Non toccata.

*Le sei mosse che fanno solo danno.* Guardando le schede, tre non sono «senza effetto»: hanno righe
diverse da una scheda all'altra, o i numeri di un'altra mossa ufficiale.
| Mossa | Cosa dice la wiki | Proposta |
|---|---|---|
| Aeroattacco | Volante, fisico, 60, non manca mai, 20 PP (6 specie) | Sono i numeri di **Aeroassalto** (Aerial Ace, la MT40), uguali in tutto: ricondurla a quella e correggere il nome nelle schede. Aeroattacco ufficiale è un'altra mossa (140, due turni). |
| Battipiedi | Tifotto e Sciarpone: Terra, fisico, 75/100/10. Fatella e Ancella: Normale, fisico, 30/100/20 | Sono due mosse. Quella di Tifotto e Sciarpone è il **Battipiedi ufficiale** (Stomping Tantrum), uguale in tutto: ricondurla. Quella delle fate è un'altra: le serve un nome suo (resta solo danno). Oggi nel gioco tutte e quattro hanno la versione da 30. |
| Riduttore | Quattro righe diverse: Banconio 80/75/20 fisico; Soldatino stato 10 PP; Zurriò stato 100%/20 PP; Ciammarica Coleottero, stato, 95%/40 PP (i numeri di Millebave) | Da decidere scheda per scheda cosa volevano essere. Oggi nel gioco tutti hanno la versione di Banconio. Il Riduttore ufficiale è 90/85/20 col contraccolpo. |
| Flagello | Esclusiva di Moro: «la potenza aumenta quanto più l'avversario è lento di lui, fino a 150» | È la formula di **Energisfera** (Electro Ball): prendere quell'effetto, coi numeri della wiki (Acciaio, fisico, 100%, 10 PP). Si fa con una riga in `EFFETTI_DEL_MOTORE`. |
| Elettroraggio | Elettro, speciale, 60/100/20, nessuna descrizione (Faro, Repetito) | Lasciarla solo danno. L'ufficiale (130, due turni) non c'entra. |
| Marchiafuoco | Fuoco, fisico, 120/85/5, «potentissimo ma impreciso» (Bracignale) | Lasciarla solo danno: è quello che dice la scheda. |

*Le 32 righe «mosse da MT» (20 mosse diverse).* Nessuna è inventata da zero: quasi tutte sono mosse
ufficiali scritte con un nome che non è quello italiano.
| Nella wiki | È | Esito proposto |
|---|---|---|
| Raggioscuro (famiglia Soldatino) | **Geloraggio**, MT13, numeri uguali | Correggere il nome: la imparano subito |
| Assorbenergia (Vlurde) | **Gigassorbimento**, MT19, numeri uguali | Correggere il nome: la impara subito |
| Sole Cocente (Alghetta) | **Giornodisole**, MT11 (la wiki dice Normale, è Fuoco) | Correggere nome e tipo |
| Roccia Massiccia (Scoglieràx) | **Rocciotomba**, MT39 (wiki 50/95/10, ufficiale 60/95/15) | Correggere nome e numeri |
| Stoccata (Cocchia, Lu Pà) | 70/100/20 Normale: i numeri di **Facciata** (MT42) e di **Forzasegreta** (MT43) | Scegliere quale delle due |
| Bomba Acida (Totera) | **Acidobomba**, numeri uguali | Mossa del motore, ma non è una MT |
| Zanna di ghiaccio (Bracignale) | **Gelodenti**, numeri uguali | idem |
| Fuocodenti (Lupittə, Sibillupo) | **Rogodenti**, numeri uguali | idem |
| Eco Voce (Caciara, Trecaciare) | **Echeggiavoce**, numeri uguali | idem |
| Chiacchiera (Sciapezza, Saputezza) | **Schiamazzo**, numeri uguali | idem |
| Facciabuffa (Caciara) | **Visotruce**, numeri uguali | idem |
| Roccia tagliente (Bracignale) | **Pietrataglio** (wiki 10 PP, ufficiale 5) | idem, correggendo i PP |
| Palla Ferro (Sammarò) | 130/100/5 Acciaio: i numeri di **Ferrorullo** (che però fallisce senza un campo attivo) | Da decidere |
| Sfuriata (Mixaro) | Buio, speciale, 80/100/10: quasi **Neropulsar** (15 PP) | Da decidere |
| Sgambetto (Maranzino, Coperto) | Buio, fisico, 60/100/20: nessuna uguale (Furto, MT46, ha 25 PP e ruba) | Da decidere |
| Coraggio (Vecciandò) | Lotta, fisico, 70/100/20: nessuna uguale (Breccia, MT31, è 75/100/15) | Da decidere |
| Ognimossa (7 specie di vigna e orto) | Normale, fisico, 50/100/20: nessuna uguale | Da decidere |
| Facilotto (Totera) | Normale, stato, 20 PP: non si capisce cosa sia | Da decidere |
| Girospada (Retrabbiə) | Acciaio, stato, 15 PP: i PP di Ferroscudo e Sganciapesi | Da decidere |

Per le sei «mossa del motore, ma non è una MT» ci sono due strade: farne MT nostre (i posti da 53 a
100 sono vuoti) o toglierle dalla tabella MT delle schede. Raccomando la prima per Gelodenti e
Rogodenti (le hanno in tre), la seconda per le altre.

**Come provo io la ROM** (dal 20/11): `python tools/piceno/prova_base.py`, `prova_lotta.py`,
`prova_rilascio.py` nel repo del gioco, con l'emulatore senza finestra (`tools/piceno/emulatore.py`).
Tutto spiegato in `pokemon-piceno/tasks/manuale_sviluppo.md`.

**Provato in gioco da Jacopo (detto il 20/11): il lavoro del 17/11 e i rilasci del 18 e del 19/11**
- [x] La scena del treno (serve una partita nuova): scossa, annuncio, discesa, Bobby alla stazione.
- [x] Spinetoli e Centobuchi, e il blocco a Castel di Lama senza la Medaglia Spirito.
- [x] Le piante di cocchie: cogliere, ripiantare, i messaggi tradotti.
- [x] Gli interni coi mobili nuovi.
- [x] Zaotto e zaotta in lotta.
- [x] **Rilascio del 18/11** (commit `b449edd3d0` di `pokemon-piceno`): *(provato da Jacopo, detto il 20/11)* il capanno dell'Oasi con dentro il
      custode che dà il **Vaso Cavedì**; perdere dopo essersi curati al Bar Centrale di Castel di Lama
      (si deve riapparire lì davanti); tabacchi e pizzeria senza fessura.

- [x] **Rilascio del 19/11** (commit `6339a6ce80`), visto solo in anteprima: *(provato da Jacopo, detto il 20/11)*
      - la **Costa**: si entra da Spinetoli (est), lungomare, gradini, spiaggia, pontile, Ristoro al Porto
        (cura), i cinque allenatori, Ivo e Teo sulla sabbia, le tre cocchie di mare in fondo al lungomare;
      - la **corriera**: autista sul piazzale della stazione di Porta Maggiore, andata a Ripatransone e ritorno;
      - **Ripatransone**: piazza, bar (cura), chiesa, tre case, le vigne con Renzo sulla salita;
      - le **piante di cocchie** sul terreno giusto (Oasi accanto al capanno, Spinetoli sotto la provinciale,
        Costa, Ripatransone) e sparite da tutte le altre zone;
      - **Hills in lotta** con lo smartphone; i nomi degli strumenti in italiano nello zaino e ai tabacchi;
      - in una partita già cominciata le piante nuove possono risultare vuote o con la bacca vecchia finché
        non si ripiantano (lo stato sta nel salvataggio).

- [x] **Secondo rilascio del 19/11** (commit `f985a3753c`), dopo la prova di Jacopo. Da riprovare: *(provato da Jacopo, detto il 20/11)*
      - il **DJ** della Costa ora si vede (aveva uno sprite che esiste solo nel motore di Rosso Fuoco: era
        invisibile e bloccava il gioco; `porta_mappa.py` adesso si ferma se uno sprite non esiste);
      - **Castel di Lama**: senza medaglia Bobby ferma sulla strada per Spinetoli e non si aggira più
        dall'erba (le soglie erano una colonna troppo indietro); con la medaglia Bobby non c'è più;
      - le **piante di cocchie** coi colori giusti (prendevano le tavolozze di Oliver, Bobby, Steven ed
        Elena: `personaggi.py` metteva i nostri in testa alla tabella, ora in fondo);
      - la **Costa col mare a est**: provinciale da Spinetoli, lungomare nord-sud, spiaggia e pontile a est;
      - gli **interni dei tre capannoni** (Percorso 1, Spinetoli, Centobuchi) col contadino che regala
        Noci, Mandorle, Latte Mumu; la **chiesa di Maltignano**;
      - i **saltelli** a Maltignano: nei due varchi della salita si salta giù, in salita non si passa;
      - gli **strumenti a terra**: 14 Poké Ball in 13 zone (`tools/piceno/strumenti_mappa.json`).

- [x] **Terzo rilascio del 19/11** (commit `72b96e5adc`), da provare: *(provato da Jacopo, detto il 20/11)*
      - **Box**: le icone delle nostre 149 specie erano troppo grandi (30 pixel), ora stanno in 22 come le ufficiali;
      - **chalet**: i quattro stabilimenti della Costa hanno l'interno (`interno_chalet`), il barista vende
        Acqua Fresca, Gassosa e Lemonsucco;
      - **giorno e notte**: l'orologio resta, la tinta della mappa è spenta (`OW_ENABLE_DNS FALSE`; Jacopo:
        «non funziona ancora bene a livello visivo»).

- [x] **Quarto rilascio del 19/11** (commit `c2b2e46fd0`), da provare: *(provato da Jacopo, detto il 20/11)*
      - il **Jonathan**, a nord della Costa: il lungomare prosegue dritto, parcheggio, biglietteria, spiaggia;
      - **Nando** nel vialetto fra le siepi davanti alla discoteca (terza sfida);
      - la **discoteca-palestra**: i tre Bro della Security accanto ai varchi, Riccio in fondo, la
        **Medaglia Balneare**; lo chalet «Bagni Jonathan»;
      - nella Costa il DJ Mauri e il cartello del Jonathan ora sono in cima al lungomare.
      - le **figure in lotta dai fogli di Jacopo**: Hills con lo smartphone, il Bro della Security, il DJ, Riccio
        (`tools/piceno/ritaglia_figura.py`, sorgenti in `tools/piceno/fogli/sorgenti/`).
      Provvisori: gli sprite sulla mappa di Riccio, dei Bro e del DJ (di
      Smeraldo), la MT Idrogetto (non c'è lo strumento MT).

- [x] **Rilascio del 20/11** (commit `e79f49548b`), dopo la seconda prova di Jacopo *(provato da Jacopo il 20/11: tutto a posto)*:
      - **perdere una lotta** dopo essersi curati in un nostro bar (Costa, Ripatransone, Castel di Lama...): si
        deve riapparire davanti al bar, non in una mappa a caso. Causa: le tabelle della ripartenza del motore
        finiscono all'ultima voce con «respawn_npc», e le nostre stavano dopo. Era questo anche il blocco
        dopo il DJ del 19/11 (lo sprite sbagliato lo rendeva solo invisibile);
      - **arrivare a Porta Maggiore da nord**: chiesa e stazione devono vedersi bene. Gli edifici stanno ora ad
        almeno 7 celle da ogni lato collegato (prima 5 sopra e sotto) e `porta_mappa.py` avvisa;
      - i **capannoni** con balle di fieno, cassette, sacchi e botti; le due **palazzine della Costa** con l'interno;
      - il **bigliettaio** dentro la stazione: era coperto dal gabbiotto, ora sta accanto; l'autista sta di
        fianco alla corriera;
      - **Oliver di spalle in lotta** (dal foglio di Jacopo) al posto di Brendan. I quattro fotogrammi del
        lancio sono uguali: per l'animazione servono altri tre disegni. Sulla scheda allenatore e nel
        menu la figura di fronte è ancora quella di Brendan.

**Segnalato da Jacopo il 20/11 dopo la prova: corretto nella ROM del 20/11 sera (commit `ce44c4bfec`)**
- [x] **Niente esperienza se l'ultimo Pokémon dell'avversario cade per il veleno** (Zaotto Dino, Ciclista
      Renzo). Era del motore: a esito deciso la fine del turno saltava il passo che dà l'esperienza
      (`src/battle_end_turn.c`). Vale anche per scottatura e simili. Provato con l'emulatore: 135 → 198
      punti, come con un colpo normale.
- [x] **Riposo non funzionava**: era una mossa nostra (10 PP, la ufficiale ne ha 5) rimasta senza effetto.
      Ora ha l'effetto di Rest (`EFFETTI_DEL_MOTORE` in `porta_pokedex.py`). Provato con l'emulatore:
      «Basilino dorme e recupera i PS!», PS pieni.
- [ ] Da riprovare in gioco da Jacopo: le due correzioni qui sopra.
- [x] Le sette mosse nella stessa condizione di Riposo hanno ora l'effetto della ufficiale (Jacopo, 20/11):
      Baratto (Skill Swap), Cuordileone (Work Up), Fangata (Mud Sport), Fortuncanto (Lucky Chant), Precedenza
      (Me First), Rancore (Grudge), Schizzo (Sketch). I numeri restano quelli della wiki. Provata con
      l'emulatore solo Cuordileone (alza Attacco e Att. Sp.).
- [ ] Restano senza l'effetto speciale, da guardare una per una con Jacopo: Aeroattacco, Elettroraggio,
      Flagello, Marchiafuoco, Riduttore, Battipiedi (fanno solo danno). E le 83 mosse nuove senza effetto.

**Rilascio del 21/11 (commit `b7fb2f9792` di `pokemon-piceno`), da provare da Jacopo**
- [ ] Le sette mosse qui sopra, in lotta.
- [x] **«Fuga» di Tifotto è Fugafacile** (`ABILITY_RUN_AWAY`): fatto in `porta_pokedex.py`. Da provare: Tifotto
      scappa sempre dai selvatici.
- [ ] **MT51 Velenospina** da Hills e **MT52 Idrogetto** da Riccio, appena battuti; chi ha già la medaglia
      la riceve riparlandogli. Le due battute («Tè, pìjate pure questa. Dentro ce sta...») sono mie: da
      rileggere. NON provato con l'emulatore il momento della consegna.
- [x] **Mosse da MT per specie**: dalla tabella «Tramite MT/DT» di ogni scheda della wiki. Valgono solo
      quelle che sono una MT del gioco (le 50 di Smeraldo più le nostre due). Velenospina va anche a tre
      Pokémon di tipo Veleno scelti a caso (Spesurde, Mucillax, Sparpagghjò), oltre a chi la impara per
      livello (Peccio, Peccionara, Pozza) e a Vecciando che la ha nella wiki. Idrogetto: solo chi la impara
      per livello (Tuffito, Brasero, Compadrone, Cavedì, Cavedone). Letto dalla ROM con l'emulatore.
- [ ] 32 mosse delle tabelle MT della wiki non esistono nel gioco (Raggioscuro, Sgambetto, Ognimossa,
      Fuocodenti, Stoccata, Chiacchiera...): elenco in `tools/piceno/rapporto.txt`, «mosse da MT».
- [x] **Fogli di grafica** (21/11): Jacopo ha fatto i dodici fogli coi prompt di
      `schede _Pokemon/tasks/prompt_grafica/`; ritagliati da `tools/piceno/ritaglia_fogli.py` e montati
      (ROM del commit `9557a0e7a6`):
      - Oliver di spalle coi quattro fotogrammi del lancio, Oliver di fronte al posto di Brendan (scheda
        allenatore e menu);
      - otto figure in lotta: contadino, zaotto, zaotta, ascolano, ciclista, bagnino, turista, pescatore;
      - Riccio, Bro della Security e DJ sulla mappa (prima erano personaggi di Smeraldo);
      - le 17 icone delle cocchie nello zaino e la pianta di cocchie (una per tutte: alberello, fiorita,
        coi frutti; terra e germoglio restano quelli di Smeraldo);
      - sprite fronte e retro di Basilino, Puledrotto, Tuffito, Tifotto (e le loro icone).
      Visto in gioco con l'emulatore: Oliver che lancia, Basilino di spalle, Puledrotto, i Bro in palestra,
      il DJ sulla Costa, le piante all'Oasi, la Mandorla nello zaino (`emulatore/foto/grafica_in_gioco.png`).
      **Da guardare da Jacopo**: la scheda allenatore, le otto figure in lotta, Riccio, Tuffito e Tifotto;
      i personaggi dai fogli sono più magri di quelli di Smeraldo.
- [ ] Grafica ancora da fare: sprite degli altri Pokémon, la figura della turista donna (usa ancora la
      Pokéfan di Smeraldo), terreno/alberi/acqua.
- [ ] `prova_lotta.py` è fallita una volta su cinque il 21/11 senza motivo trovato (il controllo
      dell'esperienza dopo un colpo normale): da tenere d'occhio.

**Secondo rilascio del 21/11 (commit `bb77b297cc` di `pokemon-piceno`), da provare da Jacopo**
- [x] **La mappa della città nel gioco** (chiesto da Jacopo il 21/11): è la **Mappa Città** (`ITEM_TOWN_MAP`,
      c'era già nel motore), fra gli strumenti base; apre la cartina del Piceno col punto dove si è. La
      dà il **capotreno** sul treno all'arrivo (partita nuova) e il **bigliettaio** in stazione a chi ha
      già una partita (`FLAG_UNUSED_0x02A`). Tradotti «OLIVER guarda da vicino la mappa del PICENO» e
      l'etichetta PICENO (era HOENN, anche nel Pokédex). Visto con l'emulatore. Le battute di capotreno
      e bigliettaio sono mie. Sulla cartina la testina è ancora quella di Brendan.
- [x] **Idrogetto da MT** anche alle famiglie di Soldatino (Batterino, Dehor) e di Bagnetto (Coperto, Mixaro),
      scelte da me su richiesta di Jacopo. Letto dalla ROM.
- [x] **Sprite fronte e retro di altri dodici Pokémon** dai fogli di Jacopo (prompt in
      `schede _Pokemon/tasks/prompt_grafica_2/`): Banconio, Zanzì, Zanzarax, Pef'na, Tamburino, Anicino,
      Pito, Ciucì, Sorcì, Cavedì, Soldatino, Totera, con le loro icone. Con quelli del primo giro sono 16
      su 149. Visti solo in anteprima, non in lotta.

**Documentazione (20/11)**
- [x] Presentazione rifatta: `Presentazione Pokemon Piceno - 20 novembre.pdf` nella radice di Wikascolemon;
      si rigenera con `python tools/piceno/presentazione.py` nel repo del gioco e si stampa con Edge.
- [x] Guida al gioco con la tabella degli incontri: `Guida a Pokemon Piceno.pdf` (radice di Wikascolemon),
      scritta dai dati del gioco da `tools/piceno/documenta.py`.
- [x] Manuale per chi ci lavora: `pokemon-piceno/tasks/manuale_sviluppo.md`.
- [x] Provare il gioco da qui (20/11): `python tools/piceno/emulatore.py` nel repo del gioco, il motore di
      mGBA in versione libretro pilotato da Python (tasti, attese, schermate, stati; istruzioni nel manuale).
      La compilazione consegna anche `pokeemerald.sym` (da copiare su `pokemon-piceno.sym`): con quello
      l'emulatore legge dalla memoria mappa, casella, squadra.
- [x] Prova di base (20/11): `python tools/piceno/prova_base.py`, 3 secondi. Partita nuova, scena del treno,
      discesa a Porta Maggiore, saluto di Bobby, starter, lotta con Nando fino in fondo. Sulla ROM del 20/11
      passa. Premendo solo A la lotta si perde, e si riappare davanti al bar di Porta Maggiore.
- [x] Prove del rilascio del 20/11 con l'emulatore (`python tools/piceno/prova_rilascio.py`, 35 secondi),
      **tutte passate**: persa una lotta si riappare davanti a chi ha curato in tutte e nove le zone
      (Monticelli con l'ospedale, Campo Parignano, Maltignano, Castel di Lama, Spinetoli, Costa, Porta
      Maggiore, Centro Storico, Ripatransone); il bigliettaio in stazione si raggiunge e risponde; la
      corriera va a Ripatransone e torna. Restano a Jacopo, a occhio: Porta Maggiore da nord, capannoni e
      palazzine, Oliver di spalle. Non provato: il bar di Monticelli.
- [x] I salvataggi vecchi si rompono a ogni ROM nuova (scoperto il 20/11): quello di Jacopo del 19/11,
      fatto a Marino del Tronto, con la ROM del 20/11 mostra la mappa a pezzi e si cammina attraverso i
      muri. La partita ricorda il numero della pianta e l'ordine in `layouts.json` cambia a ogni
      generazione. **Jacopo (20/11): non tenere fermo l'ordine, resta così.**

**Fogli**
- [x] Hills, Bro della Security, DJ e Riccio in lotta: arrivati il 19/11 e montati.
- [x] Icone delle cocchie: per ora non serve un'immagine apposta (Jacopo, 19/11).

**Chiesto da Jacopo il 19/11 sera e ancora aperto**
- [ ] Altri strumenti in mappa e altri personaggi che ne regalano: i primi sono messi a giudizio mio.
- [x] Regola della ripartenza: si riparte dall'ultimo posto che ha curato (è già così).

**Decisioni che aspettano Jacopo**
- [ ] Approvare la proposta di Giulio sulle 120 abilità (`pokemon-piceno/tasks/abilita_proposte.md`, 5 decisioni aperte).
- [x] Abbinamento cocchia → effetto: va bene così (Jacopo, 18/11).
- [x] Il nome dell'annaffiatoio: **Vaso Cavedì** confermato «per ora» (Jacopo, 19/11). L'icona è ancora quella di Wailmer.
- [x] «CAMPEGGIAT.» è diventato **«ASCOLANO»** (Jacopo, 18/11): la classe di Gino (Monticelli) e Marco (Oasi).
- [x] Le altre classi degli allenatori: per ora non si rinominano (Jacopo, 19/11). Con la Costa sono entrate
      tre classi nuove, tradotte come nella demo: BAGNINO, TURISTA, DJ.
- [ ] Togliere Hoenn (passo 6): **analisi fatta il 19/11, `tasks/analisi_hoenn.pdf`**. Proposta: non toglierla
      adesso (5,8 MB liberi su 32, 635 riferimenti di script da sistemare, aggiornamenti del motore più
      difficili per sempre); sistemare Vola, la ripartenza di riserva e un secondo gruppo di mappe (il
      nostro è a 66 su 127). **Aspetta la decisione di Jacopo.**

**Piccole cose lasciate aperte**
- [x] MT Velenospina (fatto il 21/11, vedi sopra). Prima: Hills non la dà. Non basta aggiungere lo strumento: nessuna delle nostre specie ha
      l'elenco delle mosse da MT (in `piceno_families.h` non c'è), quindi non la imparerebbe nessuno.
      Va con il lavoro sul motore di lotta (Giulio).
- [x] Punto di ripartenza a Castel di Lama (18/11): chi cura fissa il punto della sua zona, se la zona ha
      «ritorno» in `mappe/<id>.json`. Ce l'hanno tutte le zone con un bar o l'ospedale (commit `d993275df6`).
- [x] L'annaffiatoio lo dà il custode nel capanno dell'Oasi (18/11; stanza `interno_capanno` in
      `stanze.json`, script in `mappe/Oasi_Capanno.inc`, battute mie in italiano).
- [x] «CAMPEGGIAT.» è diventato «ASCOLANO»; le gemelle restano «NICE-DICE» per ora (Jacopo, 18/11).
- [ ] Le righe tradotte più lunghe dell'originale, da guardare a schermo (`python tools/piceno/traduci.py --avvisi`).
- [x] Fessure di cassa e bancone delle pizze chiuse (18/11: ora sono larghi 32 pixel).
- [x] Tappeto davanti al divano nelle case (18/11 sera, con «_cambi» in `stanze.json`).
- [x] Battute scritte da me (treno, capotreno, cartelli, medaglia): vanno bene (Jacopo, 18/11).

**Chiesto da Jacopo il 18/11**
- [x] **Box nei bar** (18/11 sera, commit `ae88d34874`): in ogni bar c'è una **slot** (idea di Jacopo), disegnata
      da me in `mobili.py` «per ora»; le si parla da sotto e apre il deposito di Smeraldo. Messaggio adattato
      («infila una moneta nella slot»). In `stanze.json`: «_arredi» = mobili che la demo non ha, «_cambi» =
      ritocchi alle stanze della demo. **Da provare in gioco**: depositare e ritirare, e uscire dal deposito.
- [x] **Hills in lotta** (19/11): «un tizio che sbraita davanti a uno smartphone» (Jacopo). È il rocker di
      Rosso Fuoco ritoccato in `figure.py`: via fulmini e cavi, telefono in mano, capelli viola. Resta una
      figura ufficiale ritoccata: per una disegnata da zero serve un foglio di Jacopo.
- [ ] **Rifare un po' di sprite dei Pokémon dell'inizio** (quelli che si incontrano fino alla prima medaglia).
      Da decidere quali e come (fogli di Jacopo in ChatGPT, poi li ritaglio io).

**Grafica**
- [x] Piante di cocchie che «si vedono male» (Jacopo, 19/11): il terreno soffice era un blocco che nei nostri
      set non c'è, sotto la pianta usciva un pezzo di edificio. Corretto (`edifici.py` ne mette una copia in
      ogni set). Ora sono **poche e in campagna**: le dice la pianta della zona («cocchie»), 11 in tutto
      (Oasi 3, Spinetoli 3, Costa 3 di mare, Ripatransone 2). Il Riccio di mare aspetta il Jonathan.
- [ ] Le piante e le icone delle cocchie hanno ancora il disegno delle bacche di Hoenn (la noce cresce sulla
      pianta della Baccarancia).
- [ ] Figure in lotta degli altri allenatori. Il contadino usa la figura dell'escursionista di Hoenn: nel file
      il cappello è color sabbia e il gilet verde, e cappello, zaino e pantaloni hanno le stesse tinte. Da
      capire con Jacopo cosa cambiare (18/11: non toccato).
- [ ] Terreno, alberi e acqua sono di Hoenn; edifici dipinti da codice. Fogli di Jacopo in ChatGPT quando vuole.

**Traduzione**
- [x] Strumenti in italiano, secondo giro (21/11, commit `1b5fb2a8fc` e seguente): **794 più le 17 cocchie su 872**.
      Entrati megapietre, cristalli Z, le bacche che non sono cocchie, posta, strumenti chiave di Hoenn e
      Kanto, ottava e nona generazione, e le MT/MN (ora «MT01»... «MN08», come le chiama il menu). Nomi
      ufficiali da PokeAPI (`item_names.csv`) e dalla Pokémon Central Wiki; descrizioni mie. Restano in
      inglese 14 strumenti di cui non ho trovato il nome ufficiale (Berserk Gene, Fresh-Start Mochi,
      Jubilife Muffin, i tre Remedy, i quattro Aux, Choice Dumpling, Swap Snack, Twice-Spiced Radish,
      Pokéshi Doll) e le MT vuote 53-100. «Portacocchie» (il Berry Pouch) confermato da Jacopo il 21/11.
- [x] Primo giro: **326 su circa 870** al 19/11 (tutte le Ball, cure, vitamine, strumenti X, pietre
      e strumenti evolutivi, quasi tutti quelli da tenere, fossili, oggetti di valore, canne e bici). Fuori:
      megapietre e cristalli Z, strumenti di ottava e nona generazione dal nome incerto, quelli della trama
      di Hoenn, la posta. Da rileggere: «Attacco Sp. X»/«Difesa Sp. X» e il Condividi Esp. (descritto come
      strumento da tenere, com'è configurato ora). I primi 27 (Ball, pozioni, cure di stato,
      eteri, repellenti, Fune di Fuga, Caramella Rara, Vaso Cavedì) con `tools/piceno/strumenti.py` (commit
      `96a28d6a9d`), che riscrive la voce intera: nome, plurale, descrizione. Gli altri ~850 restano in inglese e
      si aggiungono alla tabella man mano che entrano nel gioco. **Non usare `traduci.py` per le descrizioni**:
      sostituisce una riga ovunque compaia (la Poké Ball era rimasta «Per annaffiare / catching wild»).
- [ ] Testi delle mappe di Hoenn.
- [x] Prefissi in lotta «Nemico X» / «Selvatico X» senza articolo: Jacopo il 18/11 ha detto di lasciarli così.
- [ ] Dialetto: rilettura di un parlante sul foglio di Giulio (`pokemon-piceno/tasks/battute_da_rileggere.md`).

**Motore di lotta (lo sta seguendo Giulio)**
- [x] **«Fuga» di Tifotto = Fugafacile** (Jacopo, 20/11; fatto il 21/11): l'abilità è analoga a quella dei giochi esistenti
      (Run Away, `ABILITY_RUN_AWAY`), quindi va ricondotta a quella e non creata nuova. Da riportare nella
      tabella degli alias di `porta_pokedex.py` e nella proposta di Giulio (`pokemon-piceno/tasks/abilita_proposte.md`).
- [ ] Le 120 abilità senza effetto, le ~85 mosse con effetti particolari, le evoluzioni rimaste fuori, Iperfuria.
- [ ] Le mosse scelte a mano nella demo non sono portate: è **un solo allenatore** (Renzo il ciclista a Borgo
      Chiaro, Puledrotto con Azione e Braciere). Bilanciamento mai guardato.

**Zone ancora da portare**
- [x] Costa e Ripatransone con la corriera (19/11). Costa 60×60 (rifatta la sera col mare a est), set
      `piceno_costa`, carta delle zone 380,−11, cartina 19,7; Ripatransone 50×38, set `piceno_ripa`, cartina 18,5, non confina con niente.
- [x] Jonathan e la seconda palestra (19/11): a NORD della Costa (Jacopo), 60×40, set `piceno_jonathan`,
      carta delle zone 380,−51, cartina 19,6. A nord del Jonathan il lungomare per ora finisce.

---


**La ROM è una sola:** `pokemon-piceno.gba` nella cartella del repo `pokemon-piceno` (ignorata da git).
Si aggiorna sempre quel file; se mGBA lo tiene aperto non si può sovrascrivere, quindi va chiuso prima.
Le porte si aprono (provato da Jacopo il 17/11).

**Fatto il 17/11 pomeriggio (commit `33fe494659` e `af4e913216` di `pokemon-piceno`) — DA PROVARE in gioco**
Jacopo ha chiesto i passi 4 e 5, Spinetoli e Centobuchi, zaotto/zaotta e le cocchie (messe «un po' in
giro, possibilmente ai bordi delle aree»). Il passo 6 (togliere Hoenn) vuole prima un'analisi a parte.
- **Passo 4, la scena del treno.** La partita nuova comincia nel vagone (`PortaMaggiore_Treno`, una
  «stanza in più» della pianta): il vagone trema, il treno frena, l'altoparlante annuncia Ascoli, si
  scende dalla porta e si esce davanti alla stazione, dove Bobby viene incontro col saluto della demo
  e poi aspetta al bar. `VAR_UNUSED_0x404E` conta i passi (0 in treno, 1 sceso, 2 salutato);
  `FLAG_UNUSED_0x022` nasconde il Bobby della stazione. I suoni sono quelli del camion di Smeraldo.
  **Si vede solo con una partita nuova.** Battute mie da rivedere: l'annuncio («Dlin dlon! Stazione di
  ASCOLI PICENO. Fine della corsa. Si prega di scendere.») e il capotreno.
- **Passo 5, interni.** I 44 mobili sono ridisegnati in codice col kit (`tools/piceno/mobili.py`),
  alla stessa misura dei ritagli della demo; le piante sono verdi. Tutti usano le stesse 15 tinte: le
  stanze sono a filo dei 15 colori, aggiungere una tinta vuol dire toglierne un'altra. Sbavature
  note: 1 pixel di fessura fra cassa e bancone ai tabacchi e fra i due banconi della pizzeria; il
  tappeto dietro il divano si legge male.
- **Spinetoli e Centobuchi** (60×40, set `piceno_campagna` più il bar): la provinciale con la rotonda,
  Bar dello Sport e due case coloniche con interno, due capannoni, i campi. Quattro allenatori sulle
  strade bianche (Learco, Dante, Renzo, le gemelle «NICE-DICE»: il motore regge 10 lettere). Da
  Castel di Lama **non si passa senza la Medaglia Spirito**. A est la strada per la Costa è chiusa.
  Carta delle zone: 320,0. Cartina: casella 18,7 («SPINETOLI»).
- **Zaotto e zaotta**: fatto (`classi.txt` e `src/battle_main.c`).
- **Cocchie**: fatto. `tools/piceno/cocchie.py` rinomina 17 bacche (nome, plurale, descrizione) e ne
  tiene l'effetto. L'abbinamento l'ho scelto io, **da rivedere**: Noce = Baccarancia (10 PS),
  Castagna = Baccacedro (PS), Pistacchio = paralisi, Nocciola = sonno, Mandorla = veleno,
  Cocco = scottatura, Ghianda = gelo, Pinolo = PP, Lupino = confusione, Uovo = tutti gli stati,
  Granchio = Attacco, Cozza = Difesa, Lumaca = Velocità, Riccio di mare = Att. Sp., Vongola = Dif. Sp.,
  Bruscolino = brutti colpi, Arachide = una statistica a caso. «Bacca/Bacche» è «Cocchia/Cocchie»
  in menu e lotta. In giro: due o tre per zona (27 in tutto), ai bordi, sull'erba.
  **Si colgono dalle PIANTE, come le bacche di Smeraldo** (chiesto da Jacopo il 17/11 sera, commit
  `eb24b09c89`, ROM delle 19:17): terreno soffice, crescono, si colgono, si ripiantano, si annaffiano.
  I numeri degli alberi sono presi in prestito da quelli di Hoenn (dove si può, uno che in Hoenn ha
  la stessa bacca); posto e albero stanno in `tools/piceno/cocchie.json`, e cosa c'è piantato in una
  partita nuova lo scrive `cocchie.py` in `data/scripts/new_game.inc`. Messaggi delle piante
  tradotti (`traduzione/alberi.txt`). Per ora solo quelle «di terra»: granchio, cozza, vongola e
  riccio aspettano la Costa.
  Da fare o da guardare: **la pianta e l'icona sono ancora quelle della bacca di Hoenn** (la noce
  cresce sulla pianta della Baccarancia); in una partita cominciata prima di oggi quattro piante
  (le due «Uovo» e due «Castagna») hanno ancora la bacca di Hoenn finché non si ripiantano; nessuno
  dà ancora il Vaso Wailmer; le altre bacche restano nel motore ma non si trovano.
- **Numeri degli allenatori** (correzione, Jacopo aveva ragione): nel motore gli allenatori di Hoenn
  sono 855. `allenatori.py` prende in prestito solo le 53 reclute (27 usate): finite quelle basta
  allargare l'elenco. Togliere Hoenn non serve per questo.

**Fatto il 17/11 mattina (commit `2e5c76e9a7` di `pokemon-piceno`) — giocato da Jacopo fino alla medaglia: «stupendo», le scritte stanno nella finestra**
- **Passo 1, strada fino alla prima palestra.** Maltignano (50×44, set `piceno_campo`): si entra
  dall'Oasi in basso a ovest, tornanti fino al paese in cima (chiesa, Bar della Salita con interno),
  discesa a est; fra i tornanti alberi, con due varchi d'erba alta per tagliare. Allenatori Renzo,
  Dino, Osvaldo; **Nando** aspetta sulla discesa (tre celle della strada lo fanno partire, battuto se
  ne va: `FLAG_UNUSED_0x021`). Castel di Lama (60×46, set nuovo `piceno_lama`): piazza della Fontana,
  Bar Centrale, tabacchi, quattro case con interno, campo sportivo, e il **Free Spirit**. A est la
  strada per Spinetoli finisce contro gli alberi. Interno della palestra (`interno_palestra`, scritto
  da noi in `tools/piceno/mappe/stanze.json`): i banconi dell'ex bar fanno il percorso, Cencio e
  Miriam ai due varchi, **Hills** in fondo dà la Medaglia Spirito (`FLAG_BADGE01_GET`).
  Carta delle zone: Maltignano 210,−12 · Castel di Lama 260,−6. Cartina: caselle 16,7 e 17,7.
- **Passo 2, sprite.** Bobby: il grembiule parte dalla vita, fra barba e grembiule resta la maglia.
  Nando e Hills hanno sprite propri (basi `boy_3` e `psychic_m`) e **figura in lotta propria**:
  `tools/piceno/figure.py` ricolora una figura ufficiale (Nando da `cooltrainer_m`, Hills da
  `guitarist`, il pescatore in giallo). Le altre figure in lotta restano quelle di Hoenn.
- **Passo 3, italiano.** `tools/piceno/traduci.py` applica ai sorgenti le coppie di
  `tools/piceno/traduzione/*.txt` (2.147 stringhe: menu, lotta, zaino, squadra, salvataggio, cura,
  Pokédex, nature, tipi, classi). Rilanciabile dopo un aggiornamento dell'expansion: dice cosa non
  trova più. Classi: RAGAZZINO, RAGAZZINA, PESCATORE, BIRDWATCHER, CAMPEGGIAT. (il motore regge 12
  lettere), CONTADINO, CICLISTA, GEMELLE, CAPOPALESTRA, RIVALE (quest'ultima scritta a mano in
  `src/battle_main.c`).
- **T dei tabacchi** rifatta sulla foto di Jacopo: cartello verticale blu col bordo chiaro, T larga,
  riquadro del numero di rivendita, le tre righe di scritta come tratti.

**Rimasto fuori o da rivedere (17/11)**
- La **MT Velenospina** che l'assistente della palestra dà nella demo: la mossa c'è, lo strumento MT no.
- Dopo una sconfitta si riparte sempre da Porta Maggiore: Castel di Lama non ha ancora il suo punto.
- Traduzione: **non tradotti** nomi e descrizioni degli strumenti, i testi delle mappe di Hoenn, il
  discorso di Birch (saltato). Prefissi in lotta: «Nemico X» / «Selvatico X» senza articolo (il
  motore mette il prefisso prima del nome). 26 righe sono più lunghe dell'originale e vanno guardate
  a schermo (`python tools/piceno/traduci.py --avvisi`): «NUOVA PARTITA», «STRUMENTI», il messaggio
  di salvataggio. Scelte dei traduttori da confermare: BIMBO/BIMBA per la scelta del sesso, «Liv.»,
  WALLY → LINO, virgolette tolte.
- Battute nuove scritte da me: «NANDO: Che guardi? Passa, passa...», «HILLS: La medaglia ce l'hai.
  Mo' vedi d'usalla bene.», il messaggio della medaglia, il cartello «Spinetoli - strada chiusa».
- Le figure in lotta del contadino e degli altri sono ancora quelle di Hoenn (il contadino in lotta
  ha il cappello verde, sulla mappa di paglia).
- «CAMPEGGIAT.» è abbreviato perché il motore regge 12 lettere per il nome di una classe
  (`u8 name[13]` in `include/data.h`): o si allarga il campo, o si sceglie un nome più corto.
- La sala della palestra è 15×14, più piccola di quella della demo (24×20).
- Nell'insegna dei tabacchi le tre righe di scritta sono tratti bianchi: a quella misura le lettere non ci stanno.
- Niente di tutto il lavoro del 17/11 è stato provato in gioco da me: solo anteprime e compilazione.
  Jacopo, il 17/11, a ROM ricevuta: «semplicemente stupendo».

**Chiesto da Jacopo il 17/11: cambiare i nomi delle classi degli allenatori (zaotto e zaotta FATTI nel pomeriggio)**
- bullo/ragazzino diventa **«ZAOTTO»**, ragazzina diventa **«ZAOTTA»**. Oggi sono RAGAZZINO e RAGAZZINA:
  si cambiano in `tools/piceno/traduzione/classi.txt` (righe YOUNGSTER e LASS) e si rilancia
  `python tools/piceno/traduci.py`; attenzione che lo strumento cerca l'originale inglese, quindi nel
  sorgente (`src/battle_main.c`) va prima rimesso YOUNGSTER/LASS o cambiato a mano.
  Jacopo ha parlato di «tipologia personaggi»: probabile che voglia rivedere anche le altre classi.

**Deciso da Jacopo il 17/11: la musica di Hoenn resta.** «Togliere Hoenn» (passo 6) vuol dire mappe,
allenatori e schermata di Vola, non le musiche: quelle si tengono e si riusano nelle nostre zone.

**Chiesto da Jacopo il 17/11: le bacche diventano «COCCHIE» (FATTO nel pomeriggio, vedi in cima)**
- «Cocchia» è una parola nostra: il guscio, la buccia. Nel gioco le bacche si chiamano cocchie e
  sono al massimo una quindicina (oggi il motore ne ha una settantina).
- L'elenco da cui prenderle è il preset «Cocchie» di TierForge (https://g95g95.github.io/tierforge/,
  39 voci: frutta secca, frutta con la buccia, «il resto»), **tolte quelle esotiche**.
- **Scelte da Jacopo il 17/11 (10):** Noce, Nocciola, Mandorla, Pinolo, Castagna, Pistacchio,
  Arachide, Uovo, Granchio, Cocco. Il criterio è il **guscio duro**, non la buccia: per questo la
  mia prima proposta con la frutta (arance, mele, meloni) è caduta, e ci stanno anche cose che non
  sono frutti (uovo, granchio).
- **Aggiunte da Jacopo il 17/11 (7):** Lumaca, Cozza, Vongola, Riccio di mare, Bruscolino, Lupino,
  Ghianda. **L'elenco è chiuso a 17** («vanno bene»). Restano fuori, fra le mie idee: Pigna, Fava,
  Carruba, Tartaruga.
- Le cocchie **prendono gli effetti delle bacche** (detto da Jacopo): non sono strumenti nuovi, ogni
  cocchia sostituisce una bacca e ne eredita l'effetto.
- Da decidere quando si fa: quale bacca va a quale cocchia (17 effetti da scegliere fra una
  settantina: cura dei PS, degli stati, dei PP...) e cosa succede alle bacche che restano fuori.

**Difetto pagato il 16/11:** dopo aver ridipinto gli edifici nessuna porta si apriva (i muri avevano
un pixel trasparente ai lati e `edifici.py` prendeva gli edifici per arredi). Ora `edifici.py` si
ferma se la porta di un edificio non è una soglia. Controllare che una porta sia raggiungibile non
basta: va controllato anche il comportamento del blocco.

**Prossimi passi, nell'ordine proposto a Jacopo il 16/11 (1-3 fatti il 17/11, gli altri non ancora scelti)**
4. e 5. fatti il 17/11 pomeriggio (scena del treno, interni).
6. Togliere Hoenn: schermata di Vola, mappe e allenatori di Hoenn. **Prima serve un'analisi più
   approfondita** (detto da Jacopo il 17/11); la musica resta.
7. Le cose messe da parte: Iperfuria, le 120 abilità senza effetto, le 38 mosse con numeri diversi
   dalle ufficiali, le ~85 mosse con effetti particolari, le 17 evoluzioni speciali lasciate fuori.
8. Le altre zone della demo: Costa, Jonathan, Ripatransone (Spinetoli e Centobuchi fatta il 17/11).

**In una giornata si è passati dalla demo nel browser alla ROM hack vera.** Decisione di Jacopo del
16/11: si lavora direttamente sul motore (`pokeemerald-expansion`); alla demo non si aggiungono più
funzioni, resta come banco di prova e come sorgente dei dati.

**Dove sta tutto**
- Repository privato: https://github.com/JacopoCiccoianni/pokemon-piceno (ramo `master`; Giulio,
  `g95g95`, invitato il 16/11 con permesso di scrittura: deve ancora accettare).
- Copia locale: `C:\Users\39329\Coding\pokemon-piceno` (remoto `upstream` = expansion, `origin` = il nostro).
- ROM dell'ultima compilazione: `C:\Users\39329\Coding\pokemon-piceno\pokeemerald.gba` (ignorata da git).
- mGBA 0.10.5: `C:\Program Files\mGBA\mGBA.exe`. Tasti: frecce, X = A, Z = B, Invio = Start.
- Porymap 6.3.1: `%LOCALAPPDATA%\Programs\porymap\porymap.exe` (mappa nel gruppo `gMapGroup_Piceno`).
- Strumenti nostri, tutti in `tools/piceno/` del repo: `porta_pokedex.py` (specie, mosse, abilità),
  `hoenn_provvisoria.py` (selvatici e rivale in Hoenn), `edifici.py` (scrive il set di tessere
  nostro, `gTileset_Piceno`: edifici e arredi), `porta_mappa.py` (mappa dalla demo, o dalla pianta
  disegnata a mano in `mappe/<id>_pianta.json`), `disegna_mappa.py` (mappa → PNG), `rapporto.txt`
  (tutto ciò che resta provvisorio nel Pokédex).

**Come si lavora:** modifica in locale, push, GitHub Actions compila (6-9 minuti), si scarica la ROM
con `gh run download <id> -R JacopoCiccoianni/pokemon-piceno -n pokemon-piceno -D .` e si apre in mGBA.
Sul motore si lavora davvero: è il sorgente C del gioco (Terrasanta è codice di lotta nuovo).
Intoppi già pagati: `gh auth refresh` va lanciato in una finestra PowerShell vera con `-h github.com`;
su un repository nuovo Actions va acceso a mano dalla scheda Actions; in quella cartella `gh` senza
`-R` punta all'expansion; il codice C sbagliato si scopre solo a compilazione finita.

**Cosa c'è nella ROM adesso**
- Le 149 specie del Pokédex del Piceno, con 288 mosse nostre e 120 abilità nostre (solo di nome).
- Partita nuova **senza il discorso di Birch** (`PICENO_SALTA_PRESENTAZIONE` in `src/main_menu.c`: è
  l'aggancio per la scena iniziale nostra). Il filmato prima del titolo resta: a Jacopo va bene.
- Si arriva alla **stazione di Porta Maggiore** (52×38) come **Oliver**, con lo sprite della demo
  rimpicciolito alla misura di Smeraldo (16×32), come tutti gli altri personaggi nostri.
  Bobby, Steven ed Elena davanti al bar con i loro sprite; Steven ed Elena spariscono avuto lo starter.
- **Senza Pokémon** l'erba alta non fa uscire niente e le uscite del quartiere rimandano da Bobby.
- **Sette zone collegate: tutta Ascoli città.** Oltre alle quattro qui sotto: **Campo Parignano**
  (58×40, a nord del Centro oltre il Tronto: Happy Coffee, cinema Odeon, chiesa del Sacro Cuore,
  Sant'Emidio alle Grotte), **Borgo Solestà** (50×50, a ovest: le case, l'area sportiva, i due ponti),
  **Porta Cartara** (50×36, a sud: la porta, il Rio Castellano).
- Le prime quattro, disegnate a mano guardando i luoghi veri: Porta Maggiore al centro,
  Centro Storico (52×46) a ovest oltre il ponte, **Monticelli** (52×34) a est con l'ospedale Mazzoni,
  il Little Bar, la pizzeria Mosè e il benzinaio, **Borgo Chiaro** (48×34) a nord con lo stadio Del Duca. Centro Storico: piazza del Popolo col Palazzo dei Capitani e il bar Callare, Teatro
  Ventidio Basso, piazza Arringo con Cattedrale, Battistero e fontane.
- **Interni veri con le porte**: le stanze arredate della demo. Porta Maggiore: stazione, chiesa, bar
  (la barista cura), tabacchi (vende), cinque case. Centro Storico: palazzo, bar, cattedrale, tre case.
  Monticelli: ospedale (l'infermiera cura), emporio del benzinaio, pizzeria, bar, due case.
- **Nove set di tessere nostri**: per gli esterni `piceno` (Porta Maggiore), `piceno_centro`,
  `piceno_monticelli`, `piceno_borgo`, `piceno_campo`, `piceno_borghi` (Solestà e Cartara); per gli interni `piceno_interni`, `piceno_case`, `piceno_servizi`. Il terreno (erba, strade, alberi, acqua) è ancora quello di Hoenn.
- La chiesa di piazza Immacolata è ridisegnata dalla foto di Jacopo (facciata chiara a pilastri,
  tiburio ottagonale); la stazione dalle foto di Wikimedia.
- **Alberi composti come in Hoenn**: bordi, base e la punta nella cella sopra, calpestabile (prima
  le punte erano tagliate). Sopra le strade la punta è un blocco nostro, solo lontano dai bordi.
- Hoenn è ancora tutta dentro, ma non ci si arriva.

**Come si rigenera tutto** (dalla cartella `tools/piceno` del repo `pokemon-piceno`, in quest'ordine):
`python edifici.py` → `python personaggi.py` → `python figure.py` → `python allenatori.py` →
`python cartina.py` → `python traduci.py` (dalla radice: `python tools/piceno/traduci.py`) → per ogni zona
`python porta_mappa.py <id> <Nome> "<TITOLO>" --rifai` e `python interni.py <id>`.
Le piante stanno in `mappe/<id>_pianta.json`, gli eventi scritti a mano in `mappe/<id>.json` e `.inc`.
**`--rifai` butta le modifiche fatte a mano in Porymap**: finora non ce ne sono.

**Regola dei confini** (pagata il 16/11): il gioco disegna il lembo della mappa vicina con le tessere
della mappa in cui si è. Edifici e arredi (che stanno nel set della zona) vanno tenuti ad almeno 7
celle dai lati collegati e 5 da sopra e sotto.

**Terza sessione del 16/11 (richieste di Jacopo: allenatori, Percorso 1, interni e Pokédex insieme; sprite da rifare; scritte)**
- **Allenatori** (`tools/piceno/allenatori.py`, da lanciare PRIMA di `porta_mappa.py`): 14 della
  demo, con squadre e battute. Il gioco ha solo 9 numeri liberi per gli allenatori, quindi i nostri
  **prendono in prestito i numeri delle reclute Aqua/Magma** (`TRAINER_GRUNT_...`): l'abbinamento è in
  `tools/piceno/allenatori.json` e non va cambiato a mano. Dove stanno lo dice la pianta
  («allenatori»). Le classi sono quelle di Hoenn più vicine (in lotta si legge il nome inglese); le
  mosse scelte a mano nella demo non sono portate.
- **Nando**, il rivale: compare sotto il bar di Bobby avuto lo starter (`FLAG_UNUSED_0x020` lo
  nasconde prima) e sfida con lo starter che batte quello scelto. Sprite e figura in lotta provvisori.
- **Marino del Tronto (Percorso 1) e Oasi**, a est di Monticelli (104,2 e 160,2 sulla carta delle
  zone), set `piceno_campagna`. Sulla cartina Marino si chiama «PERCORSO 1»: il nome intero non
  sta nei 16 caratteri. A est dell'Oasi si andrà a Maltignano.
- **La prima palestra è a Castel di Lama**: mancano Maltignano, Castel di Lama e l'interno della palestra.
- **Sprite**: `personaggi.py` non rimpicciolisce più i fogli della demo. Ogni personaggio è una
  ricetta: uno sprite di Smeraldo ricolorato e ritoccato; Oliver è disegnato da zero in codice.
- **Interni**: pavimenti e pareti da `disegni.py`; i mobili sono i ritagli della demo ripuliti
  (`disegni.pulisci`: cinque colori del kit, niente pixel isolati, contorno). Alcune piante vengono
  scure anziché verdi.
- **Insegne**: carattere a pixel nostro (`disegni.scritta`), non più quello di PIL.
- **Pokédex regionale**: solo le nostre 149 specie nell'ordine della wiki (posizioni consecutive:
  il buco del #137 fa scalare di uno le specie #138-150). Sta in `porta_pokedex.py`.
- **Cartina** (`tools/piceno/cartina.py`): nove caselle, una per zona, disegno schematico. La
  schermata di Vola mostra ancora i pallini delle città di Hoenn: va rifatta in codice.

**Grafica (decisioni di Jacopo del 16/11)**
- I personaggi devono avere **le stesse misure di quelli di Smeraldo**: ora la figura è alta 20 pixel
  (loro 19-21), ricavata dai fogli della demo. Sono più stretti (10-14 contro 14-16).
- Gli elementi nostri vanno **nello stile dei giochi Pokémon**: `tools/piceno/disegni.py` dipinge
  tutti gli edifici e gli arredi degli esterni con lo stesso kit (contorno blu-ardesia, tre toni per
  materiale, tetti a tegole, finestre col riflesso). Niente più ritagli della demo negli esterni; gli
  interni sono ancora quelli della demo. Lo stile del gioco sarà un misto: terreno di Hoenn e tessere
  nostre, e nulla vieta di farne di nuove.
- I **tabacchi hanno la T** bianca su fondo scuro. Cartelli col nome accanto a ogni luogo d'interesse.
- Le piazze sono lastricate di travertino (blocchi nostri).
- Se mGBA ha la ROM aperta non si può sovrascrivere `pokeemerald.gba`: in quel caso la ROM nuova
  finisce in `pokemon-piceno-nuova.gba`, nella stessa cartella.

**Da dove si riparte**
- Aspetta la prova di Jacopo su Monticelli, Borgo Chiaro, alberi e sprite piccoli.
- **Definizione grafica** (domanda di Jacopo del 16/11): la risoluzione è quella del Game Boy Advance
  (240×160, tessere 8×8, 16 colori per tavolozza) e non si alza. Il dettaglio si migliora dentro quel
  limite: edifici e personaggi disegnati a mano alla misura giusta invece che rimpiccioliti o dipinti
  da codice (oggi stazione, chiese, monumenti, ospedale, stadio sono dipinti da me in Python).
  Strada concreta: Jacopo fa i fogli in ChatGPT già a 16×32 (personaggi) e a multipli di 16 (edifici).
- **Carta delle zone** (posizione dell'angolo in alto a sinistra, in celle, Porta Maggiore = 0,0):
  Centro Storico −52,−4 · Monticelli 52,2 · Borgo Chiaro 6,−34 · Campo Parignano −52,−44 · Borgo
  Solestà −102,−24 · Porta Cartara −48,42. Una zona nuova deve incastrarsi qui senza sovrapporsi.
- Zone ancora da portare, dalla demo: **Marino del Tronto** (Percorso 1, a est di Monticelli), poi
  Oasi, Maltignano, Castel di Lama, Spinetoli e Centobuchi, Costa, Jonathan, Ripatransone e le due
  palestre. Nessuna di queste ha ancora allenatori nel gioco: `trainers/<mappa>.js` è da portare.
- Passaggi della demo che sulla carta non tornano e ho lasciato fuori: Borgo Solestà ↔ Borgo Chiaro
  (la strada a nord di Borgo Chiaro non porta da nessuna parte) e la corriera per Ripatransone.
- A Borgo Solestà case, campetto ed erba alta li ho messi io (nella demo sono riquadri senza
  edifici); a Porta Cartara le due case. La chiesa del Sacro Cuore ha una facciata generica.
- Lo stadio, il Teatro e il Battistero sono chiusi (la demo non ha una stanza per loro).
- Steven dopo lo starter dovrebbe stare al bar Callare: oggi nel Centro Storico c'è sempre.
- A Monticelli le due palazzine le ho aggiunte io: nella demo non ci sono.
- Battute scritte da me, da rivedere: il tabaccaio («Che te serve?», «Arrivederci!»), il saluto di chi
  vende («Arrivederci!») e il cartello delle soglie («Senza POKéMON è pericoloso. Prima parla con
  BOBBY, al bar.»).
- La scena iniziale del Piceno è da scrivere (Oliver che arriva in treno).

**Idee e questioni venute fuori oggi, da non perdere**
- *Messe da parte per scelta di Jacopo:* le 38 mosse col nome di una ufficiale ma numeri diversi
  (probabili errori della wiki), le 120 abilità senza effetto (alcune forse ufficiali scritte male,
  es. «Intimidazione»), **Iperfuria** (la wiki la nomina e basta: va deciso cosa fa), le ~85 mosse
  nuove con effetti particolari che per ora valgono solo i numeri.
- *Regola di Jacopo:* una mossa o abilità si riconduce a una esistente solo se l'effetto è uguale in
  tutto; altrimenti si crea nuova.
- *Compilatore in locale:* eventualità segnata più sotto, non decisa.
- *Dimensioni:* le mappe si restringono rispetto alla demo (Porta Maggiore a metà). Una regione
  grande si fa con tante mappe collegate; limite per mappa (larghezza+15)×(altezza+14) ≤ 10.240.
- *Bar:* devono avere l'estetica dei bar del Piceno, non dei Centri Pokémon. Nel gioco i bar curano.
- *Interni e porte:* gli edifici sono ancora chiusi. Servono le mappe degli interni e le porte vere.
- *Steven ed Elena* oggi parlano dentro il dialogo di Bobby: nella demo sono personaggi a sé.
- *Evoluzioni speciali* (29): luoghi, strumenti, squadra, pioggia, fusione. 12 solo per livello, 17
  lasciate fuori; i luoghi diventeranno possibili man mano che nascono le mappe.
- *Lingua:* i testi nostri sono in italiano, il resto del gioco (menu, mosse di Hoenn, messaggi di
  lotta) è ancora in inglese. Non se n'è parlato: va deciso se e quando tradurre.
- *Provvisori grafici e sonori:* versi presi da Pokémon esistenti, cromatico uguale al normale,
  98 sprite ricavati dall'artwork con il retro uguale al fronte, niente impronte né sprite da
  passeggio, animazioni delle mosse nuove prese in prestito.
- *Ordine nel Pokédex:* le nostre specie stanno in fondo al Pokédex di Hoenn; il Pokédex regionale
  vero va rifatto quando Hoenn esce.
- *Wiki da correggere alla fonte:* 34 specie con crescita non valida («medio», «nessuno»), nomi di
  mosse e abilità non ufficiali, 11 categorie più lunghe di 12 caratteri.

**Tappe concordate**
- [x] R1. Repository privato su GitHub con la compilazione automatica; prima ROM del gioco base scaricata
      e aperta in mGBA. Fatto il 16/11: Jacopo l'ha provata, «è ok ma è ancora Pokémon Smeraldo».
- [x] R2. Portare una specie a mano (es. Tifotto: statistiche, tipi, mosse, voce Pokédex, sprite 64×64 a
      16 colori) per capire formato e intoppi.
      **16/11: fatto con le tre linee starter** (scelta di Jacopo), 9 specie, compilazione riuscita
      (6 min 20 s); provata da Jacopo (prima battaglia: «ottimo»). Le scrive `tools/piceno/porta_specie.py`
      nel repo `pokemon-piceno` (legge `species.js` della demo + le schede della wiki + gli sprite
      della demo): è già il seme del generatore di R3, basta allungare l'elenco `SPECIE` e le tabelle
      di traduzione. Le costanti (`species.h`, `pokedex.h`, ordini del Pokédex) per ora sono a mano.
      Intoppi e scelte provvisorie:
      - **Regola di Jacopo (16/11):** una mossa o abilità si riconduce a una esistente solo se
        l'effetto è uguale in tutto e per tutto; altrimenti si crea nuova. Applicata: Fortificazione =
        Harden e Rafforzatore = Sharpen (identiche); Idrogetto, Vigorcolpo e Girandola create nuove in
        `src/data/moves_info_piceno.h` (animazioni prese in prestito).
      - Abilità «Iperfuria» (linea Tuffito): non ufficiale e mai descritta nella wiki; provvisoria
        Anger Point (Grancollera). **Serve che Jacopo dica cosa fa.**
      - Mosse ancora fuori: Terrasanta (5 turni senza mosse Terra: effetto di campo nuovo) e
        Comparanza (+Attacco e +Difesa a sé e all'alleato: effetto nuovo). Serve codice nel motore.
      - Evoluzione di Turibasil «presso Sant'Emidio alle Grotte»: il luogo non esiste, per ora solo
        livello 36. Cavalbrace → Fuocavallo: livello 36 di sera o di notte, funziona con l'orologio.
      - Voce Pokédex: 4 righe da 40 caratteri; quella di Vescovasil è stata accorciata alla prima frase.
      - Provvisori: versi di Pokémon esistenti, cromatico = normale, niente impronta né sprite da
        passeggio, ordini del Pokédex (alfabetico/peso/altezza) in coda, i nove messi in fondo al
        Pokédex di Hoenn. Il rivale ha ancora Treecko/Torchic/Mudkip (R4).
- [x] R3. Scrivere il generatore gemello di `tools/build-dex.mjs` che dalla wiki scrive le specie nel
      formato della ROM hack, e portarle tutte.
      **16/11: fatto e compilato (9 min).** Le specie escono giuste in gioco; resta aperto l'elenco qui sotto. `tools/piceno/porta_pokedex.py`
      nel repo `pokemon-piceno` genera le 149 specie, 283 mosse nuove e 120 abilità nuove, e scrive
      `tools/piceno/rapporto.txt` con tutto ciò che resta provvisorio. Terrasanta e Comparanza sono
      nel motore (Terrasanta è codice di lotta nuovo). Da rivedere con Jacopo, in ordine di peso:
      - 120 abilità su 184 non sono ufficiali: dentro solo come nome, SENZA effetto. Alcune sono
        forse ufficiali scritte male (es. «Intimidazione»). Iperfuria è fra queste.
      - 38 mosse hanno il nome di una ufficiale ma numeri diversi (Fulmine 95, Fuococarica 50,
        Turbine come attacco…): create a sé per la regola, ma molte sembrano errori della wiki.
      - 84 mosse nuove con effetti particolari + le mosse di stato senza effetto dichiarato: per ora
        valgono solo i numeri (Jacopo: «possono per ora rimanere senza effetto»).
      - 29 evoluzioni legate a luoghi/strumenti/condizioni: 12 solo per livello, 17 lasciate fuori.
      - 34 specie con crescita non valida nella wiki («medio», «nessuno») messa medio-veloce (= K13).
      - 98 sprite ricavati dall'artwork (retro = fronte); 11 categorie Pokédex più lunghe di 12
        caratteri (campo allargato a 19, da controllare a schermo); 9 nomi di mossa accorciati a 16.
- [x] R4. Sostituire starter e selvatici dei primi percorsi: ROM giocabile con i nostri Pokémon nella
      Hoenn originale, su emulatore o telefono.
      **16/11: scritto e compilato** (`tools/piceno/hoenn_provvisoria.py` nel repo `pokemon-piceno`),
      provato da Jacopo: «vengono fuori i pokemon giusti». Erba alta, con i livelli originali di Hoenn: Percorso 101 ← Porta
      Maggiore, 103 ← Centro Storico, 102 ← Campo Parignano, 104 ← Porta Cartara, Bosco Petalo ←
      Borgo Solestà, 116 ← Monticelli. Rivale con le nostre linee starter. Acqua, pesca, grotte e
      tutti gli altri allenatori sono ancora di Hoenn; Borgo Chiaro non è stato messo da nessuna parte.
- [ ] **Eventualità: compilatore in locale** (chiesto da Jacopo il 16/11, da tenere segnato, non
      deciso). Oggi ogni prova costa un push e 6-9 minuti. Strade su Windows: WSL2 (la più veloce,
      richiede di attivare Linux e riavviare) o MSYS2 (niente riavvio, circa 20 volte più lenta
      secondo `INSTALL.md` dell'expansion). Da riprendere se l'attesa comincia a pesare.
- [ ] R5. (IN CORSO) Le mappe del Piceno, disegnate da Jacopo (e Giulio) in Porymap con la demo come bozza.
      **16/11: prima mappa fatta e compilata, Porta Maggiore** (79×55), da provare. Decisioni di
      Jacopo: tessere di Hoenn per ora; bozza generata dalla demo e poi rifinita a mano in Porymap;
      dimensioni della demo tenute così. Nel repo `pokemon-piceno`:
      - `tools/piceno/porta_mappa.py <id demo> <NomeMappa> "<TITOLO>"` crea la bozza UNA volta (poi la
        mappa si modifica in Porymap; `--rifai` la rigenera buttando le modifiche a mano). Trama e
        script scritti a mano stanno in `tools/piceno/mappe/<id>.json` e `.inc`.
      - `tools/piceno/disegna_mappa.py LAYOUT_X uscita.png [--griglia]` disegna una mappa in PNG.
      - Porymap 6.3.1 in `%LOCALAPPDATA%\Programs\porymap\porymap.exe`.
      - Partita nuova: si comincia a Porta Maggiore (11,17), non sul camion. Bobby davanti al bar dà lo
        starter, la barista cura. La mappa NON è collegata a nulla: i quattro passaggi della demo
        (Centro Storico, Monticelli, Borgo Chiaro, corriera) mancano finché non esistono quelle mappe.
      - Edifici: timbri di Hoenn (bar = Centro Pokémon, tabacchi = Market, stazione e chiesa =
        palestra, case = casa rossa), porte chiuse, niente interni.
      - **Dopo la prima prova di Jacopo (16/11):** «qualità molto brutta, ma passi da gigante». Tre
        correzioni fatte e compilate: tolto il tremolio iniziale (sequenza del camion); bar, tabacchi e
        casa con la grafica della demo (`tools/piceno/edifici.py` li aggiunge al set di tessere
        petalburg: c'era posto per tre edifici, stazione e chiesa sono ancora palestre di Hoenn);
        mappa a metà scala, 40×28 (`porta_mappa.py --scala=0.5`). **Le dimensioni della demo NON si
        tengono più: si restringe.** Da rifinire: stagno sparito, erba alta piccola, case fitte.
        Per altri edifici nostri serve un set di tessere secondario del Piceno (da fare).
      - **Seconda sessione del 16/11** (richieste di Jacopo: «rendiamola più sensata», alberi davanti
        agli edifici e in piazza che non hanno senso, edifici con le tessere della palestra, la
        stazione da cui arriva Oliver, tagliare la scena iniziale). Fatto: set di tessere nostro,
        pianta disegnata a mano dopo aver guardato le foto del quartiere, partenza dalla stazione,
        discorso di Birch saltato. La pianta sta in `tools/piceno/mappe/porta_maggiore_pianta.json`
        (stesso formato della demo, misura del gioco): si cambia lì e si rilancia
        `python tools/piceno/porta_mappa.py porta_maggiore PortaMaggiore "PORTA MAGGIORE" --rifai`.
        **Attenzione:** `--rifai` butta le modifiche fatte a mano in Porymap; finora non ce ne sono.
        Per un edificio nuovo: aggiungerlo in `edifici.py` (`pezzi_del_set`) e rilanciarlo.
      - **Limite del motore:** (larghezza+15)×(altezza+14) ≤ 10.240 per mappa. Castel di Lama (9.804)
        e Costa (9.525) sono al limite; una regione grande si fa con tante mappe collegate.

**Cosa si porta dietro dalla demo:** specie (statistiche, tipi, mosse per livello, evoluzioni, voci
Pokédex), sprite di battaglia, squadre degli allenatori, tabelle degli incontri, testi dei dialoghi,
i numeri del bilanciamento.
**Cosa va rifatto a mano:** mappe, mosse inventate e abilità nuove (una per una nel motore), eventi
della trama, evoluzioni legate a luoghi, ora e squadra (da verificare una per una nell'expansion).
**Cosa non serve più:** menu, Borsa, motore di lotta, animazioni, interni della demo.

**Stato della demo al 16/11** (ultimo commit pubblicato: «nome dell'edificio negli interni, dissolvenza
in uscita, tre case…»): si gioca dalla stazione alla seconda medaglia; 11 suite di test verdi;
`node tools/gioca.mjs` (6 minuti) senza problemi. L'elenco delle cose ancora aperte sulla demo è nelle
sezioni K, L, M più sotto: restano valide, ma dopo la decisione di oggi non sono la priorità.
Da riprendere comunque perché valgono anche per la ROM hack: K13 (campo `growth` sbagliato per 23
specie), K21 (Zanzì con Velenpuntura 80), i tre refusi «Evo» sulla wiki (L6), le 37 mosse inventate
senza effetto (K1), le evoluzioni legate a luoghi che non esistono come mappe (L4).

---

# Piano: il gioco prende l'aspetto di un gioco Pokémon (demo due palestre)

Scritto il 14/11/2026. Il motore (logica, mappe, lotte, script) resta: cambia lo strato grafico.
Le mappe oggi sono rettangoli (`roads`, `waters`, `buildings`…) dipinti con `fillRect` su un canvas
240×160; gli edifici sono scatole colorate e le zone d'incontro sono invisibili.

## A. Scheda Pokémon nel gioco
- [x] A1. Clic su un Pokémon in Squadra/Deposito → scheda con tipi, stato, 6 statistiche, esperienza
      (barra + mancante al prossimo livello), mosse con tipo/categoria/potenza/precisione/PP/descrizione,
      link alla wiki. Verificato in Chrome headless il 14/11, test verdi. Pubblicato (3e57edb).
- [ ] A2. Stessa scheda dal Pokédex (specie catturate: statistiche base, mosse per livello, evoluzione) e
      dalla lotta (menu Squadra → «Info»; descrizione della mossa nel menu mosse).
- [ ] A3. `build-dex.mjs` porta in `species.js` anche categoria («Pokémon Quercia»), voce Pokédex,
      altezza/peso e abilità (solo testo) → la scheda li mostra.
- [x] A4. (14/11) `createMonster` partiva da `exp: 0` a qualunque livello: ora parte da livello³ e
      `hydrateMonster` riallinea i vecchi salvataggi. In `simulate-balance.mjs` il livello d'arrivo alle
      palestre sale di 0,3-1: nessun ritocco al moltiplicatore. ⚠️ La simulazione (già prima) dà
      Puledrotto 0% contro entrambi i capipalestra: da guardare a parte.
- [ ] A5. `growth` è sbagliato per 23 specie (`nessuno (genere sconosciuto)`: il generatore legge la
      riga del genere). Oggi il motore lo ignora, ma va sistemato prima del porting.

## B. Mondo: da rettangoli a tileset
- [ ] B0. **Fonte dei tile**: atlante originale in stile terza generazione, generato (deciso il 14/11).
      Non si usano tile estratti dai giochi ufficiali. Su questo PC manca un generatore di immagini
      (`codex` non è installato): o lo si installa, o l'atlante lo genera Jacopo e qui lo si affetta (PIL c'è).
- [x] B1. (14/11) Motore a tileset: `assets/tiles/tileset.png` 16×16, contratto `TILES` in `game.js`,
      bordi automatici erba/strada/acqua/sabbia, acqua animata, alberi con chioma. L'atlante attuale è
      **provvisorio** (`tools/build-tileset.py`): va sostituito con quello generato.
- [x] B2. (14/11) Erba alta visibile sulle zone d'incontro, copre i piedi del giocatore. Manca il fruscio.
- [ ] B2b. Le zone d'incontro sono rettangoli enormi (es. 45×42): ora che si vedono sono prati interi
      d'erba alta. Da ridisegnare a chiazze nel configuratore.
- [x] B1b. (14/11) Disegno spostato in `tiles.js`, condiviso: il configuratore mostra la mappa com'è nel
      gioco. Pennelli fino a 15; «Incontri» con probabilità 0 toglie l'erba alta.
- [ ] B1c. Il configuratore salva solo nel browser: per pubblicare ciò che Jacopo disegna, esporta il
      JSON (Dati → Esporta) e va riversato in `maps/<id>.js` (a mano o con uno script da scrivere).
- [x] B3a. (14/11) Primo foglio generato da Jacopo (ChatGPT immagini) → `tools/build-oggetti.py` →
      alberi ed edifici composti da pezzi veri (tetto, muro tinto, porte per `kind`, finestre, vetrine).
      Codex CLI su questo account non genera immagini: i fogli si generano dal browser.
- [x] B3b. (14/11) Arredo urbano: campo `map.decor`, strumento «Arredo» nel configuratore (clic piazza,
      clic sull'oggetto toglie), il gioco lo disegna e lo tratta come ostacolo. Nessuna mappa ne ha ancora.
- [x] B3c. (14/11) Secondo foglio: insegne sopra la porta (bar, tabacchi, palestra, croce) scelte da
      `interior`/nome, rosone sulle chiese, tetto piatto e in lamiera, spalti dello stadio; nuovo arredo
      (staccionata, muretto, siepe, tavolino, ulivo, cipresso, ombrellone, barca).
- [ ] B3. Edifici: campanile, varianti di facciata (bar, tabacchi, palestra, chiesa,
      ospedale, stadio…); il giocatore passa dietro tetti e chiome (ordinamento per Y).
- [ ] B4. Animazioni: acqua, mare, fiori; ombra sotto gli sprite; camminata NPC a 4 frame.
- [ ] B5. I 6 fogli NPC mancanti (bro_security, dj, turista, congressista, rivale, capopalestra) —
      verificare: in `assets/npc/` i file ora ci sono tutti.

## C. Interfaccia
- [x] C1. (14/11) Finestra di dialogo in basso con cornice, targhetta del nome, testo a macchina da
      scrivere (A/clic completa la frase, poi avanza) e freccia ▼; font pixel VT323 (licenza OFL) in
      `assets/fonts/`. Dialoghi e lotta sono misurati in `--u` (1/240 dello schermo): scalano col gioco.
- [x] C2. (14/11) Lotta: sfondo con pedane, riquadri PS con barra verde/gialla/rossa animata e barra
      exp, riquadro messaggi, menu LOTTA/BORSA/SQUADRA/FUGA, mosse con tipo e PP, lampo d'ingresso.
- [x] C2b. (14/11, deciso da Jacopo) Lati come nei giochi Pokémon: avversario in alto a destra con scheda
      in alto a sinistra, proprio Pokémon in basso a sinistra con scheda in basso a destra. Sostituisce la
      scelta precedente (selvatico a sinistra); `regression.mjs` aggiornato.
- [x] C3. (15/11, = I7) Transizioni: dissolvenza fra mappe, animazione della Ball, colpo/KO.
- [x] C4a. (14/11) Schermata Squadra a riquadri: capofila grande a sinistra, altri cinque in colonna,
      barre PS colorate, KO in rosso, posti vuoti tratteggiati; clic → scheda. Grafica originale.
- [x] C4b. (15/11) Menu di pausa a lista sulla destra; Borsa a tasche (= I3).
- [ ] C5. Icone delle 2 medaglie (era E3). La schermata titolo è fatta (15/11, = I3).

## E. Movimento e scala (richiesta del 14/11: «mappe enormi», «fluidità di Oliver»)
- [x] E1. (14/11) Movimento fluido: velocità costante (via l'accelera-e-frena a ogni cella), passi
      concatenati senza pausa col tasto giù, due fotogrammi per cella, giro sul posto con un colpetto,
      corsa con Maiusc o B tenuto (≈5 celle/s a piedi, ≈9 di corsa).
      ⚠️ `tests/e2e/` muove Oliver con pressioni singole: col giro sul posto un cambio di direzione
      ora richiede due pressioni (o tasto tenuto). Da adeguare prima di rilanciare il playthrough.
- [x] E2. (14/11, deciso da Jacopo: «i due terzi») Mappe esterne ridotte con
      `tools/scala-mappe-due-terzi.mjs` (NON rilanciare: non è idempotente): 144×108 → 96×72,
      180×120 → 120×80, 144×120 → 96×80; interni invariati. 781 coordinate, 4 ritocchi a mano (arrivo
      del Ponte Nuovo, tre terne di Nando). Chiavi del configuratore portate a `ConfigV3`/`TrainersV2`;
      i salvataggi vengono riposizionati (`mapScale`). Storia: 256×160 → 48×36 → ×3 (20/08) → ×2/3.
      ⚠️ `tests/e2e/` ha coordinate fisse della scala vecchia: da rifare.
- [x] E3. (14/11) Sprite degli NPC: terzo foglio (anziano, signora, ragazzo, infermiera) ritagliato con
      `tools/build-npc.py`; i cartelli usano l'oggetto cartello; `guessNpcSprite` assegna uno sprite a
      chi non ne dichiara. Servono altri passanti per variare.
- [x] E4. (14/11) Prima sistemazione automatica: `tools/arreda-mappe.mjs` → `maps/zz_arredo.js`
      (erba alta a chiazze + ~1600 oggetti). Da ritoccare a mano. ⚠️ La probabilità d'incontro nelle
      zone a chiazze è ×1,5: il bilanciamento dei livelli va riguardato giocando.

## F. Dal test di Jacopo del 14/11 sera
- [x] F1. Oliver a scatti: foglio riallineato (i fotogrammi erano a passo ~27,5 px invece di 32),
      telecamera a pixel interi.
- [x] F2. NPC fermi; allenatori che camminano davvero verso il giocatore (`trainerSpots`), giocatore
      bloccato durante l'avvicinamento.
- [x] F3. Mappe ai 3/4 (72×54 / 90×60) con `tools/scala-mappe.mjs 3/4`; chiavi ConfigV4/TrainersV3,
      `mapScale: 3`.
- [x] F4. Cartelli leggibili accanto alle porte (arredo `cartello` con `text`), via le scritte sugli
      edifici. Restano le etichette dei passaggi e dei luoghi (`map.labels`). 7 edifici senza cartello.
- [x] F5. Tifotto/Anicino: sprite scambiati sistemati; Tifotto provvisorio dall'artwork wiki.
      ⚠️ Il vecchio `anicino-*.png` (un essere dorato tondo) non era né l'uno né l'altro: gli sprite di
      battaglia vanno ricontrollati uno per uno contro la wiki.
- [x] F6. Fruscio dell'erba alta, animazione della Ball, barra exp che si riempie, mappa della regione
      nel menu (provvisoria: posizioni disegnate a mano in `regionSpots`).
- [x] F7. (14/11) Interni di bar e tabacchi: `maps/interni.js` (due stanze 15×10 condivise), collegamento
      in `data.js`, ritorno alla porta d'ingresso (`save.returnSpot`, passaggio `back`), si parla
      attraverso i banconi (`counter` in `DECOR_KINDS`), si entra camminando contro la porta.
      Da fare: stanze diverse per i bar della trama (Bobby, Steven, Elena), case visitabili.
- [x] F9. (14/11) Effetti sonori provvisori sintetizzati (`SOUNDS` in `game.js`). Musica: no.
- [ ] F10. **Interni, passo successivo** (Jacopo, 14/11: «molto interessante», da riprendere). Due strade,
      da scegliere:
      (a) bar personalizzati per Bobby, Steven ed Elena: una stanza ciascuno, il personaggio dietro il
      bancone al posto del barista generico, con i suoi dialoghi di trama spostati dentro;
      (b) case visitabili: una o due stanze-tipo (cucina, salotto) con un abitante che dice una battuta.
      Per (b) serve un foglio di arredi di casa (letto, tavolo, cucina, divano, libreria, tappeto).
- [ ] F8. Sprite veri per Tifotto (fronte e retro).

## G. Dal secondo test di Jacopo (14/11, tarda notte)
- [x] G1. ⚠️ ERRORE MIO corretto: «rimpicciolire la mappa» voleva dire togliere spazio vuoto, non
      scalare gli elementi. Ripristinate le mappe a misura piena (commit 06cbcc8) e compattate con
      `tools/compatta-mappe.mjs` (toglie righe/colonne non protette; ogni mappa ha `width`/`height`
      suoi; non si rilancia). `tools/scala-mappe.mjs` resta ma NON va più usato sulle mappe.
      `mapScale: 4`, chiavi ConfigV5/TrainersV4, salvataggi vecchi ripartono dalla stazione.
- [x] G2. Via tutte le scritte nel mondo (`drawWorldLabel` eliminata): cartelli per uscite e luoghi.
- [x] G3. Cartelli a 2 celle dalla porta; erba alta a 1 cella dagli edifici; alberi dentro/davanti agli
      edifici ignorati da `terrainAt`; incontri solo sull'erba alta visibile.
- [x] G4. Oliver: fotogrammi del passo rifatti in codice dal fotogramma fermo (piede alzato a turno);
      passo 250 ms, corsa 130 ms. Se servisse di più: farsi generare un vero foglio di camminata.
- [x] G5. Ball all'ingresso del proprio Pokémon (`sendOutAlly`); colonna sonora (`MUSIC_BARS`).
- [ ] G6. Nando davanti al bar di Bobby: con le mappe a misura piena sta di nuovo a 6 celle dalla porta
      (il blocco veniva dalla mappa rimpicciolita). Da ricontrollare giocando.

## H. Terzo giro di test (15/11)
- [x] H1. Ball all'ingresso del proprio Pokémon: partiva sotto il lampo d'ingresso → ritardata e rallentata.
- [x] H2. Incontri solo su erba alta visibile (o sabbia/pendio in zona), mai su strada/piazza/ponte;
      aiuole d'erba alta nelle zone su selciato (Centro Storico) generate da `arreda-mappe.mjs`.
- [x] H3. NPC nascosti da `when` non bloccano più (`isBlocked` usa `visibleRuntimeNpcs`).
- [x] H4. Secondo giro di `compatta-mappe.mjs --ancora --stretto --lato=0.7`; `MAP_SCALE = 5`,
      ConfigV6/TrainersV5. Oltre non si può con tagli dritti: servirebbe ridisegnare i quartieri.
- [x] H5. Case visitabili (`interno_casa`, `interior: 'house'` assegnato in `data.js` alle «Casa…»).
      Manca il foglio di arredi di casa per arredarle davvero.
- [x] H6. Case arredate (foglio `interni-2.png`); esperienza divisa fra i partecipanti (`battle.participants`);
      niente rimbalzo sui passaggi (`justArrived`).
- [x] H7. `tools/gioca.mjs`: giocatore automatico via CDP, aggancio `PokemonAscoliDebug` con `?debug=1`.
      Da lanciare dopo ogni giro di modifiche a mappe o motore. Non controlla la resa visiva né l'audio.
- ⚠️ Nota tecnica: negli script lanciati da shell un `\b` dentro una stringa Python arriva come
  backspace (0x08) e rompe le regex in silenzio. Per scrivere regex nei sorgenti usare Edit.

## I. Da dove ripartire (elenco concordato con Jacopo il 15/11/2026)
Ordinati per quanto si notano giocando. Jacopo sceglie da quale partire.

**Le tre consigliate**
- [x] I1. (15/11) Tavola sprite/artwork con `tools/tavola-sprite.py <cartella>` (49 specie, 12 per foglio).
      Trovato e corretto: **Sciarpone aveva lo sprite di Anisetta** → provvisorio dall'artwork con
      `tools/sprite-da-artwork.py` (retro = fronte, come Tifotto). Da rifare quando ci sono i fogli:
      Ciccharizard e Coperto (sbiaditi, pieni di pixel semitrasparenti; Ciccharizard è anche chiaro mentre
      l'artwork è scuro), Cavedòne (bipede, l'artwork è un pesce), Sbandiera (figura umana, l'artwork no).
      Nessuna di queste quattro compare nella demo se non per evoluzione.
- [x] I2. (15/11) Lo 0% di Puledrotto veniva soprattutto dal simulatore: giocava col solo starter, non
      cambiava Pokémon, buttava le mosse nuove a quattro mosse piene e sfidava il Nando sbagliato (la
      chiave `nando_<x>` è lo starter di Nando, non il tuo). Riscritto il giocatore simulato: cattura un
      Pokémon per mappa (squadra fino a 4), manda in campo l'abbinamento migliore, esperienza divisa come
      in `game.js`; `--solo`, `--selvatici=N`, `--squadra=N` per provare altri profili.
      Ritocchi alle squadre: Gino (Monticelli) Segaccio 6 + Venagrox 5 → Pito 5 + Segaccio 5 (lo vincevano
      1 volta su 3 Basilino e Tuffito); Pozza di Hills 12 → 11. Con 200 partite per starter: Hills
      95% / 67% / 94% (Basilino / Puledrotto / Tuffito), Riccio 100% / 67% / 72%; livello più alto
      15-16 alla 1ª palestra, 22-24 alla 2ª.
      ⚠️ Restano sul 60-70% alla prima prova, per chi gioca senza strumenti: `costa_dj_1` (Mucillax 19),
      `costa_turista_1` (Maranzino 18), il terzo Bro della Security, Nando allo Jonathan. Da giudicare
      giocando, non li ho toccati.
      ⚠️ Dalla wiki: Zanzì ha Velenpuntura (80) fra le mosse iniziali, quindi quello di Hills al livello 9
      picchia forte; il Repellente si compra ma nel motore non fa nulla.
- [x] I3. (15/11) Menu di pausa a lista sulla destra col mondo dietro (frecce + A, B/Esc torna indietro),
      Borsa a tasche (Strumenti, Ball, Strumenti base, MT; si sceglie su chi usare Pozione e Antidoto),
      schermata titolo nuova con riepilogo della partita salvata. Le pagine Pokédex, Allenatore, Deposito,
      Salva e Opzioni hanno la cornice nuova ma dentro sono ancora quelle vecchie (testo piccolo su PC).

**Quarto giro di test (Jacopo, 15/11 pomeriggio) — fatto il 15/11**
- [x] J1. Little Bar (Monticelli): non aveva né porta né interno. Ora è un bar come gli altri (si entra, cura).
- [x] J2. Interni per i luoghi della città, stadio escluso (sarà la sede della Lega): chiesa, ospedale
      (l'infermiera cura), cinema, pizzeria, stazione, palazzo, emporio del benzinaio. Una stanza per tipo
      in `maps/interni.js`, assegnata da `interiorRules` in `data.js` (per `kind` o per nome); la porta va
      al centro della facciata. 13 edifici in tutto, anche fuori Ascoli (le chiese di Maltignano e
      Ripatransone). Arredate con i mobili che ci sono: banchi = panchine, altare = tavola, schermo = quadri.
      Per farle belle serve un foglio dedicato (banchi di chiesa, altare, lettino d'ospedale, schermo, forno).
      Il Teatro Ventidio resta col suo copione («chiuso per riprese»).
- [x] J3. Angoli smussati: dove strade, piazze, asfalto, ghiaia, sabbia e travertino fanno angolo verso
      l'erba, l'erba ne arrotonda la punta (`CORNER_ROWS` in `tiles.js`). Non tocca rive ed edifici.
- [x] J4. Cambio Pokémon scelto dal giocatore: «X, rientra!», poi «Vai, Y!» con la Ball, e solo dopo la
      mossa dell'avversario (prima partiva tutto insieme).
- [x] J5. Pokémon esausto: non entra più da solo il primo disponibile, si sceglie dalla lista («Chi mandi in campo?»).
- [x] J6. Alberi e arredo più in basso del giocatore lo coprono: si passa dietro le chiome, non sopra
      (era il primo pezzo di B3, ordinamento per Y; per NPC e tetti resta da fare).
- [x] J7. Via «ha un effetto speciale!». ⚠️ **Ruggito era catalogato come Boato** (sostituzione forzata)
      invece che «abbassa l'Attacco»: corretto in `tools/moves-catalog.json` insieme ad altre 17 mosse il
      cui effetto il motore sa già fare (calo/aumento di statistiche anche doppie, veleno, tentennamento,
      colpi doppi, cura). Messaggi come nei giochi: «L'Attacco di Pito diminuisce!», «…aumenta di molto!».
      Gli effetti sulle statistiche ora scattano anche sulle mosse che fanno danno (Acido non lo faceva).
      Restano 55 mosse con effetto non previsto dal motore (confusione, Boato, Riposo, campi…): quelle di
      stato dicono «Ma non ha effetto!», quelle d'attacco fanno solo danno. Da fare a parte.
- [x] J8. Mossa nuova imparata salendo di livello: annunciata nel riquadro («X ha imparato Y!»); con
      quattro mosse piene, dopo la scelta: «X ha dimenticato A e ha imparato B!» o «X non ha imparato B.».

**Grafica e atmosfera**
- [ ] I4. Foglio di camminata vero per Oliver (oggi i passi sono ricavati in codice dal fotogramma fermo).
- [ ] I5. Sprite veri per Tifotto, fronte e retro (= F8).
- [x] I6. (15/11) Allenatori che camminano: il passo è ricavato in codice dal fotogramma fermo (un piede
      alzato a turno, `stride` in `drawSpriteFrame`). È un accenno: per un passo vero servono fogli con i
      fotogrammi di camminata, come per Oliver (I4).
- [x] I7. (15/11) Dissolvenza al cambio di mappa (nero, poi la mappa affiora); in lotta chi attacca scatta
      in avanti, chi è colpito lampeggia, chi va KO scivola giù e sparisce (= C3).
      ⚠️ La barra dei PS scende già sul messaggio «X usa Y!», prima del colpo: da allineare.
- [x] I8. (15/11) Quattro temi sintetizzati (`MUSIC_THEMES`): città, percorso (Marino, Oasi, Maltignano,
      Spinetoli), palestra (le due palestre e lo Jonathan), lotta. Il tema vecchio sfuma, il nuovo riparte.
      ⚠️ Scritti senza poterli ascoltare: vanno giudicati a orecchio.

**Contenuti**
- [ ] I9. Interni dei bar della trama (Bobby, Steven, Elena). Da decidere insieme: tocca la storia, oggi
      il bar di Bobby risulta chiuso dopo la rissa (= F10a).
- [ ] I10. Stanze diverse per le case (oggi una sola condivisa).
- [ ] I11. Scheda Pokémon più ricca: categoria, voce Pokédex, altezza, peso, abilità dalla wiki; scheda
      apribile anche dal Pokédex (= A2, A3).
- [ ] I12. Mappa della regione disegnata, al posto dello schema provvisorio.

**Sotto il cofano**
- [ ] I13. Portare nel gioco ciò che Jacopo disegna nel configuratore (= B1c).
- [ ] I14. Campo `growth` sbagliato per 23 specie (= A5), prima del porting verso la ROM hack.
- [ ] I15. Prova su un telefono vero.
- [ ] I16. Mappe: Jacopo le sta provando. Se servono più raccolte, ridisegnare a mano i quartieri fitti
      (Porta Maggiore, Castel di Lama, Centro Storico, Costa): con i tagli dritti siamo al limite.
- Dopo ogni giro di modifiche: `node tools/gioca.mjs`.

## K. Elenco aggiornato (15/11/2026 sera) — Jacopo: «teniamolo a mente, è pieno di cose interessanti»
Scelti da Jacopo per primi: K1-K6, più K0 e K7 arrivati dal test.

**In corso**
- [x] K0. (15/11) ⚠️ Blocco in lotta alla palestra di Castel di Lama: il riquadro «quale mossa dimenticare»
      si apriva DIETRO la schermata di lotta (stesso z-index, viene prima nel DOM) e il gioco aspettava una
      scelta invisibile. C'era da sempre; `gioca.mjs` non lo vedeva perché clicca i bottoni anche coperti.
      Ora sta sopra, nello stile nuovo.
- [x] K1. (15/11) Effetti delle mosse: il motore ora sa fare confusione (anche su di sé), Riposo, Sbadiglio,
      Boato/Stordiscappo (chiudono l'incontro selvatico; contro un allenatore trascinano in campo un altro
      Pokémon), Teletrasporto, Provocazione, ricarica dopo la mossa, KO in un colpo, cura dello stato,
      radici, vortice. 18 mosse sistemate in `tools/moves-catalog.json`; test in `tests/battle.test.mjs`.
      Restano 37 mosse con effetto non previsto (quasi tutte esclusive di specie fuori dalla demo, o
      pensate per le lotte in doppio): quelle di stato dicono «Ma non ha effetto!». Elenco: aiuto, arringa,
      bolgia, braciscavo, cappottone, chicco_doro, colpo_sordo, contatore, corretto, desiderio,
      dialettica_critica, diceria, difesa_del_forestiero, differita, dropbeat, favorino, filiera_corta,
      fischio_lungo, flagello, fora_fora, ghiannata, jnen, malocchio, ombra_fresca, partecipazione,
      ponteggio, raddrizzafogna, scattomatto, scia_di_braci, sconfinata, sei_piatti, sfocatura,
      smistamento, solito, solo_piombo, staffetta, terrasanta.
      ⚠️ Per molte la descrizione sulla wiki è tronca («è la sua mossa esclusiva: agisce»): prima di
      implementarle va letta la scheda.
- [x] K2. (15/11) La lotta racconta gli eventi uno alla volta (`playEvents`): la barra dei PS scende quando
      il colpo si vede, non sul messaggio «X usa Y!». Gli eventi del motore portano i PS rimasti (`hp`).
      Resta: l'etichetta dello stato (VEL, PAR…) compare un messaggio prima dell'annuncio.
- [x] K3. (15/11) Repellente: si usa dalla Borsa, per 100 passi niente selvatici di livello più basso del
      primo Pokémon in piedi; avvisa quando finisce.
- [x] K4. (15/11) Scheda Pokémon con categoria, altezza, peso, abilità e voce Pokédex (`build-dex.mjs` le
      porta in `species.js`). Si apre dalla Squadra, dal Deposito, dal Pokédex (specie catturate:
      statistiche base, mosse per livello, evoluzione) e in lotta (Squadra → Schede). Nel menu mosse il
      riquadro dei messaggi descrive la mossa su cui si passa.
- [x] K5. (15/11) Pokédex, Allenatore, Deposito, Salva e Opzioni rifatti nello stile nuovo (classe `.page`).
- [x] K6. (15/11) Icone delle due medaglie sulla Tessera Allenatore (goccia viola, ombrellone): disegni
      originali in SVG, grigie finché non sono vinte.
- [x] K7. (15/11) Animazioni degli stati: tinta sullo sprite più segni che salgono (bolle per veleno e
      scottatura, scintille per paralisi e gelo, Z per il sonno, ? per la confusione), sia quando lo stato
      arriva sia quando agisce.
- [x] K0c. (15/11) Alberi, seconda correzione: la prima (ridisegnare gli alberi vicini a Oliver) metteva quel
      pezzo sopra la fila successiva e sembrava una fila che lo seguiva. Ora alberi, arredo, personaggi e
      allenatori si disegnano riga per riga dall'alto (`afterRow` in `drawStanding`): chiude anche K10 per
      alberi e personaggi; restano i tetti degli edifici.
- [x] K0d. (15/11) Squadra → «Ordina»: scegli un Pokémon e poi con chi scambiarlo; il primo riquadro è
      quello che scende in campo per primo.
- [x] K0b. (15/11) X/Esc/B durante un turno faceva ricomparire il menu principale della lotta (è così che
      Jacopo si è sbloccato): ora vale solo da un sottomenu con il suo «Indietro».

**Posso farle da solo, dopo**
- [x] K8. (16/11) Tre case diverse (`interno_casa`, `_2` dei nonni, `_3` del ragazzo), scelte dalla posizione
      dell'edificio in `data.js`: la stessa casa apre sempre la stessa stanza.
- [ ] K9. Mappa della regione disegnata (= I12).
- [ ] K10. Passare dietro i tetti degli edifici (= B3). Alberi e personaggi: fatto, vedi K0c.
- [ ] K11. Ombra sotto gli sprite, fiori animati (= B4).
- [ ] K12. Erba alta a chiazze dove è rimasta a rettangoli (= B2b).
- [ ] K13. Campo `growth` sbagliato per 23 specie (= I14).
- [ ] K14. Portare nel gioco ciò che Jacopo disegna nel configuratore (= I13).
- [ ] K15. Test di playthrough `tests/e2e/` fermo da quando sono cambiati movimento e mappe.

**Servono i fogli di Jacopo (ChatGPT immagini)**
- [ ] K16. Camminata vera: Oliver fatto (15/11, foglio `oliver-cammino.png`), ragazzino e ragazzina fatti
      (`cammino-1.png`). Mancano i fogli 2-7: pescatore/birdwatcher, campeggiatore/contadino,
      ciclista/bagnino, turista/DJ, buttafuori/gemelle, rivale. `tools/build-npc.py` li ritaglia: basta
      aggiungere il foglio a `WALK_SHEETS`.
- [x] K17. (15/11) Foglio `battaglia-1.png` ritagliato con `tools/build-battaglia.py`: fronte e retro veri per
      Tifotto, Sciarpone, Ciccharizard, Coperto, Cavedòne, Sbandiera, più Capultrà e Quintanaro che non
      avevano sprite. ⚠️ Il generatore ha messo le creature in un ordine diverso da quello chiesto:
      l'ordine va scritto in `SHEETS` guardando il foglio.
- [x] K18. (15/11) Foglio `interni-3.png` (16 arredi: banco di chiesa, altare, candelabro, confessionale,
      lettino, flebo, paravento, armadietto, schermo, poltroncina, proiettore, popcorn, forno, bancone
      pizze, tabellone, biglietteria) ritagliato e messo in chiesa, ospedale, cinema, pizzeria, stazione.
      Palazzo ed emporio usano ancora i mobili vecchi.
- [ ] K19. Atlante dei tile definitivo (= B0).

**Serve una decisione di Jacopo**
- [ ] K20. Interni dei bar della trama: Bobby, Steven, Elena (= I9).
- [ ] K21. Zanzì parte con Velenpuntura (80) sulla wiki: voluto o svista?
- [x] K22. Difficoltà: Jacopo, 15/11 sera: «per adesso va bene così» (esperienza ×2,2, squadre invariate). Da riaprire solo se lo chiede.

**Da provare Jacopo**
- [ ] K23. Musica: i quattro temi sono scritti senza ascoltarli.
- [ ] K24. Prova su un telefono vero (= I15).
- [ ] K25. Mappe ancora più raccolte? Servirebbe ridisegnare a mano i quartieri fitti (= I16).
- [ ] K26. Nando davanti al bar di Bobby: non deve bloccare la porta (= G6).

## L. Notate da me provando il gioco (15/11/2026 sera) — da decidere con Jacopo
**Regole di gioco che non fanno quello che promettono**
- [x] L1. (15/11) MT: si usano dalla Borsa (tasca MT → Usa → scegli il Pokémon). La impara chi è dello
      stesso tipo della mossa o ce l'ha già fra le mosse per livello; si consuma, a meno che si rinunci
      nel riquadro «quale dimenticare». ⚠️ Regola mia: sulla wiki nessuna specie elenca Velenospina o
      Idrogetto fra le MT, quindi non c'era una lista da seguire. Da decidere se allargarla.
- [x] L2. (15/11) Strumenti evolutivi: si usano dalla Borsa sul Pokémon giusto (Acquasanta su Pozza…), che
      evolve subito e consuma lo strumento. Resta la vecchia via per chi ha anche un livello minimo.
- [x] L3. (15/11) Amicizia: oltre al punto per ogni livello, un punto ogni 50 passi a tutta la squadra.
      Ne servono 20: circa 1000 passi insieme, poi l'evoluzione scatta al livello successivo.
- [x] L4. (15/11) Evoluzioni speciali in `evolutionReady` (battle.js): notte (20-6) e tramonto (17-20)
      dall'orologio del dispositivo, compagno in squadra, mossa sonora conosciuta (`sound` in moves.js,
      messo da `build-dex.mjs`), specie appena battuta (scatta anche senza salire di livello).
      ⚠️ Restano impossibili nella demo: quelle con un luogo che non è una mappa del gioco (sestiere,
      avvistamenti, ascensione, castel_trosino) e Ombrellone (vuole un «bagnino» in squadra, che non è
      una specie). L'ora è quella vera del dispositivo: per la ROM hack andrà rifatta sull'RTC.
- [x] L5. (15/11) All'evoluzione si imparano le mosse «Evo» della nuova specie (`evoMoves`) e quelle del
      suo livello; a quattro mosse piene si sceglie quale dimenticare.
- [x] L6. (15/11) Mosse «Evo» sulla forma base di una linea: scartate dal generatore (Zanzì non parte più
      con Velenoshock, Cavedì senza Correntina, Cignalò senza Fangobomba). ⚠️ Sono refusi delle tre schede
      wiki: la riga «Evo» andrebbe spostata sulla scheda dell'evoluzione.
- [x] L7. (15/11) Borsa in lotta: mostra gli strumenti posseduti che servono in lotta, con la descrizione;
      per Pozione e Antidoto si sceglie il Pokémon, anche uno in panchina. Usarli costa il turno.
**Bilanciamento**
- [x] L8. (15/11, deciso da Jacopo: «Venagrox e Segaccio sono troppo, Banconio molto raro e a livelli
      bassi») Monticelli: Pito, Tamburino, Anicino, Banconio al 3% al livello 7. Tolto Segaccio anche dai
      selvatici di Borgo Chiaro (→ Ciucì) e Borgo Solestà (→ Tamburino). Restano con Segaccio due
      allenatori: Gino a Monticelli (livello 5) e il ciclista di Borgo Chiaro (livello 9).
      ⚠️ Il bilanciamento di prima si appoggiava a quei selvatici (tanta esperienza e un compagno
      fortissimo da catturare): per tenere gli stessi livelli alle palestre l'esperienza passa da ×1,8 a
      ×2,2. Con 200 partite: Hills 95% / 54% / 95% (Basilino / Puledrotto / Tuffito), Riccio 98% / 53% /
      77%; livello più alto 16-17 e 22-25. Puledrotto è la «modalità difficile»: Hills ha un Roccia e
      Riccio è tutto Acqua. Da decidere insieme a K22.
- [x] L9. (16/11, Jacopo: «Mucillax correggilo») In palestra a Castel di Lama Mucillax (evolve dal 18) era al
      livello 9-10: ora c'è Alghetta, la sua forma base, agli stessi livelli. ⚠️ Restano sotto il livello
      d'evoluzione, non toccati: il Pozza di Hills (11, evolve al 21), l'Ombrellone di Riccio (20, evolve
      al 22) e, fra i selvatici, Caìta a Castel di Lama (11-12, evolve al 20) e Scoglierax sulla costa
      (18-19, evolve al 30).
      Bilanciamento dopo il cambio (200 partite): Hills 98% / 70% / 98% (Basilino / Puledrotto / Tuffito),
      Riccio 98% / 44% / 58%. Riccio è sceso perché Alghetta dà meno esperienza di Mucillax.
**Schermate**
- [x] L10. (15/11) Pokédex: l'elenco arriva fino all'ultimo numero incontrato; chi non si è mai visto è una
      riga vuota, senza sagoma.
- [x] L11. (15/11) L'etichetta dello stato compare con l'annuncio (`battle.shown.allyStatus/enemyStatus`).
- [x] L12. (15/11) La descrizione della mossa sparisce quando si esce dal bottone o dal menu mosse.
- [x] L13. (15/11) Schermata titolo: su e giù spostano il cursore fra le voci, Invio/A sceglie.
- [x] L14. (15/11) Telefono: nel titolo e nella lista del menu la croce sposta il cursore e A sceglie la voce.
      Dentro le pagine (Borsa, Squadra…) si tocca ancora la voce.
- [x] L15. (16/11) Nelle stanze condivise in alto c'è il nome dell'edificio da cui si è entrati
      (`save.roomName`, `locationName()`): «Chiesa dell'Immacolata», «Little Bar», «Casa popolare».
- [x] L16. (16/11) Dissolvenza anche in uscita: lo schermo va a nero in 170 ms, a nero pieno si cambia mappa
      (`changeMap`), poi la nuova affiora.
**Attrezzi**
- [x] L17. (15/11) `gioca.mjs` apre il gioco con `?debug=1&veloce=8`: passi, attese di lotta e dialoghi
      durano un ottavo (`pace()` in game.js). `--lento` per la velocità vera.
- [x] L18. (15/11) `gioca.mjs` preme i bottoni con `press()`: se al loro posto sullo schermo c'è altro lo
      segnala come problema («non si può toccare: coperto da …»).
- [ ] L19. Git avvisa a ogni commit sui fine riga (LF/CRLF): un `.gitattributes` lo zittisce.

## M. Segnalate da Jacopo il 15/11 notte
- [x] M1. (15/11) Macchia viola sotto il DJ: era il foglio, non il gioco. Le righe di `dj.png` avevano un
      passo di ~28 pixel invece di 32, quindi nella cella della vista di lato entrava il cappello della
      vista sotto. Stesso difetto, più piccolo, su Ivo, Steven, congressista, buttafuori, ciclista,
      turista. `tools/allinea-npc.py` rimette ogni vista nella sua cella con i piedi sulla riga 28 (si
      può rilanciare: i fogli a posto restano identici). Riallineati 23 fogli su 32.
- [x] M2. (15/11) Camminata, primo giro in codice: Oliver passa da 22 a 26 pixel d'altezza (come gli altri),
      il corpo sale di un pixel nei fotogrammi di passo, e tutti i personaggi hanno un'ombra a terra che
      resta ferma. Piedi di tutti sulla stessa riga (prima Oliver stava 3 pixel più in basso degli NPC).
      Da giudicare giocando. Se non basta: rifare il foglio con un passo esagerato (ginocchio alto, gambe
      ben aperte, braccia larghe) e polvere quando corre.

## N. Decisioni di Jacopo del 16/11
- [x] N1. «Segaccio lascialo solo a un allenatore, difficile da raggiungere»: resta al ciclista Renzo di
      Borgo Chiaro (Puledrotto 8, Segaccio 9), spostato in una radura a nord-est chiusa da due file di
      alberi, con un solo varco in (54, 8). Gino a Monticelli ora ha Pito 5 e Tamburino 6.
- [x] N2. `gioca.mjs`: il passo del giocatore automatico rilascia il tasto appena il passo parte. Tenendolo
      fino in fondo ne concatenava un secondo, e a velocità di prova Oliver usciva dalla chiazza d'erba
      («400 passi e nessun incontro», ogni volta su una mappa diversa: falso allarme).

## D. Suono (dopo)
- [ ] D1. Effetti chiptune e 3-4 temi (città, percorso, lotta, vittoria) generati in WebAudio.

## Ordine
A1 → B0 (decisione) → C1-C2 (non dipendono dai tile) → B1-B3 → C3-C4 → B4 → A2-A3 → D.
Ogni blocco: test verdi, `build-gioco.mjs`, verifica in Chrome, commit; il push è la pubblicazione.

## Vincoli
- Resta statico, zero dipendenze, giocabile da `file://`: niente Phaser o simili — il motore c'è già,
  manca l'arte. Un framework costringerebbe a riscrivere 70 KB di `game.js` per lo stesso risultato.
- Niente tile estratti dai giochi ufficiali: il sito è pubblico. Arte originale o con licenza libera.

---

# Piano: dalla trama "prime due palestre" a una demo giocabile

Approvato il 20/08/2026; riscritto il 20/08/2026 dopo il completamento dei punti 1-3.

## Fatto (20/08/2026, commit 795bf80 → eb357db)
- Demo originale congelata in `Wikascolemon/demo/` (online a `/demo`).
- `Trama/bibbia.md`: 8 palestre, cast con nomi di gioco, percorso, squadre, specie nuove (proposte).
- `Pokemon_Ascoli/ARCHITETTURA.md`: contratti fra moduli.
- Fonte unica: `tools/build-dex.mjs` → `species.js` (57) + `moves.js` (274) dalla wiki; `data.js` senza specie.
- Moduli puri con test: `battle.js` (Gen 3: stati, critici, STAB, priorità, PP, IA, cattura, exp), `events.js` (flag, script, runner), `trainers.js` (15 classi, 8 allenatori, 2 palestre).
- `game.js` integrato: lotte allenatori con sguardo, soldi, bar-cura, tabacchi, medaglie, scheda Allenatore, save v2 con migrazione, Bobby che dà lo starter per luogo.
- Configuratori: mappa vera (POI Palestra + precompila 8); pixel (strumenti Allenatore e Palestra, validazione, export/import → override `pokemonAscoliTrainersV1`).
- Verifica in Chromium headless: partita reale, 2 bug corretti; 7 suite verdi.

## Piano di implementazione F3 → D (flottiglia) → D4 → B1

Regole della flottiglia: Fable orchestra; τ facile → Sonnet, medio → Opus, difficile → Fable.
Ogni agente possiede file disgiunti, non committa, lascia i test verdi; dopo ogni ondata verifica
scettica in Chromium e commit.

### F3. Online subito a `/gioco` (sequenziale, 1 agente)
- [x] F3.1 τ=facile/Sonnet — `tools/build-gioco.mjs`: copia in `Wikascolemon/gioco/` i file di gioco
      (`index.html`, `game.js`, `data.js`, `species.js`, `moves.js`, `trainers.js`, `battle.js`, `events.js`,
      `styles.css`, `configuratore.*`, `assets/`, `README.md`), cancellando prima la destinazione;
      verifica che i link wiki `../<id>.html` risolvano da lì (→ `Wikascolemon/<id>.html`).
      `tests/regression.mjs`: se `Wikascolemon/gioco/` esiste, i file devono essere identici ai sorgenti
      (così nessuno edita la build a mano). → verifica: `node tools/build-gioco.mjs && node tests/regression.mjs`.
- [x] F3.2 τ=facile/Sonnet — `Wikascolemon/index.html`: riquadro «Gioca» con due link (`gioco/` = in
      sviluppo, `demo/` = demo originale) nello stile della pagina; `README.md` della wiki idem.
- [x] F3.3 Orchestratore — commit, push, controllo che https://g95g95.github.io/Wikascolemon/gioco/ parta
      (title screen, nuova partita, Bobby).

### D0. Preparazione per la flottiglia (sequenziale, prima di D1-D2)
- [x] D0.1 τ=medio/Opus — spezzare `data.js`: ogni mappa in `maps/<id>.js` che fa
      `window.PokemonAscoliMaps = window.PokemonAscoliMaps || {}; window.PokemonAscoliMaps.<id> = {...}`
      usando helper condivisi in `maps/_helpers.js` (`building, rect, zone, transition, npc, city, wide, tall`);
      stesso split per gli allenatori: `trainers/<mapId>.js` che estende `window.PokemonAscoliTrainers.trainers`
      con `Object.assign` (classi e gyms restano in `trainers.js`);
      `data.js` tiene tile/start/items e fa `maps: window.PokemonAscoliMaps`; `index.html`/`configuratore.html`
      caricano `maps/_helpers.js` + un `<script>` per mappa + un `<script>` per file allenatori;
      `tests/regression.mjs` e `tests/trainers.test.mjs` caricano i file in vm e tolgono il vincolo «7 mappe» (→ «≥ 7»).
      `tools/build-gioco.mjs` copia anche `maps/` e `trainers/`. → verifica: tutti i test verdi, gioco identico a prima.
- [x] D0.2 τ=facile/Sonnet — `drawTile` in `game.js`: nuovi tile `sabbia`, `mare` (blocca, come water),
      `pendio` (percorribile, righe oblique), `asfalto`, `binari` (blocca), `ghiaia`, `pavimento` (interni),
      `albero` (già blocca, ora disegnato); stessa palette Gen 3; il configuratore li elenca nel select
      `tileType` e in `colorForTile`. → verifica: `node --check`, screenshot in Chromium di una mappa di prova.
- [x] D0.3 τ=facile/Sonnet — `tests/maps.test.mjs`: per ogni mappa, oltre ai controlli esistenti: ogni
      `door` adiacente all'edificio e percorribile; tabella incontri con livelli dentro la fascia dichiarata
      in `map.levelRange` (nuovo campo `[min,max]`); ogni allenatore di quella mappa dentro i limiti e su
      cella percorribile; ogni script/`when` valido (`validateScript`); percorso a piedi BFS dalla stazione
      a ogni mappa raggiungibile (ignorando `when`). Il test gira già su Ascoli.
- [x] D0.5 τ=medio/Opus (richiesta del 20/08: «quartieri troppo piccoli») — scala ×3 delle 7 mappe
      (`city` 144×108, `wide` 180×120, `tall` 144×120) con `tools/scale-maps.mjs`, cornice e boschetti di
      `albero`, `levelRange`, BFS di raggiungibilità in `regression.mjs`.
- [x] D0.6 τ=medio/Opus (richiesta del 20/08: «scritte sgranate») — etichette dei luoghi in un livello HTML
      `#labelLayer` sopra il canvas invece di `fillText` sul canvas 240×160.
- [x] D0.4 Orchestratore — `Trama/bibbia.md` §3 → tabella di consegna per agente: id mappa, dimensioni,
      mappe confinanti con coordinate dei passaggi (decise QUI, così due agenti vicini combaciano),
      landmark, specie e livelli, allenatori (classe, squadra, posizione indicativa), script richiesti.
      Le coordinate dei passaggi sono l'unico accoppiamento fra agenti: vanno fissate prima.

### D1-D2. Mappe — ondata parallela (un agente per mappa: `maps/<id>.js` + `trainers/<id>.js`)
Ondata eseguita il 20/08/2026 (10 agenti, commit 3a6e40b), verificata (ca5e4bb). Tutte le righe ✅.

| Agente | Mappa | τ/modello | Note |
|---|---|---|---|
| D1-a | `porta_maggiore` + `centro_storico` (ritocco) | medio/Opus | Bar Callare Centro, Ventidio con `door` + script «chiuso per riprese» → flag `ventidio_visto`; corriera per Ripatransone alla stazione (`transition` con `when`) |
| D1-b | `campo_parignano` + `porta_cartara` (ritocco) | facile/Sonnet | Happy Coffee Centro; cartelli «Sant'Emidio alle Grotte» / «Rio Castellano» come luoghi-starter (lore, lo starter lo dà Bobby) |
| D2-a | `ripatransone` | medio/Opus | colline con filari, piazza, bar; incontri Pef'na, Pətò raro; 1 allenatore; solo corriera |
| D2-b | `marino_del_tronto` | medio/Opus | Salaria «Percorso 1», L4-7; 3 allenatori; `when:{flag:'ventidio_visto'}` all'ingresso da Monticelli |
| D2-c | `oasi` | medio/Opus | laghetto, canneto, L5-8; 2 allenatori; incontri in acqua (pesca) |
| D2-d | `maltignano` | medio/Opus | salita a tornanti con `pendio`, L7-10; 3 allenatori + rivale Nando (script, lotta 2) |
| D2-e | `castel_di_lama` + `palestra_castel_di_lama` (interno) | difficile/Fable | città + edificio Free Spirit con `interior:'gym'` → warp nell'interno; interno con 2 allievi e Hills; script medaglia 1 + MT; dialogo post-sconfitta |
| D2-f | `spinetoli_centobuchi` | facile/Sonnet | pianura, L12-16; 4 allenatori; ingresso con `when:{badge:1}` |
| D2-g | `costa` | difficile/Fable | Ristoro al Porto (bar), spiaggia con `sabbia`/`mare`, L15-19; 5 allenatori; script Ivo e Teo (agguato respinto); passaggio allo Jonathan |
| D2-h | `jonathan` + `palestra_costa` (interno) | difficile/Fable | discoteca: 3 Bro della Security a catena, rivale Nando (lotta 3) all'ingresso, Riccio; medaglia 2; titoli di coda della demo (overlay `creditsScreen`: unico tocco a `game.js`/`index.html`, assegnato solo a questo agente) |

Ogni agente: legge la riga di D0.4, `ARCHITETTURA.md`, una mappa esistente come modello; consegna mappa,
allenatori, script; `node tests/*.mjs` verdi; screenshot della mappa dal configuratore.
- [x] D-verifica τ=difficile/Fable — playthrough in Chromium stazione → medaglia 2 (con livelli forzati),
      controllo dei passaggi fra mappe adiacenti, dei blocchi `when`, di ogni allenatore (sguardo), delle
      due palestre. Poi commit.

### D4. Script di trama trasversali (sequenziale, dopo D1-D2)
- [x] D4.1 τ=medio/Opus — intro: arrivo in treno (schermata nera → binari → Bobby che aspetta), nome
      giocatore (prompt nell'overlay titolo), Steven ed Elena al bar che spiegano il piano (3-4 pagine),
      Bobby: scelta del luogo (già fatto) + benedizione. Rivale Nando, lotta 1 subito fuori dal bar.
- [x] D4.2 τ=facile/Sonnet — testi degli NPC di colore delle 7 mappe di Ascoli riallineati alla trama
      (degrado, bande, bar chiusi), 2-3 NPC per mappa.
- [x] D4.3 τ=medio/Opus — tabella `Trama/flag.md`: tutti i flag usati, chi li imposta, chi li legge;
      test che ogni flag letto sia impostato da qualche script (e viceversa).

### B1. Specie nuove (parallela, 4 agenti + 1 per le mosse; nessun file in comune)
Numeri **#057-#064** (#055 Vlurde e #056 Moccolo presi il 20/08). Nomi da confermare da bibbia §5.
Eseguita il 20/08/2026: pubblicate come #060-067 (un'altra sessione aveva preso #057-059 nel frattempo: rinumerate al merge), tabelle incontri aggiornate (06dd129). Nota: Sorcì/Sorcione e Cavedì/Cavedòne sono mono-tipo come da bibbia; Ciuciòne ha una mossa esclusiva «Bricioleria» catalogata.
⚠️ **I numeri di questa sezione sono quelli del piano del 20/08 e non valgono più**: dal 22/08/2026 la linea sta a #061-#068 (Trecaciare #054 ha spostato di uno tutto il blocco da Pətò in poi). I numeri veri sono nei file di `Wikascolemon/`, non qui.

| Agente | Linea | τ/modello |
|---|---|---|
| B1-a | #057 Ciucì → #058 Ciuciòne (Normale/Volante, 245→400, ev. L18) | medio/Opus |
| B1-b | #059 Sorcì → #060 Sorcione (Normale, 235→390, L20) | medio/Opus |
| B1-c | #061 Zanzì → #062 Zanzarax (Coleottero/Veleno, 220→385, L10) | medio/Opus |
| B1-d | #063 Cavedì → #064 Cavedòne (Acqua, 240→410, L25) | medio/Opus |
| B1-e | catalogare le 7 mosse inventate in `tools/moves-catalog.json` + decidere in `dex-overrides.json` quali evoluzioni non standard supporta la demo (night/friendship/item) e quali restano lore | difficile/Fable |

Ogni agente B1-a..d: skill `crea-scheda` (artwork via `codex exec`), learnset coerente con
`moves-catalog.json`, bozza in `schede _Pokemon/`, NON pubblica. L'orchestratore pubblica in sequenza con
`pubblica-scheda` (index/README/dexnav sono file condivisi), rigenera il dex, aggiorna `trainers/` (Hills
usa `zanzi` al posto del secondo Mucillax) e le tabelle incontri di Marino/Oasi/Maltignano/Rio Castellano.
- [x] B1-verifica — `node tools/build-dex.mjs`, test verdi, 8 schede online.

### E. Asset
- [x] E1. Sprite battaglia front/back per le specie usate nella demo: 33 linee generate il 20/08 con Codex (48 specie coperte su 48 usate).
- [x] E2. (parziale: 17 fogli su 23 — mancano `bro_security`, `dj`, `turista`, `congressista`, `rivale`, `capopalestra`: quota Codex esaurita fino al 23/08; il motore ripiega sui rettangoli colorati) Sprite overworld 4 direzioni (`assets/npc/<sprite>.png`, formato di `oliver-sheet.png`) per Bobby, Steven, Elena, Nando, Hills, Riccio e per le 15 classi; `game.js` li carica già se esistono.
- [ ] E3. Icone medaglie, schermata titolo, suono (opzionale — non fatto).

### F. Rifinitura e pubblicazione
- [x] F1. (coperto da D1-D2 e D4.2; rifinitura redazionale ancora possibile) Testi e dialoghi definitivi di tutti gli NPC della demo (italiano con colore ascolano).
- [x] F2. (`tools/simulate-balance.mjs`, exp ×1.8, Hills L9-12) Bilanciamento: L14-15 alla 1ª palestra, L21-22 alla 2ª senza grinding; curva exp cubica già attiva.
- [x] F3. Build in `Wikascolemon/gioco/` + link dall'indice della wiki; deploy. (Può essere anticipata per far provare lo stato attuale.)
- [x] F4. (`tests/e2e/`, PLAYTHROUGH OK in ~14 min il 20/08) Test di playthrough scriptato in Chromium (riusare lo script del verificatore dalla scratchpad, portarlo in `tests/e2e/` con `playwright-core` come dipendenza di sviluppo opzionale) che percorre stazione → 2ª medaglia.
- [x] F5. Aggiornare `CLAUDE.md`, README del gioco, brief.

### G. Roadmap oltre la demo (non in questo piano)
Palestre 3-8, sottotrama San Giacomo, Polesio e Di Silvestro, Lega, leggendario (picchio/Sibilla/Pretalien), porting a pokeemerald-expansion.

## Ordine
F3 → D0 → D1-D2 (flottiglia, 10 agenti) → D-verifica → D4 → B1 (flottiglia, 5 agenti) → E → F1-F2 → F4-F5.

## Criteri di accettazione della demo
- Si gioca da `file://` e da GitHub Pages, zero dipendenze.
- Trama eseguibile come in `Trama/trama_prime_due_palestre.md`.
- Nessun nome di persona reale nei testi di gioco.
- Tutti i dati di gioco da JSON/JS generati o validati dai test.

---

# Piano: Cerqua (evoluzione di Totera) → #044, con slittamento di +1 di tutto il blocco successivo

⚠️ *Verbale di un piano già eseguito il 20/08/2026: la tabella qui sotto fotografa quella rinumerazione. Il 22/08 ce n'è stata un'altra (Trecaciare #054), quindi da #054 in su questi numeri sono superati.*

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
