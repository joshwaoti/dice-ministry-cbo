export default async function CourseEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">Course Editor: {id}</h1>
          <p className="text-muted">Edit course content, modules, and units.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
        <p className="text-muted">Course editor interface will go here.</p>
      </div>
    </div>
  );
}
