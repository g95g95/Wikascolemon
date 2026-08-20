(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    borgo_solesta_gemelle_1: {
      map: 'borgo_solesta', x: 52, y: 58, direction: 'right', sight: 3,
      class: 'gemelle', name: 'Lia e Mia', sprite: null,
      team: [{ species: 'pito', level: 6 }, { species: 'basilino', level: 6 }],
      before: ['Siamo in due, lo sai!', 'Sfida doppia, che dici?'],
      after: ['Uffa, insieme e abbiamo perso lo stesso.'],
      lost: 'Torna a trovarci quando sei più forte, dai.',
      money: null, gym: null, when: null
    }
  });
}());
