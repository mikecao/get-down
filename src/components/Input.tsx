import type { ChangeEventHandler, KeyboardEventHandler } from 'react';

interface InputProps {
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  className?: string;
  type?: string;
}

export default function Input({
  value,
  placeholder,
  readOnly,
  onChange,
  onKeyDown,
  className = '',
  type = 'text',
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      readOnly={readOnly}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className={`block py-2 px-4 border border-border dark:border-neutral-600 rounded outline-none flex-1 bg-white dark:bg-neutral-700 text-inherit font-mono text-xs ${className}`}
    />
  );
}
