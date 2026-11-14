(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.ripatransone = {
    ...city, name: 'Ripatransone', baseTile: 'erba', levelRange: [5, 7],
    encounterTable: [{ species: 'pefna', minLevel: 5, maxLevel: 7, weight: 55 }, { species: 'tamburino', minLevel: 5, maxLevel: 7, weight: 30 }, { species: 'peto', minLevel: 6, maxLevel: 7, weight: 15 }],
    roads: [
      rect(0, 27, 72, 2, 'asfalto'),
      // strada che sale dalla fermata verso il borgo in collina
      rect(10, 12, 2, 15, 'asfalto'),
      rect(10, 12, 20, 2, 'asfalto'),
      // strada che scende verso il belvedere a est
      rect(28, 12, 2, 10, 'asfalto'),
      rect(28, 20, 30, 2, 'asfalto'),
      rect(56, 20, 2, 8, 'asfalto')
    ],
    waters: [], bridges: [], plazas: [rect(12, 5, 16, 7, 'piazza')],
    buildings: [
      building(14, 6, 4, 3, 'Bar del Belvedere', '#b46c52', 'attività', { door: { x: 16, y: 9 }, interior: 'bar' }),
      building(21, 6, 5, 4, 'Chiesa di San Gregorio', '#c5a677', 'chiesa'),
      building(19, 22, 4, 3, 'Casa dei Peviani', '#9b7a57'),
      building(35, 22, 4, 3, 'Casa dei Sagratti', '#a08360'),
      building(48, 22, 4, 3, 'Casa dei Cameli', '#9b7a57')
    ],
    labels: [
      { x: 2, y: 26, text: 'Fermata corriera' },
      { x: 14, y: 5, text: 'Piazza di Ripatransone' },
      { x: 59, y: 20, text: 'Belvedere sul mare' }
    ],
    encounterZones: [
      zone(1, 1, 8, 25, 0.08, 'default'),
      zone(33, 1, 38, 10, 0.08, 'default'),
      zone(1, 30, 70, 23, 0.1, 'default'),
      zone(45, 29, 25, 23, 0.06, 'default')
    ],
    transitions: [
      transition(0, 27, 1, 2, 'porta_maggiore', 5, 16, 'Corriera per Ascoli')
    ],
    npcs: [
      npc(4, 26, 'Cartello', 'Fermata corriera — per Ascoli Piceno.', 'fermo'),
      {
        x: 17, y: 10, name: 'Anziano del borgo', movement: 'fermo',
        script: [{ say: ['Chi arriva a Ripatransone giusto pé l\'ottava di Pasqua vede lu Cartellone, la scena più granne dipinta a mano.', 'E se guardi bbene quaggiù, sotto lu paese, li Puledrotto currono ancora com\'a la mejo squadra: qui s\'allenano da sempre.'], name: 'Anziano del borgo' }]
      },
      npc(25, 11, 'Massaia', 'Su a la piazza c\'è sempre n\'ariata bbona, mo\' che sò salita da le vigne.', 'fermo'),
      npc(50, 25, 'Pescatore', 'Da lu belvedere se vede fino a lu mare, quanno è chiaro.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.ripatransone;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta solo dal passaggio ovest
    rect(1, 0, 71, 1, 'albero'), rect(0, 1, 1, 26, 'albero'), rect(0, 29, 1, 25, 'albero'),
    rect(0, 53, 72, 1, 'albero'), rect(71, 1, 1, 52, 'albero'),
    // filari sulle colline a sinistra della strada principale (righe orizzontali alternate)
    rect(2, 2, 7, 1, 'albero'), rect(2, 4, 7, 1, 'albero'), rect(2, 5, 7, 1, 'albero'),
    rect(2, 7, 7, 1, 'albero'), rect(2, 8, 7, 1, 'albero'), rect(2, 10, 7, 1, 'albero'),
    rect(2, 15, 7, 1, 'albero'), rect(2, 17, 7, 1, 'albero'), rect(2, 18, 7, 1, 'albero'),
    rect(2, 20, 7, 1, 'albero'), rect(2, 21, 7, 1, 'albero'), rect(2, 23, 7, 1, 'albero'),
    // vigneti a destra della piazza (rettangoli sottili di albero alternati a erba)
    rect(30, 3, 1, 8, 'albero'), rect(32, 3, 1, 8, 'albero'), rect(33, 3, 1, 8, 'albero'),
    rect(35, 3, 1, 8, 'albero'), rect(36, 3, 1, 8, 'albero'), rect(38, 3, 1, 8, 'albero'),
    rect(39, 3, 1, 8, 'albero'), rect(41, 3, 1, 8, 'albero'),
    // boschetto verso il belvedere e a sud della strada del borgo
    rect(46, 4, 1, 1, 'albero'), rect(49, 6, 1, 2, 'albero'), rect(53, 3, 1, 1, 'albero'),
    rect(17, 15, 2, 1, 'albero'), rect(23, 17, 1, 2, 'albero'),
    // filari sulle colline sotto la strada principale (sud, verso i campi)
    rect(10, 31, 10, 1, 'albero'), rect(10, 33, 10, 1, 'albero'), rect(10, 35, 10, 1, 'albero'),
    rect(10, 37, 10, 1, 'albero'), rect(10, 39, 10, 1, 'albero'),
    rect(50, 31, 10, 1, 'albero'), rect(50, 33, 10, 1, 'albero'), rect(50, 35, 10, 1, 'albero'),
    rect(50, 37, 10, 1, 'albero'), rect(50, 39, 10, 1, 'albero')
  );
}());
