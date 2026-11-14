(function () {
  const building = (x, y, w, h, name, color = '#bd805d', kind = 'edificio', extra = {}) => ({ x, y, w, h, name, color, kind, ...extra });
  const rect = (x, y, w, h, type = 'road') => ({ x, y, w, h, type });
  const zone = (x, y, w, h, rate, table) => ({ x, y, w, h, rate, table });
  const transition = (x, y, w, h, to, spawnX, spawnY, label, extra = {}) => ({ x, y, w, h, to, spawnX, spawnY, label, ...extra });
  const npc = (x, y, name, dialogue, movement = 'fermo') => ({ x, y, name, dialogue, movement });
  const city = { width: 72, height: 54 };
  const wide = { width: 90, height: 60 };
  const tall = { width: 72, height: 60 };

  window.PokemonAscoliMapHelpers = { building, rect, zone, transition, npc, city, wide, tall };
}());
