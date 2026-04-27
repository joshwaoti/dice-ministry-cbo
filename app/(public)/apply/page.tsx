import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const metadata: Metadata = {
  title: 'Apply for Ignite | DICE Ministry',
};

export default function ApplyPage() {
  return (
    <div className="py-24 max-w-3xl mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">Apply for Ignite</h1>
        <p className="text-lg text-muted">Join the next cohort of the Ignite program.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-border">
        {/* Simple mock of the Multi-step Form */}
        <div className="flex gap-2 mb-8">
          <div className="h-2 flex-1 bg-accent rounded-full"></div>
          <div className="h-2 flex-1 bg-surface rounded-full"></div>
          <div className="h-2 flex-1 bg-surface rounded-full"></div>
          <div className="h-2 flex-1 bg-surface rounded-full"></div>
        </div>

        <h2 className="text-2xl font-bold text-primary mb-6">Step 1: Personal Information</h2>
        
        <form className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-primary">Full Name</label>
              <Input placeholder="Enter your full name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-primary">Date of Birth</label>
                <Input type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-primary">Gender</label>
                <select className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent">
                  <option>Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>
            <div>
               <label className="block text-sm font-medium mb-1 text-primary">Email</label>
               <Input type="email" placeholder="example@gmail.com" />
            </div>
             <div>
               <label className="block text-sm font-medium mb-1 text-primary">Phone Number</label>
               <Input type="tel" placeholder="+254 7XX XXX XXX" />
            </div>
          </div>
          
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-border">
            <Button type="button" variant="primary">Next Step &rarr;</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
