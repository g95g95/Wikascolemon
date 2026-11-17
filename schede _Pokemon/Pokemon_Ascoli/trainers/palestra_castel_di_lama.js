(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    palestra_castel_di_lama_allievo_1: {
      map: 'palestra_castel_di_lama', x: 11, y: 13, direction: 'down', sight: 3,
      class: 'ragazzino', name: 'Cencio', sprite: null,
      team: [{ species: 'zanzi', level: 8 }, { species: 'alghetta', level: 9 }],
      before: ['Ehi, qui non si passa senza una sfida!', 'Vediamo se meriti di arrivare da Hills.'],
      after: ['Va bbè, dàgghje, passa pure.'],
      lost: 'Passa pure, dai, m\'hai già battuto.',
      money: null, gym: null, when: null
    },
    palestra_castel_di_lama_allieva_1: {
      map: 'palestra_castel_di_lama', x: 12, y: 8, direction: 'down', sight: 3,
      class: 'ragazzina', name: 'Miriam', sprite: null,
      team: [{ species: 'alghetta', level: 9 }, { species: 'pefna', level: 9 }],
      before: ['Pure tu vuò la Medaglia Spirito?', 'Prima tocca passà da me!'],
      after: ['Uffa, va bene, vai da Hills.'],
      lost: 'Dai, tanto hai già vinto tu.',
      money: null, gym: null, when: null
    },
    castel_di_lama_hills: {
      map: 'palestra_castel_di_lama', x: 11, y: 3, direction: 'down', sight: 0,
      class: 'capopalestra', name: 'Daniel Hills', sprite: 'hills',
      team: [
        { species: 'zanzi', level: 9 },
        { species: 'alghetta', level: 10 }, // Mucillax si evolve solo dal 18: qui c'è la sua forma base
        { species: 'pozza', level: 11 }
      ],
      before: [
        'Lu Free Spirit è chiuse, mó ècche comanne i\'.',
        'Chi vo\' la Medaglia Spirito se la suda.',
        'Fàtte sotte, se tiéne fegate.'
      ],
      after: [
        '...Mbè, jé vinte tu \'sta vodda.',
        'Ma tande che vuò capì tu, la caccia \'ccima a la costa è già \'bbijata.',
        'Riccio lu sa, e tu manche \'mmagine mùnde è grossa.'
      ],
      lost: 'Torna quando la tua squadra è più forte.',
      money: null,
      gym: { id: 'castel_di_lama', badge: 1, badgeName: 'Medaglia Spirito', type: 'Veleno', tm: 'velenospina' },
      when: null
    }
  });
}());
