# DNA Fingerprinting API - For Lovable Integration

## 🎯 Overview

This API provides writing DNA extraction and rewriting capabilities. Lovable will create the UI that calls these endpoints.

**Base URL:** `http://108.61.89.51:3001`  
**CORS:** Enabled for all origins  
**Authentication:** None required (API key configured server-side)

---

## 📡 API Endpoints

### 1. Extract DNA from Text

**Endpoint:** `POST /api/extract`

**Description:** Analyzes text and returns 24-dimensional DNA fingerprint.

**Request:**
```json
{
  "text": "Your article text here (minimum 200 words)..."
}
```

**Response:**
```json
{
  "success": true,
  "dna": {
    "PRP": 45,
    "BST": 67,
    "REP": 82,
    "STR": 91,
    "VOC": 23,
    ... (24 dimensions total)
  },
  "wordCount": 523
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Text must be at least 200 words for reliable scoring"
}
```

---

### 2. Rewrite Article to Match DNA

**Endpoint:** `POST /api/rewrite`

**Description:** Iteratively rewrites an article using Claude API until it matches target DNA profile.

**Request:**
```json
{
  "article": "New article to rewrite...",
  "sourceDNA": {
    "PRP": 45,
    "BST": 67,
    ... (all 24 dimensions)
  },
  "tolerances": {
    "PRP": 2,
    "BST": 2,
    ... (all 24 dimensions)
  },
  "maxIterations": 8
}
```

**Response:**
```json
{
  "success": true,
  "article": "Rewritten article text...",
  "dna": {
    "PRP": 44,
    "BST": 68,
    ... (all 24 dimensions)
  },
  "iterations": 5,
  "passed": true,
  "history": [...],
  "finalFailing": []
}
```

**Notes:**
- Takes 30-90 seconds depending on convergence
- `passed: true` means all 24 dimensions are within tolerance
- `finalFailing` array lists dimensions that didn't converge (if any)

---

### 3. Compare Two DNA Profiles

**Endpoint:** `POST /api/compare`

**Description:** Compares source and rewritten DNA with tolerance checking.

**Request:**
```json
{
  "sourceDNA": { ... },
  "rewrittenDNA": { ... },
  "tolerances": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "comparison": [
    {
      "dim": "PRP",
      "name": "Personal Pronoun Rate",
      "description": "Count first-person pronouns...",
      "source": 45,
      "rewritten": 44,
      "gap": 1,
      "tolerance": 2,
      "passing": true
    },
    ... (24 dimensions)
  ],
  "passingCount": 22,
  "totalCount": 24,
  "allPass": false
}
```

---

### 4. Get Dimensions Metadata

**Endpoint:** `GET /api/dimensions`

**Description:** Returns information about all 24 dimensions.

**Response:**
```json
{
  "success": true,
  "dimensions": [
    {
      "code": "PRP",
      "name": "Personal Pronoun Rate",
      "description": "Count first-person pronouns (I, me, my, we, us, our). High = personal writing. Low = formal third-person."
    },
    ... (24 total)
  ],
  "defaultTolerance": 2
}
```

---

### 5. Health Check

**Endpoint:** `GET /health`

**Description:** Check if API is running and API key is configured.

**Response:**
```json
{
  "status": "ok",
  "apiKeyConfigured": true
}
```

---

## 🎨 UI Components Lovable Should Build

### Component 1: DNA Extractor
- **Textarea** for article input (min 200 words)
- **Word counter** below textarea
- **"Extract DNA" button** (disabled if <200 words)
- **Loading state** during extraction
- **Success message** with word count

### Component 2: DNA Rewriter
- **Textarea** for new article
- **"Rewrite to Match DNA" button**
- **Progress indicator** showing iterations (e.g., "Iteration 3/8")
- **Progress bar** showing X/24 passing
- **Success/failure message**

### Component 3: Comparison Dashboard
- **Radar Chart** (24-axis spider chart)
  - Blue polygon = source DNA
  - Orange polygon = rewritten DNA
  - Use Chart.js or similar
  
- **Bar Chart** (horizontal bars, sorted by gap)
  - Source bar (blue)
  - Rewritten bar (orange)
  - Pass/fail indicator
  
- **Dimension Table**
  - Columns: Code | Name | Source | Rewritten | Gap | Status
  - Sortable columns
  - Expandable rows for full description
  - Color-coded pass/fail

### Component 4: Settings Panel
- **Global tolerance slider** (0-10, default 2)
- **Per-dimension tolerance inputs** (24 inputs)
- **Max iterations input** (default 8)

---

## 📊 The 24 Dimensions (for UI labels)

| Code | Name | Description |
|------|------|-------------|
| PRP | Personal Pronoun Rate | First-person pronouns |
| BST | Burstiness | Sentence length variation |
| REP | Repetition Score | Penalises repeated phrases |
| STR | Sentence Starter Ratio | Unique sentence openings |
| VOC | Vocabulary Intimacy | Conversational closeness |
| GRM | Grammar Formality | Active vs passive voice |
| SEM | Semantic Complexity | Long words (8+ letters) |
| TNE | Hedging Tone | Academic caution |
| LGC | Logical Connectors | Argument transitions |
| STY | Stylistic Density | Parentheses and dashes |
| PCT | Punctuation Density | Complex punctuation |
| CAP | Capitalisation Rate | Acronyms (NLP, AI) |
| HAP | Hapax Ratio | Vocabulary richness |
| VOG | Vagueness Guard | Avoids vague fillers |
| COH | Cohesion Score | Sentence linking |
| SYN | Syntactic Complexity | Nested clauses |
| SPE | Specificity | Numeric content |
| EPI | Epistemic Markers | Confidence signals |
| FWD | Forward References | Future-oriented language |
| PRH | Paragraph Rhythm | Paragraph variation |
| DRF | Discourse Rhythm Fractal | Fractal patterns |
| MRP | Motif Repetition Pattern | Phrase spacing |
| PRV | Paragraph Rhythm Variance | Paragraph length jumps |
| BSV | Burstiness Skew | Distribution asymmetry |

---

## 🚀 Example Workflow

```javascript
// 1. User pastes source article
const sourceResponse = await fetch('http://108.61.89.51:3001/api/extract', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: sourceArticle })
});
const { dna: sourceDNA } = await sourceResponse.json();

// 2. User pastes new article and clicks "Rewrite"
const rewriteResponse = await fetch('http://108.61.89.51:3001/api/rewrite', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    article: newArticle,
    sourceDNA: sourceDNA,
    tolerances: { PRP: 2, BST: 2, ... }, // all 24
    maxIterations: 8
  })
});
const { article: rewritten, dna: rewrittenDNA } = await rewriteResponse.json();

// 3. Display comparison
const compareResponse = await fetch('http://108.61.89.51:3001/api/compare', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sourceDNA,
    rewrittenDNA,
    tolerances: { PRP: 2, BST: 2, ... }
  })
});
const { comparison, passingCount } = await compareResponse.json();

// Render: Radar chart + Bar chart + Table
```

---

## ⚠️ Important Notes

1. **Minimum text length:** 200 words required for stable DNA extraction
2. **Rewrite time:** 30-90 seconds (8 API calls to Claude Sonnet 4)
3. **Tolerance default:** ±2 for all 24 dimensions
4. **All dimensions must pass:** Success only when all 24 are within tolerance simultaneously
5. **CORS enabled:** API accepts requests from any origin

---

## 🎯 What to Tell Lovable

**Prompt for Lovable:**

> "Build a DNA Fingerprinting System UI with:
> 1. Text input for article extraction (min 200 words)
> 2. Display 24 DNA dimensions with scores 0-100
> 3. Rewrite interface with progress tracking
> 4. Comparison dashboard with radar chart, bar chart, and sortable table
> 5. Settings panel for tolerance configuration
> 
> API Base URL: http://108.61.89.51:3001
> 
> Endpoints:
> - POST /api/extract (extract DNA)
> - POST /api/rewrite (rewrite article)
> - POST /api/compare (compare DNAs)
> - GET /api/dimensions (dimension metadata)
> - GET /health (health check)
> 
> Use Chart.js for visualizations. Modern, clean design with gradient purple/blue theme."

---

## 📞 Testing the API

```bash
# Health check
curl http://108.61.89.51:3001/health

# Get dimensions
curl http://108.61.89.51:3001/api/dimensions

# Extract DNA (sample)
curl -X POST http://108.61.89.51:3001/api/extract \
  -H "Content-Type: application/json" \
  -d '{"text":"Your 200+ word article here..."}'
```

---

**API Status:** ✅ Live and ready for Lovable integration!
