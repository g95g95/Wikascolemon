(function () {
  'use strict';

  const data = window.PokemonAscoliData;
  const Battle = window.PokemonAscoliBattle;
  const Events = window.PokemonAscoliEvents;
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  Battle.configure({ species: data.species, moves: data.moves });

  const ui = Object.fromEntries([
    'viewport', 'locationName', 'locationBanner', 'toast', 'titleScreen', 'newGameButton', 'continueButton', 'playerNameInput',
    'dialogueScreen', 'dialogueName', 'dialogueText', 'dialogueChoices', 'dialogueClose',
    'learnMoveScreen', 'learnMoveText', 'learnMoveChoices',
    'shopScreen', 'shopList', 'shopMoney', 'shopClose', 'creditsScreen', 'creditsClose',
    'battleScreen', 'enemyName', 'enemyLevel', 'enemyHp', 'enemySprite', 'enemyStatus', 'enemyExclaim',
    'allyName', 'allyLevel', 'allyHp', 'allyHpText', 'allyExp', 'battleBall', 'allySprite', 'allyStatus', 'battleMessage',
    'battleActions', 'menuScreen', 'menuTabs', 'menuContent', 'menuClose', 'menuExit', 'menuButton', 'continueInfo',
    'touchMenu', 'touchA', 'touchB'
  ].map(id => [id, document.getElementById(id)]));

  const STORAGE_KEY = 'pokemonAscoliSaveV1';
  const MAP_SCALE = 5; // da alzare a ogni giro di tools/compatta-mappe.mjs
  const CONFIG_KEY = 'pokemonAscoliConfigV6'; // a ogni riduzione delle mappe la chiave cambia: le override vecchie puntano a coordinate che non esistono più
  const TRAINERS_KEY = 'pokemonAscoliTrainersV5';
  const directions = {
    up: { x: 0, y: -1, row: 1 },
    down: { x: 0, y: 1, row: 0 },
    left: { x: -1, y: 0, row: 2 },
    right: { x: 1, y: 0, row: 3 }
  };
  const keyDirections = {
    ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right'
  };
  const trainerColors = {
    ragazzino: '#4d80b5', ragazzina: '#c15b8f', pescatore: '#3d7847', birdwatcher: '#6a8f3d',
    campeggiatore: '#8a6a3d', contadino: '#7a5a2a', ciclista: '#c94b43', gemelle: '#b56fc1',
    bagnino: '#3daac9', turista: '#e9b949', dj: '#7d3dc9', bro_security: '#2c2a25',
    congressista: '#5c5c5c', rivale: '#a9453f', capopalestra: '#8b1e1e'
  };
  const statusLabels = { psn: 'VEL', par: 'PAR', brn: 'BRN', slp: 'SON', frz: 'GEL' };

  function readStorage(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }
  function writeStorage(key, value) {
    try { localStorage.setItem(key, value); return true; } catch (_) { return false; }
  }
  function removeStorage(key) {
    try { localStorage.removeItem(key); } catch (_) { }
  }
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadMaps() {
    const base = clone(data.maps);
    const raw = readStorage(CONFIG_KEY);
    if (!raw) return base;
    try {
      const config = JSON.parse(raw);
      Object.entries(config.maps || {}).forEach(([id, changes]) => {
        if (!base[id]) return;
        ['buildings', 'transitions', 'npcs', 'encounterTable', 'encounterZones', 'decor'].forEach(key => {
          if (Array.isArray(changes[key])) base[id][key] = clone(changes[key]);
        });
        base[id].tileOverrides = { ...(changes.tileOverrides || {}) };
        base[id].collisionOverrides = { ...(changes.collisionOverrides || {}) };
        base[id].encounterCells = { ...(changes.encounterCells || {}) };
      });
    } catch (_) {
      showToast('Configurazione non valida: uso i dati iniziali.');
    }
    return base;
  }

  function loadTrainers() {
    const source = window.PokemonAscoliTrainers;
    const base = { classes: clone(source.classes), trainers: clone(source.trainers), gyms: clone(source.gyms) };
    const raw = readStorage(TRAINERS_KEY);
    if (!raw) return base;
    try {
      const config = JSON.parse(raw);
      if (config.trainers) base.trainers = clone(config.trainers);
      if (config.gyms) base.gyms = clone(config.gyms);
      if (config.classes) base.classes = clone(config.classes);
    } catch (_) {
      showToast('Dati allenatori non validi: uso quelli iniziali.');
    }
    return base;
  }

  let maps = loadMaps();
  const trainersData = loadTrainers();
  let save = null;
  let mode = 'title';
  let currentMap = maps[data.start.map];
  let player = { ...data.start, renderX: data.start.x, renderY: data.start.y, frame: 0 };
  let movement = null;
  let battle = null;
  let nextMoveAt = 0;   // prima di questo istante non parte un nuovo passo (giro sul posto, urto)
  let running = false;  // Maiusc o B tenuto premuto
  let rustle = null;    // fruscio dell'erba alta nella cella appena calpestata
  let justArrived = false; // appena cambiata mappa: finché il tasto resta giù non si entra in un altro passaggio
  const WALK_MS = 250;  // durata di un passo da una cella: 4 celle al secondo
  const RUN_MS = 130;   // di corsa: quasi 8 celle al secondo
  let toastTimer = 0;
  let bannerTimer = 0;
  let runtimeNpcs = [];
  let defeatedTrainerSightings = new Set();
  let approachingTrainerId = null;
  let audioContext = null;
  const heldDirections = [];
  const playerImage = new Image();
  playerImage.src = 'assets/player/oliver-sheet.png';

  const npcSheets = {};
  function npcSheet(name) {
    if (!name) return null;
    let entry = npcSheets[name];
    if (!entry) {
      const img = new Image();
      entry = { img, failed: false };
      img.onerror = () => { entry.failed = true; };
      img.src = `assets/npc/${name}.png`;
      npcSheets[name] = entry;
    }
    if (entry.failed || !entry.img.complete || !entry.img.naturalWidth) return null;
    return entry.img;
  }

  // ---------------------------------------------------------------------
  // Salvataggio
  // ---------------------------------------------------------------------

  function freshSave() {
    const typedName = (ui.playerNameInput && ui.playerNameInput.value || '').trim().slice(0, 10);
    return {
      version: 2,
      name: typedName || 'Oliver',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      player: { ...data.start },
      starter: null,
      team: [],
      storage: [],
      items: clone(data.initialItems),
      dex: { seen: {}, caught: {} },
      settings: { sound: true },
      steps: 0,
      flags: {},
      badges: [],
      money: 3000,
      lastHeal: { map: data.respawn.map, x: data.respawn.x, y: data.respawn.y },
      mapScale: MAP_SCALE
    };
  }

  function migrateSave(parsed) {
    parsed.name = parsed.name || 'Oliver';
    // Le mappe esterne hanno cambiato misura più volte (14-15/11/2026). Da quando si compattano
    // togliendo spazio vuoto le vecchie coordinate non si possono convertire: a ogni giro `MAP_SCALE`
    // sale, e chi ha un salvataggio precedente riparte dalla stazione con squadra e progressi intatti.
    if (parsed.mapScale !== MAP_SCALE) {
      const outdoors = spot => spot && data.maps[spot.map] && !data.maps[spot.map].indoor;
      if (!parsed.player || outdoors(parsed.player) || !data.maps[parsed.player.map]) parsed.player = { ...data.start };
      if (!parsed.lastHeal || outdoors(parsed.lastHeal) || !data.maps[parsed.lastHeal.map]) parsed.lastHeal = { map: data.respawn.map, x: data.respawn.x, y: data.respawn.y };
      delete parsed.returnSpot;
      parsed.mapScale = MAP_SCALE;
    }
    if (parsed.version === 2) return parsed;
    // v1 -> v2
    parsed.version = 2;
    parsed.flags = parsed.flags || {};
    parsed.badges = parsed.badges || [];
    parsed.money = Number.isFinite(parsed.money) ? parsed.money : 3000;
    parsed.lastHeal = parsed.lastHeal || { map: data.respawn.map, x: data.respawn.x, y: data.respawn.y };
    return parsed;
  }

  function loadSave() {
    const raw = readStorage(STORAGE_KEY);
    if (!raw) return null;
    try {
      let parsed = JSON.parse(raw);
      if (!parsed.player || (parsed.version !== 1 && parsed.version !== 2)) return null;
      parsed = migrateSave(parsed);
      parsed.team = (parsed.team || []).map(Battle.hydrateMonster);
      parsed.storage = (parsed.storage || []).map(Battle.hydrateMonster);
      parsed.items = { ...data.initialItems, ...(parsed.items || {}) };
      parsed.dex = parsed.dex || { seen: {}, caught: {} };
      parsed.settings = { sound: true, ...(parsed.settings || {}) };
      return parsed;
    } catch (_) {
      return null;
    }
  }

  function autoSave() {
    if (!save) return;
    save.updatedAt = new Date().toISOString();
    save.player = { map: player.map, x: player.x, y: player.y, direction: player.direction };
    writeStorage(STORAGE_KEY, JSON.stringify(save));
  }

  function startSession(loaded) {
    save = loaded;
    const isNewGame = !save.flags.intro_vista;
    let stored = save.player || data.start;
    if (isNewGame || !maps[stored.map] || isBlocked(maps[stored.map], stored.x, stored.y, true)) stored = data.start;
    player = { ...stored, renderX: stored.x, renderY: stored.y, frame: 0 };
    currentMap = maps[player.map];
    initNpcs();
    ui.titleScreen.hidden = true;
    mode = 'world';
    showLocation(currentMap.name);
    updateLocation();
    autoSave();
    startMusic();
    if (isNewGame) playIntroFade();
  }

  function playIntroFade() {
    ui.viewport.classList.add('intro-fade');
    setTimeout(() => ui.viewport.classList.remove('intro-fade'), 1000);
  }

  // ---------------------------------------------------------------------
  // Mostri
  // ---------------------------------------------------------------------

  // Cura completa (bar, sconfitta): PS, stato e PP di tutte le mosse.
  function restoreMonster(monster) {
    monster.hp = monster.stats.hp;
    monster.status = null;
    monster.sleepTurns = 0;
    (monster.moves || []).forEach(slot => { slot.pp = slot.maxPp; });
  }

  function hasItem(itemId) {
    return !!(save.items && save.items[itemId] > 0);
  }

  function mapHasWater() {
    return (currentMap.waters || []).length > 0;
  }

  // Ora del giorno, dall'orologio del dispositivo: di notte e al tramonto certe specie si evolvono.
  function timeOfDay() {
    const hour = new Date().getHours();
    return hour >= 20 || hour < 6 ? 'night' : hour >= 17 ? 'dusk' : 'day';
  }

  function evolutionContext(extra = {}) {
    return { map: player.map, hasItem, mapHasWater: mapHasWater(), time: timeOfDay(), party: save.team.map(monster => monster.species), ...extra };
  }

  function giveMonster(spec) {
    const monster = Battle.createMonster(spec.species, spec.level, spec.moves ? { moves: spec.moves } : {});
    save.dex.seen[spec.species] = true;
    save.dex.caught[spec.species] = true;
    if (!save.starter) save.starter = spec.species;
    if (save.team.length < 6) save.team.push(monster);
    else save.storage.push(monster);
    autoSave();
    showToast(`${data.species[spec.species].name} è entrato nella squadra!`);
  }

  // ---------------------------------------------------------------------
  // Mappa / collisioni / movimento
  // ---------------------------------------------------------------------

  function pointInRect(x, y, item) {
    return x >= item.x && y >= item.y && x < item.x + item.w && y < item.y + item.h;
  }

  function keyFor(x, y) {
    return `${x},${y}`;
  }

  function terrainAt(map, x, y) {
    return window.PokemonAscoliTiles.terrainAt(map, x, y);
  }

  // Dove si trova un allenatore dopo essersi avvicinato al giocatore (per mappa, finché non la si lascia).
  let trainerSpots = {};

  function activeTrainersOnMap() {
    return Object.entries(trainersData.trainers)
      .filter(([id, trainer]) => trainer.map === player.map && Events.check(trainer.when, save))
      .map(([id, trainer]) => ({ id, ...trainer, ...(trainerSpots[id] || {}) }));
  }

  function isBlocked(map, x, y, ignoreNpc = false) {
    if (x < 0 || y < 0 || x >= map.width || y >= map.height) return true;
    const override = map.collisionOverrides && map.collisionOverrides[keyFor(x, y)];
    if (override === false) return false;
    if (override === true) return true;
    const terrain = terrainAt(map, x, y);
    if (['water', 'mare', 'muro', 'albero', 'binari'].includes(terrain)) return true;
    if ((map.buildings || []).some(item => pointInRect(x, y, item))) return true;
    if (window.PokemonAscoliTiles.decorBlocks(map, x, y)) return true;
    // solo gli NPC che si vedono: quelli nascosti da una condizione (`when`) non devono fare da muro
    if (!ignoreNpc && visibleRuntimeNpcs().some(item => item.x === x && item.y === y)) return true;
    if (!ignoreNpc && save && activeTrainersOnMap().some(t => t.x === x && t.y === y && !save.flags[Events.flagKeys.trainerFlag(t.id)])) return true;
    return false;
  }

  // chained = il passo segue subito il precedente (tasto tenuto premuto): niente giro sul posto.
  function movePlayer(direction, now = performance.now(), chained = false) {
    if (mode !== 'world' || movement || approachingTrainerId) return;
    if (!chained && player.direction !== direction) {
      // da fermi, un colpetto in un'altra direzione gira soltanto; se il tasto resta giù si parte
      player.direction = direction;
      nextMoveAt = now + 90;
      return;
    }
    player.direction = direction;
    const vector = directions[direction];
    const targetX = player.x + vector.x;
    const targetY = player.y + vector.y;
    // Chi arriva tenendo premuto il tasto e ha subito davanti il passaggio di ritorno (la corriera,
    // uno zerbino) non deve rimbalzare indietro: per rientrarci deve rilasciare e ripremere.
    if (justArrived && (currentMap.transitions || []).some(item => pointInRect(targetX, targetY, item))) return;
    if (isBlocked(currentMap, targetX, targetY)) {
      // camminare contro l'edificio dalla cella davanti alla porta = entrare
      const doorway = direction === 'up' && (currentMap.buildings || []).find(item => item.door && item.door.x === player.x && item.door.y === player.y && pointInRect(targetX, targetY, item));
      if (doorway && buildingScript(doorway).length) { nextMoveAt = now + 400; enterBuilding(doorway); return; }
      player.frame = 0;
      playSound('bump');
      nextMoveAt = now + 220;
      return;
    }
    movement = {
      start: now,
      duration: running ? RUN_MS : WALK_MS,
      fromX: player.x,
      fromY: player.y,
      toX: targetX,
      toY: targetY
    };
    player.stride = !player.stride;
  }

  function updateMovement(now) {
    if (!movement) return;
    // velocità costante: niente accelerazione e frenata a ogni cella
    const progress = Math.min(1, (now - movement.start) / movement.duration);
    player.renderX = movement.fromX + (movement.toX - movement.fromX) * progress;
    player.renderY = movement.fromY + (movement.toY - movement.fromY) * progress;
    // due fotogrammi per cella: falcata (piede alternato a ogni passo), poi posa
    player.frame = progress < .5 ? (player.stride ? 1 : 3) : (player.stride ? 2 : 0);
    if (progress < 1) return;
    const endedAt = movement.start + movement.duration;
    player.x = movement.toX;
    player.y = movement.toY;
    player.renderX = player.x;
    player.renderY = player.y;
    movement = null;
    if (isTallGrass(currentMap, player.x, player.y)) { rustle = { x: player.x, y: player.y, start: now }; playSound('rustle'); }
    save.steps = (save.steps || 0) + 1;
    // l'amicizia cresce camminando insieme: un punto ogni 50 passi a tutta la squadra (ne servono 20 per evolvere)
    if (save.steps % 50 === 0) save.team.forEach(monster => { monster.friendship = Math.min(255, (monster.friendship || 0) + 1); });
    if (checkTrainerSight()) return;
    if (checkTransition()) return;
    checkEncounter();
    autoSave();
    // tasto ancora giù: il passo successivo parte dall'istante in cui è finito questo, senza pause
    const held = heldDirections[heldDirections.length - 1];
    if (held && mode === 'world' && !movement) {
      movePlayer(held, Math.max(endedAt, now - 34), true);
      if (movement) updateMovementPosition(now);
    }
  }

  function updateMovementPosition(now) {
    const progress = Math.max(0, Math.min(1, (now - movement.start) / movement.duration));
    player.renderX = movement.fromX + (movement.toX - movement.fromX) * progress;
    player.renderY = movement.fromY + (movement.toY - movement.fromY) * progress;
  }

  function checkTransition() {
    const exit = (currentMap.transitions || []).find(item => pointInRect(player.x, player.y, item));
    if (!exit || !maps[exit.to]) return false;
    if (!Events.canUseTransition(exit, save)) {
      if (exit.blockedText) showToast(exit.blockedText);
      // respingi il giocatore di una cella
      const vector = directions[player.direction];
      player.x -= vector.x;
      player.y -= vector.y;
      player.renderX = player.x;
      player.renderY = player.y;
      return true;
    }
    // `back`: si torna alla porta da cui si è entrati, se la si conosce
    const back = exit.back && save.returnSpot && maps[save.returnSpot.map] ? save.returnSpot : null;
    player.map = back ? back.map : exit.to;
    player.x = back ? back.x : exit.spawnX;
    player.y = back ? back.y : exit.spawnY;
    if (exit.direction) player.direction = exit.direction;
    player.renderX = player.x;
    player.renderY = player.y;
    currentMap = maps[player.map];
    justArrived = heldDirections.length > 0;
    nextMoveAt = performance.now() + 350; // un attimo di pausa all'arrivo, il tempo della dissolvenza
    fadeInMap();
    initNpcs();
    updateLocation();
    showLocation(currentMap.name);
    playSound('transition');
    autoSave();
    return true;
  }

  function getEncounter(playerX, playerY) {
    const custom = currentMap.encounterCells && currentMap.encounterCells[keyFor(playerX, playerY)];
    if (custom !== undefined) return custom > 0 ? { rate: Number(custom), table: 'default' } : null;
    // Gli incontri capitano solo sull'erba alta che si vede, oppure su sabbia e pendii dentro una zona.
    // Mai su strade, piazze, ponti: una chiazza d'erba può scavalcare la strada, ma lì non succede nulla.
    const ground = terrainAt(currentMap, playerX, playerY);
    if (ground === 'erba' ? !isTallGrass(currentMap, playerX, playerY) : !['sabbia', 'pendio'].includes(ground)) return null;
    return (currentMap.encounterZones || []).find(item => pointInRect(playerX, playerY, item)) || null;
  }

  function weightedEntry(table) {
    const total = table.reduce((sum, item) => sum + Number(item.weight || 0), 0);
    let cursor = Math.random() * total;
    for (const item of table) {
      cursor -= Number(item.weight || 0);
      if (cursor <= 0) return item;
    }
    return table[table.length - 1];
  }

  function checkEncounter() {
    if (!save.team.length || save.team.every(monster => monster.hp <= 0)) return;
    // Repellente: per 100 passi niente selvatici più deboli del primo Pokémon in piedi
    const repelling = save.repelSteps > 0;
    if (repelling) {
      save.repelSteps -= 1;
      if (!save.repelSteps) showToast('L\'effetto del Repellente è finito.');
    }
    const encounter = getEncounter(player.x, player.y);
    if (!encounter || Math.random() >= Number(encounter.rate)) return;
    const table = currentMap.encounterTable || [];
    if (!table.length) return;
    const entry = weightedEntry(table);
    const min = Number(entry.minLevel || 2);
    const max = Number(entry.maxLevel || min);
    const level = min + Math.floor(Math.random() * (max - min + 1));
    if (repelling && level < save.team.find(monster => monster.hp > 0).level) return;
    beginWildBattle(Battle.createMonster(entry.species, level));
  }

  // Sprite per gli NPC che non ne dichiarano uno: scelto dal nome, altrimenti un passante a rotazione.
  // Per fissarlo a mano basta `sprite: '<foglio in assets/npc>'` sull'NPC.
  const npcSpriteRules = [
    [/cartello/, 'cartello'], [/^elena/, 'elena'], [/^steven/, 'steven'], [/infermier/, 'infermiera'],
    [/pescator/, 'pescatore'], [/bagnin/, 'bagnino'], [/birdwatcher/, 'birdwatcher'], [/buttafuori/, 'bro_security'],
    [/barista|ragazza del bar/, 'barista'], [/steward|guida|assistente/, 'vigile'],
    [/contadin|bracciante/, 'contadino'], [/gitante|visitatrice|viaggiator|pellegrin/, 'gitante'],
    [/ragazza|cliente in coda/, 'ragazzina'], [/ragazzo|tifoso|spettator/, 'ragazzo'],
    [/anzian|pensionat|vicino|ambulante/, 'anziano'], [/lavandaia|massaia|residente|abitante/, 'signora']
  ];
  const npcPassersby = ['signora', 'ragazzo', 'anziano', 'bambina'];
  function guessNpcSprite(npc, index) {
    const name = (npc.name || '').toLowerCase();
    const rule = npcSpriteRules.find(([pattern]) => pattern.test(name));
    return rule ? rule[1] : npcPassersby[(npc.x + npc.y + index) % npcPassersby.length];
  }

  function initNpcs() {
    trainerSpots = {};
    runtimeNpcs = clone(currentMap.npcs || []).map((item, index) => ({ ...item, sprite: item.sprite || guessNpcSprite(item, index), id: index, originX: item.x, originY: item.y }));
  }

  function visibleRuntimeNpcs() {
    return runtimeNpcs.filter(item => Events.check(item.when, save));
  }

  // Gli NPC stanno fermi (scelta del 14/11/2026: il vagare a scatti di cella in cella stonava).
  // Il campo `movement` nei dati resta, ma non viene più usato.

  // ---------------------------------------------------------------------
  // Interazione (NPC, edifici, allenatori)
  // ---------------------------------------------------------------------

  function interact() {
    // a metà passo A non fa nulla: altrimenti un cambio di mappa partiva con il passo ancora in corso
    if (mode !== 'world' || movement) return;
    const vector = directions[player.direction];
    const x = player.x + vector.x;
    const y = player.y + vector.y;

    const trainer = activeTrainersOnMap().find(t => t.x === x && t.y === y);
    if (trainer) {
      startTrainerEncounter(trainer);
      return;
    }

    // banconi e casse: si parla con chi sta dietro
    const counter = (currentMap.decor || []).find(item => (Tiles.DECOR_KINDS[item.kind] || {}).counter && item.y === y && x >= item.x && x < item.x + (Tiles.DECOR_KINDS[item.kind].span || 1));
    if (counter) {
      const behind = visibleRuntimeNpcs().find(item => item.x === x + vector.x && item.y === y + vector.y);
      if (behind) { playSound('confirm'); runScript(Events.npcScript(behind)); return; }
    }

    // cartelli (arredo con un testo): si leggono
    const sign = (currentMap.decor || []).find(item => item.text && item.x === x && item.y === y);
    if (sign) {
      playSound('confirm');
      runScript([{ say: sign.text }]);
      return;
    }

    const npc = visibleRuntimeNpcs().find(item => item.x === x && item.y === y);
    if (npc) {
      playSound('confirm');
      runScript(Events.npcScript(npc));
      return;
    }

    // la cella-porta vale sia davanti al giocatore sia sotto i suoi piedi (ci si arriva camminandoci sopra)
    const building = (currentMap.buildings || []).find(item => item.door && ((item.door.x === x && item.door.y === y) || (item.door.x === player.x && item.door.y === player.y)));
    if (building) {
      enterBuilding(building);
      return;
    }

    playSound('bump');
  }

  function enterBuilding(building) {
    playSound('confirm');
    // da dove si entra: ci si torna uscendo dagli interni condivisi (bar, tabacchi)
    save.returnSpot = { map: player.map, x: building.door.x, y: building.door.y };
    runScript(buildingScript(building));
  }

  function buildingScript(building) {
    if (building.script) return building.script;
    if (building.interior === 'bar') {
      return [{ say: 'Che te faccio?', name: building.name }, { heal: true }, { say: 'Ecco fatto!', name: building.name }];
    }
    if (building.interior === 'market') {
      return [{ shop: ['ball', 'potion', 'antidote', 'repel', 'grattaevinci'] }];
    }
    if (building.interior === 'gym') {
      return [{ say: 'La palestra è chiusa.' }];
    }
    return [];
  }

  function runScript(script) {
    if (!script || !script.length) return;
    mode = 'dialogue';
    runner.run(script).then(() => {
      if (mode === 'dialogue') closeDialogue();
      autoSave();
    });
  }

  function closeDialogue() {
    stopTyping();
    ui.dialogueScreen.hidden = true;
    ui.dialogueChoices.hidden = true;
    ui.dialogueChoices.innerHTML = '';
    if (mode === 'dialogue') mode = 'world';
  }

  // ---------------------------------------------------------------------
  // Runner eventi: implementazione host
  // ---------------------------------------------------------------------

  let dialogueResolve = null;
  let typing = null;

  function escapeHtml(text) {
    return String(text).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  }

  // Testo a macchina da scrivere: la parte non ancora "battuta" resta nel DOM ma invisibile,
  // così il riquadro non si reimpagina e textContent contiene sempre la frase intera.
  function typeDialogue(text) {
    stopTyping();
    typing = { text, shown: 0, timer: 0 };
    const step = () => {
      if (!typing) return;
      typing.shown = Math.min(text.length, typing.shown + 2);
      ui.dialogueText.innerHTML = `${escapeHtml(text.slice(0, typing.shown))}<span class="untyped">${escapeHtml(text.slice(typing.shown))}</span>`;
      if (typing.shown >= text.length) { stopTyping(); return; }
      typing.timer = setTimeout(step, 28);
    };
    step();
  }

  function stopTyping() {
    if (!typing) return;
    clearTimeout(typing.timer);
    ui.dialogueText.textContent = typing.text;
    typing = null;
  }

  // A / clic: prima completa la frase, poi passa alla successiva.
  function advanceDialogue() {
    if (typing) { stopTyping(); return; }
    if (!dialogueResolve) return;
    const resolve = dialogueResolve;
    dialogueResolve = null;
    resolve();
  }

  const eventHost = {
    get save() { return save; },
    async say(name, text) {
      return new Promise(resolve => {
        ui.dialogueName.textContent = name || '';
        ui.dialogueName.hidden = !name;
        ui.dialogueChoices.hidden = true;
        ui.dialogueChoices.innerHTML = '';
        ui.dialogueClose.hidden = false;
        ui.dialogueScreen.hidden = false;
        typeDialogue(text.replace(/\{player\}/g, save.name || 'Oliver'));
        dialogueResolve = resolve;
      });
    },
    async choice(question, texts) {
      return new Promise(resolve => {
        stopTyping();
        ui.dialogueName.textContent = '';
        ui.dialogueName.hidden = true;
        ui.dialogueClose.hidden = true;
        ui.dialogueText.textContent = question;
        ui.dialogueChoices.innerHTML = '';
        texts.forEach((text, index) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.textContent = text;
          button.addEventListener('click', () => {
            ui.dialogueChoices.hidden = true;
            ui.dialogueChoices.innerHTML = '';
            resolve(index);
          });
          ui.dialogueChoices.appendChild(button);
        });
        ui.dialogueChoices.hidden = false;
        ui.dialogueScreen.hidden = false;
        dialogueResolve = null;
      });
    },
    async heal() {
      save.team.forEach(restoreMonster);
      save.lastHeal = { map: player.map, x: player.x, y: player.y };
      autoSave();
    },
    async shop(itemIds) {
      return openShop(itemIds);
    },
    async battleTrainer(trainerId) {
      return beginTrainerBattle(trainerId);
    },
    async wildBattle(spec) {
      return new Promise(resolve => {
        beginWildBattle(Battle.createMonster(spec.species, spec.level), resolve);
      });
    },
    async warp(dest) {
      movement = null; // un passo rimasto a metà riporterebbe il giocatore alle coordinate della mappa di prima
      player.map = dest.map;
      player.x = dest.x;
      player.y = dest.y;
      player.direction = dest.direction || player.direction;
      player.renderX = player.x;
      player.renderY = player.y;
      currentMap = maps[dest.map];
      fadeInMap();
      initNpcs();
      updateLocation();
      showLocation(currentMap.name);
      autoSave();
    },
    async toast(text) {
      showToast(text);
    },
    async giveMonster(spec) {
      giveMonster(spec);
    }
  };

  const runner = Events.createRunner(eventHost);

  ui.dialogueScreen.addEventListener('click', event => {
    if (event.target.closest('#dialogueChoices')) return;
    advanceDialogue();
  });

  // ---------------------------------------------------------------------
  // Negozio
  // ---------------------------------------------------------------------

  let shopResolve = null;
  let shopCart = {};

  function openShop(itemIds) {
    return new Promise(resolve => {
      shopResolve = resolve;
      shopCart = {};
      renderShop(itemIds);
      ui.shopScreen.hidden = false;
    });
  }

  function renderShop(itemIds) {
    ui.shopMoney.textContent = `${save.money} Talleri`;
    ui.shopList.innerHTML = '';
    itemIds.forEach(itemId => {
      const item = data.items[itemId];
      if (!item) return;
      const row = document.createElement('div');
      row.className = 'shop-row';
      const owned = save.items[itemId] || 0;
      const price = item.price;
      row.innerHTML = `<span>${item.name} ${price != null ? `(${price}₸)` : ''} — hai ${owned}</span>`;
      const buyButton = document.createElement('button');
      buyButton.type = 'button';
      buyButton.textContent = 'Compra';
      buyButton.disabled = price == null || save.money < price;
      buyButton.addEventListener('click', () => {
        if (price == null || save.money < price) return;
        save.money -= price;
        save.items[itemId] = (save.items[itemId] || 0) + 1;
        autoSave();
        renderShop(itemIds);
      });
      const sellButton = document.createElement('button');
      sellButton.type = 'button';
      sellButton.textContent = 'Vendi';
      sellButton.disabled = price == null || owned <= 0;
      sellButton.addEventListener('click', () => {
        if (price == null || owned <= 0) return;
        save.money += Math.floor(price / 2);
        save.items[itemId] = owned - 1;
        autoSave();
        renderShop(itemIds);
      });
      row.appendChild(buyButton);
      row.appendChild(sellButton);
      ui.shopList.appendChild(row);
    });
  }

  ui.shopClose.addEventListener('click', () => {
    ui.shopScreen.hidden = true;
    if (shopResolve) {
      const resolve = shopResolve;
      shopResolve = null;
      resolve();
    }
  });

  // ---------------------------------------------------------------------
  // Titoli di coda
  // ---------------------------------------------------------------------

  let creditsResolve = null;

  function openCredits() {
    return new Promise(resolve => {
      creditsResolve = resolve;
      mode = 'credits';
      ui.creditsScreen.hidden = false;
    });
  }

  function closeCredits() {
    ui.creditsScreen.hidden = true;
    if (mode === 'credits') mode = 'world';
    if (creditsResolve) {
      const resolve = creditsResolve;
      creditsResolve = null;
      resolve();
    }
  }

  ui.creditsClose.addEventListener('click', closeCredits);

  // ---------------------------------------------------------------------
  // Sguardo allenatori
  // ---------------------------------------------------------------------

  function checkTrainerSight() {
    if (approachingTrainerId || !save.team.length) return false;
    for (const trainer of activeTrainersOnMap()) {
      if (save.flags[Events.flagKeys.trainerFlag(trainer.id)]) continue;
      if (trainer.sight <= 0) continue;
      if (!inTrainerLineOfSight(trainer)) continue;
      approachingTrainerId = trainer.id;
      runTrainerApproach(trainer);
      return true;
    }
    return false;
  }

  function inTrainerLineOfSight(trainer) {
    const vector = directions[trainer.direction];
    if (!vector) return false;
    if (vector.x !== 0 && trainer.y !== player.y) return false;
    if (vector.y !== 0 && trainer.x !== player.x) return false;
    const dx = player.x - trainer.x;
    const dy = player.y - trainer.y;
    const dist = vector.x !== 0 ? dx * Math.sign(vector.x) : dy * Math.sign(vector.y);
    if (dist <= 0 || dist > trainer.sight) return false;
    for (let step = 1; step < dist; step += 1) {
      const cx = trainer.x + vector.x * step;
      const cy = trainer.y + vector.y * step;
      if (isBlocked(currentMap, cx, cy, false)) return false;
    }
    return true;
  }

  async function runTrainerApproach(trainer) {
    showExclaim();
    playSound('encounter');
    await new Promise(resolve => setTimeout(resolve, 300));
    await walkTrainerAdjacent(trainer);
    await startTrainerEncounter(trainer);
    approachingTrainerId = null;
  }

  function showExclaim() {
    ui.enemyExclaim.hidden = false;
    setTimeout(() => { ui.enemyExclaim.hidden = true; }, 300);
  }

  // L'allenatore cammina fino alla cella davanti al giocatore, a velocità costante.
  function walkTrainerAdjacent(trainer) {
    return new Promise(resolve => {
      const vector = directions[trainer.direction];
      const cells = Math.abs(player.x - vector.x - trainer.x) + Math.abs(player.y - vector.y - trainer.y);
      if (!cells) { resolve(); return; }
      const fromX = trainer.x, fromY = trainer.y;
      const startedAt = performance.now();
      const tick = now => {
        const walked = Math.min(cells, (now - startedAt) / WALK_MS);
        const renderX = fromX + vector.x * walked, renderY = fromY + vector.y * walked;
        trainerSpots[trainer.id] = { x: Math.round(renderX), y: Math.round(renderY), renderX, renderY };
        if (walked < cells) { requestAnimationFrame(tick); return; }
        resolve();
      };
      requestAnimationFrame(tick);
    });
  }

  async function startTrainerEncounter(trainer) {
    const defeated = !!save.flags[Events.flagKeys.trainerFlag(trainer.id)];
    if (!defeated && !save.team.length) { showToast('Non hai ancora un Pokémon: parla con Bobby al bar.'); return; }
    mode = 'dialogue';
    if (defeated) {
      await runner.run([{ say: trainer.lost, name: trainer.name }]);
      closeDialogue();
      mode = 'world';
      return;
    }
    await runner.run([{ say: trainer.before, name: trainer.name }]);
    const result = await beginTrainerBattle(trainer.id);
    if (result === 'win') {
      save.flags[Events.flagKeys.trainerFlag(trainer.id)] = true;
      const classDef = trainersData.classes[trainer.class] || {};
      const maxLevel = trainer.team.reduce((max, m) => Math.max(max, m.level), 1);
      const reward = trainer.money != null ? trainer.money : Math.floor((classDef.moneyPerLevel || 10) * maxLevel);
      save.money = (save.money || 0) + reward;
      showToast(`Hai vinto ${reward} Talleri!`);
      // beginTrainerBattle/endBattle leave mode = 'world': restore 'dialogue' so Invio/Spazio can
      // dismiss the post-battle text (otherwise only a mouse click on "Continua" works).
      mode = 'dialogue';
      await runner.run([{ say: trainer.after, name: trainer.name }]);
      if (trainer.gym) {
        if (!save.badges.includes(trainer.gym.badge)) {
          save.badges.push(trainer.gym.badge);
          save.badges.sort((a, b) => a - b);
        }
        await runner.run([{ say: `Hai ottenuto la ${trainer.gym.badgeName}!` }]);
        if (trainer.gym.badge === 2 && !save.flags.demo_finita) {
          save.flags.demo_finita = true;
          autoSave();
          await openCredits();
        }
      }
      autoSave();
    }
    closeDialogue();
    mode = 'world';
  }

  // ---------------------------------------------------------------------
  // Battaglia
  // ---------------------------------------------------------------------

  let messageQueue = [];
  let messageResolve = null;
  let battleResolve = null;

  function activeMonster() {
    return save.team[battle.activeIndex];
  }

  function flushMessages() {
    return new Promise(resolve => {
      messageResolve = resolve;
      showNextMessage();
    });
  }

  function showNextMessage() {
    if (!messageQueue.length) {
      const resolve = messageResolve;
      messageResolve = null;
      if (resolve) resolve();
      return;
    }
    ui.battleMessage.textContent = messageQueue.shift();
    renderBattle();
    setTimeout(() => { if (messageResolve) showNextMessage(); }, 700);
  }

  function advanceMessage() {
    if (!messageResolve) return;
    showNextMessage();
  }

  ui.battleMessage.addEventListener('click', advanceMessage);

  function beginWildBattle(wild, onEnd) {
    const activeIndex = Math.max(0, save.team.findIndex(monster => monster.hp > 0));
    battle = {
      kind: 'wild',
      wild,
      trainer: null,
      enemyTeam: [wild],
      enemyIndex: 0,
      activeIndex,
      participants: new Set([activeIndex]),
      playerStages: Battle.freshStages(),
      enemyStages: Battle.freshStages(),
      runAttempts: 0,
      onEnd
    };
    save.dex.seen[wild.species] = true;
    mode = 'battle';
    updateMusicTheme();
    ui.battleScreen.hidden = false;
    ui.battleMessage.textContent = `È apparso ${data.species[wild.species].name} selvatico!`;
    renderBattle();
    showBattleMain();
    sendOutAlly(550);
    playSound('encounter');
    autoSave();
  }

  function beginTrainerBattle(trainerId) {
    return new Promise(resolve => {
      const trainer = trainersData.trainers[trainerId];
      const enemyTeam = trainer.team.map(entry => Battle.createMonster(entry.species, entry.level, entry.moves ? { moves: entry.moves } : {}));
      const activeIndex = Math.max(0, save.team.findIndex(monster => monster.hp > 0));
      battle = {
        kind: 'trainer',
        trainerId,
        trainer,
        wild: enemyTeam[0],
        enemyTeam,
        enemyIndex: 0,
        activeIndex,
        participants: new Set([activeIndex]),
        playerStages: Battle.freshStages(),
        enemyStages: Battle.freshStages(),
        runAttempts: 0,
        onEnd: resolve
      };
      mode = 'battle';
      updateMusicTheme();
      ui.battleScreen.hidden = false;
      ui.battleMessage.textContent = `${trainer.name} ti sfida a duello!`;
      renderBattle();
      showBattleMain();
      sendOutAlly(550);
      playSound('encounter');
    });
  }

  function statusText(monster) {
    return monster.status && statusLabels[monster.status] ? statusLabels[monster.status] : '';
  }

  function setHpBar(element, monster, hp = monster.hp) {
    const ratio = Math.max(0, hp / monster.stats.hp);
    element.style.width = `${ratio * 100}%`;
    element.className = ratio > .5 ? 'hp-high' : ratio > .2 ? 'hp-mid' : 'hp-low';
  }

  function renderBattle() {
    if (!battle) return;
    const ally = activeMonster();
    const enemy = battle.wild;
    const allySpecies = data.species[ally.species];
    const enemySpecies = data.species[enemy.species];
    ui.allyName.textContent = allySpecies.name;
    ui.allyLevel.textContent = `Lv.${ally.level}`;
    ui.allyStatus.textContent = statusText(ally);
    ui.enemyName.textContent = enemySpecies.name;
    ui.enemyLevel.textContent = `Lv.${enemy.level}`;
    ui.enemyStatus.textContent = statusText(enemy);
    // durante un turno `battle.shown` tiene i PS mostrati: scendono quando il colpo si vede, non prima
    const shown = battle.shown || { ally: ally.hp, enemy: enemy.hp };
    setHpBar(ui.allyHp, ally, shown.ally);
    setHpBar(ui.enemyHp, enemy, shown.enemy);
    const floor = Math.pow(ally.level, 3);
    ui.allyExp.style.width = `${Math.max(0, Math.min(100, ((ally.exp || 0) - floor) / (Battle.expToNext(ally) - floor) * 100))}%`;
    ui.allyHpText.textContent = `${Math.max(0, shown.ally)} / ${ally.stats.hp} PS`;
    ui.allySprite.src = `assets/battle/${ally.species}-back.png`;
    ui.allySprite.alt = allySpecies.name;
    ui.enemySprite.src = `assets/battle/${enemy.species}-front.png`;
    ui.enemySprite.alt = enemySpecies.name;
  }

  function actionButton(label, action, disabled) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    if (disabled) button.disabled = true;
    button.addEventListener('click', action);
    return button;
  }

  function showBattleMain() {
    ui.battleActions.innerHTML = '';
    ui.battleActions.className = 'battle-actions main';
    const canRunAway = battle.kind === 'wild';
    ui.battleActions.append(
      actionButton('Lotta', showBattleMoves),
      actionButton('Borsa', showBattleBag),
      actionButton('Squadra', showBattleTeam),
      actionButton('Fuga', canRunAway ? tryRun : () => { showToast('Non puoi fuggire da una sfida!'); }, !canRunAway)
    );
  }

  // «Indietro» da tastiera: vale solo se sullo schermo c'è un sottomenu con il suo «Indietro».
  // Durante un turno o una scelta obbligata non deve far ricomparire il menu principale.
  function battleBack() {
    if (!ui.menuScreen.hidden) { closeBattleInfo(); return; }
    const back = [...ui.battleActions.querySelectorAll('button')].find(button => button.textContent === 'Indietro');
    if (back) back.click();
  }

  function showBattleMoves() {
    ui.battleActions.innerHTML = '';
    ui.battleActions.className = 'battle-actions wide';
    const mon = activeMonster();
    const usable = mon.moves.some(slot => slot.pp > 0);
    if (!usable) {
      ui.battleActions.appendChild(actionButton('Lotta Disperata', () => playerAttack('struggle')));
      ui.battleActions.appendChild(actionButton('Indietro', showBattleMain));
      return;
    }
    mon.moves.forEach(slot => {
      const known = data.moves[slot.id];
      const button = actionButton('', () => playerAttack(slot.id), slot.pp <= 0);
      button.innerHTML = `<b>${known.name}</b><small>${typeChip(known.type)} PP ${slot.pp}/${slot.maxPp}</small>`;
      button.title = known.description || '';
      // passando sopra la mossa (o con il fuoco da tastiera) il riquadro dei messaggi la descrive
      const describe = () => { ui.battleMessage.textContent = `${known.category} · Pot. ${known.power || '—'} · Prec. ${known.accuracy || '—'}${known.description ? ` — ${known.description}` : ''}`; };
      button.addEventListener('mouseenter', describe);
      button.addEventListener('focus', describe);
      ui.battleActions.appendChild(button);
    });
    ui.battleActions.appendChild(actionButton('Indietro', showBattleMain));
  }

  function showBattleBag() {
    ui.battleActions.innerHTML = '';
    ui.battleActions.className = 'battle-actions wide';
    ui.battleActions.append(
      actionButton(`Ball ×${save.items.ball || 0}`, throwBall, battle.kind === 'trainer'),
      actionButton(`Pozione ×${save.items.potion || 0}`, useBattlePotion),
      actionButton(`Antidoto ×${save.items.antidote || 0}`, useBattleAntidote),
      actionButton('Indietro', showBattleMain)
    );
  }

  // `replacing`: il Pokémon in campo è esausto, va scelto il sostituto (niente «Indietro»).
  function showBattleTeam(replacing) {
    ui.battleActions.innerHTML = '';
    ui.battleActions.className = 'battle-actions wide';
    save.team.forEach((monster, index) => {
      const name = data.species[monster.species].name;
      const button = actionButton('', () => (replacing === true ? sendReplacement(index) : switchMonster(index)));
      button.innerHTML = `<b>${name}</b><small>Lv.${monster.level} · PS ${Math.max(0, monster.hp)}/${monster.stats.hp}</small>`;
      button.disabled = index === battle.activeIndex || monster.hp <= 0;
      ui.battleActions.appendChild(button);
    });
    // tasto destro (o pressione lunga) su un Pokémon: la sua scheda; altrimenti il bottone Info del primo in campo
    ui.battleActions.querySelectorAll('button').forEach((button, index) => button.addEventListener('contextmenu', event => { event.preventDefault(); openBattleInfo(index); }));
    ui.battleActions.appendChild(actionButton('Schede', () => showBattleInfoList(replacing)));
    if (replacing !== true) ui.battleActions.appendChild(actionButton('Indietro', showBattleMain));
  }

  // Lista della squadra per leggere le schede senza cambiare Pokémon.
  function showBattleInfoList(replacing) {
    ui.battleActions.innerHTML = '';
    ui.battleActions.className = 'battle-actions wide';
    save.team.forEach((monster, index) => {
      const button = actionButton('', () => openBattleInfo(index));
      button.innerHTML = `<b>${data.species[monster.species].name}</b><small>Leggi la scheda</small>`;
      ui.battleActions.appendChild(button);
    });
    ui.battleActions.appendChild(actionButton('Indietro', () => showBattleTeam(replacing)));
  }

  async function resolveTurn(playerAction) {
    ui.battleActions.innerHTML = '';
    const enemyAction = { type: 'move', moveId: Battle.chooseMove(battle.wild, activeMonster()) || 'struggle' };
    const order = Battle.turnOrder(
      { monster: activeMonster(), stages: battle.playerStages }, playerAction,
      { monster: battle.wild, stages: battle.enemyStages }, enemyAction,
      Math.random
    );

    const fight = battle;
    battle.shown = { ally: activeMonster().hp, enemy: battle.wild.hp };
    for (const who of order) {
      if (who === 'player' && playerAction.type !== 'move') continue;
      if (activeMonster().hp <= 0 || battle.wild.hp <= 0) continue;
      const result = who === 'player'
        ? Battle.executeMove(activeMonster(), battle.wild, playerAction.moveId, battle.playerStages, battle.enemyStages, { rng: Math.random })
        : Battle.executeMove(battle.wild, activeMonster(), enemyAction.moveId, battle.enemyStages, battle.playerStages, { rng: Math.random });
      const outcome = await playEvents(result.events, who);
      if (battle !== fight) return;       // la lotta è finita (fuga, Boato su un selvatico)
      if (await checkFaints()) return;
      if (outcome === 'cut') break;        // è entrato un altro Pokémon: il turno finisce qui
    }

    await playEvents(Battle.endOfTurn(activeMonster()), 'player');
    await playEvents(Battle.endOfTurn(battle.wild), 'enemy');
    battle.shown = null;
    autoSave();
    if (await checkFaints()) return;
    renderBattle();
    showBattleMain();
  }

  // Colpo: chi attacca scatta verso l'avversario, chi lo prende lampeggia. `side`: 1 = attacca il giocatore.
  // Animazioni fatte da codice (Web Animations) per non interferire con le classi CSS degli sprite.
  function animateHit(attacker, target, side) {
    if (!attacker.animate) return;
    attacker.animate([{ transform: 'translate(0, 0)' }, { transform: `translate(${18 * side}%, ${-12 * side}%)` }, { transform: 'translate(0, 0)' }], { duration: 220 });
    target.animate([{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }, { opacity: 0 }, { opacity: 1 }], { duration: 420, delay: 160 });
  }

  // KO: lo sprite scivola giù e sparisce. Resta nascosto finché `reviveSprite` non lo libera.
  function faintSprite(sprite) {
    if (!sprite.animate) return;
    reviveSprite(sprite);
    sprite.faintAnimation = sprite.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(45%)', opacity: 0 }], { duration: 450, fill: 'forwards' });
  }

  function reviveSprite(sprite) {
    if (sprite.faintAnimation) sprite.faintAnimation.cancel();
    sprite.faintAnimation = null;
  }

  // Racconta gli eventi di una mossa uno alla volta: messaggi, colpi (la barra scende quando il colpo
  // si vede), stati con la loro animazione. `side`: chi ha agito ('player' o 'enemy').
  // Restituisce 'cut' se il turno va interrotto (cambio forzato).
  async function playEvents(events, side) {
    const fight = battle;
    const own = side === 'player' ? 'ally' : 'enemy';
    const other = side === 'player' ? 'enemy' : 'ally';
    const sprites = { ally: ui.allySprite, enemy: ui.enemySprite };
    const slotOf = target => (target === 'defender' ? other : own);
    for (const event of events) {
      if (battle !== fight) return null;
      if (event.type === 'damage') {
        const hit = slotOf(event.target);
        playSound('hit');
        if (event.target === 'defender') animateHit(sprites[own], sprites[hit], side === 'player' ? 1 : -1);
        else if (event.cause) statusFx(sprites[hit], event.cause);
        else if (sprites[hit].animate) sprites[hit].animate([{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }, { opacity: 0 }, { opacity: 1 }], { duration: 420 });
        await sleep(380);
        if (battle.shown && event.hp !== undefined) battle.shown[hit] = event.hp;
        renderBattle();
        await sleep(450);
      } else if (event.type === 'hp') {
        if (battle.shown) battle.shown[slotOf(event.target)] = event.hp;
        renderBattle();
        await sleep(450);
      } else if (event.type === 'text' || event.type === 'status') {
        const fx = event.type === 'status' ? event.status : event.anim;
        if (fx) statusFx(sprites[slotOf(event.who || 'defender')], fx);
        messageQueue.push(event.text);
        await flushMessages();
      } else if (event.type === 'flee' || event.type === 'forceSwitch') {
        if (await escapeEvent(event, side) === 'cut') return 'cut';
      }
    }
    return null;
  }

  async function say(text, ms = 800) {
    ui.battleMessage.textContent = text;
    await sleep(ms);
  }

  // Teletrasporto e Boato. In una lotta selvatica chiudono l'incontro; contro un allenatore Boato
  // trascina in campo un altro Pokémon a caso (se c'è), Teletrasporto non fa nulla.
  async function escapeEvent(event, side) {
    const userName = data.species[(side === 'player' ? activeMonster() : battle.wild).species].name;
    const targetIsPlayer = side === 'enemy';
    if (event.type === 'flee' || battle.kind === 'wild') {
      if (battle.kind !== 'wild') { await say('Ma non ha effetto!'); return null; }
      const others = save.team.some((monster, index) => index !== battle.activeIndex && monster.hp > 0);
      if (event.type === 'forceSwitch' && targetIsPlayer && others) return dragIn(true);
      await say(event.type === 'flee' ? `${userName} fugge dalla lotta!` : `${userName} mette in fuga l'avversario!`);
      endBattle('fled');
      return null;
    }
    return dragIn(targetIsPlayer);
  }

  // Boato: esce chi è in campo ed entra un compagno a caso fra quelli in piedi.
  async function dragIn(playerSide) {
    if (playerSide) {
      const choices = save.team.map((monster, index) => index).filter(index => index !== battle.activeIndex && save.team[index].hp > 0);
      if (!choices.length) { await say('Ma non ha effetto!'); return null; }
      Battle.clearVolatile(activeMonster());
      battle.activeIndex = choices[Math.floor(Math.random() * choices.length)];
      battle.participants.add(battle.activeIndex);
      battle.playerStages = Battle.freshStages();
      battle.shown.ally = activeMonster().hp;
    } else {
      const choices = battle.enemyTeam.map((monster, index) => index).filter(index => index > battle.enemyIndex && battle.enemyTeam[index].hp > 0);
      if (!choices.length) { await say('Ma non ha effetto!'); return null; }
      const pick = choices[Math.floor(Math.random() * choices.length)];
      [battle.enemyTeam[battle.enemyIndex], battle.enemyTeam[pick]] = [battle.enemyTeam[pick], battle.enemyTeam[battle.enemyIndex]];
      battle.wild = battle.enemyTeam[battle.enemyIndex];
      battle.enemyStages = Battle.freshStages();
      battle.participants = new Set([battle.activeIndex]);
      save.dex.seen[battle.wild.species] = true;
      battle.shown.enemy = battle.wild.hp;
    }
    renderBattle();
    await say(`${data.species[(playerSide ? activeMonster() : battle.wild).species].name} è trascinato in campo!`, 1000);
    return 'cut';
  }

  // Animazione di uno stato sullo sprite: una tinta che pulsa, più un segno che sale (Z, ?, bolle, scintille).
  const STATUS_FX = {
    psn: { tint: 'sepia(1) saturate(6) hue-rotate(225deg)', mark: 'dot', color: '#a050c8' },
    brn: { tint: 'sepia(1) saturate(7) hue-rotate(-28deg) brightness(1.1)', mark: 'dot', color: '#f08030' },
    par: { tint: 'sepia(1) saturate(8) hue-rotate(8deg) brightness(1.4)', mark: 'spark', color: '#f8d030', jitter: true },
    frz: { tint: 'saturate(.4) brightness(1.5) hue-rotate(160deg)', mark: 'spark', color: '#98d8f8' },
    slp: { tint: 'brightness(.75)', mark: 'Z', color: '#fbfaf2' },
    cnf: { tint: 'none', mark: '?', color: '#f8d030', sway: true }
  };

  function statusFx(sprite, status) {
    const fx = STATUS_FX[status];
    if (!fx || !sprite.animate) return;
    const move = fx.jitter ? ['-5%', '5%', '-5%', '5%'] : fx.sway ? ['-8%', '8%', '-8%', '8%'] : ['0', '0', '0', '0'];
    sprite.animate([
      { filter: 'none', transform: 'translateX(0)' },
      ...move.map(x => ({ filter: fx.tint, transform: `translateX(${x})` })),
      { filter: 'none', transform: 'translateX(0)' }
    ], { duration: fx.jitter ? 450 : 750 });
    for (let i = 0; i < 3; i += 1) {
      const mark = document.createElement('span');
      mark.className = `status-mark ${fx.mark.length === 1 ? 'letter' : fx.mark}`;
      if (fx.mark.length === 1) mark.textContent = fx.mark;
      mark.style.color = fx.color;
      mark.style.left = `${sprite.offsetLeft + sprite.offsetWidth * (.3 + i * .2)}px`;
      mark.style.top = `${sprite.offsetTop + sprite.offsetHeight * .35}px`;
      sprite.parentElement.appendChild(mark);
      mark.animate([{ transform: 'translateY(0)', opacity: 0 }, { opacity: 1, offset: .2 }, { transform: 'translateY(-160%)', opacity: 0 }], { duration: 800, delay: i * 140, fill: 'both' })
        .onfinish = () => mark.remove();
    }
  }

  async function checkFaints() {
    if (battle.wild.hp <= 0) {
      await handleEnemyFaint();
      return true;
    }
    if (activeMonster().hp <= 0) {
      await handleFaintedAlly();
      return true;
    }
    return false;
  }

  async function handleEnemyFaint() {
    // L'esperienza va a tutti i Pokémon ancora in piedi che sono scesi in campo contro questo
    // avversario, divisa in parti uguali (come nei giochi di terza generazione).
    battle.shown = null;
    const active = activeMonster();
    const sharers = [...battle.participants].map(index => save.team[index]).filter(monster => monster && monster.hp > 0);
    if (!sharers.includes(active) && active.hp > 0) sharers.push(active);
    const gain = Battle.expGain(battle.wild, { trainer: battle.kind === 'trainer', participants: Math.max(1, sharers.length) });
    playSound('faint');
    ui.battleMessage.textContent = `${data.species[battle.wild.species].name} è esausto!`;
    renderBattle();
    faintSprite(ui.enemySprite);
    await sleep(600);
    for (const monster of [active, ...sharers.filter(other => other !== active)]) {
      if (!sharers.includes(monster)) continue;
      const name = () => data.species[monster.species].name;
      ui.battleMessage.textContent = `${name()} ottiene ${gain} ESP.`;
      const gainResult = Battle.gainExperience(monster, gain, evolutionContext({ defeated: battle.wild.species }));
      playSound('exp');
      if (monster === active) {
        // la barra si riempie sotto gli occhi: fino in fondo se si sale di livello, poi riparte
        if (gainResult.levelsGained > 0) {
          ui.allyExp.style.width = '100%';
          await sleep(550);
          ui.allyExp.style.transition = 'none';
          ui.allyExp.style.width = '0%';
          void ui.allyExp.offsetWidth;
          ui.allyExp.style.transition = '';
        }
        renderBattle();
      }
      await sleep(550);
      if (gainResult.levelsGained > 0) {
        playSound('levelup');
        ui.battleMessage.textContent = `${name()} è salito al livello ${monster.level}!`;
        renderBattle();
        await sleep(700);
      }
      if (gainResult.evolvedInto) {
        save.dex.seen[gainResult.evolvedInto] = true;
        save.dex.caught[gainResult.evolvedInto] = true;
        ui.battleMessage.textContent = `Evoluzione: ora è ${data.species[gainResult.evolvedInto].name}!`;
        renderBattle();
        await sleep(700);
      }
      for (const moveId of gainResult.autoLearned) {
        playSound('levelup');
        ui.battleMessage.textContent = `${name()} ha imparato ${data.moves[moveId].name}!`;
        await sleep(1100);
      }
      for (const moveId of gainResult.learned) {
        ui.battleMessage.textContent = await handleLevelUpLearn(monster, moveId);
        await sleep(1300);
      }
    }
    battle.participants = new Set([battle.activeIndex]); // contro il prossimo avversario si riparte da chi è in campo
    autoSave();

    battle.enemyIndex += 1;
    if (battle.kind === 'trainer' && battle.enemyIndex < battle.enemyTeam.length) {
      battle.wild = battle.enemyTeam[battle.enemyIndex];
      battle.enemyStages = Battle.freshStages();
      reviveSprite(ui.enemySprite);
      ui.battleMessage.textContent = `${battle.trainer.name} manda in campo ${data.species[battle.wild.species].name}!`;
      renderBattle();
      showBattleMain();
      return;
    }
    endBattle(battle.kind === 'trainer' ? 'win' : 'won');
  }

  function handleLevelUpLearn(monster, moveId) {
    return new Promise(resolve => {
      const known = data.moves[moveId];
      // per scegliere servono i dati: tipo, categoria, potenza e PP della mossa nuova e delle quattro attuali
      const facts = move => `${move.type} · ${move.category} · Pot. ${move.power || '—'} · PP ${move.pp}`;
      ui.learnMoveText.textContent = `${data.species[monster.species].name} vuole imparare ${known.name} (${facts(known)}), ma conosce già 4 mosse. Quale mossa dimenticare?`;
      ui.learnMoveChoices.innerHTML = '';
      monster.moves.forEach((slot, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = `${data.moves[slot.id].name} — ${facts(data.moves[slot.id])}`;
        button.addEventListener('click', () => {
          Battle.learnMove(monster, moveId, index);
          ui.learnMoveScreen.hidden = true;
          playSound('levelup');
          resolve(`${data.species[monster.species].name} ha dimenticato ${data.moves[slot.id].name} e ha imparato ${known.name}!`);
        });
        ui.learnMoveChoices.appendChild(button);
      });
      const giveUp = document.createElement('button');
      giveUp.type = 'button';
      giveUp.textContent = 'Rinuncia';
      giveUp.addEventListener('click', () => {
        ui.learnMoveScreen.hidden = true;
        resolve(`${data.species[monster.species].name} non ha imparato ${known.name}.`);
      });
      ui.learnMoveChoices.appendChild(giveUp);
      ui.learnMoveScreen.hidden = false;
    });
  }

  async function handleFaintedAlly() {
    battle.shown = null;
    playSound('faint');
    ui.battleMessage.textContent = `${data.species[activeMonster().species].name} non può più combattere!`;
    renderBattle();
    faintSprite(ui.allySprite);
    await sleep(700);
    const next = save.team.findIndex(monster => monster.hp > 0);
    if (next === -1) {
      await sleep(300);
      handleWipe();
      return;
    }
    ui.allySprite.classList.add('unsent');
    reviveSprite(ui.allySprite);
    ui.battleMessage.textContent = 'Chi mandi in campo?';
    showBattleTeam(true);
  }

  // Entra il sostituto scelto dopo un KO: non costa il turno.
  function sendReplacement(index) {
    battle.activeIndex = index;
    battle.participants.add(index);
    battle.playerStages = Battle.freshStages();
    ui.battleMessage.textContent = `Vai, ${data.species[activeMonster().species].name}!`;
    renderBattle();
    showBattleMain();
    sendOutAlly();
  }

  function playerAttack(moveId) {
    if (!battle) return;
    resolveTurn({ type: 'move', moveId });
  }

  function resetBall() {
    ui.battleBall.hidden = true;
    ui.battleBall.className = 'battle-ball';
    ui.enemySprite.classList.remove('absorbed');
    ui.allySprite.classList.remove('unsent');
  }

  // Il proprio Pokémon entra in campo: la Ball vola da sinistra, si apre e lui compare.
  // `wait`: a inizio lotta si aspetta la fine del lampo d'ingresso, che copre tutto lo schermo.
  async function sendOutAlly(wait = 0) {
    const ball = ui.battleBall;
    const fight = battle;
    ui.allySprite.classList.add('unsent');
    if (wait) await sleep(wait);
    if (battle !== fight) return;
    ball.hidden = false;
    ball.className = 'battle-ball sending';
    playSound('throw');
    await sleep(700);
    if (!battle || ball.className !== 'battle-ball sending') return;
    ball.className = 'battle-ball opening-ally';
    ui.allySprite.classList.remove('unsent');
    await sleep(260);
    if (ball.className === 'battle-ball opening-ally') { ball.hidden = true; ball.className = 'battle-ball'; }
  }

  function throwBall() {
    if (battle.kind === 'trainer') return;
    if (!save.items.ball || save.items.ball <= 0) {
      ui.battleMessage.textContent = 'Non hai più Ball.';
      showBattleMain();
      return;
    }
    ui.battleActions.innerHTML = '';
    save.items.ball -= 1;
    const wild = battle.wild;
    const species = data.species[wild.species];
    playSound('throw');
    const attempt = Battle.attemptCatch(wild, 'ball', Math.random);
    (async () => {
      ui.battleMessage.textContent = `Hai lanciato una Ball...`;
      renderBattle();
      const ball = ui.battleBall;
      const stage = async (name, ms) => { ball.className = `battle-ball ${name}`; await sleep(ms); };
      ball.hidden = false;
      await stage('throwing', 560);              // arco verso l'avversario
      ui.enemySprite.classList.add('absorbed');   // il Pokémon rientra nella Ball
      playSound('hit');
      await sleep(300);
      await stage('dropping', 300);               // la Ball cade sulla pedana
      for (let i = 0; i < attempt.shakes; i += 1) {
        ui.battleMessage.textContent = '...scrosh...';
        playSound('bump');
        await stage('shaking', 460);
        await stage('', 240);
      }
      if (attempt.caught) {
        ball.className = 'battle-ball locked';
        playSound('caught');
        save.dex.caught[wild.species] = true;
        const destination = save.team.length < 6 ? save.team : save.storage;
        destination.push(wild);
        ui.battleMessage.textContent = `${species.name} è stato catturato!${destination === save.storage ? ' È stato inviato al Deposito.' : ''}`;
        renderBattle();
        autoSave();
        await sleep(650);
        endBattle('caught');
        return;
      }
      ui.battleMessage.textContent = `${species.name} si è liberato dalla Ball!`;
      ui.enemySprite.classList.remove('absorbed');
      await stage('opening', 260);
      resetBall();
      renderBattle();
      await sleep(400);
      await resolveTurn({ type: 'item' });
    })();
  }

  function useBattlePotion() {
    const ally = activeMonster();
    if (!save.items.potion || save.items.potion <= 0) {
      ui.battleMessage.textContent = 'Non hai Pozioni.';
      showBattleMain();
      return;
    }
    if (ally.hp >= ally.stats.hp) {
      ui.battleMessage.textContent = 'I PS sono già al massimo.';
      showBattleMain();
      return;
    }
    save.items.potion -= 1;
    ally.hp = Math.min(ally.stats.hp, ally.hp + 20);
    ui.battleMessage.textContent = `${data.species[ally.species].name} recupera PS.`;
    renderBattle();
    playSound('heal');
    resolveTurn({ type: 'item' });
  }

  function useBattleAntidote() {
    const ally = activeMonster();
    if (!save.items.antidote || save.items.antidote <= 0) {
      ui.battleMessage.textContent = 'Non hai Antidoti.';
      showBattleMain();
      return;
    }
    if (ally.status !== 'psn') {
      ui.battleMessage.textContent = 'Non è avvelenato.';
      showBattleMain();
      return;
    }
    save.items.antidote -= 1;
    ally.status = null;
    ui.battleMessage.textContent = `${data.species[ally.species].name} non è più avvelenato.`;
    renderBattle();
    playSound('heal');
    resolveTurn({ type: 'item' });
  }

  // Cambio scelto dal giocatore: rientra uno, entra l'altro e solo a quel punto l'avversario fa la sua mossa.
  async function switchMonster(index) {
    if (!battle || index === battle.activeIndex || save.team[index].hp <= 0) return;
    const fight = battle;
    ui.battleActions.innerHTML = '';
    ui.battleMessage.textContent = `${data.species[activeMonster().species].name}, rientra!`;
    ui.allySprite.classList.add('unsent');
    await sleep(800);
    if (battle !== fight) return;
    Battle.clearVolatile(activeMonster());
    battle.activeIndex = index;
    battle.participants.add(index);
    battle.playerStages = Battle.freshStages();
    ui.battleMessage.textContent = `Vai, ${data.species[activeMonster().species].name}!`;
    renderBattle();
    await sendOutAlly();
    await sleep(500);
    if (battle !== fight) return;
    resolveTurn({ type: 'switch' });
  }

  function tryRun() {
    if (battle.kind === 'trainer') { showToast('Non puoi fuggire da una sfida!'); return; }
    battle.runAttempts += 1;
    if (Battle.canRun(activeMonster(), battle.wild, battle.runAttempts, Math.random)) {
      endBattle('fled');
      return;
    }
    ui.battleMessage.textContent = 'Non riesci a fuggire!';
    renderBattle();
    resolveTurn({ type: 'run' });
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function endBattle(result) {
    const onEnd = battle ? battle.onEnd : null;
    battle = null;
    save.team.forEach(Battle.clearVolatile);
    ui.battleScreen.hidden = true;
    reviveSprite(ui.enemySprite);
    reviveSprite(ui.allySprite);
    resetBall();
    mode = 'world';
    updateMusicTheme();
    const messages = { won: 'Vittoria!', win: 'Vittoria!', caught: null, fled: 'Sei fuggito.', lost: 'Sei stato sconfitto.' };
    if (messages[result]) showToast(messages[result]);
    if (result === 'won' || result === 'win') playSound('win');
    if (result === 'lost') playSound('lose');
    autoSave();
    if (onEnd) onEnd(result);
  }

  function handleWipe() {
    save.team.forEach(restoreMonster);
    if (battle && battle.kind === 'trainer') {
      save.money = Math.floor((save.money || 0) / 2);
      showToast('Hai perso metà dei tuoi Talleri.');
    }
    movement = null;
    let destination = save.lastHeal || data.respawn;
    if (!maps[destination.map] || isBlocked(maps[destination.map], destination.x, destination.y, true)) destination = data.respawn;
    player = { map: destination.map, x: destination.x, y: destination.y, direction: 'down', renderX: destination.x, renderY: destination.y, frame: 0 };
    currentMap = maps[player.map];
    initNpcs();
    endBattle('lost');
    updateLocation();
    showLocation(currentMap.name);
    showToast('La tua squadra è stata curata.');
    autoSave();
  }

  // ---------------------------------------------------------------------
  // Menu
  // ---------------------------------------------------------------------

  // Il menu di pausa è una lista sulla destra, col mondo che resta visibile dietro; la voce scelta
  // apre la sua pagina a tutto schermo e «Indietro» (o B/Esc) riporta alla lista.
  function openMenu() {
    if (mode !== 'world') return;
    mode = 'menu';
    ui.menuScreen.hidden = false;
    ui.menuTabs.querySelector('[data-tab="trainer"]').textContent = save.name || 'Oliver';
    showMenuList();
    playSound('confirm');
  }

  function showMenuList(tab) {
    ui.menuScreen.dataset.view = 'list';
    (ui.menuTabs.querySelector(`[data-tab="${tab}"]`) || ui.menuTabs.querySelector('button')).focus();
  }

  function closeMenu() {
    if (mode !== 'menu') return;
    ui.menuScreen.hidden = true;
    mode = 'world';
  }

  function menuBack() {
    if (mode === 'battle') { closeBattleInfo(); return; }
    if (mode !== 'menu') return;
    if (ui.menuScreen.dataset.view === 'page') showMenuList(ui.menuScreen.dataset.tab);
    else closeMenu();
  }

  // Frecce nel menu: su/giù scorrono la lista, sinistra/destra cambiano tasca nella Borsa.
  function menuArrow(direction) {
    if (ui.menuScreen.dataset.view === 'list') {
      const entries = [...ui.menuTabs.querySelectorAll('button')];
      const step = direction === 'up' ? -1 : direction === 'down' ? 1 : 0;
      if (step) entries[(Math.max(0, entries.indexOf(document.activeElement)) + step + entries.length) % entries.length].focus();
    } else if (ui.menuScreen.dataset.tab === 'bag' && (direction === 'left' || direction === 'right')) {
      changeBagPocket(direction === 'left' ? -1 : 1);
    }
  }

  function renderMenu(tab) {
    partyOrder = null;
    ui.menuScreen.dataset.view = 'page';
    ui.menuScreen.dataset.tab = tab;
    if (tab === 'team') renderTeamMenu();
    if (tab === 'bag') renderBagMenu();
    if (tab === 'dex') renderDexMenu();
    if (tab === 'trainer') renderTrainerMenu();
    if (tab === 'map') renderMapMenu();
    if (tab === 'deposit') renderDepositMenu();
    if (tab === 'save') renderSaveMenu();
    if (tab === 'settings') renderSettingsMenu();
  }

  // Schermata Squadra: il primo Pokémon nel riquadro grande a sinistra, gli altri in colonna a destra.
  // `partyOrder`: null = si guarda la scheda; 'pick' = va scelto chi spostare; un numero = scelto, manca con chi.
  let partyOrder = null;

  function partySlot(monster, index) {
    if (!monster) return '<div class="party-slot empty"></div>';
    const species = data.species[monster.species];
    const ratio = Math.max(0, monster.hp / monster.stats.hp);
    const hpClass = ratio > .5 ? 'hp-high' : ratio > .2 ? 'hp-mid' : 'hp-low';
    const status = monster.hp <= 0 ? 'KO' : statusText(monster);
    const action = partyOrder === null ? `data-summary="team:${index}:team"` : `data-swap="${index}"`;
    return `<div class="party-slot${index === 0 ? ' lead' : ''}${monster.hp <= 0 ? ' fainted' : ''}${partyOrder === index ? ' picked' : ''}" ${action}>
      <img src="assets/battle/${monster.species}-front.png" alt="" onerror="this.style.visibility='hidden'">
      <div class="party-name"><strong>${species.name}</strong><span>Lv.${monster.level}</span>${status ? `<span class="status-badge">${status}</span>` : ''}</div>
      <div class="hp-row"><b>PS</b><div class="hp-track"><i class="${hpClass}" style="width:${ratio * 100}%"></i></div></div>
      <small>${Math.max(0, monster.hp)}/${monster.stats.hp}</small></div>`;
  }

  function renderTeamMenu() {
    const others = Array.from({ length: 5 }, (_, i) => partySlot(save.team[i + 1], i + 1)).join('');
    const hint = partyOrder === null ? 'Scegli un Pokémon per vederne la scheda.'
      : partyOrder === 'pick' ? 'Ordina: scegli il Pokémon da spostare.'
        : `Ordina: con chi scambi ${data.species[save.team[partyOrder].species].name}? Il primo riquadro scende in campo per primo.`;
    ui.menuContent.innerHTML = `<div class="party-screen">${partySlot(save.team[0], 0)}<div class="party-list">${others}</div>
      <p class="party-hint"><span>${hint}</span><button id="partyOrder" class="pill"${save.team.length < 2 ? ' disabled' : ''}>${partyOrder === null ? 'Ordina' : 'Annulla'}</button></p></div>`;
    document.getElementById('partyOrder').addEventListener('click', () => { partyOrder = partyOrder === null ? 'pick' : null; renderTeamMenu(); });
    ui.menuContent.querySelectorAll('[data-swap]').forEach(slot => slot.addEventListener('click', () => {
      const index = Number(slot.dataset.swap);
      if (partyOrder === 'pick') partyOrder = index;
      else {
        if (index !== partyOrder) {
          [save.team[partyOrder], save.team[index]] = [save.team[index], save.team[partyOrder]];
          autoSave();
          playSound('confirm');
        }
        partyOrder = null;
      }
      renderTeamMenu();
    }));
  }

  // Scheda del singolo Pokémon: si apre cliccando una riga di Squadra o Deposito.
  const typeColors = {
    Normale: '#9a9a79', Fuoco: '#e0702c', Acqua: '#4f84d9', Erba: '#5fa84a', Elettro: '#d9b020', Ghiaccio: '#6fbfc0',
    Lotta: '#b03a32', Veleno: '#93408f', Terra: '#c9a850', Volante: '#8f7fd9', Psico: '#e0507c', Coleottero: '#96a520',
    Roccia: '#a8903a', Spettro: '#65528a', Drago: '#6338e0', Buio: '#65503f', Acciaio: '#9a9ab8', Folletto: '#d98fa8'
  };
  const statRows = [['hp', 'PS'], ['attack', 'Attacco'], ['defense', 'Difesa'], ['spAttack', 'Att. Sp.'], ['spDefense', 'Dif. Sp.'], ['speed', 'Velocità']];

  function typeChip(type) {
    return `<span class="type-chip" style="background:${typeColors[type] || '#777'}">${type}</span>`;
  }

  // --- Scheda di un Pokémon ---
  // Tre ingressi: un Pokémon della squadra o del deposito (`renderSummary`), una specie dal Pokédex
  // (`renderSpeciesSheet`), un Pokémon della squadra durante la lotta (`openBattleInfo`).
  function profileBlock(species) {
    const facts = [['Altezza', species.height], ['Peso', species.weight], ['Abilità', (species.abilities || []).join(' · ')]]
      .filter(([, value]) => value).map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join('');
    return `${facts ? `<div class="sheet-facts">${facts}</div>` : ''}${species.dex ? `<p class="sheet-dex">${species.dex}</p>` : ''}`;
  }

  function sheetHead(id, title, lines) {
    const species = data.species[id];
    return `<div class="sheet-head"><img src="assets/battle/${id}-front.png" alt="${species.name}" onerror="this.style.visibility='hidden'">
      <div><h2>${title}</h2>
        <p>#${String(species.number).padStart(3, '0')} · ${species.category || 'Pokémon'}</p>
        <p>${species.types.map(typeChip).join(' ')} ${lines}</p>
        <p><a href="${species.wiki}" target="_blank" rel="noopener">Scheda sulla wiki ▶</a></p></div></div>`;
  }

  function moveBlock(move, pp, level) {
    return `<div class="sheet-move"><div class="sheet-move-name">${level ? `<small>Lv.${level}</small>` : ''}<strong>${move.name}</strong>${typeChip(move.type)}<span>${move.category}</span></div>
      <div class="sheet-move-data">Pot. ${move.power || '—'} · Prec. ${move.accuracy || '—'} · PP ${pp}</div>
      ${move.description ? `<p>${move.description}</p>` : ''}</div>`;
  }

  function sheetBack(label, action) {
    const button = document.getElementById('summaryBack');
    button.textContent = `◀ ${label}`;
    button.addEventListener('click', action);
    ui.menuContent.scrollTop = 0;
  }

  function renderSummary(listName, index, backTab) {
    const monster = (save[listName] || [])[index];
    if (!monster) { renderMenu(backTab); return; }
    const species = data.species[monster.species];
    const floor = Math.pow(monster.level, 3);
    const next = Battle.expToNext(monster);
    const exp = monster.exp || 0;
    const expPercent = Math.max(0, Math.min(100, (exp - floor) / (next - floor) * 100));
    const status = monster.hp <= 0 ? 'KO' : statusText(monster);
    const stats = statRows.map(([key, label]) => `<div><span>${label}</span><strong>${key === 'hp' ? `${Math.max(0, monster.hp)}/${monster.stats.hp}` : monster.stats[key]}</strong></div>`).join('');
    const moves = monster.moves.map(slot => (data.moves[slot.id] ? moveBlock(data.moves[slot.id], `${slot.pp}/${slot.maxPp}`) : '')).join('');
    ui.menuContent.innerHTML = `<div class="page sheet"><button id="summaryBack" class="pill"></button>
      ${sheetHead(monster.species, `${species.name} <small>Lv.${monster.level}</small>`, status ? `<span class="status-badge">${status}</span>` : '')}
      <div class="sheet-stats">${stats}</div>
      <p class="sheet-exp">Esperienza <strong>${exp}</strong> · al prossimo livello <strong>${Math.max(0, next - exp)}</strong></p>
      <div class="exp-track"><i style="width:${expPercent}%"></i></div>
      ${profileBlock(species)}
      <h3>Mosse</h3>${moves}</div>`;
    sheetBack(backTab === 'deposit' ? 'Deposito' : mode === 'battle' ? 'Lotta' : 'Squadra', () => (mode === 'battle' ? closeBattleInfo() : renderMenu(backTab)));
  }

  function evolutionText(evolution) {
    if (!evolution) return 'Non si evolve.';
    const how = [
      evolution.level && `dal livello ${evolution.level}`,
      evolution.friendship && 'con molta amicizia',
      evolution.item && data.items[evolution.item] && `con ${data.items[evolution.item].name}`,
      evolution.night && 'di notte',
      evolution.dusk && 'al tramonto',
      evolution.location && 'in un luogo particolare'
    ].filter(Boolean).join(', ');
    const target = save.dex.seen[evolution.into] ? data.species[evolution.into].name : '???';
    return `Si evolve in <strong>${target}</strong>${how ? ` ${how}` : ''}.`;
  }

  // Scheda di una specie catturata, dal Pokédex: statistiche base, mosse per livello, evoluzione.
  function renderSpeciesSheet(id) {
    const species = data.species[id];
    const labels = statRows.map(([, label]) => label);
    const stats = species.base.map((value, index) => `<div><span>${labels[index]}</span><strong>${value}</strong></div>`).join('');
    const moves = species.learnset.map(([level, moveId]) => (data.moves[moveId] ? moveBlock(data.moves[moveId], data.moves[moveId].pp, level) : '')).join('');
    ui.menuContent.innerHTML = `<div class="page sheet"><button id="summaryBack" class="pill"></button>
      ${sheetHead(id, species.name, '')}
      <p class="sheet-exp">${evolutionText(species.evolution)}</p>
      ${profileBlock(species)}
      <h3>Statistiche di base</h3><div class="sheet-stats">${stats}</div>
      <h3>Mosse per livello</h3>${moves}</div>`;
    sheetBack('Pokédex', () => renderMenu('dex'));
  }

  // In lotta la scheda si apre sopra la schermata di lotta e si chiude tornando alla lista della squadra.
  function openBattleInfo(index) {
    ui.menuScreen.hidden = false;
    ui.menuScreen.dataset.view = 'page';
    ui.menuScreen.dataset.tab = 'info';
    renderSummary('team', index, 'team');
  }

  function closeBattleInfo() {
    ui.menuScreen.hidden = true;
  }

  // Borsa a tasche. Si vedono solo gli strumenti posseduti; fuori dalla lotta si usano Pozione e Antidoto.
  const bagPockets = [['items', 'Strumenti'], ['balls', 'Ball'], ['key', 'Strumenti base'], ['tm', 'MT']];
  const bagUses = {
    potion: { can: monster => monster.hp > 0 && monster.hp < monster.stats.hp, apply: monster => { monster.hp = Math.min(monster.stats.hp, monster.hp + 20); }, done: 'recupera PS.' },
    antidote: { can: monster => monster.status === 'psn', apply: monster => { monster.status = null; }, done: 'non è più avvelenato.' }
  };
  // strumenti che si usano e basta, senza scegliere un Pokémon: restituiscono il messaggio da mostrare
  const bagDirectUses = {
    repel: () => { save.repelSteps = 100; return 'Repellente attivo per 100 passi.'; }
  };
  const bagTexts = {
    repel: 'Per 100 passi tiene lontani i selvatici più deboli del primo Pokémon in squadra.',
    ball: 'Si lancia in lotta per catturare un Pokémon selvatico.',
    potion: 'Restituisce 20 PS a un Pokémon.',
    antidote: 'Cura un Pokémon avvelenato.'
  };
  let bagPocket = 0;
  let bagItem = null;
  let bagChoosing = false;

  // MT: `mt_<mossa>`. La impara chi è dello stesso tipo della mossa o ce l'ha già fra le mosse per livello.
  function tmMove(itemId) {
    return itemId && itemId.startsWith('mt_') ? itemId.slice(3) : null;
  }

  function canLearnTm(monster, moveId) {
    const species = data.species[monster.species];
    const move = data.moves[moveId];
    return Boolean(move) && !monster.moves.some(slot => slot.id === moveId)
      && (species.types.includes(move.type) || species.learnset.some(([, id]) => id === moveId));
  }

  // Che cosa fa lo strumento scelto su un Pokémon della squadra: { can, apply } come per Pozione e Antidoto,
  // ma `apply` può essere asincrona (imparare una mossa apre il riquadro «quale dimenticare»).
  function bagUseFor(itemId) {
    if (bagUses[itemId]) return bagUses[itemId];
    const moveId = tmMove(itemId);
    if (moveId) {
      return {
        can: monster => canLearnTm(monster, moveId),
        apply: async monster => {
          if (Battle.learnMove(monster, moveId, null)) return `${data.species[monster.species].name} ha imparato ${data.moves[moveId].name}!`;
          return handleLevelUpLearn(monster, moveId);
        },
        keepIfUnused: message => / non ha imparato /.test(message)
      };
    }
    if (Object.values(data.species).some(species => species.evolution && species.evolution.item === itemId)) {
      return {
        can: monster => Battle.evolutionReady(monster, evolutionContext({ item: itemId }), 'item'),
        apply: async monster => {
          const before = data.species[monster.species].name;
          const result = Battle.useEvolutionItem(monster, itemId, evolutionContext());
          save.dex.seen[result.evolvedInto] = true;
          save.dex.caught[result.evolvedInto] = true;
          playSound('levelup');
          for (const moveId of result.learned) await handleLevelUpLearn(monster, moveId);
          return `${before} si è evoluto in ${data.species[result.evolvedInto].name}!`;
        }
      };
    }
    return null;
  }

  function bagPocketOf(id) {
    if (id.startsWith('mt_')) return 'tm';
    if (id === 'ball') return 'balls';
    return data.items[id].price === null ? 'key' : 'items';
  }

  function bagDescription(id) {
    if (bagTexts[id]) return bagTexts[id];
    const moveId = tmMove(id);
    if (moveId && data.moves[moveId]) {
      const move = data.moves[moveId];
      return `Insegna ${move.name} (${move.type}, pot. ${move.power || '—'}) a un Pokémon di tipo ${move.type}. Si usa una volta sola.`;
    }
    const evolves = Object.values(data.species).filter(species => species.evolution && species.evolution.item === id).map(species => species.name);
    return evolves.length ? `Usalo su ${evolves.join(' o ')} per farlo evolvere.` : '';
  }

  function changeBagPocket(step) {
    bagPocket = (bagPocket + step + bagPockets.length) % bagPockets.length;
    bagItem = null;
    bagChoosing = false;
    renderBagMenu();
  }

  function renderBagMenu() {
    const [pocketId, pocketName] = bagPockets[bagPocket];
    const owned = Object.keys(data.items).filter(id => (save.items[id] || 0) > 0 && bagPocketOf(id) === pocketId);
    if (!owned.includes(bagItem)) { bagItem = owned[0] || null; bagChoosing = false; }
    const list = owned.map(id => `<button class="bag-item${id === bagItem ? ' selected' : ''}" data-item="${id}"><span>${data.items[id].name}</span><b>×${save.items[id]}</b></button>`).join('');
    const use = bagUseFor(bagItem);
    let detail = '<p>Questa tasca è vuota.</p>';
    if (bagItem && bagChoosing) {
      detail = `<p>Su chi usi ${data.items[bagItem].name}?</p><div class="bag-targets">${save.team.map((monster, index) =>
        `<button data-target="${index}"${use.can(monster) ? '' : ' disabled'}>${data.species[monster.species].name} ${Math.max(0, monster.hp)}/${monster.stats.hp}</button>`).join('')}<button data-target="">Annulla</button></div>`;
    } else if (bagItem) {
      detail = `<p>${bagDescription(bagItem) || data.items[bagItem].name}</p>${use || bagDirectUses[bagItem] ? '<button id="bagUse">Usa</button>' : ''}`;
    }
    ui.menuContent.innerHTML = `<div class="bag-screen">
      <div class="bag-pocket"><div class="bag-art pocket-${pocketId}"></div>
        <div class="bag-switch"><button data-pocket="-1" aria-label="Tasca precedente">◀</button><strong>${pocketName}</strong><button data-pocket="1" aria-label="Tasca successiva">▶</button></div>
        <div class="bag-dots">${bagPockets.map((_, index) => `<i${index === bagPocket ? ' class="on"' : ''}></i>`).join('')}</div></div>
      <div class="bag-list">${list}</div>
      <div class="bag-detail">${detail}</div></div>`;
    ui.menuContent.querySelectorAll('[data-pocket]').forEach(button => button.addEventListener('click', () => changeBagPocket(Number(button.dataset.pocket))));
    ui.menuContent.querySelectorAll('[data-item]').forEach(button => button.addEventListener('click', () => { bagItem = button.dataset.item; bagChoosing = false; renderBagMenu(); }));
    const useButton = document.getElementById('bagUse');
    if (useButton) useButton.addEventListener('click', () => {
      if (bagDirectUses[bagItem]) {
        save.items[bagItem] -= 1;
        showToast(bagDirectUses[bagItem]());
        autoSave();
        renderBagMenu();
        return;
      }
      if (!save.team.some(use.can)) { showToast('Non avrebbe alcun effetto.'); return; }
      bagChoosing = true;
      renderBagMenu();
    });
    ui.menuContent.querySelectorAll('[data-target]').forEach(button => button.addEventListener('click', async () => {
      const target = save.team[button.dataset.target];
      const item = bagItem;
      bagChoosing = false;
      if (target) {
        const message = await use.apply(target) || `${data.species[target.species].name} ${use.done}`;
        if (!(use.keepIfUnused && use.keepIfUnused(message))) save.items[item] -= 1;
        autoSave();
        showToast(message);
      }
      renderBagMenu();
    }));
  }

  function renderDexMenu() {
    const all = Object.entries(data.species).sort(([, a], [, b]) => a.number - b.number);
    const count = list => all.filter(([id]) => list[id]).length;
    const rows = all.map(([id, species]) => {
      const seen = Boolean(save.dex.seen[id]);
      const caught = Boolean(save.dex.caught[id]);
      return `<div class="dex-row${caught ? ' caught' : seen ? ' seen' : ''}"${caught ? ` data-species="${id}"` : ''}>
        <img src="assets/battle/${id}-front.png" alt="" onerror="this.style.visibility='hidden'">
        <span class="dex-num">#${String(species.number).padStart(3, '0')}</span>
        <strong>${seen ? species.name : '?????'}</strong>
        <span>${caught ? species.types.map(typeChip).join(' ') : seen ? 'avvistato' : ''}</span>
        <i class="dex-ball"></i></div>`;
    }).join('');
    ui.menuContent.innerHTML = `<div class="page"><h2>Pokédex del Piceno <small>visti ${count(save.dex.seen)} · catturati ${count(save.dex.caught)}</small></h2>
      <p class="page-hint">Scegli un Pokémon catturato per leggerne la scheda.</p>${rows}</div>`;
    ui.menuContent.querySelectorAll('[data-species]').forEach(row => row.addEventListener('click', () => renderSpeciesSheet(row.dataset.species)));
  }

  // Mappa della regione (provvisoria): uno schema dei luoghi e dei collegamenti, senza il dettaglio
  // delle singole aree. Le posizioni sono disegnate a mano qui; i collegamenti vengono dai passaggi.
  const regionSpots = {
    borgo_solesta: [34, 40], campo_parignano: [66, 26], borgo_chiaro: [98, 40], centro_storico: [56, 66],
    porta_cartara: [30, 92], porta_maggiore: [92, 74], monticelli: [120, 84], ripatransone: [150, 24],
    marino_del_tronto: [142, 100], oasi: [160, 118], maltignano: [150, 138], castel_di_lama: [180, 124],
    spinetoli_centobuchi: [198, 98], costa: [218, 78], jonathan: [220, 112]
  };

  function renderMapMenu() {
    const outdoorOf = id => (maps[id] && maps[id].indoor ? ((maps[id].transitions || [])[0] || {}).to : id);
    const here = outdoorOf(player.map);
    const links = new Set();
    Object.entries(maps).forEach(([id, map]) => (map.transitions || []).forEach(t => {
      if (regionSpots[id] && regionSpots[t.to]) links.add([id, t.to].sort().join('|'));
    }));
    const gymMaps = new Set(Object.values(trainersData.gyms).map(gym => outdoorOf(gym.map)));
    const lines = [...links].map(link => {
      const [a, b] = link.split('|');
      const bus = a === 'ripatransone' || b === 'ripatransone';
      return `<line x1="${regionSpots[a][0]}" y1="${regionSpots[a][1]}" x2="${regionSpots[b][0]}" y2="${regionSpots[b][1]}" class="${bus ? 'bus' : ''}"/>`;
    }).join('');
    const spots = Object.entries(regionSpots).map(([id, [x, y]]) => `<g class="spot${id === here ? ' here' : ''}">
      ${id === here ? `<circle class="pulse" cx="${x}" cy="${y}" r="7"/>` : ''}
      <rect x="${x - 4}" y="${y - 4}" width="8" height="8" rx="1.5" class="${gymMaps.has(id) ? 'gym' : ''}"/>
      <text x="${x}" y="${y + 11}">${maps[id] ? maps[id].name : id}</text></g>`).join('');
    ui.menuContent.innerHTML = `<div class="region-map"><svg viewBox="0 0 240 150" preserveAspectRatio="xMidYMid meet">
      <rect width="240" height="150" class="land"/><rect x="229" width="11" height="150" class="sea"/>
      <path d="M0 104 C40 96 90 104 130 112 S200 128 229 122" class="river"/>
      ${lines}${spots}</svg>
      <p class="party-hint">Sei a: <strong>${maps[here] ? maps[here].name : ''}</strong> · riquadri dorati: palestre · tratteggio: corriera</p></div>`;
  }

  // Icone delle medaglie: disegni originali, una forma per palestra (per `order`), colore dal tipo.
  const badgeShapes = {
    1: '<path d="M12 2c3 4 6 6 6 11a6 6 0 0 1-12 0c0-5 3-7 6-11z"/><path class="shine" d="M10 12c0-2 1-3 2-5 1 2 2 3 2 5a2 2 0 0 1-4 0z"/>',
    2: '<path d="M2 13a10 10 0 0 1 20 0z"/><path d="M11 13h2v8h-2z"/><path class="shine" d="M7 12a8 8 0 0 1 4-7v7z"/>'
  };

  function badgeIcon(gym, earned) {
    const shape = badgeShapes[gym.order] || '<circle cx="12" cy="12" r="8"/>';
    return `<svg viewBox="0 0 24 24" class="badge-icon${earned ? ' earned' : ''}" style="--badge:${typeColors[gym.type] || '#999'}">${shape}</svg>`;
  }

  function renderTrainerMenu() {
    const seenCount = Object.values(save.dex.seen).filter(Boolean).length;
    const caughtCount = Object.values(save.dex.caught).filter(Boolean).length;
    const allGyms = Object.values(trainersData.gyms).sort((a, b) => a.order - b.order);
    const badgeSlots = Array.from({ length: 8 }, (_, index) => {
      const gym = allGyms[index];
      if (!gym) return '<div class="badge-slot empty"></div>';
      const leaderGym = (trainersData.trainers[gym.leader] || {}).gym || {};
      const earned = save.badges.includes(leaderGym.badge);
      return `<div class="badge-slot${earned ? ' earned' : ''}">${badgeIcon(gym, earned)}<small>${earned ? leaderGym.badgeName || '' : gym.city}</small></div>`;
    }).join('');
    ui.menuContent.innerHTML = `<div class="page trainer-card">
      <h2>Tessera Allenatore</h2>
      <div class="trainer-data">
        <div class="trainer-face"></div>
        <div class="sheet-facts">
          <div><span>Nome</span><strong>${save.name || 'Oliver'}</strong></div>
          <div><span>Talleri</span><strong>${save.money}</strong></div>
          <div><span>Passi</span><strong>${save.steps || 0}</strong></div>
          <div><span>Pokédex</span><strong>${caughtCount} catturati · ${seenCount} visti</strong></div>
        </div>
      </div>
      <h3>Medaglie</h3>
      <div class="badge-grid">${badgeSlots}</div></div>`;
  }

  function depositRow(monster, action, ref) {
    const species = data.species[monster.species];
    return `<div class="box-row" data-summary="${ref}"><img src="assets/battle/${monster.species}-front.png" alt="" onerror="this.style.visibility='hidden'">
      <strong>${species.name}</strong><span>Lv.${monster.level}</span><span>${Math.max(0, monster.hp)}/${monster.stats.hp} PS</span>${action}</div>`;
  }

  function renderDepositMenu() {
    const team = save.team.map((monster, index) => depositRow(monster, `<button class="pill" data-deposit="${index}">Deposita</button>`, `team:${index}:deposit`)).join('');
    const stored = save.storage.map((monster, index) => depositRow(monster, `<button class="pill" data-withdraw="${index}">Ritira</button>`, `storage:${index}:deposit`)).join('');
    ui.menuContent.innerHTML = `<div class="page"><h2>Deposito</h2>
      <p class="page-hint">Tocca un Pokémon per la scheda. In squadra ne stanno al massimo sei.</p>
      <div class="box-columns"><div><h3>Squadra</h3>${team}</div><div><h3>Depositati</h3>${stored || '<p>Nessun Pokémon depositato.</p>'}</div></div></div>`;
    ui.menuContent.querySelectorAll('[data-deposit]').forEach(button => button.addEventListener('click', () => {
      if (save.team.length <= 1) { showToast('Deve restare almeno un Pokémon in squadra.'); return; }
      save.storage.push(save.team.splice(Number(button.dataset.deposit), 1)[0]);
      autoSave();
      renderDepositMenu();
    }));
    ui.menuContent.querySelectorAll('[data-withdraw]').forEach(button => button.addEventListener('click', () => {
      if (save.team.length >= 6) { showToast('La squadra è già completa.'); return; }
      save.team.push(save.storage.splice(Number(button.dataset.withdraw), 1)[0]);
      autoSave();
      renderDepositMenu();
    }));
  }

  function renderSaveMenu() {
    ui.menuContent.innerHTML = `<div class="page"><h2>Salvataggio</h2>
      <p>Il gioco salva da solo su questo dispositivo a ogni passaggio, lotta e acquisto.</p>
      <div class="page-actions"><button id="saveNow" class="pill">Salva ora</button></div>
      <h3>Portare la partita altrove</h3>
      <p>Esporta la partita in un file e importala su un altro dispositivo o browser.</p>
      <div class="page-actions"><button id="exportSave" class="pill">Esporta</button><label class="pill">Importa<input id="importSave" type="file" accept="application/json" hidden></label></div>
      <h3>Ricominciare</h3>
      <p>Cancella la partita salvata su questo dispositivo.</p>
      <div class="page-actions"><button id="resetSave" class="pill danger">Ricomincia da capo</button></div></div>`;
    document.getElementById('saveNow').addEventListener('click', () => { autoSave(); showToast('Partita salvata.'); });
    document.getElementById('exportSave').addEventListener('click', exportSave);
    document.getElementById('importSave').addEventListener('change', importSave);
    document.getElementById('resetSave').addEventListener('click', () => {
      if (!confirm('Cancellare la partita locale e ricominciare?')) return;
      removeStorage(STORAGE_KEY);
      location.reload();
    });
  }

  function renderSettingsMenu() {
    const row = (id, label, on) => `<div class="option-row"><span>${label}</span><button id="${id}" class="pill${on ? '' : ' off'}">${on ? 'Sì' : 'No'}</button></div>`;
    ui.menuContent.innerHTML = `<div class="page"><h2>Opzioni</h2>
      ${row('toggleSound', 'Effetti sonori', save.settings.sound)}
      ${row('toggleMusic', 'Musica', save.settings.music !== false)}</div>`;
    document.getElementById('toggleMusic').addEventListener('click', () => {
      save.settings.music = save.settings.music === false;
      if (save.settings.music) startMusic(); else stopMusic();
      autoSave();
      renderSettingsMenu();
    });
    document.getElementById('toggleSound').addEventListener('click', () => {
      save.settings.sound = !save.settings.sound;
      autoSave();
      renderSettingsMenu();
    });
  }

  function exportSave() {
    autoSave();
    const blob = new Blob([JSON.stringify(save, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'pokemon-ascoli-salvataggio.json';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function importSave(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if ((parsed.version !== 1 && parsed.version !== 2) || !parsed.player || !Array.isArray(parsed.team)) throw new Error('Formato non valido');
        writeStorage(STORAGE_KEY, JSON.stringify(parsed));
        location.reload();
      } catch (_) {
        showToast('Salvataggio JSON non valido.');
      }
    };
    reader.readAsText(file);
  }

  // ---------------------------------------------------------------------
  // Feedback UI
  // ---------------------------------------------------------------------

  function showLocation(name) {
    clearTimeout(bannerTimer);
    ui.locationBanner.textContent = name;
    ui.locationBanner.hidden = false;
    bannerTimer = setTimeout(() => { ui.locationBanner.hidden = true; }, 1600);
  }

  function showToast(message) {
    if (!ui.toast) return;
    clearTimeout(toastTimer);
    ui.toast.textContent = message;
    ui.toast.hidden = false;
    toastTimer = setTimeout(() => { ui.toast.hidden = true; }, 2200);
  }

  function updateLocation() {
    ui.locationName.textContent = currentMap.name;
    updateMusicTheme();
  }

  // Cambio di mappa: nero per un attimo, poi la mappa nuova affiora (classe .map-fade in styles.css).
  function fadeInMap() {
    ui.viewport.classList.remove('map-fade');
    void ui.viewport.offsetWidth; // fa ripartire l'animazione se ce n'era una in corso
    ui.viewport.classList.add('map-fade');
  }

  // ---------------------------------------------------------------------
  // Rendering mappa
  // ---------------------------------------------------------------------

  function drawTile(type, screenX, screenY, worldX, worldY) {
    const size = data.tileSize;
    if (type === 'travertino' || type === 'piazza') {
      ctx.fillStyle = type === 'piazza' ? '#cdbd98' : '#b8ad91';
      ctx.fillRect(screenX, screenY, size, size);
      ctx.fillStyle = '#9d9279';
      ctx.fillRect(screenX, screenY + ((worldX + worldY) % 2 ? 7 : 8), size, 1);
      ctx.fillRect(screenX + 7, screenY, 1, 8);
      return;
    }
    if (type === 'road') {
      ctx.fillStyle = '#a89572';
      ctx.fillRect(screenX, screenY, size, size);
      ctx.fillStyle = '#897755';
      ctx.fillRect(screenX + ((worldX * 5 + worldY * 3) % 12), screenY + 4, 2, 1);
      ctx.fillRect(screenX + 2, screenY + 12, 3, 1);
      return;
    }
    if (type === 'water') {
      ctx.fillStyle = '#4389aa';
      ctx.fillRect(screenX, screenY, size, size);
      ctx.fillStyle = '#76b9c8';
      ctx.fillRect(screenX + ((worldX + worldY) % 3) * 3, screenY + 4, 7, 1);
      ctx.fillRect(screenX + 5, screenY + 11, 8, 1);
      return;
    }
    if (type === 'bridge') {
      ctx.fillStyle = '#9d754d';
      ctx.fillRect(screenX, screenY, size, size);
      ctx.fillStyle = '#6e4c31';
      ctx.fillRect(screenX, screenY + 3, size, 1);
      ctx.fillRect(screenX, screenY + 12, size, 1);
      ctx.fillRect(screenX + 7, screenY, 1, size);
      return;
    }
    if (type === 'muro') {
      ctx.fillStyle = '#5d5a50';
      ctx.fillRect(screenX, screenY, size, size);
      return;
    }
    if (type === 'sabbia') {
      ctx.fillStyle = '#e0cd9c';
      ctx.fillRect(screenX, screenY, size, size);
      ctx.fillStyle = '#c9b581';
      ctx.fillRect(screenX + ((worldX * 5 + worldY * 3) % 12), screenY + 4, 1, 1);
      ctx.fillRect(screenX + ((worldX * 7 + worldY) % 12), screenY + 9, 1, 1);
      ctx.fillRect(screenX + ((worldX + worldY * 5) % 12), screenY + 12, 1, 1);
      return;
    }
    if (type === 'mare') {
      ctx.fillStyle = '#2e6e8e';
      ctx.fillRect(screenX, screenY, size, size);
      ctx.fillStyle = '#e8f4f7';
      ctx.fillRect(screenX + ((worldX + worldY) % 3) * 3, screenY + 4, 7, 1);
      ctx.fillRect(screenX + 5, screenY + 11, 8, 1);
      return;
    }
    if (type === 'pendio') {
      ctx.fillStyle = '#78a25e';
      ctx.fillRect(screenX, screenY, size, size);
      ctx.fillStyle = '#5b7d47';
      const offset = (worldX * 3 + worldY * 7) % 4;
      ctx.fillRect(screenX + offset, screenY + 2, 6, 1);
      ctx.fillRect(screenX + offset + 2, screenY + 7, 6, 1);
      ctx.fillRect(screenX + offset + 4, screenY + 12, 6, 1);
      return;
    }
    if (type === 'asfalto') {
      ctx.fillStyle = '#4a4a48';
      ctx.fillRect(screenX, screenY, size, size);
      if ((worldX + worldY) % 2 === 0) {
        ctx.fillStyle = '#8a8a86';
        ctx.fillRect(screenX + 6, screenY + 7, 4, 1);
      }
      return;
    }
    if (type === 'binari') {
      ctx.fillStyle = '#8a8378';
      ctx.fillRect(screenX, screenY, size, size);
      ctx.fillStyle = '#4a463f';
      ctx.fillRect(screenX, screenY + 4, size, 1);
      ctx.fillRect(screenX, screenY + 11, size, 1);
      ctx.fillStyle = '#6e5c42';
      ctx.fillRect(screenX + 2, screenY + 5, 2, 6);
      ctx.fillRect(screenX + 11, screenY + 5, 2, 6);
      return;
    }
    if (type === 'ghiaia') {
      ctx.fillStyle = '#a89e88';
      ctx.fillRect(screenX, screenY, size, size);
      ctx.fillStyle = '#8d8371';
      ctx.fillRect(screenX + ((worldX * 3 + worldY) % 12), screenY + 3, 2, 1);
      ctx.fillRect(screenX + ((worldX + worldY * 5) % 12), screenY + 8, 2, 1);
      ctx.fillRect(screenX + ((worldX * 7 + worldY * 2) % 12), screenY + 13, 2, 1);
      return;
    }
    if (type === 'pavimento') {
      ctx.fillStyle = '#d8cfb8';
      ctx.fillRect(screenX, screenY, size, size);
      ctx.fillStyle = '#b8ac8f';
      ctx.fillRect(screenX, screenY + 7, size, 1);
      ctx.fillRect(screenX + 7, screenY, 1, size);
      return;
    }
    if (type === 'albero') {
      ctx.fillStyle = '#6da25c';
      ctx.fillRect(screenX, screenY, size, size);
      ctx.fillStyle = '#3d2f27';
      ctx.fillRect(screenX + 6, screenY + 11, 4, 5);
      ctx.fillStyle = '#2b5c33';
      ctx.fillRect(screenX + 1, screenY, 14, 12);
      ctx.fillStyle = '#357a3f';
      ctx.fillRect(screenX + 3, screenY + 2, 10, 8);
      return;
    }
    ctx.fillStyle = '#6da25c';
    ctx.fillRect(screenX, screenY, size, size);
    ctx.fillStyle = '#548846';
    const seed = Math.abs((worldX * 17 + worldY * 31) % 11);
    if (seed < 4) {
      ctx.fillRect(screenX + 3 + seed, screenY + 10, 1, 3);
      ctx.fillRect(screenX + 2 + seed, screenY + 11, 3, 1);
    }
  }

  // Disegno a tileset: sta in tiles.js, condiviso col configuratore.
  const Tiles = window.PokemonAscoliTiles;
  const { TILES, tilesetReady, terrainGrid, isTallGrass, blit, drawGround, drawHouse, drawStanding, drawStadiumStands } = Tiles.create(ctx, { fallbackTile: drawTile });

  function cameraPosition() {
    const worldWidth = currentMap.width * data.tileSize;
    const worldHeight = currentMap.height * data.tileSize;
    return {
      x: Math.round(Math.max(0, Math.min(worldWidth - canvas.width, player.renderX * data.tileSize + 8 - canvas.width / 2))),
      y: Math.round(Math.max(0, Math.min(worldHeight - canvas.height, player.renderY * data.tileSize + 8 - canvas.height / 2)))
    };
  }

  function drawBuildings(camera) {
    (currentMap.buildings || []).forEach(item => {
      const x = item.x * 16 - camera.x;
      const y = item.y * 16 - camera.y;
      const width = item.w * 16;
      const height = item.h * 16;
      if (x > canvas.width || y > canvas.height || x + width < 0 || y + height < 0) return;
      if (item.kind !== 'stadio') {
        drawHouse(item, x, y, width, height, camera);
        return; // il nome non galleggia più sull'edificio: lo dice il cartello accanto alla porta
      }
      ctx.fillStyle = '#5b4738';
      ctx.fillRect(x - 2, y - 4, width + 4, height + 4);
      ctx.fillStyle = item.color || '#b77958';
      ctx.fillRect(x, y, width, height);
      const stands = tilesetReady();
      if (stands) drawStadiumStands(x, y, width, height);
      else {
        ctx.fillStyle = '#e7d2a6';
        for (let windowX = x + 8; windowX < x + width - 7; windowX += 24) {
          ctx.fillRect(windowX, y + height - 10, 7, 6);
        }
        ctx.fillStyle = '#3d2f27';
        ctx.fillRect(x + width / 2 - 4, y + height - 11, 8, 11);
      }
      if (item.kind === 'stadio') {
        const inset = stands ? 40 : 16; // con le gradinate a texture il campo sta più dentro
        ctx.fillStyle = '#4c9c3c';
        ctx.fillRect(x + inset, y + inset, Math.max(0, width - inset * 2), Math.max(0, height - inset * 2));
        ctx.strokeStyle = '#e6e0c3';
        ctx.strokeRect(x + inset + 8.5, y + inset + 6.5, Math.max(0, width - inset * 2 - 17), Math.max(0, height - inset * 2 - 13));
        ctx.beginPath();
        ctx.moveTo(x + width / 2 + .5, y + inset + 6.5);
        ctx.lineTo(x + width / 2 + .5, y + height - inset - 6.5);
        ctx.stroke();
      }
    });
  }

  // `stride`: 0 fermo; 1 o 2 = un piede alzato (sinistro o destro). I fogli degli NPC hanno un solo
  // fotogramma per direzione: il passo si ricava alzando di un pixel metà della fascia dei piedi.
  // Fogli che hanno i fotogrammi del passo (colonne: fermo, passo, fermo, altro passo).
  // L'elenco lo riscrive tools/build-npc.py quando ritaglia un foglio «cammino-*».
  const walkingSheets = new Set([
    // <WALKERS>
    'ragazzina', 'ragazzino'
    // </WALKERS>
  ]);

  function drawSpriteFrame(sheet, direction, x, y, stride = 0, name = '') {
    const row = directions[direction].row;
    const left = Math.round(x - 8), top = Math.round(y - 20);
    if (walkingSheets.has(name)) { ctx.drawImage(sheet, [0, 1, 3][stride] * 32, row * 32, 32, 32, left, top, 32, 32); return; }
    if (!stride) { ctx.drawImage(sheet, 0, row * 32, 32, 32, left, top, 32, 32); return; }
    const FEET = 6; // righe in fondo allo sprite che fanno da gambe
    ctx.drawImage(sheet, 0, row * 32, 32, 32 - FEET, left, top, 32, 32 - FEET);
    [0, 1].forEach(half => {
      const lift = half === stride - 1 ? 1 : 0;
      ctx.drawImage(sheet, half * 16, row * 32 + 32 - FEET, 16, FEET - lift, left + half * 16, top + 32 - FEET - lift, 16, FEET - lift);
    });
  }

  // `row`: disegna solo chi sta su quella riga (vedi renderWorld)
  function drawNpcs(camera, row) {
    visibleRuntimeNpcs().forEach((npc, index) => {
      if (npc.y !== row) return;
      const x = npc.x * 16 - camera.x;
      const y = npc.y * 16 - camera.y;
      if (x < -16 || y < -20 || x > canvas.width || y > canvas.height) return;
      const sheet = npcSheet(npc.sprite);
      if (sheet) {
        drawSpriteFrame(sheet, npc.direction || 'down', x, y);
        return;
      }
      ctx.fillStyle = index % 2 ? '#425d93' : '#8b4c49';
      ctx.fillRect(Math.round(x + 4), Math.round(y + 4), 8, 10);
      ctx.fillStyle = '#e6bb8b';
      ctx.fillRect(Math.round(x + 5), Math.round(y), 6, 6);
      ctx.fillStyle = '#2c2a25';
      ctx.fillRect(Math.round(x + 5), Math.round(y), 6, 2);
    });
  }

  function drawTrainers(camera, row) {
    if (!save) return;
    activeTrainersOnMap().forEach(trainer => {
      const defeated = !!save.flags[Events.flagKeys.trainerFlag(trainer.id)];
      const renderX = trainer.renderX ?? trainer.x, renderY = trainer.renderY ?? trainer.y;
      if (Math.floor(renderY) !== row) return;
      // mentre cammina alterna i piedi: mezza cella un piede, mezza cella fermo, poi l'altro
      const travelled = renderX + renderY;
      const stride = travelled % 1 > .5 ? 1 + Math.floor(travelled) % 2 : 0;
      const x = Math.round(renderX * 16 - camera.x);
      const y = Math.round(renderY * 16 - camera.y);
      if (x < -16 || y < -20 || x > canvas.width || y > canvas.height) return;
      const sheetName = trainer.sprite || (trainersData.classes[trainer.class] || {}).sprite;
      const sheet = npcSheet(sheetName);
      if (sheet) {
        drawSpriteFrame(sheet, trainer.direction || 'down', x, y, stride, sheetName);
        return;
      }
      const color = defeated ? '#6b6b6b' : (trainerColors[trainer.class] || '#8b4c49');
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x + 4), Math.round(y + 4), 8, 10);
      ctx.fillStyle = '#e6bb8b';
      ctx.fillRect(Math.round(x + 5), Math.round(y), 6, 6);
      ctx.fillStyle = '#2c2a25';
      ctx.fillRect(Math.round(x + 5), Math.round(y), 6, 2);
    });
  }

  function drawPlayer(camera) {
    const x = player.renderX * 16 - camera.x - 8;
    const y = player.renderY * 16 - camera.y - 20;
    const row = directions[player.direction].row;
    const frame = movement ? player.frame : 0;
    if (playerImage.complete && playerImage.naturalWidth) {
      ctx.drawImage(playerImage, frame * 32, row * 32, 32, 32, Math.round(x), Math.round(y), 32, 32);
    } else {
      ctx.fillStyle = '#a9a527';
      ctx.fillRect(Math.round(x + 8), Math.round(y + 8), 16, 20);
    }
  }

  function drawTransitions(camera) {
    (currentMap.transitions || []).forEach(item => {
      const x = item.x * 16 - camera.x;
      const y = item.y * 16 - camera.y;
      if (x > canvas.width || y > canvas.height || x + item.w * 16 < 0 || y + item.h * 16 < 0) return;
      // i passaggi sul bordo della mappa sono la strada che esce: nessun segno. Quelli in mezzo
      // (corriera, zerbini) restano appena evidenziati; il nome lo dice il cartello accanto.
      if (item.x <= 0 || item.y <= 0 || item.x + item.w >= currentMap.width || item.y + item.h >= currentMap.height) return;
      ctx.fillStyle = 'rgba(242,210,82,.3)';
      ctx.fillRect(x, y, item.w * 16, item.h * 16);
    });
  }

  function renderWorld() {
    const camera = cameraPosition();
    const startX = Math.floor(camera.x / 16);
    const startY = Math.floor(camera.y / 16);
    const endX = Math.min(currentMap.width, startX + Math.ceil(canvas.width / 16) + 2);
    const endY = Math.min(currentMap.height, startY + Math.ceil(canvas.height / 16) + 2);
    ctx.fillStyle = '#15241a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const atlas = tilesetReady();
    const grid = atlas ? terrainGrid(currentMap) : null;
    const frame = Math.floor(performance.now() / 450) % 2;
    for (let y = startY; y < endY; y += 1) {
      for (let x = startX; x < endX; x += 1) {
        if (atlas) drawGround(grid, x, y, x * 16 - camera.x, y * 16 - camera.y, frame);
        else drawTile(terrainAt(currentMap, x, y), x * 16 - camera.x, y * 16 - camera.y, x, y);
      }
    }
    drawTransitions(camera);
    drawBuildings(camera);
    // Alberi, arredo e personaggi sbordano sulle celle vicine: si disegnano dopo terreno ed edifici, una
    // riga alla volta dall'alto, così chi sta più in basso copre chi sta più in alto (si passa dietro
    // le chiome, non sopra). Chi è a metà passo conta sulla riga da cui parte o in cui arriva più in alto.
    const playerRow = Math.floor(player.renderY);
    const actorsOnRow = row => {
      drawNpcs(camera, row);
      drawTrainers(camera, row);
      if (row === playerRow) drawPlayer(camera);
    };
    if (atlas) drawStanding(currentMap, grid, startX, startY - 1, endX, endY + 1, camera.x, camera.y, actorsOnRow);
    else for (let row = startY - 1; row <= endY + 1; row += 1) actorsOnRow(row);
    if (atlas) {
      const cellX = Math.round(player.renderX);
      const cellY = Math.round(player.renderY);
      // l'erba alta copre i piedi del giocatore
      if (isTallGrass(currentMap, cellX, cellY)) blit(TILES.erba_alta_front, 0, Math.round(player.renderX * 16 - camera.x), Math.round(player.renderY * 16 - camera.y));
      // fruscio: i ciuffi si aprono per un attimo nella cella in cui si è appena entrati
      const rustleAge = rustle ? performance.now() - rustle.start : Infinity;
      if (rustleAge < 260) blit(rustleAge < 130 ? TILES.fruscio_0 : TILES.fruscio_1, 0, rustle.x * 16 - camera.x, rustle.y * 16 - camera.y);
    }
  }

  // Colonna sonora PROVVISORIA: un giro lento di quattro accordi, sintetizzato (niente file audio).
  // Tappeto di note lunghe, basso sul primo e terzo tempo, qualche nota di melodia a caso fra
  // quelle dell'accordo. Si spegne da Menu → Impostazioni.
  const MUSIC_BARS = [ // frequenze in Hz: [basso, [tappeto], [note possibili della melodia]]
    [87.31, [174.61, 220, 261.63, 329.63], [523.25, 659.25, 698.46, 880]],        // Fa maggiore 7
    [82.41, [164.81, 196, 246.94, 293.66], [493.88, 587.33, 659.25, 783.99]],     // Mi minore 7
    [73.42, [146.83, 174.61, 220, 261.63], [440, 523.25, 587.33, 698.46]],        // Re minore 7
    [65.41, [130.81, 164.81, 196, 246.94], [392, 493.88, 523.25, 659.25]]         // Do maggiore 7
  ];
  // Temi: stesso generatore, cambiano accordi, andatura e carattere. `drive` = basso che batte ogni ottavo.
  const hz = midi => 440 * Math.pow(2, (midi - 69) / 12);
  const chords = list => list.map(([bass, pad, melody]) => [hz(bass), pad.map(hz), melody.map(hz)]);
  const MUSIC_THEMES = {
    citta: { beat: 60 / 72, bars: MUSIC_BARS, melody: .4, drive: false },
    percorso: { // Do maggiore, I-V-vi-IV: aperto, da camminata
      beat: 60 / 104, melody: .6, drive: false,
      bars: chords([[48, [60, 64, 67], [72, 76, 79, 84]], [43, [55, 59, 62], [71, 74, 79, 83]], [45, [57, 60, 64], [72, 76, 81, 84]], [41, [53, 57, 60], [72, 77, 81, 84]]])
    },
    palestra: { // Re minore: teso
      beat: 60 / 120, melody: .45, drive: true,
      bars: chords([[38, [50, 53, 57], [62, 65, 69, 74]], [34, [46, 50, 53], [62, 65, 70, 74]], [36, [48, 52, 55], [64, 67, 72, 76]], [33, [45, 49, 52], [61, 64, 69, 73]]])
    },
    lotta: { // La minore, veloce
      beat: 60 / 160, melody: .7, drive: true,
      bars: chords([[45, [57, 60, 64], [69, 72, 76, 81]], [41, [53, 57, 60], [69, 72, 77, 81]], [43, [55, 59, 62], [67, 71, 74, 79]], [40, [52, 56, 59], [68, 71, 76, 80]]])
    }
  };
  const ROUTE_MAPS = new Set(['marino_del_tronto', 'oasi', 'maltignano', 'spinetoli_centobuchi']);
  let music = null;

  function musicThemeNow() {
    if (mode === 'battle') return 'lotta';
    if (/^palestra_/.test(player.map) || player.map === 'jonathan') return 'palestra';
    return ROUTE_MAPS.has(player.map) ? 'percorso' : 'citta';
  }

  // Cambia tema se serve: il vecchio sfuma, il nuovo riparte dalla prima battuta.
  function updateMusicTheme() {
    if (!music || !player) return;
    const theme = musicThemeNow();
    if (theme === music.theme) return;
    try { music.bus.gain.setTargetAtTime(0, audioContext.currentTime, .12); } catch (_) { }
    music.theme = theme;
    music.bus = audioContext.createGain();
    music.bus.connect(music.master);
    music.bar = 0;
    music.nextBarAt = audioContext.currentTime + .15;
  }

  function startMusic() {
    if (music || !save || save.settings.music === false) return;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume();
      const master = audioContext.createGain();
      master.gain.value = .5;
      master.connect(audioContext.destination);
      const tone = (frequency, at, duration, wave, peak, attack) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = wave;
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(.0001, at);
        gain.gain.linearRampToValueAtTime(peak, at + attack);
        gain.gain.exponentialRampToValueAtTime(.0001, at + duration);
        oscillator.connect(gain).connect(state.bus);
        oscillator.start(at);
        oscillator.stop(at + duration + .05);
      };
      const state = { master, bus: audioContext.createGain(), theme: musicThemeNow(), bar: 0, nextBarAt: audioContext.currentTime + .1, timer: 0 };
      state.bus.connect(master);
      const schedule = () => {
        const theme = MUSIC_THEMES[state.theme];
        const beat = theme.beat;
        while (state.nextBarAt < audioContext.currentTime + .6) {
          const [bass, pad, melody] = theme.bars[state.bar % theme.bars.length];
          const at = state.nextBarAt;
          pad.forEach(frequency => tone(frequency, at, beat * 4.2, 'sine', .022, theme.drive ? .08 : .5));
          if (theme.drive) {
            for (let eighth = 0; eighth < 8; eighth += 1) tone(bass, at + eighth * beat / 2, beat * .45, 'square', eighth % 2 ? .014 : .022, .01);
          } else {
            tone(bass, at, beat * 1.8, 'triangle', .05, .03);
            tone(bass, at + beat * 2, beat * 1.6, 'triangle', .04, .03);
          }
          for (let eighth = 0; eighth < 8; eighth += 1) {
            if (Math.random() < theme.melody) tone(melody[Math.floor(Math.random() * melody.length)], at + eighth * beat / 2, beat * 1.1, 'triangle', .022, .02);
          }
          state.bar += 1;
          state.nextBarAt += beat * 4;
        }
      };
      schedule();
      state.timer = setInterval(schedule, 150);
      music = state;
    } catch (_) { music = null; }
  }

  function stopMusic() {
    if (!music) return;
    clearInterval(music.timer);
    try { music.master.gain.setTargetAtTime(0, audioContext.currentTime, .15); } catch (_) { }
    music = null;
  }

  // Effetti sonori PROVVISORI, sintetizzati al volo (niente file audio).
  // Ogni effetto è una lista di note [frequenza Hz, inizio s, durata s, forma d'onda, frequenza d'arrivo]
  // più, se serve, uno sbuffo di rumore (`noise`: durata in secondi).
  const SOUNDS = {
    confirm: { notes: [[880, 0, .05, 'square'], [1175, .05, .08, 'square']] },
    bump: { notes: [[130, 0, .09, 'square', 90]] },
    hit: { noise: .12, notes: [[240, 0, .12, 'square', 70]] },
    faint: { notes: [[520, 0, .45, 'square', 70]] },
    heal: { notes: [[523, 0, .09, 'triangle'], [659, .09, .09, 'triangle'], [784, .18, .09, 'triangle'], [1047, .27, .22, 'triangle']] },
    throw: { notes: [[380, 0, .22, 'triangle', 980]] },
    encounter: { notes: [[660, 0, .07, 'square'], [440, .08, .07, 'square'], [660, .16, .07, 'square'], [440, .24, .07, 'square'], [880, .32, .16, 'square']] },
    transition: { notes: [[392, 0, .08, 'triangle'], [294, .08, .12, 'triangle']] },
    rustle: { noise: .07, volume: .35 },
    levelup: { notes: [[523, 0, .08, 'square'], [659, .08, .08, 'square'], [784, .16, .08, 'square'], [1047, .24, .12, 'square'], [784, .37, .07, 'square'], [1047, .45, .28, 'square']] },
    caught: { notes: [[659, 0, .1, 'square'], [659, .12, .1, 'square'], [784, .24, .1, 'square'], [988, .36, .1, 'square'], [1319, .48, .35, 'square']] },
    win: { notes: [[523, 0, .1, 'square'], [523, .11, .1, 'square'], [523, .22, .1, 'square'], [659, .33, .16, 'square'], [587, .5, .1, 'square'], [659, .61, .1, 'square'], [784, .72, .4, 'square']] },
    lose: { notes: [[392, 0, .18, 'triangle'], [330, .2, .18, 'triangle'], [262, .4, .18, 'triangle'], [196, .6, .5, 'triangle']] },
    exp: { notes: [[440, 0, .4, 'triangle', 1100]] }
  };

  function playSound(kind) {
    if (!save || !save.settings.sound) return;
    const sound = SOUNDS[kind];
    if (!sound) return;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume();
      const now = audioContext.currentTime;
      const volume = .05 * (sound.volume || 1);
      for (const [frequency, at, duration, wave, slideTo] of sound.notes || []) {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = wave;
        oscillator.frequency.setValueAtTime(frequency, now + at);
        if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(slideTo, now + at + duration);
        gain.gain.setValueAtTime(volume, now + at);
        gain.gain.exponentialRampToValueAtTime(.0008, now + at + duration);
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start(now + at);
        oscillator.stop(now + at + duration + .02);
      }
      if (sound.noise) {
        const buffer = audioContext.createBuffer(1, Math.ceil(audioContext.sampleRate * sound.noise), audioContext.sampleRate);
        const samples = buffer.getChannelData(0);
        for (let i = 0; i < samples.length; i += 1) samples[i] = (Math.random() * 2 - 1) * (1 - i / samples.length);
        const source = audioContext.createBufferSource();
        const gain = audioContext.createGain();
        gain.gain.value = volume * 1.6;
        source.buffer = buffer;
        source.connect(gain).connect(audioContext.destination);
        source.start(now);
      }
    } catch (_) { }
  }

  function gameLoop(now) {
    if (mode === 'world') {
      const held = heldDirections[heldDirections.length - 1];
      if (held && !movement && now >= nextMoveAt) movePlayer(held, now);
      updateMovement(now);
    }
    if (mode !== 'title') renderWorld();
    requestAnimationFrame(gameLoop);
  }

  function addHeld(direction) {
    const index = heldDirections.indexOf(direction);
    if (index !== -1) heldDirections.splice(index, 1);
    heldDirections.push(direction);
    if (mode === 'world' && !movement) movePlayer(direction);
  }

  function removeHeld(direction) {
    const index = heldDirections.indexOf(direction);
    if (index !== -1) heldDirections.splice(index, 1);
    if (!heldDirections.length) justArrived = false;
  }

  document.addEventListener('keydown', event => {
    if (event.target.tagName === 'INPUT') return; // nel campo del nome i tasti scrivono e basta
    const direction = keyDirections[event.code];
    if (direction) {
      event.preventDefault();
      if (mode === 'menu') { menuArrow(direction); return; }
      if (!event.repeat) addHeld(direction);
      return;
    }
    if (event.code === 'Enter' || event.code === 'Space') {
      event.preventDefault();
      if (mode === 'dialogue') { advanceDialogue(); return; }
      if (mode === 'battle') { advanceMessage(); return; }
      if (mode === 'credits') { closeCredits(); return; }
      if (mode === 'menu' || mode === 'title') { if (document.activeElement && document.activeElement.tagName === 'BUTTON') document.activeElement.click(); return; }
      interact();
    }
    if (event.code === 'KeyM') openMenu();
    if (event.code === 'Escape' || event.code === 'KeyX') {
      if (mode === 'menu') menuBack();
      else if (mode === 'battle') battleBack();
      else if (mode === 'credits') closeCredits();
    }
  });
  document.addEventListener('keydown', event => { if (event.key === 'Shift') running = true; });
  document.addEventListener('keyup', event => { if (event.key === 'Shift') running = false; });
  document.addEventListener('keyup', event => {
    const direction = keyDirections[event.code];
    if (direction) removeHeld(direction);
  });
  window.addEventListener('blur', () => { heldDirections.length = 0; running = false; justArrived = false; });

  document.querySelectorAll('[data-direction]').forEach(button => {
    const direction = button.dataset.direction;
    button.addEventListener('pointerdown', event => { event.preventDefault(); button.setPointerCapture(event.pointerId); addHeld(direction); });
    button.addEventListener('pointerup', () => removeHeld(direction));
    button.addEventListener('pointercancel', () => removeHeld(direction));
  });

  ui.newGameButton.addEventListener('click', () => startSession(freshSave()));
  ui.continueButton.addEventListener('click', () => {
    const loaded = loadSave();
    if (loaded) startSession(loaded);
  });
  ui.menuButton.addEventListener('click', () => openMenu());
  ui.touchMenu.addEventListener('click', () => openMenu());
  ui.touchA.addEventListener('click', () => {
    if (mode === 'dialogue') { advanceDialogue(); return; }
    if (mode === 'battle') { advanceMessage(); return; }
    if (mode === 'credits') { closeCredits(); return; }
    interact();
  });
  // B tenuto premuto = corsa
  ui.touchB.addEventListener('pointerdown', () => { running = true; });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(type => ui.touchB.addEventListener(type, () => { running = false; }));
  ui.touchB.addEventListener('click', () => {
    if (mode === 'menu') menuBack();
    else if (mode === 'battle') battleBack();
  });
  ui.menuClose.addEventListener('click', menuBack);
  ui.menuExit.addEventListener('click', closeMenu);
  ui.menuContent.addEventListener('click', event => {
    if (event.target.closest('button, a')) return;
    const row = event.target.closest('[data-summary]');
    if (!row) return;
    const [listName, index, backTab] = row.dataset.summary.split(':');
    renderSummary(listName, Number(index), backTab);
  });
  ui.menuTabs.addEventListener('click', event => {
    const button = event.target.closest('[data-tab]');
    if (button) renderMenu(button.dataset.tab);
  });

  // Aggancio per i test automatici (tools/gioca.mjs): esiste solo aprendo il gioco con `?debug=1`.
  if (typeof location !== 'undefined' && /[?&]debug=1/.test(location.search || '')) {
    window.PokemonAscoliDebug = {
      state: () => ({
        mode, map: player.map, x: player.x, y: player.y, direction: player.direction, moving: !!movement, approaching: approachingTrainerId,
        battle: battle ? { kind: battle.kind, enemy: battle.wild.species, enemyHp: battle.wild.hp, ally: activeMonster().species, allyHp: activeMonster().hp } : null,
        flags: save ? Object.keys(save.flags).filter(key => save.flags[key]) : [], badges: save ? save.badges : [], money: save ? save.money : 0,
        team: save ? save.team.map(m => ({ species: m.species, level: m.level, hp: m.hp, exp: m.exp })) : [], storage: save ? save.storage.length : 0,
        items: save ? { ...save.items } : {}
      }),
      teleport(map, x, y, direction) {
        movement = null;
        approachingTrainerId = null;
        player = { map, x, y, direction: direction || 'down', renderX: x, renderY: y, frame: 0 };
        currentMap = maps[map];
        initNpcs();
        updateLocation();
      },
      blocked: (x, y) => isBlocked(currentMap, x, y),
      tallGrass: (x, y) => isTallGrass(currentMap, x, y),
      npcs: () => visibleRuntimeNpcs().map(npc => ({ name: npc.name, x: npc.x, y: npc.y })),
      trainers: () => activeTrainersOnMap().map(t => ({ id: t.id, x: t.x, y: t.y, direction: t.direction, sight: t.sight, defeated: !!save.flags[Events.flagKeys.trainerFlag(t.id)] })),
      setFlags(flags, badges) { flags.forEach(flag => { save.flags[flag] = true; }); if (badges) save.badges = badges; },
      clearFlag(flag) { delete save.flags[flag]; },
      setTeam(list) { save.team = list.map(entry => Battle.createMonster(entry.species, entry.level)); if (list.some(entry => entry.hp)) save.team.forEach((monster, index) => { if (list[index].hp) monster.hp = list[index].hp; }); },
      setItems(items) { Object.assign(save.items, items); },
      heal() { save.team.forEach(restoreMonster); }
    };
  }

  const existingSave = loadSave();
  ui.continueButton.disabled = !existingSave;
  if (existingSave) {
    const badges = (existingSave.badges || []).length;
    const caught = Object.values(existingSave.dex.caught).filter(Boolean).length;
    ui.continueInfo.textContent = `${existingSave.name || 'Oliver'} · ${badges === 1 ? '1 medaglia' : `${badges} medaglie`} · Pokédex ${caught}`;
  }
  (existingSave ? ui.continueButton : ui.newGameButton).focus();
  currentMap = maps[data.start.map];
  initNpcs();
  updateLocation();
  requestAnimationFrame(gameLoop);

  window.PokemonAscoliGame = {
    _debug: { migrateSave, loadTrainers, freshSave, restoreMonster }
  };
}());
