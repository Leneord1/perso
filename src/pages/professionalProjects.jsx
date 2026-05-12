import React from 'react';
import '../global.css';

function ProfessionalProjects() {
  return (
    <main className="page">
      <h1>Professional projects</h1>
      <p>Work shipped in professional roles—use this table to summarize scope and outcomes.</p>
      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>Description</th>
            <th>Stack</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} className="all-projects-placeholder">
              Add your professional projects here.
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}

export default ProfessionalProjects;
