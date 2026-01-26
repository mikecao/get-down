import type { MouseEventHandler, ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({ children, onClick, className = '', title, type = 'button' }: ButtonProps) {
  return (
    <button
      type={type}
      title={title}
      className={`py-2 px-4 bg-surface dark:bg-neutral-700 border border-border dark:border-neutral-600 rounded whitespace-nowrap cursor-pointer text-inherit font-mono text-xs hover:bg-white dark:hover:bg-neutral-600 active:bg-surface dark:active:bg-neutral-700 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
