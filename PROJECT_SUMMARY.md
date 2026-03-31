# DNA Fingerprinting System - Project Summary

**Copyright (c) 2026. All Rights Reserved.**  
**Status:** ✅ Complete and Ready for Use

---

## 🎯 What This System Does

A proprietary full-stack application that:

1. **Extracts writing DNA** from any text by scoring 24 mathematical dimensions (0-100 scale)
2. **Rewrites articles** iteratively using Claude API until they match a target DNA profile
3. **Visualizes comparisons** with radar charts, bar charts, and detailed dimension tables
4. **Enforces anti-AI rules** to ensure natural, human-like writing output

---

## 📁 Project Structure

```
dna-fingerprint/
├── shared/                         # Core DNA engine (deterministic)
│   ├── dna-engine.js              # 24 scoring functions
│   ├── rewriter.js                # Rewriting loop with Claude API
│   └── anti-ai-rules.js           # Hard constraints for natural writing
│
├── backend/                        # Express API server
│   ├── server.js                  # REST API endpoints
│   ├── package.json
│   ├── .env                       # API key (DO NOT COMMIT)
│   └── .env.example
│
├── frontend/                       # React UI with Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── DNAExtractor.jsx   # Step 1: Extract source DNA
│   │   │   ├── DNARewriter.jsx    # Step 2: Rewrite to match
│   │   │   ├── ComparisonUI.jsx   # Step 3: View results
│   │   │   ├── RadarChart.jsx     # 24-axis spider chart
│   │   │   ├── BarChart.jsx       # Sorted horizontal bars
│   │   │   ├── DimensionTable.jsx # Detailed pass/fail table
│   │   │   └── SettingsPanel.jsx  # Admin config
│   │   ├── App.jsx                # Main application
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── test-engine.js                  # Verification script
├── start.sh                        # Quick-start launcher
├── README.md                       # Full documentation
├── LICENCE                         # All Rights Reserved
├── .gitignore
└── package.json                    # Root scripts
```

---

## ⚙️ How to Run

### First Time Setup

```bash
cd /root/.openclaw/workspace/dna-fingerprint

# Dependencies already installed ✓
# API key already configured ✓
```

### Start the System

```bash
# Option 1: Use the launcher script
./start.sh

# Option 2: Use npm
npm run dev
```

This starts:
- **Backend:** `http://localhost:3001` (API server)
- **Frontend:** `http://localhost:3000` (React UI)

### Test the Engine

```bash
node test-engine.js
```

Should output:
```
✓ DNA Extraction Successful!
✓ All 24 dimensions scored successfully!
✓ Determinism verified: Same input → Same output
```

---

## 🧬 The 24 Dimensions (DNA Codes)

| Code | Dimension Name | What It Measures |
|------|---------------|------------------|
| **PRP** | Personal Pronoun Rate | First-person pronouns (I, me, we, us) |
| **BST** | Burstiness | Sentence length variation (human = high) |
| **REP** | Repetition Score | Penalises repeated bigrams and keywords |
| **STR** | Sentence Starter Ratio | Unique sentence openings |
| **VOC** | Vocabulary Intimacy | Conversational closeness (you, your, I, me) |
| **GRM** | Grammar Formality | Active vs passive voice |
| **SEM** | Semantic Complexity | Percentage of long words (8+ letters) |
| **TNE** | Hedging Tone | Academic caution (might, may, perhaps) |
| **LGC** | Logical Connectors | Argument transitions (however, therefore) |
| **STY** | Stylistic Density | Parentheses and em-dashes |
| **PCT** | Punctuation Density | Complex sentence structures |
| **CAP** | Capitalisation Rate | Acronyms (NLP, AI, GPA) |
| **HAP** | Hapax Ratio | Words appearing exactly once |
| **VOG** | Vagueness Guard | Penalises vague fillers |
| **COH** | Cohesion Score | Shared vocabulary between sentences |
| **SYN** | Syntactic Complexity | Subordinating conjunctions |
| **SPE** | Specificity | Numeric tokens (data-heavy writing) |
| **EPI** | Epistemic Markers | Confidence signals (clearly, obviously) |
| **FWD** | Forward References | Future-oriented language |
| **PRH** | Paragraph Rhythm | Paragraph length variation |
| **DRF** | Discourse Rhythm Fractal | Fractal rhythm pattern |
| **MRP** | Motif Repetition Pattern | Bigram repetition gaps |
| **PRV** | Paragraph Rhythm Variance | Consecutive paragraph differences |
| **BSV** | Burstiness Skew | Sentence length distribution asymmetry |

---

## 🎯 Workflow

### Step 1: Extract Source DNA

1. Open `http://localhost:3000`
2. Paste your **source article** (min 200 words)
3. Click **"🧬 Extract DNA"**
4. System scores all 24 dimensions instantly

### Step 2: Rewrite to Match DNA

1. Paste a **new article** on a different topic
2. Click **"✍️ Rewrite to Match DNA"**
3. System iteratively rewrites (max 8 iterations)
4. Watch live progress: "Iteration 3/8 — 18/24 passing"

### Step 3: View Comparison

Once complete, you see:

- **Radar Chart** - 24-axis spider chart with overlapping source/rewritten DNA
- **Bar Chart** - Sorted by gap size (biggest mismatches first)
- **Dimension Table** - Click any row to expand full description
- **Text Comparison** - Side-by-side source and rewritten articles

---

## 🔧 Settings & Configuration

Click **⚙️ Settings** to access:

### API Key Management
- Paste your Anthropic API key
- Key is stored in server memory (not persisted to disk by default)
- Alternatively: set `ANTHROPIC_API_KEY` in `backend/.env`

### Tolerance Configuration

**Global Tolerance** (default: ±2)
- Slider applies same tolerance to all 24 dimensions
- Range: 0–10
- Example: ±2 means a dimension scoring 67 can accept rewritten scores 65–69

**Per-Dimension Overrides**
- Fine-tune individual dimensions
- Useful when some dimensions are harder to match

**How Tolerance Works**
- A rewrite **only succeeds** when **all 24 dimensions** pass simultaneously
- Each dimension must be within `±tolerance` of the source value
- Lower tolerance = stricter matching
- Higher tolerance = broader style transfer

---

## 🛡️ Anti-AI Writing Rules

Every rewrite enforces these hard constraints:

### ✕ Never Do This (AI Tells)

- Em-dashes (—) for dramatic effect
- Semicolons in lists
- "In conclusion", "In summary", "It is worth noting that"
- Three-part parallel verb structures
- Starting sentences with "This" referring to previous subject
- AI buzzwords: delve, leverage, holistic, seamless, robust, comprehensive, groundbreaking, transformative, synergy, cutting-edge, innovative, scalable, streamline
- Perfectly balanced paragraphs
- Numbered-list prose ("First...", "Second...", "Third...")
- "plays a crucial role" or "plays a key role"

### ✓ Always Do This (Human Signals)

- Use sentence fragments occasionally
- Vary sentence openings radically
- Use contractions where appropriate (don't, it's, we're)
- Let sentence lengths vary dramatically (3-word sentence → 35-word sentence)

---

## 📊 API Endpoints

### Extract DNA
```http
POST /api/extract
Content-Type: application/json

{
  "text": "Your article text..."
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

### Rewrite Article
```http
POST /api/rewrite
Content-Type: application/json

{
  "article": "Article to rewrite...",
  "sourceDNA": { "PRP": 45, "BST": 67, ... },
  "tolerances": { "PRP": 2, "BST": 2, ... },
  "maxIterations": 8
}
```

### Compare DNA Profiles
```http
POST /api/compare
Content-Type: application/json

{
  "sourceDNA": { ... },
  "rewrittenDNA": { ... },
  "tolerances": { ... }
}
```

### Get Dimensions Metadata
```http
GET /api/dimensions
```

### Configure API Key
```http
POST /api/config/api-key
Content-Type: application/json

{
  "apiKey": "sk-ant-api03-..."
}
```

---

## 🔒 Security & IP Protection

### Intellectual Property

- **All Rights Reserved** - This system is proprietary
- **No Open Source Licence** - Never licensed under MIT, Apache, GPL
- **Private Repository Only** - Never make public on GitHub
- **Copyright Header** - Added to every source file

### Security Measures

- API key stored in `.env` (excluded via `.gitignore`)
- DNA scoring engine runs **server-side only**
- Formulas never exposed to client
- No reverse-engineering via browser inspection

---

## ✅ Verification Checklist

Run this checklist to verify everything works:

```bash
# 1. Test DNA engine (deterministic scoring)
node test-engine.js
# Expected: ✓ All 24 dimensions scored successfully!

# 2. Start servers
./start.sh
# Expected: Backend on :3001, Frontend on :3000

# 3. Open browser
# Navigate to http://localhost:3000
# Expected: DNA Fingerprinting System UI loads

# 4. Extract DNA
# Paste 200+ word article → Click "Extract DNA"
# Expected: "✓ DNA extracted: 24 dimensions scored"

# 5. Test rewriter (requires API key)
# Paste new article → Click "Rewrite to Match DNA"
# Expected: Progress bar shows iterations, final comparison renders
```

---

## 🐛 Troubleshooting

### "Text must be at least 200 words"
- DNA extraction requires minimum 200 words
- Shorter texts produce unstable scores

### "Anthropic API key not configured"
- Go to Settings → Paste your API key
- Or set `ANTHROPIC_API_KEY` in `backend/.env`

### Frontend won't start
```bash
cd frontend
npm install
npm run dev
```

### Backend won't start
```bash
cd backend
npm install
node server.js
```

### Charts not rendering
- Check browser console for errors
- Ensure Chart.js is installed: `cd frontend && npm list chart.js`

### Rewrite not converging
- Increase global tolerance (±3 or ±4)
- Increase max iterations
- Some dimension combinations are hard to achieve simultaneously

---

## 📝 Development Notes

### Determinism Guarantee

The DNA engine is **fully deterministic**:
- Same input text → Same 24 scores (always)
- No randomness, no model calls, pure math
- Verified by `test-engine.js`

### Critical Bug Fix

For dimensions **DRF**, **MRP**, **PRV**:
- Use `cv = std / mean` ✅
- **NOT** `cv = std / max(mean, 1)` ❌
- The latter makes high scores mathematically unreachable

### Rewrite Loop Logic

```javascript
while (!allPass(source, rewritten, tolerances) && iteration < maxIter) {
  failing = getFailingDims(source, rewritten, tolerances);
  prompt = buildPrompt(article, source, rewritten, failing);
  article = await callClaude(prompt);
  rewritten = extractDNA(article);
  iteration++;
}
```

### Model Configuration

- **Model:** `claude-sonnet-4-20250514`
- **Max Tokens:** 4000
- **Temperature:** Default (not specified)
- **API Version:** `2023-06-01`

---

## 📌 Quick Reference

| Action | Command |
|--------|---------|
| Start system | `./start.sh` or `npm run dev` |
| Test engine | `node test-engine.js` |
| Install deps | `npm run install:all` |
| Build frontend | `npm run build` |
| Backend only | `cd backend && node server.js` |
| Frontend only | `cd frontend && npm run dev` |

| URL | Purpose |
|-----|---------|
| `http://localhost:3000` | React UI |
| `http://localhost:3001` | API server |
| `http://localhost:3001/health` | Health check |
| `http://localhost:3001/api/dimensions` | Dimension metadata |

---

## 🎓 Key Concepts

### Tolerance System
- **Unified default:** ±2 for all 24 dimensions
- **All-or-nothing:** All 24 must pass simultaneously
- **Configurable:** Global slider or per-dimension override

### Burstiness
- High BST = human-like sentence variation
- Low BST = robotic uniform sentences
- Mix short punchy sentences with long complex ones

### Hapax Ratio
- High HAP = rich varied vocabulary
- Low HAP = narrow repetitive vocabulary
- Words appearing exactly once in text

### Cohesion Score
- High COH = sentences tightly linked by shared words
- Low COH = abrupt topic jumps between sentences

---

## 🚀 Next Steps

1. **Test the system** with your own articles
2. **Experiment with tolerances** to see convergence behavior
3. **Save profiles** for different writing styles (future feature)
4. **Deploy to production** (build frontend, host on VPS)

---

**Copyright (c) 2026. All Rights Reserved.**  
**Proprietary and Confidential.**
