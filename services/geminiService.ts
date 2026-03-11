import { GoogleGenAI, Type } from "@google/genai";
import { ImageRef, AudioRef, StoryboardConfig, StoryboardScene } from "../types";
import { CAMERA_MOVES_LIST } from "../constants";

// --- SINGLE SHOT MODE: Translate & Enhance ---
export const translateAndEnhance = async (
  description: string,
  images: ImageRef[]
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Prepare images if any
  const imageParts = images.map((img) => ({
    inlineData: {
      data: img.base64,
      mimeType: img.mimeType,
    },
  }));

  const systemPrompt = `
    You are an expert Cinematographer and Prompt Engineer for AI Video Generation models (like Veo, Sora, Gen-3).
    
    Your task:
    1. Take the user's raw scene description (which may be in Russian).
    2. Translate it into professional English.
    3. Enhance it with high-quality visual descriptors (lighting, texture, atmosphere) suitable for video generation.
    4. IF images are provided, analyze them and include a brief 1-sentence visual description of the subject/style in the prompt to ensure consistency.
    5. Output ONLY the enhanced English prompt text. Do not add conversational filler.
    
    Example Input: "Парень идет по дождливой улице, неон."
    Example Output: "Cinematic shot of a young man walking down a rain-slicked street at night, illuminated by vibrant pink and blue neon signs reflecting in puddles, moody atmosphere, highly detailed texture, 4k."
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        role: "user",
        parts: [
          ...imageParts,
          { text: `${systemPrompt}\n\nUSER DESCRIPTION: ${description}` }
        ]
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return text.trim();

  } catch (error) {
    console.error("Gemini Translation Error:", error);
    throw error;
  }
};

// --- STORYBOARD MODE: Batch Generation ---
export const generateStoryboard = async (
  config: StoryboardConfig,
  images: ImageRef[],
  audio: AudioRef | null
): Promise<StoryboardScene[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Prepare multimedia parts
  const parts: any[] = [];

  // 1. Images
  images.forEach((img) => {
    parts.push({
      inlineData: {
        data: img.base64,
        mimeType: img.mimeType,
      },
    });
  });

  // 2. Audio (if present)
  if (audio) {
    parts.push({
      inlineData: {
        data: audio.base64,
        mimeType: audio.mimeType,
      },
    });
  }

  const systemPrompt = `
    You are an expert Film Director and Cinematographer. Your task is to create a detailed VIDEO STORYBOARD based on the provided inputs.

    ### INPUT DATA:
    1. Song Duration: ${config.duration}
    2. Pacing Strategy: ${config.pacing}
    3. Shot Sequence Rule: ${config.shotSequence}
    4. Visual Style: ${config.visualStyle}
    5. Target Model Format: ${config.targetModel}
    ${audio ? "6. AUDIO REFERENCE: Listen to the mood/rhythm to align cuts." : ""}

    ### CRITICAL RULES FOR VISUAL CONSISTENCY & STORY:
    
    1. **STORY SCENARIO PRIORITY**: 
       - Use the provided "STORY SCENARIO" text to determine the specific ACTIONS, LOCATIONS, and EVENTS for the storyboard. 
       - The story must progress logically scene by scene.
       - Use "Lyrics" primarily for mood, pacing, and lip-sync context, but the VISUAL ACTION must follow the "STORY SCENARIO".

    2. **CHARACTER CONSISTENCY (Image 1)**:
       - The FIRST uploaded image is the MAIN CHARACTER.
       - You MUST strictly describe their physical features (face, hair, build, clothing) identically in EVERY generated prompt to ensure face consistency.
       - CHANGE their facial expressions (happy, sad, angry) to match the emotional context of the scene/story.

    3. **SECONDARY OBJECTS (Images 2-4)**:
       - If additional reference images are provided (2nd, 3rd, or 4th image), treat them as KEY NARRATIVE OBJECTS (e.g., a specific water bottle, a car, a weapon, a phone).
       - **MANDATORY**: These objects must appear in 70-90% of the generated scenes.
       - Describe them interacting with the character (holding, looking at, next to) or present in the environment.

    ### CAMERA LIBRARY (Choose from these ONLY):
    ${CAMERA_MOVES_LIST.join(', ')}

    ### OUTPUT FORMAT:
    Return a valid JSON array of objects.
    Each object must represent a scene and contain:
    - timeCode (string, e.g., "00:00")
    - duration (string, e.g., "4s")
    - shotType (string, e.g., "Wide Shot")
    - cameraMove (string, selected from library)
    - sceneDescription (string, in Russian, detailed visual description based on Story Scenario)
    - englishPrompt (string, Technical prompt for ${config.targetModel})

    Prompt Construction Rules for 'englishPrompt':
    - Structure: [Style Keywords], [Character Description], [Action from Story Scenario], [Secondary Object Description if applicable], [Camera Move], [Lighting/Atmosphere].
    - Do not use Markdown formatting in the JSON values.
  `;

  const userMessage = `
    STORY SCENARIO (ACTIONS):
    ${config.story || "No specific story provided. Create a music video narrative based on the lyrics."}

    LYRICS / SCRIPT:
    ${config.lyrics}
  `;

  // Add prompts to parts
  parts.push({ text: systemPrompt + "\n\n" + userMessage });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: {
        parts: parts
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              timeCode: { type: Type.STRING },
              duration: { type: Type.STRING },
              shotType: { type: Type.STRING },
              cameraMove: { type: Type.STRING },
              sceneDescription: { type: Type.STRING },
              englishPrompt: { type: Type.STRING },
            },
            required: ["timeCode", "duration", "shotType", "cameraMove", "sceneDescription", "englishPrompt"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(jsonText) as StoryboardScene[];
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};