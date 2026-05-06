import type { Child } from '@tauri-apps/plugin-shell';
import { Command, open as openShell } from '@tauri-apps/plugin-shell';
import debug from 'debug';
import { Terminal, X } from 'lucide-react';
import { type MouseEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TableCell, TableRow } from '@/components/ui/table';
import { CANCELLED, COMPLETE, DOWNLOADING, ERROR, LOADING } from '@/lib/constants';
import { buildYtDlpArgs } from '@/lib/settingsStore';
import type { Settings } from '@/lib/store';
import { cn } from '@/lib/utils';

const log = debug('ui:download');
log.log = console.log.bind(console);

export default function Download({
  url,
  initialStatus,
  settings,
  savePath,
  onChange,
  onRemove,
}: {
  url: string;
  initialStatus?: string;
  settings: Settings;
  savePath: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}) {
  const [state, setState] = useState({
    name: url,
    status: initialStatus || LOADING,
    size: '--',
    speed: '--',
    progress: initialStatus === COMPLETE ? '100' : '0',
  });
  const [output, setOutput] = useState<{ id: number; text: string }[]>([]);
  const [expanded, setExpanded] = useState(false);
  const { name, status, size, speed, progress } = state;
  const path = savePath || '.';
  const pid = useRef(0);
  const childRef = useRef<Child | null>(null);
  const outputId = useRef(0);
  const outputRef = useRef<HTMLDivElement | null>(null);

  function stdout(line: string) {
    const name = line.match(/Destination:\s+(.*)/);
    if (name) {
      setState(state => ({ ...state, name: name[1] }));
    }

    const progress = line.match(/([\d.]+)% of/);
    if (progress) {
      setState(state => ({ ...state, progress: progress[1] }));
    }

    const size = line.match(/([\d.]+[KMG]iB)/);
    if (size) {
      setState(state => ({ ...state, size: size[1] }));
    }

    const speed = line.match(/at\s+([\d.]+[\w/]+)/);
    if (speed) {
      setState(state => ({ ...state, speed: speed[1], status: DOWNLOADING }));
    }

    log(`stdout: ${line}`);
    if (!/^\[download\]\s+[\d.]+%/.test(line)) {
      setOutput(prev => [...prev, { id: outputId.current++, text: line }]);
    }
  }

  function stderr(line: string) {
    log(`stderr: ${line}`);
    setOutput(prev => [...prev, { id: outputId.current++, text: line }]);
  }

  useEffect(() => {
    async function spawn() {
      const args = buildYtDlpArgs(settings, url, path);
      const command = Command.sidecar('binaries/yt-dlp', args);

      command.on('close', data => {
        log({ close: data });
        const status = data?.code ? ERROR : COMPLETE;
        setState(state => ({ ...state, status }));
        onChange(status);
      });

      command.on('error', error => {
        log({ error });
      });

      command.stdout.on('data', stdout);
      command.stderr.on('data', stderr);

      const child = await command.spawn();
      log(`pid: ${child.pid}`);

      pid.current = child.pid;
      childRef.current = child;
    }

    if (url && !pid.current && initialStatus !== COMPLETE && initialStatus !== ERROR) {
      pid.current = 1;
      spawn();
    }
  }, [url, initialStatus]);

  useEffect(() => {
    if (!expanded || !outputRef.current) {
      return;
    }

    outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [expanded, output.length]);

  const handleRemove = async () => {
    const isInProgress = status === LOADING || status === DOWNLOADING;
    if (isInProgress && childRef.current) {
      log('Cancelled manually');
      await childRef.current.kill();
      setState(state => ({ ...state, status: CANCELLED }));
      onChange(CANCELLED);
    }
    onRemove();
  };

  const handleOpenLink = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    try {
      await openShell(url);
    } catch (error) {
      log({ open: error });
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="truncate py-2">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            onClick={handleOpenLink}
            className="block truncate hover:text-primary hover:underline"
            title={name}
          >
            {name}
          </a>
        </TableCell>
        <TableCell className="py-2">
          <span>{status}</span>
        </TableCell>
        <TableCell className="py-2">
          {+progress > 0 ? (
            <div className="flex items-center gap-2.5">
              <Progress value={Number(progress)} className="w-[50px]" />
              <div>{progress}%</div>
            </div>
          ) : (
            '--'
          )}
        </TableCell>
        <TableCell className="py-2">{speed}</TableCell>
        <TableCell className="py-2">{size}</TableCell>
        <TableCell className="py-2">
          <div className="flex justify-end gap-1">
            {output.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setExpanded(prev => !prev)}
                title="Toggle output"
                className={cn(
                  'h-6 w-6 text-neutral-500 dark:text-neutral-400',
                  expanded && 'text-neutral-700 dark:text-neutral-200',
                )}
              >
                <Terminal size={16} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              title={status === LOADING || status === DOWNLOADING ? 'Cancel download' : 'Remove'}
              className="h-6 w-6 text-neutral-500 hover:text-primary dark:text-neutral-400 dark:hover:text-primary"
            >
              <X size={16} />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={6} className="p-0">
            <div
              ref={outputRef}
              className="max-h-[200px] overflow-y-auto whitespace-pre-wrap break-all rounded-b-md border-white/6 border-t bg-terminal p-3 font-mono text-terminal-text"
            >
              {output.map(line => (
                <div key={line.id} className="leading-[1.4]">
                  {line.text}
                </div>
              ))}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
