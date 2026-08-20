(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    monticelli_campeggiatore_1: {
      map: 'monticelli', x: 43, y: 61, direction: 'right', sight: 4,
      class: 'campeggiatore', name: 'Gino', sprite: null,
      team: [{ species: 'segaccio', level: 8 }, { species: 'venagrox', level: 7 }],
      before: ['Sto campeggiando qui vicino all\'ospedale.', 'Ma un po\' di battaglia non guasta, dai!'],
      after: ['Che sacco de botte, madò.'],
      lost: 'Passa quando hai qualche livello in più, oh.',
      money: null, gym: null, when: null
    }
  });
}());
