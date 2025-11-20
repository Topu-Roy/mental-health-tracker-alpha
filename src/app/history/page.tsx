"use client";

import React from "react";
import { useJournal } from "@/context/JournalContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  ArrowLeft,
} from "lucide-react";
import { Emotion } from "@/types/journal";
import Link from "next/link";

const EMOTION_ICONS: Record<Emotion, React.ReactNode> = {
  Happy: <Smile className="w-4 h-4" />,
  Excited: <Zap className="w-4 h-4" />,
  Grateful: <Heart className="w-4 h-4" />,
  Relaxed: <Coffee className="w-4 h-4" />,
  Sad: <CloudRain className="w-4 h-4" />,
  Anxious: <AlertCircle className="w-4 h-4" />,
  Angry: <Frown className="w-4 h-4" />,
  Tired: <div className="w-4 h-4">😴</div>,
  Frustrated: <Frown className="w-4 h-4" />,
  Confused: <AlertCircle className="w-4 h-4" />,
  Proud: <ThumbsUp className="w-4 h-4" />,
  Hopeful: <CheckCircle2 className="w-4 h-4" />,
};

export default function HistoryPage() {
  const { reflections } = useJournal();

  // Sort reflections by date descending
  const sortedReflections = [...reflections].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reflection History</h1>
            <p className="text-muted-foreground">A look back at your daily reflections.</p>
          </div>
        </header>

        <div className="space-y-6">
          {sortedReflections.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">No reflections recorded yet.</div>
          ) : (
            sortedReflections.map((reflection) => (
              <Card key={reflection.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {new Date(reflection.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardTitle>
                    <div className="flex items-center gap-2 px-2 py-1 bg-secondary rounded-full text-xs font-medium">
                      {EMOTION_ICONS[reflection.generalMood]}
                      <span>{reflection.generalMood}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Day Rating:</span>
                    <span className="font-bold">{reflection.overallAssessment}/10</span>
                  </div>

                  {reflection.emotions.length > 0 && (
                    <div>
                      <span className="text-muted-foreground block mb-1">Emotions:</span>
                      <div className="flex flex-wrap gap-1">
                        {reflection.emotions.slice(0, 5).map((t) => (
                          <Badge key={t.emotion} variant="outline" className="text-xs">
                            {t.emotion} ({t.count})
                          </Badge>
                        ))}
                        {reflection.emotions.length > 5 && (
                          <span className="text-xs text-muted-foreground self-center">
                            +{reflection.emotions.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <Link href={`/history/${reflection.id}`} className="block mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
