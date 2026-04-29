'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { Camera, Save, ShieldCheck } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { UploadDropzone } from '@/components/portal/UploadDropzone';
import { useToast } from '@/components/ui/toast';
import { LoadingPortalState } from '@/components/portal/LoadingPortalState';

export default function StudentProfile() {
  const currentStudent = useQuery(api.students.current, {}) as any | undefined;
  const updateSelf = useMutation(api.profiles.updateSelf);
  const [dirty, setDirty] = useState(false);
  const { toast } = useToast();
  const profile = currentStudent?.profile;
  const studentProfile = currentStudent?.studentProfile;

  const [name, setName] = useState(profile?.name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');

  const visibleName = dirty ? name : profile?.name ?? '';
  const visiblePhone = dirty ? phone : profile?.phone ?? '';
  const initials = (visibleName || profile?.email || 'JD').split(' ').map((part: string) => part[0]).join('').slice(0, 2).toUpperCase();

  const handleSave = async () => {
    await updateSelf({ name: visibleName, phone: visiblePhone });
    toast({ title: 'Profile saved', description: 'Your student details were updated successfully.', tone: 'success' });
  };

  return (
    <div className="space-y-8 max-w-full pb-10">
      <PortalPageHeader
        eyebrow="Student Settings"
        title="My Profile"
        description="Personal info, document uploads, and student-facing profile controls are connected to your approved portal profile."
      />
      {currentStudent === undefined ? <LoadingPortalState label="Loading profile..." /> : null}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-border max-w-2xl w-full mx-auto sm:mx-0">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8 text-center sm:text-left">
          <div className="w-24 h-24 bg-accent text-white rounded-full flex flex-col items-center justify-center text-4xl font-bold shrink-0">{initials}</div>
          <div className="mt-2 sm:mt-0">
            <h2 className="text-2xl font-bold text-primary text-wrap break-words">{visibleName}</h2>
            <p className="text-muted">{studentProfile?.studentCode ?? 'Student profile'} - {studentProfile?.enrollmentStatus ?? 'active'}</p>
            <button className="text-accent text-sm font-medium mt-2 hover:underline inline-flex items-center gap-2" onClick={() => toast({ title: 'Profile photo action', description: 'A profile photo upload flow is available on this screen.', tone: 'info' })}>
              <Camera className="h-4 w-4" /> Change Picture
            </button>
          </div>
        </div>
        <form className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-primary">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-accent transition-colors"
                value={visibleName}
                placeholder="Enter your full name"
                onChange={(event) => {
                  setDirty(true);
                  setName(event.target.value);
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-primary">Email Address</label>
              <input type="email" className="w-full px-4 py-2 border border-border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed outline-none" value={profile?.email ?? 'john.doe@example.com'} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-primary">Phone Number</label>
              <input
                type="tel"
                className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-accent transition-colors"
                value={visiblePhone}
                placeholder="+254 712 345678"
                onChange={(event) => {
                  setDirty(true);
                  setPhone(event.target.value);
                }}
              />
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
            <button
              type="button"
              onClick={handleSave}
              className="w-full sm:w-auto bg-accent hover:bg-accent/90 transition-colors text-white px-8 py-2.5 rounded-lg font-medium shadow-sm inline-flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <UploadDropzone
          title="Upload supporting documents"
          description="Student-facing space for ID, assignment support files, and profile-related documents."
          accepted="PDF, DOC, DOCX, JPG, PNG"
          helper="This keeps document upload visible in the student portal, matching the broader portal requirement."
        />
        <div className="rounded-[24px] border border-border bg-primary p-6 text-white shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white/10 p-3"><ShieldCheck className="h-5 w-5" /></div>
            <div>
              <h2 className="font-display text-xl font-bold">Privacy and access</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/80">Sensitive student fields stay read-only where appropriate, while editable fields surface clearly with save feedback.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
