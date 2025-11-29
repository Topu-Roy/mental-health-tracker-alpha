"use client";

import { useCheckInsQuery } from "@/hooks/useCheckIn";
import { MemoryCard } from "@/components/MemoryCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Search, ArrowLeft, Sparkles } from "lucide-react";
import { useState, useMemo } from "react";
import { Mood } from "@/generated/prisma/client";
import Link from "next/link";

export default function MemoriesPage() {
  const { data: checkIns = [], isLoading } = useCheckInsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<Mood | "All">("All");

  const moods: (Mood | "All")[] = ["All", "Great", "Good", "Okay", "Bad", "Awful"];

  const filteredCheckIns = useMemo(() => {
    let filtered = checkIns.filter(
      (checkIn) => checkIn.lessonsLearned || (checkIn.learnings && checkIn.learnings.length > 0)
    );

    if (selectedMood !== "All") {
      filtered = filtered.filter((checkIn) => checkIn.overallMood === selectedMood);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((checkIn) => {
        const lessonsMatch = checkIn.lessonsLearned?.toLowerCase().includes(query);
        const learningsMatch = checkIn.learnings?.some((l) => l.content.toLowerCase().includes(query));
        return lessonsMatch || learningsMatch;
      });
    }

    return filtered;
  }, [checkIns, selectedMood, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Memories & Learnings</h1>
                  <p className="text-slate-600 mt-1">Your journey of growth and reflection</p>
                </div>
              </div>
            </div>

            <div className="bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-3xl font-bold text-slate-900">{filteredCheckIns.length}</p>
              <p className="text-sm text-slate-500">Total memories</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memories and learnings..."
              className="pl-12 h-12 text-base border-slate-200 focus-visible:ring-slate-900 bg-slate-50"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700 mr-2">Filter:</span>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <Button
                  key={mood}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedMood(mood)}
                  className={`transition-all ${
                    selectedMood === mood
                      ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800 hover:text-white"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {mood}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Memories Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center space-y-4">
              <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin mx-auto"></div>
              <p className="text-slate-600 font-medium">Loading your memories...</p>
            </div>
          </div>
        ) : filteredCheckIns.length === 0 ? (
          <div className="bg-white rounded-xl p-16 border border-slate-200 text-center space-y-6">
            <div className="h-20 w-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
              <Brain className="h-10 w-10 text-slate-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">No memories found</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                {searchQuery || selectedMood !== "All"
                  ? "Try adjusting your filters or search query to find what you're looking for."
                  : "Start your journey by completing daily check-ins and recording your learnings."}
              </p>
            </div>
            <Link href="/">
              <Button className="mt-6 gap-2 bg-slate-900 hover:bg-slate-800 h-11 px-6">
                <Sparkles className="h-4 w-4" />
                Start a Check-In
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCheckIns.map((checkIn) => (
              <MemoryCard key={checkIn.id} checkIn={checkIn} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
