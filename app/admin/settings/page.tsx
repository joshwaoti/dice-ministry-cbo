export default function AdminSettings() {
  return (
    <div className="space-y-8 max-w-full">
       <div>
         <h1 className="text-3xl font-display font-bold text-primary mb-2 text-wrap">Platform Settings</h1>
         <p className="text-muted text-wrap">Manage admin preferences and platform configurations.</p>
       </div>
       <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-border max-w-2xl w-full">
          <h2 className="text-xl font-bold text-primary mb-6">General Preferences</h2>
          <div className="space-y-4">
             <label className="flex items-start gap-4 p-4 border border-border rounded-xl cursor-pointer hover:border-accent transition-colors">
                <input type="checkbox" className="w-5 h-5 mt-0.5 rounded border-gray-300 text-accent focus:ring-accent" defaultChecked />
                <div>
                  <span className="block text-primary font-medium mb-1">Email notifications for new applications</span>
                  <p className="text-sm text-muted">Receive an email immediately when a new student applies for a cohort.</p>
                </div>
             </label>
             <label className="flex items-start gap-4 p-4 border border-border rounded-xl cursor-pointer hover:border-accent transition-colors">
                <input type="checkbox" className="w-5 h-5 mt-0.5 rounded border-gray-300 text-accent focus:ring-accent" defaultChecked />
                <div>
                  <span className="block text-primary font-medium mb-1">Email notifications for assignments</span>
                  <p className="text-sm text-muted">Receive an email when an assignment is submitted and requires grading.</p>
                </div>
             </label>
             <label className="flex items-start gap-4 p-4 border border-border rounded-xl cursor-pointer hover:border-accent transition-colors">
                <input type="checkbox" className="w-5 h-5 mt-0.5 rounded border-gray-300 text-accent focus:ring-accent" />
                <div>
                  <span className="block text-primary font-medium mb-1">Weekly platform digest</span>
                  <p className="text-sm text-muted">Receive a weekly summary of student progress and engagement.</p>
                </div>
             </label>
             
             <div className="pt-6 border-t border-border mt-6">
               <button type="button" className="w-full sm:w-auto bg-accent hover:bg-accent/90 transition-colors text-white px-8 py-2.5 rounded-lg font-medium shadow-sm">Update Settings</button>
             </div>
          </div>
       </div>
    </div>
  );
}
