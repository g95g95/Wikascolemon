(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.campo_parignano = {
    ...tall, name: 'Campo Parignano', baseTile: 'erba', levelRange: [5, 7], encounterTable: [
      { species: 'basilino', minLevel: 5, maxLevel: 6, weight: 40 },
      { species: 'pito', minLevel: 5, maxLevel: 6, weight: 40 },
      { species: 'banconio', minLevel: 6, maxLevel: 7, weight: 20 }
    ],
    roads: [rect(0, 54, 144, 3), rect(70, 0, 4, 120), rect(105, 12, 3, 48)],
    waters: [rect(0, 105, 144, 9, 'water')], bridges: [rect(70, 102, 4, 18, 'bridge')], plazas: [],
    buildings: [
      building(48, 33, 12, 8, 'Cinema Odeon', '#a6654f', 'cinema'),
      building(78, 30, 10, 10, 'Chiesa del Sacro Cuore', '#c1a179', 'chiesa'),
      building(114, 12, 14, 10, 'Sant’Emidio alle Grotte', '#8f785f', 'monumento'),
      building(20, 58, 8, 6, 'Happy Coffee', '#b46c52', 'attività', { door: { x: 24, y: 64 }, interior: 'bar' })
    ],
    labels: [{ x: 124, y: 34, text: 'Area delle Grotte' }],
    encounterZones: [zone(42, 27, 60, 24, 0.09, 'default'), zone(111, 6, 30, 30, 0.02, 'default')],
    transitions: [
      transition(70, 118, 4, 2, 'centro_storico', 73, 10, 'Ponte Nuovo'),
      transition(0, 54, 2, 3, 'borgo_solesta', 136, 55, 'Borgo Solestà'),
      transition(142, 54, 2, 3, 'borgo_chiaro', 10, 55, 'Borgo Chiaro')
    ],
    npcs: [
      npc(61, 61, 'Spettatore', 'All’Odeon c’è sempre qualche locandina nuova.', 'fermo'),
      npc(24, 66, 'Elena', 'Che te faccio? Nu bel caffè pe\' riparte\'?', 'fermo'),
      npc(118, 23, 'Cartello', 'Sant’Emidio alle Grotte: da qui, tanto tempo fa, Bobby diede il primo Basilino a chi partiva.', 'fermo'),
      npc(58, 55, 'Bracciante', 'Sti campi \'na volta rendeveno de più, mo\' semo rimasti in pochi.', 'fermo'),
      npc(90, 58, 'Ragazzo', 'Certe bande girano de notte da ste parti, statte accorto.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.campo_parignano;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi (ovest, est, sud) e dall'acqua a sud
    rect(0, 0, 144, 2, 'albero'),
    rect(0, 2, 2, 52, 'albero'), rect(0, 57, 2, 48, 'albero'),
    rect(142, 2, 2, 52, 'albero'), rect(142, 57, 2, 48, 'albero'),
    rect(0, 103, 70, 2, 'albero'), rect(74, 103, 70, 2, 'albero'),
    // stradina davanti a Happy Coffee
    rect(20, 64, 8, 3, 'road'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(10, 20, 3, 2, 'albero'), rect(14, 23, 2, 3, 'albero'),
    rect(34, 73, 2, 3, 'albero'),
    rect(90, 70, 3, 2, 'albero'), rect(94, 73, 2, 3, 'albero')
  );
}());
