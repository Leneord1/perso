import React from 'react';
import '../global.css';
import { useNavigate } from 'react-router-dom';


function AllProjects() {
  const navigate = useNavigate();

  return (

    <div className="all-projects-container">
      <h1>All Projects</h1>
      <p>Links to all projects</p>
      <button className="button-primary"
          onClick={() => navigate('/projects/personal')}>
          View Personal Projects
      </button>

      <button className="button-primary"
          onClick={() => navigate('/projects/professional')}>
          View Professional Projects
      </button>

        <p>List of all projects</p>
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