(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    campo_parignano_contadino_1: {
      map: 'campo_parignano', x: 26, y: 30, direction: 'up', sight: 3,
      class: 'contadino', name: 'Marino', sprite: null,
      team: [{ species: 'basilino', level: 7 }, { species: 'pito', level: 7 }, { species: 'banconio', level: 8 }],
      before: ['Questi campi li lavoro da una vita.', 'Vediamo se i tuoi Pokémon reggono la fatica!'],
      after: ['Mbè, bbrave davvere.'],
      lost: 'Repassa quanne jé fatte neccó d\'allenamènde, capo.',
      money: null, gym: null, when: null
    }
  });
}());
