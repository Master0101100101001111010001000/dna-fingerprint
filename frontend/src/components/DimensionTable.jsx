/**
 * Copyright (c) 2026. All Rights Reserved.
 * Proprietary and Confidential.
 */

import React, { useState } from 'react'

function DimensionTable({ comparison }) {
  const [sortKey, setSortKey] = useState('gap')
  const [sortDir, setSortDir] = useState('desc')
  const [expandedRow, setExpandedRow] = useState(null)

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sorted = [...comparison.comparison].sort((a, b) => {
    let aVal = a[sortKey]
    let bVal = b[sortKey]

    if (typeof aVal === 'boolean') {
      aVal = aVal ? 1 : 0
      bVal = bVal ? 1 : 0
    }

    if (sortDir === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return (
    <div className="card">
      <h2>Dimension Detail Table</h2>
      <p className="text-muted mb-4 text-sm">
        Click column headers to sort. Click any row to expand full description.
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort('dim')} style={{ cursor: 'pointer' }}>
                Code {sortKey === 'dim' && (sortDir === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                Name {sortKey === 'name' && (sortDir === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('source')} style={{ cursor: 'pointer' }}>
                Source {sortKey === 'source' && (sortDir === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('rewritten')} style={{ cursor: 'pointer' }}>
                Rewritten {sortKey === 'rewritten' && (sortDir === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('gap')} style={{ cursor: 'pointer' }}>
                Gap {sortKey === 'gap' && (sortDir === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('tolerance')} style={{ cursor: 'pointer' }}>
                ±Tolerance {sortKey === 'tolerance' && (sortDir === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('passing')} style={{ cursor: 'pointer' }}>
                Status {sortKey === 'passing' && (sortDir === 'asc' ? '▲' : '▼')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((dim, idx) => (
              <React.Fragment key={dim.dim}>
                <tr
                  className={!dim.passing ? 'fail' : ''}
                  onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                  style={{ cursor: 'pointer' }}
                >
                  <td><strong>{dim.dim}</strong></td>
                  <td>{dim.name}</td>
                  <td>{dim.source}</td>
                  <td>{dim.rewritten}</td>
                  <td><strong>{dim.gap}</strong></td>
                  <td>±{dim.tolerance}</td>
                  <td>
                    <span className={`badge ${dim.passing ? 'badge-success' : 'badge-danger'}`}>
                      {dim.passing ? 'Pass ✓' : `Fail (${dim.gap})`}
                    </span>
                  </td>
                </tr>
                {expandedRow === idx && (
                  <tr>
                    <td colSpan="7" style={{ background: '#f9fafb', padding: '16px' }}>
                      <div className="text-sm">
                        <strong>Description:</strong>
                        <p style={{ marginTop: '8px', lineHeight: '1.6' }}>
                          {dim.description}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DimensionTable
