// Formula definitions and Omni-style missing-value solvers.

export const COMPOUND_FREQUENCIES = [
  { value: '1', label: 'Yearly (1/yr)' },
  { value: '2', label: 'Semi-annually (2/yr)' },
  { value: '4', label: 'Quarterly (4/yr)' },
  { value: '12', label: 'Monthly (12/yr)' },
  { value: '52', label: 'Weekly (52/yr)' },
  { value: '365', label: 'Daily (365/yr)' },
  { value: 'continuous', label: 'Continuous' },
];

const ELECTRICAL_FIELDS = [
  { key: 'V', label: 'Voltage (V)', unit: 'V' },
  { key: 'I', label: 'Current (I)', unit: 'A' },
  { key: 'R', label: 'Resistance (R)', unit: 'Ω' },
  { key: 'P', label: 'Power (P)', unit: 'W' },
];

export const FORMULAS = [
  {
    id: 'watt',
    title: 'Wattage',
    equation: 'P = V × I',
    hint: 'Enter any two values. The other two fill in.',
    independent: 2,
    fields: ELECTRICAL_FIELDS,
    solve: solveElectrical,
  },
  {
    id: 'ohm',
    title: "Ohm's law",
    equation: 'V = I × R',
    hint: 'Enter any two values. The other two fill in.',
    independent: 2,
    fields: ELECTRICAL_FIELDS,
    solve: solveElectrical,
  },
  {
    id: 'newton',
    title: "Newton's second law",
    equation: 'F = m a',
    hint: 'Enter mass, force, and/or motion values.',
    independent: 4,
    fields: [
      { key: 'm', label: 'Mass', unit: 'kg' },
      { key: 'vi', label: 'Initial velocity', unit: 'm/s' },
      { key: 'vf', label: 'Final velocity', unit: 'm/s' },
      { key: 'dt', label: 'Time difference', unit: 's' },
      { key: 'a', label: 'Acceleration', unit: 'm/s²' },
      { key: 'F', label: 'Force', unit: 'N' },
    ],
    solve: solveNewton,
  },
  {
    id: 'torque',
    title: 'Torque',
    equation: 'τ = r F sin(θ)',
    hint: 'Enter any three values. Angle defaults to 90°.',
    independent: 3,
    defaults: { theta: '90' },
    fields: [
      { key: 'r', label: 'Distance (r)', unit: 'm' },
      { key: 'F', label: 'Force (F)', unit: 'N' },
      { key: 'theta', label: 'Angle (θ)', unit: '°' },
      { key: 'tau', label: 'Torque (τ)', unit: 'N·m' },
    ],
    solve: solveTorque,
  },
  {
    id: 'accel',
    title: 'Acceleration & velocity',
    equation: 'a = (vf − vi) / t',
    hint: 'Enter any three values.',
    independent: 3,
    fields: [
      { key: 'vi', label: 'Initial speed', unit: 'm/s' },
      { key: 'vf', label: 'Final speed', unit: 'm/s' },
      { key: 't', label: 'Time', unit: 's' },
      { key: 'a', label: 'Acceleration', unit: 'm/s²' },
      { key: 's', label: 'Distance', unit: 'm' },
    ],
    solve: solveAccel,
  },
  {
    id: 'compound',
    title: 'Compound interest',
    equation: 'A = P (1 + r/n)^(n t)',
    hint: 'Enter principal, rate, term, and compounding.',
    independent: 4,
    keepKeys: ['n'],
    defaults: { n: '12' },
    fields: [
      { key: 'P', label: 'Initial balance', unit: '' },
      { key: 'rate', label: 'Interest rate', unit: '%' },
      { key: 't', label: 'Term', unit: 'years' },
      {
        key: 'n',
        label: 'Compounding frequency',
        unit: '',
        options: COMPOUND_FREQUENCIES,
      },
      { key: 'A', label: 'Final balance', unit: '' },
      { key: 'I', label: 'Interest earned', unit: '' },
    ],
    solve: solveCompound,
  },
];

/** Parse a field string to a finite number, or null. */
export function parseNum(raw) {
  if (raw === '' || raw === null || raw === undefined) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/** Format a solved number for an input value. */
export function formatFormulaValue(n) {
  if (!Number.isFinite(n)) return '';
  const abs = Math.abs(n);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e10)) return n.toExponential(6);
  return String(Number(n.toPrecision(10)));
}

/** Empty (or default) string map for a formula's fields. */
export function emptyValues(formula) {
  const values = {};
  for (const field of formula.fields) {
    values[field.key] = formula.defaults?.[field.key] ?? '';
  }
  return values;
}

/** Keys treated as inputs when a formula first opens. */
export function initialLocked(formula) {
  if (formula.keepKeys) return formula.keepKeys.slice();
  return Object.keys(formula.defaults || {});
}

/** Keep the newest independent locked keys, plus keys that must stay. */
export function capLocked(formula, lockedKeys) {
  const keep = new Set(formula.keepKeys || []);
  const unique = [];
  for (const key of lockedKeys) {
    if (!unique.includes(key)) unique.push(key);
  }
  const kept = unique.filter((k) => keep.has(k));
  const rest = unique.filter((k) => !keep.has(k));
  const restCap = Math.max(0, formula.independent - kept.length);
  return [...kept, ...rest.slice(-restCap)];
}

/** Solve missing fields from locked user inputs. */
export function solveFormula(formula, values, lockedKeys) {
  const known = {};
  for (const key of lockedKeys) {
    if (key === 'n' && values.n === 'continuous') {
      known.n = 'continuous';
      continue;
    }
    const n = parseNum(values[key]);
    if (n !== null) known[key] = n;
  }

  const locked = new Set(lockedKeys);
  const solved = formula.solve(known, locked);
  const out = {};
  for (const field of formula.fields) {
    const key = field.key;
    if (locked.has(key) && values[key] !== '') {
      out[key] = values[key];
    } else if (solved[key] !== undefined && Number.isFinite(solved[key])) {
      out[key] = formatFormulaValue(solved[key]);
    } else if (key === 'n' && values.n) {
      out[key] = values.n;
    } else {
      out[key] = formula.defaults?.[key] ?? '';
    }
  }
  return out;
}

/** Set key if unlocked, finite, and not already present. */
function setIf(next, locked, key, value) {
  if (locked.has(key)) return;
  if (next[key] !== undefined) return;
  if (Number.isFinite(value)) next[key] = value;
}

/** Re-run fill rules until no new values appear. */
function fillUntilStable(known, locked, applyOnce) {
  let cur = { ...known };
  for (let i = 0; i < 10; i += 1) {
    const next = applyOnce({ ...cur }, locked);
    let changed = false;
    for (const key of Object.keys(next)) {
      if (next[key] !== cur[key]) changed = true;
    }
    cur = next;
    if (!changed) break;
  }
  return cur;
}

/** Fill V, I, R, P from any two known electrical values. */
function solveElectrical(known) {
  const { V, I, R, P } = known;
  const has = (x) => x !== undefined && Number.isFinite(x);
  const out = { ...known };

  if (has(V) && has(I)) {
    if (I !== 0) out.R = V / I;
    out.P = V * I;
  } else if (has(V) && has(R)) {
    if (R !== 0) {
      out.I = V / R;
      out.P = (V * V) / R;
    }
  } else if (has(V) && has(P)) {
    if (V !== 0) {
      out.I = P / V;
      if (P !== 0) out.R = (V * V) / P;
    }
  } else if (has(I) && has(R)) {
    out.V = I * R;
    out.P = I * I * R;
  } else if (has(I) && has(P)) {
    if (I !== 0) {
      out.V = P / I;
      out.R = P / (I * I);
    }
  } else if (has(R) && has(P) && R > 0 && P >= 0) {
    out.I = Math.sqrt(P / R);
    out.V = Math.sqrt(P * R);
  }
  return out;
}

/** Fill F = m a and a = (vf − vi) / dt. */
function solveNewton(known, locked) {
  return fillUntilStable(known, locked, (next, lock) => {
    const has = (k) => next[k] !== undefined && Number.isFinite(next[k]);
    if (has('F') && has('m') && next.m !== 0) setIf(next, lock, 'a', next.F / next.m);
    if (has('m') && has('a')) setIf(next, lock, 'F', next.m * next.a);
    if (has('F') && has('a') && next.a !== 0) setIf(next, lock, 'm', next.F / next.a);
    if (has('vf') && has('vi') && has('dt') && next.dt !== 0) {
      setIf(next, lock, 'a', (next.vf - next.vi) / next.dt);
    }
    if (has('a') && has('vi') && has('dt')) setIf(next, lock, 'vf', next.vi + next.a * next.dt);
    if (has('a') && has('vf') && has('dt')) setIf(next, lock, 'vi', next.vf - next.a * next.dt);
    if (has('a') && has('vf') && has('vi') && next.a !== 0) {
      setIf(next, lock, 'dt', (next.vf - next.vi) / next.a);
    }
    return next;
  });
}

/** Fill τ = r F sin(θ). θ is degrees; 90° if omitted. */
function solveTorque(known, locked) {
  const next = { ...known };
  const has = (k) => next[k] !== undefined && Number.isFinite(next[k]);
  const theta = has('theta') ? next.theta : 90;
  const sin = Math.sin((theta * Math.PI) / 180);

  if (has('r') && has('F')) setIf(next, locked, 'tau', next.r * next.F * sin);
  if (has('tau') && has('r') && sin !== null && next.r * sin !== 0) {
    setIf(next, locked, 'F', next.tau / (next.r * sin));
  }
  if (has('tau') && has('F') && sin !== null && next.F * sin !== 0) {
    setIf(next, locked, 'r', next.tau / (next.F * sin));
  }
  if (has('tau') && has('r') && has('F') && next.r * next.F !== 0) {
    const ratio = next.tau / (next.r * next.F);
    if (ratio >= -1 && ratio <= 1) {
      setIf(next, locked, 'theta', (Math.asin(ratio) * 180) / Math.PI);
    }
  }
  return next;
}

/** Fill constant-acceleration kinematics. */
function solveAccel(known, locked) {
  return fillUntilStable(known, locked, (next, lock) => {
    const has = (k) => next[k] !== undefined && Number.isFinite(next[k]);
    if (has('vf') && has('vi') && has('t') && next.t !== 0) {
      setIf(next, lock, 'a', (next.vf - next.vi) / next.t);
    }
    if (has('a') && has('vi') && has('t')) setIf(next, lock, 'vf', next.vi + next.a * next.t);
    if (has('a') && has('vf') && has('t')) setIf(next, lock, 'vi', next.vf - next.a * next.t);
    if (has('a') && has('vf') && has('vi') && next.a !== 0) {
      setIf(next, lock, 't', (next.vf - next.vi) / next.a);
    }
    if (has('vi') && has('t') && has('a')) {
      setIf(next, lock, 's', next.vi * next.t + 0.5 * next.a * next.t * next.t);
    }
    if (has('vi') && has('vf') && has('t')) {
      setIf(next, lock, 's', ((next.vi + next.vf) / 2) * next.t);
    }
    if (has('s') && has('vi') && has('t') && next.t !== 0) {
      setIf(next, lock, 'a', (2 * (next.s - next.vi * next.t)) / (next.t * next.t));
    }
    if (has('s') && has('vi') && has('vf') && next.vi + next.vf !== 0) {
      setIf(next, lock, 't', (2 * next.s) / (next.vi + next.vf));
    }
    return next;
  });
}

/** Fill compound interest; rate is percent, n may be 'continuous'. */
function solveCompound(known, locked) {
  const next = { ...known };
  const has = (k) => next[k] !== undefined && Number.isFinite(next[k]);
  const continuous = next.n === 'continuous';
  const n = continuous ? null : next.n;
  const rDec = has('rate') ? next.rate / 100 : null;

  if (has('P') && has('A')) setIf(next, locked, 'I', next.A - next.P);
  if (has('P') && has('I')) setIf(next, locked, 'A', next.P + next.I);
  if (has('A') && has('I')) setIf(next, locked, 'P', next.A - next.I);

  if (continuous && rDec !== null && has('t')) {
    if (has('P')) setIf(next, locked, 'A', next.P * Math.exp(rDec * next.t));
    if (has('A') && rDec !== 0) setIf(next, locked, 'P', next.A * Math.exp(-rDec * next.t));
  } else if (n && n !== 0 && rDec !== null && has('t')) {
    const factor = (1 + rDec / n) ** (n * next.t);
    if (has('P') && Number.isFinite(factor)) setIf(next, locked, 'A', next.P * factor);
    if (has('A') && factor !== 0 && Number.isFinite(factor)) {
      setIf(next, locked, 'P', next.A / factor);
    }
  }

  if (has('A') && has('P') && next.P > 0 && next.A > 0 && has('t') && next.t !== 0) {
    if (continuous) {
      setIf(next, locked, 'rate', (Math.log(next.A / next.P) / next.t) * 100);
    } else if (n && n !== 0) {
      const inner = (next.A / next.P) ** (1 / (n * next.t)) - 1;
      setIf(next, locked, 'rate', n * inner * 100);
    }
  }

  if (has('A') && has('P') && next.P > 0 && next.A > 0 && rDec !== null) {
    if (continuous && rDec !== 0) {
      setIf(next, locked, 't', Math.log(next.A / next.P) / rDec);
    } else if (n && n !== 0 && 1 + rDec / n > 0 && rDec !== 0) {
      setIf(next, locked, 't', Math.log(next.A / next.P) / (n * Math.log(1 + rDec / n)));
    }
  }

  if (has('A') && has('P')) setIf(next, locked, 'I', next.A - next.P);
  return next;
}
