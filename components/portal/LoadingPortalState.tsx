export function LoadingPortalState({ label = 'Loading portal data...' }: { label?: string }) {
  return (
    <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
      <div className="mx-auto h-28 w-48 animate-pulse rounded-3xl bg-surface" />
      <p className="mt-5 text-center text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
