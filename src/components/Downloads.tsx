import type { Download as DownloadType } from '@/lib/store';
import Column from './Column';
import Download from './Download';

interface DownloadsProps {
  downloads: DownloadType[];
  onChange: (id: string, status: string) => void;
}

export default function Downloads({ downloads, onChange }: DownloadsProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded border border-border bg-surface dark:border-neutral-600 dark:bg-neutral-800">
      <div className="flex bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
        <Column flex bold>
          Name
        </Column>
        <Column width={120} bold>
          Status
        </Column>
        <Column width={120} bold>
          Progress
        </Column>
        <Column width={120} bold>
          Speed
        </Column>
        <Column width={120} bold>
          Size
        </Column>
        <Column width={50} bold />
      </div>
      <div className="flex flex-col overflow-y-auto overflow-x-hidden">
        {downloads.map(({ id, url }) => {
          return <Download key={id} url={url} onChange={status => onChange(id, status)} />;
        })}
      </div>
    </div>
  );
}
