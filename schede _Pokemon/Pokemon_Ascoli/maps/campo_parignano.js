(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.campo_parignano = {
    ...tall, name: 'Campo Parignano', baseTile: 'erba', levelRange: [6, 8], encounterTable: [
      { species: 'basilino', minLevel: 6, maxLevel: 6, weight: 50 },
      { species: 'pito', minLevel: 7, maxLevel: 7, weight: 40 },
      { species: 'banconio', minLevel: 8, maxLevel: 8, weight: 10 }
    ],
    roads: [rect(0, 54, 144, 3), rect(70, 0, 4, 120), rect(105, 12, 3, 48)],
    waters: [rect(0, 105, 144, 9, 'water')], bridges: [rect(70, 102, 4, 18, 'bridge')], plazas: [],
    buildings: [
      building(48, 33, 12, 8, 'Cinema Odeon', '#a6654f', 'cinema'),
      building(78, 30, 10, 10, 'Chiesa del Sacro Cuore', '#c1a179', 'chiesa'),
      building(114, 12, 14, 10, 'Sant’Emidio alle Grotte', '#8f785f', 'monumento')
    ],
    labels: [{ x: 124, y: 34, text: 'Area delle Grotte' }],
    encounterZones: [zone(42, 27, 60, 24, 0.09, 'default'), zone(111, 6, 30, 30, 0.02, 'default')],
    transitions: [
      transition(70, 118, 4, 2, 'centro_storico', 73, 10, 'Ponte Nuovo'),
      transition(0, 54, 2, 3, 'borgo_solesta', 136, 55, 'Borgo Solestà'),
      transition(142, 54, 2, 3, 'borgo_chiaro', 10, 55, 'Borgo Chiaro')
    ],
    npcs: [npc(61, 61, 'Spettatore', 'All’Odeon c’è sempre qualche locandina nuova.', 'fermo')]
  };
  const map = window.PokemonAscoliMaps.campo_parignano;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi (ovest, est, sud) e dall'acqua a sud
    rect(0, 0, 144, 2, 'albero'),
    rect(0, 2, 2, 52, 'albero'), rect(0, 57, 2, 48, 'albero'),
    rect(142, 2, 2, 52, 'albero'), rect(142, 57, 2, 48, 'albero'),
    rect(0, 103, 70, 2, 'albero'), rect(74, 103, 70, 2, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(10, 20, 3, 2, 'albero'), rect(14, 23, 2, 3, 'albero'),
    rect(30, 70, 3, 2, 'albero'), rect(34, 73, 2, 3, 'albero'),
    rect(90, 70, 3, 2, 'albero'), rect(94, 73, 2, 3, 'albero')
  );
}());
