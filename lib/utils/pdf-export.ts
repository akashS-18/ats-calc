/**
 * PDF report generation using jsPDF.
 */
import type { ATSScore } from '../types/analysis.types';

export async function generatePdfReport(score: ATSScore): Promise<void> {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const margin = 20;
    let y = margin;

    const addLine = (text: string, fontSize = 11, bold = false) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        const lines = doc.splitTextToSize(text, 170);
        if (y + lines.length * (fontSize * 0.5) > 280) {
            doc.addPage();
            y = margin;
        }
        doc.text(lines, margin, y);
        y += lines.length * (fontSize * 0.5) + 4;
    };

    // Title
    addLine('ATS Resume Score Report', 20, true);
    y += 4;

    // Overall score
    addLine(`Overall Score: ${score.overall}/100 — ${score.band.toUpperCase()}`, 16, true);
    y += 4;

    // Section scores
    addLine('Section Breakdown', 14, true);
    addLine(`Keyword Relevance: ${score.sections.keywordRelevance}/30`);
    addLine(`Required Skills: ${score.sections.requiredSkills}/30`);
    addLine(`Title Alignment: ${score.sections.titleAlignment}/10`);
    addLine(`Text Similarity: ${score.sections.textSimilarity}/15`);
    addLine(`Formatting: ${score.sections.formatting}/10`);
    addLine(`Bonus: ${score.sections.bonus}/5`);
    y += 4;

    // Matched keywords
    if (score.matchedKeywords.length > 0) {
        addLine('Matched Keywords', 14, true);
        addLine(score.matchedKeywords.map(k => k.keyword).join(', '));
        y += 4;
    }

    // Missing keywords
    if (score.missingKeywords.length > 0) {
        addLine('Missing Keywords', 14, true);
        addLine(score.missingKeywords.map(k => `${k.keyword} (${k.source})`).join(', '));
        y += 4;
    }

    // Suggestions
    if (score.suggestions.length > 0) {
        addLine('Top Suggestions', 14, true);
        score.suggestions.forEach((s, i) => {
            addLine(`${i + 1}. ${s.title}: ${s.description}`);
        });
    }

    // Penalties
    if (score.penalties.length > 0) {
        y += 4;
        addLine('Penalties Applied', 14, true);
        score.penalties.forEach(p => {
            addLine(`• ${p.name} (-${p.points}pts): ${p.reason}`);
        });
    }

    // Footer
    y += 8;
    addLine(`Generated: ${new Date().toLocaleString()}`, 9);
    addLine('Powered by ATS Resume Score Calculator', 9);

    doc.save(`ats-report-${score.overall}.pdf`);
}
