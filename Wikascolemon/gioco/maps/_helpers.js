(function () {
  const building = (x, y, w, h, name, color = '#bd805d', kind = 'edificio', extra = {}) => ({ x, y, w, h, name, color, kind, ...extra });
  const rect = (x, y, w, h, type = 'road') => ({ x, y, w, h, type });
  const zone = (x, y, w, h, rate, table) => ({ x, y, w, h, rate, table });
  const transition = (x, y, w, h, to, spawnX, spawnY, label, extra = {}) => ({ x, y, w, h, to, spawnX, spawnY, label, ...extra });
  const npc = (x, y, name, dialogue, movement = 'fermo') => ({ x, y, name, dialogue, movement });
  const city = { width: 144, height: 108 };
  const wide = { width: 180, height: 120 };
  const tall = { width: 144, height: 120 };

  window.PokemonAscoliMapHelpers = { building, rect, zone, transition, npc, city, wide, tall };
}());
