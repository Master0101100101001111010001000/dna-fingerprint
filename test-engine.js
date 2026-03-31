/**
 * Copyright (c) 2026. All Rights Reserved.
 * Proprietary and Confidential.
 * 
 * Test script to verify DNA engine functionality
 */

const { extractDNA, DIMS_24, DIM_NAMES } = require('./shared/dna-engine');

const sampleText = `
The rapid advancement of artificial intelligence has fundamentally transformed how we approach complex problems in modern society. Machine learning algorithms now power everything from recommendation systems to medical diagnostics, creating unprecedented opportunities for innovation.

However, these developments also raise important ethical questions. How do we ensure AI systems remain fair and unbiased? What happens when algorithms make decisions that affect people's lives? These aren't just technical challenges—they're deeply human questions that require careful consideration.

Researchers are actively working on solutions. They're developing new frameworks for algorithmic transparency, creating tools to detect and mitigate bias, and establishing guidelines for responsible AI deployment. The goal is to harness AI's power while protecting individual rights and societal values.

Looking ahead, the next decade will likely see even more dramatic changes. Generative AI models are becoming increasingly sophisticated, capable of creating text, images, and even code that's indistinguishable from human work. This opens exciting possibilities for creativity and productivity, but also demands thoughtful regulation.

Success will require collaboration across disciplines. Computer scientists, ethicists, policymakers, and civil society must work together to shape AI's future. Only through this collective effort can we build systems that truly serve humanity's best interests.

The integration of AI into everyday life presents both opportunities and challenges. From autonomous vehicles to smart home devices, these technologies are reshaping how we live and work. Yet we must remain vigilant about privacy concerns and data security.
`.trim();

console.log('🧬 Testing DNA Extraction Engine\n');
console.log('Sample text length:', sampleText.split(/\s+/).length, 'words\n');

try {
  const dna = extractDNA(sampleText);
  
  console.log('✓ DNA Extraction Successful!\n');
  console.log('Results (24 dimensions):');
  console.log('========================\n');
  
  DIMS_24.forEach(dim => {
    const score = dna[dim];
    const name = DIM_NAMES[dim];
    const bar = '█'.repeat(Math.floor(score / 5));
    console.log(`${dim.padEnd(4)} ${name.padEnd(30)} ${String(score).padStart(3)} ${bar}`);
  });
  
  console.log('\n✓ All 24 dimensions scored successfully!');
  console.log('\nEngine is deterministic: running twice should produce identical results...\n');
  
  const dna2 = extractDNA(sampleText);
  const identical = DIMS_24.every(dim => dna[dim] === dna2[dim]);
  
  if (identical) {
    console.log('✓ Determinism verified: Same input → Same output');
  } else {
    console.log('✗ Warning: Results differ between runs (non-deterministic!)');
  }
  
} catch (error) {
  console.error('✗ Error:', error.message);
  process.exit(1);
}
