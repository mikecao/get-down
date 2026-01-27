import type { DragEvent } from 'react';
import { cn } from '@/lib/utils';
import download from '../assets/download.svg';

interface DropZoneProps {
  show: boolean;
  onDrop: (value: string) => void;
  onLeave: (e: DragEvent<HTMLDivElement>) => void;
}

export default function DropZone({ show, onDrop, onLeave }: DropZoneProps) {
  if (!show) {
    return null;
  }

  return (
    <div
      className={cn(
        'absolute inset-0 z-[100] m-auto backdrop-blur-[4px]',
        "before:pointer-events-none before:absolute before:inset-0 before:m-auto before:bg-white before:opacity-25 before:content-[''] dark:before:bg-black",
      )}
      onDragLeave={onLeave}
    >
      <img
        src={download}
        alt=""
        className={cn(
          '-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 mx-auto h-[100px] w-[100px] dark:invert',
        )}
      />
      <textarea className="h-full w-full opacity-0" onChange={e => onDrop(e.target.value)} />
    </div>
  );
}
