(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    costa_bagnino_1: {
      map: 'costa', x: 12, y: 49, direction: 'left', sight: 5,
      class: 'bagnino', name: 'Renzo', sprite: null,
      team: [{ species: 'lettino', level: 18 }, { species: 'cozzetta', level: 18 }],
      before: ['Fermo là! Sulla spiaggia libera se se sfida tutti, lo sai.', 'Mitte jó l\'asciugamà e fàmme vedé li Pokémon tuó.'],
      after: ['Auà, me jé frecate pe davvere.'],
      lost: 'Torna quanne jé allenate n\'addre neccó.',
      money: null, gym: null, when: null
    },
    costa_bagnino_2: {
      map: 'costa', x: 64, y: 55, direction: 'up', sight: 4,
      class: 'bagnino', name: 'Franco', sprite: null,
      team: [{ species: 'bagnetto', level: 19 }],
      before: ['Ehi tu, ddó passa \'ccima a la sabbia e mó te sfide!'],
      after: ['Vabbè, oggi era giornata storta.'],
      lost: 'Passa dapuó, magari me refacce.',
      money: null, gym: null, when: null
    },
    costa_turista_1: {
      map: 'costa', x: 29, y: 4, direction: 'right', sight: 4,
      class: 'turista', name: 'Marisa', sprite: null,
      team: [{ species: 'maranzino', level: 18 }],
      before: ['Ohh finalmente n\'antro allenatore! Songo qui pé le vacanze ma nun me manca mai la sfida.'],
      after: ['Bella lotta, mo\' me famo \'n gelato pé consolamme.'],
      lost: 'Se te va, ripassa pé lu lungomare.',
      money: null, gym: null, when: null
    },
    costa_turista_2: {
      map: 'costa', x: 78, y: 4, direction: 'left', sight: 4,
      class: 'turista', name: 'Osvaldo', sprite: null,
      team: [{ species: 'alghetta', level: 17 }, { species: 'cozzetta', level: 18 }],
      before: ['Songo vinuto da fori regione apposta pé lu mare, ma \'na sfida nun se rifiuta mai.'],
      after: ['Ahó, tosto! Me segno lu nome tuo.'],
      lost: 'Se torni de qua famo n\'antro giro.',
      money: null, gym: null, when: null
    },
    costa_dj_1: {
      map: 'costa', x: 104, y: 32, direction: 'left', sight: 3,
      class: 'dj', name: 'Mauri', sprite: null,
      team: [{ species: 'mucillax', level: 19 }, { species: 'bagnetto', level: 18 }],
      before: ['Ué, prima de entrà a lo Jonathan te tocca passà da me!', 'Massera facce lu set, ma mó facéme na lotta pe scallacce.'],
      after: ['Bbella energia, frechì! Massera te sènde dietre li speaker, magari.'],
      lost: 'Torna quanne tiéne n\'addre Pokémon, sennò lu ritme se pèrde.',
      money: null, gym: null, when: null
    }
  });
}());
