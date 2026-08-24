// Local 2048: slide tiles, merge equals, reach 2048.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../../global.css';
import './game2048.css';
import {
  SIZE,
  WIN_VALUE,
  canMove,
  hasTile,
  move,
  newGame,
  spawnTile,
} from './game2048.js';

const BEST_KEY = 'pw-2048-best';
const SWIPE_MIN = 30;

const KEY_TO_DIR = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
  a: 'left',
  d: 'right',
  w: 'up',
  s: 'down',
  A: 'left',
  D: 'right',
  W: 'up',
  S: 'down',
};

/** Read persisted best score, or 0. */
function readBest() {
  try {
    const n = Number(localStorage.getItem(BEST_KEY));
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

/** Persist best score. */
function writeBest(value) {
  try {
    localStorage.setItem(BEST_KEY, String(value));
  } catch {
    /* ignore quota / private-mode failures */
  }
}

/** CSS class for a cell value. */
function cellClass(value, spawned) {
  const parts = ['game2048-cell', `game2048-cell--${value}`];
  if (value > WIN_VALUE) parts.push('game2048-cell--super');
  if (spawned) parts.push('game2048-cell--spawn');
  return parts.join(' ');
}

/**
 * @param {{ rng?: () => number, spawnFn?: typeof spawnTile }} props
 */
function Game2048Page({ rng = Math.random, spawnFn = spawnTile } = {}) {
  const [board, setBoard] = useState(() => newGame(rng));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(readBest);
  const [won, setWon] = useState(false);
  const [continued, setContinued] = useState(false);
  const [over, setOver] = useState(false);
  const [undo, setUndo] = useState(null);
  const [spawned, setSpawned] = useState(null);
  const swipeRef = useRef(null);

  const blocked = over || (won && !continued);

  /** Apply a slide; spawn if the board changed. */
  const handleMove = useCallback(
    (direction) => {
      if (blocked) return;
      const result = move(board, direction);
      if (!result.moved) return;

      const beforeSpawn = result.board;
      const next = spawnFn(beforeSpawn, rng);
      let spawnAt = null;
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (beforeSpawn[r][c] === 0 && next[r][c] !== 0) {
            spawnAt = `${r}-${c}`;
          }
        }
      }

      const nextScore = score + result.scoreDelta;
      const reachedWin = !won && hasTile(next, WIN_VALUE);
      const nextOver = !canMove(next) && !reachedWin;

      setUndo({ board, score, won, continued, over });
      setBoard(next);
      setScore(nextScore);
      setSpawned(spawnAt);
      if (reachedWin) setWon(true);
      if (nextOver) setOver(true);
      if (nextScore > best) {
        setBest(nextScore);
        writeBest(nextScore);
      }
    },
    [blocked, board, score, won, continued, over, best, rng, spawnFn],
  );

  /** Reset board, score, and flags. Keep best. */
  const handleReset = useCallback(() => {
    setBoard(newGame(rng));
    setScore(0);
    setWon(false);
    setContinued(false);
    setOver(false);
    setUndo(null);
    setSpawned(null);
  }, [rng]);

  /** Restore the previous board snapshot. */
  const handleUndo = useCallback(() => {
    if (!undo) return;
    setBoard(undo.board);
    setScore(undo.score);
    setWon(undo.won);
    setContinued(undo.continued);
    setOver(undo.over);
    setUndo(null);
    setSpawned(null);
  }, [undo]);

  /** Dismiss win overlay and keep playing. */
  const handleContinue = useCallback(() => {
    setContinued(true);
  }, []);

  useEffect(() => {
    /** Map arrow/WASD keys to a slide. */
    function onKey(e) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      const direction = KEY_TO_DIR[e.key];
      if (!direction) return;
      e.preventDefault();
      handleMove(direction);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleMove]);

  /** Store swipe start point. */
  function onTouchStart(e) {
    const t = e.changedTouches[0];
    swipeRef.current = { x: t.clientX, y: t.clientY };
  }

  /** Convert a swipe into a slide direction. */
  function onTouchEnd(e) {
    if (!swipeRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - swipeRef.current.x;
    const dy = t.clientY - swipeRef.current.y;
    swipeRef.current = null;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (Math.max(absX, absY) < SWIPE_MIN) return;
    if (absX > absY) handleMove(dx > 0 ? 'right' : 'left');
    else handleMove(dy > 0 ? 'down' : 'up');
  }

  let status = 'Join tiles to reach 2048';
  if (over) status = 'No moves left';
  else if (won && !continued) status = 'You reached 2048';

  const showWin = won && !continued && !over;
  const showLose = over;

  return (
    <main className="page game2048-page">
      <h1>Play 2048</h1>
      <p>Slide tiles with arrow keys, WASD, or a swipe. Equal tiles merge. Reach 2048 to win.</p>

      <div className="game2048-layout">
        <div
          className="game2048-board"
          role="grid"
          aria-label="2048 board"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {board.flatMap((row, r) =>
            row.map((value, c) => (
              <div
                key={`${r}-${c}`}
                role="gridcell"
                className={cellClass(value, spawned === `${r}-${c}`)}
                aria-label={value ? String(value) : 'empty'}
              >
                {value || ''}
              </div>
            )),
          )}
        </div>

        <aside className="game2048-panel">
          <div className="game2048-scores">
            <div className="game2048-score">
              <span className="game2048-score__label">Score</span>
              <span className="game2048-score__value">{score}</span>
            </div>
            <div className="game2048-score">
              <span className="game2048-score__label">Best</span>
              <span className="game2048-score__value">{best}</span>
            </div>
          </div>

          <p className="game2048-status">{status}</p>

          <div className="game2048-controls">
            <button type="button" className="button-primary" onClick={handleReset}>
              New game
            </button>
            <button
              type="button"
              className="button-outline"
              onClick={handleUndo}
              disabled={!undo}
            >
              Undo
            </button>
          </div>

          <p className="game2048-help">Merges score the new tile value. Best score is saved on this device.</p>
        </aside>
      </div>

      {showWin ? (
        <div className="game2048-overlay" role="dialog" aria-label="You won">
          <div className="game2048-overlay__card">
            <p>You reached 2048</p>
            <div className="game2048-overlay__actions">
              <button type="button" className="button-primary" onClick={handleContinue}>
                Continue
              </button>
              <button type="button" className="button-outline" onClick={handleReset}>
                New game
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showLose ? (
        <div className="game2048-overlay" role="dialog" aria-label="Game over">
          <div className="game2048-overlay__card">
            <p>No moves left</p>
            <div className="game2048-overlay__actions">
              <button type="button" className="button-primary" onClick={handleReset}>
                New game
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default Game2048Page;
