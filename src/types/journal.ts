export type Emotion = 
  | 'Happy' | 'Excited' | 'Grateful' | 'Relaxed'
  | 'Sad' | 'Anxious' | 'Angry' | 'Tired'
  | 'Frustrated' | 'Confused' | 'Proud' | 'Hopeful';

export interface EmotionTally {
  emotion: Emotion;
  count: number;
}

export interface JournalEntry {
  id: string;
  content: string;
  timestamp: Date;
}

export interface DailyReflection {
  id: string;
  date: string; // YYYY-MM-DD
  overallAssessment: number; // 1-10
  generalMood: Emotion;
  emotions: EmotionTally[];
  learned: string;
  lessons: string;
  timestamp: Date;
}

export interface JournalState {
  entries: JournalEntry[];
  reflections: DailyReflection[];
}
