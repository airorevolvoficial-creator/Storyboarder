import React, { useState } from 'react';
import { 
  Clapperboard, 
  Settings2, 
  Music2, 
  Clock, 
  Aperture, 
  Palette, 
  Play, 
  AlertCircle,
  Film
} from 'lucide-react';

import { StoryboardConfig, ImageRef, StoryboardScene } from '../types';
import { 
  PACING_OPTIONS, 
  SHOT_SEQUENCES, 
  VISUAL_STYLES, 
  TARGET_MODELS, 
  DEFAULT_STORYBOARD_CONFIG
} from '../constants';
import ImageUploader from './ImageUploader';
import StoryboardTable from './StoryboardTable';
import { generateStoryboard } from '../services/geminiService';

const StoryboardMode: React.FC = () => {
  const [config, setConfig] = useState<StoryboardConfig>(DEFAULT_STORYBOARD_CONFIG);
  const [images, setImages] = useState<ImageRef[]>([]);
  const [scenes, setScenes] = useState<StoryboardScene[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof StoryboardConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!config.lyrics.trim()) {
      setError("Please enter lyrics or a script to generate a storyboard.");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    setScenes([]);

    try {
      const result = await generateStoryboard(config, images, null);
      setScenes(result);
    } catch (err: any) {
      setError(err.message || "An error occurred while generating the storyboard.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-studio-950 text-gray-100 overflow-hidden">
      
      {/* Sidebar - Settings */}
      <aside className="w-80 bg-studio-900 border-r border-studio-800 flex flex-col h-full overflow-y-auto custom-scrollbar shadow-xl z-10">
        <div className="p-4 border-b border-studio-800 sticky top-0 bg-studio-900 z-20">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Director Settings</h2>
        </div>

        <div className="p-6 space-y-8 flex-1">
          
          {/* Group 1: Timing */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <Clock size={16} className="text-studio-blue" />
              <h2>Timing & Pacing</h2>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs text-gray-500 uppercase font-bold">Duration</label>
              <input 
                type="text" 
                value={config.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full bg-studio-800 border border-studio-700 rounded p-2 text-sm focus:border-studio-blue focus:outline-none transition-colors"
                placeholder="e.g. 3:00"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-500 uppercase font-bold">Pacing Logic</label>
              <div className="space-y-1">
                {PACING_OPTIONS.map(opt => (
                  <label key={opt} className="flex items-center space-x-2 p-2 rounded hover:bg-studio-800 cursor-pointer transition-colors">
                    <input 
                      type="radio" 
                      name="pacing" 
                      value={opt}
                      checked={config.pacing === opt}
                      onChange={(e) => handleInputChange('pacing', e.target.value)}
                      className="text-studio-accent focus:ring-studio-accent bg-studio-900 border-studio-600"
                    />
                    <span className="text-xs text-gray-300">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-studio-800" />

          {/* Group 2: Camera & Style */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <Aperture size={16} className="text-green-500" />
              <h2>Cinematography</h2>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-500 uppercase font-bold">Shot Sequence</label>
              <select 
                value={config.shotSequence}
                onChange={(e) => handleInputChange('shotSequence', e.target.value)}
                className="w-full bg-studio-800 border border-studio-700 rounded p-2 text-sm focus:border-green-500 focus:outline-none"
              >
                {SHOT_SEQUENCES.map(seq => <option key={seq} value={seq}>{seq}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-500 uppercase font-bold">Visual Style</label>
               <select 
                value={config.visualStyle}
                onChange={(e) => handleInputChange('visualStyle', e.target.value)}
                className="w-full bg-studio-800 border border-studio-700 rounded p-2 text-sm focus:border-green-500 focus:outline-none"
              >
                {VISUAL_STYLES.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
          </div>

          <div className="border-t border-studio-800" />

          {/* Group 3: Output */}
           <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <Settings2 size={16} className="text-purple-500" />
              <h2>Output Format</h2>
            </div>
             <select 
                value={config.targetModel}
                onChange={(e) => handleInputChange('targetModel', e.target.value)}
                className="w-full bg-studio-800 border border-studio-700 rounded p-2 text-sm focus:border-purple-500 focus:outline-none"
              >
                {TARGET_MODELS.map(tm => <option key={tm} value={tm}>{tm}</option>)}
              </select>
          </div>

        </div>

        {/* Generate Button Area */}
        <div className="p-6 border-t border-studio-800 bg-studio-900 sticky bottom-0">
          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className={`
              w-full py-3 px-4 rounded font-bold text-sm tracking-wide shadow-lg
              flex items-center justify-center gap-2
              transition-all duration-300 transform active:scale-95
              ${isLoading 
                ? 'bg-studio-800 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-studio-accent to-red-700 hover:from-red-500 hover:to-studio-accent text-white shadow-red-900/20'}
            `}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                <span>DIRECTING...</span>
              </>
            ) : (
              <>
                <Play size={16} fill="currentColor" />
                <span>GENERATE STORYBOARD</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-0">
          
          <div className="max-w-5xl mx-auto space-y-8 pb-20">
            
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold mb-2 text-white">Project Workspace</h2>
              <p className="text-gray-400 font-light">
                Configure your script and character references to generate a production-ready storyboard.
              </p>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Col: Lyrics */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-lg font-medium text-studio-blue">
                  <Music2 size={20} />
                  <h3>Script / Lyrics</h3>
                </div>
                <div className="bg-studio-800 rounded-lg p-1 border border-studio-700 focus-within:border-studio-blue transition-colors h-96 shadow-inner">
                  <textarea 
                    value={config.lyrics}
                    onChange={(e) => handleInputChange('lyrics', e.target.value)}
                    className="w-full h-full bg-studio-900/50 text-gray-300 p-4 rounded outline-none resize-none font-mono text-sm leading-relaxed custom-scrollbar"
                    placeholder="Paste your lyrics or script here..."
                  />
                </div>
              </div>

              {/* Right Col: Character */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-lg font-medium text-studio-blue">
                  <Palette size={20} />
                  <h3>Character References</h3>
                </div>
                <div className="bg-studio-800 rounded-lg p-6 border border-studio-700 h-96 shadow-inner flex flex-col">
                  <p className="text-sm text-gray-400 mb-6 font-light">
                    Upload up to 4 images. The AI will analyze these to maintain character consistency across all generated prompts.
                  </p>
                  <div className="flex-1">
                    <ImageUploader images={images} onImagesChange={setImages} />
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-300 p-4 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Results Section */}
            {scenes.length > 0 && (
              <div className="space-y-6 pt-8 border-t border-studio-800">
                <div className="flex items-center justify-between">
                   <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Film className="text-studio-accent" />
                    Generated Storyboard
                   </h3>
                   <span className="text-sm bg-studio-800 px-3 py-1 rounded text-gray-400 border border-studio-700">
                     {scenes.length} Scenes Generated
                   </span>
                </div>
                <StoryboardTable scenes={scenes} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoryboardMode;