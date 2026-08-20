(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.oasi = {
    ...tall, name: 'Oasi', baseTile: 'erba', levelRange: [5, 8],
    encounterTable: [
      { species: 'soldatino', minLevel: 5, maxLevel: 8, weight: 35 },
      { species: 'alghetta', minLevel: 5, maxLevel: 8, weight: 30 },
      { species: 'zanzi', minLevel: 5, maxLevel: 7, weight: 10 },
      { species: 'cavedi', minLevel: 5, maxLevel: 8, weight: 10 },
      { species: 'ciuci', minLevel: 6, maxLevel: 8, weight: 15 }
    ],
    roads: [
      // strada principale ovest-est, righe 54-57 (deve restare collegata ai due passaggi)
      rect(0, 54, 40, 4, 'asfalto'), rect(104, 54, 40, 4, 'asfalto'),
      // deviazione intorno al lago: sentiero di ghiaia che scende a sud del laghetto e risale
      rect(40, 54, 4, 4, 'ghiaia'), rect(40, 58, 4, 20, 'ghiaia'), rect(40, 78, 64, 4, 'ghiaia'),
      rect(100, 58, 4, 20, 'ghiaia'), rect(100, 54, 4, 4, 'ghiaia'),
      // anello di ghiaia intorno alla riva nord del lago (per raggiungere capanno e area picnic)
      rect(56, 30, 32, 4, 'ghiaia'), rect(56, 30, 4, 24, 'ghiaia'), rect(96, 30, 4, 24, 'ghiaia')
    ],
    waters: [rect(60, 34, 40, 40, 'water')],
    bridges: [rect(78, 54, 4, 4, 'bridge')],
    plazas: [rect(108, 82, 14, 12, 'piazza')],
    buildings: [
      building(60, 18, 10, 8, 'Capanno di osservazione', '#8a7256', 'edificio')
    ],
    labels: [
      { x: 64, y: 20, text: 'Capanno di osservazione' },
      { x: 110, y: 84, text: 'Area picnic' }
    ],
    encounterZones: [
      // verde generico ai lati del lago
      zone(2, 2, 54, 96, 0.08, 'default'), zone(110, 2, 32, 76, 0.08, 'default'),
      zone(2, 86, 96, 32, 0.08, 'default'),
      // riva del lago (rate alto, simula la "pesca")
      zone(56, 30, 4, 44, 0.12, 'default'), zone(96, 30, 4, 44, 0.12, 'default'),
      zone(56, 30, 40, 4, 0.12, 'default'), zone(56, 74, 44, 4, 0.12, 'default')
    ],
    transitions: [
      transition(0, 54, 2, 4, 'marino_del_tronto', 173, 55, 'Marino del Tronto'),
      transition(142, 54, 2, 4, 'maltignano', 6, 55, 'Maltignano')
    ],
    npcs: [
      npc(70, 22, 'Cartello', 'Oasi naturalistica — silenzio.', 'fermo'),
      npc(58, 60, 'Birdwatcher del posto', 'Sst, se stai zitto magari vedi un Tamburino sull\'acqua.', 'fermo'),
      npc(112, 90, 'Gitante', 'Semo venuti pé fa\' n\' pò de picnic, tra n\' pò se magna!', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.oasi;
  map.roads.push(
    // cornice di alberi sui bordi, interrotta ai due passaggi (righe 54-57 a ovest ed est)
    rect(0, 0, 144, 2, 'albero'), rect(0, 118, 144, 2, 'albero'),
    rect(0, 2, 2, 52, 'albero'), rect(0, 58, 2, 60, 'albero'),
    rect(142, 2, 2, 52, 'albero'), rect(142, 58, 2, 60, 'albero'),
    // canneto sparso attorno alla riva del lago
    rect(54, 28, 2, 1, 'albero'), rect(58, 27, 1, 2, 'albero'), rect(66, 27, 2, 1, 'albero'),
    rect(74, 27, 1, 1, 'albero'), rect(82, 27, 2, 1, 'albero'), rect(90, 28, 1, 2, 'albero'),
    rect(98, 30, 2, 1, 'albero'), rect(101, 40, 1, 2, 'albero'), rect(101, 50, 1, 2, 'albero'),
    rect(101, 62, 1, 2, 'albero'), rect(98, 76, 2, 1, 'albero'), rect(90, 78, 1, 2, 'albero'),
    rect(82, 79, 2, 1, 'albero'), rect(70, 79, 1, 1, 'albero'), rect(60, 78, 2, 1, 'albero'),
    rect(54, 76, 1, 2, 'albero'), rect(54, 62, 1, 2, 'albero'), rect(54, 50, 1, 2, 'albero'),
    rect(54, 40, 1, 2, 'albero'),
    // boschetti nel verde, lontani da strade/edifici/npc/passaggi
    rect(12, 16, 3, 2, 'albero'), rect(18, 20, 2, 3, 'albero'), rect(10, 90, 3, 2, 'albero'),
    rect(120, 20, 3, 2, 'albero'), rect(126, 24, 2, 3, 'albero'), rect(126, 100, 3, 2, 'albero'),
    rect(20, 100, 2, 3, 'albero'), rect(30, 105, 3, 2, 'albero')
  );
}());
