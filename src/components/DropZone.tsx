import download from '../assets/download.svg';

export default function DropZone({ show, onDrop, onLeave }) {
  if (!show) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 m-auto backdrop-blur-[4px] z-[100] before:content-[''] before:absolute before:inset-0 before:m-auto before:opacity-25 before:bg-white dark:before:bg-black before:pointer-events-none"
      onDragLeave={onLeave}
    >
      <img
        src={download}
        alt=""
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] mx-auto pointer-events-none dark:invert"
      />
      <textarea className="opacity-0 w-full h-full" onChange={e => onDrop(e.target.value)} />
    </div>
  );
}
