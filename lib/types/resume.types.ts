// ── Contact Info ──
export interface ContactInfo {
    name?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    location?: string;
}

// ── Experience entry ──
export interface Experience {
    title: string;
    company: string;
    duration: string;
    bullets: string[];
}

// ── Education entry ──
export interface Education {
    degree: string;
    institution: string;
    year?: string;
    gpa?: string;
}

// ── Project entry ──
export interface Project {
    name: string;
    description: string;
    technologies: string[];
}

// ── Certification ──
export interface Certification {
    name: string;
    issuer?: string;
    year?: string;
}

// ── Detected resume sections ──
export interface ResumeSections {
    contact: string;
    summary: string;
    experience: string;
    education: string;
    skills: string;
    projects: string;
    certifications: string;
    other: string;
}

// ── Parsed resume data ──
export interface ResumeData {
    rawText: string;
    sections: ResumeSections;
    contactInfo: ContactInfo;
    experiences: Experience[];
    educations: Education[];
    projects: Project[];
    certifications: Certification[];
    skillsList: string[];
    wordCount: number;
}
