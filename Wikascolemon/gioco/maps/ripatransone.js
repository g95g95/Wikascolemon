(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.ripatransone = {
    width: 77, height: 56, name: 'Ripatransone', baseTile: 'erba', levelRange: [5, 7],
    encounterTable: [{ species: 'pefna', minLevel: 5, maxLevel: 7, weight: 55 }, { species: 'tamburino', minLevel: 5, maxLevel: 7, weight: 30 }, { species: 'peto', minLevel: 6, maxLevel: 7, weight: 15 }],
    roads: [
      rect(0, 39, 77, 4, 'asfalto'),
      // strada che sale dalla fermata verso il borgo in collina
      rect(9, 17, 4, 22, 'asfalto'),
      rect(9, 17, 36, 4, 'asfalto'),
      // strada che scende verso il belvedere a est
      rect(41, 17, 4, 12, 'asfalto'),
      rect(41, 25, 32, 4, 'asfalto'),
      rect(69, 25, 4, 16, 'asfalto')
    ],
    waters: [], bridges: [], plazas: [rect(13, 4, 28, 13, 'piazza')],
    buildings: [
      building(15, 5, 8, 6, 'Bar del Belvedere', '#b46c52', 'attività', { door: { x: 18, y: 11 }, interior: 'bar' }),
      building(29, 5, 10, 8, 'Chiesa di San Gregorio', '#c5a677', 'chiesa'),
      building(25, 29, 8, 6, 'Casa dei Peviani', '#9b7a57'),
      building(47, 29, 8, 6, 'Casa dei Sagratti', '#a08360'),
      building(59, 29, 8, 6, 'Casa dei Cameli', '#9b7a57')
    ],
    labels: [
      { x: 4, y: 36, text: 'Fermata corriera' },
      { x: 14, y: 4, text: 'Piazza di Ripatransone' },
      { x: 73, y: 24, text: 'Belvedere sul mare' }
    ],
    encounterZones: [
      zone(2, 2, 7, 35, 0.08, 'default'),
      zone(46, 2, 29, 13, 0.08, 'default'),
      zone(2, 44, 73, 10, 0.1, 'default'),
      zone(57, 43, 18, 11, 0.06, 'default')
    ],
    transitions: [
      transition(0, 39, 2, 4, 'porta_maggiore', 7, 11, 'Corriera per Ascoli')
    ],
    npcs: [
      npc(6, 37, 'Cartello', 'Fermata corriera — per Ascoli Piceno.', 'fermo'),
      {
        x: 21, y: 13, name: 'Anziano del borgo', movement: 'fermo',
        script: [{ say: ['Chi arriva a Ripatransone giusto pé l\'ottava di Pasqua vede lu Cartellone, la scena più granne dipinta a mano.', 'E se guardi bbene quaggiù, sotto lu paese, li Puledrotto currono ancora com\'a la mejo squadra: qui s\'allenano da sempre.'], name: 'Anziano del borgo' }]
      },
      npc(37, 14, 'Massaia', 'Su a la piazza c\'è sempre n\'ariata bbona, mo\' che sò salita da le vigne.', 'fermo'),
      npc(63, 35, 'Pescatore', 'Da lu belvedere se vede fino a lu mare, quanno è chiaro.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.ripatransone;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta solo dal passaggio ovest
    rect(2, 0, 75, 2, 'albero'), rect(0, 2, 2, 37, 'albero'), rect(0, 43, 2, 13, 'albero'),
    rect(0, 54, 77, 2, 'albero'), rect(75, 2, 2, 52, 'albero'),
    // filari sulle colline a sinistra della strada principale (righe orizzontali alternate)
    rect(4, 2, 5, 1, 'albero'), 
    rect(4, 6, 5, 1, 'albero'), rect(4, 9, 5, 1, 'albero'), rect(4, 12, 5, 1, 'albero'),
    rect(4, 22, 5, 1, 'albero'), 
    rect(4, 24, 5, 1, 'albero'), rect(4, 27, 5, 1, 'albero'), rect(4, 30, 5, 1, 'albero'),
    // vigneti a destra della piazza (rettangoli sottili di albero alternati a erba)
    
    rect(46, 3, 1, 12, 'albero'), rect(49, 3, 1, 12, 'albero'), rect(52, 3, 1, 12, 'albero'),
    rect(55, 3, 1, 12, 'albero'), 
    // boschetto verso il belvedere e a sud della strada del borgo
    rect(61, 5, 2, 3, 'albero'), 
    
    // filari sulle colline sotto la strada principale (sud, verso i campi)
    rect(9, 45, 18, 1, 'albero'), rect(9, 46, 18, 1, 'albero'),
    
    rect(63, 45, 10, 1, 'albero'), rect(63, 46, 10, 1, 'albero'),
    
  );
}());
