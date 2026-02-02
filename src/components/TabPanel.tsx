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
    <TabsContent value={tabId} className="relative flex flex-1 flex-col gap-2.5">
      {showSettings ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-auto">
          <Settings tabId={tabId} />
        </div>
      ) : (
        <>
          <div className="flex gap-2.5">
            <Search onSubmit={handleSubmit} />
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-auto">
            <Downloads
              downloads={downloads}
              settings={settings}
              onChange={handleChange}
              onRemove={handleRemove}
            />
          </div>
        </>
      )}
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleSettings(tabId)}
            className={showSettings ? 'bg-neutral-200 dark:bg-neutral-700' : ''}
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
