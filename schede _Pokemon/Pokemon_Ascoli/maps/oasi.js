(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.oasi = {
    width: 76, height: 62, name: 'Oasi', baseTile: 'erba', levelRange: [5, 8],
    encounterTable: [
      { species: 'soldatino', minLevel: 5, maxLevel: 8, weight: 35 },
      { species: 'alghetta', minLevel: 5, maxLevel: 8, weight: 30 },
      { species: 'zanzi', minLevel: 5, maxLevel: 7, weight: 10 },
      { species: 'cavedi', minLevel: 5, maxLevel: 8, weight: 10 },
      { species: 'ciuci', minLevel: 6, maxLevel: 8, weight: 15 }
    ],
    roads: [
      // strada principale ovest-est, righe 54-57 (deve restare collegata ai due passaggi)
      rect(0, 29, 15, 4, 'asfalto'), rect(56, 29, 20, 4, 'asfalto'),
      // deviazione intorno al lago: sentiero di ghiaia che scende a sud del laghetto e risale
      rect(15, 29, 4, 4, 'ghiaia'), rect(15, 33, 4, 9, 'ghiaia'), rect(15, 42, 41, 4, 'ghiaia'),
      rect(52, 33, 4, 9, 'ghiaia'), rect(52, 29, 4, 4, 'ghiaia'),
      // anello di ghiaia intorno alla riva nord del lago (per raggiungere capanno e area picnic)
      rect(22, 19, 24, 4, 'ghiaia'), rect(22, 19, 4, 10, 'ghiaia'), rect(48, 19, 4, 10, 'ghiaia')
    ],
    waters: [rect(26, 23, 26, 18, 'water')],
    bridges: [rect(40, 29, 4, 4, 'bridge')],
    plazas: [rect(57, 46, 8, 8, 'piazza')],
    buildings: [
      building(26, 7, 10, 8, 'Capanno di osservazione', '#8a7256', 'edificio')
    ],
    labels: [
      { x: 30, y: 9, text: 'Capanno di osservazione' },
      { x: 59, y: 47, text: 'Area picnic' }
    ],
    encounterZones: [
      // verde generico ai lati del lago
      zone(2, 2, 20, 53, 0.08, 'default'), zone(59, 2, 15, 40, 0.08, 'default'),
      zone(2, 48, 48, 12, 0.08, 'default'),
      // riva del lago (rate alto, simula la "pesca")
      zone(22, 19, 4, 22, 0.12, 'default'), zone(48, 19, 4, 22, 0.12, 'default'),
      zone(22, 19, 26, 4, 0.12, 'default'), zone(22, 41, 30, 1, 0.12, 'default')
    ],
    transitions: [
      transition(0, 29, 2, 4, 'marino_del_tronto', 90, 36, 'Marino del Tronto'),
      transition(74, 29, 2, 4, 'maltignano', 5, 37, 'Maltignano')
    ],
    npcs: [
      npc(36, 11, 'Cartello', 'Oasi naturalistica — silenzio.', 'fermo'),
      npc(24, 35, 'Birdwatcher del posto', 'Sst, se stai zitto magari vedi un Tamburino sull\'acqua.', 'fermo'),
      npc(61, 51, 'Gitante', 'Semo venuti pé fa\' n\' pò de picnic, tra n\' pò se magna!', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.oasi;
  map.roads.push(
    // cornice di alberi sui bordi, interrotta ai due passaggi (righe 54-57 a ovest ed est)
    rect(0, 0, 76, 2, 'albero'), rect(0, 60, 76, 2, 'albero'),
    rect(0, 2, 2, 27, 'albero'), rect(0, 33, 2, 27, 'albero'),
    rect(74, 2, 2, 27, 'albero'), rect(74, 33, 2, 27, 'albero'),
    // canneto sparso attorno alla riva del lago
    rect(24, 16, 1, 2, 'albero'), rect(32, 16, 2, 1, 'albero'),
    rect(44, 16, 1, 1, 'albero'), rect(46, 17, 1, 2, 'albero'),
    rect(50, 19, 2, 1, 'albero'), rect(53, 27, 1, 1, 'albero'),
    rect(53, 37, 1, 1, 'albero'), rect(50, 41, 2, 1, 'albero'), rect(46, 42, 1, 2, 'albero'),
    rect(44, 43, 1, 1, 'albero'), rect(36, 43, 1, 1, 'albero'), rect(26, 42, 2, 1, 'albero'),
    
    
    // boschetti nel verde, lontani da strade/edifici/npc/passaggi
    rect(8, 6, 1, 1, 'albero'), 
    rect(66, 13, 1, 3, 'albero'), rect(66, 55, 1, 1, 'albero'),
    rect(10, 55, 1, 1, 'albero'), 
  );
}());
