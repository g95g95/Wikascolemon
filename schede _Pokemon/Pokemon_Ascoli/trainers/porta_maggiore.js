(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    porta_maggiore_ragazzino_1: {
      map: 'porta_maggiore', x: 53, y: 23, direction: 'down', sight: 4,
      class: 'ragazzino', name: 'Tobia', sprite: null,
      team: [{ species: 'tifotto', level: 4 }, { species: 'tamburino', level: 5 }],
      before: ['Ehi tu, fermo lì!', 'A Porta Maggiore ci si allena sul serio, sa!'],
      after: ['Uffa, mi hai fregato.'],
      lost: 'Torna quando hai allenato un po\' di più.',
      money: null, gym: null, when: null
    },
    porta_maggiore_nando_puledrotto: {
      map: 'porta_maggiore', x: 26, y: 26, direction: 'up', sight: 4,
      class: 'rivale', name: 'Nando', sprite: 'nando',
      team: [{ species: 'puledrotto', level: 5 }],
      before: [
        'Ehó, statte ferme llà!',
        'I\' sò Nando, e zìeme tène lu bar rivale de Bobby: isse è vinte la rissa, nen se scorda!',
        'Bobby te vo\' fà credé che tu jé quille giuste? Prima vedéme se jé bbuone a combatte.'
      ],
      after: ['Bah, sò state distratte.'],
      lost: 'Va bbè, va bbè, la prossema è mié.',
      money: 200, gym: null, when: { flag: 'starter_basilino' }
    },
    porta_maggiore_nando_tuffito: {
      map: 'porta_maggiore', x: 26, y: 27, direction: 'up', sight: 4,
      class: 'rivale', name: 'Nando', sprite: 'nando',
      team: [{ species: 'tuffito', level: 5 }],
      before: [
        'Ehó, statte ferme llà!',
        'I\' sò Nando, e zìeme tène lu bar rivale de Bobby: isse è vinte la rissa, nen se scorda!',
        'Bobby te vo\' fà credé che tu jé quille giuste? Prima vedéme se jé bbuone a combatte.'
      ],
      after: ['Bah, sò state distratte.'],
      lost: 'Va bbè, va bbè, la prossema è mié.',
      money: 200, gym: null, when: { flag: 'starter_puledrotto' }
    },
    porta_maggiore_nando_basilino: {
      map: 'porta_maggiore', x: 26, y: 28, direction: 'up', sight: 4,
      class: 'rivale', name: 'Nando', sprite: 'nando',
      team: [{ species: 'basilino', level: 5 }],
      before: [
        'Ehó, statte ferme llà!',
        'I\' sò Nando, e zìeme tène lu bar rivale de Bobby: isse è vinte la rissa, nen se scorda!',
        'Bobby te vo\' fà credé che tu jé quille giuste? Prima vedéme se jé bbuone a combatte.'
      ],
      after: ['Bah, sò state distratte.'],
      lost: 'Va bbè, va bbè, la prossema è mié.',
      money: 200, gym: null, when: { flag: 'starter_tuffito' }
    }
  });
}());
