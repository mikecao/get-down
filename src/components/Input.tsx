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
      className={`block flex-1 rounded border border-border bg-white px-4 py-2 text-inherit outline-none dark:border-neutral-600 dark:bg-neutral-700 ${className}`}
    />
  );
}
