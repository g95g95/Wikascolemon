(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.centro_storico = {
    ...city, name: 'Centro Storico', baseTile: 'travertino', levelRange: [4, 8], encounterTable: [
      { species: 'banconio', minLevel: 4, maxLevel: 4, weight: 55 },
      { species: 'basilino', minLevel: 5, maxLevel: 5, weight: 35 },
      { species: 'ciccharizard', minLevel: 8, maxLevel: 8, weight: 10 }
    ],
    roads: [rect(0, 54, 144, 3), rect(70, 0, 4, 108), rect(0, 23, 108, 2), rect(30, 80, 54, 2)],
    waters: [], bridges: [],
    buildings: [
      building(39, 30, 16, 8, 'Palazzo dei Capitani', '#b89068', 'monumento'),
      building(12, 6, 18, 8, 'Teatro Ventidio Basso', '#a8755f', 'teatro'),
      building(87, 66, 20, 12, 'Cattedrale di Sant’Emidio', '#c09b70', 'chiesa'),
      building(120, 69, 6, 6, 'Battistero', '#c7a77d', 'chiesa'),
      building(21, 49, 8, 6, 'Bar Callare', '#b46c52', 'attività', { door: { x: 25, y: 55 }, interior: 'bar' })
    ],
    plazas: [rect(36, 42, 30, 21, 'piazza'), rect(81, 60, 54, 30, 'piazza')],
    labels: [{ x: 52, y: 49, text: 'Piazza del Popolo' }, { x: 100, y: 64, text: 'Piazza Arringo' }],
    encounterZones: [zone(6, 12, 132, 84, 0.035, 'default')],
    transitions: [
      transition(142, 54, 2, 3, 'porta_maggiore', 10, 55, 'Ponte di Porta Maggiore'),
      transition(70, 0, 4, 2, 'campo_parignano', 73, 112, 'Ponte Nuovo'),
      transition(0, 23, 2, 2, 'borgo_solesta', 133, 26, 'Porta Solestà'),
      transition(70, 106, 4, 2, 'porta_cartara', 73, 10, 'Porta Cartara')
    ],
    npcs: [
      npc(49, 58, 'Cittadino', 'Piazza del Popolo è il salotto della città.', 'orizzontale'),
      npc(109, 88, 'Visitatrice', 'Il travertino cambia colore con la luce.', 'fermo')
    ]
  };
  const map = window.PokemonAscoliMaps.centro_storico;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai quattro passaggi (est, nord, ovest, sud)
    rect(0, 0, 70, 2, 'albero'), rect(74, 0, 70, 2, 'albero'),
    rect(0, 106, 70, 2, 'albero'), rect(74, 106, 70, 2, 'albero'),
    rect(0, 2, 2, 21, 'albero'), rect(0, 25, 2, 81, 'albero'),
    rect(142, 2, 2, 52, 'albero'), rect(142, 57, 2, 49, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(6, 90, 3, 2, 'albero'), rect(10, 93, 2, 3, 'albero'),
    rect(130, 12, 3, 2, 'albero'), rect(134, 15, 2, 3, 'albero')
  );
}());
