import React from 'react';
import '../global.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function PersonalProjects() {
  return (
    <div>
      <h1>Personal Projects</h1>
      <p>
          This is the Personal Projects page.
      </p>
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

export default PersonalProjects;