(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    jonathan_bro_security_1: {
      map: 'palestra_costa', x: 14, y: 18, direction: 'up', sight: 2,
      class: 'bro_security', name: 'Bro della Security', sprite: null,
      team: [{ species: 'cozzetta', level: 18 }],
      before: ['Alt. Prima passi da me.', 'La security dello Jonathan non si aggira.'],
      after: ['Vai pure, ma gli altri due non saranno morbidi come me.'],
      lost: 'Torna quando hai una squadra più tosta.',
      money: null, gym: null, when: null
    },
    jonathan_bro_security_2: {
      map: 'palestra_costa', x: 14, y: 13, direction: 'up', sight: 3,
      class: 'bro_security', name: 'Bro della Security', sprite: null,
      team: [{ species: 'lettino', level: 18 }],
      before: ['Secondo blocco. Manco a pensarci de passà.'],
      after: ['Embè, avanti così.'],
      lost: 'Torna quando hai una squadra più tosta.',
      money: null, gym: null, when: null
    },
    jonathan_bro_security_3: {
      map: 'palestra_costa', x: 14, y: 9, direction: 'up', sight: 3,
      class: 'bro_security', name: 'Bro della Security', sprite: null,
      team: [{ species: 'bagnetto', level: 19 }, { species: 'mucillax', level: 18 }],
      before: ['Ultimo controllo prima de Riccio.', 'Se passi da me, sei degno della pista.'],
      after: ['Vai, campione. Riccio t\'aspetta.'],
      lost: 'Torna quando hai una squadra più tosta.',
      money: null, gym: null, when: null
    },
    costa_riccio: {
      map: 'palestra_costa', x: 14, y: 5, direction: 'down', sight: 0,
      class: 'capopalestra', name: 'Riccio', sprite: null,
      team: [
        { species: 'cozzetta', level: 18 },
        { species: 'lettino', level: 18 },
        { species: 'ombrellone', level: 20 }
      ],
      before: [
        'Allo Jonathan la sfida è sempre aperta.',
        'Ivo e Teo hanno provato l\'agguato prima di te: du\' congressisti che manco sanno tuffasse.',
        'Speriamo tu regga meglio de quer duo!'
      ],
      after: ['Embè, complimenti davvero. Chiedi all\'assistente, che c\'ha una cosa pé te.'],
      lost: 'Torna a trovarmi quando sei più allenato.',
      money: null,
      gym: { id: 'costa', badge: 2, badgeName: 'Medaglia Balneare', type: 'Acqua', tm: 'idrogetto' },
      when: null
    }
  });
}());
