import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Download as DownloadType, Settings } from '@/lib/store';
import Download from './Download';

interface DownloadsProps {
  downloads: DownloadType[];
  settings: Settings;
  savePath: string;
  onChange: (id: string, status: string) => void;
  onRemove: (id: string) => void;
}

export default function Downloads({
  downloads,
  settings,
  savePath,
  onChange,
  onRemove,
}: DownloadsProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 z-10">
                Name
              </TableHead>
              <TableHead className="sticky top-0 z-10 w-[100px]">
                Status
              </TableHead>
              <TableHead className="sticky top-0 z-10 w-[140px]">
                Progress
              </TableHead>
              <TableHead className="sticky top-0 z-10 w-[100px]">
                Speed
              </TableHead>
              <TableHead className="sticky top-0 z-10 w-[80px]">
                Size
              </TableHead>
              <TableHead className="sticky top-0 z-10 w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {downloads.map(({ id, url, status }) => {
              return (
                <Download
                  key={id}
                  url={url}
                  initialStatus={status}
                  settings={settings}
                  savePath={savePath}
                  onChange={status => onChange(id, status)}
                  onRemove={() => onRemove(id)}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
