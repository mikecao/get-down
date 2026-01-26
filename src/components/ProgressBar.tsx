export default function ProgressBar({ progress }: { progress: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-2 w-[50px] overflow-hidden rounded bg-background dark:bg-neutral-600">
        <div className="h-2.5 bg-black dark:bg-white" style={{ width: `${progress}%` }} />
      </div>
      <div>{progress}%</div>
    </div>
  );
}
