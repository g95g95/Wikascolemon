(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.ripatransone = {
    ...city, name: 'Ripatransone', baseTile: 'erba', levelRange: [5, 7],
    encounterTable: [{ species: 'pefna', minLevel: 5, maxLevel: 7, weight: 55 }, { species: 'tamburino', minLevel: 5, maxLevel: 7, weight: 30 }, { species: 'peto', minLevel: 6, maxLevel: 7, weight: 15 }],
    roads: [
      rect(0, 36, 96, 3, 'asfalto'),
      // strada che sale dalla fermata verso il borgo in collina
      rect(13, 16, 3, 20, 'asfalto'),
      rect(13, 16, 27, 3, 'asfalto'),
      // strada che scende verso il belvedere a est
      rect(37, 16, 3, 13, 'asfalto'),
      rect(37, 27, 40, 2, 'asfalto'),
      rect(75, 27, 2, 10, 'asfalto')
    ],
    waters: [], bridges: [], plazas: [rect(16, 7, 21, 9, 'piazza')],
    buildings: [
      building(19, 8, 5, 4, 'Bar del Belvedere', '#b46c52', 'attività', { door: { x: 21, y: 12 }, interior: 'bar' }),
      building(28, 8, 7, 5, 'Chiesa di San Gregorio', '#c5a677', 'chiesa'),
      building(25, 29, 6, 4, 'Casa dei Peviani', '#9b7a57'),
      building(47, 29, 5, 4, 'Casa dei Sagratti', '#a08360'),
      building(64, 29, 5, 4, 'Casa dei Cameli', '#9b7a57')
    ],
    labels: [
      { x: 3, y: 34, text: 'Fermata corriera' },
      { x: 18, y: 6, text: 'Piazza di Ripatransone' },
      { x: 79, y: 26, text: 'Belvedere sul mare' }
    ],
    encounterZones: [
      zone(1, 1, 11, 34, 0.08, 'default'),
      zone(44, 1, 51, 14, 0.08, 'default'),
      zone(1, 40, 94, 31, 0.1, 'default'),
      zone(60, 39, 33, 30, 0.06, 'default')
    ],
    transitions: [
      transition(0, 36, 1, 3, 'porta_maggiore', 6, 21, 'Corriera per Ascoli')
    ],
    npcs: [
      npc(5, 35, 'Cartello', 'Fermata corriera — per Ascoli Piceno.', 'fermo'),
      {
        x: 23, y: 13, name: 'Anziano del borgo', movement: 'fermo',
        script: [{ say: ['Chi arriva a Ripatransone giusto pé l\'ottava di Pasqua vede lu Cartellone, la scena più granne dipinta a mano.', 'E se guardi bbene quaggiù, sotto lu paese, li Puledrotto currono ancora com\'a la mejo squadra: qui s\'allenano da sempre.'], name: 'Anziano del borgo' }]
      },
      npc(33, 14, 'Massaia', 'Su a la piazza c\'è sempre n\'ariata bbona, mo\' che sò salita da le vigne.', 'fermo'),
      npc(67, 33, 'Pescatore', 'Da lu belvedere se vede fino a lu mare, quanno è chiaro.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.ripatransone;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta solo dal passaggio ovest
    rect(1, 0, 95, 1, 'albero'), rect(0, 1, 1, 35, 'albero'), rect(0, 39, 1, 33, 'albero'),
    rect(0, 71, 96, 1, 'albero'), rect(95, 1, 1, 70, 'albero'),
    // filari sulle colline a sinistra della strada principale (righe orizzontali alternate)
    rect(3, 3, 9, 1, 'albero'), rect(3, 5, 9, 1, 'albero'), rect(3, 7, 9, 1, 'albero'),
    rect(3, 9, 9, 1, 'albero'), rect(3, 11, 9, 1, 'albero'), rect(3, 13, 9, 1, 'albero'),
    rect(3, 20, 9, 1, 'albero'), rect(3, 22, 9, 1, 'albero'), rect(3, 24, 9, 1, 'albero'),
    rect(3, 26, 9, 1, 'albero'), rect(3, 28, 9, 1, 'albero'), rect(3, 30, 9, 1, 'albero'),
    // vigneti a destra della piazza (rettangoli sottili di albero alternati a erba)
    rect(40, 4, 1, 11, 'albero'), rect(42, 4, 1, 11, 'albero'), rect(44, 4, 1, 11, 'albero'),
    rect(46, 4, 1, 11, 'albero'), rect(48, 4, 1, 11, 'albero'), rect(50, 4, 1, 11, 'albero'),
    rect(52, 4, 1, 11, 'albero'), rect(54, 4, 1, 11, 'albero'),
    // boschetto verso il belvedere e a sud della strada del borgo
    rect(61, 5, 2, 2, 'albero'), rect(65, 8, 2, 2, 'albero'), rect(70, 4, 2, 1, 'albero'),
    rect(23, 20, 2, 1, 'albero'), rect(31, 23, 1, 2, 'albero'),
    // filari sulle colline sotto la strada principale (sud, verso i campi)
    rect(13, 41, 14, 1, 'albero'), rect(13, 44, 14, 1, 'albero'), rect(13, 47, 14, 1, 'albero'),
    rect(13, 49, 14, 1, 'albero'), rect(13, 52, 14, 1, 'albero'),
    rect(67, 41, 13, 1, 'albero'), rect(67, 44, 13, 1, 'albero'), rect(67, 47, 13, 1, 'albero'),
    rect(67, 49, 13, 1, 'albero'), rect(67, 52, 13, 1, 'albero')
  );
}());
