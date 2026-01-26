interface Tab {
  id: string;
  name: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onTabSelect: (id: string) => void;
  onTabClose: (id: string) => void;
  onTabAdd: () => void;
}

function TabBar({ tabs, activeTabId, onTabSelect, onTabClose, onTabAdd }: TabBarProps) {
  return (
    <div className="flex gap-1 mb-2.5">
      {tabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          className={`flex items-center gap-3 py-2 px-3 bg-surface dark:bg-neutral-700 border border-border dark:border-neutral-600 rounded text-neutral-500 dark:text-neutral-400 cursor-pointer text-xs hover:bg-white dark:hover:bg-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-200 ${
            tab.id === activeTabId ? 'bg-white dark:bg-neutral-600 text-neutral-700 dark:text-neutral-200 border-neutral-400 dark:border-neutral-500' : ''
          }`}
          onClick={() => onTabSelect(tab.id)}
        >
          <span className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
            {tab.name}
          </span>
          {tabs.length > 1 && (
            <span
              className="flex items-center justify-center w-4 h-4 p-0 bg-transparent border-none rounded text-neutral-400 cursor-pointer text-sm leading-none hover:bg-error hover:text-white"
              onClick={e => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
            >
              ×
            </span>
          )}
        </button>
      ))}
      <button
        type="button"
        className="flex items-center justify-center py-2 px-3 bg-surface dark:bg-neutral-700 border border-border dark:border-neutral-600 rounded text-neutral-500 dark:text-neutral-400 cursor-pointer text-sm leading-none hover:bg-white dark:hover:bg-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-200"
        onClick={onTabAdd}
      >
        +
      </button>
    </div>
  );
}

export default TabBar;
