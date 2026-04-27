import { UploadCloud, FileText, ShieldCheck } from 'lucide-react';

export function UploadDropzone({
  title,
  description,
  accepted,
  helper,
}: {
  title: string;
  description: string;
  accepted: string;
  helper?: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-accent/35 bg-accent/5 p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
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
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Virus scanned on upload
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90"
        >
          Choose Files
        </button>
      </div>
      {helper ? <p className="mt-4 text-xs text-muted-foreground">{helper}</p> : null}
    </div>
  );
}
