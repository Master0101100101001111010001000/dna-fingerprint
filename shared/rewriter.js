/**
 * Copyright (c) 2026. All Rights Reserved.
 * Proprietary and Confidential.
 * This file and the system it belongs to are the exclusive
 * intellectual property of the owner. Unauthorised copying,
 * modification, distribution, or use of this file via any
 * medium is strictly prohibited without prior written permission.
 */

const { extractDNA, allPass, getFailingDims, DIMS_24, DIM_NAMES } = require('./dna-engine');
const { ANTI_AI_RULES } = require('./anti-ai-rules');

/**
 * Build rewrite prompt with target DNA and current gaps
 */
function buildRewritePrompt(article, sourceDNA, currentDNA, failingDims) {
  // Build dimension table
  const dimTable = DIMS_24.map(dim => {
    const target = sourceDNA[dim];
    const current = currentDNA[dim];
    const gap = Math.abs(target - current);
    const direction = current < target ? 'increase' : 'decrease';
    
    return `[${dim}] ${DIM_NAMES[dim]} | ${target} | ${current} | ${gap} ${direction}`;
  }).join('\n');
  
  // Sort failing dims by gap size
  const topFailing = failingDims
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 5)
    .map(d => `${d.dim} (gap: ${d.gap})`)
    .join(', ');
  
  return `You are a precise writing style transformer.

TASK: Rewrite the article below so its writing DNA matches the target profile. 
Preserve ALL factual content, named entities, statistics, and arguments. 
Only change: style, structure, vocabulary register, sentence length patterns, 
phrasing, and paragraph rhythm.

TARGET DNA — dimension | target | current | gap:
${dimTable}

PRIORITY: Focus on these dimensions with the largest gaps first: ${topFailing}

${ANTI_AI_RULES}

OUTPUT: Return only the rewritten article. No preamble. Plain text.

ARTICLE TO REWRITE:
${article}`;
}

/**
 * Call Claude API to rewrite article
 */
async function callClaude(prompt, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${response.status} ${error}`);
  }
  
  const data = await response.json();
  return data.content[0].text;
}

/**
 * Main rewriting loop
 */
async function rewriteToMatchDNA(article, sourceDNA, tolerances, apiKey, options = {}) {
  const maxIter = options.maxIterations || 8;
  const onProgress = options.onProgress || (() => {});
  
  let current = article;
  let currentDNA = extractDNA(current);
  let iteration = 0;
  
  const history = [{
    iteration: 0,
    article: current,
    dna: currentDNA,
    passing: DIMS_24.filter(d => Math.abs(currentDNA[d] - sourceDNA[d]) <= tolerances[d]).length
  }];
  
  while (!allPass(sourceDNA, currentDNA, tolerances) && iteration < maxIter) {
    iteration++;
    
    const failing = getFailingDims(sourceDNA, currentDNA, tolerances);
    const prompt = buildRewritePrompt(current, sourceDNA, currentDNA, failing);
    
    onProgress({
      iteration,
      maxIter,
      currentDNA,
      failing,
      status: 'rewriting'
    });
    
    current = await callClaude(prompt, apiKey);
    currentDNA = extractDNA(current);
    
    const passing = DIMS_24.filter(d => Math.abs(currentDNA[d] - sourceDNA[d]) <= tolerances[d]).length;
    
    history.push({
      iteration,
      article: current,
      dna: currentDNA,
      passing
    });
    
    onProgress({
      iteration,
      maxIter,
      currentDNA,
      failing: getFailingDims(sourceDNA, currentDNA, tolerances),
      passing,
      status: 'scoring'
    });
  }
  
  const passed = allPass(sourceDNA, currentDNA, tolerances);
  
  return {
    article: current,
    dna: currentDNA,
    iterations: iteration,
    passed,
    history,
    finalFailing: passed ? [] : getFailingDims(sourceDNA, currentDNA, tolerances)
  };
}

module.exports = {
  rewriteToMatchDNA,
  buildRewritePrompt
};
