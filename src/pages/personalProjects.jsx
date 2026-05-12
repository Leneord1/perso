import React from 'react';
import '../global.css';
import ProjectTable from '../components/ProjectTable.jsx';
import { githubProfileUrl, personalProjectRows } from '../data/githubProjects.js';

function PersonalProjects() {
  return (
    <main className="page">
      <h1>Personal projects</h1>
      <p>
        Hackathons, portfolio, and side builds from{' '}
        <a href={githubProfileUrl} className="link" target="_blank" rel="noopener noreferrer">
          github.com/Leneord1
        </a>
        .
      </p>
      <ProjectTable rows={personalProjectRows} />
    </main>
  );
}

export default PersonalProjects;
