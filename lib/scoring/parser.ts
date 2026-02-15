/**
 * Resume & Job Description text parser.
 * Detects sections, extracts contact info, experiences, education, etc.
 */
import type { ResumeData, ContactInfo, ResumeSections, Experience, Education, Project, Certification } from '../types/resume.types';
import { SECTION_PATTERNS, CONTACT_PATTERNS } from '../constants/scoring';
import { extractLines, isSectionHeader, normalizeText, tokenize } from '../utils/normalize';

// ── Parse resume text into structured data ──
export function parseResume(rawText: string): ResumeData {
    const sections = detectSections(rawText);
    const contactInfo = extractContactInfo(rawText);
    const experiences = extractExperiences(sections.experience);
    const educations = extractEducation(sections.education);
    const projects = extractProjects(sections.projects);
    const certifications = extractCertifications(sections.certifications);
    const skillsList = extractSkillsList(sections.skills);
    const wordCount = tokenize(rawText).length;

    return {
        rawText,
        sections,
        contactInfo,
        experiences,
        educations,
        projects,
        certifications,
        skillsList,
        wordCount,
    };
}

// ── Detect sections in the resume text ──
export function detectSections(text: string): ResumeSections {
    const sections: ResumeSections = {
        contact: '',
        summary: '',
        experience: '',
        education: '',
        skills: '',
        projects: '',
        certifications: '',
        other: '',
    };

    const lines = extractLines(text);
    let currentSection: keyof ResumeSections = 'contact'; // default first section

    for (const line of lines) {
        const clean = line.replace(/[:\-—_|]/g, '').trim();

        // Check if this line matches a known section header
        let matched = false;
        for (const [sectionKey, pattern] of Object.entries(SECTION_PATTERNS)) {
            if (pattern.test(clean)) {
                currentSection = sectionKey as keyof ResumeSections;
                matched = true;
                break;
            }
        }

        if (matched) continue; // skip the header line itself

        // If line looks like a header but didn't match, move to 'other'
        if (isSectionHeader(line) && clean.length > 2) {
            currentSection = 'other';
        }

        sections[currentSection] += line + '\n';
    }

    // Trim all sections
    for (const key of Object.keys(sections) as (keyof ResumeSections)[]) {
        sections[key] = sections[key].trim();
    }

    return sections;
}

// ── Extract contact info ──
export function extractContactInfo(text: string): ContactInfo {
    const info: ContactInfo = {};

    const emailMatch = text.match(CONTACT_PATTERNS.email);
    if (emailMatch) info.email = emailMatch[0];

    const phoneMatch = text.match(CONTACT_PATTERNS.phone);
    if (phoneMatch) info.phone = phoneMatch[0];

    const linkedinMatch = text.match(CONTACT_PATTERNS.linkedin);
    if (linkedinMatch) info.linkedin = linkedinMatch[0];

    const githubMatch = text.match(CONTACT_PATTERNS.github);
    if (githubMatch) info.github = githubMatch[0];

    const websiteMatch = text.match(CONTACT_PATTERNS.website);
    if (websiteMatch) info.website = websiteMatch[0];

    // Name: first non-empty line heuristic
    const firstLine = extractLines(text)[0];
    if (firstLine && !firstLine.match(CONTACT_PATTERNS.email) && firstLine.length < 60) {
        info.name = firstLine.replace(/[|,\-:]/g, '').trim();
    }

    return info;
}

// ── Extract experiences from the experience section text ──
export function extractExperiences(text: string): Experience[] {
    if (!text.trim()) return [];
    const experiences: Experience[] = [];
    const lines = extractLines(text);
    let current: Experience | null = null;

    for (const line of lines) {
        // Lines that look like job titles / company names
        const titleCompanyMatch = line.match(/^(.+?)\s*(?:at|@|,|–|-|—|\|)\s*(.+)/i);
        if (titleCompanyMatch && !line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*')) {
            if (current) experiences.push(current);
            current = {
                title: titleCompanyMatch[1].trim(),
                company: titleCompanyMatch[2].trim(),
                duration: '',
                bullets: [],
            };
            continue;
        }

        // Duration-looking lines
        const durationMatch = line.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)\s*\d{0,4}\s*[-–—to]+\s*(present|\w+\s*\d{0,4})/i);
        if (durationMatch && current) {
            current.duration = line.trim();
            continue;
        }

        // Bullet points
        if (/^[•\-*▪◦]\s*/.test(line) && current) {
            current.bullets.push(line.replace(/^[•\-*▪◦]\s*/, '').trim());
        } else if (current && line.length > 10) {
            // Non-bullet text treated as bullet
            current.bullets.push(line.trim());
        }
    }

    if (current) experiences.push(current);
    return experiences;
}

// ── Extract education ──
export function extractEducation(text: string): Education[] {
    if (!text.trim()) return [];
    const educations: Education[] = [];
    const lines = extractLines(text);

    for (const line of lines) {
        const degreeMatch = line.match(/(bachelor|master|phd|doctorate|associate|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?|b\.?e\.?|m\.?e\.?|b\.?tech|m\.?tech|mba|bba|diploma)/i);
        if (degreeMatch) {
            educations.push({
                degree: line.trim(),
                institution: '',
                year: (line.match(/\b(19|20)\d{2}\b/) || [])[0],
            });
        } else if (educations.length > 0 && !educations[educations.length - 1].institution) {
            educations[educations.length - 1].institution = line.trim();
        }
    }

    return educations;
}

// ── Extract projects ──
export function extractProjects(text: string): Project[] {
    if (!text.trim()) return [];
    const projects: Project[] = [];
    const lines = extractLines(text);
    let current: Project | null = null;

    for (const line of lines) {
        if (!line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*') && line.length < 80) {
            if (current) projects.push(current);
            current = { name: line.trim(), description: '', technologies: [] };
        } else if (current) {
            current.description += line.replace(/^[•\-*]\s*/, '') + ' ';
        }
    }

    if (current) projects.push(current);
    return projects;
}

// ── Extract certifications ──
export function extractCertifications(text: string): Certification[] {
    if (!text.trim()) return [];
    return extractLines(text).map(line => ({
        name: line.replace(/^[•\-*]\s*/, '').trim(),
    }));
}

// ── Extract skills list from skills section ──
export function extractSkillsList(text: string): string[] {
    if (!text.trim()) return [];
    // Skills are usually comma, pipe, or bullet separated
    return text
        .split(/[,|•\-*\n;]/)
        .map(s => s.trim())
        .filter(s => s.length > 1 && s.length < 50);
}

// ── Parse job description into keywords ──
export interface JobDescriptionData {
    rawText: string;
    title: string;
    requiredKeywords: string[];
    preferredKeywords: string[];
    wordCount: number;
}

export function parseJobDescription(rawText: string): JobDescriptionData {
    const normalized = normalizeText(rawText);
    const lines = extractLines(rawText);
    const wordCount = tokenize(rawText).length;

    // Try to extract job title (first non-empty line or line with common patterns)
    let title = '';
    for (const line of lines) {
        if (line.match(/(engineer|developer|designer|manager|analyst|scientist|architect|consultant|lead|senior|junior|intern)/i)) {
            title = line.trim();
            break;
        }
    }
    if (!title && lines.length > 0) title = lines[0].trim();

    // Split into required/preferred based on keyword sections
    const { required, preferred } = extractJDKeywords(rawText);

    return {
        rawText,
        title,
        requiredKeywords: required,
        preferredKeywords: preferred,
        wordCount,
    };
}

function extractJDKeywords(text: string): { required: string[]; preferred: string[] } {
    const required: string[] = [];
    const preferred: string[] = [];

    const lines = extractLines(text);
    let inRequired = false;
    let inPreferred = false;

    for (const line of lines) {
        const lower = line.toLowerCase();

        // Detect required section
        if (lower.match(/(required|must\s*have|requirements|qualifications|what\s*you.*(need|bring)|minimum)/)) {
            inRequired = true;
            inPreferred = false;
            continue;
        }

        // Detect preferred section
        if (lower.match(/(preferred|nice\s*to\s*have|bonus|desirable|plus|good\s*to\s*have|additional)/)) {
            inPreferred = true;
            inRequired = false;
            continue;
        }

        // Collect bullet items
        const bullet = line.replace(/^[•\-*▪◦\d.)\]]+\s*/, '').trim();
        if (bullet.length > 3) {
            if (inPreferred) {
                preferred.push(bullet);
            } else {
                required.push(bullet); // default to required
            }
        }
    }

    return { required, preferred };
}
