(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.centro_storico = {
    ...city, name: 'Centro Storico', baseTile: 'travertino', levelRange: [3, 5], encounterTable: [
      { species: 'tamburino', minLevel: 3, maxLevel: 5, weight: 45 },
      { species: 'anicino', minLevel: 3, maxLevel: 5, weight: 40 },
      { species: 'banconio', minLevel: 3, maxLevel: 5, weight: 15 }
    ],
    roads: [rect(0, 36, 96, 2), rect(47, 0, 2, 72), rect(0, 15, 72, 2), rect(20, 53, 36, 2)],
    waters: [], bridges: [],
    buildings: [
      building(26, 20, 11, 5, 'Palazzo dei Capitani', '#b89068', 'monumento'),
      building(8, 4, 12, 5, 'Teatro Ventidio Basso', '#a8755f', 'teatro', {
        door: { x: 13, y: 9 },
        script: [{
          if: { flag: 'ventidio_visto' },
          then: [{ say: 'Il teatro è ancora chiuso per le riprese. Ossidio tornerà.', name: 'Maschera' }],
          else: [
            {
              say: [
                'La palestra del Ventidio è chiusa: "riprese", dicono.',
                'Er capopalestra Ossidio non c\'è, è via pé \'ste riprese.',
                'Se vuoi girà, pija la Salaria vero \'l mare, passanno da Monticelli.',
                'Torna quanno riapre, uagliò.'
              ],
              name: 'Maschera'
            },
            { setFlag: 'ventidio_visto' }
          ]
        }]
      }),
      building(58, 44, 13, 8, 'Cattedrale di Sant’Emidio', '#c09b70', 'chiesa'),
      building(80, 46, 4, 4, 'Battistero', '#c7a77d', 'chiesa'),
      building(14, 33, 5, 4, 'Bar Callare (Steven)', '#b46c52', 'attività', { door: { x: 17, y: 37 }, interior: 'bar' }),
      building(40, 59, 5, 4, 'Casa', '#98785e'),
      building(63, 27, 5, 4, 'Casa', '#98785e'),
      building(30, 8, 4, 4, 'Casa', '#98785e')
    ],
    plazas: [rect(24, 28, 20, 14, 'piazza'), rect(56, 52, 31, 11, 'piazza')],
    labels: [{ x: 35, y: 33, text: 'Piazza del Popolo' }, { x: 67, y: 55, text: 'Piazza Arringo' }],
    encounterZones: [zone(4, 8, 88, 56, 0.035, 'default')],
    transitions: [
      transition(95, 36, 1, 2, 'porta_maggiore', 7, 37, 'Ponte di Porta Maggiore'),
      transition(47, 0, 2, 1, 'campo_parignano', 48, 75, 'Ponte Nuovo'),
      transition(0, 15, 1, 2, 'borgo_solesta', 89, 17, 'Porta Solestà'),
      transition(47, 71, 2, 1, 'porta_cartara', 49, 7, 'Porta Cartara')
    ],
    npcs: [
      npc(33, 39, 'Cittadino', 'Bande de regazzi girano la notte, mo\' manco più en piazza se sta tranquilli.', 'orizzontale'),
      npc(73, 59, 'Visitatrice', 'Quanti bar chiusi pé sto giro, era tutto \'n antra cosa.', 'fermo'),
      npc(17, 39, 'Steven', 'Il bar è mio, ma qui te curo la squadra come al centro medico.', 'fermo'),
      npc(20, 7, 'Ambulante', 'Fori\' dar teatro nun se fa\' più \'l botteghino, mo\' vennemo torroncini.', 'fermo'),
      npc(27, 27, 'Cronista di quartiere', 'Ossidio via pé le riprese? Boh, io un ciò creso mai.', 'orizzontale'),
      npc(63, 40, 'Pellegrino', 'A Sant\'Emidio ce vengo ogni anno, da quanno era regazzino.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.centro_storico;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai quattro passaggi (est, nord, ovest, sud)
    rect(0, 0, 47, 1, 'albero'), rect(49, 0, 47, 1, 'albero'),
    rect(0, 71, 47, 1, 'albero'), rect(49, 71, 47, 1, 'albero'),
    rect(0, 1, 1, 14, 'albero'), rect(0, 17, 1, 54, 'albero'),
    rect(95, 1, 1, 35, 'albero'), rect(95, 38, 1, 33, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(4, 60, 2, 1, 'albero'), rect(7, 62, 1, 2, 'albero'),
    rect(87, 8, 2, 1, 'albero'), rect(89, 10, 2, 2, 'albero'),
    // filari attorno alla piazza Arringo, ridimensionata rispetto alla vecchia (54×30)
    rect(56, 51, 31, 1, 'albero'), rect(56, 63, 31, 1, 'albero')
  );
}());
