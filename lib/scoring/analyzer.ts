/**
 * Main ATS scoring analyzer — orchestrates all scoring components.
 */
import type { ATSScore, SectionScores, Suggestion } from '../types/analysis.types';
import { parseResume, parseJobDescription } from './parser';
import { matchKeywords, calculateKeywordScore } from './keywords';
import { extractJDSkills, matchSkills } from './skills';
import { calculateSimilarityScore } from './similarity';
import { assessFormatting } from './formatter';
import { calculatePenalties, totalPenaltyPoints } from './penalties';
import { getBand, ACTION_VERBS, BONUS_CRITERIA } from '../constants/scoring';
import { normalizeText, countOccurrences, tokenize } from '../utils/normalize';

export function analyzeResume(resumeText: string, jobDescription: string, resumeFileName?: string): ATSScore {
    // Step 1: Parse inputs
    const resume = parseResume(resumeText);
    const jdData = parseJobDescription(jobDescription);

    // Step 2: Keyword matching (30 pts)
    const { matched: matchedKeywords, missing: missingKeywords } = matchKeywords(resumeText, jdData);
    const keywordScore = calculateKeywordScore(matchedKeywords, missingKeywords);

    // Step 3: Skills matching (30 pts)
    const jdSkills = extractJDSkills(jobDescription);
    const { clusters: skillClusters, score: skillsScore } = matchSkills(resumeText, jdSkills);

    // Step 4: Title alignment (10 pts)
    const titleScore = calculateTitleAlignment(resumeText, jdData.title);

    // Step 5: Text similarity (15 pts)
    const similarityScore = calculateSimilarityScore(resumeText, jobDescription);

    // Step 6: Formatting (10 pts)
    const { issues: formattingIssues, score: formattingScore } = assessFormatting(resume);

    // Step 7: Bonus (5 pts)
    const bonusScore = calculateBonus(resume);

    // Step 8: Section scores
    const sections: SectionScores = {
        keywordRelevance: keywordScore,
        requiredSkills: skillsScore,
        titleAlignment: titleScore,
        textSimilarity: similarityScore,
        formatting: formattingScore,
        bonus: bonusScore,
    };

    // Step 9: Raw total
    const rawTotal = keywordScore + skillsScore + titleScore + similarityScore + formattingScore + bonusScore;

    // Step 10: Penalties
    const penalties = calculatePenalties(resume, matchedKeywords);
    const penaltyDeduction = totalPenaltyPoints(penalties);

    // Step 11: Final score (clamped 0-100)
    const overall = Math.max(0, Math.min(100, rawTotal - penaltyDeduction));

    // Step 12: Suggestions
    const suggestions = generateSuggestions(sections, missingKeywords.length, skillClusters, formattingIssues.length, penalties.length);

    return {
        overall,
        band: getBand(overall),
        sections,
        matchedKeywords,
        missingKeywords,
        skills: skillClusters,
        formattingIssues,
        penalties,
        suggestions,
        metadata: {
            analyzedAt: new Date().toISOString(),
            resumeWordCount: resume.wordCount,
            jdWordCount: tokenize(jobDescription).length,
            resumeFileName,
            jobTitle: jdData.title,
        },
    };
}

// ── Title alignment scorer (out of 10) ──
function calculateTitleAlignment(resumeText: string, jdTitle: string): number {
    if (!jdTitle) return 5; // neutral
    const normalizedResume = normalizeText(resumeText);
    const titleTokens = normalizeText(jdTitle).split(/\s+/).filter(t => t.length > 2);

    if (titleTokens.length === 0) return 5;

    let matched = 0;
    for (const token of titleTokens) {
        if (countOccurrences(normalizedResume, token) > 0) matched++;
    }

    const ratio = matched / titleTokens.length;
    return Math.round(ratio * 10);
}

// ── Bonus calculator (out of 5) ──
function calculateBonus(resume: import('../types/resume.types').ResumeData): number {
    let bonus = 0;

    // Quantified achievements (numbers in bullet points)
    const hasNumbers = resume.experiences.some(exp =>
        exp.bullets.some(b => /\d+%|\$\d+|\b\d{2,}\b/.test(b))
    );
    if (hasNumbers) bonus += BONUS_CRITERIA.hasQuantifiedAchievements;

    // Action verbs
    const normalizedText = normalizeText(resume.rawText);
    const actionVerbCount = ACTION_VERBS.filter(v => countOccurrences(normalizedText, v) > 0).length;
    if (actionVerbCount >= 3) bonus += BONUS_CRITERIA.hasActionVerbs;

    // LinkedIn
    if (resume.contactInfo.linkedin) bonus += BONUS_CRITERIA.hasLinkedIn;

    // GitHub
    if (resume.contactInfo.github) bonus += BONUS_CRITERIA.hasGitHub;

    return Math.min(5, bonus);
}

// ── Generate actionable suggestions ──
function generateSuggestions(
    sections: SectionScores,
    missingCount: number,
    skillClusters: import('../types/analysis.types').SkillCluster[],
    formattingIssueCount: number,
    penaltyCount: number,
): Suggestion[] {
    const suggestions: Suggestion[] = [];

    if (sections.keywordRelevance < 20) {
        suggestions.push({
            id: 'improve-keywords',
            priority: 'high',
            title: 'Add Missing Keywords',
            description: `Your resume is missing ${missingCount} keywords from the job description. Mirror the exact language used in the JD.`,
            impact: '+5-15 points',
        });
    }

    if (sections.requiredSkills < 20) {
        const missingSkills = skillClusters.flatMap(c => c.missing).slice(0, 5);
        suggestions.push({
            id: 'add-skills',
            priority: 'high',
            title: 'Add Required Skills',
            description: `Skills gap detected. Consider adding: ${missingSkills.join(', ')}`,
            impact: '+5-15 points',
        });
    }

    if (sections.titleAlignment < 5) {
        suggestions.push({
            id: 'align-title',
            priority: 'medium',
            title: 'Align with Job Title',
            description: 'Your resume doesn\'t mention the target job title. Add it to your summary or headline.',
            impact: '+3-8 points',
        });
    }

    if (sections.textSimilarity < 8) {
        suggestions.push({
            id: 'improve-similarity',
            priority: 'medium',
            title: 'Use Similar Language',
            description: 'Rephrase your experience to match the terminology used in the job description.',
            impact: '+3-7 points',
        });
    }

    if (sections.formatting < 7) {
        suggestions.push({
            id: 'fix-formatting',
            priority: 'medium',
            title: 'Fix Formatting Issues',
            description: `${formattingIssueCount} formatting issues detected. Fix these for better ATS parsing.`,
            impact: '+2-5 points',
        });
    }

    if (sections.bonus < 3) {
        suggestions.push({
            id: 'add-metrics',
            priority: 'low',
            title: 'Quantify Achievements',
            description: 'Add numbers and percentages to your bullet points (e.g., "increased revenue by 25%").',
            impact: '+2-5 points',
        });
    }

    if (penaltyCount > 0) {
        suggestions.push({
            id: 'resolve-penalties',
            priority: 'high',
            title: 'Resolve Penalties',
            description: `${penaltyCount} penalties are reducing your score. Check the penalties section for details.`,
            impact: '+3-10 points',
        });
    }

    return suggestions.sort((a, b) => {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.priority] - order[b.priority];
    });
}
