'use client';

import { documents } from '@/lib/portal-data';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { UploadDropzone } from '@/components/portal/UploadDropzone';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { Download, FolderOpenDot, LockKeyhole, Upload } from 'lucide-react';

export default function AdminDocumentsPage() {
  const { toast } = useToast();

  return (
    <div className="space-y-8 pb-12">
      <PortalPageHeader
        eyebrow="Admin Portal"
        title="Document Library"
        description="Upload admissions packets, handbooks, and reporting templates, and control who can access each file."
        actions={<Button variant="outline" onClick={() => toast({ title: 'Folder created', description: 'A new category folder is ready for documents and uploads.', tone: 'success' })}><FolderOpenDot className="mr-2 h-4 w-4" /> New Folder</Button>}
      />

      <UploadDropzone
        title="Upload documents"
        description="This shared admin library supports admissions packets, mentor handbooks, reporting templates, and other operational files."
        accepted="PDF, DOCX, XLSX up to 20MB"
        helper="Every uploaded file can later be linked to an assignment, student profile, or admin notice."
      />

      <div className="rounded-3xl border border-border bg-white shadow-sm">
        <div className="border-b border-border px-6 py-5">
          <h2 className="font-display text-2xl font-bold text-primary">Document Index</h2>
        </div>
        <div className="block space-y-4 p-4 md:hidden">
          {documents.map((document) => (
            <article key={document.id} className="rounded-2xl border border-border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-primary">{document.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-accent">{document.id}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <LockKeyhole className="h-3.5 w-3.5" /> {document.access}
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-surface p-3 text-sm text-muted-foreground">
                  <p className="font-semibold text-primary">Category</p>
                  <p className="mt-1">{document.category}</p>
                </div>
                <div className="rounded-2xl bg-surface p-3 text-sm text-muted-foreground">
                  <p className="font-semibold text-primary">Owner</p>
                  <p className="mt-1">{document.owner}</p>
                </div>
                <div className="rounded-2xl bg-surface p-3 text-sm text-muted-foreground sm:col-span-2">
                  <p className="font-semibold text-primary">Updated</p>
                  <p className="mt-1">{document.updated}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => toast({ title: 'Metadata updated', description: `${document.name} can now be reclassified or relinked.`, tone: 'info' })}>Edit</Button>
                <Button size="sm" variant="outline" onClick={() => toast({ title: 'Download started', description: `${document.name} is downloading.`, tone: 'info' })}><Download className="mr-2 h-4 w-4" /> Download</Button>
              </div>
            </article>
          ))}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-left">
            <thead className="bg-surface">
              <tr className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                <th className="px-6 py-4">Document</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Access</th>
                <th className="px-6 py-4">Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {documents.map((document) => (
                <tr key={document.id}>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-primary">{document.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-accent">{document.id}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{document.category}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{document.owner}</td>
                  <td className="px-6 py-4"><span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"><LockKeyhole className="h-3.5 w-3.5" /> {document.access}</span></td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{document.updated}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => toast({ title: 'Metadata updated', description: `${document.name} can now be reclassified or relinked.`, tone: 'info' })}>Edit</Button>
                      <Button size="sm" variant="outline" onClick={() => toast({ title: 'Download started', description: `${document.name} is downloading.`, tone: 'info' })}><Download className="mr-2 h-4 w-4" /> Download</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EmptyPortalState
        variant="documents"
        title="Ready for new uploads"
        description="Use this empty-state illustration when a category or linked student folder has not yet received any files."
        action={<div className="mt-5"><Button variant="primary" onClick={() => toast({ title: 'Upload queue opened', description: 'Select a folder or student before attaching new files.', tone: 'success' })}><Upload className="mr-2 h-4 w-4" /> Start Upload</Button></div>}
      />
    </div>
  );
}
