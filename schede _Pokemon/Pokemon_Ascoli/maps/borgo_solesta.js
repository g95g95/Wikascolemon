(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.borgo_solesta = {
    ...tall, name: 'Borgo Solestà', baseTile: 'erba', levelRange: [6, 7], encounterTable: [
      { species: 'pito', minLevel: 6, maxLevel: 6, weight: 50 },
      { species: 'segaccio', minLevel: 7, maxLevel: 7, weight: 30 },
      { species: 'basilino', minLevel: 6, maxLevel: 6, weight: 20 }
    ],
    roads: [rect(0, 36, 96, 2), rect(36, 14, 2, 56), rect(80, 32, 2, 48), rect(60, 17, 36, 2)],
    waters: [rect(86, 0, 6, 80, 'water')], bridges: [rect(82, 17, 14, 2, 'bridge'), rect(82, 36, 14, 2, 'bridge')],
    buildings: [
      building(6, 18, 15, 7, 'Borgo residenziale', '#b67859', 'quartiere'),
      building(10, 46, 12, 8, 'Area sportiva', '#7eaa68', 'sport'),
      building(54, 6, 13, 7, 'Margine collinare', '#77985c', 'collina')
    ],
    plazas: [], labels: [{ x: 83, y: 15, text: 'Ponte Romano' }, { x: 77, y: 25, text: 'Porta Solestà' }],
    encounterZones: [zone(6, 42, 30, 24, 0.1, 'default'), zone(48, 4, 30, 20, 0.08, 'default')],
    transitions: [
      transition(95, 17, 1, 2, 'centro_storico', 7, 17, 'Ponte Romano'),
      transition(95, 36, 1, 2, 'campo_parignano', 7, 37, 'Campo Parignano'),
      transition(80, 79, 2, 1, 'borgo_chiaro', 23, 7, 'Borgo Chiaro')
    ],
    npcs: [
      npc(25, 41, 'Residente', 'Il ponte romano conduce dritto al centro.', 'verticale'),
      npc(13, 60, 'Anziano', 'Quant\'anni fa qui c\'era un antro bar, mo\' è tutto chiuso.', 'fermo'),
      npc(70, 15, 'Passante', 'Certe bande girano pé la collina, statte accorto de sera.', 'orizzontale')
    ]
  };
  const map = window.PokemonAscoliMaps.borgo_solesta;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi (est x2, sud) e dall'acqua a est
    rect(0, 0, 96, 1, 'albero'), rect(0, 79, 80, 1, 'albero'), rect(82, 79, 14, 1, 'albero'),
    rect(0, 1, 1, 78, 'albero'),
    rect(80, 1, 1, 15, 'albero'), rect(80, 20, 1, 12, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(40, 43, 2, 2, 'albero'), rect(43, 45, 1, 2, 'albero'),
    rect(10, 30, 2, 1, 'albero'), rect(13, 32, 1, 2, 'albero'),
    rect(63, 60, 2, 1, 'albero'), rect(66, 62, 1, 2, 'albero')
  );
}());
