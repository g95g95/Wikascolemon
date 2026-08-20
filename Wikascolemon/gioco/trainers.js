(function () {
  const classes = {
    ragazzino: { name: 'Ragazzino', moneyPerLevel: 16, sprite: 'ragazzino' },
    ragazzina: { name: 'Ragazzina', moneyPerLevel: 16, sprite: 'ragazzina' },
    pescatore: { name: 'Pescatore', moneyPerLevel: 20, sprite: 'pescatore' },
    birdwatcher: { name: 'Birdwatcher', moneyPerLevel: 20, sprite: 'birdwatcher' },
    campeggiatore: { name: 'Campeggiatore', moneyPerLevel: 18, sprite: 'campeggiatore' },
    contadino: { name: 'Contadino', moneyPerLevel: 18, sprite: 'contadino' },
    ciclista: { name: 'Ciclista', moneyPerLevel: 20, sprite: 'ciclista' },
    gemelle: { name: 'Gemelle', moneyPerLevel: 14, sprite: 'gemelle' },
    bagnino: { name: 'Bagnino', moneyPerLevel: 32, sprite: 'bagnino' },
    turista: { name: 'Turista', moneyPerLevel: 16, sprite: 'turista' },
    dj: { name: 'DJ', moneyPerLevel: 24, sprite: 'dj' },
    bro_security: { name: 'Bro della Security', moneyPerLevel: 40, sprite: 'bro_security' },
    congressista: { name: 'Congressista', moneyPerLevel: 22, sprite: 'congressista' },
    rivale: { name: 'Rivale', moneyPerLevel: 60, sprite: 'rivale' },
    capopalestra: { name: 'Capopalestra', moneyPerLevel: 100, sprite: 'capopalestra' }
  };

  const trainers = {
    porta_maggiore_ragazzino_1: {
      map: 'porta_maggiore', x: 22, y: 19, direction: 'down', sight: 4,
      class: 'ragazzino', name: 'Tobia', sprite: null,
      team: [{ species: 'pito', level: 6 }, { species: 'basilino', level: 7 }],
      before: ['Ehi tu, fermo lì!', 'A Porta Maggiore ci si allena sul serio, sa!'],
      after: ['Uffa, mi hai fregato.'],
      lost: 'Torna quando hai allenato un po\' di più.',
      money: null, gym: null, when: null
    },
    monticelli_campeggiatore_1: {
      map: 'monticelli', x: 14, y: 20, direction: 'right', sight: 4,
      class: 'campeggiatore', name: 'Gino', sprite: null,
      team: [{ species: 'segaccio', level: 8 }, { species: 'venagrox', level: 7 }],
      before: ['Sto campeggiando qui vicino all\'ospedale.', 'Ma un po\' di battaglia non guasta, dai!'],
      after: ['Che sacco de botte, madò.'],
      lost: 'Passa quando hai qualche livello in più, oh.',
      money: null, gym: null, when: null
    },
    campo_parignano_contadino_1: {
      map: 'campo_parignano', x: 22, y: 19, direction: 'up', sight: 3,
      class: 'contadino', name: 'Marino', sprite: null,
      team: [{ species: 'basilino', level: 6 }, { species: 'pito', level: 7 }, { species: 'banconio', level: 8 }],
      before: ['Questi campi li lavoro da una vita.', 'Vediamo se i tuoi Pokémon reggono la fatica!'],
      after: ['Embè, brao davvero.'],
      lost: 'Ripassa quando hai fatto un po\' di allenamento, giovi\'.',
      money: null, gym: null, when: null
    },
    borgo_chiaro_ciclista_1: {
      map: 'borgo_chiaro', x: 28, y: 19, direction: 'left', sight: 4,
      class: 'ciclista', name: 'Renzo', sprite: null,
      team: [{ species: 'puledrotto', level: 8, moves: ['azione', 'braciere'] }, { species: 'segaccio', level: 9 }],
      before: ['Sto facendo il giro dello stadio in bici.', 'Fermati un attimo, famo \'na sfida!'],
      after: ['Mannaggia, che velocità.'],
      lost: 'Allenati ancora e ci riproviamo.',
      money: null, gym: null, when: null
    },
    borgo_solesta_gemelle_1: {
      map: 'borgo_solesta', x: 17, y: 19, direction: 'right', sight: 3,
      class: 'gemelle', name: 'Lia e Mia', sprite: null,
      team: [{ species: 'pito', level: 6 }, { species: 'basilino', level: 6 }],
      before: ['Siamo in due, lo sai!', 'Sfida doppia, che dici?'],
      after: ['Uffa, insieme e abbiamo perso lo stesso.'],
      lost: 'Torna a trovarci quando sei più forte, dai.',
      money: null, gym: null, when: null
    },
    porta_cartara_pescatore_1: {
      map: 'porta_cartara', x: 22, y: 10, direction: 'down', sight: 4,
      class: 'pescatore', name: 'Nazzareno', sprite: null,
      team: [{ species: 'tuffito', level: 7 }, { species: 'tuffito', level: 8 }],
      before: ['Il Rio Castellano è pieno di Tuffito, sa.', 'Ne ho pescati due bboni, mo\' te fo\' vede\'!'],
      after: ['Embè, m\'hai preso proprio.'],
      lost: 'Torna a trovarmi al fiume quando hai allenato di più.',
      money: null, gym: null, when: null
    },
    castel_di_lama_hills: {
      map: 'castel_di_lama', x: 0, y: 0, direction: 'down', sight: 0,
      class: 'capopalestra', name: 'Daniel Hills', sprite: null,
      team: [
        { species: 'mucillax', level: 11 },
        { species: 'mucillax', level: 12 },
        { species: 'pozza', level: 14 }
      ],
      before: ['Al Free Spirit non entra chiunque.', 'Vediamo se meriti la Medaglia Spirito.'],
      after: ['...tiè, hai vinto tu stavolta.'],
      lost: 'Torna quando la tua squadra è più forte.',
      money: null,
      gym: { id: 'castel_di_lama', badge: 1, badgeName: 'Medaglia Spirito', type: 'Veleno', tm: 'velenospina' },
      when: null
    },
    costa_riccio: {
      map: 'costa', x: 0, y: 0, direction: 'down', sight: 0,
      class: 'capopalestra', name: 'Riccio', sprite: null,
      team: [
        { species: 'cozzetta', level: 18 },
        { species: 'lettino', level: 18 },
        { species: 'ombrellone', level: 20 }
      ],
      before: ['Allo Jonathan la sfida è sempre aperta.', 'Speriamo tu regga meglio dell\'agguato de Ivo e Teo!'],
      after: ['Embè, complimenti davvero.'],
      lost: 'Torna a trovarmi quando sei più allenato.',
      money: null,
      gym: { id: 'costa', badge: 2, badgeName: 'Medaglia Balneare', type: 'Acqua', tm: 'idrogetto' },
      when: null
    }
  };

  const gyms = {
    castel_di_lama: {
      name: 'Palestra di Castel di Lama', city: 'Castel di Lama',
      leader: 'castel_di_lama_hills', map: 'castel_di_lama', order: 1, type: 'Veleno'
    },
    costa: {
      name: 'Palestra della Costa', city: 'Costa (San Benedetto)',
      leader: 'costa_riccio', map: 'costa', order: 2, type: 'Acqua'
    }
  };

  const api = { classes, trainers, gyms };
  window.PokemonAscoliTrainers = api;
  if (typeof module !== 'undefined') module.exports = api;
}());
