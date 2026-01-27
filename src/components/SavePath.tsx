import { open } from '@tauri-apps/plugin-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    <div className="flex items-center gap-2.5 whitespace-nowrap">
      <div>Save to</div>
      <Input value={path} onChange={e => onChange(e.target.value)} readOnly className="flex-1" />
      <Button onClick={handleOpen}>Select</Button>
    </div>
  );
}
