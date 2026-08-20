(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    porta_maggiore_ragazzino_1: {
      map: 'porta_maggiore', x: 64, y: 52, direction: 'down', sight: 4,
      class: 'ragazzino', name: 'Tobia', sprite: null,
      team: [{ species: 'tifotto', level: 4 }, { species: 'tamburino', level: 5 }],
      before: ['Ehi tu, fermo lì!', 'A Porta Maggiore ci si allena sul serio, sa!'],
      after: ['Uffa, mi hai fregato.'],
      lost: 'Torna quando hai allenato un po\' di più.',
      money: null, gym: null, when: null
    },
    porta_maggiore_nando_puledrotto: {
      map: 'porta_maggiore', x: 31, y: 55, direction: 'up', sight: 4,
      class: 'rivale', name: 'Nando', sprite: null,
      team: [{ species: 'puledrotto', level: 5 }],
      before: [
        'Ehó, fermo llà!',
        'So\' Nando, e mi\' zio tié er bar rivale de Bobby — e ha vinto lui la rissa, mica se scorda!',
        'Bobby te vo\' fa\' credé che tu sei quello giusto? Prima vediamo si sai combatte\'.'
      ],
      after: ['Bah, so\' stato distratto.'],
      lost: 'Va bene, va bene, la prossima è mia.',
      money: 200, gym: null, when: { flag: 'starter_basilino' }
    },
    porta_maggiore_nando_tuffito: {
      map: 'porta_maggiore', x: 31, y: 56, direction: 'up', sight: 4,
      class: 'rivale', name: 'Nando', sprite: null,
      team: [{ species: 'tuffito', level: 5 }],
      before: [
        'Ehó, fermo llà!',
        'So\' Nando, e mi\' zio tié er bar rivale de Bobby — e ha vinto lui la rissa, mica se scorda!',
        'Bobby te vo\' fa\' credé che tu sei quello giusto? Prima vediamo si sai combatte\'.'
      ],
      after: ['Bah, so\' stato distratto.'],
      lost: 'Va bene, va bene, la prossima è mia.',
      money: 200, gym: null, when: { flag: 'starter_puledrotto' }
    },
    porta_maggiore_nando_basilino: {
      map: 'porta_maggiore', x: 31, y: 57, direction: 'up', sight: 4,
      class: 'rivale', name: 'Nando', sprite: null,
      team: [{ species: 'basilino', level: 5 }],
      before: [
        'Ehó, fermo llà!',
        'So\' Nando, e mi\' zio tié er bar rivale de Bobby — e ha vinto lui la rissa, mica se scorda!',
        'Bobby te vo\' fa\' credé che tu sei quello giusto? Prima vediamo si sai combatte\'.'
      ],
      after: ['Bah, so\' stato distratto.'],
      lost: 'Va bene, va bene, la prossima è mia.',
      money: 200, gym: null, when: { flag: 'starter_tuffito' }
    }
  });
}());
