# Quick Start Guide

**Copyright (c) 2026. All Rights Reserved.**

---

## ⚡ 3-Minute Setup

```bash
# 1. Navigate to project
cd /root/.openclaw/workspace/dna-fingerprint

# 2. Verify everything is ready
./verify.sh

# 3. Start the system
./start.sh
```

Open browser: **http://localhost:3000**

---

## 🎯 First Run Walkthrough

### Step 1: Extract Source DNA (30 seconds)

1. Copy this sample article:

```
The integration of artificial intelligence into modern workflows has fundamentally transformed how organizations operate. Machine learning algorithms now handle tasks that previously required extensive human oversight, from data analysis to customer service automation.

However, this technological shift brings both opportunities and challenges. Companies must balance efficiency gains with ethical considerations around privacy and job displacement. The key lies in thoughtful implementation rather than blind adoption of new technologies.

Looking ahead, successful organizations will be those that view AI as a collaborative tool rather than a replacement for human judgment. By combining algorithmic precision with human creativity, we can build systems that enhance rather than diminish our capabilities.

The next decade will likely see even more sophisticated applications emerge. From personalized medicine to climate modeling, AI's potential extends far beyond current commercial applications. Yet realizing this potential requires careful attention to bias, transparency, and accountability in system design.
```

2. Paste into **"Extract Source DNA"** box
3. Click **🧬 Extract DNA**
4. See 24 dimensions scored (e.g., PRP=27, BST=52, HAP=97)

### Step 2: Rewrite New Article (2 minutes)

1. Copy this different article:

```
Blockchain technology represents one of the most significant innovations in digital infrastructure. By creating decentralized ledgers that resist tampering, blockchain enables trustless transactions between parties who don't know each other.

Bitcoin and Ethereum demonstrated the financial applications, but the technology's potential extends much further. Supply chain tracking, digital identity verification, and voting systems could all benefit from blockchain's core properties of transparency and immutability.

Critics raise valid concerns about energy consumption and scalability. Current proof-of-work systems require enormous computational resources, making them environmentally problematic at scale. Alternative consensus mechanisms like proof-of-stake aim to address these issues while maintaining security guarantees.

Despite these challenges, blockchain's fundamental innovation remains valuable. The ability to create shared databases without centralized control opens new possibilities for coordination and collaboration. As the technology matures, we'll likely see more practical applications emerge beyond the initial cryptocurrency hype.
```

2. Paste into **"Rewrite to Match DNA"** box
3. Click **✍️ Rewrite to Match DNA**
4. Watch progress: "Iteration 3/8 — 18/24 passing"
5. Wait ~30-60 seconds for completion

### Step 3: View Comparison

Once rewriting completes, scroll down to see:

- **Radar Chart** - 24-axis visualization (blue = source, orange = rewritten)
- **Bar Chart** - Dimensions sorted by gap size
- **Dimension Table** - Click any row to expand description
- **Text Comparison** - Side-by-side original and rewritten

**Success:** Look for green "✓ Pass" badges indicating dimensions within tolerance.

---

## 🔧 Configuration

Click **⚙️ Settings** (top-right) to:

### Set API Key
Paste your Anthropic API key:
```
sk-ant-api03-your-key-here
```

### Adjust Tolerance
- Move slider to change global tolerance (default: ±2)
- Or set individual dimension tolerances below

---

## 📊 Understanding Results

### Radar Chart
- **Blue polygon** = Source DNA
- **Orange polygon** = Rewritten DNA
- Closer overlap = better match

### Dimension Table
- **Green badge** = Within tolerance ✓
- **Red badge** = Outside tolerance (shows gap size)
- **Click row** = Expand full description

### What Good Results Look Like
```
✓ Perfect match! All 24 dimensions are within tolerance.
24 / 24 Passing
```

### If Results Are Poor
```
18 / 24 Passing
6 dimension(s) still outside tolerance.
```

**Solutions:**
1. Increase global tolerance (±3 or ±4)
2. Run rewrite again (might converge better)
3. Check which dimensions are failing (table shows which ones)

---

## 🐛 Troubleshooting

### "Text must be at least 200 words"
Your article is too short. DNA extraction requires 200+ words for stable scoring.

### "Anthropic API key not configured"
1. Click **⚙️ Settings**
2. Paste your API key
3. Click **Save Key**

### Servers won't start
```bash
# Check if ports are in use
lsof -i :3000  # Frontend
lsof -i :3001  # Backend

# Kill processes if needed
kill -9 <PID>

# Restart
./start.sh
```

### Frontend shows blank page
1. Check browser console (F12) for errors
2. Verify backend is running: `curl http://localhost:3001/health`
3. Rebuild frontend: `cd frontend && npm run build`

### Rewrite stuck on one dimension
Some dimensions are mathematically difficult to match simultaneously. Try:
- Increase tolerance for that specific dimension
- Increase max iterations (future enhancement)
- Accept "close enough" (23/24 passing is still excellent)

---

## 📚 Next Steps

1. **Read full docs:** `README.md` for comprehensive guide
2. **Test with your content:** Try your own articles
3. **Experiment with tolerances:** See how it affects convergence
4. **Deploy to production:** See `DEPLOYMENT.md`

---

## 💡 Pro Tips

### For Best Results
- Use **200-500 word** articles (sweet spot)
- Source article should have **clear writing style** (not generic)
- New article should be **similar length** to source
- Default tolerance (±2) works well for most cases

### Dimension Insights
- **High BST** = Human-like sentence variation
- **High HAP** = Rich vocabulary
- **Low REP** = Repetitive (good for technical writing)
- **High VOC** = Conversational (blogs, emails)
- **Low GRM** = Passive voice (academic papers)

### Common Dimension Targets

**Blog Post Style:**
```
PRP: 60-80 (lots of "I", "we")
VOC: 70-90 (conversational)
BST: 60-80 (varied sentences)
GRM: 80-100 (active voice)
```

**Academic Paper:**
```
PRP: 0-20 (minimal first-person)
VOC: 0-10 (formal distance)
TNE: 60-80 (hedging language)
CAP: 40-60 (many acronyms)
```

**Corporate Copy:**
```
GRM: 90-100 (active voice)
VOG: 90-100 (precise language)
LGC: 40-60 (logical flow)
FWD: 50-70 (future-focused)
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl + Enter` | Extract/Rewrite (when textarea focused) |
| `Esc` | Close settings panel |
| `Ctrl + ,` | Open settings |

*(Implementation of shortcuts is a future enhancement)*

---

## 🎓 Learning Resources

### Understanding Dimensions
Each dimension measures a specific aspect of writing:

- **PRP, VOC** → Who is the audience? (personal vs formal)
- **BST, PRH** → Rhythm and flow
- **HAP, REP** → Vocabulary richness
- **GRM, SYN** → Sentence structure
- **TNE, EPI** → Confidence level
- **SPE, CAP** → Technical content
- **COH, LGC** → Logical flow

### Experimentation
1. Extract DNA from multiple articles by same author
2. Notice which dimensions are consistent (author signature)
3. Use those consistent values as targets
4. Rewrite new articles to match that signature

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Start system | `./start.sh` |
| Verify setup | `./verify.sh` |
| Test engine | `node test-engine.js` |
| Stop servers | `Ctrl + C` in terminal |
| Check backend | `curl http://localhost:3001/health` |
| View logs | `tail -f backend/logs/*.log` |

| URL | Purpose |
|-----|---------|
| `http://localhost:3000` | Main UI |
| `http://localhost:3001/health` | Backend health check |
| `http://localhost:3001/api/dimensions` | Dimension metadata |

---

**Ready to extract your first DNA profile?**

```bash
./start.sh
```

Then open: **http://localhost:3000**

---

**Copyright (c) 2026. All Rights Reserved.**
