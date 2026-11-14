# Changelog — Pokémon Ascoli (gioco browser)

Gioco: https://g95g95.github.io/Wikascolemon/gioco/ · Configuratore: `…/gioco/configuratore.html`

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
