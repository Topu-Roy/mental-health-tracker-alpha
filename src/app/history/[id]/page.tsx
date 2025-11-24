"use client";

import React from "react";
import { useReflections } from "@/hooks/useReflection";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smile, ThumbsUp, Heart, CloudRain, AlertCircle, ArrowLeft, Meh } from "lucide-react";
import Link from "next/link";

const MOOD_ICONS: Record<string, React.ReactNode> = {
  Great: <Heart className="w-4 h-4 text-pink-500" />,
  Good: <ThumbsUp className="w-4 h-4 text-green-500" />,
  Okay: <Meh className="w-4 h-4 text-yellow-500" />,
  Bad: <CloudRain className="w-4 h-4 text-blue-500" />,
  Awful: <AlertCircle className="w-4 h-4 text-red-500" />,
};

export default function HistoryDetailPage() {
  const { id } = useParams();
  const { data: reflections = [] } = useReflections();
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

  const emotions = reflection.emotions as Record<string, number>;
  const emotionEntries = Object.entries(emotions).filter(([_, count]) => count > 0);

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
                  {MOOD_ICONS[reflection.overallMood] || <Smile className="w-4 h-4" />}
                  <span>{reflection.overallMood}</span>
                </div>
              </div>
              {/* Overall Assessment removed */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emotions Felt</CardTitle>
            </CardHeader>
            <CardContent>
              {emotionEntries.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {emotionEntries.map(([emotion, count]) => (
                    <Badge key={emotion} variant="secondary" className="text-sm py-1 px-3">
                      {emotion} <span className="ml-2 opacity-70">x{count}</span>
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
                  {reflection.lessonsLearned || (
                    <span className="text-muted-foreground italic">No entry.</span>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle>Key Takeaways</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {reflection.learnings && reflection.learnings.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {reflection.learnings.map((l, i: number) => (
                        <li key={i} className="leading-relaxed">
                          {l.content}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted-foreground italic">No entry.</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
