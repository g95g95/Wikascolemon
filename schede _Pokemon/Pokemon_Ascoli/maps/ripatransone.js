(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.ripatransone = {
    ...city, name: 'Ripatransone', baseTile: 'erba', levelRange: [5, 7],
    encounterTable: [{ species: 'pefna', minLevel: 5, maxLevel: 7, weight: 55 }, { species: 'tamburino', minLevel: 5, maxLevel: 7, weight: 30 }, { species: 'peto', minLevel: 6, maxLevel: 7, weight: 15 }],
    roads: [
      rect(0, 54, 144, 4, 'asfalto'),
      // strada che sale dalla fermata verso il borgo in collina
      rect(20, 24, 4, 30, 'asfalto'),
      rect(20, 24, 40, 4, 'asfalto'),
      // strada che scende verso il belvedere a est
      rect(56, 24, 4, 20, 'asfalto'),
      rect(56, 40, 60, 4, 'asfalto'),
      rect(112, 40, 4, 16, 'asfalto')
    ],
    waters: [], bridges: [], plazas: [rect(24, 10, 32, 14, 'piazza')],
    buildings: [
      building(28, 12, 8, 6, 'Bar del Belvedere', '#b46c52', 'attività', { door: { x: 31, y: 18 }, interior: 'bar' }),
      building(42, 12, 10, 8, 'Chiesa di San Gregorio', '#c5a677', 'chiesa'),
      building(38, 44, 8, 6, 'Casa dei Peviani', '#9b7a57'),
      building(70, 44, 8, 6, 'Casa dei Sagratti', '#a08360'),
      building(96, 44, 8, 6, 'Casa dei Cameli', '#9b7a57')
    ],
    labels: [
      { x: 5, y: 51, text: 'Fermata corriera' },
      { x: 27, y: 9, text: 'Piazza di Ripatransone' },
      { x: 118, y: 39, text: 'Belvedere sul mare' }
    ],
    encounterZones: [
      zone(2, 2, 16, 50, 0.08, 'default'),
      zone(66, 2, 76, 20, 0.08, 'default'),
      zone(2, 60, 140, 46, 0.1, 'default'),
      zone(90, 58, 50, 46, 0.06, 'default')
    ],
    transitions: [
      transition(0, 54, 2, 4, 'porta_maggiore', 9, 31, 'Corriera per Ascoli')
    ],
    npcs: [
      npc(7, 52, 'Cartello', 'Fermata corriera — per Ascoli Piceno.', 'fermo'),
      {
        x: 34, y: 20, name: 'Anziano del borgo', movement: 'fermo',
        script: [{ say: ['Chi arriva a Ripatransone giusto pé l\'ottava di Pasqua vede lu Cartellone, la scena più granne dipinta a mano.', 'E se guardi bbene quaggiù, sotto lu paese, li Puledrotto currono ancora com\'a la mejo squadra: qui s\'allenano da sempre.'], name: 'Anziano del borgo' }]
      },
      npc(50, 21, 'Massaia', 'Su a la piazza c\'è sempre n\'ariata bbona, mo\' che sò salita da le vigne.', 'fermo'),
      npc(100, 50, 'Pescatore', 'Da lu belvedere se vede fino a lu mare, quanno è chiaro.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.ripatransone;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta solo dal passaggio ovest
    rect(2, 0, 142, 2, 'albero'), rect(0, 2, 2, 52, 'albero'), rect(0, 58, 2, 50, 'albero'),
    rect(0, 106, 144, 2, 'albero'), rect(142, 2, 2, 104, 'albero'),
    // filari sulle colline a sinistra della strada principale (righe orizzontali alternate)
    rect(4, 4, 14, 1, 'albero'), rect(4, 7, 14, 1, 'albero'), rect(4, 10, 14, 1, 'albero'),
    rect(4, 13, 14, 1, 'albero'), rect(4, 16, 14, 1, 'albero'), rect(4, 19, 14, 1, 'albero'),
    rect(4, 30, 14, 1, 'albero'), rect(4, 33, 14, 1, 'albero'), rect(4, 36, 14, 1, 'albero'),
    rect(4, 39, 14, 1, 'albero'), rect(4, 42, 14, 1, 'albero'), rect(4, 45, 14, 1, 'albero'),
    // vigneti a destra della piazza (rettangoli sottili di albero alternati a erba)
    rect(60, 6, 1, 16, 'albero'), rect(63, 6, 1, 16, 'albero'), rect(66, 6, 1, 16, 'albero'),
    rect(69, 6, 1, 16, 'albero'), rect(72, 6, 1, 16, 'albero'), rect(75, 6, 1, 16, 'albero'),
    rect(78, 6, 1, 16, 'albero'), rect(81, 6, 1, 16, 'albero'),
    // boschetto verso il belvedere e a sud della strada del borgo
    rect(92, 8, 3, 2, 'albero'), rect(98, 12, 2, 3, 'albero'), rect(105, 6, 3, 2, 'albero'),
    rect(34, 30, 3, 2, 'albero'), rect(46, 34, 2, 3, 'albero'),
    // filari sulle colline sotto la strada principale (sud, verso i campi)
    rect(20, 62, 20, 1, 'albero'), rect(20, 66, 20, 1, 'albero'), rect(20, 70, 20, 1, 'albero'),
    rect(20, 74, 20, 1, 'albero'), rect(20, 78, 20, 1, 'albero'),
    rect(100, 62, 20, 1, 'albero'), rect(100, 66, 20, 1, 'albero'), rect(100, 70, 20, 1, 'albero'),
    rect(100, 74, 20, 1, 'albero'), rect(100, 78, 20, 1, 'albero')
  );
}());
