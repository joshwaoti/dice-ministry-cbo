'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { UploadDropzone } from '@/components/portal/UploadDropzone';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { Download, FolderOpenDot, LockKeyhole, Upload, Search, ArrowLeft, Folder, FileText, Trash2 } from 'lucide-react';
import { PaginationControls, paginate } from '@/components/portal/PaginationControls';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';
import { Input } from '@/components/ui/input';
import { PortalDialog } from '@/components/portal/PortalDialog';
import { Textarea } from '@/components/ui/textarea';

const PAGE_SIZE = 10;

export default function AdminDocumentsPage() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editDoc, setEditDoc] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [uploadCategory, setUploadCategory] = useState('General');

  const folders = useQuery(api.documents.listDocumentFolders) as any[] | undefined;
  const liveDocuments = useQuery(api.documents.listAdminLibrary, selectedFolder ? { sourcePath: selectedFolder } : {}) as any[] | undefined;
  const createDocument = useMutation(api.documents.createAdminDocument);
  const updateDocument = useMutation(api.documents.updateAdminDocument);
  const removeDocument = useMutation(api.documents.removeAdminDocument);
  const generateUploadUrl = useMutation(api.documents.generateAdminUploadUrl);

  const filteredDocuments = liveDocuments?.filter((doc: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return doc.name.toLowerCase().includes(q) ||
      doc.fileName?.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q);
  }) ?? [];

  const { pageItems, totalPages } = paginate(filteredDocuments, page, PAGE_SIZE);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({ title: 'Folder name required', tone: 'warning' });
      return;
    }
    await createDocument({ name: newFolderName, category: newFolderName, access: 'admin_team', sourcePath: newFolderName });
    setNewFolderName('');
    setShowCreateFolder(false);
    toast({ title: 'Folder created', description: `"${newFolderName}" folder created.`, tone: 'success' });
  };

  const handleSaveEdit = async () => {
    if (!editDoc) return;
    await updateDocument({ documentId: editDoc._id as any, name: editName, category: editCategory });
    setEditDoc(null);
    toast({ title: 'Document updated', tone: 'success' });
  };

  const currentFolderName = selectedFolder
    ? (folders?.find((f: any) => f.sourcePath === selectedFolder)?.name || selectedFolder)
    : 'All Documents';

  return (
    <div className="space-y-8 pb-12">
      <PortalPageHeader
        eyebrow="Admin Portal"
        title="Document Library"
        description="All uploaded files organized by course, application, or category."
        actions={
          <Button variant="outline" onClick={() => setShowCreateFolder(true)}>
            <FolderOpenDot className="mr-2 h-4 w-4" /> New Folder
          </Button>
        }
      />

      <UploadDropzone
        title="Upload documents"
        description="Files will be organized into the selected folder category."
        accepted="PDF, DOCX, XLSX, images up to 20MB"
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.pptx"
        helper={`Uploading to: ${uploadCategory}`}
        generateUploadUrl={generateUploadUrl}
        multiple
        showSuccessToast={false}
        onUploaded={async (file) => {
          await createDocument({
            name: file.fileName,
            category: uploadCategory,
            access: 'admin_team',
            storageId: file.storageId as any,
            fileName: file.fileName,
            contentType: file.contentType,
            size: file.size,
            sourcePath: uploadCategory,
          });
          toast({ title: 'File uploaded', description: `${file.fileName} saved to ${uploadCategory}.`, tone: 'success' });
        }}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <section className="rounded-3xl border border-border bg-white shadow-sm">
          <div className="border-b border-border px-6 py-5">
            <h2 className="font-display text-xl font-bold text-primary">Folders</h2>
          </div>
          <div className="p-4 space-y-1">
            {folders === undefined ? <LoadingPortalState label="Loading folders..." /> : null}
            {folders !== undefined && folders.length === 0 ? (
              <EmptyPortalState variant="documents" title="No folders yet" description="Upload files or create folders to organize documents." />
            ) : null}
            <button
              onClick={() => { setSelectedFolder(null); setUploadCategory('General'); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${!selectedFolder ? 'bg-accent/10 text-accent' : 'text-primary hover:bg-surface'}`}
            >
              <Folder className="h-4 w-4 shrink-0" />
              <span className="text-sm font-medium">All Documents</span>
              <span className="ml-auto text-xs text-muted-foreground">{folders?.reduce((acc: number, f: any) => acc + f.count, 0) ?? 0}</span>
            </button>
            {folders?.map((folder: any) => (
              <button
                key={folder.name}
                onClick={() => { setSelectedFolder(folder.sourcePath || folder.name); setUploadCategory(folder.name); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${selectedFolder === (folder.sourcePath || folder.name) ? 'bg-accent/10 text-accent' : 'text-primary hover:bg-surface'}`}
              >
                <Folder className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium truncate">{folder.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{folder.count}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-3xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              {selectedFolder && (
                <button onClick={() => { setSelectedFolder(null); setUploadCategory('General'); }} className="p-2 rounded-lg hover:bg-surface text-muted-foreground">
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <div className="flex-1">
                <h2 className="font-display text-xl font-bold text-primary">{currentFolderName}</h2>
              </div>
              <div className="relative w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search files..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} className="pl-10" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-white shadow-sm overflow-hidden">
            {liveDocuments === undefined ? <LoadingPortalState label="Loading documents..." /> : null}
            {liveDocuments !== undefined && filteredDocuments.length === 0 ? (
              <div className="p-12">
                <EmptyPortalState
                  variant="documents"
                  title="No documents in this folder"
                  description="Upload files using the dropzone above or create a new folder."
                />
              </div>
            ) : null}
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full text-left">
                <thead className="bg-surface">
                  <tr className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    <th className="px-6 py-4">File</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Access</th>
                    <th className="px-6 py-4">Updated</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pageItems.map((document: any) => (
                    <tr key={document._id} className="hover:bg-surface/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-accent shrink-0" />
                          <div>
                            <p className="font-semibold text-primary truncate max-w-[200px]">{document.fileName || document.name}</p>
                            <p className="text-xs text-muted-foreground">{document.size ? `${(document.size / 1024).toFixed(1)} KB` : 'No file'}{document.sourceTable && document.sourceTable !== 'adminDocuments' ? ` - ${document.sourceTable}` : ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{document.category}</td>
                      <td className="px-6 py-4"><span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"><LockKeyhole className="h-3.5 w-3.5" /> {document.access?.replaceAll('_', ' ')}</span></td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(document.updatedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {document.sourceTable === 'adminDocuments' ? (
                            <Button size="sm" variant="outline" onClick={() => { setEditDoc(document); setEditName(document.name); setEditCategory(document.category); }}>Edit</Button>
                          ) : null}
                          <DocumentDownloadButton storageId={document.storageId} />
                          {document.sourceTable === 'adminDocuments' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                await removeDocument({ documentId: document._id as any });
                                toast({ title: 'Document removed', description: `${document.name} was removed.`, tone: 'warning' });
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="block space-y-4 p-4 md:hidden">
              {pageItems.map((document: any) => (
                <article key={document._id} className="rounded-2xl border border-border p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-accent shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-primary truncate">{document.fileName || document.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{document.category}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {document.sourceTable === 'adminDocuments' ? (
                      <Button size="sm" variant="outline" onClick={() => { setEditDoc(document); setEditName(document.name); setEditCategory(document.category); }}>Edit</Button>
                    ) : null}
                    <DocumentDownloadButton storageId={document.storageId} />
                    {document.sourceTable === 'adminDocuments' ? (
                      <Button size="sm" variant="outline" onClick={async () => { await removeDocument({ documentId: document._id as any }); toast({ title: 'Removed', tone: 'warning' }); }}>Delete</Button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
            <PaginationControls page={page} totalPages={totalPages} totalItems={filteredDocuments.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </div>
        </section>
      </div>

      <PortalDialog
        open={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        title="Create Folder"
        description="Create a new folder to organize uploaded documents."
      >
        <div className="space-y-4">
          <Input placeholder="Folder name (e.g., Course: Discipleship 101)" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCreateFolder(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateFolder}>Create</Button>
          </div>
        </div>
      </PortalDialog>

      <PortalDialog
        open={!!editDoc}
        onClose={() => setEditDoc(null)}
        title="Edit Document"
        description="Update the document metadata."
      >
        <div className="space-y-4">
          <Input placeholder="Document name" value={editName} onChange={(e) => setEditName(e.target.value)} />
          <Textarea placeholder="Category / folder" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditDoc(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveEdit}>Save</Button>
          </div>
        </div>
      </PortalDialog>
    </div>
  );
}

function DocumentDownloadButton({ storageId }: { storageId?: string }) {
  const url = useQuery(api.documents.getUrl, storageId ? { storageId: storageId as any } : 'skip') as string | null | undefined;
  return (
    <Button
      size="sm"
      variant="outline"
      disabled={!url}
      onClick={() => {
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
      }}
    >
      <Download className="mr-2 h-4 w-4" /> Download
    </Button>
  );
}
