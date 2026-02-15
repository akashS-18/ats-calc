/**
 * Penalty system: detects resume red flags and applies score deductions.
 */
import type { Penalty } from '../types/analysis.types';
import type { ResumeData } from '../types/resume.types';
import type { MatchedKeyword } from '../types/analysis.types';
import { PENALTY_VALUES } from '../constants/scoring';
import { tokenize } from '../utils/normalize';

export function calculatePenalties(
    resume: ResumeData,
    matchedKeywords: MatchedKeyword[],
): Penalty[] {
    const penalties: Penalty[] = [];

    // 1. Missing contact email
    if (!resume.contactInfo.email) {
        penalties.push({
            id: 'no-email',
            name: 'Missing Email',
            severity: 'high',
            points: PENALTY_VALUES.missingContactEmail,
            reason: 'No email address detected. Recruiters need a way to contact you.',
        });
    }

    // 2. Missing phone
    if (!resume.contactInfo.phone) {
        penalties.push({
            id: 'no-phone',
            name: 'Missing Phone',
            severity: 'medium',
            points: PENALTY_VALUES.missingContactPhone,
            reason: 'No phone number detected.',
        });
    }

    // 3. Keyword stuffing detection
    const stuffed = matchedKeywords.filter(k => k.count > 8);
    if (stuffed.length > 0) {
        penalties.push({
            id: 'keyword-stuffing',
            name: 'Keyword Stuffing',
            severity: 'critical',
            points: PENALTY_VALUES.keywordStuffing,
            reason: `Keywords repeated excessively: ${stuffed.map(k => `"${k.keyword}" (${k.count}x)`).join(', ')}. ATS systems flag this.`,
        });
    }

    // 4. Too short
    if (resume.wordCount < 200) {
        penalties.push({
            id: 'too-short',
            name: 'Insufficient Content',
            severity: 'high',
            points: PENALTY_VALUES.tooShort,
            reason: `Resume has only ${resume.wordCount} words. Most ATS-optimized resumes have 300-700 words.`,
        });
    }

    // 5. Too long
    if (resume.wordCount > 1500) {
        penalties.push({
            id: 'too-long',
            name: 'Excessive Length',
            severity: 'low',
            points: PENALTY_VALUES.tooLong,
            reason: `Resume has ${resume.wordCount} words. Consider trimming for ATS readability.`,
        });
    }

    // 6. No experience section
    if (resume.experiences.length === 0) {
        penalties.push({
            id: 'no-experience',
            name: 'No Experience',
            severity: 'high',
            points: PENALTY_VALUES.noExperience,
            reason: 'No work experience section detected.',
        });
    }

    // 7. No education
    if (resume.educations.length === 0) {
        penalties.push({
            id: 'no-education',
            name: 'No Education',
            severity: 'medium',
            points: PENALTY_VALUES.noEducation,
            reason: 'No education section detected.',
        });
    }

    // 8. No bullet points
    const hasBullets = resume.rawText.match(/^[•\-*▪◦]/m);
    if (!hasBullets && resume.experiences.length > 0) {
        penalties.push({
            id: 'no-bullets',
            name: 'No Bullet Points',
            severity: 'medium',
            points: PENALTY_VALUES.noBulletPoints,
            reason: 'No bullet points found. Use bullets to list achievements for better ATS parsing.',
        });
    }

    return penalties;
}

export function totalPenaltyPoints(penalties: Penalty[]): number {
    return penalties.reduce((sum, p) => sum + p.points, 0);
}
