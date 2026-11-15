(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    borgo_chiaro_ciclista_1: {
      map: 'borgo_chiaro', x: 51, y: 6, direction: 'right', sight: 4, // nella radura chiusa dagli alberi, a nord-est
      class: 'ciclista', name: 'Renzo', sprite: null,
      team: [{ species: 'puledrotto', level: 8, moves: ['azione', 'braciere'] }, { species: 'segaccio', level: 9 }],
      before: ['Oh! E tu come ci sei arrivato, qua dietro?', 'Qui ci alleno il mio Segaccio, lontano da tutti. Mo\' però famo \'na sfida!'],
      after: ['Mannaggia, che velocità.'],
      lost: 'Allenati ancora e ci riproviamo.',
      money: null, gym: null, when: null
    }
  });
}());
