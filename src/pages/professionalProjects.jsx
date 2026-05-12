import React from 'react';
import '../global.css';
import ProjectTable from '../components/ProjectTable.jsx';
import { githubProfileUrl, professionalProjectRows } from '../data/githubProjects.js';

function ProfessionalProjects() {
  return (
    <main className="page">
      <h1>Professional projects</h1>
      <p>
        Course and team repositories (SWE, OS/Docker, grouped project work) from your public{' '}
        <a href={githubProfileUrl} className="link" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        .
      </p>
      <ProjectTable rows={professionalProjectRows} />
    </main>
  );
}

export default ProfessionalProjects;
