export default function StudentProfile() {
  return (
    <div className="space-y-8 max-w-full">
       <div>
         <h1 className="text-3xl font-display font-bold text-primary mb-2 text-wrap">My Profile</h1>
         <p className="text-muted text-wrap">Manage your personal information.</p>
       </div>
       <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-border max-w-2xl w-full mx-auto sm:mx-0">
         <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8 text-center sm:text-left">
            <div className="w-24 h-24 bg-accent text-white rounded-full flex flex-col items-center justify-center text-4xl font-bold shrink-0">JD</div>
            <div className="mt-2 sm:mt-0">
               <h2 className="text-2xl font-bold text-primary text-wrap break-words">John Doe</h2>
               <p className="text-muted">SURGE 24 Cohort</p>
               <button className="text-accent text-sm font-medium mt-2 hover:underline">Change Picture</button>
            </div>
         </div>
         <form className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
               <div>
                 <label className="block text-sm font-medium mb-1.5 text-primary">Full Name</label>
                 <input type="text" className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-accent transition-colors" defaultValue="John Doe" />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1.5 text-primary">Email Address</label>
                 <input type="email" className="w-full px-4 py-2 border border-border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed outline-none" defaultValue="john.doe@example.com" disabled />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1.5 text-primary">Phone Number</label>
                 <input type="tel" className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-accent transition-colors" defaultValue="+254 712 345678" />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1.5 text-primary">Timezone</label>
                 <select className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-accent transition-colors bg-white">
                   <option>East Africa Time (EAT)</option>
                   <option>Central Africa Time (CAT)</option>
                   <option>West Africa Time (WAT)</option>
                 </select>
               </div>
            </div>
            <div className="pt-6 border-t border-border mt-6">
               <button type="button" className="w-full sm:w-auto bg-accent hover:bg-accent/90 transition-colors text-white px-8 py-2.5 rounded-lg font-medium shadow-sm">Save Changes</button>
            </div>
         </form>
       </div>
    </div>
  );
}
