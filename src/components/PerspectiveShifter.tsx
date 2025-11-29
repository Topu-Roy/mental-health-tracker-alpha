"use client";

import { useState } from "react";
import { useCheckInsQuery } from "@/hooks/useCheckIn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Sparkles, X, Quote, Calendar } from "lucide-react";
import { DailyCheckIn } from "@/generated/prisma/client";

export function PerspectiveShifter() {
  const { data: checkIns = [] } = useCheckInsQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [memory, setMemory] = useState<DailyCheckIn | null>(null);

  const getHappyMemory = () => {
    const goodMoods = ["Great", "Good", "Happy", "Excited", "Grateful", "Proud", "Hopeful", "Relaxed"];

    const happyCheckIns = checkIns.filter(
      (r) =>
        goodMoods.includes(r.overallMood) && (r.lessonsLearned || (r.learnings && r.learnings.length > 0))
    );

    if (happyCheckIns.length === 0) {
      // Fallback if no specific happy memories found yet
      return null;
    }

    const randomIndex = Math.floor(Math.random() * happyCheckIns.length);
    return happyCheckIns[randomIndex];
  };

  const handleOpen = () => {
    const happyMemory = getHappyMemory();
    if (happyMemory) {
      setMemory(happyMemory);
      setIsOpen(true);
    } else {
      // Optional: Handle case with no happy memories (maybe show a toast or a gentle message)
      // For now, we'll just not open or maybe open with a default encouraging message?
      // Let's open with a default message if no memory is found, to avoid broken UI feeling.
      setIsOpen(true);
      setMemory(null);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={handleOpen}
        className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Sparkles className="h-4 w-4" />
        Get Perspective
      </Button>
    );
  }

  const getMemoryContent = (mem: DailyCheckIn) => {
    if (mem.lessonsLearned) return mem.lessonsLearned;
    if (mem.lessonsLearned && mem.lessonsLearned.length > 0) return mem.lessonsLearned[0];
    return "I had a really good day today.";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 p-4">
      <Card className="w-full max-w-md relative animate-in zoom-in-95 duration-300 border-indigo-200 shadow-2xl">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 rounded-full hover:bg-slate-100"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-indigo-100 p-3 rounded-full w-fit mb-2">
            <Sparkles className="h-6 w-6 text-indigo-600" />
          </div>
          <CardTitle className="text-xl font-bold text-indigo-900">Perspective Shift</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground font-medium">
            Remember this moment? You will feel this way again.
          </p>

          {memory ? (
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 relative mt-4">
              <Quote className="h-8 w-8 text-indigo-200 absolute -top-4 -left-2 transform -scale-x-100" />

              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-indigo-600 font-medium">
                  <Calendar className="h-4 w-4" />
                  {new Date(memory.date).toLocaleDateString(undefined, { dateStyle: "long" })}
                </div>

                <div className="space-y-1">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 mb-2">
                    Feeling {memory.overallMood}
                  </span>
                  <p className="text-slate-700 italic text-lg leading-relaxed">
                    &quot;{getMemoryContent(memory)}&quot;
                  </p>
                </div>
              </div>

              <Quote className="h-8 w-8 text-indigo-200 absolute -bottom-4 -right-2" />
            </div>
          ) : (
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mt-4">
              <p className="text-slate-600">
                You haven&apos;t recorded a &quot;Happy&quot; memory yet, but that&apos;s okay.
                <br />
                <span className="font-semibold text-indigo-600 block mt-2">
                  Today is a new opportunity to create one.
                </span>
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-center pt-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full sm:w-auto">
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
