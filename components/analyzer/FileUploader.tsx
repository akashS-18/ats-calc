'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { isAllowedFileType, validateFileSize } from '@/lib/utils/validators';
import { toast } from 'sonner';

interface FileUploaderProps {
    onTextExtracted: (text: string, fileName: string) => void;
}

export default function FileUploader({ onTextExtracted }: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFile = useCallback(async (f: File) => {
        if (!isAllowedFileType(f.name)) {
            toast.error('Unsupported file type. Please upload PDF, DOCX, or TXT.');
            return;
        }
        const sizeValidation = validateFileSize(f.size);
        if (!sizeValidation.valid) {
            toast.error(sizeValidation.error!);
            return;
        }

        setFile(f);
        setIsProcessing(true);

        try {
            const ext = f.name.split('.').pop()?.toLowerCase();

            if (ext === 'txt') {
                const text = await f.text();
                onTextExtracted(text, f.name);
            } else if (ext === 'pdf') {
                const arrayBuffer = await f.arrayBuffer();
                const pdfjsLib = await import('pdfjs-dist');
                pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                let text = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    text += content.items.map((item: any) => item.str || '').join(' ') + '\n';
                }
                onTextExtracted(text, f.name);
            } else if (ext === 'docx' || ext === 'doc') {
                const arrayBuffer = await f.arrayBuffer();
                const mammoth = await import('mammoth');
                const result = await mammoth.extractRawText({ arrayBuffer });
                onTextExtracted(result.value, f.name);
            }

            toast.success(`${f.name} processed successfully!`);
        } catch (error) {
            console.error('File processing error:', error);
            toast.error('Failed to process file. Please try pasting text instead.');
            setFile(null);
        } finally {
            setIsProcessing(false);
        }
    }, [onTextExtracted]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFile(droppedFile);
    }, [handleFile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) handleFile(selectedFile);
    };

    return (
        <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${isDragging
                ? 'border-primary bg-primary/5'
                : file
                    ? 'border-success/50 bg-success/5'
                    : 'border-surface-border hover:border-primary/50 hover:bg-surface-light/30'
                }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
        >
            <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleInputChange}
            />

            <AnimatePresence mode="wait">
                {isProcessing ? (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        <p className="text-sm text-muted">Processing file...</p>
                    </motion.div>
                ) : file ? (
                    <motion.div
                        key="file"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                            <FileText size={20} className="text-success" />
                        </div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <button
                            className="text-xs text-muted hover:text-danger transition-colors flex items-center gap-1"
                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        >
                            <X size={12} /> Remove
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-xl bg-surface-light flex items-center justify-center">
                            <Upload size={20} className="text-muted" />
                        </div>
                        <div>
                            <p className="text-sm font-medium mb-1">
                                Drop your resume here or <span className="text-primary">browse</span>
                            </p>
                            <p className="text-xs text-muted">PDF, DOCX, or TXT — Max 5MB</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
