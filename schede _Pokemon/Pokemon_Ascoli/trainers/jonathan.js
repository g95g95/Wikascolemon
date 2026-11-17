(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    jonathan_nando_puledrotto: {
      map: 'jonathan', x: 38, y: 18, direction: 'down', sight: 4,
      class: 'rivale', name: 'Nando', sprite: 'nando',
      team: [
        { species: 'cavalbrace', level: 19 },
        { species: 'tifotto', level: 17 },
        { species: 'tamburino', level: 17 }
      ],
      before: ['Ancora tu! Stavolta davanti allo Jonathan.', 'Riccio se lo prendo io, mica te!'],
      after: ['Vabbè, stavolta hai vinto tu. Ma alla prossima cambia musica.'],
      lost: 'Repassa quanne jé allenate de più, che mó nen c\'è partita.',
      money: 800, gym: null, when: { flag: 'starter_basilino' }
    },
    jonathan_nando_tuffito: {
      map: 'jonathan', x: 38, y: 17, direction: 'down', sight: 4,
      class: 'rivale', name: 'Nando', sprite: 'nando',
      team: [
        { species: 'brasero', level: 19 },
        { species: 'tifotto', level: 17 },
        { species: 'tamburino', level: 17 }
      ],
      before: ['Ancora tu! Stavolta davanti allo Jonathan.', 'Riccio se lo prendo io, mica te!'],
      after: ['Vabbè, stavolta hai vinto tu. Ma alla prossima cambia musica.'],
      lost: 'Repassa quanne jé allenate de più, che mó nen c\'è partita.',
      money: 800, gym: null, when: { flag: 'starter_puledrotto' }
    },
    jonathan_nando_basilino: {
      map: 'jonathan', x: 38, y: 16, direction: 'down', sight: 4,
      class: 'rivale', name: 'Nando', sprite: 'nando',
      team: [
        { species: 'turibasil', level: 19 },
        { species: 'tifotto', level: 17 },
        { species: 'tamburino', level: 17 }
      ],
      before: ['Ancora tu! Stavolta davanti allo Jonathan.', 'Riccio se lo prendo io, mica te!'],
      after: ['Vabbè, stavolta hai vinto tu. Ma alla prossima cambia musica.'],
      lost: 'Repassa quanne jé allenate de più, che mó nen c\'è partita.',
      money: 800, gym: null, when: { flag: 'starter_tuffito' }
    }
  });
}());
