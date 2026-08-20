(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    marino_del_tronto_ragazzino_1: {
      map: 'marino_del_tronto', x: 38, y: 55, direction: 'right', sight: 4,
      class: 'ragazzino', name: 'Fabrizio', sprite: null,
      team: [{ species: 'tifotto', level: 6 }, { species: 'totera', level: 7 }],
      before: ['Ehó, aspetta! Manco un saluto?', 'Qui su\' la Salaria ce s\'allena forte, sa\'!'],
      after: ['Vabbè, m\'hai fregato stavolta.'],
      lost: 'Torna a trovamme quanno vuoi, uagliò.',
      money: null, gym: null, when: null
    },
    marino_del_tronto_ragazzina_1: {
      map: 'marino_del_tronto', x: 105, y: 53, direction: 'left', sight: 4,
      class: 'ragazzina', name: 'Serena', sprite: null,
      team: [{ species: 'tamburino', level: 7 }, { species: 'anicino', level: 7 }],
      before: ['Tè, uno che passeggia tranquillo!', 'Da queste parti nisciuno passa senza lotta\'.'],
      after: ['Mbè, oggi hai vinto tu.'],
      lost: 'Ripassa quanno vuoi, magari me rifò.',
      money: null, gym: null, when: null
    },
    marino_del_tronto_pescatore_1: {
      map: 'marino_del_tronto', x: 86, y: 96, direction: 'down', sight: 3,
      class: 'pescatore', name: 'Learco', sprite: null,
      team: [{ species: 'soldatino', level: 7 }, { species: 'soldatino', level: 8 }],
      before: ['Chi vòle attraversà il Tronto, prima passa da me!', 'Qui l\'acqua è bona pé\' i Soldatino.'],
      after: ['Mo\' sì che m\'hai convinto, campió.'],
      lost: 'Il ponte è tuo, statte accorto all\'acqua.',
      money: null, gym: null, when: null
    }
  });
}());
