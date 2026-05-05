'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/toast';

export function AlumniStoryForm() {
  const submitStory = useMutation(api.publicSubmissions.submitAlumniStory);
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cohort, setCohort] = useState('');
  const [currentUpdate, setCurrentUpdate] = useState('');
  const [story, setStory] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await submitStory({ fullName, email, cohort, currentUpdate, story });
      setFullName('');
      setEmail('');
      setCohort('');
      setCurrentUpdate('');
      setStory('');
      toast({ title: 'Story submitted', description: 'Thank you. The admin team will review it before publishing.', tone: 'success' });
    } catch (error) {
      toast({ title: 'Story not sent', description: error instanceof Error ? error.message : 'Please check the form and try again.', tone: 'warning' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">Name</label>
          <Input id="name" required maxLength={120} placeholder="Your full name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <Input id="email" required maxLength={160} type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
      </div>
      <div>
        <label htmlFor="cohort" className="mb-1 block text-sm font-medium text-gray-700">Cohort Year</label>
        <Input id="cohort" required maxLength={80} placeholder="e.g. Ignite 2023" value={cohort} onChange={(event) => setCohort(event.target.value)} />
      </div>
      <div>
        <label htmlFor="update" className="mb-1 block text-sm font-medium text-gray-700">Current Update</label>
        <Input id="update" required maxLength={180} placeholder="e.g. Now studying at University of Nairobi" value={currentUpdate} onChange={(event) => setCurrentUpdate(event.target.value)} />
      </div>
      <div>
        <label htmlFor="story" className="mb-1 block text-sm font-medium text-gray-700">Your Story</label>
        <Textarea id="story" required minLength={20} maxLength={5000} placeholder="How did the program impact you?" rows={4} value={story} onChange={(event) => setStory(event.target.value)} />
      </div>
      <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
        {submitting ? <LoadingSpinner label="Submitting..." className="justify-center text-white" /> : 'Submit Story'}
      </Button>
    </form>
  );
}
