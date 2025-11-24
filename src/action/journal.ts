"use server";

import { db } from "@/server/db";
import { getServerAuthSession } from "@/lib/auth";
import { z } from "zod";

const createJournalEntrySchema = z.object({
  content: z.string().min(1),
  mood: z.enum(["Great", "Good", "Okay", "Bad", "Awful"]),
});

export async function createJournalEntry(input: z.infer<typeof createJournalEntrySchema>) {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const { content, mood } = createJournalEntrySchema.parse(input);

  const entry = await db.journalEntry.create({
    data: {
      content,
      mood,
      userId: session.user.id,
    },
  });

  return entry;
}

export async function getJournalEntries() {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const entries = await db.journalEntry.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return entries;
}

export async function deleteJournalEntry(id: string) {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  await db.journalEntry.delete({
    where: {
      id,
      userId: session.user.id,
    },
  });
}

export async function updateJournalEntry(id: string, content: string) {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const entry = await db.journalEntry.update({
    where: {
      id,
      userId: session.user.id,
    },
    data: {
      content,
    },
  });

  return entry;
}
