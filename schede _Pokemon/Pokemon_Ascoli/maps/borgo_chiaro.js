(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.borgo_chiaro = {
    ...tall, name: 'Borgo Chiaro', baseTile: 'erba', levelRange: [8, 9], encounterTable: [
      { species: 'pito', minLevel: 8, maxLevel: 8, weight: 50 },
      { species: 'puledrotto', minLevel: 8, maxLevel: 8, weight: 30 },
      { species: 'segaccio', minLevel: 9, maxLevel: 9, weight: 20 }
    ],
    roads: [rect(0, 27, 72, 2), rect(44, 0, 1, 60), rect(17, 0, 1, 30)], waters: [], bridges: [], plazas: [],
    buildings: [building(23, 9, 12, 8, 'Stadio Cino e Lillo Del Duca', '#a7a9a4', 'stadio')],
    labels: [{ x: 32, y: 25, text: 'STADIO' }],
    encounterZones: [zone(20, 5, 30, 18, 0.1, 'default')],
    transitions: [
      transition(0, 27, 1, 2, 'campo_parignano', 68, 28, 'Campo Parignano'),
      transition(17, 0, 1, 1, 'borgo_solesta', 61, 56, 'Borgo Solestà'),
      transition(44, 59, 1, 1, 'porta_maggiore', 44, 5, 'Porta Maggiore')
    ],
    npcs: [
      npc(37, 32, 'Tifoso', 'Lo stadio è il cuore di Borgo Chiaro.', 'orizzontale'),
      npc(28, 23, 'Steward', 'La domenica se riempie ancora, ma fori\' dallo stadio è tutto chiuso.', 'fermo'),
      npc(50, 45, 'Residente', 'Certe bande se fanno vedè de sera, mejo passà de giorno.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.borgo_chiaro;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai tre passaggi (ovest, nord, sud)
    rect(0, 0, 17, 1, 'albero'), rect(18, 0, 54, 1, 'albero'),
    rect(0, 59, 44, 1, 'albero'), rect(45, 59, 27, 1, 'albero'),
    rect(0, 1, 1, 26, 'albero'), rect(0, 29, 1, 30, 'albero'),
    rect(71, 1, 1, 58, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(5, 10, 2, 1, 'albero'), rect(7, 11, 1, 2, 'albero'),
    rect(50, 40, 2, 1, 'albero'), rect(52, 41, 1, 2, 'albero'),
    rect(55, 15, 1, 1, 'albero'), rect(57, 17, 1, 1, 'albero')
  );
}());
