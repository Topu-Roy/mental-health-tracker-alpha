"use server";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function generateSummary({ article }: { article: string }) {
  const { text } = await generateText({
    model: google("gemini-2.0-flash"),
    system: "You are a professional writer. " + "You write simple, clear, and concise content.",
    prompt: `Summarize the following article in 3-5 sentences: ${article}`,
  });

  return text;
}
