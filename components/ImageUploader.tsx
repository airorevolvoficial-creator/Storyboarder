import React from 'react';
import { ImageRef, Language } from '../types';
import { Upload, X } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface ImageUploaderProps {
  images: ImageRef[];
  onImagesChange: (images: ImageRef[]) => void;
  lang: Language;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onImagesChange, lang }) => {
  const t = TRANSLATIONS[lang];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages: ImageRef[] = [];
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        if (images.length + newImages.length >= 4) break; // Limit to 4

        // Convert to base64
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
             // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
            resolve(result.split(',')[1]);
          };
          reader.readAsDataURL(file);
        });

        newImages.push({
          file,
          previewUrl: URL.createObjectURL(file),
          base64,
          mimeType: file.type
        });
      }
      
      onImagesChange([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-content-secondary">{t.charRefsMax}</label>
        <span className="text-xs text-content-muted">{images.length}/4</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {images.map((img, idx) => (
          <div key={idx} className="relative group aspect-square bg-studio-800 rounded-lg overflow-hidden border border-studio-700 shadow-sm">
            <img 
              src={img.previewUrl} 
              alt="Character ref" 
              className="w-full h-full object-cover"
            />
            <button 
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 bg-black/70 hover:bg-studio-accent text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        
        {images.length < 4 && (
          <label className="aspect-square flex flex-col items-center justify-center bg-studio-800 hover:bg-studio-700 border border-dashed border-studio-600 rounded-lg cursor-pointer transition-all group">
            <Upload className="w-6 h-6 text-content-muted group-hover:text-studio-accent mb-2 transition-colors" />
            <span className="text-xs text-content-muted group-hover:text-content-primary text-center px-1 transition-colors">{t.upload}</span>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;