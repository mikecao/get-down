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
          className={`flex items-center gap-3 py-2 px-3 bg-surface border border-border rounded text-[#666] cursor-pointer text-xs hover:bg-white hover:text-[#333] ${
            tab.id === activeTabId ? 'bg-white text-[#333] border-[#999]' : ''
          }`}
          onClick={() => onTabSelect(tab.id)}
        >
          <span className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
            {tab.name}
          </span>
          {tabs.length > 1 && (
            <span
              className="flex items-center justify-center w-4 h-4 p-0 bg-transparent border-none rounded text-[#999] cursor-pointer text-sm leading-none hover:bg-error hover:text-white"
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
        className="flex items-center justify-center py-2 px-3 bg-surface border border-border rounded text-[#666] cursor-pointer text-sm leading-none hover:bg-white hover:text-[#333]"
        onClick={onTabAdd}
      >
        +
      </button>
    </div>
  );
}

export default TabBar;
