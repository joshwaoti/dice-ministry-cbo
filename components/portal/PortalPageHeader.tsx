import { cn } from '@/lib/utils';

export function PortalPageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-4 sm:gap-5 md:flex-row md:items-end md:justify-between', className)}>
      <div className="min-w-0 space-y-2">
        {eyebrow ? (
          <p className="break-words text-xs font-semibold uppercase tracking-[0.18em] text-accent sm:tracking-[0.28em]">{eyebrow}</p>
        ) : null}
        <h1 className="break-words font-display text-2xl font-bold leading-tight text-primary sm:text-3xl">{title}</h1>
        {description ? <p className="max-w-3xl break-words text-sm leading-6 text-muted-foreground sm:text-base">{description}</p> : null}
      </div>
      {actions ? <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 [&>button]:w-full [&>a]:w-full sm:[&>button]:w-auto sm:[&>a]:w-auto">{actions}</div> : null}
    </div>
  );
}
