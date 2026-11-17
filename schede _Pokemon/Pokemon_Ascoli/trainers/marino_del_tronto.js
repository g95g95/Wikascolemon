(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    marino_del_tronto_ragazzino_1: {
      map: 'marino_del_tronto', x: 26, y: 30, direction: 'right', sight: 4,
      class: 'ragazzino', name: 'Fabrizio', sprite: null,
      team: [{ species: 'tifotto', level: 6 }, { species: 'totera', level: 7 }],
      before: ['Ehó, aspetta!', 'Manche nu salute? \'Ccima a la Salaria se allena forte!'],
      after: ['Va bbè, me jé frecate \'sta vodda.'],
      lost: 'Torna a trovamme quanne vuò, frechì.',
      money: null, gym: null, when: null
    },
    marino_del_tronto_ragazzina_1: {
      map: 'marino_del_tronto', x: 50, y: 28, direction: 'left', sight: 4,
      class: 'ragazzina', name: 'Serena', sprite: null,
      team: [{ species: 'tamburino', level: 7 }, { species: 'anicino', level: 7 }],
      before: ['Auà, n\'ome che passeggia tranquille!', 'Da \'sti parte nen se passa senza lottà.'],
      after: ['Mbè, uója jé vinte tu.'],
      lost: 'Repassa quanne vuò, magari me refacce.',
      money: null, gym: null, when: null
    },
    marino_del_tronto_pescatore_1: {
      map: 'marino_del_tronto', x: 39, y: 37, direction: 'down', sight: 3,
      class: 'pescatore', name: 'Learco', sprite: null,
      team: [{ species: 'soldatino', level: 7 }, { species: 'soldatino', level: 8 }],
      before: ['Chi vo\' attraversà lu Tronto, prima passa da me!', 'Ècche l\'acqua è bbona pe li Soldatino.'],
      after: ['Mó sì che me jé convinte, campió.'],
      lost: 'Lu ponde è tuó, statte accorte a l\'acqua.',
      money: null, gym: null, when: null
    }
  });
}());
