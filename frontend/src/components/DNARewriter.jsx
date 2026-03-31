/**
 * Copyright (c) 2026. All Rights Reserved.
 * Proprietary and Confidential.
 */

import React, { useState } from 'react'

function DNARewriter({ sourceDNA, tolerances, onRewriteComplete, disabled }) {
  const [article, setArticle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(null)
  const [wordCount, setWordCount] = useState(0)

  const handleArticleChange = (e) => {
    const newText = e.target.value
    setArticle(newText)
    setWordCount(newText.trim().split(/\s+/).filter(w => w.length > 0).length)
    setError(null)
  }

  const handleRewrite = async () => {
    setLoading(true)
    setError(null)
    setProgress({ iteration: 0, maxIter: 8, passing: 0 })

    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article,
          sourceDNA,
          tolerances,
          maxIterations: 8
        })
      })

      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      setProgress(null)
      onRewriteComplete(data)
    } catch (err) {
      setError(err.message)
      setProgress(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>2. Rewrite to Match DNA</h2>
      <p className="text-muted mb-4">
        Paste a new article to rewrite in the same style as your source.
      </p>

      <textarea
        className="textarea"
        placeholder="Paste the article you want to rewrite..."
        value={article}
        onChange={handleArticleChange}
        disabled={disabled}
      />

      <div className="flex-between mt-4">
        <span className="text-sm text-muted">
          {wordCount} words
        </span>
        <button
          className="button"
          onClick={handleRewrite}
          disabled={loading || wordCount < 200 || disabled}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Rewriting...
            </>
          ) : (
            '✍️ Rewrite to Match DNA'
          )}
        </button>
      </div>

      {disabled && (
        <div className="alert alert-warning mt-4">
          Configure your Anthropic API key in Settings to use the rewriter.
        </div>
      )}

      {error && (
        <div className="alert alert-warning mt-4">
          {error}
        </div>
      )}

      {progress && (
        <div className="mt-4">
          <div className="flex-between mb-2">
            <span className="text-sm">
              Iteration {progress.iteration} / {progress.maxIter}
            </span>
            <span className="text-sm text-muted">
              {progress.passing} / 24 passing
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(progress.passing / 24) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default DNARewriter
