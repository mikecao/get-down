export default function ProgressBar({ progress }: { progress: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-[50px] h-2 bg-background dark:bg-neutral-600 overflow-hidden rounded">
        <div className="bg-black dark:bg-white h-2.5" style={{ width: `${progress}%` }} />
      </div>
      <div>{progress}%</div>
    </div>
  );
}
