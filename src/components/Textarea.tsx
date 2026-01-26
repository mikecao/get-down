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
      className={`block flex-1 rounded border border-border bg-white px-4 py-2 text-inherit outline-none dark:border-neutral-600 dark:bg-neutral-700 ${className}`}
    />
  );
}
