import React from 'react';
import '../global.css';
import { useNavigate } from 'react-router-dom';


function AllProjects() {
  const navigate = useNavigate();

  return (

    <div className="all-projects-container">
      <h1>All Projects</h1>
      <p>This is the All Projects page.</p>
      <p>Links to all projects</p>
      <button className="button-primary"
          onClick={() => navigate('/projects/personal')}>
          View Personal Projects
      </button>

      <button className="button-primary"
          onClick={() => navigate('/projects/professional')}>
          View Professional Projects
      </button>

      <table>
          <tbody>
          <tr>
              <th>Project Name</th>
              <th>Description</th>
              <th>Technologies Used</th>
              <th>Link</th>
          </tr>
          </tbody>
      </table>
    </div>
  );
}

export default AllProjects;