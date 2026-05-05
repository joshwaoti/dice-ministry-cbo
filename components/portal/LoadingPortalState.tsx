import { LoadingState } from '@/components/ui/LoadingSpinner';

export function LoadingPortalState({ label = 'Loading portal data...' }: { label?: string }) {
  return <LoadingState label={label} className="min-h-40 rounded-3xl" />;
}
