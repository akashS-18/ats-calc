'use client';

import type { FormattingIssue as FI } from '@/lib/types/analysis.types';
import { AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface FormattingIssuesProps {
    issues: FI[];
}

const iconMap = {
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const colorMap = {
    error: 'text-danger',
    warning: 'text-warning',
    info: 'text-accent',
};

const bgMap = {
    error: 'bg-danger/5 border-danger/10',
    warning: 'bg-warning/5 border-warning/10',
    info: 'bg-accent/5 border-accent/10',
};

export default function FormattingIssues({ issues }: FormattingIssuesProps) {
    if (issues.length === 0) return null;

    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Formatting Issues</h3>
            <div className="space-y-3">
                {issues.map((issue, i) => {
                    const Icon = iconMap[issue.severity];
                    return (
                        <div
                            key={i}
                            className={`flex items-start gap-3 p-3 rounded-lg border ${bgMap[issue.severity]}`}
                        >
                            <Icon size={16} className={`${colorMap[issue.severity]} mt-0.5 shrink-0`} />
                            <div>
                                <p className="text-sm font-medium">{issue.message}</p>
                                <p className="text-xs text-muted mt-1">{issue.suggestion}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
