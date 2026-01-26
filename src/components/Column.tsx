import type { ReactNode } from 'react';

interface ColumnProps {
  children?: ReactNode;
  width?: number;
  flex?: boolean;
  bold?: boolean;
}

export default function Column({ children, width, flex, bold }: ColumnProps) {
  return (
    <div
      className={`whitespace-nowrap p-[1.2rem] text-left ${bold ? 'font-bold' : ''} ${flex ? 'min-w-[50px] flex-1' : ''}`}
      style={width ? { width } : undefined}
    >
      {children}
    </div>
  );
}
