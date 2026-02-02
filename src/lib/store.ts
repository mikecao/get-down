import md5 from 'md5';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { COMPLETE, ERROR, SAVE_PATH, TABS_STORAGE_KEY } from './constants';

export interface Download {
  id: string;
  url: string;
  status?: string;
}

export interface Settings {
  format: string;
  extractAudio: boolean;
  audioFormat: string;
  rateLimit: string;
  concurrentFragments: string;
  writeSubs: boolean;
  subLangs: string;
  restrictFilenames: boolean;
  cookiesFromBrowser: string;
  customArgs: string;
}

export const defaultSettings: Settings = {
  format: '',
  extractAudio: false,
  audioFormat: 'mp3',
  rateLimit: '',
  concurrentFragments: '',
  writeSubs: false,
  subLangs: 'en',
  restrictFilenames: false,
  cookiesFromBrowser: '',
  customArgs: '',
};

export interface Tab {
  id: string;
  name: string;
  downloads: Download[];
  savePath: string;
  settings: Settings;
}

interface TabsState {
  tabs: Tab[];
  activeTabId: string;
  addTab: () => void;
  closeTab: (id: string) => void;
  selectTab: (id: string) => void;
  renameTab: (id: string, name: string) => void;
  addDownload: (tabId: string, url: string) => void;
  updateDownloadStatus: (tabId: string, downloadId: string, status: string) => void;
  removeDownload: (tabId: string, downloadId: string) => void;
  clearCompleted: (tabId: string) => void;
  setSavePath: (tabId: string, path: string) => void;
  updateSettings: (tabId: string, settings: Partial<Settings>) => void;
}

function createTab(name: string, savePath: string): Tab {
  return {
    id: md5(String(Date.now()) + Math.random()),
    name,
    downloads: [],
    savePath,
    settings: { ...defaultSettings },
  };
}

const getDefaultSavePath = () => localStorage.getItem(SAVE_PATH) || '';

export const useTabsStore = create<TabsState>()(
  persist(
    (set, get) => ({
      tabs: [createTab('Tab 1', getDefaultSavePath())],
      activeTabId: '',

      addTab: () => {
        const { tabs } = get();
        const newTab = createTab(`Tab ${tabs.length + 1}`, getDefaultSavePath());
        set({
          tabs: [...tabs, newTab],
          activeTabId: newTab.id,
        });
      },

      closeTab: (id: string) => {
        const { tabs, activeTabId } = get();
        if (tabs.length <= 1) return;
        const newTabs = tabs.filter(t => t.id !== id);
        const newActiveId = activeTabId === id ? newTabs[0].id : activeTabId;
        set({ tabs: newTabs, activeTabId: newActiveId });
      },

      selectTab: (id: string) => {
        set({ activeTabId: id });
      },

      renameTab: (id: string, name: string) => {
        if (!name.trim()) return;
        set(state => ({
          tabs: state.tabs.map(tab => (tab.id === id ? { ...tab, name: name.trim() } : tab)),
        }));
      },

      addDownload: (tabId: string, url: string) => {
        set(state => ({
          tabs: state.tabs.map(tab =>
            tab.id === tabId
              ? {
                  ...tab,
                  downloads: [
                    ...tab.downloads,
                    { id: md5(String(Date.now()) + Math.random()), url },
                  ],
                }
              : tab,
          ),
        }));
      },

      updateDownloadStatus: (tabId: string, downloadId: string, status: string) => {
        set(state => ({
          tabs: state.tabs.map(tab =>
            tab.id === tabId
              ? {
                  ...tab,
                  downloads: tab.downloads.map(d => (d.id === downloadId ? { ...d, status } : d)),
                }
              : tab,
          ),
        }));
      },

      removeDownload: (tabId: string, downloadId: string) => {
        set(state => ({
          tabs: state.tabs.map(tab =>
            tab.id === tabId
              ? {
                  ...tab,
                  downloads: tab.downloads.filter(d => d.id !== downloadId),
                }
              : tab,
          ),
        }));
      },

      clearCompleted: (tabId: string) => {
        set(state => ({
          tabs: state.tabs.map(tab =>
            tab.id === tabId
              ? {
                  ...tab,
                  downloads: tab.downloads.filter(d => d.status !== COMPLETE && d.status !== ERROR),
                }
              : tab,
          ),
        }));
      },

      setSavePath: (tabId: string, path: string) => {
        localStorage.setItem(SAVE_PATH, path);
        set(state => ({
          tabs: state.tabs.map(tab => (tab.id === tabId ? { ...tab, savePath: path } : tab)),
        }));
      },

      updateSettings: (tabId: string, newSettings: Partial<Settings>) => {
        set(state => ({
          tabs: state.tabs.map(tab =>
            tab.id === tabId ? { ...tab, settings: { ...tab.settings, ...newSettings } } : tab,
          ),
        }));
      },
    }),
    {
      name: TABS_STORAGE_KEY,
      partialize: state => ({
        tabs: state.tabs.map(tab => ({
          ...tab,
          // Only persist completed/errored downloads
          downloads: tab.downloads.filter(d => d.status === COMPLETE || d.status === ERROR),
        })),
        activeTabId: state.activeTabId,
      }),
      onRehydrateStorage: () => (state: TabsState | undefined) => {
        if (state) {
          // Migrate tabs without settings
          for (const tab of state.tabs) {
            if (!tab.settings) {
              tab.settings = { ...defaultSettings };
            }
          }
          // Set activeTabId to first tab if not set
          if (!state.activeTabId || !state.tabs.find(t => t.id === state.activeTabId)) {
            state.activeTabId = state.tabs[0]?.id || '';
          }
        }
      },
    },
  ),
);
