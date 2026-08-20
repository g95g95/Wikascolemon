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
    'locationName', 'locationBanner', 'toast', 'labelLayer', 'titleScreen', 'newGameButton', 'continueButton',
    'dialogueScreen', 'dialogueName', 'dialogueText', 'dialogueChoices', 'dialogueClose',
    'learnMoveScreen', 'learnMoveText', 'learnMoveChoices',
    'shopScreen', 'shopList', 'shopMoney', 'shopClose', 'creditsScreen', 'creditsClose',
    'battleScreen', 'enemyName', 'enemyLevel', 'enemyHp', 'enemySprite', 'enemyStatus', 'enemyExclaim',
    'allyName', 'allyLevel', 'allyHp', 'allyHpText', 'allySprite', 'allyStatus', 'battleMessage',
    'battleActions', 'menuScreen', 'menuTabs', 'menuContent', 'menuClose', 'menuButton',
    'touchMenu', 'touchA', 'touchB'
  ].map(id => [id, document.getElementById(id)]));

  const STORAGE_KEY = 'pokemonAscoliSaveV1';
  const CONFIG_KEY = 'pokemonAscoliConfigV2';
  const TRAINERS_KEY = 'pokemonAscoliTrainersV1';
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
        ['buildings', 'transitions', 'npcs', 'encounterTable', 'encounterZones'].forEach(key => {
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
  let lastMoveAt = 0;
  let lastNpcMoveAt = 0;
  let toastTimer = 0;
  let bannerTimer = 0;
  let runtimeNpcs = [];
  let defeatedTrainerSightings = new Set();
  let approachingTrainerId = null;
  let audioContext = null;
  const heldDirections = [];
  const playerImage = new Image();
  playerImage.src = 'assets/player/oliver-sheet.png';

  // ---------------------------------------------------------------------
  // Salvataggio
  // ---------------------------------------------------------------------

  function freshSave() {
    return {
      version: 2,
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
      lastHeal: { map: data.respawn.map, x: data.respawn.x, y: data.respawn.y }
    };
  }

  function migrateSave(parsed) {
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
    let stored = save.player || data.start;
    if (!maps[stored.map] || isBlocked(maps[stored.map], stored.x, stored.y, true)) stored = data.start;
    player = { ...stored, renderX: stored.x, renderY: stored.y, frame: 0 };
    currentMap = maps[player.map];
    initNpcs();
    ui.titleScreen.hidden = true;
    mode = 'world';
    showLocation(currentMap.name);
    updateLocation();
    autoSave();
  }

  // ---------------------------------------------------------------------
  // Mostri
  // ---------------------------------------------------------------------

  function hasItem(itemId) {
    return !!(save.items && save.items[itemId] > 0);
  }

  function mapHasWater() {
    return (currentMap.waters || []).length > 0;
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
    const override = map.tileOverrides && map.tileOverrides[keyFor(x, y)];
    if (override) return override;
    if ((map.bridges || []).some(item => pointInRect(x, y, item))) return 'bridge';
    const water = (map.waters || []).find(item => pointInRect(x, y, item));
    if (water) return water.type || 'water';
    if ((map.plazas || []).some(item => pointInRect(x, y, item))) return 'piazza';
    const road = (map.roads || []).find(item => pointInRect(x, y, item));
    if (road) return road.type || 'road';
    return map.baseTile || 'erba';
  }

  function activeTrainersOnMap() {
    return Object.entries(trainersData.trainers)
      .filter(([id, trainer]) => trainer.map === player.map && Events.check(trainer.when, save))
      .map(([id, trainer]) => ({ id, ...trainer }));
  }

  function isBlocked(map, x, y, ignoreNpc = false) {
    if (x < 0 || y < 0 || x >= map.width || y >= map.height) return true;
    const override = map.collisionOverrides && map.collisionOverrides[keyFor(x, y)];
    if (override === false) return false;
    if (override === true) return true;
    const terrain = terrainAt(map, x, y);
    if (['water', 'mare', 'muro', 'albero', 'binari'].includes(terrain)) return true;
    if ((map.buildings || []).some(item => pointInRect(x, y, item))) return true;
    if (!ignoreNpc && runtimeNpcs.some(item => item.x === x && item.y === y)) return true;
    if (!ignoreNpc && save && activeTrainersOnMap().some(t => t.x === x && t.y === y && !save.flags[Events.flagKeys.trainerFlag(t.id)])) return true;
    return false;
  }

  function movePlayer(direction, now = performance.now()) {
    if (mode !== 'world' || movement) return;
    player.direction = direction;
    const vector = directions[direction];
    const targetX = player.x + vector.x;
    const targetY = player.y + vector.y;
    if (isBlocked(currentMap, targetX, targetY)) {
      player.frame = 0;
      playSound('bump');
      return;
    }
    movement = {
      start: now,
      duration: 170,
      fromX: player.x,
      fromY: player.y,
      toX: targetX,
      toY: targetY
    };
    player.frame = (player.frame + 1) % 4;
  }

  function updateMovement(now) {
    if (!movement) return;
    const progress = Math.min(1, (now - movement.start) / movement.duration);
    const eased = progress < .5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    player.renderX = movement.fromX + (movement.toX - movement.fromX) * eased;
    player.renderY = movement.fromY + (movement.toY - movement.fromY) * eased;
    if (progress < 1) return;
    player.x = movement.toX;
    player.y = movement.toY;
    player.renderX = player.x;
    player.renderY = player.y;
    movement = null;
    save.steps = (save.steps || 0) + 1;
    if (checkTrainerSight()) return;
    if (checkTransition()) return;
    checkEncounter();
    autoSave();
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
    player.map = exit.to;
    player.x = exit.spawnX;
    player.y = exit.spawnY;
    player.renderX = player.x;
    player.renderY = player.y;
    currentMap = maps[exit.to];
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
    const encounter = getEncounter(player.x, player.y);
    if (!encounter || Math.random() >= Number(encounter.rate)) return;
    const table = currentMap.encounterTable || [];
    if (!table.length) return;
    const entry = weightedEntry(table);
    const min = Number(entry.minLevel || 2);
    const max = Number(entry.maxLevel || min);
    const level = min + Math.floor(Math.random() * (max - min + 1));
    beginWildBattle(Battle.createMonster(entry.species, level));
  }

  function initNpcs() {
    runtimeNpcs = clone(currentMap.npcs || []).map((item, index) => ({ ...item, id: index, originX: item.x, originY: item.y }));
  }

  function visibleRuntimeNpcs() {
    return runtimeNpcs.filter(item => Events.check(item.when, save));
  }

  function updateNpcs(now) {
    if (mode !== 'world' || movement || now - lastNpcMoveAt < 1400) return;
    lastNpcMoveAt = now;
    runtimeNpcs.forEach(npc => {
      if (npc.movement === 'fermo' || !Events.check(npc.when, save)) return;
      const choices = npc.movement === 'orizzontale' ? ['left', 'right'] : ['up', 'down'];
      const vector = directions[choices[Math.floor(Math.random() * choices.length)]];
      const x = npc.x + vector.x;
      const y = npc.y + vector.y;
      const closeToOrigin = Math.abs(x - npc.originX) <= 3 && Math.abs(y - npc.originY) <= 3;
      const occupied = x === player.x && y === player.y;
      if (closeToOrigin && !occupied && !isBlocked(currentMap, x, y, true) && !runtimeNpcs.some(other => other !== npc && other.x === x && other.y === y)) {
        npc.x = x;
        npc.y = y;
      }
    });
  }

  // ---------------------------------------------------------------------
  // Interazione (NPC, edifici, allenatori)
  // ---------------------------------------------------------------------

  function interact() {
    if (mode !== 'world') return;
    const vector = directions[player.direction];
    const x = player.x + vector.x;
    const y = player.y + vector.y;

    const trainer = activeTrainersOnMap().find(t => t.x === x && t.y === y);
    if (trainer) {
      startTrainerEncounter(trainer);
      return;
    }

    const npc = visibleRuntimeNpcs().find(item => item.x === x && item.y === y);
    if (npc) {
      playSound('confirm');
      runScript(Events.npcScript(npc));
      return;
    }

    const building = (currentMap.buildings || []).find(item => item.door && item.door.x === x && item.door.y === y);
    if (building) {
      playSound('confirm');
      runScript(buildingScript(building));
      return;
    }

    playSound('bump');
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
    ui.dialogueScreen.hidden = true;
    ui.dialogueChoices.hidden = true;
    ui.dialogueChoices.innerHTML = '';
    if (mode === 'dialogue') mode = 'world';
  }

  // ---------------------------------------------------------------------
  // Runner eventi: implementazione host
  // ---------------------------------------------------------------------

  let dialogueResolve = null;

  const eventHost = {
    get save() { return save; },
    async say(name, text) {
      return new Promise(resolve => {
        ui.dialogueName.textContent = name || '';
        ui.dialogueText.textContent = text;
        ui.dialogueChoices.hidden = true;
        ui.dialogueChoices.innerHTML = '';
        ui.dialogueScreen.hidden = false;
        dialogueResolve = resolve;
      });
    },
    async choice(question, texts) {
      return new Promise(resolve => {
        ui.dialogueName.textContent = '';
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
      save.team.forEach(monster => { monster.hp = monster.stats.hp; monster.status = null; monster.sleepTurns = 0; });
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
      player.map = dest.map;
      player.x = dest.x;
      player.y = dest.y;
      player.direction = dest.direction || player.direction;
      player.renderX = player.x;
      player.renderY = player.y;
      currentMap = maps[dest.map];
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

  ui.dialogueClose.addEventListener('click', () => {
    if (dialogueResolve) {
      const resolve = dialogueResolve;
      dialogueResolve = null;
      resolve();
    }
  });
  ui.dialogueScreen.addEventListener('click', event => {
    if (event.target === ui.dialogueClose) return;
    if (dialogueResolve) {
      const resolve = dialogueResolve;
      dialogueResolve = null;
      resolve();
    }
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

  function walkTrainerAdjacent(trainer) {
    return new Promise(resolve => {
      const vector = directions[trainer.direction];
      const targetX = player.x - vector.x;
      const targetY = player.y - vector.y;
      const step = () => {
        if (trainer.x === targetX && trainer.y === targetY) { resolve(); return; }
        if (trainer.x < targetX) trainer.x += 1;
        else if (trainer.x > targetX) trainer.x -= 1;
        else if (trainer.y < targetY) trainer.y += 1;
        else if (trainer.y > targetY) trainer.y -= 1;
        setTimeout(step, 120);
      };
      step();
    });
  }

  async function startTrainerEncounter(trainer) {
    const defeated = !!save.flags[Events.flagKeys.trainerFlag(trainer.id)];
    if (!defeated && !save.team.length) { showToast('Non hai ancora un Pokémon: parla con Bobby al bar.'); return; }
    mode = 'dialogue';
    if (defeated) {
      await runner.run([{ say: trainer.lost, name: trainer.name }]);
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

  function pushMessages(events) {
    events.forEach(event => {
      if (event.type === 'text') messageQueue.push(event.text);
      if (event.type === 'status' && event.text) messageQueue.push(event.text);
    });
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
      playerStages: Battle.freshStages(),
      enemyStages: Battle.freshStages(),
      runAttempts: 0,
      onEnd
    };
    save.dex.seen[wild.species] = true;
    mode = 'battle';
    ui.battleScreen.hidden = false;
    ui.battleMessage.textContent = `È apparso ${data.species[wild.species].name} selvatico!`;
    renderBattle();
    showBattleMain();
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
        playerStages: Battle.freshStages(),
        enemyStages: Battle.freshStages(),
        runAttempts: 0,
        onEnd: resolve
      };
      mode = 'battle';
      ui.battleScreen.hidden = false;
      ui.battleMessage.textContent = `${trainer.name} ti sfida a duello!`;
      renderBattle();
      showBattleMain();
      playSound('encounter');
    });
  }

  function statusText(monster) {
    return monster.status && statusLabels[monster.status] ? statusLabels[monster.status] : '';
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
    ui.allyHp.style.width = `${Math.max(0, ally.hp / ally.stats.hp * 100)}%`;
    ui.enemyHp.style.width = `${Math.max(0, enemy.hp / enemy.stats.hp * 100)}%`;
    ui.allyHpText.textContent = `${Math.max(0, ally.hp)} / ${ally.stats.hp} PS`;
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
    const canRunAway = battle.kind === 'wild';
    ui.battleActions.append(
      actionButton('Lotta', showBattleMoves),
      actionButton('Borsa', showBattleBag),
      actionButton('Squadra', showBattleTeam),
      actionButton('Fuga', canRunAway ? tryRun : () => { showToast('Non puoi fuggire da una sfida!'); }, !canRunAway)
    );
  }

  function showBattleMoves() {
    ui.battleActions.innerHTML = '';
    const mon = activeMonster();
    const usable = mon.moves.some(slot => slot.pp > 0);
    if (!usable) {
      ui.battleActions.appendChild(actionButton('Lotta Disperata', () => playerAttack('struggle')));
      ui.battleActions.appendChild(actionButton('Indietro', showBattleMain));
      return;
    }
    mon.moves.forEach(slot => {
      const known = data.moves[slot.id];
      ui.battleActions.appendChild(actionButton(`${known.name} ${slot.pp}/${slot.maxPp}`, () => playerAttack(slot.id), slot.pp <= 0));
    });
    ui.battleActions.appendChild(actionButton('Indietro', showBattleMain));
  }

  function showBattleBag() {
    ui.battleActions.innerHTML = '';
    ui.battleActions.append(
      actionButton(`Ball ×${save.items.ball || 0}`, throwBall, battle.kind === 'trainer'),
      actionButton(`Pozione ×${save.items.potion || 0}`, useBattlePotion),
      actionButton(`Antidoto ×${save.items.antidote || 0}`, useBattleAntidote),
      actionButton('Indietro', showBattleMain)
    );
  }

  function showBattleTeam() {
    ui.battleActions.innerHTML = '';
    save.team.forEach((monster, index) => {
      const name = data.species[monster.species].name;
      const button = actionButton(`${name} ${monster.hp}/${monster.stats.hp}`, () => switchMonster(index));
      button.disabled = index === battle.activeIndex || monster.hp <= 0;
      ui.battleActions.appendChild(button);
    });
    ui.battleActions.appendChild(actionButton('Indietro', showBattleMain));
  }

  async function resolveTurn(playerAction) {
    ui.battleActions.innerHTML = '';
    const enemyAction = { type: 'move', moveId: Battle.chooseMove(battle.wild, activeMonster()) || 'struggle' };
    const order = Battle.turnOrder(
      { monster: activeMonster(), stages: battle.playerStages }, playerAction,
      { monster: battle.wild, stages: battle.enemyStages }, enemyAction,
      Math.random
    );

    for (const who of order) {
      if (who === 'player') {
        if (playerAction.type !== 'move') continue;
        if (activeMonster().hp <= 0 || battle.wild.hp <= 0) continue;
        const result = Battle.executeMove(activeMonster(), battle.wild, playerAction.moveId, battle.playerStages, battle.enemyStages, { rng: Math.random });
        pushMessages(result.events);
        await flushMessages();
        if (await checkFaints()) return;
      } else {
        if (activeMonster().hp <= 0 || battle.wild.hp <= 0) continue;
        const result = Battle.executeMove(battle.wild, activeMonster(), enemyAction.moveId, battle.enemyStages, battle.playerStages, { rng: Math.random });
        pushMessages(result.events);
        await flushMessages();
        if (await checkFaints()) return;
      }
    }

    const endEventsAlly = Battle.endOfTurn(activeMonster());
    pushMessages(endEventsAlly);
    const endEventsEnemy = Battle.endOfTurn(battle.wild);
    pushMessages(endEventsEnemy);
    if (messageQueue.length) await flushMessages();
    autoSave();
    if (await checkFaints()) return;
    renderBattle();
    showBattleMain();
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
    const winner = activeMonster();
    const gain = Battle.expGain(battle.wild, { trainer: battle.kind === 'trainer', participants: 1 });
    ui.battleMessage.textContent = `${data.species[battle.wild.species].name} è esausto! ${data.species[winner.species].name} ottiene ${gain} ESP.`;
    renderBattle();
    await sleep(700);
    const gainResult = Battle.gainExperience(winner, gain, { map: player.map, hasItem, mapHasWater: mapHasWater() });
    if (gainResult.levelsGained > 0) {
      ui.battleMessage.textContent = `${data.species[winner.species].name} è salito al livello ${winner.level}!`;
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
    for (const moveId of gainResult.learned) {
      await handleLevelUpLearn(winner, moveId);
    }
    autoSave();

    battle.enemyIndex += 1;
    if (battle.kind === 'trainer' && battle.enemyIndex < battle.enemyTeam.length) {
      battle.wild = battle.enemyTeam[battle.enemyIndex];
      battle.enemyStages = Battle.freshStages();
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
      ui.learnMoveText.textContent = `${data.species[monster.species].name} vuole imparare ${known.name}, ma conosce già 4 mosse. Quale mossa dimenticare?`;
      ui.learnMoveChoices.innerHTML = '';
      monster.moves.forEach((slot, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = `${data.moves[slot.id].name}`;
        button.addEventListener('click', () => {
          Battle.learnMove(monster, moveId, index);
          ui.learnMoveScreen.hidden = true;
          showToast(`${data.species[monster.species].name} ha imparato ${known.name}!`);
          resolve();
        });
        ui.learnMoveChoices.appendChild(button);
      });
      const giveUp = document.createElement('button');
      giveUp.type = 'button';
      giveUp.textContent = 'Rinuncia';
      giveUp.addEventListener('click', () => {
        ui.learnMoveScreen.hidden = true;
        resolve();
      });
      ui.learnMoveChoices.appendChild(giveUp);
      ui.learnMoveScreen.hidden = false;
    });
  }

  async function handleFaintedAlly() {
    ui.battleMessage.textContent = `${data.species[activeMonster().species].name} non può più combattere!`;
    renderBattle();
    await sleep(700);
    const next = save.team.findIndex(monster => monster.hp > 0);
    if (next === -1) {
      await sleep(300);
      handleWipe();
      return;
    }
    battle.activeIndex = next;
    battle.playerStages = Battle.freshStages();
    ui.battleMessage.textContent = `Avanti, ${data.species[activeMonster().species].name}!`;
    renderBattle();
    showBattleMain();
  }

  function playerAttack(moveId) {
    if (!battle) return;
    resolveTurn({ type: 'move', moveId });
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
      await sleep(500);
      for (let i = 0; i < attempt.shakes; i += 1) {
        ui.battleMessage.textContent = '...scrosh...';
        await sleep(450);
      }
      if (attempt.caught) {
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
      renderBattle();
      await sleep(500);
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

  function switchMonster(index) {
    if (!battle || index === battle.activeIndex || save.team[index].hp <= 0) return;
    battle.activeIndex = index;
    battle.playerStages = Battle.freshStages();
    ui.battleMessage.textContent = `Avanti, ${data.species[activeMonster().species].name}!`;
    renderBattle();
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
    ui.battleScreen.hidden = true;
    mode = 'world';
    const messages = { won: 'Vittoria!', win: 'Vittoria!', caught: null, fled: 'Sei fuggito.', lost: 'Sei stato sconfitto.' };
    if (messages[result]) showToast(messages[result]);
    autoSave();
    if (onEnd) onEnd(result);
  }

  function handleWipe() {
    save.team.forEach(monster => { monster.hp = monster.stats.hp; monster.status = null; monster.sleepTurns = 0; });
    if (battle && battle.kind === 'trainer') {
      save.money = Math.floor((save.money || 0) / 2);
      showToast('Hai perso metà dei tuoi Talleri.');
    }
    const destination = save.lastHeal || data.respawn;
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

  function openMenu(tab = 'team') {
    if (mode !== 'world') return;
    mode = 'menu';
    ui.menuScreen.hidden = false;
    renderMenu(tab);
    playSound('confirm');
  }

  function closeMenu() {
    if (mode !== 'menu') return;
    ui.menuScreen.hidden = true;
    mode = 'world';
  }

  function renderMenu(tab) {
    [...ui.menuTabs.querySelectorAll('button')].forEach(button => button.classList.toggle('active', button.dataset.tab === tab));
    if (tab === 'team') renderTeamMenu();
    if (tab === 'bag') renderBagMenu();
    if (tab === 'dex') renderDexMenu();
    if (tab === 'trainer') renderTrainerMenu();
    if (tab === 'deposit') renderDepositMenu();
    if (tab === 'save') renderSaveMenu();
    if (tab === 'settings') renderSettingsMenu();
  }

  function monsterRow(monster, action = '') {
    const species = data.species[monster.species];
    const hpPercent = Math.max(0, monster.hp / monster.stats.hp * 100);
    const status = statusText(monster);
    return `<div class="creature-row"><img src="assets/battle/${monster.species}-front.png" alt="${species.name}" onerror="this.style.display='none'"><div><strong>${species.name}</strong> Lv.${monster.level} ${status ? `<span class="status-badge">${status}</span>` : ''}<div class="bar"><i style="width:${hpPercent}%"></i></div><small>${monster.hp}/${monster.stats.hp} PS</small></div>${action}</div>`;
  }

  function renderTeamMenu() {
    ui.menuContent.innerHTML = `<h2>Squadra</h2>${save.team.map(monster => monsterRow(monster)).join('')}`;
  }

  function renderBagMenu() {
    const rows = Object.entries(data.items).map(([id, item]) => `<p>${item.name}: <strong>${save.items[id] || 0}</strong></p>`).join('');
    ui.menuContent.innerHTML = `<h2>Borsa</h2>${rows}<button id="healOutsidePotion">Usa Pozione sul primo ferito</button><button id="healOutsideAntidote">Usa Antidoto sul primo avvelenato</button>`;
    document.getElementById('healOutsidePotion').addEventListener('click', () => {
      const target = save.team.find(monster => monster.hp > 0 && monster.hp < monster.stats.hp);
      if (!target || !save.items.potion || save.items.potion <= 0) { showToast('Nessun utilizzo possibile.'); return; }
      save.items.potion -= 1;
      target.hp = Math.min(target.stats.hp, target.hp + 20);
      autoSave();
      renderBagMenu();
      showToast(`${data.species[target.species].name} recupera PS.`);
    });
    document.getElementById('healOutsideAntidote').addEventListener('click', () => {
      const target = save.team.find(monster => monster.status === 'psn');
      if (!target || !save.items.antidote || save.items.antidote <= 0) { showToast('Nessun utilizzo possibile.'); return; }
      save.items.antidote -= 1;
      target.status = null;
      autoSave();
      renderBagMenu();
      showToast(`${data.species[target.species].name} non è più avvelenato.`);
    });
  }

  function renderDexMenu() {
    const rows = Object.entries(data.species)
      .sort(([, a], [, b]) => a.number - b.number)
      .map(([id, species]) => {
        const seen = Boolean(save.dex.seen[id]);
        const caught = Boolean(save.dex.caught[id]);
        const name = seen ? species.name : '???';
        const detail = caught ? `${species.types.join(' / ')} · <a href="${species.wiki}" target="_blank" rel="noopener">Scheda completa</a>` : seen ? 'Avvistato' : 'Non avvistato';
        return `<div class="dex-row ${seen ? '' : 'unseen'}"><img src="assets/battle/${id}-front.png" alt="" onerror="this.style.display='none'"><div><strong>#${String(species.number).padStart(3, '0')} ${name}</strong><br><span>${detail}</span></div><span>${caught ? '●' : seen ? '◐' : '○'}</span></div>`;
      }).join('');
    ui.menuContent.innerHTML = `<h2>Pokédex del Piceno</h2>${rows}`;
  }

  function renderTrainerMenu() {
    const seenCount = Object.values(save.dex.seen).filter(Boolean).length;
    const caughtCount = Object.values(save.dex.caught).filter(Boolean).length;
    const allGyms = Object.values(trainersData.gyms).sort((a, b) => a.order - b.order);
    const badgeSlots = Array.from({ length: 8 }, (_, index) => {
      const gym = allGyms[index];
      const earned = gym && save.badges.includes(gym.leader ? (trainersData.trainers[gym.leader].gym || {}).badge : null);
      return `<div class="badge-slot ${earned ? 'earned' : ''}">${earned ? (trainersData.trainers[gym.leader].gym.badgeName || '') : (gym ? gym.name : '—')}</div>`;
    }).join('');
    ui.menuContent.innerHTML = `<h2>Allenatore</h2>
      <p>Nome: <strong>Oliver</strong></p>
      <p>Talleri: <strong>${save.money}</strong></p>
      <p>Passi: <strong>${save.steps || 0}</strong></p>
      <p>Pokédex: <strong>${caughtCount}</strong> catturati / <strong>${seenCount}</strong> visti</p>
      <p>Medaglie:</p>
      <div class="badge-grid">${badgeSlots}</div>`;
  }

  function renderDepositMenu() {
    const team = save.team.map((monster, index) => monsterRow(monster, `<button data-deposit="${index}">Deposita</button>`)).join('');
    const stored = save.storage.map((monster, index) => monsterRow(monster, `<button data-withdraw="${index}">Ritira</button>`)).join('');
    ui.menuContent.innerHTML = `<h2>Deposito</h2><strong>Squadra</strong>${team}<strong>Depositati</strong>${stored || '<p>Nessun Pokémon depositato.</p>'}`;
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
    ui.menuContent.innerHTML = `<h2>Salvataggio</h2><p>Il gioco salva automaticamente sul dispositivo.</p><button id="saveNow">Salva ora</button><button id="exportSave">Esporta JSON</button><label class="file-label">Importa JSON<input id="importSave" type="file" accept="application/json" hidden></label><button id="resetSave">Ricomincia</button>`;
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
    ui.menuContent.innerHTML = `<h2>Impostazioni</h2><button id="toggleSound">Effetti sonori: ${save.settings.sound ? 'attivi' : 'disattivati'}</button><p>Ambientazione: giorno fisso</p><p>Lingua: italiano</p>`;
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

  function cameraPosition() {
    const worldWidth = currentMap.width * data.tileSize;
    const worldHeight = currentMap.height * data.tileSize;
    return {
      x: Math.max(0, Math.min(worldWidth - canvas.width, player.renderX * data.tileSize + 8 - canvas.width / 2)),
      y: Math.max(0, Math.min(worldHeight - canvas.height, player.renderY * data.tileSize + 8 - canvas.height / 2))
    };
  }

  function drawBuildings(camera) {
    (currentMap.buildings || []).forEach(item => {
      const x = item.x * 16 - camera.x;
      const y = item.y * 16 - camera.y;
      const width = item.w * 16;
      const height = item.h * 16;
      if (x > canvas.width || y > canvas.height || x + width < 0 || y + height < 0) return;
      ctx.fillStyle = '#5b4738';
      ctx.fillRect(x - 2, y - 4, width + 4, height + 4);
      ctx.fillStyle = item.color || '#b77958';
      ctx.fillRect(x, y, width, height);
      ctx.fillStyle = '#e7d2a6';
      for (let windowX = x + 8; windowX < x + width - 7; windowX += 24) {
        ctx.fillRect(windowX, y + height - 10, 7, 6);
      }
      ctx.fillStyle = '#3d2f27';
      ctx.fillRect(x + width / 2 - 4, y + height - 11, 8, 11);
      if (item.kind === 'stadio') {
        ctx.fillStyle = '#447a45';
        ctx.fillRect(x + 16, y + 16, Math.max(0, width - 32), Math.max(0, height - 32));
        ctx.strokeStyle = '#e6e0c3';
        ctx.strokeRect(x + 24, y + 22, Math.max(0, width - 48), Math.max(0, height - 44));
      }
      drawWorldLabel(item.name, item.x + item.w / 2, item.y + item.h + .7, camera);
    });
  }

  const worldLabelPool = new Map();
  const worldLabelUsed = new Set();

  function drawWorldLabel(text, worldX, worldY, camera) {
    const x = worldX * 16 - camera.x;
    const y = worldY * 16 - camera.y;
    if (x < -120 || x > canvas.width + 120 || y < -12 || y > canvas.height + 12) return;
    const key = text + '@' + worldX + ',' + worldY;
    let el = worldLabelPool.get(key);
    if (!el) {
      el = document.createElement('span');
      el.className = 'world-label';
      el.textContent = text;
      ui.labelLayer.appendChild(el);
      worldLabelPool.set(key, el);
    }
    el.style.left = (x / canvas.width * 100) + '%';
    el.style.top = (y / canvas.height * 100) + '%';
    el.hidden = false;
    worldLabelUsed.add(key);
  }

  function flushWorldLabels() {
    worldLabelPool.forEach((el, key) => {
      if (!worldLabelUsed.has(key)) el.hidden = true;
    });
    worldLabelUsed.clear();
  }

  function drawNpcs(camera) {
    visibleRuntimeNpcs().forEach((npc, index) => {
      const x = npc.x * 16 - camera.x;
      const y = npc.y * 16 - camera.y;
      if (x < -16 || y < -20 || x > canvas.width || y > canvas.height) return;
      ctx.fillStyle = index % 2 ? '#425d93' : '#8b4c49';
      ctx.fillRect(Math.round(x + 4), Math.round(y + 4), 8, 10);
      ctx.fillStyle = '#e6bb8b';
      ctx.fillRect(Math.round(x + 5), Math.round(y), 6, 6);
      ctx.fillStyle = '#2c2a25';
      ctx.fillRect(Math.round(x + 5), Math.round(y), 6, 2);
    });
  }

  function drawTrainers(camera) {
    if (!save) return;
    activeTrainersOnMap().forEach(trainer => {
      const defeated = !!save.flags[Events.flagKeys.trainerFlag(trainer.id)];
      const x = trainer.x * 16 - camera.x;
      const y = trainer.y * 16 - camera.y;
      if (x < -16 || y < -20 || x > canvas.width || y > canvas.height) return;
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
      ctx.fillStyle = 'rgba(242,210,82,.55)';
      ctx.fillRect(x, y, item.w * 16, item.h * 16);
      drawWorldLabel(item.label, item.x + item.w / 2, item.y + item.h / 2, camera);
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
    for (let y = startY; y < endY; y += 1) {
      for (let x = startX; x < endX; x += 1) {
        drawTile(terrainAt(currentMap, x, y), x * 16 - camera.x, y * 16 - camera.y, x, y);
      }
    }
    drawTransitions(camera);
    drawBuildings(camera);
    (currentMap.labels || []).forEach(label => drawWorldLabel(label.text, label.x, label.y, camera));
    drawNpcs(camera);
    drawTrainers(camera);
    drawPlayer(camera);
    flushWorldLabels();
  }

  function playSound(kind) {
    if (!save || !save.settings.sound) return;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const frequencies = { confirm: 520, bump: 130, hit: 180, heal: 720, throw: 430, encounter: 250, transition: 380 };
      oscillator.frequency.value = frequencies[kind] || 330;
      oscillator.type = kind === 'hit' ? 'square' : 'triangle';
      gain.gain.setValueAtTime(.05, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .09);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + .1);
    } catch (_) { }
  }

  function gameLoop(now) {
    if (mode === 'world') {
      const held = heldDirections[heldDirections.length - 1];
      if (held && !movement && now - lastMoveAt > 190) {
        movePlayer(held, now);
        lastMoveAt = now;
      }
      updateMovement(now);
      updateNpcs(now);
    }
    if (mode !== 'title') renderWorld();
    requestAnimationFrame(gameLoop);
  }

  function addHeld(direction) {
    const index = heldDirections.indexOf(direction);
    if (index !== -1) heldDirections.splice(index, 1);
    heldDirections.push(direction);
    if (mode === 'world' && !movement) {
      movePlayer(direction);
      lastMoveAt = performance.now();
    }
  }

  function removeHeld(direction) {
    const index = heldDirections.indexOf(direction);
    if (index !== -1) heldDirections.splice(index, 1);
  }

  document.addEventListener('keydown', event => {
    const direction = keyDirections[event.code];
    if (direction) {
      event.preventDefault();
      if (!event.repeat) addHeld(direction);
      return;
    }
    if (event.code === 'Enter' || event.code === 'Space') {
      event.preventDefault();
      if (mode === 'dialogue') { if (dialogueResolve) { const r = dialogueResolve; dialogueResolve = null; r(); } return; }
      if (mode === 'battle') { advanceMessage(); return; }
      if (mode === 'credits') { closeCredits(); return; }
      interact();
    }
    if (event.code === 'KeyM') openMenu();
    if (event.code === 'Escape' || event.code === 'KeyX') {
      if (mode === 'menu') closeMenu();
      else if (mode === 'battle') showBattleMain();
      else if (mode === 'credits') closeCredits();
    }
  });
  document.addEventListener('keyup', event => {
    const direction = keyDirections[event.code];
    if (direction) removeHeld(direction);
  });
  window.addEventListener('blur', () => { heldDirections.length = 0; });

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
    if (mode === 'dialogue') { if (dialogueResolve) { const r = dialogueResolve; dialogueResolve = null; r(); } return; }
    if (mode === 'battle') { advanceMessage(); return; }
    if (mode === 'credits') { closeCredits(); return; }
    interact();
  });
  ui.touchB.addEventListener('click', () => {
    if (mode === 'menu') closeMenu();
    else if (mode === 'battle') showBattleMain();
  });
  ui.menuClose.addEventListener('click', closeMenu);
  ui.menuTabs.addEventListener('click', event => {
    const button = event.target.closest('[data-tab]');
    if (button) renderMenu(button.dataset.tab);
  });

  const existingSave = loadSave();
  ui.continueButton.disabled = !existingSave;
  currentMap = maps[data.start.map];
  initNpcs();
  updateLocation();
  requestAnimationFrame(gameLoop);

  window.PokemonAscoliGame = {
    _debug: { migrateSave, loadTrainers, freshSave }
  };
}());
