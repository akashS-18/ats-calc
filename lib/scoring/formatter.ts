/**
 * Resume formatting quality assessment.
 */
import type { FormattingIssue } from '../types/analysis.types';
import type { ResumeData } from '../types/resume.types';
import { FORMATTING, REQUIRED_SECTIONS } from '../constants/scoring';
import { extractLines } from '../utils/normalize';

export function assessFormatting(resume: ResumeData): { issues: FormattingIssue[]; score: number } {
    const issues: FormattingIssue[] = [];
    let deductions = 0;

    // 1. Check contact info completeness
    if (!resume.contactInfo.email) {
        issues.push({
            id: 'no-email',
            severity: 'error',
            message: 'Missing email address',
            suggestion: 'Add your professional email address at the top of your resume.',
        });
        deductions += 2;
    }

    if (!resume.contactInfo.phone) {
        issues.push({
            id: 'no-phone',
            severity: 'warning',
            message: 'Missing phone number',
            suggestion: 'Include a phone number for easier recruiter contact.',
        });
        deductions += 1;
    }

    // 2. Check required sections
    for (const section of REQUIRED_SECTIONS) {
        if (!resume.sections[section]?.trim()) {
            issues.push({
                id: `missing-${section}`,
                severity: 'error',
                message: `Missing "${section}" section`,
                suggestion: `Add a clearly labeled "${section}" section to your resume.`,
            });
            deductions += 2;
        }
    }

    // 3. Word count
    if (resume.wordCount < FORMATTING.minWordCount) {
        issues.push({
            id: 'too-short',
            severity: 'warning',
            message: `Resume is too short (${resume.wordCount} words)`,
            suggestion: `Aim for at least ${FORMATTING.minWordCount} words. Add more detail to your experience and skills.`,
        });
        deductions += 2;
    } else if (resume.wordCount > FORMATTING.maxWordCount) {
        issues.push({
            id: 'too-long',
            severity: 'info',
            message: `Resume is quite long (${resume.wordCount} words)`,
            suggestion: `Consider trimming to under ${FORMATTING.maxWordCount} words for ATS readability.`,
        });
        deductions += 1;
    }

    // 4. Bullet point usage
    const bulletLines = extractLines(resume.rawText).filter(l => /^[•\-*▪◦]/.test(l));
    if (bulletLines.length < 3 && resume.experiences.length > 0) {
        issues.push({
            id: 'few-bullets',
            severity: 'warning',
            message: 'Limited use of bullet points',
            suggestion: 'Use bullet points to list your achievements and responsibilities. ATS systems parse bullets better.',
        });
        deductions += 1;
    }

    // 5. LinkedIn/GitHub
    if (!resume.contactInfo.linkedin) {
        issues.push({
            id: 'no-linkedin',
            severity: 'info',
            message: 'No LinkedIn profile detected',
            suggestion: 'Adding your LinkedIn URL can strengthen your application.',
        });
    }

    // 6. Summary section
    if (!resume.sections.summary?.trim()) {
        issues.push({
            id: 'no-summary',
            severity: 'info',
            message: 'No professional summary detected',
            suggestion: 'A brief professional summary helps ATS systems understand your profile quickly.',
        });
        deductions += 1;
    }

    // Calculate formatting score (out of 10)
    const score = Math.max(0, 10 - deductions);

    return { issues, score };
}
