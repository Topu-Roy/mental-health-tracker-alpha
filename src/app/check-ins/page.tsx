"use client";

import React from "react";
import { useCheckInsQuery } from "@/hooks/useCheckIn";
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

export default function CheckInsPage() {
  const { data: checkIns = [] } = useCheckInsQuery();

  // Sort check-ins by date descending (already sorted by server, but good to ensure)
  const sortedCheckIns = [...checkIns].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="mb-8 pt-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Check-Ins</h1>
            <p className="text-muted-foreground">A look back at your daily check-ins.</p>
          </div>
        </header>

        <div className="space-y-6">
          {sortedCheckIns.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">No check-ins recorded yet.</div>
          ) : (
            sortedCheckIns.map((checkIn) => {
              const emotions = checkIn.emotions as Record<string, number>;
              const emotionEntries = Object.entries(emotions).filter(([, count]) => count > 0);

              return (
                <Card key={checkIn.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {new Date(checkIn.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardTitle>
                      <div className="flex items-center gap-2 px-2 py-1 bg-secondary rounded-full text-xs font-medium">
                        {MOOD_ICONS[checkIn.overallMood] || <Smile className="w-4 h-4" />}
                        <span>{checkIn.overallMood}</span>
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

                    <Link href={`/check-ins/${checkIn.id}`} className="block mt-4">
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
