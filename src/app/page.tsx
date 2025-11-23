"use client";

import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { JournalList } from "@/components/JournalList";
import { ReflectionWizard } from "@/components/ReflectionWizard";

import { PerspectiveShifter } from "@/components/PerspectiveShifter";

export default function Home() {
  const [isReflecting, setIsReflecting] = useState(false);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="pt-8 space-y-4">
          <div className="flex justify-end">
            <PerspectiveShifter />
          </div>
          <Dashboard onStartReflection={() => setIsReflecting(true)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
          <div className="lg:col-span-3 h-full">
            <JournalList />
          </div>
        </div>
      </div>

      {isReflecting && (
        <ReflectionWizard onComplete={() => setIsReflecting(false)} onCancel={() => setIsReflecting(false)} />
      )}
    </div>
  );
}

// 1. THE CELEBRATION (Confetti):
//    - Give a confetti explosion when the user submits a "Good" (Green) mood entry.
//    - It should feel rewarding but not last too long (3 seconds).

// 2. THE STREAK FLAME (Consistency):
//    - Create a feature to track the user's mood entries for streak.
//    - Logic: Check LocalStorage for the last entry date. If the last entry was yesterday or today, increment the streak. If older, reset to 0.
//    - UI: Display a Flame Icon (use Lucide-React or Heroicons).
//      - < 3 days: Yellow/Small.
//      - 7+ days: Blue/Large/Glowing.

// 3. THE RESCUE MISSION (SOS & Breathing):
//    - Create an `SOSPanel` component that only appears if the user selects "Bad" (Red) mood or "Anxiety" tags. Show 3 life lessons of the user from the past.
//    - Include a "Burn Page" button: A text area where I can type, and when I click "Burn", the text turns into an ash animation or fades out, clearing the state (symbolic deletion).

// 4. THE PERSPECTIVE SHIFTER (Logic):
//    - Create a function `getHappyMemory()`.
//    - Logic: Scan the LocalStorage array of past entries. Find one random entry where `mood === 'Good'`.
//    - UI: A "Get Perspective" button that, when clicked, shows this past entry in a modal card with the text: "Remember this moment? You will feel this way again."
