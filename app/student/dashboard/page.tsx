'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { PlayCircle, Flame, Clock, CheckCircle2, ChevronRight, Award, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StudentDashboard() {
  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary mb-1">Welcome back, Sarah!</h1>
          <p className="text-muted text-lg">You&apos;re making great progress. Keep it up.</p>
        </div>
        
        {/* Daily Streak */}
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 px-4 py-2 rounded-xl text-accent">
          <Flame className="w-5 h-5 fill-accent stroke-accent" />
          <span className="font-bold">14 Day Streak!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Jump Back In */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">Jump Back In</h2>
            <div className="bg-primary text-white rounded-2xl p-8 relative overflow-hidden shadow-lg border border-primary/20">
              <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url("https://picsum.photos/seed/learn/800/400")'}} />
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent" />
              
              <div className="relative z-10">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Discipleship 101</span>
                <h3 className="text-3xl font-display font-bold mb-2">The Grace of God</h3>
                <p className="text-white/80 mb-8 max-w-md">Unit 3 • Module 1. You are 12 minutes into this 25 minute video lesson.</p>
                
                <div className="flex items-center gap-4">
                  <Button variant="white" size="lg" className="rounded-xl group" asChild>
                    <Link href="/student/courses/1/learn">
                      <PlayCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Resume Lesson
                    </Link>
                  </Button>
                  <span className="text-sm font-medium text-white/70">45% Course Complete</span>
                </div>
              </div>
            </div>
          </section>

          {/* Enrolled Courses */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted">My Courses</h2>
              <Link href="/student/courses" className="text-sm font-medium text-accent hover:underline">View All</Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/student/courses/2" className="bg-white p-5 rounded-2xl border border-border hover:shadow-md hover:border-accent/30 transition-all group">
                <h3 className="font-display font-bold text-lg text-primary mb-1 group-hover:text-accent transition-colors">Career Guidance</h3>
                <p className="text-sm text-muted mb-4">Module 2: Discovering Gifts</p>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted font-medium">
                  <span>20% Complete</span>
                </div>
              </Link>
              
              <Link href="/student/courses/3" className="bg-white p-5 rounded-2xl border border-border hover:shadow-md hover:border-accent/30 transition-all group">
                <h3 className="font-display font-bold text-lg text-primary mb-1 group-hover:text-accent transition-colors">Digital Literacy</h3>
                <p className="text-sm text-muted mb-4">Module 4: Spreadsheets</p>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div className="bg-teal-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted font-medium">
                  <span>85% Complete</span>
                </div>
              </Link>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Deadlines & Alerts */}
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">Up Next</h2>
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border bg-red-50/50 flex items-start gap-4">
                <div className="bg-red-100 text-red-600 p-2 rounded-lg shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Career Reflection Essay</h4>
                  <p className="text-sm text-red-600 font-medium my-1">Due Today • 11:59 PM</p>
                  <Button variant="outline" size="sm" className="mt-2 text-xs border-red-200 hover:bg-red-50" asChild>
                    <Link href="#">Submit Now</Link>
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border-b border-border flex items-start gap-4">
                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg shrink-0 mt-0.5">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">New Module Unlocked</h4>
                  <p className="text-sm text-gray-600 my-1">Digital Literacy: Presentations</p>
                </div>
              </div>

              <div className="p-4 flex items-start gap-4">
                <div className="bg-green-50 text-green-600 p-2 rounded-lg shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Assignment Graded</h4>
                  <p className="text-sm text-gray-600 my-1">Discipleship 101: Week 2 Quiz</p>
                  <p className="text-xs font-bold text-green-600 mt-1">Score: 95%</p>
                </div>
              </div>
            </div>
          </section>

          {/* Achievments */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Recent Badges</h2>
            </div>
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm flex gap-4">
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-2 border-2 border-amber-200 group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-amber-600" />
                </div>
                <span className="text-xs font-bold text-gray-700 block">Fast Learner</span>
              </div>
              <div className="text-center group opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-2 border-2 border-gray-200 group-hover:scale-110 transition-transform">
                  <Flame className="w-8 h-8 text-gray-400 group-hover:text-orange-500" />
                </div>
                <span className="text-xs font-bold text-gray-700 block mt-2">1 Month Streak</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
