"use server";

import { db } from "@/server/db";
import { getServerAuthSession } from "@/lib/auth";
import { z } from "zod";

const createDailyCheckInSchema = z.object({
  overallMood: z.enum(["Great", "Good", "Okay", "Bad", "Awful"]),
  emotions: z.record(z.string(), z.number()), // e.g., { "Happy": 2, "Anxious": 1 }
  lessonsLearned: z.string().optional(),
  learnings: z.array(z.string()).optional(),
});

export async function createDailyCheckIn(input: z.infer<typeof createDailyCheckInSchema>) {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { overallMood, emotions, lessonsLearned, learnings } = createDailyCheckInSchema.parse(input);

  // Check if check-in already exists for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existingCheckIn = await db.dailyReflection.findFirst({
    where: {
      userId: session.user.id,
      date: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  if (existingCheckIn) {
    throw new Error("Check-in already exists for today");
  }

  const checkIn = await db.dailyReflection.create({
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

  return checkIn;
}

export async function getDailyCheckIn(date: Date) {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const checkIn = await db.dailyReflection.findFirst({
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

  return checkIn;
}

export async function getCheckIns() {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const checkIns = await db.dailyReflection.findMany({
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

  return checkIns;
}
