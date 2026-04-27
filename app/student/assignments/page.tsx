export default function StudentAssignments() {
  return (
    <div className="space-y-8 max-w-full">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary mb-2 text-wrap">Assignments</h1>
        <p className="text-muted text-wrap">Track your pending and graded work.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden max-w-full">
        <div className="flex border-b border-border bg-surface overflow-x-auto overflow-y-hidden no-scrollbar w-full">
          <button className="px-5 md:px-6 py-4 text-sm font-bold text-accent border-b-2 border-accent whitespace-nowrap shrink-0">Pending (1)</button>
          <button className="px-5 md:px-6 py-4 text-sm font-bold text-muted hover:text-primary whitespace-nowrap shrink-0">Submitted</button>
          <button className="px-5 md:px-6 py-4 text-sm font-bold text-muted hover:text-primary whitespace-nowrap shrink-0">Graded</button>
        </div>
        <div className="p-4 md:p-6 break-words min-w-0">
          <div className="border border-border rounded-xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-accent transition-colors w-full break-words">
            <div className="flex-1 min-w-0">
              <div className="bg-accent/10 text-accent text-xs font-bold px-2 py-1 rounded inline-block mb-2 shrink-0">Pending</div>
              <h3 className="font-bold text-lg text-primary text-wrap break-words leading-tight">Unit 3 Reflection Essay</h3>
              <p className="text-muted text-sm text-wrap mt-1">Discipleship Foundations • Due tomorrow</p>
            </div>
            <button className="bg-accent text-white px-4 py-2.5 md:py-2 rounded-md text-sm font-medium whitespace-nowrap shrink-0 w-full md:w-auto text-center mt-2 md:mt-0">Submit Assignment</button>
          </div>
        </div>
      </div>
    </div>
  );
}
