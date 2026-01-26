import { produce } from 'immer';
import md5 from 'md5';
import { useState } from 'react';
import Button from '@/components/Button';
import Downloads from '@/components/Downloads';
import DropZone from '@/components/DropZone';
import SavePath from '@/components/SavePath';
import Search from '@/components/Search';
import { COMPLETE, ERROR } from '@/lib/constants';

export interface Download {
  id: string;
  url: string;
  status?: string;
}

interface TabPanelProps {
  downloads: Download[];
  savePath: string;
  onDownloadsChange: (downloads: Download[]) => void;
  onSavePathChange: (path: string) => void;
}

function TabPanel({ downloads, savePath, onDownloadsChange, onSavePathChange }: TabPanelProps) {
  const [showDrop, setShowDrop] = useState(false);

  const handleSubmit = (value: string) => {
    onDownloadsChange(
      downloads.concat({
        id: md5(String(Date.now())),
        url: value,
      }),
    );
  };

  const handleChange = (id: string, status: string) => {
    onDownloadsChange(
      produce(downloads, draft => {
        const item = draft.find(download => download.id === id);
        if (item) {
          item.status = status;
        }
        return draft;
      }),
    );
  };

  const handleClear = () => {
    onDownloadsChange(
      downloads.filter(({ status }) => {
        return status !== ERROR && status !== COMPLETE;
      }),
    );
  };

  const handleDrop = (value: string) => {
    setShowDrop(false);
    handleSubmit(value);
  };

  const handleEnter = () => {
    setShowDrop(true);
  };

  const handleLeave = () => {
    setShowDrop(false);
  };

  return (
    <div className="flex flex-col gap-2.5 flex-1 relative" onDragEnter={handleEnter}>
      <DropZone show={showDrop} onDrop={handleDrop} onLeave={handleLeave} />
      <div className="flex gap-2.5">
        <Search onSubmit={handleSubmit} />
      </div>
      <div className="flex flex-col flex-1 min-h-0 overflow-auto">
        <Downloads downloads={downloads} onChange={handleChange} />
      </div>
      <div className="flex items-center justify-between gap-2.5">
        <SavePath path={savePath} onChange={onSavePathChange} />
        <Button onClick={handleClear}>Clear completed</Button>
      </div>
    </div>
  );
}

export default TabPanel;
