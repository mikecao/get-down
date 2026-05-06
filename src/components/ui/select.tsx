import { Select as BaseSelect } from '@base-ui/react/select';
import { Check, ChevronDown } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Select = (props: React.ComponentPropsWithoutRef<typeof BaseSelect.Root>) => (
  <BaseSelect.Root modal={false} {...props} />
);

const SelectGroup = BaseSelect.Group;

const SelectValue = BaseSelect.Value;

interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof BaseSelect.Trigger> {
  className?: string;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <BaseSelect.Trigger
      ref={ref}
      className={cn(
        'flex h-9 w-full max-w-[240px] items-center justify-between whitespace-nowrap border-b border-input bg-transparent px-0 py-2 text-sm transition-colors focus:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        className,
      )}
      {...props}
    >
      {children}
      <BaseSelect.Icon>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  ),
);
SelectTrigger.displayName = 'SelectTrigger';

interface SelectContentProps extends React.ComponentPropsWithoutRef<typeof BaseSelect.Popup> {
  className?: string;
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => (
    <BaseSelect.Portal>
      <BaseSelect.Positioner className="z-50" sideOffset={4} alignItemWithTrigger={false} align="start">
        <BaseSelect.Popup
          ref={ref}
          className={cn(
            'z-50 max-h-96 max-w-[240px] min-w-[8rem] overflow-y-auto overflow-x-hidden border bg-popover p-1 text-popover-foreground shadow-md',
            'data-[ending-style]:fade-out-0 data-[starting-style]:fade-in-0 data-[ending-style]:zoom-out-95 data-[starting-style]:zoom-in-95',
            className,
          )}
          {...props}
        >
          {children}
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  ),
);
SelectContent.displayName = 'SelectContent';

interface SelectLabelProps extends React.ComponentPropsWithoutRef<typeof BaseSelect.GroupLabel> {
  className?: string;
}

const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, ...props }, ref) => (
    <BaseSelect.GroupLabel
      ref={ref}
      className={cn('px-2 py-1.5 font-semibold text-sm', className)}
      {...props}
    />
  ),
);
SelectLabel.displayName = 'SelectLabel';

interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof BaseSelect.Item> {
  className?: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, ...props }, ref) => (
    <BaseSelect.Item
      ref={ref}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        <BaseSelect.ItemIndicator>
          <Check className="h-4 w-4" />
        </BaseSelect.ItemIndicator>
      </span>
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
    </BaseSelect.Item>
  ),
);
SelectItem.displayName = 'SelectItem';

interface SelectSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />
  ),
);
SelectSeparator.displayName = 'SelectSeparator';

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
