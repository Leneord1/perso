import React from 'react';
import '../global.css';
import { useNavigate } from 'react-router-dom';
import ProjectTable from '../components/ProjectTable.jsx';
import {
  githubProfileUrl,
  highlightedProjectRows,
} from '../data/githubProjects.js';

function AllProjects() {
  const navigate = useNavigate();

  return (
    <main className="all-projects-container">
      <h1>Projects</h1>
      <p>
        Highlights from public work on{' '}
        <a href={githubProfileUrl} className="link" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        . Open a section for the full lists.
      </p>
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
      <p className="projects-lead">Highlights</p>
      <ProjectTable rows={highlightedProjectRows} />
    </main>
  );
}

export default AllProjects;
