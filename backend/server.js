/**
 * Copyright (c) 2026. All Rights Reserved.
 * Proprietary and Confidential.
 * This file and the system it belongs to are the exclusive
 * intellectual property of the owner. Unauthorised copying,
 * modification, distribution, or use of this file via any
 * medium is strictly prohibited without prior written permission.
 */

const express = require('express');
const cors = require('cors');
const { extractDNA, DIMS_24, DIM_NAMES, DIM_DESCRIPTIONS } = require('../shared/dna-engine');
const { rewriteToMatchDNA } = require('../shared/rewriter');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - Allow Lovable and all origins for demo
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Better JSON parsing with error handling
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      console.error('Invalid JSON received:', buf.toString().substring(0, 200));
      console.error('Error:', e.message);
    }
  }
}));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Store API key (in production, use proper secrets management)
let ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

// Default tolerance settings
const DEFAULT_TOLERANCE = 2;
const DEFAULT_TOLERANCES = DIMS_24.reduce((acc, dim) => {
  acc[dim] = DEFAULT_TOLERANCE;
  return acc;
}, {});

// ============================================
// API Endpoints
// ============================================

/**
 * POST /api/extract
 * Extract DNA from text
 */
app.post('/api/extract', (req, res) => {
  try {
    console.log('Extract request received. Body type:', typeof req.body);
    console.log('Body keys:', Object.keys(req.body || {}));
    
    const { text } = req.body || {};
    
    if (!text || typeof text !== 'string') {
      console.error('Invalid text:', typeof text);
      return res.status(400).json({ 
        success: false,
        error: 'Text is required and must be a string',
        received: typeof text
      });
    }
    
    console.log('Extracting DNA from', text.length, 'characters');
    const dna = extractDNA(text);
    
    console.log('DNA extracted successfully');
    res.json({
      success: true,
      dna,
      wordCount: text.split(/\s+/).filter(w => w.length > 0).length
    });
  } catch (error) {
    console.error('Extract error:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/rewrite
 * Rewrite article to match target DNA
 */
app.post('/api/rewrite', async (req, res) => {
  try {
    const { article, sourceDNA, tolerances, maxIterations } = req.body;
    
    if (!article || typeof article !== 'string') {
      return res.status(400).json({ error: 'Article is required' });
    }
    
    if (!sourceDNA || typeof sourceDNA !== 'object') {
      return res.status(400).json({ error: 'Source DNA is required' });
    }
    
    if (!ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'Anthropic API key not configured' });
    }
    
    const toleranceConfig = tolerances || DEFAULT_TOLERANCES;
    
    const result = await rewriteToMatchDNA(
      article,
      sourceDNA,
      toleranceConfig,
      ANTHROPIC_API_KEY,
      {
        maxIterations: maxIterations || 8,
        onProgress: (progress) => {
          // In production, use WebSockets for real-time updates
          console.log(`Iteration ${progress.iteration}/${progress.maxIter} - ${progress.passing || 0}/24 passing`);
        }
      }
    );
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Rewrite error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/dimensions
 * Get all dimension metadata
 */
app.get('/api/dimensions', (req, res) => {
  const dimensions = DIMS_24.map(code => ({
    code,
    name: DIM_NAMES[code],
    description: DIM_DESCRIPTIONS[code]
  }));
  
  res.json({
    success: true,
    dimensions,
    defaultTolerance: DEFAULT_TOLERANCE
  });
});

/**
 * POST /api/config/api-key
 * Set Anthropic API key
 */
app.post('/api/config/api-key', (req, res) => {
  const { apiKey } = req.body;
  
  if (!apiKey || typeof apiKey !== 'string') {
    return res.status(400).json({ error: 'API key is required' });
  }
  
  ANTHROPIC_API_KEY = apiKey;
  
  res.json({
    success: true,
    message: 'API key configured'
  });
});

/**
 * GET /api/config/api-key
 * Check if API key is configured
 */
app.get('/api/config/api-key', (req, res) => {
  res.json({
    success: true,
    configured: !!ANTHROPIC_API_KEY,
    masked: ANTHROPIC_API_KEY ? `${ANTHROPIC_API_KEY.slice(0, 10)}...` : null
  });
});

/**
 * POST /api/compare
 * Compare two DNA profiles
 */
app.post('/api/compare', (req, res) => {
  try {
    const { sourceDNA, rewrittenDNA, tolerances } = req.body;
    
    if (!sourceDNA || !rewrittenDNA) {
      return res.status(400).json({ error: 'Both DNA profiles are required' });
    }
    
    const toleranceConfig = tolerances || DEFAULT_TOLERANCES;
    
    const comparison = DIMS_24.map(dim => {
      const source = sourceDNA[dim];
      const rewritten = rewrittenDNA[dim];
      const gap = Math.abs(source - rewritten);
      const tolerance = toleranceConfig[dim];
      const passing = gap <= tolerance;
      
      return {
        dim,
        name: DIM_NAMES[dim],
        description: DIM_DESCRIPTIONS[dim],
        source,
        rewritten,
        gap,
        tolerance,
        passing
      };
    });
    
    const passingCount = comparison.filter(c => c.passing).length;
    
    res.json({
      success: true,
      comparison,
      passingCount,
      totalCount: 24,
      allPass: passingCount === 24
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    apiKeyConfigured: !!ANTHROPIC_API_KEY
  });
});

// Start server - bind to 0.0.0.0 to accept external connections
app.listen(PORT, '0.0.0.0', () => {
  console.log(`DNA Fingerprint API server running on port ${PORT}`);
  console.log(`Listening on 0.0.0.0:${PORT} (accessible externally)`);
  console.log(`Anthropic API key: ${ANTHROPIC_API_KEY ? 'Configured' : 'Not configured'}`);
});

module.exports = app;
