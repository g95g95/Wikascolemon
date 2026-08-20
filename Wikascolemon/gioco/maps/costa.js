(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.costa = {
    ...wide, name: 'Costa', baseTile: 'erba', levelRange: [15, 19],
    encounterTable: [
      { species: 'cozzetta', minLevel: 15, maxLevel: 19, weight: 25 },
      { species: 'lettino', minLevel: 15, maxLevel: 19, weight: 20 },
      { species: 'alghetta', minLevel: 15, maxLevel: 18, weight: 15 },
      { species: 'bagnetto', minLevel: 16, maxLevel: 19, weight: 15 },
      { species: 'maranzino', minLevel: 16, maxLevel: 19, weight: 10 },
      { species: 'mucillax', minLevel: 17, maxLevel: 19, weight: 10 },
      { species: 'scoglierax', minLevel: 18, maxLevel: 19, weight: 5 }
    ],
    roads: [
      // lungomare a nord (righe 6-9), largo 4
      rect(2, 6, 176, 4, 'asfalto'),
      // strada principale (passaggi fissi, righe 54-57), largo 4
      rect(0, 54, 180, 4, 'asfalto'),
      // via di collegamento fra lungomare e porto/strada principale
      rect(96, 10, 4, 44, 'asfalto'),
      // piazzale del porto
      rect(70, 58, 40, 6, 'asfalto'),
      // scogli lungo la riva (devono precedere la sabbia sotto: terrainAt prende il primo match)
      rect(10, 93, 2, 2, 'muro'), rect(50, 94, 3, 2, 'muro'), rect(130, 93, 2, 2, 'muro'), rect(170, 94, 3, 2, 'muro'),
      // spiaggia (sabbia), dal fondo del porto fino alla riva del mare
      rect(2, 78, 176, 18, 'sabbia')
    ],
    waters: [
      // mare a sud, dalla riga 96 fino al bordo inferiore
      rect(0, 96, 180, 24, 'mare'),
      // insenatura del porto, davanti al Ristoro
      rect(76, 64, 28, 20, 'mare')
    ],
    bridges: [
      // molo che si protende dal porto verso il mare aperto
      rect(88, 64, 4, 20, 'bridge')
    ],
    plazas: [rect(70, 58, 40, 6, 'piazza')],
    buildings: [
      building(30, 12, 8, 5, 'Bagni Sirena', '#d9a94f', 'stabilimento'),
      building(50, 12, 8, 5, 'Bagni Nettuno', '#d9a94f', 'stabilimento'),
      building(110, 12, 8, 5, 'Bagni Conero', '#d9a94f', 'stabilimento'),
      building(130, 12, 8, 5, 'Bagni Adriatico', '#d9a94f', 'stabilimento'),
      building(80, 42, 12, 9, 'Ristoro al Porto', '#b46c52', 'attività', { door: { x: 86, y: 51 }, interior: 'bar' }),
      building(20, 66, 8, 6, 'Chiosco Sirenetta', '#c98f57', 'attività'),
      building(150, 66, 8, 6, 'Noleggio Pedalò', '#c98f57', 'attività')
    ],
    labels: [
      { x: 3, y: 4, text: 'Lungomare' },
      { x: 71, y: 55, text: 'Porto' },
      { x: 4, y: 82, text: 'Spiaggia libera' },
      { x: 160, y: 51, text: '→ Jonathan' }
    ],
    encounterZones: [
      // sabbia
      zone(2, 78, 176, 18, 0.08, 'default'),
      // scogli e riva (fascia più vicina al mare)
      zone(2, 92, 176, 4, 0.12, 'default')
    ],
    transitions: [
      transition(0, 54, 2, 4, 'spinetoli_centobuchi', 173, 55, 'Spinetoli'),
      transition(178, 54, 2, 4, 'jonathan', 6, 55, 'Jonathan')
    ],
    npcs: [
      npc(9, 8, 'Cartello', 'LUNGOMARE DI SAN BENEDETTO — passeggiata fra le palme.', 'fermo'),
      npc(6, 80, 'Cartello', 'SPIAGGIA LIBERA — accesso gratuito, portate l\'ombrellone.', 'fermo'),
      npc(168, 56, 'Cartello', '→ JONATHAN — la discoteca sulla spiaggia, poco più a est.', 'fermo'),
      npc(40, 14, 'Bagnino di salvataggio', 'D\'estate quaggiù è tutto un via vai, ma l\'acqua è \'na bellezza.', 'orizzontale'),
      npc(120, 14, 'Ragazza col gelato', 'Se\' vinuto pé la spiaggia o pé lo Jonathan la sera?', 'fermo'),
      npc(30, 68, 'Pescatore del porto', 'Stammatina ho ripreso le reti, ma li pesci moderni so\' furbi.', 'fermo'),
      // Ivo e Teo, "i congressisti": prima del flag, script lungo con dialogo alternato
      {
        x: 60, y: 86, name: 'Ivo', sprite: 'ivo', movement: 'fermo', when: { notFlag: 'ivo_teo_visti' },
        script: [
          { say: 'Ehm... salve. Siamo solo due villeggianti, eh, niente di che.', name: 'Ivo' },
          { say: 'Sì sì, congressisti. Qui pé lu congresso. Mica pé antro.', name: 'Teo' },
          { say: 'Teo, non serve giustificasse così, mo\' ce pijeno pé matti davero.', name: 'Ivo' },
          { say: 'A dì la verità... noi s\'era \'nventati de dà \'na lezione a quer Riccio de lo Jonathan.', name: 'Teo' },
          { say: 'Sì, l\'aguato più curto de la storia. Ce s\'è visto arrivà co\' \'na fusciacca de gomma e ha detto solo "Ombrellone, avanti".', name: 'Ivo' },
          { say: 'E doppo tre minuti eravamo già stesi sulla sabbia, tutt\'e due.', name: 'Teo' },
          { say: 'Ce ha pure rimandato al congresso, testuale. "Annàtevene al congresso, va\'".', name: 'Ivo' },
          { say: 'Se vòi entrà a lo Jonathan sappi che Riccio sta llà dietro, protetto da li Bro della Security.', name: 'Teo' },
          { say: 'Fatte forte prima de provacce, uagliò. Nu\' come noi.', name: 'Ivo' },
          { setFlag: 'ivo_teo_visti' }
        ]
      },
      {
        x: 61, y: 86, name: 'Teo', sprite: 'teo', movement: 'fermo', when: { notFlag: 'ivo_teo_visti' },
        dialogue: 'Aspetta che parla prima Ivo, dai.'
      },
      // dopo il flag: coppia gemella, battuta di commiato
      {
        x: 60, y: 86, name: 'Ivo', sprite: 'ivo', movement: 'fermo', when: { flag: 'ivo_teo_visti' },
        dialogue: 'Noi se retiramo davero, stavolta. Bona fortuna co\' Riccio.'
      },
      {
        x: 61, y: 86, name: 'Teo', sprite: 'teo', movement: 'fermo', when: { flag: 'ivo_teo_visti' },
        dialogue: 'E salutace er congresso, se ce passi.'
      }
    ]
  };
  const map = window.PokemonAscoliMaps.costa;
  map.roads.push(
    // palme lungo il lungomare, a intervalli regolari sopra e sotto la strada
    rect(6, 4, 2, 2, 'albero'), rect(18, 4, 2, 2, 'albero'), rect(60, 4, 2, 2, 'albero'), rect(72, 4, 2, 2, 'albero'),
    rect(105, 4, 2, 2, 'albero'), rect(122, 4, 2, 2, 'albero'), rect(150, 4, 2, 2, 'albero'), rect(162, 4, 2, 2, 'albero'),
    rect(6, 11, 2, 2, 'albero'), rect(18, 11, 2, 2, 'albero'), rect(60, 11, 2, 2, 'albero'), rect(72, 11, 2, 2, 'albero'),
    rect(105, 11, 2, 2, 'albero'), rect(122, 11, 2, 2, 'albero'), rect(150, 11, 2, 2, 'albero'), rect(162, 11, 2, 2, 'albero'),
    // scogli (muro) sparsi fra il lungomare e la strada principale, e lungo la riva
    rect(14, 24, 3, 2, 'muro'), rect(45, 30, 2, 3, 'muro'), rect(100, 26, 3, 2, 'muro'), rect(140, 32, 2, 3, 'muro'),
    rect(160, 24, 3, 2, 'muro'),
    // boschetti/vegetazione fra le due strade, lontano da edifici e passaggi
    rect(20, 34, 3, 2, 'albero'), rect(25, 37, 2, 3, 'albero'),
    rect(150, 34, 3, 2, 'albero'), rect(155, 37, 2, 3, 'albero'),
    rect(40, 40, 3, 2, 'albero'), rect(160, 44, 3, 2, 'albero'),
    // cornice di alberi sui bordi, interrotta ai passaggi (righe 54-57) e dal mare/spiaggia a sud
    rect(0, 0, 180, 2, 'albero'),
    rect(0, 2, 2, 52, 'albero'), rect(0, 58, 2, 38, 'albero'),
    rect(178, 2, 2, 52, 'albero'), rect(178, 58, 2, 38, 'albero')
  );
}());
