import Column from './Column';
import Download from './Download';

export default function Downloads({ downloads, onChange }) {
  return (
    <div className="flex flex-col rounded bg-surface dark:bg-neutral-800 border border-border dark:border-neutral-600 overflow-hidden">
      <div className="flex bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200">
        <Column flex bold>Name</Column>
        <Column width={120} bold>Status</Column>
        <Column width={120} bold>Progress</Column>
        <Column width={120} bold>Speed</Column>
        <Column width={120} bold>Size</Column>
        <Column width={50} bold />
      </div>
      <div className="flex flex-col overflow-y-auto overflow-x-hidden">
        {downloads.map(({ id, url }) => {
          return <Download key={id} url={url} onChange={status => onChange(id, status)} />;
        })}
      </div>
    </div>
  );
}
