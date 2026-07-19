// Local chess: human vs human, or human (White) vs site agent (Black).


import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chess, DEFAULT_POSITION } from 'chess.js';
import '../global.css';
import './chess.css';
import { getChessBotMove } from './chessBot.js';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

// Unicode glyphs keyed by color+type.
const PIECE_GLYPHS = {
  w: { k: '\u2654', q: '\u2655', r: '\u2656', b: '\u2657', n: '\u2658', p: '\u2659' },
  b: { k: '\u265A', q: '\u265B', r: '\u265C', b: '\u265D', n: '\u265E', p: '\u265F' },
};

const PROMOTION_CHOICES = [
  { type: 'q', label: 'Queen' },
  { type: 'r', label: 'Rook' },
  { type: 'b', label: 'Bishop' },
  { type: 'n', label: 'Knight' },
];

// Sort captured pieces by value (queen → pawn).
const CAPTURE_ORDER = { q: 0, r: 1, b: 2, n: 3, p: 4 };

// Build "a8".."h1" square id from board() indices.
function squareId(row, col) {
  return FILES[col] + (8 - row);
}

/**
 * Replay SAN history; collect pieces each side has taken.
 * @param {string[]} sanHistory
 * @returns {{ white: { color: string, type: string }[], black: { color: string, type: string }[] }}
 */
function capturedFromHistory(sanHistory) {
  const game = new Chess();
  const white = [];
  const black = [];

  for (const san of sanHistory) {
    const move = game.move(san);
    if (!move?.captured) continue;
    const taken = { color: move.color === 'w' ? 'b' : 'w', type: move.captured };
    if (move.color === 'w') white.push(taken);
    else black.push(taken);
  }

  const byValue = (a, b) => CAPTURE_ORDER[a.type] - CAPTURE_ORDER[b.type];
  white.sort(byValue);
  black.sort(byValue);
  return { white, black };
}

/**
 * @param {{ mode: 'human' | 'bot' }} props
 */
function Chessboard({ mode }) {
  // Authoritative game; mutated only inside handlers, never read during render.
  const gameRef = useRef(new Chess());
  const botBusyRef = useRef(false);

  const [fen, setFen] = useState(DEFAULT_POSITION);
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [legalTargets, setLegalTargets] = useState([]);
  const [pendingPromotion, setPendingPromotion] = useState(null);
  const [botStatus, setBotStatus] = useState('');

  // Rebuild a read-only view from fen for rendering-derived values.
  const view = useMemo(() => new Chess(fen), [fen]);
  const board = view.board();
  const turn = view.turn();
  const vsBot = mode === 'bot';
  const humanTurn = !vsBot || turn === 'w';

  const status = useMemo(() => {
    if (view.isCheckmate()) return `Checkmate — ${turn === 'w' ? 'Black' : 'White'} wins`;
    if (view.isStalemate()) return 'Draw — stalemate';
    if (view.isInsufficientMaterial()) return 'Draw — insufficient material';
    if (view.isDraw()) return 'Draw';
    if (vsBot && turn === 'b') return botStatus || 'Bot (Black) thinking…';
    const side = turn === 'w' ? 'White' : 'Black';
    return view.inCheck() ? `${side} to move — check` : `${side} to move`;
  }, [view, turn, vsBot, botStatus]);

  const captured = useMemo(() => capturedFromHistory(history), [history]);

  function syncPosition() {
    const game = gameRef.current;
    setFen(game.fen());
    setHistory(game.history());
    setSelected(null);
    setLegalTargets([]);
  }

  // Apply move, deferring to picker when promotion is required (human only).
  function applyMove(from, to, promotion) {
    const game = gameRef.current;
    const target = game.moves({ square: from, verbose: true }).filter((m) => m.to === to);
    if (target.length === 0) return false;

    if (!promotion && target.some((m) => m.promotion)) {
      setPendingPromotion({ from, to });
      return false;
    }

    const result = game.move(promotion ? { from, to, promotion } : { from, to });
    if (!result) return false;
    syncPosition();
    return true;
  }

  function finishPromotion(pieceType) {
    const { from, to } = pendingPromotion;
    gameRef.current.move({ from, to, promotion: pieceType });
    setPendingPromotion(null);
    syncPosition();
  }

  function handleSquareClick(row, col) {
    if (pendingPromotion || view.isGameOver()) return;
    if (vsBot && turn === 'b') return;

    const id = squareId(row, col);
    const piece = board[row][col];

    if (selected) {
      if (id === selected) {
        setSelected(null);
        setLegalTargets([]);
        return;
      }
      if (legalTargets.includes(id)) {
        applyMove(selected, id);
        return;
      }
    }

    // Select own piece and show its legal destinations.
    if (piece && piece.color === turn && humanTurn) {
      setSelected(id);
      setLegalTargets(gameRef.current.moves({ square: id, verbose: true }).map((m) => m.to));
      return;
    }

    setSelected(null);
    setLegalTargets([]);
  }

  function handleReset() {
    gameRef.current.reset();
    setPendingPromotion(null);
    setBotStatus('');
    botBusyRef.current = false;
    syncPosition();
  }

  function handleUndo() {
    gameRef.current.undo();
    // Undo bot reply too so White can retry.
    if (vsBot && gameRef.current.turn() === 'b') {
      gameRef.current.undo();
    }
    setPendingPromotion(null);
    setBotStatus('');
    botBusyRef.current = false;
    syncPosition();
  }

  // Agent plays Black after each White move.
  useEffect(() => {
    if (!vsBot || turn !== 'b' || view.isGameOver() || pendingPromotion) return;
    if (botBusyRef.current) return;

    let cancelled = false;
    botBusyRef.current = true;

    const game = gameRef.current;
    const legalMoves = game.moves({ verbose: true });
    const currentFen = game.fen();

    getChessBotMove(currentFen, legalMoves).then((move) => {
      if (cancelled || gameRef.current.fen() !== currentFen) {
        botBusyRef.current = false;
        return;
      }
      if (!move) {
        setBotStatus('Bot could not move');
        botBusyRef.current = false;
        return;
      }
      const needsPromo = legalMoves.some(
        (m) => m.from === move.from && m.to === move.to && m.promotion,
      );
      const promotion = move.promotion || (needsPromo ? 'q' : undefined);
      const result = gameRef.current.move(
        promotion ? { from: move.from, to: move.to, promotion } : { from: move.from, to: move.to },
      );
      if (result) {
        setBotStatus('');
        syncPosition();
      } else {
        setBotStatus('Bot move failed');
      }
      botBusyRef.current = false;
    });

    return () => {
      cancelled = true;
    };
  }, [fen, vsBot, turn, pendingPromotion, view]);

  return (
    <div className="chess-layout">
      <div className="chess-board" role="grid" aria-label="Chess board">
        {board.map((rankRow, row) =>
          rankRow.map((piece, col) => {
            const id = squareId(row, col);
            const dark = (row + col) % 2 === 1;
            const isSelected = id === selected;
            const isTarget = legalTargets.includes(id);
            const classes = [
              'chess-square',
              dark ? 'chess-square--dark' : 'chess-square--light',
              isSelected ? 'chess-square--selected' : '',
              isTarget ? 'chess-square--target' : '',
              vsBot && turn === 'b' ? 'chess-square--locked' : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <button
                type="button"
                key={id}
                className={classes}
                onClick={() => handleSquareClick(row, col)}
                aria-label={id}
                disabled={vsBot && turn === 'b'}
              >
                {isTarget && !piece ? <span className="chess-dot" aria-hidden /> : null}
                {piece ? (
                  <span className={`chess-piece chess-piece--${piece.color}`}>
                    {PIECE_GLYPHS[piece.color][piece.type]}
                  </span>
                ) : null}
                {col === 0 ? <span className="chess-coord chess-coord--rank">{8 - row}</span> : null}
                {row === 7 ? <span className="chess-coord chess-coord--file">{FILES[col]}</span> : null}
              </button>
            );
          })
        )}
      </div>

      <aside className="chess-panel">
        <p className="chess-status">{status}</p>

        <div className="chess-controls">
          <button type="button" className="button-primary" onClick={handleReset}>
            New game
          </button>
          <button
            type="button"
            className="button-outline"
            onClick={handleUndo}
            disabled={history.length === 0 || (vsBot && turn === 'b')}
          >
            Undo
          </button>
        </div>

        <div className="chess-captured" aria-label="Captured pieces">
          <div className="chess-captured__row">
            <span className="chess-captured__label">White took</span>
            {captured.white.length === 0 ? (
              <span className="chess-captured__empty">—</span>
            ) : (
              <span className="chess-captured__pieces">
                {captured.white.map((p, i) => (
                  <span
                    key={`w-${i}-${p.type}`}
                    className={`chess-piece chess-piece--${p.color}`}
                    aria-label={`captured ${p.type}`}
                  >
                    {PIECE_GLYPHS[p.color][p.type]}
                  </span>
                ))}
              </span>
            )}
          </div>
          <div className="chess-captured__row">
            <span className="chess-captured__label">Black took</span>
            {captured.black.length === 0 ? (
              <span className="chess-captured__empty">—</span>
            ) : (
              <span className="chess-captured__pieces">
                {captured.black.map((p, i) => (
                  <span
                    key={`b-${i}-${p.type}`}
                    className={`chess-piece chess-piece--${p.color}`}
                    aria-label={`captured ${p.type}`}
                  >
                    {PIECE_GLYPHS[p.color][p.type]}
                  </span>
                ))}
              </span>
            )}
          </div>
        </div>

        <div className="chess-moves">
          <h2>Moves</h2>
          {history.length === 0 ? (
            <p className="chess-moves__empty">No moves yet.</p>
          ) : (
            <ol className="chess-moves__list">
              {history.map((san, i) => (
                <li key={`${i}-${san}`}>{san}</li>
              ))}
            </ol>
          )}
        </div>
      </aside>

      {pendingPromotion ? (
        <div className="chess-promotion" role="dialog" aria-label="Choose promotion piece">
          <div className="chess-promotion__card">
            <p>Promote to</p>
            <div className="chess-promotion__choices">
              {PROMOTION_CHOICES.map((choice) => (
                <button
                  type="button"
                  key={choice.type}
                  className="chess-promotion__btn"
                  onClick={() => finishPromotion(choice.type)}
                >
                  <span className={`chess-piece chess-piece--${turn}`}>
                    {PIECE_GLYPHS[turn][choice.type]}
                  </span>
                  {choice.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ChessPage() {
  const [mode, setMode] = useState('human');

  return (
    <main className="page chess-page">
      <h1>Play chess</h1>
      <p>
        {mode === 'bot'
          ? 'You play White. The AI bot plays Black as Player 2.'
          : 'Two players can play against each other on the same device.'}
      </p>

      <div className="chess-mode" role="group" aria-label="Opponent mode">
        <button
          type="button"
          className={mode === 'human' ? 'chess-mode__btn chess-mode__btn--active' : 'chess-mode__btn'}
          onClick={() => setMode('human')}
        >
          vs Player
        </button>
        <button
          type="button"
          className={mode === 'bot' ? 'chess-mode__btn chess-mode__btn--active' : 'chess-mode__btn'}
          onClick={() => setMode('bot')}
        >
          vs Bot
        </button>
      </div>

      <Chessboard key={mode} mode={mode} />
    </main>
  );
}

export default ChessPage;
