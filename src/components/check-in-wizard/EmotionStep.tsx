import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { EMOTIONS } from "./constants";
import { Emotion } from "./types";

interface EmotionStepProps {
  emotionTallies: Record<Emotion, number>;
  handleTally: (emotion: Emotion, delta: number) => void;
}

export function EmotionStep({ emotionTallies, handleTally }: EmotionStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <Label className="text-lg font-medium">Emotions felt</Label>
        <p className="text-sm text-muted-foreground">Tap to add, tap again to increase count.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {EMOTIONS.map(({ label, icon }) => {
          const count = emotionTallies[label];
          return (
            <button
              key={label}
              onClick={() => handleTally(label, 1)}
              className={cn(
                "group relative flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200",
                count > 0
                  ? "border-primary/50 bg-primary/5 text-primary shadow-xs"
                  : "border-border bg-background hover:border-primary/30 hover:bg-secondary/50"
              )}
            >
              <span className="text-lg">{icon}</span>
              <span className="text-sm font-medium">{label}</span>
              {count > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in">
                  {count}
                </span>
              )}
              {count > 0 && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTally(label, -1);
                  }}
                  className="absolute -top-1 -right-1 hidden h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm group-hover:flex hover:scale-110"
                >
                  <X className="h-3 w-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
