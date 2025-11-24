"use client";

import React from "react";
import { useReflections } from "@/hooks/useReflection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smile, ThumbsUp, Heart, CloudRain, AlertCircle, Meh } from "lucide-react";
import Link from "next/link";

const MOOD_ICONS: Record<string, React.ReactNode> = {
  Great: <Heart className="w-4 h-4 text-pink-500" />,
  Good: <ThumbsUp className="w-4 h-4 text-green-500" />,
  Okay: <Meh className="w-4 h-4 text-yellow-500" />,
  Bad: <CloudRain className="w-4 h-4 text-blue-500" />,
  Awful: <AlertCircle className="w-4 h-4 text-red-500" />,
};

export default function HistoryPage() {
  const { data: reflections = [] } = useReflections();

  // Sort reflections by date descending (already sorted by server, but good to ensure)
  const sortedReflections = [...reflections].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="mb-8 pt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reflection History</h1>
            <p className="text-muted-foreground">A look back at your daily reflections.</p>
          </div>
        </header>

        <div className="space-y-6">
          {sortedReflections.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">No reflections recorded yet.</div>
          ) : (
            sortedReflections.map((reflection) => {
              const emotions = reflection.emotions as Record<string, number>;
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const emotionEntries = Object.entries(emotions).filter(([_, count]) => count > 0);

              return (
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
                        {MOOD_ICONS[reflection.overallMood] || <Smile className="w-4 h-4" />}
                        <span>{reflection.overallMood}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    {/* Overall Assessment removed as it's not in the new schema */}

                    {emotionEntries.length > 0 && (
                      <div>
                        <span className="text-muted-foreground block mb-1">Emotions:</span>
                        <div className="flex flex-wrap gap-1">
                          {emotionEntries.slice(0, 5).map(([emotion, count]) => (
                            <Badge key={emotion} variant="outline" className="text-xs">
                              {emotion} ({count})
                            </Badge>
                          ))}
                          {emotionEntries.length > 5 && (
                            <span className="text-xs text-muted-foreground self-center">
                              +{emotionEntries.length - 5} more
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
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
