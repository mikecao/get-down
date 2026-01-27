import { Moon, Settings as SettingsIcon, Sun } from 'lucide-react';
import Settings from '@/components/Settings';
import TabBar from '@/components/TabBar';
import TabPanel from '@/components/TabPanel';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { useSettingsStore } from '@/lib/settingsStore';
import { useTabsStore } from '@/lib/store';
import { useTheme } from '@/lib/useTheme';

function App() {
  const { tabs, activeTabId, addTab, closeTab, selectTab, renameTab } = useTabsStore();
  const { theme, toggleTheme } = useTheme();
  const { showSettings, toggleSettings } = useSettingsStore();

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="absolute top-0 right-0 flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </Button>
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
          activeTabId={activeTabId}
          onTabSelect={selectTab}
          onTabClose={closeTab}
          onTabAdd={addTab}
          onTabRename={renameTab}
        />
        {showSettings
          ? activeTab && <Settings tabId={activeTab.id} />
          : tabs.map(tab => <TabPanel key={tab.id} tabId={tab.id} />)}
      </Tabs>
    </div>
  );
}

export default App;
