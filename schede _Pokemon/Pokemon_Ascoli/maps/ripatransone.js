(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.ripatransone = {
    width: 60, height: 43, name: 'Ripatransone', baseTile: 'erba', levelRange: [5, 7],
    encounterTable: [{ species: 'pefna', minLevel: 5, maxLevel: 7, weight: 55 }, { species: 'tamburino', minLevel: 5, maxLevel: 7, weight: 30 }, { species: 'peto', minLevel: 6, maxLevel: 7, weight: 15 }],
    roads: [
      rect(0, 34, 60, 4, 'asfalto'),
      // strada che sale dalla fermata verso il borgo in collina
      rect(4, 14, 4, 20, 'asfalto'),
      rect(4, 14, 32, 4, 'asfalto'),
      // strada che scende verso il belvedere a est
      rect(32, 14, 4, 10, 'asfalto'),
      rect(32, 20, 26, 4, 'asfalto'),
      rect(54, 20, 4, 16, 'asfalto')
    ],
    waters: [], bridges: [], plazas: [rect(8, 3, 24, 11, 'piazza')],
    buildings: [
      building(9, 3, 8, 6, 'Bar del Belvedere', '#b46c52', 'attività', { door: { x: 12, y: 9 }, interior: 'bar' }),
      building(22, 3, 10, 8, 'Chiesa di San Gregorio', '#c5a677', 'chiesa'),
      building(18, 24, 8, 6, 'Casa dei Peviani', '#9b7a57'),
      building(37, 24, 8, 6, 'Casa dei Sagratti', '#a08360'),
      building(46, 24, 8, 6, 'Casa dei Cameli', '#9b7a57')
    ],
    labels: [
      { x: 2, y: 31, text: 'Fermata corriera' },
      { x: 8, y: 3, text: 'Piazza di Ripatransone' },
      { x: 58, y: 20, text: 'Belvedere sul mare' }
    ],
    encounterZones: [
      zone(2, 2, 2, 30, 0.08, 'default'),
      zone(36, 2, 22, 11, 0.08, 'default'),
      zone(2, 38, 56, 3, 0.1, 'default'),
      zone(45, 38, 13, 3, 0.06, 'default')
    ],
    transitions: [
      transition(0, 34, 2, 4, 'porta_maggiore', 4, 7, 'Corriera per Ascoli')
    ],
    npcs: [
      npc(3, 32, 'Cartello', 'Fermata corriera — per Ascoli Piceno.', 'fermo'),
      {
        x: 15, y: 11, name: 'Anziano del borgo', movement: 'fermo',
        script: [{ say: ['Chi arriva a Ripatransone juste pe l\'ottava de Pasqua véde lu Cartellone, la scena più granne depinda a mà.', 'E se uarde bbé ècche jó, sotte lu paese, li Puledrotto córre ancora come la mègghje squadra: ècche s\'allena da sèmbre.'], name: 'Anziano del borgo' }]
      },
      npc(30, 12, 'Massaia', 'Su a la piazza c\'è sèmbre n\'aria bbona, mó che sò sùveta da li vigne.', 'fermo'),
      npc(50, 30, 'Pescatore', 'Da lu belvedere se véde fine a lu mare, quanne è chiare.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.ripatransone;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta solo dal passaggio ovest
    rect(2, 0, 58, 2, 'albero'), rect(0, 2, 2, 32, 'albero'), rect(0, 38, 2, 5, 'albero'),
    rect(0, 41, 60, 2, 'albero'), rect(58, 2, 2, 39, 'albero'),
    // filari sulle colline a sinistra della strada principale (righe orizzontali alternate)
    
    rect(2, 4, 2, 1, 'albero'), rect(2, 7, 2, 1, 'albero'), rect(2, 10, 2, 1, 'albero'),
    
    rect(2, 22, 2, 1, 'albero'), rect(2, 25, 2, 1, 'albero'),
    // vigneti a destra della piazza (rettangoli sottili di albero alternati a erba)
    
    rect(36, 2, 1, 11, 'albero'), rect(39, 2, 1, 11, 'albero'), rect(42, 2, 1, 11, 'albero'),
    
    // boschetto verso il belvedere e a sud della strada del borgo
    rect(48, 3, 2, 3, 'albero'), 
    
    // filari sulle colline sotto la strada principale (sud, verso i campi)
    
    
    
    
  );
}());
