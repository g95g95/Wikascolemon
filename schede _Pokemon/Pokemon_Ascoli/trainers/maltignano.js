(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    maltignano_ciclista_1: {
      map: 'maltignano', x: 27, y: 27, direction: 'left', sight: 4,
      class: 'ciclista', name: 'Renzo', sprite: null,
      team: [{ species: 'cignalo', level: 10 }, { species: 'tifotto', level: 10 }],
      before: ['Frena, frena!', 'Manche me pare vére de trovà cacchedune \'ssassù. Chi sùve \'sti tornande a piede se merita na bbella lezió!'],
      after: ['Mannaggia, me jé frenate pure tu.'],
      lost: 'Va bbè, va bbè, statte tranquille.',
      money: null, gym: null, when: null
    },
    maltignano_ragazzino_1: {
      map: 'maltignano', x: 11, y: 21, direction: 'right', sight: 4,
      class: 'ragazzino', name: 'Dino', sprite: null,
      team: [{ species: 'pefna', level: 9 }, { species: 'totera', level: 10 }],
      before: ['Ohò, sùve \'sti curve p\'allenamme, nen pe passeggià!', 'Bbatte pure me, se ce riesce.'],
      after: ['Uffa, quase quase ce credié.'],
      lost: 'Torna quanne tiéne fiate pe resùve.',
      money: null, gym: null, when: null
    },
    maltignano_contadino_1: {
      map: 'maltignano', x: 32, y: 15, direction: 'left', sight: 4,
      class: 'contadino', name: 'Osvaldo', sprite: null,
      team: [{ species: 'cignalo', level: 11 }],
      before: ['\'Ssassù ce cammine tutte li matine che li bestie.', 'Se vuò passà, prima fàmme vedé mùnde vale.'],
      after: ['Bbrave, tiéne li gambe bbone.'],
      lost: 'Passa pure, la prossima vorda arifacimo.',
      money: null, gym: null, when: null
    },
    maltignano_nando_puledrotto: {
      map: 'maltignano', x: 38, y: 15, direction: 'left', sight: 4,
      class: 'rivale', name: 'Nando', sprite: 'nando',
      team: [{ species: 'puledrotto', level: 10 }, { species: 'tamburino', level: 9 }],
      before: [
        'Ah, jé tu quille che Bobby va dicènne \'n giro?',
        'I\' sò Nando, zìeme tène lu bar rivale jó a Porta Maggiore — isse è vinte, ricòrdete!',
        'Nen te sò aspettate \'ssassù pe fatte li complimende. Facéme na sfida!'
      ],
      after: ['Bah, sò state distratte da la sùveta.'],
      lost: 'Refacéme quanne resùve, se ce riesce.',
      money: 400, gym: null, when: { flag: 'starter_basilino' }
    },
    maltignano_nando_tuffito: {
      map: 'maltignano', x: 39, y: 15, direction: 'left', sight: 4,
      class: 'rivale', name: 'Nando', sprite: 'nando',
      team: [{ species: 'tuffito', level: 10 }, { species: 'tamburino', level: 9 }],
      before: [
        'Ah, jé tu quille che Bobby va dicènne \'n giro?',
        'I\' sò Nando, zìeme tène lu bar rivale jó a Porta Maggiore — isse è vinte, ricòrdete!',
        'Nen te sò aspettate \'ssassù pe fatte li complimende. Facéme na sfida!'
      ],
      after: ['Bah, sò state distratte da la sùveta.'],
      lost: 'Refacéme quanne resùve, se ce riesce.',
      money: 400, gym: null, when: { flag: 'starter_puledrotto' }
    },
    maltignano_nando_basilino: {
      map: 'maltignano', x: 40, y: 15, direction: 'left', sight: 4,
      class: 'rivale', name: 'Nando', sprite: 'nando',
      team: [{ species: 'basilino', level: 10 }, { species: 'tamburino', level: 9 }],
      before: [
        'Ah, jé tu quille che Bobby va dicènne \'n giro?',
        'I\' sò Nando, zìeme tène lu bar rivale jó a Porta Maggiore — isse è vinte, ricòrdete!',
        'Nen te sò aspettate \'ssassù pe fatte li complimende. Facéme na sfida!'
      ],
      after: ['Bah, sò state distratte da la sùveta.'],
      lost: 'Refacéme quanne resùve, se ce riesce.',
      money: 400, gym: null, when: { flag: 'starter_tuffito' }
    }
  });
}());
