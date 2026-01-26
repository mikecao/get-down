import type { MouseEventHandler, ReactNode } from 'react';

export default function Button({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button type="button" className="" onClick={onClick}>
      {children}
    </button>
  );
}
