(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.campo_parignano = {
    ...tall, name: 'Campo Parignano', baseTile: 'erba', levelRange: [5, 7], encounterTable: [
      { species: 'basilino', minLevel: 5, maxLevel: 6, weight: 40 },
      { species: 'pito', minLevel: 5, maxLevel: 6, weight: 40 },
      { species: 'banconio', minLevel: 6, maxLevel: 7, weight: 20 }
    ],
    roads: [rect(0, 36, 96, 2), rect(47, 0, 2, 80), rect(70, 8, 2, 32)],
    waters: [rect(0, 70, 96, 6, 'water')], bridges: [rect(47, 68, 2, 12, 'bridge')], plazas: [],
    buildings: [
      building(32, 22, 8, 5, 'Cinema Odeon', '#a6654f', 'cinema'),
      building(52, 20, 7, 7, 'Chiesa del Sacro Cuore', '#c1a179', 'chiesa'),
      building(76, 8, 9, 7, 'Sant’Emidio alle Grotte', '#8f785f', 'monumento'),
      building(13, 39, 6, 4, 'Happy Coffee', '#b46c52', 'attività', { door: { x: 16, y: 43 }, interior: 'bar' })
    ],
    labels: [{ x: 83, y: 23, text: 'Area delle Grotte' }],
    encounterZones: [zone(28, 18, 40, 16, 0.09, 'default'), zone(74, 4, 20, 20, 0.02, 'default')],
    transitions: [
      transition(47, 79, 2, 1, 'centro_storico', 49, 7, 'Ponte Nuovo'),
      transition(0, 36, 1, 2, 'borgo_solesta', 91, 37, 'Borgo Solestà'),
      transition(95, 36, 1, 2, 'borgo_chiaro', 7, 37, 'Borgo Chiaro')
    ],
    npcs: [
      npc(41, 41, 'Spettatore', 'All’Odeon c’è sempre qualche locandina nuova.', 'fermo'),
      npc(16, 44, 'Elena', 'Che te faccio? Nu bel caffè pe\' riparte\'?', 'fermo'),
      npc(79, 15, 'Cartello', 'Sant’Emidio alle Grotte: da qui, tanto tempo fa, Bobby diede il primo Basilino a chi partiva.', 'fermo'),
      npc(39, 37, 'Bracciante', 'Sti campi \'na volta rendeveno de più, mo\' semo rimasti in pochi.', 'fermo'),
      npc(60, 39, 'Ragazzo', 'Certe bande girano de notte da ste parti, statte accorto.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.campo_parignano;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi (ovest, est, sud) e dall'acqua a sud
    rect(0, 0, 96, 1, 'albero'),
    rect(0, 1, 1, 35, 'albero'), rect(0, 38, 1, 32, 'albero'),
    rect(95, 1, 1, 35, 'albero'), rect(95, 38, 1, 32, 'albero'),
    rect(0, 69, 47, 1, 'albero'), rect(49, 69, 47, 1, 'albero'),
    // stradina davanti a Happy Coffee
    rect(13, 43, 6, 2, 'road'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(7, 13, 2, 2, 'albero'), rect(9, 15, 2, 2, 'albero'),
    rect(23, 49, 1, 2, 'albero'),
    rect(60, 47, 2, 1, 'albero'), rect(63, 49, 1, 2, 'albero')
  );
}());
