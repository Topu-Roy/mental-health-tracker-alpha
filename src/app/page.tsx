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
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Mindful Journal</h1>
            <p className="text-muted-foreground mt-2">Capture your thoughts, reflect on your day.</p>
          </div>
        </header>

        <Dashboard onStartReflection={() => setIsReflecting(true)} />

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
