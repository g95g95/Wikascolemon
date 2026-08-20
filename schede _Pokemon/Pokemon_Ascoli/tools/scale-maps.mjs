// Tool usa-e-getta (ma versionato) per la scala ×3 delle mappe (task D0.5).
// Contiene le funzioni di trasformazione geometrica usate per calcolare le nuove coordinate
// delle 7 mappe/trainer. La riscrittura dei file maps/<id>.js e trainers/<id>.js è stata fatta
// applicando queste stesse regole (compresi gli aggiustamenti manuali per porte, ponti e
// cornici di alberi documentati nel report). Si può rilanciare per ricalcolare le coordinate:
//   node tools/scale-maps.mjs
//
// Regole di trasformazione:
// - Celle puntuali (npc x/y, allenatori x/y, start/respawn, spawnX/spawnY, door, labels):
//     (x, y) -> (3x+1, 3y+1)
// - Aree piene (waters, plazas, encounterZones): (x,y,w,h) -> (3x, 3y, 3w, 3h)
// - roads/bridges/transitions: (3x, 3y, 3w, 3h) per asse; ma se una dimensione originale è
//   "sottile" (<=4) quell'asse resta della dimensione originale:
//     - se l'elemento tocca il bordo mappa su quell'asse (coord=0 o coord+dim=dimMappa),
//       resta ancorato al bordo scalato corrispondente
//     - altrimenti viene centrato nel blocco 3×dim: coord' = 3*coord + floor((3*dim-dim)/2)
// - buildings: w'=2w, h'=2h, posizione (3x,3y); se ha door, l'edificio si sposta lungo l'asse
//   perpendicolare alla porta per restare adiacente alla porta scalata (P(doorX,doorY)).
// - npc/allenatori posti "davanti a una porta" nell'originale restano adiacenti alla porta
//   scalata finale (dopo l'eventuale shift dell'edificio), non alla formula P pura.
// - alberi di cornice (spessore 2, interrotta da passaggi/acqua) e boschetti 3x2/2x3 aggiunti
//   a mano nelle zone verdi libere di ogni mappa esterna.
export const P = (x, y) => [3 * x + 1, 3 * y + 1];
export const AREA = (x, y, w, h) => [3 * x, 3 * y, 3 * w, 3 * h];

function scaleThinAxis(coord, dim, mapDim) {
  if (dim > 4) return [3 * coord, 3 * dim];
  if (coord === 0) return [0, dim];
  if (coord + dim === mapDim) return [3 * mapDim - dim, dim];
  return [3 * coord + Math.floor((3 * dim - dim) / 2), dim];
}

export function scaleRect(x, y, w, h, mapW, mapH) {
  const [X, W] = scaleThinAxis(x, w, mapW);
  const [Y, H] = scaleThinAxis(y, h, mapH);
  return [X, Y, W, H];
}

export function scaleBuilding(x, y, w, h) {
  return [3 * x, 3 * y, 2 * w, 2 * h];
}
