'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts';
import { LoadingState } from '@/components/ui/LoadingSpinner';

export function DashboardCharts({ enrollmentData, completionData }: { enrollmentData: any[]; completionData: any[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!mounted) return <LoadingState label="Loading charts..." className="min-h-[360px]" />;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm xl:col-span-2">
        <h2 className="mb-6 text-lg font-display font-bold text-primary">Monthly Enrollments</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={enrollmentData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
              <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Line type="monotone" dataKey="count" stroke="#F6AC55" strokeWidth={3} dot={{ fill: '#F6AC55', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} animationDuration={1500} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-display font-bold text-primary">Course Completion</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={completionData} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
              <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis dataKey="course" type="category" axisLine={false} tickLine={false} tick={{ fill: '#374151', fontSize: 12 }} width={100} />
              <RechartsTooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="percent" radius={[0, 4, 4, 0]} barSize={24} animationDuration={1500}>
                {completionData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.percent > 70 ? '#10B981' : entry.percent > 40 ? '#F59E0B' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
