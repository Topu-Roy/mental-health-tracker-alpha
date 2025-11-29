"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useCreateDailyCheckInMutation,
  useDailyCheckInQuery,
  useUpdateDailyCheckInMutation,
} from "@/hooks/useCheckIn";
import { Mood } from "@/generated/prisma/enums";
import { DailyCheckInProps, Emotion } from "./types";
import { MoodStep } from "./MoodStep";
import { EmotionStep } from "./EmotionStep";
import { MemoriesStep } from "./MemoriesStep";
import { LearningsStep } from "./LearningsStep";
import { SummaryStep } from "./SummaryStep";

export function DailyCheckIn({ onComplete, onCancel }: DailyCheckInProps) {
  const { mutate: saveCheckIn, isPending: isCreating } = useCreateDailyCheckInMutation({
    date: new Date(),
  });
  const { mutate: updateCheckIn, isPending: isUpdating } = useUpdateDailyCheckInMutation({
    date: new Date(),
  });
  const { data: todayCheckIn } = useDailyCheckInQuery({ date: new Date() });

  const [isEditing, setIsEditing] = useState(false);
  const [step, setStep] = useState(todayCheckIn && !isEditing ? 5 : 1);

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
          {step === 1 && (
            <MoodStep
              assessment={assessment}
              setAssessment={setAssessment}
              generalMood={generalMood}
              setGeneralMood={setGeneralMood}
            />
          )}

          {step === 2 && <EmotionStep emotionTallies={emotionTallies} handleTally={handleTally} />}

          {step === 3 && (
            <MemoriesStep
              memories={memories}
              setMemories={setMemories}
              memoryInput={memoryInput}
              setMemoryInput={setMemoryInput}
              handleAddItem={handleAddItem}
              handleRemoveItem={handleRemoveItem}
            />
          )}

          {step === 4 && (
            <LearningsStep
              learnings={learnings}
              setLearnings={setLearnings}
              learningInput={learningInput}
              setLearningInput={setLearningInput}
              handleAddItem={handleAddItem}
              handleRemoveItem={handleRemoveItem}
            />
          )}

          {step === 5 && (
            <SummaryStep
              assessment={assessment}
              generalMood={generalMood}
              todayCheckIn={todayCheckIn}
              emotionTallies={emotionTallies}
              memories={memories}
              learnings={learnings}
              isEditing={isEditing}
              handleEdit={handleEdit}
            />
          )}
        </div>
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
      </DialogContent>
    </Dialog>
  );
}
