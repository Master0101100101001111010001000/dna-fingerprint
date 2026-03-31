/**
 * Copyright (c) 2026. All Rights Reserved.
 * Proprietary and Confidential.
 */

import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function BarChart({ comparison }) {
  // Sort by gap descending (biggest mismatches first)
  const sorted = [...comparison.comparison].sort((a, b) => b.gap - a.gap)

  const data = {
    labels: sorted.map(c => `${c.dim} — ${c.name}`),
    datasets: [
      {
        label: 'Source DNA',
        data: sorted.map(c => c.source),
        backgroundColor: 'rgba(37, 99, 235, 0.8)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Rewritten DNA',
        data: sorted.map(c => c.rewritten),
        backgroundColor: 'rgba(249, 115, 22, 0.8)',
        borderColor: 'rgba(249, 115, 22, 1)',
        borderWidth: 1
      }
    ]
  }

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20
        }
      },
      y: {
        ticks: {
          font: {
            size: 10
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
            const dim = sorted[idx]
            return [
              `${context.dataset.label}: ${context.parsed.x}`,
              `Gap: ${dim.gap}`,
              `Tolerance: ±${dim.tolerance}`,
              dim.passing ? '✓ Pass' : '✗ Fail'
            ]
          },
          afterLabel: function(context) {
            const idx = context.dataIndex
            const dim = sorted[idx]
            return dim.description
          }
        }
      }
    }
  }

  return (
    <div className="card">
      <h2>Bar Chart</h2>
      <p className="text-muted mb-4 text-sm">
        Sorted by gap size (largest mismatches at top).
      </p>
      <div style={{ position: 'relative', height: '800px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}

export default BarChart
