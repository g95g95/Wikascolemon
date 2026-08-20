(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    costa_bagnino_1: {
      map: 'costa', x: 20, y: 82, direction: 'left', sight: 5,
      class: 'bagnino', name: 'Renzo', sprite: null,
      team: [{ species: 'lettino', level: 18 }, { species: 'cozzetta', level: 18 }],
      before: ['Fermo là! Sulla spiaggia libera se se sfida tutti, lo sai.', 'Metti giù l\'asciugamano e famme vedé li tua Pokémon.'],
      after: ['Aho, m\'hai fregato pé davero.'],
      lost: 'Torna quanno hai allenato \'n altro po\'.',
      money: null, gym: null, when: null
    },
    costa_bagnino_2: {
      map: 'costa', x: 100, y: 88, direction: 'up', sight: 4,
      class: 'bagnino', name: 'Franco', sprite: null,
      team: [{ species: 'bagnetto', level: 19 }],
      before: ['Ehi tu, du\' passi sulla sabbia e mo\' te sfido!'],
      after: ['Vabbè, oggi era giornata storta.'],
      lost: 'Passa doppo, magari me rifò.',
      money: null, gym: null, when: null
    },
    costa_turista_1: {
      map: 'costa', x: 40, y: 8, direction: 'right', sight: 4,
      class: 'turista', name: 'Marisa', sprite: null,
      team: [{ species: 'maranzino', level: 18 }],
      before: ['Ohh finalmente n\'antro allenatore! Songo qui pé le vacanze ma nun me manca mai la sfida.'],
      after: ['Bella lotta, mo\' me famo \'n gelato pé consolamme.'],
      lost: 'Se te va, ripassa pé lu lungomare.',
      money: null, gym: null, when: null
    },
    costa_turista_2: {
      map: 'costa', x: 120, y: 8, direction: 'left', sight: 4,
      class: 'turista', name: 'Osvaldo', sprite: null,
      team: [{ species: 'alghetta', level: 17 }, { species: 'cozzetta', level: 18 }],
      before: ['Songo vinuto da fori regione apposta pé lu mare, ma \'na sfida nun se rifiuta mai.'],
      after: ['Ahó, tosto! Me segno lu nome tuo.'],
      lost: 'Se torni de qua famo n\'antro giro.',
      money: null, gym: null, when: null
    },
    costa_dj_1: {
      map: 'costa', x: 165, y: 55, direction: 'left', sight: 3,
      class: 'dj', name: 'Mauri', sprite: null,
      team: [{ species: 'mucillax', level: 19 }, { species: 'bagnetto', level: 18 }],
      before: ['Ué, prima de entrà a lo Jonathan te tocca passà da me!', 'Stasera faccio er set, ma mo\' famo \'na lotta pé scaldacce.'],
      after: ['Bella energia, uagliò! Stasera te sento dietro li speaker, magari.'],
      lost: 'Torna quanno hai n\'antro Pokémon, se no lu ritmo se perde.',
      money: null, gym: null, when: null
    }
  });
}());
