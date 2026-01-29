import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Dialog = BaseDialog.Root;

const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Trigger> & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return <BaseDialog.Trigger ref={ref} render={children} {...props} />;
  }
  return (
    <BaseDialog.Trigger ref={ref} {...props}>
      {children}
    </BaseDialog.Trigger>
  );
});
DialogTrigger.displayName = 'DialogTrigger';

const DialogPortal = BaseDialog.Portal;

const DialogBackdrop = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Backdrop>
>(({ className, ...props }, ref) => (
  <BaseDialog.Backdrop
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/50',
      'data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
      'transition-opacity duration-150',
      className,
    )}
    {...props}
  />
));
DialogBackdrop.displayName = 'DialogBackdrop';

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Popup>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogBackdrop />
    <BaseDialog.Popup
      ref={ref}
      className={cn(
        '-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-50',
        'w-full max-w-md rounded-lg border bg-background p-6 shadow-lg',
        'data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
        'data-[ending-style]:scale-95 data-[starting-style]:scale-95',
        'transition-all duration-150',
        className,
      )}
      {...props}
    >
      {children}
    </BaseDialog.Popup>
  </DialogPortal>
));
DialogContent.displayName = 'DialogContent';

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Title>
>(({ className, ...props }, ref) => (
  <BaseDialog.Title ref={ref} className={cn('font-semibold text-lg', className)} {...props} />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Description>
>(({ className, ...props }, ref) => (
  <BaseDialog.Description
    ref={ref}
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

const DialogClose = BaseDialog.Close;

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
