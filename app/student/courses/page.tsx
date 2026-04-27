import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StudentCourses() {
  return (
    <div className="space-y-8 max-w-full">
      <div>
         <h1 className="text-3xl font-display font-bold text-primary mb-2 text-wrap">My Courses</h1>
         <p className="text-muted text-wrap">Pick up where you left off.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mock Enrolled Course */}
        <Card className="flex flex-col overflow-hidden w-full max-w-full">
          <div className="h-40 bg-gray-200 shrink-0" style={{backgroundImage: 'url(https://picsum.photos/seed/course1/600/400)', backgroundSize: 'cover'}} />
          <CardContent className="p-6 flex-1 flex flex-col min-w-0 break-words">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-teal/10 text-teal font-bold px-3 py-1 rounded-full text-xs uppercase shrink-0">12 Units</div>
              <div className="text-sm font-bold text-primary shrink-0">45%</div>
            </div>
            <div className="w-full bg-surface rounded-full h-2 mb-4 overflow-hidden shrink-0">
              <div className="bg-accent h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <CardTitle className="text-xl mb-3 text-wrap break-words leading-tight">Discipleship Foundations</CardTitle>
            <p className="text-muted flex-grow mb-6 text-sm text-wrap overflow-hidden">Continue with Unit 3: Building Character.</p>
            <Button asChild className="w-full mt-auto" variant="primary">
              <Link href="/student/courses/c1/m3/u1">Continue Learning</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Second Course */}
        <Card className="flex flex-col overflow-hidden w-full max-w-full">
          <div className="h-40 bg-gray-200 shrink-0" style={{backgroundImage: 'url(https://picsum.photos/seed/course2/600/400)', backgroundSize: 'cover'}} />
          <CardContent className="p-6 flex-1 flex flex-col min-w-0 break-words">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-teal/10 text-teal font-bold px-3 py-1 rounded-full text-xs uppercase shrink-0">8 Units</div>
              <div className="text-sm font-bold text-primary shrink-0">15%</div>
            </div>
            <div className="w-full bg-surface rounded-full h-2 mb-4 overflow-hidden shrink-0">
              <div className="bg-accent h-2 rounded-full" style={{ width: '15%' }}></div>
            </div>
            <CardTitle className="text-xl mb-3 text-wrap break-words leading-tight">Peer Mentoring &amp; Life Skills</CardTitle>
            <p className="text-muted flex-grow mb-6 text-sm text-wrap overflow-hidden">Continue with Unit 1: Discovering Purpose.</p>
            <Button asChild className="w-full mt-auto" variant="primary">
              <Link href="/student/courses/c2/m1/u1">Continue Learning</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
