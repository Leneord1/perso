import React from 'react';
import '../global.css';
import { useNavigate } from 'react-router-dom';


function AllProjects() {
  const navigate = useNavigate();

  return (

    <div>
      <h1>All Projects</h1>
      <p>This is the All Projects page.</p>
      <p>Links to all projects</p>
      <button onClick={() => navigate('/projects/personal')}
              style={{backgroundColor: 'lightblue', padding: '10px', borderRadius: '5px'}}>
          View Personal Projects
      </button>

      <button onClick={() => navigate('/projects/professional')}
              style={{backgroundColor: 'lightblue', padding: '10px', borderRadius: '5px', marginLeft: '10px'}}>
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