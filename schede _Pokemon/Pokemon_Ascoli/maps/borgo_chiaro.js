(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.borgo_chiaro = {
    ...tall, name: 'Borgo Chiaro', baseTile: 'erba', levelRange: [8, 9], encounterTable: [
      { species: 'pito', minLevel: 8, maxLevel: 8, weight: 50 },
      { species: 'puledrotto', minLevel: 8, maxLevel: 8, weight: 30 },
      { species: 'segaccio', minLevel: 9, maxLevel: 9, weight: 20 }
    ],
    roads: [rect(0, 36, 96, 2), rect(58, 0, 2, 80), rect(22, 0, 2, 40)], waters: [], bridges: [], plazas: [],
    buildings: [building(30, 12, 16, 11, 'Stadio Cino e Lillo Del Duca', '#a7a9a4', 'stadio')],
    labels: [{ x: 43, y: 33, text: 'STADIO' }],
    encounterZones: [zone(26, 6, 40, 24, 0.1, 'default')],
    transitions: [
      transition(0, 36, 1, 2, 'campo_parignano', 91, 37, 'Campo Parignano'),
      transition(22, 0, 2, 1, 'borgo_solesta', 81, 75, 'Borgo Solestà'),
      transition(58, 79, 2, 1, 'porta_maggiore', 59, 7, 'Porta Maggiore')
    ],
    npcs: [
      npc(49, 43, 'Tifoso', 'Lo stadio è il cuore di Borgo Chiaro.', 'orizzontale'),
      npc(37, 30, 'Steward', 'La domenica se riempie ancora, ma fori\' dallo stadio è tutto chiuso.', 'fermo'),
      npc(67, 60, 'Residente', 'Certe bande se fanno vedè de sera, mejo passà de giorno.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.borgo_chiaro;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai tre passaggi (ovest, nord, sud)
    rect(0, 0, 22, 1, 'albero'), rect(24, 0, 72, 1, 'albero'),
    rect(0, 79, 58, 1, 'albero'), rect(60, 79, 36, 1, 'albero'),
    rect(0, 1, 1, 35, 'albero'), rect(0, 38, 1, 41, 'albero'),
    rect(95, 1, 1, 78, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(7, 13, 2, 2, 'albero'), rect(9, 15, 2, 2, 'albero'),
    rect(67, 53, 2, 2, 'albero'), rect(69, 55, 2, 2, 'albero'),
    rect(73, 20, 2, 1, 'albero'), rect(76, 22, 1, 2, 'albero')
  );
}());
