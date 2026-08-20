(function () {
  Object.assign(window.PokemonAscoliTrainers.trainers, {
    ripatransone_contadino_1: {
      map: 'ripatransone', x: 22, y: 40, direction: 'down', sight: 4,
      class: 'contadino', name: 'Renzo', sprite: null,
      team: [{ species: 'pefna', level: 7 }, { species: 'cignalo', level: 8 }],
      before: ['Ehò, statte accorto! Da le vigne su per Ripatransone nun ce passa nisciuno senza fatte na sfida.'],
      after: ['Mo\' sì che m\'hai convinto, vattene su in piazza tranquillo.'],
      lost: 'Le vigne so\' toste, torna quanno hai allenato di più.',
      money: null, gym: null, when: null
    }
  });
}());
