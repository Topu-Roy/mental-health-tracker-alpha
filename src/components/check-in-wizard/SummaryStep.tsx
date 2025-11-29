import React from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Zap } from "lucide-react";
import { Mood } from "@/generated/prisma/enums";
import { Emotion } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DailyCheckInType = any; // Replace with proper type if available

interface SummaryStepProps {
  assessment: number;
  generalMood: Mood | null;
  todayCheckIn: DailyCheckInType;
  emotionTallies: Record<Emotion, number>;
  memories: string[];
  learnings: string[];
  isEditing: boolean;
  handleEdit: () => void;
}

export function SummaryStep({
  assessment,
  generalMood,
  todayCheckIn,
  emotionTallies,
  memories,
  learnings,
  isEditing,
  handleEdit,
}: SummaryStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Summary</h3>
        {todayCheckIn && !isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-secondary/30 border">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Overall</span>
          <p className="font-bold text-2xl mt-1">{assessment}/10</p>
        </div>
        <div className="p-4 rounded-xl bg-secondary/30 border">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Mood</span>
          <p className="font-bold text-2xl mt-1">{generalMood}</p>
        </div>
      </div>

      {todayCheckIn?.overallRating !== undefined && todayCheckIn?.overallRating !== null && (
        <div className="relative overflow-hidden bg-linear-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-xl border border-indigo-500/20">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 block mb-1">
                AI Day Rating
              </span>
              <p className="text-4xl font-black text-foreground tracking-tight">
                {todayCheckIn.overallRating}
                <span className="text-lg text-muted-foreground font-normal ml-1">/100</span>
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Zap className="h-6 w-6 text-indigo-500" />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Emotions</span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(emotionTallies)
              .filter(([, c]) => c > 0)
              .map(([e, c]) => (
                <span
                  key={e}
                  className="px-3 py-1 bg-secondary rounded-full text-xs font-medium flex items-center gap-1.5"
                >
                  {e}
                  <span className="bg-background/50 px-1.5 rounded-full text-[10px]">{c}</span>
                </span>
              ))}
            {Object.values(emotionTallies).every((c) => c === 0) && (
              <span className="text-sm text-muted-foreground italic">None recorded</span>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
              Memories
            </span>
            {memories.length > 0 ? (
              <ul className="space-y-1.5">
                {memories.map((m, i) => (
                  <li key={i} className="text-sm pl-3 border-l-2 border-primary/20">
                    {m}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">None</p>
            )}
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
              Learnings
            </span>
            {learnings.length > 0 ? (
              <ul className="space-y-1.5">
                {learnings.map((l, i) => (
                  <li key={i} className="text-sm pl-3 border-l-2 border-primary/20">
                    {l}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">None</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
