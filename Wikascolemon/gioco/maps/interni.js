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
      script: [{ say: 'Che te faccio?', name: 'Barista' }, { heal: true }, { say: 'Ecco fatto! La squadra è come nuova.', name: 'Barista' }]
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

  // Chiesa: altare in fondo, corsia centrale, banchi ai lati.
  window.PokemonAscoliMaps.interno_chiesa = room({
    name: 'Chiesa', floor: 'pavimento_scacchi',
    decor: [
      d(2, 1, 'finestra_tende'), d(6, 1, 'quadro'), d(11, 1, 'finestra_tende'),
      d(1, 2, 'pianta'), d(6, 2, 'tavola'), d(13, 2, 'pianta'),
      d(6, 4, 'tappeto'), d(6, 6, 'tappeto'),
      ...[4, 5, 6, 7].flatMap(y => [d(2, y, 'panchina'), d(10, y, 'panchina')]),
      d(7, 9, 'zerbino')
    ],
    npcs: [{
      x: 7, y: 3, name: 'Parroco', sprite: 'anziano', movement: 'fermo',
      dialogue: ['Pace e bene, figliolo.', 'Qui si entra in silenzio: lo sanno pure i Pokémon.']
    }]
  });

  // Ospedale: l'accettazione cura la squadra, come al bar.
  window.PokemonAscoliMaps.interno_ospedale = room({
    name: 'Ospedale', floor: 'pavimento_scacchi',
    decor: [
      d(3, 1, 'quadro'), d(10, 1, 'finestra_tende'),
      d(1, 2, 'pianta'), d(10, 2, 'armadio'), d(13, 2, 'pianta'),
      d(6, 4, 'cassa'),
      d(1, 6, 'letto'), d(3, 6, 'comodino'), d(1, 8, 'letto'), d(3, 8, 'comodino'),
      d(12, 6, 'letto'), d(11, 6, 'comodino'), d(12, 8, 'letto'), d(11, 8, 'comodino'),
      d(7, 9, 'zerbino')
    ],
    npcs: [{
      x: 6, y: 3, name: 'Infermiera', sprite: 'infermiera', movement: 'fermo',
      script: [{ say: 'Benvenuto in ospedale. Dai qua la squadra, ci penso io.', name: 'Infermiera' }, { heal: true }, { say: 'Ecco fatto: stanno tutti bene.', name: 'Infermiera' }]
    }]
  });

  // Cinema: lo schermo sulla parete di fondo, tre file di poltroncine con la corsia in mezzo.
  window.PokemonAscoliMaps.interno_cinema = room({
    name: 'Cinema', floor: 'pavimento_legno',
    decor: [
      d(4, 1, 'quadro'), d(6, 1, 'quadro'), d(8, 1, 'quadro'),
      d(1, 2, 'pianta'), d(13, 2, 'pianta'),
      ...[4, 5, 6].flatMap(y => row([2, 3, 4, 5, 9, 10, 11, 12], y, 'sedia')),
      d(7, 9, 'zerbino')
    ],
    npcs: [{
      x: 9, y: 8, name: 'Maschera', sprite: 'ragazzo', movement: 'fermo',
      dialogue: ['Il film è già cominciato, ma siediti pure dove vuoi.', 'I Pokémon entrano gratis. I popcorn no.']
    }]
  });

  // Pizzeria: forno e cucina in fondo, banco a destra, tavoli in sala.
  window.PokemonAscoliMaps.interno_pizzeria = room({
    name: 'Pizzeria', floor: 'pavimento_cotto',
    decor: [
      d(8, 1, 'quadro'),
      d(1, 2, 'camino'), d(4, 2, 'fornello'), d(5, 2, 'lavello'), d(13, 2, 'pianta'),
      d(9, 4, 'bancone'), d(11, 4, 'bancone'),
      d(1, 5, 'tavolo_sedie'), d(4, 6, 'tavolo_sedie'), d(1, 8, 'tavolo_sedie'), d(10, 7, 'tavolo_sedie'), d(12, 8, 'tavolo_sedie'),
      d(7, 9, 'zerbino')
    ],
    npcs: [{
      x: 10, y: 3, name: 'Pizzaiolo', sprite: 'barista', movement: 'fermo',
      dialogue: ['Il forno è ancora freddo: si inforna stasera.', 'Ripassa più tardi, che ti tengo un tavolo.']
    }]
  });

  // Stazione: biglietteria a destra, edicola e distributore in fondo, panchine dell'attesa.
  window.PokemonAscoliMaps.interno_stazione = room({
    name: 'Stazione', floor: 'pavimento_scacchi',
    decor: [
      d(11, 1, 'quadro'),
      d(1, 2, 'scaffale_riviste'), d(4, 2, 'frigo'), d(7, 2, 'pendola'), d(13, 2, 'pianta'),
      d(10, 4, 'cassa'),
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
      d(1, 2, 'libreria'), d(4, 2, 'pianta'), d(10, 2, 'pianta'), d(12, 2, 'libreria'),
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
