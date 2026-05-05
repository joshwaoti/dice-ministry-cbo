'use client';

import { use, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { BookOpenCheck, ClipboardCheck, FileUp, ListTree, Plus, Save, Send } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/portal/StatusPill';
import { UploadDropzone } from '@/components/portal/UploadDropzone';
import { useToast } from '@/components/ui/toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';

function canQueryConvexId(id: string) {
  return id.length > 20 && !id.includes('-');
}

export default function CourseEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const liveCourse = useQuery(api.courses.getAdminCourse, canQueryConvexId(id) ? { courseId: id as any } : 'skip') as any | undefined;
  const createModule = useMutation(api.courses.createModule);
  const saveUnit = useMutation(api.courses.saveUnit);
  const publishCourse = useMutation(api.courses.publish);
  const updateCourse = useMutation(api.courses.update);
  const generateUploadUrl = useMutation(api.documents.generateAdminUploadUrl);
  const addUnitResource = useMutation(api.courses.addUnitResource);
  const [moduleTitle, setModuleTitle] = useState('');
  const [unitTitle, setUnitTitle] = useState('');
  const [unitBody, setUnitBody] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const { toast } = useToast();

  if (!canQueryConvexId(id)) {
    return <EmptyPortalState variant="learning" title="Live course not found" description="Only Convex-backed courses can be edited in the admin course builder." />;
  }
  if (liveCourse === undefined) {
    return <LoadingPortalState label="Loading course editor..." />;
  }
  if (liveCourse === null) {
    return <EmptyPortalState variant="learning" title="Course not found" description="Create a course in Convex before opening the course builder." />;
  }

  const modules = liveCourse?.modules?.map((module: any) => ({
    id: module._id,
    title: module.title,
    status: module.units?.length ? 'In progress' : 'Draft',
    units: module.units.map((unit: any) => ({
      id: unit._id,
      title: unit.title,
      type: unit.type === 'assignment' ? 'Assignment' : 'Text',
      duration: unit.estimatedMinutes ? `${unit.estimatedMinutes} min` : 'Self-paced',
      richText: unit.richText,
      order: unit.order,
    })),
  })) ?? [];

  const course = liveCourse
    ? { id: liveCourse._id, title: liveCourse.title, synopsis: liveCourse.synopsis, status: liveCourse.status, modules }
    : { id, title: 'Course unavailable', synopsis: 'Create or open a Convex-backed course to edit live content.', status: 'missing', modules };
  const targetModuleId = selectedModuleId ?? modules[0]?.id;
  const targetUnitId = selectedUnitId ?? modules[0]?.units?.[0]?.id;

  const handleAddModule = async () => {
    if (!moduleTitle.trim()) {
      toast({ title: 'Module title required', description: 'Name the module before adding it.', tone: 'warning' });
      return;
    }
    const moduleId = await createModule({ courseId: id as any, title: moduleTitle });
    setSelectedModuleId(moduleId as string);
    setModuleTitle('');
    toast({ title: 'Module added', description: 'The module was saved to the course outline.', tone: 'success' });
  };

  const handleSaveUnit = async () => {
    if (!targetModuleId) {
      toast({ title: 'Module required', description: 'Add or select a live module before saving a unit.', tone: 'warning' });
      return;
    }
    if (!unitTitle.trim()) {
      toast({ title: 'Unit title required', description: 'Name the unit before saving it.', tone: 'warning' });
      return;
    }
    const unitId = await saveUnit({
      courseId: id as any,
      moduleId: targetModuleId as any,
      unitId: targetUnitId && selectedUnitId ? (targetUnitId as any) : undefined,
      title: unitTitle,
      type: 'text',
      richText: unitBody || 'Lesson content pending.',
      estimatedMinutes: 20,
      order: modules.find((module: any) => module.id === targetModuleId)?.units.length ?? 0,
    });
    setSelectedUnitId(unitId as string);
    toast({ title: 'Unit saved', description: 'The text lesson draft was saved to Convex.', tone: 'success' });
  };

  const handlePublish = async () => {
    await publishCourse({ courseId: id as any });
    toast({ title: 'Course published', description: 'Students enrolled in this course can now see the published content.', tone: 'success' });
  };

  return (
    <div className="space-y-8 pb-10">
      <PortalPageHeader
        eyebrow="Course Builder"
        title={course.title}
        description={course.synopsis}
        actions={(
          <>
            <Button variant="outline" onClick={async () => {
              if (canQueryConvexId(id)) await updateCourse({ courseId: id as any, title: course.title, synopsis: course.synopsis });
              toast({ title: 'Draft saved', description: `${course.title} was saved to the editorial queue.`, tone: 'success' });
            }}>
              <Save className="mr-2 h-4 w-4" /> Save Draft
            </Button>
            <Button variant="primary" onClick={handlePublish}>
              <Send className="mr-2 h-4 w-4" /> Publish Course
            </Button>
          </>
        )}
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="space-y-6 rounded-[24px] border border-border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-primary">Module Outline</h2>
              <p className="mt-1 text-sm text-muted-foreground">Create document-based modules and text or assignment units.</p>
            </div>
            <div className="flex gap-2">
              <Input placeholder="New module title" value={moduleTitle} onChange={(event) => setModuleTitle(event.target.value)} />
              <Button variant="outline" onClick={handleAddModule}><Plus className="mr-2 h-4 w-4" /> Add</Button>
            </div>
          </div>

          {modules.length === 0 ? <EmptyPortalState variant="learning" title="No modules yet" description="Add a module, then create text or assignment units inside it." /> : null}
          <div className="space-y-4">
            {modules.map((module: any, index: number) => (
              <div key={module.id} className="rounded-[22px] border border-border bg-slate-50/70 p-5">
                <button type="button" className="w-full text-left" onClick={() => setSelectedModuleId(module.id)}>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Module {index + 1}</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <h3 className="font-display text-xl font-bold text-primary">{module.title}</h3>
                    <StatusPill label={module.status} tone={module.status === 'Draft' ? 'warning' : 'info'} />
                  </div>
                </button>
                <div className="mt-4 grid gap-3">
                  {module.units.map((unit: any, unitIndex: number) => (
                    <button
                      key={unit.id}
                      type="button"
                      onClick={() => {
                        setSelectedModuleId(module.id);
                        setSelectedUnitId(unit.id);
                        setUnitTitle(unit.title);
                        setUnitBody(unit.richText ?? '');
                      }}
                      className="grid gap-3 rounded-2xl border border-white bg-white p-4 text-left md:grid-cols-[1.1fr_0.8fr_0.7fr_auto] md:items-center"
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/60">Unit {unitIndex + 1}</p>
                        <h4 className="mt-1 font-semibold text-primary">{unit.title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">{unit.type} - {unit.duration}</p>
                      </div>
                      <div className="rounded-xl bg-surface p-3 text-sm text-primary">Text lesson body and reflection prompts.</div>
                      <div className="rounded-xl bg-accent/5 p-3 text-sm text-primary">Document resources and downloads.</div>
                      <span className="inline-flex items-center text-sm font-semibold text-accent"><BookOpenCheck className="mr-2 h-4 w-4" /> Edit</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-border bg-surface p-5">
            <h3 className="font-display text-xl font-bold text-primary">Unit Draft</h3>
            <div className="mt-4 grid gap-4">
              <Input placeholder="Unit title" value={unitTitle} onChange={(event) => setUnitTitle(event.target.value)} />
              <Textarea className="min-h-36" placeholder="Lesson text, scripture prompts, instructions, or assignment context." value={unitBody} onChange={(event) => setUnitBody(event.target.value)} />
              <Button variant="primary" onClick={handleSaveUnit}><Save className="mr-2 h-4 w-4" /> Save Unit</Button>
            </div>
          </div>

          <UploadDropzone
            title="Unit documents and teaching assets"
            description="Upload curriculum files, student worksheets, lesson guides, and assignment attachments."
            accepted="PDF, DOCX, TXT, JPG, PNG"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            helper="Resources are attached to the selected unit."
            disabled={!canQueryConvexId(id) || !targetUnitId}
            generateUploadUrl={generateUploadUrl}
            onUploaded={async (file) => {
              if (!targetUnitId) return;
              await addUnitResource({
                unitId: targetUnitId as any,
                storageId: file.storageId as any,
                fileName: file.fileName,
                contentType: file.contentType,
                size: file.size,
                resourceType: file.contentType === 'application/pdf' ? 'inline_pdf' : file.contentType.startsWith('image/') ? 'image' : 'download',
              });
            }}
          />
        </section>

        <section className="space-y-6">
          <div className="rounded-[24px] border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-accent/10 p-3 text-accent"><ListTree className="h-5 w-5" /></div>
              <div>
                <h2 className="font-display text-xl font-bold text-primary">Publish Checklist</h2>
                <p className="text-sm text-muted-foreground">Publishing runs the backend validations before changing status.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {[
                ['Modules', modules.length > 0],
                ['Units', modules.some((module: any) => module.units.length > 0)],
                ['Text content', modules.some((module: any) => module.units.some((unit: any) => unit.richText))],
              ].map(([label, ready]) => (
                <div key={label as string} className="flex items-start gap-3 rounded-2xl border border-border p-4">
                  <input type="checkbox" checked={Boolean(ready)} readOnly className="mt-1 h-4 w-4 rounded border-border accent-[#F6AC55]" />
                  <div>
                    <p className="font-medium text-primary">{label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{ready ? 'Ready' : 'Needed before publishing'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gold/15 p-3 text-gold"><ClipboardCheck className="h-5 w-5" /></div>
              <div>
                <h2 className="font-display text-xl font-bold text-primary">Assignment Settings</h2>
                <p className="text-sm text-muted-foreground">Assignment units are document-only and use the backend submission rules.</p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-surface p-4">
                <p className="font-medium text-primary">File restrictions</p>
                <p className="mt-1 text-sm text-muted-foreground">Accepted: PDF, DOC, DOCX, TXT. Video and audio uploads are blocked.</p>
              </div>
              <Button variant="outline" onClick={() => toast({ title: 'Use assignment unit', description: 'Create an assignment unit, then students can submit documents from their assignment page.', tone: 'info' })}>
                <FileUp className="mr-2 h-4 w-4" /> Assignment Help
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
