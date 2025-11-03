import { open } from '@tauri-apps/plugin-dialog';
import styles from './SavePath.module.css';

export default function SavePath({
  path,
  onChange,
}: {
  path: string;
  onChange: (value: string) => void;
}) {
  const handleOpen = async () => {
    const value = await open({ directory: true });

    if (value) {
      onChange(value);
    }
  };

  return (
    <div className={styles.container}>
      <div>Save to</div>
      <input type="text" value={path} onChange={e => onChange(e.target.value)} readOnly={true} />
      <button onClick={handleOpen}>Select</button>
    </div>
  );
}
