(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    porta_cartara_pescatore_1: {
      map: 'porta_cartara', x: 67, y: 31, direction: 'down', sight: 4,
      class: 'pescatore', name: 'Nazzareno', sprite: null,
      team: [{ species: 'tuffito', level: 7 }, { species: 'tuffito', level: 8 }],
      before: ['Il Rio Castellano è pieno di Tuffito, sa.', 'Ne ho pescati due bboni, mo\' te fo\' vede\'!'],
      after: ['Embè, m\'hai preso proprio.'],
      lost: 'Torna a trovarmi al fiume quando hai allenato di più.',
      money: null, gym: null, when: null
    }
  });
}());
