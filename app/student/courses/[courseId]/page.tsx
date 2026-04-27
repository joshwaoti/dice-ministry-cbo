export default async function CourseDetail({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-primary mb-2">Course Detail: {courseId}</h1>
        <p className="text-muted">Explore the modules and units for this course.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
        <p className="text-muted">Module list will go here.</p>
      </div>
    </div>
  );
}
