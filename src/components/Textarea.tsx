import type { ChangeEventHandler } from 'react';

interface TextareaProps {
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  className?: string;
}

export default function Textarea({
  value,
  placeholder,
  readOnly,
  onChange,
  className = '',
}: TextareaProps) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      readOnly={readOnly}
      onChange={onChange}
      className={`block py-2 px-4 border border-border dark:border-neutral-600 rounded outline-none flex-1 bg-white dark:bg-neutral-700 text-inherit font-mono text-xs ${className}`}
    />
  );
}
