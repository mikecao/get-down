import { Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAppInfo } from '@/lib/appInfo';

export function AboutDialog() {
  const { appVersion, ytDlpVersion } = useAppInfo();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="About">
          <Info size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex items-center justify-between">
          <DialogTitle>About</DialogTitle>
          <DialogClose>
            <Button variant="ghost" size="icon" title="Close">
              <X size={16} />
            </Button>
          </DialogClose>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Get Down</span>
            <span className="text-muted-foreground text-sm">Version {appVersion || '...'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold">yt-dlp</span>
            <span className="text-muted-foreground text-sm">Version {ytDlpVersion || '...'}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
