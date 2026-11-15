(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.campo_parignano = {
    width: 64, height: 45, name: 'Campo Parignano', baseTile: 'erba', levelRange: [5, 7], encounterTable: [
      { species: 'basilino', minLevel: 5, maxLevel: 6, weight: 40 },
      { species: 'pito', minLevel: 5, maxLevel: 6, weight: 40 },
      { species: 'banconio', minLevel: 6, maxLevel: 7, weight: 20 }
    ],
    roads: [rect(0, 26, 64, 3), rect(27, 0, 4, 45), rect(43, 2, 3, 30)],
    waters: [rect(0, 39, 64, 4, 'water')], bridges: [rect(27, 39, 4, 6, 'bridge')], plazas: [],
    buildings: [
      building(13, 17, 12, 8, 'Cinema Odeon', '#a6654f', 'cinema'),
      building(32, 14, 10, 10, 'Chiesa del Sacro Cuore', '#c1a179', 'chiesa'),
      building(47, 2, 14, 10, 'Sant’Emidio alle Grotte', '#8f785f', 'monumento'),
      building(4, 30, 8, 6, 'Happy Coffee', '#b46c52', 'attività', { door: { x: 8, y: 36 }, interior: 'bar' })
    ],
    labels: [{ x: 57, y: 18, text: 'Area delle Grotte' }],
    encounterZones: [zone(12, 14, 31, 12, 0.09, 'default'), zone(46, 2, 16, 18, 0.02, 'default')],
    transitions: [
      transition(27, 43, 4, 2, 'centro_storico', 51, 6, 'Ponte Nuovo'),
      transition(0, 26, 2, 3, 'borgo_solesta', 62, 27, 'Borgo Solestà'),
      transition(62, 26, 2, 3, 'borgo_chiaro', 4, 30, 'Borgo Chiaro')
    ],
    npcs: [
      npc(25, 33, 'Spettatore', 'All’Odeon c’è sempre qualche locandina nuova.', 'fermo'),
      npc(8, 38, 'Elena', 'Che te faccio? Nu bel caffè pe\' riparte\'?', 'fermo'),
      npc(51, 13, 'Cartello', 'Sant’Emidio alle Grotte: da qui, tanto tempo fa, Bobby diede il primo Basilino a chi partiva.', 'fermo'),
      npc(23, 27, 'Bracciante', 'Sti campi \'na volta rendeveno de più, mo\' semo rimasti in pochi.', 'fermo'),
      npc(42, 30, 'Ragazzo', 'Certe bande girano de notte da ste parti, statte accorto.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.campo_parignano;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi (ovest, est, sud) e dall'acqua a sud
    rect(0, 0, 64, 2, 'albero'),
    rect(0, 2, 2, 24, 'albero'), rect(0, 29, 2, 10, 'albero'),
    rect(62, 2, 2, 24, 'albero'), rect(62, 29, 2, 10, 'albero'),
    
    // stradina davanti a Happy Coffee
    rect(4, 36, 8, 3, 'road'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(2, 10, 1, 2, 'albero'), 
    
    
  );
}());
