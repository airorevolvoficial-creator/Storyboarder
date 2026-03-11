export type Language = 'RU' | 'EN';

// --- SHARED / SINGLE SHOT TYPES ---
export interface AspectRatio {
  id: string;
  label: string;
  icon: string; // approximate shape
}

export interface ShotType {
  id: string;
  labelRu: string;
  labelEn: string;
  lens: string;
}

export interface CameraMove {
  id: string;
  labelRu: string;
  labelEn: string;
}

export interface CameraCategory {
  id: string;
  titleRu: string;
  titleEn: string;
  moves: CameraMove[];
}

export interface ImageRef {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}

export interface AudioRef {
  file: File;
  fileName: string;
  base64: string;
  mimeType: string;
}

// --- STORYBOARD MODE SPECIFIC TYPES ---
export interface StoryboardScene {
  timeCode: string;
  duration: string;
  shotType: string;
  cameraMove: string;
  sceneDescription: string;
  englishPrompt: string;
}

export interface StoryboardConfig {
  lyrics: string;
  story: string;
  duration: string;
  pacing: string;
  shotSequence: string;
  visualStyle: string;
  targetModel: string;
}

export enum PacingMode {
  TWO_SEC = "Every 2s",
  THREE_SEC = "Every 3s",
  SIX_SEC = "Every 6s",
  SUPER_LOGIC = "Super Logic (AI Director)"
}

export enum ShotSequence {
  CLASSIC = "Classic (Wide -> Medium -> Close-up)",
  INTIMATE = "Intimate (Close-up -> Medium -> Wide)",
  DYNAMIC = "Dynamic Random",
  DIALOGUE = "Dialogue Mode"
}