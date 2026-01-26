import { Moon, Settings as SettingsIcon, Sun } from 'lucide-react';
import Settings from '@/components/Settings';
import TabBar from '@/components/TabBar';
import TabPanel from '@/components/TabPanel';
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
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
        <button
          type="button"
          onClick={toggleSettings}
          className={`rounded p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 ${showSettings ? 'bg-neutral-200 dark:bg-neutral-700' : ''}`}
          title={showSettings ? 'Close settings' : 'Open settings'}
        >
          <SettingsIcon size={16} />
        </button>
      </div>
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
        : activeTab && <TabPanel key={activeTab.id} tabId={activeTab.id} />}
    </div>
  );
}

export default App;
