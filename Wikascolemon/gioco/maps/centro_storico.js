(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.centro_storico = {
    ...city, name: 'Centro Storico', baseTile: 'travertino', levelRange: [3, 5], encounterTable: [
      { species: 'tamburino', minLevel: 3, maxLevel: 5, weight: 45 },
      { species: 'anicino', minLevel: 3, maxLevel: 5, weight: 40 },
      { species: 'banconio', minLevel: 3, maxLevel: 5, weight: 15 }
    ],
    roads: [rect(0, 27, 72, 2), rect(35, 0, 2, 54), rect(0, 11, 54, 2), rect(15, 40, 27, 1)],
    waters: [], bridges: [],
    buildings: [
      building(20, 15, 8, 4, 'Palazzo dei Capitani', '#b89068', 'monumento'),
      building(6, 3, 9, 4, 'Teatro Ventidio Basso', '#a8755f', 'teatro', {
        door: { x: 10, y: 7 },
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
      building(44, 33, 9, 6, 'Cattedrale di Sant’Emidio', '#c09b70', 'chiesa'),
      building(60, 35, 3, 3, 'Battistero', '#c7a77d', 'chiesa'),
      building(11, 25, 3, 3, 'Bar Callare (Steven)', '#b46c52', 'attività', { door: { x: 13, y: 28 }, interior: 'bar' }),
      building(30, 44, 4, 3, 'Casa', '#98785e'),
      building(47, 20, 4, 3, 'Casa', '#98785e'),
      building(23, 6, 3, 3, 'Casa', '#98785e')
    ],
    plazas: [rect(18, 21, 15, 11, 'piazza'), rect(42, 39, 23, 8, 'piazza')],
    labels: [{ x: 26, y: 25, text: 'Piazza del Popolo' }, { x: 50, y: 41, text: 'Piazza Arringo' }],
    encounterZones: [zone(3, 6, 66, 42, 0.035, 'default')],
    transitions: [
      transition(71, 27, 1, 2, 'porta_maggiore', 5, 28, 'Ponte di Porta Maggiore'),
      transition(35, 0, 2, 1, 'campo_parignano', 36, 56, 'Ponte Nuovo'),
      transition(0, 11, 1, 2, 'borgo_solesta', 67, 13, 'Porta Solestà'),
      transition(35, 53, 2, 1, 'porta_cartara', 37, 5, 'Porta Cartara')
    ],
    npcs: [
      npc(25, 29, 'Cittadino', 'Bande de regazzi girano la notte, mo\' manco più en piazza se sta tranquilli.', 'orizzontale'),
      npc(55, 44, 'Visitatrice', 'Quanti bar chiusi pé sto giro, era tutto \'n antra cosa.', 'fermo'),
      npc(13, 29, 'Steven', 'Il bar è mio, ma qui te curo la squadra come al centro medico.', 'fermo'),
      npc(15, 5, 'Ambulante', 'Fori\' dar teatro nun se fa\' più \'l botteghino, mo\' vennemo torroncini.', 'fermo'),
      npc(20, 20, 'Cronista di quartiere', 'Ossidio via pé le riprese? Boh, io un ciò creso mai.', 'orizzontale'),
      npc(47, 30, 'Pellegrino', 'A Sant\'Emidio ce vengo ogni anno, da quanno era regazzino.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.centro_storico;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai quattro passaggi (est, nord, ovest, sud)
    rect(0, 0, 35, 1, 'albero'), rect(37, 0, 35, 1, 'albero'),
    rect(0, 53, 35, 1, 'albero'), rect(37, 53, 35, 1, 'albero'),
    rect(0, 1, 1, 10, 'albero'), rect(0, 13, 1, 40, 'albero'),
    rect(71, 1, 1, 26, 'albero'), rect(71, 29, 1, 24, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(3, 45, 2, 1, 'albero'), rect(5, 47, 1, 1, 'albero'),
    rect(65, 6, 2, 1, 'albero'), rect(67, 8, 1, 1, 'albero'),
    // filari attorno alla piazza Arringo, ridimensionata rispetto alla vecchia (54×30)
    rect(42, 38, 23, 1, 'albero'), rect(42, 47, 23, 1, 'albero')
  );
}());
