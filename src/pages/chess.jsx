// Local two-player chess. Logic from chess.js; board/UI built here.
// TODO: none.
import React, { useMemo, useRef, useState } from 'react';
import { Chess, DEFAULT_POSITION } from 'chess.js';
import '../global.css';
import './chess.css';

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

// Build "a8".."h1" square id from board() indices.
function squareId(row, col) {
  return FILES[col] + (8 - row);
}

function Chessboard() {
  // Authoritative game; mutated only inside handlers, never read during render.
  const gameRef = useRef(new Chess());

  const [fen, setFen] = useState(DEFAULT_POSITION);
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [legalTargets, setLegalTargets] = useState([]);
  const [pendingPromotion, setPendingPromotion] = useState(null);

  // Rebuild a read-only view from fen for rendering-derived values.
  const view = useMemo(() => new Chess(fen), [fen]);
  const board = view.board();
  const turn = view.turn();

  const status = useMemo(() => {
    if (view.isCheckmate()) return `Checkmate — ${turn === 'w' ? 'Black' : 'White'} wins`;
    if (view.isStalemate()) return 'Draw — stalemate';
    if (view.isInsufficientMaterial()) return 'Draw — insufficient material';
    if (view.isDraw()) return 'Draw';
    const side = turn === 'w' ? 'White' : 'Black';
    return view.inCheck() ? `${side} to move — check` : `${side} to move`;
  }, [view, turn]);

  function syncPosition() {
    const game = gameRef.current;
    setFen(game.fen());
    setHistory(game.history());
    setSelected(null);
    setLegalTargets([]);
  }

  // Apply move, deferring to picker when promotion is required.
  function applyMove(from, to) {
    const game = gameRef.current;
    const target = game.moves({ square: from, verbose: true }).filter((m) => m.to === to);
    if (target.length === 0) return;

    if (target.some((m) => m.promotion)) {
      setPendingPromotion({ from, to });
      return;
    }

    game.move({ from, to });
    syncPosition();
  }

  function finishPromotion(pieceType) {
    const { from, to } = pendingPromotion;
    gameRef.current.move({ from, to, promotion: pieceType });
    setPendingPromotion(null);
    syncPosition();
  }

  function handleSquareClick(row, col) {
    if (pendingPromotion || view.isGameOver()) return;

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
    if (piece && piece.color === turn) {
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
    syncPosition();
  }

  function handleUndo() {
    gameRef.current.undo();
    setPendingPromotion(null);
    syncPosition();
  }

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
            disabled={history.length === 0}
          >
            Undo
          </button>
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
  return (
    <main className="page chess-page">
      <h1>Play chess</h1>
      <p>Local two-player game. Moves validated by the chess.js library.</p>
      <Chessboard />
    </main>
  );
}

export default ChessPage;
