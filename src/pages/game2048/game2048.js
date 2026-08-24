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
  const tiles = row.filter((n) => n !== 0);
  const merged = [];
  let score = 0;
  let i = 0;
  while (i < tiles.length) {
    if (i + 1 < tiles.length && tiles[i] === tiles[i + 1]) {
      const val = tiles[i] * 2;
      merged.push(val);
      score += val;
      i += 2;
    } else {
      merged.push(tiles[i]);
      i += 1;
    }
  }
  while (merged.length < SIZE) merged.push(0);
  return { row: merged, score };
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
 * @returns {{ board: number[][], scoreDelta: number, moved: boolean }}
 */
export function move(board, direction) {
  const toLeft = ROTATIONS_TO_LEFT[direction];
  if (toLeft === undefined) {
    return { board, scoreDelta: 0, moved: false };
  }
  const rotated = rotateTimes(board, toLeft);
  let scoreDelta = 0;
  const slid = rotated.map((row) => {
    const result = slideRowLeft(row);
    scoreDelta += result.score;
    return result.row;
  });
  const restored = rotateTimes(slid, (4 - toLeft) % 4);
  return { board: restored, scoreDelta, moved: !boardsEqual(board, restored) };
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
