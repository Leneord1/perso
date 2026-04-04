import React from 'react';
import '../global.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function ProfessionalProjects() {
  return (
    <div>
      <h1>Professional Projects</h1>
      <p>This is the Professional Projects page.</p>
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

export default ProfessionalProjects;