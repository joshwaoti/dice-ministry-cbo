'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpenCheck, Layers3, PencilLine, PlusCircle, Sparkles, Upload, Search, Trash2 } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { PortalDialog } from '@/components/portal/PortalDialog';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';
import { UploadDropzone } from '@/components/portal/UploadDropzone';
import { StatusPill } from '@/components/portal/StatusPill';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { PaginationControls, paginate } from '@/components/portal/PaginationControls';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';

const PAGE_SIZE = 6;

export default function AdminCoursesPage() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ storageId: string; fileName: string; contentType: string; size: number }>>([]);
  const { toast } = useToast();
  const liveCourses = useQuery(api.courses.listAdmin) as any[] | undefined;
  const searchResults = useQuery(api.courses.searchCourses, searchQuery.length >= 2 ? { query: searchQuery } : 'skip') as any[] | undefined;
  const createCourse = useMutation(api.courses.create);
  const createCourseWithFiles = useMutation(api.courses.createCourseWithDocuments);
  const duplicateCourse = useMutation(api.courses.duplicate);
  const deleteCourse = useMutation(api.courses.deleteCourse);
  const archiveCourse = useMutation(api.courses.archive);
  const generateUploadUrl = useMutation(api.documents.generateAdminUploadUrl);
  const createAdminDocument = useMutation(api.documents.createAdminDocument);

  const displayCourses = searchQuery.length >= 2 && searchResults !== undefined
    ? searchResults.map((course: any) => ({
        id: course._id,
        title: course.title,
        status: course.status === 'published' ? 'Published' : course.status === 'archived' ? 'Archived' : 'Draft',
        modules: course.moduleCount ?? 0,
        units: course.unitCount ?? 0,
        type: course.synopsis || 'Text + documents',
        students: course.studentCount ?? 0,
        updated: new Date(course.updatedAt).toLocaleDateString(),
        isLive: true,
      }))
    : liveCourses?.map((course: any) => ({
        id: course._id,
        title: course.title,
        status: course.status === 'published' ? 'Published' : course.status === 'archived' ? 'Archived' : 'Draft',
        modules: course.moduleCount ?? 0,
        units: course.unitCount ?? 0,
        type: course.synopsis || 'Text + documents',
        students: course.studentCount ?? 0,
        updated: new Date(course.updatedAt).toLocaleDateString(),
        isLive: true,
      })) ?? [];

  const { pageItems, totalPages } = paginate(displayCourses, page, PAGE_SIZE);

  const handleCreate = async () => {
    if (!title.trim()) {
      toast({ title: 'Course title required', description: 'Add a course title before creating the draft.', tone: 'warning' });
      return;
    }
    if (uploadedFiles.length > 0) {
      await createCourseWithFiles({
        title,
        synopsis: synopsis || 'Course overview pending.',
        storageIds: uploadedFiles.map((f) => f.storageId) as any,
        fileNames: uploadedFiles.map((f) => f.fileName),
        contentTypes: uploadedFiles.map((f) => f.contentType),
        sizes: uploadedFiles.map((f) => f.size),
      });
      toast({ title: 'Course created with files', description: `${uploadedFiles.length} file(s) attached to the course document library.`, tone: 'success' });
    } else {
      await createCourse({ title, synopsis: synopsis || 'Course overview pending.' });
      toast({ title: 'Draft course created', description: 'The team can now add modules, units, and publishing rules.', tone: 'success' });
    }
    setTitle('');
    setSynopsis('');
    setUploadedFiles([]);
    setOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <PortalPageHeader
        eyebrow="Admin Portal"
        title="Course Management"
        description="Create structured courses, manage modules and units, and keep publishing quality aligned with the PRD."
        actions={
          <>
            <Button variant="primary" onClick={() => setOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Course
            </Button>
          </>
        }
      />

      <div className="rounded-3xl border border-border bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses by title, slug, or description..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="pl-10"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
              Clear
            </button>
          )}
        </div>
        {searchQuery.length >= 2 && searchResults !== undefined && (
          <p className="mt-2 text-xs text-muted-foreground">{searchResults.length} result(s) for &quot;{searchQuery}&quot;</p>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="grid gap-6 md:grid-cols-2">
          {liveCourses === undefined && searchQuery.length < 2 ? <LoadingPortalState label="Loading courses..." /> : null}
          {liveCourses !== undefined && displayCourses.length === 0 ? (
            <EmptyPortalState
              variant="learning"
              title="No courses yet"
              description="Create the first course shell, then add text units, assignment units, and downloadable documents."
              action={<div className="mt-5"><Button variant="primary" onClick={() => setOpen(true)}><PlusCircle className="mr-2 h-4 w-4" /> Create Course</Button></div>}
            />
          ) : null}
          {pageItems.map((course) => (
            <article key={course.id} className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{course.type}</p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-primary">{course.title}</h2>
                </div>
                <StatusPill label={course.status} tone={course.status === 'Published' ? 'success' : 'warning'} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-2xl bg-surface p-4">
                  <p className="text-muted-foreground">Modules</p>
                  <p className="mt-2 font-bold text-primary">{course.modules}</p>
                </div>
                <div className="rounded-2xl bg-surface p-4">
                  <p className="text-muted-foreground">Units</p>
                  <p className="mt-2 font-bold text-primary">{course.units}</p>
                </div>
                <div className="rounded-2xl bg-surface p-4">
                  <p className="text-muted-foreground">Students</p>
                  <p className="mt-2 font-bold text-primary">{course.students}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/admin/courses/${course.id}`}>
                    <PencilLine className="mr-2 h-4 w-4" /> Edit Course
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await duplicateCourse({ courseId: course.id as any });
                    toast({ title: `${course.title} duplicated`, description: 'A draft copy was created with all modules and unit settings.', tone: 'success' });
                  }}
                >
                  <Layers3 className="mr-2 h-4 w-4" /> Duplicate
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await deleteCourse({ courseId: course.id as any });
                    toast({ title: `${course.title} deleted`, description: 'The course and all its modules, units, and data were permanently removed.', tone: 'warning' });
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">Updated {course.updated}</p>
            </article>
          ))}
          <div className="md:col-span-2">
            <PaginationControls page={page} totalPages={totalPages} totalItems={displayCourses.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-accent/10 p-3 text-accent">
                <BookOpenCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-primary">Publishing Checklist</h3>
                <p className="text-sm text-muted-foreground">Based on the supplement PRD requirements.</p>
              </div>
            </div>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li className="rounded-2xl border border-border px-4 py-3">At least 1 module exists in every course.</li>
              <li className="rounded-2xl border border-border px-4 py-3">Every module contains at least 1 unit.</li>
              <li className="rounded-2xl border border-border px-4 py-3">All units have text, assignment settings, or attached learning docs.</li>
              <li className="rounded-2xl border border-border px-4 py-3">Accepted file types and size limits are defined for assignment units.</li>
            </ul>
          </section>

          <EmptyPortalState
            variant="learning"
            title="Archive and Draft Library"
            description="Use this secondary area for empty collections such as archived courses, unassigned modules, or draft teaching blocks waiting to be connected."
          />
        </aside>
      </div>

      <PortalDialog
        open={open}
        onClose={() => { setOpen(false); setUploadedFiles([]); }}
        title="Create Course"
        description="Build the course shell before adding modules and units. Optionally attach teaching documents."
        size="lg"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Input placeholder="Course title" value={title} onChange={(event) => setTitle(event.target.value)} />
            <Textarea className="min-h-32" placeholder="Course overview, goals, and what learners should expect by completion." value={synopsis} onChange={(event) => setSynopsis(event.target.value)} />
            {uploadedFiles.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-sm font-semibold text-primary mb-2">Attached files ({uploadedFiles.length})</p>
                <ul className="space-y-1">
                  {uploadedFiles.map((f, i) => (
                    <li key={i} className="text-xs text-muted-foreground truncate">{f.fileName}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <UploadDropzone
              title="Seed with teaching documents"
              description="Attach an outline, handbook, or lesson notes. Files will be saved in the course document folder."
              accepted="PDF, DOCX, TXT"
              accept=".pdf,.doc,.docx,.txt"
              multiple
              generateUploadUrl={generateUploadUrl}
              onUploaded={async (file) => {
                setUploadedFiles((prev) => [...prev, file]);
              }}
            />
            <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted-foreground">
              Each draft course starts with module and unit placeholders, autosave support, and assignment restriction controls.
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setOpen(false); setUploadedFiles([]); }}>Cancel</Button>
              <Button variant="primary" onClick={handleCreate}>
                <Sparkles className="mr-2 h-4 w-4" /> Create Draft
              </Button>
            </div>
          </div>
        </div>
      </PortalDialog>
    </div>
  );
}
