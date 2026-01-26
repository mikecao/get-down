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
      className={`text-left p-[1.2rem] whitespace-nowrap ${bold ? 'font-bold' : ''} ${flex ? 'flex-1 min-w-[50px]' : ''}`}
      style={width ? { width } : undefined}
    >
      {children}
    </div>
  );
}
