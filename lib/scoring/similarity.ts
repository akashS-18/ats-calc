/**
 * Custom n-gram based text similarity scorer using Jaccard similarity.
 */
import { tokenize, removeStopWords, nGrams } from '../utils/normalize';

/** Compute Jaccard similarity between two sets */
function jaccard(a: Set<string>, b: Set<string>): number {
    if (a.size === 0 && b.size === 0) return 0;
    let intersection = 0;
    for (const item of a) {
        if (b.has(item)) intersection++;
    }
    const union = a.size + b.size - intersection;
    return union > 0 ? intersection / union : 0;
}

/** Compute similarity score between resume and JD text (0-1) */
export function computeSimilarity(resumeText: string, jdText: string): number {
    const resumeTokens = removeStopWords(tokenize(resumeText));
    const jdTokens = removeStopWords(tokenize(jdText));

    if (resumeTokens.length === 0 || jdTokens.length === 0) return 0;

    // Unigram similarity
    const unigramSim = jaccard(new Set(resumeTokens), new Set(jdTokens));

    // Bigram similarity
    const resumeBigrams = nGrams(resumeTokens, 2);
    const jdBigrams = nGrams(jdTokens, 2);
    const bigramSim = jaccard(new Set(resumeBigrams), new Set(jdBigrams));

    // Trigram similarity
    const resumeTrigrams = nGrams(resumeTokens, 3);
    const jdTrigrams = nGrams(jdTokens, 3);
    const trigramSim = jaccard(new Set(resumeTrigrams), new Set(jdTrigrams));

    // Weighted combination: unigrams 40%, bigrams 40%, trigrams 20%
    return unigramSim * 0.4 + bigramSim * 0.4 + trigramSim * 0.2;
}

/** Calculate similarity score out of max points (default 15) */
export function calculateSimilarityScore(
    resumeText: string,
    jdText: string,
    maxPoints = 15,
): number {
    const sim = computeSimilarity(resumeText, jdText);
    // Scale: 0.3+ similarity = full marks, exponential scaling below
    const scaled = Math.min(1, sim / 0.3);
    return Math.round(scaled * maxPoints);
}
