'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { PlayCircle, CheckCircle2, ChevronLeft, Save, FileText, ChevronRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function CoursePlayerPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const modules = [
    { title: "Introduction to Faith", units: [
      { num: 1, title: "What is Faith?", type: "video", completed: true },
      { num: 2, title: "The Grace of God", type: "video", active: true },
      { num: 3, title: "Repentance", type: "reading", completed: false },
      { num: 4, title: "Reflection", type: "assignment", completed: false },
    ] },
    { title: "The Bible", units: [
      { num: 1, title: "How to Read the Bible", type: "video", completed: false },
      { num: 2, title: "Old Testament Overview", type: "video", completed: false },
    ] }
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-900 border-x border-[#1e293b]">
      {/* HEADER */}
      <header className="h-16 border-b border-white/10 shrink-0 flex items-center justify-between px-4 lg:px-6 z-20 bg-slate-900">
        <div className="flex items-center gap-4">
          <Link href="/student/dashboard" className="text-white/60 hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-white font-bold hidden sm:block">Discipleship 101</h1>
            <h1 className="text-white font-bold sm:hidden text-sm line-clamp-1">The Grace of God</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-accent w-[30%]"></div>
            </div>
            <span className="text-xs text-white/50 font-medium">30%</span>
          </div>
          <Button variant="outline" size="sm" className="hidden lg:flex border-white/20 text-slate-800 bg-white/5 hover:bg-white/10 hover:text-white border-none rounded-lg">
            <FileText className="w-4 h-4 mr-2" /> Notes
          </Button>
          <button className="lg:hidden text-white p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Side: Video & Notes */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Video Player Area */}
          <div className="w-full aspect-video bg-black relative shadow-2xl shrink-0">
            {/* Dark overlay for design since no actual video */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 bg-accent/90 hover:bg-accent text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95">
                <PlayCircle className="w-10 h-10 ml-1" />
              </button>
            </div>
            <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
              <div className="h-full bg-accent w-[45%]"></div>
            </div>
          </div>

          <div className="flex-1 flex flex-col p-6 max-w-4xl mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-3xl font-display font-bold text-white mb-2">The Grace of God</h2>
              <p className="text-slate-400">Unit 3 • Module 1</p>
              
              <div className="prose prose-invert mt-8 max-w-none">
                <p>Welcome to this unit on the Grace of God. Grace is often defined as &quot;unmerited favor.&quot; In this lesson, we will explore what it means to be saved by grace and how it transforms our daily walk.</p>
                <p><strong>Key scriptures to keep in mind:</strong> Ephesians 2:8-9, Romans 3:23-24.</p>
              </div>
            </div>

            {/* In-Browser Notes Panel (Mobile hidden, shown on Desktop under player) */}
            <div className="bg-slate-800/50 rounded-2xl border border-white/5 p-6 mt-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center"><FileText className="w-4 h-4 mr-2 text-accent" /> Private Notes</h3>
                <span className="text-xs text-slate-500">Auto-saved to your profile</span>
              </div>
              <Textarea 
                placeholder="Type your notes here. Press 'Enter' for a new line. Your notes are saved automatically..." 
                className="bg-slate-900 border-white/10 text-white min-h-[150px] resize-none focus-visible:ring-accent/50"
              />
              <div className="flex justify-end mt-4">
                <Button size="sm" className="bg-slate-700 hover:bg-slate-600 border-none text-white">
                  <Save className="w-4 h-4 mr-2" /> Save Notes
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Module Navigation (Desktop) */}
        <div className={`
          fixed inset-y-0 right-0 z-30 w-80 bg-slate-900 border-l border-white/10 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 pt-16 lg:pt-0 flex flex-col
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-900">
            <h3 className="font-bold text-white uppercase tracking-wider text-sm">Course Content</h3>
            <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5"/></button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {modules.map((m, mIdx) => (
              <div key={mIdx} className="border-b border-white/5">
                <div className="p-4 bg-slate-800/80 sticky top-0 z-10 backdrop-blur-sm border-b border-white/5">
                  <h4 className="text-sm font-bold text-white">Module {mIdx + 1}:</h4>
                  <span className="text-xs text-slate-400">{m.title}</span>
                </div>
                <div className="flex flex-col">
                  {m.units.map((u, uIdx) => (
                    <button 
                      key={uIdx} 
                      className={`
                        text-left p-4 flex gap-3 hover:bg-slate-800 transition-colors border-l-2
                        ${u.active ? 'border-accent bg-slate-800/50' : 'border-transparent'}
                      `}
                    >
                      <div className="mt-0.5 shrink-0">
                        {u.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-accent" />
                        ) : u.active ? (
                          <PlayCircle className="w-5 h-5 text-accent" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-600 flex items-center justify-center text-[9px] text-slate-500 font-bold">{u.num}</div>
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${u.active ? 'text-white' : u.completed ? 'text-slate-300' : 'text-slate-500'}`}>
                          {u.title}
                        </p>
                        <p className="text-xs text-slate-500 capitalize mt-1">{u.type}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
