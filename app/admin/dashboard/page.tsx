'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { 
  Users, BookOpen, FileCheck, Activity, MessageSquare, 
  ClipboardList, PieChart, Calendar, PlusCircle, 
  Megaphone, Download, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { PortalDialog } from '@/components/portal/PortalDialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EmptyPortalState } from '@/components/portal/EmptyPortalState';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';

const DashboardCharts = dynamic(() => import('@/components/admin/DashboardCharts').then((mod) => mod.DashboardCharts), {
  ssr: false,
  loading: () => <LoadingPortalState label="Loading charts..." />,
});

const DashboardHeatmap = dynamic(() => import('@/components/admin/DashboardHeatmap').then((mod) => mod.DashboardHeatmap), {
  ssr: false,
  loading: () => <LoadingPortalState label="Loading activity..." />,
});

export default function AdminDashboard() {
  const dashboard = useQuery(api.portal.adminDashboard) as any | undefined;
  const liveMetrics = dashboard?.metrics;
  const submitApplication = useMutation(api.applications.submitApplication);
  const createAnnouncement = useMutation(api.announcements.create);
  const { toast } = useToast();
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementBody, setAnnouncementBody] = useState('');

  const enrollmentData = dashboard?.enrollmentData ?? [];
  const liveCompletionData = dashboard?.completionData ?? [];

  const recentActivityData = useMemo(() => {
    const activities = dashboard?.recentActivity ?? [];
    return activities.slice(0, 5).map((activity: any) => {
      const time = activity.time ? new Date(activity.time).toLocaleString() : 'Just now';
      return {
        type: activity.type,
        name: 'Student',
        action: activity.type === 'submission' ? 'submitted assignment' : 'enrolled in course',
        course: 'Portal course',
        time,
        color: activity.type === 'submission' ? 'bg-orange-500' : 'bg-blue-500',
      };
    });
  }, [dashboard?.recentActivity]);

  const hasMetrics = dashboard !== undefined;

  const metrics = hasMetrics ? [
    { label: 'Total Students', value: String(liveMetrics?.students ?? 0), subLabel: `${liveMetrics?.activeThisWeek ?? 0} active this week`, subColor: 'text-green-600', icon: Users, href: '/admin/students' },
    { label: 'Total Courses', value: String(liveMetrics?.activeCourses ?? 0), subLabel: `${liveMetrics?.draftCourses ?? 0} in draft`, subColor: 'text-amber-600', icon: BookOpen, href: '/admin/courses' },
    { label: 'Assignments Pending', value: String(liveMetrics?.pendingSubmissions ?? 0), subLabel: 'Requires attention', subColor: 'text-accent', icon: FileCheck, href: '/admin/assignments?status=pending', badge: !!liveMetrics?.pendingSubmissions },
    { label: 'Active This Week', value: String(liveMetrics?.activeThisWeek ?? 0), subLabel: 'Live from student activity', subColor: 'text-green-600', icon: Activity, href: '/admin/students?filter=active', trend: 'up' },
    { label: 'Unread Messages', value: String(liveMetrics?.unreadMessages ?? 0), subLabel: 'Across conversations', subColor: 'text-accent', icon: MessageSquare, href: '/admin/messages', badge: !!liveMetrics?.unreadMessages },
    { label: 'Applications', value: String(liveMetrics?.applications ?? 0), subLabel: `${liveMetrics?.newApplications ?? 0} unreviewed`, subColor: 'text-primary', icon: ClipboardList, href: '/admin/applications' },
    { label: 'Course Completion', value: `${liveMetrics?.avgCompletion ?? 0}%`, subLabel: 'Average across all', subColor: 'text-muted', icon: PieChart, href: '#' },
    { label: 'Announcements', value: String(liveMetrics?.announcements ?? 0), subLabel: 'Published and drafts', subColor: 'text-muted', icon: Calendar, href: '/admin/announcements' },
  ] : [];

  const handleAddStudent = async () => {
    if (!studentName.trim() || !studentEmail.trim()) {
      toast({ title: 'Required fields', description: 'Name and email are required.', tone: 'warning' });
      return;
    }
    await submitApplication({
      fullName: studentName,
      email: studentEmail,
      phone: studentPhone || 'Not provided',
      motivation: 'Created from admin dashboard quick intake.',
    });
    toast({ title: 'Application created', description: `${studentName} is now in the application review queue. Approve them to send a Clerk invite.`, tone: 'success' });
    setStudentName('');
    setStudentEmail('');
    setStudentPhone('');
    setShowAddStudent(false);
  };

  const handleCreateAnnouncement = async () => {
    if (!announcementTitle.trim() || !announcementBody.trim()) {
      toast({ title: 'Required fields', description: 'Title and body are required.', tone: 'warning' });
      return;
    }
    await createAnnouncement({ title: announcementTitle, body: announcementBody, audience: 'students' });
    toast({ title: 'Announcement created', description: 'Your announcement has been published to students.', tone: 'success' });
    setAnnouncementTitle('');
    setAnnouncementBody('');
    setShowAnnouncement(false);
  };

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
          <Button variant="outline" className="rounded-xl border-border hover:bg-orange-50 hover:text-accent hover:border-accent group transition-all" onClick={() => setShowAddStudent(true)}>
            <PlusCircle className="mr-2 w-4 h-4 group-hover:rotate-90 transition-transform" /> Create Application
          </Button>
          <Button variant="outline" className="rounded-xl border-border hover:bg-orange-50 hover:text-accent hover:border-accent group transition-all" asChild>
            <Link href="/admin/courses"><BookOpen className="mr-2 w-4 h-4" /> Create Course</Link>
          </Button>
          <Button variant="outline" className="rounded-xl border-border hover:bg-orange-50 hover:text-accent hover:border-accent group transition-all" onClick={() => setShowAnnouncement(true)}>
            <Megaphone className="mr-2 w-4 h-4" /> Announcement
          </Button>
          <Button variant="outline" className="rounded-xl border-border hover:bg-orange-50 hover:text-accent hover:border-accent group transition-all" asChild>
            <Link href="/admin/assignments">
              <FileCheck className="mr-2 w-4 h-4" /> Review Assignments
            </Link>
          </Button>
          <Button variant="outline" className="rounded-xl border-border hover:bg-orange-50 hover:text-accent hover:border-accent group transition-all" asChild>
            <Link href="/admin/applications">
            <Download className="mr-2 w-4 h-4" /> Export Data
            </Link>
          </Button>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="mb-8">
        <DashboardCharts enrollmentData={enrollmentData} completionData={liveCompletionData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HEATMAP */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
          <h2 className="text-lg font-display font-bold text-primary mb-6">Submission Activity</h2>
          <DashboardHeatmap />
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-display font-bold text-primary">Recent Activity</h2>
            <Link href="/admin/messages" className="text-sm text-accent hover:underline font-medium">Open messages</Link>
          </div>
          
          <div className="space-y-4">
            {recentActivityData.map((activity: any, i: number) => (
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

          <Button variant="outline" className="w-full mt-4 rounded-xl text-muted font-medium" asChild>
            <Link href="/admin/assignments">Open review queue</Link>
          </Button>
        </div>
      </div>

      {/* CREATE APPLICATION DIALOG */}
      <PortalDialog
        open={showAddStudent}
        onClose={() => setShowAddStudent(false)}
        title="Create Application"
        description="Create an Ignite application record. Approval still happens in the admissions queue before any Clerk invite is sent."
      >
        <div className="space-y-4">
          <Input placeholder="Full name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
          <Input placeholder="Email address" type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} />
          <Input placeholder="Phone number (optional)" type="tel" value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowAddStudent(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddStudent}>Create Application</Button>
          </div>
        </div>
      </PortalDialog>

      {/* ANNOUNCEMENT DIALOG */}
      <PortalDialog
        open={showAnnouncement}
        onClose={() => setShowAnnouncement(false)}
        title="Create Announcement"
        description="Publish an announcement to students."
      >
        <div className="space-y-4">
          <Input placeholder="Announcement title" value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} />
          <Textarea className="min-h-24" placeholder="Announcement content..." value={announcementBody} onChange={(e) => setAnnouncementBody(e.target.value)} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowAnnouncement(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateAnnouncement}>Publish</Button>
          </div>
        </div>
      </PortalDialog>
    </div>
  );
}
