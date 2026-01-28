import { Command } from '@tauri-apps/plugin-shell';
import debug from 'debug';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TableCell, TableRow } from '@/components/ui/table';
import { COMPLETE, DOWNLOADING, ERROR, LOADING, SAVE_PATH } from '@/lib/constants';
import { buildYtDlpArgs } from '@/lib/settingsStore';
import type { Settings } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Terminal } from 'lucide-react';

const log = debug('ui:download');
log.log = console.log.bind(console);

export default function Download({
  url,
  initialStatus,
  settings,
  onChange,
}: {
  url: string;
  initialStatus?: string;
  settings: Settings;
  onChange: (value: string) => void;
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
  const path = localStorage.getItem(SAVE_PATH) || '.';
  const pid = useRef(0);
  const outputId = useRef(0);

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
    }

    if (url && !pid.current && initialStatus !== COMPLETE && initialStatus !== ERROR) {
      pid.current = 1;
      spawn();
    }
  }, [url, initialStatus]);

  const getStatusClasses = () => {
    const base = 'p-1 rounded font-bold';
    if (status === ERROR)
      return cn(base, 'bg-error-bg text-error dark:bg-error dark:text-error-bg');
    if (status === COMPLETE)
      return cn(base, 'bg-success-bg text-success dark:bg-success dark:text-success-bg');
    return base;
  };

  return (
    <>
      <TableRow className="bg-white dark:bg-neutral-800">
        <TableCell className="truncate p-[1.2rem]">{name}</TableCell>
        <TableCell className="p-[1.2rem]">
          <span className={getStatusClasses()}>{status}</span>
        </TableCell>
        <TableCell className="p-[1.2rem]">
          {+progress > 0 ? (
            <div className="flex items-center gap-2.5">
              <Progress value={Number(progress)} className="w-[50px]" />
              <div>{progress}%</div>
            </div>
          ) : (
            '--'
          )}
        </TableCell>
        <TableCell className="p-[1.2rem]">{speed}</TableCell>
        <TableCell className="p-[1.2rem]">{size}</TableCell>
        <TableCell className="p-[1.2rem]">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(prev => !prev)}
            title="Toggle output"
            className={cn(
              'h-6 w-6 text-neutral-500 dark:text-neutral-400',
              expanded &&
                'bg-neutral-200 text-neutral-700 dark:bg-neutral-600 dark:text-neutral-200',
            )}
          >
            <Terminal size={16} />
          </Button>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={6} className="p-0">
            <div className="max-h-[200px] overflow-y-auto whitespace-pre-wrap break-all bg-terminal p-3 font-mono text-terminal-text">
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
