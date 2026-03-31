# DNA Fingerprinting System

**Copyright (c) 2026. All Rights Reserved.**  
**Proprietary and Confidential.**

A full-stack writing fingerprinting tool that extracts 24-dimensional DNA profiles from text, rewrites articles to match target styles, and provides visual comparison dashboards.

## Features

- **DNA Extractor** - Scores text across 24 mathematical dimensions (0-100 scale)
- **DNA Rewriter** - Iteratively rewrites articles using Claude API to match target DNA
- **Comparison UI** - Radar chart, bar chart, and detailed dimension table
- **Admin Settings** - Configurable tolerances and API key management
- **Anti-AI Rules** - Hard constraints to ensure natural, human-like writing

## The 24 Dimensions

All dimensions score 0-100 through deterministic mathematical formulas:

1. **PRP** - Personal Pronoun Rate
2. **BST** - Burstiness (sentence length variation)
3. **REP** - Repetition Score
4. **STR** - Sentence Starter Ratio
5. **VOC** - Vocabulary Intimacy
6. **GRM** - Grammar Formality (active vs passive)
7. **SEM** - Semantic Complexity (long words)
8. **TNE** - Hedging Tone
9. **LGC** - Logical Connectors
10. **STY** - Stylistic Density (parentheses, dashes)
11. **PCT** - Punctuation Density
12. **CAP** - Capitalisation Rate (acronyms)
13. **HAP** - Hapax Ratio (unique words)
14. **VOG** - Vagueness Guard
15. **COH** - Cohesion Score (sentence linking)
16. **SYN** - Syntactic Complexity
17. **SPE** - Specificity (numeric content)
18. **EPI** - Epistemic Markers
19. **FWD** - Forward References
20. **PRH** - Paragraph Rhythm
21. **DRF** - Discourse Rhythm Fractal
22. **MRP** - Motif Repetition Pattern
23. **PRV** - Paragraph Rhythm Variance
24. **BSV** - Burstiness Skew

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key (claude-sonnet-4-6 access)

### Installation

```bash
# Install all dependencies
npm run install:all

# Set your API key (you can also set it via the UI)
cd backend
echo "ANTHROPIC_API_KEY=sk-ant-api03-your-key-here" > .env
cd ..
```

### Run Development Servers

```bash
# Start both backend and frontend
npm run dev

# Or run separately:
npm run dev:backend  # API server on http://localhost:3001
npm run dev:frontend # React UI on http://localhost:3000
```

### Production Build

```bash
# Build frontend for production
npm run build

# Start backend server
npm start
```

## Usage

### 1. Extract Source DNA

1. Paste your source article (minimum 200 words)
2. Click "Extract DNA"
3. The system scores all 24 dimensions

### 2. Rewrite to Match DNA

1. Paste a new article on a different topic
2. Click "Rewrite to Match DNA"
3. The system iteratively rewrites (max 8 iterations) until all dimensions are within tolerance

### 3. Compare Results

- **Radar Chart** - Visual overlay of source vs rewritten DNA
- **Bar Chart** - Sorted by gap size (largest mismatches first)
- **Dimension Table** - Detailed pass/fail status for each dimension
- **Text Comparison** - Side-by-side view of original and rewritten articles

### 4. Configure Settings

- **API Key** - Set your Anthropic API key
- **Global Tolerance** - Apply one tolerance value to all 24 dimensions (default: ±2)
- **Per-Dimension Overrides** - Fine-tune tolerance for individual dimensions

## Tolerance System

- **Default:** ±2 for all 24 dimensions
- **Strict Mode:** Lower tolerance for precision matching
- **Relaxed Mode:** Higher tolerance for broader style transfer
- **All dimensions must pass simultaneously** for a successful rewrite

## Anti-AI Writing Rules

Every rewrite enforces hard constraints to avoid AI writing tells:

✕ No em-dashes for dramatic effect  
✕ No semicolons in lists  
✕ No "In conclusion" or "It is worth noting that"  
✕ No three-part parallel structures  
✕ No starting sentences with "This" referring to previous subject  
✕ No AI buzzwords (delve, leverage, holistic, seamless, robust, etc.)  
✕ No perfectly balanced paragraphs  
✕ No numbered-list prose  

✓ Use sentence fragments occasionally  
✓ Vary sentence openings radically  
✓ Use contractions where appropriate  
✓ Let sentence lengths vary dramatically  

## API Endpoints

### `POST /api/extract`
Extract DNA from text.

```json
{
  "text": "Your article text here..."
}
```

Response:
```json
{
  "success": true,
  "dna": {
    "PRP": 45,
    "BST": 67,
    ...
  },
  "wordCount": 523
}
```

### `POST /api/rewrite`
Rewrite article to match target DNA.

```json
{
  "article": "Article to rewrite...",
  "sourceDNA": { ... },
  "tolerances": { "PRP": 2, "BST": 2, ... },
  "maxIterations": 8
}
```

### `POST /api/compare`
Compare two DNA profiles.

```json
{
  "sourceDNA": { ... },
  "rewrittenDNA": { ... },
  "tolerances": { ... }
}
```

### `GET /api/dimensions`
Get all dimension metadata.

### `POST /api/config/api-key`
Set Anthropic API key.

## Architecture

```
dna-fingerprint/
├── shared/
│   ├── dna-engine.js      # 24 scoring functions (deterministic)
│   ├── rewriter.js        # Rewriting loop with Claude API
│   └── anti-ai-rules.js   # Hard constraints for natural writing
├── backend/
│   ├── server.js          # Express API server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DNAExtractor.jsx
│   │   │   ├── DNARewriter.jsx
│   │   │   ├── ComparisonUI.jsx
│   │   │   ├── RadarChart.jsx
│   │   │   ├── BarChart.jsx
│   │   │   ├── DimensionTable.jsx
│   │   │   └── SettingsPanel.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── package.json
```

## Security & IP Protection

- **Proprietary System** - All code, formulas, and algorithms are confidential
- **No Open Source** - Never licensed under MIT, Apache, GPL, or any OSS licence
- **Private Repository Only** - Host on private GitHub/GitLab
- **API Key Security** - Store keys in environment variables, never commit to version control
- **Server-Side Scoring** - DNA engine runs server-side only, never exposed to clients

## Technical Notes

### Deterministic Scoring

All 24 scoring functions are **pure mathematical computations**. Same input text always returns identical scores. No randomness, no model calls in the scoring engine.

### Coefficient of Variation (CV)

For dimensions DRF, MRP, PRV: use `cv = std / mean` (NOT `std / max(mean, 1)`). The latter is a known bug that makes high scores mathematically unreachable.

### Rewrite Loop

1. Score new article
2. Identify failing dimensions (outside tolerance)
3. Build prompt with target table + anti-AI rules
4. Call Claude API
5. Re-score rewritten text
6. Repeat until all 24 dimensions pass or max iterations reached

## Troubleshooting

### API Key Not Working
- Check that your key starts with `sk-ant-api03-`
- Verify you have access to `claude-sonnet-4-20250514`
- Set via Settings UI or `ANTHROPIC_API_KEY` environment variable

### "Text must be at least 200 words"
- DNA extraction requires minimum 200 words for reliable scoring
- Shorter texts produce unstable scores

### Rewrite Not Converging
- Increase global tolerance (try ±3 or ±4)
- Increase max iterations (default: 8)
- Some dimension combinations are mathematically difficult to achieve simultaneously

### Charts Not Rendering
- Check browser console for errors
- Ensure Chart.js and react-chartjs-2 are installed
- Verify backend API is running on port 3001

## Licence

All Rights Reserved. Proprietary and Confidential.

Unauthorised copying, modification, distribution, or use of this software or any portion thereof via any medium is strictly prohibited without prior written permission.

---

**Copyright (c) 2026. All Rights Reserved.**
