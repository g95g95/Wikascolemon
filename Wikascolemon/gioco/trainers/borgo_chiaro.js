(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    borgo_chiaro_ciclista_1: {
      map: 'borgo_chiaro', x: 85, y: 58, direction: 'left', sight: 4,
      class: 'ciclista', name: 'Renzo', sprite: null,
      team: [{ species: 'puledrotto', level: 8, moves: ['azione', 'braciere'] }, { species: 'segaccio', level: 9 }],
      before: ['Sto facendo il giro dello stadio in bici.', 'Fermati un attimo, famo \'na sfida!'],
      after: ['Mannaggia, che velocità.'],
      lost: 'Allenati ancora e ci riproviamo.',
      money: null, gym: null, when: null
    }
  });
}());
