import Downloads from '@/components/Downloads';
import SavePath from '@/components/SavePath';
import Search from '@/components/Search';
import Settings from '@/components/Settings';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTabsStore } from '@/lib/store';

interface TabPanelProps {
  tabId: string;
}

function TabPanel({ tabId }: TabPanelProps) {
  const { tabs, addDownload, updateDownloadStatus, removeDownload, clearCompleted, setSavePath } =
    useTabsStore();

  const tab = tabs.find(t => t.id === tabId);
  if (!tab) return null;

  const { downloads, savePath, settings } = tab;

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
    <TabsContent value={tabId} className="relative flex min-h-0 flex-1 flex-col gap-4">
      <Tabs defaultValue="downloads" className="flex min-h-0 flex-1 flex-col">
        <TabsList className="h-8 shrink-0 gap-8">
          <TabsTrigger value="downloads" className="min-w-0 px-0">
            Downloads
          </TabsTrigger>
          <TabsTrigger value="settings" className="min-w-0 px-0">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="downloads" className="mt-0 flex min-h-0 flex-1 flex-col gap-4">
          <div className="flex shrink-0 gap-2.5">
            <Search onSubmit={handleSubmit} />
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">
            <Downloads
              downloads={downloads}
              settings={settings}
              savePath={savePath}
              onChange={handleChange}
              onRemove={handleRemove}
            />
          </div>
          <div className="flex h-14 shrink-0 items-center justify-between gap-2.5 bg-background">
            <SavePath path={savePath} onChange={handleSavePathChange} />
            <Button onClick={handleClear}>Clear completed</Button>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-0 min-h-0 flex-1 overflow-hidden">
          <div className="flex h-full flex-col overflow-hidden">
            <Settings tabId={tabId} />
          </div>
        </TabsContent>
      </Tabs>
    </TabsContent>
  );
}

export default TabPanel;
