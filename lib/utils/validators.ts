/**
 * Input validation and sanitization.
 */

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

const MAX_TEXT_LENGTH = 100_000; // 100KB
const MIN_RESUME_LENGTH = 50;   // chars
const MIN_JD_LENGTH = 30;       // chars

export function validateResumeText(text: string): ValidationResult {
    if (!text || typeof text !== 'string') {
        return { valid: false, error: 'Resume text is required.' };
    }
    const trimmed = text.trim();
    if (trimmed.length < MIN_RESUME_LENGTH) {
        return { valid: false, error: `Resume is too short (minimum ${MIN_RESUME_LENGTH} characters).` };
    }
    if (trimmed.length > MAX_TEXT_LENGTH) {
        return { valid: false, error: `Resume exceeds maximum length of ${MAX_TEXT_LENGTH} characters.` };
    }
    return { valid: true };
}

export function validateJobDescription(text: string): ValidationResult {
    if (!text || typeof text !== 'string') {
        return { valid: false, error: 'Job description is required.' };
    }
    const trimmed = text.trim();
    if (trimmed.length < MIN_JD_LENGTH) {
        return { valid: false, error: `Job description is too short (minimum ${MIN_JD_LENGTH} characters).` };
    }
    if (trimmed.length > MAX_TEXT_LENGTH) {
        return { valid: false, error: `Job description exceeds maximum length of ${MAX_TEXT_LENGTH} characters.` };
    }
    return { valid: true };
}

/** Sanitize text — strip null bytes, trim */
export function sanitizeText(text: string): string {
    return text.replace(/\0/g, '').trim();
}

/** Validate file type */
export function isAllowedFileType(fileName: string): boolean {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ['pdf', 'docx', 'doc', 'txt'].includes(ext || '');
}

/** Max file size: 5MB */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function validateFileSize(sizeBytes: number): ValidationResult {
    if (sizeBytes > MAX_FILE_SIZE) {
        return { valid: false, error: 'File size exceeds 5MB limit.' };
    }
    return { valid: true };
}
