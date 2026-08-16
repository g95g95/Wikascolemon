(function () {
  'use strict';

  const data = window.PokemonAscoliData;
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const ui = Object.fromEntries([
    'locationName', 'locationBanner', 'toast', 'titleScreen', 'newGameButton', 'continueButton',
    'starterScreen', 'starterChoices', 'dialogueScreen', 'dialogueName', 'dialogueText',
    'dialogueClose', 'battleScreen', 'enemyName', 'enemyLevel', 'enemyHp', 'enemySprite',
    'allyName', 'allyLevel', 'allyHp', 'allyHpText', 'allySprite', 'battleMessage',
    'battleActions', 'menuScreen', 'menuTabs', 'menuContent', 'menuClose', 'menuButton',
    'touchMenu', 'touchA', 'touchB'
  ].map(id => [id, document.getElementById(id)]));

  const STORAGE_KEY = 'pokemonAscoliSaveV1';
  const CONFIG_KEY = 'pokemonAscoliConfigV1';
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

  let maps = loadMaps();
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
  let audioContext = null;
  const heldDirections = [];
  const playerImage = new Image();
  playerImage.src = 'assets/player/oliver-sheet.png';

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

  function freshSave() {
    return {
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      player: { ...data.start },
      starter: null,
      team: [],
      storage: [],
      items: clone(data.initialItems),
      dex: { seen: {}, caught: {} },
      settings: { sound: true },
      steps: 0
    };
  }

  function loadSave() {
    const raw = readStorage(STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.version !== 1 || !parsed.player) return null;
      parsed.team = (parsed.team || []).map(hydrateMonster);
      parsed.storage = (parsed.storage || []).map(hydrateMonster);
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
    const stored = save.player || data.start;
    player = { ...stored, renderX: stored.x, renderY: stored.y, frame: 0 };
    currentMap = maps[player.map] || maps[data.start.map];
    if (!maps[player.map]) player.map = data.start.map;
    initNpcs();
    ui.titleScreen.hidden = true;
    if (!save.starter) {
      mode = 'starter';
      showStarterSelection();
    } else {
      mode = 'world';
      showLocation(currentMap.name);
    }
    updateLocation();
  }

  function createMonster(speciesId, level) {
    const stats = calculateStats(speciesId, level);
    const knownMoves = data.species[speciesId].learnset
      .filter(([learnLevel]) => learnLevel <= level)
      .map(([, moveId]) => moveId)
      .slice(-4);
    return {
      uid: `${speciesId}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      species: speciesId,
      level,
      exp: 0,
      hp: stats.hp,
      stats,
      moves: knownMoves.length ? knownMoves : [data.species[speciesId].learnset[0][1]]
    };
  }

  function hydrateMonster(monster) {
    if (!data.species[monster.species]) return monster;
    const stats = calculateStats(monster.species, monster.level);
    return {
      ...monster,
      uid: monster.uid || `${monster.species}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      stats,
      hp: Math.min(Number.isFinite(monster.hp) ? monster.hp : stats.hp, stats.hp),
      moves: Array.isArray(monster.moves) && monster.moves.length ? monster.moves : movesFor(monster.species, monster.level)
    };
  }

  function calculateStats(speciesId, level) {
    const [hp, attack, defense, spAttack, spDefense, speed] = data.species[speciesId].base;
    const scale = value => Math.floor((2 * value * level) / 100) + 5;
    return {
      hp: Math.floor((2 * hp * level) / 100) + level + 10,
      attack: scale(attack), defense: scale(defense), spAttack: scale(spAttack),
      spDefense: scale(spDefense), speed: scale(speed)
    };
  }

  function movesFor(speciesId, level) {
    return data.species[speciesId].learnset
      .filter(([learnLevel]) => learnLevel <= level)
      .map(([, moveId]) => moveId)
      .slice(-4);
  }

  function showStarterSelection() {
    ui.starterChoices.innerHTML = '';
    data.starters.forEach(speciesId => {
      const species = data.species[speciesId];
      const button = document.createElement('button');
      button.className = 'pixel-button starter-choice';
      button.type = 'button';
      button.innerHTML = `<img src="assets/battle/${speciesId}-front.png" alt="${species.name}"><span>${species.name}</span><span>${species.types.join(' / ')}</span>`;
      button.addEventListener('click', () => chooseStarter(speciesId));
      ui.starterChoices.appendChild(button);
    });
    ui.starterScreen.hidden = false;
  }

  function chooseStarter(speciesId) {
    const monster = createMonster(speciesId, 5);
    save.starter = speciesId;
    save.team = [monster];
    save.dex.seen[speciesId] = true;
    save.dex.caught[speciesId] = true;
    ui.starterScreen.hidden = true;
    mode = 'world';
    autoSave();
    playSound('confirm');
    showLocation(currentMap.name);
    showToast(`${data.species[speciesId].name} è entrato nella squadra!`);
  }

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
    if ((map.waters || []).some(item => pointInRect(x, y, item))) return 'water';
    if ((map.plazas || []).some(item => pointInRect(x, y, item))) return 'piazza';
    const road = (map.roads || []).find(item => pointInRect(x, y, item));
    if (road) return road.type || 'road';
    return map.baseTile || 'erba';
  }

  function isBlocked(map, x, y, ignoreNpc = false) {
    if (x < 0 || y < 0 || x >= map.width || y >= map.height) return true;
    const override = map.collisionOverrides && map.collisionOverrides[keyFor(x, y)];
    if (override === false) return false;
    if (override === true) return true;
    const terrain = terrainAt(map, x, y);
    if (['water', 'muro', 'albero'].includes(terrain)) return true;
    if ((map.buildings || []).some(item => pointInRect(x, y, item))) return true;
    if (!ignoreNpc && runtimeNpcs.some(item => item.x === x && item.y === y)) return true;
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
    if (checkTransition()) return;
    checkEncounter();
    autoSave();
  }

  function checkTransition() {
    const exit = (currentMap.transitions || []).find(item => pointInRect(player.x, player.y, item));
    if (!exit || !maps[exit.to]) return false;
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
    beginBattle(createMonster(entry.species, level));
  }

  function initNpcs() {
    runtimeNpcs = clone(currentMap.npcs || []).map((item, index) => ({ ...item, id: index, originX: item.x, originY: item.y }));
  }

  function updateNpcs(now) {
    if (mode !== 'world' || movement || now - lastNpcMoveAt < 1400) return;
    lastNpcMoveAt = now;
    runtimeNpcs.forEach(npc => {
      if (npc.movement === 'fermo') return;
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

  function interact() {
    if (mode === 'dialogue') { closeDialogue(); return; }
    if (mode !== 'world') return;
    const vector = directions[player.direction];
    const x = player.x + vector.x;
    const y = player.y + vector.y;
    const found = runtimeNpcs.find(item => item.x === x && item.y === y);
    if (!found) {
      playSound('bump');
      return;
    }
    mode = 'dialogue';
    ui.dialogueName.textContent = found.name;
    ui.dialogueText.textContent = found.dialogue;
    ui.dialogueScreen.hidden = false;
    playSound('confirm');
  }

  function closeDialogue() {
    ui.dialogueScreen.hidden = true;
    mode = 'world';
  }

  function beginBattle(wild) {
    const activeIndex = Math.max(0, save.team.findIndex(monster => monster.hp > 0));
    battle = {
      wild,
      activeIndex,
      playerStages: freshStages(),
      enemyStages: freshStages()
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

  function freshStages() {
    return { attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 };
  }

  function stageMultiplier(stage) {
    return stage >= 0 ? (2 + stage) / 2 : 2 / (2 - stage);
  }

  function activeMonster() {
    return save.team[battle.activeIndex];
  }

  function renderBattle() {
    if (!battle) return;
    const ally = activeMonster();
    const enemy = battle.wild;
    const allySpecies = data.species[ally.species];
    const enemySpecies = data.species[enemy.species];
    ui.allyName.textContent = allySpecies.name;
    ui.allyLevel.textContent = `Lv.${ally.level}`;
    ui.enemyName.textContent = enemySpecies.name;
    ui.enemyLevel.textContent = `Lv.${enemy.level}`;
    ui.allyHp.style.width = `${Math.max(0, ally.hp / ally.stats.hp * 100)}%`;
    ui.enemyHp.style.width = `${Math.max(0, enemy.hp / enemy.stats.hp * 100)}%`;
    ui.allyHpText.textContent = `${Math.max(0, ally.hp)} / ${ally.stats.hp} PS`;
    ui.allySprite.src = `assets/battle/${ally.species}-back.png`;
    ui.allySprite.alt = allySpecies.name;
    ui.enemySprite.src = `assets/battle/${enemy.species}-front.png`;
    ui.enemySprite.alt = enemySpecies.name;
  }

  function actionButton(label, action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', action);
    return button;
  }

  function showBattleMain() {
    ui.battleActions.innerHTML = '';
    ui.battleActions.append(
      actionButton('Lotta', showBattleMoves),
      actionButton('Borsa', showBattleBag),
      actionButton('Squadra', showBattleTeam),
      actionButton('Fuga', tryRun)
    );
  }

  function showBattleMoves() {
    ui.battleActions.innerHTML = '';
    activeMonster().moves.forEach(moveId => {
      const known = data.moves[moveId];
      ui.battleActions.appendChild(actionButton(known.name, () => playerAttack(moveId)));
    });
    ui.battleActions.appendChild(actionButton('Indietro', showBattleMain));
  }

  function showBattleBag() {
    ui.battleActions.innerHTML = '';
    ui.battleActions.append(
      actionButton(`Ball ×${save.items.ball}`, throwBall),
      actionButton(`Pozione ×${save.items.potion}`, useBattlePotion),
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

  function typeMultiplier(moveType, targetTypes) {
    return targetTypes.reduce((value, targetType) => value * ((data.typeChart[moveType] || {})[targetType] ?? 1), 1);
  }

  function executeMove(attacker, defender, moveId, attackerStages, defenderStages) {
    const known = data.moves[moveId];
    const attackerSpecies = data.species[attacker.species];
    const defenderSpecies = data.species[defender.species];
    if (Math.random() * 100 >= known.accuracy) return { message: `${attackerSpecies.name} usa ${known.name}, ma fallisce!`, damage: 0 };
    if (!known.power) {
      const effect = known.effect;
      if (effect && effect.stat) {
        const stages = effect.target === 'self' ? attackerStages : defenderStages;
        stages[effect.stat] = Math.max(-6, Math.min(6, stages[effect.stat] + effect.stages));
      }
      return { message: `${attackerSpecies.name} usa ${known.name}!`, damage: 0 };
    }
    const physical = known.category === 'Fisico';
    const attackStat = physical ? 'attack' : 'spAttack';
    const defenseStat = physical ? 'defense' : 'spDefense';
    const attackValue = attacker.stats[attackStat] * stageMultiplier(attackerStages[attackStat]);
    const defenseValue = Math.max(1, defender.stats[defenseStat] * stageMultiplier(defenderStages[defenseStat]));
    const stab = attackerSpecies.types.includes(known.type) ? 1.5 : 1;
    const effectiveness = typeMultiplier(known.type, defenderSpecies.types);
    const random = .85 + Math.random() * .15;
    const damage = effectiveness === 0 ? 0 : Math.max(1, Math.floor(((((2 * attacker.level / 5) + 2) * known.power * attackValue / defenseValue) / 50 + 2) * stab * effectiveness * random));
    defender.hp = Math.max(0, defender.hp - damage);
    if (known.effect && known.effect.drain) attacker.hp = Math.min(attacker.stats.hp, attacker.hp + Math.max(1, Math.floor(damage * known.effect.drain)));
    let suffix = '';
    if (effectiveness > 1) suffix = ' È superefficace!';
    if (effectiveness > 0 && effectiveness < 1) suffix = ' Non è molto efficace.';
    if (effectiveness === 0) suffix = ' Non ha effetto.';
    return { message: `${attackerSpecies.name} usa ${known.name}!${suffix}`, damage };
  }

  function playerAttack(moveId) {
    if (!battle) return;
    ui.battleActions.innerHTML = '';
    const result = executeMove(activeMonster(), battle.wild, moveId, battle.playerStages, battle.enemyStages);
    ui.battleMessage.textContent = result.message;
    renderBattle();
    playSound(result.damage ? 'hit' : 'confirm');
    if (battle.wild.hp <= 0) {
      winBattle();
      return;
    }
    enemyTurn();
  }

  function enemyTurn() {
    if (!battle) return;
    const damaging = battle.wild.moves.filter(moveId => data.moves[moveId] && data.moves[moveId].power > 0);
    const movePool = damaging.length ? damaging : battle.wild.moves;
    const moveId = movePool[Math.floor(Math.random() * movePool.length)];
    const result = executeMove(battle.wild, activeMonster(), moveId, battle.enemyStages, battle.playerStages);
    ui.battleMessage.textContent += ` ${result.message}`;
    renderBattle();
    if (activeMonster().hp <= 0) handleFaintedAlly();
    else showBattleMain();
    autoSave();
  }

  function handleFaintedAlly() {
    const next = save.team.findIndex(monster => monster.hp > 0);
    if (next === -1) {
      handleWipe();
      return;
    }
    battle.activeIndex = next;
    battle.playerStages = freshStages();
    ui.battleMessage.textContent += ` Avanti, ${data.species[activeMonster().species].name}!`;
    renderBattle();
    showBattleMain();
  }

  function winBattle() {
    const defeated = battle.wild;
    const winner = activeMonster();
    const gain = defeated.level * 18;
    ui.battleMessage.textContent += ` ${data.species[defeated.species].name} è esausto. ${data.species[winner.species].name} ottiene ${gain} ESP.`;
    gainExperience(winner, gain);
    autoSave();
    setTimeout(() => endBattle('Vittoria!'), 650);
  }

  function gainExperience(monster, amount) {
    monster.exp = (monster.exp || 0) + amount;
    while (monster.exp >= monster.level * 25) {
      monster.exp -= monster.level * 25;
      const oldMax = monster.stats.hp;
      monster.level += 1;
      monster.stats = calculateStats(monster.species, monster.level);
      monster.hp += monster.stats.hp - oldMax;
      monster.moves = movesFor(monster.species, monster.level);
      const evolution = data.species[monster.species].evolution;
      const wet = player.map === 'porta_cartara';
      if (evolution && evolution.level && monster.level >= evolution.level && (!evolution.wet || wet) && (!evolution.location || evolution.location === player.map)) {
        monster.species = evolution.into;
        monster.stats = calculateStats(monster.species, monster.level);
        monster.hp = monster.stats.hp;
        monster.moves = movesFor(monster.species, monster.level);
        save.dex.seen[monster.species] = true;
        save.dex.caught[monster.species] = true;
        showToast(`Evoluzione: ora è ${data.species[monster.species].name}!`);
      }
    }
  }

  function throwBall() {
    if (save.items.ball <= 0) {
      ui.battleMessage.textContent = 'Non hai più Ball.';
      showBattleMain();
      return;
    }
    save.items.ball -= 1;
    const wild = battle.wild;
    const species = data.species[wild.species];
    const healthFactor = (3 * wild.stats.hp - 2 * wild.hp) / (3 * wild.stats.hp);
    const chance = Math.max(.06, Math.min(.92, healthFactor * species.catchRate / 180));
    playSound('throw');
    if (Math.random() < chance) {
      save.dex.caught[wild.species] = true;
      const destination = save.team.length < 6 ? save.team : save.storage;
      destination.push(wild);
      ui.battleMessage.textContent = `${species.name} è stato catturato! ${destination === save.storage ? 'È stato inviato al Deposito.' : ''}`;
      autoSave();
      setTimeout(() => endBattle(`${species.name} catturato!`), 650);
      return;
    }
    ui.battleMessage.textContent = `${species.name} si è liberato dalla Ball!`;
    enemyTurn();
  }

  function useBattlePotion() {
    const ally = activeMonster();
    if (save.items.potion <= 0) {
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
    enemyTurn();
  }

  function switchMonster(index) {
    if (!battle || index === battle.activeIndex || save.team[index].hp <= 0) return;
    battle.activeIndex = index;
    battle.playerStages = freshStages();
    ui.battleMessage.textContent = `Avanti, ${data.species[activeMonster().species].name}!`;
    renderBattle();
    enemyTurn();
  }

  function tryRun() {
    if (Math.random() < .75) {
      endBattle('Fuga riuscita.');
      return;
    }
    ui.battleMessage.textContent = 'Non riesci a fuggire!';
    enemyTurn();
  }

  function endBattle(message) {
    battle = null;
    ui.battleScreen.hidden = true;
    mode = 'world';
    showToast(message);
    autoSave();
  }

  function handleWipe() {
    save.team.forEach(monster => { monster.hp = monster.stats.hp; });
    player = { ...data.respawn, renderX: data.respawn.x, renderY: data.respawn.y, frame: 0 };
    currentMap = maps[player.map];
    initNpcs();
    battle = null;
    ui.battleScreen.hidden = true;
    mode = 'world';
    updateLocation();
    showLocation(currentMap.name);
    showToast('La squadra è stata curata. Sei tornato alla stazione.');
    autoSave();
  }

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
    if (tab === 'deposit') renderDepositMenu();
    if (tab === 'save') renderSaveMenu();
    if (tab === 'settings') renderSettingsMenu();
  }

  function monsterRow(monster, action = '') {
    const species = data.species[monster.species];
    const hpPercent = Math.max(0, monster.hp / monster.stats.hp * 100);
    return `<div class="creature-row"><img src="assets/battle/${monster.species}-front.png" alt="${species.name}"><div><strong>${species.name}</strong> Lv.${monster.level}<div class="bar"><i style="width:${hpPercent}%"></i></div><small>${monster.hp}/${monster.stats.hp} PS</small></div>${action}</div>`;
  }

  function renderTeamMenu() {
    ui.menuContent.innerHTML = `<h2>Squadra</h2>${save.team.map(monster => monsterRow(monster)).join('')}`;
  }

  function renderBagMenu() {
    ui.menuContent.innerHTML = `<h2>Borsa</h2><p>Ball: <strong>${save.items.ball}</strong></p><p>Pozioni: <strong>${save.items.potion}</strong></p><p>Acquasanta: <strong>${save.items.acquasanta}</strong></p><button id="healOutside">Usa Pozione sul primo ferito</button>`;
    document.getElementById('healOutside').addEventListener('click', () => {
      const target = save.team.find(monster => monster.hp > 0 && monster.hp < monster.stats.hp);
      if (!target || save.items.potion <= 0) { showToast('Nessun utilizzo possibile.'); return; }
      save.items.potion -= 1;
      target.hp = Math.min(target.stats.hp, target.hp + 20);
      autoSave();
      renderBagMenu();
      showToast(`${data.species[target.species].name} recupera PS.`);
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
        return `<div class="dex-row ${seen ? '' : 'unseen'}"><img src="assets/battle/${id}-front.png" alt=""><div><strong>#${String(species.number).padStart(3, '0')} ${name}</strong><br><span>${detail}</span></div><span>${caught ? '●' : seen ? '◐' : '○'}</span></div>`;
      }).join('');
    ui.menuContent.innerHTML = `<h2>Pokédex del Piceno</h2>${rows}`;
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
        if (parsed.version !== 1 || !parsed.player || !Array.isArray(parsed.team)) throw new Error('Formato non valido');
        writeStorage(STORAGE_KEY, JSON.stringify(parsed));
        location.reload();
      } catch (_) {
        showToast('Salvataggio JSON non valido.');
      }
    };
    reader.readAsText(file);
  }

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

  function drawWorldLabel(text, worldX, worldY, camera) {
    const x = worldX * 16 - camera.x;
    const y = worldY * 16 - camera.y;
    if (x < -120 || x > canvas.width + 120 || y < -12 || y > canvas.height + 12) return;
    ctx.font = '6px monospace';
    ctx.textAlign = 'center';
    const width = ctx.measureText(text).width + 6;
    ctx.fillStyle = 'rgba(25,31,25,.82)';
    ctx.fillRect(Math.round(x - width / 2), Math.round(y - 7), Math.ceil(width), 9);
    ctx.fillStyle = '#fff4cf';
    ctx.fillText(text, Math.round(x), Math.round(y));
  }

  function drawNpcs(camera) {
    runtimeNpcs.forEach((npc, index) => {
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
    drawPlayer(camera);
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
    renderWorld();
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
      interact();
    }
    if (event.code === 'KeyM') openMenu();
    if (event.code === 'Escape' || event.code === 'KeyX') {
      if (mode === 'dialogue') closeDialogue();
      else if (mode === 'menu') closeMenu();
      else if (mode === 'battle') showBattleMain();
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
  ui.dialogueClose.addEventListener('click', closeDialogue);
  ui.menuButton.addEventListener('click', () => openMenu());
  ui.touchMenu.addEventListener('click', () => openMenu());
  ui.touchA.addEventListener('click', interact);
  ui.touchB.addEventListener('click', () => {
    if (mode === 'dialogue') closeDialogue();
    else if (mode === 'menu') closeMenu();
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
}());
