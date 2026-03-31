/**
 * Copyright (c) 2026. All Rights Reserved.
 * Proprietary and Confidential.
 * This file and the system it belongs to are the exclusive
 * intellectual property of the owner. Unauthorised copying,
 * modification, distribution, or use of this file via any
 * medium is strictly prohibited without prior written permission.
 */

/**
 * Anti-AI Writing Rules
 * These patterns are strong signals of AI-generated text.
 * Enforced as hard constraints in every rewrite.
 */

const ANTI_AI_RULES = `
HARD CONSTRAINTS — Anti-AI Writing Rules:

✕ NEVER use em-dashes (—) for dramatic effect. The long dash used as " — " mid-sentence to introduce a conclusion is one of the strongest AI writing tells. Replace with a comma, colon, parenthesis, or rewrite the sentence entirely.

✕ NEVER use semicolons in lists. AI overuses them to chain three or more related clauses. Rewrite as separate sentences or use a comma with a conjunction.

✕ NEVER open with "In conclusion", "In summary", or "To summarise". End sections naturally without announcing them.

✕ NEVER write "It is worth noting that" or "It is important to note that". Delete them and state the fact directly.

✕ NEVER use three-part parallel structures with the same verb. For example: "The system monitors performance, analyses trends, and generates reports." Break the parallel — vary verb forms and sentence structures.

✕ NEVER start a sentence with "This" referring to the previous sentence's subject. "This approach...", "This method..." is a classic AI cohesion pattern. Replace with the specific noun or restructure.

✕ NEVER use these words: delve, leverage, holistic, seamless, robust, comprehensive, groundbreaking, game-changer, transformative, synergy, cutting-edge, innovative, scalable, streamline. Replace with plain specific language.

✕ NEVER write perfectly balanced paragraphs. Vary lengths radically — some one sentence, some seven. No topic-sentence + 3-support + closing-sentence pattern every time.

✕ NEVER use numbered-list prose. If every paragraph starts with "First...", "Second...", "Third...", "Finally..." rewrite as flowing natural text.

✕ NEVER write "plays a crucial role" or "plays a key role". Say specifically what the thing does instead.

✓ DO use sentence fragments occasionally. Human writers use incomplete sentences for emphasis. Like this. AI almost never does.

✓ DO vary sentence openings radically. Start with adverbs, numbers, names, questions, dependent clauses. Never start 3+ consecutive sentences with "The".

✓ DO use contractions where register permits. "Don't", "it's", "we're", "isn't" should appear naturally when the target VOC score is high.

✓ DO let sentence lengths vary dramatically. Mix a 3-word sentence immediately before a 35-word sentence. The burstiness must be visible in the rhythm, not just measured.
`;

module.exports = { ANTI_AI_RULES };
