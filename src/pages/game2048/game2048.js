// 2048 board rules: spawn, slide, merge once, win/lose checks.

export const SIZE = 4;
export const WIN_VALUE = 2048;
const SPAWN_FOUR_CHANCE = 0.1;

/** Return a 4x4 board filled with zeros. */
export function createEmptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

/** Copy board rows so callers can mutate the clone. */
function cloneBoard(board) {
  return board.map((row) => row.slice());
}

/** List empty [row, col] pairs in row-major order. */
export function emptyCells(board) {
  const cells = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) cells.push([r, c]);
    }
  }
  return cells;
}

/** Place a 2 (90%) or 4 (10%) on a random empty cell. */
export function spawnTile(board, rng = Math.random) {
  const cells = emptyCells(board);
  if (cells.length === 0) return board;
  const next = cloneBoard(board);
  const [r, c] = cells[Math.floor(rng() * cells.length)];
  next[r][c] = rng() < 1 - SPAWN_FOUR_CHANCE ? 2 : 4;
  return next;
}

/** Start a game with two spawned tiles. */
export function newGame(rng = Math.random) {
  return spawnTile(spawnTile(createEmptyBoard(), rng), rng);
}

/** Slide non-zero tiles left and merge equal neighbors once. */
function slideRowLeft(row) {
  const tiles = [];
  for (let c = 0; c < SIZE; c++) {
    if (row[c] !== 0) tiles.push({ fromCol: c, value: row[c] });
  }
  const merged = [];
  const traces = [];
  let score = 0;
  let i = 0;
  let dest = 0;
  while (i < tiles.length) {
    if (i + 1 < tiles.length && tiles[i].value === tiles[i + 1].value) {
      const val = tiles[i].value * 2;
      traces.push({
        fromCol: tiles[i].fromCol,
        toCol: dest,
        value: tiles[i].value,
        merged: true,
        mergeValue: val,
      });
      traces.push({
        fromCol: tiles[i + 1].fromCol,
        toCol: dest,
        value: tiles[i + 1].value,
        merged: true,
        mergeValue: val,
      });
      merged.push(val);
      score += val;
      dest += 1;
      i += 2;
    } else {
      traces.push({
        fromCol: tiles[i].fromCol,
        toCol: dest,
        value: tiles[i].value,
        merged: false,
      });
      merged.push(tiles[i].value);
      dest += 1;
      i += 1;
    }
  }
  while (merged.length < SIZE) merged.push(0);
  return { row: merged, score, traces };
}

/** Rotate the board 90 degrees clockwise. */
function rotateClockwise(board) {
  const next = createEmptyBoard();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      next[c][SIZE - 1 - r] = board[r][c];
    }
  }
  return next;
}

/** Apply clockwise rotation `times` times. */
function rotateTimes(board, times) {
  let out = board;
  for (let i = 0; i < times; i++) out = rotateClockwise(out);
  return out;
}

/** Rotate (r, c) clockwise `times` times on a SIZE grid. */
function rotateCoord(r, c, times) {
  let row = r;
  let col = c;
  const n = ((times % 4) + 4) % 4;
  for (let i = 0; i < n; i++) {
    const nextR = col;
    const nextC = SIZE - 1 - row;
    row = nextR;
    col = nextC;
  }
  return [row, col];
}

const ROTATIONS_TO_LEFT = {
  left: 0,
  up: 3,
  right: 2,
  down: 1,
};

/** True when every cell matches. */
function boardsEqual(a, b) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}

/**
 * Slide the board in one direction.
 * @param {number[][]} board
 * @param {'left'|'right'|'up'|'down'} direction
 * @returns {{ board: number[][], scoreDelta: number, moved: boolean, traces: object[] }}
 */
export function move(board, direction) {
  const toLeft = ROTATIONS_TO_LEFT[direction];
  if (toLeft === undefined) {
    return { board, scoreDelta: 0, moved: false, traces: [] };
  }
  const rotated = rotateTimes(board, toLeft);
  let scoreDelta = 0;
  const rotatedTraces = [];
  const slid = rotated.map((row, r) => {
    const result = slideRowLeft(row);
    scoreDelta += result.score;
    for (const t of result.traces) {
      rotatedTraces.push({
        from: [r, t.fromCol],
        to: [r, t.toCol],
        value: t.value,
        merged: t.merged,
        ...(t.merged ? { mergeValue: t.mergeValue } : {}),
      });
    }
    return result.row;
  });
  const restored = rotateTimes(slid, (4 - toLeft) % 4);
  const moved = !boardsEqual(board, restored);
  const back = (4 - toLeft) % 4;
  const traces = moved
    ? rotatedTraces.map((t) => ({
        from: rotateCoord(t.from[0], t.from[1], back),
        to: rotateCoord(t.to[0], t.to[1], back),
        value: t.value,
        merged: t.merged,
        ...(t.merged ? { mergeValue: t.mergeValue } : {}),
      }))
    : [];
  return { board: restored, scoreDelta, moved, traces };
}

/** True if any slide would change the board. */
export function canMove(board) {
  if (emptyCells(board).length > 0) return true;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = board[r][c];
      if (c + 1 < SIZE && board[r][c + 1] === v) return true;
      if (r + 1 < SIZE && board[r + 1][c] === v) return true;
    }
  }
  return false;
}

/** True if any cell equals value. */
export function hasTile(board, value) {
  return board.some((row) => row.includes(value));
}
