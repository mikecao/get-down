import Download from './Download';

export default function Downloads({ downloads, onChange }) {
  return (
    <div className="flex flex-col rounded bg-surface border border-border overflow-hidden">
      <div className="flex">
        <div className="font-bold text-left p-[1.2rem] flex-1 min-w-[50px] whitespace-nowrap">
          Name
        </div>
        <div className="font-bold text-left p-[1.2rem] w-[120px] whitespace-nowrap">Status</div>
        <div className="font-bold text-left p-[1.2rem] w-[120px] whitespace-nowrap">Progress</div>
        <div className="font-bold text-left p-[1.2rem] w-[120px] whitespace-nowrap">Speed</div>
        <div className="font-bold text-left p-[1.2rem] w-[120px] whitespace-nowrap">Size</div>
        <div className="font-bold text-left p-[1.2rem] w-[50px] whitespace-nowrap" />
      </div>
      <div className="flex flex-col overflow-y-auto overflow-x-hidden">
        {downloads.map(({ id, url }) => {
          return <Download key={id} url={url} onChange={status => onChange(id, status)} />;
        })}
      </div>
    </div>
  );
}
