"use client";

import React from "react";
import { useJournal } from "@/context/JournalContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Moon, Calendar, Flame } from "lucide-react";
import Link from "next/link";

interface DashboardProps {
  onStartReflection: () => void;
}

export function Dashboard({ onStartReflection }: DashboardProps) {
  const { entries, reflections, todayReflection } = useJournal();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const todayEntries = entries.filter(
    (e) => new Date(e.timestamp).toDateString() === new Date().toDateString()
  );

  const lastReflection = reflections[reflections.length - 1];

  const streak = React.useMemo(() => {
    if (!reflections.length) return 0;

    const sortedReflections = [...reflections].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const uniqueDates = Array.from(new Set(sortedReflections.map((r) => r.date)));

    if (uniqueDates.length === 0) return 0;

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(new Date().getTime() - 86400000).toISOString().split("T")[0];
    const lastEntryDate = uniqueDates[0];

    if (lastEntryDate !== today && lastEntryDate !== yesterday) {
      return 0;
    }

    let streak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const current = new Date(uniqueDates[i]);
      const next = new Date(uniqueDates[i + 1]);
      const diffTime = Math.abs(current.getTime() - next.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [reflections]);

  const getFlameColor = (streak: number) => {
    if (streak >= 7) return "text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]";
    if (streak >= 3) return "text-orange-500";
    return "text-yellow-500";
  };

  const getFlameSize = (streak: number) => {
    if (streak >= 7) return "h-8 w-8";
    if (streak >= 3) return "h-6 w-6";
    return "h-4 w-4";
  };

  if (!mounted) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Entries</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Journal entries created today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Mood</CardTitle>
            <Moon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">Last recorded mood</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reflection Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mb-4">Total days reflected</p>
            <Link href="/history" className="w-full block">
              <Button variant="outline" size="sm" className="w-full">
                View History
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/90">Daily Reflection</CardTitle>
            <Calendar className="h-4 w-4 text-primary-foreground/90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Pending</div>
            <Button variant="secondary" className="w-full mt-4" onClick={onStartReflection}>
              Start Reflection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today&apos;s Entries</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" suppressHydrationWarning>
            {todayEntries.length}
          </div>
          <p className="text-xs text-muted-foreground">Journal entries created today</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Mood</CardTitle>
          <Moon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" suppressHydrationWarning>
            {todayReflection?.generalMood || lastReflection?.generalMood || "—"}
          </div>
          <p className="text-xs text-muted-foreground" suppressHydrationWarning>
            {todayReflection ? "Recorded today" : "Last recorded mood"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reflection Streak</CardTitle>
          <div className={`${streak > 0 ? getFlameColor(streak) : "text-muted-foreground"}`}>
            <Flame
              className={`${streak > 0 ? getFlameSize(streak) : "h-4 w-4"} transition-all duration-300`}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" suppressHydrationWarning>
            {streak}
          </div>
          <p className="text-xs text-muted-foreground mb-4">Total days reflected</p>
          <Link href="/history" className="w-full block">
            <Button variant="outline" size="sm" className="w-full">
              View History
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="bg-primary text-primary-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-primary-foreground/90">Daily Reflection</CardTitle>
          <Calendar className="h-4 w-4 text-primary-foreground/90" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" suppressHydrationWarning>
            {todayReflection ? "Completed" : "Pending"}
          </div>
          <Button
            variant="secondary"
            className="w-full mt-4"
            onClick={onStartReflection}
            suppressHydrationWarning
          >
            {todayReflection ? "View Summary" : "Start Reflection"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
