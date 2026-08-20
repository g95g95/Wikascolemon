(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    maltignano_ciclista_1: {
      map: 'maltignano', x: 43, y: 43, direction: 'left', sight: 4,
      class: 'ciclista', name: 'Renzo', sprite: null,
      team: [{ species: 'cignalo', level: 10 }, { species: 'tifotto', level: 10 }],
      before: ['Frena frena! Manco me pare vero de trovà quarcuno quassù.', 'Chi sarto sti tornanti a piedi se merita na bella lezione!'],
      after: ['Mannaggia, m\'hai frenato pure tu.'],
      lost: 'Va bene, va bene, statte tranquillo.',
      money: null, gym: null, when: null
    },
    maltignano_ragazzino_1: {
      map: 'maltignano', x: 27, y: 31, direction: 'right', sight: 4,
      class: 'ragazzino', name: 'Dino', sprite: null,
      team: [{ species: 'pefna', level: 9 }, { species: 'totera', level: 10 }],
      before: ['Ohò, se sarto sti curvoni pé allename\', mica pé passeggià!', 'Batte pure a me, se te ce riesci.'],
      after: ['Uffa, quasi quasi ce credevo.'],
      lost: 'Torna quando hai fiato pé risarì.',
      money: null, gym: null, when: null
    },
    maltignano_contadino_1: {
      map: 'maltignano', x: 48, y: 19, direction: 'left', sight: 4,
      class: 'contadino', name: 'Osvaldo', sprite: null,
      team: [{ species: 'cignalo', level: 11 }],
      before: ['Quassù ce cammino tutte le matine co\' le bestie.', 'Se vuoi passà, prima famme vedé quanto vali.'],
      after: ['Bravo, tié le gambe bbone.'],
      lost: 'Passa pure, la prossima vorda arifacimo.',
      money: null, gym: null, when: null
    },
    maltignano_nando_puledrotto: {
      map: 'maltignano', x: 54, y: 19, direction: 'left', sight: 4,
      class: 'rivale', name: 'Nando', sprite: 'nando',
      team: [{ species: 'puledrotto', level: 10 }, { species: 'tamburino', level: 9 }],
      before: [
        'Ah, sei tu quello che Bobby va dicenno in giro?',
        'Io so\' Nando, mi\' zio tié il bar rivale ju a Porta Maggiore — e ha vinto lui, ricordatelo!',
        'Mica t\'ho aspettato quassù pé fatte i complimenti. Famo \'na sfida!'
      ],
      after: ['Bah, so\' stato distratto dalla salita.'],
      lost: 'Rifacimo quando risarti, se ce riesci.',
      money: 400, gym: null, when: { flag: 'starter_basilino' }
    },
    maltignano_nando_tuffito: {
      map: 'maltignano', x: 55, y: 19, direction: 'left', sight: 4,
      class: 'rivale', name: 'Nando', sprite: 'nando',
      team: [{ species: 'tuffito', level: 10 }, { species: 'tamburino', level: 9 }],
      before: [
        'Ah, sei tu quello che Bobby va dicenno in giro?',
        'Io so\' Nando, mi\' zio tié il bar rivale ju a Porta Maggiore — e ha vinto lui, ricordatelo!',
        'Mica t\'ho aspettato quassù pé fatte i complimenti. Famo \'na sfida!'
      ],
      after: ['Bah, so\' stato distratto dalla salita.'],
      lost: 'Rifacimo quando risarti, se ce riesci.',
      money: 400, gym: null, when: { flag: 'starter_puledrotto' }
    },
    maltignano_nando_basilino: {
      map: 'maltignano', x: 56, y: 19, direction: 'left', sight: 4,
      class: 'rivale', name: 'Nando', sprite: 'nando',
      team: [{ species: 'basilino', level: 10 }, { species: 'tamburino', level: 9 }],
      before: [
        'Ah, sei tu quello che Bobby va dicenno in giro?',
        'Io so\' Nando, mi\' zio tié il bar rivale ju a Porta Maggiore — e ha vinto lui, ricordatelo!',
        'Mica t\'ho aspettato quassù pé fatte i complimenti. Famo \'na sfida!'
      ],
      after: ['Bah, so\' stato distratto dalla salita.'],
      lost: 'Rifacimo quando risarti, se ce riesci.',
      money: 400, gym: null, when: { flag: 'starter_tuffito' }
    }
  });
}());
