'use client';

import { Button } from '@/components/ui/button';

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  return {
    totalPages,
    page: safePage,
    pageItems: items.slice((safePage - 1) * pageSize, safePage * pageSize),
  };
}

export function PaginationControls({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-4 border-t border-border px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalItems)} of {totalItems}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <Button className="w-full sm:w-auto" size="sm" variant="outline" disabled={page === 1} onClick={() => onPageChange(Math.max(1, page - 1))}>
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((entry) => (
          <Button key={entry} className="hidden sm:inline-flex" size="sm" variant={entry === page ? 'primary' : 'outline'} onClick={() => onPageChange(entry)}>
            {entry}
          </Button>
        ))}
        <Button className="w-full sm:w-auto" size="sm" variant="outline" disabled={page === totalPages} onClick={() => onPageChange(Math.min(totalPages, page + 1))}>
          Next
        </Button>
      </div>
    </div>
  );
}
