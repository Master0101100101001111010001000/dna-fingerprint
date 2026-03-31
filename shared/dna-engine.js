/**
 * Copyright (c) 2026. All Rights Reserved.
 * Proprietary and Confidential.
 * This file and the system it belongs to are the exclusive
 * intellectual property of the owner. Unauthorised copying,
 * modification, distribution, or use of this file via any
 * medium is strictly prohibited without prior written permission.
 */

/**
 * DNA Scoring Engine - Pure Mathematical Functions
 * All scoring is deterministic. Same input → same output.
 */

const DIMS_24 = [
  'PRP', 'BST', 'REP', 'STR', 'VOC', 'GRM', 'SEM', 'TNE', 'LGC', 'STY',
  'PCT', 'CAP', 'HAP', 'VOG', 'COH', 'SYN', 'SPE', 'EPI', 'FWD', 'PRH',
  'DRF', 'MRP', 'PRV', 'BSV'
];

const DIM_NAMES = {
  PRP: 'Personal Pronoun Rate',
  BST: 'Burstiness',
  REP: 'Repetition Score',
  STR: 'Sentence Starter Ratio',
  VOC: 'Vocabulary Intimacy',
  GRM: 'Grammar Formality',
  SEM: 'Semantic Complexity',
  TNE: 'Hedging Tone',
  LGC: 'Logical Connectors',
  STY: 'Stylistic Density',
  PCT: 'Punctuation Density',
  CAP: 'Capitalisation Rate',
  HAP: 'Hapax Ratio',
  VOG: 'Vagueness Guard',
  COH: 'Cohesion Score',
  SYN: 'Syntactic Complexity',
  SPE: 'Specificity',
  EPI: 'Epistemic Markers',
  FWD: 'Forward References',
  PRH: 'Paragraph Rhythm',
  DRF: 'Discourse Rhythm Fractal',
  MRP: 'Motif Repetition Pattern',
  PRV: 'Paragraph Rhythm Variance',
  BSV: 'Burstiness Skew'
};

const DIM_DESCRIPTIONS = {
  PRP: 'Count first-person pronouns (I, me, my, we, us, our). High = personal writing. Low = formal third-person.',
  BST: 'Standard deviation of sentence lengths. High = varying sentence lengths (human). Low = uniform sentences (robotic).',
  REP: 'Penalises repeated bigrams and keywords. Low = repetitive technical writing. High = varied vocabulary.',
  STR: 'Ratio of unique sentence starters. High = every sentence starts differently. Low = repeated openers.',
  VOC: 'Conversational intimacy (you, your, I, me). Peaks around 2% density. Measures closeness to reader.',
  GRM: 'Active vs passive voice. High = active voice. Low = many passive constructions.',
  SEM: 'Percentage of long words (8+ letters). High = technical/academic. Low = plain language.',
  TNE: 'Hedging words (might, may, could, perhaps). High = academic caution. Low = direct assertions.',
  LGC: 'Logical connectors (however, therefore, thus). High = argument-driven with explicit transitions.',
  STY: 'Parentheses and em-dashes frequency. High = frequent interruptions and asides.',
  PCT: 'Punctuation density (commas, semicolons, dashes). High = complex sentence structures.',
  CAP: 'All-caps acronyms (NLP, AI, GPA). High = technical papers with many acronyms.',
  HAP: 'Words appearing exactly once. High = rich varied vocabulary. Low = narrow repetitive vocabulary.',
  VOG: 'Penalises vague fillers (various, several, things, stuff). High = precise language. Low = vague language.',
  COH: 'Shared vocabulary between adjacent sentences. High = tightly linked sentences. Low = abrupt topic jumps.',
  SYN: 'Subordinating conjunctions and relative pronouns. High = complex nested clauses. Low = simple sentences.',
  SPE: 'Numeric tokens (integers, decimals, percentages). High = data-heavy. Low = narrative without numbers.',
  EPI: 'Confidence markers (clearly, obviously, certainly). Measures how strongly author signals confidence.',
  FWD: 'Future-oriented language (will, shall, plan, goal). High = forward-looking. Low = retrospective.',
  PRH: 'Coefficient of variation of paragraph lengths. High = wildly varying paragraphs. Low = uniform paragraphs.',
  DRF: 'CV of per-paragraph sentence-length CVs. High = fractal rhythm pattern across text.',
  MRP: 'CV of gaps between repeated bigrams. High = phrases cluster at start/end. Low = regular intervals.',
  PRV: 'CV of consecutive paragraph length differences. High = erratic size jumps. Low = predictable pattern.',
  BSV: 'Skewness of sentence-length distribution. High = asymmetric distribution. Low = symmetric bell curve.'
};

/**
 * Tokenise text into words, sentences, paragraphs
 */
function tokenise(text) {
  const normalised = text.trim().replace(/\s+/g, ' ');
  
  // Words
  const words = normalised.split(/\s+/).filter(w => w.length > 0);
  
  // Sentences - split on .!? and filter short segments
  const sentences = normalised
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length >= 3);
  
  // Paragraphs - split on double newlines
  const paragraphs = text
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(p => p.length >= 10);
  
  return { words, sentences, paragraphs };
}

/**
 * Clamp score to [0, 100] and round to integer
 */
function clamp(value) {
  return Math.round(Math.max(0, Math.min(100, value * 100)));
}

/**
 * Calculate standard deviation
 */
function std(values) {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Calculate coefficient of variation: std / mean
 * CRITICAL: Use std / mean, NOT std / max(mean, 1)
 */
function cv(values) {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (mean === 0) return 0;
  return std(values) / mean;
}

/**
 * Calculate skewness (third moment)
 */
function skewness(values) {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const stdDev = std(values);
  if (stdDev === 0) return 0;
  const n = values.length;
  const sum = values.reduce((s, val) => s + Math.pow((val - mean) / stdDev, 3), 0);
  return sum / n;
}

/**
 * Count case-insensitive word occurrences
 */
function countWords(text, wordList) {
  const lower = text.toLowerCase();
  return wordList.reduce((count, word) => {
    const regex = new RegExp(`\\b${word.toLowerCase()}\\b`, 'gi');
    const matches = lower.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);
}

// ============================================
// DIM 01 — PRP — Personal Pronoun Rate
// ============================================
function scorePRP(text, tokens) {
  const { words } = tokens;
  if (words.length === 0) return 0;
  
  const pronouns = ['i', 'me', 'my', 'mine', 'myself', 'we', 'us', 'our', 'ours', 'ourselves'];
  const count = countWords(text, pronouns);
  const score = count / (words.length * 0.08);
  
  return clamp(score);
}

// ============================================
// DIM 02 — BST — Burstiness
// ============================================
function scoreBST(text, tokens) {
  const { sentences } = tokens;
  if (sentences.length < 2) return 0;
  
  const lengths = sentences.map(s => s.split(/\s+/).length);
  const stdDev = std(lengths);
  const score = stdDev / 8;
  
  return clamp(score);
}

// ============================================
// DIM 03 — REP — Repetition Score
// ============================================
function scoreREP(text, tokens) {
  const { words } = tokens;
  if (words.length < 2) return 100;
  
  // Count repeated adjacent bigrams
  const bigrams = [];
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i].toLowerCase()} ${words[i + 1].toLowerCase()}`);
  }
  
  const bigramCounts = {};
  bigrams.forEach(bg => {
    bigramCounts[bg] = (bigramCounts[bg] || 0) + 1;
  });
  
  const repeatedBigrams = Object.values(bigramCounts).filter(c => c > 1).length;
  
  // Count keywords appearing 3+ times
  const wordCounts = {};
  words.forEach(w => {
    const lower = w.toLowerCase();
    wordCounts[lower] = (wordCounts[lower] || 0) + 1;
  });
  
  const repeatKeywords = Object.values(wordCounts).filter(c => c >= 3).length;
  
  const score = Math.max(0, 1 - repeatedBigrams * 0.08 - repeatKeywords * 0.12);
  
  return clamp(score);
}

// ============================================
// DIM 04 — STR — Sentence Starter Ratio
// ============================================
function scoreSTR(text, tokens) {
  const { sentences } = tokens;
  if (sentences.length === 0) return 0;
  
  const starters = sentences.map(s => s.split(/\s+/)[0]?.toLowerCase()).filter(Boolean);
  const uniqueStarters = new Set(starters);
  const score = uniqueStarters.size / sentences.length;
  
  return clamp(score);
}

// ============================================
// DIM 05 — VOC — Vocabulary Intimacy
// ============================================
function scoreVOC(text, tokens) {
  const { words } = tokens;
  if (words.length === 0) return 0;
  
  const intimateWords = ['you', 'your', 'yours', 'yourself', 'i', 'me', 'my'];
  const count = countWords(text, intimateWords);
  const density = count / words.length;
  
  // Peak around 2% density
  const score = density < 0.02 
    ? density / 0.02 
    : Math.max(0, 1 - (density - 0.02) / 0.03);
  
  return clamp(score);
}

// ============================================
// DIM 06 — GRM — Grammar Formality
// ============================================
function scoreGRM(text, tokens) {
  const { sentences } = tokens;
  if (sentences.length === 0) return 100;
  
  // Detect passive voice: (is|are|was|were|been) + past participle
  const passivePattern = /\b(is|are|was|were|been)\s+\w+(ed|en)\b/gi;
  let passiveCount = 0;
  
  sentences.forEach(s => {
    if (passivePattern.test(s)) {
      passiveCount++;
    }
  });
  
  const score = 1 - (passiveCount * 0.3 / sentences.length);
  
  return clamp(Math.max(0, score));
}

// ============================================
// DIM 07 — SEM — Semantic Complexity
// ============================================
function scoreSEM(text, tokens) {
  const { words } = tokens;
  if (words.length === 0) return 0;
  
  const longWords = words.filter(w => w.length >= 8);
  const score = (longWords.length / words.length) * 3;
  
  return clamp(score);
}

// ============================================
// DIM 08 — TNE — Hedging Tone
// ============================================
function scoreTNE(text, tokens) {
  const { sentences } = tokens;
  if (sentences.length === 0) return 0;
  
  const hedges = ['might', 'may', 'could', 'perhaps', 'possibly', 'likely', 
                  'probably', 'suggest', 'appear', 'seem', 'indicate'];
  const count = countWords(text, hedges);
  const score = (count / sentences.length) * 0.8;
  
  return clamp(score);
}

// ============================================
// DIM 09 — LGC — Logical Connectors
// ============================================
function scoreLGC(text, tokens) {
  const { sentences } = tokens;
  if (sentences.length === 0) return 0;
  
  const connectors = ['however', 'therefore', 'thus', 'hence', 'consequently', 
                      'moreover', 'furthermore', 'additionally', 'although', 
                      'whereas', 'despite', 'nevertheless', 'nonetheless'];
  const count = countWords(text, connectors);
  const score = (count / sentences.length) * 1.2;
  
  return clamp(score);
}

// ============================================
// DIM 10 — STY — Stylistic Density
// ============================================
function scoreSTY(text, tokens) {
  const { words, sentences } = tokens;
  if (words.length === 0 || sentences.length === 0) return 0;
  
  const parenCount = (text.match(/[()]/g) || []).length;
  const dashCount = (text.match(/—/g) || []).length;
  
  const score = (parenCount * 0.15 + dashCount * 0.05) * (sentences.length / words.length) * 30 + 0.05;
  
  return clamp(score);
}

// ============================================
// DIM 11 — PCT — Punctuation Density
// ============================================
function scorePCT(text, tokens) {
  const { words } = tokens;
  if (words.length === 0) return 0;
  
  const punctCount = (text.match(/[,;—\-()[\]]/g) || []).length;
  const score = (punctCount / words.length) * 4;
  
  return clamp(score);
}

// ============================================
// DIM 12 — CAP — Capitalisation Rate
// ============================================
function scoreCAP(text, tokens) {
  const { words } = tokens;
  if (words.length === 0) return 0;
  
  const acronyms = words.filter(w => /^[A-Z]{2,}$/.test(w));
  const score = (acronyms.length / words.length) * 8;
  
  return clamp(score);
}

// ============================================
// DIM 13 — HAP — Hapax Ratio
// ============================================
function scoreHAP(text, tokens) {
  const { words } = tokens;
  if (words.length === 0) return 0;
  
  const wordCounts = {};
  words.forEach(w => {
    const lower = w.toLowerCase();
    wordCounts[lower] = (wordCounts[lower] || 0) + 1;
  });
  
  const hapaxCount = Object.values(wordCounts).filter(c => c === 1).length;
  const score = (hapaxCount / words.length) * 1.5;
  
  return clamp(score);
}

// ============================================
// DIM 14 — VOG — Vagueness Guard
// ============================================
function scoreVOG(text, tokens) {
  const { words } = tokens;
  if (words.length === 0) return 100;
  
  const vagueWords = ['various', 'several', 'many', 'some', 'certain', 
                      'numerous', 'different', 'multiple', 'things', 'stuff', 
                      'aspects', 'factors'];
  const count = countWords(text, vagueWords);
  const score = 1 - (count / words.length * 15);
  
  return clamp(Math.max(0, score));
}

// ============================================
// DIM 15 — COH — Cohesion Score
// ============================================
function scoreCOH(text, tokens) {
  const { sentences } = tokens;
  if (sentences.length < 2) return 0;
  
  const cohesionScores = [];
  
  for (let i = 0; i < sentences.length - 1; i++) {
    const sent1Words = sentences[i]
      .split(/\s+/)
      .filter(w => w.length >= 4)
      .map(w => w.toLowerCase());
    
    const sent2Words = sentences[i + 1]
      .split(/\s+/)
      .filter(w => w.length >= 4)
      .map(w => w.toLowerCase());
    
    if (sent1Words.length === 0) continue;
    
    const sharedCount = sent1Words.filter(w => sent2Words.includes(w)).length;
    cohesionScores.push(sharedCount / sent1Words.length);
  }
  
  if (cohesionScores.length === 0) return 0;
  
  const avgCohesion = cohesionScores.reduce((a, b) => a + b, 0) / cohesionScores.length;
  
  return clamp(avgCohesion);
}

// ============================================
// DIM 16 — SYN — Syntactic Complexity
// ============================================
function scoreSYN(text, tokens) {
  const { sentences } = tokens;
  if (sentences.length === 0) return 0;
  
  const complexWords = ['because', 'although', 'while', 'when', 'if', 'unless', 
                        'since', 'after', 'before', 'until', 'whether', 'that', 
                        'which', 'who', 'whom'];
  const count = countWords(text, complexWords);
  const score = (count / sentences.length) * 0.6;
  
  return clamp(score);
}

// ============================================
// DIM 17 — SPE — Specificity
// ============================================
function scoreSPE(text, tokens) {
  const { sentences } = tokens;
  if (sentences.length === 0) return 0;
  
  const numericTokens = text.match(/\b\d+(\.\d+)?%?\b/g) || [];
  const score = (numericTokens.length / sentences.length) * 0.8;
  
  return clamp(score);
}

// ============================================
// DIM 18 — EPI — Epistemic Markers
// ============================================
function scoreEPI(text, tokens) {
  const { sentences } = tokens;
  if (sentences.length === 0) return 0;
  
  const markers = ['clearly', 'obviously', 'certainly', 'undoubtedly', 
                   'evidently', 'apparently', 'presumably', 'arguably', 
                   'notably', 'importantly', 'significantly'];
  const count = countWords(text, markers);
  const score = (count / sentences.length) * 1.5;
  
  return clamp(score);
}

// ============================================
// DIM 19 — FWD — Forward References
// ============================================
function scoreFWD(text, tokens) {
  const { sentences } = tokens;
  if (sentences.length === 0) return 0;
  
  const forwardWords = ['will', 'shall', 'future', 'next', 'upcoming', 
                        'following', 'subsequent', 'later', 'eventually', 
                        'plan', 'intend', 'aim', 'goal', 'objective'];
  const count = countWords(text, forwardWords);
  const score = (count / sentences.length) * 0.9;
  
  return clamp(score);
}

// ============================================
// DIM 20 — PRH — Paragraph Rhythm
// ============================================
function scorePRH(text, tokens) {
  const { paragraphs } = tokens;
  if (paragraphs.length < 2) return 0;
  
  const lengths = paragraphs.map(p => p.split(/\s+/).length);
  const cvValue = cv(lengths);
  const score = (cvValue - 0.1) / 0.7;
  
  return clamp(score);
}

// ============================================
// DIM 21 — DRF — Discourse Rhythm Fractal
// ============================================
function scoreDRF(text, tokens) {
  const { paragraphs } = tokens;
  if (paragraphs.length < 2) return 0;
  
  const paraCVs = [];
  
  paragraphs.forEach(para => {
    const sentences = para
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length >= 3);
    
    if (sentences.length > 1) {
      const lengths = sentences.map(s => s.split(/\s+/).length);
      paraCVs.push(cv(lengths));
    }
  });
  
  if (paraCVs.length < 2) return 0;
  
  const cvOfCVs = cv(paraCVs);
  const score = cvOfCVs / 0.8;
  
  return clamp(score);
}

// ============================================
// DIM 22 — MRP — Motif Repetition Pattern
// ============================================
function scoreMRP(text, tokens) {
  const { words } = tokens;
  if (words.length < 4) return 0;
  
  // Build bigrams with positions
  const bigramPositions = {};
  
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i].toLowerCase()} ${words[i + 1].toLowerCase()}`;
    if (!bigramPositions[bigram]) {
      bigramPositions[bigram] = [];
    }
    bigramPositions[bigram].push(i);
  }
  
  // Calculate gaps for repeated bigrams
  const allGaps = [];
  
  Object.values(bigramPositions).forEach(positions => {
    if (positions.length > 1) {
      for (let i = 0; i < positions.length - 1; i++) {
        allGaps.push(positions[i + 1] - positions[i]);
      }
    }
  });
  
  if (allGaps.length < 2) return 0;
  
  const cvValue = cv(allGaps);
  const score = cvValue / 1.5;
  
  return clamp(score);
}

// ============================================
// DIM 23 — PRV — Paragraph Rhythm Variance
// ============================================
function scorePRV(text, tokens) {
  const { paragraphs } = tokens;
  if (paragraphs.length < 3) return 0;
  
  const lengths = paragraphs.map(p => p.split(/\s+/).length);
  const diffs = [];
  
  for (let i = 0; i < lengths.length - 1; i++) {
    diffs.push(Math.abs(lengths[i + 1] - lengths[i]));
  }
  
  if (diffs.length < 2) return 0;
  
  const cvValue = cv(diffs);
  const score = cvValue / 1.2;
  
  return clamp(score);
}

// ============================================
// DIM 24 — BSV — Burstiness Skew
// ============================================
function scoreBSV(text, tokens) {
  const { sentences } = tokens;
  if (sentences.length < 3) return 0;
  
  const lengths = sentences.map(s => s.split(/\s+/).length);
  const skew = Math.abs(skewness(lengths));
  const score = skew / 2.5;
  
  return clamp(score);
}

// ============================================
// Main DNA Extraction Function
// ============================================
function extractDNA(text) {
  if (!text || text.trim().length === 0) {
    throw new Error('Text cannot be empty');
  }
  
  const tokens = tokenise(text);
  
  if (tokens.words.length < 200) {
    throw new Error('Text must be at least 200 words for reliable scoring');
  }
  
  return {
    PRP: scorePRP(text, tokens),
    BST: scoreBST(text, tokens),
    REP: scoreREP(text, tokens),
    STR: scoreSTR(text, tokens),
    VOC: scoreVOC(text, tokens),
    GRM: scoreGRM(text, tokens),
    SEM: scoreSEM(text, tokens),
    TNE: scoreTNE(text, tokens),
    LGC: scoreLGC(text, tokens),
    STY: scoreSTY(text, tokens),
    PCT: scorePCT(text, tokens),
    CAP: scoreCAP(text, tokens),
    HAP: scoreHAP(text, tokens),
    VOG: scoreVOG(text, tokens),
    COH: scoreCOH(text, tokens),
    SYN: scoreSYN(text, tokens),
    SPE: scoreSPE(text, tokens),
    EPI: scoreEPI(text, tokens),
    FWD: scoreFWD(text, tokens),
    PRH: scorePRH(text, tokens),
    DRF: scoreDRF(text, tokens),
    MRP: scoreMRP(text, tokens),
    PRV: scorePRV(text, tokens),
    BSV: scoreBSV(text, tokens)
  };
}

// ============================================
// Tolerance Check Functions
// ============================================
function passes(dim, source, rewritten, tolerances) {
  return Math.abs(rewritten[dim] - source[dim]) <= tolerances[dim];
}

function allPass(source, rewritten, tolerances) {
  return DIMS_24.every(d => passes(d, source, rewritten, tolerances));
}

function getFailingDims(source, rewritten, tolerances) {
  return DIMS_24.filter(d => !passes(d, source, rewritten, tolerances)).map(dim => ({
    dim,
    name: DIM_NAMES[dim],
    target: source[dim],
    current: rewritten[dim],
    gap: Math.abs(rewritten[dim] - source[dim]),
    direction: rewritten[dim] < source[dim] ? 'increase' : 'decrease'
  }));
}

function getPassRate(source, rewritten, tolerances) {
  const passing = DIMS_24.filter(d => passes(d, source, rewritten, tolerances)).length;
  return { passing, total: 24 };
}

// ============================================
// Exports
// ============================================
module.exports = {
  extractDNA,
  DIMS_24,
  DIM_NAMES,
  DIM_DESCRIPTIONS,
  passes,
  allPass,
  getFailingDims,
  getPassRate,
  tokenise
};
