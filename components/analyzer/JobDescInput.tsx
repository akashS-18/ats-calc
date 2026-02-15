'use client';

import { Briefcase } from 'lucide-react';

interface JobDescInputProps {
    value: string;
    onChange: (text: string) => void;
}

export default function JobDescInput({ value, onChange }: JobDescInputProps) {
    return (
        <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Briefcase size={20} className="text-accent" />
                Job Description
            </h2>

            <textarea
                className="w-full h-64 bg-surface-light border border-surface-border rounded-xl p-4 text-sm text-foreground placeholder:text-muted/60 resize-none focus:outline-none focus:border-accent transition-colors font-mono"
                placeholder="Paste the job description here...&#10;&#10;Senior Software Engineer&#10;&#10;Requirements:&#10;• 5+ years experience with React, TypeScript&#10;• Strong understanding of system design&#10;• Experience with cloud platforms (AWS/GCP)&#10;&#10;Nice to have:&#10;• Experience with Kubernetes&#10;• Open source contributions"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />

            <div className="mt-2 text-xs text-muted text-right">
                {value.trim().split(/\s+/).filter(Boolean).length} words
            </div>
        </div>
    );
}
