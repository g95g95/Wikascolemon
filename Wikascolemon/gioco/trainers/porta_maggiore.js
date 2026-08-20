(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    porta_maggiore_ragazzino_1: {
      map: 'porta_maggiore', x: 67, y: 58, direction: 'down', sight: 4,
      class: 'ragazzino', name: 'Tobia', sprite: null,
      team: [{ species: 'pito', level: 6 }, { species: 'basilino', level: 7 }],
      before: ['Ehi tu, fermo lì!', 'A Porta Maggiore ci si allena sul serio, sa!'],
      after: ['Uffa, mi hai fregato.'],
      lost: 'Torna quando hai allenato un po\' di più.',
      money: null, gym: null, when: null
    }
  });
}());
