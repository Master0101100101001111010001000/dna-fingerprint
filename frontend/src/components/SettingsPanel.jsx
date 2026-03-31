/**
 * Copyright (c) 2026. All Rights Reserved.
 * Proprietary and Confidential.
 */

import React, { useState, useEffect } from 'react'

function SettingsPanel({ tolerances, onTolerancesChange, onApiKeySet, onClose }) {
  const [apiKey, setApiKey] = useState('')
  const [globalTolerance, setGlobalTolerance] = useState(2)
  const [customTolerances, setCustomTolerances] = useState({})
  const [dimensions, setDimensions] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadDimensions()
    if (tolerances) {
      setCustomTolerances(tolerances)
      const firstTol = Object.values(tolerances)[0]
      if (firstTol !== undefined) {
        setGlobalTolerance(firstTol)
      }
    }
  }, [tolerances])

  const loadDimensions = async () => {
    try {
      const res = await fetch('/api/dimensions')
      const data = await res.json()
      if (data.success) {
        setDimensions(data.dimensions)
      }
    } catch (error) {
      console.error('Failed to load dimensions:', error)
    }
  }

  const handleGlobalToleranceChange = (value) => {
    const val = parseInt(value)
    setGlobalTolerance(val)
    
    const newTolerances = {}
    dimensions.forEach(dim => {
      newTolerances[dim.code] = val
    })
    setCustomTolerances(newTolerances)
    onTolerancesChange(newTolerances)
  }

  const handleCustomToleranceChange = (dimCode, value) => {
    const val = parseInt(value)
    const newTolerances = { ...customTolerances, [dimCode]: val }
    setCustomTolerances(newTolerances)
    onTolerancesChange(newTolerances)
  }

  const handleSaveApiKey = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/config/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey })
      })

      const data = await res.json()
      if (data.success) {
        onApiKeySet()
        setApiKey('')
        alert('API key saved successfully!')
      }
    } catch (error) {
      alert('Failed to save API key: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto',
        width: '90%'
      }}>
        <div className="flex-between mb-4">
          <h2>Settings</h2>
          <button onClick={onClose} className="button button-secondary">✕ Close</button>
        </div>

        {/* API Key Section */}
        <div className="mb-4" style={{ paddingBottom: '20px', borderBottom: '1px solid var(--gray-200)' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Anthropic API Key</h3>
          <p className="text-sm text-muted mb-2">
            Required for the rewriter to function. Your key is stored only in server memory.
          </p>
          <div className="flex">
            <input
              type="password"
              placeholder="sk-ant-api03-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid var(--gray-300)',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <button
              className="button"
              onClick={handleSaveApiKey}
              disabled={saving || !apiKey}
              style={{ marginLeft: '10px' }}
            >
              {saving ? 'Saving...' : 'Save Key'}
            </button>
          </div>
        </div>

        {/* Global Tolerance */}
        <div className="mb-4" style={{ paddingBottom: '20px', borderBottom: '1px solid var(--gray-200)' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Global Tolerance</h3>
          <p className="text-sm text-muted mb-2">
            Applied to all 24 dimensions equally. Default: ±2
          </p>
          <div className="flex" style={{ alignItems: 'center' }}>
            <input
              type="range"
              min="0"
              max="10"
              value={globalTolerance}
              onChange={(e) => handleGlobalToleranceChange(e.target.value)}
              style={{ flex: 1 }}
            />
            <span style={{ marginLeft: '12px', fontWeight: 'bold', minWidth: '50px' }}>
              ±{globalTolerance}
            </span>
          </div>
        </div>

        {/* Per-Dimension Overrides */}
        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Per-Dimension Overrides</h3>
          <p className="text-sm text-muted mb-2">
            Fine-tune tolerance for individual dimensions.
          </p>
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Tolerance</th>
                </tr>
              </thead>
              <tbody>
                {dimensions.map(dim => (
                  <tr key={dim.code}>
                    <td><strong>{dim.code}</strong></td>
                    <td>{dim.name}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={customTolerances[dim.code] || 2}
                        onChange={(e) => handleCustomToleranceChange(dim.code, e.target.value)}
                        style={{
                          width: '60px',
                          padding: '4px 8px',
                          border: '1px solid var(--gray-300)',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
