'use client';

import { useState } from 'react';
import { FileText, Keyboard } from 'lucide-react';
import FileUploader from './FileUploader';

interface ResumeInputProps {
    value: string;
    onChange: (text: string) => void;
    onFileNameChange: (name: string) => void;
}

export default function ResumeInput({ value, onChange, onFileNameChange }: ResumeInputProps) {
    const [mode, setMode] = useState<'paste' | 'upload'>('paste');

    return (
        <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText size={20} className="text-primary-light" />
                Resume
            </h2>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-lg bg-surface-light mb-4">
                <button
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${mode === 'paste'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-muted hover:text-foreground'
                        }`}
                    onClick={() => setMode('paste')}
                >
                    <Keyboard size={14} />
                    Paste Text
                </button>
                <button
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${mode === 'upload'
                            ? 'bg-primary text-white shadow-md'
                            : 'text-muted hover:text-foreground'
                        }`}
                    onClick={() => setMode('upload')}
                >
                    <FileText size={14} />
                    Upload File
                </button>
            </div>

            {/* Content */}
            {mode === 'paste' ? (
                <textarea
                    className="w-full h-64 bg-surface-light border border-surface-border rounded-xl p-4 text-sm text-foreground placeholder:text-muted/60 resize-none focus:outline-none focus:border-primary transition-colors font-mono"
                    placeholder="Paste your resume text here...&#10;&#10;John Doe&#10;john@example.com | (555) 123-4567&#10;&#10;EXPERIENCE&#10;Software Engineer at Google&#10;• Built scalable microservices..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <FileUploader
                    onTextExtracted={(text, name) => {
                        onChange(text);
                        onFileNameChange(name);
                        setMode('paste'); // switch to paste to show extracted text
                    }}
                />
            )}

            {/* Word count */}
            <div className="mt-2 text-xs text-muted text-right">
                {value.trim().split(/\s+/).filter(Boolean).length} words
            </div>
        </div>
    );
}
