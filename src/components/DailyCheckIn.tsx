"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { SOSPanel } from "@/components/SOSPanel";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Smile,
  Frown,
  ThumbsUp,
  Heart,
  CloudRain,
  Zap,
  Coffee,
  AlertCircle,
  CheckCircle2,
  Edit2,
  Plus,
  X,
} from "lucide-react";
import type { Mood } from "@/generated/prisma/enums";
import {
  useCreateDailyCheckInMutation,
  useDailyCheckInQuery,
  useUpdateDailyCheckInMutation,
} from "@/hooks/useCheckIn";

// Define Emotion type locally or import from a shared types file if available
type Emotion =
  | "Happy"
  | "Excited"
  | "Relaxed"
  | "Sad"
  | "Anxious"
  | "Angry"
  | "Tired"
  | "Frustrated"
  | "Proud"
  | "Grateful"
  | "Confused"
  | "Hopeful";

interface DailyCheckInProps {
  onComplete: () => void;
  onCancel: () => void;
}

const MOODS: { label: Mood; icon: React.ReactNode }[] = [
  { label: "Great", icon: <Heart className="w-5 h-5" /> },
  { label: "Good", icon: <ThumbsUp className="w-5 h-5" /> },
  { label: "Okay", icon: <Coffee className="w-5 h-5" /> },
  { label: "Bad", icon: <Frown className="w-5 h-5" /> },
  { label: "Awful", icon: <AlertCircle className="w-5 h-5" /> },
];

const EMOTIONS: { label: Emotion; icon: React.ReactNode }[] = [
  { label: "Happy", icon: <Smile className="w-5 h-5" /> },
  { label: "Excited", icon: <Zap className="w-5 h-5" /> },
  { label: "Grateful", icon: <Heart className="w-5 h-5" /> },
  { label: "Relaxed", icon: <Coffee className="w-5 h-5" /> },
  { label: "Sad", icon: <CloudRain className="w-5 h-5" /> },
  { label: "Anxious", icon: <AlertCircle className="w-5 h-5" /> },
  { label: "Angry", icon: <Frown className="w-5 h-5" /> },
  { label: "Tired", icon: <MoonIcon className="w-5 h-5" /> },
  { label: "Frustrated", icon: <Frown className="w-5 h-5" /> }, // Reusing Frown for now
  { label: "Confused", icon: <AlertCircle className="w-5 h-5" /> },
  { label: "Proud", icon: <ThumbsUp className="w-5 h-5" /> },
  { label: "Hopeful", icon: <CheckCircle2 className="w-5 h-5" /> },
];

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export function DailyCheckIn({ onComplete, onCancel }: DailyCheckInProps) {
  const { mutate: saveCheckIn, isPending: isCreating } = useCreateDailyCheckInMutation({ date: new Date() });
  const { mutate: updateCheckIn, isPending: isUpdating } = useUpdateDailyCheckInMutation({
    date: new Date(),
  });
  const { data: todayCheckIn } = useDailyCheckInQuery({ date: new Date() });

  const [isEditing, setIsEditing] = useState(false);
  const [step, setStep] = useState(todayCheckIn && !isEditing ? 5 : 1);
  const [showSOS, setShowSOS] = useState(false);

  const [assessment, setAssessment] = useState<number>(5);

  const [generalMood, setGeneralMood] = useState<Mood | null>(todayCheckIn?.overallMood ?? null);

  // Initialize emotion tallies from existing check-in
  const initializeEmotionTallies = () => {
    const defaultTallies: Record<Emotion, number> = {
      Happy: 0,
      Excited: 0,
      Relaxed: 0,
      Sad: 0,
      Anxious: 0,
      Angry: 0,
      Tired: 0,
      Frustrated: 0,
      Proud: 0,
      Grateful: 0,
      Confused: 0,
      Hopeful: 0,
    };

    if (todayCheckIn?.emotions && typeof todayCheckIn.emotions === "object") {
      const existing = todayCheckIn.emotions as Record<string, number>;
      Object.keys(existing).forEach((key) => {
        if (key in defaultTallies) {
          defaultTallies[key as Emotion] = existing[key];
        }
      });
    }

    return defaultTallies;
  };

  const [emotionTallies, setEmotionTallies] = useState<Record<Emotion, number>>(initializeEmotionTallies());

  const [learned] = useState(todayCheckIn?.lessonsLearned ?? "");
  const [learnings, setLearnings] = useState<string[]>(todayCheckIn?.learnings?.map((l) => l.content) ?? []);
  const [memories, setMemories] = useState<string[]>(todayCheckIn?.memories?.map((m) => m.content) ?? []);

  const [memoryInput, setMemoryInput] = useState("");
  const [learningInput, setLearningInput] = useState("");

  const handleNext = () => {
    if (step === 1 && generalMood) {
      const negativeMoods: Mood[] = ["Bad", "Awful"];
      if (negativeMoods.includes(generalMood)) {
        setShowSOS(true);
        return;
      }
    }

    if (step === 3 && memoryInput.trim()) {
      setMemories((prev) => [...prev, memoryInput.trim()]);
      setMemoryInput("");
    }

    if (step === 4 && learningInput.trim()) {
      setLearnings((prev) => [...prev, learningInput.trim()]);
      setLearningInput("");
    }

    setStep((prev) => prev + 1);
  };

  const handleSOSComplete = () => {
    setShowSOS(false);
    setStep(2);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleTally = (emotion: Emotion, delta: number) => {
    setEmotionTallies((prev) => ({
      ...prev,
      [emotion]: Math.max(0, prev[emotion] + delta),
    }));
  };

  const handleAddItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    item: string,
    setInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (item.trim()) {
      setList([...list, item.trim()]);
      setInput("");
    }
  };

  const handleRemoveItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setStep(1);
  };

  const handleSubmit = () => {
    if (!generalMood) return;

    // Filter out zero counts
    const emotionsToSave: Record<string, number> = {};
    Object.entries(emotionTallies).forEach(([key, count]) => {
      if (count > 0) emotionsToSave[key] = count;
    });

    // Check for positive mood to trigger confetti
    const positiveMoods: Mood[] = ["Great", "Good"];
    if (positiveMoods.includes(generalMood)) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: ReturnType<typeof setInterval> = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);
    }

    const checkInData = {
      overallMood: generalMood,
      emotions: emotionsToSave,
      lessonsLearned: learned,
      learnings: learnings,
      memories: memories,
    };

    if (todayCheckIn && isEditing) {
      updateCheckIn(
        { id: todayCheckIn.id, ...checkInData },
        {
          onSuccess: () => {
            setIsEditing(false);
            setStep(5);
          },
        }
      );
    } else {
      saveCheckIn(checkInData, {
        onSuccess: () => {
          setStep(5);
        },
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-0 gap-0 overflow-hidden">
        <div className="px-6 py-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-xl">Daily Check-In</DialogTitle>
            <DialogDescription>Step {step} of 5</DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-6 space-y-6">
          {showSOS ? (
            <SOSPanel onComplete={handleSOSComplete} />
          ) : (
            <>
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4">
                    <Label className="text-lg font-medium">How was your day? ({assessment}/10)</Label>
                    <div className="px-2">
                      <Slider
                        value={[assessment]}
                        onValueChange={(vals) => setAssessment(vals[0])}
                        min={1}
                        max={10}
                        step={1}
                        className="py-4 cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground px-1">
                      <span>Rough</span>
                      <span>Okay</span>
                      <span>Great</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-lg font-medium">Current Mood</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {MOODS.map(({ label, icon }) => (
                        <button
                          key={label}
                          onClick={() => setGeneralMood(label)}
                          className={cn(
                            "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105",
                            generalMood === label
                              ? "border-primary bg-primary/5 text-primary shadow-sm"
                              : "border-transparent bg-secondary/50 hover:bg-secondary text-muted-foreground"
                          )}
                        >
                          <div className={cn("transition-transform", generalMood === label && "scale-110")}>
                            {icon}
                          </div>
                          <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
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
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <Label className="text-lg font-medium">Memories</Label>
                    <p className="text-sm text-muted-foreground">Significant moments from today.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <Textarea
                        value={memoryInput}
                        onChange={(e) => setMemoryInput(e.target.value)}
                        placeholder="I remember..."
                        className="min-h-[100px] resize-none pr-12 bg-secondary/20 focus:bg-background transition-colors"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddItem(memories, setMemories, memoryInput, setMemoryInput);
                          }
                        }}
                      />
                      <Button
                        onClick={() => handleAddItem(memories, setMemories, memoryInput, setMemoryInput)}
                        size="icon"
                        className="absolute bottom-3 right-3 h-8 w-8 rounded-full shadow-sm"
                        disabled={!memoryInput.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {memories.map((memory, index) => (
                        <div
                          key={index}
                          className="group flex items-center gap-2 pl-3 pr-1 py-1.5 bg-secondary/50 rounded-full text-sm animate-in zoom-in duration-200"
                        >
                          <span className="max-w-[200px] truncate">{memory}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleRemoveItem(memories, setMemories, index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <Label className="text-lg font-medium">Learnings</Label>
                    <p className="text-sm text-muted-foreground">Key takeaways from today.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <Textarea
                        value={learningInput}
                        onChange={(e) => setLearningInput(e.target.value)}
                        placeholder="I learned that..."
                        className="min-h-[100px] resize-none pr-12 bg-secondary/20 focus:bg-background transition-colors"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddItem(learnings, setLearnings, learningInput, setLearningInput);
                          }
                        }}
                      />
                      <Button
                        onClick={() =>
                          handleAddItem(learnings, setLearnings, learningInput, setLearningInput)
                        }
                        size="icon"
                        className="absolute bottom-3 right-3 h-8 w-8 rounded-full shadow-sm"
                        disabled={!learningInput.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {learnings.map((learning, index) => (
                        <div
                          key={index}
                          className="group flex items-center gap-2 pl-3 pr-1 py-1.5 bg-secondary/50 rounded-full text-sm animate-in zoom-in duration-200"
                        >
                          <span className="max-w-[200px] truncate">{learning}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleRemoveItem(learnings, setLearnings, index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
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
                      <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">
                        Emotions
                      </span>
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
              )}
            </>
          )}
        </div>
        {!showSOS && (
          <div className="p-6 border-t bg-secondary/10">
            <DialogFooter className="flex sm:justify-between gap-2">
              <Button variant="ghost" onClick={step === 1 ? onCancel : handleBack}>
                {step === 1 ? "Cancel" : "Back"}
              </Button>

              {step < 5 ? (
                <Button onClick={handleNext} disabled={step === 1 && !generalMood}>
                  Next
                </Button>
              ) : (
                <>
                  {todayCheckIn && !isEditing ? (
                    <Button onClick={onComplete}>Close</Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={isCreating || isUpdating}>
                      {isCreating || isUpdating
                        ? "Generating AI rating..."
                        : isEditing
                        ? "Save Changes"
                        : "Complete Check-In"}
                    </Button>
                  )}
                </>
              )}
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
