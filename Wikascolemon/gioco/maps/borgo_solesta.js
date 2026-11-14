(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.borgo_solesta = {
    width: 76, height: 66, name: 'Borgo Solestà', baseTile: 'erba', levelRange: [6, 7], encounterTable: [
      { species: 'pito', minLevel: 6, maxLevel: 6, weight: 50 },
      { species: 'segaccio', minLevel: 7, maxLevel: 7, weight: 30 },
      { species: 'basilino', minLevel: 6, maxLevel: 6, weight: 20 }
    ],
    roads: [rect(0, 33, 76, 3), rect(34, 15, 3, 45), rect(63, 32, 3, 34), rect(47, 19, 29, 2)],
    waters: [rect(67, 0, 6, 66, 'water')], bridges: [rect(66, 19, 10, 2, 'bridge'), rect(66, 33, 10, 3, 'bridge')],
    buildings: [
      building(3, 20, 22, 10, 'Borgo residenziale', '#b67859', 'quartiere'),
      building(9, 43, 18, 12, 'Area sportiva', '#7eaa68', 'sport'),
      building(38, 3, 20, 10, 'Margine collinare', '#77985c', 'collina')
    ],
    plazas: [], labels: [{ x: 67, y: 16, text: 'Ponte Romano' }, { x: 62, y: 30, text: 'Porta Solestà' }],
    encounterZones: [zone(3, 42, 31, 18, 0.1, 'default'), zone(37, 2, 25, 27, 0.08, 'default')],
    transitions: [
      transition(74, 19, 2, 2, 'centro_storico', 4, 21, 'Ponte Romano'),
      transition(74, 33, 2, 3, 'campo_parignano', 4, 37, 'Campo Parignano'),
      transition(63, 64, 3, 2, 'borgo_chiaro', 14, 6, 'Borgo Chiaro')
    ],
    npcs: [
      npc(29, 40, 'Residente', 'Il ponte romano conduce dritto al centro.', 'verticale'),
      npc(14, 58, 'Anziano', 'Quant\'anni fa qui c\'era un antro bar, mo\' è tutto chiuso.', 'fermo'),
      npc(60, 16, 'Passante', 'Certe bande girano pé la collina, statte accorto de sera.', 'orizzontale')
    ]
  };
  const map = window.PokemonAscoliMaps.borgo_solesta;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi (est x2, sud) e dall'acqua a est
    rect(0, 0, 76, 2, 'albero'), rect(0, 64, 63, 2, 'albero'), rect(66, 64, 10, 2, 'albero'),
    rect(0, 2, 2, 62, 'albero'),
    rect(63, 2, 2, 16, 'albero'), rect(63, 23, 2, 9, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    
    
    rect(52, 58, 3, 2, 'albero'), 
  );
}());
