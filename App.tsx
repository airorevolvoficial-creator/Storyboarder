import React, { useState } from 'react';
import { 
  Clapperboard, 
  Mic, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  Globe, 
  Heart, 
  Youtube, 
  Send, 
  Coffee,
  Copy,
  Settings2,
  Film,
  Music,
  Aperture,
  BookOpen,
  Sun,
  Moon
} from 'lucide-react';

import { 
  TRANSLATIONS, 
  ASPECT_RATIOS, 
  SHOT_TYPES, 
  CAMERA_CATEGORIES,
  DEFAULT_STORYBOARD_CONFIG,
  PACING_OPTIONS,
  SHOT_SEQUENCES,
  VISUAL_STYLES,
  TARGET_MODELS
} from './constants';

import { Language, ImageRef, AudioRef, StoryboardConfig, StoryboardScene } from './types';
import { translateAndEnhance, generateStoryboard } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import StoryboardTable from './components/StoryboardTable';

const App: React.FC = () => {
  // --- STATE ---
  const [lang, setLang] = useState<Language>('RU');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('batch');

  // Sync theme to document
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  // Assets
  const [images, setImages] = useState<ImageRef[]>([]);
  const [audio, setAudio] = useState<AudioRef | null>(null);
  
  // Single Shot State
  const [singleDescription, setSingleDescription] = useState('');
  const [singlePromptResult, setSinglePromptResult] = useState('');
  
  // Storyboard State
  const [config, setConfig] = useState<StoryboardConfig>(DEFAULT_STORYBOARD_CONFIG);
  const [scenes, setScenes] = useState<StoryboardScene[]>([]);
  
  // Shared Visual State (The Director Console)
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [shotType, setShotType] = useState<string>('medium');
  const [selectedMoves, setSelectedMoves] = useState<string[]>([]);
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  // --- HANDLERS ---

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });
      setAudio({
        file,
        fileName: file.name,
        base64,
        mimeType: file.type
      });
    }
  };

  const toggleMove = (id: string) => {
    setSelectedMoves(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleStoryboardConfigChange = (field: keyof StoryboardConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  // --- ACTIONS ---

  const generateSingleShot = async () => {
    if (!singleDescription) return;
    setIsLoading(true);
    setError(null);
    try {
      // We pass the "Director Console" settings as part of the description to guide the translation
      const technicalContext = `
        Shot: ${shotType}, 
        Moves: ${selectedMoves.join(', ')}, 
        Ratio: ${aspectRatio}.
      `;
      const fullDescription = `${singleDescription}. [Technical Context: ${technicalContext}]`;
      
      const result = await translateAndEnhance(fullDescription, images);
      setSinglePromptResult(result);
      setActiveTab('single');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateBatchStoryboard = async () => {
    // Validate inputs - Lyrics are technically optional if user just wants visual story, 
    // but usually user provides one or the other. Let's require at least one.
    if (!config.lyrics.trim() && !config.story.trim()) {
      setError(lang === 'RU' ? "Введите текст песни или сценарий истории." : "Please enter lyrics or story scenario.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setScenes([]);
    try {
      const result = await generateStoryboard(config, images, audio);
      setScenes(result);
      setActiveTab('batch');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- UI COMPONENTS ---

  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-studio-700">
      <Icon size={16} className="text-studio-accent" />
      <h3 className="text-xs font-bold text-content-secondary uppercase tracking-wider">{title}</h3>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-studio-950 text-content-primary font-sans">
      
      {/* HEADER - Sticky to ensure navigation is always accessible */}
      <header className="sticky top-0 h-14 bg-studio-950 border-b border-studio-800 flex items-center justify-between px-6 shrink-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-studio-accent rounded flex items-center justify-center text-black font-black text-xs shadow-[0_0_15px_rgba(245,158,11,0.4)]">
            AI
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-widest text-content-primary uppercase">{t.appTitle}</h1>
            <div className="text-[10px] text-content-muted font-mono">{t.appSubtitle}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           {error && (
             <span className="text-red-500 text-xs flex items-center gap-1 animate-pulse">
               <span className="w-2 h-2 rounded-full bg-red-500"></span>
               {error}
             </span>
           )}
           <div className="flex items-center gap-2 border-r border-studio-800 pr-4">
             <button 
              onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-full hover:bg-studio-800 text-content-secondary hover:text-studio-accent transition-all"
              title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button 
              onClick={() => setLang(l => l === 'RU' ? 'EN' : 'RU')}
              className="flex items-center gap-2 text-xs font-mono text-content-secondary hover:text-studio-accent transition-colors uppercase px-2 py-1 rounded hover:bg-studio-800"
            >
              <Globe size={14} />
              {lang}
            </button>
           </div>
        </div>
      </header>

      {/* MAIN CONTENT WRAPPER - Horizontal Scroll handled here */}
      <div className="flex-1 overflow-x-auto">
        
        {/* GRID - Forced Min Width to ensure columns don't shrink too much, prompting horizontal scroll on small screens */}
        <div className="grid grid-cols-12 min-w-[1280px] min-h-[calc(100vh-3.5rem)] divide-x divide-studio-800">
          
          {/* COL 1: SOURCE ASSETS (3 cols) */}
          <div className="col-span-3 flex flex-col bg-studio-900">
            <div className="p-5 space-y-6">
              
              {/* Audio Ref */}
              <div>
                <SectionHeader icon={Music} title={t.audioRef} />
                <div className="relative group">
                  {audio ? (
                    <div className="bg-studio-800 rounded border border-studio-700 p-3 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-studio-accent/20 flex items-center justify-center text-studio-accent">
                          <Music size={14} />
                        </div>
                        <div className="text-xs truncate max-w-[140px]">
                          <div className="text-content-primary font-medium truncate">{audio.fileName}</div>
                          <div className="text-content-muted">{(audio.file.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                      </div>
                      <button onClick={() => setAudio(null)} className="text-content-muted hover:text-red-500 p-1 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-studio-700 rounded-lg hover:border-studio-accent/50 hover:bg-studio-800/50 transition-all cursor-pointer group">
                      <Music className="text-content-muted mb-2 group-hover:text-studio-accent transition-colors" size={20} />
                      <span className="text-xs text-content-muted group-hover:text-content-primary transition-colors">{t.uploadAudioPlaceholder}</span>
                      <input type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* Script / Lyrics */}
              <div>
                <SectionHeader icon={Clapperboard} title={t.scriptLyrics} />
                <textarea 
                  value={config.lyrics}
                  onChange={(e) => handleStoryboardConfigChange('lyrics', e.target.value)}
                  placeholder={t.scriptPlaceholder}
                  className="w-full h-32 bg-studio-800 border border-studio-700 rounded p-3 text-xs text-content-primary focus:border-studio-accent focus:ring-1 focus:ring-studio-accent/20 focus:outline-none resize-none font-mono transition-all"
                />
              </div>

               {/* Story Scenario (NEW) */}
               <div>
                <SectionHeader icon={BookOpen} title={t.storyScenario} />
                <textarea 
                  value={config.story}
                  onChange={(e) => handleStoryboardConfigChange('story', e.target.value)}
                  placeholder={t.storyPlaceholder}
                  className="w-full h-32 bg-studio-800 border border-studio-700 rounded p-3 text-xs text-content-primary focus:border-studio-accent focus:ring-1 focus:ring-studio-accent/20 focus:outline-none resize-none font-mono transition-all"
                />
              </div>

               {/* Single Shot Description */}
              <div>
                 <SectionHeader icon={Mic} title={t.singleSceneDesc} />
                 <textarea
                  value={singleDescription}
                  onChange={(e) => setSingleDescription(e.target.value)}
                  placeholder={t.singleScenePlaceholder}
                  className="w-full h-24 bg-studio-800 border border-studio-700 rounded p-3 text-xs text-content-primary focus:border-studio-accent focus:ring-1 focus:ring-studio-accent/20 focus:outline-none resize-none transition-all"
                />
              </div>

              {/* Character Images */}
              <div>
                <SectionHeader icon={ImageIcon} title={t.charRefs} />
                <ImageUploader images={images} onImagesChange={setImages} lang={lang} />
              </div>

            </div>
          </div>

          {/* COL 2: DIRECTOR CONSOLE (5 cols) */}
          <div className="col-span-5 flex flex-col bg-studio-950">
            <div className="p-6 space-y-8">
              
              {/* Global Project Settings */}
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-[10px] uppercase font-bold text-content-muted mb-1 block">{t.visualStyle}</label>
                   <select 
                      value={config.visualStyle}
                      onChange={(e) => handleStoryboardConfigChange('visualStyle', e.target.value)}
                      className="w-full bg-studio-900 border border-studio-800 rounded p-2 text-xs text-content-primary focus:border-studio-accent outline-none transition-all"
                    >
                      {VISUAL_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
                 <div>
                   <label className="text-[10px] uppercase font-bold text-content-muted mb-1 block">{t.duration}</label>
                   <input 
                      type="text" 
                      value={config.duration}
                      onChange={(e) => handleStoryboardConfigChange('duration', e.target.value)}
                      className="w-full bg-studio-900 border border-studio-800 rounded p-2 text-xs text-content-primary focus:border-studio-accent outline-none transition-all" 
                    />
                 </div>
                 <div>
                   <label className="text-[10px] uppercase font-bold text-content-muted mb-1 block">{t.pacing}</label>
                   <select 
                      value={config.pacing}
                      onChange={(e) => handleStoryboardConfigChange('pacing', e.target.value)}
                      className="w-full bg-studio-900 border border-studio-800 rounded p-2 text-xs text-content-primary focus:border-studio-accent outline-none transition-all"
                    >
                      {PACING_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
                 <div>
                   <label className="text-[10px] uppercase font-bold text-content-muted mb-1 block">{t.shotLogic}</label>
                   <select 
                      value={config.shotSequence}
                      onChange={(e) => handleStoryboardConfigChange('shotSequence', e.target.value)}
                      className="w-full bg-studio-900 border border-studio-800 rounded p-2 text-xs text-content-primary focus:border-studio-accent outline-none transition-all"
                    >
                      {SHOT_SEQUENCES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
              </div>

              <div className="h-px bg-studio-800 w-full" />

              {/* Aspect Ratio */}
              <div>
                <SectionHeader icon={Settings2} title={t.aspectRatio} />
                <div className="grid grid-cols-4 gap-2">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio.id}
                      onClick={() => setAspectRatio(ratio.id)}
                      className={`
                        flex flex-col items-center justify-center gap-1 py-3 rounded border transition-all
                        ${aspectRatio === ratio.id 
                          ? 'bg-studio-800 border-studio-accent text-studio-accent shadow-sm' 
                          : 'bg-studio-900 border-studio-800 text-content-muted hover:border-studio-600'}
                      `}
                    >
                      <div className={`border rounded-sm ${aspectRatio === ratio.id ? 'border-studio-accent' : 'border-current'} ${ratio.icon}`}></div>
                      <span className="text-[10px] font-mono">{ratio.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Shot Type */}
              <div>
                <SectionHeader icon={Aperture} title={t.shotSizeLens} />
                <div className="grid grid-cols-3 gap-2">
                  {SHOT_TYPES.map((shot) => (
                    <button
                      key={shot.id}
                      onClick={() => setShotType(shot.id)}
                      className={`
                        text-left p-3 rounded border transition-all relative overflow-hidden
                        ${shotType === shot.id 
                          ? 'bg-studio-800 border-studio-accent text-content-primary shadow-sm' 
                          : 'bg-studio-900 border-studio-800 text-content-muted hover:border-studio-600'}
                      `}
                    >
                       <div className="text-[10px] font-bold uppercase mb-0.5">{lang === 'RU' ? shot.labelRu : shot.labelEn}</div>
                       <div className="text-[9px] opacity-60 leading-tight">{shot.lens}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera Moves */}
              <div>
                <SectionHeader icon={Film} title={t.cameraMovements} />
                <div className="space-y-4">
                  {CAMERA_CATEGORIES.map((cat) => (
                    <div key={cat.id}>
                      <h4 className="text-[9px] text-content-muted uppercase tracking-widest font-bold mb-2 pl-1">
                         {lang === 'RU' ? cat.titleRu : cat.titleEn}
                      </h4>
                      <div className="grid grid-cols-4 gap-1.5">
                        {cat.moves.map((move) => {
                          const isSelected = selectedMoves.includes(move.id);
                          return (
                            <button
                              key={move.id}
                              onClick={() => toggleMove(move.id)}
                              className={`
                                px-1 py-1.5 rounded text-[10px] border transition-all truncate
                                ${isSelected 
                                  ? 'bg-studio-accent text-black border-studio-accent font-bold shadow-md' 
                                  : 'bg-studio-900 border-studio-800 text-content-secondary hover:bg-studio-800 hover:border-studio-600'}
                              `}
                              title={move.labelEn}
                            >
                              {lang === 'RU' ? move.labelRu : move.labelEn}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* COL 3: ACTION & OUTPUT (4 cols) */}
          <div className="col-span-4 flex flex-col bg-studio-900">
            
            {/* Action Buttons - Sticky within column? No, let them scroll naturally at top */}
            <div className="p-5 border-b border-studio-800 space-y-3 bg-studio-900 z-10">
              <button 
                 onClick={generateSingleShot}
                 disabled={isLoading || !singleDescription}
                 className="w-full bg-studio-800 hover:bg-studio-700 border border-studio-600 text-white py-3 rounded font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading && activeTab === 'single' ? <div className="animate-spin rounded-full h-3 w-3 border-2 border-white/20 border-t-white" /> : <Send size={14} />}
                {t.btnGenerateSingle}
              </button>
              <button 
                 onClick={generateBatchStoryboard}
                 disabled={isLoading || (!config.lyrics && !config.story)}
                 className="w-full bg-gradient-to-r from-studio-accent to-orange-600 hover:from-orange-500 hover:to-studio-accent text-white border border-transparent py-3 rounded font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 {isLoading && activeTab === 'batch' ? <div className="animate-spin rounded-full h-3 w-3 border-2 border-white/20 border-t-white" /> : <Clapperboard size={14} />}
                 {t.btnGenerateBatch}
              </button>
            </div>

            {/* Results Area */}
            <div className="flex-1 flex flex-col relative">
              
              {/* Tab Switcher */}
              <div className="flex border-b border-studio-800 bg-studio-950">
                 <button 
                  onClick={() => setActiveTab('batch')}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'batch' ? 'text-studio-accent border-b-2 border-studio-accent bg-studio-900' : 'text-content-muted hover:text-content-secondary'}`}
                 >
                   {t.tabStoryboard}
                 </button>
                 <button 
                  onClick={() => setActiveTab('single')}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'single' ? 'text-studio-accent border-b-2 border-studio-accent bg-studio-900' : 'text-content-muted hover:text-content-secondary'}`}
                 >
                   {t.tabSingle}
                 </button>
              </div>

              <div className="flex-1 bg-studio-950 p-0">
                 {activeTab === 'single' ? (
                   <div className="p-6 h-full flex flex-col">
                      <div className="flex-1 bg-studio-900 border border-studio-800 rounded-lg p-4 text-sm font-mono text-content-primary leading-relaxed shadow-inner min-h-[300px]">
                        {singlePromptResult || <span className="text-content-muted italic">{t.emptyPrompt}</span>}
                      </div>
                      {singlePromptResult && (
                        <button 
                          onClick={() => copyPrompt(singlePromptResult)}
                          className="mt-4 w-full py-3 bg-studio-800 hover:bg-studio-700 text-content-primary rounded flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-sm"
                        >
                          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                          {copied ? t.copied : t.copyPrompt}
                        </button>
                      )}
                   </div>
                 ) : (
                   <div className="p-2 h-full">
                     {scenes.length > 0 ? (
                        <StoryboardTable scenes={scenes} lang={lang} />
                     ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-content-muted space-y-3">
                          <Clapperboard size={48} className="opacity-20" />
                          <p className="text-xs uppercase tracking-widest opacity-50">{t.emptyScenes}</p>
                        </div>
                     )}
                   </div>
                 )}
              </div>
              
              {/* Footer Support */}
              <div className="p-3 bg-studio-900 border-t border-studio-800 flex justify-between items-center text-[10px] text-content-muted shrink-0">
                 <div className="flex items-center gap-2">
                   <Heart size={10} className="text-studio-accent" />
                   <span>{t.supportDeveloper}</span>
                 </div>
                 <div className="flex gap-2">
                    <Coffee size={12} className="hover:text-content-primary cursor-pointer transition-colors" />
                    <Youtube size={12} className="hover:text-red-500 cursor-pointer transition-colors" />
                 </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;