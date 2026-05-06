'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Tabs = BaseTabs.Root;

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof BaseTabs.List> {
  className?: string;
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(({ className, ...props }, ref) => (
  <BaseTabs.List
    ref={ref}
    className={cn('inline-flex h-9 items-center gap-2 text-muted-foreground', className)}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof BaseTabs.Tab> {
  className?: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, ...props }, ref) => (
    <BaseTabs.Tab
      ref={ref}
      className={cn(
        'inline-flex min-w-[140px] items-center justify-start whitespace-nowrap border-muted-foreground/40 border-b-2 py-1 font-medium text-sm transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:border-primary data-[active]:text-foreground',
        className,
      )}
      {...props}
    />
  ),
);
TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof BaseTabs.Panel> {
  className?: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, ...props }, ref) => (
    <BaseTabs.Panel
      ref={ref}
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    />
  ),
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
