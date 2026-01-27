import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Download as DownloadType, Settings } from '@/lib/store';
import Download from './Download';

interface DownloadsProps {
  downloads: DownloadType[];
  settings: Settings;
  onChange: (id: string, status: string) => void;
}

export default function Downloads({ downloads, settings, onChange }: DownloadsProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded border border-border bg-surface dark:border-neutral-600 dark:bg-neutral-800">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-100 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-900">
            <TableHead className="min-w-[50px] flex-1">Name</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[120px]">Progress</TableHead>
            <TableHead className="w-[120px]">Speed</TableHead>
            <TableHead className="w-[120px]">Size</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-y-auto overflow-x-hidden">
          {downloads.map(({ id, url }) => {
            return (
              <Download
                key={id}
                url={url}
                settings={settings}
                onChange={status => onChange(id, status)}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
