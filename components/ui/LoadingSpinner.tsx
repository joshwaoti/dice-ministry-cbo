import { cn } from '@/lib/utils';

export function LoadingSpinner({ label = 'Loading', className }: { label?: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-3 text-sm font-medium text-primary', className)} role="status" aria-live="polite">
      <span className="relative grid h-8 w-8 place-items-center">
        <span className="absolute h-8 w-8 rounded-full border border-accent/25" />
        <span className="dice-spinner-orbit absolute h-8 w-8 rounded-full border-2 border-transparent border-t-accent border-r-primary/70" />
        <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_16px_rgba(246,172,85,0.55)]" />
      </span>
      <span>{label}</span>
    </span>
  );
}

export function LoadingState({
  label = 'Loading',
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex min-h-48 items-center justify-center rounded-2xl border border-border bg-white p-8 shadow-sm', className)}>
      <LoadingSpinner label={label} />
    </div>
  );
}
