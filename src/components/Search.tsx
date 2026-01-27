import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Search({ onSubmit }: { onSubmit: (value: string) => void }) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value) {
      onSubmit(value);
      setValue('');
    }
  };

  const handleKey = (e: { key: string }) => {
    if (e.key === 'Enter') {
      onSubmit(value);
      setValue('');
    }
  };

  return (
    <div className="flex flex-1 items-center gap-2.5">
      <Input
        placeholder="Enter URL"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKey}
        className="flex-1"
      />
      <Button onClick={handleSubmit}>Download</Button>
    </div>
  );
}
