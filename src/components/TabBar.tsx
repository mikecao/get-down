import type { ReactNode } from 'react';

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

const tabBase =
  'flex items-center py-2 px-3 border rounded cursor-pointer bg-surface dark:bg-neutral-700 border-border dark:border-neutral-600 text-neutral-500 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-200';

const tabActive =
  'bg-white dark:bg-neutral-600 text-neutral-700 dark:text-neutral-200 border-neutral-400 dark:border-neutral-500';

function TabButton({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`${tabBase} gap-6 text-xs ${active ? tabActive : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <span
      className="flex items-center justify-center w-6 h-6 ml-auto bg-transparent border-none rounded text-neutral-400 cursor-pointer text-xl leading-none hover:bg-neutral-200 dark:hover:bg-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-200"
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
    >
      ×
    </span>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className={`${tabBase} justify-center text-xl leading-none`}
      onClick={onClick}
    >
      +
    </button>
  );
}

function TabBar({ tabs, activeTabId, onTabSelect, onTabClose, onTabAdd }: TabBarProps) {
  return (
    <div className="flex gap-1 mb-2.5">
      {tabs.map(tab => (
        <TabButton key={tab.id} active={tab.id === activeTabId} onClick={() => onTabSelect(tab.id)}>
          <span className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
            {tab.name}
          </span>
          {tabs.length > 1 && <CloseButton onClick={() => onTabClose(tab.id)} />}
        </TabButton>
      ))}
      <AddButton onClick={onTabAdd} />
    </div>
  );
}

export default TabBar;
