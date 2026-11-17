// Interni generici di bar e tabacchi: una stanza per tipo, condivisa da tutti gli edifici di quel
// tipo. Si entra dalla porta di un edificio con `interior: 'bar'` o `'market'` (il collegamento lo
// fa data.js) e uscendo dallo zerbino si torna davanti alla porta da cui si è entrati
// (`save.returnSpot`; il passaggio qui sotto ha `back: true`, e la sua destinazione scritta è solo
// quella di riserva, impostata da data.js sul primo edificio di quel tipo).
(function () {
  const { rect, transition } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  const d = (x, y, kind) => ({ x, y, kind });
  const room = extra => ({
    width: 15, height: 10, indoor: true, baseTile: 'pavimento', levelRange: [1, 1], encounterTable: [],
    roads: [rect(0, 0, 15, 2, 'muro')], // parete di fondo, alta due celle; 15×10 = uno schermo esatto
    waters: [], bridges: [], plazas: [], buildings: [], labels: [], encounterZones: [],
    // l'ingresso mette il giocatore in (7, 8), sopra lo zerbino
    transitions: [transition(7, 9, 1, 1, 'porta_maggiore', 0, 0, 'Uscita', { back: true, direction: 'down' })],
    ...extra
  });

  window.PokemonAscoliMaps.interno_bar = room({
    name: 'Bar', floor: 'pavimento_legno',
    decor: [
      d(6, 1, 'quadro'),
      d(1, 2, 'scaffale_bottiglie'), d(4, 2, 'macchina_caffe'), d(12, 2, 'jukebox'), d(10, 2, 'pianta'),
      d(7, 3, 'pianta'),
      d(1, 4, 'bancone'), d(3, 4, 'bancone'), d(5, 4, 'bancone'),
      d(2, 5, 'sgabello'), d(5, 5, 'sgabello'),
      d(10, 5, 'tavolo_sedie'), d(11, 8, 'tavolo_sedie'), d(1, 8, 'tavolo_sedie'),
      d(7, 9, 'zerbino')
    ],
    npcs: [{
      x: 3, y: 3, name: 'Barista', sprite: 'barista', movement: 'fermo',
      script: [{ say: 'Che te pòrte?', name: 'Barista' }, { heal: true }, { say: 'Ècche fatte! La squadra è come nòva.', name: 'Barista' }]
    }]
  });

  // Casa: cucina a destra, camino al centro, letto a sinistra, salotto in basso a destra.
  window.PokemonAscoliMaps.interno_casa = room({
    name: 'Casa', floor: 'pavimento_cotto',
    decor: [
      d(3, 1, 'finestra_tende'), d(8, 1, 'quadro'),
      d(1, 2, 'libreria'), d(3, 2, 'armadio'), d(6, 2, 'camino'), d(10, 2, 'fornello'), d(11, 2, 'lavello'), d(13, 2, 'pendola'),
      d(1, 5, 'letto'), d(3, 5, 'comodino'),
      d(5, 5, 'sedia'), d(6, 5, 'tavola'), d(8, 5, 'sedia'),
      d(13, 5, 'tv'),
      d(10, 7, 'tappeto'), d(10, 8, 'divano'), d(13, 8, 'poltrona'),
      d(1, 8, 'pianta'),
      d(7, 9, 'zerbino')
    ],
    npcs: [{
      x: 9, y: 4, name: 'Padrona di casa', sprite: 'signora', movement: 'fermo',
      dialogue: ['Oh, un allenatore! Fai come se fossi a casa tua.', 'Se la squadra è stanca, il bar più vicino la rimette in sesto.']
    }]
  });

  // Seconda casa: quella dei nonni. Cucina grande con la tavola al centro, poltrone davanti al camino.
  window.PokemonAscoliMaps.interno_casa_2 = room({
    name: 'Casa', floor: 'pavimento_cotto',
    decor: [
      d(2, 1, 'quadro'), d(6, 1, 'finestra_tende'), d(11, 1, 'quadro'),
      d(1, 2, 'fornello'), d(2, 2, 'lavello'), d(4, 2, 'frigo'), d(8, 2, 'camino'), d(11, 2, 'libreria'), d(13, 2, 'pendola'),
      d(3, 5, 'sedia'), d(4, 5, 'tavola'), d(6, 5, 'sedia'),
      d(9, 4, 'poltrona'), d(11, 4, 'poltrona'), d(9, 6, 'tappeto'),
      d(1, 8, 'pianta'), d(12, 8, 'armadio'),
      d(7, 9, 'zerbino')
    ],
    npcs: [{
      x: 10, y: 5, name: 'Nonno', sprite: 'anziano', movement: 'fermo',
      dialogue: ['Ai tempi miei i Pokémon si andavano a cercare a piedi, mica con la corriera.', 'Siediti, che fra poco è pronto.']
    }]
  });

  // Terza casa: la stanza di un ragazzo. Letto, scrivania con i libri, televisore e divano.
  window.PokemonAscoliMaps.interno_casa_3 = room({
    name: 'Casa', floor: 'pavimento_legno',
    decor: [
      d(4, 1, 'finestra_tende'), d(9, 1, 'quadro'),
      d(1, 2, 'letto'), d(3, 2, 'comodino'), d(6, 2, 'libreria'), d(8, 2, 'libreria'), d(11, 2, 'armadio'), d(13, 2, 'pianta'),
      d(1, 5, 'tavola'), d(3, 5, 'sedia'),
      d(10, 5, 'tv'), d(10, 7, 'tappeto'), d(10, 8, 'divano'),
      d(1, 8, 'pianta'), d(4, 8, 'tavolo_sedie'),
      d(7, 9, 'zerbino')
    ],
    npcs: [{
      x: 12, y: 6, name: 'Ragazzo', sprite: 'ragazzo', movement: 'fermo',
      dialogue: ['Sto guardando la replica della finale della Lega.', 'Un giorno ci arrivo anch\'io, vedrai.']
    }]
  });

  window.PokemonAscoliMaps.interno_tabacchi = room({
    name: 'Tabacchi', floor: 'pavimento_scacchi',
    decor: [
      d(8, 1, 'quadro'),
      d(1, 2, 'scaffale_riviste'), d(3, 2, 'scaffale_riviste'), d(11, 2, 'frigo'), d(13, 2, 'frigo'),
      d(5, 4, 'cassa'), d(7, 4, 'bancone'),
      d(13, 7, 'pianta'), d(1, 7, 'scaffale_riviste'), d(10, 6, 'scaffale_riviste'),
      d(7, 9, 'zerbino')
    ],
    npcs: [{
      x: 5, y: 3, name: 'Tabaccaio', sprite: 'anziano', movement: 'fermo',
      script: [{ say: 'Dimmi pure.', name: 'Tabaccaio' }, { shop: ['ball', 'potion', 'antidote', 'repel', 'grattaevinci'] }]
    }]
  });

  // --- Luoghi della città: una stanza per tipo, come sopra. Arredate con i mobili che ci sono. ---
  const row = (xs, y, kind) => xs.map(x => d(x, y, kind));

  // Chiesa: altare in fondo fra due candelabri, corsia centrale, banchi ai lati, confessionale.
  window.PokemonAscoliMaps.interno_chiesa = room({
    name: 'Chiesa', floor: 'pavimento_scacchi',
    decor: [
      d(2, 1, 'finestra_tende'), d(11, 1, 'finestra_tende'),
      d(4, 2, 'candelabro'), d(6, 2, 'altare'), d(9, 2, 'candelabro'), d(12, 2, 'confessionale'),
      d(6, 4, 'tappeto'), d(6, 6, 'tappeto'),
      ...[4, 5, 6, 7].flatMap(y => [d(2, y, 'banco_chiesa'), d(10, y, 'banco_chiesa')]),
      d(1, 2, 'pianta'),
      d(7, 9, 'zerbino')
    ],
    npcs: [{
      x: 7, y: 3, name: 'Parroco', sprite: 'anziano', movement: 'fermo',
      dialogue: ['Pace e bene, figliolo.', 'Qui si entra in silenzio: lo sanno pure i Pokémon.']
    }]
  });

  // Ospedale: l'accettazione cura la squadra, come al bar. Due corsie di lettini con le flebo.
  window.PokemonAscoliMaps.interno_ospedale = room({
    name: 'Ospedale', floor: 'pavimento_scacchi',
    decor: [
      d(3, 1, 'quadro'),
      d(1, 2, 'pianta'), d(10, 2, 'armadietto_medico'), d(13, 2, 'pianta'),
      d(6, 4, 'cassa'),
      d(1, 5, 'paravento'), d(12, 5, 'paravento'),
      d(1, 6, 'lettino'), d(3, 6, 'flebo'), d(1, 8, 'lettino'), d(3, 8, 'flebo'),
      d(12, 6, 'lettino'), d(11, 6, 'flebo'), d(12, 8, 'lettino'), d(11, 8, 'flebo'),
      d(7, 9, 'zerbino')
    ],
    npcs: [{
      x: 6, y: 3, name: 'Infermiera', sprite: 'infermiera', movement: 'fermo',
      script: [{ say: 'Benvenuto in ospedale. Dai qua la squadra, ci penso io.', name: 'Infermiera' }, { heal: true }, { say: 'Ecco fatto: stanno tutti bene.', name: 'Infermiera' }]
    }]
  });

  // Cinema: lo schermo sulla parete di fondo, tre file di poltroncine, proiettore e popcorn in fondo alla sala.
  window.PokemonAscoliMaps.interno_cinema = room({
    name: 'Cinema', floor: 'pavimento_legno',
    decor: [
      d(6, 1, 'schermo'),
      d(1, 2, 'pianta'), d(13, 2, 'pianta'),
      ...[4, 5, 6].flatMap(y => row([2, 3, 4, 5, 9, 10, 11, 12], y, 'poltroncina')),
      d(12, 8, 'proiettore'), d(2, 8, 'popcorn'),
      d(7, 9, 'zerbino')
    ],
    npcs: [{
      x: 9, y: 8, name: 'Maschera', sprite: 'ragazzo', movement: 'fermo',
      dialogue: ['Il film è già cominciato, ma siediti pure dove vuoi.', 'I Pokémon entrano gratis. I popcorn no.']
    }]
  });

  // Pizzeria: forno e cucina in fondo, banco delle pizze a destra, tavoli in sala.
  window.PokemonAscoliMaps.interno_pizzeria = room({
    name: 'Pizzeria', floor: 'pavimento_cotto',
    decor: [
      d(8, 1, 'quadro'),
      d(1, 2, 'forno'), d(4, 2, 'fornello'), d(5, 2, 'lavello'), d(13, 2, 'pianta'),
      d(9, 4, 'bancone_pizze'), d(11, 4, 'bancone_pizze'),
      d(1, 5, 'tavolo_sedie'), d(4, 6, 'tavolo_sedie'), d(1, 8, 'tavolo_sedie'), d(10, 7, 'tavolo_sedie'), d(12, 8, 'tavolo_sedie'),
      d(7, 9, 'zerbino')
    ],
    npcs: [{
      x: 10, y: 3, name: 'Pizzaiolo', sprite: 'barista', movement: 'fermo',
      dialogue: ['Il forno è appena acceso: si inforna stasera.', 'Ripassa più tardi, che ti tengo un tavolo.']
    }]
  });

  // Stazione: biglietteria a destra, tabellone degli orari, edicola e distributore in fondo, panchine dell'attesa.
  window.PokemonAscoliMaps.interno_stazione = room({
    name: 'Stazione', floor: 'pavimento_scacchi',
    decor: [
      d(1, 2, 'scaffale_riviste'), d(4, 2, 'frigo'), d(6, 2, 'tabellone'), d(13, 2, 'pianta'),
      d(10, 4, 'biglietteria'),
      d(1, 5, 'panchina'), d(4, 5, 'panchina'), d(1, 7, 'panchina'), d(4, 7, 'panchina'),
      d(7, 9, 'zerbino')
    ],
    npcs: [{
      x: 10, y: 3, name: 'Bigliettaio', sprite: 'vigile', movement: 'fermo',
      dialogue: ['Biglietti? Per ora qui i treni arrivano e basta.', 'Se devi andare lontano, chiedi della corriera.']
    }]
  });

  // Palazzo: sala con quadri e librerie, il custode a fare da guida.
  window.PokemonAscoliMaps.interno_palazzo = room({
    name: 'Palazzo', floor: 'pavimento_cotto',
    decor: [
      d(2, 1, 'quadro'), d(5, 1, 'quadro'), d(8, 1, 'quadro'), d(11, 1, 'quadro'),
      d(1, 2, 'libreria'), d(4, 2, 'candelabro'), d(10, 2, 'candelabro'), d(12, 2, 'libreria'),
      d(6, 5, 'tappeto'), d(6, 6, 'tappeto'),
      d(1, 6, 'poltrona'), d(12, 6, 'poltrona'),
      d(7, 9, 'zerbino')
    ],
    npcs: [{
      x: 9, y: 5, name: 'Custode', sprite: 'signora', movement: 'fermo',
      dialogue: ['Benvenuto nel palazzo più antico della piazza.', 'Si racconta che un sapiente leggesse le stelle da queste finestre.']
    }]
  });

  // Emporio del benzinaio: gli stessi articoli dei tabacchi.
  window.PokemonAscoliMaps.interno_emporio = room({
    name: 'Emporio', floor: 'pavimento_scacchi',
    decor: [
      d(8, 1, 'quadro'),
      d(1, 2, 'frigo'), d(3, 2, 'frigo'), d(11, 2, 'scaffale_riviste'), d(13, 2, 'pianta'),
      d(5, 4, 'cassa'),
      d(1, 7, 'scaffale_riviste'), d(11, 7, 'scaffale_riviste'),
      d(7, 9, 'zerbino')
    ],
    npcs: [{
      x: 5, y: 3, name: 'Benzinaio', sprite: 'ragazzo', movement: 'fermo',
      script: [{ say: 'Il pieno non te lo posso fare, ma il resto ce l\'ho.', name: 'Benzinaio' }, { shop: ['ball', 'potion', 'antidote', 'repel', 'grattaevinci'] }]
    }]
  });
}());
