// Four-function calculator with chained operations.

import React, { useState } from 'react';
import '../global.css';

const ROWS = [
  [
    { label: 'C', type: 'action', action: 'clear' },
    { label: '±', type: 'action', action: 'sign' },
    { label: '%', type: 'action', action: 'percent' },
    { label: '÷', type: 'op', action: '/' },
  ],
  [
    { label: '7', type: 'digit', action: '7' },
    { label: '8', type: 'digit', action: '8' },
    { label: '9', type: 'digit', action: '9' },
    { label: '×', type: 'op', action: '*' },
  ],
  [
    { label: '4', type: 'digit', action: '4' },
    { label: '5', type: 'digit', action: '5' },
    { label: '6', type: 'digit', action: '6' },
    { label: '−', type: 'op', action: '-' },
  ],
  [
    { label: '1', type: 'digit', action: '1' },
    { label: '2', type: 'digit', action: '2' },
    { label: '3', type: 'digit', action: '3' },
    { label: '+', type: 'op', action: '+' },
  ],
  [
    { label: '0', type: 'digit', action: '0' },
    { label: '.', type: 'digit', action: '.' },
    { label: '=', type: 'equals', action: '=' },
  ],
];

/** Apply binary operator to two numbers. */
function compute(a, op, b) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? Number.NaN : a / b;
    case '%': return b % a;
    default: return b;
  }
}

/** Format display value; trim trailing float noise. */
function formatDisplay(value) {
  if (Number.isNaN(value) || !Number.isFinite(value)) return 'Error';
  const str = String(value);
  if (str.length > 12) {
    return Number(value).toPrecision(8).replace(/\.?0+$/, '');
  }
  return str;
}

/** Map button type to existing global button class. */
function buttonClass(type) {
  if (type === 'op' || type === 'equals') return 'button-primary';
  if (type === 'action') return 'button-ghost';
  return 'button-outline';
}

function Calculator() {
  const [display, setDisplay] = useState('0');
  const [stored, setStored] = useState(null);
  const [operator, setOperator] = useState(null);
  const [fresh, setFresh] = useState(true);

  /** Reset all calculator state. */
  function clearAll() {
    setDisplay('0');
    setStored(null);
    setOperator(null);
    setFresh(true);
  }

  /** Append digit or decimal to display. */
  function inputDigit(d) {
    if (display === 'Error') {
      setDisplay(d === '.' ? '0.' : d);
      setFresh(false);
      return;
    }
    if (fresh) {
      setDisplay(d === '.' ? '0.' : d);
      setFresh(false);
      return;
    }
    if (d === '.' && display.includes('.')) return;
    if (display === '0' && d !== '.') {
      setDisplay(d);
      return;
    }
    if (display.length >= 12) return;
    setDisplay(display + d);
  }

  /** Set pending operator; evaluate chain if needed. */
  function inputOperator(op) {
    const current = Number.parseFloat(display);
    if (display === 'Error') {
      clearAll();
      return;
    }
    if (stored !== null && operator && !fresh) {
      const result = compute(stored, operator, current);
      setDisplay(formatDisplay(result));
      setStored(Number.isNaN(result) ? null : result);
    } else {
      setStored(current);
    }
    setOperator(op);
    setFresh(true);
  }

  /** Evaluate pending expression. */
  function equals() {
    if (operator === null || stored === null) return;
    const current = Number.parseFloat(display);
    const result = compute(stored, operator, current);
    setDisplay(formatDisplay(result));
    setStored(null);
    setOperator(null);
    setFresh(true);
  }

  /** Toggle sign of current display. */
  function toggleSign() {
    if (display === 'Error' || display === '0') return;
    setDisplay(display.startsWith('-') ? display.slice(1) : `-${display}`);
  }

  /** Convert display to percent (divide by 100). */
  function percent() {
    if (display === 'Error') return;
    const value = Number.parseFloat(display) / 100;
    setDisplay(formatDisplay(value));
    setFresh(true);
  }

  /** Route button press to the right handler. */
  function handlePress(btn) {
    if (btn.type === 'digit') inputDigit(btn.action);
    else if (btn.type === 'op') inputOperator(btn.action);
    else if (btn.type === 'equals') equals();
    else if (btn.action === 'clear') clearAll();
    else if (btn.action === 'sign') toggleSign();
    else if (btn.action === 'percent') percent();
  }

  return (
    <main className="page">
      <h1>Calculator</h1>
      <p>Basic arithmetic for quick math.</p>

      <section className="page-section" aria-labelledby="calc-display-heading">
        <h2 id="calc-display-heading">Result</h2>
        <p aria-live="polite" aria-atomic="true">{display}</p>

        <table aria-label="Calculator keypad">
          <tbody>
            {ROWS.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((btn) => (
                  <td key={btn.label} colSpan={btn.label === '=' ? 2 : 1}>
                    <button
                      type="button"
                      className={buttonClass(btn.type)}
                      onClick={() => handlePress(btn)}
                    >
                      {btn.label}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default Calculator;
