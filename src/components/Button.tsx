import type { MouseEventHandler, ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  onClick,
  className = '',
  title,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      title={title}
      className={`cursor-pointer whitespace-nowrap rounded border border-border bg-surface px-3 py-2 text-inherit hover:bg-white active:bg-surface dark:border-neutral-600 dark:bg-neutral-700 dark:active:bg-neutral-700 dark:hover:bg-neutral-600 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
