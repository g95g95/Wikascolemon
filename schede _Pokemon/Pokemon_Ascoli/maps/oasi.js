(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.oasi = {
    width: 60, height: 48, name: 'Oasi', baseTile: 'erba', levelRange: [5, 8],
    encounterTable: [
      { species: 'soldatino', minLevel: 5, maxLevel: 8, weight: 35 },
      { species: 'alghetta', minLevel: 5, maxLevel: 8, weight: 30 },
      { species: 'zanzi', minLevel: 5, maxLevel: 7, weight: 10 },
      { species: 'cavedi', minLevel: 5, maxLevel: 8, weight: 10 },
      { species: 'ciuci', minLevel: 6, maxLevel: 8, weight: 15 }
    ],
    roads: [
      // strada principale ovest-est, righe 54-57 (deve restare collegata ai due passaggi)
      rect(0, 24, 9, 4, 'asfalto'), rect(46, 24, 14, 4, 'asfalto'),
      // deviazione intorno al lago: sentiero di ghiaia che scende a sud del laghetto e risale
      rect(9, 24, 4, 4, 'ghiaia'), rect(9, 28, 4, 5, 'ghiaia'), rect(9, 33, 37, 4, 'ghiaia'),
      rect(42, 28, 4, 5, 'ghiaia'), rect(42, 24, 4, 4, 'ghiaia'),
      // anello di ghiaia intorno alla riva nord del lago (per raggiungere capanno e area picnic)
      rect(15, 17, 22, 4, 'ghiaia'), rect(15, 17, 4, 7, 'ghiaia'), rect(38, 17, 4, 7, 'ghiaia')
    ],
    waters: [rect(19, 21, 23, 12, 'water')],
    bridges: [rect(32, 24, 4, 4, 'bridge')],
    plazas: [rect(47, 37, 6, 6, 'piazza')],
    buildings: [
      building(19, 5, 10, 8, 'Capanno di osservazione', '#8a7256', 'edificio')
    ],
    labels: [
      { x: 23, y: 7, text: 'Capanno di osservazione' },
      { x: 49, y: 38, text: 'Area picnic' }
    ],
    encounterZones: [
      // verde generico ai lati del lago
      zone(2, 2, 13, 42, 0.08, 'default'), zone(49, 2, 9, 31, 0.08, 'default'),
      zone(2, 38, 38, 8, 0.08, 'default'),
      // riva del lago (rate alto, simula la "pesca")
      zone(15, 17, 4, 16, 0.12, 'default'), zone(38, 17, 4, 16, 0.12, 'default'),
      zone(15, 17, 23, 4, 0.12, 'default'), 
    ],
    transitions: [
      transition(0, 24, 2, 4, 'marino_del_tronto', 69, 30, 'Marino del Tronto'),
      transition(58, 24, 2, 4, 'maltignano', 3, 33, 'Maltignano')
    ],
    npcs: [
      npc(29, 9, 'Cartello', 'Oasi naturalistica — silenzio.', 'fermo'),
      npc(17, 29, 'Birdwatcher del posto', 'Sst, se stai zitto magari vedi un Tamburino sull\'acqua.', 'fermo'),
      npc(51, 41, 'Gitante', 'Séme venute pe fà nu picnic, tra \'mbuóca se magna!', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.oasi;
  map.roads.push(
    // cornice di alberi sui bordi, interrotta ai due passaggi (righe 54-57 a ovest ed est)
    rect(0, 0, 60, 2, 'albero'), rect(0, 46, 60, 2, 'albero'),
    rect(0, 2, 2, 22, 'albero'), rect(0, 28, 2, 18, 'albero'),
    rect(58, 2, 2, 22, 'albero'), rect(58, 28, 2, 18, 'albero'),
    // canneto sparso attorno alla riva del lago
    rect(17, 14, 1, 2, 'albero'), rect(25, 14, 2, 1, 'albero'),
    rect(36, 14, 1, 1, 'albero'), rect(37, 15, 1, 2, 'albero'),
    rect(40, 17, 2, 1, 'albero'), rect(43, 23, 1, 1, 'albero'),
    rect(37, 33, 1, 2, 'albero'),
    rect(36, 34, 1, 1, 'albero'), rect(29, 34, 1, 1, 'albero'), rect(19, 33, 2, 1, 'albero'),
    
    
    // boschetti nel verde, lontani da strade/edifici/npc/passaggi
    
    
    
  );
}());
