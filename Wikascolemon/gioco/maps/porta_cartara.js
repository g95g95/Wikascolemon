(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.porta_cartara = {
    ...wide, name: 'Porta Cartara', baseTile: 'erba', levelRange: [5, 7], encounterTable: [
      { species: 'tuffito', minLevel: 5, maxLevel: 6, weight: 50 },
      { species: 'soldatino', minLevel: 5, maxLevel: 7, weight: 20 },
      { species: 'cavedi', minLevel: 5, maxLevel: 7, weight: 15 },
      { species: 'tamburino', minLevel: 6, maxLevel: 7, weight: 15 }
    ],
    roads: [rect(35, 0, 2, 60), rect(0, 17, 90, 1), rect(0, 42, 90, 2)],
    waters: [rect(0, 24, 90, 12, 'water')], bridges: [rect(35, 23, 2, 15, 'bridge')],
    buildings: [building(42, 6, 10, 5, 'Porta Cartara', '#a97a5d', 'porta')], plazas: [],
    labels: [{ x: 46, y: 32, text: 'RIO CASTELLANO' }],
    encounterZones: [zone(0, 20, 90, 4, 0.12, 'default'), zone(0, 36, 90, 5, 0.12, 'default')],
    transitions: [transition(35, 0, 2, 1, 'centro_storico', 37, 50, 'Centro Storico')],
    npcs: [
      npc(46, 46, 'Pescatore', 'I Tuffito si muovono in gruppo lungo il Rio Castellano.', 'fermo'),
      npc(30, 23, 'Cartello', 'Rio Castellano: qui Bobby diede il primo Tuffito a chi sceglieva l’acqua.', 'fermo'),
      npc(23, 43, 'Lavandaia', 'Da ragazza si veniva qui a lavà li panni, mo\' nemmanco più.', 'fermo'),
      npc(60, 17, 'Passante', 'Con l’acqua alta certe volte il fiume s\'ariprenne tutto.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.porta_cartara;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dal passaggio a nord
    rect(0, 0, 35, 1, 'albero'), rect(37, 0, 53, 1, 'albero'),
    rect(0, 59, 90, 1, 'albero'),
    rect(0, 1, 1, 58, 'albero'), rect(89, 1, 1, 58, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(5, 8, 2, 1, 'albero'), rect(7, 9, 1, 2, 'albero'),
    rect(70, 8, 1, 1, 'albero'), rect(72, 9, 1, 2, 'albero'),
    rect(5, 47, 2, 2, 'albero'), rect(7, 49, 1, 1, 'albero'),
    rect(70, 47, 1, 2, 'albero'), rect(72, 49, 1, 1, 'albero')
  );
}());
