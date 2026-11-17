(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    porta_cartara_pescatore_1: {
      map: 'porta_cartara', x: 20, y: 19, direction: 'down', sight: 4,
      class: 'pescatore', name: 'Nazzareno', sprite: null,
      team: [{ species: 'tuffito', level: 7 }, { species: 'tuffito', level: 8 }],
      before: ['Lu Rio Castellano è piene de Tuffito.', 'Ne sò pescate ddó bbuone, mó vide!'],
      after: ['Mbè, me jé cchiappate proprie.'],
      lost: 'Torna a trovarmi al fiume quando hai allenato di più.',
      money: null, gym: null, when: null
    }
  });
}());
