// ── Score Bands ──
export type ScoreBand = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

// ── Skill categories ──
export type SkillCategory = 'hard' | 'tool' | 'soft';

// ── Penalty severity ──
export type PenaltySeverity = 'low' | 'medium' | 'high' | 'critical';

// ── Formatting issue severity ──
export type FormattingIssueSeverity = 'info' | 'warning' | 'error';

// ── Matched keyword ──
export interface MatchedKeyword {
    keyword: string;
    source: 'required' | 'preferred';
    count: number;
    context: string; // snippet from resume where found
}

// ── Missing keyword ──
export interface MissingKeyword {
    keyword: string;
    source: 'required' | 'preferred';
    importance: number; // 0–1
    suggestion: string;
}

// ── Skill cluster ──
export interface SkillCluster {
    category: SkillCategory;
    matched: string[];
    missing: string[];
    score: number; // 0–100
}

// ── Formatting issue ──
export interface FormattingIssue {
    id: string;
    severity: FormattingIssueSeverity;
    message: string;
    suggestion: string;
}

// ── Penalty ──
export interface Penalty {
    id: string;
    name: string;
    severity: PenaltySeverity;
    points: number; // deducted
    reason: string;
}

// ── Section-level scores ──
export interface SectionScores {
    keywordRelevance: number;   // max 30
    requiredSkills: number;     // max 30
    titleAlignment: number;     // max 10
    textSimilarity: number;     // max 15
    formatting: number;         // max 10
    bonus: number;              // max 5
}

// ── Suggestion ──
export interface Suggestion {
    id: string;
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact: string;          // expected score improvement
}

// ── Full ATS score result ──
export interface ATSScore {
    overall: number;            // 0–100
    band: ScoreBand;
    sections: SectionScores;
    matchedKeywords: MatchedKeyword[];
    missingKeywords: MissingKeyword[];
    skills: SkillCluster[];
    formattingIssues: FormattingIssue[];
    penalties: Penalty[];
    suggestions: Suggestion[];
    metadata: AnalysisMetadata;
}

// ── Metadata ──
export interface AnalysisMetadata {
    analyzedAt: string;         // ISO timestamp
    resumeWordCount: number;
    jdWordCount: number;
    resumeFileName?: string;
    jobTitle?: string;
}

// ── History entry (for localStorage) ──
export interface AnalysisHistoryEntry {
    id: string;
    score: ATSScore;
    resumePreview: string;      // first 200 chars
    jobTitle: string;
    createdAt: string;
}
