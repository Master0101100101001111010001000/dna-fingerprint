# 🧬 DNA Fingerprinting System - For Lovable

## Overview

This repository contains a **complete backend API** for a DNA Fingerprinting System that analyzes writing styles across 24 mathematical dimensions.

**Your job (Lovable):** Build the frontend UI only. All backend logic is ready.

---

## 🚀 API Base URL

```
http://108.61.89.51:3001
```

**Status:** ✅ Running and ready  
**CORS:** ✅ Enabled for all origins  
**Auth:** ✅ None required (API key configured server-side)

---

## 📡 API Endpoints

### 1. Extract DNA
```
POST /api/extract
Body: { "text": "article text (200+ words)..." }
Response: { "success": true, "dna": { ... }, "wordCount": 234 }
```

### 2. Rewrite Article
```
POST /api/rewrite
Body: {
  "article": "new article...",
  "sourceDNA": { ... },
  "tolerances": { ... },
  "maxIterations": 8
}
Response: { "success": true, "article": "...", "dna": { ... }, "passed": true }
```

### 3. Compare DNAs
```
POST /api/compare
Body: { "sourceDNA": { ... }, "rewrittenDNA": { ... }, "tolerances": { ... } }
Response: { "success": true, "comparison": [...], "passingCount": 22 }
```

### 4. Get Dimensions
```
GET /api/dimensions
Response: { "success": true, "dimensions": [...], "defaultTolerance": 2 }
```

### 5. Health Check
```
GET /health
Response: { "status": "ok", "apiKeyConfigured": true }
```

---

## 🎨 UI Requirements

Build a **modern, clean UI** with these components:

### Page 1: DNA Extractor
- Large textarea for article input (min 200 words)
- Word counter below textarea
- "Extract DNA" button (disabled if <200 words)
- Loading spinner during extraction
- Success message showing word count
- Display all 24 DNA scores (0-100 scale)

### Page 2: DNA Rewriter
- Textarea for new article
- "Rewrite to Match DNA" button
- Progress indicator: "Iteration 3/8"
- Progress bar: "18/24 dimensions passing"
- Success/failure message

### Page 3: Comparison Dashboard
**3 visualizations:**
1. **Radar Chart** (24-axis spider)
   - Blue polygon = source DNA
   - Orange polygon = rewritten DNA
   - Use Chart.js or similar

2. **Bar Chart** (horizontal, sorted by gap)
   - Source bar (blue)
   - Rewritten bar (orange)
   - Pass/fail indicator on right

3. **Data Table**
   - Columns: Code | Name | Source | Rewritten | Gap | Status
   - Sortable columns
   - Expandable rows for descriptions
   - Color-coded pass/fail (green/red)

### Settings Panel
- Global tolerance slider (0-10, default 2)
- Max iterations input (default 8)
- Save/load tolerance presets

---

## 🎨 Design Guidelines

**Theme:** Modern gradient purple/blue  
**Colors:**
- Primary: `#667eea` to `#764ba2`
- Success: `#10b981`
- Danger: `#ef4444`
- Gray: `#6b7280`

**Typography:**
- Headers: Bold, 24-32px
- Body: 14-16px
- Monospace for dimension codes

**Layout:**
- Clean card-based design
- Plenty of white space
- Responsive (mobile + desktop)
- Smooth transitions and animations

---

## 📊 The 24 Dimensions

| Code | Name |
|------|------|
| PRP | Personal Pronoun Rate |
| BST | Burstiness |
| REP | Repetition Score |
| STR | Sentence Starter Ratio |
| VOC | Vocabulary Intimacy |
| GRM | Grammar Formality |
| SEM | Semantic Complexity |
| TNE | Hedging Tone |
| LGC | Logical Connectors |
| STY | Stylistic Density |
| PCT | Punctuation Density |
| CAP | Capitalisation Rate |
| HAP | Hapax Ratio |
| VOG | Vagueness Guard |
| COH | Cohesion Score |
| SYN | Syntactic Complexity |
| SPE | Specificity |
| EPI | Epistemic Markers |
| FWD | Forward References |
| PRH | Paragraph Rhythm |
| DRF | Discourse Rhythm Fractal |
| MRP | Motif Repetition Pattern |
| PRV | Paragraph Rhythm Variance |
| BSV | Burstiness Skew |

Full descriptions available via `GET /api/dimensions`

---

## 🔧 Example Code

```javascript
// Extract DNA
const response = await fetch('http://108.61.89.51:3001/api/extract', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: articleText })
});
const { success, dna, wordCount } = await response.json();

// Display results
if (success) {
  console.log(`Analyzed ${wordCount} words`);
  console.log('DNA Profile:', dna);
  // Render charts and tables
}
```

---

## 📁 Repository Structure

```
dna-fingerprint/
├── shared/              # Core DNA engine (you don't need this)
│   ├── dna-engine.js    # 24 scoring functions
│   ├── rewriter.js      # Claude API integration
│   └── anti-ai-rules.js # Natural writing constraints
│
├── backend/             # API server (already running)
│   └── server.js        # Express API endpoints
│
├── LOVABLE_API_DOCS.md  # Complete API documentation
└── LOVABLE_README.md    # This file
```

**You only need to:**
- Call the API endpoints
- Display the results beautifully
- No backend code needed!

---

## ✅ Testing the API

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

## 🎯 Success Criteria

**The UI should:**
- ✅ Call all 5 API endpoints correctly
- ✅ Display DNA scores in multiple formats (radar, bar, table)
- ✅ Show progress during rewriting (30-90 seconds)
- ✅ Handle errors gracefully
- ✅ Look modern and professional
- ✅ Be responsive (mobile + desktop)

---

## 📞 API Status

**Live URL:** `http://108.61.89.51:3001`  
**Status:** ✅ Running and tested  
**Response Time:** <100ms for extraction, 30-90s for rewriting  

**Ready for Lovable integration!** 🚀

---

## 📚 Full Documentation

See `LOVABLE_API_DOCS.md` for complete API reference with all request/response formats.
