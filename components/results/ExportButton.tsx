'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import type { ATSScore } from '@/lib/types/analysis.types';
import { generatePdfReport } from '@/lib/utils/pdf-export';
import { toast } from 'sonner';

interface ExportButtonProps {
    score: ATSScore;
}

export default function ExportButton({ score }: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await generatePdfReport(score);
            toast.success('PDF report downloaded!');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export PDF.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            className="btn-ghost text-sm py-2 px-5"
            onClick={handleExport}
            disabled={isExporting}
        >
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {isExporting ? 'Exporting...' : 'Download PDF Report'}
        </button>
    );
}
