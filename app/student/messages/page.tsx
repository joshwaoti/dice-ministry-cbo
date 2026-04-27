export default function StudentMessages() {
  return (
    <div className="flex flex-col h-[calc(100vh-[10rem])] lg:min-h-[600px] w-full max-w-full bg-white rounded-2xl border border-border shadow-sm overflow-hidden lg:flex-row">
       {/* left panel */}
       <div className="w-full lg:w-80 border-b lg:border-r border-border flex flex-col shrink-0 lg:h-full h-[50vh] min-h-[300px]">
         <div className="p-4 border-b border-border bg-surface shrink-0">
           <h2 className="font-bold text-primary">Conversations</h2>
         </div>
         <div className="overflow-y-auto flex-1 h-full min-h-0">
           {/* Active Convo */}
           <div className="p-4 border-b border-border bg-accent/5 cursor-pointer">
             <div className="flex justify-between items-start mb-1">
               <span className="font-semibold text-primary truncate pr-2">Instructor Davis</span>
               <span className="bg-accent w-2 h-2 rounded-full mt-1.5 shrink-0" />
             </div>
             <p className="text-sm text-muted line-clamp-2 leading-tight">Your recent assignment looks great. Let me know if you have any questions.</p>
             <span className="text-[10px] text-muted mt-2 block uppercase text-right">10:45 AM</span>
           </div>
           {/* Normal Convo */}
           <div className="p-4 border-b border-border hover:bg-gray-50 transition-colors cursor-pointer">
             <div className="flex justify-between items-start mb-1">
               <span className="font-semibold text-primary truncate pr-2">Cohort Announcements</span>
             </div>
             <p className="text-sm text-muted line-clamp-2 leading-tight">Welcome to the new semester! Please review the syllabus in your course library.</p>
             <span className="text-[10px] text-muted mt-2 block uppercase text-right">Yesterday</span>
           </div>
         </div>
       </div>
       
       {/* right panel */}
       <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden lg:h-full lg:flex h-[50vh] min-h-[300px]">
         <div className="p-4 border-b border-border bg-surface font-semibold text-primary flex items-center gap-3 shrink-0">
           <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">ID</div>
           <span className="truncate">Instructor Davis</span>
         </div>
         
         <div className="flex-1 p-4 lg:p-6 overflow-y-auto flex flex-col gap-4 min-h-0">
           <div className="bg-white p-4 rounded-tr-2xl rounded-bl-2xl rounded-br-2xl shadow-sm self-start max-w-[90%] lg:max-w-[75%] border border-border">
             <p className="text-sm text-primary break-words">Hello there! Your recent assignment on Discipleship Foundations looks great. I&apos;ve left a few minor notes in the graded document, but overall fantastic work. Keep it up!</p>
             <span className="text-[10px] text-muted mt-2 block text-right">10:45 AM</span>
           </div>
           <div className="bg-accent p-4 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl shadow-sm self-end max-w-[90%] lg:max-w-[75%] text-white">
             <p className="text-sm break-words">Thank you! I will review the notes right away.</p>
             <span className="text-[10px] text-white/70 mt-2 block text-right">Just now</span>
           </div>
         </div>
         
         <div className="p-4 border-t border-border bg-white flex flex-col sm:flex-row gap-3 shrink-0">
           <input type="text" className="flex-1 min-w-0 px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent text-sm w-full" placeholder="Type your message..." />
           <button className="bg-accent text-white px-6 py-2.5 sm:py-2 rounded-lg font-medium shrink-0 text-sm hover:bg-accent/90 transition-colors w-full sm:w-auto">Send</button>
         </div>
       </div>
    </div>
  );
}
