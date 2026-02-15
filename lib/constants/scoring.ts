import type { ScoreBand } from '../types/analysis.types';

// ── Scoring weights (total = 100) ──
export const SCORING_WEIGHTS = {
    keywordRelevance: 30,
    requiredSkills: 30,
    titleAlignment: 10,
    textSimilarity: 15,
    formatting: 10,
    bonus: 5,
} as const;

// ── Score band thresholds ──
export const SCORE_BANDS: { min: number; max: number; band: ScoreBand; label: string; color: string }[] = [
    { min: 85, max: 100, band: 'excellent', label: 'Excellent Match', color: '#22c55e' },
    { min: 70, max: 84, band: 'good', label: 'Good Match', color: '#3b82f6' },
    { min: 50, max: 69, band: 'fair', label: 'Fair Match', color: '#f59e0b' },
    { min: 30, max: 49, band: 'poor', label: 'Poor Match', color: '#f97316' },
    { min: 0, max: 29, band: 'critical', label: 'Needs Work', color: '#ef4444' },
];

// ── Penalty definitions ──
export const PENALTY_VALUES = {
    missingContactEmail: 5,
    missingContactPhone: 3,
    keywordStuffing: 10,
    tooShort: 8,         // < 200 words
    tooLong: 4,          // > 1500 words
    noExperience: 10,
    noEducation: 5,
    noBulletPoints: 5,
    complexLayout: 3,
} as const;

// ── Formatting thresholds ──
export const FORMATTING = {
    minWordCount: 200,
    maxWordCount: 1500,
    idealBulletMin: 3,
    idealBulletMax: 6,
    maxBulletsPerJob: 8,
} as const;

// ── Required section names ──
export const REQUIRED_SECTIONS = [
    'experience',
    'education',
    'skills',
] as const;

// ── Section header regex patterns ──
export const SECTION_PATTERNS: Record<string, RegExp> = {
    contact: /^(contact\s*(info|information|details)?|personal\s*(info|information|details)?)$/i,
    summary: /^(summary|objective|profile|about\s*me|professional\s*summary|career\s*summary)$/i,
    experience: /^(experience|work\s*experience|employment|professional\s*experience|work\s*history)$/i,
    education: /^(education|academic|qualifications|educational\s*background)$/i,
    skills: /^(skills|technical\s*skills|core\s*competencies|competencies|technologies|tech\s*stack)$/i,
    projects: /^(projects|personal\s*projects|key\s*projects|portfolio)$/i,
    certifications: /^(certifications?|licenses?|credentials|accreditations?)$/i,
};

// ── Contact info patterns ──
export const CONTACT_PATTERNS = {
    email: /[\w.+-]+@[\w-]+\.[\w.]+/,
    phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/,
    linkedin: /linkedin\.com\/in\/[\w-]+/i,
    github: /github\.com\/[\w-]+/i,
    website: /https?:\/\/(?!.*(?:linkedin|github)\.com)[\w.-]+\.\w{2,}/i,
};

// ── Bonus criteria ──
export const BONUS_CRITERIA = {
    hasQuantifiedAchievements: 2,  // numbers in bullets
    hasActionVerbs: 1,
    hasLinkedIn: 1,
    hasGitHub: 1,
} as const;

// ── Common action verbs ──
export const ACTION_VERBS = [
    'achieved', 'built', 'created', 'delivered', 'designed', 'developed',
    'engineered', 'established', 'executed', 'generated', 'implemented',
    'improved', 'increased', 'launched', 'led', 'managed', 'optimized',
    'orchestrated', 'pioneered', 'reduced', 'resolved', 'scaled',
    'spearheaded', 'streamlined', 'transformed', 'architected',
];

export function getBand(score: number): ScoreBand {
    const band = SCORE_BANDS.find(b => score >= b.min && score <= b.max);
    return band?.band ?? 'critical';
}

export function getBandInfo(score: number) {
    return SCORE_BANDS.find(b => score >= b.min && score <= b.max) ?? SCORE_BANDS[SCORE_BANDS.length - 1];
}
