"use client";

import { useState } from "react";
import { useDailyCheckInQuery, useCheckInsQuery } from "@/hooks/useCheckIn";
import { Dashboard } from "@/components/Dashboard";
import { JournalList } from "@/components/JournalList";
import { DailyCheckIn } from "@/components/DailyCheckIn";
import { SOSPanel } from "@/components/SOSPanel";
import { Flame, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const { data: todayCheckIn } = useDailyCheckInQuery({ date: new Date() });
  const { data: checkIns = [] } = useCheckInsQuery();
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [sosMode, setSosMode] = useState<boolean>(false);

  const lastCheckIn = checkIns[0]; // Ordered by date desc
  const currentMood = todayCheckIn?.overallMood ?? lastCheckIn?.overallMood;
  const isSad = currentMood === "Bad" || currentMood === "Awful";

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="pt-8 space-y-4">
          <div className="flex justify-end gap-2">
            {isSad && (
              <Button
                variant="destructive"
                className="gap-2 shadow-lg animate-in fade-in slide-in-from-top-4"
                onClick={() => setSosMode(true)}
              >
                <Flame className="h-4 w-4" />
                Burn Away Stress
              </Button>
            )}
            <Link href="/memories">
              <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Sparkles className="h-4 w-4" />
                View Memories & Learnings
              </Button>
            </Link>
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

      <SOSPanel open={sosMode} onOpenChange={setSosMode} />
    </div>
  );
}
