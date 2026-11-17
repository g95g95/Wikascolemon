(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.borgo_chiaro = {
    width: 57, height: 50, name: 'Borgo Chiaro', baseTile: 'erba', levelRange: [8, 9], encounterTable: [
      { species: 'pito', minLevel: 8, maxLevel: 8, weight: 50 },
      { species: 'puledrotto', minLevel: 8, maxLevel: 8, weight: 30 },
      { species: 'ciuci', minLevel: 8, maxLevel: 9, weight: 20 }
    ],
    // gli ultimi due rettangoli chiudono una radura a nord-est: ci si entra solo dal varco in (54, 8)
    roads: [rect(0, 29, 57, 3), rect(46, 0, 3, 50), rect(7, 0, 3, 35), rect(49, 2, 1, 6, 'albero'), rect(49, 8, 5, 1, 'albero')], waters: [], bridges: [], plazas: [],
    buildings: [building(12, 7, 24, 16, 'Stadio Cino e Lillo Del Duca', '#a7a9a4', 'stadio')],
    labels: [{ x: 31, y: 28, text: 'STADIO' }],
    encounterZones: [zone(11, 4, 40, 22, 0.1, 'default')],
    transitions: [
      transition(0, 29, 2, 3, 'campo_parignano', 61, 27, 'Campo Parignano'),
      transition(7, 0, 3, 2, 'borgo_solesta', 56, 45, 'Borgo Solestà'),
      transition(46, 48, 3, 2, 'porta_maggiore', 58, 2, 'Porta Maggiore')
    ],
    npcs: [
      npc(37, 36, 'Tifoso', 'Lo stadio è il cuore di Borgo Chiaro.', 'orizzontale'),
      npc(22, 26, 'Steward', 'La domenica se rempie ancora, ma fore de lu stadie è tutte chiuse.', 'fermo'),
      npc(51, 41, 'Residente', 'Certe bande se fà vedé de sera, mègghje passà de giorne.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.borgo_chiaro;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai tre passaggi (ovest, nord, sud)
    rect(0, 0, 7, 2, 'albero'), rect(10, 0, 47, 2, 'albero'),
    rect(0, 48, 46, 2, 'albero'), rect(49, 48, 8, 2, 'albero'),
    rect(0, 2, 2, 27, 'albero'), rect(0, 32, 2, 16, 'albero'),
    rect(55, 2, 2, 46, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(4, 9, 1, 2, 'albero'), rect(5, 12, 1, 3, 'albero'),
    
    
  );
}());
