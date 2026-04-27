export default function AdminStudents() {
  return (
    <div className="space-y-8 max-w-full">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
           <h1 className="text-3xl font-display font-bold text-primary mb-2 text-wrap">Student Management</h1>
           <p className="text-muted text-wrap">View and manage enrolled students across all cohorts.</p>
         </div>
         <button className="bg-accent hover:bg-accent/90 transition-colors text-white px-5 py-2.5 rounded-lg font-medium whitespace-nowrap shadow-sm w-full sm:w-auto">Add Student</button>
       </div>

       <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden w-full flex flex-col min-h-0">
         <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 shrink-0">
           <input type="text" placeholder="Search students by name or email..." className="flex-1 min-w-0 px-4 py-2 text-sm border border-border rounded-lg outline-none focus:border-accent" />
           <select className="px-4 py-2 text-sm border border-border rounded-lg bg-white outline-none focus:border-accent shrink-0 sm:w-48">
             <option>All Cohorts</option>
             <option>SURGE 24</option>
             <option>Ignite 25</option>
           </select>
         </div>
         <div className="overflow-x-auto flex-1">
           <table className="w-full text-left border-collapse min-w-[700px]">
             <thead>
               <tr className="bg-surface border-b border-border text-xs text-muted">
                 <th className="px-6 py-4 font-bold uppercase tracking-wider">Student Name</th>
                 <th className="px-6 py-4 font-bold uppercase tracking-wider">Cohort</th>
                 <th className="px-6 py-4 font-bold uppercase tracking-wider">Progress</th>
                 <th className="px-6 py-4 font-bold uppercase tracking-wider">Status</th>
                 <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border">
               <tr className="hover:bg-gray-50 transition-colors group">
                 <td className="px-6 py-4">
                   <div className="flex items-center gap-3">
                     <div className="w-9 h-9 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold shrink-0 text-sm">JD</div>
                     <div className="min-w-0">
                       <p className="font-semibold text-primary truncate">John Doe</p>
                       <p className="text-xs text-muted truncate">john.doe@example.com</p>
                     </div>
                   </div>
                 </td>
                 <td className="px-6 py-4 text-sm font-medium text-primary">Ignite 25</td>
                 <td className="px-6 py-4">
                   <div className="flex items-center gap-3">
                     <div className="w-full max-w-[120px] h-2 bg-border rounded-full overflow-hidden shrink-0"><div className="h-full bg-teal rounded-full" style={{width:'45%'}}></div></div>
                     <span className="text-xs font-bold text-teal">45%</span>
                   </div>
                 </td>
                 <td className="px-6 py-4"><span className="bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-wider">Active</span></td>
                 <td className="px-6 py-4 text-right">
                   <button className="text-accent text-sm font-medium hover:underline">View Profile</button>
                 </td>
               </tr>
               <tr className="hover:bg-gray-50 transition-colors group">
                 <td className="px-6 py-4">
                   <div className="flex items-center gap-3">
                     <div className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold shrink-0 text-sm">SM</div>
                     <div className="min-w-0">
                       <p className="font-semibold text-primary truncate">Sarah Mulupi</p>
                       <p className="text-xs text-muted truncate">sarah.m@example.com</p>
                     </div>
                   </div>
                 </td>
                 <td className="px-6 py-4 text-sm font-medium text-primary">SURGE 24</td>
                 <td className="px-6 py-4">
                   <div className="flex items-center gap-3">
                     <div className="w-full max-w-[120px] h-2 bg-border rounded-full overflow-hidden shrink-0"><div className="h-full bg-teal rounded-full" style={{width:'100%'}}></div></div>
                     <span className="text-xs font-bold text-primary">100%</span>
                   </div>
                 </td>
                 <td className="px-6 py-4"><span className="bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-wider">Completed</span></td>
                 <td className="px-6 py-4 text-right">
                   <button className="text-accent text-sm font-medium hover:underline">View Profile</button>
                 </td>
               </tr>
             </tbody>
           </table>
         </div>
       </div>
    </div>
  );
}
