(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    campo_parignano_contadino_1: {
      map: 'campo_parignano', x: 67, y: 58, direction: 'up', sight: 3,
      class: 'contadino', name: 'Marino', sprite: null,
      team: [{ species: 'basilino', level: 6 }, { species: 'pito', level: 7 }, { species: 'banconio', level: 8 }],
      before: ['Questi campi li lavoro da una vita.', 'Vediamo se i tuoi Pokémon reggono la fatica!'],
      after: ['Embè, brao davvero.'],
      lost: 'Ripassa quando hai fatto un po\' di allenamento, giovi\'.',
      money: null, gym: null, when: null
    }
  });
}());
