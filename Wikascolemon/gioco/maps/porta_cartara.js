(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.porta_cartara = {
    width: 93, height: 62, name: 'Porta Cartara', baseTile: 'erba', levelRange: [5, 7], encounterTable: [
      { species: 'tuffito', minLevel: 5, maxLevel: 6, weight: 50 },
      { species: 'soldatino', minLevel: 5, maxLevel: 7, weight: 20 },
      { species: 'cavedi', minLevel: 5, maxLevel: 7, weight: 15 },
      { species: 'tamburino', minLevel: 6, maxLevel: 7, weight: 15 }
    ],
    roads: [rect(34, 0, 4, 62), rect(0, 25, 93, 3), rect(0, 45, 93, 3)],
    waters: [rect(0, 34, 93, 7, 'water')], bridges: [rect(34, 32, 4, 10, 'bridge')],
    buildings: [building(43, 8, 20, 10, 'Porta Cartara', '#a97a5d', 'porta')], plazas: [],
    labels: [{ x: 50, y: 39, text: 'RIO CASTELLANO' }],
    encounterZones: [zone(0, 30, 93, 4, 0.12, 'default'), zone(0, 41, 93, 3, 0.12, 'default')],
    transitions: [transition(34, 0, 4, 2, 'centro_storico', 57, 83, 'Centro Storico')],
    npcs: [
      npc(50, 51, 'Pescatore', 'I Tuffito si muovono in gruppo lungo il Rio Castellano.', 'fermo'),
      npc(26, 32, 'Cartello', 'Rio Castellano: qui Bobby diede il primo Tuffito a chi sceglieva l’acqua.', 'fermo'),
      npc(18, 47, 'Lavandaia', 'Da ragazza si veniva qui a lavà li panni, mo\' nemmanco più.', 'fermo'),
      npc(70, 27, 'Passante', 'Con l’acqua alta certe volte il fiume s\'ariprenne tutto.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.porta_cartara;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dal passaggio a nord
    rect(0, 0, 34, 2, 'albero'), rect(38, 0, 55, 2, 'albero'),
    rect(0, 60, 93, 2, 'albero'),
    rect(0, 2, 2, 58, 'albero'), rect(91, 2, 2, 58, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(5, 11, 1, 2, 'albero'), rect(6, 14, 1, 3, 'albero'),
    rect(78, 11, 1, 2, 'albero'), rect(79, 14, 1, 3, 'albero'),
    rect(6, 54, 1, 1, 'albero'),
    rect(79, 54, 1, 1, 'albero')
  );
}());
