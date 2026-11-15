(function () {
  const { building, rect, zone, transition, npc, tall } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.borgo_solesta = {
    width: 66, height: 48, name: 'Borgo Solestà', baseTile: 'erba', levelRange: [6, 7], encounterTable: [
      { species: 'pito', minLevel: 6, maxLevel: 6, weight: 50 },
      { species: 'tamburino', minLevel: 6, maxLevel: 7, weight: 30 },
      { species: 'basilino', minLevel: 6, maxLevel: 6, weight: 20 }
    ],
    roads: [rect(0, 26, 66, 3), rect(30, 13, 3, 32), rect(55, 26, 3, 22), rect(43, 14, 23, 2)],
    waters: [rect(58, 0, 6, 48, 'water')], bridges: [rect(58, 14, 8, 2, 'bridge'), rect(58, 26, 8, 3, 'bridge')],
    buildings: [
      building(3, 15, 22, 10, 'Borgo residenziale', '#b67859', 'quartiere'),
      building(9, 31, 18, 12, 'Area sportiva', '#7eaa68', 'sport'),
      building(34, 2, 20, 10, 'Margine collinare', '#77985c', 'collina')
    ],
    plazas: [], labels: [{ x: 58, y: 13, text: 'Ponte Romano' }, { x: 55, y: 25, text: 'Porta Solestà' }],
    encounterZones: [zone(3, 31, 27, 14, 0.1, 'default'), zone(33, 2, 22, 22, 0.08, 'default')],
    transitions: [
      transition(64, 14, 2, 2, 'centro_storico', 2, 17, 'Ponte Romano'),
      transition(64, 26, 2, 3, 'campo_parignano', 2, 27, 'Campo Parignano'),
      transition(55, 46, 3, 2, 'borgo_chiaro', 8, 4, 'Borgo Chiaro')
    ],
    npcs: [
      npc(27, 30, 'Residente', 'Il ponte romano conduce dritto al centro.', 'verticale'),
      npc(14, 44, 'Anziano', 'Quant\'anni fa qui c\'era un antro bar, mo\' è tutto chiuso.', 'fermo'),
      npc(54, 13, 'Passante', 'Certe bande girano pé la collina, statte accorto de sera.', 'orizzontale')
    ]
  };
  const map = window.PokemonAscoliMaps.borgo_solesta;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai passaggi (est x2, sud) e dall'acqua a est
    rect(0, 0, 66, 2, 'albero'), rect(0, 46, 55, 2, 'albero'), rect(58, 46, 8, 2, 'albero'),
    rect(0, 2, 2, 44, 'albero'),
    rect(55, 2, 2, 12, 'albero'), rect(55, 18, 2, 8, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    
    
    rect(48, 44, 3, 1, 'albero'), 
  );
}());
