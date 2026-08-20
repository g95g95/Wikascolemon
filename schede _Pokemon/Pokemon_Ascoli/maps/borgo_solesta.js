(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.borgo_solesta = {
    ...tall, name: 'Borgo Solestà', baseTile: 'erba', levelRange: [6, 7], encounterTable: [
      { species: 'pito', minLevel: 6, maxLevel: 6, weight: 50 },
      { species: 'segaccio', minLevel: 7, maxLevel: 7, weight: 30 },
      { species: 'basilino', minLevel: 6, maxLevel: 6, weight: 20 }
    ],
    roads: [rect(0, 54, 144, 3), rect(54, 21, 3, 84), rect(120, 48, 3, 72), rect(90, 26, 54, 2)],
    waters: [rect(129, 0, 9, 120, 'water')], bridges: [rect(123, 26, 21, 2, 'bridge'), rect(123, 54, 21, 3, 'bridge')],
    buildings: [
      building(9, 27, 22, 10, 'Borgo residenziale', '#b67859', 'quartiere'),
      building(15, 69, 18, 12, 'Area sportiva', '#7eaa68', 'sport'),
      building(81, 9, 20, 10, 'Margine collinare', '#77985c', 'collina')
    ],
    plazas: [], labels: [{ x: 124, y: 22, text: 'Ponte Romano' }, { x: 115, y: 37, text: 'Porta Solestà' }],
    encounterZones: [zone(9, 63, 45, 36, 0.1, 'default'), zone(72, 6, 45, 30, 0.08, 'default')],
    transitions: [
      transition(142, 26, 2, 2, 'centro_storico', 10, 25, 'Ponte Romano'),
      transition(142, 54, 2, 3, 'campo_parignano', 10, 55, 'Campo Parignano'),
      transition(120, 118, 3, 2, 'borgo_chiaro', 34, 10, 'Borgo Chiaro')
    ],
    npcs: [
      npc(37, 61, 'Residente', 'Il ponte romano conduce dritto al centro.', 'verticale'),
      npc(20, 90, 'Anziano', 'Quant\'anni fa qui c\'era un antro bar, mo\' è tutto chiuso.', 'fermo'),
      npc(105, 22, 'Passante', 'Certe bande girano pé la collina, statte accorto de sera.', 'orizzontale')
    ]
  };
  const map = window.PokemonAscoliMaps.borgo_solesta;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi (est x2, sud) e dall'acqua a est
    rect(0, 0, 144, 2, 'albero'), rect(0, 118, 120, 2, 'albero'), rect(123, 118, 21, 2, 'albero'),
    rect(0, 2, 2, 116, 'albero'),
    rect(120, 2, 2, 22, 'albero'), rect(120, 30, 2, 18, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(60, 65, 3, 2, 'albero'), rect(64, 68, 2, 3, 'albero'),
    rect(15, 45, 3, 2, 'albero'), rect(19, 48, 2, 3, 'albero'),
    rect(95, 90, 3, 2, 'albero'), rect(99, 93, 2, 3, 'albero')
  );
}());
