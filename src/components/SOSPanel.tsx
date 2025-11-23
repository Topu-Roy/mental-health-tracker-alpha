"use client";

import React, { useState, useEffect, useRef } from "react";
import { useJournal } from "@/context/JournalContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Flame, HeartHandshake, ArrowRight } from "lucide-react";

interface SOSPanelProps {
  onComplete: () => void;
  mode?: "full" | "burn" | "lessons";
}

export function SOSPanel({ onComplete, mode = "full" }: SOSPanelProps) {
  const { reflections } = useJournal();
  const [lessons, setLessons] = useState<string[]>([]);
  const [burnText, setBurnText] = useState("");
  const [isBurning, setIsBurning] = useState(false);
  const [burned, setBurned] = useState(false);
  const hasLoadedLessons = useRef(false);

  useEffect(() => {
    if (hasLoadedLessons.current) return;

    const allLessons = reflections
      .filter((r) => r.lessons && r.lessons.trim().length > 0)
      .map((r) => r.lessons);

    if (allLessons.length > 0) {
      const shuffled = allLessons.sort(() => 0.5 - Math.random());

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLessons(shuffled.slice(0, 3));
      hasLoadedLessons.current = true;
    }
  }, [reflections]);

  const handleBurn = () => {
    if (!burnText.trim()) return;
    setIsBurning(true);
    setTimeout(() => {
      setBurned(true);
      setBurnText("");
      setIsBurning(false);
    }, 2000); // Animation duration
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {(mode === "full" || mode === "lessons") && (
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2 text-red-500">
            <HeartHandshake className="h-8 w-8" />
            Rescue Mission
          </h2>
          <p className="text-muted-foreground">
            It&apos;s okay not to be okay. Here is some wisdom from your past self.
          </p>
        </div>
      )}

      {(mode === "full" || mode === "lessons") && lessons.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {lessons.map((lesson, i) => (
            <Card key={i} className="bg-secondary/20 border-secondary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-secondary-foreground">Note to Self</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm italic">&quot;{lesson}&quot;</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {(mode === "full" || mode === "burn") && (
        <Card className="border-red-200 dark:border-red-900/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              The Burn Page
            </CardTitle>
            <CardDescription>
              Type out what&apos;s bothering you, then burn it away. This is a safe space to let go.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!burned ? (
              <div
                className={`relative transition-all duration-1000 ${
                  isBurning ? "opacity-0 blur-xl scale-95 grayscale" : "opacity-100"
                }`}
              >
                <Textarea
                  value={burnText}
                  onChange={(e) => setBurnText(e.target.value)}
                  placeholder="I am feeling overwhelmed because..."
                  className="min-h-[150px] resize-none border-red-100 focus-visible:ring-red-500"
                />
              </div>
            ) : (
              <div className="min-h-[150px] flex items-center justify-center text-muted-foreground italic animate-in zoom-in duration-500">
                <p>It&apos;s gone now. Breathe.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-between">
            {!burned ? (
              <Button
                variant="destructive"
                onClick={handleBurn}
                disabled={!burnText.trim() || isBurning}
                className="w-full sm:w-auto"
              >
                {isBurning ? "Burning..." : "Burn It Away"}
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setBurned(false)} className="text-muted-foreground">
                Write More
              </Button>
            )}

            <Button onClick={onComplete} className="gap-2">
              Continue Reflection <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
