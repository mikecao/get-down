import md5 from 'md5';
import { useEffect, useState } from 'react';
import TabBar from '@/components/TabBar';
import TabPanel, { type Download } from '@/components/TabPanel';
import { SAVE_PATH, TABS_STORAGE_KEY } from '@/lib/constants';
import styles from './App.module.css';

interface Tab {
  id: string;
  name: string;
  downloads: Download[];
  savePath: string;
}

interface TabsState {
  tabs: Tab[];
  activeTabId: string;
}

function createTab(name: string, savePath: string): Tab {
  return {
    id: md5(String(Date.now()) + Math.random()),
    name,
    downloads: [],
    savePath,
  };
}

function loadTabsFromStorage(): TabsState {
  try {
    const stored = localStorage.getItem(TABS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.tabs?.length > 0) {
        // Filter out active downloads on load (they're ephemeral)
        const tabs = parsed.tabs.map((tab: Tab) => ({
          ...tab,
          downloads: tab.downloads.filter(
            (d: Download) => d.status === 'Complete' || d.status === 'Error',
          ),
        }));
        return {
          tabs,
          activeTabId: parsed.activeTabId || tabs[0].id,
        };
      }
    }
  } catch {
    // Ignore parse errors
  }

  const defaultSavePath = localStorage.getItem(SAVE_PATH) || '';
  const defaultTab = createTab('Tab 1', defaultSavePath);
  return {
    tabs: [defaultTab],
    activeTabId: defaultTab.id,
  };
}

function App() {
  const [tabsState, setTabsState] = useState<TabsState>(loadTabsFromStorage);

  useEffect(() => {
    localStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(tabsState));
  }, [tabsState]);

  const activeTab = tabsState.tabs.find(t => t.id === tabsState.activeTabId) || tabsState.tabs[0];

  const handleTabSelect = (id: string) => {
    setTabsState(state => ({ ...state, activeTabId: id }));
  };

  const handleTabClose = (id: string) => {
    setTabsState(state => {
      const newTabs = state.tabs.filter(t => t.id !== id);
      const newActiveId =
        state.activeTabId === id ? newTabs[0]?.id || state.activeTabId : state.activeTabId;
      return { tabs: newTabs, activeTabId: newActiveId };
    });
  };

  const handleTabAdd = () => {
    const defaultSavePath = localStorage.getItem(SAVE_PATH) || '';
    const newTab = createTab(`Tab ${tabsState.tabs.length + 1}`, defaultSavePath);
    setTabsState(state => ({
      tabs: [...state.tabs, newTab],
      activeTabId: newTab.id,
    }));
  };

  const handleDownloadsChange = (downloads: Download[]) => {
    setTabsState(state => ({
      ...state,
      tabs: state.tabs.map(tab => (tab.id === state.activeTabId ? { ...tab, downloads } : tab)),
    }));
  };

  const handleSavePathChange = (savePath: string) => {
    localStorage.setItem(SAVE_PATH, savePath);
    setTabsState(state => ({
      ...state,
      tabs: state.tabs.map(tab => (tab.id === state.activeTabId ? { ...tab, savePath } : tab)),
    }));
  };

  return (
    <div className={styles.app}>
      <TabBar
        tabs={tabsState.tabs}
        activeTabId={tabsState.activeTabId}
        onTabSelect={handleTabSelect}
        onTabClose={handleTabClose}
        onTabAdd={handleTabAdd}
      />
      <TabPanel
        key={activeTab.id}
        downloads={activeTab.downloads}
        savePath={activeTab.savePath}
        onDownloadsChange={handleDownloadsChange}
        onSavePathChange={handleSavePathChange}
      />
    </div>
  );
}

export default App;
