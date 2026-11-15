# Changelog — Pokémon Ascoli (gioco browser)

Gioco: https://g95g95.github.io/Wikascolemon/gioco/ · Configuratore: `…/gioco/configuratore.html`

## 15/11/2026 — Terzo giro di test

- **Mappe ancora più raccolte**, sempre senza toccare la misura di case e strade: un secondo giro ha
  tolto altro spazio vuoto, anche i margini attorno a edifici e persone. I quartieri ora vanno da
  57×50 a 112×61 celle. Chi aveva una partita riparte dalla stazione (squadra e progressi restano).
- **Incontri solo dove c'è l'erba alta.** Prima capitavano anche sulla strada quando l'erba alta stava
  ai due lati, e al Centro Storico capitavano sul selciato. Ora mai su strade, piazze e ponti; al
  Centro Storico sono comparse delle aiuole d'erba alta.
- **Niente più muri invisibili**: i personaggi nascosti (Bobby, Elena e Steven dopo l'introduzione)
  continuavano a bloccare le celle dove erano stati.
- **La Ball del tuo Pokémon ora si vede**: partiva durante il lampo d'ingresso in lotta, che la copriva.
- **Case visitabili.** Si entra in tutte le «Casa…»: una stanza con la padrona di casa. Per ora è
  arredata con i mobili che ci sono; letto, divano e cucina arriveranno con un foglio dedicato.
- Le case comuni non hanno più il cartello col nome; i bar riconosciuti dal nome hanno l'insegna.

## 14/11/2026 (tarda notte) — Dopo il secondo test di Jacopo

- **Mappe raccolte, elementi a misura piena.** La riduzione precedente rimpiccioliva anche case e
  strade: sbagliato. Ora si riparte dalle mappe originali e si toglie solo lo spazio vuoto (righe e
  colonne di prato): case, strade, piazze e ponti hanno di nuovo la misura giusta, le distanze fra
  loro si accorciano. I quartieri vanno da circa 76×56 a 131×71 celle, ognuno con la sua misura.
  ⚠️ Chi aveva una partita salvata riparte dalla stazione (squadra e progressi restano).
- **Niente più scritte sullo schermo.** Uscite e nomi dei luoghi sono cartelli da leggere; i bordi
  della mappa non sono più evidenziati in giallo.
- **Cartelli lontani dalla porta** (due celle), così non coprono l'ingresso.
- **Case e alberi a posto**: l'erba alta si ferma a una cella dagli edifici, e gli alberi che i
  vecchi dati mettevano sopra i tetti non ci sono più. Gli incontri capitano solo dove l'erba alta si vede.
- **Oliver cammina davvero**: i fotogrammi del passo erano quasi identici, quindi sembrava scivolare.
  Ora alza un piede alla volta, e il passo ha il ritmo dei giochi di terza generazione.
- **La Ball anche per il tuo Pokémon**: quando entra in campo la Ball arriva da sinistra, si apre e
  lui compare.
- **Colonna sonora** provvisoria: un giro lento e rilassato, sintetizzato. Si spegne da Impostazioni.
- In lotta il messaggio non finisce più sotto il menu.
- **Corretto il blocco negli interni**: premendo A mentre Oliver stava ancora facendo il passo verso
  la porta si entrava nella stanza con le coordinate della mappa esterna, cioè fuori dallo schermo e
  senza poter uscire. Chi è rimasto bloccato così torna alla stazione ricaricando la pagina.

## 14/11/2026 (notte) — Interni e suoni

- **Si entra nei bar e nei tabacchi.** Camminando contro la porta (o premendo A) si entra in una
  stanza arredata: al bar il barista dietro il bancone cura la squadra, al tabacchi il tabaccaio alla
  cassa apre il negozio. Si parla attraverso il bancone, come nei giochi Pokémon. Uscendo dallo zerbino
  si torna davanti alla porta da cui si è entrati. Per ora tutti i bar condividono la stessa stanza, e
  così i tabacchi.
- **Effetti sonori provvisori**, sintetizzati (nessun file audio): conferma, urto, colpo, KO, cura,
  lancio e cattura della Ball, incontro, cambio mappa, fruscio dell'erba, esperienza, salita di
  livello, vittoria e sconfitta. Si disattivano da Menu → Impostazioni.

## 14/11/2026 (sera) — Dopo il primo test di Jacopo

- **Oliver non va più a scatti.** La causa era il foglio dello sprite: i fotogrammi della camminata
  erano sfalsati di 4-5 pixel l'uno dall'altro, quindi a ogni passo il personaggio saltava di lato.
  Riallineati. In più la telecamera ora si muove a pixel interi (niente sfarfallio del terreno).
- **Mappe ancora più raccolte**: un altro quarto in meno. I quartieri sono 72×54 celle, i più grandi
  90×60 (all'inizio della giornata erano 144×108 e 180×120). Salvataggi riposizionati da soli.
- **Cartelli al posto delle scritte.** I nomi degli edifici non galleggiano più sullo schermo: accanto
  alla porta c'è un cartello che si legge con A. Le case comuni non hanno nome. (7 edifici su una
  sessantina non hanno ancora il cartello: davanti non c'era una cella libera.)
- **NPC fermi, allenatori che si muovono.** I passanti non vagano più a scatti. Gli allenatori, quando
  ti vedono, ti vengono incontro camminando davvero (prima restavano fermi per un difetto) e nel
  frattempo Oliver non può muoversi. Tutti hanno un campo visivo, tranne i due capipalestra che si
  sfidano parlandoci.
- **Tifotto ha il suo sprite.** I file di Tifotto contenevano l'arte di Anicino: Anicino ha riavuto
  il suo, e Tifotto ne ha uno provvisorio ricavato dall'artwork della wiki (il retro è il fronte
  specchiato, in attesa di uno sprite vero).
- **Lancio della Ball animato**: arco verso l'avversario, il Pokémon rientra, la Ball cade, uno
  scossone per ogni tentativo, poi si chiude o si riapre.
- **Fruscio dell'erba alta** quando ci si entra.
- **Barra dell'esperienza** che si riempie a fine lotta; se si sale di livello arriva in fondo e riparte.
- **Mappa della regione** nel menu (provvisoria): schema dei luoghi e dei collegamenti, con la
  posizione attuale, le palestre e la corriera per Ripatransone.

## 14/11/2026 — Nuova grafica, nuova interfaccia, mappe più raccolte

### Mondo di gioco
- **Motore a tileset.** Il mondo non è più fatto di rettangoli colorati: terreni disegnati (erba con
  varianti e fiori, sterrato, piazza, travertino, asfalto, ghiaia, sabbia, binari, ponte), bordi
  automatici fra erba, strada e acqua, acqua e mare animati.
- **Erba alta visibile** nelle zone d'incontro: copre i piedi di Oliver quando ci cammina dentro.
- **Alberi ed edifici veri.** Tetto a coppi, muro in pietra tinto col colore dell'edificio, porte
  diverse per chiese, negozi e case, finestre con persiane, vetrine. Insegne sopra la porta (bar,
  tabacchi, palestra, croce verde), rosone sulle chiese, tetti piatti o in lamiera per ospedale,
  stazione e capannoni, gradinate allo stadio.
- **Arredo.** Tutti i quartieri esterni sono arredati (circa 1600 oggetti): lampioni lungo le
  strade, fontane e panchine nelle piazze, tavolini davanti ai bar, fiori agli angoli delle case,
  cespugli, siepi e cipressi nel verde, ulivi e massi in campagna, ombrelloni e barche sulla
  spiaggia della Costa. Gli oggetti fanno da ostacolo (tranne i fiori). È una prima sistemazione
  automatica, da ritoccare a mano nel configuratore.
- **Erba alta a chiazze.** Le zone d'incontro non sono più prati interi: l'erba alta copre circa il
  40% della zona e si può aggirare. Per compensare, la probabilità d'incontro per passo è salita di metà.
- **Mappe ridotte ai due terzi.** I quartieri erano troppo grandi da attraversare: da 144×108 /
  180×120 celle a 96×72 / 120×80. Le palestre interne non sono cambiate. I salvataggi esistenti
  vengono riposizionati da soli.

### Oliver
- **Movimento fluido**: velocità costante, passi concatenati senza pause, animazione a due
  fotogrammi per cella.
- **Corsa**: Maiusc sulla tastiera, B tenuto premuto sul telefono.
- **Giro sul posto**: un colpetto in un'altra direzione fa solo voltare Oliver, come nei giochi Pokémon.

### Pokémon e lotta
- **Scheda del Pokémon**: cliccando un Pokémon in Squadra o Deposito si vedono tipi, stato,
  statistiche, esperienza (con i punti mancanti al livello successivo) e le mosse con tipo, categoria,
  potenza, precisione, PP e descrizione.
- **Schermata Squadra** a riquadri: capofila grande a sinistra, gli altri in colonna, barre PS
  colorate, KO in rosso.
- **Lotta ridisegnata**: sfondo con pedane, barre PS verde/gialla/rossa animate, barra esperienza,
  menu LOTTA/BORSA/SQUADRA/FUGA, mosse con tipo e PP. Avversario in alto a destra, il proprio Pokémon
  in basso a sinistra.
- **Esperienza corretta**: i Pokémon catturati partivano da zero esperienza e salivano di livello
  lentissimamente (un Lv.12 doveva fare 2197 punti invece di 469). I salvataggi vengono riallineati.

### Interfaccia
- **Dialoghi** in un riquadro in basso con il nome di chi parla, testo a macchina da scrivere e
  freccia per continuare.
- **Font pixel** (VT323, licenza libera) al posto del Courier.
- Dialoghi, lotta e Squadra si ridimensionano con la finestra di gioco, anche su telefono.

### Configuratore
- Mostra la mappa **esattamente come nel gioco** (stesso codice di disegno).
- **Zoom** (tutta la mappa / 100% / 200%), strumento **Arredo**, pennelli fino a 15 celle;
  lo strumento Incontri con probabilità 0 toglie l'erba alta.
- ⚠️ Le modifiche restano nel browser di chi le fa: per portarle a tutti vanno esportate
  (Dati → Esporta JSON) e riversate nei file delle mappe.
- ⚠️ Con la riduzione delle mappe le modifiche locali salvate prima del 14/11 non valgono più.

### Come nasce la grafica
- Terreni e bordi sono disegnati in codice (`tools/build-tileset.py`).
- Alberi, pezzi di edificio e arredo vengono da fogli generati con ChatGPT immagini (grafica
  originale, nessun asset di giochi esistenti) e ritagliati con `tools/build-oggetti.py`.
  Finora due fogli, 32 oggetti.

### Personaggi
- **Niente più rettangolini.** Tutti gli NPC hanno uno sprite: otto personaggi nuovi (anziano,
  signora, ragazzo, infermiera, barista, gitante, bambina, vigile), i cartelli sono cartelli veri, e
  chi ha un mestiere usa lo sprite giusto (pescatore, bagnino, contadino…).

### Da fare
- Altri passanti per variare ancora le facce nei quartieri.
- Ritoccare a mano arredo ed erba alta, quartiere per quartiere.
- Menu di pausa e Borsa in stile, schermata titolo, transizioni fra mappe, suono.
- Il playthrough automatico (`tests/e2e`) va aggiornato a nuove coordinate e nuovo movimento.
