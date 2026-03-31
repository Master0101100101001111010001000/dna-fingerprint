/**
 * Copyright (c) 2026. All Rights Reserved.
 * Proprietary and Confidential.
 */

import React, { useState, useEffect } from 'react'
import RadarChart from './RadarChart'
import BarChart from './BarChart'
import DimensionTable from './DimensionTable'

function ComparisonUI({ sourceDNA, rewrittenDNA, tolerances, sourceText, rewrittenText }) {
  const [comparison, setComparison] = useState(null)

  useEffect(() => {
    loadComparison()
  }, [sourceDNA, rewrittenDNA, tolerances])

  const loadComparison = async () => {
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceDNA, rewrittenDNA, tolerances })
      })

      const data = await res.json()
      if (data.success) {
        setComparison(data)
      }
    } catch (error) {
      console.error('Failed to load comparison:', error)
    }
  }

  if (!comparison) {
    return (
      <div className="card">
        <div className="spinner"></div> Loading comparison...
      </div>
    )
  }

  return (
    <div>
      <div className="card">
        <div className="flex-between mb-4">
          <h2>3. DNA Comparison</h2>
          <div className="flex">
            <span className={`badge ${comparison.allPass ? 'badge-success' : 'badge-danger'}`}>
              {comparison.passingCount} / {comparison.totalCount} Passing
            </span>
          </div>
        </div>

        {comparison.allPass ? (
          <div className="alert alert-success">
            ✓ Perfect match! All 24 dimensions are within tolerance.
          </div>
        ) : (
          <div className="alert alert-info">
            {comparison.totalCount - comparison.passingCount} dimension(s) still outside tolerance. 
            Consider adjusting tolerances or running another iteration.
          </div>
        )}
      </div>

      <div className="grid grid-2">
        <RadarChart comparison={comparison} />
        <BarChart comparison={comparison} />
      </div>

      <DimensionTable comparison={comparison} />

      <div className="grid grid-2">
        <div className="card">
          <h2>Source Article</h2>
          <div style={{ 
            maxHeight: '400px', 
            overflow: 'auto', 
            padding: '12px', 
            background: '#f9fafb', 
            borderRadius: '6px',
            fontSize: '14px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap'
          }}>
            {sourceText}
          </div>
        </div>

        <div className="card">
          <h2>Rewritten Article</h2>
          <div style={{ 
            maxHeight: '400px', 
            overflow: 'auto', 
            padding: '12px', 
            background: '#f9fafb', 
            borderRadius: '6px',
            fontSize: '14px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap'
          }}>
            {rewrittenText}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparisonUI
