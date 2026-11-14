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
      rect(0, 36, 27, 3, 'asfalto'), rect(69, 36, 27, 3, 'asfalto'),
      // deviazione intorno al lago: sentiero di ghiaia che scende a sud del laghetto e risale
      rect(27, 36, 2, 3, 'ghiaia'), rect(27, 39, 2, 13, 'ghiaia'), rect(27, 52, 42, 3, 'ghiaia'),
      rect(67, 39, 2, 13, 'ghiaia'), rect(67, 36, 2, 3, 'ghiaia'),
      // anello di ghiaia intorno alla riva nord del lago (per raggiungere capanno e area picnic)
      rect(37, 20, 22, 3, 'ghiaia'), rect(37, 20, 3, 16, 'ghiaia'), rect(64, 20, 3, 16, 'ghiaia')
    ],
    waters: [rect(40, 23, 27, 26, 'water')],
    bridges: [rect(52, 36, 3, 3, 'bridge')],
    plazas: [rect(72, 55, 9, 8, 'piazza')],
    buildings: [
      building(40, 12, 7, 5, 'Capanno di osservazione', '#8a7256', 'edificio')
    ],
    labels: [
      { x: 43, y: 13, text: 'Capanno di osservazione' },
      { x: 73, y: 56, text: 'Area picnic' }
    ],
    encounterZones: [
      // verde generico ai lati del lago
      zone(1, 1, 36, 64, 0.08, 'default'), zone(73, 1, 22, 51, 0.08, 'default'),
      zone(1, 57, 64, 22, 0.08, 'default'),
      // riva del lago (rate alto, simula la "pesca")
      zone(37, 20, 3, 29, 0.12, 'default'), zone(64, 20, 3, 29, 0.12, 'default'),
      zone(37, 20, 27, 3, 0.12, 'default'), zone(37, 49, 30, 3, 0.12, 'default')
    ],
    transitions: [
      transition(0, 36, 1, 3, 'marino_del_tronto', 115, 37, 'Marino del Tronto'),
      transition(95, 36, 1, 3, 'maltignano', 4, 37, 'Maltignano')
    ],
    npcs: [
      npc(47, 15, 'Cartello', 'Oasi naturalistica — silenzio.', 'fermo'),
      npc(39, 40, 'Birdwatcher del posto', 'Sst, se stai zitto magari vedi un Tamburino sull\'acqua.', 'fermo'),
      npc(75, 60, 'Gitante', 'Semo venuti pé fa\' n\' pò de picnic, tra n\' pò se magna!', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.oasi;
  map.roads.push(
    // cornice di alberi sui bordi, interrotta ai due passaggi (righe 54-57 a ovest ed est)
    rect(0, 0, 96, 1, 'albero'), rect(0, 79, 96, 1, 'albero'),
    rect(0, 1, 1, 35, 'albero'), rect(0, 39, 1, 40, 'albero'),
    rect(95, 1, 1, 35, 'albero'), rect(95, 39, 1, 40, 'albero'),
    // canneto sparso attorno alla riva del lago
    rect(36, 19, 1, 1, 'albero'), rect(39, 18, 1, 1, 'albero'), rect(44, 18, 1, 1, 'albero'),
    rect(49, 18, 1, 1, 'albero'), rect(55, 18, 1, 1, 'albero'), rect(60, 19, 1, 1, 'albero'),
    rect(65, 20, 2, 1, 'albero'), rect(67, 27, 1, 1, 'albero'), rect(67, 33, 1, 2, 'albero'),
    rect(67, 41, 1, 2, 'albero'), rect(65, 51, 2, 1, 'albero'), rect(60, 52, 1, 1, 'albero'),
    rect(55, 53, 1, 1, 'albero'), rect(47, 53, 1, 1, 'albero'), rect(40, 52, 1, 1, 'albero'),
    rect(36, 51, 1, 1, 'albero'), rect(36, 41, 1, 2, 'albero'), rect(36, 33, 1, 2, 'albero'),
    rect(36, 27, 1, 1, 'albero'),
    // boschetti nel verde, lontani da strade/edifici/npc/passaggi
    rect(8, 11, 2, 1, 'albero'), rect(12, 13, 1, 2, 'albero'), rect(7, 60, 2, 1, 'albero'),
    rect(80, 13, 2, 2, 'albero'), rect(84, 16, 1, 2, 'albero'), rect(84, 67, 2, 1, 'albero'),
    rect(13, 67, 2, 2, 'albero'), rect(20, 70, 2, 1, 'albero')
  );
}());
