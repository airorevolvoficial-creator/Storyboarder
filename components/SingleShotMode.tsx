import React, { useState } from 'react';
import { 
  Copy, 
  Mic, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  Globe, 
  Heart, 
  Youtube, 
  Send, 
  Coffee
} from 'lucide-react';

import { 
  TRANSLATIONS, 
  ASPECT_RATIOS, 
  SHOT_TYPES, 
  CAMERA_CATEGORIES 
} from '../constants';

import { Language, ImageRef } from '../types';
import { translateAndEnhance } from '../services/geminiService';

const SingleShotMode: React.FC = () => {
  // State
  const [lang, setLang] = useState<Language>('RU');
  const [description, setDescription] = useState('');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [shotType, setShotType] = useState<string>('medium');
  const [selectedMoves, setSelectedMoves] = useState<string[]>([]);
  const [image, setImage] = useState<ImageRef | null>(null);
  const [generatedPromptPart, setGeneratedPromptPart] = useState(''); // The text from AI
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Computed Text
  const t = TRANSLATIONS[lang];

  // Helper to toggle array selection
  const toggleMove = (id: string) => {
    setSelectedMoves(prev => 
      prev.includes(id) 
        ? prev.filter(m => m !== id) 
        : [...prev, id]
    );
  };

  // Construct Final Prompt
  const getFinalPrompt = () => {
    const parts = [];

    // 1. Shot Type & Lens
    const shot = SHOT_TYPES.find(s => s.id === shotType);
    if (shot) parts.push(`${shot.labelEn}, ${shot.lens}.`);

    // 2. Camera Moves
    const moveNames: string[] = [];
    CAMERA_CATEGORIES.forEach(cat => {
      cat.moves.forEach(m => {
        if (selectedMoves.includes(m.id)) {
          moveNames.push(m.labelEn);
        }
      });
    });
    if (moveNames.length > 0) {
      parts.push(`${moveNames.join(', ')}.`);
    }

    // 3. Description (AI Enhanced or Raw)
    if (generatedPromptPart) {
      parts.push(generatedPromptPart);
    } else if (description) {
      parts.push(description); // Fallback if not translated yet
    }

    return parts.join(' ');
  };

  const handleTranslate = async () => {
    if (!description) return;
    setIsTranslating(true);
    try {
      const result = await translateAndEnhance(description, image ? [image] : []);
      setGeneratedPromptPart(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });
      setImage({
        file,
        previewUrl: URL.createObjectURL(file),
        base64,
        mimeType: file.type
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getFinalPrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const SectionTitle = ({ label }: { label: string }) => (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-4 bg-studio-accent rounded-sm"></div>
      <h3 className="text-studio-accent font-bold text-xs tracking-wider uppercase">{label}</h3>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header Language Switcher Only (Main title handled in App shell) */}
      <div className="h-10 border-b border-studio-800 bg-studio-900/50 flex items-center justify-end px-6 shrink-0 z-10">
        <button 
          onClick={() => setLang(l => l === 'RU' ? 'EN' : 'RU')}
          className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors"
        >
          <Globe size={14} />
          {lang}
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col lg:flex-row">
          
          {/* LEFT COLUMN: CONTROLS (Scrollable) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-32">
            
            {/* 1. SCENE DESCRIPTION */}
            <div className="bg-studio-900/50 rounded-xl p-4 border border-studio-800">
              <div className="flex justify-between items-start mb-2">
                <SectionTitle label={t.sceneDesc} />
                <button className="flex items-center gap-1 text-[10px] bg-studio-800 hover:bg-studio-700 px-2 py-1 rounded-full text-gray-400 transition-colors">
                  <Mic size={10} />
                  {t.voice}
                </button>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.scenePlaceholder}
                className="w-full bg-studio-800/50 text-gray-200 text-sm p-4 rounded-lg border border-studio-700 focus:border-studio-accent focus:ring-1 focus:ring-studio-accent outline-none resize-none h-32 transition-all placeholder:text-gray-600"
              />
              <div className="mt-2 flex justify-end">
                 <button 
                    onClick={handleTranslate}
                    disabled={isTranslating || !description}
                    className="text-xs bg-studio-700 hover:bg-studio-600 text-white px-3 py-1.5 rounded flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isTranslating ? (
                       <span className="animate-pulse">{t.translating}</span>
                    ) : (
                      <>
                        <span>{t.translateBtn}</span>
                        <Send size={12} />
                      </>
                    )}
                 </button>
              </div>
            </div>

            {/* 2. FORMAT (Aspect Ratio) */}
            <div>
              <SectionTitle label={t.format} />
              <div className="grid grid-cols-4 gap-3">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setAspectRatio(ratio.id)}
                    className={`
                      flex flex-col items-center justify-center gap-2 py-4 rounded-lg border transition-all
                      ${aspectRatio === ratio.id 
                        ? 'bg-studio-800 border-studio-accent text-studio-accent shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                        : 'bg-studio-900 border-studio-800 text-gray-500 hover:border-studio-600 hover:text-gray-300'}
                    `}
                  >
                    <div className={`border-2 rounded-sm ${aspectRatio === ratio.id ? 'border-studio-accent' : 'border-current'} ${ratio.icon}`}></div>
                    <span className="text-xs font-mono font-medium">{ratio.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. VISUAL REFERENCE */}
            <div>
              <SectionTitle label={t.visualRef} />
              <div className="h-32 w-full border border-dashed border-studio-700 rounded-xl bg-studio-900/30 flex flex-col items-center justify-center relative group hover:border-studio-600 transition-colors overflow-hidden">
                {image ? (
                  <>
                    <img src={image.previewUrl} alt="Ref" className="w-full h-full object-cover opacity-60" />
                    <button 
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full text-white hover:bg-red-900/80 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <ImageIcon className="text-studio-600 mb-2 group-hover:text-studio-500" size={24} />
                    <span className="text-xs text-studio-500 font-medium">{t.upload}</span>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} accept="image/*" />
                  </>
                )}
              </div>
            </div>

            {/* 4. SHOT PLAN */}
            <div>
              <SectionTitle label={t.shotPlan} />
              <div className="grid grid-cols-3 gap-3">
                {SHOT_TYPES.map((shot) => (
                  <button
                    key={shot.id}
                    onClick={() => setShotType(shot.id)}
                    className={`
                      text-left p-3 rounded-lg border transition-all relative overflow-hidden group
                      ${shotType === shot.id 
                        ? 'bg-studio-800 border-studio-accent text-white' 
                        : 'bg-studio-900 border-studio-800 text-gray-400 hover:border-studio-600'}
                    `}
                  >
                    <div className="relative z-10">
                      <div className={`text-[10px] font-bold uppercase mb-0.5 ${shotType === shot.id ? 'text-studio-accent' : 'text-gray-500'}`}>
                        {lang === 'RU' ? shot.labelRu : shot.labelEn}
                      </div>
                      <div className="text-[10px] opacity-70 leading-tight">{shot.lens}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. CAMERA MOVEMENTS */}
            <div>
              <SectionTitle label={t.cameraMove} />
              <div className="space-y-6">
                {CAMERA_CATEGORIES.map((cat) => (
                  <div key={cat.id}>
                    <div className="flex items-center gap-2 mb-2 ml-1">
                      <div className="w-1 h-1 bg-studio-600 rounded-full"></div>
                      <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                        {lang === 'RU' ? cat.titleRu : cat.titleEn}
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {cat.moves.map((move) => {
                        const isSelected = selectedMoves.includes(move.id);
                        return (
                          <button
                            key={move.id}
                            onClick={() => toggleMove(move.id)}
                            className={`
                              px-3 py-2 rounded text-[11px] font-medium border transition-all truncate
                              ${isSelected 
                                ? 'bg-studio-accent text-black border-studio-accent shadow-lg shadow-studio-accent/20' 
                                : 'bg-studio-900 border-studio-800 text-gray-400 hover:bg-studio-800 hover:border-studio-600'}
                            `}
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

          {/* RIGHT COLUMN: OUTPUT & STATUS (Fixed on Desktop) */}
          <div className="lg:w-[450px] bg-studio-900 border-l border-studio-800 flex flex-col h-full shrink-0">
            
            {/* Output Box */}
            <div className="p-6 flex-1 flex flex-col min-h-0">
               <SectionTitle label={t.finalPrompt} />
               <div className="flex-1 bg-studio-950 rounded-xl border border-studio-700 p-4 font-mono text-sm text-gray-300 leading-relaxed overflow-y-auto relative custom-scrollbar shadow-inner">
                 {getFinalPrompt() || <span className="text-gray-700 italic">...</span>}
               </div>
               
               <button 
                onClick={copyToClipboard}
                className="mt-4 w-full bg-studio-800 hover:bg-studio-700 text-gray-200 border border-studio-600 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all group"
               >
                 {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-400 group-hover:text-white" />}
                 {t.copy}
               </button>
            </div>

            {/* Status Panel */}
            <div className="px-6 py-4 border-t border-studio-800 bg-studio-800/30">
              <SectionTitle label={t.status} />
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b border-studio-700/50">
                   <span className="text-gray-500">{t.outputLang}</span>
                   <span className="text-studio-accent bg-studio-accent/10 px-2 py-0.5 rounded border border-studio-accent/20">ENGLISH ONLY</span>
                </div>
                <div className="flex justify-between py-2 border-b border-studio-700/50">
                   <span className="text-gray-500">{t.movesSelected}</span>
                   <span className="text-gray-200">{selectedMoves.length} ({selectedMoves.length > 0 ? 'Custom' : 'Static'})</span>
                </div>
                <div className="flex justify-between py-2">
                   <span className="text-gray-500">{t.formatSelected}</span>
                   <span className={aspectRatio ? "text-white" : "text-red-400 uppercase"}>
                     {aspectRatio || t.notSelected}
                   </span>
                </div>
              </div>
            </div>

            {/* Support Panel */}
            <div className="p-6 border-t border-studio-800 bg-studio-900">
               <div className="flex items-center gap-2 mb-3 text-studio-accent/80">
                  <Heart size={14} />
                  <h3 className="font-bold text-xs tracking-wider uppercase">{t.support}</h3>
               </div>
               <p className="text-[10px] text-gray-500 italic mb-4 leading-relaxed">
                 {t.supportText}
               </p>

               <div className="grid grid-cols-2 gap-2">
                 <button className="bg-[#0070BA] hover:bg-[#005ea6] text-white py-2 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                    PayPal
                 </button>
                 <button className="bg-[#f97316] hover:bg-[#ea580c] text-white py-2 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                    <Coffee size={14} /> Boosty
                 </button>
                 <button className="bg-[#FF0000] hover:bg-[#cc0000] text-white py-2 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                    <Youtube size={14} /> YouTube
                 </button>
                 <button className="bg-[#229ED9] hover:bg-[#1e8bc0] text-white py-2 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                    <Send size={14} /> Telegram
                 </button>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleShotMode;
