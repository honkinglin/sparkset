'use client';
import { RiArrowRightLine, RiDatabase2Line, RiFlashlightLine } from '@remixicon/react';

import Link from 'next/link';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from '@/components/ui/empty';
import { Button } from '@/components/ui/button';

interface QueryEmptyStateProps {
  type: 'datasource' | 'provider';
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
}

export function QueryEmptyState({
  type,
  title,
  description,
  actionText,
  actionLink,
}: QueryEmptyStateProps) {
  const icon =
    type === 'datasource' ? (
      <RiDatabase2Line className="h-8 w-8 text-blue-500" />
    ) : (
      <RiFlashlightLine className="h-8 w-8 text-yellow-500" />
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">{icon}</EmptyMedia>
          <EmptyDescription className="text-xl font-semibold text-foreground text-center mt-2">
            {title}
          </EmptyDescription>
          <p className="text-muted-foreground text-sm mt-2 text-center max-w-md">{description}</p>
        </EmptyHeader>
        <EmptyContent className="opacity-40">
          <span className="text-xs tracking-widest">•••</span>
        </EmptyContent>
      </Empty>
      <div className="mt-6">
        <Link href={actionLink} className="no-underline">
          <Button className="gap-2">
            {actionText}
            <RiArrowRightLine className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
