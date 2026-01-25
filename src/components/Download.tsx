import { Command } from '@tauri-apps/plugin-shell';
import classNames from 'classnames';
import debug from 'debug';
import { useEffect, useRef, useState } from 'react';
import ProgressBar from '@/components/ProgressBar';
import { COMPLETE, DOWNLOADING, ERROR, LOADING, SAVE_PATH } from '@/lib/constants';
import styles from './Download.module.css';

const log = debug('ui:download');
log.log = console.log.bind(console);

export default function Download({
  url,
  onChange,
}: {
  url: string;
  onChange: (value: string) => void;
}) {
  const [state, setState] = useState({
    name: url,
    status: LOADING,
    size: '--',
    speed: '--',
    progress: '0',
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
    setOutput(prev => [...prev, { id: outputId.current++, text: line }]);
  }

  function stderr(line: string) {
    log(`stderr: ${line}`);
    setOutput(prev => [...prev, { id: outputId.current++, text: line }]);
  }

  useEffect(() => {
    async function spawn() {
      const command = Command.sidecar('binaries/yt-dlp', [
        url,
        '-o',
        `${path}/%(title)s.%(ext)s`,
        '--no-mtime',
        '--no-overwrites',
      ]);

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

    if (url && !pid.current) {
      pid.current = 1;
      spawn();
    }
  }, [url]);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div>
          <div className={styles.name}>{name}</div>
        </div>
        <div>
          <span
            className={classNames(styles.status, {
              [styles.error]: status === ERROR,
              [styles.complete]: status === COMPLETE,
            })}
          >
            {status}
          </span>
        </div>
        <div>{+progress > 0 ? <ProgressBar progress={progress} /> : '--'}</div>
        <div>{speed}</div>
        <div>{size}</div>
        <div>
          <button
            type="button"
            className={classNames(styles.terminal, { [styles.terminalActive]: expanded })}
            onClick={() => setExpanded(prev => !prev)}
            title="Toggle output"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
          </button>
        </div>
      </div>
      {expanded && (
        <div className={styles.output}>
          {output.map(line => (
            <div key={line.id}>{line.text}</div>
          ))}
        </div>
      )}
    </div>
  );
}
