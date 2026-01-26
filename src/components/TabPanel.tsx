import { useState } from 'react';
import Button from '@/components/Button';
import Downloads from '@/components/Downloads';
import DropZone from '@/components/DropZone';
import SavePath from '@/components/SavePath';
import Search from '@/components/Search';
import { useTabsStore } from '@/lib/store';

interface TabPanelProps {
  tabId: string;
}

function TabPanel({ tabId }: TabPanelProps) {
  const [showDrop, setShowDrop] = useState(false);
  const { tabs, addDownload, updateDownloadStatus, clearCompleted, setSavePath } = useTabsStore();

  const tab = tabs.find(t => t.id === tabId);
  if (!tab) return null;

  const { downloads, savePath, settings } = tab;

  const handleSubmit = (url: string) => {
    addDownload(tabId, url);
  };

  const handleChange = (downloadId: string, status: string) => {
    updateDownloadStatus(tabId, downloadId, status);
  };

  const handleClear = () => {
    clearCompleted(tabId);
  };

  const handleSavePathChange = (path: string) => {
    setSavePath(tabId, path);
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
    <div className="relative flex flex-1 flex-col gap-2.5" onDragEnter={handleEnter}>
      <DropZone show={showDrop} onDrop={handleDrop} onLeave={handleLeave} />
      <div className="flex gap-2.5">
        <Search onSubmit={handleSubmit} />
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-auto">
        <Downloads downloads={downloads} settings={settings} onChange={handleChange} />
      </div>
      <div className="flex items-center justify-between gap-2.5">
        <SavePath path={savePath} onChange={handleSavePathChange} />
        <Button onClick={handleClear}>Clear completed</Button>
      </div>
    </div>
  );
}

export default TabPanel;
