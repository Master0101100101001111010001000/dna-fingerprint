const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Enable CORS for all origins
app.use(cors());

// Raw body parser to see exactly what's being sent
app.use(express.text({ type: '*/*', limit: '10mb' }));

// Log all requests
app.use((req, res, next) => {
  console.log(`\n=== ${new Date().toISOString()} ===`);
  console.log(`Method: ${req.method}`);
  console.log(`Path: ${req.path}`);
  console.log(`Headers:`, req.headers);
  console.log(`Body type:`, typeof req.body);
  console.log(`Body length:`, req.body ? req.body.length : 0);
  console.log(`Body (first 500 chars):`, req.body ? req.body.substring(0, 500) : 'empty');
  next();
});

// Test endpoint
app.post('/test', (req, res) => {
  try {
    const parsed = JSON.parse(req.body);
    res.json({
      success: true,
      message: 'JSON parsed successfully',
      receivedKeys: Object.keys(parsed),
      textLength: parsed.text ? parsed.text.length : 0
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      error: e.message,
      rawBody: req.body.substring(0, 200)
    });
  }
});

app.listen(PORT, () => {
  console.log(`Test API running on port ${PORT}`);
});
