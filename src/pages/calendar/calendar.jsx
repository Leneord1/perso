// Month calendar with prev/next navigation and today highlight.

import React, { useMemo, useState } from 'react';
import '../../global.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Build 6x7 grid of date cells for a given month. */
function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = 0; i < 42; i++) {
    const dayOffset = i - startPad + 1;
    if (dayOffset < 1) {
      cells.push({
        day: prevMonthDays + dayOffset,
        inMonth: false,
        date: new Date(year, month - 1, prevMonthDays + dayOffset),
      });
    } else if (dayOffset > daysInMonth) {
      cells.push({
        day: dayOffset - daysInMonth,
        inMonth: false,
        date: new Date(year, month + 1, dayOffset - daysInMonth),
      });
    } else {
      cells.push({
        day: dayOffset,
        inMonth: true,
        date: new Date(year, month, dayOffset),
      });
    }
  }
  return cells;
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Reusable month grid for page and navbar dropdown. */
export function CalendarPad() {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(today);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const weeks = useMemo(() => {
    const rows = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [cells]);

  /** Move view by delta months. */
  function shiftMonth(delta) {
    setCursor(new Date(year, month + delta, 1));
  }

  /** Jump view and selection to today. */
  function goToday() {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelected(today);
  }

  return (
    <div className="calendar-pad">
      <h2 id="calendar-month-label" className="calendar-pad__title">
        {MONTHS[month]} {year}
      </h2>
      <div className="calendar-pad__actions">
        <button type="button" className="button-outline" onClick={() => shiftMonth(-1)} aria-label="Previous month">
          Previous
        </button>
        <button type="button" className="button-primary" onClick={goToday}>
          Today
        </button>
        <button type="button" className="button-outline" onClick={() => shiftMonth(1)} aria-label="Next month">
          Next
        </button>
      </div>

      <table className="calendar-pad__table" aria-labelledby="calendar-month-label">
        <thead>
          <tr>
            {WEEKDAYS.map((d) => (
              <th key={d} scope="col">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week[0].date.toISOString().slice(0, 10)}>
              {week.map((cell) => {
                const isToday = sameDay(cell.date, today);
                const isSelected = sameDay(cell.date, selected);
                const key = cell.date.toISOString().slice(0, 10);
                return (
                  <td key={key}>
                    {cell.inMonth ? (
                      <button
                        type="button"
                        className={isSelected || isToday ? 'button-primary' : 'button-ghost'}
                        aria-current={isToday ? 'date' : undefined}
                        aria-pressed={isSelected}
                        onClick={() => setSelected(cell.date)}
                      >
                        {cell.day}
                      </button>
                    ) : (
                      <button type="button" className="button-ghost" disabled aria-hidden>
                        {cell.day}
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="calendar-pad__selected" aria-live="polite">
        Selected:{' '}
        {selected.toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
    </div>
  );
}

function Calendar() {
  return (
    <main className="page">
      <h1>Calendar</h1>
      <p>Browse months and pick a date.</p>

      <section className="page-section" aria-labelledby="calendar-month-label">
        <CalendarPad />
      </section>
    </main>
  );
}

export default Calendar;
