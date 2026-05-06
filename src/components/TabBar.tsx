import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Tab {
  id: string;
  name: string;
}

interface TabBarProps {
  tabs: Tab[];
  onTabSelect: (id: string) => void;
  onTabClose: (id: string) => void;
  onTabAdd: () => void;
  onTabRename: (id: string, name: string) => void;
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <span
      className="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-lg text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover/tab:opacity-100"
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
        className="w-[100px] rounded bg-white px-1 py-0 text-inherit outline-none dark:bg-neutral-700"
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

function TabBar({ tabs, onTabSelect, onTabClose, onTabAdd, onTabRename }: TabBarProps) {
  return (
    <div className="mb-2.5 flex min-w-0 items-center gap-2 pr-28">
      <div className="-mb-1 min-w-0 flex-1 overflow-x-auto overflow-y-hidden pb-1">
        <div className="flex w-max min-w-max items-center gap-2">
          <TabsList>
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                onClick={() => onTabSelect(tab.id)}
                className="group/tab flex shrink-0 items-center justify-between gap-1.5"
              >
                <TabName name={tab.name} onRename={name => onTabRename(tab.id, name)} />
                {tabs.length > 1 && <CloseButton onClick={() => onTabClose(tab.id)} />}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button
            variant="ghost"
            size="icon"
            onClick={onTabAdd}
            className="h-7 w-7 shrink-0 text-lg"
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TabBar;
