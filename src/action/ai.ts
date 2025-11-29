"use server";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function generateSummary({ article }: { article: string }) {
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    system: "You are a professional writer. " + "You write simple, clear, and concise content.",
    prompt: `Summarize the following article in 3-5 sentences: ${article}`,
  });

  return text;
}

interface DayRatingInput {
  overallMood: string;
  emotions: Record<string, number>;
  lessonsLearned?: string;
  learnings?: string[];
}

export async function generateDayRating(input: DayRatingInput) {
  const { overallMood, emotions, lessonsLearned, learnings } = input;

  // Build context string without personal information
  const emotionsList = Object.entries(emotions)
    .filter(([, count]) => count > 0)
    .map(([emotion, count]) => `${emotion} (${count} times)`)
    .join(", ");

  const learningsList =
    learnings && learnings.length > 0 ? learnings.join("; ") : lessonsLearned || "None recorded";

  const prompt = `You are a mental health assessment AI. Based on the following day's emotional data, provide a single numerical rating from 0-100 representing overall day quality.

Overall Mood: ${overallMood}
Emotions Experienced: ${emotionsList || "None recorded"}
Lessons/Reflections: ${learningsList}

Consider:
- Positive moods (Great, Good) and emotions (Happy, Excited, Grateful, Proud, Hopeful, Relaxed) suggest higher ratings
- Negative moods (Bad, Awful) and emotions (Sad, Anxious, Angry, Frustrated, Confused, Tired) suggest lower ratings
- The presence of learnings and self-reflection indicates growth (add bonus points)
- Balance the intensity and frequency of emotions

Respond with ONLY a number between 0-100. No explanation, just the number.`;

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt,
  });

  // Parse the rating, default to 50 if parsing fails
  const rating = parseInt(text.trim(), 10);
  return isNaN(rating) ? 50 : Math.max(0, Math.min(100, rating));
}
