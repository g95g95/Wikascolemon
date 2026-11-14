(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.centro_storico = {
    width: 98, height: 88, name: 'Centro Storico', baseTile: 'travertino', levelRange: [3, 5], encounterTable: [
      { species: 'tamburino', minLevel: 3, maxLevel: 5, weight: 45 },
      { species: 'anicino', minLevel: 3, maxLevel: 5, weight: 40 },
      { species: 'banconio', minLevel: 3, maxLevel: 5, weight: 15 }
    ],
    roads: [rect(0, 48, 98, 3), rect(54, 0, 4, 88), rect(0, 19, 81, 2), rect(24, 71, 35, 2)],
    waters: [], bridges: [],
    buildings: [
      building(27, 24, 16, 8, 'Palazzo dei Capitani', '#b89068', 'monumento'),
      building(6, 4, 18, 8, 'Teatro Ventidio Basso', '#a8755f', 'teatro', {
        door: { x: 14, y: 12 },
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
      building(60, 57, 20, 12, 'Cattedrale di Sant’Emidio', '#c09b70', 'chiesa'),
      building(85, 60, 6, 6, 'Battistero', '#c7a77d', 'chiesa'),
      building(15, 43, 8, 6, 'Bar Callare (Steven)', '#b46c52', 'attività', { door: { x: 19, y: 49 }, interior: 'bar' }),
      building(45, 74, 7, 6, 'Casa', '#98785e'),
      building(68, 34, 7, 6, 'Casa', '#98785e'),
      building(33, 10, 6, 6, 'Casa', '#98785e')
    ],
    plazas: [rect(26, 36, 25, 20, 'piazza'), rect(59, 69, 33, 11, 'piazza')],
    labels: [{ x: 40, y: 43, text: 'Piazza del Popolo' }, { x: 73, y: 73, text: 'Piazza Arringo' }],
    encounterZones: [zone(3, 10, 92, 72, 0.035, 'default')],
    transitions: [
      transition(96, 48, 2, 3, 'porta_maggiore', 8, 32, 'Ponte di Porta Maggiore'),
      transition(54, 0, 4, 2, 'campo_parignano', 39, 57, 'Ponte Nuovo'),
      transition(0, 19, 2, 2, 'borgo_solesta', 68, 19, 'Porta Solestà'),
      transition(54, 86, 4, 2, 'porta_cartara', 37, 6, 'Porta Cartara')
    ],
    npcs: [
      npc(37, 52, 'Cittadino', 'Bande de regazzi girano la notte, mo\' manco più en piazza se sta tranquilli.', 'orizzontale'),
      npc(82, 74, 'Visitatrice', 'Quanti bar chiusi pé sto giro, era tutto \'n antra cosa.', 'fermo'),
      npc(19, 52, 'Steven', 'Il bar è mio, ma qui te curo la squadra come al centro medico.', 'fermo'),
      npc(24, 8, 'Ambulante', 'Fori\' dar teatro nun se fa\' più \'l botteghino, mo\' vennemo torroncini.', 'fermo'),
      npc(28, 34, 'Cronista di quartiere', 'Ossidio via pé le riprese? Boh, io un ciò creso mai.', 'orizzontale'),
      npc(68, 54, 'Pellegrino', 'A Sant\'Emidio ce vengo ogni anno, da quanno era regazzino.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.centro_storico;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai quattro passaggi (est, nord, ovest, sud)
    rect(0, 0, 54, 2, 'albero'), rect(58, 0, 40, 2, 'albero'),
    rect(0, 86, 54, 2, 'albero'), rect(58, 86, 40, 2, 'albero'),
    rect(0, 2, 2, 17, 'albero'), rect(0, 21, 2, 65, 'albero'),
    rect(96, 2, 2, 46, 'albero'), rect(96, 51, 2, 35, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(4, 79, 2, 3, 'albero'),
    rect(92, 13, 1, 3, 'albero'),
    // filari attorno alla piazza Arringo, ridimensionata rispetto alla vecchia (54×30)
    rect(59, 67, 33, 2, 'albero'), rect(59, 80, 33, 2, 'albero')
  );
}());
