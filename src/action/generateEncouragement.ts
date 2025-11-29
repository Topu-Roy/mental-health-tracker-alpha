"use server";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/server/db";

export async function generateEncouragement() {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Fetch user's past positive check-ins, memories, and learnings
  const pastCheckIns = await db.dailyCheckIn.findMany({
    where: {
      userId: session.user.id,
      OR: [{ overallMood: "Great" }, { overallMood: "Good" }],
    },
    include: {
      memories: true,
      learnings: true,
    },
    orderBy: {
      date: "desc",
    },
    take: 10, // Get last 10 positive check-ins
  });

  // Collect positive moments
  const positiveMoments = pastCheckIns
    .flatMap((checkIn) => checkIn.memories.map((m) => m.content))
    .slice(0, 10);

  const learnings = pastCheckIns.flatMap((checkIn) => checkIn.learnings.map((l) => l.content)).slice(0, 10);

  // Build context for AI
  const context = {
    positiveMoments,
    learnings,
    totalGoodDays: pastCheckIns.length,
  };

  const prompt = `You are a compassionate mental health support assistant. The user is having a difficult day and needs encouragement.

Based on their history:
- They've had ${context.totalGoodDays} good days recently
${
  context.positiveMoments.length > 0
    ? `\n- Some positive memories they've recorded:\n${context.positiveMoments
        .map((m) => `  • ${m}`)
        .join("\n")}`
    : ""
}
${
  context.learnings.length > 0
    ? `\n- Important learnings they've gained:\n${context.learnings.map((l) => `  • ${l}`).join("\n")}`
    : ""
}

Generate a warm, encouraging message (2-3 paragraphs, max 200 words) that:
1. Acknowledges that tough days happen
2. Reminds them of specific positive moments and growth
3. Encourages self-compassion
4. Ends with a gentle, hopeful note

Make it personal by referencing their actual memories and learnings. Be warm but not overly cheerful.`;

  const result = await generateText({
    model: google("gemini-2.0-flash-exp"),
    prompt,
  });

  return result.text;
}
