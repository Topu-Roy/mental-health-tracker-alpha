"use client";

import { DailyCheckIn, CheckInLearning } from "@/generated/prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Lightbulb } from "lucide-react";
import { useState } from "react";

interface MemoryCardProps {
  checkIn: DailyCheckIn & { learnings?: CheckInLearning[] };
}

const moodDots = {
  Great: "bg-green-500",
  Good: "bg-blue-500",
  Okay: "bg-amber-500",
  Bad: "bg-orange-500",
  Awful: "bg-red-500",
};

export function MemoryCard({ checkIn }: MemoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const moodDot = moodDots[checkIn.overallMood as keyof typeof moodDots] || moodDots.Okay;

  const emotions = checkIn.emotions as Record<string, number> | null;
  const emotionEntries = emotions ? Object.entries(emotions) : [];

  const hasLessonsLearned = checkIn.lessonsLearned && checkIn.lessonsLearned.trim().length > 0;
  const hasLearnings = checkIn.learnings && checkIn.learnings.length > 0;
  const hasContent = hasLessonsLearned || hasLearnings;

  if (!hasContent) return null;

  return (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border bg-white overflow-hidden"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4" />
            <time className="font-medium">
              {new Date(checkIn.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${moodDot}`}></span>
            <span className="text-sm font-medium text-slate-700">{checkIn.overallMood}</span>
          </div>
        </div>

        {emotionEntries.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {emotionEntries.map(([emotion, intensity]) => (
              <span
                key={emotion}
                className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
              >
                {emotion} {intensity > 1 && `×${intensity}`}
              </span>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {hasLessonsLearned && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <Lightbulb className="h-3.5 w-3.5" />
              Reflection
            </div>
            <p className={`text-slate-700 leading-relaxed ${!isExpanded && "line-clamp-3"}`}>
              {checkIn.lessonsLearned}
            </p>
          </div>
        )}

        {hasLearnings && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Key Learnings</div>
            <ul className={`space-y-2 ${!isExpanded && "line-clamp-3"}`}>
              {checkIn.learnings!.map((learning) => (
                <li
                  key={learning.id}
                  className="text-sm text-slate-700 pl-4 border-l-2 border-slate-200 py-1"
                >
                  {learning.content}
                </li>
              ))}
            </ul>
          </div>
        )}

        {((hasLessonsLearned && checkIn.lessonsLearned!.length > 150) ||
          (hasLearnings && checkIn.learnings!.length > 2)) && (
          <button className="text-xs text-slate-500 font-medium hover:text-slate-700 transition-colors pt-2">
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
