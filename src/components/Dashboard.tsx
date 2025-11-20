"use client";

import React from "react";
import { useJournal } from "@/context/JournalContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Moon, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";

interface DashboardProps {
  onStartReflection: () => void;
}

export function Dashboard({ onStartReflection }: DashboardProps) {
  const { entries, reflections, todayReflection } = useJournal();

  const todayEntries = entries.filter(
    (e) => new Date(e.timestamp).toDateString() === new Date().toDateString()
  );

  const lastReflection = reflections[reflections.length - 1];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today&apos;s Entries</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayEntries.length}</div>
          <p className="text-xs text-muted-foreground">Journal entries created today</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Mood</CardTitle>
          <Moon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {todayReflection?.generalMood || lastReflection?.generalMood || "—"}
          </div>
          <p className="text-xs text-muted-foreground">
            {todayReflection ? "Recorded today" : "Last recorded mood"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reflection Streak</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reflections.length}</div>
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
          <div className="text-2xl font-bold">{todayReflection ? "Completed" : "Pending"}</div>
          <Button
            variant="secondary"
            className="w-full mt-4"
            onClick={onStartReflection}
            disabled={!!todayReflection}
          >
            {todayReflection ? "View Summary" : "Start Reflection"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
