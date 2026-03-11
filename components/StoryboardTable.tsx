import React, { useState } from 'react';
import { StoryboardScene, Language } from '../types';
import { Copy, Check, Film, Clock, Video } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface StoryboardTableProps {
  scenes: StoryboardScene[];
  lang: Language;
}

const StoryboardTable: React.FC<StoryboardTableProps> = ({ scenes, lang }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const t = TRANSLATIONS[lang];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (scenes.length === 0) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="overflow-x-auto rounded-lg border border-studio-700 bg-studio-800/50 shadow-2xl relative">
        <table className="w-full text-left border-collapse">
          {/* top-14 to account for the sticky 3.5rem (14 * 0.25rem) main header */}
          <thead className="sticky top-14 z-10 shadow-md">
            <tr className="bg-studio-900 border-b border-studio-700 text-content-muted text-xs uppercase tracking-wider">
              <th className="p-4 font-medium w-24 bg-studio-900">{t.tableTime}</th>
              <th className="p-4 font-medium w-24 bg-studio-900">{t.tableShot}</th>
              <th className="p-4 font-medium w-48 bg-studio-900">{t.tableCamera}</th>
              <th className="p-4 font-medium bg-studio-900">{t.tableDesc}</th>
              <th className="p-4 font-medium w-16 bg-studio-900">{t.tableAction}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-studio-700">
            {scenes.map((scene, index) => (
              <tr 
                key={index} 
                className="hover:bg-studio-800/80 transition-colors group"
              >
                <td className="p-4 align-top">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-studio-blue font-bold">{scene.timeCode}</span>
                    <span className="text-xs text-content-muted flex items-center gap-1">
                      <Clock size={10} /> {scene.duration}
                    </span>
                  </div>
                </td>
                <td className="p-4 align-top">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                    <Video size={10} className="mr-1" />
                    {scene.shotType}
                  </span>
                </td>
                <td className="p-4 align-top">
                   <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20">
                    <Film size={10} className="mr-1" />
                    {scene.cameraMove}
                  </span>
                </td>
                <td className="p-4 align-top space-y-3">
                  <p className="text-sm text-content-primary leading-relaxed font-light">
                    {scene.sceneDescription}
                  </p>
                  <div className="bg-studio-900/50 p-3 rounded border border-studio-700 text-xs text-content-secondary font-mono relative">
                    <p className="pr-6 line-clamp-3 group-hover:line-clamp-none transition-all">
                      <span className="text-studio-blue opacity-70 select-none">{t.tablePromptLabel}: </span>
                      {scene.englishPrompt}
                    </p>
                  </div>
                </td>
                <td className="p-4 align-top">
                  <button
                    onClick={() => handleCopy(scene.englishPrompt, index)}
                    className="p-2 hover:bg-studio-700 rounded-md text-content-muted hover:text-content-primary transition-colors"
                    title={t.copyPrompt}
                  >
                    {copiedIndex === index ? (
                      <Check size={18} className="text-green-500" />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoryboardTable;