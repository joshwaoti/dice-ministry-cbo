'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { 
  Users, BookOpen, FileCheck, Activity, MessageSquare, 
  ClipboardList, PieChart, Calendar, PlusCircle, 
  Megaphone, Download, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { ActivityHeatmap } from '@/components/admin/ActivityHeatmap';
import { useState, useEffect } from 'react';

const enrollmentData = [
  { name: 'Jan', count: 12 }, { name: 'Feb', count: 19 }, { name: 'Mar', count: 15 },
  { name: 'Apr', count: 22 }, { name: 'May', count: 28 }, { name: 'Jun', count: 35 },
  { name: 'Jul', count: 42 }, { name: 'Aug', count: 38 }, { name: 'Sep', count: 45 },
  { name: 'Oct', count: 52 }, { name: 'Nov', count: 60 }, { name: 'Dec', count: 75 },
];

const completionData = [
  { course: 'Discipleship 101', percent: 85 },
  { course: 'Career Guidance', percent: 62 },
  { course: 'Digital Literacy', percent: 90 },
  { course: 'Theology Basics', percent: 45 },
];

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 0) }, []);

  const metrics = [
    { label: 'Total Students', value: '124', subLabel: '+12 this month', subColor: 'text-green-600', icon: Users, href: '/admin/students' },
    { label: 'Total Courses', value: '8', subLabel: '2 in draft', subColor: 'text-amber-600', icon: BookOpen, href: '/admin/courses' },
    { label: 'Assignments Pending', value: '15', subLabel: 'Requires attention', subColor: 'text-accent', icon: FileCheck, href: '/admin/assignments?status=pending', badge: true },
    { label: 'Active This Week', value: '89', subLabel: 'Up 5% vs last week', subColor: 'text-green-600', icon: Activity, href: '/admin/students?filter=active', trend: 'up' },
    { label: 'Unread Messages', value: '4', subLabel: '2 urgent', subColor: 'text-accent', icon: MessageSquare, href: '/admin/messages', badge: true },
    { label: 'Applications', value: '23', subLabel: '5 unreviewed', subColor: 'text-primary', icon: ClipboardList, href: '/admin/applications' },
    { label: 'Course Completion', value: '72%', subLabel: 'Average across all', subColor: 'text-muted', icon: PieChart, href: '#' },
    { label: 'Cohort Overview', value: 'Ignite 24', subLabel: '65 students active', subColor: 'text-muted', icon: Calendar, href: '#' },
  ];

  return (
    <div className="pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary mb-1">Dashboard</h1>
          <p className="text-muted">Overview of platform activity and metrics.</p>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
          >
            <Link href={m.href} className="block group">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-border hover:shadow-md transition-all h-full relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${m.badge ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-600'} group-hover:scale-110 transition-transform`}>
                    <m.icon className="w-6 h-6" />
                  </div>
                  {m.badge && (
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                    </span>
                  )}
                </div>
                <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">{m.label}</h3>
                <div className="text-3xl font-display font-bold text-primary mb-2">{m.value}</div>
                <div className={`text-xs font-medium flex items-center gap-1 ${m.subColor}`}>
                  {m.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                  {m.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                  {m.subLabel}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="mb-10">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="rounded-xl border-border hover:bg-orange-50 hover:text-accent hover:border-accent group transition-all" asChild>
            <Link href="#"><PlusCircle className="mr-2 w-4 h-4 group-hover:rotate-90 transition-transform" /> Add Student</Link>
          </Button>
          <Button variant="outline" className="rounded-xl border-border hover:bg-orange-50 hover:text-accent hover:border-accent group transition-all" asChild>
            <Link href="/admin/courses"><BookOpen className="mr-2 w-4 h-4" /> Create Course</Link>
          </Button>
          <Button variant="outline" className="rounded-xl border-border hover:bg-orange-50 hover:text-accent hover:border-accent group transition-all" asChild>
            <Link href="#"><Megaphone className="mr-2 w-4 h-4" /> Announcement</Link>
          </Button>
          <Button variant="outline" className="rounded-xl border-border hover:bg-orange-50 hover:text-accent hover:border-accent group transition-all relative overflow-hidden" asChild>
            <Link href="/admin/assignments">
              <FileCheck className="mr-2 w-4 h-4" /> Review Assignments
              <div className="absolute inset-x-0 bottom-0 h-1 bg-accent/20">
                <div className="h-full bg-accent w-1/3"></div>
              </div>
            </Link>
          </Button>
          <Button variant="outline" className="rounded-xl border-border hover:bg-orange-50 hover:text-accent hover:border-accent group transition-all" asChild>
            <Link href="#"><Download className="mr-2 w-4 h-4" /> Export Data</Link>
          </Button>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-border">
          <h2 className="text-lg font-display font-bold text-primary mb-6">Monthly Enrollments</h2>
          <div className="h-[300px] w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enrollmentData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#F6AC55"
                    strokeWidth={3}
                    dot={{ fill: '#F6AC55', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : <div className="w-full h-full bg-gray-100 animate-pulse rounded-xl"></div>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
          <h2 className="text-lg font-display font-bold text-primary mb-6">Course Completion</h2>
          <div className="h-[300px] w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionData} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                  <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <YAxis dataKey="course" type="category" axisLine={false} tickLine={false} tick={{fill: '#374151', fontSize: 12}} width={100} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="percent" radius={[0, 4, 4, 0]} barSize={24} animationDuration={1500}>
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.percent > 70 ? '#10B981' : entry.percent > 40 ? '#F59E0B' : '#EF4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="w-full h-full bg-gray-100 animate-pulse rounded-xl"></div>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HEATMAP */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
          <h2 className="text-lg font-display font-bold text-primary mb-6">Submission Activity</h2>
          <ActivityHeatmap data={[]} />
        </div>

        {/* RECENT ACTIVITY ENHANCED */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-display font-bold text-primary">Recent Activity</h2>
            <Link href="#" className="text-sm text-accent hover:underline font-medium">Mark all as read</Link>
          </div>
          
          <div className="space-y-4">
            {[
              { type: 'completion', name: 'John Doe', action: 'completed unit', course: 'Discipleship 101', time: '2 mins ago', color: 'bg-green-500' },
              { type: 'submission', name: 'Sarah M.', action: 'submitted assignment', course: 'Career Guidance', time: '1 hour ago', color: 'bg-orange-500' },
              { type: 'enrollment', name: 'Mike K.', action: 'enrolled in', course: 'Digital Literacy', time: '3 hours ago', color: 'bg-blue-500' },
              { type: 'unenrollment', name: 'Paul N.', action: 'unenrolled from', course: 'Theology Basics', time: '5 hours ago', color: 'bg-red-500' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="mt-1.5"><div className={`w-2.5 h-2.5 rounded-full ${activity.color}`}></div></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-bold text-primary">{activity.name}</span> {activity.action} <span className="font-medium text-teal-600">{activity.course}</span>
                  </p>
                  <p className="text-xs text-muted mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-4 rounded-xl text-muted font-medium">
            Show 10 more activities
          </Button>
        </div>
      </div>

    </div>
  );
}
