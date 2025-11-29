"use client";

import { useState } from "react";
import { useDailyCheckInQuery, useCheckInsQuery } from "@/hooks/useCheckIn";
import { Dashboard } from "@/components/Dashboard";
import { JournalList } from "@/components/JournalList";
import { DailyCheckIn } from "@/components/DailyCheckIn";
import { SOSPanel } from "@/components/SOSPanel";
import { PerspectiveShifter } from "@/components/PerspectiveShifter";
import { Flame, HeartHandshake, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: todayCheckIn } = useDailyCheckInQuery({ date: new Date() });
  const { data: checkIns = [] } = useCheckInsQuery();
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [sosMode, setSosMode] = useState<"burn" | "lessons" | null>(null);

  const lastCheckIn = checkIns[0]; // Ordered by date desc
  const currentMood = todayCheckIn?.overallMood ?? lastCheckIn?.overallMood;
  const isSad = currentMood === "Bad" || currentMood === "Awful";

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="pt-8 space-y-4">
          <div className="flex justify-end gap-2">
            {isSad && (
              <>
                <Button
                  variant="destructive"
                  className="gap-2 shadow-lg animate-in fade-in slide-in-from-top-4"
                  onClick={() => setSosMode("burn")}
                >
                  <Flame className="h-4 w-4" />
                  Burn Away Stress
                </Button>
                <Button
                  className="gap-2 bg-amber-600 hover:bg-amber-700 text-white shadow-lg animate-in fade-in slide-in-from-top-4"
                  onClick={() => setSosMode("lessons")}
                >
                  <HeartHandshake className="h-4 w-4" />
                  Past Learnings
                </Button>
              </>
            )}
            <PerspectiveShifter />
          </div>
          <Dashboard onStartReflection={() => setIsCheckingIn(true)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
          <div className="lg:col-span-3 h-full">
            <JournalList />
          </div>
        </div>
      </div>

      {isCheckingIn && (
        <DailyCheckIn onComplete={() => setIsCheckingIn(false)} onCancel={() => setIsCheckingIn(false)} />
      )}

      {sosMode && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10"
              onClick={() => setSosMode(null)}
            >
              <X className="h-4 w-4" />
            </Button>
            <SOSPanel mode={sosMode} onComplete={() => setSosMode(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
