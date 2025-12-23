'use client';

import { RiAddLine, RiDashboardLine } from '@remixicon/react';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface DashboardEmptyStateProps {
  onAddWidget: () => void;
}

export function DashboardEmptyState({ onAddWidget }: DashboardEmptyStateProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <RiDashboardLine className="h-8 w-8 text-primary" />
          </EmptyMedia>
          <EmptyDescription className="text-xl font-semibold text-foreground text-center mt-2">
            {t('No Widgets')}
          </EmptyDescription>
          <p className="text-muted-foreground text-sm mt-2 text-center max-w-md">
            {t('Add your first widget to start visualizing data')}
          </p>
        </EmptyHeader>
        <EmptyContent className="opacity-40">
          <span className="text-xs tracking-widest">•••</span>
        </EmptyContent>
      </Empty>
      <div className="mt-6">
        <Button onClick={onAddWidget} className="gap-2">
          <RiAddLine className="h-4 w-4" />
          {t('Add Widget')}
        </Button>
      </div>
    </div>
  );
}
