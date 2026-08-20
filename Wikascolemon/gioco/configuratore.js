(function () {
  'use strict';

  const data = window.PokemonAscoliData;
  const trainersDefault = window.PokemonAscoliTrainers;
  const canvas = document.getElementById('editorCanvas');
  const ctx = canvas.getContext('2d');
  const storageKey = 'pokemonAscoliConfigV2';
  const trainersStorageKey = 'pokemonAscoliTrainersV1';
  const scale = 16;
  const gymTypes = [
    'Normale', 'Fuoco', 'Acqua', 'Erba', 'Elettro', 'Ghiaccio', 'Lotta', 'Veleno',
    'Terra', 'Volante', 'Psico', 'Coleottero', 'Roccia', 'Spettro', 'Drago', 'Buio',
    'Acciaio', 'Folletto'
  ];
  const ui = Object.fromEntries([
    'mapSelect', 'tileType', 'brushSize', 'collisionValue', 'encounterRate', 'cursorInfo',
    'objectName', 'objectWidth', 'objectHeight', 'objectColor', 'destinationMap', 'spawnX',
    'spawnY', 'npcDialogue', 'npcMovement', 'selectedIndex', 'updateObject', 'deleteObject',
    'objectList', 'encounterSpecies', 'minLevel', 'maxLevel', 'encounterWeight',
    'addEncounter', 'encounterList', 'exportConfig', 'importConfig', 'resetConfig', 'saveStatus',
    'trainerId', 'trainerIdView', 'trainerName', 'trainerClass', 'trainerDirection', 'trainerSight',
    'trainerSprite', 'trainerMoney', 'trainerBefore', 'trainerAfter', 'trainerLost', 'trainerWhen',
    'trainerTeam', 'addTeamMember', 'trainerIsGymLeader', 'gymFields', 'gymId', 'gymCity',
    'gymBadge', 'gymBadgeName', 'gymType', 'gymTm', 'updateTrainer', 'duplicateTrainer',
    'deleteTrainer', 'trainerList', 'gymTable', 'trainerProblems',
    'exportTrainers', 'importTrainers', 'resetTrainers', 'trainerSaveStatus'
  ].map(id => [id, document.getElementById(id)]));

  let tool = 'select';
  let config = loadConfig();
  let mapId = Object.keys(data.maps)[0];
  let painting = false;
  let draggedObject = null;
  let selection = null;
  let trainerConfig = loadTrainerConfig();
  let trainerSelection = null;
  let draggedTrainer = null;
  let teamRows = [];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createDefaultConfig() {
    const maps = {};
    Object.entries(data.maps).forEach(([id, map]) => {
      maps[id] = {
        tileOverrides: {},
        collisionOverrides: {},
        encounterCells: {},
        buildings: clone(map.buildings || []),
        transitions: clone(map.transitions || []),
        npcs: clone(map.npcs || []),
        encounterZones: clone(map.encounterZones || []),
        encounterTable: clone(map.encounterTable || [])
      };
    });
    return { version: 1, updatedAt: new Date().toISOString(), maps };
  }

  function loadConfig() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return createDefaultConfig();
      const parsed = JSON.parse(raw);
      if (parsed.version !== 1 || !parsed.maps) return createDefaultConfig();
      const defaults = createDefaultConfig();
      Object.keys(defaults.maps).forEach(id => {
        parsed.maps[id] = { ...defaults.maps[id], ...(parsed.maps[id] || {}) };
      });
      return parsed;
    } catch (_) {
      return createDefaultConfig();
    }
  }

  function createDefaultTrainerConfig() {
    return { version: 1, updatedAt: new Date().toISOString(), trainers: clone(trainersDefault.trainers), gyms: clone(trainersDefault.gyms) };
  }

  function isValidTrainersShape(parsed) {
    return parsed && parsed.version === 1 && parsed.trainers && typeof parsed.trainers === 'object'
      && parsed.gyms && typeof parsed.gyms === 'object';
  }

  function loadTrainerConfig() {
    try {
      const raw = localStorage.getItem(trainersStorageKey);
      if (!raw) return createDefaultTrainerConfig();
      const parsed = JSON.parse(raw);
      if (!isValidTrainersShape(parsed)) return createDefaultTrainerConfig();
      return parsed;
    } catch (_) {
      return createDefaultTrainerConfig();
    }
  }

  function saveTrainerConfig(message = 'Allenatori salvati automaticamente.') {
    trainerConfig.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(trainersStorageKey, JSON.stringify(trainerConfig));
      ui.trainerSaveStatus.textContent = message;
    } catch (_) {
      ui.trainerSaveStatus.textContent = 'Salvataggio locale non disponibile: esporta il JSON.';
    }
  }

  function trainerInRect(x, y, item) {
    return x >= item.x && y >= item.y && x < item.x + (item.w || 1) && y < item.y + (item.h || 1);
  }

  function trainerCellWalkable(map, x, y) {
    if (!map) return false;
    if (x < 0 || y < 0 || x >= map.width || y >= map.height) return false;
    if ((map.buildings || []).some(item => trainerInRect(x, y, item))) return false;
    if ((map.bridges || []).some(item => trainerInRect(x, y, item))) return true;
    return !(map.waters || []).some(item => trainerInRect(x, y, item));
  }

  // Pura: nessun accesso a DOM/localStorage. Riusata sia dal pannello "Problemi" sia dai test.
  function validateTrainers(trainerData, maps, species) {
    const problems = [];
    const trainers = trainerData.trainers || {};
    const gyms = trainerData.gyms || {};

    Object.entries(trainers).forEach(([id, trainer]) => {
      const map = maps[trainer.map];
      if (!map) {
        problems.push(`${id}: quartiere "${trainer.map}" inesistente`);
      } else if (trainer.x < 0 || trainer.y < 0 || trainer.x >= map.width || trainer.y >= map.height) {
        problems.push(`${id}: cella (${trainer.x}, ${trainer.y}) fuori dalla mappa`);
      } else if (!trainerCellWalkable(map, trainer.x, trainer.y)) {
        problems.push(`${id}: cella (${trainer.x}, ${trainer.y}) su edificio o acqua`);
      }

      if (!Array.isArray(trainer.team) || trainer.team.length === 0) {
        problems.push(`${id}: squadra vuota`);
      } else {
        trainer.team.forEach(member => {
          if (!species[member.species]) problems.push(`${id}: specie "${member.species}" inesistente`);
        });
      }

      if (trainer.gym && trainer.gym.id && !gyms[trainer.gym.id]) {
        problems.push(`${id}: palestra "${trainer.gym.id}" non definita in gyms`);
      }
    });

    Object.entries(gyms).forEach(([gymId, gym]) => {
      if (!gym.leader || !trainers[gym.leader]) problems.push(`${gymId}: leader di palestra non definito`);
    });

    const badgeOwners = {};
    Object.entries(trainers).forEach(([id, trainer]) => {
      if (trainer.gym && trainer.gym.badge != null) {
        const badge = trainer.gym.badge;
        if (badgeOwners[badge]) problems.push(`Medaglia ${badge} duplicata (${badgeOwners[badge]} e ${id})`);
        else badgeOwners[badge] = id;
      }
    });

    return problems;
  }

  function saveConfig(message = 'Modifiche salvate automaticamente.') {
    config.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(storageKey, JSON.stringify(config));
      ui.saveStatus.textContent = message;
    } catch (_) {
      ui.saveStatus.textContent = 'Salvataggio locale non disponibile: esporta il JSON.';
    }
  }

  function currentBaseMap() {
    return data.maps[mapId];
  }

  function currentConfig() {
    return config.maps[mapId];
  }

  function keyFor(x, y) {
    return `${x},${y}`;
  }

  function pointInRect(x, y, item) {
    return x >= item.x && y >= item.y && x < item.x + item.w && y < item.y + item.h;
  }

  function colorForTile(type) {
    return {
      erba: '#6da25c', road: '#a89572', travertino: '#b8ad91', piazza: '#cdbd98',
      water: '#4389aa', bridge: '#9d754d', muro: '#5d5a50'
    }[type] || '#6da25c';
  }

  function fillScaled(item, color) {
    ctx.fillStyle = color;
    ctx.fillRect(item.x * scale, item.y * scale, item.w * scale, item.h * scale);
  }

  function draw() {
    const base = currentBaseMap();
    const custom = currentConfig();
    canvas.width = base.width * scale;
    canvas.height = base.height * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = colorForTile(base.baseTile);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    (base.roads || []).forEach(item => fillScaled(item, colorForTile(item.type || 'road')));
    (base.plazas || []).forEach(item => fillScaled(item, colorForTile('piazza')));
    (base.waters || []).forEach(item => fillScaled(item, colorForTile('water')));
    (base.bridges || []).forEach(item => fillScaled(item, colorForTile('bridge')));
    (base.encounterZones || []).forEach(item => fillScaled(item, 'rgba(240,176,51,.18)'));

    Object.entries(custom.tileOverrides).forEach(([key, type]) => {
      const [x, y] = key.split(',').map(Number);
      ctx.fillStyle = colorForTile(type);
      ctx.fillRect(x * scale, y * scale, scale, scale);
    });
    Object.entries(custom.encounterCells).forEach(([key, rate]) => {
      const [x, y] = key.split(',').map(Number);
      ctx.fillStyle = Number(rate) > 0 ? 'rgba(240,176,51,.82)' : 'rgba(55,55,55,.68)';
      ctx.fillRect(x * scale, y * scale, scale, scale);
    });
    Object.entries(custom.collisionOverrides).forEach(([key, blocked]) => {
      const [x, y] = key.split(',').map(Number);
      ctx.fillStyle = blocked ? 'rgba(220,60,54,.82)' : 'rgba(62,180,202,.72)';
      ctx.fillRect(x * scale, y * scale, scale, scale);
    });

    custom.buildings.forEach((item, index) => {
      fillScaled(item, item.color || '#b77958');
      ctx.strokeStyle = selection && selection.type === 'buildings' && selection.index === index ? '#fff36b' : '#382b23';
      ctx.lineWidth = selection && selection.type === 'buildings' && selection.index === index ? 3 : 1;
      ctx.strokeRect(item.x * scale, item.y * scale, item.w * scale, item.h * scale);
      drawLabel(item.name, item.x * scale + item.w * scale / 2, item.y * scale + item.h * scale / 2);
    });
    custom.transitions.forEach((item, index) => {
      fillScaled(item, 'rgba(74,193,221,.85)');
      ctx.strokeStyle = selection && selection.type === 'transitions' && selection.index === index ? '#fff36b' : '#174d58';
      ctx.lineWidth = 2;
      ctx.strokeRect(item.x * scale, item.y * scale, item.w * scale, item.h * scale);
      drawLabel(item.label, item.x * scale + item.w * scale / 2, item.y * scale + item.h * scale / 2);
    });
    custom.npcs.forEach((item, index) => {
      ctx.fillStyle = selection && selection.type === 'npcs' && selection.index === index ? '#fff36b' : '#824d91';
      ctx.fillRect(item.x * scale - 2, item.y * scale - 2, scale + 4, scale + 4);
    });

    drawTrainers();

    ctx.strokeStyle = 'rgba(18,29,22,.13)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += scale) {
      ctx.beginPath(); ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y + .5); ctx.lineTo(canvas.width, y + .5); ctx.stroke();
    }
  }

  function drawLabel(text, x, y) {
    if (!text) return;
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    const width = ctx.measureText(text).width + 6;
    ctx.fillStyle = 'rgba(18,27,21,.82)';
    ctx.fillRect(x - width / 2, y - 7, width, 13);
    ctx.fillStyle = '#fff2c9';
    ctx.fillText(text, x, y + 3);
  }

  function colorForClass(classId) {
    let hash = 0;
    for (let i = 0; i < classId.length; i += 1) hash = (hash * 31 + classId.charCodeAt(i)) >>> 0;
    return `hsl(${hash % 360}, 65%, 60%)`;
  }

  function trainersOnCurrentMap() {
    return Object.entries(trainerConfig.trainers).filter(([, trainer]) => trainer.map === mapId);
  }

  function sightCells(trainer) {
    const cells = [];
    const deltas = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[trainer.direction] || [0, 1];
    for (let step = 1; step <= (trainer.sight || 0); step += 1) {
      cells.push({ x: trainer.x + deltas[0] * step, y: trainer.y + deltas[1] * step });
    }
    return cells;
  }

  function drawTrainers() {
    trainersOnCurrentMap().forEach(([id, trainer]) => {
      const selected = trainerSelection === id;
      sightCells(trainer).forEach(cell => {
        ctx.fillStyle = 'rgba(255, 243, 107, .18)';
        ctx.fillRect(cell.x * scale, cell.y * scale, scale, scale);
      });
      const color = colorForClass(trainer.class);
      const isLeader = !!trainer.gym;
      ctx.fillStyle = color;
      ctx.fillRect(trainer.x * scale + 2, trainer.y * scale + 2, scale - 4, scale - 4);
      ctx.strokeStyle = selected ? '#fff36b' : (isLeader ? '#f0b033' : '#1a1410');
      ctx.lineWidth = isLeader ? 3 : selected ? 3 : 1.5;
      ctx.strokeRect(trainer.x * scale + 2, trainer.y * scale + 2, scale - 4, scale - 4);
      if (isLeader) {
        ctx.fillStyle = '#f0b033';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('★', trainer.x * scale + scale / 2, trainer.y * scale + scale / 2 + 4);
      }
      const centerX = trainer.x * scale + scale / 2;
      const centerY = trainer.y * scale + scale / 2;
      const deltas = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[trainer.direction] || [0, 1];
      ctx.strokeStyle = '#fff2c9';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + deltas[0] * scale * 0.6, centerY + deltas[1] * scale * 0.6);
      ctx.stroke();
    });
  }

  function canvasPoint(event) {
    const box = canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(currentBaseMap().width - 1, Math.floor((event.clientX - box.left) / box.width * currentBaseMap().width))),
      y: Math.max(0, Math.min(currentBaseMap().height - 1, Math.floor((event.clientY - box.top) / box.height * currentBaseMap().height)))
    };
  }

  function applyBrush(x, y) {
    const custom = currentConfig();
    const size = Number(ui.brushSize.value);
    const radius = Math.floor(size / 2);
    for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
      for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
        const cellX = x + offsetX;
        const cellY = y + offsetY;
        if (cellX < 0 || cellY < 0 || cellX >= 256 || cellY >= 160) continue;
        const key = keyFor(cellX, cellY);
        if (tool === 'tile') custom.tileOverrides[key] = ui.tileType.value;
        if (tool === 'collision') {
          if (ui.collisionValue.value === 'default') delete custom.collisionOverrides[key];
          else custom.collisionOverrides[key] = ui.collisionValue.value === 'true';
        }
        if (tool === 'encounter') custom.encounterCells[key] = Math.max(0, Math.min(1, Number(ui.encounterRate.value)));
      }
    }
    draw();
  }

  function addObject(type, x, y) {
    const custom = currentConfig();
    if (type === 'building') {
      custom.buildings.push({
        x, y,
        w: Math.max(1, Number(ui.objectWidth.value)),
        h: Math.max(1, Number(ui.objectHeight.value)),
        name: ui.objectName.value || 'Edificio',
        color: ui.objectColor.value,
        kind: 'attività'
      });
      selectObject('buildings', custom.buildings.length - 1);
    }
    if (type === 'transition') {
      custom.transitions.push({
        x, y,
        w: Math.max(1, Number(ui.objectWidth.value)),
        h: Math.max(1, Number(ui.objectHeight.value)),
        to: ui.destinationMap.value,
        spawnX: Number(ui.spawnX.value),
        spawnY: Number(ui.spawnY.value),
        label: ui.objectName.value || 'Passaggio'
      });
      selectObject('transitions', custom.transitions.length - 1);
    }
    if (type === 'npc') {
      custom.npcs.push({
        x, y,
        name: ui.objectName.value || 'NPC',
        dialogue: ui.npcDialogue.value || 'Ciao!',
        movement: ui.npcMovement.value
      });
      selectObject('npcs', custom.npcs.length - 1);
    }
    saveConfig();
    renderLists();
    draw();
  }

  function hitTest(x, y) {
    const custom = currentConfig();
    for (let index = custom.npcs.length - 1; index >= 0; index -= 1) {
      const item = custom.npcs[index];
      if (item.x === x && item.y === y) return { type: 'npcs', index };
    }
    for (const type of ['transitions', 'buildings']) {
      for (let index = custom[type].length - 1; index >= 0; index -= 1) {
        if (pointInRect(x, y, custom[type][index])) return { type, index };
      }
    }
    return null;
  }

  function trainerHitTest(x, y) {
    const entries = trainersOnCurrentMap();
    for (let i = entries.length - 1; i >= 0; i -= 1) {
      const [id, trainer] = entries[i];
      if (trainer.x === x && trainer.y === y) return id;
    }
    return null;
  }

  function selectObject(type, index) {
    selection = { type, index };
    const item = currentConfig()[type][index];
    if (!item) return;
    ui.selectedIndex.value = `${type}:${index}`;
    ui.objectName.value = item.name || item.label || '';
    ui.objectWidth.value = item.w || 1;
    ui.objectHeight.value = item.h || 1;
    ui.objectColor.value = item.color || '#b77958';
    ui.destinationMap.value = item.to || ui.destinationMap.value;
    ui.spawnX.value = item.spawnX ?? 3;
    ui.spawnY.value = item.spawnY ?? 3;
    ui.npcDialogue.value = item.dialogue || '';
    ui.npcMovement.value = item.movement || 'fermo';
    draw();
  }

  function updateSelected() {
    if (!selection) return;
    const item = currentConfig()[selection.type][selection.index];
    if (!item) return;
    if (selection.type === 'buildings') {
      item.name = ui.objectName.value;
      item.w = Math.max(1, Number(ui.objectWidth.value));
      item.h = Math.max(1, Number(ui.objectHeight.value));
      item.color = ui.objectColor.value;
    }
    if (selection.type === 'transitions') {
      item.label = ui.objectName.value;
      item.w = Math.max(1, Number(ui.objectWidth.value));
      item.h = Math.max(1, Number(ui.objectHeight.value));
      item.to = ui.destinationMap.value;
      item.spawnX = Number(ui.spawnX.value);
      item.spawnY = Number(ui.spawnY.value);
    }
    if (selection.type === 'npcs') {
      item.name = ui.objectName.value;
      item.dialogue = ui.npcDialogue.value;
      item.movement = ui.npcMovement.value;
    }
    saveConfig();
    renderLists();
    draw();
  }

  function deleteSelected() {
    if (!selection) return;
    currentConfig()[selection.type].splice(selection.index, 1);
    selection = null;
    ui.selectedIndex.value = '';
    saveConfig('Elemento eliminato.');
    renderLists();
    draw();
  }

  function generateTrainerId(classId) {
    const base = `${mapId}_${classId}`;
    let n = 1;
    while (trainerConfig.trainers[`${base}_${n}`]) n += 1;
    return `${base}_${n}`;
  }

  function learnsetUpTo(speciesId, level) {
    const species = data.species[speciesId];
    if (!species) return [];
    return species.learnset.filter(([lvl]) => lvl <= level).map(([, moveId]) => moveId);
  }

  function renderTeamRows() {
    ui.trainerTeam.innerHTML = teamRows.map((row, index) => {
      const speciesOptions = Object.entries(data.species)
        .sort(([, a], [, b]) => a.number - b.number)
        .map(([id, sp]) => `<option value="${id}" ${row.species === id ? 'selected' : ''}>#${String(sp.number).padStart(3, '0')} ${escapeHtml(sp.name)}</option>`)
        .join('');
      const learnset = row.species ? learnsetUpTo(row.species, row.level) : [];
      const moveOptionsFor = slotValue => ['<option value="">(automatico)</option>']
        .concat(learnset.map(moveId => {
          const move = data.moves[moveId];
          return `<option value="${moveId}" ${slotValue === moveId ? 'selected' : ''}>${escapeHtml(move ? move.name : moveId)}</option>`;
        })).join('');
      const moveSelects = [0, 1, 2, 3].map(slot =>
        `<select data-team-move="${index}" data-slot="${slot}">${moveOptionsFor(row.moves[slot] || '')}</select>`
      ).join('');
      return `<div class="object-item team-row">
        <div class="two-cols">
          <select data-team-species="${index}">${speciesOptions}</select>
          <input type="number" min="1" max="100" value="${row.level}" data-team-level="${index}">
        </div>
        <div class="four-cols">${moveSelects}</div>
        <div class="action-row">
          <button type="button" data-team-up="${index}">↑</button>
          <button type="button" data-team-down="${index}">↓</button>
          <button type="button" class="danger" data-team-remove="${index}">Rimuovi</button>
        </div>
      </div>`;
    }).join('');

    ui.trainerTeam.querySelectorAll('[data-team-species]').forEach(el => el.addEventListener('change', () => {
      teamRows[Number(el.dataset.teamSpecies)].species = el.value;
      teamRows[Number(el.dataset.teamSpecies)].moves = [null, null, null, null];
      renderTeamRows();
    }));
    ui.trainerTeam.querySelectorAll('[data-team-level]').forEach(el => el.addEventListener('change', () => {
      teamRows[Number(el.dataset.teamLevel)].level = Math.max(1, Math.min(100, Number(el.value)));
      renderTeamRows();
    }));
    ui.trainerTeam.querySelectorAll('[data-team-move]').forEach(el => el.addEventListener('change', () => {
      const index = Number(el.dataset.teamMove);
      const slot = Number(el.dataset.slot);
      teamRows[index].moves[slot] = el.value || null;
    }));
    ui.trainerTeam.querySelectorAll('[data-team-up]').forEach(el => el.addEventListener('click', () => {
      const index = Number(el.dataset.teamUp);
      if (index === 0) return;
      [teamRows[index - 1], teamRows[index]] = [teamRows[index], teamRows[index - 1]];
      renderTeamRows();
    }));
    ui.trainerTeam.querySelectorAll('[data-team-down]').forEach(el => el.addEventListener('click', () => {
      const index = Number(el.dataset.teamDown);
      if (index === teamRows.length - 1) return;
      [teamRows[index + 1], teamRows[index]] = [teamRows[index], teamRows[index + 1]];
      renderTeamRows();
    }));
    ui.trainerTeam.querySelectorAll('[data-team-remove]').forEach(el => el.addEventListener('click', () => {
      if (teamRows.length <= 1) return;
      teamRows.splice(Number(el.dataset.teamRemove), 1);
      renderTeamRows();
    }));
  }

  function teamRowsToTeam() {
    return teamRows
      .filter(row => row.species)
      .map(row => {
        const moves = row.moves.filter(Boolean);
        const member = { species: row.species, level: row.level };
        if (moves.length) member.moves = moves;
        return member;
      });
  }

  function teamToRows(team) {
    return (team && team.length ? team : [{ species: '', level: 5 }]).map(member => ({
      species: member.species || '',
      level: member.level || 5,
      moves: [member.moves && member.moves[0], member.moves && member.moves[1], member.moves && member.moves[2], member.moves && member.moves[3]]
    }));
  }

  function linesToArray(text) {
    return text.split('\n').map(line => line.trim()).filter(Boolean);
  }

  function toggleGymFields() {
    ui.gymFields.style.display = ui.trainerIsGymLeader.checked ? '' : 'none';
  }

  function selectTrainer(id) {
    trainerSelection = id;
    const trainer = trainerConfig.trainers[id];
    if (!trainer) return;
    ui.trainerId.value = id;
    ui.trainerId.dataset.x = trainer.x;
    ui.trainerId.dataset.y = trainer.y;
    ui.trainerIdView.value = id;
    ui.trainerName.value = trainer.name || '';
    ui.trainerClass.value = trainer.class;
    ui.trainerDirection.value = trainer.direction || 'down';
    ui.trainerSight.value = trainer.sight ?? 4;
    ui.trainerSprite.value = trainer.sprite || '';
    ui.trainerMoney.value = trainer.money ?? '';
    ui.trainerBefore.value = (trainer.before || []).join('\n');
    ui.trainerAfter.value = (trainer.after || []).join('\n');
    ui.trainerLost.value = trainer.lost || '';
    ui.trainerWhen.value = trainer.when ? JSON.stringify(trainer.when) : '';
    teamRows = teamToRows(trainer.team);
    renderTeamRows();
    ui.trainerIsGymLeader.checked = !!trainer.gym;
    if (trainer.gym) {
      ui.gymId.value = trainer.gym.id || '';
      const gym = trainerConfig.gyms[trainer.gym.id];
      ui.gymCity.value = (gym && gym.city) || '';
      ui.gymBadge.value = trainer.gym.badge ?? 1;
      ui.gymBadgeName.value = trainer.gym.badgeName || '';
      ui.gymType.value = trainer.gym.type || gymTypes[0];
      ui.gymTm.value = trainer.gym.tm || '';
    } else {
      ui.gymId.value = '';
      ui.gymCity.value = '';
      ui.gymBadge.value = 1;
      ui.gymBadgeName.value = '';
      ui.gymTm.value = '';
    }
    toggleGymFields();
    draw();
    renderTrainerList();
  }

  function readTrainerForm() {
    let when = null;
    const whenText = ui.trainerWhen.value.trim();
    if (whenText) {
      try {
        when = JSON.parse(whenText);
      } catch (_) {
        ui.trainerSaveStatus.textContent = 'Condizione "when" non è JSON valido: campo non salvato.';
        when = undefined;
      }
    }
    const money = ui.trainerMoney.value === '' ? null : Math.max(0, Number(ui.trainerMoney.value));
    const trainer = {
      map: mapId,
      x: Number(ui.trainerId.dataset.x || 0),
      y: Number(ui.trainerId.dataset.y || 0),
      direction: ui.trainerDirection.value,
      sight: Math.max(0, Math.min(8, Number(ui.trainerSight.value))),
      class: ui.trainerClass.value,
      name: ui.trainerName.value || 'Allenatore',
      sprite: ui.trainerSprite.value || null,
      team: teamRowsToTeam(),
      before: linesToArray(ui.trainerBefore.value),
      after: linesToArray(ui.trainerAfter.value),
      lost: ui.trainerLost.value || '',
      money,
      gym: null
    };
    if (when !== undefined) trainer.when = when;
    if (ui.trainerIsGymLeader.checked) {
      const gymId = ui.gymId.value.trim();
      trainer.gym = {
        id: gymId,
        badge: Math.max(1, Math.min(8, Number(ui.gymBadge.value))),
        badgeName: ui.gymBadgeName.value || '',
        type: ui.gymType.value,
        tm: ui.gymTm.value || null
      };
    }
    return trainer;
  }

  function syncGymFromTrainer(id, trainer) {
    if (!trainer.gym || !trainer.gym.id) return;
    const gymId = trainer.gym.id;
    const existing = trainerConfig.gyms[gymId];
    const city = ui.gymCity.value.trim();
    trainerConfig.gyms[gymId] = {
      name: existing && existing.name ? existing.name : `Palestra di ${city || 'città sconosciuta'}`,
      city: city || (existing && existing.city) || '',
      leader: id,
      map: trainer.map,
      order: existing && existing.order ? existing.order : Object.keys(trainerConfig.gyms).length + 1,
      type: trainer.gym.type
    };
  }

  function addOrUpdateTrainer(id, trainer) {
    trainerConfig.trainers[id] = trainer;
    syncGymFromTrainer(id, trainer);
    saveTrainerConfig();
    renderTrainerList();
    renderGymTable();
    renderTrainerProblems();
    draw();
  }

  function createTrainerAt(x, y) {
    const classId = ui.trainerClass.value || Object.keys(trainersDefault.classes)[0];
    const id = generateTrainerId(classId);
    const trainer = {
      map: mapId, x, y, direction: 'down', sight: 4, class: classId, name: 'Nuovo allenatore',
      sprite: null, team: [{ species: Object.keys(data.species)[0], level: 5 }],
      before: ['...'], after: ['...'], lost: '', money: null, gym: null, when: null
    };
    trainerConfig.trainers[id] = trainer;
    saveTrainerConfig('Allenatore creato.');
    selectTrainer(id);
    renderTrainerList();
    renderGymTable();
    renderTrainerProblems();
    draw();
  }

  function updateTrainer() {
    if (!trainerSelection) return;
    const existing = trainerConfig.trainers[trainerSelection];
    const trainer = readTrainerForm();
    trainer.x = existing.x;
    trainer.y = existing.y;
    addOrUpdateTrainer(trainerSelection, trainer);
  }

  function duplicateTrainer() {
    if (!trainerSelection) return;
    const source = trainerConfig.trainers[trainerSelection];
    const id = generateTrainerId(source.class);
    const copy = clone(source);
    copy.x = Math.min((data.maps[mapId].width || 48) - 1, source.x + 1);
    addOrUpdateTrainer(id, copy);
    selectTrainer(id);
  }

  function deleteTrainer() {
    if (!trainerSelection) return;
    delete trainerConfig.trainers[trainerSelection];
    Object.entries(trainerConfig.gyms).forEach(([gymId, gym]) => {
      if (gym.leader === trainerSelection) delete trainerConfig.gyms[gymId];
    });
    trainerSelection = null;
    saveTrainerConfig('Allenatore eliminato.');
    renderTrainerList();
    renderGymTable();
    renderTrainerProblems();
    draw();
  }

  function renderTrainerList() {
    const entries = trainersOnCurrentMap();
    ui.trainerList.innerHTML = entries.map(([id, trainer]) =>
      `<div class="object-item"><span>${trainer.gym ? '★ ' : ''}${escapeHtml(trainer.name)} (${escapeHtml(id)})</span><button data-select-trainer="${id}" type="button">Seleziona</button></div>`
    ).join('') || '<p class="hint">Nessun allenatore in questo quartiere.</p>';
    ui.trainerList.querySelectorAll('[data-select-trainer]').forEach(button =>
      button.addEventListener('click', () => selectTrainer(button.dataset.selectTrainer)));
  }

  function renderGymTable() {
    const rows = Object.entries(trainerConfig.gyms).sort(([, a], [, b]) => (a.order || 0) - (b.order || 0));
    ui.gymTable.innerHTML = rows.map(([id, gym]) =>
      `<div class="object-item"><span>#${gym.order ?? '?'} ${escapeHtml(gym.name)} · ${escapeHtml(gym.city || '')} · ${escapeHtml(gym.type || '')} · leader: ${escapeHtml(gym.leader || '—')}</span><button data-select-gym-leader="${gym.leader || ''}" type="button">Vai al leader</button></div>`
    ).join('') || '<p class="hint">Nessuna palestra definita.</p>';
    ui.gymTable.querySelectorAll('[data-select-gym-leader]').forEach(button => button.addEventListener('click', () => {
      const leaderId = button.dataset.selectGymLeader;
      const trainer = trainerConfig.trainers[leaderId];
      if (!trainer) return;
      mapId = trainer.map;
      ui.mapSelect.value = mapId;
      selection = null;
      renderLists();
      selectTrainer(leaderId);
      draw();
    }));
  }

  function renderTrainerProblems() {
    const problems = validateTrainers(trainerConfig, data.maps, data.species);
    ui.trainerProblems.innerHTML = problems.length
      ? problems.map(p => `<div class="object-item problem-item">${escapeHtml(p)}</div>`).join('')
      : '<p class="hint">Nessun problema rilevato.</p>';
  }

  function populateTrainerSelects() {
    Object.entries(trainersDefault.classes).forEach(([id, cls]) => ui.trainerClass.add(new Option(cls.name, id)));
    gymTypes.forEach(t => ui.gymType.add(new Option(t, t)));
    ui.gymTm.add(new Option('(nessuna)', ''));
    Object.entries(data.moves).sort(([, a], [, b]) => a.name.localeCompare(b.name))
      .forEach(([id, move]) => ui.gymTm.add(new Option(move.name, id)));
  }

  function exportTrainerJson() {
    saveTrainerConfig();
    const blob = new Blob([JSON.stringify(trainerConfig, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'pokemon-ascoli-allenatori.json';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function importTrainerJson(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!isValidTrainersShape(parsed)) throw new Error('Formato non valido');
        trainerConfig = parsed;
        trainerSelection = null;
        saveTrainerConfig('Allenatori importati. Ricarica il gioco per applicarli.');
        renderTrainerList();
        renderGymTable();
        renderTrainerProblems();
        draw();
      } catch (_) {
        ui.trainerSaveStatus.textContent = 'Il file selezionato non è una configurazione allenatori valida.';
      }
    };
    reader.readAsText(file);
  }

  function resetTrainerConfig() {
    if (!confirm('Ripristinare tutti gli allenatori e le palestre di default?')) return;
    trainerConfig = createDefaultTrainerConfig();
    trainerSelection = null;
    saveTrainerConfig('Allenatori ripristinati ai valori di default.');
    renderTrainerList();
    renderGymTable();
    renderTrainerProblems();
    draw();
  }

  function renderLists() {
    const custom = currentConfig();
    const groups = [
      ['buildings', 'Edificio', item => item.name],
      ['transitions', 'Passaggio', item => item.label],
      ['npcs', 'NPC', item => item.name]
    ];
    ui.objectList.innerHTML = groups.flatMap(([type, label, name]) => custom[type].map((item, index) =>
      `<div class="object-item"><span>${label}: ${escapeHtml(name(item) || 'senza nome')}</span><button data-select-type="${type}" data-select-index="${index}" type="button">Seleziona</button></div>`
    )).join('');
    ui.objectList.querySelectorAll('[data-select-type]').forEach(button => button.addEventListener('click', () => selectObject(button.dataset.selectType, Number(button.dataset.selectIndex))));

    ui.encounterList.innerHTML = custom.encounterTable.map((entry, index) => {
      const species = data.species[entry.species];
      return `<div class="object-item"><span>${escapeHtml(species ? species.name : entry.species)} · Lv.${entry.minLevel}-${entry.maxLevel} · peso ${entry.weight}</span><button data-remove-encounter="${index}" type="button">Rimuovi</button></div>`;
    }).join('');
    ui.encounterList.querySelectorAll('[data-remove-encounter]').forEach(button => button.addEventListener('click', () => {
      custom.encounterTable.splice(Number(button.dataset.removeEncounter), 1);
      saveConfig('Specie rimossa dalla tabella.');
      renderLists();
    }));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[character]));
  }

  function setTool(nextTool) {
    tool = nextTool;
    document.querySelectorAll('[data-tool]').forEach(button => button.classList.toggle('active', button.dataset.tool === tool));
  }

  function populateSelects() {
    Object.entries(data.maps).forEach(([id, map]) => {
      const option = new Option(map.name, id);
      ui.mapSelect.add(option);
      ui.destinationMap.add(option.cloneNode(true));
    });
    Object.entries(data.species)
      .sort(([, a], [, b]) => a.number - b.number)
      .forEach(([id, species]) => ui.encounterSpecies.add(new Option(species.name, id)));
    ui.mapSelect.value = mapId;
  }

  canvas.addEventListener('pointerdown', event => {
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    const point = canvasPoint(event);
    painting = ['tile', 'collision', 'encounter'].includes(tool);
    if (painting) applyBrush(point.x, point.y);
    else if (['building', 'transition', 'npc'].includes(tool)) addObject(tool, point.x, point.y);
    else if (tool === 'trainer') {
      const hitId = trainerHitTest(point.x, point.y);
      if (hitId) {
        selectTrainer(hitId);
        const trainer = trainerConfig.trainers[hitId];
        draggedTrainer = { id: hitId, offsetX: point.x - trainer.x, offsetY: point.y - trainer.y };
      } else {
        createTrainerAt(point.x, point.y);
      }
    } else {
      const hit = hitTest(point.x, point.y);
      if (hit) {
        selectObject(hit.type, hit.index);
        draggedObject = { ...hit, offsetX: point.x - currentConfig()[hit.type][hit.index].x, offsetY: point.y - currentConfig()[hit.type][hit.index].y };
      } else {
        selection = null;
        draw();
      }
    }
  });

  canvas.addEventListener('pointermove', event => {
    const point = canvasPoint(event);
    ui.cursorInfo.textContent = `Cella: ${point.x}, ${point.y}`;
    if (painting) applyBrush(point.x, point.y);
    if (draggedObject) {
      const item = currentConfig()[draggedObject.type][draggedObject.index];
      item.x = Math.max(0, Math.min(255, point.x - draggedObject.offsetX));
      item.y = Math.max(0, Math.min(159, point.y - draggedObject.offsetY));
      draw();
    }
    if (draggedTrainer) {
      const trainer = trainerConfig.trainers[draggedTrainer.id];
      trainer.x = Math.max(0, Math.min(255, point.x - draggedTrainer.offsetX));
      trainer.y = Math.max(0, Math.min(159, point.y - draggedTrainer.offsetY));
      draw();
    }
  });

  canvas.addEventListener('pointerup', () => {
    if (painting || draggedObject) saveConfig();
    if (draggedTrainer) {
      saveTrainerConfig();
      renderTrainerProblems();
    }
    painting = false;
    draggedObject = null;
    draggedTrainer = null;
    renderLists();
  });
  canvas.addEventListener('pointercancel', () => { painting = false; draggedObject = null; draggedTrainer = null; });

  document.querySelectorAll('[data-tool]').forEach(button => button.addEventListener('click', () => setTool(button.dataset.tool)));
  ui.mapSelect.addEventListener('change', () => {
    mapId = ui.mapSelect.value;
    selection = null;
    trainerSelection = null;
    renderLists();
    renderTrainerList();
    draw();
  });
  ui.updateObject.addEventListener('click', updateSelected);
  ui.deleteObject.addEventListener('click', deleteSelected);
  ui.addEncounter.addEventListener('click', () => {
    const min = Math.max(1, Number(ui.minLevel.value));
    const max = Math.max(min, Number(ui.maxLevel.value));
    currentConfig().encounterTable.push({
      species: ui.encounterSpecies.value,
      minLevel: min,
      maxLevel: max,
      weight: Math.max(1, Number(ui.encounterWeight.value))
    });
    saveConfig('Specie aggiunta alla tabella.');
    renderLists();
  });
  ui.exportConfig.addEventListener('click', () => {
    saveConfig();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'pokemon-ascoli-configurazione.json';
    link.click();
    URL.revokeObjectURL(link.href);
  });
  ui.importConfig.addEventListener('change', event => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (parsed.version !== 1 || !parsed.maps) throw new Error('Formato non valido');
        config = parsed;
        Object.keys(data.maps).forEach(id => {
          if (!config.maps[id]) config.maps[id] = createDefaultConfig().maps[id];
        });
        saveConfig('Configurazione importata. Ricarica il gioco per applicarla.');
        selection = null;
        renderLists();
        draw();
      } catch (_) {
        ui.saveStatus.textContent = 'Il file selezionato non è una configurazione valida.';
      }
    };
    reader.readAsText(file);
  });
  ui.resetConfig.addEventListener('click', () => {
    if (!confirm('Ripristinare tutte le mappe e cancellare le modifiche locali?')) return;
    config = createDefaultConfig();
    selection = null;
    saveConfig('Configurazione iniziale ripristinata.');
    renderLists();
    draw();
  });

  ui.addTeamMember.addEventListener('click', () => {
    if (teamRows.length >= 6) return;
    teamRows.push({ species: Object.keys(data.species)[0], level: 5, moves: [null, null, null, null] });
    renderTeamRows();
  });
  ui.trainerIsGymLeader.addEventListener('change', toggleGymFields);
  ui.updateTrainer.addEventListener('click', updateTrainer);
  ui.duplicateTrainer.addEventListener('click', duplicateTrainer);
  ui.deleteTrainer.addEventListener('click', deleteTrainer);
  ui.exportTrainers.addEventListener('click', exportTrainerJson);
  ui.importTrainers.addEventListener('change', event => {
    const file = event.target.files && event.target.files[0];
    if (file) importTrainerJson(file);
  });
  ui.resetTrainers.addEventListener('click', resetTrainerConfig);

  populateSelects();
  populateTrainerSelects();
  renderLists();
  teamRows = teamToRows(null);
  renderTeamRows();
  toggleGymFields();
  renderTrainerList();
  renderGymTable();
  renderTrainerProblems();
  draw();

  if (typeof module !== 'undefined') {
    module.exports = { validateTrainers };
  }
}());
