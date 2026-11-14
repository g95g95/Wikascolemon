(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.borgo_chiaro = {
    width: 76, height: 65, name: 'Borgo Chiaro', baseTile: 'erba', levelRange: [8, 9], encounterTable: [
      { species: 'pito', minLevel: 8, maxLevel: 8, weight: 50 },
      { species: 'puledrotto', minLevel: 8, maxLevel: 8, weight: 30 },
      { species: 'segaccio', minLevel: 9, maxLevel: 9, weight: 20 }
    ],
    roads: [rect(0, 36, 76, 3), rect(57, 0, 3, 65), rect(13, 0, 3, 42)], waters: [], bridges: [], plazas: [],
    buildings: [building(20, 10, 24, 16, 'Stadio Cino e Lillo Del Duca', '#a7a9a4', 'stadio')],
    labels: [{ x: 39, y: 34, text: 'STADIO' }],
    encounterZones: [zone(18, 5, 45, 26, 0.1, 'default')],
    transitions: [
      transition(0, 36, 2, 3, 'campo_parignano', 76, 37, 'Campo Parignano'),
      transition(13, 0, 3, 2, 'borgo_solesta', 64, 61, 'Borgo Solestà'),
      transition(57, 63, 3, 2, 'porta_maggiore', 64, 4, 'Porta Maggiore')
    ],
    npcs: [
      npc(47, 44, 'Tifoso', 'Lo stadio è il cuore di Borgo Chiaro.', 'orizzontale'),
      npc(30, 31, 'Steward', 'La domenica se riempie ancora, ma fori\' dallo stadio è tutto chiuso.', 'fermo'),
      npc(64, 52, 'Residente', 'Certe bande se fanno vedè de sera, mejo passà de giorno.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.borgo_chiaro;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai tre passaggi (ovest, nord, sud)
    rect(0, 0, 13, 2, 'albero'), rect(16, 0, 60, 2, 'albero'),
    rect(0, 63, 57, 2, 'albero'), rect(60, 63, 16, 2, 'albero'),
    rect(0, 2, 2, 34, 'albero'), rect(0, 39, 2, 24, 'albero'),
    rect(74, 2, 2, 61, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(6, 12, 2, 2, 'albero'), rect(8, 15, 1, 3, 'albero'),
    
    rect(68, 25, 1, 3, 'albero')
  );
}());
