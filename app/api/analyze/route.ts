/**
 * POST /api/analyze — ATS Resume Analysis endpoint
 */
import { NextRequest, NextResponse } from 'next/server';
import { analyzeResume } from '@/lib/scoring/analyzer';
import { validateResumeText, validateJobDescription, sanitizeText } from '@/lib/utils/validators';
import type { AnalyzeRequest, ApiResponse } from '@/lib/types/api.types';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
    try {
        const body: AnalyzeRequest = await request.json();

        // Validate
        const resumeValidation = validateResumeText(body.resumeText);
        if (!resumeValidation.valid) {
            return NextResponse.json(
                { success: false, error: resumeValidation.error! },
                { status: 400 },
            );
        }

        const jdValidation = validateJobDescription(body.jobDescription);
        if (!jdValidation.valid) {
            return NextResponse.json(
                { success: false, error: jdValidation.error! },
                { status: 400 },
            );
        }

        // Sanitize
        const resumeText = sanitizeText(body.resumeText);
        const jobDescription = sanitizeText(body.jobDescription);

        // Analyze
        const score = analyzeResume(resumeText, jobDescription, body.resumeFileName);

        return NextResponse.json({ success: true, data: score });
    } catch (error) {
        console.error('Analysis error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: String(error) },
            { status: 500 },
        );
    }
}
