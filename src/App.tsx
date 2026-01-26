import { Moon, Sun } from 'lucide-react';
import TabBar from '@/components/TabBar';
import TabPanel from '@/components/TabPanel';
import { useTabsStore } from '@/lib/store';
import { useTheme } from '@/lib/useTheme';

function App() {
  const { tabs, activeTabId, addTab, closeTab, selectTab } = useTabsStore();
  const { theme, toggleTheme } = useTheme();

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-0 right-0 rounded p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700"
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
      </button>
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabSelect={selectTab}
        onTabClose={closeTab}
        onTabAdd={addTab}
      />
      {activeTab && <TabPanel key={activeTab.id} tabId={activeTab.id} />}
    </div>
  );
}

export default App;
