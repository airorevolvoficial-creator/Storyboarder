import { AspectRatio, CameraCategory, ShotType, PacingMode, ShotSequence } from "./types";

// --- SINGLE SHOT MODE CONSTANTS ---

export const TRANSLATIONS = {
  RU: {
    // App Shell
    appTitle: "РЕЖИССЕРСКИЙ МОНИТОР",
    appSubtitle: "ЕДИНОЕ РАБОЧЕЕ ПРОСТРАНСТВО v2.0",
    
    // Left Column
    audioRef: "АУДИО РЕФЕРЕНС",
    uploadAudioPlaceholder: "Загрузить MP3/WAV",
    scriptLyrics: "ЛИРИКА / ТЕКСТ ПЕСНИ",
    scriptPlaceholder: "Вставьте текст песни (для ритма и настроения)...",
    storyScenario: "СЦЕНАРИЙ ИСТОРИИ (ДЕЙСТВИЯ)",
    storyPlaceholder: "Опишите действия героя (сидит в машине, заходит в кафе...). Сюжет будет строго следовать этому тексту.",
    singleSceneDesc: "ОПИСАНИЕ СЦЕНЫ (ОДИН КАДР)",
    singleScenePlaceholder: "Опишите конкретную сцену для генерации одного промпта...",
    charRefs: "ПЕРСОНАЖИ И ОБЪЕКТЫ",
    
    // Director Console (Middle)
    visualStyle: "ВИЗУАЛЬНЫЙ СТИЛЬ",
    duration: "ДЛИТЕЛЬНОСТЬ",
    pacing: "РИТМ (PACING)",
    shotLogic: "ЛОГИКА ПЛАНОВ",
    aspectRatio: "ФОРМАТ КАДРА",
    shotSizeLens: "ПЛАН И ОПТИКА",
    cameraMovements: "ДВИЖЕНИЯ КАМЕРЫ",
    
    // Actions & Output (Right)
    btnGenerateSingle: "ГЕНЕРИРОВАТЬ ОДИН ПРОМПТ (ВРУЧНУЮ)",
    btnGenerateBatch: "ГЕНЕРИРОВАТЬ РАСКАДРОВКУ (АВТО)",
    tabStoryboard: "ТАБЛИЦА РАСКАДРОВКИ",
    tabSingle: "ОДИНОЧНЫЙ ПРОМПТ",
    emptyScenes: "СЦЕНЫ НЕ СГЕНЕРИРОВАНЫ",
    emptyPrompt: "Здесь появится сгенерированный промпт...",
    copyPrompt: "КОПИРОВАТЬ ПРОМПТ",
    copied: "СКОПИРОВАНО",
    supportDeveloper: "Поддержать разработчика",
    
    // Components
    charRefsMax: "Референсы (1=Герой, 2-4=Объекты)",
    upload: "Загрузить",
    tableTime: "Тайминг",
    tableShot: "План",
    tableCamera: "Камера",
    tableDesc: "Описание Сцены",
    tableAction: "Действие",
    tablePromptLabel: "ПРОМПТ",

    // Legacy/Shared
    sceneDesc: "ОПИСАНИЕ СЦЕНЫ",
    scenePlaceholder: "Опишите сцену...",
    voice: "ГОЛОС",
    format: "ФОРМАТ",
    visualRef: "РЕФЕРЕНС",
    shotPlan: "ПЛАН",
    cameraMove: "КАМЕРА",
    finalPrompt: "ИТОГ",
    copy: "Копировать",
    status: "СТАТУС",
    outputLang: "Язык",
    movesSelected: "Движения",
    formatSelected: "Формат",
    notSelected: "НЕТ",
    support: "ПОДДЕРЖКА",
    supportText: "Спасибо за использование инструмента!",
    translateBtn: "ПЕРЕВЕСТИ",
    translating: "ДУМАЮ...",
    projectTitle: "AI DIRECTOR"
  },
  EN: {
    // App Shell
    appTitle: "DIRECTOR'S MONITOR",
    appSubtitle: "UNIFIED WORKSPACE v2.0",
    
    // Left Column
    audioRef: "AUDIO REFERENCE",
    uploadAudioPlaceholder: "Upload MP3/WAV Ref",
    scriptLyrics: "LYRICS / SONG TEXT",
    scriptPlaceholder: "Paste lyrics here (for rhythm and mood)...",
    storyScenario: "STORY SCENARIO (ACTIONS)",
    storyPlaceholder: "Describe hero actions (sitting in car, entering cafe...). The visual plot will strictly follow this text.",
    singleSceneDesc: "SINGLE SCENE DESC",
    singleScenePlaceholder: "Describe a single specific shot to generate just one prompt...",
    charRefs: "CHARACTERS & OBJECTS",
    
    // Director Console (Middle)
    visualStyle: "VISUAL STYLE",
    duration: "DURATION",
    pacing: "PACING",
    shotLogic: "SHOT LOGIC",
    aspectRatio: "ASPECT RATIO",
    shotSizeLens: "SHOT SIZE & LENS",
    cameraMovements: "CAMERA MOVEMENTS",
    
    // Actions & Output (Right)
    btnGenerateSingle: "GENERATE SINGLE PROMPT (MANUAL)",
    btnGenerateBatch: "GENERATE FULL STORYBOARD (AUTO)",
    tabStoryboard: "STORYBOARD TABLE",
    tabSingle: "SINGLE PROMPT",
    emptyScenes: "NO SCENES GENERATED",
    emptyPrompt: "Generated prompt will appear here...",
    copyPrompt: "COPY PROMPT",
    copied: "COPIED",
    supportDeveloper: "Support the developer",

    // Components
    charRefsMax: "References (1=Hero, 2-4=Objects)",
    upload: "Upload",
    tableTime: "Time",
    tableShot: "Shot",
    tableCamera: "Camera",
    tableDesc: "Scene Description",
    tableAction: "Action",
    tablePromptLabel: "PROMPT",

    // Legacy/Shared
    sceneDesc: "SCENE DESCRIPTION",
    scenePlaceholder: "Describe the scene...",
    voice: "VOICE",
    format: "ASPECT RATIO",
    visualRef: "VISUAL REFERENCE",
    shotPlan: "SHOT SIZE & LENS",
    cameraMove: "CAMERA MOVEMENT",
    finalPrompt: "FINAL PROMPT",
    copy: "Copy Prompt",
    status: "STATUS",
    outputLang: "Output Language",
    movesSelected: "Moves Selected",
    formatSelected: "Format",
    notSelected: "NOT SELECTED",
    support: "SUPPORT PROJECT",
    supportText: "Thanks for using the tool!",
    translateBtn: "TRANSLATE & ENHANCE",
    translating: "GENERATING...",
    projectTitle: "AI DIRECTOR MONITOR"
  }
};

export const ASPECT_RATIOS: AspectRatio[] = [
  { id: '9:16', label: '9:16', icon: 'h-8 w-5' },
  { id: '16:9', label: '16:9', icon: 'h-5 w-8' },
  { id: '4:3', label: '4:3', icon: 'h-6 w-8' },
  { id: '1:1', label: '1:1', icon: 'h-6 w-6' },
];

export const SHOT_TYPES: ShotType[] = [
  { id: 'close', labelRu: 'КРУПНЫЙ ПЛАН', labelEn: 'CLOSE UP', lens: '85mm or 100mm Macro Lens' },
  { id: 'medium', labelRu: 'СРЕДНИЙ ПЛАН', labelEn: 'MEDIUM SHOT', lens: '35mm or 50mm Prime Lens' },
  { id: 'wide', labelRu: 'ОБЩИЙ ПЛАН', labelEn: 'WIDE SHOT', lens: '24mm or 16mm Wide Angle' },
];

export const CAMERA_CATEGORIES: CameraCategory[] = [
  {
    id: 'axis',
    titleRu: 'ВРАЩЕНИЕ ПО ОСЯМ',
    titleEn: 'AXIS ROTATION',
    moves: [
      { id: 'static', labelRu: 'Статичная камера', labelEn: 'Static Camera' },
      { id: 'pan_left', labelRu: 'Панорама влево', labelEn: 'Pan Left' },
      { id: 'pan_right', labelRu: 'Панорама вправо', labelEn: 'Pan Right' },
      { id: 'tilt_up', labelRu: 'Наклон вверх', labelEn: 'Tilt Up' },
      { id: 'tilt_down', labelRu: 'Наклон вниз', labelEn: 'Tilt Down' },
      { id: 'dutch', labelRu: 'Голландский угол', labelEn: 'Dutch Angle' },
      { id: 'whip', labelRu: 'Хлыст-панорама', labelEn: 'Whip Pan' },
      { id: 'snap_tilt', labelRu: 'Резкий наклон', labelEn: 'Snap Tilt' },
    ]
  },
  {
    id: 'zoom',
    titleRu: 'ЗУМ И ОПТИКА',
    titleEn: 'ZOOM & OPTICS',
    moves: [
      { id: 'zoom_in', labelRu: 'Наезд (зум)', labelEn: 'Zoom In' },
      { id: 'zoom_out', labelRu: 'Отъезд (зум)', labelEn: 'Zoom Out' },
      { id: 'crash_zoom', labelRu: 'Резкий наезд', labelEn: 'Crash Zoom' },
      { id: 'rack_focus', labelRu: 'Перевод фокуса', labelEn: 'Rack Focus' },
      { id: 'vertigo', labelRu: 'Эффект Вертиго', labelEn: 'Vertigo Effect' },
      { id: 'slow_focus', labelRu: 'Медленный наплыв', labelEn: 'Slow Focus Push' },
      { id: 'snap_focus', labelRu: 'Мгновенный фокус', labelEn: 'Snap Focus' },
    ]
  },
  {
    id: 'physical',
    titleRu: 'ФИЗИЧЕСКОЕ ПЕРЕМЕЩЕНИЕ',
    titleEn: 'PHYSICAL MOVEMENT',
    moves: [
      { id: 'dolly_in', labelRu: 'Долли вперед', labelEn: 'Dolly In' },
      { id: 'dolly_out', labelRu: 'Долли назад', labelEn: 'Dolly Out' },
      { id: 'truck_left', labelRu: 'Слайд влево', labelEn: 'Truck Left' },
      { id: 'truck_right', labelRu: 'Слайд вправо', labelEn: 'Truck Right' },
      { id: 'pedestal_up', labelRu: 'Лифт вверх', labelEn: 'Pedestal Up' },
      { id: 'pedestal_down', labelRu: 'Лифт вниз', labelEn: 'Pedestal Down' },
      { id: 'tracking', labelRu: 'Ведущее следование', labelEn: 'Leading Tracking' },
      { id: 'chase', labelRu: 'Преследование сзади', labelEn: 'Chase Shot' },
      { id: 'low_track', labelRu: 'Слайд снизу', labelEn: 'Low Angle Tracking' },
    ]
  },
  {
    id: 'effects',
    titleRu: 'КИНОЭФФЕКТЫ',
    titleEn: 'CINEMA EFFECTS',
    moves: [
      { id: 'reveal', labelRu: 'Слежение', labelEn: 'Reveal' },
      { id: 'orbit', labelRu: 'Орбита', labelEn: 'Orbit' },
      { id: 'arc', labelRu: 'Дуга', labelEn: 'Arc Shot' },
      { id: 'crane', labelRu: 'Кран', labelEn: 'Crane Shot' },
      { id: 'spiral', labelRu: 'Спиральный подъем', labelEn: 'Spiral Up' },
      { id: 'overhead', labelRu: 'Пролет сверху', labelEn: 'Overhead Flyover' },
    ]
  },
  {
    id: 'style',
    titleRu: 'СТИЛЬ И АТМОСФЕРА',
    titleEn: 'STYLE & ATMOSPHERE',
    moves: [
      { id: 'handheld', labelRu: 'С рук', labelEn: 'Handheld' },
      { id: 'steadicam', labelRu: 'Стейдикам', labelEn: 'Steadicam' },
      { id: 'pov', labelRu: 'От 1-го лица', labelEn: 'POV' },
      { id: 'fpv', labelRu: 'FPV-дрон', labelEn: 'FPV Drone' },
      { id: 'body_cam', labelRu: 'Боди-кам', labelEn: 'Body Cam' },
      { id: 'dreamy', labelRu: 'Сонная дымка', labelEn: 'Dreamy Haze' },
    ]
  },
  {
    id: 'action',
    titleRu: 'ЭКШЕН И ДИНАМИКА',
    titleEn: 'ACTION & DYNAMICS',
    moves: [
      { id: 'fpv_orbit', labelRu: 'FPV-дрон (орбита)', labelEn: 'FPV Orbit' },
      { id: 'snorricam', labelRu: 'Сноррикам', labelEn: 'Snorricam' },
      { id: 'bullet_time', labelRu: 'Время пули', labelEn: 'Bullet Time' },
      { id: 'explosion', labelRu: 'Эффект взрыва', labelEn: 'Explosion Shake' },
      { id: 'vortex', labelRu: 'Вихревая орбита', labelEn: 'Vortex Orbit' },
      { id: 'crash', labelRu: 'Камера-таран', labelEn: 'Camera Crash' },
    ]
  }
];

// --- STORYBOARD MODE CONSTANTS ---

export const CAMERA_MOVES_LIST = [
  "Static Tripod (No movement)", "Slow Pan Left", "Slow Pan Right", "Whip Pan (Fast transition)",
  "Tilt Up (Reveal sky/tall object)", "Tilt Down (Reveal ground)", "Pedestal Up (Camera rises)", "Pedestal Down (Camera lowers)",
  "Dolly In (Slow Zoom)", "Dolly Out (Reveal context)", "Zoom Snap (Fast zoom)", "Crash Zoom (Dramatic)",
  "Truck Left (Parallel tracking)", "Truck Right (Parallel tracking)", "Arc Shot (Orbit 180°)", "Orbit 360° (Full circle)",
  "Handheld (Shaky/Realistic)", "Steadicam (Smooth follow)", "Gimbal Walk", "Shoulder Rig (Documentary)",
  "Drone: Bird's Eye (Top down)", "Drone: Flyover", "Drone: Pull Back & Up", "Drone: Chase",
  "FPV (First Person View)", "POV (Point of View)", "Low Angle (Hero shot)", "Dutch Angle (Disorienting)",
  "Over the Shoulder (Dialogue)", "Rack Focus (Background to Foreground)", "Rack Focus (Foreground to Background)",
  "Vertigo Effect (Dolly Zoom)", "Bullet Time (Matrix style)", "Slow Motion (High FPS)", "Timelapse",
  "Hyperlapse (Moving timelapse)", "Underwater Cam", "Action Cam (GoPro style)", "CCTV (Security camera)", "Macro Shot (Extreme close-up)"
];

export const VISUAL_STYLES = [
  "Cinematic Hyper-Realistic 4K", 
  "Cyberpunk / Neon", 
  "Anime / Manga Style", 
  "Vintage Film 16mm", 
  "Dark Fantasy / Noir", 
  "Pixar / 3D Animation", 
  "Oil Painting Style",
  "VHS / 90s Home Video",
  "Black & White / Sin City"
];

export const TARGET_MODELS = [
  "Google Veo", 
  "Grok Video", 
  "Runway Gen-3", 
  "Sora", 
  "Midjourney (Images)"
];

export const PACING_OPTIONS = Object.values(PacingMode);
export const SHOT_SEQUENCES = Object.values(ShotSequence);

export const DEFAULT_STORYBOARD_CONFIG = {
  lyrics: "",
  story: "",
  duration: "3:00",
  pacing: PacingMode.SUPER_LOGIC,
  shotSequence: ShotSequence.CLASSIC,
  visualStyle: "Cinematic Hyper-Realistic 4K",
  targetModel: "Google Veo"
};