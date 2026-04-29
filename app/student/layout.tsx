import { StudentLayoutWrapper } from '@/components/layout/StudentLayoutWrapper';
import { PortalAuthGate } from '@/components/auth/PortalAuthGate';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalAuthGate kind="student">
      <StudentLayoutWrapper>{children}</StudentLayoutWrapper>
    </PortalAuthGate>
  );
}
