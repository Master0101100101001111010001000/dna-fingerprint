/**
 * Copyright (c) 2026. All Rights Reserved.
 * Proprietary and Confidential.
 */

import React from 'react'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { Radar } from 'react-chartjs-2'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

function RadarChart({ comparison }) {
  const data = {
    labels: comparison.comparison.map(c => c.dim),
    datasets: [
      {
        label: 'Source DNA',
        data: comparison.comparison.map(c => c.source),
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(37, 99, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(37, 99, 235, 1)'
      },
      {
        label: 'Rewritten DNA',
        data: comparison.comparison.map(c => c.rewritten),
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
        borderColor: 'rgba(249, 115, 22, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(249, 115, 22, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(249, 115, 22, 1)'
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20
        },
        pointLabels: {
          font: {
            size: 11
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const idx = context.dataIndex
            const dim = comparison.comparison[idx]
            return [
              `${context.dataset.label}: ${context.parsed.r}`,
              `Gap: ${dim.gap}`,
              `Tolerance: ±${dim.tolerance}`,
              `Status: ${dim.passing ? 'Pass ✓' : 'Fail ✗'}`
            ]
          },
          title: function(context) {
            const idx = context[0].dataIndex
            const dim = comparison.comparison[idx]
            return `${dim.dim} — ${dim.name}`
          },
          afterTitle: function(context) {
            const idx = context[0].dataIndex
            const dim = comparison.comparison[idx]
            return dim.description
          }
        }
      }
    }
  }

  return (
    <div className="card">
      <h2>Radar Chart</h2>
      <p className="text-muted mb-4 text-sm">
        Visual comparison across all 24 dimensions. Hover for details.
      </p>
      <div style={{ position: 'relative', height: '450px' }}>
        <Radar data={data} options={options} />
      </div>
    </div>
  )
}

export default RadarChart
