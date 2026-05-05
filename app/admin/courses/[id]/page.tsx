'use client';

import { use, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { BookOpenCheck, ClipboardCheck, FileUp, ListTree, Plus, Save, Send, Trash2, Edit2, X, ChevronDown, ChevronRight } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/portal/StatusPill';
import { UploadDropzone } from '@/components/portal/UploadDropzone';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { useToast } from '@/components/ui/toast';
import { Input } from '@/components/ui/input';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';
import { PortalDialog } from '@/components/portal/PortalDialog';

function canQueryConvexId(id: string) {
  return id.length > 20 && !id.includes('-');
}

export default function CourseEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const liveCourse = useQuery(api.courses.getAdminCourse, canQueryConvexId(id) ? { courseId: id as any } : 'skip') as any | undefined;
  const createModule = useMutation(api.courses.createModule);
  const updateModule = useMutation(api.courses.updateModule);
  const deleteModule = useMutation(api.courses.deleteModule);
  const saveUnit = useMutation(api.courses.saveUnit);
  const deleteUnit = useMutation(api.courses.deleteUnit);
  const publishCourse = useMutation(api.courses.publish);
  const updateCourse = useMutation(api.courses.update);
  const generateUploadUrl = useMutation(api.documents.generateAdminUploadUrl);
  const addUnitResource = useMutation(api.courses.addUnitResource);
  const { toast } = useToast();

  const [moduleTitle, setModuleTitle] = useState('');
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingModuleTitle, setEditingModuleTitle] = useState('');
  const [unitTitle, setUnitTitle] = useState('');
  const [unitBody, setUnitBody] = useState('');
  const [unitType, setUnitType] = useState<'text' | 'assignment'>('text');
  const [unitEstimatedMin, setUnitEstimatedMin] = useState(30);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [isEditingUnit, setIsEditingUnit] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [showPublishDialog, setShowPublishDialog] = useState(false);

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
    description: module.description,
    order: module.order,
    status: module.units?.length ? 'In progress' : 'Draft',
    units: module.units.map((unit: any) => ({
      id: unit._id,
      title: unit.title,
      type: unit.type,
      duration: unit.estimatedMinutes ? `${unit.estimatedMinutes} min` : 'Self-paced',
      richText: unit.richText,
      order: unit.order,
    })),
  })) ?? [];

  const targetModuleId = selectedModuleId ?? modules[0]?.id;
  const targetUnitId = selectedUnitId ?? modules.find((m: any) => m.id === targetModuleId)?.units?.[0]?.id;
  const courseTitle = liveCourse.title;
  const courseSynopsis = liveCourse.synopsis;

  const handleAddModule = async () => {
    if (!moduleTitle.trim()) {
      toast({ title: 'Module title required', description: 'Name the module before adding it.', tone: 'warning' });
      return;
    }
    await createModule({ courseId: id as any, title: moduleTitle });
    setModuleTitle('');
    toast({ title: 'Module added', description: 'The module was saved to the course outline.', tone: 'success' });
  };

  const handleUpdateModule = async (moduleId: string) => {
    if (!editingModuleTitle.trim()) return;
    await updateModule({ moduleId: moduleId as any, title: editingModuleTitle });
    setEditingModuleId(null);
    setEditingModuleTitle('');
    toast({ title: 'Module updated', tone: 'success' });
  };

  const handleDeleteModule = async (moduleId: string) => {
    await deleteModule({ moduleId: moduleId as any });
    if (selectedModuleId === moduleId) {
      setSelectedModuleId(null);
      setSelectedUnitId(null);
    }
    toast({ title: 'Module deleted', tone: 'warning' });
  };

  const handleSelectUnit = (module: any, unit: any) => {
    setSelectedModuleId(module.id);
    setSelectedUnitId(unit.id);
    setUnitTitle(unit.title);
    setUnitBody(unit.richText ?? '');
    setUnitType(unit.type);
    setUnitEstimatedMin(unit.duration !== 'Self-paced' ? parseInt(unit.duration) : 30);
    setIsEditingUnit(true);
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
    const existingUnit = modules.find((m: any) => m.id === targetModuleId)?.units.find((u: any) => u.id === selectedUnitId);
    const unitId = await saveUnit({
      courseId: id as any,
      moduleId: targetModuleId as any,
      unitId: selectedUnitId && isEditingUnit ? (selectedUnitId as any) : undefined,
      title: unitTitle,
      type: unitType,
      richText: unitBody,
      estimatedMinutes: unitEstimatedMin,
      order: existingUnit?.order ?? (modules.find((m: any) => m.id === targetModuleId)?.units.length ?? 0),
    });
    if (!isEditingUnit) {
      setSelectedUnitId(unitId as string);
    }
    setIsEditingUnit(false);
    toast({ title: 'Unit saved', description: 'The lesson draft was saved to Convex.', tone: 'success' });
  };

  const handleDeleteUnit = async (unitId: string) => {
    await deleteUnit({ unitId: unitId as any });
    if (selectedUnitId === unitId) {
      setSelectedUnitId(null);
      setIsEditingUnit(false);
    }
    toast({ title: 'Unit deleted', tone: 'warning' });
  };

  const handleNewUnit = () => {
    if (!targetModuleId) {
      toast({ title: 'Select a module first', description: 'Click on a module to select it before creating a unit.', tone: 'warning' });
      return;
    }
    setUnitTitle('');
    setUnitBody('');
    setUnitType('text');
    setUnitEstimatedMin(30);
    setSelectedUnitId(null);
    setIsEditingUnit(true);
  };

  const handlePublish = async () => {
    await publishCourse({ courseId: id as any });
    setShowPublishDialog(false);
    toast({ title: 'Course published', description: 'Students enrolled in this course can now see the published content.', tone: 'success' });
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  return (
    <div className="space-y-8 pb-10">
      <PortalPageHeader
        eyebrow="Course Builder"
        title={courseTitle}
        description={courseSynopsis}
        actions={(
          <>
            <Button variant="outline" onClick={async () => {
              await updateCourse({ courseId: id as any, title: courseTitle, synopsis: courseSynopsis });
              toast({ title: 'Draft saved', description: `${courseTitle} was saved.`, tone: 'success' });
            }}>
              <Save className="mr-2 h-4 w-4" /> Save Draft
            </Button>
            <Button variant="primary" onClick={() => setShowPublishDialog(true)}>
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
              <p className="mt-1 text-sm text-muted-foreground">Create modules and add text or assignment units inside them.</p>
            </div>
            <div className="flex gap-2">
              <Input placeholder="New module title" value={moduleTitle} onChange={(event) => setModuleTitle(event.target.value)} className="w-56" />
              <Button variant="outline" onClick={handleAddModule}><Plus className="mr-2 h-4 w-4" /> Add</Button>
            </div>
          </div>

          {modules.length === 0 ? <EmptyPortalState variant="learning" title="No modules yet" description="Add a module, then create text or assignment units inside it." /> : null}
          <div className="space-y-4">
            {modules.map((module: any, index: number) => {
              const isExpanded = expandedModules.has(module.id);
              const isEditing = editingModuleId === module.id;
              const isSelected = selectedModuleId === module.id;
              return (
                <div key={module.id} className={`rounded-[22px] border bg-slate-50/70 p-5 transition-colors ${isSelected ? 'border-accent' : 'border-border'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <button type="button" className="flex-1 text-left" onClick={() => { toggleModule(module.id); setSelectedModuleId(module.id); }}>
                      <div className="flex items-center gap-2">
                        {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Module {index + 1}</p>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-3">
                        <h3 className="font-display text-xl font-bold text-primary">{module.title}</h3>
                        <StatusPill label={module.status} tone={module.status === 'Draft' ? 'warning' : 'info'} />
                      </div>
                    </button>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingModuleId(module.id); setEditingModuleTitle(module.title); }} className="p-2 rounded-lg hover:bg-white text-muted-foreground hover:text-primary transition-colors" title="Edit module">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteModule(module.id)} className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors" title="Delete module">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-3 flex gap-2">
                      <Input value={editingModuleTitle} onChange={(e) => setEditingModuleTitle(e.target.value)} className="flex-1" />
                      <Button size="sm" variant="primary" onClick={() => handleUpdateModule(module.id)}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => { setEditingModuleId(null); setEditingModuleTitle(''); }}>Cancel</Button>
                    </div>
                  )}

                  {isExpanded && (
                    <div className="mt-4 grid gap-3">
                      {module.units.length === 0 && (
                        <p className="text-sm text-muted-foreground italic pl-4">No units yet. Click &quot;Add Unit&quot; below to create one.</p>
                      )}
                      {module.units.map((unit: any, unitIndex: number) => (
                        <div
                          key={unit.id}
                          className={`rounded-2xl border p-4 transition-colors ${selectedUnitId === unit.id ? 'border-accent bg-accent/5' : 'border-white bg-white'}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <button type="button" className="flex-1 text-left" onClick={() => handleSelectUnit(module, unit)}>
                              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/60">Unit {unitIndex + 1}</p>
                              <h4 className="mt-1 font-semibold text-primary">{unit.title}</h4>
                              <p className="mt-1 text-sm text-muted-foreground">{unit.type === 'assignment' ? 'Assignment' : 'Text'} - {unit.duration}</p>
                            </button>
                            <button onClick={() => handleDeleteUnit(unit.id)} className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors shrink-0" title="Delete unit">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-3xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-primary">{isEditingUnit ? 'Edit Unit' : 'New Unit'}</h3>
              {isEditingUnit && (
                <button onClick={() => { setIsEditingUnit(false); setSelectedUnitId(null); }} className="p-1 rounded hover:bg-white text-muted-foreground">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <div className="mt-4 grid gap-4">
              <Input placeholder="Unit title" value={unitTitle} onChange={(event) => setUnitTitle(event.target.value)} />
              <div className="flex gap-3">
                <select
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value as 'text' | 'assignment')}
                  className="h-10 rounded-md border border-input px-3 text-sm text-primary outline-none focus:border-accent"
                >
                  <option value="text">Text</option>
                  <option value="assignment">Assignment</option>
                </select>
                <Input
                  type="number"
                  placeholder="Est. minutes"
                  value={unitEstimatedMin}
                  onChange={(e) => setUnitEstimatedMin(parseInt(e.target.value) || 0)}
                  className="w-32"
                />
              </div>
              <RichTextEditor
                content={unitBody}
                onChange={setUnitBody}
                placeholder="Lesson text, scripture prompts, instructions, or assignment context."
              />
              <Button variant="primary" onClick={handleSaveUnit}><Save className="mr-2 h-4 w-4" /> {isEditingUnit ? 'Update Unit' : 'Save Unit'}</Button>
              {!isEditingUnit && (
                <Button variant="outline" onClick={handleNewUnit}><Plus className="mr-2 h-4 w-4" /> New Unit</Button>
              )}
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
              toast({ title: 'Resource attached', description: `${file.fileName} was attached to the unit.`, tone: 'success' });
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
                    <p className="font-medium text-primary">{label as string}</p>
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

      <PortalDialog
        open={showPublishDialog}
        onClose={() => setShowPublishDialog(false)}
        title="Publish Course"
        description="This will make the course visible to enrolled students. Ensure all modules and units have content before publishing."
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Course: <strong>{courseTitle}</strong></p>
          <p className="text-sm text-muted-foreground">Modules: {modules.length} | Units: {modules.reduce((acc: number, m: any) => acc + m.units.length, 0)}</p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowPublishDialog(false)}>Cancel</Button>
            <Button variant="primary" onClick={handlePublish}>Publish</Button>
          </div>
        </div>
      </PortalDialog>
    </div>
  );
}
