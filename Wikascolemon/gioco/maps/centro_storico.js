(function () {
  const { building, rect, zone, transition, npc, city } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.centro_storico = {
    ...city, name: 'Centro Storico', baseTile: 'travertino', levelRange: [3, 5], encounterTable: [
      { species: 'tamburino', minLevel: 3, maxLevel: 5, weight: 45 },
      { species: 'anicino', minLevel: 3, maxLevel: 5, weight: 40 },
      { species: 'banconio', minLevel: 3, maxLevel: 5, weight: 15 }
    ],
    roads: [rect(0, 54, 144, 3), rect(70, 0, 4, 108), rect(0, 23, 108, 2), rect(30, 80, 54, 2)],
    waters: [], bridges: [],
    buildings: [
      building(39, 30, 16, 8, 'Palazzo dei Capitani', '#b89068', 'monumento'),
      building(12, 6, 18, 8, 'Teatro Ventidio Basso', '#a8755f', 'teatro', {
        door: { x: 20, y: 14 },
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
      building(87, 66, 20, 12, 'Cattedrale di Sant’Emidio', '#c09b70', 'chiesa'),
      building(120, 69, 6, 6, 'Battistero', '#c7a77d', 'chiesa'),
      building(21, 49, 8, 6, 'Bar Callare (Steven)', '#b46c52', 'attività', { door: { x: 25, y: 55 }, interior: 'bar' }),
      building(60, 88, 7, 6, 'Casa', '#98785e'),
      building(95, 40, 7, 6, 'Casa', '#98785e'),
      building(45, 12, 6, 6, 'Casa', '#98785e')
    ],
    plazas: [rect(36, 42, 30, 21, 'piazza'), rect(84, 78, 46, 16, 'piazza')],
    labels: [{ x: 52, y: 49, text: 'Piazza del Popolo' }, { x: 100, y: 82, text: 'Piazza Arringo' }],
    encounterZones: [zone(6, 12, 132, 84, 0.035, 'default')],
    transitions: [
      transition(142, 54, 2, 3, 'porta_maggiore', 10, 55, 'Ponte di Porta Maggiore'),
      transition(70, 0, 4, 2, 'campo_parignano', 73, 112, 'Ponte Nuovo'),
      transition(0, 23, 2, 2, 'borgo_solesta', 133, 26, 'Porta Solestà'),
      transition(70, 106, 4, 2, 'porta_cartara', 73, 10, 'Porta Cartara')
    ],
    npcs: [
      npc(49, 58, 'Cittadino', 'Piazza del Popolo è il salotto della città.', 'orizzontale'),
      npc(109, 88, 'Visitatrice', 'Il travertino cambia colore con la luce.', 'fermo'),
      npc(25, 58, 'Steven', 'Il bar è mio, ma qui te curo la squadra come al centro medico.', 'fermo'),
      npc(30, 10, 'Ambulante', 'Fori\' dar teatro nun se fa\' più \'l botteghino, mo\' vennemo torroncini.', 'fermo'),
      npc(40, 40, 'Cronista di quartiere', 'Ossidio via pé le riprese? Boh, io un ciò creso mai.', 'orizzontale'),
      npc(95, 60, 'Pellegrino', 'A Sant\'Emidio ce vengo ogni anno, da quanno era regazzino.', 'verticale')
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
    rect(130, 12, 3, 2, 'albero'), rect(134, 15, 2, 3, 'albero'),
    // filari attorno alla piazza Arringo, ridimensionata rispetto alla vecchia (54×30)
    rect(84, 76, 46, 2, 'albero'), rect(84, 94, 46, 2, 'albero')
  );
}());
