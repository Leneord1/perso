// Utilities hub linking calendar and calculator.

import React from 'react';
import { Link } from 'react-router';
import '../../global.css';

function Utilities() {
  return (
    <main className="page">
      <h1>Utilities</h1>
      <p>Small tools available from this site.</p>

      <section className="page-section" aria-labelledby="util-list-heading">
        <h2 id="util-list-heading">Available tools</h2>
        <p>
          <Link to="/calendar" className="link">
            Calendar
          </Link>
          {' — '}
          browse months and select a date.
        </p>
        <p>
          <Link to="/calculator" className="link">
            Calculator
          </Link>
          {' — '}
          add, subtract, multiply, divide, plus formula solvers.
        </p>
        <p>
          <Link to="/resume-parser" className="link">
            Resume Parser
          </Link>
          {' — '}
          ATS score and optional job-description match.
        </p>
      </section>
    </main>
  );
}

export default Utilities;
