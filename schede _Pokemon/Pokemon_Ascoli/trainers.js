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
