/**
 * Keyword extraction and matching from job descriptions.
 */
import { normalizeText, tokenize, removeStopWords, countOccurrences, getContext } from '../utils/normalize';
import type { MatchedKeyword, MissingKeyword } from '../types/analysis.types';
import type { JobDescriptionData } from './parser';

// ── Extract significant keywords from JD text lines ──
export function extractKeywordsFromLines(lines: string[]): string[] {
    const keywords: string[] = [];

    for (const line of lines) {
        const tokens = removeStopWords(tokenize(line));
        // Short phrases (1-3 words) that look like skills or tools
        const phrases = extractPhrases(line);
        keywords.push(...phrases);
        // Single significant tokens (> 3 chars)
        for (const t of tokens) {
            if (t.length > 3 && !keywords.includes(t)) {
                keywords.push(t);
            }
        }
    }

    // De-duplicate
    return [...new Set(keywords)];
}

/** Extract multi-word phrases that look like tech skills */
function extractPhrases(text: string): string[] {
    const phrases: string[] = [];
    // Match patterns like "React.js", "Node.js", "Machine Learning", "CI/CD"
    const matches = text.match(/\b[A-Z][\w.+#/-]*(?:\s+[A-Z][\w.+#/-]*){0,3}\b/g);
    if (matches) {
        for (const m of matches) {
            const clean = m.trim();
            if (clean.length > 2 && clean.length < 40) {
                phrases.push(clean.toLowerCase());
            }
        }
    }
    return phrases;
}

// ── Match extracted keywords against resume text ──
export function matchKeywords(
    resumeText: string,
    jdData: JobDescriptionData,
): { matched: MatchedKeyword[]; missing: MissingKeyword[] } {
    const normalizedResume = normalizeText(resumeText);
    const matched: MatchedKeyword[] = [];
    const missing: MissingKeyword[] = [];

    const allRequired = extractKeywordsFromLines(jdData.requiredKeywords);
    const allPreferred = extractKeywordsFromLines(jdData.preferredKeywords);

    // Check required keywords
    for (const kw of allRequired) {
        const count = countOccurrences(normalizedResume, kw);
        if (count > 0) {
            matched.push({
                keyword: kw,
                source: 'required',
                count,
                context: getContext(resumeText, kw),
            });
        } else {
            missing.push({
                keyword: kw,
                source: 'required',
                importance: 0.9,
                suggestion: `Consider adding "${kw}" to your resume if you have this experience.`,
            });
        }
    }

    // Check preferred keywords
    for (const kw of allPreferred) {
        // Skip if already counted as required
        if (matched.some(m => m.keyword === kw) || missing.some(m => m.keyword === kw)) continue;

        const count = countOccurrences(normalizedResume, kw);
        if (count > 0) {
            matched.push({
                keyword: kw,
                source: 'preferred',
                count,
                context: getContext(resumeText, kw),
            });
        } else {
            missing.push({
                keyword: kw,
                source: 'preferred',
                importance: 0.5,
                suggestion: `Adding "${kw}" could strengthen your application.`,
            });
        }
    }

    return { matched, missing };
}

// ── Calculate keyword relevance score (out of 30) ──
export function calculateKeywordScore(
    matched: MatchedKeyword[],
    missing: MissingKeyword[],
): number {
    const total = matched.length + missing.length;
    if (total === 0) return 15; // neutral if no keywords detected

    const requiredMatched = matched.filter(m => m.source === 'required').length;
    const requiredTotal = matched.filter(m => m.source === 'required').length + missing.filter(m => m.source === 'required').length;
    const preferredMatched = matched.filter(m => m.source === 'preferred').length;
    const preferredTotal = matched.filter(m => m.source === 'preferred').length + missing.filter(m => m.source === 'preferred').length;

    // Required keywords worth 70% of keyword score, preferred 30%
    const requiredRatio = requiredTotal > 0 ? requiredMatched / requiredTotal : 0.5;
    const preferredRatio = preferredTotal > 0 ? preferredMatched / preferredTotal : 0.5;

    const raw = requiredRatio * 0.7 + preferredRatio * 0.3;
    return Math.round(raw * 30);
}
