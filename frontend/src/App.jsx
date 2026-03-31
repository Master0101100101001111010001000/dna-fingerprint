/**
 * Copyright (c) 2026. All Rights Reserved.
 * Proprietary and Confidential.
 */

import React, { useState, useEffect } from 'react'
import DNAExtractor from './components/DNAExtractor'
import DNARewriter from './components/DNARewriter'
import ComparisonUI from './components/ComparisonUI'
import SettingsPanel from './components/SettingsPanel'

function App() {
  const [sourceDNA, setSourceDNA] = useState(null)
  const [sourceText, setSourceText] = useState('')
  const [rewrittenDNA, setRewrittenDNA] = useState(null)
  const [rewrittenText, setRewrittenText] = useState('')
  const [tolerances, setTolerances] = useState(null)
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    // Check API key status on mount
    checkApiKey()
    // Load default tolerances
    loadDefaultTolerances()
  }, [])

  const checkApiKey = async () => {
    try {
      const res = await fetch('/api/config/api-key')
      const data = await res.json()
      setApiKeyConfigured(data.configured)
    } catch (error) {
      console.error('Failed to check API key:', error)
    }
  }

  const loadDefaultTolerances = async () => {
    try {
      const res = await fetch('/api/dimensions')
      const data = await res.json()
      
      const defaultTols = {}
      data.dimensions.forEach(dim => {
        defaultTols[dim.code] = data.defaultTolerance
      })
      
      setTolerances(defaultTols)
    } catch (error) {
      console.error('Failed to load default tolerances:', error)
    }
  }

  const handleSourceExtracted = (dna, text) => {
    setSourceDNA(dna)
    setSourceText(text)
    // Reset rewritten state when new source is extracted
    setRewrittenDNA(null)
    setRewrittenText('')
  }

  const handleRewriteComplete = (result) => {
    setRewrittenDNA(result.dna)
    setRewrittenText(result.article)
  }

  return (
    <div className="app">
      <div className="header">
        <div className="container">
          <div className="flex-between">
            <div>
              <h1>DNA Fingerprinting System</h1>
              <p className="text-muted">Extract, rewrite, and compare writing DNA profiles</p>
            </div>
            <button
              className="button button-secondary"
              onClick={() => setShowSettings(!showSettings)}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {!apiKeyConfigured && (
          <div className="alert alert-warning">
            <strong>API Key Required:</strong> Configure your Anthropic API key in Settings to use the rewriter.
          </div>
        )}

        {showSettings && (
          <SettingsPanel
            tolerances={tolerances}
            onTolerancesChange={setTolerances}
            onApiKeySet={checkApiKey}
            onClose={() => setShowSettings(false)}
          />
        )}

        <div className="grid grid-2">
          <DNAExtractor
            onExtracted={handleSourceExtracted}
            existingDNA={sourceDNA}
            existingText={sourceText}
          />

          {sourceDNA && tolerances && (
            <DNARewriter
              sourceDNA={sourceDNA}
              tolerances={tolerances}
              onRewriteComplete={handleRewriteComplete}
              disabled={!apiKeyConfigured}
            />
          )}
        </div>

        {sourceDNA && rewrittenDNA && tolerances && (
          <ComparisonUI
            sourceDNA={sourceDNA}
            rewrittenDNA={rewrittenDNA}
            tolerances={tolerances}
            sourceText={sourceText}
            rewrittenText={rewrittenText}
          />
        )}
      </div>
    </div>
  )
}

export default App
