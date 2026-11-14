# Changelog — Pokémon Ascoli (gioco browser)

Gioco: https://g95g95.github.io/Wikascolemon/gioco/ · Configuratore: `…/gioco/configuratore.html`

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
- **Arredo.** Si possono piazzare cespugli, massi, fiori, lampioni, panchine, cartelli, fontane,
  staccionate, muretti, siepi, tavolini, ulivi, cipressi, ombrelloni e barche. Fanno da ostacolo
  (tranne i fiori). Per ora nessuna mappa pubblicata ne ha: vanno disegnati nel configuratore.
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

### Da fare
- Sprite per gli NPC: molti sono ancora rettangolini colorati.
- Erba alta a chiazze invece che a prati interi; arredo nelle mappe.
- Menu di pausa e Borsa in stile, schermata titolo, transizioni fra mappe, suono.
- Il playthrough automatico (`tests/e2e`) va aggiornato a nuove coordinate e nuovo movimento.
