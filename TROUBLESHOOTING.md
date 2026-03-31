# 🔧 Troubleshooting Guide - Lovable Integration

## ❌ Common Issues & Solutions

### Issue 1: "Unterminated string in JSON"

**Problem:** The API is receiving malformed JSON with unescaped newlines.

**Solution:** Make sure Lovable properly escapes text before sending:

```javascript
// ❌ WRONG - Will break with newlines
const body = `{"text":"${userText}"}`;

// ✅ CORRECT - Use JSON.stringify
const body = JSON.stringify({ text: userText });

// Example:
const response = await fetch('http://108.61.89.51:3001/api/extract', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: article })  // Always use JSON.stringify!
});
```

---

### Issue 2: CORS Errors

**Problem:** Browser blocks requests due to CORS policy.

**Solution:** API already has CORS enabled. If you still see errors:

```javascript
// Make sure headers are correct
const response = await fetch('http://108.61.89.51:3001/api/extract', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'  // This header is required
  },
  body: JSON.stringify({ text: article })
});
```

---

### Issue 3: "Text must be at least 200 words"

**Problem:** Article is too short for reliable DNA extraction.

**Solution:** Add validation in UI before calling API:

```javascript
function validateText(text) {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  return words.length >= 200;
}

// Only call API if valid
if (validateText(articleText)) {
  const response = await fetch('http://108.61.89.51:3001/api/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: articleText })
  });
}
```

---

### Issue 4: API Returns HTML Instead of JSON

**Problem:** Request isn't reaching the correct endpoint.

**Solution:** Double-check the URL:

```javascript
// ✅ CORRECT
'http://108.61.89.51:3001/api/extract'

// ❌ WRONG
'http://108.61.89.51:3001/extract'  // Missing /api prefix
'http://108.61.89.51:3000/api/extract'  // Wrong port
```

---

## ✅ Working Example

Here's a complete, tested example that works:

```javascript
async function extractDNA(articleText) {
  try {
    // Validate length
    const words = articleText.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length < 200) {
      throw new Error(`Need ${200 - words.length} more words`);
    }

    // Call API with proper JSON formatting
    const response = await fetch('http://108.61.89.51:3001/api/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: articleText })  // Critical: Use JSON.stringify!
    });

    // Parse response
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    // Success!
    console.log('DNA extracted:', data.dna);
    console.log('Word count:', data.wordCount);
    return data;

  } catch (error) {
    console.error('Error extracting DNA:', error.message);
    throw error;
  }
}

// Usage
const article = `Your 200+ word article here...`;
const result = await extractDNA(article);
```

---

## 🧪 Test the API Manually

Open browser console (F12) and run:

```javascript
// Test 1: Health check
fetch('http://108.61.89.51:3001/health')
  .then(r => r.json())
  .then(d => console.log('Health:', d))
  .catch(e => console.error('Error:', e));

// Test 2: Extract DNA (with sample text)
const sampleText = `
The rapid advancement of artificial intelligence has fundamentally transformed how we approach complex problems in modern society. Machine learning algorithms now power everything from recommendation systems to medical diagnostics, creating unprecedented opportunities for innovation. However, these developments also raise important ethical questions. How do we ensure AI systems remain fair and unbiased? What happens when algorithms make decisions that affect people's lives? These aren't just technical challenges—they're deeply human questions that require careful consideration. Researchers are actively working on solutions. They're developing new frameworks for algorithmic transparency, creating tools to detect and mitigate bias, and establishing guidelines for responsible AI deployment. The goal is to harness AI's power while protecting individual rights and societal values. Looking ahead, the next decade will likely see even more dramatic changes. Generative AI models are becoming increasingly sophisticated, capable of creating text, images, and even code that's indistinguishable from human work. This opens exciting possibilities for creativity and productivity, but also demands thoughtful regulation.
`.trim();

fetch('http://108.61.89.51:3001/api/extract', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: sampleText })
})
.then(r => r.json())
.then(d => {
  console.log('Success:', d.success);
  console.log('Word count:', d.wordCount);
  console.log('DNA dimensions:', Object.keys(d.dna).length);
  console.log('Sample scores:', {
    PRP: d.dna.PRP,
    BST: d.dna.BST,
    HAP: d.dna.HAP
  });
})
.catch(e => console.error('Error:', e));
```

---

## 📋 Checklist for Lovable

Make sure Lovable's code does these things:

- [ ] Uses `JSON.stringify()` for all POST request bodies
- [ ] Includes `Content-Type: application/json` header
- [ ] Uses correct API URL: `http://108.61.89.51:3001`
- [ ] Validates text is 200+ words before calling API
- [ ] Handles errors gracefully
- [ ] Parses response with `.json()`
- [ ] Checks `data.success` before using results

---

## 🔍 Debugging Steps

1. **Check if API is reachable:**
```javascript
fetch('http://108.61.89.51:3001/health').then(r => r.json()).then(console.log);
```

2. **Check what you're sending:**
```javascript
const body = JSON.stringify({ text: yourText });
console.log('Sending:', body.substring(0, 100));
```

3. **Check the response:**
```javascript
const response = await fetch('http://108.61.89.51:3001/api/extract', {...});
console.log('Status:', response.status);
console.log('Headers:', response.headers);
const data = await response.json();
console.log('Data:', data);
```

---

## 💡 Quick Fixes

**If nothing works, try this minimal example:**

```html
<!DOCTYPE html>
<html>
<body>
  <textarea id="input" placeholder="Paste 200+ words"></textarea>
  <button onclick="test()">Test API</button>
  <pre id="output"></pre>

  <script>
  async function test() {
    const text = document.getElementById('input').value;
    const output = document.getElementById('output');
    
    try {
      const res = await fetch('http://108.61.89.51:3001/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      const data = await res.json();
      output.textContent = JSON.stringify(data, null, 2);
    } catch (e) {
      output.textContent = 'Error: ' + e.message;
    }
  }
  </script>
</body>
</html>
```

Save this as `test.html` and open in browser to verify API works!

---

## 📞 Still Having Issues?

Tell me:
1. What error message you see
2. What endpoint you're calling
3. What data you're sending

I can check the API logs and tell you exactly what's wrong!
