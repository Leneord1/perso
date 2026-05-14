import React from 'react'
import PropTypes from 'prop-types'

const projectRowPropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  stack: PropTypes.string.isRequired,
  repoUrl: PropTypes.string.isRequired,
  liveUrl: PropTypes.string,
})

function ProjectTableRow({ row }) {
  return (
    <tr>
      <td>
        <strong>{row.name}</strong>
      </td>
      <td>{row.description}</td>
      <td>{row.stack}</td>
      <td>
        <span className="project-table__links">
          <a href={row.repoUrl} className="link" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          {row.liveUrl ? (
            <>
              {' '}
              <a
                href={row.liveUrl}
                className="link project-table__live-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Live
              </a>
            </>
          ) : null}
        </span>
      </td>
    </tr>
  )
}

ProjectTableRow.propTypes = {
  row: projectRowPropType.isRequired,
}

ProjectTableRow.displayName = 'ProjectTableRow'

function ProjectTable({ rows }) {
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
          <ProjectTableRow key={row.repoUrl} row={row} />
        ))}
      </tbody>
    </table>
  )
}

ProjectTable.propTypes = {
  rows: PropTypes.arrayOf(projectRowPropType).isRequired,
}

ProjectTable.displayName = 'ProjectTable'

export default ProjectTable
