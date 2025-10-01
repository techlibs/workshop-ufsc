import { Mood } from "./movie-data";

export type { Mood };

export interface MoodMapping {
  mood: Mood;
  genres: string[];
  keywords: string[];
  description: string;
}

export const moodMappings: MoodMapping[] = [
  {
    mood: "happy",
    genres: ["Comedy", "Animation", "Musical", "Family"],
    keywords: ["uplifting", "funny", "cheerful", "lighthearted", "feel-good"],
    description: "Light and fun content to boost your spirits",
  },
  {
    mood: "sad",
    genres: ["Drama", "Romance"],
    keywords: ["emotional", "touching", "cathartic", "heartfelt"],
    description: "Emotional stories that resonate with your feelings",
  },
  {
    mood: "excited",
    genres: ["Action", "Adventure", "Superhero", "Thriller"],
    keywords: ["adrenaline", "fast-paced", "intense", "explosive"],
    description: "High-energy content to match your excitement",
  },
  {
    mood: "relaxed",
    genres: ["Comedy", "Documentary", "Nature", "Slice of Life"],
    keywords: ["calm", "peaceful", "easy-watching", "soothing"],
    description: "Calm and easy-going content for unwinding",
  },
  {
    mood: "romantic",
    genres: ["Romance", "Drama", "Comedy"],
    keywords: ["love", "relationships", "passion", "heartwarming"],
    description: "Love stories and romantic adventures",
  },
  {
    mood: "adventurous",
    genres: ["Adventure", "Action", "Sci-Fi", "Fantasy"],
    keywords: ["exploration", "journey", "discovery", "epic"],
    description: "Epic journeys and exciting discoveries",
  },
  {
    mood: "thoughtful",
    genres: ["Drama", "Documentary", "Sci-Fi", "Mystery", "Biography"],
    keywords: ["intellectual", "philosophical", "mind-bending", "profound"],
    description: "Content that makes you think and reflect",
  },
  {
    mood: "scared",
    genres: ["Horror", "Thriller", "Mystery", "Supernatural"],
    keywords: ["scary", "suspenseful", "creepy", "tense"],
    description: "Frightening content for thrill seekers",
  },
  {
    mood: "nostalgic",
    genres: ["Drama", "Comedy", "Coming-of-age", "Period"],
    keywords: ["retro", "classic", "memories", "throwback"],
    description: "Content that brings back memories",
  },
  {
    mood: "energetic",
    genres: ["Action", "Sports", "Music", "Dance"],
    keywords: ["dynamic", "vibrant", "upbeat", "lively"],
    description: "High-energy content to keep you pumped",
  },
  {
    mood: "melancholic",
    genres: ["Drama", "Art House", "Indie"],
    keywords: ["contemplative", "bittersweet", "introspective", "poignant"],
    description: "Reflective and emotionally complex content",
  },
  {
    mood: "inspired",
    genres: ["Biography", "Documentary", "Drama", "Sports"],
    keywords: ["motivational", "uplifting", "inspiring", "empowering"],
    description: "Stories that motivate and inspire",
  },
];

export function getMoodMapping(mood: Mood): MoodMapping | undefined {
  return moodMappings.find((m) => m.mood === mood);
}

export function getGenresByMood(moods: Mood[]): string[] {
  const genres = new Set<string>();

  moods.forEach((mood) => {
    const mapping = getMoodMapping(mood);
    if (mapping) {
      mapping.genres.forEach((genre) => genres.add(genre));
    }
  });

  return Array.from(genres);
}

export function analyzeMoodFromText(text: string): Mood[] {
  const lowerText = text.toLowerCase();
  const detectedMoods: Mood[] = [];

  // Keywords for each mood
  const moodKeywords: Record<Mood, string[]> = {
    happy: [
      "happy",
      "alegre",
      "feliz",
      "joy",
      "fun",
      "laugh",
      "rir",
      "divertido",
    ],
    sad: ["sad", "triste", "down", "cry", "chorar", "depressed", "deprimido"],
    excited: ["excited", "animado", "empolgado", "thrilled", "pumped", "ação"],
    relaxed: ["relaxed", "relaxar", "chill", "calm", "tranquilo", "descansar"],
    romantic: ["romantic", "romântico", "love", "amor", "passion", "paixão"],
    adventurous: ["adventure", "aventura", "explore", "explorar", "journey"],
    thoughtful: [
      "think",
      "pensar",
      "deep",
      "profundo",
      "philosophical",
      "filosófico",
    ],
    scared: ["scared", "medo", "horror", "terror", "frightened", "assustado"],
    nostalgic: [
      "nostalgic",
      "nostálgico",
      "remember",
      "lembrar",
      "past",
      "passado",
    ],
    energetic: [
      "energetic",
      "energético",
      "active",
      "ativo",
      "dynamic",
      "dinâmico",
    ],
    melancholic: ["melancholic", "melancólico", "contemplative", "reflexivo"],
    inspired: ["inspired", "inspirado", "motivated", "motivado", "inspire"],
  };

  // Check for mood keywords in text
  Object.entries(moodKeywords).forEach(([mood, keywords]) => {
    if (keywords.some((keyword) => lowerText.includes(keyword))) {
      detectedMoods.push(mood as Mood);
    }
  });

  // If no specific mood detected, try to infer from context
  if (detectedMoods.length === 0) {
    if (lowerText.includes("weekend") || lowerText.includes("fim de semana")) {
      detectedMoods.push("relaxed");
    }
    if (lowerText.includes("night") || lowerText.includes("noite")) {
      detectedMoods.push("thoughtful");
    }
    if (lowerText.includes("friends") || lowerText.includes("amigos")) {
      detectedMoods.push("happy", "energetic");
    }
    if (lowerText.includes("alone") || lowerText.includes("sozinho")) {
      detectedMoods.push("thoughtful", "melancholic");
    }
  }

  return detectedMoods;
}

export function getMoodRecommendationPrompt(moods: Mood[]): string {
  const mappings = moods
    .map((mood) => getMoodMapping(mood))
    .filter(Boolean) as MoodMapping[];

  if (mappings.length === 0) return "I can help you find something to watch!";

  const genres = Array.from(new Set(mappings.flatMap((m) => m.genres)));
  const descriptions = mappings.map((m) => m.description);

  return `Based on your mood, I recommend ${genres.slice(0, 3).join(", ")} content. ${descriptions[0]}`;
}
