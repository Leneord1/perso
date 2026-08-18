// Four-function calculator with chained operations.
// Page pad adds sqrt, square, reciprocal, power, modulo, and formula solvers.

import React, { useState } from 'react';
import '../global.css';
import {
  FORMULAS,
  capLocked,
  emptyValues,
  initialLocked,
  solveFormula,
} from './calculatorFormulas.js';

const BASIC_ROWS = [
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
    { label: '=', type: 'equals', action: '=', wide: true },
  ],
];

const EXTENDED_ROW = [
  { label: '√', type: 'unary', action: 'sqrt', ariaLabel: 'Square root' },
  { label: 'x²', type: 'unary', action: 'square', ariaLabel: 'Square' },
  { label: '1/x', type: 'unary', action: 'reciprocal', ariaLabel: 'Reciprocal' },
  { label: 'xʸ', type: 'op', action: '^', ariaLabel: 'Power' },
  { label: 'mod', type: 'op', action: 'mod', ariaLabel: 'Modulo' },
];

/** Apply binary operator to two numbers. */
function compute(a, op, b) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? Number.NaN : a / b;
    case '^': return a ** b;
    case 'mod': return b === 0 ? Number.NaN : a % b;
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
  if (type === 'action' || type === 'unary') return 'button-ghost';
  return 'button-outline';
}

/** Reusable keypad + display for page and navbar dropdown. */
export function CalculatorPad({ extended = false }) {
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

  /** Apply sqrt, square, or reciprocal to display. */
  function applyUnary(action) {
    if (display === 'Error') return;
    const current = Number.parseFloat(display);
    let result = current;
    if (action === 'sqrt') {
      result = current < 0 ? Number.NaN : Math.sqrt(current);
    } else if (action === 'square') {
      result = current * current;
    } else if (action === 'reciprocal') {
      result = current === 0 ? Number.NaN : 1 / current;
    }
    setDisplay(formatDisplay(result));
    setFresh(true);
  }

  /** Route button press to the right handler. */
  function handlePress(btn) {
    if (btn.type === 'digit') inputDigit(btn.action);
    else if (btn.type === 'op') inputOperator(btn.action);
    else if (btn.type === 'equals') equals();
    else if (btn.type === 'unary') applyUnary(btn.action);
    else if (btn.action === 'clear') clearAll();
    else if (btn.action === 'sign') toggleSign();
    else if (btn.action === 'percent') percent();
  }

  const rows = extended ? [EXTENDED_ROW, ...BASIC_ROWS] : BASIC_ROWS;

  return (
    <div className={`calc-pad${extended ? ' calc-pad--extended' : ''}`}>
      <p className="calc-pad__display" aria-live="polite" aria-atomic="true">
        {display}
      </p>
      <div className="calc-pad__keys" role="group" aria-label="Calculator keypad">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`calc-pad__row${row.length === 5 ? ' calc-pad__row--five' : ''}`}
          >
            {row.map((btn) => (
              <button
                key={btn.label}
                type="button"
                className={`${buttonClass(btn.type)}${btn.wide ? ' calc-pad__key--wide' : ''}`}
                aria-label={btn.ariaLabel}
                onClick={() => handlePress(btn)}
              >
                {btn.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Omni-style fields that fill missing values from locked inputs. */
function FormulaPanel({ formula }) {
  const [values, setValues] = useState(() => emptyValues(formula));
  const [locked, setLocked] = useState(() => initialLocked(formula));

  /** Update one field and re-solve the rest. */
  function applyChange(key, raw) {
    const nextValues = { ...values, [key]: raw };
    const nextLocked = raw === ''
      ? locked.filter((item) => item !== key)
      : capLocked(formula, [...locked.filter((item) => item !== key), key]);
    setLocked(nextLocked);
    setValues(solveFormula(formula, nextValues, nextLocked));
  }

  /** Restore empty fields and default locked keys. */
  function clearAll() {
    setValues(emptyValues(formula));
    setLocked(initialLocked(formula));
  }

  return (
    <div className="calc-formula-panel">
      <h3>{formula.title}</h3>
      <p className="calc-formula-panel__eq">{formula.equation}</p>
      <p>{formula.hint}</p>
      <div className="calc-formula-fields">
        {formula.fields.map((field) => (
          <div key={field.key} className="calc-formula-field">
            <label htmlFor={`calc-field-${formula.id}-${field.key}`}>
              {field.label}
            </label>
            {field.options ? (
              <select
                id={`calc-field-${formula.id}-${field.key}`}
                className="select"
                value={values[field.key]}
                onChange={(event) => applyChange(field.key, event.target.value)}
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={`calc-field-${formula.id}-${field.key}`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={values[field.key]}
                onChange={(event) => applyChange(field.key, event.target.value)}
              />
            )}
            {field.unit ? <p className="calc-formula-field__unit">{field.unit}</p> : null}
          </div>
        ))}
      </div>
      <div className="calc-formula-actions">
        <button type="button" className="button-ghost" onClick={clearAll}>
          Clear
        </button>
      </div>
    </div>
  );
}

function Calculator() {
  const [formulaId, setFormulaId] = useState(null);
  const active = FORMULAS.find((item) => item.id === formulaId) || null;

  return (
    <main className="page">
      <h1>Calculator</h1>
      <p>
        Arithmetic plus square root, square, reciprocal, power, and modulo.
        Formula buttons fill missing values from the ones you enter.
      </p>

      <section className="page-section" aria-labelledby="calc-display-heading">
        <h2 id="calc-display-heading">Result</h2>
        <CalculatorPad extended />
      </section>

      <section className="page-section" aria-labelledby="calc-formulas-heading">
        <h2 id="calc-formulas-heading">Formulas</h2>
        <p>Pick a formula, then enter known values. Remaining fields update on their own.</p>
        <div className="calc-formulas" role="group" aria-label="Formula calculators">
          {FORMULAS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === formulaId ? 'button-primary' : 'button-outline'}
              aria-pressed={item.id === formulaId}
              onClick={() => setFormulaId(item.id === formulaId ? null : item.id)}
            >
              {item.title}
            </button>
          ))}
        </div>
        {active ? <FormulaPanel key={active.id} formula={active} /> : null}
      </section>
    </main>
  );
}

export default Calculator;
