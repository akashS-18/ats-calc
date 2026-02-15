/**
 * Skills matching with synonym support via the skills dictionary.
 */
import type { SkillCluster, SkillCategory } from '../types/analysis.types';
import { normalizeText, countOccurrences } from '../utils/normalize';
import skillsData from '../../data/skills_dictionary.json';

interface SkillEntry {
    name: string;
    category: SkillCategory;
    synonyms: string[];
    weight: number;
}

const skillsDictionary: SkillEntry[] = skillsData.skills as SkillEntry[];

// ── Find skills mentioned in the job description ──
export function extractJDSkills(jdText: string): SkillEntry[] {
    const normalized = normalizeText(jdText);
    const found: SkillEntry[] = [];

    for (const skill of skillsDictionary) {
        const allNames = [skill.name, ...skill.synonyms];
        for (const name of allNames) {
            if (countOccurrences(normalized, normalizeText(name)) > 0) {
                found.push(skill);
                break;
            }
        }
    }

    return found;
}

// ── Match resume skills against JD skills ──
export function matchSkills(
    resumeText: string,
    jdSkills: SkillEntry[],
): { clusters: SkillCluster[]; score: number } {
    const normalizedResume = normalizeText(resumeText);

    const categoryMap: Record<SkillCategory, { matched: string[]; missing: string[]; totalWeight: number; matchedWeight: number }> = {
        hard: { matched: [], missing: [], totalWeight: 0, matchedWeight: 0 },
        tool: { matched: [], missing: [], totalWeight: 0, matchedWeight: 0 },
        soft: { matched: [], missing: [], totalWeight: 0, matchedWeight: 0 },
    };

    for (const skill of jdSkills) {
        const cat = categoryMap[skill.category];
        cat.totalWeight += skill.weight;

        const allNames = [skill.name, ...skill.synonyms];
        let found = false;
        for (const name of allNames) {
            if (countOccurrences(normalizedResume, normalizeText(name)) > 0) {
                cat.matched.push(skill.name);
                cat.matchedWeight += skill.weight;
                found = true;
                break;
            }
        }
        if (!found) {
            cat.missing.push(skill.name);
        }
    }

    // Build clusters
    const clusters: SkillCluster[] = (['hard', 'tool', 'soft'] as SkillCategory[]).map(category => {
        const cat = categoryMap[category];
        const score = cat.totalWeight > 0
            ? Math.round((cat.matchedWeight / cat.totalWeight) * 100)
            : 100;
        return {
            category,
            matched: cat.matched,
            missing: cat.missing,
            score,
        };
    });

    // Overall skills score (out of 30)
    // Hard skills: 50%, Tools: 35%, Soft: 15%
    const hardCluster = clusters.find(c => c.category === 'hard')!;
    const toolCluster = clusters.find(c => c.category === 'tool')!;
    const softCluster = clusters.find(c => c.category === 'soft')!;

    const weightedScore =
        (hardCluster.score / 100) * 0.5 +
        (toolCluster.score / 100) * 0.35 +
        (softCluster.score / 100) * 0.15;

    const score = Math.round(weightedScore * 30);

    return { clusters, score };
}
