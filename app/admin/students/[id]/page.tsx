export default async function StudentProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-primary mb-2">Student Profile: {id}</h1>
        <p className="text-muted">Manage student details, enrollment, and progress.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
        <p className="text-muted">Student profile information will go here.</p>
      </div>
    </div>
  );
}
