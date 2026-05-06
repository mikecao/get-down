import { Settings as SettingsIcon } from 'lucide-react';
import Downloads from '@/components/Downloads';
import SavePath from '@/components/SavePath';
import Search from '@/components/Search';
import Settings from '@/components/Settings';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { useSettingsStore } from '@/lib/settingsStore';
import { useTabsStore } from '@/lib/store';

interface TabPanelProps {
  tabId: string;
}

function TabPanel({ tabId }: TabPanelProps) {
  const { tabs, addDownload, updateDownloadStatus, removeDownload, clearCompleted, setSavePath } =
    useTabsStore();
  const { settingsOpenForTabId, toggleSettings } = useSettingsStore();

  const tab = tabs.find(t => t.id === tabId);
  if (!tab) return null;

  const { downloads, savePath, settings } = tab;
  const showSettings = settingsOpenForTabId === tabId;

  const handleSubmit = (url: string) => {
    addDownload(tabId, url);
  };

  const handleChange = (downloadId: string, status: string) => {
    updateDownloadStatus(tabId, downloadId, status);
  };

  const handleRemove = (downloadId: string) => {
    removeDownload(tabId, downloadId);
  };

  const handleClear = () => {
    clearCompleted(tabId);
  };

  const handleSavePathChange = (path: string) => {
    setSavePath(tabId, path);
  };

  return (
    <TabsContent
      value={tabId}
      className="relative flex min-h-0 flex-1 flex-col gap-4 overflow-hidden"
    >
      <div className="flex shrink-0 gap-2.5">
        <Search onSubmit={handleSubmit} />
      </div>
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <Downloads
          downloads={downloads}
          settings={settings}
          savePath={savePath}
          onChange={handleChange}
          onRemove={handleRemove}
        />
        <div
          className={`absolute inset-0 z-10 border-t-2 border-primary bg-background transition-transform duration-300 ease-in-out ${
            showSettings ? 'translate-y-0' : 'translate-y-[calc(100%-6px)]'
          }`}
        >
          <div className="flex h-full flex-col overflow-auto">
            <Settings tabId={tabId} />
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleSettings(tabId)}
            className={showSettings ? 'opacity-100' : ''}
            title={showSettings ? 'Close settings' : 'Open settings'}
          >
            <SettingsIcon size={16} />
          </Button>
          <SavePath path={savePath} onChange={handleSavePathChange} />
        </div>
        <Button onClick={handleClear}>Clear completed</Button>
      </div>
    </TabsContent>
  );
}

export default TabPanel;
