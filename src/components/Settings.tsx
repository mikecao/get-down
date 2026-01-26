import Input from '@/components/Input';
import { type Settings as SettingsType, useTabsStore } from '@/lib/store';

const audioFormats = ['mp3', 'aac', 'flac', 'wav', 'opus', 'm4a', 'vorbis'];
const browsers = ['', 'chrome', 'firefox', 'edge', 'safari', 'opera', 'brave'];

export default function Settings({ tabId }: { tabId: string }) {
  const { tabs, updateSettings } = useTabsStore();
  const tab = tabs.find(t => t.id === tabId);
  const settings = tab?.settings;

  if (!settings) return null;

  const handleChange = (key: keyof SettingsType, value: string | boolean) => {
    updateSettings(tabId, { [key]: value });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
      <h2 className="font-bold text-lg">yt-dlp Settings</h2>

      <section className="flex flex-col gap-4">
        <h3 className="font-bold text-neutral-600 dark:text-neutral-400">Format Options</h3>

        <div className="flex flex-col gap-1">
          <label className="">Format Selection (-f)</label>
          <Input
            value={settings.format}
            onChange={e => handleChange('format', e.target.value)}
            placeholder="e.g., bestvideo+bestaudio, best, 720p"
          />
          <span className="text-neutral-500 ">
            Specify video format. Leave empty for default (best quality).
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="extractAudio"
            checked={settings.extractAudio}
            onChange={e => handleChange('extractAudio', e.target.checked)}
            className="h-4 w-4 rounded"
          />
          <label htmlFor="extractAudio" className="">
            Extract Audio Only (-x)
          </label>
        </div>

        {settings.extractAudio && (
          <div className="flex flex-col gap-1">
            <label className="">Audio Format (--audio-format)</label>
            <select
              value={settings.audioFormat}
              onChange={e => handleChange('audioFormat', e.target.value)}
              className="rounded border border-border bg-white px-4 py-2 outline-none dark:border-neutral-600 dark:bg-neutral-700"
            >
              {audioFormats.map(format => (
                <option key={format} value={format}>
                  {format.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="font-bold text-neutral-600 dark:text-neutral-400">Download Options</h3>

        <div className="flex flex-col gap-1">
          <label className="">Rate Limit (--rate-limit)</label>
          <Input
            value={settings.rateLimit}
            onChange={e => handleChange('rateLimit', e.target.value)}
            placeholder="e.g., 100K, 1M, 500K"
          />
          <span className="text-neutral-500 ">
            Limit download speed. Use K for KB/s, M for MB/s.
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="">Concurrent Fragments (-N)</label>
          <Input
            value={settings.concurrentFragments}
            onChange={e => handleChange('concurrentFragments', e.target.value)}
            placeholder="e.g., 4"
            type="number"
          />
          <span className="text-neutral-500 ">Number of fragments to download in parallel.</span>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="font-bold text-neutral-600 dark:text-neutral-400">Subtitles</h3>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="writeSubs"
            checked={settings.writeSubs}
            onChange={e => handleChange('writeSubs', e.target.checked)}
            className="h-4 w-4 rounded"
          />
          <label htmlFor="writeSubs" className="">
            Download Subtitles (--write-subs)
          </label>
        </div>

        {settings.writeSubs && (
          <div className="flex flex-col gap-1">
            <label className="">Subtitle Languages (--sub-langs)</label>
            <Input
              value={settings.subLangs}
              onChange={e => handleChange('subLangs', e.target.value)}
              placeholder="e.g., en, en,fr,es"
            />
            <span className="text-neutral-500 ">Comma-separated language codes.</span>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="font-bold text-neutral-600 dark:text-neutral-400">Other Options</h3>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="restrictFilenames"
            checked={settings.restrictFilenames}
            onChange={e => handleChange('restrictFilenames', e.target.checked)}
            className="h-4 w-4 rounded"
          />
          <label htmlFor="restrictFilenames" className="">
            Restrict Filenames (--restrict-filenames)
          </label>
          <span className="text-neutral-500 ">ASCII only, no spaces</span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="">Cookies from Browser (--cookies-from-browser)</label>
          <select
            value={settings.cookiesFromBrowser}
            onChange={e => handleChange('cookiesFromBrowser', e.target.value)}
            className="rounded border border-border bg-white px-4 py-2 outline-none dark:border-neutral-600 dark:bg-neutral-700"
          >
            {browsers.map(browser => (
              <option key={browser} value={browser}>
                {browser ? browser.charAt(0).toUpperCase() + browser.slice(1) : 'None'}
              </option>
            ))}
          </select>
          <span className="text-neutral-500 ">
            Use cookies from browser for authenticated downloads.
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="font-bold text-neutral-600 dark:text-neutral-400">Advanced</h3>

        <div className="flex flex-col gap-1">
          <label className="">Custom Arguments</label>
          <Input
            value={settings.customArgs}
            onChange={e => handleChange('customArgs', e.target.value)}
            placeholder="e.g., --write-info-json --embed-thumbnail"
          />
          <span className="text-neutral-500 ">Additional yt-dlp arguments (space-separated).</span>
        </div>
      </section>
    </div>
  );
}
