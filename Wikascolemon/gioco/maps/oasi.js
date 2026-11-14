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
      rect(0, 27, 20, 2, 'asfalto'), rect(52, 27, 20, 2, 'asfalto'),
      // deviazione intorno al lago: sentiero di ghiaia che scende a sud del laghetto e risale
      rect(20, 27, 2, 2, 'ghiaia'), rect(20, 29, 2, 10, 'ghiaia'), rect(20, 39, 32, 2, 'ghiaia'),
      rect(50, 29, 2, 10, 'ghiaia'), rect(50, 27, 2, 2, 'ghiaia'),
      // anello di ghiaia intorno alla riva nord del lago (per raggiungere capanno e area picnic)
      rect(28, 15, 16, 2, 'ghiaia'), rect(28, 15, 2, 12, 'ghiaia'), rect(48, 15, 2, 12, 'ghiaia')
    ],
    waters: [rect(30, 17, 20, 20, 'water')],
    bridges: [rect(39, 27, 2, 2, 'bridge')],
    plazas: [rect(54, 41, 7, 6, 'piazza')],
    buildings: [
      building(30, 9, 5, 4, 'Capanno di osservazione', '#8a7256', 'edificio')
    ],
    labels: [
      { x: 32, y: 10, text: 'Capanno di osservazione' },
      { x: 55, y: 42, text: 'Area picnic' }
    ],
    encounterZones: [
      // verde generico ai lati del lago
      zone(1, 1, 27, 48, 0.08, 'default'), zone(55, 1, 16, 38, 0.08, 'default'),
      zone(1, 43, 48, 16, 0.08, 'default'),
      // riva del lago (rate alto, simula la "pesca")
      zone(28, 15, 2, 22, 0.12, 'default'), zone(48, 15, 2, 22, 0.12, 'default'),
      zone(28, 15, 20, 2, 0.12, 'default'), zone(28, 37, 22, 2, 0.12, 'default')
    ],
    transitions: [
      transition(0, 27, 1, 2, 'marino_del_tronto', 86, 28, 'Marino del Tronto'),
      transition(71, 27, 1, 2, 'maltignano', 3, 28, 'Maltignano')
    ],
    npcs: [
      npc(35, 11, 'Cartello', 'Oasi naturalistica — silenzio.', 'fermo'),
      npc(29, 30, 'Birdwatcher del posto', 'Sst, se stai zitto magari vedi un Tamburino sull\'acqua.', 'fermo'),
      npc(56, 45, 'Gitante', 'Semo venuti pé fa\' n\' pò de picnic, tra n\' pò se magna!', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.oasi;
  map.roads.push(
    // cornice di alberi sui bordi, interrotta ai due passaggi (righe 54-57 a ovest ed est)
    rect(0, 0, 72, 1, 'albero'), rect(0, 59, 72, 1, 'albero'),
    rect(0, 1, 1, 26, 'albero'), rect(0, 29, 1, 30, 'albero'),
    rect(71, 1, 1, 26, 'albero'), rect(71, 29, 1, 30, 'albero'),
    // canneto sparso attorno alla riva del lago
    rect(27, 14, 1, 1, 'albero'), rect(29, 14, 1, 1, 'albero'), rect(33, 14, 1, 1, 'albero'),
    rect(37, 14, 1, 1, 'albero'), rect(41, 14, 1, 1, 'albero'), rect(45, 14, 1, 1, 'albero'),
    rect(49, 15, 1, 1, 'albero'), rect(50, 20, 1, 1, 'albero'), rect(50, 25, 1, 1, 'albero'),
    rect(50, 31, 1, 1, 'albero'), rect(49, 38, 1, 1, 'albero'), rect(45, 39, 1, 1, 'albero'),
    rect(41, 40, 1, 1, 'albero'), rect(35, 40, 1, 1, 'albero'), rect(30, 39, 1, 1, 'albero'),
    rect(27, 38, 1, 1, 'albero'), rect(27, 31, 1, 1, 'albero'), rect(27, 25, 1, 1, 'albero'),
    rect(27, 20, 1, 1, 'albero'),
    // boschetti nel verde, lontani da strade/edifici/npc/passaggi
    rect(6, 8, 2, 1, 'albero'), rect(9, 10, 1, 1, 'albero'), rect(5, 45, 2, 1, 'albero'),
    rect(60, 10, 2, 1, 'albero'), rect(63, 12, 1, 2, 'albero'), rect(63, 50, 2, 1, 'albero'),
    rect(10, 50, 1, 2, 'albero'), rect(15, 53, 2, 1, 'albero')
  );
}());
