import { Progress as BaseProgress } from '@base-ui/react/progress';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof BaseProgress.Root> {
  className?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, ...props }, ref) => (
    <BaseProgress.Root ref={ref} value={value} {...props}>
      <BaseProgress.Track
        className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', className)}
      >
        <BaseProgress.Indicator className="h-full w-[var(--progress-indicator-width)] bg-primary transition-all" />
      </BaseProgress.Track>
    </BaseProgress.Root>
  ),
);
Progress.displayName = 'Progress';

export { Progress };
