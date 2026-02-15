/**
 * LocalStorage-based history manager for past analyses.
 */
import type { AnalysisHistoryEntry, ATSScore } from '../types/analysis.types';

const STORAGE_KEY = 'ats-calc-history';
const MAX_ENTRIES = 20;

function getEntries(): AnalysisHistoryEntry[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function setEntries(entries: AnalysisHistoryEntry[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function saveAnalysis(
    score: ATSScore,
    resumePreview: string,
    jobTitle: string,
): AnalysisHistoryEntry {
    const entry: AnalysisHistoryEntry = {
        id: crypto.randomUUID(),
        score,
        resumePreview: resumePreview.slice(0, 200),
        jobTitle,
        createdAt: new Date().toISOString(),
    };
    const entries = [entry, ...getEntries()].slice(0, MAX_ENTRIES);
    setEntries(entries);
    return entry;
}

export function getAllHistory(): AnalysisHistoryEntry[] {
    return getEntries();
}

export function deleteEntry(id: string) {
    setEntries(getEntries().filter(e => e.id !== id));
}

export function clearHistory() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}
