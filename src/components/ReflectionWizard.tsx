"use client";

import React, { useState } from "react";
import { useJournal } from "@/context/JournalContext";
import { DailyReflection, Emotion, EmotionTally } from "@/types/journal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
} from "lucide-react";

interface ReflectionWizardProps {
  onComplete: () => void;
  onCancel: () => void;
  initialData?: DailyReflection;
}

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

export function ReflectionWizard({ onComplete, onCancel, initialData }: ReflectionWizardProps) {
  const { saveReflection, todayReflection } = useJournal();
  // Use initialData if provided, otherwise fall back to todayReflection from context
  const data = initialData || todayReflection;

  const [step, setStep] = useState(data ? 4 : 1);

  const [assessment, setAssessment] = useState<number>(data?.overallAssessment ?? 5);
  const [generalMood, setGeneralMood] = useState<Emotion | null>(data?.generalMood ?? null);
  const [emotionTallies, setEmotionTallies] = useState<Record<Emotion, number>>(() => {
    const initial: Record<Emotion, number> = {
      Happy: 0,
      Excited: 0,
      Grateful: 0,
      Relaxed: 0,
      Sad: 0,
      Anxious: 0,
      Angry: 0,
      Tired: 0,
      Frustrated: 0,
      Confused: 0,
      Proud: 0,
      Hopeful: 0,
    };

    if (data?.emotions) {
      data.emotions.forEach((tally) => {
        if (initial[tally.emotion] !== undefined) {
          initial[tally.emotion] = tally.count;
        }
      });
    }
    return initial;
  });
  const [learned, setLearned] = useState(data?.learned ?? "");
  const [lessons, setLessons] = useState(data?.lessons ?? "");

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleTally = (emotion: Emotion, delta: number) => {
    setEmotionTallies((prev) => ({
      ...prev,
      [emotion]: Math.max(0, prev[emotion] + delta),
    }));
  };

  const handleSubmit = () => {
    if (!generalMood) return;

    const emotionsList: EmotionTally[] = Object.entries(emotionTallies)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, count]) => count > 0)
      .map(([emotion, count]) => ({ emotion: emotion as Emotion, count }));

    saveReflection({
      date: new Date().toISOString().split("T")[0],
      overallAssessment: assessment,
      generalMood,
      emotions: emotionsList,
      learned,
      lessons,
    });
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-2">
        <CardHeader>
          <CardTitle>End of Day Reflection</CardTitle>
          <CardDescription>Step {step} of 4</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-8 py-4">
              <div className="space-y-4">
                <Label className="text-lg">How was your day overall? ({assessment}/10)</Label>
                <Slider
                  value={[assessment]}
                  onValueChange={(vals) => setAssessment(vals[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="py-4"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-lg">What was your general mood?</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {EMOTIONS.map(({ label, icon }) => (
                    <Button
                      key={label}
                      variant={generalMood === label ? "default" : "outline"}
                      className="h-auto py-3 flex flex-col gap-2"
                      onClick={() => setGeneralMood(label)}
                    >
                      {icon}
                      <span className="text-xs">{label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Label className="text-lg">Emotion Tally</Label>
              <p className="text-sm text-muted-foreground">How many times did you feel each emotion today?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {EMOTIONS.map(({ label, icon }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between p-3 border rounded-lg bg-card/50"
                  >
                    <div className="flex items-center gap-3">
                      {icon}
                      <span className="font-medium">{label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleTally(label, -1)}
                        disabled={emotionTallies[label] === 0}
                      >
                        -
                      </Button>
                      <span className="w-6 text-center font-bold">{emotionTallies[label]}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleTally(label, 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-lg">What did you learn today?</Label>
                <Textarea
                  value={learned}
                  onChange={(e) => setLearned(e.target.value)}
                  placeholder="I learned that..."
                  className="min-h-[120px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-lg">What lessons did you gather?</Label>
                <Textarea
                  value={lessons}
                  onChange={(e) => setLessons(e.target.value)}
                  placeholder="Key takeaways..."
                  className="min-h-[120px]"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Overall:</span>
                  <p className="font-medium text-lg">{assessment}/10</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Mood:</span>
                  <p className="font-medium text-lg">{generalMood}</p>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block mb-2">Top Emotions:</span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(emotionTallies)
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    .filter(([_, c]) => c > 0)
                    .map(([e, c]) => (
                      <span key={e} className="px-2 py-1 bg-secondary rounded-md text-xs font-medium">
                        {e}: {c}
                      </span>
                    ))}
                  {Object.values(emotionTallies).every((c) => c === 0) && (
                    <span className="text-muted-foreground italic">None recorded</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-muted-foreground">Learned:</span>
                <p className="p-3 bg-muted/30 rounded-md text-sm">{learned || "Nothing recorded"}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={step === 1 ? onCancel : handleBack}>
            {step === 1 ? "Cancel" : "Back"}
          </Button>

          {step < 4 ? (
            <Button onClick={handleNext} disabled={step === 1 && !generalMood}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit}>Complete Reflection</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
