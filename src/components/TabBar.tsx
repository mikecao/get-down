import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

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
  onTabRename: (id: string, name: string) => void;
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <span
      className="ml-auto flex h-6 w-6 cursor-pointer items-center justify-center rounded border-none bg-transparent text-neutral-400 text-xl leading-none hover:bg-neutral-200 hover:text-neutral-600 dark:hover:bg-neutral-500 dark:hover:text-neutral-200"
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
    >
      ×
    </span>
  );
}

function TabName({ name, onRename }: { name: string; onRename: (name: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(name);
    setEditing(true);
  };

  const handleSave = () => {
    if (value.trim()) {
      onRename(value.trim());
    }
    setEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        onClick={e => e.stopPropagation()}
        className="w-[100px] rounded border border-border bg-white px-1 py-0 text-inherit outline-none dark:border-neutral-500 dark:bg-neutral-700"
      />
    );
  }

  return (
    <span
      className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
      onDoubleClick={handleDoubleClick}
    >
      {name}
    </span>
  );
}

function TabBar({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onTabAdd,
  onTabRename,
}: TabBarProps) {
  return (
    <TabsList className="mb-2.5">
      {tabs.map(tab => (
        <TabsTrigger
          key={tab.id}
          value={tab.id}
          onClick={() => onTabSelect(tab.id)}
          className={cn(
            'flex items-center gap-6 px-3',
            tab.id !== activeTabId &&
              'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200',
          )}
        >
          <TabName name={tab.name} onRename={name => onTabRename(tab.id, name)} />
          {tabs.length > 1 && <CloseButton onClick={() => onTabClose(tab.id)} />}
        </TabsTrigger>
      ))}
      <Button
        onClick={onTabAdd}
        className="flex items-center justify-center px-3 text-xl leading-none"
      >
        +
      </Button>
    </TabsList>
  );
}

export default TabBar;
