(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    oasi_birdwatcher_1: {
      map: 'oasi', x: 19, y: 13, direction: 'down', sight: 4,
      class: 'birdwatcher', name: 'Renzo', sprite: null,
      team: [{ species: 'tamburino', level: 8 }, { species: 'anicino', level: 8 }],
      before: ['Ehi, zitte!', 'Stènghe uardènne li ciélle... Mó che me jé viste, fàmme vedé mùnde vale la squadra tuó.'],
      after: ['Va bbè, me jé distratte pe bbé.'],
      lost: 'Torna quando sai stà più zitto de me.',
      money: null, gym: null, when: null
    },
    oasi_campeggiatore_1: {
      map: 'oasi', x: 51, y: 39, direction: 'left', sight: 3,
      class: 'campeggiatore', name: 'Marco', sprite: null,
      team: [{ species: 'totera', level: 8 }, { species: 'soldatino', level: 9 }],
      before: ['Ehi!', 'Statte ferme n\'attime, prima de magnà facéme nu controlle! Chi vince se magna lu dolce pe prime.'],
      after: ['Va bbè, uója lu dolce te lu magne tu.'],
      lost: 'Torna a trovamme quanne séme ancora ècche a fà lu picnic.',
      money: null, gym: null, when: null
    }
  });
}());
