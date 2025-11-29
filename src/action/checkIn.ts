"use server";

import { db } from "@/server/db";
import { getServerAuthSession } from "@/lib/auth";
import { z } from "zod";
import { generateDayRating } from "./ai";

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

  const existingCheckIn = await db.dailyCheckIn.findFirst({
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

  // Generate AI rating
  const overallRating = await generateDayRating({
    overallMood,
    emotions,
    lessonsLearned,
    learnings,
  });

  const checkIn = await db.dailyCheckIn.create({
    data: {
      overallMood,
      emotions,
      lessonsLearned,
      overallRating,
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

  const checkIn = await db.dailyCheckIn.findFirst({
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

const updateDailyCheckInSchema = z.object({
  id: z.string(),
  overallMood: z.enum(["Great", "Good", "Okay", "Bad", "Awful"]),
  emotions: z.record(z.string(), z.number()),
  lessonsLearned: z.string().optional(),
  learnings: z.array(z.string()).optional(),
});

export async function updateDailyCheckIn(input: z.infer<typeof updateDailyCheckInSchema>) {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { id, overallMood, emotions, lessonsLearned, learnings } = updateDailyCheckInSchema.parse(input);

  // Get the existing check-in
  const existingCheckIn = await db.dailyCheckIn.findUnique({
    where: { id },
    include: { learnings: true },
  });

  if (!existingCheckIn) {
    throw new Error("Check-in not found");
  }

  if (existingCheckIn.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  // Check if the check-in date is today
  const checkInDate = new Date(existingCheckIn.date);
  checkInDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkInDate.getTime() !== today.getTime()) {
    throw new Error("Can only edit today's check-in");
  }

  // Regenerate AI rating with updated data
  const overallRating = await generateDayRating({
    overallMood,
    emotions,
    lessonsLearned,
    learnings,
  });

  // Delete existing learnings and create new ones
  await db.checkInLearning.deleteMany({
    where: { dailyCheckInId: id },
  });

  const updatedCheckIn = await db.dailyCheckIn.update({
    where: { id },
    data: {
      overallMood,
      emotions,
      lessonsLearned,
      overallRating,
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

  return updatedCheckIn;
}

export async function getCheckIns() {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const checkIns = await db.dailyCheckIn.findMany({
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
