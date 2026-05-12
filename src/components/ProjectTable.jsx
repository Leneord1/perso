import React from 'react'

export default function ProjectTable({ rows }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Project</th>
          <th>Description</th>
          <th>Stack</th>
          <th>Links</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.repoUrl}>
            <td>
              <strong>{row.name}</strong>
            </td>
            <td>{row.description}</td>
            <td>{row.stack}</td>
            <td>
              <a href={row.repoUrl} className="link" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              {row.liveUrl ? (
                <>
                  {' · '}
                  <a href={row.liveUrl} className="link" target="_blank" rel="noopener noreferrer">
                    Live
                  </a>
                </>
              ) : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
