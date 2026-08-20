(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    oasi_birdwatcher_1: {
      map: 'oasi', x: 60, y: 26, direction: 'down', sight: 4,
      class: 'birdwatcher', name: 'Renzo', sprite: null,
      team: [{ species: 'tamburino', level: 8 }, { species: 'anicino', level: 8 }],
      before: ['Ehi, zitto! Stavo a osservà l\'ucelli...', 'Mo\' che m\'hai visto, famme vedé quanto vale la tua squadra.'],
      after: ['Va bbè, m\'hai distratto per bene.'],
      lost: 'Torna quando sai stà più zitto de me.',
      money: null, gym: null, when: null
    },
    oasi_campeggiatore_1: {
      map: 'oasi', x: 112, y: 88, direction: 'left', sight: 3,
      class: 'campeggiatore', name: 'Marco', sprite: null,
      team: [{ species: 'totera', level: 8 }, { species: 'soldatino', level: 9 }],
      before: ['Uè! Fermate n\' attimo, prima de magnà famo n\' controllo!', 'Chi vince se magna er dolce pé primo.'],
      after: ['Vabbè, oggi er dolce te lo magni tu.'],
      lost: 'Torna a trovamme quando semo ancora qui a picnic.',
      money: null, gym: null, when: null
    }
  });
}());
