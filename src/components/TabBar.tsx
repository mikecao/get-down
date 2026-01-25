import styles from './TabBar.module.css';

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
    <div className={styles.tabBar}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          className={`${styles.tab} ${tab.id === activeTabId ? styles.active : ''}`}
          onClick={() => onTabSelect(tab.id)}
        >
          <span className={styles.tabName}>{tab.name}</span>
          {tabs.length > 1 && (
            <span
              className={styles.closeButton}
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
      <button type="button" className={styles.addButton} onClick={onTabAdd}>
        +
      </button>
    </div>
  );
}

export default TabBar;
