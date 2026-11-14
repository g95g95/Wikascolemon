(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.borgo_solesta = {
    ...tall, name: 'Borgo Solestà', baseTile: 'erba', levelRange: [6, 7], encounterTable: [
      { species: 'pito', minLevel: 6, maxLevel: 6, weight: 50 },
      { species: 'segaccio', minLevel: 7, maxLevel: 7, weight: 30 },
      { species: 'basilino', minLevel: 6, maxLevel: 6, weight: 20 }
    ],
    roads: [rect(0, 27, 72, 2), rect(27, 11, 2, 42), rect(60, 24, 2, 36), rect(45, 13, 27, 1)],
    waters: [rect(65, 0, 4, 60, 'water')], bridges: [rect(62, 13, 10, 1, 'bridge'), rect(62, 27, 10, 2, 'bridge')],
    buildings: [
      building(5, 14, 11, 5, 'Borgo residenziale', '#b67859', 'quartiere'),
      building(8, 35, 9, 6, 'Area sportiva', '#7eaa68', 'sport'),
      building(41, 5, 9, 5, 'Margine collinare', '#77985c', 'collina')
    ],
    plazas: [], labels: [{ x: 62, y: 11, text: 'Ponte Romano' }, { x: 58, y: 19, text: 'Porta Solestà' }],
    encounterZones: [zone(5, 32, 22, 18, 0.1, 'default'), zone(36, 3, 23, 15, 0.08, 'default')],
    transitions: [
      transition(71, 13, 1, 1, 'centro_storico', 5, 13, 'Ponte Romano'),
      transition(71, 27, 1, 2, 'campo_parignano', 5, 28, 'Campo Parignano'),
      transition(60, 59, 2, 1, 'borgo_chiaro', 17, 5, 'Borgo Chiaro')
    ],
    npcs: [
      npc(19, 31, 'Residente', 'Il ponte romano conduce dritto al centro.', 'verticale'),
      npc(10, 45, 'Anziano', 'Quant\'anni fa qui c\'era un antro bar, mo\' è tutto chiuso.', 'fermo'),
      npc(53, 11, 'Passante', 'Certe bande girano pé la collina, statte accorto de sera.', 'orizzontale')
    ]
  };
  const map = window.PokemonAscoliMaps.borgo_solesta;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi (est x2, sud) e dall'acqua a est
    rect(0, 0, 72, 1, 'albero'), rect(0, 59, 60, 1, 'albero'), rect(62, 59, 10, 1, 'albero'),
    rect(0, 1, 1, 58, 'albero'),
    rect(60, 1, 1, 11, 'albero'), rect(60, 15, 1, 9, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(30, 32, 2, 2, 'albero'), rect(32, 34, 1, 1, 'albero'),
    rect(8, 23, 1, 1, 'albero'), rect(10, 24, 1, 2, 'albero'),
    rect(47, 45, 2, 1, 'albero'), rect(50, 47, 1, 1, 'albero')
  );
}());
