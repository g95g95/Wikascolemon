(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    spinetoli_centobuchi_contadino_1: {
      map: 'spinetoli_centobuchi', x: 30, y: 62, direction: 'up', sight: 4,
      class: 'contadino', name: 'Learco', sprite: null,
      team: [{ species: 'totera', level: 15 }, { species: 'cignalo', level: 16 }],
      before: ['Ué, che fai su la strada de campagna?', 'Se vuoi passà, prima me devi affrontà!'],
      after: ['Va bbè, hai vinto tu.'],
      lost: 'Torna quando i tu\' mostri so\' più forti.',
      money: null, gym: null, when: null
    },
    spinetoli_centobuchi_ciclista_1: {
      map: 'spinetoli_centobuchi', x: 60, y: 50, direction: 'down', sight: 5,
      class: 'ciclista', name: 'Dante', sprite: null,
      team: [{ species: 'tifotto', level: 16 }, { species: 'pefna', level: 15 }],
      before: ['Fermo lì, che pedalo veloce ma nun scappo mai da na sfida!'],
      after: ['Uffa, m\'hai bucato la ruota mentale.'],
      lost: 'Ripassa quando pedali più forte de me.',
      money: null, gym: null, when: null
    },
    spinetoli_centobuchi_ciclista_2: {
      map: 'spinetoli_centobuchi', x: 120, y: 68, direction: 'up', sight: 4,
      class: 'ciclista', name: 'Renzo', sprite: null,
      team: [{ species: 'peto', level: 17 }],
      before: ['Puntavo a Centobuchi, ma me fermo pé na bella lotta.'],
      after: ['Che sfiga, era \'na bella corsa pure quella.'],
      lost: 'Se rifaccio er giro, magari te becco n\'altra vorta.',
      money: null, gym: null, when: null
    },
    spinetoli_centobuchi_gemelle_1: {
      map: 'spinetoli_centobuchi', x: 150, y: 50, direction: 'down', sight: 4,
      class: 'gemelle', name: 'Nice e Dice', sprite: null,
      team: [{ species: 'pefna', level: 15 }, { species: 'pefna', level: 15 }],
      before: ['Noi semo sempre in coppia!', 'E lottamo pure in coppia, uh uh!'],
      after: ['Nun ce po\' crede, ha vinto lui/lei!'],
      lost: 'Torna a trovacce, ce piace lottà!',
      money: null, gym: null, when: null
    }
  });
}());
