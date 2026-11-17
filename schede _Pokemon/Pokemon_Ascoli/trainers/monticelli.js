(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    monticelli_campeggiatore_1: {
      map: 'monticelli', x: 16, y: 32, direction: 'right', sight: 4,
      class: 'campeggiatore', name: 'Gino', sprite: null,
      team: [{ species: 'pito', level: 5 }, { species: 'tamburino', level: 6 }],
      before: ['Sto campeggiando qui vicino all\'ospedale.', 'Ma un po\' di battaglia non guasta, dai!'],
      after: ['Madò, che furia de bòtte.'],
      lost: 'Passa quando hai qualche livello in più, oh.',
      money: null, gym: null, when: null
    }
  });
}());
