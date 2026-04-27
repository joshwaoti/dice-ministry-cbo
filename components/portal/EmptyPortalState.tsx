import { Button } from '@/components/ui/button';
import { PortalIllustration } from '@/components/portal/PortalIllustration';

export function EmptyPortalState({
  variant,
  title,
  description,
  actionLabel,
  action,
}: {
  variant: 'students' | 'documents' | 'users' | 'learning' | 'messages';
  title: string;
  description: string;
  actionLabel?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-white px-6 py-8 text-center shadow-sm">
      <PortalIllustration variant={variant} className="mx-auto h-40 w-auto" />
      <h3 className="mt-4 font-display text-2xl font-bold text-primary">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      {actionLabel ? <div className="mt-5"><Button variant="outline">{actionLabel}</Button></div> : null}
      {action}
    </div>
  );
}
