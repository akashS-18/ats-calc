import type { ATSScore } from './analysis.types';

// ── Analyze request ──
export interface AnalyzeRequest {
    resumeText: string;
    jobDescription: string;
    resumeFileName?: string;
}

// ── Analyze response (success) ──
export interface AnalyzeResponse {
    success: true;
    data: ATSScore;
}

// ── Error response ──
export interface ErrorResponse {
    success: false;
    error: string;
    details?: string;
}

// ── Union type ──
export type ApiResponse = AnalyzeResponse | ErrorResponse;
