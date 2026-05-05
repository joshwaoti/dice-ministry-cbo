import { AdminLayoutWrapper } from '@/components/layout/AdminLayoutWrapper';
import { PortalAuthGate } from '@/components/auth/PortalAuthGate';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalAuthGate kind="admin">
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </PortalAuthGate>
  );
}
