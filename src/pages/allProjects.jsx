import React from 'react';
import '../global.css';
import { useNavigate } from 'react-router-dom';

function AllProjects() {
  const navigate = useNavigate();

  return (
    <main className="all-projects-container">
      <h1>Projects</h1>
      <p>Browse professional and personal work, or use the table as a running list of highlights.</p>
      <div>
        <button
          type="button"
          className="button-primary"
          onClick={() => navigate('/projects/personal')}
        >
          Personal projects
        </button>
        <button
          type="button"
          className="button-primary"
          onClick={() => navigate('/projects/professional')}
        >
          Professional projects
        </button>
      </div>
      <p style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Highlights</p>
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
              Add rows here as you document projects.
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}

export default AllProjects;
