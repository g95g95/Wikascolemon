(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    palestra_castel_di_lama_allievo_1: {
      map: 'palestra_castel_di_lama', x: 11, y: 13, direction: 'down', sight: 3,
      class: 'ragazzino', name: 'Cencio', sprite: null,
      team: [{ species: 'zanzi', level: 8 }, { species: 'mucillax', level: 9 }],
      before: ['Ehi, qui non si passa senza una sfida!', 'Vediamo se meriti di arrivare da Hills.'],
      after: ['Vabbè, daje, passa pure.'],
      lost: 'Passa pure, dai, m\'hai già battuto.',
      money: null, gym: null, when: null
    },
    palestra_castel_di_lama_allieva_1: {
      map: 'palestra_castel_di_lama', x: 12, y: 8, direction: 'down', sight: 3,
      class: 'ragazzina', name: 'Miriam', sprite: null,
      team: [{ species: 'mucillax', level: 9 }, { species: 'pefna', level: 9 }],
      before: ['Anche tu vuoi la Medaglia Spirito?', 'Prima devi passà da me!'],
      after: ['Uffa, va bene, vai da Hills.'],
      lost: 'Dai, tanto hai già vinto tu.',
      money: null, gym: null, when: null
    },
    castel_di_lama_hills: {
      map: 'palestra_castel_di_lama', x: 11, y: 3, direction: 'down', sight: 0,
      class: 'capopalestra', name: 'Daniel Hills', sprite: 'hills',
      team: [
        { species: 'zanzi', level: 9 },
        { species: 'mucillax', level: 10 },
        { species: 'pozza', level: 12 }
      ],
      before: [
        'Il Free Spirit ha chiuso, mo\' qui comando io.',
        'Chi vuole la Medaglia Spirito se la deve sudà.',
        'Fatte sotto, se hai fegato.'
      ],
      after: [
        '...tiè, hai vinto tu stavolta.',
        'Ma tanto che vòi capì tu, la caccia sulla costa è già iniziata.',
        'Riccio lo sa, e tu manco immagini quanto è grossa.'
      ],
      lost: 'Torna quando la tua squadra è più forte.',
      money: null,
      gym: { id: 'castel_di_lama', badge: 1, badgeName: 'Medaglia Spirito', type: 'Veleno', tm: 'velenospina' },
      when: null
    }
  });
}());
