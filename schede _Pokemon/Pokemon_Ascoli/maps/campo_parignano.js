(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.campo_parignano = {
    width: 81, height: 63, name: 'Campo Parignano', baseTile: 'erba', levelRange: [5, 7], encounterTable: [
      { species: 'basilino', minLevel: 5, maxLevel: 6, weight: 40 },
      { species: 'pito', minLevel: 5, maxLevel: 6, weight: 40 },
      { species: 'banconio', minLevel: 6, maxLevel: 7, weight: 20 }
    ],
    roads: [rect(0, 36, 81, 3), rect(36, 0, 4, 63), rect(56, 5, 3, 37)],
    waters: [rect(0, 55, 81, 4, 'water')], bridges: [rect(36, 55, 4, 8, 'bridge')], plazas: [],
    buildings: [
      building(17, 23, 12, 8, 'Cinema Odeon', '#a6654f', 'cinema'),
      building(42, 20, 10, 10, 'Chiesa del Sacro Cuore', '#c1a179', 'chiesa'),
      building(60, 5, 14, 10, 'Sant’Emidio alle Grotte', '#8f785f', 'monumento'),
      building(7, 40, 8, 6, 'Happy Coffee', '#b46c52', 'attività', { door: { x: 11, y: 46 }, interior: 'bar' })
    ],
    labels: [{ x: 70, y: 24, text: 'Area delle Grotte' }],
    encounterZones: [zone(16, 19, 40, 16, 0.09, 'default'), zone(59, 3, 19, 23, 0.02, 'default')],
    transitions: [
      transition(36, 61, 4, 2, 'centro_storico', 57, 8, 'Ponte Nuovo'),
      transition(0, 36, 2, 3, 'borgo_solesta', 71, 34, 'Borgo Solestà'),
      transition(79, 36, 2, 3, 'borgo_chiaro', 6, 37, 'Borgo Chiaro')
    ],
    npcs: [
      npc(30, 43, 'Spettatore', 'All’Odeon c’è sempre qualche locandina nuova.', 'fermo'),
      npc(11, 48, 'Elena', 'Che te faccio? Nu bel caffè pe\' riparte\'?', 'fermo'),
      npc(64, 16, 'Cartello', 'Sant’Emidio alle Grotte: da qui, tanto tempo fa, Bobby diede il primo Basilino a chi partiva.', 'fermo'),
      npc(27, 37, 'Bracciante', 'Sti campi \'na volta rendeveno de più, mo\' semo rimasti in pochi.', 'fermo'),
      npc(54, 40, 'Ragazzo', 'Certe bande girano de notte da ste parti, statte accorto.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.campo_parignano;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi (ovest, est, sud) e dall'acqua a sud
    rect(0, 0, 81, 2, 'albero'),
    rect(0, 2, 2, 34, 'albero'), rect(0, 39, 2, 16, 'albero'),
    rect(79, 2, 2, 34, 'albero'), rect(79, 39, 2, 16, 'albero'),
    
    // stradina davanti a Happy Coffee
    rect(7, 46, 8, 3, 'road'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(4, 13, 2, 2, 'albero'), 
    
    rect(54, 50, 2, 1, 'albero'), 
  );
}());
