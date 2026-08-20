(function () {
  const moves = window.PokemonAscoliMoves;
  const species = window.PokemonAscoliSpecies;
  const maps = window.PokemonAscoliMaps;

  const typeChart = {
    Normale: { Roccia: 0.5, Spettro: 0, Acciaio: 0.5 },
    Fuoco: { Erba: 2, Acciaio: 2, Fuoco: 0.5, Acqua: 0.5, Roccia: 0.5 },
    Acqua: { Fuoco: 2, Terra: 2, Roccia: 2, Acqua: 0.5, Erba: 0.5 },
    Erba: { Acqua: 2, Terra: 2, Roccia: 2, Fuoco: 0.5, Erba: 0.5, Acciaio: 0.5 },
    Terra: { Fuoco: 2, Acciaio: 2, Roccia: 2, Erba: 0.5 },
    Roccia: { Fuoco: 2, Erba: 0.5, Terra: 0.5, Acciaio: 0.5 },
    Acciaio: { Roccia: 2, Acciaio: 0.5, Fuoco: 0.5, Acqua: 0.5 },
    Lotta: { Normale: 2, Roccia: 2, Acciaio: 2, Spettro: 0 },
    Veleno: { Erba: 2, Veleno: 0.5, Terra: 0.5, Roccia: 0.5, Acciaio: 0 },
    Spettro: { Spettro: 2, Normale: 0, Buio: 0.5 },
    Buio: { Spettro: 2, Buio: 0.5, Lotta: 0.5 },
    Folletto: { Buio: 2, Fuoco: 0.5, Acciaio: 0.5 },
    Psico: { Lotta: 2, Buio: 0, Acciaio: 0.5 }
  };

  const items = {
    ball: { name: 'Ball', price: 200, battle: true },
    potion: { name: 'Pozione', price: 300, battle: true },
    antidote: { name: 'Antidoto', price: 100, battle: true },
    repel: { name: 'Repellente', price: 350, battle: false },
    acquasanta: { name: 'Acquasanta', price: null, battle: false },
    mt_velenospina: { name: 'MT Velenospina', price: null, battle: false },
    mt_idrogetto: { name: 'MT Idrogetto', price: null, battle: false }
  };

  window.PokemonAscoliData = {
    version: 2,
    title: 'Pokémon Ascoli',
    tileSize: 16,
    viewport: { width: 240, height: 160 },
    moves,
    species,
    maps,
    typeChart,
    items,
    starters: ['basilino', 'puledrotto', 'tuffito'],
    start: { map: 'porta_maggiore', x: 16, y: 46, direction: 'down' },
    respawn: { map: 'porta_maggiore', x: 16, y: 46, direction: 'down' },
    initialItems: { ball: 5, potion: 2, antidote: 0, repel: 0, acquasanta: 0 }
  };
  if (typeof module !== 'undefined') module.exports = window.PokemonAscoliData;
}());
