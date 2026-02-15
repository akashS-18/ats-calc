/**
 * Text normalization and tokenization utilities.
 */

/** Remove special characters, collapse whitespace, lowercase */
export function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .replace(/['']/g, "'")
        .replace(/[""]/g, '"')
        .replace(/[\r\n]+/g, ' ')
        .replace(/[^\w\s.@/+#-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/** Split text into word tokens */
export function tokenize(text: string): string[] {
    return normalizeText(text)
        .split(/\s+/)
        .filter(t => t.length > 1);
}

/** Remove common stop words */
const STOP_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'is', 'it', 'as', 'be', 'was', 'are', 'were', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
    'may', 'might', 'must', 'shall', 'can', 'this', 'that', 'these', 'those',
    'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she', 'they', 'them',
    'its', 'his', 'her', 'their', 'which', 'what', 'who', 'whom', 'how', 'when',
    'where', 'why', 'not', 'no', 'nor', 'so', 'if', 'then', 'than', 'too', 'very',
    'just', 'about', 'also', 'into', 'over', 'such', 'after', 'before',
]);

export function removeStopWords(tokens: string[]): string[] {
    return tokens.filter(t => !STOP_WORDS.has(t));
}

/** Extract n-grams from tokens */
export function nGrams(tokens: string[], n: number): string[] {
    const grams: string[] = [];
    for (let i = 0; i <= tokens.length - n; i++) {
        grams.push(tokens.slice(i, i + n).join(' '));
    }
    return grams;
}

/** Count word frequency */
export function wordFrequency(tokens: string[]): Map<string, number> {
    const freq = new Map<string, number>();
    for (const t of tokens) {
        freq.set(t, (freq.get(t) || 0) + 1);
    }
    return freq;
}

/** Extract lines from raw text */
export function extractLines(text: string): string[] {
    return text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
}

/** Check if a line looks like a section header */
export function isSectionHeader(line: string): boolean {
    const clean = line.replace(/[:\-—_|]/g, '').trim();
    // Short line, all uppercase or title case, no periods
    if (clean.length > 50) return false;
    if (clean.length < 2) return false;
    if (clean === clean.toUpperCase() && clean.length < 40) return true;
    // Title-case heuristic: first letter of each word is uppercase
    const titleCase = clean.split(/\s+/).every(w => /^[A-Z]/.test(w));
    if (titleCase && clean.split(/\s+/).length <= 5) return true;
    return false;
}

/** Count occurrences of a pattern in text */
export function countOccurrences(text: string, pattern: string): number {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    return (text.match(regex) || []).length;
}

/** Get snippet around a matched keyword */
export function getContext(text: string, keyword: string, radius = 40): string {
    const idx = text.toLowerCase().indexOf(keyword.toLowerCase());
    if (idx === -1) return '';
    const start = Math.max(0, idx - radius);
    const end = Math.min(text.length, idx + keyword.length + radius);
    return (start > 0 ? '...' : '') + text.slice(start, end).trim() + (end < text.length ? '...' : '');
}
