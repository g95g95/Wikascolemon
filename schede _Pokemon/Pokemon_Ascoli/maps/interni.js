// Interni generici di bar e tabacchi: una stanza per tipo, condivisa da tutti gli edifici di quel
// tipo. Si entra dalla porta di un edificio con `interior: 'bar'` o `'market'` (il collegamento lo
// fa data.js) e uscendo dallo zerbino si torna davanti alla porta da cui si è entrati
// (`save.returnSpot`; il passaggio qui sotto ha `back: true`, e la sua destinazione scritta è solo
// quella di riserva, impostata da data.js sul primo edificio di quel tipo).
(function () {
  const { rect, transition } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  const d = (x, y, kind) => ({ x, y, kind });
  const room = extra => ({
    width: 15, height: 10, indoor: true, baseTile: 'pavimento', levelRange: [1, 1], encounterTable: [],
    roads: [rect(0, 0, 15, 2, 'muro')], // parete di fondo, alta due celle; 15×10 = uno schermo esatto
    waters: [], bridges: [], plazas: [], buildings: [], labels: [], encounterZones: [],
    // l'ingresso mette il giocatore in (7, 8), sopra lo zerbino
    transitions: [transition(7, 9, 1, 1, 'porta_maggiore', 0, 0, 'Uscita', { back: true, direction: 'down' })],
    ...extra
  });

  window.PokemonAscoliMaps.interno_bar = room({
    name: 'Bar', floor: 'pavimento_legno',
    decor: [
      d(6, 1, 'quadro'),
      d(1, 2, 'scaffale_bottiglie'), d(4, 2, 'macchina_caffe'), d(12, 2, 'jukebox'), d(10, 2, 'pianta'),
      d(7, 3, 'pianta'),
      d(1, 4, 'bancone'), d(3, 4, 'bancone'), d(5, 4, 'bancone'),
      d(2, 5, 'sgabello'), d(5, 5, 'sgabello'),
      d(10, 5, 'tavolo_sedie'), d(11, 8, 'tavolo_sedie'), d(1, 8, 'tavolo_sedie'),
      d(7, 9, 'zerbino')
    ],
    npcs: [{
      x: 3, y: 3, name: 'Barista', sprite: 'barista', movement: 'fermo',
      script: [{ say: 'Che te faccio?', name: 'Barista' }, { heal: true }, { say: 'Ecco fatto! La squadra è come nuova.', name: 'Barista' }]
    }]
  });

  // Casa: cucina a destra, camino al centro, letto a sinistra, salotto in basso a destra.
  window.PokemonAscoliMaps.interno_casa = room({
    name: 'Casa', floor: 'pavimento_cotto',
    decor: [
      d(3, 1, 'finestra_tende'), d(8, 1, 'quadro'),
      d(1, 2, 'libreria'), d(3, 2, 'armadio'), d(6, 2, 'camino'), d(10, 2, 'fornello'), d(11, 2, 'lavello'), d(13, 2, 'pendola'),
      d(1, 5, 'letto'), d(3, 5, 'comodino'),
      d(5, 5, 'sedia'), d(6, 5, 'tavola'), d(8, 5, 'sedia'),
      d(13, 5, 'tv'),
      d(10, 7, 'tappeto'), d(10, 8, 'divano'), d(13, 8, 'poltrona'),
      d(1, 8, 'pianta'),
      d(7, 9, 'zerbino')
    ],
    npcs: [{
      x: 9, y: 4, name: 'Padrona di casa', sprite: 'signora', movement: 'fermo',
      dialogue: ['Oh, un allenatore! Fai come se fossi a casa tua.', 'Se la squadra è stanca, il bar più vicino la rimette in sesto.']
    }]
  });

  window.PokemonAscoliMaps.interno_tabacchi = room({
    name: 'Tabacchi', floor: 'pavimento_scacchi',
    decor: [
      d(8, 1, 'quadro'),
      d(1, 2, 'scaffale_riviste'), d(3, 2, 'scaffale_riviste'), d(11, 2, 'frigo'), d(13, 2, 'frigo'),
      d(5, 4, 'cassa'), d(7, 4, 'bancone'),
      d(13, 7, 'pianta'), d(1, 7, 'scaffale_riviste'), d(10, 6, 'scaffale_riviste'),
      d(7, 9, 'zerbino')
    ],
    npcs: [{
      x: 5, y: 3, name: 'Tabaccaio', sprite: 'anziano', movement: 'fermo',
      script: [{ say: 'Dimmi pure.', name: 'Tabaccaio' }, { shop: ['ball', 'potion', 'antidote', 'repel', 'grattaevinci'] }]
    }]
  });
}());
