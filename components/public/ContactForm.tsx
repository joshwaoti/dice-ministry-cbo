'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/toast';

export function ContactForm({ labels, success }: { labels: { firstName: string; lastName: string; email: string; message: string; submit: string }; success: string }) {
  const submitContact = useMutation(api.publicSubmissions.submitContact);
  const { toast } = useToast();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await submitContact({ firstName, lastName, email, message });
      setSent(true);
      setFirstName('');
      setLastName('');
      setEmail('');
      setMessage('');
      toast({ title: 'Message sent', description: success, tone: 'success' });
    } catch (error) {
      toast({ title: 'Message not sent', description: error instanceof Error ? error.message : 'Please check the form and try again.', tone: 'warning' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="first-name" className="text-sm font-medium text-primary">{labels.firstName}</label>
          <Input id="first-name" required maxLength={80} value={firstName} onChange={(event) => setFirstName(event.target.value)} />
        </div>
        <div className="space-y-2">
          <label htmlFor="last-name" className="text-sm font-medium text-primary">{labels.lastName}</label>
          <Input id="last-name" required maxLength={80} value={lastName} onChange={(event) => setLastName(event.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-primary">{labels.email}</label>
        <Input id="email" required maxLength={160} type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-primary">{labels.message}</label>
        <textarea
          id="message"
          required
          minLength={10}
          maxLength={3000}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="min-h-[180px] w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        />
      </div>
      <Button size="lg" variant="primary" type="submit" disabled={submitting}>
        {submitting ? <LoadingSpinner label="Sending..." className="text-white" /> : labels.submit}
      </Button>
      {sent ? <p className="text-sm leading-7 text-muted-foreground">{success}</p> : null}
    </form>
  );
}
