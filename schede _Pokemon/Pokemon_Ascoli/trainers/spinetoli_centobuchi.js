(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    spinetoli_centobuchi_contadino_1: {
      map: 'spinetoli_centobuchi', x: 17, y: 28, direction: 'up', sight: 4,
      class: 'contadino', name: 'Learco', sprite: null,
      team: [{ species: 'totera', level: 15 }, { species: 'cignalo', level: 16 }],
      before: ['Ué, che fai su la strada de campagna?', 'Se vuoi passà, prima me devi affrontà!'],
      after: ['Va bbè, hai vinto tu.'],
      lost: 'Torna quanne li mostre tuó è più forte.',
      money: null, gym: null, when: null
    },
    spinetoli_centobuchi_ciclista_1: {
      map: 'spinetoli_centobuchi', x: 31, y: 16, direction: 'down', sight: 5,
      class: 'ciclista', name: 'Dante', sprite: null,
      team: [{ species: 'tifotto', level: 16 }, { species: 'pefna', level: 15 }],
      before: ['Ferme llà, che pedale veloce ma nen scappe mai da na sfida!'],
      after: ['Uffa, m\'hai bucato la ruota mentale.'],
      lost: 'Ripassa quando pedali più forte de me.',
      money: null, gym: null, when: null
    },
    spinetoli_centobuchi_ciclista_2: {
      map: 'spinetoli_centobuchi', x: 47, y: 34, direction: 'up', sight: 4,
      class: 'ciclista', name: 'Renzo', sprite: null,
      team: [{ species: 'peto', level: 17 }],
      before: ['Pundàva a Centobuchi, ma me ferme pe na bbella lotta.'],
      after: ['Che sfiga, èra na bbella corsa pure quella.'],
      lost: 'Se refacce lu gire, magari te bécche n\'addra vodda.',
      money: null, gym: null, when: null
    },
    spinetoli_centobuchi_gemelle_1: {
      map: 'spinetoli_centobuchi', x: 61, y: 16, direction: 'down', sight: 4,
      class: 'gemelle', name: 'Nice e Dice', sprite: null,
      team: [{ species: 'pefna', level: 15 }, { species: 'pefna', level: 15 }],
      before: ['Nu séme sèmbre \'n coppia!', 'E lottamo pure in coppia, uh uh!'],
      after: ['Nen ce se pò crede, è vinte isse/essa!'],
      lost: 'Torna a trovacce, ce piace lottà!',
      money: null, gym: null, when: null
    }
  });
}());
