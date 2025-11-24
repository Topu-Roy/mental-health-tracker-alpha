"use server";

import { db } from "@/server/db";
import { getServerAuthSession } from "@/lib/auth";
import { z } from "zod";

const createDailyReflectionSchema = z.object({
  overallMood: z.enum(["Great", "Good", "Okay", "Bad", "Awful"]),
  emotions: z.record(z.string(), z.number()), // e.g., { "Happy": 2, "Anxious": 1 }
  lessonsLearned: z.string().optional(),
  learnings: z.array(z.string()).optional(),
});

export async function createDailyReflection(input: z.infer<typeof createDailyReflectionSchema>) {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { overallMood, emotions, lessonsLearned, learnings } = createDailyReflectionSchema.parse(input);

  // Check if reflection already exists for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existingReflection = await db.dailyReflection.findFirst({
    where: {
      userId: session.user.id,
      date: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  if (existingReflection) {
    throw new Error("Reflection already exists for today");
  }

  const reflection = await db.dailyReflection.create({
    data: {
      overallMood,
      emotions,
      lessonsLearned,
      userId: session.user.id,
      date: new Date(),
      learnings: learnings
        ? {
            create: learnings.map((content) => ({
              content,
              userId: session.user.id,
            })),
          }
        : undefined,
    },
    include: {
      learnings: true,
    },
  });

  return reflection;
}

export async function getDailyReflection(date: Date) {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const reflection = await db.dailyReflection.findFirst({
    where: {
      userId: session.user.id,
      date: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
    include: {
      learnings: true,
    },
  });

  return reflection;
}

export async function getReflections() {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const reflections = await db.dailyReflection.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      date: "desc",
    },
    include: {
      learnings: true,
    },
  });

  return reflections;
}
