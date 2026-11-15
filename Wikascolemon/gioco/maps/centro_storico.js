(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.centro_storico = {
    width: 84, height: 69, name: 'Centro Storico', baseTile: 'travertino', levelRange: [3, 5], encounterTable: [
      { species: 'tamburino', minLevel: 3, maxLevel: 5, weight: 45 },
      { species: 'anicino', minLevel: 3, maxLevel: 5, weight: 40 },
      { species: 'banconio', minLevel: 3, maxLevel: 5, weight: 15 }
    ],
    roads: [rect(0, 39, 84, 3), rect(48, 0, 4, 69), rect(0, 15, 73, 2), rect(22, 57, 30, 2)],
    waters: [], bridges: [],
    buildings: [
      building(24, 18, 16, 8, 'Palazzo dei Capitani', '#b89068', 'monumento'),
      building(4, 2, 18, 8, 'Teatro Ventidio Basso', '#a8755f', 'teatro', {
        door: { x: 12, y: 10 },
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
      building(53, 44, 20, 12, 'Cattedrale di Sant’Emidio', '#c09b70', 'chiesa'),
      building(75, 47, 6, 6, 'Battistero', '#c7a77d', 'chiesa'),
      building(13, 34, 8, 6, 'Bar Callare (Steven)', '#b46c52', 'attività', { door: { x: 17, y: 40 }, interior: 'bar' }),
      building(41, 59, 7, 6, 'Casa', '#98785e'),
      building(61, 27, 7, 6, 'Casa', '#98785e'),
      building(30, 8, 6, 6, 'Casa', '#98785e')
    ],
    plazas: [rect(23, 29, 24, 15, 'piazza'), rect(52, 56, 29, 9, 'piazza')],
    labels: [{ x: 37, y: 34, text: 'Piazza del Popolo' }, { x: 66, y: 59, text: 'Piazza Arringo' }],
    encounterZones: [zone(2, 8, 80, 58, 0.035, 'default')],
    transitions: [
      transition(82, 39, 2, 3, 'porta_maggiore', 5, 26, 'Ponte di Porta Maggiore'),
      transition(48, 0, 4, 2, 'campo_parignano', 30, 41, 'Ponte Nuovo'),
      transition(0, 15, 2, 2, 'borgo_solesta', 59, 14, 'Porta Solestà'),
      transition(48, 67, 4, 2, 'porta_cartara', 26, 4, 'Porta Cartara')
    ],
    npcs: [
      npc(34, 42, 'Cittadino', 'Bande de regazzi girano la notte, mo\' manco più en piazza se sta tranquilli.', 'orizzontale'),
      npc(73, 59, 'Visitatrice', 'Quanti bar chiusi pé sto giro, era tutto \'n antra cosa.', 'fermo'),
      npc(17, 42, 'Steven', 'Il bar è mio, ma qui te curo la squadra come al centro medico.', 'fermo'),
      npc(22, 6, 'Ambulante', 'Fori\' dar teatro nun se fa\' più \'l botteghino, mo\' vennemo torroncini.', 'fermo'),
      npc(25, 27, 'Cronista di quartiere', 'Ossidio via pé le riprese? Boh, io un ciò creso mai.', 'orizzontale'),
      npc(61, 43, 'Pellegrino', 'A Sant\'Emidio ce vengo ogni anno, da quanno era regazzino.', 'verticale')
    ]
  };
  const map = window.PokemonAscoliMaps.centro_storico;
  map.roads.push(
    // cornice di alberi (spessore 2), interrotta dai quattro passaggi (est, nord, ovest, sud)
    rect(0, 0, 48, 2, 'albero'), rect(52, 0, 32, 2, 'albero'),
    rect(0, 67, 48, 2, 'albero'), rect(52, 67, 32, 2, 'albero'),
    rect(0, 2, 2, 13, 'albero'), rect(0, 17, 2, 50, 'albero'),
    rect(82, 2, 2, 37, 'albero'), rect(82, 42, 2, 25, 'albero'),
    // boschetti nelle zone verdi lontane da strade/edifici/npc/passaggi
    rect(2, 64, 2, 2, 'albero'),
    
    // filari attorno alla piazza Arringo, ridimensionata rispetto alla vecchia (54×30)
    rect(52, 54, 29, 2, 'albero'), rect(52, 65, 29, 1, 'albero')
  );
}());
