import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Download as DownloadType, Settings } from '@/lib/store';
import Download from './Download';

interface DownloadsProps {
  downloads: DownloadType[];
  settings: Settings;
  onChange: (id: string, status: string) => void;
  onRemove: (id: string) => void;
}

export default function Downloads({ downloads, settings, onChange, onRemove }: DownloadsProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded border border-border bg-surface dark:border-neutral-600 dark:bg-neutral-800">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="bg-neutral-100 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-900">
            <TableHead className="px-4">Name</TableHead>
            <TableHead className="w-[100px] px-4">Status</TableHead>
            <TableHead className="w-[140px] px-4">Progress</TableHead>
            <TableHead className="w-[100px] px-4">Speed</TableHead>
            <TableHead className="w-[80px] px-4">Size</TableHead>
            <TableHead className="w-[80px] px-4" />
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto overflow-x-hidden">
          {downloads.map(({ id, url, status }) => {
            return (
              <Download
                key={id}
                url={url}
                initialStatus={status}
                settings={settings}
                onChange={status => onChange(id, status)}
                onRemove={() => onRemove(id)}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
