import { describe, it, expect } from 'vitest'
import {
  canMove,
  createEmptyBoard,
  emptyCells,
  hasTile,
  move,
  newGame,
  spawnTile,
} from '../pages/game2048/game2048.js'

/** Sequential rng that returns listed values then 0. */
function seq(values) {
  let i = 0
  return () => (i < values.length ? values[i++] : 0)
}

describe('2048 engine', () => {
  it('creates a 4x4 empty board', () => {
    const board = createEmptyBoard()
    expect(board).toHaveLength(4)
    expect(board.every((row) => row.length === 4 && row.every((n) => n === 0))).toBe(true)
    expect(emptyCells(board)).toHaveLength(16)
  })

  it('spawns a 2 on the first empty cell when rng is 0', () => {
    const next = spawnTile(createEmptyBoard(), () => 0)
    expect(next[0][0]).toBe(2)
    expect(emptyCells(next)).toHaveLength(15)
  })

  it('spawns a 4 when the value roll is at least 0.9', () => {
    const next = spawnTile(createEmptyBoard(), seq([0, 0.95]))
    expect(next[0][0]).toBe(4)
  })

  it('starts a game with two tiles', () => {
    const board = newGame(() => 0)
    expect(board[0][0]).toBe(2)
    expect(board[0][1]).toBe(2)
    expect(emptyCells(board)).toHaveLength(14)
  })

  it('merges equal neighbors once when sliding left', () => {
    const { board, scoreDelta, moved } = move(
      [
        [2, 2, 2, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      'left',
    )
    expect(moved).toBe(true)
    expect(board[0]).toEqual([4, 2, 0, 0])
    expect(scoreDelta).toBe(4)
  })

  it('merges two pairs in one row', () => {
    const { board, scoreDelta } = move(
      [
        [2, 2, 2, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      'left',
    )
    expect(board[0]).toEqual([4, 4, 0, 0])
    expect(scoreDelta).toBe(8)
  })

  it('ignores a slide that does not change the board', () => {
    const start = [
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]
    const { board, scoreDelta, moved } = move(start, 'left')
    expect(moved).toBe(false)
    expect(scoreDelta).toBe(0)
    expect(board[0]).toEqual([2, 0, 0, 0])
  })

  it('slides right', () => {
    const { board } = move(
      [
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      'right',
    )
    expect(board[0]).toEqual([0, 0, 0, 2])
  })

  it('slides up and merges a column', () => {
    const { board, scoreDelta } = move(
      [
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      'up',
    )
    expect(board[0][0]).toBe(4)
    expect(board[1][0]).toBe(0)
    expect(scoreDelta).toBe(4)
  })

  it('slides down', () => {
    const { board } = move(
      [
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      'down',
    )
    expect(board[3][0]).toBe(2)
    expect(board[0][0]).toBe(0)
  })

  it('detects when no moves remain', () => {
    const full = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ]
    expect(canMove(full)).toBe(false)
  })

  it('detects a merge on a full board', () => {
    const full = [
      [2, 2, 4, 8],
      [4, 8, 2, 4],
      [8, 4, 8, 2],
      [4, 2, 4, 8],
    ]
    expect(canMove(full)).toBe(true)
  })

  it('finds a target tile value', () => {
    const board = [
      [2, 4, 8, 16],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 2048],
    ]
    expect(hasTile(board, 2048)).toBe(true)
    expect(hasTile(board, 1024)).toBe(false)
  })
})
