(function () {
  const { building, rect, zone, transition, npc, wide } = window.PokemonAscoliMapHelpers;
  window.PokemonAscoliMaps = window.PokemonAscoliMaps || {};
  window.PokemonAscoliMaps.costa = {
    width: 112, height: 61, name: 'Costa', baseTile: 'erba', levelRange: [15, 19],
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
      rect(2, 2, 108, 4, 'asfalto'),
      // strada principale (passaggi fissi, righe 54-57), largo 4
      rect(0, 31, 112, 4, 'asfalto'),
      // via di collegamento fra lungomare e porto/strada principale
      rect(60, 6, 4, 25, 'asfalto'),
      // piazzale del porto
      rect(47, 35, 21, 6, 'asfalto'),
      // scogli lungo la riva (devono precedere la sabbia sotto: terrainAt prende il primo match)
      rect(4, 56, 2, 2, 'muro'), rect(37, 57, 3, 2, 'muro'), rect(80, 56, 2, 2, 'muro'), rect(106, 57, 3, 2, 'muro'),
      // spiaggia (sabbia), dal fondo del porto fino alla riva del mare
      rect(2, 48, 108, 11, 'sabbia')
    ],
    waters: [
      // mare a sud, dalla riga 96 fino al bordo inferiore
      rect(0, 59, 112, 2, 'mare'),
      // insenatura del porto, davanti al Ristoro
      rect(47, 41, 20, 10, 'mare')
    ],
    bridges: [
      // molo che si protende dal porto verso il mare aperto
      rect(56, 41, 4, 10, 'bridge')
    ],
    plazas: [rect(47, 35, 21, 6, 'piazza')],
    buildings: [
      building(21, 6, 8, 5, 'Bagni Sirena', '#d9a94f', 'stabilimento'),
      building(37, 6, 8, 5, 'Bagni Nettuno', '#d9a94f', 'stabilimento'),
      building(68, 6, 8, 5, 'Bagni Conero', '#d9a94f', 'stabilimento'),
      building(80, 6, 8, 5, 'Bagni Adriatico', '#d9a94f', 'stabilimento'),
      building(48, 21, 12, 9, 'Ristoro al Porto', '#b46c52', 'attività', { door: { x: 54, y: 30 }, interior: 'bar' }),
      building(12, 41, 8, 6, 'Chiosco Sirenetta', '#c98f57', 'attività'),
      building(91, 41, 8, 6, 'Noleggio Pedalò', '#c98f57', 'attività')
    ],
    labels: [
      { x: 2, y: 2, text: 'Lungomare' },
      { x: 47, y: 32, text: 'Porto' },
      { x: 2, y: 49, text: 'Spiaggia libera' },
      { x: 99, y: 30, text: '→ Jonathan' }
    ],
    encounterZones: [
      // sabbia
      zone(2, 48, 108, 11, 0.08, 'default'),
      // scogli e riva (fascia più vicina al mare)
      zone(2, 56, 108, 3, 0.12, 'default')
    ],
    transitions: [
      transition(0, 31, 2, 4, 'spinetoli_centobuchi', 75, 21, 'Spinetoli'),
      transition(110, 31, 2, 4, 'jonathan', 3, 20, 'Jonathan')
    ],
    npcs: [
      npc(3, 4, 'Cartello', 'LUNGOMARE DI SAN BENEDETTO — passeggiata fra le palme.', 'fermo'),
      npc(2, 48, 'Cartello', 'SPIAGGIA LIBERA — accesso gratuito, portate l\'ombrellone.', 'fermo'),
      npc(105, 33, 'Cartello', '→ JONATHAN — la discoteca sulla spiaggia, poco più a est.', 'fermo'),
      npc(29, 8, 'Bagnino di salvataggio', 'D\'estate quaggiù è tutto un via vai, ma l\'acqua è \'na bellezza.', 'orizzontale'),
      npc(78, 8, 'Ragazza col gelato', 'Se\' vinuto pé la spiaggia o pé lo Jonathan la sera?', 'fermo'),
      npc(21, 43, 'Pescatore del porto', 'Stammatina ho ripreso le reti, ma li pesci moderni so\' furbi.', 'fermo'),
      // Ivo e Teo, "i congressisti": prima del flag, script lungo con dialogo alternato
      {
        x: 45, y: 53, name: 'Ivo', sprite: 'ivo', movement: 'fermo', when: { notFlag: 'ivo_teo_visti' },
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
        x: 46, y: 53, name: 'Teo', sprite: 'teo', movement: 'fermo', when: { notFlag: 'ivo_teo_visti' },
        dialogue: 'Aspetta che parla prima Ivo, dai.'
      },
      // dopo il flag: coppia gemella, battuta di commiato
      {
        x: 45, y: 53, name: 'Ivo', sprite: 'ivo', movement: 'fermo', when: { flag: 'ivo_teo_visti' },
        dialogue: 'Noi se retiramo davero, stavolta. Bona fortuna co\' Riccio.'
      },
      {
        x: 46, y: 53, name: 'Teo', sprite: 'teo', movement: 'fermo', when: { flag: 'ivo_teo_visti' },
        dialogue: 'E salutace er congresso, se ce passi.'
      }
    ]
  };
  const map = window.PokemonAscoliMaps.costa;
  map.roads.push(
    // palme lungo il lungomare, a intervalli regolari sopra e sotto la strada
    
    
    rect(2, 6, 1, 1, 'albero'), rect(10, 6, 2, 1, 'albero'), rect(45, 6, 2, 1, 'albero'), 
    rect(91, 6, 2, 1, 'albero'), rect(101, 6, 2, 1, 'albero'),
    // scogli (muro) sparsi fra il lungomare e la strada principale, e lungo la riva
    rect(6, 12, 3, 2, 'muro'), rect(34, 16, 2, 3, 'muro'), rect(64, 14, 3, 2, 'muro'), rect(88, 18, 2, 3, 'muro'),
    rect(99, 12, 3, 2, 'muro'),
    // boschetti/vegetazione fra le due strade, lontano da edifici e passaggi
    rect(12, 20, 3, 1, 'albero'), 
    rect(91, 20, 3, 1, 'albero'), 
    rect(99, 23, 3, 2, 'albero'),
    // cornice di alberi sui bordi, interrotta ai passaggi (righe 54-57) e dal mare/spiaggia a sud
    rect(0, 0, 112, 2, 'albero'),
    rect(0, 2, 2, 29, 'albero'), rect(0, 35, 2, 24, 'albero'),
    rect(110, 2, 2, 29, 'albero'), rect(110, 35, 2, 24, 'albero')
  );
}());
