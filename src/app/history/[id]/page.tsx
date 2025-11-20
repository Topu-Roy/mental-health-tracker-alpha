"use client";

import React from "react";
import { useJournal } from "@/context/JournalContext";
import { useParams, useRouter } from "next/navigation";
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

export default function HistoryDetailPage() {
  const { id } = useParams();
  const { reflections } = useJournal();
  const router = useRouter();

  const reflection = reflections.find((r) => r.id === id);

  if (!reflection) {
    return (
      <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Reflection not found</h1>
        <Button onClick={() => router.push("/history")}>Back to History</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="flex items-center gap-4 mb-8">
          <Link href="/history">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {new Date(reflection.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h1>
            <p className="text-muted-foreground">Daily Reflection Details</p>
          </div>
        </header>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">General Mood</span>
                <div className="flex items-center gap-2 text-lg font-medium">
                  {EMOTION_ICONS[reflection.generalMood]}
                  <span>{reflection.generalMood}</span>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-sm text-muted-foreground">Day Rating</span>
                <div className="text-2xl font-bold">{reflection.overallAssessment}/10</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emotions Felt</CardTitle>
            </CardHeader>
            <CardContent>
              {reflection.emotions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {reflection.emotions.map((t) => (
                    <Badge key={t.emotion} variant="secondary" className="text-sm py-1 px-3">
                      {t.emotion} <span className="ml-2 opacity-70">x{t.count}</span>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No specific emotions recorded.</p>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>What I Learned</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {reflection.learned || <span className="text-muted-foreground italic">No entry.</span>}
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Key Takeaways</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {reflection.lessons || <span className="text-muted-foreground italic">No entry.</span>}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
