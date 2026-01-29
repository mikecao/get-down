import { Popover as BasePopover } from '@base-ui/react/popover';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Popover = BasePopover.Root;

interface PopoverTriggerProps extends React.ComponentPropsWithoutRef<typeof BasePopover.Trigger> {
  asChild?: boolean;
}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ asChild, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return <BasePopover.Trigger ref={ref} render={children} {...props} />;
    }
    return (
      <BasePopover.Trigger ref={ref} {...props}>
        {children}
      </BasePopover.Trigger>
    );
  },
);
PopoverTrigger.displayName = 'PopoverTrigger';

interface PopoverContentProps extends React.ComponentPropsWithoutRef<typeof BasePopover.Popup> {
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, align = 'center', sideOffset = 4, children, ...props }, ref) => (
    <BasePopover.Portal>
      <BasePopover.Positioner sideOffset={sideOffset} align={align}>
        <BasePopover.Popup
          ref={ref}
          className={cn(
            'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
            'data-[ending-style]:fade-out-0 data-[starting-style]:fade-in-0 data-[ending-style]:zoom-out-95 data-[starting-style]:zoom-in-95',
            className,
          )}
          {...props}
        >
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  ),
);
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent };
