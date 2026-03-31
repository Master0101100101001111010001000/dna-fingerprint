/**
 * Copyright (c) 2026. All Rights Reserved.
 * Proprietary and Confidential.
 */

import React, { useState } from 'react'

function DNAExtractor({ onExtracted, existingDNA, existingText }) {
  const [text, setText] = useState(existingText || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [wordCount, setWordCount] = useState(0)

  const handleTextChange = (e) => {
    const newText = e.target.value
    setText(newText)
    setWordCount(newText.trim().split(/\s+/).filter(w => w.length > 0).length)
    setError(null)
  }

  const handleExtract = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      onExtracted(data.dna, text)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>1. Extract Source DNA</h2>
      <p className="text-muted mb-4">
        Paste your source article (min 200 words) to extract its writing DNA profile.
      </p>

      <textarea
        className="textarea"
        placeholder="Paste your article here..."
        value={text}
        onChange={handleTextChange}
      />

      <div className="flex-between mt-4">
        <span className="text-sm text-muted">
          {wordCount} words {wordCount < 200 && `(need ${200 - wordCount} more)`}
        </span>
        <button
          className="button"
          onClick={handleExtract}
          disabled={loading || wordCount < 200}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Extracting...
            </>
          ) : (
            '🧬 Extract DNA'
          )}
        </button>
      </div>

      {error && (
        <div className="alert alert-warning mt-4">
          {error}
        </div>
      )}

      {existingDNA && (
        <div className="alert alert-success mt-4">
          ✓ DNA extracted: 24 dimensions scored
        </div>
      )}
    </div>
  )
}

export default DNAExtractor
