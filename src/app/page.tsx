"use client";

import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { JournalList } from "@/components/JournalList";
import { ReflectionWizard } from "@/components/ReflectionWizard";

export default function Home() {
  const [isReflecting, setIsReflecting] = useState(false);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="pt-8">
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
