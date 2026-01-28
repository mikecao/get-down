import { useState } from 'react';
import { Moon, Settings as SettingsIcon, Sun } from 'lucide-react';
import { ColorPicker } from '@/components/ColorPicker';
import DropZone from '@/components/DropZone';
import Settings from '@/components/Settings';
import TabBar from '@/components/TabBar';
import TabPanel from '@/components/TabPanel';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { usePrimaryColor } from '@/lib/usePrimaryColor';
import { useSettingsStore } from '@/lib/settingsStore';
import { useTabsStore } from '@/lib/store';
import { useTheme } from '@/lib/useTheme';

function App() {
  const [showDrop, setShowDrop] = useState(false);
  const { tabs, activeTabId, addTab, closeTab, selectTab, renameTab, addDownload } = useTabsStore();
  const { theme, toggleTheme } = useTheme();
  const { colorName, setColorName } = usePrimaryColor();
  const { showSettings, toggleSettings } = useSettingsStore();

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const handleDrop = (value: string) => {
    setShowDrop(false);
    if (activeTabId) {
      addDownload(activeTabId, value);
    }
  };

  const handleDragEnter = () => {
    setShowDrop(true);
  };

  const handleDragLeave = () => {
    setShowDrop(false);
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col" onDragEnter={handleDragEnter}>
      <DropZone show={showDrop} onDrop={handleDrop} onLeave={handleDragLeave} />
      <div className="absolute top-0 right-0 flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </Button>
        <ColorPicker colorName={colorName} onColorChange={setColorName} />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSettings}
          className={showSettings ? 'bg-neutral-200 dark:bg-neutral-700' : ''}
          title={showSettings ? 'Close settings' : 'Open settings'}
        >
          <SettingsIcon size={16} />
        </Button>
      </div>
      <Tabs value={activeTabId} className="flex min-h-0 flex-1 flex-col">
        <TabBar
          tabs={tabs}
          onTabSelect={selectTab}
          onTabClose={closeTab}
          onTabAdd={addTab}
          onTabRename={renameTab}
        />
        {showSettings
          ? activeTab && (
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <Settings tabId={activeTab.id} />
              </div>
            )
          : tabs.map(tab => <TabPanel key={tab.id} tabId={tab.id} />)}
      </Tabs>
    </div>
  );
}

export default App;
