(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.campo_parignano = {
    ...tall, name: 'Campo Parignano', baseTile: 'erba', levelRange: [5, 7], encounterTable: [
      { species: 'basilino', minLevel: 5, maxLevel: 6, weight: 40 },
      { species: 'pito', minLevel: 5, maxLevel: 6, weight: 40 },
      { species: 'banconio', minLevel: 6, maxLevel: 7, weight: 20 }
    ],
    roads: [rect(0, 27, 72, 2), rect(35, 0, 2, 60), rect(53, 6, 1, 24)],
    waters: [rect(0, 53, 72, 4, 'water')], bridges: [rect(35, 51, 2, 9, 'bridge')], plazas: [],
    buildings: [
      building(24, 17, 6, 3, 'Cinema Odeon', '#a6654f', 'cinema'),
      building(39, 15, 5, 5, 'Chiesa del Sacro Cuore', '#c1a179', 'chiesa'),
      building(57, 6, 7, 5, 'Sant’Emidio alle Grotte', '#8f785f', 'monumento'),
      building(10, 29, 4, 3, 'Happy Coffee', '#b46c52', 'attività', { door: { x: 12, y: 32 }, interior: 'bar' })
    ],
    labels: [{ x: 62, y: 17, text: 'Area delle Grotte' }],
    encounterZones: [zone(21, 14, 30, 12, 0.09, 'default'), zone(56, 3, 15, 15, 0.02, 'default')],
    transitions: [
      transition(35, 59, 2, 1, 'centro_storico', 37, 5, 'Ponte Nuovo'),
      transition(0, 27, 1, 2, 'borgo_solesta', 68, 28, 'Borgo Solestà'),
      transition(71, 27, 1, 2, 'borgo_chiaro', 5, 28, 'Borgo Chiaro')
    ],
    npcs: [
      npc(31, 31, 'Spettatore', 'All’Odeon c’è sempre qualche locandina nuova.', 'fermo'),
      npc(12, 33, 'Elena', 'Che te faccio? Nu bel caffè pe\' riparte\'?', 'fermo'),
      npc(59, 11, 'Cartello', 'Sant’Emidio alle Grotte: da qui, tanto tempo fa, Bobby diede il primo Basilino a chi partiva.', 'fermo'),
      npc(29, 28, 'Bracciante', 'Sti campi \'na volta rendeveno de più, mo\' semo rimasti in pochi.', 'fermo'),
      npc(45, 29, 'Ragazzo', 'Certe bande girano de notte da ste parti, statte accorto.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.campo_parignano;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi (ovest, est, sud) e dall'acqua a sud
    rect(0, 0, 72, 1, 'albero'),
    rect(0, 1, 1, 26, 'albero'), rect(0, 29, 1, 24, 'albero'),
    rect(71, 1, 1, 26, 'albero'), rect(71, 29, 1, 24, 'albero'),
    rect(0, 52, 35, 1, 'albero'), rect(37, 52, 35, 1, 'albero'),
    // stradina davanti a Happy Coffee
    rect(10, 32, 4, 2, 'road'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(5, 10, 2, 1, 'albero'), rect(7, 11, 1, 2, 'albero'),
    rect(17, 37, 1, 1, 'albero'),
    rect(45, 35, 2, 1, 'albero'), rect(47, 37, 1, 1, 'albero')
  );
}());
