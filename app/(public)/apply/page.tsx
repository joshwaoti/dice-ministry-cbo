'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { useMutation } from 'convex/react';
import { CheckCircle2 } from 'lucide-react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';

const steps = ['Personal', 'Education', 'Motivation'];

export default function ApplyPage() {
  const submitApplication = useMutation(api.applications.submitApplication);
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    residentialArea: '',
    highSchool: '',
    completionYear: '',
    kcseGrade: '',
    motivation: '',
    hopes: '',
    referralSource: '',
  });

  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const requiredForStep = [
    ['fullName', 'email', 'phone'],
    ['highSchool', 'completionYear'],
    ['motivation'],
  ] as Array<Array<keyof typeof form>>;

  const canContinue = requiredForStep[step].every((field) => form[field].trim().length > 0);

  const handleNext = () => {
    if (!canContinue) {
      toast({ title: 'Complete the required fields', description: 'Fill the required fields on this step before continuing.', tone: 'warning' });
      return;
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const handleSubmit = async () => {
    if (!canContinue) {
      toast({ title: 'Complete the required fields', description: 'Add your motivation before submitting the application.', tone: 'warning' });
      return;
    }
    await submitApplication({
      ...form,
      dateOfBirth: form.dateOfBirth || undefined,
      gender: form.gender || undefined,
      residentialArea: form.residentialArea || undefined,
      highSchool: form.highSchool || undefined,
      completionYear: form.completionYear || undefined,
      kcseGrade: form.kcseGrade || undefined,
      motivation: form.motivation || undefined,
      hopes: form.hopes || undefined,
      referralSource: form.referralSource || undefined,
    });
    setSubmitted(true);
    toast({ title: 'Application submitted', description: 'The admin team can now review and approve your Ignite application.', tone: 'success' });
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24">
        <div className="rounded-3xl border border-border bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold text-primary">Application Received</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Your Ignite application is now in the admin review queue. If approved, DICE will email you a portal invitation through Clerk.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-24">
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-display text-4xl font-bold text-primary md:text-5xl">Apply for Ignite</h1>
        <p className="text-lg text-muted">Submit your application for review. Student portal access is only opened after admin approval.</p>
      </div>

      <div className="rounded-2xl border border-border bg-white p-8 shadow-lg">
        <div className="mb-8 grid grid-cols-3 gap-2">
          {steps.map((label, index) => (
            <div key={label}>
              <div className={`h-2 rounded-full ${index <= step ? 'bg-accent' : 'bg-surface'}`} />
              <p className={`mt-2 text-xs font-semibold uppercase tracking-[0.18em] ${index === step ? 'text-accent' : 'text-muted-foreground'}`}>{label}</p>
            </div>
          ))}
        </div>

        <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
          {step === 0 ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Personal Information</h2>
              <Field label="Full Name" required><Input value={form.fullName} onChange={(event) => update('fullName', event.target.value)} placeholder="Enter your full name" /></Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Date of Birth"><Input type="date" value={form.dateOfBirth} onChange={(event) => update('dateOfBirth', event.target.value)} /></Field>
                <Field label="Gender">
                  <select value={form.gender} onChange={(event) => update('gender', event.target.value)} className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/50">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </Field>
              </div>
              <Field label="Email" required><Input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="example@gmail.com" /></Field>
              <Field label="Phone Number" required><Input type="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="+254 7XX XXX XXX" /></Field>
              <Field label="Residential Area"><Input value={form.residentialArea} onChange={(event) => update('residentialArea', event.target.value)} placeholder="Town, estate, or county" /></Field>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Education Background</h2>
              <Field label="High School" required><Input value={form.highSchool} onChange={(event) => update('highSchool', event.target.value)} placeholder="School attended" /></Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Completion Year" required><Input value={form.completionYear} onChange={(event) => update('completionYear', event.target.value)} placeholder="2025" /></Field>
                <Field label="KCSE Grade"><Input value={form.kcseGrade} onChange={(event) => update('kcseGrade', event.target.value)} placeholder="Optional" /></Field>
              </div>
              <Field label="How did you hear about Ignite?"><Input value={form.referralSource} onChange={(event) => update('referralSource', event.target.value)} placeholder="Church, friend, school, social media..." /></Field>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">Motivation</h2>
              <Field label="Why do you want to join Ignite?" required><Textarea className="min-h-36" value={form.motivation} onChange={(event) => update('motivation', event.target.value)} /></Field>
              <Field label="What do you hope to gain?"><Textarea className="min-h-28" value={form.hopes} onChange={(event) => update('hopes', event.target.value)} /></Field>
            </div>
          ) : null}

          <div className="mt-8 flex justify-between gap-4 border-t border-border pt-6">
            <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((current) => Math.max(current - 1, 0))}>Back</Button>
            {step < steps.length - 1 ? (
              <Button type="button" variant="primary" onClick={handleNext}>Next Step</Button>
            ) : (
              <Button type="button" variant="primary" onClick={handleSubmit}>Submit Application</Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-primary">{label}{required ? ' *' : ''}</span>
      {children}
    </label>
  );
}
