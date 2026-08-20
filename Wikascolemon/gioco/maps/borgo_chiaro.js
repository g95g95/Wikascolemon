(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.borgo_chiaro = {
    ...tall, name: 'Borgo Chiaro', baseTile: 'erba', levelRange: [8, 9], encounterTable: [
      { species: 'pito', minLevel: 8, maxLevel: 8, weight: 50 },
      { species: 'puledrotto', minLevel: 8, maxLevel: 8, weight: 30 },
      { species: 'segaccio', minLevel: 9, maxLevel: 9, weight: 20 }
    ],
    roads: [rect(0, 54, 144, 3), rect(87, 0, 3, 120), rect(33, 0, 3, 60)], waters: [], bridges: [], plazas: [],
    buildings: [building(45, 18, 24, 16, 'Stadio Cino e Lillo Del Duca', '#a7a9a4', 'stadio')],
    labels: [{ x: 64, y: 49, text: 'STADIO' }],
    encounterZones: [zone(39, 9, 60, 36, 0.1, 'default')],
    transitions: [
      transition(0, 54, 2, 3, 'campo_parignano', 136, 55, 'Campo Parignano'),
      transition(33, 0, 3, 2, 'borgo_solesta', 121, 112, 'Borgo Solestà'),
      transition(87, 118, 3, 2, 'porta_maggiore', 88, 10, 'Porta Maggiore')
    ],
    npcs: [
      npc(73, 64, 'Tifoso', 'Lo stadio è il cuore di Borgo Chiaro.', 'orizzontale'),
      npc(55, 45, 'Steward', 'La domenica se riempie ancora, ma fori\' dallo stadio è tutto chiuso.', 'fermo'),
      npc(100, 90, 'Residente', 'Certe bande se fanno vedè de sera, mejo passà de giorno.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.borgo_chiaro;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai tre passaggi (ovest, nord, sud)
    rect(0, 0, 33, 2, 'albero'), rect(36, 0, 108, 2, 'albero'),
    rect(0, 118, 87, 2, 'albero'), rect(90, 118, 54, 2, 'albero'),
    rect(0, 2, 2, 52, 'albero'), rect(0, 57, 2, 61, 'albero'),
    rect(142, 2, 2, 116, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(10, 20, 3, 2, 'albero'), rect(14, 23, 2, 3, 'albero'),
    rect(100, 80, 3, 2, 'albero'), rect(104, 83, 2, 3, 'albero'),
    rect(110, 30, 3, 2, 'albero'), rect(114, 33, 2, 3, 'albero')
  );
}());
