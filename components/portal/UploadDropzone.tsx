'use client';

import { useRef, useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatUploadLimit, isAllowedUpload, MAX_UPLOAD_BYTES } from '@/lib/uploadRules';

export function UploadDropzone({
  title,
  description,
  accepted,
  helper,
  accept,
  multiple = false,
  generateUploadUrl,
  onUploaded,
  disabled,
}: {
  title: string;
  description: string;
  accepted: string;
  helper?: string;
  accept?: string;
  multiple?: boolean;
  generateUploadUrl?: () => Promise<string>;
  onUploaded?: (file: { storageId: string; fileName: string; contentType: string; size: number }) => Promise<void> | void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    if (!generateUploadUrl || !onUploaded) {
      toast({ title: 'Upload not configured', description: 'This upload area needs a backend destination before files can be saved.', tone: 'warning' });
      return;
    }
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!isAllowedUpload(file)) {
          toast({ title: 'Unsupported file type', description: 'Only PDF, Word, text, spreadsheet, presentation, JPG, and PNG files are allowed.', tone: 'warning' });
          continue;
        }
        if (file.size > MAX_UPLOAD_BYTES) {
          toast({ title: 'File too large', description: `Uploads are limited to ${formatUploadLimit()} per file.`, tone: 'warning' });
          continue;
        }
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
          body: file,
        });
        if (!result.ok) throw new Error(`Upload failed for ${file.name}`);
        const { storageId } = await result.json();
        await onUploaded({
          storageId,
          fileName: file.name,
          contentType: file.type || 'application/octet-stream',
          size: file.size,
        });
      }
      toast({ title: 'Upload complete', description: 'The selected file has been saved.', tone: 'success' });
    } catch (error) {
      toast({ title: 'Upload failed', description: error instanceof Error ? error.message : 'Try again with a supported document.', tone: 'warning' });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="rounded-2xl border border-dashed border-accent/35 bg-accent/5 p-4 sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-white p-3 text-accent shadow-sm">
            <UploadCloud className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-primary">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="flex flex-wrap gap-3 text-xs font-medium text-primary/80">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1">
                <FileText className="h-3.5 w-3.5" /> {accepted}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1">Max {formatUploadLimit()} per file</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90 md:w-auto"
        >
          {uploading ? <LoadingSpinner label="Uploading..." className="justify-center text-white" /> : 'Choose Files'}
        </button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>
      {helper ? <p className="mt-4 text-xs text-muted-foreground">{helper}</p> : null}
    </div>
  );
}
