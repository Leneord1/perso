import React from 'react';
import '../global.css';

function PersonalProjects() {
  return (
    <main className="page">
      <h1>Personal projects</h1>
      <p>Side projects, experiments, and learning builds.</p>
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
              Add your personal projects here.
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}

export default PersonalProjects;
