import { StudentLayoutWrapper } from '@/components/layout/StudentLayoutWrapper';

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudentLayoutWrapper>{children}</StudentLayoutWrapper>;
}
