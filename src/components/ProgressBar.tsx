export default function ProgressBar({ progress }: { progress: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-[50px] h-2 bg-background overflow-hidden rounded">
        <div className="bg-black h-2.5" style={{ width: `${progress}%` }} />
      </div>
      <div>{progress}%</div>
    </div>
  );
}
