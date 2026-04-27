'use client';

import { Camera, Save, ShieldCheck } from 'lucide-react';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { UploadDropzone } from '@/components/portal/UploadDropzone';
import { useToast } from '@/components/ui/toast';

export default function StudentProfile() {
  const { toast } = useToast();

  return (
    <div className="space-y-8 max-w-full pb-10">
      <PortalPageHeader
        eyebrow="Student Settings"
        title="My Profile"
        description="Personal info, document uploads, and student-facing profile controls remain visible even before account integrations are live."
      />
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-border max-w-2xl w-full mx-auto sm:mx-0">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8 text-center sm:text-left">
          <div className="w-24 h-24 bg-accent text-white rounded-full flex flex-col items-center justify-center text-4xl font-bold shrink-0">JD</div>
          <div className="mt-2 sm:mt-0">
            <h2 className="text-2xl font-bold text-primary text-wrap break-words">John Doe</h2>
            <p className="text-muted">SURGE 24 Cohort</p>
            <button className="text-accent text-sm font-medium mt-2 hover:underline inline-flex items-center gap-2" onClick={() => toast({ title: 'Profile photo action', description: 'A profile photo upload flow is available on this screen.', tone: 'info' })}>
              <Camera className="h-4 w-4" /> Change Picture
            </button>
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
            <button
              type="button"
              onClick={() => toast({ title: 'Profile saved', description: 'Your student details were updated successfully.', tone: 'success' })}
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
          accepted="PDF, JPG, PNG"
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
